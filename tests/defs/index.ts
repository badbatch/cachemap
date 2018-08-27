import Core from "@cachemap/core";
import CoreWorker from "@cachemap/core-worker";

export interface PlainObject {
  [key: string]: any;
}

export interface RunOptions {
  cachemapSize: (value: number) => number;
  init(options: PlainObject): Promise<Core | CoreWorker>;
}
