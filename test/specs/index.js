import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';
import Cachemap from '../../src';
import { localStorageMock, redisMock } from '../mocks';
import LocalStorageProxy from '../../src/local-storage-proxy';
import Reaper from '../../src/reaper';
import RedisProxy from '../../src/redis-proxy';

chai.use(dirtyChai);

describe('when WEB_ENV variable is not set to "true"', () => {
  describe('when no redisOptions are passed in', () => {
    it('should create an instance of the localStorage cachemap with the default options', () => {
      const cachemap = new Cachemap({ redisOptions: { db: 0, mock: redisMock } });
      expect(cachemap._map).instanceof(RedisProxy);
      expect(cachemap._metaDataStorage).instanceof(RedisProxy);
      expect(cachemap._name).to.eql('cachemap');
      expect(cachemap._reaper).instanceof(Reaper);
    });
  });
});

describe('when WEB_ENV variable is set to "true"', () => {
  describe('when no localStorageOptions are passed in', () => {
    it('should create an instance of the localStorage cachemap with the default options', () => {
      process.env.WEB_ENV = true;
      const cachemap = new Cachemap({ localStorageOptions: { mock: localStorageMock } });
      expect(cachemap._map).instanceof(LocalStorageProxy);
      expect(cachemap._maxHeapSize).to.eql(4194304);
      expect(cachemap._metaDataStorage).instanceof(LocalStorageProxy);
      expect(cachemap._name).to.eql('cachemap');
      expect(cachemap._reaper).instanceof(Reaper);
      delete process.env.WEB_ENV;
    });
  });
});

describe('the redis cachemap', () => {
  let cachemap, key, value;

  before(() => {
    cachemap = new Cachemap({ redisOptions: { db: 0, mock: redisMock } });
    key = 'https://www.tesco.com/direct/rest/content/catalog/product/136-7317';
    value = require('../data/136-7317.json'); // eslint-disable-line global-require
  });

  describe('the .set() method', () => {
    after(async () => {
      await cachemap.clear();
    });

    describe('when a new key/value is stored in the cachemap', () => {
      it('should store the key/value and add the meta data', async () => {
        await cachemap.set(key, value, { cacheControl: 'public, max-age=1', hash: true });
        expect(await cachemap.size()).to.eql(1);
        expect(cachemap.metaData.length).to.eql(1);
      });
    });

    describe('when a key already exists in the cachemap', () => {
      it('should store the key/value and update the meta data', async () => {
        await cachemap.set(key, value, { cacheControl: 'public, max-age=1', hash: true });
        expect(await cachemap.size()).to.eql(1);
        expect(cachemap.metaData).lengthOf(1);
        const metaEntry = cachemap.metaData[0];
        expect(metaEntry.lastAccessed).to.be.null();
        expect(metaEntry.lastUpdated).to.be.a('number');
      });
    });
  });

  describe('the .has() method', () => {
    before(async () => {
      await cachemap.set(key, value, { cacheControl: 'public, max-age=1', hash: true });
    });

    describe('when a valid key exists in the cachemap', () => {
      it('should return true', async () => {
        expect(await cachemap.has(key, { hash: true })).to.be.true();
      });
    });

    describe('when an expired key exists in the cachemap', () => {
      it('should return false and delete the expired key/value', (done) => {
        setTimeout(async () => {
          expect(await cachemap.has(key, { checkMeta: false, hash: true })).to.be.true();
          expect(await cachemap.has(key, { hash: true })).to.be.false();
          expect(await cachemap.size()).to.eql(0);
          expect(cachemap.metaData).lengthOf(0);
          done();
        }, 1000);
      });
    });

    describe('when no key exists in the cachemap', () => {
      it('should return false', async () => {
        expect(await cachemap.has(key, { hash: true })).to.be.false();
      });
    });
  });

  describe('the .get() method', () => {
    describe('when a valid key exists in the cachemap', () => {
      before(async () => {
        await cachemap.set(key, value, { cacheControl: 'public, max-age=1', hash: true });
      });

      after(async () => {
        await cachemap.delete(key, { hash: true });
      });

      it('should return the value and update the meta data', async () => {
        expect(await cachemap.get(key, { hash: true })).to.eql(value);
        const metaEntry = cachemap.metaData[0];
        expect(metaEntry.lastAccessed).to.be.a('number');
        expect(metaEntry.accessedCount).to.eql(1);
      });
    });

    describe('when no key exists in the cachemap', () => {
      it('should return null', async () => {
        expect(await cachemap.get(key, { hash: true })).to.be.null();
      });
    });
  });

  describe('the .delete() method', () => {
    describe('when a valid key exists in the cachemap', () => {
      before(async () => {
        await cachemap.set(key, value, { cacheControl: 'public, max-age=1', hash: true });
      });

      it('should delete the value and the meta data', async () => {
        expect(await cachemap.size()).to.eql(1);
        expect(cachemap.metaData).lengthOf(1);
        expect(await cachemap.delete(key, { hash: true })).to.be.true();
        expect(await cachemap.size()).to.eql(0);
        expect(cachemap.metaData).lengthOf(0);
      });
    });
  });
});

