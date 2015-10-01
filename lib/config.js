'use strict';

var vogels = require('vogels');
var AWS = vogels.AWS;
var models = require('./db/models');

module.exports = function config(options) {
	var dynamodb = new AWS.DynamoDB(options);
	models.NAMES.forEach(function(name) {
		models[name].config({
			dynamodb: dynamodb
		});
	});
};
