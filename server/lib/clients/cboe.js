const _ = require('lodash');
const request = require('request-promise');
const cheerio = require('cheerio');

class Cboe {
	constructor() {
		this.FUTURES_URL = 'http://www.cboe.com/delayedquote/';
	}

	_parseFutureTypes (pageCheerio) {
		return pageCheerio
			.find('select#FutureProduct option')
			.map((index, type) => ({
				id: cheerio(type).val(),
				title: cheerio(type).text().trim()
			}))
			.get();
	}

	_parseFutures (futureTypes, pageCheerio) {
		const futureTitles = _.map(futureTypes, 'title');

		const futurePrices = futureTypes
			.map(type => this._parseFuture(type, pageCheerio));

		return _.zipObject(futureTitles, futurePrices);
	}

	_objectizeArray (data) {
		const objectized = [];

		data.forEach((row, rowIndex) => {
			const key = row.shift();

			row.forEach((colValue, index) => {
				if(!rowIndex)
					objectized.push({});
				objectized[index][key] = colValue;
			});
		});

		return objectized;
	}

	_parseFuture (future, pageCheerio) {
		const data = [];
		const table = pageCheerio
			.find(`#FutureDataTabs [data-tabid="${future.id}"]`)
			.find('table');

		table.find('tr th').each((index, headerCol) =>
			data.push([cheerio(headerCol).text().trim().toLowerCase()])
		);

		table.find('tr').each((rowIndex, row) =>
			cheerio(row).find('td').each((colIndex, col) =>
				data[colIndex].push(cheerio(col).text().trim())
			)
		);

		return this._objectizeArray(data);
	}

	async getFutures () {
		const pageSource = await request.get(this.FUTURES_URL);
		const pageCheerio = cheerio(pageSource);
		const futureTypes = this._parseFutureTypes(pageCheerio);

		return this._parseFutures(futureTypes, pageCheerio);
	}
}

module.exports = Cboe;
