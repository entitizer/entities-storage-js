/*eslint no-unused-vars:1*/

'use strict';

var Model = require('../lib/model');
var EntityNameKey = require('../lib/entity_name_key');
var EntityName = require('../lib/entity_name');
var Entity = require('../lib/entity');
var assert = require('assert');

// var Joi = require('joi');
// console.log(Joi.string().trim().length(32).lowercase().required().invalid('a'));

describe('models', function() {

	describe('Model', function() {
		it('#create a Model', function() {
			assert.throws(function() {
				var model = new Model();
			});
			assert.throws(function() {
				var model = new Model(null);
			});
			assert.throws(function() {
				var model = new Model(true);
			});
			assert.throws(function() {
				var model = new Model({
					name: null
				});
			});
			var model = new Model({
				name: 'model'
			}, {
				i: 1
			});
			assert.equal('model', model.config.name);
			assert.equal(1, model.getData().i);

			assert.throws(function() {
				model.validateCreating();
			});
		});
	});

	describe('EntityNameKey', function() {
		it('#create an EntityNameKey', function() {
			assert.throws(function() {
				var model = new EntityNameKey();
			});
			assert.throws(function() {
				var model = new EntityNameKey(null);
			});
			assert.throws(function() {
				var model = new EntityNameKey(true);
			});
			var model = new EntityNameKey({
				entityId: 1,
				name: 'me'
			});
			model.normalize();
			assert.equal('EntityNameKey', model.config.name);
			assert.equal(1, model.getData().entityId);
			assert.equal(undefined, model.getData().name);
		});
	});

	describe('EntityName', function() {
		it('#create an EntityName', function() {
			assert.throws(function() {
				var model = new EntityName();
			});
			var model = new EntityName({
				entityId: 1,
				name: 'me'
			});
			model.normalize('ro', 'md');
			assert.equal('EntityName', model.config.name);
			assert.equal(undefined, model.getData().entityId);
			assert.equal('me', model.getData().name);
		});

		it('#createUniqueName', function() {
			var name = 'Team-A F.C.';
			assert.equal('team a fc', EntityName.createUniqueName(name));

			name = 'T.Lastname';
			assert.equal('t lastname', EntityName.createUniqueName(name));

			name = 'Düsseldorf 29, Köln, Москва, 北京市, إسرائيل !@#$ «Барсело́на» :"șțÂĂîăâăă';
			assert.equal('dusseldorf 29 koln москва 北京市 إسرائيل барселона staaiaaaa', EntityName.createUniqueName(name));
		});
	});

	describe('Entity', function() {
		it('#create an Entity', function() {
			assert.throws(function() {
				var model = new Entity();
			});
			var model = new Entity({
				entityId: 1,
				name: 'me',
				lang: 'ro',
				country: 'ro'
			});
			model.normalize();
			assert.equal('Entity', model.config.name);
			assert.equal(undefined, model.getData().entityId);
			assert.equal('me', model.getData().name);
		});

		it('#createSlug', function() {
			var name = 'Team F.C.';
			assert.equal('team-fc', Entity.createSlug(name));

			name = 'Düsseldorf 29, Köln, Москва, 北京市, إسرائيل !@#$ «Барсело́на» Влади́мир Влади́мирович Пу́тин ☢☠☤☣☭☯☮☏☔☎☀★☂☃✈✉';
			assert.equal('dusseldorf-29-koln-moskva-barselona-vladimir-vladimirovich-putin', Entity.createSlug(name));

			name = 'Жанна Фриске';
			assert.equal('zhanna-friske', Entity.createSlug(name));
		});
	});
});
