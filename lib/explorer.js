'use strict';

var internal = {};
var utils = require('./utils');
var _ = utils._;
var Promise = utils.Promise;
var EntityName = require('./entity_name');
var assert = require('assert');

function Service(accessService) {
	assert.ok(accessService);
	this.accessService = accessService;
}

module.exports = Service;

Service.prototype.entities = function(context, concepts) {
	var self = this;
	return this.explore(context, concepts).then(function(result) {
		return self.entitiesFromExploreResult(result);
	});
};

Service.prototype.entitiesFromExploreResult = function(result) {
	var ids = {};
	var entities = [];
	Object.keys(result).forEach(function(key) {
		var entity = result[key];
		if (ids[entity.id]) {
			if (entity.concepts) {
				entities[ids[entity.id] - 1].concepts = _.uniq(entities[ids[entity.id] - 1].concepts.concat(entity.concepts), 'index');
			}
		} else {
			ids[entity.id] = entities.length + 1;
			entities.push(entity);
		}
	});

	return entities;
};

/**
 * Explore entities in context
 */
Service.prototype.explore = function(context, concepts) {

	if (!concepts || concepts.length === 0) {
		return Promise.resolve({});
	}

	var self = this;

	return internal.exploreEntities(context, concepts, this.accessService)
		.then(function(entities) {
			concepts = internal.getUnknownConcepts(Object.keys(entities), concepts);
			//console.log('UNKNOWN concepts', concepts);
			internal.findPersonsInConcepts(entities, concepts);
			internal.findEntitiesByAbbr(entities, concepts);
			if (concepts.length > 0) {
				var nconcepts = [];
				concepts.forEach(function(concept) {
					nconcepts = nconcepts.concat(concept.split(context.lang));
				});
				concepts = nconcepts;
				internal.formatConceptsKeys(context, concepts);

				//console.log('TOPICS', entities);

				concepts = concepts.filter(function(concept) {
					if (entities[concept.key]) {
						entities[concept.key].concepts.push(concept);
						//console.log('HAHA', concept);
						return false;
					} else {
						for (var key in entities) {
							if (entities[key].key === concept.key) {
								entities[key].concepts.push(concept);
								//console.log('HAHA', concept);
								return false;
							}
						}
					}
					return true;
				});

				if (concepts.length > 0) {
					//console.log('new concepts', concepts);
					return internal.exploreEntities(context, concepts, self.accessService).then(function(nentities) {
						//console.log('NEW entities', nentities);
						return _.merge(entities, nentities);
					});
				}
			}
			return entities;
		});
};

/**
 * Find entities by abbr
 */
internal.findEntitiesByAbbr = function(entities, uConcepts) {
	if (uConcepts.length === 0) {
		return;
	}
	var keys = Object.keys(entities).filter(function(key) {
		return entities[key].abbr;
	});
	if (keys.length === 0) {
		return;
	}

	var i;

	for (i = 0; i < uConcepts.length; i++) {
		var concept = uConcepts[i];
		if (entities[concept.key]) {
			uConcepts.splice(i, 1);
			i--;
			entities[concept.key].concepts.push(concept);
			//console.log('found abbr 2:', concept, entities[concept.key]);
			continue;
		}
		for (var j = keys.length - 1; j >= 0; j--) {
			var entity = entities[keys[j]];
			//console.log('abbr', _.pick(entity, 'id', 'name', 'type'), concept);
			if (concept.value === entity.abbr) {
				uConcepts.splice(i, 1);
				i--;
				entities[concept.key] = _.clone(entity);
				entities[concept.key].concepts = [concept];
				//console.log('found abbr:', concept, entity);
				break;
			}
		}
	}
};

/**
 * Find persons in unknown concepts
 */
internal.findPersonsInConcepts = function(entities, uConcepts) {
	if (uConcepts.length === 0) {
		return;
	}
	var personKeys = Object.keys(entities).filter(function(key) {
		return entities[key].type === 1;
	});
	if (personKeys.length === 0) {
		return;
	}

	var i;

	for (i = 0; i < uConcepts.length; i++) {
		var concept = uConcepts[i];
		if (entities[concept.key]) {
			uConcepts.splice(i, 1);
			i--;
			entities[concept.key].concepts.push(concept);
			//console.log('found persoon 2:', concept, entities[concept.key]);
			continue;
		}
		for (var j = personKeys.length - 1; j >= 0; j--) {
			var person = entities[personKeys[j]];
			//console.log('person', _.pick(person, 'id', 'name', 'type'), concept);
			if (_.endsWith(person.name.toLowerCase(), ' ' + concept.value.toLowerCase()) ||
				_.endsWith(person.name.toLowerCase(), ' ' + concept.atonic.toLowerCase())) {
				uConcepts.splice(i, 1);
				i--;
				entities[concept.key] = _.clone(person);
				entities[concept.key].concepts = [concept];
				//console.log('found persoon:', concept, person);
				break;
			}
		}
	}
};

internal.getUnknownConcepts = function(keys, concepts) {
	var list = [];

	concepts.forEach(function(concept) {
		if (keys.indexOf(concept.key) < 0) {
			list.push(concept);
		}
	});

	return list;
};

internal.exploreEntities = function(context, concepts, accessService) {
	var keys = internal.formatConceptsKeys(context, concepts);
	return accessService.entitiesByKeys(keys).then(function(entities) {
		Object.keys(entities).forEach(function(key) {
			entities[key].concepts = concepts.filter(function(concept) {
				return concept.key === key;
			});
		});
		return entities;
	});
};

internal.formatConceptsKeys = function(context, concepts) {
	var formatKey = EntityName.createKey;
	var keys = [];
	concepts.forEach(function(concept) {
		concept.key = concept.key || formatKey(concept.atonic, context.lang, context.country);
		keys.push(concept.key);
	});

	return _.uniq(keys);
};
