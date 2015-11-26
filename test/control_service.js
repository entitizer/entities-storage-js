'use strict';

var assert = require('assert');
var utils = require('../lib/utils');
var Promise = utils.Promise;
var Data = require('./common/data');

if (!Data) {
	return;
}

function foo() {}

describe('ControlService', function() {
	this.timeout(1000 * 60);

	before('createTables', function() {
		return Data.createTables();
	});

	after('deleteTables', function() {
		return Data.deleteTables('iam-sure');
	});

	var service = Data.controlService;
	var accessService = Data.accessService;

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
				englishWikiName: 'Name 4'
			});

			return promise
				.then(function(entity) {
					assert.ok(entity);
					assert.equal(4, entity.id);
					assert.ok(entity.englishWikiId, 4);
				});
		});
	});
});
