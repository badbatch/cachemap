import { type Metadata } from '@cachemap/types';
import { isPlainObject } from 'lodash-es';
import {
  type Callbacks,
  type ConstructorOptions,
  type DeleteCallback,
  type Init,
  type MetadataCallback,
  type Options,
} from '../types.ts';

export class Reaper {
  private readonly _deleteCallback: DeleteCallback;
  private readonly _interval: number;
  private _intervalID?: NodeJS.Timeout;
  private readonly _metadataCallback: MetadataCallback;

  constructor(options: ConstructorOptions) {
    const { deleteCallback, interval = 60_000, metadataCallback, start = false } = options;

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
    if (metadata.length === 0) {
      return;
    }

    try {
      await Promise.all(metadata.map(({ key, tags }) => this._deleteCallback(key, tags)));
    } catch {
      // no catch
    }
  }

  private _getExpiredMetadata(): Metadata[] {
    const metadata = this._metadataCallback();
    return metadata.filter(({ cacheability }) => !cacheability.checkTTL());
  }

  private _start(): void {
    this._intervalID = setInterval(() => {
      void this._cull(this._getExpiredMetadata());
    }, this._interval);
  }

  private _stop(): void {
    if (this._intervalID) {
      clearInterval(this._intervalID);
    }
  }
}

export const init = (options: Options = {}): Init => {
  if (!isPlainObject(options)) {
    throw new TypeError('@cachemap/reaper expected options to be a plain object.');
  }

  return (callbacks: Callbacks) => new Reaper({ ...options, ...callbacks });
};
