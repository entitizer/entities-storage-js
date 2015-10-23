'use strict';

var utils = require('./utils');
var atonic = utils.atonic;
var md5 = utils.md5;
var assert = require('assert');
var ENTITY_NAME_TYPE = require('./db/schemas').ENTITY_NAME_TYPE;
var Model = require('./model');
var util = require('util');
var schemas = require('./db/schemas');
var EntityNameSchema = schemas.EntityNameSchema;
var SchemaKeys = Object.keys(EntityNameSchema);

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
	name.name = name.name.trim();

	name.uniqueName = name.uniqueName || createUniqueName(name.name);
	name.key = name.key || createKey(name.name, lang, country);
	name.type = name.type || ENTITY_NAME_TYPE.SIMPLE;

	return name;
}

/**
 * EntityName model.
 * @param {(EntityName|Object)} data - Data of the EntityName model.
 * @param {String} lang - Language 2 letters code,
 * @param {String} country - Country 2 letters code,
 * @class
 * @augments Model
 */
function EntityName(data, lang, country) {
	if (lang && country) {
		data = EntityName.normalize(data, lang, country);
	}
	return Model.call(this, ModelConfig, data);
}

util.inherits(EntityName, Model);

/**
 * Creates an EntityName object.
 * @param {(Object|EntityName)} data - Data to use for creating a new EntityName
 * @returns {EntityName} Returns the EntityName passed as param `data` or a new created EntityName.
 */
EntityName.create = function(data) {
	return Model.create(EntityName, data);
};

/**
 * Normalize an EntityName's data object.
 * @param {(Object|EntityName)} data - Data to use for creating a new EntityName
 * @param {string} lang - Language 2 letters code.
 * @param {string} country - Country 2 letters code.
 * @returns {(EntityName|Object)} Returns the EntityName passed as param `data` or an normalized data object.
 */
EntityName.normalize = function(data, lang, country) {
	if (data instanceof Model) {
		return data;
	}
	data = Model.normalize(SchemaKeys, data);
	return normalize(data, lang, country);
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
