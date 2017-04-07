
import { PlainObject } from 'entitizer.models';
import { dynamoGet } from './utils';
import { Entity } from './db/models';
import { ENTITY_FIELDS } from './db/schemas';

/**
 * EntityService class
 * @class
 */
export class EntityService {

	getEntityById(id: string, params?: PlainObject): Promise<PlainObject> {
		return Entity.getAsync(id, params).then(dynamoGet);
	}

	getEntitiesByIds(ids: string[], params?: PlainObject): Promise<PlainObject[]> {
		return Entity.getItemsAsync(ids, params).then(dynamoGet);
	}

	createEntity(data: PlainObject, params?: PlainObject): Promise<PlainObject> {
		params = params || {};
		params.overwrite = false;
		return Entity.createAsync(data, params).then(dynamoGet);
	}

	putEntity(data: PlainObject, params?: PlainObject): Promise<PlainObject> {
		return Entity.createAsync(data, params).then(dynamoGet);
	}

	updateEntity(data: PlainObject, params?: PlainObject): Promise<PlainObject> {
		params = params || {};
		params.expected = params.expected || {};
		params.expected[ENTITY_FIELDS.id] = data[ENTITY_FIELDS.id];
		return Entity.updateAsync(data, params).then(dynamoGet);
	}

	deleteEntity(id: string, params?: PlainObject): Promise<PlainObject> {
		return Entity.destroyAsync(id, params).then(dynamoGet);
	}
}
