const express = require('express');
const router = express.Router();
const { version, name } = require('../../package.json');

router.get('/version', function (req, res) {
	console.log('REQUEST:', req);
	res.send(version);
});

router.get('/ping', function (req, res) {
	res.send('pong');
});

router.get('/time', function (req, res) {
	res.send(`${+new Date}`);
});

router.get('/', function (req, res) {
	res.send(`${name} v${version}`);
});

module.exports = router;