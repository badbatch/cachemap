import { DB } from "idb";

export interface ConstructorOptions {
  indexedDB: DB;
  maxHeapSize?: number;
  objectStoreName: string;
}

export interface InheritedOptions {
  name: string;
}

export interface InitOptions extends Options {
  name: string;
}

export interface Options {
  maxHeapSize?: number;
}
