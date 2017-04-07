
const vogels = require('vogels');
import { EntitySchema, EntityNamesSchema } from './schemas';
import * as EntityHooks from './entity_hooks';
import * as EntityNamesHooks from './entity_names_hooks';
import { Promise } from '../utils';

const tablePrefix = process.env.ENTITIZER_TABLE_PREFIX;
if (typeof tablePrefix !== 'string') {
	throw new Error('ENTITIZER_TABLE_PREFIX is required!');
}

export const NAMES = ['Entity', 'EntityNames'];

export const Entity = Promise.promisifyAll(vogels.define('Entitizer_Entity', {
	tableName: [tablePrefix, 'Entities'].join('_'),
	hashKey: 'id',
	timestamps: false,
	schema: EntitySchema
}));

Entity.before('create', EntityHooks.beforeCreate);
Entity.before('update', EntityHooks.beforeUpdate);

export const EntityNames = Promise.promisifyAll(vogels.define('Entitizer_EntityNames', {
	tableName: [tablePrefix, 'EntityNames'].join('_'),
	hashKey: 'entityId',
	timestamps: false,
	schema: EntityNamesSchema
}));

EntityNames.before('create', EntityNamesHooks.beforeCreate);
EntityNames.before('update', EntityNamesHooks.beforeUpdate);

export function getModel(name: string) {
	switch (name) {
		case 'Entity': return Entity;
		case 'EntityNames': return EntityNames;
	}
	throw new Error('Invalid model name ' + name);
}
