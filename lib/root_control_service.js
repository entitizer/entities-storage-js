'use strict';

var utils = require('./utils');
var Promise = utils.Promise;
var _ = utils._;
var models = require('./db/models');
var GlobalEntity = require('./global_entity');
var Entity = require('./entity');
var EntityNameKey = require('./entity_name_key');
var Action = require('./action');

var get = utils.dbGet;

/**
 * Creates a new RootControlService object.
 * @class
 * @returns {RootControlService} returns a RootControlService object
 */
function RootControlService() {

}

module.exports = RootControlService;

/**
 * Create a global entity.
 * @param {(GlobalEntity|Object)} data - A data object or a GlobalEntity to create a new GlobalEntity Db record.
 * @return {Object} Returns created GlobalEntity record object.
 */
RootControlService.prototype.createGlobalEntity = function(data) {
	data = GlobalEntity.create(data).getDate();

	var params = {};
	params.ConditionExpression = '#slug_key <> :slug_key AND #id <> :id AND #englishWikiId <> :englishWikiId';

	params.ExpressionAttributeNames = {
		'#slug_key': 'slug_key',
		'#id': 'id',
		'#englishWikiId': 'englishWikiId'
	};
	params.ExpressionAttributeValues = {
		':slug_key': data.slug_key,
		':id': data.id,
		':englishWikiId': data.englishWikiId
	};

	return models.GlobalEntity.createAsync(data, params).then(get);
};

/**
 * Create a new entity.
 * @param {(Entity|Object)} data - A data object or an Entity to create a new Entity Db record.
 * @return {Object} Returns created Entity record object.
 */
RootControlService.prototype.createEntity = function(data) {
	data = Entity.create(data).getDate();

	var params = {};
	params.ConditionExpression = '#slug_key <> :slug_key AND #id <> :id';

	params.ExpressionAttributeNames = {
		'#slug_key': 'slug_key',
		'#id': 'id'
	};
	params.ExpressionAttributeValues = {
		':slug_key': data.slug_key,
		':id': data.id
	};

	// if (data.globalId) {
	// 	params.ConditionExpression += ' AND #globalId <> :globalId';
	// 	params.ExpressionAttributeNames['#globalId'] = 'globalId';
	// 	params.ExpressionAttributeValues[':globalId'] = data.globalId;
	// }

	return models.Entity.createAsync(data, params).then(get);
};

/**
 * Create a new entity name key.
 * @param {(EntityNameKey|Object)} data - A data object or a EntityNameKey to create a new EntityNameKey Db record.
 * @return {Object} Returns created EntityNameKey record object.
 */
RootControlService.prototype.createEntityNameKey = function(data) {
	data = EntityNameKey.create(data).getData();

	var params = {};
	params.ConditionExpression = '#key <> :key';

	params.ExpressionAttributeNames = {
		'#key': 'key'
	};

	params.ExpressionAttributeValues = {
		':key': data.key
	};

	return models.EntityNameKey.createAsync(data, params).then(get);
};

/**
 * Create a entity name keys
 */
RootControlService.prototype.createEntityNameKeys = function(names, options) {
	if (!_.isArray(names)) {
		throw new Error('`names` mast by an array of entity names');
	}
	names = _.uniq(names, 'key');
	var self = this;
	return Promise.resolve(names).map(function(name) {
		return self.createEntityNameKey(name)
			.catch(function(error) {
				if (error.code === 'ConditionalCheckFailedException' && options && options.continueOnExisting) {
					console.error('Error on creating name key', name);
					return null;
				}
				return Promise.reject(error);
			});
	}, {
		concurrency: options && options.concurrency || 1
	});
};

/**
 * Create entity name keys from entity
 */
RootControlService.prototype.createEntityNameKeysFromEntity = function(entity, options) {
	var names = entity.names.map(function(name) {
		return {
			key: name.key,
			entityId: entity.id
		};
	});

	return this.createEntityNameKeys(names, options);
};


/**
 * Create an action
 */
RootControlService.prototype.createAction = function(data) {
	data = Action.normalize(data);

	var params = {};
	params.ConditionExpression = '#id <> :id';

	params.ExpressionAttributeNames = {
		'#id': 'id'
	};

	params.ExpressionAttributeValues = {
		':id': data.id
	};

	return models.Action.createAsync(data, params).then(get);
};
