export type ConstructorOptions = InitOptions;

export interface InitOptions extends Options {
  name: string;
}

export interface Options {
  backupInterval?: number;
  maxHeapSize?: number;
  storageType?: 'local' | 'session';
}
