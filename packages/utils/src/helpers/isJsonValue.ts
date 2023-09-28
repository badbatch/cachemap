import { type JsonValue } from 'type-fest';

export const isJsonValue = (value: unknown): value is JsonValue => {
  try {
    JSON.stringify(value);
    return true;
  } catch {
    return false;
  }
};
