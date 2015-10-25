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
	entity = _.clone(entity);
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
		name = EntityName.create(name).normalize(entity.lang, entity.country).getData();
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
 * @param {String} scope - Model's scope. Can be `create` or `update`.
 * @class
 * @augments Model
 */
function Entity(data, scope) {
	return Model.call(this, ModelConfig, data, scope);
}

util.inherits(Entity, Model);

/**
 * Normalize an Entity's data object.
 * @returns {Entity} Returns this.
 */
Entity.prototype.normalize = function() {
	Model.prototype.normalize.call(this);
	if (this.isCreating()) {
		var data = this.getData();
		this.data = normalize(data);
	}
	return this;
};

/**
 * Creates an Entity object.
 * @param {(Object|Entity)} data - Data to use for creating a new Entity
 * @param {String} scope - Model's scope. Can be `create` or `update`.
 * @returns {Entity} Returns the Entity passed as param `data` or a new created Entity.
 */
Entity.create = function(data, scope) {
	return Model.create(Entity, data, scope);
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
