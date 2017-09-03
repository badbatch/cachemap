import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';
import data from '../data';
import Cachemap from '../../src';
import { localStorageMock, redisMock } from '../mocks';
import LocalStorageProxy from '../../src/local-storage-proxy';
import MapProxy from '../../src/map-proxy';
import Reaper from '../../src/reaper';
import RedisProxy from '../../src/redis-proxy';

chai.use(dirtyChai);

describe('when WEB_ENV variable is not set to "true"', () => {
  describe('when no redisOptions are passed in', () => {
    it('should create an instance of the redis cachemap with the default options', () => {
      const cachemap = new Cachemap({ redisOptions: { db: 0, mock: redisMock } });
      expect(cachemap._store).instanceof(RedisProxy);
      expect(cachemap._maxHeapSize).to.eql(4194304);
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
      expect(cachemap._store).instanceof(LocalStorageProxy);
      expect(cachemap._name).to.eql('cachemap');
      expect(cachemap._reaper).instanceof(Reaper);
      delete process.env.WEB_ENV;
    });
  });
});

describe('when storageType is set to "map"', () => {
  it('should create an instance of the map cachemap with the default options', () => {
    process.env.WEB_ENV = true;
    const cachemap = new Cachemap({ storageType: 'map' });
    expect(cachemap._store).instanceof(MapProxy);
    expect(cachemap._name).to.eql('cachemap');
    expect(cachemap._reaper).instanceof(Reaper);
    delete process.env.WEB_ENV;
  });
});

