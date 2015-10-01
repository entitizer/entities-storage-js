'use strict';

var utils = require('entitizer.utils');
var _ = utils._;
var uuid = require('node-uuid');

function dbGet(data) {
	if (_.isNull(data) || _.isUndefined(data)) {
		return data;
	}
	if (_.isArray(data)) {
		return data.map(dbGet);
	}
	if (_.isFunction(data.toJSON)) {
		return data.toJSON();
	}
	if (_.isObject(data)) {
		Object.keys(data).forEach(function(key) {
			data[key] = dbGet(data[key]);
		});
	}
	return data;
}

var local = {
	dbGet: dbGet,
	uuid: uuid.v1
};

module.exports = _.assign({}, utils, local);
