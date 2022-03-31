import { Metadata } from "@cachemap/types";
import { isPlainObject } from "lodash";
import { Callbacks, ConstructorOptions, DeleteCallback, Init, MetadataCallback, Options } from "../types";

export class Reaper {
  private _deleteCallback: DeleteCallback;
  private _interval: number;
  private _intervalID?: NodeJS.Timer;
  private _metadataCallback: MetadataCallback;

  constructor(options: ConstructorOptions) {
    const { deleteCallback, interval = 60000, metadataCallback, start = false } = options;

    this._deleteCallback = deleteCallback;
    this._interval = interval;
    this._metadataCallback = metadataCallback;

    if (start) {
      this._start();
    }
  }

  public async cull(metadata: Metadata[]): Promise<void> {
    await this._cull(metadata);
  }

  public start(): void {
    this._start();
  }

  public stop(): void {
    this._stop();
  }

  private async _cull(metadata: Metadata[]): Promise<void> {
    if (!metadata.length) {
      return;
    }

    try {
      await Promise.all(metadata.map(({ key }) => this._deleteCallback(key)));
    } catch (error) {
      // no catch
    }
  }

  private _getExpiredMetadata(): Metadata[] {
    const metadata = this._metadataCallback();
    return metadata.filter(({ cacheability }) => !cacheability.checkTTL());
  }

  private _start(): void {
    this._intervalID = setInterval(() => {
      this._cull(this._getExpiredMetadata());
    }, this._interval);
  }

  private _stop(): void {
    if (this._intervalID) {
      clearInterval(this._intervalID);
    }
  }
}

export default function init(options: Options = {}): Init {
  if (!isPlainObject(options)) {
    throw new TypeError("@cachemap/reaper expected options to be a plain object.");
  }

  return (callbacks: Callbacks) => new Reaper({ ...options, ...callbacks });
}
