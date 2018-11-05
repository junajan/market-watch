const futuresModelFactory = require('./futures.model');

class FuturesSocket {
	constructor(app, io) {
		this.app = app;
		this.io = io;
		this.config = this.app.get('config');
		this.cache = this.app.get('cache');

		this.futures = futuresModelFactory(this.config, this.cache);
	}

	registerHandlers (client) {
		this._addClientEventHandlers(client);
		this._addServerEventHandlers(client);
	}

	_addClientEventHandlers(client) {
		client.on('futures::get', async cb => cb(await this.futures.getAll()));
		client.on(
			'futures::get::ticker', async (ticker, cb) => cb(await this.futures.getTicker(ticker))
		);
		client.on('futures::get::tickers', async cb => cb(await this.futures.getTickers()));
	}

	_addServerEventHandlers(client) {
		this.futures.on('data', (data) => {
      client.emit('futures', data);
			Object.entries(data).forEach(([key, rows]) => client.emit(`futures::${key}`, rows));
		});
	}
}

module.exports = FuturesSocket;