'use strict';

var assert = require('assert');
var Data = require('./data');

if (!Data) {
	return;
}

describe('RootControlService', function() {
	this.timeout(1000 * 60);

	before(function() {
		return Data.createTables();
	});

	var service = Data.rootControlService;

	describe('#createEntity()', function() {
		it('minimum entity fields', function() {

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
	});
});
