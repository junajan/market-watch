const request = require('request-promise');

class Iex {
	constructor() {
		this.API_URL = 'https://api.iextrading.com/';
	}

	_buildHistoricalUrl (ticker, timeRange = '6m') {
		return `${this.API_URL}1.0/stock/${ticker}/chart/${timeRange}`;
	}

	_buildActualUrl (ticker) {
		return `${this.API_URL}1.0/stock/${ticker}/price`;
	}

	_buildInfoUrl (ticker) {
		return `${this.API_URL}1.0/stock/${ticker}/quote`;
	}

	async getHistoricalPrices (ticker, timeRange = '6m') {
		const options = {
			uri: this._buildHistoricalUrl(ticker, timeRange),
			json: true
		};

		console.log('Iex::fetchHistorical %s', options.uri);
		return await request(options);
	}

	async getActualPrices (ticker) {
		const options = {
			uri: this._buildActualUrl(ticker),
			json: true
		};

		console.log('Iex::fetchActual %s', options.uri);
		return await request(options);
	}

	async getInfo (ticker) {
		const options = {
			uri: this._buildInfoUrl(ticker),
			json: true
		};

		console.log('Iex::fetchInfo %s', options.uri);
		return await request(options);
	}
}

module.exports = Iex;
