const express = require('express');
const stocksModelFactory = require('./stocks.model');

class StocksRouter {
	constructor(app) {
		this.app = app;
		this.config = this.app.get('config');
		this.cache = this.app.get('cache');

		this.stocks = stocksModelFactory(this.config, this.cache);
	}

	getRoutes() {
		const router = express.Router();

		router.get('/stocks/historical/:ticker', async (req, res) => {
			const data = await this.stocks.getHistorical(
				req.params.ticker,
				req.query.range || '6m'
			);
			res.json(data || []);
		});

		router.get('/stocks/price/:ticker', async (req, res) => {
			const data = await this.stocks.getActual(req.params.ticker);
			res.json(data || -1);
		});

		router.get('/stocks/info/:ticker', async (req, res) => {
			const data = await this.stocks.getInfo(req.params.ticker);
			res.json(data || {});
		});

		return router;
	}
}

module.exports = StocksRouter;