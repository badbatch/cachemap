import { type Cacheability } from 'cacheability';
import { Md5 } from 'ts-md5';
import { type JsonValue } from 'type-fest';
import { testData } from '../data.ts';
import { type PlainObject } from '../types.ts';
import { type ExportResult, type Metadata } from '@cachemap/core';
import { CoreWorker } from '@cachemap/core-worker';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

describe('when worker store type is indexedDB', () => {
  let cachemap: CoreWorker;

  afterEach(async () => {
    await cachemap.clear();
  });

  describe('adding an entry into the cachemap', () => {
    const id = '136-7317';
    const key = testData[id]!.url;
    const value = testData[id]!.body;
    const cacheHeaders: PlainObject = { cacheControl: 'public, max-age=1' };

    beforeEach(() => {
      cachemap = new CoreWorker({
        name: 'indexedDB-integration-tests',
        type: 'integration-tests',
        worker: new Worker(new URL('worker.ts', import.meta.url)),
      });
    });

    describe('when a matching entry does not exist', () => {
      beforeEach(async () => {
        await cachemap.set(key, value, { cacheHeaders, hashKey: true });
      });

      it('the set method should store the correct amount of metadata', () => {
        expect(cachemap.metadata).toHaveSize(1);
      });

      it('the set method should store the entry metadata', () => {
        const metadata = cachemap.metadata[0]!;

        expect(metadata).toEqual(
          // Not an issue for test file.
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          jasmine.objectContaining({
            accessedCount: 0,
            added: jasmine.any(Number),
            cacheability: jasmine.any(Object),
            key: Md5.hashStr(key),
            lastAccessed: jasmine.any(Number),
            lastUpdated: jasmine.any(Number),
            size: jasmine.any(Number),
            updatedCount: 0,
          }),
        );
      });

      it('the cachemap should have the correct size', async () => {
        expect(await cachemap.size()).toBe(1);
      });

      it('the set method should store the key/value pair', async () => {
        expect(await cachemap.get(key, { hashKey: true })).toEqual(value);
      });
    });

    describe('when a matching entry does exist', () => {
      let metadata: Metadata;

      beforeEach(async () => {
        await cachemap.set(key, { ...value, index: 0 }, { cacheHeaders, hashKey: true });
        metadata = { ...cachemap.metadata[0]! };
        await cachemap.set(key, { ...value, index: 1 }, { cacheHeaders, hashKey: true });
      });

      it('the set method should store the correct amount of metadata', () => {
        expect(cachemap.metadata).toHaveSize(1);
      });

      it("the set method should update the existing entry's metadata", () => {
        const updatedMetadata = cachemap.metadata[0]!;

        expect(updatedMetadata).toEqual(
          // Not an issue for test file.
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          jasmine.objectContaining({
            accessedCount: 0,
            added: metadata.added,
            cacheability: jasmine.any(Object),
            key: metadata.key,
            lastAccessed: metadata.lastAccessed,
            lastUpdated: jasmine.any(Number),
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
        expect(await cachemap.size()).toBe(1);
      });

      it("the set method should overwrite the existing entry's key/value pair", async () => {
        expect(await cachemap.get(key, { hashKey: true })).toEqual({ ...value, index: 1 });
      });
    });

    describe('when the same key is added twice in quick succession', () => {
      beforeEach(async () => {
        await Promise.all([
          cachemap.set(key, { ...value, index: 0 }, { cacheHeaders, hashKey: true }),
          cachemap.set(key, { ...value, index: 1 }, { cacheHeaders, hashKey: true }),
        ]);
      });

      it('the set method should store the correct amount of metadata', () => {
        expect(cachemap.metadata).toHaveSize(1);
      });

      it("the set method should store the first entry's metadata and then update it", () => {
        const metadata = cachemap.metadata[0]!;

        expect(metadata).toEqual(
          // Not an issue for test file.
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          jasmine.objectContaining({
            accessedCount: 0,
            added: jasmine.any(Number),
            cacheability: jasmine.any(Object),
            key: Md5.hashStr(key),
            lastAccessed: jasmine.any(Number),
            lastUpdated: jasmine.any(Number),
            size: jasmine.any(Number),
            updatedCount: 1,
          }),
        );
      });

      it('the cachemap should have the correct size', async () => {
        expect(await cachemap.size()).toBe(1);
      });

      it("the set method should overwrite the first entry's key/value pair with the subsequent entry's", async () => {
        expect(await cachemap.get(key, { hashKey: true })).toEqual({ ...value, index: 1 });
      });
    });
  });

  describe('removing an entry from the cachemap', () => {
    const id = '136-7317';
    const key = testData[id]!.url;
    const value = testData[id]!.body;
    const cacheHeaders: PlainObject = { cacheControl: 'public, max-age=1' };

    beforeEach(() => {
      cachemap = new CoreWorker({
        name: 'indexedDB-integration-tests',
        type: 'integration-tests',
        worker: new Worker(new URL('worker.ts', import.meta.url)),
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
        await cachemap.set(key, value, { cacheHeaders, hashKey: true });
        deleted = await cachemap.delete(key, { hashKey: true });
      });

      it('the delete method should return true', () => {
        expect(deleted).toBe(true);
      });

      it('the delete method should remove the entry metadata', () => {
        expect(cachemap.metadata).toHaveSize(0);
      });

      it('the cachemap should have the correct size', async () => {
        expect(await cachemap.size()).toBe(0);
      });

      it('the delete method should remove the key/value pair', async () => {
        expect(await cachemap.get(key, { hashKey: true })).toBeUndefined();
      });
    });
  });

  describe('retrieving an entry from the cachemap', () => {
    const id = '136-7317';
    const key = testData[id]!.url;
    const value = testData[id]!.body;
    const cacheHeaders: PlainObject = { cacheControl: 'public, max-age=1' };

    beforeEach(() => {
      cachemap = new CoreWorker({
        name: 'indexedDB-integration-tests',
        type: 'integration-tests',
        worker: new Worker(new URL('worker.ts', import.meta.url)),
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
        await cachemap.set(key, value, { cacheHeaders, hashKey: true });
        metadata = { ...cachemap.metadata[0]! };
        entry = await cachemap.get(key, { hashKey: true });
      });

      it('the get method should return the entry value', () => {
        expect(entry).toEqual(value);
      });

      it('the set method should store the correct amount of metadata', () => {
        expect(cachemap.metadata).toHaveSize(1);
      });

      it("the get method should update the existing entry's metadata", () => {
        const updatedMetadata = cachemap.metadata[0]!;

        expect(updatedMetadata).toEqual(
          // Not an issue for test file.
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          jasmine.objectContaining({
            accessedCount: 1,
            added: metadata.added,
            cacheability: jasmine.any(Object),
            key: Md5.hashStr(key),
            lastAccessed: jasmine.any(Number),
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
    const cacheHeaders: PlainObject = { cacheControl: 'public, max-age=1' };

    beforeEach(() => {
      cachemap = new CoreWorker({
        name: 'indexedDB-integration-tests',
        type: 'integration-tests',
        worker: new Worker(new URL('worker.ts', import.meta.url)),
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
          await cachemap.set(key, value, { cacheHeaders, hashKey: true });
          exists = await cachemap.has(key, { hashKey: true });
        });

        it("the has method should return the entry's Cacheability instance", () => {
          expect(exists).not.toBeFalse();
        });
      });

      describe("when the entry's cacheability is expired", () => {
        describe('when deleteExpired is not passed in as an option', () => {
          let exists: boolean | Cacheability;

          beforeEach(async () => {
            await cachemap.set(key, value, { cacheHeaders, hashKey: true });
            await delay(1000);
            exists = await cachemap.has(key, { hashKey: true });
          });

          it("the has method should return the entry's Cacheability instance", () => {
            expect(exists).not.toBeFalse();
          });

          it('the has method should not remove the entry metadata', () => {
            expect(cachemap.metadata).toHaveSize(1);
          });

          it('the cachemap should have the correct size', async () => {
            expect(await cachemap.size()).toBe(1);
          });

          it('the has method should not remove the key/value pair', async () => {
            expect(await cachemap.get(key, { hashKey: true })).toEqual(value);
          });
        });

        describe('when deleteExpired is passed in as an option', () => {
          let exists: boolean | Cacheability;

          beforeEach(async () => {
            await cachemap.set(key, value, { cacheHeaders, hashKey: true });
            await delay(1000);
            exists = await cachemap.has(key, { deleteExpired: true, hashKey: true });
          });

          it('the has method should return false', () => {
            expect(exists).toBe(false);
          });

          it('the has method should remove the entry metadata', () => {
            expect(cachemap.metadata).toHaveSize(0);
          });

          it('the cachemap should have the correct size', async () => {
            expect(await cachemap.size()).toBe(0);
          });

          it('the has method should remove the key/value pair', async () => {
            expect(await cachemap.get(key, { hashKey: true })).toBeUndefined();
          });
        });
      });
    });
  });

  describe('retrieving multiple entries from the cachemap', () => {
    const cacheHeaders: PlainObject = { cacheControl: 'public, max-age=1' };

    beforeEach(() => {
      cachemap = new CoreWorker({
        name: 'indexedDB-integration-tests',
        type: 'integration-tests',
        worker: new Worker(new URL('worker.ts', import.meta.url)),
      });
    });

    describe('when no keys are passed in', () => {
      let result: [string, unknown][];

      beforeEach(async () => {
        const keys = Object.keys(testData);

        await Promise.all(
          keys.map(id => {
            return cachemap.set(testData[id]!.url, testData[id]!.body, { cacheHeaders, hashKey: true });
          }),
        );

        result = await cachemap.entries();
      });

      it('the entries method should return all the key/value pair entries', () => {
        expect(result).toHaveSize(3);
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
            return cachemap.set(url, testData[id]!.body, { cacheHeaders, hashKey: true });
          }),
        );

        result = await cachemap.entries(hashedKeys.slice(0, 2));
      });

      it('the entries method should return the matching key/value pair entries', () => {
        expect(result).toHaveSize(2);
      });
    });
  });

  describe('retrieving multiple entries and their metadata from the cachemap', () => {
    const cacheHeaders: PlainObject = { cacheControl: 'public, max-age=1' };

    beforeEach(() => {
      cachemap = new CoreWorker({
        name: 'indexedDB-integration-tests',
        type: 'integration-tests',
        worker: new Worker(new URL('worker.ts', import.meta.url)),
      });
    });

    describe('when no keys are passed in', () => {
      let result: ExportResult<JsonValue>;

      beforeEach(async () => {
        const keys = Object.keys(testData);

        await Promise.all(
          keys.map(id => {
            return cachemap.set(testData[id]!.url, testData[id]!.body, { cacheHeaders, hashKey: true });
          }),
        );

        result = await cachemap.export();
      });

      it('the export method should return all the key/value pair entries', () => {
        expect(result.entries).toHaveSize(3);
      });

      it('the export method should return all the metadata', () => {
        expect(result.metadata).toHaveSize(3);
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
            return cachemap.set(url, testData[id]!.body, { cacheHeaders, hashKey: true });
          }),
        );

        result = await cachemap.export({ keys: hashedKeys.slice(0, 2) });
      });

      it('the export method should return all the key/value pair entries', () => {
        expect(result.entries).toHaveSize(2);
      });

      it('the export method should return all the metadata', () => {
        expect(result.metadata).toHaveSize(2);
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
            return cachemap.set(testData[id]!.url, testData[id]!.body, { cacheHeaders, hashKey: true, tag });
          }),
        );

        result = await cachemap.export({ tag: 'alfa' });
      });

      it('the export method should return all the key/value pair entries', () => {
        expect(result.entries).toHaveSize(1);
      });

      it('the export method should return all the metadata', () => {
        expect(result.metadata).toHaveSize(1);
      });
    });

    describe('when filterByValue is passed in', () => {
      let result: ExportResult<JsonValue>;

      beforeEach(async () => {
        const keys = Object.keys(testData);

        await Promise.all(
          keys.map(id => {
            return cachemap.set(testData[id]!.url, testData[id]!.body, { cacheHeaders, hashKey: true });
          }),
        );

        result = await cachemap.export({ filterByValue: { comparator: '180-1387', keyChain: 'id' } });
      });

      it('the export method should return all the key/value pair entries', () => {
        expect(result.entries).toHaveSize(1);
      });

      it('the export method should return all the metadata', () => {
        expect(result.metadata).toHaveSize(1);
      });
    });
  });

  describe('adding multiple entries and their metadata to the cachemap', () => {
    const cacheHeaders: PlainObject = { cacheControl: 'public, max-age=1' };

    beforeEach(() => {
      cachemap = new CoreWorker({
        name: 'indexedDB-integration-tests',
        type: 'integration-tests',
        worker: new Worker(new URL('worker.ts', import.meta.url)),
      });
    });

    describe('when no matching entries exist', () => {
      beforeEach(async () => {
        const keys = Object.keys(testData);

        await Promise.all(
          keys.map(id => {
            return cachemap.set(testData[id]!.url, testData[id]!.body, { cacheHeaders, hashKey: true });
          }),
        );

        const exported = await cachemap.export<JsonValue>();
        await cachemap.clear();
        await cachemap.import(exported);
      });

      it('the import method should add the key/value pair entries', async () => {
        expect(await cachemap.size()).toBe(3);
      });

      it('the import method should add all the metadata', () => {
        expect(cachemap.metadata).toHaveSize(3);
      });
    });

    describe('when matching entries exist', () => {
      beforeEach(async () => {
        const keys = Object.keys(testData);

        await Promise.all(
          keys.map(id => {
            return cachemap.set(testData[id]!.url, testData[id]!.body, { cacheHeaders, hashKey: true });
          }),
        );

        const exported = await cachemap.export<JsonValue>();
        await cachemap.import(exported);
      });

      it('the import method should add the key/value pair entries', async () => {
        expect(await cachemap.size()).toBe(3);
      });

      it('the import method should add all the metadata', () => {
        expect(cachemap.metadata).toHaveSize(3);
      });
    });
  });
});
