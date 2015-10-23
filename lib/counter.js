'use strict';

var counter = require('statefulco').counter;

exports.inc = counter.inc;

exports.nextGlobalEntityId = function() {
	return counter.inc('entitizer-globalentity');
};

exports.nextEntityId = function() {
	return counter.inc('entitizer-entity');
};
