'use strict';

var schemas = require('./schemas');

var SCHEMAS_KEYS = {};

function getSchemaKeys(name) {
	var schema = schemas[name];
	if (!schema) {
		throw new Error('Invalid schema: ' + name);
	}
	return Object.keys(schema);
}

function schemaKeys(name) {
	if (!SCHEMAS_KEYS[name]) {
		SCHEMAS_KEYS[name] = getSchemaKeys(name);
	}

	return SCHEMAS_KEYS[name];
}

exports.schemaKeys = schemaKeys;
