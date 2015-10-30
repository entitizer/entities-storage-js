'use strict';

var assert = require('assert');
var utils = require('../lib/utils');
var Promise = utils.Promise;
var Data = require('./data');

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

		it('should create entity AND global entity', function() {
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
					assert.ok(entity.globalId, 'Entity must contain a globalId');
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

	describe('#setEntityWiki()', function() {
		it('should throw an error when using no data', function() {
			return service.setEntityWiki()
				.catch(function(error) {
					assert.ok(error);
				})
				.then(function(updatedEntity) {
					assert.equal(undefined, updatedEntity);
				});
		});

		it('should throw an error when using empty data', function() {
			return service.setEntityWiki({
					id: 40
				})
				.catch(function(error) {
					assert.ok(error);
				})
				.then(function(updatedEntity) {
					assert.equal(undefined, updatedEntity);
				});
		});

		it('should throw an error on updating just wikiName NOT AND wikiId', function() {
			return service.createEntity({
					id: 40,
					name: 'Name 40',
					country: 'md',
					lang: 'ro',
					type: 'place'
				})
				.then(function(entity) {
					assert.equal(40, entity.id);
					return service.setEntityWiki({
							id: 40,
							wikiName: 'Name 40'
						}).catch(function(error) {
							assert.ok(error);
						})
						.then(function(updatedEntity) {
							assert.equal(undefined, updatedEntity);
						});
				});
		});

		it('should set wikiName AND wikiId', function() {
			return service.setEntityWiki({
					id: 40,
					wikiName: 'Name 40',
					wikiId: 40
				})
				.then(function(updatedEntity) {
					assert.equal(40, updatedEntity.wikiId);
					assert.equal('Name 40', updatedEntity.wikiName);
				});
		});
	});

	describe('#setEntityEnglishWiki()', function() {
		it('should throw an error on updating just englishWikiName NOT AND englishWikiId', function() {
			return service.createEntity({
					id: 41,
					name: 'Name 41',
					country: 'md',
					lang: 'ro',
					type: 'place',
					englishWikiId: 41,
					englishWikiName: 'Name 41'
				})
				.then(function(entity) {
					assert.equal(41, entity.id);
					assert.ok(entity.globalId, 'Entity must contain a globalId');

					return service.setEntityWiki({
							id: 41,
							wikiName: 'Name 41'
						}).catch(function(error) {
							assert.ok(error);
						})
						.then(function(updatedEntity) {
							assert.equal(undefined, updatedEntity);
						});
				});
		});

		it('should set englishWikiName AND englishWikiId AND change globalId', function() {
			return accessService.entityById({
					id: 41
				})
				.then(function(entity) {
					assert.ok(entity);
					assert.ok(entity.globalId);
					return service.setEntityEnglishWiki({
							id: 41,
							englishWikiName: 'Name 41-4',
							englishWikiId: 4
						})
						.then(function(updatedEntity) {
							assert.ok(updatedEntity.globalId);
							assert.notEqual(updatedEntity.globalId, entity.globalId);
							assert.equal(4, updatedEntity.englishWikiId);
							assert.equal('Name 41-4', updatedEntity.englishWikiName);
						});
				});
		});

		it('should set englishWikiName AND englishWikiId', function() {
			return service.setEntityEnglishWiki({
					id: 41,
					englishWikiName: 'Name 41',
					englishWikiId: 41
				})
				.then(function(updatedEntity) {
					assert.equal(41, updatedEntity.englishWikiId);
					assert.equal('Name 41', updatedEntity.englishWikiName);
				});
		});

		it('should work with global entity updates *', function() {
			return service.createEntity({
					id: 42,
					name: 'Name 42',
					lang: 'en',
					country: 'us',
					englishWikiId: 42,
					englishWikiName: 'Name 42'
				})
				.then(function(entity1) {
					return service.createEntity({
							id: 43,
							name: 'Name 43',
							lang: 'en',
							country: 'in',
							englishWikiId: 42,
							englishWikiName: 'Name 42'
						})
						.then(function(entity2) {
							assert.ok(entity1);
							assert.ok(entity2);
							assert.ok(entity2.globalId);
							assert.equal(entity1.globalId, entity2.globalId);
							var globalId = entity1.globalId;
							return accessService.globalEntityById({
									id: globalId
								})
								.then(function(globalEntity) {
									assert.ok(globalEntity);
									assert.equal(2, Object.keys(globalEntity.entities).length);
									assert.equal(entity1.id, globalEntity.entities.en_us);
									assert.equal(entity2.id, globalEntity.entities.en_in);
								});
						});
				});
		});
	});
});
