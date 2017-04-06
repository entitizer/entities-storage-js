
import { Promise } from '../utils';
const vogels = require('vogels');
import { NAMES } from './models';

export function createTables() {
	const data = {};
	const options = {
		readCapacity: 1,
		writeCapacity: 1
	};

	NAMES.forEach(function (modelName) {
		data[modelName] = options;
	});

	return new Promise(function (resolve, reject) {
		vogels.createTables(data, function (err) {
			if (err) {
				return reject(err);
			}
			resolve();
		});
	});
};
