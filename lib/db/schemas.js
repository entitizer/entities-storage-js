'use strict';

var Joi = require('vogels-helpers').Joi;

var ENTITY_NAME_TYPES = [0, 1, 2, 3, 4];
var ENTITY_CATEGORIES = [10, 20, 30, 40, 50, 60, 70, 80, 90];

var ENTITY_NAME_TYPE = {
	SIMPLE: 0,
	SLUG: 1,
	ABBR: 2,
	WIKI_NAME: 3,
	ENGLISH_WIKI_NAME: 4
};

var ENTITY_TYPES = ['person', 'place', 'group', 'brand', 'arts'];

var EntitySchema = {
	id: Joi.number().integer().required(),
	createdAt: Joi.number().default(Date.now, 'time of creation'),
	// md5 (COUNTRY_LANGUAGE_SLUG):
	slug_key: Joi.string().trim().length(32).lowercase().required(),
	name: Joi.string().trim().max(100).required(),
	slug: Joi.string().trim().lowercase().max(100).required(),
	atonicName: Joi.string().trim().max(100),
	abbr: Joi.string().trim().max(20),

	type: Joi.valid(ENTITY_TYPES),
	category: Joi.valid(ENTITY_CATEGORIES),

	region: Joi.string().trim().length(2).lowercase(),

	wikiId: Joi.number().integer(),
	wikiName: Joi.string().trim().max(200),
	englishWikiId: Joi.number().integer(),
	englishWikiName: Joi.string().trim().max(200),

	wikiId_key: Joi.string().regex(/^[a-z]{2}-\d+$/),

	lang: Joi.string().trim().length(2).lowercase().required(),
	country: Joi.string().trim().length(2).lowercase().required(),

	culture: Joi.string().trim().regex(/^[a-z]{2}-[a-z]{2}$/).required(),

	description: Joi.string().trim().max(400)
};

var UpdateEntitySchema = {
	id: Joi.number().integer().required(),
	updatedAt: Joi.number().default(Date.now, 'time of updating'),
	name: Joi.string().trim().max(100).invalid(null, ''),
	atonicName: Joi.string().trim().max(100).invalid(null, ''),
	slug: Joi.string().trim().lowercase().max(100).invalid(null, ''),
	slug_key: Joi.string().trim().length(32).lowercase().invalid(null, ''),
	abbr: Joi.string().trim().max(20),

	wikiId: Joi.number().integer(),
	wikiName: Joi.string().trim().max(200),
	englishWikiId: Joi.number().integer(),
	englishWikiName: Joi.string().trim().max(200),

	wikiId_key: Joi.string().regex(/^[a-z]{2}-\d+$/),

	type: Joi.valid(ENTITY_TYPES),
	category: Joi.valid(ENTITY_CATEGORIES),

	region: Joi.string().trim().length(2).lowercase(),

	description: Joi.string().trim().max(400).invalid(null, '')
};

var EntityNameSchema = {
	// md5 (COUNTRY_LANGUAGE_UNIQUENAME)
	key: Joi.string().trim().length(32).required(),
	name: Joi.string().trim().min(2).max(200).required(),
	// unique name
	uniqueName: Joi.string().trim().min(2).max(200),
	type: Joi.valid(ENTITY_NAME_TYPES).default(ENTITY_NAME_TYPE.SIMPLE),
	entityId: Joi.number().integer().required(),
	createdAt: Joi.number().default(Date.now, 'time of creation'),
	entity: Joi.object().keys({
		id: Joi.number().integer().required(),
		name: Joi.string().trim().max(100).required(),
		slug: Joi.string().trim().lowercase().max(100).required(),
		abbr: Joi.string().trim().max(20),
		type: Joi.valid(ENTITY_TYPES),
		category: Joi.valid(ENTITY_CATEGORIES),
		region: Joi.string().trim().length(2).lowercase(),
		wikiId: Joi.number().integer(),
		wikiName: Joi.string().trim().max(200),
		englishWikiId: Joi.number().integer(),
		englishWikiName: Joi.string().trim().max(200)
	}).required()
};

var UpdateEntityNameSchema = {
	key: Joi.string().trim().length(32).required(),
	updatedAt: Joi.number().default(Date.now, 'time of updating'),
	entity: Joi.object().keys({
		id: Joi.number().integer().required(),
		name: Joi.string().trim().max(100).required(),
		slug: Joi.string().trim().lowercase().max(100).required(),
		abbr: Joi.string().trim().max(20),
		type: Joi.valid(ENTITY_TYPES),
		category: Joi.valid(ENTITY_CATEGORIES),
		region: Joi.string().trim().length(2).lowercase(),
		wikiId: Joi.number().integer(),
		wikiName: Joi.string().trim().max(200),
		englishWikiId: Joi.number().integer(),
		englishWikiName: Joi.string().trim().max(200)
	}).invalid(null, '')
};

var ACTIONS = {
	CREATE_ENTITY: 'create_entity',
	UPDATE_ENTITY: 'update_entity',
	ADD_ENTITY_NAMES: 'add_entity_names',
	REMOVE_ENTITY_NAMES: 'remove_entity_names'
};

var ACTION_NAMES = [
	'create_entity',
	'update_entity',
	'add_entity_names',
	'remove_entity_names'
];

var ACTION_STATUS = ['new', 'executing', 'done', 'error'];

