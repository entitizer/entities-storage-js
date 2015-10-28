'use strict';

var assert = require('assert');
var Data = require('./data');

describe('RootControlService', function() {
	this.timeout(1000 * 200);

	before(function() {
		return Data.createTables();
	});

	var service = Data.rootControlService;

	describe('#createEntity()', function() {
		it('invalid entity', function(done) {
			console.log('aici 2');
			var promise = service.createEntity({
				id: 1,
				name: 'Name',
				country: 'ro',
				lang: 'ro'
			});

			promise
				.catch(done)
				.then(function(entity) {
					assert.ok(entity);
					assert.equal(1, entity.id);
					done();
				});
		});
	});
});
