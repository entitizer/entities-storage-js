'use strict';

var assert = require('assert');
var utils = require('../lib/utils');
var Promise = utils.Promise;
var Data = require('./common/data');

if (!Data) {
	return;
}

describe('ExecuteAction', function() {
	this.timeout(1000 * 60);

	before('createTables', function() {
		return Data.createTables();
	});

	after('deleteTables', function() {
		return Data.deleteTables('iam-sure')
			.then(function() {
				return Promise.delay(1000 * 10);
			});
	});

	var service = Data.controlService;

	var createRusiaAction = {
		type: 'create_entity',
		lang: 'ro',
		country: 'ro',
		data: {
			id: 1,
			name: 'Rusia',
			description: 'Rusia este tara cu cea mai mare suprafata...',
			type: 'place',
			names: ['Rusia', 'Federatia rusa', 'Rusiei']
		}
	};

	it('should create action: create_entity', function() {
		return service.createAction(createRusiaAction);
	});

	it('should NOT create  a dublicate action', function() {
		return service.createAction(createRusiaAction)
			.then(function() {
				throw new Error('Error');
			})
			.catch(function(error) {
				assert.ok(error);
				// console.log(error.message);
			});
	});

	it('should execute a action: create_entity', function() {
		var actionId = Data.Action.createId(Data.Action.normalizeCreate(createRusiaAction));
		return service.executeAction(actionId)
			.then(function(action) {
				// console.log('action', action);
				assert.ok(action);
				assert.equal('done', action.status);
			});
	});

	it('should get created entity', function() {
		return Data.accessService.entityById(createRusiaAction.data.id)
			.then(function(entity) {
				assert.ok(entity);
				assert.equal('Rusia', entity.name);
			});
	});

	it('should get created entity names', function() {
		return Data.accessService.entityNamesByEntityId(createRusiaAction.data.id)
			.then(function(names) {
				// console.log(names);
				assert.ok(names);
				assert.equal(3, names.length);
			});
	});

});
