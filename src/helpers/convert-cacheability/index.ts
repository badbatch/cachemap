import { Cacheability } from "cacheability";
import { Metadata } from "../../types";

export default function convertCacheability(metadata: Metadata[]): Metadata[] {
  return metadata.map(({ cacheability: cacheabilityObject, ...props }) => {
    const cacheability = new Cacheability();
    cacheability.metadata = cacheabilityObject.metadata;
    return { ...props, cacheability };
  });
}
