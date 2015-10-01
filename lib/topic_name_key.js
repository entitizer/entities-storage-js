'use strict';

var assert = require('assert');

function validate(data) {
	assert.ok(data);
	assert.ok(data.entityId);
	assert.ok(data.key);

	return data;
}

exports.validate = validate;
