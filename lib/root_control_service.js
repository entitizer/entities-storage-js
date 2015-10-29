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
	try {
		data = GlobalEntity.create(data).normalize().validate().getData();
	} catch (error) {
		return Promise.reject(error);
	}

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
 * Update an existing global entity.
 * @param {(Entity|Object)} data - A data object or a GlobalEntity to update.
 * @return {Object} Returns updated GlobalEntity object.
 */
RootControlService.prototype.updateGlobalEntity = function(data) {
	try {
		data = GlobalEntity.create(data, 'update').normalize().validate().getData();
	} catch (error) {
		return Promise.reject(error);
	}

	var params = {};
	params.ConditionExpression = '#id = :id';

	params.ExpressionAttributeNames = {
		'#id': 'id'
	};

	params.ExpressionAttributeValues = {
		':id': data.id
	};

	return models.GlobalEntity.updateAsync(data, params).then(get);
};

/**
 * Create a new entity.
 * @param {(Entity|Object)} data - A data object or an Entity to create a new Entity Db record.
 * @return {Object} Returns created Entity record object.
 */
RootControlService.prototype.createEntity = function(data) {
	try {
		data = Entity.create(data).normalize().validate().getData();
	} catch (error) {
		return Promise.reject(error);
	}

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
	var self = this;
	return models.Entity.createAsync(data, params).then(get)
		.then(function(entity) {
			if (entity) {
				return self.createEntityNameKeysFromEntity(entity)
					.then(function() {
						return entity;
					});
			}
			return entity;
		});
};

/**
 * Update an existing entity's fields.
 * Fields can be: `id`, `description`, `type`, `category`, `region`, `globalId`.
 * @param {(Entity|Object)} data - A data object or an Entity to update.
 * @return {Object} Returns updated Entity object.
 */
RootControlService.prototype.setEntityFields = function(data) {
	try {
		data = Entity.create(data, 'update').normalize().validate().getData();
	} catch (error) {
		return Promise.reject(error);
	}

	data = _.pick(data, 'id', 'description', 'type', 'category', 'region', 'globalId');

	var params = {};
	params.ConditionExpression = '#id = :id';

	params.ExpressionAttributeNames = {
		'#id': 'id'
	};

	params.ExpressionAttributeValues = {
		':id': data.id
	};

	return models.Entity.updateAsync(data, params).then(get);
};

/**
 * Update an existing entity's name.
 * @param {(Entity|Object)} data - A data object or an Entity to update.
 * @return {Object} Returns updated Entity object.
 */
RootControlService.prototype.setEntityName = function(data) {
	try {
		data = Entity.create(data, 'update').normalize().validate().getData();
	} catch (error) {
		return Promise.reject(error);
	}

	data = _.pick(data, 'id', 'name', 'abbr');

	var params = {};
	params.ConditionExpression = '#id = :id';

	params.ExpressionAttributeNames = {
		'#id': 'id'
	};

	params.ExpressionAttributeValues = {
		':id': data.id
	};

	var self = this;

	function getEntity() {
		return models.Entity.getAsync(data.id).then(get);
	}

	function getGlobalEntity(entity) {
		if (!entity.globalId) {
			return Promise.resolve();
		}
		return models.GlobalEntity.getAsync(entity.globalId).then(get);
	}

	return getEntity()
		.then(function(entity) {
			if (!entity) {
				return Promise.reject(new Error('Entity doesn\'t exist: ' + data.id));
			}
			return models.Entity.updateAsync(data, params).then(get)
				.then(function(updatedEntity) {
					return getGlobalEntity(entity)
						.then(function(globalEntity) {
							if (globalEntity) {
								var name = globalEntity.names[entity.lang] || {};
								name.name = data.name;
								if (entity.wikiName && entity.wikiName !== name.wikiName) {
									name.wikiName = entity.wikiName;
								}
								if (!_.isUndefined(data.abbr)) {
									name.abbr = data.abbr;
								}
								globalEntity.names[entity.lang] = name;
								globalEntity = _.pick(globalEntity, 'id', 'names');

								return self.updateGlobalEntity(globalEntity);
							}
						})
						.then(function() {
							return updatedEntity;
						});
				});
		});
};

/**
 * Create a new entity name key.
 * @param {(EntityNameKey|Object)} data - A data object or a EntityNameKey to create a new EntityNameKey Db record.
 * @return {Object} Returns created EntityNameKey record object.
 */
RootControlService.prototype.createEntityNameKey = function(data) {
	data = EntityNameKey.create(data).normalize().getData();

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
	options = options || {
		continueOnExisting: true
	};
	options.concurrency = options.concurrency || process.env.ENTITY_NAME_KEYS_CONCURRENCY || 1;

	names = _.uniq(names, 'key');
	var self = this;
	return Promise.resolve(names).map(function(name) {
		return self.createEntityNameKey(name)
			.catch(function(error) {
				if (error.code === 'ConditionalCheckFailedException' && options.continueOnExisting) {
					console.error('Error on creating name key', name);
					return null;
				}
				return Promise.reject(error);
			});
	}, {
		concurrency: options.concurrency
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
