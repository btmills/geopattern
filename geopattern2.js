/*global jQuery */

(function ($) {

'use strict';

var Pattern = require('./lib/pattern');

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
		if (string === null || string === undefined) {
			string = (new Date()).toString();
		}
		if (!options) {
			options = {};
		}

		cb.call(this, string, options);
	};
}

if ($) {

	// If jQuery, add plugin
	$.fn.geopattern = optArgs(function (string, options) {
		return this.each(function () {
			var titleSha = $(this).attr('data-title-sha');
			if (titleSha) {
				options = $.extend({
					hash: titleSha
				}, options);
			}
			var pattern = new Pattern(string, options);
			$(this).css('background-image', pattern.toDataUrl());
			console.log(pattern);
			console.log(pattern.toString());
			//console.log(pattern.toDataUrl());
		});
	});

} else {

	// If no jQuery, register global
	window.GeoPattern = {
		generate: optArgs(function (string, options) {
			return new Pattern(string, options);
		})
	};

}

}(jQuery));
