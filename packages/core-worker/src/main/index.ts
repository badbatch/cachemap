import {
  CACHEMAP,
  CLEAR,
  DELETE,
  ENTRIES,
  EXPORT,
  GET,
  HAS,
  IMPORT,
  MESSAGE,
  SET,
  SIZE,
  START,
  STOP,
} from "@cachemap/constants";
import controller, { EventData } from "@cachemap/controller";
import { CacheHeaders, ExportOptions, ExportResult, ImportOptions, Metadata, rehydrateMetadata } from "@cachemap/core";
import Cacheability from "cacheability";
import { isPlainObject, isString } from "lodash";
import { v1 as uuid } from "uuid";
import {
  ConstructorOptions,
  FilterPropsResult,
  PendingResolver,
  PendingTracker,
  PostMessageResult,
  PostMessageResultWithoutMeta,
  PostMessageWithoutMeta,
} from "../types";

export default class CoreWorker {
  private _metadata: Metadata[] = [];
  private _name: string;
  private _pending: PendingTracker = new Map();
  private _storeType: string | undefined;
  private _type: string;
  private _usedHeapSize: number = 0;
  private _worker: Worker;

  constructor(options: ConstructorOptions) {
    const errors: TypeError[] = [];

    if (!isPlainObject(options)) {
      errors.push(new TypeError("@cachemap/core-worker expected options to ba a plain object."));
    }

    if (!isString(options.name)) {
      errors.push(new TypeError("@cachemap/core-worker expected options.name to be a string."));
    }

    if (!isString(options.type)) {
      errors.push(new TypeError("@cachemap/core-worker expected options.type to be a string."));
    }

    if (!(options.worker instanceof Worker)) {
      errors.push(new TypeError("@cachemap/core-worker expected options.worker to be an instance of a Worker."));
    }

    if (errors.length) throw errors;

    this._name = options.name;
    this._type = options.type;
    this._worker = options.worker;
    this._addControllerEventListeners();
    this._addEventListener();
  }

  get metadata(): Metadata[] {
    return this._metadata;
  }

  get name(): string {
    return this._name;
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

  public async clear(): Promise<void> {
    try {
      const response = await this._postMessage({ method: CLEAR });
      this._setProps(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async delete(key: string, options: { hash?: boolean } = {}): Promise<boolean> {
    try {
      const { result, ...rest } = await this._postMessage({ key, method: DELETE, options });
      this._setProps(rest);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async entries(keys?: string[]): Promise<[string, any][]> {
    try {
      const { result, ...rest } = await this._postMessage({ keys, method: ENTRIES });
      this._setProps(rest);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async export(options: ExportOptions = {}): Promise<ExportResult> {
    try {
      const { result, ...rest } = await this._postMessage({ method: EXPORT, options });
      this._setProps(rest);
      return { entries: result.entries, metadata: rehydrateMetadata(result.metadata) };
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async get(key: string, options: { hash?: boolean } = {}): Promise<any> {
    try {
      const { result, ...rest } = await this._postMessage({ key, method: GET, options });
      this._setProps(rest);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async has(
    key: string,
    options: { deleteExpired?: boolean; hash?: boolean } = {},
  ): Promise<false | Cacheability> {
    try {
      const { result, ...rest } = await this._postMessage({ key, method: HAS, options });
      this._setProps(rest);
      if (!result) return false;
      return new Cacheability({ metadata: result.metadata });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async import(options: ImportOptions): Promise<void> {
    try {
      const { result, ...rest } = await this._postMessage({ method: IMPORT, options });
      this._setProps(rest);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async set(
    key: string,
    value: any,
    options: { cacheHeaders?: CacheHeaders; hash?: boolean; tag?: any } = {},
  ): Promise<any> {
    try {
      const response = await this._postMessage({ key, method: SET, options, value });
      this._setProps(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async size(): Promise<number> {
    try {
      const { result, ...rest } = await this._postMessage({ method: SIZE });
      this._setProps(rest);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private _addControllerEventListeners() {
    controller.on(CLEAR, this._handleClearEvent);
    controller.on(START, this._handleStartEvent);
    controller.on(STOP, this._handleStopEvent);
  }

  private _addEventListener(): void {
    this._worker.addEventListener(MESSAGE, this._onMessage);
  }

  private _handleClearEvent({ name, type }: EventData): void {
    if ((isString(name) && name === this._name) || (isString(type) && type === this._type)) {
      this._postMessage({ method: CLEAR });
    }
  }

  private _handleStartEvent({ name, type }: EventData): void {
    if ((isString(name) && name === this._name) || (isString(type) && type === this._type)) {
      this._postMessage({ method: START });
    }
  }

  private _handleStopEvent({ name, type }: EventData): void {
    if ((isString(name) && name === this._name) || (isString(type) && type === this._type)) {
      this._postMessage({ method: STOP });
    }
  }

  private _onMessage = async ({ data }: MessageEvent): Promise<void> => {
    if (!isPlainObject(data)) return;

    const { messageID, result, type, ...rest } = data as PostMessageResult;
    if (type !== CACHEMAP) return;

    const pending = this._pending.get(messageID);
    if (!pending) return;

    pending.resolve({ result, ...rest });
  };

  private async _postMessage(message: PostMessageWithoutMeta): Promise<PostMessageResultWithoutMeta> {
    const messageID = uuid();

    try {
      return new Promise((resolve: PendingResolver) => {
        this._worker.postMessage({
          ...message,
          messageID,
          type: CACHEMAP,
        });

        this._pending.set(messageID, { resolve });
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private _setProps({ metadata, storeType, usedHeapSize }: FilterPropsResult): void {
    this._metadata = rehydrateMetadata(metadata);
    if (!this._storeType) this._storeType = storeType;
    this._usedHeapSize = usedHeapSize;
  }
}
