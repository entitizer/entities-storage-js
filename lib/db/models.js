'use strict';

var utils = require('../utils');
var Promise = utils.Promise;
var Query = require('../../node_modules/vogels/lib/query.js');
var vogels = require('vogels');
var schemas = require('./schemas');
var EntitySchema = schemas.EntitySchema;
var EntityNameKeySchema = schemas.EntityNameKeySchema;
var ActionSchema = schemas.ActionSchema;

var NAMES = ['Entity', 'EntityNameKey', 'Action'];

Query.prototype.execAsync = Query.prototype.execAsync || Promise.promisify(Query.prototype.exec);


var Entity = vogels.define('Entitizer_Entity', {
	tableName: 'Entitizer_Entities',
	hashKey: 'id',
	// createdAt, updatedAt
	timestamps: true,
	schema: EntitySchema,
	indexes: [{
		hashKey: 'key',
		type: 'global',
		name: 'Entities-key-index',
		projection: {
			// NonKeyAttributes: ['id', 'key'],
			ProjectionType: 'KEYS_ONLY'
		}
	}]
});

var EntityNameKey = vogels.define('Entitizer_EntityNameKey', {
	tableName: 'Entitizer_EntityNameKeys',
	hashKey: 'key',
	// createdAt, updatedAt
	timestamps: false,
	schema: EntityNameKeySchema
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

Promise.promisifyAll(Entity);
Promise.promisifyAll(EntityNameKey);
Promise.promisifyAll(Action);

exports.NAMES = NAMES;
exports.Entity = Entity;
exports.EntityNameKey = EntityNameKey;
exports.Action = Action;
exports.ACTIONS = schemas.ACTIONS;
exports.ACTION_NAMES = schemas.ACTION_NAMES;
