const Promise = require('bluebird');
const Mutex = require('await-mutex').default;
const EventEmitter2 = require('eventemitter2').EventEmitter2;

class AbstractModel extends EventEmitter2 {
	constructor(config, cache, cacheKey) {
		super({
			wildcard: true,
			delimiter: '::',
			newListener: false,
		});

		this.config = config;
		this.cache = cache;
		this.cacheKey = cacheKey;

		this.mutex = new Mutex();

		// event handlers
		this.cache.on('expired', key => this._handleExpired(key));

		// cache data at the beginning
		if (config.fillCacheAtStart)
			setTimeout(() => this._initCache());
	}

	_initCache () {
		this._fetchDataLock();
	}

	_handleExpired(key) {
		console.log('Refreshing cache', this.cacheKey);
		if (key === this.cacheKey)
			this._fetchDataLock();
	}

	_getCacheData () {
		console.log('Cache::get', this.cacheKey);
		return this.cache.get(this.cacheKey);
	}

	_setCacheData (data) {
		console.log('Cache::set', this.cacheKey);

    process.nextTick(() => this.emit('data', data))
    return this.cache.set(this.cacheKey, data);
	}

	async _fetchDataLock () {
		let futures = this._getCacheData();

		if (!futures) {
			const isLocker = !this.mutex.isLocked();
			const unlock = await this.mutex.lock();

			if (isLocker) {
				try {
					futures = await this.fetchData();
					this._setCacheData(futures);
          unlock()
        } catch (err) {
					await Promise.delay(2000)
          unlock()
          futures = await this._fetchDataLock()
				}
			} else {
				futures = this._getCacheData();
      	unlock();
			}
		}

		return futures;
	}

	async fetchData() {
		throw new Error('_fetchDataLock method was not implemented!');
	}

	async getAll () {
		return this._fetchDataLock();
	}

	async getTicker (ticker) {
		const data = await this._fetchDataLock();
		return data[ticker];
	}

	async getTickers () {
		const data = await this._fetchDataLock();
		return Object.keys(data);
	}
}

module.exports = AbstractModel;
