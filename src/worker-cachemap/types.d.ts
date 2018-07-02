import PromiseWorker from "promise-worker";

export interface WorkerCachemapArgs {
  promiseWorker: PromiseWorker;
  worker: Worker;
}
