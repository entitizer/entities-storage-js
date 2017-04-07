'use strict';

var assert = require('assert');
var utils = require('../lib/utils');
var Promise = utils.Promise;
var Data = require('./common/data');

if (!Data) {
	return;
}

describe('services', function () {
	var entityService = Data.entityService;
	var entityNamesService = Data.entityNamesService;

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
			return entityService.createEntity(entity);
		});
	}

	before('createTables', function () {
		this.timeout(20 * 1000);
		return Data.createTables().then(createEntities);
	});

	after('deleteTables', function () {
		this.timeout(10 * 1000);
		return Data.deleteTables('iam-sure').delay(2 * 1000);
	});

	describe('EntityService', function () {

		it('should get entity by id', function () {
			return entityService.getEntityById('ROQ1')
				.then(function (entity) {
					assert.ok(entity);
					assert.ok(entity.name);
					assert.equal('ROQ1', entity.id);
				});
		});

		it('should get entity by id, and AWS params', function () {
			return entityService.getEntityById('ROQ1', {
				AttributesToGet: ['id', 'rank']
			}).then(function (entity) {
				assert.ok(entity);
				assert.equal('ROQ1', entity.id);
				assert.equal(undefined, entity.name);
				assert.equal(2, Object.keys(entity).length);
			});
		});

		it('should get entities by ids', function () {
			return entityService.getEntitiesByIds(['ROQ1', 'ROQ2'])
				.then(function (entities) {
					assert.ok(entities);
					assert.equal(2, entities.length);
				});
		});

		it('should create entity with minimum fields', function () {
			return entityService.createEntity({
				id: 'ROQ01',
				wikiId: 'Q01',
				name: 'Name',
				lang: 'ro',
				rank: 1
			}).then(function (entity) {
				assert.ok(entity);
				assert.equal('ROQ01', entity.id);
				assert.equal('Name', entity.name);
			});
		});

		it('should throw a dublicate entity id', function () {
			return entityService.createEntity({
				id: 'ROQ01',
				wikiId: 'Q01',
				name: 'Name',
				lang: 'ro',
				rank: 1
			}).then(function (entity) {
				assert.equal(undefined, entity);
			}).catch(function (error) {
				assert.equal('ConditionalCheckFailedException', error.code);
			});
		});

		it('should throw a invalid entity', function () {
			return entityService.createEntity({
				id: 'ROQ1565',
				wikiId: 'Q1565',
				name: 'Name',
				lang: 'ro',
				rank: 1,
				wikiTitle: 1
			}).then(function (entity) {
				assert.equal(undefined, entity);
			}).catch(function (error) {
				assert.ok(error);
			});
		});

		it('should create entity with all fields', function () {
			return entityService.createEntity({
				id: 'ROQ02',
				wikiId: 'Q02',
				name: 'Name 2',
				country: 'ro',
				lang: 'ro',
				type: 'L',
				description: 'info',
				rank: 1
			}).then(function (entity) {
				assert.ok(entity);
				assert.equal('ROQ02', entity.id);
				assert.equal('L', entity.type);
				assert.equal('info', entity.description);
			});
		});
	});

	describe('EntityNamesService', function () {
		it('should throw error on creating an invalid names', function () {
			return entityNamesService.createEntityNames({ names: 1 })
				.then(function (result) {
					assert.equal(undefined, result);
				}).catch(function (error) {
					assert.ok(error);
				});
		});

		it('should throw error on creating an invalid item', function () {
			return entityNamesService.createEntityNames({})
				.then(function (result) {
					assert.equal(undefined, result);
				}).catch(function (error) {
					assert.ok(error);
				});
		});

		it('should throw error on creating an invalid short names', function () {
			return entityNamesService.createEntityNames({ names: '1', entityId: 'ROQ1' })
				.then(function (result) {
					assert.equal(undefined, result);
				}).catch(function (error) {
					assert.ok(error);
				});
		});

		it('should create entity names', function () {
			return entityNamesService.createEntityNames({ names: 'name', entityId: 'ROQ1' });
		});
		it('should update entity names', function () {
			return entityNamesService.updateEntityNames({ names: 'name|name2', entityId: 'ROQ1' })
				.then(result => assert.equal('name|name2', result.names));
		});
	});
});
