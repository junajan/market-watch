const glob = require('glob');
const path = require('path');

exports.loadFilesSync = function loadFilesSync (pattern) {
	return glob
		.sync(pattern)
		.map(filePath => {
			return {
				...path.parse(filePath),
				path: filePath,
				module: require(path.resolve(filePath))
			};
		});
};