'use strict';

var utils = require('./utils');
var _ = utils._;
var atonic = utils.atonic;
var slug = utils.slug;
// var md5 = utils.md5;
var assert = require('assert');
var EntityName = require('./entity_name');
var ENTITY_NAME_TYPE = require('./db/schemas').ENTITY_NAME_TYPE;

function createSlug(name) {
	assert.ok(name);
	name = atonic(name.toLowerCase());

	return slug(name);
}

// function createKey(data) {
// 	assert.ok(data);
// 	assert.ok(data.slug);
// 	assert.ok(data.country);
// 	assert.ok(data.lang);

// 	return md5([data.country.toLowerCase(), data.lang.toLowerCase(), data.slug.toLowerCase()].join('_'));
// }

function normalize(data) {
	var entity = _.cloneDeep(data);
	entity.lang = entity.lang.toLowerCase();
	entity.country = entity.country.toLowerCase();
	entity.name = entity.name.trim();
	entity.atonicName = entity.atonicName || atonic(entity.name);
	if (entity.name === entity.atonicName) {
		delete entity.atonicName;
	}
	if (entity.abbr) {
		entity.abbr = entity.abbr.trim();
	}

	entity.slug = entity.slug || createSlug(entity.name);
	// entity.key = entity.key || createKey(entity);

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
		EntityName.normalize(name, entity.country, entity.lang);
		names.push(name);
	}

	entity.names = names;

	if (entity.description) {
		entity.description = _.trunc(entity.description.trim(), 400);
	}

	return entity;
}

// exports.createKey = createKey;
exports.createSlug = createSlug;
exports.normalize = normalize;
