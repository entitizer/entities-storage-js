'use strict';

var utils = require('./utils');
var atonic = utils.atonic;
var md5 = utils.md5;
var assert = require('assert');

function createUniqueName(name) {
	assert.ok(name);
	return atonic(name.toLowerCase());
}

function createKey(country, lang, name) {
	assert.ok(country);
	assert.ok(lang);
	assert.ok(name);
	name = createUniqueName(name);

	return md5([country.toLowerCase(), lang.toLowerCase(), name].join('_'));
}

function normalize(name, country, lang) {
	name.name = name.name.trim();
	name.uniqueName = name.uniqueName || createUniqueName(name.name);
	name.key = name.key || createKey(country, lang, name.name);

	return name;
}

function createValidation(data) {
	assert.ok(data);
	assert.ok(data.topicId);
	assert.ok(data.key);

	return data;
}

exports.createKey = createKey;
exports.createUniqueName = createUniqueName;
exports.normalize = normalize;
exports.createValidation = createValidation;
