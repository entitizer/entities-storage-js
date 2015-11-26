'use strict';

var schemas = require('./schemas');
var updateSchema = schemas.UpdateEntitySchema;
var Entity = require('../entity');


exports.Entity = {
	name: 'Entity',
	updateSchema: updateSchema,
	createNormalize: Entity.normalizeCreate,
	updateNormalize: Entity.normalizeUpdate,
	createValidate: Entity.validateCreate,
	updateValidate: Entity.validateUpdate
};

exports.EntityKey = {
	name: 'EntityKey'
};
