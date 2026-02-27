import { type Store } from '@cachemap/types';

export class MapStore implements Store {
  private _map = new Map<string, string>();

  public clear(): void {
    this._map.clear();
  }

  public delete(key: string): boolean {
    return this._map.delete(key);
  }

  public entries(keys?: string[]): [string, string][] {
    const entries = this._map.entries();

    if (!keys) {
      return [...entries];
    }

    const filtered: [string, string][] = [];

    for (const [key, value] of entries) {
      if (keys.includes(key)) {
        filtered.push([key, value]);
      }
    }

    return filtered;
  }

  public get(key: string): string | undefined {
    return this._map.get(key);
  }

  public has(key: string): boolean {
    return this._map.get(key) !== undefined;
  }

  public import(entries: [string, string][]): void {
    this._map = new Map([...this._map, ...entries]);
  }

  public set(key: string, value: string): void {
    this._map.set(key, value);
  }

  public size(): number {
    return this._map.size;
  }
}
