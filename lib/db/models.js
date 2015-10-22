'use strict';

var utils = require('../utils');
var Promise = utils.Promise;
var Query = require('../../node_modules/vogels/lib/query.js');
var vogels = require('vogels');
var schemas = require('./schemas');
var EntitySchema = schemas.EntitySchema;
var EntityNameKeySchema = schemas.EntityNameKeySchema;
var ActionSchema = schemas.ActionSchema;
var GlobalEntitySchema = schemas.GlobalEntitySchema;

var NAMES = ['Entity', 'EntityNameKey', 'Action', 'GlobalEntity'];

Query.prototype.execAsync = Query.prototype.execAsync || Promise.promisify(Query.prototype.exec);

var GlobalEntity = vogels.define('Entitizer_GlobalEntity', {
	tableName: 'Entitizer_GlobalEntities',
	hashKey: 'id',
	// createdAt, updatedAt
	timestamps: true,
	schema: GlobalEntitySchema
});

var Entity = vogels.define('Entitizer_Entity', {
	tableName: 'Entitizer_Entities',
	hashKey: 'id',
	// createdAt, updatedAt
	timestamps: true,
	schema: EntitySchema
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

Promise.promisifyAll(GlobalEntity);
Promise.promisifyAll(Entity);
Promise.promisifyAll(EntityNameKey);
Promise.promisifyAll(Action);

exports.NAMES = NAMES;
exports.Entity = Entity;
exports.GlobalEntity = GlobalEntity;
exports.EntityNameKey = EntityNameKey;
exports.Action = Action;
exports.ACTIONS = schemas.ACTIONS;
exports.ACTION_NAMES = schemas.ACTION_NAMES;
