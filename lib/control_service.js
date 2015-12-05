'use strict';

var vogels = require('vogels-helpers');
var utils = require('./utils');
var buildOptions = utils.buildServiceOptions;

/**
 * Creates a new ControlService object.
 * @class
 * @returns {ControlService} returns a ControlService object
 */
function ControlService() {

}

module.exports = ControlService;

/**
 * Create a new entity.
 * @param {(Entity|Object)} data - A data object or an Entity to create a new Entity Db record.
 * @return {Object} Returns created Entity record object.
 */
ControlService.prototype.createEntity = function(data, options) {
	options = buildOptions(options);

	return vogels.control.create('Entity', data, options);
};

ControlService.prototype.putEntity = function(data, options) {
	options = buildOptions(options);

	return vogels.control.put('Entity', data, options);
};

ControlService.prototype.updateEntity = function(data, options) {
	options = buildOptions(options);

	return vogels.control.update('Entity', data, options);
};

ControlService.prototype.deleteEntity = function(key, options) {
	options = buildOptions(options);

	return vogels.control.destroy('Entity', key, options);
};

/**
 * Create a new entity name key.
 * @param {(EntityEntityName|Object)} data - A data object or a EntityEntityName to create a new EntityEntityName Db record.
 * @return {Object} Returns created EntityEntityName record object.
 */
ControlService.prototype.createEntityName = function(data, options) {
	options = buildOptions(options);

	return vogels.control.create('EntityName', data, options);
};

ControlService.prototype.putEntityName = function(data, options) {
	options = buildOptions(options);

	return vogels.control.put('EntityName', data, options);
};

ControlService.prototype.deleteEntityName = function(key, options) {
	options = buildOptions(options);

	return vogels.control.destroy('EntityName', key, options);
};
