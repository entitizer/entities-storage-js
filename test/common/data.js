'use strict';

if (!process.env.AWS_REGION) {
	module.exports = false;
	console.log('To run all tests you must set ENV variables for AWS');
	return;
}

var storage = require('../../lib');

var data = {
	entityService: new storage.EntityService(),
	entityNamesService: new storage.EntityNamesService(),
	createTables: storage.createTables,
	deleteTables: storage.deleteTables
};

module.exports = data;
