'use strict';

if (!process.env.AWS_REGION) {
	module.exports = false;
	console.log('To run all tests you must set ENV variables for AWS');
	return;
}

var storage = require('../../lib');

var accessService = new storage.AccessService();
var controlService = new storage.ControlService();
var data = {
	accessService: accessService,
	controlService: controlService,
	createTables: storage.createTables,
	deleteTables: storage.deleteTables,
	Entity: storage.Entity,
	EntityName: storage.EntityName,
	Action: storage.Action,
	Explorer: storage.Explorer,
	AccessService: storage.AccessService,
	ControlService: storage.ControlService
};

module.exports = data;
