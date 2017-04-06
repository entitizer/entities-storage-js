
const vogels = require('vogels');
const AWS = vogels.AWS;
import { NAMES, getModel } from './db/models';

export function db(dynamodb) {
	NAMES.forEach(function (name) {
		getModel(name).config({
			dynamodb: dynamodb
		});
	});
}

export function config(options) {
	db(new AWS.DynamoDB(options));
}
