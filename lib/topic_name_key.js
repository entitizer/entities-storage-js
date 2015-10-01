'use strict';

var assert = require('assert');

function validate(data) {
	assert.ok(data);
	assert.ok(data.topicId);
	assert.ok(data.key);

	return data;
}

exports.validate = validate;
