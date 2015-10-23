'use strict';

var Model = require('./model');
var util = require('util');
var schemas = require('./db/schemas');
var EntityNameKeySchema = schemas.EntityNameKeySchema;
var SchemaKeys = Object.keys(EntityNameKeySchema);

var ModelConfig = {
	name: 'EntityNameKey'
};

/**
 * EntityNameKey model.
 * @param {(EntityNameKey|Object)} data - Data of the EntityNameKey model.
 * @class
 * @augments Model
 */
function EntityNameKey(data) {
	return Model.call(this, ModelConfig, EntityNameKey.normalize(data));
}

util.inherits(EntityNameKey, Model);

/**
 * Creates an EntityNameKey object.
 * @param {(Object|EntityNameKey)} data - Data to use for creating a new EntityNameKey
 * @returns {EntityNameKey} Returns the EntityNameKey passed as param `data` or a new created EntityNameKey.
 */
EntityNameKey.create = function(data) {
	return Model.create(EntityNameKey, data);
};

/**
 * Normalize an EntityNameKey's data object.
 * @param {(Object|EntityNameKey)} data - Data to use for creating a new EntityNameKey
 * @returns {(EntityNameKey|Object)} Returns the EntityNameKey passed as param `data` or an normalized data object.
 */
EntityNameKey.normalize = function(data) {
	return Model.normalize(SchemaKeys, data);
};

module.exports = EntityNameKey;
