import Cacheability from "cacheability";
import PromiseWorker from "promise-worker";

import {
  CacheHeaders,
  ConstructorArgs,
  Metadata,
  PostMessageArgs,
  PostMessageResult,
} from "../types";

export class WorkerCachemap {
  public static async create(args: ConstructorArgs): Promise<WorkerCachemap> {
    try {
      const webpackWorker = require("worker-loader?inline=true&fallback=false!../worker"); // tslint:disable-line
      const workerCachemap = new WorkerCachemap();
      workerCachemap._worker = new webpackWorker();
      workerCachemap._promiseWorker = new PromiseWorker(workerCachemap._worker);
      const { metadata, usedHeapSize } = await workerCachemap._postMessage({ args, type: "create" });
      workerCachemap._setMetadata(metadata, usedHeapSize);
      return workerCachemap;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private _metadata: Metadata[] = [];
  private _promiseWorker: PromiseWorker;
  private _worker: Worker;
  private _usedHeapSize: number = 0;

  get metadata(): Metadata[] {
    return this._metadata;
  }

  get usedHeapSize(): number {
    return this._usedHeapSize;
  }

  public async clear(): Promise<void> {
    try {
      const { metadata, usedHeapSize } = await this._postMessage({ type: "clear" });
      this._setMetadata(metadata, usedHeapSize);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async delete(key: string, opts: { hash?: boolean, stub?: boolean } = {}): Promise<boolean> {
    try {
      const { metadata, result, usedHeapSize } = await this._postMessage({ key, opts, type: "delete" });
      this._setMetadata(metadata, usedHeapSize);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async get(key: string, opts: { hash?: boolean, stub?: boolean } = {}): Promise<any> {
    try {
      const { metadata, result, usedHeapSize } = await this._postMessage({ key, opts, type: "get" });
      this._setMetadata(metadata, usedHeapSize);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async has(
    key: string,
    opts: { deleteExpired?: boolean, hash?: boolean, stub?: boolean } = {},
  ): Promise<Cacheability | false> {
    try {
      const { metadata, result, usedHeapSize } = await this._postMessage({ key, opts, type: "has" });
      this._setMetadata(metadata, usedHeapSize);
      if (!result) return false;
      const cacheability = new Cacheability();
      cacheability.metadata = result.metadata;
      return cacheability;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async set(
    key: string,
    value: any,
    opts: { cacheHeaders?: CacheHeaders, hash?: boolean, stub?: boolean } = {},
  ): Promise<void> {
    try {
      const { metadata, usedHeapSize } = await this._postMessage({ key, opts, type: "set", value });
      this._setMetadata(metadata, usedHeapSize);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async size(): Promise<number> {
    try {
      const { result } = await this._postMessage({ type: "size" });
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public terminate(): void {
    this._worker.terminate();
  }

  private async _postMessage(args: PostMessageArgs): Promise<PostMessageResult> {
    try {
      return this._promiseWorker.postMessage(args);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private _setMetadata(workerMetadata: Metadata[], usedHeapSize: number): void {
    const metadata: Metadata[] = [];

    workerMetadata.forEach(({ cacheability: cacheabilityObject, ...props }) => {
      const cacheability = new Cacheability();
      cacheability.metadata = cacheabilityObject.metadata;
      const metadataEntry: Metadata = { ...props, cacheability };
      metadata.push(metadataEntry);
    });

    this._metadata = metadata;
    this._usedHeapSize = usedHeapSize;
  }
}
