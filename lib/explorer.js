'use strict';

var internal = {};
var utils = require('./utils');
var _ = utils._;
var Promise = utils.Promise;
var models = require('./db/models');
var assert = require('assert');

function Service(accessService) {
	assert.ok(accessService);
	this.accessService = accessService;
}

module.exports = Service;

Service.prototype.topics = function(context, concepts) {
	var self = this;
	return this.explore(context, concepts).then(function(result) {
		return self.topicsFromExploreResult(result);
	});
};

Service.prototype.topicsFromExploreResult = function(result) {
	var ids = {};
	var topics = [];
	Object.keys(result).forEach(function(key) {
		var topic = result[key];
		if (ids[topic.id]) {
			if (topic.concepts) {
				topics[ids[topic.id] - 1].concepts = topics[ids[topic.id] - 1].concepts.concat(topic.concepts);
			}
		} else {
			ids[topic.id] = topics.length + 1;
			topics.push(topic);
		}
	});

	return topics;
};

/**
 * Explore topics in context
 */
Service.prototype.explore = function(context, concepts) {

	if (!concepts || concepts.length === 0) {
		return Promise.resolve({});
	}

	var self = this;

	return internal.exploreTopics(context, concepts, this.accessService)
		.then(function(topics) {
			concepts = internal.getUnknownConcepts(Object.keys(topics), concepts);
			//console.log('UNKNOWN concepts', concepts);
			internal.findPersonsInConcepts(topics, concepts);
			internal.findTopicsByAbbr(topics, concepts);
			if (concepts.length > 0) {
				var nconcepts = [];
				concepts.forEach(function(concept) {
					nconcepts = nconcepts.concat(concept.split(context.lang));
				});
				concepts = nconcepts;
				internal.formatConceptsKeys(context, concepts);

				//console.log('TOPICS', topics);

				concepts = concepts.filter(function(concept) {
					if (topics[concept.key]) {
						topics[concept.key].concepts.push(concept);
						//console.log('HAHA', concept);
						return false;
					} else {
						for (var key in topics) {
							if (topics[key].key === concept.key) {
								topics[key].concepts.push(concept);
								//console.log('HAHA', concept);
								return false;
							}
						}
					}
					return true;
				});

				if (concepts.length > 0) {
					//console.log('new concepts', concepts);
					return internal.exploreTopics(context, concepts, self.accessService).then(function(ntopics) {
						//console.log('NEW topics', ntopics);
						return _.merge(topics, ntopics);
					});
				}
			}
			return topics;
		});
};

/**
 * Find topics by abbr
 */
internal.findTopicsByAbbr = function(topics, uConcepts) {
	if (uConcepts.length === 0) {
		return;
	}
	var keys = Object.keys(topics).filter(function(key) {
		return topics[key].abbr;
	});
	if (keys.length === 0) {
		return;
	}

	var i;

	for (i = 0; i < uConcepts.length; i++) {
		var concept = uConcepts[i];
		if (topics[concept.key]) {
			uConcepts.splice(i, 1);
			i--;
			topics[concept.key].concepts.push(concept);
			//console.log('found abbr 2:', concept, topics[concept.key]);
			continue;
		}
		for (var j = keys.length - 1; j >= 0; j--) {
			var topic = topics[keys[j]];
			//console.log('abbr', _.pick(topic, 'id', 'name', 'type'), concept);
			if (concept.value === topic.abbr) {
				uConcepts.splice(i, 1);
				i--;
				topics[concept.key] = _.clone(topic);
				topics[concept.key].concepts = [concept];
				//console.log('found abbr:', concept, topic);
				break;
			}
		}
	}
};

/**
 * Find persons in unknown concepts
 */
internal.findPersonsInConcepts = function(topics, uConcepts) {
	if (uConcepts.length === 0) {
		return;
	}
	var personKeys = Object.keys(topics).filter(function(key) {
		return topics[key].type === 1;
	});
	if (personKeys.length === 0) {
		return;
	}

	var i;

	for (i = 0; i < uConcepts.length; i++) {
		var concept = uConcepts[i];
		if (topics[concept.key]) {
			uConcepts.splice(i, 1);
			i--;
			topics[concept.key].concepts.push(concept);
			//console.log('found persoon 2:', concept, topics[concept.key]);
			continue;
		}
		for (var j = personKeys.length - 1; j >= 0; j--) {
			var person = topics[personKeys[j]];
			//console.log('person', _.pick(person, 'id', 'name', 'type'), concept);
			if (_.endsWith(person.name.toLowerCase(), ' ' + concept.value.toLowerCase()) ||
				_.endsWith(person.name.toLowerCase(), ' ' + concept.atonic.toLowerCase())) {
				uConcepts.splice(i, 1);
				i--;
				topics[concept.key] = _.clone(person);
				topics[concept.key].concepts = [concept];
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

internal.exploreTopics = function(context, concepts, accessService) {
	var keys = internal.formatConceptsKeys(context, concepts);
	return accessService.topicsByNames({
		keys: keys
	}).then(function(topics) {
		Object.keys(topics).forEach(function(key) {
			topics[key].concepts = concepts.filter(function(concept) {
				return concept.key === key;
			});
		});
		return topics;
	});
};

internal.formatConceptsKeys = function(context, concepts) {
	var formatKey = models.TopicName.formatKey;
	var keys = [];
	concepts.forEach(function(concept) {
		concept.key = concept.key || formatKey(context.country, context.lang, concept.atonic);
		keys.push(concept.key);
	});

	return _.uniq(keys);
};
