/**
 * @jest-environment jsdom
 */
import { run } from '../test-runner/index.ts';

describe.each`
  storeType          | store | storeOptions | cachemapOptions
  ${'indexedDBMock'} | ${{}} | ${{}}        | ${{ worker: new Worker('worker.js') }}
`('when store type is $storeType', run); // eslint-disable-line jest/valid-describe-callback
