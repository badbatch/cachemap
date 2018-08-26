export interface PlainObject {
  [key: string]: any;
}

export interface RunOptions {
  cachemapSize?: (value: number) => number;
}
