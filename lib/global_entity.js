'use strict';

var utils = require('./utils');
var _ = utils._;
var atonic = utils.atonic;
var Entity = require('./entity');
var Model = require('./model');
var util = require('util');
var schemas = require('./db/schemas');
var GlobalEntitySchema = schemas.GlobalEntitySchema;
var SchemaKeys = Object.keys(GlobalEntitySchema);

var ModelConfig = {
	name: 'GlobalEntity'
};

function normalize(entity) {
	// var entity = _.pick(data, 'id', 'name', 'slug', 'description', 'englishWikiId', 'englishWikiName', 'abbr', 'names', 'entities', 'type', 'category', 'region');
	entity.name = entity.name.trim();
	entity.name = utils.correctText(entity.name, entity.lang);
	entity.atonicName = entity.atonicName || atonic(entity.name);
	if (entity.name === entity.atonicName) {
		delete entity.atonicName;
	}
	if (entity.abbr) {
		entity.abbr = entity.abbr.trim();
	}

	entity.slug = entity.slug || Entity.createSlug(entity.name);
	entity.slug_key = Entity.createSlugKey(entity);

	if (entity.description) {
		entity.description = _.trunc(entity.description.trim(), 400);
	}

	entity.names = entity.names || {};

	if (!entity.names.en) {
		entity.names.en = {
			name: entity.name
		};
		if (entity.abbr) {
			entity.names.en.abbr = entity.abbr;
		}
	}

	return entity;
}

/**
 * GlobalEntity model.
 * @param {(GlobalEntity|Object)} data - Data of the GlobalEntity model.
 * @class
 * @augments Model
 */
function GlobalEntity(data) {
	return Model.call(this, ModelConfig, GlobalEntity.normalize(data));
}

util.inherits(GlobalEntity, Model);

/**
 * Creates an GlobalEntity object.
 * @param {(Object|GlobalEntity)} data - Data to use for creating a new GlobalEntity
 * @returns {GlobalEntity} Returns the GlobalEntity passed as param `data` or a new created GlobalEntity.
 */
GlobalEntity.create = function(data) {
	return Model.create(GlobalEntity, data);
};

/**
 * Normalize an GlobalEntity's data object.
 * @param {(Object|GlobalEntity)} data - Data to use for creating a new GlobalEntity
 * @returns {(GlobalEntity|Object)} Returns the GlobalEntity passed as param `data` or an normalized data object.
 */
GlobalEntity.normalize = function(data) {
	if (data instanceof Model) {
		return data;
	}
	data = Model.normalize(SchemaKeys, data);
	return normalize(data);
};

module.exports = GlobalEntity;
