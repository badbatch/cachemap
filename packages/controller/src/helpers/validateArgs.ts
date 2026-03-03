import { ArgsError } from '@cachemap/utils';
import { type EventData } from '../types.ts';

export const validateArgs = ({ name, type }: EventData): void => {
  if ((typeof name === 'string' && name.length > 0) || (typeof type === 'string' && type.length > 0)) {
    return;
  }

  throw new ArgsError("@cachemap/controller expected event data to include non-empty 'name' or 'type'.");
};
