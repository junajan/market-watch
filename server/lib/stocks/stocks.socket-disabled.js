const stocksModelFactory = require('./stocks.model');

class StocksSocket {
	constructor(app, io) {
		this.app = app;
		this.io = io;
		this.config = this.app.get('config');
		this.cache = this.app.get('cache');

		this.stocks = stocksModelFactory(this.config, this.cache);
	}

	registerHandlers () {
	}
}

module.exports = StocksSocket;