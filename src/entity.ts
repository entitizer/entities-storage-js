
import { _, Promise } from './utils';
import { UpdateEntitySchema } from './db/schemas';

export const normalizeCreate = function (entity) {
	entity = _.clone(entity);

	if (entity.description) {
		entity.description = _.trunc(entity.description.trim(), 200);
	}
	if (entity.extract) {
		entity.extract = _.trunc(entity.extract.trim(), 500);
	}

	if (_.isString(entity.createdAt)) {
		entity.createdAt = new Date(entity.createdAt);
	}
	if (_.isDate(entity.createdAt)) {
		entity.createdAt = entity.createdAt.getTime();
	}

	return entity;
};

export const normalizeUpdate = function (entity) {
	entity = _.clone(entity);

	if (entity.description) {
		entity.description = _.trunc(entity.description.trim(), 200);
	}
	if (entity.extract) {
		entity.extract = _.trunc(entity.extract.trim(), 500);
	}

	return entity;
};

export const validateCreate = function (data) {
	// if (data.englishWikiName && !data.englishWikiId || !data.englishWikiName && data.englishWikiId) {
	// 	throw new Error('An entity must have englishWikiId AND englishWikiName');
	// }
	// if (data.wikiName && !data.wikiId || !data.wikiName && data.wikiId) {
	// 	throw new Error('An entity must have wikiId AND wikiName');
	// }
	// if (data.englishWikiId && !data.wikiId) {
	// 	throw new Error('`englishWikiId` cannot be without `wikiId`');
	// }
};

export const validateUpdate = function (data) {
	if (data.lang) {
		throw new Error('lang` cannot be changed');
	}
	// if (data.englishWikiName && !data.englishWikiId) {
	// 	throw new Error('You cannot update englishWikiName without englishWikiId');
	// }
	// if (data.wikiName && !data.wikiId) {
	// 	throw new Error('You cannot update wikiName without wikiId');
	// }
};

export const EntityConfig = {
	name: 'Entitizer_Entity',
	updateSchema: UpdateEntitySchema,
	createNormalize: normalizeCreate,
	updateNormalize: normalizeUpdate,
	createValidate: validateCreate,
	updateValidate: validateUpdate
};
