import { Metadata } from "@cachemap/types";

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

export type DeleteCallback = (key: string, tags?: any[]) => Promise<void>;

export type Init = (callbacks: Callbacks) => Reaper;

export type MetadataCallback = () => Metadata[];

export interface Options {
  interval?: number;
  start?: boolean;
}

export interface Reaper {
  cull(metadata: Metadata[]): Promise<void>;
  start(): void;
  stop(): void;
}
