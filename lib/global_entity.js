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
 * @param {String} scope - Model's scope. Can be `create` or `update`.
 * @class
 * @augments Model
 */
function GlobalEntity(data, scope) {
	return Model.call(this, ModelConfig, data, scope);
}

util.inherits(GlobalEntity, Model);

/**
 * Normalize an GlobalEntity's data object.
 * @returns {GlobalEntity} Returns this.
 */
GlobalEntity.prototype.normalize = function() {
	Model.prototype.normalize.call(this);
	if (this.isCreating()) {
		var data = this.getData();
		normalize(data);
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

module.exports = GlobalEntity;
