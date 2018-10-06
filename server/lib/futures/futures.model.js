const AbstractModel = require('../core/abstractModel');
const Cboe = require('../clients/cboe');

class FuturesModel extends AbstractModel{
	constructor(config, cache) {
		super(config, cache, 'futures:data');

		this.cboe = new Cboe();
	}

	async fetchData () {
		return this.cboe.getFutures();
	}
}

module.exports = FuturesModel;