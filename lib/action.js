'use strict';

var utils = require('./utils');
var _ = utils._;
var assert = require('assert');
var objectHash = require('object-hash');
var ACTIONS = require('./db/schemas').ACTIONS;

function createDataHash(type, data) {
	switch (type) {
		case ACTIONS.CREATE_ENTITY:
			if (data.wikiId) {
				data = _.pick(data, 'wikiId');
			} else {
				data = _.pick(data, 'name');
			}
			break;
	}
	return objectHash(data, {
		algorithm: 'md5'
	}).toLowerCase();
}

function createId(action) {
	var entityId = action.entityId || '.';
	var entityNameKey = action.entityNameKey || '.';

	var date = new Date();
	var month = date.getUTCMonth() + 1;
	month = month < 10 ? '0' + month.toString() : month;
	date = [date.getUTCFullYear(), month].join('');

	action.dataHash = action.dataHash || createDataHash(action.type, action.data);

	var hash = [action.country.toLowerCase(),
		action.lang.toLowerCase(),
		action.type.toLowerCase(),
		entityId.toString(),
		entityNameKey.toString(),
		date,
		action.dataHash
	].join('#');

	return utils.md5(hash);
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
	data = _.pick(data, 'status', 'country', 'lang', 'id', 'type', 'data', 'entityId', 'entityNameKey', 'resultInfo');
	data.status = data.status || 'new';
	data.lang = data.lang.toLowerCase();
	data.country = data.country.toLowerCase();
	data.culture = createCulture(data);
	data.statusKey = createStatusKey(data);
	data.dataHash = createDataHash(data.type, data.data);
	data.id = data.id || createId(data);

	return data;
}

exports.createId = createId;
exports.createDataHash = createDataHash;
exports.createCulture = createCulture;
exports.normalize = normalize;
exports.createStatusKey = createStatusKey;
