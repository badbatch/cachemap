import { describe, expect, it, jest } from '@jest/globals';
import { Cacheability } from 'cacheability';
import { Md5 } from 'ts-md5';
import { type JsonValue } from 'type-fest';
import { Core, type ExportResult, type Metadata, type StoreInit, type StoreOptions, ValueFormat } from '@cachemap/core';
import { init as map } from '@cachemap/map';
import { init as reaper } from '@cachemap/reaper';
import { testData } from '../data.ts';
import { type PlainObject } from '../types.ts';

jest.unstable_mockModule('redis', () => jest.requireActual('redis-mock'));

const { init: redis } = await import('@cachemap/redis');
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

describe.each`
  storeType      | store    | storeOptions
  ${'redisMock'} | ${redis} | ${{}}
  ${'map'}       | ${map}   | ${{}}
`('when store type is $storeType', args => {
  const { store, storeOptions, storeType } = args as {
    store: (options: PlainObject) => StoreInit;
    storeOptions: StoreOptions;
    storeType: string;
  };

  let cachemap: Core;

  afterEach(async () => {
    await cachemap.clear();
  });

  describe('adding an entry into the cachemap', () => {
    const id = '136-7317';
    const key = testData[id]!.url;
    const value = testData[id]!.body;
    const cacheOptions: PlainObject = { cacheControl: 'public, max-age=1' };

    beforeEach(() => {
      cachemap = new Core({
        name: `${storeType}-integration-tests`,
        store: store(storeOptions),
        type: 'integration-tests',
        valueFormatting: ValueFormat.Base64,
      });
    });

    describe('when a matching entry does not exist', () => {
      beforeEach(async () => {
        await cachemap.set(key, value, { cacheOptions, hashKey: true });
      });

      it('the set method should store the correct amount of metadata', () => {
        expect(cachemap.metadata).toHaveLength(1);
      });

      it('the set method should store the entry metadata', () => {
        const metadata = cachemap.metadata[0]!;

        expect(metadata).toEqual(
          expect.objectContaining({
            accessedCount: 0,
            added: expect.any(Number),
            cacheability: expect.any(Cacheability),
            key: Md5.hashStr(key),
            lastAccessed: expect.any(Number),
            lastUpdated: expect.any(Number),
            size: expect.any(Number),
            updatedCount: 0,
          }),
        );
      });

      it('the cachemap should have the correct size', async () => {
        await expect(cachemap.size()).resolves.toBe(1);
      });

      it('the set method should store the key/value pair', async () => {
        await expect(cachemap.get(key, { hashKey: true })).resolves.toEqual(value);
      });
    });

    describe('when a matching entry does exist', () => {
      let metadata: Metadata;

      beforeEach(async () => {
        await cachemap.set(key, { ...value, index: 0 }, { cacheOptions, hashKey: true });
        metadata = { ...cachemap.metadata[0]! };
        await cachemap.set(key, { ...value, index: 1 }, { cacheOptions, hashKey: true });
      });

      it('the set method should store the correct amount of metadata', () => {
        expect(cachemap.metadata).toHaveLength(1);
      });

      it("the set method should update the existing entry's metadata", () => {
        const updatedMetadata = cachemap.metadata[0]!;

        expect(updatedMetadata).toEqual(
          expect.objectContaining({
            accessedCount: 0,
            added: metadata.added,
            cacheability: expect.any(Cacheability),
            key: metadata.key,
            lastAccessed: metadata.lastAccessed,
            lastUpdated: expect.any(Number),
            size: metadata.size,
            updatedCount: 1,
          }),
        );
      });

      it('the updated metadata cacheability should be greater than or equal to the existing', () => {
        const updatedMetadata = cachemap.metadata[0]!;

        expect(updatedMetadata.cacheability.metadata.ttl).toBeGreaterThanOrEqual(metadata.cacheability.metadata.ttl);
      });

      it('the updated metadata lastUpdated should be greater than or equal to the existing', () => {
        const updatedMetadata = cachemap.metadata[0]!;
        expect(updatedMetadata.lastUpdated).toBeGreaterThanOrEqual(metadata.lastUpdated);
      });

      it('the cachemap should have the correct size', async () => {
        await expect(cachemap.size()).resolves.toBe(1);
      });

      it("the set method should overwrite the existing entry's key/value pair", async () => {
        await expect(cachemap.get(key, { hashKey: true })).resolves.toEqual({ ...value, index: 1 });
      });
    });

    describe('when the same key is added twice in quick succession', () => {
      beforeEach(async () => {
        await Promise.all([
          cachemap.set(key, { ...value, index: 0 }, { cacheOptions, hashKey: true }),
          cachemap.set(key, { ...value, index: 1 }, { cacheOptions, hashKey: true }),
        ]);
      });

      it('the set method should store the correct amount of metadata', () => {
        expect(cachemap.metadata).toHaveLength(1);
      });

      it("the set method should store the first entry's metadata and then update it", () => {
        const metadata = cachemap.metadata[0]!;

        expect(metadata).toEqual(
          expect.objectContaining({
            accessedCount: 0,
            added: expect.any(Number),
            cacheability: expect.any(Cacheability),
            key: Md5.hashStr(key),
            lastAccessed: expect.any(Number),
            lastUpdated: expect.any(Number),
            size: expect.any(Number),
            updatedCount: 1,
          }),
        );
      });

      it('the cachemap should have the correct size', async () => {
        await expect(cachemap.size()).resolves.toBe(1);
      });

      it("the set method should overwrite the first entry's key/value pair with the subsequent entry's", async () => {
        await expect(cachemap.get(key, { hashKey: true })).resolves.toEqual({ ...value, index: 1 });
      });
    });
  });

  describe('removing an entry from the cachemap', () => {
    const id = '136-7317';
    const key = testData[id]!.url;
    const value = testData[id]!.body;
    const cacheOptions: PlainObject = { cacheControl: 'public, max-age=1' };

    beforeEach(() => {
      cachemap = new Core({
        name: `${storeType}-integration-tests`,
        store: store(storeOptions),
        type: 'integration-tests',
        valueFormatting: ValueFormat.Base64,
      });
    });

    describe('when a matching entry does not exist', () => {
      let deleted: boolean;

      beforeEach(async () => {
        deleted = await cachemap.delete(key, { hashKey: true });
      });

      it('the delete method should return false', () => {
        expect(deleted).toBe(false);
      });
    });

    describe('when a matching entry does exist', () => {
      let deleted: boolean;

      beforeEach(async () => {
        await cachemap.set(key, value, { cacheOptions, hashKey: true });
        deleted = await cachemap.delete(key, { hashKey: true });
      });

      it('the delete method should return true', () => {
        expect(deleted).toBe(true);
      });

      it('the delete method should remove the entry metadata', () => {
        expect(cachemap.metadata).toHaveLength(0);
      });

      it('the cachemap should have the correct size', async () => {
        await expect(cachemap.size()).resolves.toBe(0);
      });

      it('the delete method should remove the key/value pair', async () => {
        await expect(cachemap.get(key, { hashKey: true })).resolves.toBeUndefined();
      });
    });
  });

  describe('retrieving an entry from the cachemap', () => {
    const id = '136-7317';
    const key = testData[id]!.url;
    const value = testData[id]!.body;
    const cacheOptions: PlainObject = { cacheControl: 'public, max-age=1' };

    beforeEach(() => {
      cachemap = new Core({
        name: `${storeType}-integration-tests`,
        store: store(storeOptions),
        type: 'integration-tests',
        valueFormatting: ValueFormat.Base64,
      });
    });

    describe('when a matching entry does not exist', () => {
      let entry: unknown;

      beforeEach(async () => {
        entry = await cachemap.get(key, { hashKey: true });
      });

      it('the get method should return undefined', () => {
        expect(entry).toBeUndefined();
      });
    });

    describe('when a matching entry exists', () => {
      let metadata: Metadata;
      let entry: unknown;

      beforeEach(async () => {
        await cachemap.set(key, value, { cacheOptions, hashKey: true });
        metadata = { ...cachemap.metadata[0]! };
        entry = await cachemap.get(key, { hashKey: true });
      });

      it('the get method should return the entry value', () => {
        expect(entry).toEqual(value);
      });

      it('the set method should store the correct amount of metadata', () => {
        expect(cachemap.metadata).toHaveLength(1);
      });

      it("the get method should update the existing entry's metadata", () => {
        const updatedMetadata = cachemap.metadata[0]!;

        expect(updatedMetadata).toEqual(
          expect.objectContaining({
            accessedCount: 1,
            added: metadata.added,
            cacheability: expect.any(Cacheability),
            key: Md5.hashStr(key),
            lastAccessed: expect.any(Number),
            lastUpdated: metadata.lastUpdated,
            size: metadata.size,
            updatedCount: 0,
          }),
        );
      });

      it('the updated metadata lastAccessed should be greater than or equal to the existing', () => {
        const updatedMetadata = cachemap.metadata[0]!;
        expect(updatedMetadata.lastAccessed).toBeGreaterThanOrEqual(metadata.lastAccessed);
      });
    });
  });

  describe('checking if the cachemap has an entry', () => {
    const id = '136-7317';
    const key = testData[id]!.url;
    const value = testData[id]!.body;
    const cacheOptions: PlainObject = { cacheControl: 'public, max-age=1' };

    beforeEach(() => {
      cachemap = new Core({
        name: `${storeType}-integration-tests`,
        store: store(storeOptions),
        type: 'integration-tests',
        valueFormatting: ValueFormat.Base64,
      });
    });

    describe('when a matching entry does not exist', () => {
      let exists: boolean | Cacheability;

      beforeEach(async () => {
        exists = await cachemap.has(key, { hashKey: true });
      });

      it('the has method should return false', () => {
        expect(exists).toBe(false);
      });
    });

    describe('when a matching entry exists', () => {
      describe("when the extry's cacheability is valid", () => {
        let exists: boolean | Cacheability;

        beforeEach(async () => {
          await cachemap.set(key, value, { cacheOptions, hashKey: true });
          exists = await cachemap.has(key, { hashKey: true });
        });

        it("the has method should return the entry's Cacheability instance", () => {
          expect(exists).toBeInstanceOf(Cacheability);
        });
      });

      describe("when the entry's cacheability is expired", () => {
        describe('when deleteExpired is not passed in as an option', () => {
          let exists: boolean | Cacheability;

          beforeEach(async () => {
            await cachemap.set(key, value, { cacheOptions, hashKey: true });
            await delay(1000);
            exists = await cachemap.has(key, { hashKey: true });
          });

          it("the has method should return the entry's Cacheability instance", () => {
            expect(exists).toBe(false);
          });

          it('the has method should not remove the entry metadata', () => {
            expect(cachemap.metadata).toHaveLength(1);
          });

          it('the cachemap should have the correct size', async () => {
            await expect(cachemap.size()).resolves.toBe(1);
          });

          it('the has method should not remove the key/value pair', async () => {
            await expect(cachemap.get(key, { hashKey: true })).resolves.toBeUndefined();
          });
        });

        describe('when deleteExpired is passed in as an option', () => {
          let exists: boolean | Cacheability;

          beforeEach(async () => {
            await cachemap.set(key, value, { cacheOptions, hashKey: true });
            await delay(1000);
            exists = await cachemap.has(key, { deleteExpired: true, hashKey: true });
          });

          it('the has method should return false', () => {
            expect(exists).toBe(false);
          });

          it('the has method should remove the entry metadata', () => {
            expect(cachemap.metadata).toHaveLength(0);
          });

          it('the cachemap should have the correct size', async () => {
            await expect(cachemap.size()).resolves.toBe(0);
          });

          it('the has method should remove the key/value pair', async () => {
            await expect(cachemap.get(key, { hashKey: true })).resolves.toBeUndefined();
          });
        });
      });
    });
  });

  describe('retrieving multiple entries from the cachemap', () => {
    const cacheOptions: PlainObject = { cacheControl: 'public, max-age=1' };

    beforeEach(() => {
      cachemap = new Core({
        name: `${storeType}-integration-tests`,
        store: store(storeOptions),
        type: 'integration-tests',
        valueFormatting: ValueFormat.Base64,
      });
    });

    describe('when no keys are passed in', () => {
      let result: [string, unknown][];

      beforeEach(async () => {
        const keys = Object.keys(testData);

        await Promise.all(
          keys.map(id => {
            return cachemap.set(testData[id]!.url, testData[id]!.body, { cacheOptions, hashKey: true });
          }),
        );

        result = await cachemap.entries();
      });

      it('the entries method should return all the key/value pair entries', () => {
        expect(result).toHaveLength(3);
      });
    });

    describe('when keys are passed in', () => {
      let result: [string, unknown][];

      beforeEach(async () => {
        const ids = Object.keys(testData);
        const hashedKeys: string[] = [];

        await Promise.all(
          ids.map(id => {
            const url = testData[id]!.url;
            hashedKeys.push(Md5.hashStr(url));
            return cachemap.set(url, testData[id]!.body, { cacheOptions, hashKey: true });
          }),
        );

        result = await cachemap.entries(hashedKeys.slice(0, 2));
      });

      it('the entries method should return the matching key/value pair entries', () => {
        expect(result).toHaveLength(2);
      });
    });
  });

  describe('retrieving multiple entries and their metadata from the cachemap', () => {
    const cacheOptions: PlainObject = { cacheControl: 'public, max-age=1' };

    beforeEach(() => {
      cachemap = new Core({
        name: `${storeType}-integration-tests`,
        store: store(storeOptions),
        type: 'integration-tests',
        valueFormatting: ValueFormat.Base64,
      });
    });

    describe('when no keys are passed in', () => {
      let result: ExportResult<JsonValue>;

      beforeEach(async () => {
        const keys = Object.keys(testData);

        await Promise.all(
          keys.map(id => {
            return cachemap.set(testData[id]!.url, testData[id]!.body, { cacheOptions, hashKey: true });
          }),
        );

        result = await cachemap.export();
      });

      it('the export method should return all the key/value pair entries', () => {
        expect(result.entries).toHaveLength(3);
      });

      it('the export method should return all the metadata', () => {
        expect(result.metadata).toHaveLength(3);
      });
    });

    describe('when keys are passed in', () => {
      let result: ExportResult<JsonValue>;

      beforeEach(async () => {
        const ids = Object.keys(testData);
        const hashedKeys: string[] = [];

        await Promise.all(
          ids.map(id => {
            const url = testData[id]!.url;
            hashedKeys.push(Md5.hashStr(url));
            return cachemap.set(url, testData[id]!.body, { cacheOptions, hashKey: true });
          }),
        );

        result = await cachemap.export({ keys: hashedKeys.slice(0, 2) });
      });

      it('the export method should return all the key/value pair entries', () => {
        expect(result.entries).toHaveLength(2);
      });

      it('the export method should return all the metadata', () => {
        expect(result.metadata).toHaveLength(2);
      });
    });

    describe('when a tag is passed in', () => {
      let result: ExportResult<JsonValue>;

      beforeEach(async () => {
        const keys = Object.keys(testData);
        const tags = ['alfa', 'bravo', 'charlie'];

        await Promise.all(
          keys.map(id => {
            const tag = tags.pop();
            return cachemap.set(testData[id]!.url, testData[id]!.body, { cacheOptions, hashKey: true, tag });
          }),
        );

        result = await cachemap.export({ tag: 'alfa' });
      });

      it('the export method should return all the key/value pair entries', () => {
        expect(result.entries).toHaveLength(1);
      });

      it('the export method should return all the metadata', () => {
        expect(result.metadata).toHaveLength(1);
      });
    });

    describe('when filterByValue is passed in', () => {
      let result: ExportResult<JsonValue>;

      beforeEach(async () => {
        const keys = Object.keys(testData);

        await Promise.all(
          keys.map(id => {
            return cachemap.set(testData[id]!.url, testData[id]!.body, { cacheOptions, hashKey: true });
          }),
        );

        result = await cachemap.export({ filterByValue: { comparator: '180-1387', keyChain: 'id' } });
      });

      it('the export method should return all the key/value pair entries', () => {
        expect(result.entries).toHaveLength(1);
      });

      it('the export method should return all the metadata', () => {
        expect(result.metadata).toHaveLength(1);
      });
    });
  });

  describe('adding multiple entries and their metadata to the cachemap', () => {
    const cacheOptions: PlainObject = { cacheControl: 'public, max-age=1' };

    beforeEach(() => {
      cachemap = new Core({
        name: `${storeType}-integration-tests`,
        store: store(storeOptions),
        type: 'integration-tests',
        valueFormatting: ValueFormat.Base64,
      });
    });

    describe('when no matching entries exist', () => {
      beforeEach(async () => {
        const keys = Object.keys(testData);

        await Promise.all(
          keys.map(id => {
            return cachemap.set(testData[id]!.url, testData[id]!.body, { cacheOptions, hashKey: true });
          }),
        );

        const exported = await cachemap.export<JsonValue>();
        await cachemap.clear();
        await cachemap.import(exported);
      });

      it('the import method should add the key/value pair entries', async () => {
        await expect(cachemap.size()).resolves.toBe(3);
      });

      it('the import method should add all the metadata', () => {
        expect(cachemap.metadata).toHaveLength(3);
      });
    });

    describe('when matching entries exist', () => {
      beforeEach(async () => {
        const keys = Object.keys(testData);

        await Promise.all(
          keys.map(id => {
            return cachemap.set(testData[id]!.url, testData[id]!.body, { cacheOptions, hashKey: true });
          }),
        );

        const exported = await cachemap.export<JsonValue>();
        await cachemap.import(exported);
      });

      it('the import method should add the key/value pair entries', async () => {
        await expect(cachemap.size()).resolves.toBe(3);
      });

      it('the import method should add all the metadata', () => {
        expect(cachemap.metadata).toHaveLength(3);
      });
    });
  });

  describe('when the reaper module is passed into the cachemap', () => {
    const id = '136-7317';
    const key = testData[id]!.url;
    const value = testData[id]!.body;
    const cacheOptions: PlainObject = { cacheControl: 'public, max-age=0' };

    describe("when an entry's cacheability expires", () => {
      let entryDeletedData: PlainObject;

      beforeEach(async () => {
        cachemap = new Core({
          name: `${storeType}-integration-tests`,
          reaper: reaper({ interval: 500, start: true }),
          store: store(storeOptions),
          type: 'integration-tests',
          valueFormatting: ValueFormat.Base64,
        });

        cachemap.emitter.on(cachemap.events.ENTRY_DELETED, (data: PlainObject) => {
          entryDeletedData = data;
        });

        await cachemap.set(key, value, { cacheOptions, hashKey: true, tag: 'ALPHA' });
        await delay(1000);
      });

      afterEach(() => {
        cachemap.reaper?.stop();
      });

      it('the cachemap should have the correct size', async () => {
        await expect(cachemap.size()).resolves.toBe(0);
      });

      it('the reaper should remove the key/value pair', async () => {
        await expect(cachemap.get(key, { hashKey: true })).resolves.toBeUndefined();
      });

      it('the reaper should remove the entry metadata', () => {
        expect(cachemap.metadata).toHaveLength(0);
      });

      it('the ENTRY_DELETED event should be emitted with the correct data', () => {
        expect(entryDeletedData).toEqual(
          expect.objectContaining({
            deleted: true,
            key: expect.any(String),
            tags: ['ALPHA'],
          }),
        );
      });
    });

    describe('when the entries exceed the max heap size', () => {
      let entryDeletedData: PlainObject[] = [];
      let keys: string[];

      beforeEach(() => {
        return new Promise<void>(resolve => {
          cachemap = new Core({
            name: `${storeType}-integration-tests`,
            reaper: reaper({ start: true }),
            store: store({ ...storeOptions, maxHeapSize: 100 }),
            type: 'integration-tests',
            valueFormatting: ValueFormat.Base64,
          });

          cachemap.emitter.on(cachemap.events.ENTRY_DELETED, (data: PlainObject) => {
            entryDeletedData.push(data);
            resolve();
          });

          keys = Object.keys(testData);

          for (const _id of keys) {
            void cachemap.set(testData[_id]!.url, testData[_id]!.body, { cacheOptions, hashKey: true });
          }
        });
      });

      afterEach(() => {
        entryDeletedData = [];
        cachemap.reaper?.stop();
      });

      it('the cachemap should have the correct size', async () => {
        await expect(cachemap.size()).resolves.toBe(2);
      });

      it('the reaper should remove the necessary key/value pair', async () => {
        await expect(cachemap.get(keys[2]!, { hashKey: true })).resolves.toBeUndefined();
      });

      it('the reaper should remove the entry metadata', () => {
        expect(cachemap.metadata).toHaveLength(2);
      });

      it('the ENTRY_DELETED event should fire the correct number of times', () => {
        expect(entryDeletedData).toHaveLength(1);
      });

      it('the ENTRY_DELETED event should be emitted with the correct data', () => {
        expect(entryDeletedData[0]).toEqual(
          expect.objectContaining({
            deleted: true,
            key: expect.any(String),
            tags: [],
          }),
        );
      });
    });
  });
});
