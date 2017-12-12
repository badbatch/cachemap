import Cachemap from "../";
import { Metadata, ReaperOptions } from "../types";

export default class Reaper {
  private _cachemap: Cachemap;
  private _interval: number;
  private _intervalID: NodeJS.Timer;

  constructor(cachemap: Cachemap, opts: ReaperOptions = {}) {
    const { interval = 60000, start = true } = opts;
    this._cachemap = cachemap;
    this._interval = interval;
    if (start) this.start();
  }

  public async cull(metadata: Metadata[]): Promise<void> {
    if (!metadata.length) return;

    metadata.forEach(({ key }) => {
      this._cachemap.delete(key);
    });
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
