import { Md5 } from 'ts-md5';
import { type JsonValue } from 'type-fest';
import { type ExportResult, type Metadata } from '@cachemap/core';
import { CoreWorker } from '@cachemap/core-worker';
import { testData } from '../data.ts';
import { type PlainObject } from '../types.ts';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

describe('when worker store type is indexedDB', () => {
  let cachemap: CoreWorker;
  let worker: Worker;

  beforeEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 999_999;
  });

  describe('adding an entry into the cachemap', () => {
    const id = '136-7317';
    const key = testData[id]!.url;
    const value = testData[id]!.body;
    const cacheOptions: PlainObject = { cacheControl: 'public, max-age=1' };

    beforeEach(async () => {
      worker = new Worker(new URL('worker.ts', import.meta.url));

      cachemap = new CoreWorker({
        name: 'indexedDB-integration-tests',
        worker,
      });

      await cachemap.ready;
    });

    afterEach(async () => {
      await cachemap.flush();
      worker.terminate();
    });

    describe('when a matching entry does not exist', () => {
      it('the write method should store the correct amount of metadata', async () => {
        await cachemap.write(key, value, { cacheOptions, hashKey: true });
        expect(cachemap.metadata).toHaveSize(1);
      });

      it('the write method should store the entry metadata', async () => {
        await cachemap.write(key, value, { cacheOptions, hashKey: true });
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
        await cachemap.write(key, value, { cacheOptions, hashKey: true });
        expect(cachemap.size).toBe(1);
      });

      it('the write method should store the key/value pair', async () => {
        await cachemap.write(key, value, { cacheOptions, hashKey: true });
        expect(await cachemap.fetch(key, { hashKey: true })).toEqual(value);
      });
    });

    describe('when a matching entry does exist', () => {
      let metadata: Metadata;

      beforeEach(async () => {
        await cachemap.write(key, { ...value, index: 0 }, { cacheOptions, hashKey: true });
        metadata = { ...cachemap.metadata[0]! };
      });

      it('the write method should store the correct amount of metadata', async () => {
        await cachemap.write(key, { ...value, index: 1 }, { cacheOptions, hashKey: true });
        expect(cachemap.metadata).toHaveSize(1);
      });

      it("the write method should update the existing entry's metadata", async () => {
        await cachemap.write(key, { ...value, index: 1 }, { cacheOptions, hashKey: true });
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

      it('the updated metadata cacheability should be greater than or equal to the existing', async () => {
        await cachemap.write(key, { ...value, index: 1 }, { cacheOptions, hashKey: true });
        const updatedMetadata = cachemap.metadata[0]!;
        expect(updatedMetadata.cacheability.metadata.ttl).toBeGreaterThanOrEqual(metadata.cacheability.metadata.ttl);
      });

      it('the updated metadata lastUpdated should be greater than or equal to the existing', async () => {
        await cachemap.write(key, { ...value, index: 1 }, { cacheOptions, hashKey: true });
        const updatedMetadata = cachemap.metadata[0]!;
        expect(updatedMetadata.lastUpdated).toBeGreaterThanOrEqual(metadata.lastUpdated);
      });

      it('the cachemap should have the correct size', async () => {
        await cachemap.write(key, { ...value, index: 1 }, { cacheOptions, hashKey: true });
        expect(cachemap.size).toBe(1);
      });

      it("the write method should overwrite the existing entry's key/value pair", async () => {
        await cachemap.write(key, { ...value, index: 1 }, { cacheOptions, hashKey: true });
        expect(await cachemap.fetch(key, { hashKey: true })).toEqual({ ...value, index: 1 });
      });
    });

    describe('when the same key is added twice in quick succession', () => {
      it('the write method should store the correct amount of metadata', async () => {
        await Promise.all([
          cachemap.write(key, { ...value, index: 0 }, { cacheOptions, hashKey: true }),
          cachemap.write(key, { ...value, index: 1 }, { cacheOptions, hashKey: true }),
        ]);

        expect(cachemap.metadata).toHaveSize(1);
      });

      it("the write method should store the first entry's metadata and then update it", async () => {
        await Promise.all([
          cachemap.write(key, { ...value, index: 0 }, { cacheOptions, hashKey: true }),
          cachemap.write(key, { ...value, index: 1 }, { cacheOptions, hashKey: true }),
        ]);

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
        await Promise.all([
          cachemap.write(key, { ...value, index: 0 }, { cacheOptions, hashKey: true }),
          cachemap.write(key, { ...value, index: 1 }, { cacheOptions, hashKey: true }),
        ]);

        expect(cachemap.size).toBe(1);
      });

      it("the write method should overwrite the first entry's key/value pair with the subsequent entry's", async () => {
        await Promise.all([
          cachemap.write(key, { ...value, index: 0 }, { cacheOptions, hashKey: true }),
          cachemap.write(key, { ...value, index: 1 }, { cacheOptions, hashKey: true }),
        ]);

        expect(await cachemap.fetch(key, { hashKey: true })).toEqual({ ...value, index: 1 });
      });
    });
  });

  describe('removing an entry from the cachemap', () => {
    const id = '136-7317';
    const key = testData[id]!.url;
    const value = testData[id]!.body;
    const cacheOptions: PlainObject = { cacheControl: 'public, max-age=1' };

    beforeEach(async () => {
      worker = new Worker(new URL('worker.ts', import.meta.url));

      cachemap = new CoreWorker({
        name: 'indexedDB-integration-tests',
        worker,
      });

      await cachemap.ready;
    });

    afterEach(async () => {
      await cachemap.flush();
      worker.terminate();
    });

    describe('when a matching entry does not exist', () => {
      it('the remove method should return false', async () => {
        const deleted = await cachemap.remove(key, { hashKey: true });
        expect(deleted).toBe(false);
      });
    });

    describe('when a matching entry does exist', () => {
      beforeEach(async () => {
        await cachemap.write(key, value, { cacheOptions, hashKey: true });
      });

      it('the remove method should return true', async () => {
        const deleted = await cachemap.remove(key, { hashKey: true });
        expect(deleted).toBe(true);
      });

      it('the remove method should remove the entry metadata', async () => {
        await cachemap.remove(key, { hashKey: true });
        expect(cachemap.metadata).toHaveSize(0);
      });

      it('the cachemap should have the correct size', async () => {
        await cachemap.remove(key, { hashKey: true });
        expect(cachemap.size).toBe(0);
      });

      it('the remove method should remove the key/value pair', async () => {
        await cachemap.remove(key, { hashKey: true });
        expect(await cachemap.fetch(key, { hashKey: true })).toBeUndefined();
      });
    });
  });

  describe('retrieving an entry from the cachemap', () => {
    const id = '136-7317';
    const key = testData[id]!.url;
    const value = testData[id]!.body;
    const cacheOptions: PlainObject = { cacheControl: 'public, max-age=1' };

    beforeEach(async () => {
      worker = new Worker(new URL('worker.ts', import.meta.url));

      cachemap = new CoreWorker({
        name: 'indexedDB-integration-tests',
        worker,
      });

      await cachemap.ready;
    });

    afterEach(async () => {
      await cachemap.flush();
      worker.terminate();
    });

    describe('when a matching entry does not exist', () => {
      it('the fetch method should return undefined', async () => {
        const entry = await cachemap.fetch(key, { hashKey: true });
        expect(entry).toBeUndefined();
      });
    });

    describe('when a matching entry exists', () => {
      let metadata: Metadata;

      beforeEach(async () => {
        await cachemap.write(key, value, { cacheOptions, hashKey: true });
        metadata = { ...cachemap.metadata[0]! };
      });

      it('the fetch method should return the entry value', async () => {
        const entry = await cachemap.fetch(key, { hashKey: true });
        expect(entry).toEqual(value);
      });

      it('the write method should store the correct amount of metadata', async () => {
        await cachemap.fetch(key, { hashKey: true });
        expect(cachemap.metadata).toHaveSize(1);
      });

      it("the fetch method should update the existing entry's metadata", async () => {
        await cachemap.fetch(key, { hashKey: true });
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

      it('the updated metadata lastAccessed should be greater than or equal to the existing', async () => {
        await cachemap.fetch(key, { hashKey: true });
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

    beforeEach(async () => {
      worker = new Worker(new URL('worker.ts', import.meta.url));

      cachemap = new CoreWorker({
        name: 'indexedDB-integration-tests',
        worker,
      });

      await cachemap.ready;
    });

    afterEach(async () => {
      await cachemap.flush();
      worker.terminate();
    });

    describe('when a matching entry does not exist', () => {
      it('the exists method should return false', async () => {
        const exists = await cachemap.exists(key, { hashKey: true });
        expect(exists).toBe(false);
      });
    });

    describe('when a matching entry exists', () => {
      describe("when the extry's cacheability is valid", () => {
        beforeEach(async () => {
          await cachemap.write(key, value, { cacheOptions, hashKey: true });
        });

        it('the exists method should return true', async () => {
          const exists = await cachemap.exists(key, { hashKey: true });
          expect(exists).toBeTrue();
        });
      });

      describe("when the entry's cacheability is expired", () => {
        beforeEach(async () => {
          await cachemap.write(key, value, { cacheOptions, hashKey: true });
          await delay(1000);
        });

        it('the exists method should return false', async () => {
          const exists = await cachemap.exists(key, { hashKey: true });
          expect(exists).toBe(false);
        });

        it('the exists method should remove the entry metadata', async () => {
          await cachemap.exists(key, { hashKey: true });
          expect(cachemap.metadata).toHaveSize(0);
        });

        it('the cachemap should have the correct size', async () => {
          await cachemap.exists(key, { hashKey: true });
          expect(cachemap.size).toBe(0);
        });

        it('the exists method should remove the key/value pair', async () => {
          await cachemap.exists(key, { hashKey: true });
          expect(await cachemap.fetch(key, { hashKey: true })).toBeUndefined();
        });
      });
    });
  });

  describe('retrieving multiple entries from the cachemap', () => {
    const cacheOptions: PlainObject = { cacheControl: 'public, max-age=1' };

    beforeEach(async () => {
      worker = new Worker(new URL('worker.ts', import.meta.url));

      cachemap = new CoreWorker({
        name: 'indexedDB-integration-tests',
        worker,
      });

      await cachemap.ready;
    });

    afterEach(async () => {
      await cachemap.flush();
      worker.terminate();
    });

    describe('when no keys are passed in', () => {
      beforeEach(async () => {
        const keys = Object.keys(testData);

        await Promise.all(
          keys.map(id => {
            return cachemap.write(testData[id]!.url, testData[id]!.body, { cacheOptions, hashKey: true });
          }),
        );
      });

      it('the entries method should return all the key/value pair entries', async () => {
        const result = await cachemap.fetchEntries();
        expect(result).toHaveSize(3);
      });
    });

    describe('when keys are passed in', () => {
      const hashedKeys: string[] = [];

      beforeEach(async () => {
        const ids = Object.keys(testData);

        await Promise.all(
          ids.map(id => {
            const url = testData[id]!.url;
            hashedKeys.push(Md5.hashStr(url));
            return cachemap.write(url, testData[id]!.body, { cacheOptions, hashKey: true });
          }),
        );
      });

      it('the entries method should return the matching key/value pair entries', async () => {
        const result = await cachemap.fetchEntries(hashedKeys.slice(0, 2));
        expect(result).toHaveSize(2);
      });
    });
  });

  describe('retrieving multiple entries and their metadata from the cachemap', () => {
    const cacheOptions: PlainObject = { cacheControl: 'public, max-age=1' };

    beforeEach(async () => {
      worker = new Worker(new URL('worker.ts', import.meta.url));

      cachemap = new CoreWorker({
        name: 'indexedDB-integration-tests',
        worker,
      });

      await cachemap.ready;
    });

    afterEach(async () => {
      await cachemap.flush();
      worker.terminate();
    });

    describe('when no keys are passed in', () => {
      beforeEach(async () => {
        const keys = Object.keys(testData);

        await Promise.all(
          keys.map(id => {
            return cachemap.write(testData[id]!.url, testData[id]!.body, { cacheOptions, hashKey: true });
          }),
        );
      });

      it('the export method should return all the key/value pair entries', async () => {
        const result = await cachemap.export();
        expect(result.entries).toHaveSize(3);
      });

      it('the export method should return all the metadata', async () => {
        const result = await cachemap.export();
        expect(result.metadata).toHaveSize(3);
      });
    });

    describe('when keys are passed in', () => {
      const hashedKeys: string[] = [];

      beforeEach(async () => {
        const ids = Object.keys(testData);

        await Promise.all(
          ids.map(id => {
            const url = testData[id]!.url;
            hashedKeys.push(Md5.hashStr(url));
            return cachemap.write(url, testData[id]!.body, { cacheOptions, hashKey: true });
          }),
        );
      });

      it('the export method should return all the key/value pair entries', async () => {
        const result = await cachemap.export({ keys: hashedKeys.slice(0, 2) });
        expect(result.entries).toHaveSize(2);
      });

      it('the export method should return all the metadata', async () => {
        const result = await cachemap.export({ keys: hashedKeys.slice(0, 2) });
        expect(result.metadata).toHaveSize(2);
      });
    });

    describe('when a tag is passed in', () => {
      beforeEach(async () => {
        const keys = Object.keys(testData);
        const tags = ['alfa', 'bravo', 'charlie'];

        await Promise.all(
          keys.map(id => {
            const tag = tags.pop();
            return cachemap.write(testData[id]!.url, testData[id]!.body, { cacheOptions, hashKey: true, tag });
          }),
        );
      });

      it('the export method should return all the key/value pair entries', async () => {
        const result = await cachemap.export({ tag: 'alfa' });
        expect(result.entries).toHaveSize(1);
      });

      it('the export method should return all the metadata', async () => {
        const result = await cachemap.export({ tag: 'alfa' });
        expect(result.metadata).toHaveSize(1);
      });
    });

    describe('when filterByValue is passed in', () => {
      beforeEach(async () => {
        const keys = Object.keys(testData);

        await Promise.all(
          keys.map(id => {
            return cachemap.write(testData[id]!.url, testData[id]!.body, { cacheOptions, hashKey: true });
          }),
        );
      });

      it('the export method should return all the key/value pair entries', async () => {
        const result = await cachemap.export({ filterByValue: { comparator: '180-1387', keyChain: 'id' } });
        expect(result.entries).toHaveSize(1);
      });

      it('the export method should return all the metadata', async () => {
        const result = await cachemap.export({ filterByValue: { comparator: '180-1387', keyChain: 'id' } });
        expect(result.metadata).toHaveSize(1);
      });
    });
  });

  describe('adding multiple entries and their metadata to the cachemap', () => {
    const cacheOptions: PlainObject = { cacheControl: 'public, max-age=1' };

    beforeEach(async () => {
      worker = new Worker(new URL('worker.ts', import.meta.url));

      cachemap = new CoreWorker({
        name: 'indexedDB-integration-tests',
        worker,
      });

      await cachemap.ready;
    });

    afterEach(async () => {
      await cachemap.flush();
      worker.terminate();
    });

    describe('when no matching entries exist', () => {
      let exported: ExportResult<JsonValue>;

      beforeEach(async () => {
        const keys = Object.keys(testData);

        await Promise.all(
          keys.map(id => {
            return cachemap.write(testData[id]!.url, testData[id]!.body, { cacheOptions, hashKey: true });
          }),
        );

        exported = await cachemap.export<JsonValue>();
        await cachemap.flush();
      });

      it('the import method should add the key/value pair entries', async () => {
        await cachemap.import(exported);
        expect(cachemap.size).toBe(3);
      });

      it('the import method should add all the metadata', async () => {
        await cachemap.import(exported);
        expect(cachemap.metadata).toHaveSize(3);
      });
    });

    describe('when matching entries exist', () => {
      let exported: ExportResult<JsonValue>;

      beforeEach(async () => {
        const keys = Object.keys(testData);

        await Promise.all(
          keys.map(id => {
            return cachemap.write(testData[id]!.url, testData[id]!.body, { cacheOptions, hashKey: true });
          }),
        );

        exported = await cachemap.export<JsonValue>();
      });

      it('the import method should add the key/value pair entries', async () => {
        await cachemap.import(exported);
        expect(cachemap.size).toBe(3);
      });

      it('the import method should add all the metadata', async () => {
        await cachemap.import(exported);
        expect(cachemap.metadata).toHaveSize(3);
      });
    });
  });
});
