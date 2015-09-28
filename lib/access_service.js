'use strict';

var utils = require('./utils');
var get = utils.dbGet;
var models = require('./db/models');

function AccessService() {

}

module.exports = AccessService;

/**
 * Topic by key or id
 */
AccessService.prototype.topic = function(params) {
	if (params.key) {
		return this.topicByKey(params);
	}

	return this.topicById(params);
};

/**
 * Topics by keys or ids
 */
AccessService.prototype.topics = function(params) {
	if (params.keys) {
		return this.topicsByKeys(params);
	}

	return this.topicsByIds(params);
};

AccessService.prototype.topicByKey = function(params) {
	return models.Topic.getAsync(params.key, params.params).then(get);
};
AccessService.prototype.topicsByKeys = function(params) {
	return models.Topic.getItemsAsync(params.keys, params.params).then(get);
};
AccessService.prototype.topicById = function(params) {
	return models.Topic
		.query(params.id)
		.usingIndex('Topics-id-index')
		.limit(1)
		.select('ALL_PROJECTED_ATTRIBUTES')
		.execAsync()
		.then(get).then(function(result) {
			if (result && result.length > 0) {
				return result;
			}
			return null;
		});
};
AccessService.prototype.topicsByIds = function(params) {
	return models.Topic
		.query(params.ids)
		.usingIndex('Topics-id-index')
		.limit(params.limit || params.ids.length)
		.select('ALL_PROJECTED_ATTRIBUTES')
		.execAsync()
		.then(get);
};


/**
 * Topic by name key
 */
AccessService.prototype.topicByName = function(params) {
	return models.TopicName.getAsync(params.key)
		.then(get)
		.then(function(result) {
			if (!result) {
				return result;
			}
			return result.topic;
		});
};

AccessService.prototype.topicsByNames = function(params) {
	return models.TopicName.getItemsAsync(params.keys)
		.then(get)
		.then(function(result) {
			var data = {};
			if (result) {
				result.forEach(function(item) {
					data[item.key] = item.topic;
				});
			}
			return data;
		});
};
