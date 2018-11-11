const avModelFactory = require('./av.model');

class FuturesSocket {
	constructor(app, io) {
		this.app = app;
		this.io = io;
		this.config = this.app.get('config');
		this.cache = this.app.get('cache');

		this.av = avModelFactory(this.config, this.cache);
	}

	registerHandlers (client) {
		this._addClientEventHandlers(client);
		this._addServerEventHandlers(client);
	}

	_addClientEventHandlers(client) {
		client.on('av::get', async cb => cb(await this.av.getAll()));
		client.on('av::get::info', async (ticker, cb) => cb(await this.av.getInfo(ticker)));
		client.on('av::get::price', async (ticker, cb) => cb(await this.av.getActual(ticker)));
		client.on('av::get::history', async (ticker, cb) => cb(await this.av.getHistory(ticker)));
	}

	_addServerEventHandlers() {
		// no events emitted from model right now
	}
}

module.exports = FuturesSocket;