declare module "object-sizeof" {
  export function sizeof(object: any): number;
}

declare module "promise-worker" {
  export default class PromiseWorker {
    constructor(worker: Worker);
    postMessage(message: any): Promise<any>;
  }
}

declare module "promise-worker/register" {
  export function registerPromiseWorker(callback: (message: any) => any): void
}
