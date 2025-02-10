import { type EventData, instance } from '@cachemap/controller';
import { type CacheHeaders, type ExportOptions, type ExportResult, type ImportOptions } from '@cachemap/core';
import { type Metadata, type Tag } from '@cachemap/types';
import { ArgsError, GroupedError, constants, rehydrateMetadata } from '@cachemap/utils';
import { Cacheability } from 'cacheability';
import { EventEmitter } from 'eventemitter3';
import { isPlainObject, isString } from 'lodash-es';
import { v4 as uuidv4 } from 'uuid';
import {
  type ConstructorOptions,
  type FilterPropsResult,
  type PendingResolver,
  type PendingTracker,
  type PostMessage,
  type PostMessageResult,
  type PostMessageResultWithMeta,
  type PostMessageWithoutMeta,
} from '../types.ts';

export class CoreWorker {
  public events = {
    ENTRY_DELETED: 'ENTRY_DELETED',
  };

  private _onMessage = ({ data }: MessageEvent<PostMessageResult<never>>): void => {
    if (!isPlainObject(data)) {
      return;
    }

    const { messageID, method, result, type, ...rest } = data;

    if (type !== constants.CACHEMAP) {
      return;
    }

    if (method === this.events.ENTRY_DELETED) {
      this.emitter.emit(this.events.ENTRY_DELETED, rest);
      return;
    }

    const pending = this._pending.get(messageID);

    if (!pending) {
      return;
    }

    pending.resolve({ result, ...rest });
  };

  private _handleClearEvent = ({ name, type }: EventData): void => {
    if ((isString(name) && name === this._name) || (isString(type) && type === this._type)) {
      void this._postMessage({ method: constants.CLEAR });
    }
  };

  private _handleStartBackupEvent = ({ name, type }: EventData): void => {
    if ((isString(name) && name === this._name) || (isString(type) && type === this._type)) {
      void this._postMessage({ method: constants.START_BACKUP });
    }
  };

  private _handleStartReaperEvent = ({ name, type }: EventData): void => {
    if ((isString(name) && name === this._name) || (isString(type) && type === this._type)) {
      void this._postMessage({ method: constants.START_REAPER });
    }
  };

  private _handleStopBackupEvent = ({ name, type }: EventData): void => {
    if ((isString(name) && name === this._name) || (isString(type) && type === this._type)) {
      void this._postMessage({ method: constants.STOP_BACKUP });
    }
  };

  private _handleStopReaperEvent = ({ name, type }: EventData): void => {
    if ((isString(name) && name === this._name) || (isString(type) && type === this._type)) {
      void this._postMessage({ method: constants.STOP_REAPER });
    }
  };

  private _emitter: EventEmitter = new EventEmitter();
  private _messageQueue: PostMessage[] = [];
  private _metadata: Metadata[] = [];
  private readonly _name: string;
  private _pending: PendingTracker = new Map();
  private _storeType: string | undefined;
  private readonly _type: string;
  private _usedHeapSize = 0;
  private _worker: Worker | undefined;

  constructor(options: ConstructorOptions) {
    const errors: ArgsError[] = [];

    if (!isPlainObject(options)) {
      errors.push(new ArgsError('@cachemap/core-worker expected options to ba a plain object.'));
    }

    if (!isString(options.name)) {
      errors.push(new ArgsError('@cachemap/core-worker expected options.name to be a string.'));
    }

    if (!isString(options.type)) {
      errors.push(new ArgsError('@cachemap/core-worker expected options.type to be a string.'));
    }

    if (!options.lazyWorkerInit && !('worker' in options)) {
      errors.push(new ArgsError('@cachemap/core-worker expected options.worker to be an instance of a Worker.'));
    }

    if (errors.length > 0) {
      throw new GroupedError('@cachemap/core-worker constructor argument validation errors.', errors);
    }

    this._name = options.name;
    this._type = options.type;

    if (typeof options.worker === 'function') {
      Promise.resolve(options.worker())
        .then(worker => {
          this._worker = worker;
          this._addControllerEventListeners();
          this._addEventListener();
          this._releaseMessageQueue();
        })
        .catch((error: unknown) => {
          throw error;
        });
    } else if (options.worker) {
      this._worker = options.worker;
      this._addControllerEventListeners();
      this._addEventListener();
    }
  }

  public async clear(): Promise<void> {
    const response = await this._postMessage<undefined>({ method: constants.CLEAR });
    this._setProps(response);
  }

