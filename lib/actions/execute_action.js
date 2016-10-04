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


function addEntityNames(control, entity, names) {
	names = names || [entity.name];
	return Promise.mapSeries(names, function(name) {
		return control.createEntityName({ name: name, entity: entity })
			.then(function() {
				return { type: 'name', value: name, result: 'done' };
			})
			.catch(function(error) {
				return { type: 'name', value: name, result: 'error', message: error.message };
			});
	});
}

function createEntityAction(control, action) {
	var entityData = action.data;
	entityData.lang = entityData.lang || action.lang;
	entityData.country = entityData.country || action.country;

	var resultData = createActionResult();

	return control.createEntity(entityData)
		.then(function(entity) {
			// resultData.push({ type: 'entity', value: entity.id, result: 'done' });

			return addEntityNames(control, entity, entityData.names)
				.then(function(resultNames) {
					resultData.concat(resultNames);

					return control.updateAction({
						lang: action.lang,
						country: action.country,
						id: action.id,
						resultData: resultData.data(),
						entityId: entity.id,
						status: 'done'
					});
				});
		}, function(error) {
			resultData.push({ message: error.message });

			return control.updateAction({
				lang: action.lang,
				country: action.country,
				id: action.id,
				// entityId: entity.id,
				status: 'error',
				resultData: resultData.data()
			});
		});
}

function updateEntityAction(control, action) {
	var entityData = action.data;
	entityData.id = entityData.id || action.entityId;
	entityData.lang = entityData.lang || action.lang;
	entityData.country = entityData.country || action.country;

	var resultData = createActionResult();

	return control.updateEntity(entityData)
		.then(function(entity) {
			return control.updateAction({
				lang: action.lang,
				country: action.country,
				id: action.id,
				// resultData: resultData,
				// entityId: entity.id,
				status: 'done',
				oldData: _.pick(entity, Object.keys(entityData))
			});
		}, function(error) {
			resultData.push({ message: error.message });

			return control.updateAction({
				lang: action.lang,
				country: action.country,
				id: action.id,
				status: 'error',
				resultData: resultData.data()
			});
		});
}

function addEntityNamesAction(control, action) {
	var names = action.data;
	var resultData = createActionResult();

	return getEntity(action.entityId)
		.then(function(entity) {
			if (entity) {
				return addEntityNames(control, entity, names)
					.then(function(resultNames) {
						resultData.concat(resultNames);

						return control.updateAction({
							lang: action.lang,
							country: action.country,
							id: action.id,
							resultData: resultData.data(),
							// entityId: entity.id,
							status: _.some(resultData.data(), { result: 'done' }) ? 'done' : 'error'
						});
					});
			} else {
				resultData.push({ message: 'Entity not found' });

				return control.updateAction({
					lang: action.lang,
					country: action.country,
					id: action.id,
					// entityId: entity.id,
					status: 'error',
					resultData: resultData.data()
				});
			}
		});
}

function removeEntityNamesAction(control, action) {
	var names = action.data;
	var resultData = createActionResult();

	return getEntity(action.entityId)
		.then(function(entity) {
			if (entity) {
				return Promise.mapSeries(names, function(name) {
						return control.deleteEntityName(EntityName.createKey(name, entity.lang, entity.country))
							.then(function() {
								return { type: 'name', value: name, result: 'done' };
							})
							.catch(function(error) {
								return { type: 'name', value: name, result: 'error', message: error.message };
							});
					})
					.then(function(resultNames) {
						resultData.concat(resultNames);

						return control.updateAction({
							lang: action.lang,
							country: action.country,
							id: action.id,
							resultData: resultData.data(),
							// entityId: entity.id,
							status: _.some(resultData.data(), { result: 'done' }) ? 'done' : 'error'
						});
					});
			} else {
				resultData.push({ message: 'Entity not found' });

				return control.updateAction({
					lang: action.lang,
					country: action.country,
					id: action.id,
					// entityId: entity.id,
					status: 'error',
					resultData: resultData.data()
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
