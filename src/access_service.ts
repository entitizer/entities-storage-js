
require('./db/models');
import { _ } from './utils';
const vogels = require('vogels-helpers');

/**
 * Creates a new AccessService object.
 * @class
 */
export class AccessService {
	/**
	 * Find an entity by entity id.
	 * @param {Object} params - Finding params
	 * @param {Number} params.id - Entity's id
	 * @param {Object} params.params - DynamoDB params
	 */
	getEntityById(id: string, options?: any): Promise<any> {
		return vogels.access.getItem('Entitizer_Entity', id, options);
	}

	/**
	 * Find entities by ids.
	 * @param {Object} params - Finding params
	 * @param {Number[]} params.ids - Entity ids
	 * @param {Object} params.params - DynamoDB params
	 */
	getEntitiesByIds(ids: string[], options?: any): Promise<any[]> {
		return vogels.access.getItems('Entitizer_Entity', ids, options);
	}
}
