'use strict';

var utils = require('./utils');
var Promise = utils.Promise;
var _ = utils._;
var models = require('./db/models');
var GlobalEntity = require('./global_entity');
var Entity = require('./entity');
var EntityNameKey = require('./entity_name_key');
var Action = require('./action');
var AccessService = require('./access_service');

var get = utils.dbGet;

function formatSetEntityData(data, fields) {
	data = Entity.create(data, 'update').normalize().validate().getData();
	data = _.pick(data, fields);

	var params = {};
	params.ConditionExpression = '#id = :id';

	params.ExpressionAttributeNames = {
		'#id': 'id'
	};

	params.ExpressionAttributeValues = {
		':id': data.id
	};

	return {
		data: data,
		params: params
	};
}

/**
 * Creates a new RootControlService object.
 * @class
 * @returns {RootControlService} returns a RootControlService object
 */
function RootControlService(accessService) {
	this.accessService = accessService || new AccessService();
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
		data = formatSetEntityData(data, ['id', 'description', 'type', 'category', 'region', 'globalId']);
	} catch (error) {
		return Promise.reject(error);
	}

	var params = data.params;
	data = data.data;

	return models.Entity.updateAsync(data, params).then(get);
};

/**
 * Update an existing entity's name.
 * @param {(Entity|Object)} data - A data object or an Entity to update.
 * @return {Object} Returns updated Entity object.
 */
RootControlService.prototype.setEntityName = function(data) {
	try {
		data = formatSetEntityData(data, ['id', 'name', 'abbr']);
	} catch (error) {
		return Promise.reject(error);
	}
	var params = data.params;
	data = data.data;

	var self = this;

	function getEntity() {
		return models.Entity.getAsync(data.id, {
			AttributesToGet: ['id', 'lang', 'globalId']
		}).then(get);
	}

	return getEntity()
		.then(function(entity) {
			if (!entity) {
				return Promise.reject(new Error('Entity doesn\'t exist: ' + data.id));
			}
			return models.Entity.updateAsync(data, params).then(get)
				.then(function(updatedEntity) {
					if (entity.globalId) {
						return self.setGlobalEntityCultureName(entity.globalId, entity.lang, _.pick(data, 'name', 'abbr'))
							.then(function() {
								return updatedEntity;
							});
					}
					return updatedEntity;
				});
		});
};

// RootControlService.prototype.setEntitySlug = function(data) {
// 	try {
// 		data = formatSetEntityData(data, ['id', 'slug', 'slug_key']);
// 	} catch (error) {
// 		return Promise.reject(error);
// 	}
// 	var params = data.params;
// 	data = data.data;
// };

RootControlService.prototype.setEntityWiki = function(data) {
	try {
		data = formatSetEntityData(data, ['id', 'wikiId', 'wikiName']);
	} catch (error) {
		return Promise.reject(error);
	}
	var params = data.params;
	data = data.data;

	if (_.isUndefined(data.wikiId)) {
		return Promise.reject(new Error('wikiId cannot be undefined'));
	}

	var self = this;

	function getEntity() {
		return models.Entity.getAsync(data.id, {
			AttributesToGet: ['id', 'lang', 'globalId', 'name']
		}).then(get);
	}

	return getEntity()
		.then(function(entity) {
			if (!entity) {
				return Promise.reject(new Error('Entity doesn\'t exist: ' + data.id));
			}
			return models.Entity.updateAsync(data, params).then(get)
				.then(function(updatedEntity) {
					if (entity.globalId) {
						return self.setGlobalEntityCultureName(entity.globalId, entity.lang, {
								name: entity.name,
								wikiName: data.wikiName
							})
							.then(function() {
								return updatedEntity;
							});
					}
					return updatedEntity;
				});
		});
};

