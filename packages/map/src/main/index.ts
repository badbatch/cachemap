import { coreDefs } from "@cachemap/core";
import { isNumber, isPlainObject } from "lodash";
import { ConstructorOptions, InitOptions, Options } from "../defs";

export class MapStore implements coreDefs.Store {
  public static async init(options: InitOptions): Promise<MapStore> {
    return new MapStore(options);
  }

  public readonly type = "map";
  private _map = new Map();
  private _maxHeapSize: number = 5242880;
  private _name: string;

  constructor(options: ConstructorOptions) {
    if (isNumber(options.maxHeapSize)) {
      this._maxHeapSize = options.maxHeapSize;
    }

    this._name = options.name;
  }

  get maxHeapSize() {
    return this._maxHeapSize;
  }

  get name() {
    return this._name;
  }

  public async clear(): Promise<void> {
    this._map.clear();
  }

  public async delete(key: string): Promise<boolean> {
    return this._map.delete(key);
  }

  public async entries(keys?: string[]): Promise<[string, any][]> {
    const entries = this._map.entries();
    if (!keys) return Array.from(entries);

    const filtered: [string, any][] = [];

    for (const [key, value] of entries) {
      if (keys.find(val => val === key)) filtered.push([key, value]);
    }

    return filtered;
  }

  public async get(key: string): Promise<any> {
    return this._map.get(key);
  }

  public async has(key: string): Promise<boolean> {
    return this._map.get(key) !== undefined;
  }

  public async import(entries: [string, any][]): Promise<void> {
    this._map = new Map([...this._map, ...entries]);
  }

  public async set(key: string, value: any): Promise<void> {
    this._map.set(key, value);
  }

  public async size(): Promise<number> {
    return this._map.size;
  }
}

export default function init(options: Options = {}): coreDefs.StoreInit {
  if (!isPlainObject(options)) {
    throw new TypeError("@cachemap/map expected options to be a plain object.");
  }

  return (storeOptions: coreDefs.StoreOptions) => MapStore.init({ ...options, ...storeOptions });
}
