
const vogels = require('vogels');
import { EntitySchema } from './schemas';
import * as EntityHooks from './entity_hooks';
import { Promise } from '../utils';

const tablePrefix = process.env.ENTITIZER_TABLE_PREFIX;
if (typeof tablePrefix !== 'string') {
	throw new Error('ENTITIZER_TABLE_PREFIX is required!');
}

export const NAMES = ['Entity'];

export const Entity = Promise.promisifyAll(vogels.define('Entitizer_Entity', {
	tableName: [tablePrefix, 'Entities'].join('_'),
	hashKey: 'id',
	timestamps: false,
	schema: EntitySchema
}));

Entity.before('create', EntityHooks.beforeCreate);
Entity.before('update', EntityHooks.beforeUpdate);

export function getModel(name: string) {
	switch (name) {
		case 'Entity': return Entity;
	}
	throw new Error('Invalid model name ' + name);
}
