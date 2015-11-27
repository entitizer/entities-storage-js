'use strict';

var utils = require('./utils');
var _ = utils._;
var vogels = require('vogels-helpers');
var buildOptions = utils.buildServiceOptions;

/**
 * Creates a new AccessService object.
 * @class
 */
function AccessService() {

}

/**
 * Find an entity by entity id.
 * @param {Object} params - Finding params
 * @param {Number} params.id - Entity's id
 * @param {Object} params.params - DynamoDB params
 */
AccessService.prototype.entityById = function(id, options) {
	options = buildOptions(options);
	return vogels.access.getItem('Entity', id, options);
};

/**
 * Find an entity by entity id.
 * @param {Object} params - Finding params
 * @param {Number} params.id - Entity's id
 * @param {Object} params.params - DynamoDB params
 */
AccessService.prototype.entityNameByKey = function(key, options) {
	options = buildOptions(options);
	return vogels.access.getItem('EntityName', key, options);
};

/**
 * Find entities by ids.
 * @param {Object} params - Finding params
 * @param {Number[]} params.ids - Entity ids
 * @param {Object} params.params - DynamoDB params
 */
AccessService.prototype.entitiesByIds = function(ids, options) {
	options = buildOptions(options);
	return vogels.access.getItems('Entity', ids, options);
};

/**
 * Find entities by ids.
 * @param {Object} params - Finding params
 * @param {Number[]} params.ids - Entity ids
 * @param {Object} params.params - DynamoDB params
 */
AccessService.prototype.entityNamesByKeys = function(keys, options) {
	options = buildOptions(options);
	return vogels.access.getItems('EntityName', keys, options);
};

AccessService.prototype.entitiesByEnglishWikiId = function(id, options) {
	var self = this;
	return this.entitiesIdsByEnglishWikiId(id)
		.then(function(ids) {
			if (ids && ids.length > 0) {
				return self.entitiesByIds(ids, options);
			}
			return ids;
		});
};

AccessService.prototype.entityIdsByEnglishWikiId = function(id, options) {
	options = buildOptions(options, {
		format: 'items',
		limit: 100
	});

	options.index = 'Entities-englishWikiId-gi';
	options.key = id;

	return vogels.access.query('Entity', options)
		.then(function(result) {
			if (result && result.length > 0) {
				return _.pluck(result, 'id');
			}
			return [];
		});
};

/**
 * Find an entity by entity name key.
 * @param {Object} params - Finding params
 * @param {String} params.key - Entity's name key
 * @param {Object} params.params - DynamoDB params
 * @returns {Entity} Returns founded entity.
 */
AccessService.prototype.entityByKey = function(key, options) {
	var self = this;
	return self.entityNameByKey(key)
		.then(function(entityName) {
			if (entityName) {
				return self.entityById(entityName.entityId, options);
			}
			return entityName;
		});
};

/**
 * Find an entity-name-key map by entity name keys.
 * @param {Object} params - Finding params
 * @param {String[]} params.keys - Entity's name keys
 * @param {Object} params.params - DynamoDB params
 * @returns {Entity[]} Returns founded entities.
 */
AccessService.prototype.entitiesByKeys = function(keys, options) {
	var self = this;

	return this.entityNamesByKeys(keys)
		.then(function(result) {
			var data = {};
			if (!result || result.length < 1) {
				return data;
			}
			var ids = _.pluck(result, 'entityId');
			ids = _.uniq(ids);
			if (ids.length === 0) {
				return [];
			}

			return self.entitiesByIds(ids, options).then(function(entities) {
				var entity;
				result.forEach(function(item) {
					entity = _.find(entities, 'id', item.entityId);
					if (entity) {
						data[item.key] = entity;
					}
				});
				return data;
			});
		});
};

module.exports = AccessService;
