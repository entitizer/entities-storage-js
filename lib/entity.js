'use strict';

/**
  @typedef EntityRecord
  @type {object}
  @property {number} id - an ID.
  @property {string} name - entity name.
  @property {string} slug - a slug.
  @property {string} slug_key - slug hash.
  @property {string} atonicName - name without accents, ASCII.
  @property {string} abbr - name abbreviation.
  @property {string} type - entity type: [place, person, group, brand, arts].
  @property {number} category - entity category: [10, 20, 30, 40, 50, 60, 70, 80, 90].
  @property {string} region - entity region: a country 2 letters code.
  @property {string} country - country 2 leters code.
  @property {string} lang - language 2 leters code.

  @property {number} wikiId - Wikipedia id.
  @property {string} wikiName - Wikipedia article name.
  @property {number} englishWikiId - English Wikipedia id.
  @property {string} englishWikiName - English Wikipedia article name.
  @property {string} description - Entity description.

  @property {number} globalId - GlobalEntity id.
  @property {EntityNameRecord[]} names - Entity names.

  @property {Date} createdAt - created datetime.
  @property {Date} updatedAt - updated datetime.
*/

var utils = require('./utils');
var _ = utils._;
var atonic = utils.atonic;
var md5 = utils.md5;
var slug = utils.slug;
var assert = require('assert');
var EntityName = require('./entity_name');
var ENTITY_NAME_TYPE = require('./db/schemas').ENTITY_NAME_TYPE;
var Model = require('./model');
var util = require('util');
var counter = require('./counter');

var ModelConfig = {
	name: 'Entity'
};

function createSlug(name) {
	assert.ok(name);
	name = EntityName.createUniqueName(name);

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
		name: entity.slug,
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
 * @param {(Entity|EntityRecord)} data - Data of the Entity model.
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
	if (this.isCreating()) {
		var data = this.getData();
		this.data = normalize(data);
	}
	return Model.prototype.normalize.call(this);
};

/**
 * Creates an Entity object.
 * @param {(EntityRecord|Entity)} data - Data to use for creating a new Entity
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
 * @param {EntityRecord} data - Entity's data.
 * @returns {string} Returns a created Entity slug_key.
 */
Entity.createSlugKey = function(data) {
	return createSlugKey(data);
};

/**
 * Creates a new Entity id.
 * @returns {Promise<int>} Returns a promise that will return a new id.
 */
Entity.createNewId = function() {
	return counter.nextEntityId();
};

module.exports = Entity;
