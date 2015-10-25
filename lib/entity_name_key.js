'use strict';

var Model = require('./model');
var util = require('util');

var ModelConfig = {
	name: 'EntityNameKey'
};

/**
 * EntityNameKey model.
 * @param {(EntityNameKey|Object)} data - Data of the EntityNameKey model.
 * @param {String} scope - Model's scope. Can be `create` or `update`.
 * @class
 * @augments Model
 */
function EntityNameKey(data, scope) {
	return Model.call(this, ModelConfig, data, scope);
}

util.inherits(EntityNameKey, Model);

/**
 * Creates an EntityNameKey object.
 * @param {(Object|EntityNameKey)} data - Data to use for creating a new EntityNameKey
 * @param {String} scope - Model's scope. Can be `create` or `update`.
 * @returns {EntityNameKey} Returns the EntityNameKey passed as param `data` or a new created EntityNameKey.
 */
EntityNameKey.create = function(data, scope) {
	return Model.create(EntityNameKey, data, scope);
};

module.exports = EntityNameKey;
