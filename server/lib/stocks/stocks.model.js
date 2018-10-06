const Iex = require('../clients/iex');

class StocksModel {
	constructor (config, cache) {
		this.config = config;
		this.cache = cache;

		this.iex = new Iex();
	}

	async getHistorical (ticker, range) {
		return this.iex.getHistoricalPrices(ticker, range);
	}

	async getActual (ticker) {
		return this.iex.getActualPrices(ticker);
	}

	async getInfo (ticker) {
		return this.iex.getInfo(ticker);
	}
}

module.exports = StocksModel;