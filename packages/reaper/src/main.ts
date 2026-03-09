import { type Metadata } from '@cachemap/types';
import { isPlainObject } from 'lodash-es';
import {
  type ConstructorOptions,
  type MetadataCallback,
  type Options,
  type ReaperCallbacks,
  type ReaperDef,
  type ReaperInit,
  type RemoveEntryCallback,
} from './types.ts';

export class Reaper implements ReaperDef {
  private readonly _cullBatchSize: number;
  private _cullInProgress = false;
  private readonly _interval: number;
  private _intervalID?: NodeJS.Timeout;
  private readonly _metadataCallback: MetadataCallback;
  private _onCullError?: (error: unknown) => void;
  private readonly _removeEntryCallback: RemoveEntryCallback;

  constructor(options: ConstructorOptions) {
    const { cullBatchSize = 10, interval = 60_000, metadataCallback, removeEntryCallback, start = false } = options;
    this._cullBatchSize = cullBatchSize;
    this._interval = interval;
    this._metadataCallback = metadataCallback;
    this._onCullError = options.onCullError;
    this._removeEntryCallback = removeEntryCallback;

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

    const batchSize = this._cullBatchSize;

    for (let i = 0; i < metadata.length; i += batchSize) {
      const batch = metadata.slice(i, i + batchSize);

      await Promise.all(
        batch.map(({ key, tags }) =>
          Promise.resolve(this._removeEntryCallback(key, tags)).catch((error: unknown) => {
            this._onCullError?.(error);
          }),
        ),
      );
    }
  }

  private _getExpiredMetadata(): Metadata[] {
    const metadata = this._metadataCallback();
    return metadata.filter(({ cacheability }) => !cacheability.checkTTL());
  }

  private _start(): void {
    if (this._intervalID) {
      return;
    }

    this._intervalID = setInterval(() => {
      if (this._cullInProgress) {
        return;
      }

      this._cullInProgress = true;

      void (async (): Promise<void> => {
        try {
          await this._cull(this._getExpiredMetadata());
        } finally {
          this._cullInProgress = false;
        }
      })();
    }, this._interval);
  }

  private _stop(): void {
    if (this._intervalID) {
      clearInterval(this._intervalID);
      this._intervalID = undefined;
    }
  }
}

export const init = (options: Options = {}): ReaperInit => {
  if (!isPlainObject(options)) {
    throw new TypeError('@cachemap/reaper expected options to be a plain object.');
  }

  return (callbacks: ReaperCallbacks) => new Reaper({ ...options, ...callbacks });
};
