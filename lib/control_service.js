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
ControlService.prototype.createTopic = function(data) {
	data = Topic.normalize(data);

	var params = {};
	params.ConditionExpression = 'key <> :key AND id <> :id';

	params.ExpressionAttributeValues = {
		':key': data.key,
		':id': data.id
	};

	return models.Topic.createAsync(data, params).then(get);
};

/**
 * Create a topic name
 */
ControlService.prototype.createTopicName = function(data) {
	data = TopicName.createValidation(data);

	var params = {};
	params.ConditionExpression = 'key <> :key';

	params.ExpressionAttributeValues = {
		':key': data.key
	};

	return models.TopicName.createAsync(data, params).then(get);
};

/**
 * Create a topic names
 */
ControlService.prototype.createTopicNames = function(names) {
	if (!_.isArray(names)) {
		throw new Error('`names` mast by an array of topic names');
	}
	var self = this;
	return Promise.resolve(names).each(function(name) {
		return self.createTopicName(name);
	});
};

/**
 * Create topic names from topic
 */
ControlService.prototype.createTopicNamesFromTopic = function(topic) {
	var names = topic.names.map(function(name) {
		return {
			key: name.key,
			topicId: topic.id
		};
	});

	return this.createTopicNames(names);
};
