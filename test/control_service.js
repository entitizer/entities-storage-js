'use strict';

var assert = require('assert');
var utils = require('../lib/utils');
var Promise = utils.Promise;
var Data = require('./common/data');

if (!Data) {
	return;
}

describe('ControlService', function () {
	this.timeout(1000 * 60);

	before('createTables', function () {
		return Data.createTables();
	});

	after('deleteTables', function () {
		return Data.deleteTables('iam-sure')
			.then(function () {
				return Promise.delay(1000 * 10);
			});
	});

	var service = Data.controlService;

	describe('#createEntity()', function () {
		it('should create entity with minimum fields', function () {
			return service.createEntity({
				id: 'ROQ1',
				wikiId: 'Q1',
				name: 'Name',
				lang: 'ro',
				rank: 1
			}).then(function (entity) {
				assert.ok(entity);
				assert.equal('ROQ1', entity.id);
				assert.equal('Name', entity.name);
			});
		});

		it('should throw a dublicate entity id', function () {
			return service.createEntity({
				id: 'ROQ1',
				wikiId: 'Q1',
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
			return service.createEntity({
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
			return service.createEntity({
				id: 'ROQ2',
				wikiId: 'Q2',
				name: 'Name 2',
				country: 'ro',
				lang: 'ro',
				type: 'L',
				description: 'info',
				rank: 1
			}).then(function (entity) {
				assert.ok(entity);
				assert.equal('ROQ2', entity.id);
				assert.equal('L', entity.type);
				assert.equal('info', entity.description);
			});
		});
	});
});
