'use strict';

var Promise = require('./utils').Promise;
var counter = require('statefulco').counter;

exports.inc = counter.inc;

exports.nextEntityId = function() {
	return new Promise(function(resolve, reject) {
		counter.inc('entitizer-entity', function(error, value) {
			if (error) {
				return reject(error);
			}
			resolve(value);
		});
	});
};
