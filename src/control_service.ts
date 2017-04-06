
require('./db/models');

const vogels = require('vogels-helpers');

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
	createEntity(data: any, options?: any): Promise<any> {
		return vogels.control.create('Entitizer_Entity', data, options);
	}

	putEntity(data: any, options?: any): Promise<any> {
		return vogels.control.put('Entitizer_Entity', data, options);
	}

	updateEntity(data: any, options?: any): Promise<any> {
		return vogels.control.update('Entitizer_Entity', data, options);
	}

	deleteEntity(id: string, options?: any): Promise<any> {
		return vogels.control.destroy('Entitizer_Entity', id, options);
	}
}
