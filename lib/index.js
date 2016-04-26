'use strict';

var Pattern = require('./pattern');

/*
 * Normalize arguments, if not given, to:
 * string: (new Date()).toString()
 * options: {}
 */
function optArgs(cb) {
	return function (string, options) {
		if (typeof string === 'object') {
			options = string;
			string = null;
		}

		if (string === null || typeof string === 'undefined') {
			string = (new Date()).toString();
		}

		if (!options) {
			options = {};
		}

		return cb.call(this, string, options);
	};
}

var GeoPattern = module.exports = {
	generate: optArgs(function (string, options) {
		return new Pattern(string, options);
	})
};

if (typeof jQuery !== 'undefined') { // If jQuery, add plugin
	jQuery.fn.geopattern = optArgs(function (string, options) {
		return this.each(function () {
			var titleSha = jQuery(this).attr('data-title-sha');

			if (titleSha) {
				options = jQuery.extend({
					hash: titleSha
				}, options);
			}

			var pattern = GeoPattern.generate(string, options);

			jQuery(this).css('background-image', pattern.toDataUrl());
		});
	});
}
