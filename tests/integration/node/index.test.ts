/**
 * @jest-environment node
 */
import { run } from '../test-runner/index.ts';
import { init as map } from '@cachemap/map';
import { init as redis } from '@cachemap/redis';

describe.each`
  storeType      | store    | storeOptions      | cachemapOptions
  ${'redisMock'} | ${redis} | ${{ mock: true }} | ${{}}
  ${'map'}       | ${map}   | ${{}}             | ${{}}
`('when store type is $storeType', run); // eslint-disable-line jest/valid-describe-callback
