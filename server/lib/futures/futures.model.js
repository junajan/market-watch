const AbstractModel = require('../core/abstractModel');
const Cboe = require('../clients/cboe');

class FuturesModel extends AbstractModel {
	constructor(config, cache) {
		super(config, cache, 'futures:data');

		this.cboe = new Cboe();
	}

	async fetchData () {
		return this.cboe.getFutures();
	}
}

let x = null;
module.exports = (...args) => {
  if(!x) x = new FuturesModel(...args);
  return x;
};
