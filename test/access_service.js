'use strict';

var assert = require('assert');
var utils = require('../lib/utils');
var Promise = utils.Promise;
var Data = require('./common/data');

if (!Data) {
	return;
}

describe('AccessService', function () {
	this.timeout(1000 * 60);

	var controlService = Data.controlService;
	var accessService = Data.accessService;

	function createEntities() {
		var entities = [{
			id: 'ROQ1',
			wikiId: 'Q1',
			name: 'Name',
			lang: 'ro',
			rank: 1
		}, {
			id: 'ROQ2',
			wikiId: 'Q2',
			name: 'Name2',
			lang: 'ro',
			rank: 1
		}, {
			id: 'ROQ3',
			wikiId: 'Q3',
			name: 'Name2',
			lang: 'ro',
			rank: 1
		}];

		return Promise.each(entities, function (entity) {
			return controlService.createEntity(entity);
		});
	}

	before('createTables', function () {
		return Data.createTables().then(createEntities);
	});

	after('deleteTables', function () {
		return Data.deleteTables('iam-sure')
			.then(function () {
				return Promise.delay(1000 * 10);
			});
	});

	it('should get entity by id', function () {
		return accessService.getEntityById('ROQ1')
			.then(function (entity) {
				assert.ok(entity);
				assert.ok(entity.name);
				assert.equal('ROQ1', entity.id);
			});
	});

	it('should get entity by id, and AWS params', function () {
		return accessService.getEntityById('ROQ1', {
			AttributesToGet: ['id', 'rank']
		}).then(function (entity) {
			assert.ok(entity);
			assert.equal('ROQ1', entity.id);
			assert.equal(undefined, entity.name);
			assert.equal(2, Object.keys(entity).length);
		});
	});

	it('should get entities by ids', function () {
		return accessService.getEntitiesByIds(['ROQ1', 'ROQ2'])
			.then(function (entities) {
				assert.ok(entities);
				assert.equal(2, entities.length);
			});
	});
});
