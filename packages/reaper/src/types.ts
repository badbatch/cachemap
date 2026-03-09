import { type Metadata, type Tag } from '@cachemap/types';

export interface ReaperCallbacks {
  metadataCallback: MetadataCallback;
  removeEntryCallback: RemoveEntryCallback;
}

export interface ConstructorOptions {
  cullBatchSize?: number;
  interval?: number;
  metadataCallback: MetadataCallback;
  onCullError?: (error: unknown) => void;
  removeEntryCallback: RemoveEntryCallback;
  start?: boolean;
}

export type MetadataCallback = () => Metadata[];

export interface Options {
  interval?: number;
  start?: boolean;
}

export interface ReaperDef {
  cull(metadata: Metadata[]): Promise<void>;
  start(): void;
  stop(): void;
}

export type ReaperInit = (callbacks: ReaperCallbacks) => ReaperDef;

export type RemoveEntryCallback = (key: string, tags?: Tag[]) => void | Promise<void>;
