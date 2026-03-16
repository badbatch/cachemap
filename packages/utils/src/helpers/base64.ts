import { Base64 } from 'js-base64';

export const encode = (data: unknown): string => Base64.encode(JSON.stringify(data));

// JSON.parse returns any type.
// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
export const decode = <T>(encodedData: string): T => JSON.parse(Base64.decode(encodedData)) as T;
