import { DB } from "idb";

export interface ConstructorOptions extends InitOptions {
  indexedDB: DB;
}

export interface InitOptions extends Options {
  name: string;
}

export interface Options {
  maxHeapSize?: number;
}
