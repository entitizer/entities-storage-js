'use strict';

var Data = require('./common/data');
if (!Data) {
	return;
}
var Entity = Data.Entity;
var EntityName = Data.EntityName;

var assert = require('assert');

describe('models', function() {

	describe('EntityName', function() {
		it('#normalize', function() {
			assert.throws(function() {
				EntityName.normalize();
			});
			assert.throws(function() {
				EntityName.normalize({
					name: 'NaMe'
				});
			});
			assert.throws(function() {
				EntityName.normalize({
					name: 'NaMe'
				}, 'ro');
			});
			assert.throws(function() {
				EntityName.normalize({
					name: 'NaMe'
				}, 'roo', 'ro');
			});
			assert.throws(function() {
				EntityName.normalize({
					name: 'NaMe'
				}, null, 'ro');
			});

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
