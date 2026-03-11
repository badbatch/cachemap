import { type Controller, type EventData } from '@cachemap/controller';
import {
  type EntriesOptions,
  type ExportOptions,
  type ExportResult,
  type ImportOptions,
  type Metadata,
  type MethodOptions,
  type SetOptions,
  type WriteOptions,
} from '@cachemap/types';
import { ArgsError, GroupedError, constants, rehydrateMetadata } from '@cachemap/utils';
import { EventEmitter } from 'eventemitter3';
import { isFunction, isPlainObject, isString } from 'lodash-es';
import { Md5 } from 'ts-md5';
import { v4 as uuidv4 } from 'uuid';
import {
  type AnyPostMessageResponse,
  type CoreWorkerOptions,
  type EnrichedPostMessage,
  type MetadataAndUsedHeapSize,
  type PendingResolver,
  type PendingTracker,
  type PostMessageMethod,
  type PostMessageRequest,
  type PostMessageResponse,
} from './types.ts';

export class CoreWorker {
  public readonly ready: Promise<void>;

  private _onMessage = ({ data }: MessageEvent<unknown>): void => {
    if (!this._isCachemapPostMessageResponse(data)) {
      return;
    }

    this._updateMetadata(data);

    if (data.method === 'entryDeleted' && data.result.deleted) {
      this.emitter.emit(constants.ENTRY_DELETED, {
        deleted: data.result.deleted,
        key: data.result.key,
        tags: data.result.tags,
      });
    }

    const pending = this._pending.get(data.messageId);

    if (!pending) {
      return;
    }

    pending.resolve(data);
  };

  private _handleClearEvent = (eventData: EventData): void => {
    if (this._isControllerEventValid(eventData)) {
      void this._postMessage({ cmd: constants.CLEAR, method: constants.CONTROLLER });
    }
  };

  private _handleStartBackupEvent = (eventData: EventData): void => {
    if (this._isControllerEventValid(eventData)) {
      void this._postMessage({ cmd: constants.START_BACKUP, method: constants.CONTROLLER });
    }
  };

  private _handleStartReaperEvent = (eventData: EventData): void => {
    if (this._isControllerEventValid(eventData)) {
      void this._postMessage({ cmd: constants.START_REAPER, method: constants.CONTROLLER });
    }
  };

  private _handleStopBackupEvent = (eventData: EventData): void => {
    if (this._isControllerEventValid(eventData)) {
      void this._postMessage({ cmd: constants.STOP_BACKUP, method: constants.CONTROLLER });
    }
  };

  private _handleStopReaperEvent = (eventData: EventData): void => {
    if (this._isControllerEventValid(eventData)) {
      void this._postMessage({ cmd: constants.STOP_REAPER, method: constants.CONTROLLER });
    }
  };

  private _backupStoreType: string | undefined;
  private _controller?: Controller;
  private _emitter: EventEmitter = new EventEmitter();
  private _makeReady?: () => void;
  private _messageQueue: EnrichedPostMessage[] = [];
  private _metadata: Metadata[] = [];
  private readonly _name: string;
  private _pending: PendingTracker = new Map();
  private readonly _type?: string;
  private _usedHeapSize = 0;
  private _worker: Worker | undefined;

  constructor(options: CoreWorkerOptions) {
    const errors: ArgsError[] = [];

    if (!isPlainObject(options)) {
      errors.push(new ArgsError('@cachemap/core-worker expected options to ba a plain object.'));
    }

    if (!isString(options.name)) {
      errors.push(new ArgsError('@cachemap/core-worker expected options.name to be a string.'));
    }

    if (!options.lazyWorkerInit && !('worker' in options)) {
      errors.push(new ArgsError('@cachemap/core-worker expected options.worker to be an instance of a Worker.'));
    }

    if (errors.length > 0) {
      throw new GroupedError('@cachemap/core-worker constructor argument validation errors.', errors);
    }

    const { controller, name, onError, type, worker } = options;
    this._controller = controller;
    this._name = name;
    this._type = type;

    if (isFunction(worker)) {
      this.ready = Promise.resolve(worker())
        .then(w => {
          this._initWorker(w);
        })
        .catch((error: unknown) => {
          onError?.(error);
        });
    } else if (worker) {
      this._initWorker(worker);
      this.ready = Promise.resolve();
    } else {
      this.ready = new Promise<void>(resolve => {
        this._makeReady = (): void => {
          resolve();
        };
      });
    }
  }

  get backupStoreType(): string | undefined {
    return this._backupStoreType;
  }

  public async clear(): Promise<void> {
    await this._postMessage({ method: constants.CLEAR });
  }

  public async delete(key: string, options: WriteOptions = {}): Promise<boolean> {
    const { result } = await this._postMessage<'delete'>({ key, method: constants.DELETE, options });
    return result;
  }

  get emitter(): EventEmitter {
    return this._emitter;
  }

  public async entries<T>(keys?: string[], options: EntriesOptions = {}): Promise<[string, T][]> {
    const { result } = await this._postMessage<'entries', T>({ keys, method: constants.ENTRIES, options });
    return result;
  }

  public async exists(key: string, options: { deleteExpired?: boolean; hashKey?: boolean } = {}): Promise<boolean> {
    const { result } = await this._postMessage<'exists'>({
      key,
      method: constants.EXISTS,
      options,
    });

    return result;
  }

