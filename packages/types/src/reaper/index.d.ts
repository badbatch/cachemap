import { Metadata, PlainObject } from "../core";

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

export type MetadataCallback = () => Metadata[];

export interface Options {
  interval?: number;
  start?: boolean;
}

export class Reaper {
  constructor(options: ConstructorOptions)
  public async cull(metadata: Metadata[]): Promise<void>;
  public start(): void;
  public stop(): void;
}
