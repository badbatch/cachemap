import { coreDefs } from "@cachemap/core";

export interface Callbacks {
  deleteCallback: DeleteCallback;
  metadataCallback: MetadataCallback;
}

export interface ConstructorOptions {
  deleteCallback: DeleteCallback;
  interval?: number;
  metadataCallback: MetadataCallback;
  start?: boolean;
}

export type DeleteCallback = (key: string, options?: { hash?: boolean }) => Promise<boolean>;

export type Init = (callbacks: Callbacks) => Reaper;

export type MetadataCallback = () => core.Metadata[];

export interface Options {
  interval?: number;
  start?: boolean;
}
