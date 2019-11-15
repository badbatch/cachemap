import Core from "@cachemap/core";
import CoreWorker from "@cachemap/core-worker";

export interface PlainObject {
  [key: string]: any;
}

export interface RunOptions {
  cachemapSize: (value: number) => number;
  worker?: Worker;
  init(options: PlainObject): Core | CoreWorker;
}
