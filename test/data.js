'use strict';

var utils = require('../lib/utils');
var Promise = utils.Promise;
var config = require('../lib/config');
var RootControlService = require('../lib/root_control_service');
var ControlService = require('../lib/control_service');
var AccessService = require('../lib/access_service');
var PORT = 8000;
var localDynamo = require('local-dynamo');
var vogels = require('vogels');
var AWS = vogels.AWS;
var endpoint = 'localhost:' + PORT;

try {
	localDynamo.launch('./testdb', PORT);
} catch (e) {
	console.error(e);
}
var dynamoDb = new AWS.DynamoDB({
	apiVersion: '2012-08-10',
	endpoint: endpoint,
	region: 'local',
	accessKeyId: 'accessKeyId',
	secretAccessKey: 'secretAccessKey',
	sslEnabled: false
});
// dynamoDb.endpoint = new AWS.Endpoint(endpoint);

config.db(dynamoDb);

var accessService = new AccessService();

var data = {
	accessService: accessService,
	rootControlService: new RootControlService(),
	controlService: new ControlService(accessService),
	createTables: require('../lib/db/create_tables')
};

module.exports = data;
