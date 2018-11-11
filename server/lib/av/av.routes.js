const express = require('express');
const avModelFactory = require('./av.model');

class AvRouter {
	constructor(app) {
		this.app = app;
		this.config = this.app.get('config');
		this.cache = this.app.get('cache');

		this.av = avModelFactory(this.config, this.cache);
	}

	getRoutes() {
		const router = express.Router();

		router.get('/av/historical/:ticker', async (req, res) => {
			const data = await this.av.getHistory(
				req.params.ticker,
			);
			res.json(data || []);
		});

		router.get('/av/price/:ticker', async (req, res) => {
			const data = await this.av.getActual(req.params.ticker);
			res.json(data || -1);
		});

		router.get('/av/info/:ticker', async (req, res) => {
			const data = await this.av.getInfo(req.params.ticker);
			res.json(data || {});
		});

		return router;
	}
}

module.exports = AvRouter;