'use strict';

var utils = require('../utils');
var Promise = utils.Promise;
var Query = require('../../node_modules/vogels/lib/query.js');
var vogels = require('vogels');
var schemas = require('./schemas');
var TopicSchema = schemas.TopicSchema;
var TopicNameKeySchema = schemas.TopicNameKeySchema;
var ActionSchema = schemas.ActionSchema;

Query.prototype.execAsync = Query.prototype.execAsync || Promise.promisify(Query.prototype.exec);


var Topic = vogels.define('Entitizer_Topic', {
	tableName: 'Entitizer_Topics',
	hashKey: 'id',
	// createdAt, updatedAt
	timestamps: true,
	schema: TopicSchema,
	indexes: [{
		hashKey: 'key',
		type: 'global',
		name: 'Topics-key-index',
		projection: {
			// NonKeyAttributes: ['id', 'key'],
			ProjectionType: 'KEYS_ONLY'
		}
	}]
});

var TopicNameKey = vogels.define('Entitizer_TopicNameKey', {
	tableName: 'Entitizer_TopicNameKeys',
	hashKey: 'key',
	// createdAt, updatedAt
	timestamps: false,
	schema: TopicNameKeySchema
});

var Action = vogels.define('Entitizer_Action', {
	tableName: 'Entitizer_Actions',
	hashKey: 'id',
	// createdAt, updatedAt
	timestamps: true,
	schema: ActionSchema,
	indexes: [{
		hashKey: 'statusKey',
		rangeKey: 'createdAt',
		type: 'global',
		name: 'Actions-status-index',
		projection: {
			ProjectionType: 'KEYS_ONLY'
		}
	}]
});

Promise.promisifyAll(Topic);
Promise.promisifyAll(TopicNameKey);
Promise.promisifyAll(Action);

exports.Topic = Topic;
exports.TopicNameKey = TopicNameKey;
exports.Action = Action;
exports.ACTIONS = schemas.ACTIONS;
exports.ACTION_NAMES = schemas.ACTION_NAMES;
