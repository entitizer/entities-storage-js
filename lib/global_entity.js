'use strict';

var utils = require('./utils');
var _ = utils._;
var atonic = utils.atonic;
var Entity = require('./entity');

function normalize(data) {
	var entity = _.cloneDeep(data);
	entity.name = entity.name.trim();
	entity.name = utils.correctText(entity.name, entity.lang);
	entity.atonicName = entity.atonicName || atonic(entity.name);
	if (entity.name === entity.atonicName) {
		delete entity.atonicName;
	}
	if (entity.abbr) {
		entity.abbr = entity.abbr.trim();
	}

	entity.slug = entity.slug || Entity.createSlug(entity.name);
	entity.slug_key = Entity.createSlugKey(entity);

	if (entity.description) {
		entity.description = _.trunc(entity.description.trim(), 400);
	}

	return entity;
}

exports.normalize = normalize;
