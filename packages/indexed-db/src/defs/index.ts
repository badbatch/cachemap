import { IDBPDatabase } from "idb";

export interface ConstructorOptions extends InitOptions {
  indexedDB: IDBPDatabase;
}

export interface InitOptions extends Options {
  name: string;
}

export interface Options {
  maxHeapSize?: number;
}
