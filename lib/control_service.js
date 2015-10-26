'use strict';

var RootControlService = require('./root_control_service');
var util = require('util');
var utils = require('./utils');
var Promise = utils.Promise;
var _ = utils._;
var GlobalEntity = require('./global_entity');

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

	function createGlobalEntityData(entity, entities) {
		entity.names = {};
		entity.entities = entity.entities || {};
		entities.forEach(function(ent) {
			// names:
			entity.names[ent.lang] = entity.names[ent.lang] || {
				name: ent.name
			};
			entity.names[ent.lang].abbr = entity.names[ent.lang].abbr || ent.abbr;
			if (!entity.names[ent.lang].abbr) {
				delete entity.names[ent.lang].abbr;
			}
			if (!entity.names[ent.lang].wikiName && ent.wikiName && ent.wikiName !== entity.names[ent.lang].name) {
				entity.names[ent.lang].wikiName = ent.wikiName;
			}
			// entities:
			entity.entities[ent.country] = ent.id;
		});
	}

	function update(entity, globalEntity, entities, updateGE) {
		createGlobalEntityData(globalEntity, entities);

		var jobs = [];
		var entitiesToUpdate = entities.filter(function(ent) {
			return ent.globalId !== globalEntity.id;
		});
		entitiesToUpdate = entitiesToUpdate.map(function(ent) {
			return {
				id: ent.id,
				globalId: globalEntity.id
			};
		});
		// update entity globalId
		jobs.push(Promise.resolve(entitiesToUpdate).each(function(ent) {
			return self.updateEntity(ent);
		}));

		if (updateGE !== false) {
			// update global entity names & entities
			jobs.push(self.updateGlobalEntity(_.pick(globalEntity, 'id', 'names', 'entities')));
		}
		return Promise.all(jobs)
			.then(function() {
				return entity;
			});
	}

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
					return update(entity, globalEntity, entities);
				} else {
					var entityWithEnglishWikiId = _.find(entities, function(ent) {
						return ent.englishWikiId > 0;
					});
					if (!entityWithEnglishWikiId) {
						console.log('no entity with english wiki id!');
						return entity;
					}
					globalEntity = _.pick(entityWithEnglishWikiId, 'englishWikiId', 'englishWikiName', 'category', 'type', 'region');
					globalEntity.name = entityWithEnglishWikiId.englishWikiName;
					createGlobalEntityData(globalEntity, entities);

					return GlobalEntity.createNewId()
						.then(function(id) {
							globalEntity.id = id;
							return self.createGlobalEntity(globalEntity)
								.then(function(dbGlobalEntity) {
									return update(entity, dbGlobalEntity, entities, false);
								});
						});
				}
			});
		});
};

module.exports = ControlService;
