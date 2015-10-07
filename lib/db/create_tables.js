'use strict';

var utils = require('../utils');
var Promise = utils.Promise;
var vogels = require('vogels');
var models = require('./models');

module.exports = function createTables() {
	var data = {};
	var options = {
		readCapacity: 1,
		writeCapacity: 1
	};

	models.NAMES.forEach(function(modelName) {
		data[modelName] = options;
	});

	return new Promise(function(resolve, reject) {
		vogels.createTables(data, function(err) {
			if (err) {
				return reject(err);
			}
			resolve();
		});
	});
};
