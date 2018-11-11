const AlphaVantage = require('../clients/alphavantage');

class AvModel {
	constructor (config, cache) {
		this.config = config;
		this.cache = cache;

		this.alphaVantage = new AlphaVantage(this.config.alphaVantageKey);
	}

	async getHistory (ticker) {
		return this.alphaVantage.getHistory(ticker);
	}

	async getActual (ticker) {
		return this.alphaVantage.getActualPrices(ticker);
	}

	async getInfo (ticker) {
		return this.alphaVantage.getInfo(ticker);
	}
}

let x = null;
module.exports = (...args) => {
	if(!x) x = new AvModel(...args);
	return x;
};
