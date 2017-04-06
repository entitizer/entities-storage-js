
const vogels = require('vogels-helpers');
import { EntitySchema } from './schemas';
import { EntityConfig } from '../entity';

const tablePrefix = process.env.ENTITIZER_TABLE_PREFIX;
if (typeof tablePrefix !== 'string') {
	throw new Error('ENTITIZER_TABLE_PREFIX is required!');
}

export const NAMES = ['Entity'];

export const Entity = vogels.define('Entitizer_Entity', {
	tableName: [tablePrefix, 'Entities'].join('_'),
	hashKey: 'id',
	timestamps: false,
	schema: EntitySchema
}, EntityConfig);

export function getModel(name: string) {
	switch (name) {
		case 'Entity': return Entity;
	}
	throw new Error('Invalid model name ' + name);
}
