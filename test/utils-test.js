'use strict';

var utils = require('../lib/utils');
var strings = ['șșăîșă.ȘȚÎĂȘÂÎ;?:;:ÂÎȘ:,', 'русский Ё ё', 'pɔlʃt͡ẗʃɨ.zna górnołużycki'];

describe('utils', function() {
	it('atonic', function() {
		strings.forEach(function(s) {
			utils.atonic(s);
			// console.log(s);
			// console.log(utils.atonic(s));
			// console.log('========================');
		});
	});
});
