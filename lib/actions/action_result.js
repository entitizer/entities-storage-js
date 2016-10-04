'use strict';

var utils = require('../utils');
var _ = utils._;

function validateItem(item) {
	if (!_.isPlainObject(item)) {
		throw new Error('Action Result item is invalid');
	}
	item = _.pick(item, ['type', 'value', 'result', 'message']);
	if (Object.keys(item).length < 1) {
		throw new Error('Action Result item is invalid');
	}
	return item;
}

module.exports = function(data) {

	data = Array.isArray(data) ? data : [];

	data = data.map(validateItem);

	function getData() {
		return data;
	}

	function addItems(items) {
		items = Array.isArray(items) ? items : [items];

		items = items.map(validateItem);
		data = data.concat(items);
		return items;
	}

	var actionResult = {
		push: addItems,
		data: getData,
		concat: addItems
	};

	return actionResult;
};
