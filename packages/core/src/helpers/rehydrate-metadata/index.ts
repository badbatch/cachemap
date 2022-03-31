import { Metadata } from "@cachemap/types";
import Cacheability from "cacheability";
import { DehydratedMetadata } from "../../types";

export function rehydrateMetadata(metadata: DehydratedMetadata[]): Metadata[] {
  return metadata.map(({ cacheability, ...otherProps }) => {
    return { ...otherProps, cacheability: new Cacheability({ metadata: cacheability.metadata }) };
  });
}
