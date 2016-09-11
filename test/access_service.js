'use strict';

var assert = require('assert');
var utils = require('../lib/utils');
var Promise = utils.Promise;
var Data = require('./common/data');

if (!Data) {
	return;
}

describe('AccessService', function() {
	this.timeout(1000 * 60);

	var controlService = Data.controlService;
	var accessService = Data.accessService;

	function createEntities() {
		var entities = [{
			id: 1,
			name: 'Name',
			lang: 'ro',
			country: 'ro',
			names: [{
				name: 'Nm',
				type: 2
			}]
		}, {
			id: 2,
			name: 'Name2',
			lang: 'ro',
			country: 'ro',
			englishWikiId: 1,
			englishWikiName: 'Name',
			wikiId: 1,
			wikiName: 'Name'
		}, {
			id: 3,
			name: 'Name2',
			lang: 'ro',
			country: 'md',
			englishWikiId: 1,
			englishWikiName: 'Name',
			wikiId: 1,
			wikiName: 'Name'
		}];

		return Promise.each(entities, function(entity) {
			return controlService.createEntity(entity)
				.then(function(dbEntity) {
					var names = entity.names || [];
					names.push(dbEntity);
					delete dbEntity.createdAt;
					return Promise.each(names, function(name) {
						name.country = entity.country;
						name.lang = entity.lang;
						name.entity = dbEntity;
						return controlService.createEntityName(name);
					});
				});
		});
	}

	before('createTables', function() {
		return Data.createTables().then(createEntities);
	});

	after('deleteTables', function() {
		return Data.deleteTables('iam-sure')
			.then(function() {
				return Promise.delay(1000 * 10);
			});
	});

	it('should get entity by id', function() {
		return accessService.entityById(1)
			.then(function(entity) {
				assert.ok(entity);
				assert.ok(entity.name);
				assert.equal(1, entity.id);
			});
	});

	it('should get entity by id, and AWS params', function() {
		return accessService.entityById(1, {
				params: {
					AttributesToGet: ['id', 'slug']
				}
			})
			.then(function(entity) {
				assert.ok(entity);
				assert.equal(1, entity.id);
				assert.equal(undefined, entity.name);
				assert.equal(2, Object.keys(entity).length);
			});
	});

	it('should get entity by unique name key', function() {
		// key for name, ro, ro
		return accessService.entityByKey('78593af5f20c8a08a7d3e9c4d58b58a7')
			.then(function(entity) {
				assert.ok(entity);
				assert.ok(entity.name);
				assert.equal('Name', entity.name);
				assert.equal(1, entity.id);
			});
	});

	it('should get entities by ids', function() {
		return accessService.entitiesByIds([1, 2])
			.then(function(entities) {
				assert.ok(entities);
				assert.equal(2, entities.length);
			});
	});

	it('should get entities by english wikiId', function() {
		return accessService.entityIdsByEnglishWikiId(1)
			.then(function(ids) {
				assert.ok(ids);
				assert.equal(2, ids.length);
			});
	});

	it('should get entity name keys by entityId', function() {
		return accessService.entityNameKeysByEntityId(1)
			.then(function(keys) {
				assert.ok(keys);
				assert.equal(2, keys.length);
			});
	});

	it('should get entity names by entityId', function() {
		return accessService.entityNamesByEntityId(1)
			.then(function(names) {
				assert.ok(names);
				assert.equal(2, names.length);
			});
	});

});
