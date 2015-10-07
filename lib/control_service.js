'use strict';

var utils = require('./utils');
var Promise = utils.Promise;
var _ = utils._;
var models = require('./db/models');
var Entity = require('./entity');
var EntityNameKey = require('./entity_name_key');
var Action = require('./action');

var get = utils.dbGet;

function ControlService() {

}

module.exports = ControlService;

/**
 * Create a entity
 */
ControlService.prototype.createEntity = function(data) {
	data = Entity.normalize(data);

	var params = {};
	params.ConditionExpression = 'key <> :key AND id <> :id';

	params.ExpressionAttributeValues = {
		':key': data.key,
		':id': data.id
	};

	return models.Entity.createAsync(data, params).then(get);
};

/**
 * Create a entity name key
 */
ControlService.prototype.createEntityNameKey = function(data) {
	data = EntityNameKey.validate(data);

	var params = {};
	params.ConditionExpression = 'key <> :key';

	params.ExpressionAttributeValues = {
		':key': data.key
	};

	return models.EntityNameKey.createAsync(data, params).then(get);
};

/**
 * Create a entity name keys
 */
ControlService.prototype.createEntityNameKeys = function(names) {
	if (!_.isArray(names)) {
		throw new Error('`names` mast by an array of entity names');
	}
	names = _.uniq(names, 'key');
	var self = this;
	return Promise.resolve(names).each(function(name) {
		return self.createEntityNameKey(name);
	});
};

/**
 * Create entity name keys from entity
 */
ControlService.prototype.createEntityNameKeysFromEntity = function(entity) {
	var names = entity.names.map(function(name) {
		return {
			key: name.key,
			entityId: entity.id
		};
	});

	return this.createEntityNameKeys(names);
};


/**
 * Create an action
 */
ControlService.prototype.createAction = function(data) {
	data = Action.normalize(data);

	var params = {};
	params.ConditionExpression = 'id <> :id';

	params.ExpressionAttributeValues = {
		':id': data.id
	};

	return models.Action.createAsync(data, params).then(get);
};
