import Core from '@cachemap/core';
import map from '@cachemap/map';
import redis from '@cachemap/redis';
import { run } from '../test-runner';

run({ cachemapSize: value => value, init: (options: any) => new Core(options) }, 'redis', redis, { mock: true });

run(
  {
    cachemapSize: value => value,
    init: (options: any) => new Core({ ...options, backupStore: true, startBackup: true }),
  },
  'redisBackup',
  redis,
  { mock: true }
);

run({ cachemapSize: value => value - 1, init: (options: any) => new Core(options) }, 'map', map);
