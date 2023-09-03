import { type EventData } from '../types.ts';

export const validateArgs = ({ name, type }: EventData): boolean =>
  (typeof name === 'string' && name.length > 0) || (typeof type === 'string' && type.length > 0);