describe('the redis cachemap', () => {
  let cachemap, key, value;

  before(() => {
    cachemap = new Cachemap({ redisOptions: { db: 0, mock: redisMock } });
    key = data['136-7317'].url;
    value = data['136-7317'].body;
  });

  describe('the .set() method', () => {
    after(async () => {
      await cachemap.clear();
    });

    describe('when a new key/value is stored in the cachemap', () => {
      it('should store the key/value and add the meta data', async () => {
        await cachemap.set(key, value, { cacheHeaders: { cacheControl: 'public, max-age=1' }, hash: true });
        expect(await cachemap.size()).to.eql(2);
        expect(cachemap.metadata.length).to.eql(1);
      });
    });

    describe('when a key already exists in the cachemap', () => {
      it('should store the key/value and update the meta data', async () => {
        await cachemap.set(key, value, { cacheHeaders: { cacheControl: 'public, max-age=1' }, hash: true });
        expect(await cachemap.size()).to.eql(2);
        expect(cachemap.metadata).lengthOf(1);
        const metaEntry = cachemap.metadata[0];
        expect(metaEntry.lastAccessed).to.be.null();
        expect(metaEntry.lastUpdated).to.be.a('number');
      });
    });
  });

  describe('the .has() method', () => {
    before(async () => {
      await cachemap.set(key, value, { cacheHeaders: { cacheControl: 'public, max-age=1' }, hash: true });
    });

    describe('when a key exists in the cachemap', () => {
      it('should return the key cacheability metadata', async () => {
        const cacheability = await cachemap.has(key, { hash: true });
        const cacheControl = cacheability.metadata.cacheControl;
        expect(cacheControl.public).to.be.true();
        expect(cacheControl.maxAge).to.eql(1);
      });
    });

    describe('when an expired key exists in the cachemap and deleteExpired is passed in', () => {
      it('should return false and delete the expired key/value', (done) => {
        setTimeout(async () => {
          expect(await cachemap.has(key, { hash: true })).to.be.a('object');
          expect(await cachemap.has(key, { deleteExpired: true, hash: true })).to.be.false();
          expect(await cachemap.size()).to.eql(1);
          expect(cachemap.metadata).lengthOf(0);
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
        await cachemap.set(key, value, { cacheHeaders: { cacheControl: 'public, max-age=1' }, hash: true });
      });

      after(async () => {
        await cachemap.delete(key, { hash: true });
      });

      it('should return the value and update the meta data', async () => {
        expect(await cachemap.get(key, { hash: true })).to.eql(value);
        const metaEntry = cachemap.metadata[0];
        expect(metaEntry.lastAccessed).to.be.a('number');
        expect(metaEntry.accessedCount).to.eql(1);
        expect(metaEntry.cacheability.printCacheControl()).to.eql('public, max-age=1');
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
        await cachemap.set(key, value, { cacheHeaders: { cacheControl: 'public, max-age=1' }, hash: true });
      });

      it('should delete the key/value and the meta data', async () => {
        expect(await cachemap.size()).to.eql(2);
        expect(cachemap.metadata).lengthOf(1);
        expect(await cachemap.delete(key, { hash: true })).to.be.true();
        expect(await cachemap.size()).to.eql(1);
        expect(cachemap.metadata).lengthOf(0);
      });
    });
  });
});

describe('the localStorage cachemap', () => {
  let cachemap, key, value;

  before(() => {
    process.env.WEB_ENV = true;
    cachemap = new Cachemap({ localStorageOptions: { mock: localStorageMock } });
    key = data['136-7317'].url;
    value = data['136-7317'].body;
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
        await cachemap.set(key, value, { cacheHeaders: { cacheControl: 'public, max-age=1' }, hash: true });
        expect(await cachemap.size()).to.eql(2);
        expect(cachemap.metadata.length).to.eql(1);
      });
    });

    describe('when a key already exists in the cachemap', () => {
      it('should store the key/value and update the meta data', async () => {
        await cachemap.set(key, value, { cacheHeaders: { cacheControl: 'public, max-age=1' }, hash: true });
        expect(await cachemap.size()).to.eql(2);
        expect(cachemap.metadata).lengthOf(1);
        const metaEntry = cachemap.metadata[0];
        expect(metaEntry.lastAccessed).to.be.null();
        expect(metaEntry.lastUpdated).to.be.a('number');
      });
    });
  });

  describe('the .has() method', () => {
    before(async () => {
      await cachemap.set(key, value, { cacheHeaders: { cacheControl: 'public, max-age=1' }, hash: true });
    });

    describe('when a key exists in the cachemap', () => {
      it('should return true', async () => {
        const cacheability = await cachemap.has(key, { hash: true });
        const cacheControl = cacheability.metadata.cacheControl;
        expect(cacheControl.public).to.be.true();
        expect(cacheControl.maxAge).to.eql(1);
      });
    });

    describe('when an expired key exists in the cachemap and deleteExpired is passed in', () => {
      it('should return false and delete the expired key/value', (done) => {
        setTimeout(async () => {
          expect(await cachemap.has(key, { hash: true })).to.be.a('object');
          expect(await cachemap.has(key, { deleteExpired: true, hash: true })).to.be.false();
          expect(await cachemap.size()).to.eql(1);
          expect(cachemap.metadata).lengthOf(0);
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
        await cachemap.set(key, value, { cacheHeaders: { cacheControl: 'public, max-age=1' }, hash: true });
      });

      after(async () => {
        await cachemap.delete(key, { hash: true });
      });

      it('should return the value and update the meta data', async () => {
        expect(await cachemap.get(key, { hash: true })).to.eql(value);
        const metaEntry = cachemap.metadata[0];
        expect(metaEntry.lastAccessed).to.be.a('number');
        expect(metaEntry.accessedCount).to.eql(1);
        expect(metaEntry.cacheability.printCacheControl()).to.eql('public, max-age=1');
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
        await cachemap.set(key, value, { cacheHeaders: { cacheControl: 'public, max-age=1' }, hash: true });
      });

      it('should delete the key/value and the meta data', async () => {
        expect(await cachemap.size()).to.eql(2);
        expect(cachemap.metadata).lengthOf(1);
        expect(await cachemap.delete(key, { hash: true })).to.be.true();
        expect(await cachemap.size()).to.eql(1);
        expect(cachemap.metadata).lengthOf(0);
      });
    });
  });
});

