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

ControlService.prototype.executeAction = require('./actions/execute_action');

/**
 * Create a new entity.
 * @param {(Entity|Object)} data - A data object or an Entity to create a new Entity Db record.
 * @return {Object} Returns created Entity record object.
 */
ControlService.prototype.createEntity = function(data, options) {
	options = buildOptions(options);

	return vogels.control.create('Entitizer_Entity', data, options);
};

ControlService.prototype.putEntity = function(data, options) {
	options = buildOptions(options);

	return vogels.control.put('Entitizer_Entity', data, options);
};

ControlService.prototype.updateEntity = function(data, options) {
	options = buildOptions(options);

	return vogels.control.update('Entitizer_Entity', data, options);
};

ControlService.prototype.deleteEntity = function(key, options) {
	options = buildOptions(options);

	return vogels.control.destroy('Entitizer_Entity', key, options);
};

/**
 * Create a new entity name key.
 * @param {(EntityEntityName|Object)} data - A data object or a EntityEntityName to create a new EntityEntityName Db record.
 * @return {Object} Returns created EntityEntityName record object.
 */
ControlService.prototype.createEntityName = function(data, options) {
	options = buildOptions(options);

	return vogels.control.create('Entitizer_EntityName', data, options);
};

ControlService.prototype.putEntityName = function(data, options) {
	options = buildOptions(options);

	return vogels.control.put('Entitizer_EntityName', data, options);
};

ControlService.prototype.deleteEntityName = function(key, options) {
	options = buildOptions(options);

	return vogels.control.destroy('Entitizer_EntityName', key, options);
};

ControlService.prototype.createAction = function(data, options) {
	options = buildOptions(options);

	return vogels.control.create('Entitizer_Action', data, options);
};

ControlService.prototype.updateAction = function(data, options) {
	options = buildOptions(options);

	return vogels.control.update('Entitizer_Action', data, options);
};
