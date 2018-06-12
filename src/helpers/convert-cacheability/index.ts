import Cacheability from "cacheability";
import { Metadata } from "~/types";

export function convertCacheability(metadata: Metadata[]): Metadata[] {
  return metadata.map(({ cacheability: cacheabilityObject, ...props }) => {
    let cacheability: Cacheability;
    const cacheabilityMetadata = cacheabilityObject.metadata;

    if (!(cacheabilityObject instanceof Cacheability)) {
      cacheability = new Cacheability();
      cacheability.metadata = cacheabilityMetadata;
    } else {
      cacheability = cacheabilityObject;
    }

    return { ...props, cacheability };
  });
}
