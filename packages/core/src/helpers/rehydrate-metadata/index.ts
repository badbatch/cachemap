import Cacheability from "cacheability";
import { DehydratedMetadata, Metadata } from "../../defs";

export function rehydrateMetadata(metadata: DehydratedMetadata[]): Metadata[] {
  return metadata.map(({ cacheability, ...otherProps }) => {
    return { ...otherProps, cacheability: new Cacheability({ metadata: cacheability.metadata }) };
  });
}
