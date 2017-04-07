
const Joi = require('joi');
import { _, Promise } from '../utils';
import { UpdateEntityNamesSchema, EntityNamesSchema } from './schemas';

function normalizeCreate(entity) {
	return entity;
}

function normalizeUpdate(entity) {
	return entity;
}

function validateCreate(data) {

}

function validateUpdate(data) {

}

export function beforeCreate(data, next) {
	try {
		data = normalizeCreate(data);
		validateCreate(data);
		data = _.pick(data, Object.keys(EntityNamesSchema));
		// const result = Joi.validate(data, EntityNamesSchema, { convert: true, allowUnknown: false, stripUnknown: true });
		// if (result.error) {
		// 	return next(result.error);
		// }
		// data = result.value;
	} catch (e) {
		return next(e);
	}
	next(null, data);
}

export function beforeUpdate(data, next) {
	try {
		data = normalizeUpdate(data);
		validateUpdate(data);
		data = _.pick(data, Object.keys(UpdateEntityNamesSchema));
		const result = Joi.validate(data, UpdateEntityNamesSchema, { convert: true, allowUnknown: false, stripUnknown: true });
		if (result.error) {
			return next(result.error);
		}
		data = result.value;
	} catch (e) {
		return next(e);
	}
	next(null, data);
}
