const _ = require('lodash');
const request = require('request-promise');

class AlphaVantage {
	constructor(keys) {
		this.keys = keys;
		this.API_URL = 'https://www.alphavantage.co/';

		this.keyIndex = 0;
	}

	_getKey () {
		return this.keys[this.keyIndex++ % this.keys.length];
	}

	_buildInfoUrl (ticker) {
		return `${this.API_URL}query?function=GLOBAL_QUOTE&symbol=${ticker}`
      + `&apikey=${this._getKey()}`;
	}

	_buildHistoricalUrl (ticker) {
		return `${this.API_URL}query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${ticker}`
      + `&apikey=${this._getKey()}`;
	}

	async getHistory (ticker) {
		const options = {
			uri: this._buildHistoricalUrl(ticker),
			json: true
		};

		console.log('AlphaVantage::getHistory %s', options.uri);
		const res = await request(options);
		return this._parseHistoryResponse(res);
	}

	async getInfo (ticker) {
		const options = {
			uri: this._buildInfoUrl(ticker),
			json: true
		};

		console.log('AlphaVantage::fetchInfo %s', options.uri);
		const res = await request(options);
		return this._parseInfoResponse(res);
	}

	async getActualPrices (ticker) {
		const info = await this.getInfo(ticker);
		console.log(info);
		return info.price;
	}

	_parseFieldName(key) {
		return _.camelCase(key.split('.')[1].trim());
	}

	_parseHistoryPrices (prices) {
		const numberFields = [
			'open',
			'high',
			'low',
			'close',
			'adjustedClose',
			'adjustedClose',
			'volume',
			'change',
			'dividendAmount',
			'splitCoefficient'
		];

		return _(prices)
			.mapKeys((val, key) => this._parseFieldName(key))
			.mapValues((val, key) =>
				numberFields.includes(key) ? Number(val) : val
			)
			.value();
	}

	_parseHistoryResponse (res) {
		if (!res['Time Series (Daily)'])
			return null;

		return {
			history: _(res['Time Series (Daily)'])
				.entries((val, key) => this._parseFieldName(key))
				.map(([date, prices]) => ({ date, ...this._parseHistoryPrices(prices) }))
				.value()
		};
	}

	_parseInfoResponse (res) {
		if (!res['Global Quote'] || !Object.keys(res['Global Quote']))
			return null;

		const numberFields = [
			'open',
			'high',
			'low',
			'price',
			'volume',
			'change'
		];

		const allowedKeys = [
			'symbol',
			'previousClose',
			...numberFields
		];

		const data = _(res['Global Quote'])
			.mapKeys((val, key) => this._parseFieldName(key))
			.mapValues((val, key) =>
				numberFields.includes(key) ? Number(val) : val
			)
			.pick(allowedKeys)
			.value();

		return data;
	}
}

module.exports = AlphaVantage;
