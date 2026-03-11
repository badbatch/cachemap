import { type BackupStore, type BackupStoreInit } from '@cachemap/types';
import { type IDBPDatabase, type IDBPObjectStore, type IDBPTransaction, openDB } from 'idb';
import { type ConstructorOptions, type InitOptions } from './types.ts';

export class IndexedDBStore implements BackupStore {
  public static async init(options: InitOptions): Promise<IndexedDBStore> {
    const databaseName = `${options.name}-store`;
    const objectStoreName = options.name;

    const indexedDB = await openDB(databaseName, 1, {
      upgrade: (database: IDBPDatabase) => {
        database.createObjectStore(objectStoreName);
      },
    });

    return new IndexedDBStore({
      indexedDB,
      ...options,
    });
  }

  public readonly type = 'indexedDB';
  private _indexedDB: IDBPDatabase;
  private readonly _name: string;

  constructor(options: ConstructorOptions) {
    this._indexedDB = options.indexedDB;
    this._name = options.name;
  }

  public async clear(): Promise<void> {
    const { store, tx } = this._store('readwrite');
    await store.clear();
    await tx.done;
  }

  public async delete(key: string): Promise<boolean> {
    const { store, tx } = this._store('readwrite');
    const exists = await store.getKey(key);

    if (exists !== undefined) {
      await store.delete(key);
    }

    await tx.done;
    return exists !== undefined;
  }

  public async entries(keys: string[]): Promise<[string, string][]> {
    const { store, tx } = this._store('readonly');

    const results = await Promise.all(
      keys.map(async (key): Promise<[string, string] | undefined> => {
        // get return value is any type.
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        const value = (await store.get(key)) as string | undefined;
        return value === undefined ? undefined : [key, value];
      }),
    );

    await tx.done;
    return results.filter(result => this._isEntry(result));
  }

  public async get(key: string): Promise<string | undefined> {
    const { store, tx } = this._store('readonly');
    // get return value is any type.
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const result = (await store.get(key)) as string | undefined;
    await tx.done;
    return result;
  }

  public async has(key: string): Promise<boolean> {
    const { store, tx } = this._store('readonly');
    const keyResult = await store.getKey(key);
    await tx.done;
    return keyResult !== undefined;
  }

  public async import(entries: [string, string][]): Promise<void> {
    const { store, tx } = this._store('readwrite');
    await Promise.all(entries.map(([key, value]) => store.put(value, key)));
    await tx.done;
  }

  get name(): string {
    return this._name;
  }

  public async set(key: string, value: string): Promise<void> {
    const { store, tx } = this._store('readwrite');
    await store.put(value, key);
    await tx.done;
  }

  public async size(): Promise<number> {
    const { store, tx } = this._store('readonly');
    const count = await store.count();
    await tx.done;
    return count - 1;
  }

  private _isEntry(value: [string, string] | undefined): value is [string, string] {
    return value !== undefined;
  }

  private _store<M extends IDBTransactionMode>(
    mode: M,
  ): {
    store: IDBPObjectStore<unknown, [string], string, M>;
    tx: IDBPTransaction<unknown, [string], M>;
  } {
    const tx = this._indexedDB.transaction(this._name, mode);
    const store = tx.objectStore(this._name);
    return { store, tx };
  }
}

export const init = (): BackupStoreInit => {
  return (storeOptions: { name: string }) => IndexedDBStore.init({ ...storeOptions });
};
