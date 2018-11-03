const spreadsModelFactory = require('./spreads.model');

class SpreadsSocket {
	constructor(app, io) {
		this.app = app;
		this.io = io;
		this.config = this.app.get('config');
		this.cache = this.app.get('cache');

		this.spreads = spreadsModelFactory(this.config, this.cache);
	}

	registerHandlers (client) {
		this._addClientEventHandlers(client);
		this._addServerEventHandlers(client);
	}

	_addClientEventHandlers(client) {
		client.on('spreads::get', async cb => cb(await this.spreads.getAll()));
		client.on(
			'spreads::get::ticker', async (ticker, cb) => cb(await this.spreads.getTicker(ticker))
		);
		client.on('spreads::get::tickers', async cb => cb(await this.spreads.getTickers()));
	}

	_addServerEventHandlers(client) {
		this.spreads.on('data', (data) => {
			client.emit('spreads', data);
			Object.entries(data).forEach(([key, rows]) => client.emit(`spreads::${key}`, rows));
		});
	}
}

module.exports = SpreadsSocket;