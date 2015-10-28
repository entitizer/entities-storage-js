'use strict';

var utils = require('./utils');
var _ = utils._;
var Promise = utils.Promise;
var GlobalEntity = require('./global_entity');

function fillGlobalEntityFromEntities(entity, entities) {
	entity.names = entity.names || {};
	entity.entities = entity.entities || {};
	entities.forEach(function(ent) {
		// names:
		var name = entity.names[ent.lang];
		name = name || {
			name: ent.name
		};
		if (name.name !== ent.name) {
			name.name = ent.name;
		}
		name.abbr = name.abbr || ent.abbr;
		if (!name.abbr) {
			delete name.abbr;
		}
		name.wikiName = name.wikiName || ent.wikiName;
		if (!name.wikiName) {
			delete name.wikiName;
		}
		entity.names[ent.lang] = name;
		// entities:
		var culture = GlobalEntity.createEntityCulture(ent);
		entity.entities[culture] = ent.id;

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
		return control.setEntityDetails(ent);
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
