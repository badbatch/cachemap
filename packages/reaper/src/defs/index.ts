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

export type MetadataCallback = () => coreDefs.Metadata[];

export interface Options {
  interval?: number;
  start?: boolean;
}

export interface Reaper {
  cull(metadata: coreDefs.Metadata[]): Promise<void>;
  start(): void;
  stop(): void;
}
