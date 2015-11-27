'use strict';

var vogels = require('vogels-helpers');
var schemas = require('./schemas');
var EntitySchema = schemas.EntitySchema;
var NameKeySchema = schemas.NameKeySchema;
var records = require('./records');
var NAMES = ['Entity', 'NameKey'];
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

var NameKey = vogels.define('Entitizer_NameKey', {
	tableName: [tablePrefix, 'NameKeys'].join('_'),
	hashKey: 'key',
	// createdAt, updatedAt
	timestamps: false,
	schema: NameKeySchema
}, records.NameKey);

exports.NAMES = NAMES;
exports.Entity = Entity;
exports.NameKey = NameKey;
