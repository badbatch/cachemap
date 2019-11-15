import { CacheHeaders, ExportOptions, ExportResult, ImportOptions, Metadata, rehydrateMetadata } from "@cachemap/core";
import Cacheability from "cacheability";
import { isPlainObject } from "lodash";
import uuid from "uuid/v1";
import { CACHEMAP, CLEAR, DELETE, ENTRIES, EXPORT, GET, HAS, IMPORT, MESSAGE, SET, SIZE } from "../constants";
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
  private _pending: PendingTracker = new Map();
  private _storeType: string | undefined;
  private _usedHeapSize: number = 0;
  private _worker: Worker;

  constructor(options: ConstructorOptions) {
    const errors: TypeError[] = [];

    if (!isPlainObject(options)) {
      errors.push(new TypeError("@cachemap/core-worker expected options to ba a plain object."));
    }

    if (!(options.worker instanceof Worker)) {
      errors.push(new TypeError("@cachemap/core-worker expected options.worker to be an instance of a Worker."));
    }

    if (errors.length) throw errors;

    this._worker = options.worker;
    this._addEventListener();
  }

  get metadata(): Metadata[] {
    return this._metadata;
  }

  get storeType(): string | undefined {
    return this._storeType;
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

  public async entries(keys?: string[]): Promise<Array<[string, any]>> {
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

  private _addEventListener(): void {
    this._worker.addEventListener(MESSAGE, this._onMessage);
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
