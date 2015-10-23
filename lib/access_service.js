'use strict';

var utils = require('./utils');
var get = utils.dbGet;
var _ = utils._;
var models = require('./db/models');
var EntityName = require('./entity_name');

var BASE_ENTITY_ATTRIBUTES = ['id', 'name', 'type', 'slug', 'abbr', 'wikiId', 'wikiName', 'englishWikiId', 'category', 'region'];

var ENTITY_DEFAULT_PARAMS = {
	AttributesToGet: BASE_ENTITY_ATTRIBUTES,
	ConsistentRead: false
};

var BASE_GLOBAL_ENTITY_ATTRIBUTES = ['id', 'name', 'type', 'slug', 'abbr', 'englishWikiId', 'category', 'region'];

var GLOBAL_ENTITY_DEFAULT_PARAMS = {
	AttributesToGet: BASE_GLOBAL_ENTITY_ATTRIBUTES,
	ConsistentRead: false
};

function formatEntityParams(params) {
	return _.defaults(params || {}, ENTITY_DEFAULT_PARAMS);
}

function formatGlobalEntityParams(params) {
	return _.defaults(params || {}, GLOBAL_ENTITY_DEFAULT_PARAMS);
}

/**
 * Creates a new AccessService object.
 * @class
 */
function AccessService() {

}

/**
 * Find a global entity by id.
 * @param {Object} params - Finding params
 * @param {Number} params.id - GlobalEntity's id
 * @param {Object} params.params - DynamoDB params
 */
AccessService.prototype.globalEntityById = function(params) {
	return models.GlobalEntity.getAsync(params.id, formatGlobalEntityParams(params.params)).then(get);
};

AccessService.prototype.globalEntityByEnglishWikiId = function(params) {
	var self = this;
	return this.globalEntityIdByEnglishWikiId(params)
		.then(function(id) {
			if (id) {
				return self.globalEntityById({
					id: id,
					params: params.params
				});
			}
		});
};

AccessService.prototype.globalEntityIdByEnglishWikiId = function(params) {
	return models.GlobalEntity
		.query(params.id)
		.usingIndex('GlobalEntities-englishWikiId-index')
		.limit(1)
		.select('ALL_PROJECTED_ATTRIBUTES')
		.execAsync()
		.then(get).then(function(result) {
			if (result && result.length > 0) {
				return result[0].id;
			}
			return null;
		});
};


/**
 * Find an entity by entity id.
 * @param {Object} params - Finding params
 * @param {Number} params.id - Entity's id
 * @param {Object} params.params - DynamoDB params
 */
AccessService.prototype.entityById = function(params) {
	return models.Entity.getAsync(params.id, formatEntityParams(params.params)).then(get);
};

/**
 * Find entities by ids.
 * @param {Object} params - Finding params
 * @param {Number[]} params.ids - Entity ids
 * @param {Object} params.params - DynamoDB params
 */
AccessService.prototype.entitiesByIds = function(params) {
	var ids = _.uniq(params.ids);

	return models.Entity.getItemsAsync(ids, formatEntityParams(params.params)).then(get);
};

AccessService.prototype.entitiesByEnglishWikiId = function(params) {
	var self = this;
	return this.entitiesIdsByEnglishWikiId(params)
		.then(function(ids) {
			if (ids && ids.length > 0) {
				return self.entitiesByIds({
					ids: ids,
					params: params.params
				});
			}
		});
};

AccessService.prototype.entitiesIdsByEnglishWikiId = function(params) {
	return models.Entity
		.query(params.id)
		.usingIndex('Entities-englishWikiId-index')
		.limit(100)
		.select('ALL_PROJECTED_ATTRIBUTES')
		.execAsync()
		.then(get).then(function(result) {
			if (result && result.length > 0) {
				return _.pluck(result, 'id');
			}
			return [];
		});
};

/**
 * Find an entity id by entity key.
 * @param {Object} params - Finding params
 * @param {String} params.key - Entity's key
 * @param {Object} params.params - DynamoDB params
 * @returns {Number} Entity's id.
 */
AccessService.prototype.entityIdByNameKey = function(params) {
	return models.EntityNameKey.getAsync(params.key)
		.then(get)
		.then(function(nameKey) {
			if (nameKey) {
				return nameKey.entityId;
			}
			return nameKey;
		});
};

/**
 * Find an entity by entity name key.
 * @param {Object} params - Finding params
 * @param {String} params.key - Entity's name key
 * @param {Object} params.params - DynamoDB params
 * @returns {Entity} Returns founded entity.
 */
AccessService.prototype.entityByNameKey = function(params) {
	var self = this;
	return self.entityIdByNameKey(params)
		.then(function(entityId) {
			if (entityId) {
				return self.entityById({
					id: entityId,
					params: params.params
				});
			}
			return entityId;
		});
};

/**
 * Find an entity-name-key map by entity name keys.
 * @param {Object} params - Finding params
 * @param {String[]} params.keys - Entity's name keys
 * @param {Object} params.params - DynamoDB params
 * @returns {Entity[]} Returns founded entities.
 */
AccessService.prototype.entitiesByNameKeys = function(params) {
	var self = this;

	return models.EntityNameKey.getItemsAsync(params.keys)
		.then(get)
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

			return self.entitiesByIds({
				ids: ids,
				params: params.params
			}).then(function(entities) {
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

/**
 * Find an entity by entity slug.
 * @param {Object} params - Finding params
 * @param {String} params.slug - Entity's slug
 * @param {String} params.lang - Entity's lang
 * @param {String} params.country - Entity's country
 * @param {Object} params.params - DynamoDB params
 * @returns {Entity} Returns founded entity.
 */
AccessService.prototype.entityBySlug = function(params) {
	params.key = EntityName.createKey(params.country, params.lang, params.slug.replace(/[-]+/g, ' ').trim());
	params = _.pick(params, 'params', 'key');
	return this.entityByNameKey(params);
};

module.exports = AccessService;
