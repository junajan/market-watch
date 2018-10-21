const _ = require('lodash');
const moment = require('moment');
const AbstractModel = require('../core/abstractModel');
const Cboe = require('../clients/cboe');

class SpreadsModel extends AbstractModel {
	constructor(config, cache) {
		super(config, cache, 'spreads:data');

		this.DATE_FORMAT = 'MM/DD/YYYY';

		this.cboe = new Cboe();
		this.cache.on('set', (key, val) => {
			if (key === 'futures:data')
				this._refreshCache(val);
		});
	}

	_initCache () {
		// do nothing
	}

	_refreshCache (data) {
		const calculatedData = this._calculateAllSpreads(data);
		this.cache.set(this.cacheKey, calculatedData);
		this.emit('data', calculatedData);
	}

	_getPercentDiff (first, second) {
		const diff = second - first;
		return _.round(diff / first * 100, 2);
	}

	_getDaysToExpiration (date) {
		return moment(date, this.DATE_FORMAT).diff(moment(), 'days');
	}

	_calculateAllSpreads (data) {
		return _.mapValues(
			data, (futures, ticker) => this._calculateSpreads(futures, ticker)
		);
	}

	_calculateSpreads (futures, ticker) {
		const spreads = [];
		console.log('Calculate spreads for %s', ticker);

		// do only monthly spreads
		futures = futures.filter((future => isNaN(future.symbol[0])));

		for (let i = 1; i < futures.length; i++) {
			const firstLeg = futures[i - 1];
			const secondLeg = futures[i];

			spreads.push({
				first: firstLeg,
				second: secondLeg,
				isContango: secondLeg.last > firstLeg.last,
				diff: _.round(secondLeg.last - firstLeg.last, 4),
				diffPercent: this._getPercentDiff(firstLeg.last, secondLeg.last),
				daysToFirstExpiration: this._getDaysToExpiration(firstLeg.expiration),
				daysToSecondExpiration: this._getDaysToExpiration(firstLeg.expiration),
			});
		}
		return spreads;
	}

	_handleExpired () {
		// no action on
	}

	async fetchData () {
		// fetch futures and set tem to cache
		// recalculate all spreads on cache::set action
		const data = await this.cboe.getFutures();
		return this._calculateAllSpreads(data);
	}
}

let x = null;
module.exports = (...args) => {
	if(!x) x = new SpreadsModel(...args);
	return x;
};
