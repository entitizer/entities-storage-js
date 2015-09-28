'use strict';

var CATEGORIES = [{
	id: 10,
	name: 'politics',
	en: 'Politics',
	ro: 'Politic',
	ru: 'Политика',
	bg: 'Политика',
	hu: 'Politika',
	cs: 'Politika',
	it: 'Politica',
	pl: 'Polityka'
}, {
	id: 70,
	name: 'live',
	en: 'Live',
	ro: 'Social',
	ru: 'Общество',
	bg: 'Общество',
	hu: 'Társadalom',
	cs: 'Život',
	it: 'Sociale',
	pl: 'Społeczeństwo'
}, {
	id: 20,
	name: 'business',
	en: 'Business',
	ro: 'Business',
	ru: 'Бизнес',
	bg: 'Бизнес',
	hu: 'Gazdaság',
	cs: 'Business',
	it: 'Affari',
	pl: 'Biznes'
}, {
	id: 30,
	name: 'entertainment',
	en: 'Entertainment',
	ro: 'Divertisment',
	ru: 'Развлечение',
	bg: 'Забавление',
	hu: 'Szórakozás',
	cs: 'Zábava',
	it: 'Intrattenimento',
	pl: 'Rozrywka'
}, {
	id: 40,
	name: 'sports',
	en: 'Sports',
	ro: 'Sport',
	ru: 'Спорт',
	bg: 'Спортен',
	hu: 'Sport',
	cs: 'Sport',
	it: 'Sport',
	pl: 'Sport'
}, {
	id: 50,
	name: 'tech',
	en: 'Tech',
	ro: 'Tehnică',
	ru: 'Технологии',
	bg: 'Технологии',
	hu: 'Tech',
	cs: 'Technika',
	it: 'Tecnologia',
	pl: 'Tech'
}, {
	id: 60,
	name: 'science',
	en: 'Science',
	ro: 'Știință',
	ru: 'Наука',
	bg: 'Наука',
	hu: 'Tudomány',
	cs: 'Věda',
	it: 'Scienza',
	pl: 'Nauka'
}, {
	id: 80,
	name: 'arts',
	en: 'Arts',
	ro: 'Cultură',
	ru: 'Культура',
	bg: 'Изкуство',
	hu: 'Kultúra',
	cs: 'Kultura',
	it: 'Cultura',
	pl: 'Kultura'
}, {
	id: 90,
	name: 'justice',
	en: 'Justice',
	ro: 'Justiție',
	ru: 'Юстиция',
	bg: 'Съдия',
	hu: 'Igazságügy',
	cs: 'Právo',
	it: 'Giustizia',
	pl: 'Sprawiedliwość'
}];

function find(collection, name, value) {
	var el;
	for (var i = collection.length - 1; i >= 0; i--) {
		el = collection[i];
		if (el[name] === value) {
			return el;
		}
	}
}

exports.all = exports.categories = function() {
	return CATEGORIES;
};

exports.category = function(id) {
	var name = 'name';
	if (typeof id === 'number') {
		name = 'id';
	}
	return find(CATEGORIES, name, id);
};
