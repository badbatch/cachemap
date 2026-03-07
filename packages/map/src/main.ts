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
    if (!keys) {
      return [...this._map];
    }

    const filtered: [string, string][] = [];
    const keySet = new Set(keys);

    for (const [key, value] of this._map) {
      if (keySet.has(key)) {
        filtered.push([key, value]);
      }
    }

    return filtered;
  }

  public get(key: string): string | undefined {
    return this._map.get(key);
  }

  public has(key: string): boolean {
    return this._map.has(key);
  }

  public import(entries: [string, string][]): void {
    for (const [key, value] of entries) {
      this._map.set(key, value);
    }
  }

  public set(key: string, value: string): void {
    this._map.set(key, value);
  }

  get size(): number {
    return this._map.size;
  }
}
