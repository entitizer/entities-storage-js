'use strict';

var utils = require('./utils');
var _ = utils._;
var assert = require('assert');

function createId() {
	return utils.uuid();
}

function createCulture(data) {
	return [data.lang.toLowerCase(), data.country.toLowerCase()].join('_');
}

function createStatusKey(data) {
	var culture = data.culture || createCulture(data);
	return [culture.toLowerCase(), data.status.toLowerCase()].join('_');
}

function normalize(data) {
	assert.ok(data);
	assert.ok(data.data);
	data = _.cloneDeep(data);
	data.status = data.status || 'new';
	data.lang = data.lang.toLowerCase();
	data.country = data.country.toLowerCase();
	data.statusKey = createStatusKey(data);
	data.id = data.id || createId();

	return data;
}

exports.createId = createId;
exports.createCulture = createCulture;
exports.normalize = normalize;
exports.createStatusKey = createStatusKey;
