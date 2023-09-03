import { type DehydratedMetadata, type Metadata } from '@cachemap/types';
import { Cacheability } from 'cacheability';

export const dehydrateMetadata = (metadata: Metadata[]): DehydratedMetadata[] =>
  metadata.map(({ cacheability, ...otherProps }) => {
    return { ...otherProps, cacheability: { metadata: cacheability.metadata } };
  });

export const rehydrateMetadata = (metadata: DehydratedMetadata[]): Metadata[] =>
  metadata.map(({ cacheability, ...otherProps }) => {
    return { ...otherProps, cacheability: new Cacheability({ metadata: cacheability.metadata }) };
  });