describe('the localStorage cachemap', () => {
  let cachemap, key, value;

  before(() => {
    process.env.WEB_ENV = true;
    cachemap = new Cachemap({ localStorageOptions: { mock: localStorageMock } });
    key = 'https://www.tesco.com/direct/rest/content/catalog/product/136-7317';
    value = require('../data/136-7317.json'); // eslint-disable-line global-require
  });

  after(() => {
    delete process.env.WEB_ENV;
  });

  describe('the .set() method', () => {
    after(async () => {
      await cachemap.clear();
    });

    describe('when a new key/value is stored in the cachemap', () => {
      it('should store the key/value and add the meta data', async () => {
        await cachemap.set(key, value, { cacheControl: 'public, max-age=1', hash: true });
        expect(await cachemap.size()).to.eql(1);
        expect(cachemap.metaData.length).to.eql(1);
      });
    });

    describe('when a key already exists in the cachemap', () => {
      it('should store the key/value and update the meta data', async () => {
        await cachemap.set(key, value, { cacheControl: 'public, max-age=1', hash: true });
        expect(await cachemap.size()).to.eql(1);
        expect(cachemap.metaData).lengthOf(1);
        const metaEntry = cachemap.metaData[0];
        expect(metaEntry.lastAccessed).to.be.null();
        expect(metaEntry.lastUpdated).to.be.a('number');
      });
    });
  });

  describe('the .has() method', () => {
    before(async () => {
      await cachemap.set(key, value, { cacheControl: 'public, max-age=1', hash: true });
    });

    describe('when a valid key exists in the cachemap', () => {
      it('should return true', async () => {
        expect(await cachemap.has(key, { hash: true })).to.be.true();
      });
    });

    describe('when an expired key exists in the cachemap', () => {
      it('should return false and delete the expired key/value', (done) => {
        setTimeout(async () => {
          expect(await cachemap.has(key, { checkMeta: false, hash: true })).to.be.true();
          expect(await cachemap.has(key, { hash: true })).to.be.false();
          expect(await cachemap.size()).to.eql(0);
          expect(cachemap.metaData).lengthOf(0);
          done();
        }, 1000);
      });
    });

    describe('when no key exists in the cachemap', () => {
      it('should return false', async () => {
        expect(await cachemap.has(key, { hash: true })).to.be.false();
      });
    });
  });

  describe('the .get() method', () => {
    describe('when a valid key exists in the cachemap', () => {
      before(async () => {
        await cachemap.set(key, value, { cacheControl: 'public, max-age=1', hash: true });
      });

      after(async () => {
        await cachemap.delete(key, { hash: true });
      });

      it('should return the value and update the meta data', async () => {
        expect(await cachemap.get(key, { hash: true })).to.eql(value);
        const metaEntry = cachemap.metaData[0];
        expect(metaEntry.lastAccessed).to.be.a('number');
        expect(metaEntry.accessedCount).to.eql(1);
      });
    });

    describe('when no key exists in the cachemap', () => {
      it('should return null', async () => {
        expect(await cachemap.get(key, { hash: true })).to.be.null();
      });
    });
  });

  describe('the .delete() method', () => {
    describe('when a valid key exists in the cachemap', () => {
      before(async () => {
        await cachemap.set(key, value, { cacheControl: 'public, max-age=1', hash: true });
      });

      it('should delete the value and the meta data', async () => {
        expect(await cachemap.size()).to.eql(1);
        expect(cachemap.metaData).lengthOf(1);
        expect(await cachemap.delete(key, { hash: true })).to.be.true();
        expect(await cachemap.size()).to.eql(0);
        expect(cachemap.metaData).lengthOf(0);
      });
    });
  });
});
