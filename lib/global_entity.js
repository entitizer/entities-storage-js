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
var counter = require('./counter');

var ModelConfig = {
	name: 'GlobalEntity'
};

function createSlugKey(data) {
	assert.ok(data);
	assert.ok(data.slug);

	return md5([data.slug.toLowerCase()].join('_'));
}

function createEntityCulture(data) {
	assert.ok(data);
	assert.ok(data.lang);
	assert.ok(data.country);

	return [data.lang.toLowerCase(), data.country.toLowerCase()].join('_');
}

function normalizeCreate(entity) {
	entity = _.clone(entity);
	// var entity = _.pick(data, 'id', 'name', 'slug', 'description', 'englishWikiId', 'englishWikiName', 'abbr', 'names', 'entities', 'type', 'category', 'region');
	entity.name = entity.name || entity.englishWikiName;
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
		if (entity.name !== entity.englishWikiName) {
			entity.names.en.wikiName = entity.englishWikiName;
		}
		if (entity.abbr) {
			entity.names.en.abbr = entity.abbr;
		}
	}

	return entity;
}

function validateCreate() {
	// if (!entity.entities || Object.keys(entity.entities) === 0) {
	// 	throw new Error('GlobalEntity.entities cannot be empty');
	// }
	// if (!entity.names || Object.keys(entity.names) < 2 || !entity.names.en) {
	// 	throw new Error('GlobalEntity.names must contain minimum 2 names');
	// }
	// if (!_.isNumber(entity.englishWikiId)) {
	// 	throw new Error('GlobalEntity.englishWikiId cannot be empty');
	// }
	// if (!_.isString(entity.englishWikiName)) {
	// 	throw new Error('GlobalEntity.englishWikiName cannot be empty');
	// }
}

function normalizeUpdate(entity) {
	entity = _.clone(entity);
	// var entity = _.pick(data, 'id', 'name', 'slug', 'description', 'englishWikiId', 'englishWikiName', 'abbr', 'names', 'entities', 'type', 'category', 'region');
	if (entity.name) {
		entity.name = entity.name.trim();
		if (entity.lang) {
			entity.name = utils.correctText(entity.name, entity.lang);
		}
		entity.atonicName = entity.atonicName || atonic(entity.name);
		if (entity.name === entity.atonicName) {
			delete entity.atonicName;
		}
		entity.slug = entity.slug || GlobalEntity.createSlug(entity.name);
		entity.slug_key = GlobalEntity.createSlugKey(entity);
	}
	if (_.isString(entity.abbr)) {
		entity.abbr = entity.abbr.trim();
	}

	if (_.isString(entity.description)) {
		entity.description = _.trunc(entity.description.trim(), 400);
	}

	return entity;
}

function validateUpdate() {
	// if (entity.entities && Object.keys(entity.entities) === 0) {
	// 	throw new Error('GlobalEntity.entities cannot be empty');
	// }
	// if (entity.names && !entity.names.en) {
	// 	throw new Error('GlobalEntity.names cannot be empty & must contain language en');
	// }
	// if (_.isNull(entity.name)) {
	// 	throw new Error('GlobalEntity.name cannot be empty');
	// }
}

/**
 * GlobalEntity model.
 * @param {(GlobalEntity|Object)} data - Data of the GlobalEntity model.
 * @param {String} scope - Model's scope. Can be `create` or `update`.
 * @class
 * @augments Model
 */
function GlobalEntity(data, scope) {
	return Model.call(this, ModelConfig, data, scope);
}

util.inherits(GlobalEntity, Model);

/**
 * Normalize a GlobalEntity's data object.
 * @returns {GlobalEntity} Returns this.
 */
GlobalEntity.prototype.normalize = function() {
	var data = this.getData();
	if (this.isCreating()) {
		this.data = normalizeCreate(data);
	} else {
		this.data = normalizeUpdate(data);
	}
	return Model.prototype.normalize.call(this);
};

/**
 * Validate a GlobalEntity's data object.
 * @returns {GlobalEntity} Returns this.
 */
GlobalEntity.prototype.validate = function() {
	Model.prototype.validate.call(this);
	var data = this.getData();
	if (this.isCreating()) {
		validateCreate(data);
	} else {
		validateUpdate(data);
	}
	return this;
};

/**
 * Creates an GlobalEntity object.
 * @param {(Object|GlobalEntity)} data - Data to use for creating a new GlobalEntity
 * @param {String} scope - Model's scope. Can be `create` or `update`.
 * @returns {GlobalEntity} Returns the GlobalEntity passed as param `data` or a new created GlobalEntity.
 */
GlobalEntity.create = function(data, scope) {
	return Model.create(GlobalEntity, data, scope);
};

/**
 * Creates an GlobalEntity's slug property.
 * @param {string} name - GlobalEntity name param.
 * @returns {String} Returns a created GlobalEntity slug.
 */
GlobalEntity.createSlug = function(name) {
	return Entity.createSlug(name);
};

/**
 * Creates an GlobalEntity's slug_key property.
 * @param {Object} data - GlobalEntity's data.
 * @returns {String} Returns a created GlobalEntity slug_key.
 */
GlobalEntity.createSlugKey = function(data) {
	return createSlugKey(data);
};

/**
 * Creates an entity culture string.
 * @param {Object} data - GlobalEntity's data.
 * @returns {String} Returns a created entity culture: en_us.
 */
GlobalEntity.createEntityCulture = function(data) {
	return createEntityCulture(data);
};

/**
 * Creates a new GlobalEntity id.
 * @returns {Promise<int>} Returns a promise that will return a new id.
 */
GlobalEntity.createNewId = function() {
	return counter.nextGlobalEntityId();
};

module.exports = GlobalEntity;
