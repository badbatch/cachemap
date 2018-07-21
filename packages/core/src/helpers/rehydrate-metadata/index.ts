import { core } from "@cachemap/types";
import Cacheability from "cacheability";

export function rehydrateMetadata(metadata: core.DehydratedMetadata[]): core.Metadata[] {
  return metadata.map(({ cacheability, ...otherProps }) => {
    return { ...otherProps, cacheability: new Cacheability({ metadata: cacheability.metadata }) };
  });
}
