'use strict';

var vogels = require('vogels-helpers');
var schemas = require('./schemas');
var EntitySchema = schemas.EntitySchema;
var EntityNameKeySchema = schemas.EntityNameKeySchema;
var records = require('./records');
var NAMES = ['Entity', 'EntityNameKey'];
var tablePrefix = process.env.ENTITIZER_TABLE_PREFIX || 'Entitizer';

var Entity = vogels.define('Entitizer_Entity', {
	tableName: [tablePrefix, 'Entities'].join('_'),
	hashKey: 'id',
	// createdAt, updatedAt
	timestamps: true,
	schema: EntitySchema,
	indexes: [{
		hashKey: 'englishWikiId',
		type: 'global',
		name: 'Entities-englishWikiId-index',
		projection: {
			ProjectionType: 'KEYS_ONLY'
		}
	}]
}, records.Entity);

var EntityNameKey = vogels.define('Entitizer_EntityNameKey', {
	tableName: [tablePrefix, 'EntityNameKeys'].join('_'),
	hashKey: 'key',
	// createdAt, updatedAt
	timestamps: false,
	schema: EntityNameKeySchema
}, records.EntityNameKey);

exports.NAMES = NAMES;
exports.Entity = Entity;
exports.EntityNameKey = EntityNameKey;
