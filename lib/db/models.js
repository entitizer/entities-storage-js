'use strict';

var vogels = require('vogels-helpers');
var schemas = require('./schemas');
var EntitySchema = schemas.EntitySchema;
var EntityNameSchema = schemas.EntityNameSchema;
var NAMES = ['Entity', 'EntityName'];
var tablePrefix = process.env.ENTITIZER_TABLE_PREFIX || 'Entitizer';
var Entity = require('../entity');
var EntityName = require('../entity_name');

exports.Entity = vogels.define('Entitizer_Entity', {
	tableName: [tablePrefix, 'Entities'].join('_'),
	hashKey: 'id',
	timestamps: false,
	schema: EntitySchema,
	indexes: [{
		hashKey: 'englishWikiId',
		rangeKey: 'id',
		type: 'global',
		name: 'Entities-englishWikiId-gi',
		projection: {
			ProjectionType: 'KEYS_ONLY'
		}
	}]
}, Entity.config);

exports.EntityName = vogels.define('Entitizer_EntityName', {
	tableName: [tablePrefix, 'EntityNames'].join('_'),
	hashKey: 'key',
	// createdAt, updatedAt
	timestamps: false,
	schema: EntityNameSchema,
	indexes: [{
		hashKey: 'entityId',
		// rangeKey: 'id',
		type: 'global',
		name: 'EntityNames-entityId-gi',
		projection: {
			ProjectionType: 'KEYS_ONLY'
		}
	}]
}, EntityName.config);

exports.NAMES = NAMES;
