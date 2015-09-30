'use strict';

var utils = require('./utils');
var _ = utils._;
var atonic = utils.atonic;
var slug = utils.slug;
var md5 = utils.md5;
var assert = require('assert');
var TopicName = require('./topic_name');

function createSlug(name) {
	assert.ok(name);
	name = atonic(name.toLowerCase());

	return slug(name);
}

function createKey(data) {
	assert.ok(data);
	assert.ok(data.slug);
	assert.ok(data.country);
	assert.ok(data.lang);

	return md5([data.country.toLowerCase(), data.lang.toLowerCase(), data.slug.toLowerCase()].join('_'));
}

function normalize(data) {
	var topic = _.cloneDeep(data);
	topic.lang = topic.lang.toLowerCase();
	topic.country = topic.country.toLowerCase();
	topic.name = topic.name.trim();
	topic.atonicName = topic.atonicName || atonic(topic.name);
	if (topic.name === topic.atonicName) {
		delete topic.atonicName;
	}
	if (topic.abbr) {
		topic.abbr = topic.abbr.trim();
	}

	topic.slug = topic.slug || createSlug(topic.name);
	topic.key = topic.key || createKey(topic);

	var names = [];
	var keys = {};

	for (var i = 0; i < 60 && i < topic.names.length; i++) {
		var name = topic.names[i];
		if (names.length === 50) {
			break;
		}
		var lname = name.name.trim().toLowerCase();
		if (keys[lname]) {
			continue;
		}
		keys[lname] = true;
		TopicName.normalize(name, topic.country, topic.lang);
		names.push(name);
	}

	topic.names = names;

	if (topic.description) {
		topic.description = _.trunc(topic.description.trim(), 400);
	}

	return topic;
}

exports.createKey = createKey;
exports.createSlug = createSlug;
exports.normalize = normalize;
