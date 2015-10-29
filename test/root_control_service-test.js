'use strict';

var assert = require('assert');
var Data = require('./data');

if (!Data) {
	return;
}

function foo() {}

describe('RootControlService', function() {
	this.timeout(1000 * 60);

	before('createTables', function() {
		return Data.createTables();
	});

	after('deleteTables', function() {
		return Data.deleteTables('iam-sure');
	});

	var service = Data.rootControlService;

	describe('#createEntity()', function() {
		it('should create entity with minimum fields', function() {
			var promise = service.createEntity({
				id: 1,
				name: 'Name',
				country: 'ro',
				lang: 'ro'
			});

			return promise
				.then(function(entity) {
					assert.ok(entity);
					assert.equal(1, entity.id);
					assert.equal('name', entity.slug);
					assert.equal(undefined, entity.globalId);
				});
		});

		it('should create entity with all fields', function() {
			var promise = service.createEntity({
				id: 2,
				name: 'Name 2',
				country: 'ro',
				lang: 'ro',
				type: 'place',
				region: 'us',
				description: 'info',
				category: 10
			});

			return promise
				.then(function(entity) {
					assert.ok(entity);
					assert.equal(2, entity.id);
					assert.equal('name-2', entity.slug);
					assert.equal(undefined, entity.globalId);
					assert.equal('place', entity.type);
					assert.equal('us', entity.region);
					assert.equal('info', entity.description);
					assert.equal(10, entity.category);
				});
		});

		it('should throw a dublicate entity id error', function() {
			var promise = service.createEntity({
				id: 1,
				name: 'Name',
				country: 'ro',
				lang: 'ro'
			});

			return promise
				.catch(function(error) {
					assert.equal('ConditionalCheckFailedException', error.code);
				})
				.then(function(entity) {
					assert.equal(undefined, entity);
				});
		});
	});

	describe('#setEntityFields()', function() {
		it('should change entity\'s fields', function() {
			return service.createEntity({
					id: 20,
					name: 'Long Name',
					country: 'md',
					lang: 'ro',
					type: 'place'
				})
				.then(function(entity) {
					assert.ok(entity);
					assert.equal(20, entity.id);
					assert.equal('long-name', entity.slug);
					assert.equal(undefined, entity.globalId);
					assert.equal('place', entity.type);

					return service.setEntityFields({
							id: 20,
							type: 'person',
							category: 20
						})
						.then(function(updatedEntity) {
							assert.ok(updatedEntity);
							assert.equal(20, updatedEntity.id);
							assert.equal('long-name', updatedEntity.slug);
							assert.equal(undefined, updatedEntity.globalId);
							assert.equal('person', updatedEntity.type);
							assert.equal(20, updatedEntity.category);
						});
				});
		});
	});

	describe('#setEntityName()', function() {
		it('should change entity\'s name', function() {
			return service.createEntity({
					id: 30,
					name: 'One Name',
					country: 'md',
					lang: 'ro',
					type: 'place'
				})
				.then(function(entity) {
					assert.ok(entity);
					assert.equal(30, entity.id);
					assert.equal('one-name', entity.slug);
					assert.equal(undefined, entity.globalId);
					assert.equal('place', entity.type);

					return service.setEntityName({
							id: 30,
							name: 'One name',
							abbr: 'ONE'
						})
						.then(function(updatedEntity) {
							assert.ok(updatedEntity);
							assert.equal(30, updatedEntity.id);
							assert.equal('One name', updatedEntity.name);
							assert.equal('ONE', updatedEntity.abbr);
							assert.equal('one-name', updatedEntity.slug);
						});
				});
		});
	});
});
