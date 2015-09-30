'use strict';

var utils = require('../utils');
var Promise = utils.Promise;
var Query = require('../../node_modules/vogels/lib/query.js');
var vogels = require('vogels');
var Joi = require('joi');

Query.prototype.execAsync = Query.prototype.execAsync || Promise.promisify(Query.prototype.exec);

var Topic = vogels.define('Entitizer_Topic', {
	tableName: 'Entitizer_Topics',
	hashKey: 'id',
	// createdAt, updatedAt
	timestamps: true,
	schema: {
		id: Joi.number().integer().required(),
		// md5 (COUNTRY_LANGUAGE_UNIQUENAME):
		key: Joi.string().trim().length(32).lowercase().required(),
		name: Joi.string().trim().max(100).required(),
		slug: Joi.string().trim().lowercase().max(100).required(),
		prevSlug: Joi.string().trim().lowercase().max(100),
		atonicName: Joi.string().trim().max(100),
		abbr: Joi.string().trim().max(20),

		wikiId: Joi.number().integer(),
		wikiName: Joi.string().trim().max(200),
		englishWikiId: Joi.number().integer(),
		englishWikiName: Joi.string().trim().max(200),

		lang: Joi.string().trim().length(2).lowercase().required(),
		country: Joi.string().trim().length(2).lowercase().required(),

		type: Joi.valid(1, 2, 3, 4, 5),
		category: Joi.valid(10, 20, 30, 40, 50, 60, 70, 80, 90),

		region: Joi.string().trim().length(2).lowercase(),

		description: Joi.string().trim().max(400),

		meta: Joi.object().keys({
			birthday: Joi.date().format('YYYY-MM-DD')
		}),

		names: Joi.array().items(Joi.object().keys({
			// md5 (COUNTRY_LANGUAGE_UNIQUENAME)
			key: Joi.string().trim().length(32).required(),
			name: Joi.string().trim().min(2).max(200).required(),
			// unique name
			uniqueName: Joi.string().trim().min(2).max(200).required(),
			type: Joi.valid(0, 1, 2, 3, 4).required(),
			createdAt: Joi.number().default(Date.now, 'time of creation').required(),
			// old name id
			id: Joi.number().integer()
		})).min(1).max(50).required()
	},
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

var TopicName = vogels.define('Entitizer_TopicName', {
	tableName: 'Entitizer_TopicNames',
	hashKey: 'key',
	// createdAt, updatedAt
	timestamps: false,
	schema: {
		// md5 (COUNTRY_LANGUAGE_UNIQUENAME)
		key: Joi.string().trim().length(32).lowercase().required(),
		topicId: Joi.number().integer().required()
	}
});

Promise.promisifyAll(Topic);
Promise.promisifyAll(TopicName);

exports.Topic = Topic;
exports.TopicName = TopicName;
