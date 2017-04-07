
const Joi = require('joi');
const vogels = require('vogels');
import { EntityTypes } from 'entitizer.models';

const ENTITY_TYPES = [EntityTypes.EVENT, EntityTypes.LOCATION, EntityTypes.ORGANIZATION, EntityTypes.PERSON, EntityTypes.PRODUCT];
// var ENTITY_CATEGORIES = [10, 20, 30, 40, 50, 60, 70, 80, 90];

export const ENTITY_FIELDS = {
	id: 'id',
	lang: 'lang',
	wikiId: 'wikiId',
	name: 'name',
	abbr: 'abbr',
	description: 'description',
	wikiPageId: 'wikiPageId',
	aliases: 'aliases',
	extract: 'extract',
	wikiTitle: 'wikiTitle',
	wikiImage: 'wikiImage',
	type: 'type',
	types: 'types',
	cc2: 'cc2',
	rank: 'rank',
	data: 'data',
	createdAt: 'createdAt',
	updatedAt: 'uptatedAt'
}

export const EntitySchema = {
	id: Joi.string().regex(/^[A-Z]{2}Q\d+$/).required(),
	lang: Joi.string().regex(/^[A-Z]{2}$/).required(),
	wikiId: Joi.string().regex(/^Q\d+$/).required(),
	name: Joi.string().trim().max(200).required(),
	abbr: Joi.string().trim().max(20),
	description: Joi.string().trim().max(200),
	wikiPageId: Joi.number().integer(),
	aliases: vogels.types.stringSet(),
	extract: Joi.string().trim().max(500),
	wikiTitle: Joi.string().trim().max(200),
	enWikiTitle: Joi.string().trim().max(200),
	wikiImage: Joi.string().trim().max(200),
	type: Joi.valid(ENTITY_TYPES),
	types: vogels.types.stringSet(),
	cc2: Joi.string().trim().regex(/^[A-Z]{2}$/),
	rank: Joi.number().integer().min(1).required(),
	data: Joi.object(),

	createdAt: Joi.number().integer().required(),
	updatedAt: Joi.number().integer()
}

export const UpdateEntitySchema = {
	id: Joi.string().regex(/^[A-Z]{2}Q\d+$/).required(),
	updatedAt: Joi.number().integer().required(),
	// wikiId: Joi.string().regex(/^Q\d+$/).required(),
	name: Joi.string().trim().max(200).invalid(null, ''),
	abbr: Joi.string().trim().max(20),
	description: Joi.string().trim().max(200),
	wikiPageId: Joi.number().integer(),
	aliases: vogels.types.stringSet(),
	extract: Joi.string().trim().max(500),
	wikiTitle: Joi.string().trim().max(200),
	enWikiTitle: Joi.string().trim().max(200),
	wikiImage: Joi.string().trim().max(200),
	type: Joi.valid(ENTITY_TYPES).invalid(null, ''),
	types: vogels.types.stringSet(),
	cc2: Joi.string().trim().regex(/^[A-Z]{2}$/),
	rank: Joi.number().integer().min(1).invalid(null),
	data: Joi.object(),
}

export const ENTITY_NAMES_FIELDS = {
	entityId: 'entityId',
	names: 'names'
}

export const EntityNamesSchema = {
	entityId: Joi.string().regex(/^[A-Z]{2}Q\d+$/).required(),
	names: Joi.string().min(2).required()
}

export const UpdateEntityNamesSchema = {
	entityId: Joi.string().regex(/^[A-Z]{2}Q\d+$/).required(),
	names: Joi.string().min(2).required()
}
