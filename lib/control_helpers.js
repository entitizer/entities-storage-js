'use strict';

var utils = require('./utils');
var _ = utils._;

function fillGlobalEntityFromEntities(entity, entities) {
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

		if (ent.category) {
			entity.category = entity.category || ent.category;
		}
		if (ent.type) {
			entity.type = entity.type || ent.type;
		}
		if (ent.region) {
			entity.region = entity.region || ent.region;
		}
	});
	return entity;
}

function updateGlobalEntityFromEntities(control, entity, globalEntity, entities, updateGE) {
	fillGlobalEntityFromEntities(globalEntity, entities);

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
		return control.updateEntity(ent);
	}));

	if (updateGE !== false) {
		// update global entity names & entities
		jobs.push(control.updateGlobalEntity(_.pick(globalEntity, 'id', 'names', 'entities', 'category', 'type', 'region')));
	}
	return Promise.all(jobs)
		.then(function() {
			return entity;
		});
}

exports.fillGlobalEntityFromEntities = fillGlobalEntityFromEntities;
exports.updateGlobalEntityFromEntities = updateGlobalEntityFromEntities;
