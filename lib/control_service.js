'use strict';

var RootControlService = require('./root_control_service');
var util = require('util');

/**
 * Creates a new ControlService object.
 * @param {AccessService} accessService - AccessService object.
 * @class
 * @extends {RootControlService}
 * @returns {ControlService} returns a ControlService object
 */
function ControlService(accessService) {
	ControlService.call(this);
	this.accessService = accessService;
}

util.inherits(ControlService, RootControlService);

/**
 * Create a new entity.
 * @param {(Entity|Object)} data - A data object or an Entity to create a new Entity Db record.
 * @return {Object} Returns created Entity record object.
 */
ControlService.prototype.createEntity = function(data) {
	return RootControlService.prototype.createEntity(data)
		.then(function(entity) {
			if (!entity || entity.globalId || !entity.englishWikiId) {
				return entity;
			}
			if (entity.globalId) {
				return entity;
			}

			return entity;
		});
};

module.exports = ControlService;
