const _ = require('lodash');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const NodeCache = require('node-cache');

const loader = require('./core/fileLoader');

function connectModules (app, modules) {
	const routerModules = modules.map((module) => {
		let routerModule = null;
		let prefix = '';
		let router = module.module;

		if (_.isArray(router))
			[prefix, router] = router;

		console.log(
			'Deploying "%s" with "%s" prefix', module.name, prefix || '/'
		);

		if(_.isFunction(router) && router.prototype.constructor.name !== 'router') {
      routerModule = new router(app)
			router = routerModule.getRoutes();
		}

		if (router)
			app.use(prefix, router);

		return routerModule
	}).filter(Boolean)

	app.set('modules', routerModules)
}

module.exports = function AppServer (config) {
	const app = express();

	/**
   * API middlewares
   */
	app.use(logger('dev'));
	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));
	app.use(cookieParser());

	/**
   * API configs
   */
	app.set('port', config.port);
	app.set('config', config);
	app.set('cache', new NodeCache({
		stdTTL: config.cacheTTL || 0,
		checkperiod: 30
	}));

	/**
   * API routes
   */
	const modules = loader.loadFilesSync('./**/*.routes.js');
	connectModules(app, modules);

	return app;
};
