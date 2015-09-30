'use strict';

var utils = require('./utils');
var get = utils.dbGet;
var _ = utils._;
var models = require('./db/models');

function AccessService() {

}

module.exports = AccessService;

AccessService.prototype.topicById = function(params) {
	return models.Topic.getAsync(params.id, params.params).then(get);
};

AccessService.prototype.topicsByIds = function(params) {
	var ids = _.uniq(params.ids);

	return models.Topic.getItemsAsync(ids, params.params).then(get);
};

AccessService.prototype.topicIdByKey = function(params) {
	return models.Topic
		.query(params.key)
		.usingIndex('Topics-key-index')
		.limit(1)
		.select('ALL_PROJECTED_ATTRIBUTES')
		.execAsync()
		.then(get).then(function(result) {
			if (result && result.length > 0) {
				return result[0].topicId;
			}
			return null;
		});
};

AccessService.prototype.topicByKey = function(params) {
	var self = this;
	return self.topicIdByKey(params)
		.then(function(topicId) {
			if (topicId) {
				return self.topicById({
					id: topicId,
					params: params.params
				});
			}
			return topicId;
		});
};

// AccessService.prototype.topicsByKeys = function(params) {
// 	return models.Topic
// 		.query(params.keys)
// 		.usingIndex('Topics-key-index')
// 		.limit(params.limit || params.keys.length)
// 		.select('ALL_PROJECTED_ATTRIBUTES')
// 		.execAsync()
// 		.then(get);
// };


/**
 * Topic by name key
 */
AccessService.prototype.topicByNameKey = function(params) {
	var self = this;
	return models.TopicName.getAsync(params.key)
		.then(get)
		.then(function(result) {
			if (!result) {
				return result;
			}
			return self.topicById({
				id: result.topicId,
				params: params.params
			});
		});
};

/**
 * Topics-map by name keys
 */
AccessService.prototype.topicsByNameKeys = function(params) {
	var self = this;

	return models.TopicName.getItemsAsync(params.keys)
		.then(get)
		.then(function(result) {
			var data = {};
			if (!result || result.length < 1) {
				return data;
			}
			var topic;
			var ids = _.pluck(result, 'topicId');

			return self.topicsByIds({
				ids: ids,
				params: params.params
			}).then(function(topics) {
				result.forEach(function(item) {
					topic = _.find(topics, 'id', item.topicId);
					if (topic) {
						data[item.key] = topic;
					}
				});
				return data;
			});
		});
};
