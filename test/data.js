'use strict';

if (!process.env.AWS_REGION) {
	module.exports = false;
	console.log('NO ENVs');
	return;
}

var utils = require('../lib/utils');
var Promise = utils.Promise;
var RootControlService = require('../lib/root_control_service');
var ControlService = require('../lib/control_service');
var AccessService = require('../lib/access_service');
var config = require('../lib/config');

config.setPrefix('Test');

var accessService = new AccessService();
var data = {
	accessService: accessService,
	rootControlService: new RootControlService(),
	controlService: new ControlService(accessService),
	createTables: require('../lib/db/create_tables')
};

module.exports = data;
