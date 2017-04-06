
import { _, dynamoGet } from './utils';
import { Entity } from './db/models';

/**
 * Creates a new AccessService object.
 * @class
 */
export class AccessService {
	/**
	 * Find an entity by entity id.
	 * @param {Object} params - Finding params
	 */
	getEntityById(id: string, params?: any): Promise<any> {
		return Entity.getAsync(id, params).then(dynamoGet);
	}

	/**
	 * Find entities by ids.
	 * @param {Object} params - Finding params
	 */
	getEntitiesByIds(ids: string[], params?: any): Promise<any[]> {
		return Entity.getItemsAsync(ids, params).then(dynamoGet);
	}
}
