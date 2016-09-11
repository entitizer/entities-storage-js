'use strict';

var counter = require('statefulco').counter;

exports.inc = counter.inc;

exports.nextEntityId = function() {
	return counter.inc('entitizer-entity');
};