RootControlService.prototype.setEntityEnglishWiki = function(data) {
	try {
		data = formatSetEntityData(data, ['id', 'englishWikiId', 'englishWikiName']);
	} catch (error) {
		return Promise.reject(error);
	}
	var params = data.params;
	data = data.data;

	if (_.isUndefined(data.englishWikiId)) {
		return Promise.reject(new Error('englishWikiId cannot be undefined'));
	}

	var self = this;

	function getEntity() {
		return models.Entity.getAsync(data.id, {
			AttributesToGet: ['id', 'lang', 'country', 'globalId', 'englishWikiId', 'name', 'abbr', 'wikiName']
		}).then(get);
	}

	function getGlobalEntityId(englishWikiId) {
		return self.accessService.globalEntityIdByEnglishWikiId({
			id: englishWikiId
		});
	}

	return getEntity()
		.then(function(entity) {
			if (!entity) {
				return Promise.reject(new Error('Entity doesn\'t exist: ' + data.id));
			}

			if (_.isNull(data.englishWikiId)) {
				data.globalId = null;
				return models.Entity.updateAsync(data, params).then(get)
					.then(function(updatedEntity) {
						if (entity.globalId) {
							return self.setGlobalEntityCultureEntityId(entity.globalId, entity, null)
								.then(function() {
									return updatedEntity;
								});
						}
						return updatedEntity;
					});
			}

			return getGlobalEntityId(data.englishWikiId)
				.then(function(globalId) {
					data.globalId = globalId = globalId || null;

					return models.Entity.updateAsync(data, params).then(get)
						.then(function(updatedEntity) {
							// not changed globalId
							if (updatedEntity.globalId === entity.globalId) {
								return updatedEntity;
							}
							// set a new globalId
							if (globalId) {
								return Promise.props({
										//update GlobalEntity culture name
										name: self.setGlobalEntityCultureName(globalId, entity.lang, {
											name: entity.name,
											abbr: entity.abbr,
											wikiName: data.wikiName
										}),
										// set GlobalEntity culture entity id
										entityId: self.setGlobalEntityCultureEntityId(globalId, entity, entity.id)
									})
									.then(function() {
										return updatedEntity;
									});
							} else {
								if (entity.globalId) {
									return self.setGlobalEntityCultureEntityId(entity.globalId, entity, null)
										.then(function() {
											return updatedEntity;
										});
								}
							}
							return updatedEntity;
						});
				});
		});
};

RootControlService.prototype.addEntityNameToEntity = function(data) {};

RootControlService.prototype.deleteEntityNameFromEntity = function(data) {};

RootControlService.prototype.setGlobalEntityCultureEntityId = function(globalEntityId, culture, entityId) {
	culture = GlobalEntity.createEntityCulture(culture);

	var self = this;

	return this.accessService.globalEntityById({
			id: globalEntityId,
			params: {
				AttributesToGet: ['id', 'entities']
			}
		})
		.then(function(globalEntity) {
			if (globalEntity) {
				if (entityId) {
					globalEntity.entities[culture] = entityId;
				} else {
					delete globalEntity.entities[culture];
				}
				return self.updateGlobalEntity(globalEntity);
			}
		});
};

/**
 * Set a GlobalEntity culture name.
 * @param {Number} globalEntityId - GlobalEntity id
 * @param {String} lang - Language 2 letters code.
 * @param {Object} data - culture name data
 * @param {String} data.name - Name for the indicated language
 * @param {String} data.abbr - Name abbreviation for the indicated language
 * @param {String} data.wikiName - Wiki name for the indicated language
 * @returns {Object} Returns the updated GlobalEntity or undefined.
 */
RootControlService.prototype.setGlobalEntityCultureName = function(globalEntityId, lang, data) {
	if (!_.isNumber(globalEntityId)) {
		return Promise.reject(new Error('globalEntityId is required'));
	}
	if (!_.isString(lang)) {
		return Promise.reject(new Error('lang is required'));
	}
	if (!data || !_.isString(data.name)) {
		return Promise.reject(new Error('data.name is required'));
	}

	data = _.pick(data, 'name', 'abbr', 'wikiName');

	var self = this;
	return models.GlobalEntity.getAsync(globalEntityId, {
			AttributesToGet: ['id', 'names']
		}).then(get)
		.then(function(globalEntity) {
			if (globalEntity) {
				var name = globalEntity.names[lang] || {};
				name.name = data.name;
				if (!_.isUndefined(data.wikiName)) {
					name.wikiName = data.wikiName;
				}
				if (!_.isUndefined(data.abbr)) {
					name.abbr = data.abbr;
				}
				globalEntity.names[lang] = name;
				globalEntity = _.pick(globalEntity, 'id', 'names');

				return self.updateGlobalEntity(globalEntity).then(get);
			}
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
 * @param {Object[]} names - A list of names
 * @param {Object} [options] - Options
 * @param {Number} [options.concurrency=1] - Adding names concurrency value.
 * @param {Boolean} [options.continueOnExisting=true] - Continue adding names on Existing exception.
 * @returns {Object[]} Returns a list of created EntityNameKey record object.
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
	}).then(function(list) {
		return list.filter(function(item) {
			return !!item;
		});
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