  public async delete(key: string, options: { hashKey?: boolean } = {}): Promise<boolean> {
    const { result, ...rest } = await this._postMessage<boolean>({ key, method: constants.DELETE, options });
    this._setProps(rest);
    return result;
  }

  get emitter(): EventEmitter {
    return this._emitter;
  }

  public async entries<T>(keys?: string[]): Promise<[string, T][]> {
    const { result, ...rest } = await this._postMessage<[string, T][]>({ keys, method: constants.ENTRIES });
    this._setProps(rest);
    return result;
  }

  public async export<T>(options: ExportOptions = {}): Promise<ExportResult<T>> {
    const { result, ...rest } = await this._postMessage<ExportResult<T>>({ method: constants.EXPORT, options });
    this._setProps(rest);
    return { entries: result.entries, metadata: rehydrateMetadata(result.metadata) };
  }

  public async get<T>(key: string, options: { hashKey?: boolean } = {}): Promise<T | undefined> {
    const { result, ...rest } = await this._postMessage<T | undefined>({ key, method: constants.GET, options });
    this._setProps(rest);
    return result;
  }

  public async has(
    key: string,
    options: { deleteExpired?: boolean; hashKey?: boolean } = {},
  ): Promise<false | Cacheability> {
    const { result, ...rest } = await this._postMessage<false | Cacheability>({
      key,
      method: constants.HAS,
      options,
    });

    this._setProps(rest);
    return result ? new Cacheability({ metadata: result.metadata }) : false;
  }

  public async import(options: ImportOptions): Promise<void> {
    // Only care about everything other than result here.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { result, ...rest } = await this._postMessage({ method: constants.IMPORT, options });
    this._setProps(rest);
  }

  get metadata(): Metadata[] {
    return this._metadata;
  }

  get name(): string {
    return this._name;
  }

  public async set(
    key: string,
    value: unknown,
    options: { cacheHeaders?: CacheHeaders; hashKey?: boolean; tag?: Tag } = {},
  ): Promise<void> {
    const response = await this._postMessage({ key, method: constants.SET, options, value });
    this._setProps(response);
  }

  public async size(): Promise<number> {
    const { result, ...rest } = await this._postMessage<number>({ method: constants.SIZE });
    this._setProps(rest);
    return result;
  }

  get storeType(): string | undefined {
    return this._storeType;
  }

  get type(): string {
    return this._type;
  }

  get usedHeapSize(): number {
    return this._usedHeapSize;
  }

  set worker(worker: Worker) {
    this._worker = worker;
    this._addControllerEventListeners();
    this._addEventListener();
    this._releaseMessageQueue();
  }

  private _addControllerEventListeners() {
    instance.on(constants.CLEAR, this._handleClearEvent);
    instance.on(constants.START_REAPER, this._handleStartReaperEvent);
    instance.on(constants.STOP_REAPER, this._handleStopReaperEvent);
    instance.on(constants.START_BACKUP, this._handleStartBackupEvent);
    instance.on(constants.STOP_BACKUP, this._handleStopBackupEvent);
  }

  private _addEventListener(): void {
    if (!this._worker) {
      throw new Error('A worker is required for the CoreWorker to work correctly.');
    }

    this._worker.addEventListener(constants.MESSAGE, this._onMessage);
  }

  private async _postMessage<T>(message: PostMessageWithoutMeta): Promise<PostMessageResultWithMeta<T>> {
    const messageID = uuidv4();

    return new Promise((resolve: PendingResolver<T>) => {
      if (this._worker) {
        this._worker.postMessage({
          ...message,
          messageID,
          type: constants.CACHEMAP,
        });
      } else {
        this._messageQueue.push({
          ...message,
          messageID,
          type: constants.CACHEMAP,
        });
      }

      this._pending.set(messageID, { resolve });
    });
  }

  private _releaseMessageQueue(): void {
    if (!this._worker) {
      throw new Error('A worker is required for the CoreWorker to work correctly.');
    }

    const messageQueue = this._messageQueue;
    this._messageQueue = [];

    for (const message of messageQueue) {
      this._worker.postMessage(message);
    }
  }

  private _setProps({ metadata, storeType, usedHeapSize }: FilterPropsResult): void {
    this._metadata = rehydrateMetadata(metadata);

    if (!this._storeType) {
      this._storeType = storeType;
    }

    this._usedHeapSize = usedHeapSize;
  }
}
