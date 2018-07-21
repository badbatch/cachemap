import { core, reaper } from "@cachemap/types";
import { isPlainObject } from "lodash";

export class Reaper {
  private _deleteCallback: reaper.DeleteCallback;
  private _interval: number;
  private _intervalID?: NodeJS.Timer;
  private _metadataCallback: reaper.MetadataCallback;

  constructor(options: reaper.ConstructorOptions) {
    const {
      deleteCallback,
      interval = 60000,
      metadataCallback,
      start = true,
    } = options;

    this._deleteCallback = deleteCallback;
    this._interval = interval;
    this._metadataCallback = metadataCallback;
    if (start) this._start();
  }

  public async cull(metadata: core.Metadata[]): Promise<void> {
    await this._cull(metadata);
  }

  public start(): void {
    this._start();
  }

  public stop(): void {
    this._stop();
  }

  private async _cull(metadata: core.Metadata[]): Promise<void> {
    if (!metadata.length) return;

    try {
      await Promise.all(metadata.map(({ key }) => this._deleteCallback(key)));
    } catch (error) {
      // no catch
    }
  }

  private _getExpiredMetadata(): core.Metadata[] {
    const metadata = this._metadataCallback();
    return metadata.filter(({ cacheability }) => !cacheability.checkTTL());
  }

  private _start(): void {
    this._intervalID = setInterval(() => {
      this._cull(this._getExpiredMetadata());
    }, this._interval);
  }

  private _stop(): void {
    if (this._intervalID) clearInterval(this._intervalID);
  }
}

export default function reaperWrapper(options: reaper.Options = {}): reaper.ReaperWrapper {
  if (!isPlainObject(options)) {
    throw new TypeError("reaperWrapper expected options to be a plain object.");
  }

  return (callbacks: reaper.Callbacks) => new Reaper({ ...options, ...callbacks });
}
