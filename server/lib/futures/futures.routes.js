const express = require('express');
const futuresModelFactory = require('./futures.model');

class FuturesRouter {
	constructor(app) {
		this.app = app;
		this.config = this.app.get('config');
		this.cache = this.app.get('cache');

		this.futures = futuresModelFactory(this.config, this.cache);
	}

	getRoutes() {
		const router = express.Router();

		router.get('/', async (req, res) => {
			const data = await this.futures.getAll();
			res.json(data || {});
		});

		router.get('/tickers', async (req, res) => {
			const data = await this.futures.getTickers();
			res.json(data || []);
		});

		router.get('/:ticker', async (req, res) => {
			const data = await this.futures.getTicker(req.params.ticker);
			res.json(data || []);
		});

		return router;
	}
}

module.exports = ['/futures', FuturesRouter];