import Cacheability from "cacheability";
import { ConvertCacheabilityMetadata, Metadata } from "../../types";

export function convertCacheability(metadata: ConvertCacheabilityMetadata[]): Metadata[] {
  return metadata.map(({ cacheability: cacheabilityObject, ...props }) => {
    let cacheability: Cacheability;

    if (!(cacheabilityObject instanceof Cacheability)) {
      cacheability = new Cacheability({ metadata: cacheabilityObject.metadata });
    } else {
      cacheability = cacheabilityObject;
    }

    return { ...props, cacheability };
  });
}
