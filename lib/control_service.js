'use strict';

var vogels = require('vogels-helpers');

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
	options = options || {};

	options.format = options.format || 'json';
	var params = options.params = options.params || {};
	params.ConditionExpression = '#slug_key <> :slug_key AND #id <> :id';

	params.ExpressionAttributeNames = {
		'#slug_key': 'slug_key',
		'#id': 'id'
	};
	params.ExpressionAttributeValues = {
		':slug_key': data.slug_key,
		':id': data.id
	};

	return vogels.control.create('Entity', data, options);
};

/**
 * Create a new entity name key.
 * @param {(EntityNameKey|Object)} data - A data object or a EntityNameKey to create a new EntityNameKey Db record.
 * @return {Object} Returns created EntityNameKey record object.
 */
ControlService.prototype.createEntityNameKey = function(data, options) {
	options = options || {};
	options.format = options.format || 'json';


	return vogels.control.create('EntityNameKey', data, options);
};
