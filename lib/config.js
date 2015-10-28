'use strict';

var vogels = require('vogels');
var AWS = vogels.AWS;
var models = require('./db/models');

function db(dynamodb) {
	models.NAMES.forEach(function(name) {
		models[name].config({
			dynamodb: dynamodb
		});
	});
}

function config(options) {
	var dynamodb = new AWS.DynamoDB(options);
	db(dynamodb);
}

config.db = db;

module.exports = config;
