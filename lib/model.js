'use strict';

var utils = require('./utils');
var _ = utils._;
var schemas = require('./db/schemas');
var Joi = require('joi');
var dbHelpers = require('./db/helpers');

var SCOPE_CREATE = 'create';
var SCOPE_UPDATE = 'update';

/**
 * Base model class
 * @param {Object} config - Model config object.
 * @param {String} config.name - Model's name.
 * @param {Object} data - Model's data object.
 * @param {String} scope - Model's scope. Can be `create` or `update`.
 * @class
 */
function Model(config, data, scope) {
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

	scope = scope || SCOPE_CREATE;

	if ([SCOPE_CREATE, SCOPE_UPDATE].indexOf(scope) < 0) {
		throw new Error('Invalid model scope: ' + scope);
	}

	this.scope = scope;

	return this;
}

/**
 * Creates a model.
 * @param {Function} Creator - Model constructor.
 * @param {Object} data - Model's data object.
 * @param {String} scope - Model's scope. Can be `create` or `update`.
 * @returns {Model} Returns an object created with constructor `Creator`.
 */
Model.create = function(Creator, data, scope) {
	if (data instanceof Model) {
		return data;
	}
	return new Creator(data, scope);
};

Model.prototype.isCreating = function() {
	return this.scope === SCOPE_CREATE;
};

Model.prototype.isUpdating = function() {
	return this.scope === SCOPE_UPDATE;
};

/**
 * Normalize a model data.
 * @returns {Model} Returns this.
 */
Model.prototype.normalize = function() {
	var data = this.getData();
	var name = this.config.name + 'Schema';
	if (this.scope === SCOPE_UPDATE) {
		name = 'Update' + name;
	}
	var keys = dbHelpers.schemaKeys(name);
	this.data = _.pick(data, keys);
	return this;
};

/**
 * Validate a GlobalEntity's data object.
 * @virtual
 * @returns {GlobalEntity} Returns this.
 */
Model.prototype.validate = function() {
	var schemaName = [this.config.name, 'Schema'].join('');
	if (this.scope === SCOPE_UPDATE) {
		schemaName = 'Update' + schemaName;
	}
	var schema = schemas[schemaName];
	if (!schema) {
		throw new Error('Invalid schema name: ' + schemaName);
	}
	var data = this.getData();
	var result = _.isFunction(schema.validate) ? schema.validate(data) : Joi.validate(data, schema);
	if (result.error) {
		throw result.error;
	}

	return this;
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
