'use strict';

var Joi = require('vogels-helpers').Joi;

var ENTITY_NAME_TYPES = [0, 1, 2, 3, 4];

var ENTITY_NAME_TYPE = {
	SIMPLE: 0,
	SLUG: 1,
	ABBR: 2,
	WIKI_NAME: 3,
	ENGLISH_WIKI_NAME: 4
};

var ENTITY_TYPES = ['person', 'place', 'group', 'brand', 'arts'];

var ENTITY_STATUS = ['dead'];

// var CultureNameSchema = Joi.object().keys({
// 	name: Joi.string().trim().min(2).max(100).required(),
// 	wikiName: Joi.string().trim().min(2).max(200),
// 	abbr: Joi.string().trim().min(1).max(20)
// });

// var GlobalEntitySchema = {
// 	id: Joi.number().integer().required(),
// 	name: Joi.string().trim().max(100).required(),
// 	slug: Joi.string().trim().lowercase().max(100).required(),
// 	atonicName: Joi.string().trim().max(100),
// 	abbr: Joi.string().trim().max(20),

// 	type: Joi.valid(ENTITY_TYPES),
// 	category: Joi.valid(10, 20, 30, 40, 50, 60, 70, 80, 90),

// 	region: Joi.string().trim().length(2).lowercase(),

// 	englishWikiId: Joi.number().integer().required(),
// 	englishWikiName: Joi.string().trim().max(200).required(),
// 	description: Joi.string().trim().max(400),
// 	// entities ids by country code: {ro_md: 23243, en_us: 4235}
// 	entities: Joi.object().pattern(/^[a-z]{2}_[a-z]{2}$/, Joi.number().integer()).min(1).required(),
// 	// names by language code: {ro: {name: 'Name', abbr: 'NU'}, en: {name: 'Name'}}
// 	names: Joi.object({
// 		en: CultureNameSchema
// 	}).pattern(/^[a-z]{2}$/, CultureNameSchema).min(1).required().requiredKeys('en')
// };

// var UpdateGlobalEntitySchema = {
// 	id: Joi.number().integer().required(),
// 	// md5 (COUNTRY_LANGUAGE_SLUG):
// 	slug_key: Joi.string().trim().length(32).lowercase().invalid(null, ''),
// 	name: Joi.string().trim().max(100).invalid(null, ''),
// 	slug: Joi.string().trim().lowercase().max(100).invalid(null, ''),
// 	atonicName: Joi.string().trim().max(100),
// 	abbr: Joi.string().trim().max(20),
// 	type: Joi.valid(ENTITY_TYPES),
// 	category: Joi.valid(10, 20, 30, 40, 50, 60, 70, 80, 90),
// 	region: Joi.string().trim().length(2).lowercase(),
// 	englishWikiId: Joi.number().integer().invalid(null, ''),
// 	englishWikiName: Joi.string().trim().max(200).invalid(null, ''),
// 	description: Joi.string().trim().max(400),
// 	// entities ids by country code: {ro_md: 23243, en_us: 4235}
// 	entities: Joi.object().pattern(/^[a-z]{2}_[a-z]{2}$/, Joi.number().integer()).min(1).invalid(null, ''),
// 	// names by language code: {ro: {name: 'Name', abbr: 'NU'}, en: {name: 'Name'}}
// 	names: Joi.object({
// 		en: CultureNameSchema
// 	}).pattern(/^[a-z]{2}$/, CultureNameSchema).min(1).invalid(null, '').requiredKeys('en')
// };

var EntitySchema = {
	id: Joi.number().integer().required(),
	// md5 (COUNTRY_LANGUAGE_SLUG):
	slug_key: Joi.string().trim().length(32).lowercase().required(),
	name: Joi.string().trim().max(100).required(),
	slug: Joi.string().trim().lowercase().max(100).required(),
	atonicName: Joi.string().trim().max(100),
	abbr: Joi.string().trim().max(20),

	type: Joi.valid(ENTITY_TYPES),
	category: Joi.valid(10, 20, 30, 40, 50, 60, 70, 80, 90),

	region: Joi.string().trim().length(2).lowercase(),

	status: Joi.strict().valid(ENTITY_STATUS),

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
	name: Joi.string().trim().max(100).invalid(null, ''),
	slug: Joi.string().trim().lowercase().max(100).invalid(null, ''),
	slug_key: Joi.string().trim().length(32).lowercase().invalid(null, ''),
	abbr: Joi.string().trim().max(20),

	wikiId: Joi.number().integer(),
	wikiName: Joi.string().trim().max(200),
	englishWikiId: Joi.number().integer(),
	englishWikiName: Joi.string().trim().max(200),

	wikiId_key: Joi.string().regex(/^[a-z]{2}-\d+$/),

	type: Joi.valid(ENTITY_TYPES),
	category: Joi.valid(10, 20, 30, 40, 50, 60, 70, 80, 90),

	region: Joi.string().trim().length(2).lowercase(),

	status: Joi.strict().valid(ENTITY_STATUS),

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
		category: Joi.valid(10, 20, 30, 40, 50, 60, 70, 80, 90),
		region: Joi.string().trim().length(2).lowercase()
	}).required()
};