  public async export<T>(options: ExportOptions = {}): Promise<ExportResult<T>> {
    const { result } = await this._postMessage<'export', T>({ method: constants.EXPORT, options });
    return { entries: result.entries, metadata: rehydrateMetadata(result.metadata) };
  }

  public async fetch<T>(key: string, options: MethodOptions = {}): Promise<T | undefined> {
    const { result } = await this._postMessage<'fetch', T>({ key, method: constants.FETCH, options });
    return result;
  }

  public async fetchEntries<T>(keys?: string[], options: EntriesOptions = {}): Promise<[string, T][]> {
    const { result } = await this._postMessage<'fetchEntries', T>({ keys, method: constants.FETCH_ENTRIES, options });
    return result;
  }

  public async flush(): Promise<void> {
    await this._postMessage({ method: constants.FLUSH });
  }

  public async get<T>(key: string, options: MethodOptions = {}): Promise<T | undefined> {
    const { result } = await this._postMessage<'get', T>({ key, method: constants.GET, options });
    return result;
  }

  public getMetadataEntry(rawkey: string, options: { hashKey?: boolean } = {}): Metadata | undefined {
    const key = this._resolveKey(rawkey, options);
    return this._getMetadataEntry(key);
  }

  public async has(key: string, options: MethodOptions = {}): Promise<boolean> {
    const { result } = await this._postMessage<'has'>({
      key,
      method: constants.HAS,
      options,
    });

    return result;
  }

  public async import(options: ImportOptions): Promise<void> {
    await this._postMessage({ method: constants.IMPORT, options });
  }

  get metadata(): Metadata[] {
    return this._metadata;
  }

  get name(): string {
    return this._name;
  }

  public async remove(key: string, options: WriteOptions = {}): Promise<boolean> {
    const { result } = await this._postMessage<'remove'>({
      key,
      method: constants.REMOVE,
      options,
    });

    return result;
  }

  public async set(key: string, value: unknown, options: SetOptions = {}): Promise<void> {
    await this._postMessage<'set'>({ key, method: constants.SET, options, value });
  }

  public async size(): Promise<number> {
    const { result } = await this._postMessage<'size'>({ method: constants.SIZE });
    return result;
  }

  get type(): string | undefined {
    return this._type;
  }

  get usedHeapSize(): number {
    return this._usedHeapSize;
  }

  set worker(worker: Worker) {
    if (this._worker) {
      throw new Error('A worker already exists.');
    }

    this._initWorker(worker);
    this._makeReady?.();
  }

  public async write(key: string, value: unknown, options: SetOptions = {}): Promise<void> {
    await this._postMessage<'write'>({ key, method: constants.WRITE, options, value });
  }

  private _addControllerEventListeners(): void {
    if (!this._controller) {
      return;
    }

    this._controller.on(constants.CLEAR, this._handleClearEvent);
    this._controller.on(constants.START_REAPER, this._handleStartReaperEvent);
    this._controller.on(constants.STOP_REAPER, this._handleStopReaperEvent);
    this._controller.on(constants.START_BACKUP, this._handleStartBackupEvent);
    this._controller.on(constants.STOP_BACKUP, this._handleStopBackupEvent);
  }

  private _addWorkerEventListener(): void {
    if (!this._worker) {
      throw new Error('A worker is required for the CoreWorker to work correctly.');
    }

    this._worker.addEventListener(constants.MESSAGE, this._onMessage);
  }

  private _getMetadataEntry(key: string): Metadata | undefined {
    return this._metadata.find(metadata => metadata.key === key);
  }

  private _initWorker(worker: Worker): void {
    this._worker = worker;
    this._addControllerEventListeners();
    this._addWorkerEventListener();
    this._releaseMessageQueue();
  }

  private _isCachemapPostMessageResponse(data: unknown): data is AnyPostMessageResponse {
    return typeof data === 'object' && !!data && 'type' in data && 'method' in data && data.type === constants.CACHEMAP;
  }

  private _isControllerEventValid({ name, type }: EventData): boolean {
    return (isString(name) && name === this._name) || (isString(type) && type === this._type);
  }

  private async _postMessage<M extends PostMessageMethod, T = unknown>(
    message: PostMessageRequest,
  ): Promise<PostMessageResponse<M, T>> {
    const messageId = uuidv4();

    return new Promise((resolve: PendingResolver<M, T>) => {
      if (this._worker) {
        this._worker.postMessage({
          ...message,
          messageId,
          type: constants.CACHEMAP,
        });
      } else {
        this._messageQueue.push({
          ...message,
          messageId,
          type: constants.CACHEMAP,
        });
      }

      // @ts-expect-error Struggling to get types to marry up
      this._pending.set(messageId, { resolve });
    });
  }

  private _releaseMessageQueue(): void {
    if (!this._worker) {
      throw new Error('A worker is required for the CoreWorker to function correctly.');
    }

    const messageQueue = [...this._messageQueue];
    this._messageQueue = [];

    for (const message of messageQueue) {
      this._worker.postMessage(message);
    }
  }

  private _resolveKey(key: string, options: MethodOptions): string {
    return options.hashKey ? Md5.hashStr(key) : key;
  }

  private _updateMetadata({ backupStoreType, metadata, usedHeapSize }: MetadataAndUsedHeapSize): void {
    this._metadata = rehydrateMetadata(metadata);
    this._backupStoreType ??= backupStoreType;
    this._usedHeapSize = usedHeapSize;
  }
}
