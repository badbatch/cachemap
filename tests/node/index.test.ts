import { describe, expect, it } from '@jest/globals';
import { Cacheability } from 'cacheability';
import { Md5 } from 'ts-md5';
import { type JsonValue } from 'type-fest';
import { Core, type Metadata, ValueFormat } from '@cachemap/core';
import { init as reaper } from '@cachemap/reaper';
import { type ExportResult } from '@cachemap/types';
import { constants } from '@cachemap/utils';
import { testData } from '../data.ts';
import { type PlainObject } from '../types.ts';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

describe('when no backup store is provided', () => {
  let cachemap: Core;

  afterEach(() => {
    cachemap.clear();
  });

  describe('adding an entry into the cachemap', () => {
    const id = '136-7317';
    const key = testData[id]!.url;
    const value = testData[id]!.body;
    const cacheOptions: PlainObject = { cacheControl: 'public, max-age=1' };

    beforeEach(() => {
      cachemap = new Core({
        name: 'integration-tests',
        type: 'integration-tests',
        valueFormatting: ValueFormat.Base64,
      });
    });

    describe('when a matching entry does not exist', () => {
      it('the set method should store the correct amount of metadata', () => {
        cachemap.set(key, value, { cacheOptions, hashKey: true });
        expect(cachemap.metadata).toHaveLength(1);
      });

      it('the set method should store the entry metadata', () => {
        cachemap.set(key, value, { cacheOptions, hashKey: true });
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

      it('the cachemap should have the correct size', () => {
        cachemap.set(key, value, { cacheOptions, hashKey: true });
        expect(cachemap.size).toBe(1);
      });

      it('the set method should store the key/value pair', () => {
        cachemap.set(key, value, { cacheOptions, hashKey: true });
        expect(cachemap.get(key, { hashKey: true })).toEqual(value);
      });
    });

    describe('when a matching entry does exist', () => {
      let metadata: Metadata;

      beforeEach(() => {
        cachemap.set(key, { ...value, index: 0 }, { cacheOptions, hashKey: true });
        metadata = { ...cachemap.metadata[0]! };
      });

      it('the set method should store the correct amount of metadata', () => {
        cachemap.set(key, { ...value, index: 1 }, { cacheOptions, hashKey: true });
        expect(cachemap.metadata).toHaveLength(1);
      });

      it("the set method should update the existing entry's metadata", () => {
        cachemap.set(key, { ...value, index: 1 }, { cacheOptions, hashKey: true });
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
        cachemap.set(key, { ...value, index: 1 }, { cacheOptions, hashKey: true });
        const updatedMetadata = cachemap.metadata[0]!;
        expect(updatedMetadata.cacheability.metadata.ttl).toBeGreaterThanOrEqual(metadata.cacheability.metadata.ttl);
      });

      it('the updated metadata lastUpdated should be greater than or equal to the existing', () => {
        cachemap.set(key, { ...value, index: 1 }, { cacheOptions, hashKey: true });
        const updatedMetadata = cachemap.metadata[0]!;
        expect(updatedMetadata.lastUpdated).toBeGreaterThanOrEqual(metadata.lastUpdated);
      });

      it('the cachemap should have the correct size', () => {
        cachemap.set(key, { ...value, index: 1 }, { cacheOptions, hashKey: true });
        expect(cachemap.size).toBe(1);
      });

      it("the set method should overwrite the existing entry's key/value pair", () => {
        cachemap.set(key, { ...value, index: 1 }, { cacheOptions, hashKey: true });
        expect(cachemap.get(key, { hashKey: true })).toEqual({ ...value, index: 1 });
      });
    });

    describe('when the same key is added twice in quick succession', () => {
      it('the set method should store the correct amount of metadata', () => {
        cachemap.set(key, { ...value, index: 0 }, { cacheOptions, hashKey: true });
        cachemap.set(key, { ...value, index: 1 }, { cacheOptions, hashKey: true });
        expect(cachemap.metadata).toHaveLength(1);
      });

      it("the set method should store the first entry's metadata and then update it", () => {
        cachemap.set(key, { ...value, index: 0 }, { cacheOptions, hashKey: true });
        cachemap.set(key, { ...value, index: 1 }, { cacheOptions, hashKey: true });
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

      it('the cachemap should have the correct size', () => {
        cachemap.set(key, { ...value, index: 0 }, { cacheOptions, hashKey: true });
        cachemap.set(key, { ...value, index: 1 }, { cacheOptions, hashKey: true });
        expect(cachemap.size).toBe(1);
      });

      it("the set method should overwrite the first entry's key/value pair with the subsequent entry's", () => {
        cachemap.set(key, { ...value, index: 0 }, { cacheOptions, hashKey: true });
        cachemap.set(key, { ...value, index: 1 }, { cacheOptions, hashKey: true });
        expect(cachemap.get(key, { hashKey: true })).toEqual({ ...value, index: 1 });
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
        name: 'integration-tests',
        type: 'integration-tests',
        valueFormatting: ValueFormat.Base64,
      });
    });

    describe('when a matching entry does not exist', () => {
      it('the delete method should return false', () => {
        const deleted = cachemap.delete(key, { hashKey: true });
        expect(deleted).toBe(false);
      });
    });

    describe('when a matching entry does exist', () => {
      beforeEach(() => {
        cachemap.set(key, value, { cacheOptions, hashKey: true });
      });

      it('the delete method should return true', () => {
        const deleted = cachemap.delete(key, { hashKey: true });
        expect(deleted).toBe(true);
      });

      it('the delete method should remove the entry metadata', () => {
        cachemap.delete(key, { hashKey: true });
        expect(cachemap.metadata).toHaveLength(0);
      });

      it('the cachemap should have the correct size', () => {
        cachemap.delete(key, { hashKey: true });
        expect(cachemap.size).toBe(0);
      });

      it('the delete method should remove the key/value pair', () => {
        cachemap.delete(key, { hashKey: true });
        expect(cachemap.get(key, { hashKey: true })).toBeUndefined();
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
        name: 'integration-tests',
        type: 'integration-tests',
        valueFormatting: ValueFormat.Base64,
      });
    });

    describe('when a matching entry does not exist', () => {
      it('the get method should return undefined', () => {
        const entry = cachemap.get(key, { hashKey: true });
        expect(entry).toBeUndefined();
      });
    });

    describe('when a matching entry exists', () => {
      let metadata: Metadata;

      beforeEach(() => {
        cachemap.set(key, value, { cacheOptions, hashKey: true });
        metadata = { ...cachemap.metadata[0]! };
      });

      it('the get method should return the entry value', () => {
        const entry = cachemap.get(key, { hashKey: true });
        expect(entry).toEqual(value);
      });

      it('the get method should store the correct amount of metadata', () => {
        cachemap.get(key, { hashKey: true });
        expect(cachemap.metadata).toHaveLength(1);
      });

      it("the get method should update the existing entry's metadata", () => {
        cachemap.get(key, { hashKey: true });
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
        cachemap.get(key, { hashKey: true });
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
        name: 'integration-tests',
        type: 'integration-tests',
        valueFormatting: ValueFormat.Base64,
      });
    });

    describe('when a matching entry does not exist', () => {
      it('the has method should return false', () => {
        const exists = cachemap.has(key, { hashKey: true });
        expect(exists).toBe(false);
      });
    });

    describe('when a matching entry exists', () => {
      describe("when the entry's cacheability is valid", () => {
        beforeEach(() => {
          cachemap.set(key, value, { cacheOptions, hashKey: true });
        });

        it('the has method should return true', () => {
          const exists = cachemap.has(key, { hashKey: true });
          expect(exists).toBe(true);
        });
      });

      describe("when the entry's cacheability is expired", () => {
        beforeEach(async () => {
          cachemap.set(key, value, { cacheOptions, hashKey: true });
          await delay(1000);
        });

        it('the has method should return false', () => {
          const exists = cachemap.has(key, { hashKey: true });
          expect(exists).toBe(false);
        });

        it('the has method should remove the entry metadata', () => {
          cachemap.has(key, { hashKey: true });
          expect(cachemap.metadata).toHaveLength(0);
        });

        it('the cachemap should have the correct size', () => {
          cachemap.has(key, { hashKey: true });
          expect(cachemap.size).toBe(0);
        });

        it('the has method should remove the key/value pair', () => {
          cachemap.has(key, { hashKey: true });
          expect(cachemap.get(key, { hashKey: true })).toBeUndefined();
        });
      });
    });
  });

  describe('retrieving multiple entries from the cachemap', () => {
    const cacheOptions: PlainObject = { cacheControl: 'public, max-age=1' };

    beforeEach(() => {
      cachemap = new Core({
        name: 'integration-tests',
        type: 'integration-tests',
        valueFormatting: ValueFormat.Base64,
      });
    });

    describe('when no keys are passed in', () => {
      beforeEach(() => {
        const keys = Object.keys(testData);

        for (const id of keys) {
          cachemap.set(testData[id]!.url, testData[id]!.body, { cacheOptions, hashKey: true });
        }
      });

      it('the entries method should return all the key/value pair entries', () => {
        expect(cachemap.entries()).toHaveLength(3);
      });
    });

    describe('when keys are passed in', () => {
      const hashedKeys: string[] = [];

      beforeEach(() => {
        const ids = Object.keys(testData);

        for (const id of ids) {
          const url = testData[id]!.url;
          hashedKeys.push(Md5.hashStr(url));
          cachemap.set(url, testData[id]!.body, { cacheOptions, hashKey: true });
        }
      });

      it('the entries method should return the matching key/value pair entries', () => {
        expect(cachemap.entries(hashedKeys.slice(0, 2))).toHaveLength(2);
      });
    });
  });

  describe('retrieving multiple entries and their metadata from the cachemap', () => {
    const cacheOptions: PlainObject = { cacheControl: 'public, max-age=1' };

    beforeEach(() => {
      cachemap = new Core({
        name: 'integration-tests',
        type: 'integration-tests',
        valueFormatting: ValueFormat.Base64,
      });
    });

    describe('when no keys are passed in', () => {
      beforeEach(() => {
        const keys = Object.keys(testData);

        for (const id of keys) {
          cachemap.set(testData[id]!.url, testData[id]!.body, { cacheOptions, hashKey: true });
        }
      });

      it('the export method should return all the key/value pair entries', async () => {
        const result = await cachemap.export();
        expect(result.entries).toHaveLength(3);
      });

      it('the export method should return all the metadata', async () => {
        const result = await cachemap.export();
        expect(result.metadata).toHaveLength(3);
      });
    });

    describe('when keys are passed in', () => {
      const hashedKeys: string[] = [];

      beforeEach(() => {
        const ids = Object.keys(testData);

        for (const id of ids) {
          const url = testData[id]!.url;
          hashedKeys.push(Md5.hashStr(url));
          cachemap.set(url, testData[id]!.body, { cacheOptions, hashKey: true });
        }
      });

      it('the export method should return all the key/value pair entries', async () => {
        const result = await cachemap.export({ keys: hashedKeys.slice(0, 2) });
        expect(result.entries).toHaveLength(2);
      });

      it('the export method should return all the metadata', async () => {
        const result = await cachemap.export({ keys: hashedKeys.slice(0, 2) });
        expect(result.metadata).toHaveLength(2);
      });
    });

    describe('when a tag is passed in', () => {
      beforeEach(() => {
        const keys = Object.keys(testData);
        const tags = ['alfa', 'bravo', 'charlie'];

        for (const id of keys) {
          const tag = tags.pop();
          cachemap.set(testData[id]!.url, testData[id]!.body, { cacheOptions, hashKey: true, tag });
        }
      });

      it('the export method should return all the key/value pair entries', async () => {
        const result = await cachemap.export({ tag: 'alfa' });
        expect(result.entries).toHaveLength(1);
      });

      it('the export method should return all the metadata', async () => {
        const result = await cachemap.export({ tag: 'alfa' });
        expect(result.metadata).toHaveLength(1);
      });
    });

    describe('when filterByValue is passed in', () => {
      beforeEach(() => {
        const keys = Object.keys(testData);

        for (const id of keys) {
          cachemap.set(testData[id]!.url, testData[id]!.body, { cacheOptions, hashKey: true });
        }
      });

      it('the export method should return all the key/value pair entries', async () => {
        const result = await cachemap.export({ filterByValue: { comparator: '180-1387', keyChain: 'id' } });
        expect(result.entries).toHaveLength(1);
      });

      it('the export method should return all the metadata', async () => {
        const result = await cachemap.export({ filterByValue: { comparator: '180-1387', keyChain: 'id' } });
        expect(result.metadata).toHaveLength(1);
      });
    });
  });

  describe('adding multiple entries and their metadata to the cachemap', () => {
    const cacheOptions: PlainObject = { cacheControl: 'public, max-age=1' };

    beforeEach(() => {
      cachemap = new Core({
        name: 'integration-tests',
        type: 'integration-tests',
        valueFormatting: ValueFormat.Base64,
      });
    });

    describe('when no matching entries exist', () => {
      let exported: ExportResult<JsonValue>;

      beforeEach(async () => {
        const keys = Object.keys(testData);

        for (const id of keys) {
          cachemap.set(testData[id]!.url, testData[id]!.body, { cacheOptions, hashKey: true });
        }

        exported = await cachemap.export<JsonValue>();
        cachemap.clear();
      });

      it('the import method should add the key/value pair entries', async () => {
        await cachemap.import(exported);
        expect(cachemap.size).toBe(3);
      });

      it('the import method should add all the metadata', async () => {
        await cachemap.import(exported);
        expect(cachemap.metadata).toHaveLength(3);
      });
    });

    describe('when matching entries exist', () => {
      let exported: ExportResult<JsonValue>;

      beforeEach(async () => {
        const keys = Object.keys(testData);

        for (const id of keys) {
          cachemap.set(testData[id]!.url, testData[id]!.body, { cacheOptions, hashKey: true });
        }

        exported = await cachemap.export<JsonValue>();
      });

      it('the import method should add the key/value pair entries', async () => {
        await cachemap.import(exported);
        expect(cachemap.size).toBe(3);
      });

      it('the import method should add all the metadata', async () => {
        await cachemap.import(exported);
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
      let entryDeletedPromise: Promise<void>;
      let entryDeletedData: PlainObject;

      beforeEach(async () => {
        cachemap = new Core({
          name: 'integration-tests',
          reaper: reaper({ interval: 500, start: true }),
          type: 'integration-tests',
          valueFormatting: ValueFormat.Base64,
        });

        entryDeletedPromise = new Promise<void>(resolve => {
          cachemap.emitter.on(constants.ENTRY_DELETED, (data: PlainObject) => {
            entryDeletedData = data;
            resolve();
          });
        });

        cachemap.set(key, value, { cacheOptions, hashKey: true, tag: 'ALPHA' });
        await delay(1000);
      });

      afterEach(() => {
        cachemap.reaper?.stop();
      });

      it('the cachemap should have the correct size', async () => {
        await entryDeletedPromise;
        expect(cachemap.size).toBe(0);
      });

      it('the reaper should remove the key/value pair', async () => {
        await entryDeletedPromise;
        expect(cachemap.get(key, { hashKey: true })).toBeUndefined();
      });

      it('the reaper should remove the entry metadata', async () => {
        await entryDeletedPromise;
        expect(cachemap.metadata).toHaveLength(0);
      });

      it('the ENTRY_DELETED event should be emitted with the correct data', async () => {
        await entryDeletedPromise;

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
      let entryDeletedPromise: Promise<void>;
      let entryDeletedData: PlainObject[] = [];
      let keys: string[];

      beforeEach(() => {
        cachemap = new Core({
          maxHeapSize: 135,
          name: 'integration-tests',
          reaper: reaper({ start: true }),
          valueFormatting: ValueFormat.Base64,
        });

        entryDeletedPromise = new Promise<void>(resolve => {
          cachemap.emitter.on(constants.ENTRY_DELETED, (data: PlainObject) => {
            entryDeletedData.push(data);
            resolve();
          });
        });

        keys = Object.keys(testData);

        for (const _id of keys) {
          cachemap.set(testData[_id]!.url, testData[_id]!.body, { cacheOptions, hashKey: true });
        }
      });

      afterEach(() => {
        entryDeletedData = [];
        cachemap.reaper?.stop();
      });

      it('the cachemap should have the correct size', async () => {
        await entryDeletedPromise;
        expect(cachemap.size).toBe(2);
      });

      it('the reaper should remove the necessary key/value pair', async () => {
        await entryDeletedPromise;
        expect(cachemap.get(keys[2]!, { hashKey: true })).toBeUndefined();
      });

      it('the reaper should remove the entry metadata', async () => {
        await entryDeletedPromise;
        expect(cachemap.metadata).toHaveLength(2);
      });

      it('the ENTRY_DELETED event should fire the correct number of times', async () => {
        await entryDeletedPromise;
        expect(entryDeletedData).toHaveLength(1);
      });

      it('the ENTRY_DELETED event should be emitted with the correct data', async () => {
        await entryDeletedPromise;

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
