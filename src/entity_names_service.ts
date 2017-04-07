
import { PlainObject } from 'entitizer.models';
import { dynamoGet } from './utils';
import { EntityNames } from './db/models';
import { ENTITY_NAMES_FIELDS } from './db/schemas';

/**
 * EntityNamesService class
 * @class
 */
export class EntityNamesService {

    getEntityNames(id: string, params?: PlainObject): Promise<PlainObject> {
        return EntityNames.getAsync(id, params).then(dynamoGet);
    }

    getEntitiesNames(ids: string[], params?: PlainObject): Promise<PlainObject[]> {
        return EntityNames.getItemsAsync(ids, params).then(dynamoGet);
    }

    createEntityNames(data: PlainObject, params?: PlainObject): Promise<PlainObject> {
        params = params || {};
        params.overwrite = false;
        return EntityNames.createAsync(data, params).then(dynamoGet);
    }

    putEntityNames(data: PlainObject, params?: PlainObject): Promise<PlainObject> {
        return EntityNames.createAsync(data, params).then(dynamoGet);
    }

    updateEntityNames(data: PlainObject, params?: PlainObject): Promise<PlainObject> {
        params = params || {};
        params.expected = params.expected || {};
        params.expected[ENTITY_NAMES_FIELDS.entityId] = data[ENTITY_NAMES_FIELDS.entityId];
        return EntityNames.updateAsync(data, params).then(dynamoGet);
    }

    deleteEntityNames(id: string, params?: PlainObject): Promise<PlainObject> {
        return EntityNames.destroyAsync(id, params).then(dynamoGet);
    }
}
