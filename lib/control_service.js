'use strict';

var utils = require('./utils');
var Promise = utils.Promise;
var _ = utils._;
var models = require('./db/models');
var Topic = require('./topic');
var TopicNameKey = require('./topic_name_key');
var Action = require('./action');

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
 * Create a topic name key
 */
ControlService.prototype.createTopicNameKey = function(data) {
	data = TopicNameKey.validate(data);

	var params = {};
	params.ConditionExpression = 'key <> :key';

	params.ExpressionAttributeValues = {
		':key': data.key
	};

	return models.TopicNameKey.createAsync(data, params).then(get);
};

/**
 * Create a topic name keys
 */
ControlService.prototype.createTopicNameKeys = function(names) {
	if (!_.isArray(names)) {
		throw new Error('`names` mast by an array of topic names');
	}
	var self = this;
	return Promise.resolve(names).each(function(name) {
		return self.createTopicNameKey(name);
	});
};

/**
 * Create topic name keys from topic
 */
ControlService.prototype.createTopicNameKeysFromTopic = function(topic) {
	var names = topic.names.map(function(name) {
		return {
			key: name.key,
			topicId: topic.id
		};
	});

	return this.createTopicNameKeys(names);
};


/**
 * Create an action
 */
ControlService.prototype.createAction = function(data) {
	data = Action.normalize(data);

	var params = {};
	params.ConditionExpression = 'id <> :id';

	params.ExpressionAttributeValues = {
		':id': data.id
	};

	return models.Action.createAsync(data, params).then(get);
};
