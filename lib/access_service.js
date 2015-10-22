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

function formatEntityParams(params) {
	return _.defaults(params || {}, ENTITY_DEFAULT_PARAMS);
}

/**
 * Creates a a new AccessService.
 * @class
 */
function AccessService() {

}

/**
* Find an entity by entity id
* @param {Object} params - Finding params
* @param {Number} params.id - Entity's id
* @param {Object} params.params - DynamoDB params
*/
AccessService.prototype.entityById = function(params) {
	return models.Entity.getAsync(params.id, formatEntityParams(params.params)).then(get);
};

AccessService.prototype.entitiesByIds = function(params) {
	var ids = _.uniq(params.ids);

	return models.Entity.getItemsAsync(ids, formatEntityParams(params.params)).then(get);
};

AccessService.prototype.entityIdByKey = function(params) {
	return models.Entity
		.query(params.key)
		.usingIndex('Entities-key-index')
		.limit(1)
		.select('ALL_PROJECTED_ATTRIBUTES')
		.execAsync()
		.then(get).then(function(result) {
			if (result && result.length > 0) {
				return result[0].entityId;
			}
			return null;
		});
};

AccessService.prototype.entityByKey = function(params) {
	var self = this;
	return self.entityIdByKey(params)
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

// AccessService.prototype.entitiesByKeys = function(params) {
// 	return models.Entity
// 		.query(params.keys)
// 		.usingIndex('Entities-key-index')
// 		.limit(params.limit || params.keys.length)
// 		.select('ALL_PROJECTED_ATTRIBUTES')
// 		.execAsync()
// 		.then(get);
// };


/**
 * Entity by name key
 */
AccessService.prototype.entityByNameKey = function(params) {
	var self = this;
	return models.EntityNameKey.getAsync(params.key)
		.then(get)
		.then(function(result) {
			if (!result) {
				return result;
			}
			return self.entityById({
				id: result.entityId,
				params: params.params
			});
		});
};

/**
 * Entities-map by name keys
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

AccessService.prototype.entityBySlug = function(params) {
	params.key = EntityName.createKey(params.country, params.lang, params.slug.replace(/[-]+/g, ' ').trim());
	params = _.pick(params, 'params', 'key');
	return this.entityByNameKey(params);
};

module.exports = AccessService;
