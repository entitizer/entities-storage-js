'use strict';

var utils = require('./utils');
var _ = utils._;
var schemas = require('./db/schemas');
var Joi = require('joi');

/**
 * Base model class
 * @param {Object} config - Model config object.
 * @param {String} config.name - Model's name.
 * @param {Object} data - Model's data object.
 * @class
 */
function Model(config, data) {
	if (data instanceof Model) {
		return data;
	}
	if (_.isPlainObject(data)) {
		this.data = data;
	} else {
		throw new Error('Model must contain a data object');
	}
	if (_.isPlainObject(config) && _.isString(config.name)) {
		this.config = config;
	} else {
		throw new Error('Model must contain a config object');
	}
}

/**
 * Creates a model.
 * @param {Function} Creator - Model constructor.
 * @param {Object} data - Model's data object.
 * @returns {Model} Returns an object created with constructor `Creator`.
 */
Model.create = function(Creator, data) {
	if (data instanceof Model) {
		return data;
	}
	return new Creator(data);
};

/**
 * Normalize a model data.
 * @param {String[]} schemaKeys - Object data valid keys.
 * @param {Object} data - Model's data object.
 * @returns {Object} Returns a normalized object for indicated model.
 */
Model.normalize = function(schemaKeys, data) {
	if (data instanceof Model) {
		return data;
	}
	if (!_.isPlainObject(data)) {
		return data;
	}
	return _.pick(data, schemaKeys);
};

/**
 * Validates a model data for creating a new DB record.
 */
Model.prototype.validateCreating = function() {
	var schemaName = [this.config.name, 'Schema'].join('');
	var schema = schemas[schemaName];
	if (!schema) {
		throw new Error('Invalid model name: ' + this.config.name);
	}
	var data = this.getData();
	var result = _.isFunction(schema.validate) ? schema.validate(data) : Joi.validate(data, schema);
	if (result.error) {
		throw result.error;
	}
	// this.data = result.value;
};

/**
 * Validates a model data for updating an existing DB record.
 */
Model.prototype.validateUpdating = function() {
	throw new Error('Not implemented method');
};

/**
 * Get model's data object.
 * @returns {Object} Returns the model's data object.
 */
Model.prototype.getData = function() {
	return this.data;
};

module.exports = Model;
