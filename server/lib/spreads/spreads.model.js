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
		this._setCacheData(calculatedData)
	}

	_getPercentDiff (first, second) {
		const diff = second - first;
		return _.round(diff / first * 100, 2);
	}

	_calculateAllSpreads (data) {
		return _.mapValues(
			data, (futures, ticker) => this._calculateSpreads(futures, ticker)
		);
	}

	_calculateDiffPrice (firstPrice, secondPrice) {
		return firstPrice + secondPrice
			? {
				isContango: firstPrice < secondPrice,
				diff: _.round(secondPrice - firstPrice, 4),
				diffPercent: this._getPercentDiff(secondPrice, firstPrice),
			}
			: null;
	}

	_calculateDiffChange (firstLeg, secondLeg) {
		return firstLeg.last + secondLeg.last
			? _.round(firstLeg.change - secondLeg.change, 3)
			: null;
	}

	_calculateSpreads (futures, ticker) {
		const spreads = [];
		console.log('Calculate spreads for %s', ticker);

		// do only monthly spreads
		futures = futures.filter((future => isNaN(future.symbol[0])));

		const calculatedAt = +new Date();
		for (let i = 1; i < futures.length; i++) {
			const firstLeg = futures[i - 1];
			const secondLeg = futures[i];

			spreads.push({
				first: firstLeg,
				second: secondLeg,
				last: this._calculateDiffPrice(firstLeg.last, secondLeg.last),
				change: this._calculateDiffChange(firstLeg, secondLeg),
				high: this._calculateDiffPrice(firstLeg.high, secondLeg.high),
				low: this._calculateDiffPrice(firstLeg.low, secondLeg.low),
				volume: Math.min(firstLeg.volume, secondLeg.volume),
				calculatedAt,
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
