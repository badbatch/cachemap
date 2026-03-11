export type ConstructorOptions = InitOptions;

export interface InitOptions extends Options {
  name: string;
}

export interface Options {
  storageType?: 'local' | 'session';
}
