import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';
import Cachemap from '../../src';
import { localStorageMock, redisMock } from '../mocks';
import LocalStorageProxy from '../../src/local-storage-proxy';
import RedisProxy from '../../src/redis-proxy';

chai.use(dirtyChai);

describe('when WEB_ENV variable is not set to "true"', () => {
  describe('when no localStorageOptions are passed in', () => {
    it('should create an instance of the localStorage cachemap with the default options', () => {
      const cachemap = new Cachemap({ redisOptions: { db: 0, mock: redisMock } });
      expect(cachemap._map instanceof RedisProxy).to.be.true();
    });
  });
});

describe('when WEB_ENV variable is set to "true"', () => {
  describe('when no localStorageOptions are passed in', () => {
    it('should create an instance of the localStorage cachemap with the default options', () => {
      process.env.WEB_ENV = true;
      const cachemap = new Cachemap({ localStorageOptions: { mock: localStorageMock } });
      expect(cachemap._map instanceof LocalStorageProxy).to.be.true();
      process.env.WEB_ENV = false;
    });
  });
});
