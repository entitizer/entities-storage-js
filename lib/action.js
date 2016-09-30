'use strict';

var utils = require('./utils');
var _ = utils._;
var sha1 = utils.sha1;
var assert = require('assert');
var schemas = require('./db/schemas');
var updateSchema = schemas.UpdateActionSchema;

var createId = exports.createId = function(data) {
	assert.ok(data);

	return sha1([data.culture.toLowerCase(), data.type.toLowerCase(), data.dataHash.toLowerCase()].join('_'));
};

var createDataHash = exports.createDataHash = function(data) {
	assert.ok(data);

	return utils.objHash(data);
};

var createCulture = exports.createCulture = function(data) {
	return [data.lang.toLowerCase(), data.country.toLowerCase()].join('_');
};

var createStatusKey = exports.createStatusKey = function(data) {
	return [data.culture.toLowerCase(), data.status.toLowerCase()].join('_');
};

// var validateData = function(data, action) {
// 	var result;
// 	switch (action) {
// 		case ACTIONS.CREATE_ENTITY:
// 			result = Joi.validate(data, schemas.EntityDataSchema);
// 			break;
// 		case ACTIONS.UPDATE_ENTITY:
// 			result = Joi.validate(data, schemas.ActionUpdateSchema);
// 			break;
// 			case
// 	}
// };

var normalizeCreate = exports.normalizeCreate = function(data) {
	if (!data.lang || !data.country) {
		throw new Error('`lang` AND `country` are required on creating Action');
	}

	data = _.clone(data);

	data.lang = data.lang.toLowerCase();
	data.country = data.country.toLowerCase();
	data.culture = createCulture(data);

	data.status = 'new';
	data.statusKey = createStatusKey(data);

	data.dataHash = createDataHash(data.data);

	data.data = JSON.stringify(data.data);

	data.id = createId(data);

	delete data.createdAt;
	delete data.updatedAt;

	return data;
};

var normalizeUpdate = exports.normalizeUpdate = function(data) {

	data = _.pick(data, 'id', 'lang', 'country', 'status', 'entityId', 'resultData');

	if (!data.id) {
		throw new Error('`id` is required on update');
	}

	if (!data.lang || !data.country) {
		throw new Error('`lang` AND `country` are required on update Action');
	}

	if (!data.status) {
		throw new Error('`status` is required on update');
	}

	data.lang = data.lang.toLowerCase();
	data.country = data.country.toLowerCase();
	data.culture = createCulture(data);

	data.statusKey = createStatusKey(data);

	delete data.updatedAt;
	delete data.country;
	delete data.lang;
	delete data.culture;
	delete data.entityId;

	return data;
};

var validateCreate = exports.validateCreate = function(data) {
	if (!data.lang || !data.country) {
		throw new Error('Action: `lang` AND `country` are required');
	}
	if (!data.data) {
		throw new Error('Action: `data` is required');
	}
	if (!data.type) {
		throw new Error('Action: `type` is required');
	}
};

var validateUpdate = exports.validateUpdate = function(data) {
	if (!data.lang || !data.country) {
		throw new Error('Action: `country` OR `lang` are required for updating');
	}
	if (!data.status) {
		throw new Error('Action: `status` is required');
	}
};

exports.config = {
	name: 'Entitizer_Action',
	updateSchema: updateSchema,
	createNormalize: normalizeCreate,
	updateNormalize: normalizeUpdate,
	createValidate: validateCreate,
	updateValidate: validateUpdate
};
