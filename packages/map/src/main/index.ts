import { type Store, type StoreInit, type StoreOptions } from '@cachemap/types';
import { isNumber, isPlainObject } from 'lodash-es';
import { type ConstructorOptions, type InitOptions, type Options } from '../types.ts';

export class MapStore implements Store {
  public static init(options: InitOptions): Promise<MapStore> {
    return Promise.resolve(new MapStore(options));
  }

  public readonly type = 'map';
  private _map = new Map<string, string>();
  private readonly _maxHeapSize: number = 5_242_880;
  private readonly _name: string;

  constructor(options: ConstructorOptions) {
    if (isNumber(options.maxHeapSize)) {
      this._maxHeapSize = options.maxHeapSize;
    }

    this._name = options.name;
  }

  public clear(): Promise<void> {
    this._map.clear();
    return Promise.resolve();
  }

  public delete(key: string): Promise<boolean> {
    return Promise.resolve(this._map.delete(key));
  }

  public entries(keys?: string[]): Promise<[string, string][]> {
    const entries = this._map.entries();

    if (!keys) {
      return Promise.resolve([...entries]);
    }

    const filtered: [string, string][] = [];

    for (const [key, value] of entries) {
      if (keys.includes(key)) {
        filtered.push([key, value]);
      }
    }

    return Promise.resolve(filtered);
  }

  public get(key: string): Promise<string | undefined> {
    return Promise.resolve(this._map.get(key));
  }

  public has(key: string): Promise<boolean> {
    return Promise.resolve(this._map.get(key) !== undefined);
  }

  public import(entries: [string, string][]): Promise<void> {
    this._map = new Map([...this._map, ...entries]);
    return Promise.resolve();
  }

  get maxHeapSize(): number {
    return this._maxHeapSize;
  }

  get name(): string {
    return this._name;
  }

  public set(key: string, value: string): Promise<void> {
    this._map.set(key, value);
    return Promise.resolve();
  }

  public size(): Promise<number> {
    return Promise.resolve(this._map.size);
  }
}

export const init = (options: Options = {}): StoreInit => {
  if (!isPlainObject(options)) {
    throw new TypeError('@cachemap/map expected options to be a plain object.');
  }

  return (storeOptions: StoreOptions) => MapStore.init({ ...options, ...storeOptions });
};
