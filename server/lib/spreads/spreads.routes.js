const express = require('express');
const SpreadsModel = require('./spreads.model');

class SpreadsRouter {
	constructor(app) {
		this.app = app;
		this.config = this.app.get('config');
		this.cache = this.app.get('cache');

		this.spreads = new SpreadsModel(this.config, this.cache);
	}

	getRoutes() {
		const router = express.Router();

		router.get('/', async (req, res) => {
			const data = await this.spreads.getAll();
			res.json(data || {});
		});

		router.get('/tickers', async (req, res) => {
			const data = await this.spreads.getTickers();
			res.json(data || []);
		});

		router.get('/:ticker', async (req, res) => {
			const data = await this.spreads.getTicker(req.params.ticker);
			res.json(data || []);
		});

		return router;
	}
}

module.exports = ['/spreads', SpreadsRouter];