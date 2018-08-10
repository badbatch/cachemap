import { DehydratedMetadata, Metadata } from "../../defs";
import Cacheability from "cacheability";

export function rehydrateMetadata(metadata: DehydratedMetadata[]): Metadata[] {
  return metadata.map(({ cacheability, ...otherProps }) => {
    return { ...otherProps, cacheability: new Cacheability({ metadata: cacheability.metadata }) };
  });
}
