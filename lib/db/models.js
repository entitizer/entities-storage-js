'use strict';

var vogels = require('vogels-helpers');
var schemas = require('./schemas');
var EntitySchema = schemas.EntitySchema;
var EntityKeySchema = schemas.EntityKeySchema;
var records = require('./records');
var NAMES = ['Entity', 'EntityKey'];
var tablePrefix = process.env.ENTITIZER_TABLE_PREFIX || 'Entitizer';

var Entity = vogels.define('Entitizer_Entity', {
	tableName: [tablePrefix, 'Entities'].join('_'),
	hashKey: 'id',
	// createdAt, updatedAt
	timestamps: true,
	schema: EntitySchema,
	indexes: [{
		hashKey: 'englishWikiId',
		rangeKey: 'id',
		type: 'global',
		name: 'Entities-englishWikiId-index',
		projection: {
			ProjectionType: 'KEYS_ONLY'
		}
	}]
}, records.Entity);

var EntityKey = vogels.define('Entitizer_EntityKey', {
	tableName: [tablePrefix, 'EntityKeys'].join('_'),
	hashKey: 'key',
	// createdAt, updatedAt
	timestamps: false,
	schema: EntityKeySchema
}, records.EntityKey);

exports.NAMES = NAMES;
exports.Entity = Entity;
exports.EntityKey = EntityKey;
