const _ = require('lodash');
const path = require('path');

/**
 * Default configuration
 */
const defaultConfig = require('./default.json');
const env = process.env.NODE_ENV || 'prod';

/**
 * File configuration
 */
const configSuffix = 'env.json';
const fileConfigPath = path.join(__dirname, `${env}.${configSuffix}`);

let fileConfig = { env };
try {
	fileConfig = {
		...fileConfig,
		...require(fileConfigPath)
	};
} catch (e) {
	// env config file does not exist
}

/**
 * Environment configuration
 */
const envConfig = {};
const environmentVariableKeys = [
	'PORT',
	'LOG_LEVEL',
];

for (const key of environmentVariableKeys) {
	if (!_.isUndefined(process.env[key]))
		envConfig[_.camelCase(key)] = process.env[key];
}

module.exports = _.defaultsDeep(envConfig, fileConfig, defaultConfig);
