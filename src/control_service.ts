
import { dynamoGet } from './utils';
import { Entity } from './db/models';

/**
 * Creates a new ControlService object.
 * @class
 * @returns {ControlService} returns a ControlService object
 */
export class ControlService {

	/**
	 * Create a new entity.
	 * @param {(Entity|Object)} data - A data object or an Entity to create a new Entity Db record.
	 * @return {Object} Returns created Entity record object.
	 */
	createEntity(data: any, params?: any): Promise<any> {
		params = params || {};
		params.overwrite = false;
		return Entity.createAsync(data, params).then(dynamoGet);
	}

	putEntity(data: any, params?: any): Promise<any> {
		return Entity.createAsync(data, params).then(dynamoGet);
	}

	updateEntity(data: any, params?: any): Promise<any> {
		return Entity.updateAsync(data, params).then(dynamoGet);
	}

	deleteEntity(id: string, params?: any): Promise<any> {
		return Entity.destroyAsync(id, params).then(dynamoGet);
	}
}
