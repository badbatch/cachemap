export default class MapProxy {
  private _map = new Map();

  public async clear(): Promise<void> {
    this._map.clear();
  }

  public async delete(key: string): Promise<boolean> {
    return this._map.delete(key);
  }

  public async get(key: string): Promise<any> {
    return this._map.get(key);
  }

  public async has(key: string): Promise<boolean> {
    return this._map.get(key) !== undefined;
  }

  public async set(key: string, value: any): Promise<void> {
    this._map.set(key, value);
  }

  public async size(): Promise<number> {
    return this._map.size;
  }
}
