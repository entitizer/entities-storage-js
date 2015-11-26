'use strict';

var vogels = require('vogels-helpers');

function initOptions(options) {
	options = options || {};
	options.format = options.format || 'json';

	return options;
}

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
	options = initOptions(options);

	return vogels.control.create('Entity', data, options);
};

ControlService.prototype.updateEntity = function(data, options) {
	options = initOptions(options);

	return vogels.control.update('Entity', data, options);
};

ControlService.prototype.deleteEntity = function(key, options) {
	options = initOptions(options);

	return vogels.control.destroy('Entity', key, options);
};

/**
 * Create a new entity name key.
 * @param {(EntityNameKey|Object)} data - A data object or a EntityNameKey to create a new EntityNameKey Db record.
 * @return {Object} Returns created EntityNameKey record object.
 */
ControlService.prototype.createEntityKey = function(data, options) {
	options = initOptions(options);

	return vogels.control.create('EntityKey', data, options);
};

ControlService.prototype.deleteEntityKey = function(key, options) {
	options = initOptions(options);

	return vogels.control.destroy('EntityKey', key, options);
};