var UpdateEntityNameSchema = {
	key: Joi.string().trim().length(32).required(),
	entity: Joi.object().keys({
		id: Joi.number().integer().required(),
		name: Joi.string().trim().max(100).required(),
		slug: Joi.string().trim().lowercase().max(100).required(),
		abbr: Joi.string().trim().max(20),
		type: Joi.valid(ENTITY_TYPES),
		category: Joi.valid(10, 20, 30, 40, 50, 60, 70, 80, 90),
		region: Joi.string().trim().length(2).lowercase()
	}).invalid(null, '')
};

// var ACTIONS = {
// 	// CREATE_GLOBAL_ENTITY: 'create_global_entity',
// 	// UPDATE_GLOBAL_ENTITY: 'update_global_entity',
// 	CREATE_ENTITY: 'create_entity',
// 	UPDATE_ENTITY: 'update_entity',
// 	ADD_ENTITY_NAME: 'add_entity_name',
// 	REMOVE_ENTITY_NAME: 'remove_entity_name'
// };

// var ACTION_NAMES = [
// 	// 'create_global_entity',
// 	// 'update_global_entity',
// 	'create_entity',
// 	'update_entity',
// 	'add_entity_name',
// 	'remove_entity_name'
// ];

// var ActionSchema = {
// 	id: Joi.string().trim().length(32).lowercase().required(),
// 	// md5 (COUNTRY_LANGUAGE_UNIQUENAME):
// 	// id: Joi.string().trim().length(32).lowercase().required(),
// 	type: Joi.string().valid(ACTION_NAMES).required(),

// 	entityId: Joi.number().integer(),
// 	entityNameKey: Joi.string().length(32),
// 	lang: Joi.string().trim().length(2).lowercase().required(),
// 	country: Joi.string().trim().length(2).lowercase().required(),
// 	// ro_md, en_us, en_in
// 	culture: Joi.string().trim().length(5).lowercase().required(),
// 	// parentActionId: Joi.string().trim().length(36).lowercase(),
// 	status: Joi.valid('new', 'done', 'error').default('new').required(),
// 	// CULTURE_STATUS: ro_md_new, en_in_done
// 	statusKey: Joi.string().trim().min(8).max(16).lowercase().required(),

// 	executedByMemberId: Joi.string().trim().lowercase().min(1).max(40),
// 	executedByMemberName: Joi.string().trim().min(3).max(40),

// 	resultInfo: Joi.string().trim().max(400),
// 	dataHash: Joi.string().trim().length(32).required(),
// 	data: Joi.alternatives()
// 		.when('type', {
// 			is: ACTIONS.CREATE_ENTITY,
// 			then: BasicEntitySchema
// 		})
// 		.when('type', {
// 			is: ACTIONS.UPDATE_ENTITY,
// 			then: UpdateEntitySchema
// 		})
// 		.when('type', {
// 			is: ACTIONS.ADD_ENTITY_NAME,
// 			then: Joi.object().keys({
// 				entityId: Joi.number().integer().required(),
// 				// md5 (COUNTRY_LANGUAGE_UNIQUENAME)
// 				key: Joi.string().trim().length(32).required(),
// 				name: Joi.string().trim().min(2).max(200).required(),
// 				// unique name
// 				uniqueName: Joi.string().trim().min(2).max(200).required(),
// 				type: Joi.valid(ENTITY_NAME_TYPES).required()
// 			})
// 		})
// 		.when('type', {
// 			is: ACTIONS.REMOVE_ENTITY_NAME,
// 			then: Joi.object().keys({
// 				entityId: Joi.number().integer().required(),
// 				// md5 (COUNTRY_LANGUAGE_UNIQUENAME)
// 				key: Joi.string().trim().length(32).required()
// 			})
// 		})
// 		.required()
// };

exports.EntitySchema = EntitySchema;
exports.UpdateEntitySchema = UpdateEntitySchema;
exports.EntityNameSchema = EntityNameSchema;
exports.UpdateEntityNameSchema = UpdateEntityNameSchema;
exports.ENTITY_NAME_TYPE = ENTITY_NAME_TYPE;
