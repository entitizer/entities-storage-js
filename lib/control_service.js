'use strict';

var utils = require('./utils');
var Promise = utils.Promise;
var _ = utils._;
var models = require('./db/models');
var Topic = require('./topic');
var TopicName = require('./topic_name');

var get = utils.dbGet;

function ControlService() {

}

module.exports = ControlService;

/**
 * Create a topic
 */
ControlService.prototype.createTopic = function(params) {
	Topic.normalize(params);

	return models.Topic.createAsync(params).then(get);
};

/**
 * Create a topic name
 */
ControlService.prototype.createTopicName = function(params) {
	return models.TopicName.createAsync(params).then(get);
};

/**
 * Create topic names from topic
 */
ControlService.prototype.createTopicNames = function(topic) {
	var topicnames = [];
	var keys = {};
	var self = this;

	topic.names.forEach(function(name) {
		name.key = name.key || TopicName.createKey(topic.country, topic.lang, name.name);
		if (keys[name.key]) {
			return;
		}
		keys[name.key] = name.key;
		var tn = {
			key: name.key,
			topic: _.pick(topic, 'id', 'key', 'name', 'uniqueName', 'type', 'category', 'abbr', 'wikiId')
		};

		topicnames.push(tn);
	});

	return Promise.resolve(topicnames).each(function(tname) {
		return self.createTopicName(tname).then(function() {
			return tname.key;
		});
	});
};
