'use strict';

var utils = require('entitizer.utils');
var _ = require('lodash');
var Promise = require('bluebird');
var slug = require('slug');
var crypto = require('crypto');
var atonic = require('atonic');

function sha1(value) {
	return crypto.createHash('sha1').update(value).digest('hex').toLowerCase();
}

function md5(value) {
	return crypto.createHash('md5').update(value).digest('hex').toLowerCase();
}

var local = {
	_: _,
	Promise: Promise,
	slug: slug,
	md5: md5,
	sha1: sha1,
	atonic: atonic
};

module.exports = _.assign({}, utils, local);
