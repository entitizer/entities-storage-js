'use strict';

var utils = require('../utils');
var _ = utils._;
var Joi = require('joi');

var ENTITY_NAME_TYPES = [0, 1, 2, 3, 4];

var ENTITY_NAME_TYPE = {
	SIMPLE: 0,
	SLUG: 1,
	ABBR: 2,
	WIKI_NAME: 3,
	ENGLISH_WIKI_NAME: 4
};

var ENTITY_TYPES = ['person', 'place', 'group', 'brand', 'arts'];

var RootEntitySchema = {
	id: Joi.number().integer().required(),
	// md5 (COUNTRY_LANGUAGE_SLUG):
	slug_key: Joi.string().trim().length(32).lowercase().required(),
	name: Joi.string().trim().max(100).required(),
	slug: Joi.string().trim().lowercase().max(100).required(),
	// prevSlug: Joi.string().trim().lowercase().max(100),
	atonicName: Joi.string().trim().max(100),
	abbr: Joi.string().trim().max(20),

	type: Joi.valid(ENTITY_TYPES),
	category: Joi.valid(10, 20, 30, 40, 50, 60, 70, 80, 90),

	region: Joi.string().trim().length(2).lowercase()
};

var GlobalEntitySchema = _.assign({}, RootEntitySchema, {
	englishWikiId: Joi.number().integer().required(),
	englishWikiName: Joi.string().trim().max(200).required(),
	description: Joi.string().trim().max(400).required(),
	// entities ids by country code: {md: 23243, us: 4235}
	cultureIds: Joi.object({}).pattern(/^[a-z]{2}$/, Joi.number().integer()).min(1).required()
});

var BasicEntitySchema = _.assign({}, RootEntitySchema, {
	wikiId: Joi.number().integer(),
	wikiName: Joi.string().trim().max(200),
	englishWikiId: Joi.number().integer(),
	englishWikiName: Joi.string().trim().max(200),

	globalId: Joi.number().integer(),

	lang: Joi.string().trim().length(2).lowercase().required(),
	country: Joi.string().trim().length(2).lowercase().required(),

	description: Joi.string().trim().max(400),

	names: Joi.array().items(Joi.object().keys({
		// md5 (COUNTRY_LANGUAGE_UNIQUENAME)
		key: Joi.string().trim().length(32).required(),
		name: Joi.string().trim().min(2).max(200).required(),
		// unique name
		uniqueName: Joi.string().trim().min(2).max(200).required(),
		type: Joi.valid(ENTITY_NAME_TYPES),
		createdAt: Joi.number().default(Date.now, 'time of creation'),
		// old name id
		id: Joi.number().integer()
	})).min(1).max(50).required()
});

var EntitySchema = _.assign({}, BasicEntitySchema, {});

var UpdateEntitySchema = {
	id: Joi.number().integer().required(),
	name: Joi.string().trim().max(100),
	slug: Joi.string().trim().lowercase().max(100),
	abbr: Joi.string().trim().max(20),

	wikiId: Joi.number().integer(),
	wikiName: Joi.string().trim().max(200),
	englishWikiId: Joi.number().integer(),
	englishWikiName: Joi.string().trim().max(200),

	globalId: Joi.number().integer(),

	type: Joi.valid(ENTITY_TYPES),
	category: Joi.valid(10, 20, 30, 40, 50, 60, 70, 80, 90),

	region: Joi.string().trim().length(2).lowercase(),

	description: Joi.string().trim().max(400)
};

var EntityNameKeySchema = {
	// md5 (COUNTRY_LANGUAGE_UNIQUENAME)
	key: Joi.string().trim().length(32).lowercase().required(),
	entityId: Joi.number().integer().required()
};

var ACTIONS = {
	// CREATE_GLOBAL_ENTITY: 'create_global_entity',
	// UPDATE_GLOBAL_ENTITY: 'update_global_entity',
	CREATE_ENTITY: 'create_entity',
	UPDATE_ENTITY: 'update_entity',
	ADD_ENTITY_NAME: 'add_entity_name',
	REMOVE_ENTITY_NAME: 'remove_entity_name'
};

var ACTION_NAMES = [
	// 'create_global_entity',
	// 'update_global_entity',
	'create_entity',
	'update_entity',
	'add_entity_name',
	'remove_entity_name'
];

var ActionSchema = {
	id: Joi.string().trim().length(32).lowercase().required(),
	// md5 (COUNTRY_LANGUAGE_UNIQUENAME):
	// id: Joi.string().trim().length(32).lowercase().required(),
	type: Joi.string().valid(ACTION_NAMES).required(),

	entityId: Joi.number().integer(),
	entityNameKey: Joi.string().length(32),
	lang: Joi.string().trim().length(2).lowercase().required(),
	country: Joi.string().trim().length(2).lowercase().required(),
	// ro_md, en_us, en_in
	culture: Joi.string().trim().length(5).lowercase().required(),
	// parentActionId: Joi.string().trim().length(36).lowercase(),
	status: Joi.valid('new', 'done', 'error').default('new').required(),
	// CULTURE_STATUS: ro_md_new, en_in_done
	statusKey: Joi.string().trim().min(8).max(16).lowercase().required(),

	executedByMemberId: Joi.string().trim().lowercase().min(1).max(40),
	executedByMemberName: Joi.string().trim().min(3).max(40),

	resultInfo: Joi.string().trim().max(400),
	dataHash: Joi.string().trim().length(32).required(),
	data: Joi.alternatives()
		.when('type', {
			is: ACTIONS.CREATE_ENTITY,
			then: BasicEntitySchema
		})
		.when('type', {
			is: ACTIONS.UPDATE_ENTITY,
			then: UpdateEntitySchema
		})
		.when('type', {
			is: ACTIONS.ADD_ENTITY_NAME,
			then: Joi.object().keys({
				entityId: Joi.number().integer().required(),
				// md5 (COUNTRY_LANGUAGE_UNIQUENAME)
				key: Joi.string().trim().length(32).required(),
				name: Joi.string().trim().min(2).max(200).required(),
				// unique name
				uniqueName: Joi.string().trim().min(2).max(200).required(),
				type: Joi.valid(ENTITY_NAME_TYPES).required()
			})
		})
		.when('type', {
			is: ACTIONS.REMOVE_ENTITY_NAME,
			then: Joi.object().keys({
				entityId: Joi.number().integer().required(),
				// md5 (COUNTRY_LANGUAGE_UNIQUENAME)
				key: Joi.string().trim().length(32).required()
			})
		})
		.required()
};

exports.GlobalEntitySchema = GlobalEntitySchema;
exports.EntitySchema = EntitySchema;
exports.EntityNameKeySchema = EntityNameKeySchema;
exports.ActionSchema = ActionSchema;

exports.ACTIONS = _.clone(ACTIONS);
exports.ACTION_NAMES = _.clone(ACTION_NAMES);
exports.ENTITY_TYPES = _.clone(ENTITY_TYPES);
exports.ENTITY_NAME_TYPES = _.clone(ENTITY_NAME_TYPES);
exports.ENTITY_NAME_TYPE = _.clone(ENTITY_NAME_TYPE);
