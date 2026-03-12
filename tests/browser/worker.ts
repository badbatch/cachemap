import { Core, ValueFormat } from '@cachemap/core';
import { registerWorker } from '@cachemap/core-worker';
import { init as indexedDB } from '@cachemap/indexed-db';

const cachemap = new Core({
  backupStore: indexedDB(),
  name: 'worker-integration-tests',
  valueFormatting: ValueFormat.Base64,
});

registerWorker({ cachemap });
