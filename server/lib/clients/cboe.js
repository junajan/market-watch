const _ = require('lodash');
const cheerio = require('cheerio');
const moment = require('moment');
const request = require('request-promise');

class Cboe {
	constructor() {
		this.FUTURES_URL = 'http://www.cboe.com/delayedquote/';
		this.DATE_FORMAT = 'MM/DD/YYYY';
		this.NUMERIC_COLUMNS = [
			'last', 'change', 'high', 'low', 'settlement', 'volume', 'int',
		];
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

	_numerizeValues(row, start = 0) {
		for(let i = start; i < row.length; i++)
			row[i] = parseFloat(row[i]);

		return row;
	}

	_getDaysToExpiration (date) {
		return moment(date, this.DATE_FORMAT).diff(moment(), 'days');
	}

	_enrichWithCalculatedFields (list) {
		return list.map(row => ({
			...row,
			loadedAt: +new Date(),
			isWeekly: /^[0-9]$/.test(row.symbol[0]),
			daysToExpiration: this._getDaysToExpiration(row.expiration)
		}));
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

		const numerizedData = data.map((row) => {
			return this.NUMERIC_COLUMNS.includes(row[0])
				? this._numerizeValues(row, 1)
				: row;
		});

		const objectized = this._objectizeArray(numerizedData);
		return this._enrichWithCalculatedFields(objectized);
	}

	async getFutures () {
		// return require('../../resources/cboe-futures-mock.json');
		const pageSource = await request.get(this.FUTURES_URL);
		const pageCheerio = cheerio(pageSource);
		const futureTypes = this._parseFutureTypes(pageCheerio);

		return this._parseFutures(futureTypes, pageCheerio);

	}
}

module.exports = Cboe;
