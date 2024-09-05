import { Core, ValueFormat } from '@cachemap/core';
import { registerWorker } from '@cachemap/core-worker';
import { init as indexedDB } from '@cachemap/indexed-db';

const cachemap = new Core({
  name: 'worker-integration-tests',
  store: indexedDB(),
  type: 'integration-tests',
  valueFormatting: ValueFormat.Base64,
});

registerWorker({ cachemap });
