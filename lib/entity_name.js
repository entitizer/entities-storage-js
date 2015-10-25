'use strict';

var utils = require('./utils');
var _ = utils._;
var atonic = utils.atonic;
var md5 = utils.md5;
var assert = require('assert');
var ENTITY_NAME_TYPE = require('./db/schemas').ENTITY_NAME_TYPE;
var Model = require('./model');
var util = require('util');

var ModelConfig = {
	name: 'EntityName'
};

function createUniqueName(name) {
	assert.ok(name);
	name = atonic(name.toLowerCase());
	name = name.replace(/[\[\]\(\)_?!:.,;~"'\\|&*^%$#@+=`\/-]+/g, ' ').replace(/ {2,}/g, ' ').trim();
	return name;
}

function createKey(name, lang, country) {
	assert.ok(country);
	assert.ok(lang);
	assert.ok(name);
	name = createUniqueName(name);

	return md5([country.toLowerCase(), lang.toLowerCase(), name].join('_'));
}

function normalize(name, lang, country) {
	name = _.clone(name);
	name.name = name.name.trim();

	name.uniqueName = name.uniqueName || createUniqueName(name.name);
	name.key = name.key || createKey(name.name, lang, country);
	name.type = name.type || ENTITY_NAME_TYPE.SIMPLE;

	return name;
}

/**
 * EntityName model.
 * @param {(EntityName|Object)} data - Data of the EntityName model.
 * @param {String} scope - Model's scope. Can be `create` or `update`.
 * @class
 * @augments Model
 */
function EntityName(data, scope) {
	return Model.call(this, ModelConfig, data, scope);
}

util.inherits(EntityName, Model);

/**
 * Creates an EntityName object.
 * @param {(Object|EntityName)} data - Data to use for creating a new EntityName
 * @param {String} scope - Model's scope. Can be `create` or `update`.
 * @returns {EntityName} Returns the EntityName passed as param `data` or a new created EntityName.
 */
EntityName.create = function(data, scope) {
	return Model.create(EntityName, data, scope);
};

/**
 * Normalize an EntityName's data object.
 * @param {string} lang - Language 2 letters code.
 * @param {string} country - Country 2 letters code.
 * @returns {EntityName} Returns this.
 */
EntityName.prototype.normalize = function(lang, country) {
	Model.prototype.normalize.call(this);
	var data = this.getData();
	this.data = normalize(data, lang, country);
	return this;
};

/**
 * Creates an EntityName's key property.
 * @param {string} name - EntityName name param.
 * @param {string} lang - Language 2 letters code.
 * @param {string} country - Country 2 letters code.
 * @returns {string} Returns a created EntityName key.
 */
EntityName.createKey = function(name, lang, country) {
	return createKey(name, lang, country);
};

/**
 * Creates an EntityName's uniqueName property.
 * @param {string} name - EntityName name param.
 * @returns {string} Returns a created EntityName uniqueName.
 */
EntityName.createUniqueName = function(name) {
	return createUniqueName(name);
};

module.exports = EntityName;