describe('the map cachemap', () => {
  let cachemap, key, value;

  before(() => {
    process.env.WEB_ENV = true;
    cachemap = new Cachemap({ storageType: 'map' });
    key = data['136-7317'].url;
    value = data['136-7317'].body;
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
        await cachemap.set(key, value, { cacheHeaders: { public: true, maxAge: 1 }, hash: true });
        expect(await cachemap.size()).to.eql(2);
        expect(cachemap.metadata.length).to.eql(1);
      });
    });

    describe('when a key already exists in the cachemap', () => {
      it('should store the key/value and update the meta data', async () => {
        await cachemap.set(key, value, { cacheHeaders: { public: true, maxAge: 1 }, hash: true });
        expect(await cachemap.size()).to.eql(2);
        expect(cachemap.metadata).lengthOf(1);
        const metaEntry = cachemap.metadata[0];
        expect(metaEntry.lastAccessed).to.be.null();
        expect(metaEntry.lastUpdated).to.be.a('number');
      });
    });
  });

  describe('the .has() method', () => {
    before(async () => {
      await cachemap.set(key, value, { cacheHeaders: { cacheControl: 'public, max-age=1' }, hash: true });
    });

    describe('when a key exists in the cachemap', () => {
      it('should return true', async () => {
        const cacheability = await cachemap.has(key, { hash: true });
        const cacheControl = cacheability.metadata.cacheControl;
        expect(cacheControl.public).to.be.true();
        expect(cacheControl.maxAge).to.eql(1);
      });
    });

    describe('when an expired key exists in the cachemap and deleteExpired is passed in', () => {
      it('should return false and delete the expired key/value', (done) => {
        setTimeout(async () => {
          expect(await cachemap.has(key, { hash: true })).to.be.a('object');
          expect(await cachemap.has(key, { deleteExpired: true, hash: true })).to.be.false();
          expect(await cachemap.size()).to.eql(1);
          expect(cachemap.metadata).lengthOf(0);
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
        await cachemap.set(key, value, { cacheHeaders: { cacheControl: 'public, max-age=1' }, hash: true });
      });

      after(async () => {
        await cachemap.delete(key, { hash: true });
      });

      it('should return the value and update the meta data', async () => {
        expect(await cachemap.get(key, { hash: true })).to.eql(value);
        const metaEntry = cachemap.metadata[0];
        expect(metaEntry.lastAccessed).to.be.a('number');
        expect(metaEntry.accessedCount).to.eql(1);
        expect(metaEntry.cacheability.printCacheControl()).to.eql('public, max-age=1');
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
        await cachemap.set(key, value, { cacheHeaders: { public: true, maxAge: 1 }, hash: true });
      });

      it('should delete the key/value and the meta data', async () => {
        expect(await cachemap.size()).to.eql(2);
        expect(cachemap.metadata).lengthOf(1);
        expect(await cachemap.delete(key, { hash: true })).to.be.true();
        expect(await cachemap.size()).to.eql(1);
        expect(cachemap.metadata).lengthOf(0);
      });
    });
  });
});

describe('the reaper', () => {
  describe('when a key/value in the cachemap has expired', () => {
    let cachemap;

    before(async () => {
      cachemap = new Cachemap({
        reaperOptions: { interval: 1100 },
        redisOptions: { db: 0, mock: redisMock },
      });

      await cachemap.set(
        data['136-7317'].url,
        data['136-7317'].body,
        { cacheHeaders: { cacheControl: 'public, max-age=1' }, hash: true },
      );
    });

    it('should delete the key/value and the meta data', async () => {
      expect(await cachemap.size()).to.eql(2);
      expect(cachemap.metadata).lengthOf(1);
      const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
      await delay(1100);
      expect(await cachemap.size()).to.eql(1);
      expect(cachemap.metadata).lengthOf(0);
    });
  });

  describe('when the cachemap heap size exceeds the limit', () => {
    let cachemap, last;

    before(async () => {
      process.env.WEB_ENV = true;

      cachemap = new Cachemap({
        localStorageOptions: { mock: localStorageMock }, maxHeapSize: 30000,
      });

      const keys = Object.keys(data);
      last = keys.splice(3, 1);
      const promises = [];

      keys.forEach((key) => {
        promises.push(cachemap.set(data[key].url, data[key].body, {
          cacheHeaders: { cacheControl: 'public, max-age=1' }, hash: true,
        }));
      });

      await Promise.all(promises);
    });

    after(() => {
      delete process.env.WEB_ENV;
    });

    it('should delete the necessary key/values', async () => {
      expect(await cachemap.size()).to.eql(4);
      expect(cachemap.metadata).lengthOf(3);
      expect(cachemap.usedHeapSize).to.eql(28026);

      await cachemap.set(data[last[0]].url, data[last[0]].body, {
        cacheHeaders: { cacheControl: 'public, max-age=1' }, hash: true,
      });

      expect(await cachemap.size()).to.eql(4);
      expect(cachemap.metadata).lengthOf(3);
      expect(cachemap.usedHeapSize).to.eql(21818);
    });
  });
});
