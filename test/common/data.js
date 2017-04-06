'use strict';

if (!process.env.AWS_REGION) {
	module.exports = false;
	console.log('To run all tests you must set ENV variables for AWS');
	return;
}

var storage = require('../../lib');

var entityService = new storage.EntityService();
var data = {
	accessService: entityService,
	controlService: entityService,
	createTables: storage.createTables,
	deleteTables: storage.deleteTables
};

module.exports = data;
