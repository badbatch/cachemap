import { coreDefs, rehydrateMetadata } from "@cachemap/core";
import Cacheability from "cacheability";
import { isPlainObject, isString } from "lodash";
import PromiseWorker from "promise-worker";
import { CLEAR, CREATE, DELETE, ENTRIES, EXPORT, GET, HAS, IMPORT, SET, SIZE } from "../constants";
import { ConstructorOptions, InitOptions, PostMessage, PostMessageResult } from "../defs";

export default class CoreWorker {
  public static async init(options: InitOptions): Promise<CoreWorker> {
    const errors: TypeError[] = [];

    if (!isPlainObject(options)) {
      errors.push(new TypeError("@cachemap/core expected options to ba a plain object."));
    }

    if (!isString(options.name)) {
      errors.push(new TypeError("@cachemap/core expected options.name to be a string."));
    }

    if (errors.length) return Promise.reject(errors);

    try {
      const { workerFilename, ...otherOptions } = options;
      const filename = workerFilename || "cachemap.worker";
      const worker = new Worker(`${filename}.js`);
      const promiseWorker = new PromiseWorker(worker);
      const instance = new CoreWorker({ promiseWorker, worker });
      const { metadata, usedHeapSize } = await instance._postMessage({ options: otherOptions, type: CREATE });
      instance._setProps({ metadata, usedHeapSize });
      return instance;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private _metadata: coreDefs.Metadata[] = [];
  private _promiseWorker: PromiseWorker;
  private _usedHeapSize: number = 0;
  private _worker: Worker;

  constructor(options: ConstructorOptions) {
    this._promiseWorker = options.promiseWorker;
    this._worker = options.worker;
  }

  get metadata(): coreDefs.Metadata[] {
    return this._metadata;
  }

  get usedHeapSize(): number {
    return this._usedHeapSize;
  }

  public async clear(): Promise<void> {
    try {
      const { metadata, usedHeapSize } = await this._postMessage({ type: CLEAR });
      this._setProps({ metadata, usedHeapSize });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async delete(key: string, options: { hash?: boolean } = {}): Promise<boolean> {
    try {
      const { metadata, result, usedHeapSize } = await this._postMessage({ key, options, type: DELETE });
      this._setProps({ metadata, usedHeapSize });
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async entries(keys?: string[]): Promise<Array<[string, any]>> {
    try {
      const { metadata, result, usedHeapSize } = await this._postMessage({ keys, type: ENTRIES });
      this._setProps({ metadata, usedHeapSize });
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async export(options: coreDefs.ExportOptions = {}): Promise<coreDefs.ExportResult> {
    try {
      const { metadata, result, usedHeapSize } = await this._postMessage({ options, type: EXPORT });
      this._setProps({ metadata, usedHeapSize });
      return { entries: result.entries, metadata: rehydrateMetadata(result.metadata) };
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async get(key: string, options: { hash?: boolean } = {}): Promise<any> {
    try {
      const { metadata, result, usedHeapSize } = await this._postMessage({ key, options, type: GET });
      this._setProps({ metadata, usedHeapSize });
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async has(
    key: string,
    options: { deleteExpired?: boolean, hash?: boolean } = {},
  ): Promise<false | Cacheability> {
    try {
      const { metadata, result, usedHeapSize } = await this._postMessage({ key, options, type: HAS });
      this._setProps({ metadata, usedHeapSize });
      if (!result) return false;
      return new Cacheability({ metadata: result.metadata });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async import(options: coreDefs.ImportOptions): Promise<void> {
    try {
      const { metadata, usedHeapSize } = await this._postMessage({ options, type: IMPORT });
      this._setProps({ metadata, usedHeapSize });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async set(
    key: string,
    value: any,
    options: { cacheHeaders?: coreDefs.CacheHeaders, hash?: boolean, tag?: any } = {},
  ): Promise<any> {
    try {
      const { metadata, usedHeapSize } = await this._postMessage({ key, options, type: SET, value });
      this._setProps({ metadata, usedHeapSize });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async size(): Promise<number> {
    try {
      const { metadata, result, usedHeapSize } = await this._postMessage({ type: SIZE });
      this._setProps({ metadata, usedHeapSize });
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public terminate(): void {
    this._worker.terminate();
  }

  private async _postMessage(message: PostMessage): Promise<PostMessageResult> {
    try {
      return this._promiseWorker.postMessage(message);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private _setProps({ metadata, usedHeapSize }: { metadata: coreDefs.Metadata[], usedHeapSize: number }): void {
    this._metadata = rehydrateMetadata(metadata);
    this._usedHeapSize = usedHeapSize;
  }
}
