import logger from "../logger";
import { StoreProxyTypes } from "../types";

export function logCacheEntry(
  target: any,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<void>>,
): void {
  const method = descriptor.value;
  if (!method) return;

  descriptor.value = async function (...args: any[]): Promise<void> {
    try {
      await method.apply(this, args);
    } catch (error) {
      return Promise.reject(error);
    }

    const _this = this as StoreProxyTypes;
    const message = `${_this.cacheType} cache => entry added`;
    logger.debug(message, { cacheEntry: { key: args[0], value: args[1] } });
  };
}
