import { isPlainObject } from "lodash";
import { DefaultCachemap } from "../";
import { Metadata, ReaperOptions } from "../../types";

export default class Reaper {
  private _cachemap: DefaultCachemap;
  private _interval: number;
  private _intervalID: NodeJS.Timer;

  constructor(cachemap: DefaultCachemap, opts: ReaperOptions = {}) {
    if (!isPlainObject(opts)) {
      throw new TypeError("Constructor expected opts to be a plain object.");
    }

    const { interval = 60000, start = true } = opts;
    this._cachemap = cachemap;
    this._interval = interval;
    if (start) this.start();
  }

  public async cull(metadata: Metadata[]): Promise<void> {
    if (!metadata.length) return;

    try {
      await Promise.all(metadata.map(({ key }) => this._cachemap.delete(key)));
    } catch (error) {
      // no catch
    }
  }

  public start(): void {
    this._intervalID = setInterval(() => {
      this.cull(this._getExpiredMetadata());
    }, this._interval);
  }

  public stop(): void {
    clearInterval(this._intervalID);
  }

  private _getExpiredMetadata(): Metadata[] {
    return this._cachemap.metadata.filter((metadata) => {
      return !metadata.cacheability.checkTTL();
    });
  }
}
