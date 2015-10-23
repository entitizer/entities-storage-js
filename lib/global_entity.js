/*eslint no-use-before-define:1*/

'use strict';

var utils = require('./utils');
var _ = utils._;
var md5 = utils.md5;
var atonic = utils.atonic;
var Entity = require('./entity');
var Model = require('./model');
var util = require('util');
var assert = require('assert');
var schemas = require('./db/schemas');
var GlobalEntitySchema = schemas.GlobalEntitySchema;
var SchemaKeys = Object.keys(GlobalEntitySchema);

var ModelConfig = {
	name: 'GlobalEntity'
};


function createSlugKey(data) {
	assert.ok(data);
	assert.ok(data.slug);

	return md5([data.slug.toLowerCase()].join('_'));
}

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

	entity.slug = entity.slug || GlobalEntity.createSlug(entity.name);
	entity.slug_key = GlobalEntity.createSlugKey(entity);

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
 * Creates an GlobalEntity's slug property.
 * @param {string} name - GlobalEntity name param.
 * @returns {string} Returns a created GlobalEntity slug.
 */
GlobalEntity.createSlug = function(name) {
	return Entity.createSlug(name);
};

/**
 * Creates an GlobalEntity's slug_key property.
 * @param {Object} data - GlobalEntity's data.
 * @returns {string} Returns a created GlobalEntity slug_key.
 */
GlobalEntity.createSlugKey = function(data) {
	return createSlugKey(data);
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
