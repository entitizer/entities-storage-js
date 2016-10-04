'use strict';

var vogels = require('vogels-helpers');
var utils = require('../utils');
var _ = utils._;
var Promise = utils.Promise;
var buildOptions = utils.buildServiceOptions;
var ACTIONS = require('../db/schemas').ACTIONS;
var EntityName = require('../entity_name');
var createActionResult = require('./action_result');

function getAction(id, options) {
	options = buildOptions(options);
	return vogels.access.getItem('Entitizer_Action', id, options);
}

function getEntity(id, options) {
	options = buildOptions(options);
	return vogels.access.getItem('Entitizer_Entity', id, options);
}

function updateAction(control, data) {
	return control.updateAction(data);
}

function addEntityNames(control, entity, names) {
	names = names || [entity.name];
	return Promise.mapSeries(names, function(name) {
		return control.createEntityName({ name: name, entity: entity })
			.then(function(createdName) {
				return { type: 'name', value: name, result: 'done' };
			})
			.catch(function(error) {
				return { type: 'name', value: name, result: 'error', message: error.message };
			});
	});
}

function createEntityAction(control, action) {
	var entityData = JSON.parse(action.data);
	var resultData = createActionResult();

	return control.createEntity(entityData)
		.catch(function(error) {
			resultData.push({ message: error.message });

			return control.updateAction({
					id: action.id,
					// entityId: entity.id,
					status: 'error',
					resultData: resultData.data()
				})
				.then(function() {
					return null;
				});
		})
		.then(function(entity) {
			if (entity) {
				resultData.push({ type: 'entity', value: entity.id, result: 'done' });

				return addEntityNames(control, entity, entityData.names)
					.then(function(resultNames) {
						resultData.concat(resultNames);

						return control.updateAction({
							id: action.id,
							resultData: resultData.data(),
							entityId: entity.id,
							status: 'done'
						});
					});
			}
		});
}

function updateEntityAction(control, action) {
	var entityData = JSON.parse(action.data);
	entityData.id = entityData.id || action.entityId;
	var resultData = createActionResult();

	return control.updateEntity(entityData)
		.catch(function(error) {
			resultData.push({ message: error.message });

			return control.updateAction({
					id: action.id,
					status: 'error',
					resultData: resultData.data()
				})
				.then(function() {
					return null;
				});
		})
		.then(function(entity) {
			if (entity) {
				return control.updateAction({
					id: action.id,
					// resultData: resultData,
					// entityId: entity.id,
					status: 'done',
					oldData: _.pick(entity, Object.keys(entityData))
				});
			}
		});
}

function addEntityNamesAction(control, action) {
	var names = JSON.parse(action.data);
	var resultData = createActionResult();

	return getEntity(action.entityId)
		.catch(function(error) {
			resultData.push({ message: error.message });

			return control.updateAction({
					id: action.id,
					// entityId: entity.id,
					status: 'error',
					resultData: resultData.data()
				})
				.then(function() {
					return null;
				});
		})
		.then(function(entity) {
			if (entity) {

				return addEntityNames(control, entity, names)
					.then(function(resultNames) {
						resultData.concat(resultNames);

						return control.updateAction({
							id: action.id,
							resultData: resultData.data(),
							// entityId: entity.id,
							status: 'done'
						});
					});
			}
		});
}

function removeEntityNamesAction(control, action) {
	var names = JSON.parse(action.data);
	var resultData = createActionResult();

	return getEntity(action.entityId)
		.catch(function(error) {
			resultData.push({ message: error.message });

			return control.updateAction({
					id: action.id,
					// entityId: entity.id,
					status: 'error',
					resultData: resultData.data()
				})
				.then(function() {
					return null;
				});
		})
		.then(function(entity) {
			if (entity) {

				return Promise.mapSeries(names, function(name) {
						return control.deleteEntityName(EntityName.createKey(name, entity.lang, entity.country))
							.then(function(deletedName) {
								return { type: 'name', value: name, result: 'done' };
							})
							.catch(function(error) {
								return { type: 'name', value: name, result: 'error', message: error.message };
							});
					})
					.then(function(resultNames) {
						resultData.concat(resultNames);

						return control.updateAction({
							id: action.id,
							resultData: resultData.data(),
							// entityId: entity.id,
							status: 'done'
						});
					});
			}
		});
}

function executeAction(control, action) {

	switch (action.type) {
		case ACTIONS.CREATE_ENTITY:
			return createEntityAction(control, action);
		case ACTIONS.UPDATE_ENTITY:
			return updateEntityAction(control, action);
		case ACTIONS.ADD_ENTITY_NAMES:
			return addEntityNamesAction(control, action);
		case ACTIONS.REMOVE_ENTITY_NAMES:
			return removeEntityNamesAction(control, action);
		default:
			return Promise.reject(new Error('Action type is invalid!'));
	}

}

module.exports = function execute(actionId, options) {
	var control = this;

	return getAction(actionId, options)
		.then(function(action) {
			if (!action) {
				return Promise.reject(new Error('Action not found! id=' + actionId));
			}
			return executeAction(control, action);
		});
};
