'use strict';

var utils = require('./utils');
var _ = utils._;
var atonic = utils.atonic;
var slug = utils.slug;
var md5 = utils.md5;
var assert = require('assert');
var EntityName = require('./entity_name');
var ENTITY_NAME_TYPE = require('./db/schemas').ENTITY_NAME_TYPE;
var Model = require('./model');
var util = require('util');
var schemas = require('./db/schemas');
var EntitySchema = schemas.EntitySchema;
var SchemaKeys = Object.keys(EntitySchema);

var ModelConfig = {
	name: 'Entity'
};

function createSlug(name) {
	assert.ok(name);
	name = atonic(name.toLowerCase());

	return slug(name);
}

function createSlugKey(data) {
	assert.ok(data);
	assert.ok(data.slug);
	assert.ok(data.country);
	assert.ok(data.lang);

	return md5([data.country.toLowerCase(), data.lang.toLowerCase(), data.slug.toLowerCase()].join('_'));
}

function normalize(entity) {
	entity.lang = entity.lang.toLowerCase();
	entity.country = entity.country.toLowerCase();
	entity.name = entity.name.trim();
	entity.name = utils.correctText(entity.name, entity.lang);
	entity.atonicName = entity.atonicName || atonic(entity.name);
	if (entity.name === entity.atonicName) {
		delete entity.atonicName;
	}
	if (entity.abbr) {
		entity.abbr = entity.abbr.trim();
	}

	entity.slug = entity.slug || createSlug(entity.name);
	entity.slug_key = createSlugKey(entity);

	entity.names = entity.names || [];

	entity.names.push({
		name: entity.slug.replace(/[-]+/g, ' ').trim(),
		type: ENTITY_NAME_TYPE.SLUG
	});

	var names = [];
	var keys = {};

	for (var i = 0; i < 60 && i < entity.names.length; i++) {
		var name = entity.names[i];
		if (names.length === 50) {
			break;
		}
		var lname = name.name.trim().toLowerCase();
		if (keys[lname]) {
			continue;
		}
		keys[lname] = true;
		EntityName.normalize(name, entity.lang, entity.country);
		names.push(name);
	}

	entity.names = names;

	if (entity.description) {
		entity.description = _.trunc(entity.description.trim(), 400);
	}

	return entity;
}


/**
 * Entity model.
 * @param {(Entity|Object)} data - Data of the Entity model.
 * @class
 * @augments Model
 */
function Entity(data) {
	return Model.call(this, ModelConfig, Entity.normalize(data));
}

util.inherits(Entity, Model);

/**
 * Creates an Entity object.
 * @param {(Object|Entity)} data - Data to use for creating a new Entity
 * @returns {Entity} Returns the Entity passed as param `data` or a new created Entity.
 */
Entity.create = function(data) {
	return Model.create(Entity, data);
};

/**
 * Normalize an Entity's data object.
 * @param {(Object|Entity)} data - Data to use for creating a new Entity
 * @returns {(Entity|Object)} Returns the Entity passed as param `data` or an normalized data object.
 */
Entity.normalize = function(data) {
	if (data instanceof Model) {
		return data;
	}
	data = Model.normalize(SchemaKeys, data);
	return normalize(data);
};

/**
 * Creates an Entity's slug property.
 * @param {string} name - Entity name param.
 * @returns {string} Returns a created Entity slug.
 */
Entity.createSlug = function(name) {
	return createSlug(name);
};

/**
 * Creates an Entity's slug_key property.
 * @param {Object} data - Entity's data.
 * @returns {string} Returns a created Entity slug_key.
 */
Entity.createSlugKey = function(data) {
	return createSlugKey(data);
};

module.exports = Entity;
