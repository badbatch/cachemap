/**
 * @jest-environment jsdom
 */
import { run } from '../test-runner/index.ts';
import { init as indexedDB } from '@cachemap/indexed-db';
import { init as localStorage } from '@cachemap/local-storage';
import { init as map } from '@cachemap/map';

describe.each`
  storeType                   | store           | storeOptions | cachemapOptions
  ${'indexedDBMock'}          | ${indexedDB}    | ${{}}        | ${{}}
  ${'localStorageWithBackup'} | ${localStorage} | ${{}}        | ${{ backupStore: true, startBackup: true }}
  ${'localStorage'}           | ${localStorage} | ${{}}        | ${{}}
  ${'map'}                    | ${map}          | ${{}}        | ${{}}
`('when store type is $storeType', run); // eslint-disable-line jest/valid-describe-callback
