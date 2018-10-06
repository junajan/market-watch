const Mutex = require('await-mutex').default;

class AbstractModel {
	constructor(config, cache, cacheKey) {
		this.config = config;
		this.cache = cache;
		this.cacheKey = cacheKey;

		this.mutex = new Mutex();

		// event handlers
		this.cache.on('expired', key => this._handleExpired(key));

		// cache data at the beginning
		if (config.fillCacheAtStart)
			process.nextTick(() => this.fetchData());
	}

	_handleExpired(key) {
		console.log('Refreshing cache', this.cacheKey);
		if (key === this.cacheKey)
			this._fetchDataLock();
	}

	_getCacheData () {
		return this.cache.get(this.cacheKey);
	}

	_setCacheData (data) {
		return this.cache.set(this.cacheKey, data);
	}

	async _fetchDataLock () {
		let futures = this._getCacheData();

		if (!futures) {
			const isLocker = !this.mutex.isLocked();
			const unlock = await this.mutex.lock();

			if (isLocker) {
				futures = await this.fetchData();
				this._setCacheData(futures);
			} else
				futures = this._getCacheData();

			unlock();
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
		const futures = await this._fetchDataLock();
		return futures[ticker];
	}

	async getTickers () {
		const futures = await this._fetchDataLock();
		return Object.keys(futures);
	}
}

module.exports = AbstractModel;
