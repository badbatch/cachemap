import { type IDBPDatabase } from 'idb';

export interface ConstructorOptions extends InitOptions {
  indexedDB: IDBPDatabase;
}

export interface InitOptions {
  name: string;
}