var actionResultDataSchema = Joi.array().items(Joi.object().keys({
	type: Joi.string().valid(['name']),
	value: Joi.string(),
	result: Joi.string().valid(['done', 'error']),
	message: Joi.string().max(200)
})).max(50);

var ActionSchema = {
	// sha1(CULTURE_TYPE_DATAHASH)
	id: Joi.string().trim().length(40).lowercase().required(),
	type: Joi.string().valid(ACTION_NAMES).required(),
	createdAt: Joi.number().default(Date.now, 'time of creation'),
	updatedAt: Joi.number().default(Date.now, 'time of updating'),

	entityId: Joi.number().integer(),
	lang: Joi.string().trim().length(2).lowercase().required(),
	country: Joi.string().trim().length(2).lowercase().required(),
	// ro_md, en_us, en_in
	culture: Joi.string().trim().length(5).lowercase().required(),
	// parentActionId: Joi.string().trim().length(36).lowercase(),
	status: Joi.valid(ACTION_STATUS).default('new').required(),
	// CULTURE_STATUS: ro_md_new, en_in_done
	statusKey: Joi.string().trim().min(8).max(16).lowercase().required(),

	executedByMemberId: Joi.string().trim().lowercase().min(1).max(40),
	executedByMemberName: Joi.string().trim().min(3).max(40),

	// json data
	// data: Joi.string().min(6).max(1000).required(),
	data: Joi.any().required()
		.when('type', {
			is: ACTIONS.CREATE_ENTITY,
			then: Joi.object().keys({
				id: Joi.number().integer().min(1).required(),
				lang: Joi.string().trim().length(2).lowercase(),
				country: Joi.string().trim().length(2).lowercase(),
				name: Joi.string().trim().max(100).required(),
				atonicName: Joi.string().trim().max(100),
				abbr: Joi.string().trim().max(20),

				type: Joi.valid(ENTITY_TYPES),
				category: Joi.valid(ENTITY_CATEGORIES),

				region: Joi.string().trim().length(2).lowercase(),

				wikiId: Joi.number().integer(),
				wikiName: Joi.string().trim().max(200),
				englishWikiId: Joi.number().integer(),
				englishWikiName: Joi.string().trim().max(200),

				description: Joi.string().trim().max(400),

				names: Joi.array().items(Joi.string().min(2).max(200)).max(50)
			})
		})
		.when('type', {
			is: ACTIONS.UPDATE_ENTITY,
			then: Joi.object().keys({
				name: Joi.string().trim().max(100),
				atonicName: Joi.string().trim().max(100),
				abbr: Joi.string().trim().max(20),

				type: Joi.valid(ENTITY_TYPES),
				category: Joi.valid(ENTITY_CATEGORIES),

				region: Joi.string().trim().length(2).lowercase(),

				wikiId: Joi.number().integer(),
				wikiName: Joi.string().trim().max(200),
				englishWikiId: Joi.number().integer(),
				englishWikiName: Joi.string().trim().max(200),

				description: Joi.string().trim().max(400)
			})
		})
		.when('type', {
			is: ACTIONS.ADD_ENTITY_NAMES,
			then: Joi.array().items(Joi.string().min(2).max(200))
		})
		.when('type', {
			is: ACTIONS.REMOVE_ENTITY_NAMES,
			then: Joi.array().items(Joi.string().min(2).max(200))
		}),
	dataHash: Joi.string().trim().lowercase().length(40).required(),
	resultData: actionResultDataSchema,
	v: Joi.string().valid('0').default('0')
};

var UpdateActionSchema = {
	id: Joi.string().required(),

	entityId: Joi.number().integer().min(1).invalid(null, ''),

	updatedAt: Joi.number().default(Date.now, 'time of updating'),

	status: Joi.valid(ACTION_STATUS).required(),
	// CULTURE_STATUS: ro_md_new, en_in_done
	statusKey: Joi.string().trim().min(8).max(16).lowercase().required(),

	oldData: Joi.any()
		.when('type', {
			is: ACTIONS.UPDATE_ENTITY,
			then: Joi.object().keys({
				name: Joi.string().trim().max(100),
				atonicName: Joi.string().trim().max(100),
				abbr: Joi.string().trim().max(20),

				type: Joi.valid(ENTITY_TYPES),
				category: Joi.valid(ENTITY_CATEGORIES),

				region: Joi.string().trim().length(2).lowercase(),

				wikiId: Joi.number().integer(),
				wikiName: Joi.string().trim().max(200),
				englishWikiId: Joi.number().integer(),
				englishWikiName: Joi.string().trim().max(200),

				description: Joi.string().trim().max(400)
			}),
			otherwise: Joi.string().max(0)
		}),

	// executedByMemberId: Joi.string().trim().lowercase().min(1).max(40).required(),
	// executedByMemberName: Joi.string().trim().min(3).max(40).required(),

	resultData: actionResultDataSchema
};

exports.EntitySchema = EntitySchema;
exports.UpdateEntitySchema = UpdateEntitySchema;
exports.EntityNameSchema = EntityNameSchema;
exports.UpdateEntityNameSchema = UpdateEntityNameSchema;
exports.ENTITY_NAME_TYPE = ENTITY_NAME_TYPE;
exports.ACTIONS = ACTIONS;
exports.ActionSchema = ActionSchema;
exports.UpdateActionSchema = UpdateActionSchema;
