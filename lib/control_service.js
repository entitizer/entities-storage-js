'use strict';

var RootControlService = require('./root_control_service');
var util = require('util');
var utils = require('./utils');
var Promise = utils.Promise;
var _ = utils._;
var GlobalEntity = require('./global_entity');
var helpers = require('./control_helpers');

/**
 * Creates a new ControlService object.
 * @param {AccessService} accessService - AccessService object.
 * @class
 * @extends {RootControlService}
 * @returns {ControlService} returns a ControlService object
 */
function ControlService(accessService) {
	RootControlService.call(this);
	this.accessService = accessService;
}

util.inherits(ControlService, RootControlService);

/**
 * Create a new entity.
 * @param {(Entity|Object)} data - A data object or an Entity to create a new Entity Db record.
 * @return {Object} Returns created Entity record object.
 */
ControlService.prototype.createEntity = function(data) {

	var self = this;
	var accessService = this.accessService;

	return RootControlService.prototype.createEntity(data)
		.then(function(entity) {
			if (!entity || entity.globalId || !entity.englishWikiId) {
				return entity;
			}

			return Promise.props({
				globalEntity: accessService.globalEntityByEnglishWikiId({
					id: entity.englishWikiId
				}),
				entities: accessService.entitiesByEnglishWikiId({
					id: entity.englishWikiId
				})
			}).then(function(props) {
				var globalEntity = props.globalEntity;
				var entities = props.entities || [];
				entities.push(entity);
				if (globalEntity) {
					console.log('updating globalEntity...', globalEntity.name);
					return helpers.updateGlobalEntityFromEntities(self, entity, globalEntity, entities);
				} else {
					console.log('new globalEntity...', entity.englishWikiName);
					var entityWithEnglishWikiId = _.find(entities, function(ent) {
						return ent.englishWikiId > 0 && ent.englishWikiName;
					});
					if (!entityWithEnglishWikiId) {
						console.log('no entity with english wiki id!');
						return entity;
					}
					globalEntity = _.pick(entityWithEnglishWikiId, 'englishWikiId', 'englishWikiName', 'category', 'type', 'region');
					globalEntity.name = entityWithEnglishWikiId.englishWikiName;
					helpers.fillGlobalEntityFromEntities(globalEntity, entities);

					return GlobalEntity.createNewId()
						.then(function(id) {
							globalEntity.id = id;
							return self.createGlobalEntity(globalEntity)
								.then(function(dbGlobalEntity) {
									return helpers.updateGlobalEntityFromEntities(self, entity, dbGlobalEntity, entities, false);
								});
						});
				}
			});
		});
};

module.exports = ControlService;
