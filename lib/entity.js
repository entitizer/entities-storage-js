'use strict';

/**
  @typedef EntityData
  @type {object}
  @property {number} id - an ID.
  @property {string} name - entity name.
  @property {string} slug - a slug.
  @property {string} slug_key - slug hash.
  @property {string} atonicName - name without accents, ASCII.
  @property {string} abbr - name abbreviation.
  @property {string} type - entity type: [place, person, group, brand, arts].
  @property {number} category - entity category: [10, 20, 30, 40, 50, 60, 70, 80, 90].
  @property {string} region - entity region: a country 2 letters code.
  @property {string} country - country 2 leters code.
  @property {string} lang - language 2 leters code.

  @property {number} wikiId - Wikipedia id.
  @property {string} wikiName - Wikipedia article name.
  @property {number} englishWikiId - English Wikipedia id.
  @property {string} englishWikiName - English Wikipedia article name.
  @property {string} description - Entity description.

  @property {number} globalId - GlobalEntity id.
  @property {EntityNameData[]} names - Entity names.

  @property {Date} createdAt - created datetime.
  @property {Date} updatedAt - updated datetime.
*/

var utils = require('./utils');
var _ = utils._;
var atonic = utils.atonic;
var md5 = utils.md5;
var slug = utils.slug;
var assert = require('assert');
var EntityName = require('./entity_name');
var schemas = require('./db/schemas');
var counter = require('./counter');
var updateSchema = schemas.UpdateEntitySchema;

var createSlug = exports.createSlug = function(name) {
	assert.ok(name);
	name = EntityName.createUniqueName(name);

	return slug(name);
};

var createSlugKey = exports.createSlugKey = function(data) {
	assert.ok(data);
	assert.ok(data.slug);
	assert.ok(data.country);
	assert.ok(data.lang);

	return md5([data.country.toLowerCase(), data.lang.toLowerCase(), data.slug.toLowerCase()].join('_'));
};

var formatWikiIdKey = exports.formatWikiIdKey = function(data) {
	assert.ok(data);
	assert.ok(data.lang);
	assert.ok(data.wikiId);

	var lang = data.lang;
	var id = data.wikiId;

	return [lang, id].join('-');
};

var normalizeCreate = exports.normalizeCreate = function(entity) {
	entity = _.clone(entity);
	if (!entity.lang || !entity.country) {
		throw new Error('`lang` AND `country` are required on creating Entity');
	}
	entity.lang = entity.lang.toLowerCase();
	entity.country = entity.country.toLowerCase();
	entity.culture = [entity.lang, entity.country].join('-');
	entity.name = entity.name.trim();
	entity.name = utils.correctText(entity.name, entity.lang);
	entity.atonicName = entity.atonicName || atonic(entity.name);
	if (entity.name === entity.atonicName) {
		delete entity.atonicName;
	}
	if (entity.abbr) {
		entity.abbr = entity.abbr.trim();
	}

	entity.slug = entity.slug || createSlug(entity.name);
	entity.slug_key = createSlugKey(entity);

	if (entity.wikiId) {
		entity.wikiId_key = formatWikiIdKey(entity);
	}

	if (entity.description) {
		entity.description = _.trunc(entity.description.trim(), 400);
	}

	if (_.isString(entity.createdAt)) {
		entity.createdAt = new Date(entity.createdAt);
	}
	if (_.isDate(entity.createdAt)) {
		entity.createdAt = entity.createdAt.getTime();
	}

	if (entity.names) {
		entity.names = _.uniq(entity.names, 'name');
	}

	return entity;
};

var normalizeUpdate = exports.normalizeUpdate = function(entity) {
	if (!entity.lang || !entity.country) {
		throw new Error('`lang` AND `country` are required on update');
	}
	entity = _.clone(entity);
	if (entity.name) {
		entity.name = entity.name.trim();
		entity.name = utils.correctText(entity.name, entity.lang);
		entity.atonicName = entity.atonicName || atonic(entity.name);
		if (entity.name === entity.atonicName) {
			entity.atonicName = null;
		}
	}

	if (entity.abbr) {
		entity.abbr = entity.abbr.trim();
	}

	if (entity.slug && !entity.slug_key) {
		entity.slug_key = createSlugKey(entity);
	}

	if (entity.description) {
		entity.description = _.trunc(entity.description.trim(), 400);
	}
	// deleting wikiName
	if (entity.wikiName === null) {
		entity.wikiId = null;
	}

	// deleting englishWikiName
	if (entity.englishWikiName === null) {
		entity.englishWikiId = null;
	}

	// deleting wikiId
	if (entity.wikiId === null) {
		entity.wikiName = null;
		entity.wikiId_key = null;
		entity.englishWikiId = null;
		entity.englishWikiName = null;
	}
	if (entity.wikiId) {
		entity.wikiId_key = formatWikiIdKey(entity);
	}

	// deleting englishWikiId
	if (entity.englishWikiId === null) {
		entity.englishWikiName = null;
	}

	if (entity.names) {
		entity.names = _.uniq(entity.names, 'name');
	}

	delete entity.lang;
	delete entity.country;

	return entity;
};

var validateCreate = exports.validateCreate = function(data) {
	if (data.englishWikiName && !data.englishWikiId || !data.englishWikiName && data.englishWikiId) {
		throw new Error('An entity must have englishWikiId AND englishWikiName');
	}
	if (data.wikiName && !data.wikiId || !data.wikiName && data.wikiId) {
		throw new Error('An entity must have wikiId AND wikiName');
	}
	// if (data.englishWikiId && !data.wikiId) {
	// 	throw new Error('`englishWikiId` cannot be without `wikiId`');
	// }
};

var validateUpdate = exports.validateUpdate = function(data) {
	if (data.lang || data.country) {
		throw new Error('`country` OR `lang` cannot be changed');
	}
	if (data.englishWikiName && !data.englishWikiId) {
		throw new Error('You cannot update englishWikiName without englishWikiId');
	}
	if (data.wikiName && !data.wikiId) {
		throw new Error('You cannot update wikiName without wikiId');
	}
};

exports.createNewId = function() {
	return counter.nextEntityId();
};

exports.config = {
	name: 'Entity',
	updateSchema: updateSchema,
	createNormalize: normalizeCreate,
	updateNormalize: normalizeUpdate,
	createValidate: validateCreate,
	updateValidate: validateUpdate
};
