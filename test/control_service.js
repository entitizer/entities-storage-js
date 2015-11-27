'use strict';

var assert = require('assert');
var utils = require('../lib/utils');
var Promise = utils.Promise;
var Data = require('./common/data');

if (!Data) {
	return;
}

describe('ControlService', function() {
	this.timeout(1000 * 60);

	before('createTables', function() {
		return Data.createTables();
	});

	after('deleteTables', function() {
		return Data.deleteTables('iam-sure')
			.then(function() {
				return Promise.delay(1000 * 5);
			});
	});

	var service = Data.controlService;

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
				});
		});

		it('should throw a dublicate entity id AND slug', function() {
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
					assert.equal('place', entity.type);
					assert.equal('us', entity.region);
					assert.equal('info', entity.description);
					assert.equal(10, entity.category);
				});
		});

		it('should throw a dublicate entity id error', function() {
			var promise = service.createEntity({
				id: 1,
				name: 'Namecnu98r9u43',
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

		it('should NOT throw a dublicate entity slug error!!!', function() {
			var promise = service.createEntity({
				id: 12387283,
				name: 'Name',
				country: 'ro',
				lang: 'ro'
			});

			return promise
				.then(function(entity) {
					assert.ok(entity);
					assert.equal('name', entity.slug);
				});
		});

		it('should throw an error on setting just wikiName NOT AND wikiId', function() {
			return service.createEntity({
					id: 3,
					name: 'Second Name',
					country: 'md',
					lang: 'ro',
					type: 'place',
					wikiName: 'Second Name'
				})
				.catch(function(error) {
					assert.ok(error);
				})
				.then(function(entity) {
					assert.equal(undefined, entity);
				});
		});

		it('should create entity with englishWikiId', function() {
			var promise = service.createEntity({
				id: 4,
				name: 'Name 4',
				country: 'ro',
				lang: 'ro',
				englishWikiId: 4,
				englishWikiName: 'Name 4',
				wikiId: 4,
				wikiName: 'Name 4'
			});

			return promise
				.then(function(entity) {
					assert.ok(entity);
					assert.equal(4, entity.id);
					assert.ok(entity.englishWikiId, 4);
				});
		});
	});

	describe('#createEntityName()', function() {
		it('should create an entityName', function() {
			var promise = service.createEntityName({
				name: 'Name',
				lang: 'ro',
				country: 'ro',
				entityId: 1
			});

			return promise
				.then(function(un) {
					assert.ok(un);
					assert.equal(1, un.entityId);
				});
		});

		it('should throw a dublicate error', function() {
			var promise = service.createEntityName({
				name: 'Name',
				lang: 'ro',
				country: 'ro',
				entityId: 1
			});

			return promise
				.catch(function(error) {
					assert.equal('ConditionalCheckFailedException', error.code);
				})
				.then(function(un) {
					assert.equal(undefined, un);
				});
		});

		it('should throw a invalid error', function() {
			var promise = service.createEntityName({
				key: '12345678901234567890123456789012'
			});

			return promise
				.catch(function(error) {
					assert.ok(error);
				})
				.then(function(un) {
					assert.equal(undefined, un);
				});
		});

		it('should throw a invalid id error', function() {
			var promise = service.createEntityName({
				name: '1',
				lang: 'ro',
				country: 'ro'
			});

			return promise
				.catch(function(error) {
					assert.ok(error);
				})
				.then(function(un) {
					assert.equal(undefined, un);
				});
		});
	});
});
