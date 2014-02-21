'use strict';

var Crypto = require('crypto');
var Color  = require('color');
var extend = require('extend');
var SVG    = require('./svg');



var DEFAULTS = {
	baseColor: '#933c3c'
};

var PATTERNS = [
	'octogons',
	'overlappingCircles',
	'plusSigns',
	'xes',
	'sineWaves',
	'hexagons',
	'overlappingRings',
	'plaid',
	'triangles',
	'squares',
	'concentricCircles',
	'diamonds',
	'tessellation',
	'nestedSquares',
	'mosaicSquares',
	'trianglesRotated',
	'chevrons'
];

var FILL_COLOR_DARK  = '#222';
var FILL_COLOR_LIGHT = '#ddd';
var STROKE_COLOR     = '#000';
var STROKE_OPACITY   = 0.02;
var OPACITY_MIN      = 0.02;
var OPACITY_MAX      = 0.15;



// Helpers

function SHA1(str) {
	var shasum = Crypto.createHash('sha1');
	shasum.update(str);
	return shasum.digest('hex');
}

/**
 * Extract a substring from a hex string and parse it as an integer
 * @param {string} hash - Source hex string
 * @param {number} index - Start index of substring
 * @param {number} [length] - Length of substring. Defaults to 1.
 */
function hexVal(hash, index, len) {
	return parseInt(hash.substr(index, len || 1), 16);
}

/*
 * Re-maps a number from one range to another
 * http://processing.org/reference/map_.html
 */
function map(value, vMin, vMax, dMin, dMax) {
	var vValue = parseFloat(value);
	var vRange = vMax - vMin;
	var dRange = dMax - dMin;

	return (vValue - vMin) * dRange / vRange + dMin;
}

function fillColor(val) {
	return (val % 2 === 0) ? FILL_COLOR_LIGHT : FILL_COLOR_DARK;
}

function fillOpacity(val) {
	return map(val, 0, 15, OPACITY_MIN, OPACITY_MAX);
}



var Pattern = module.exports = function (string, options) {
	this.opts = extend({}, DEFAULTS, options);
	this.hash = options.hash || SHA1(string);
	this.svg = new SVG();

	this.generateBackground();
	this.generatePattern();

	return this;
};

Pattern.prototype.toSvg = function () {
	return this.svg.toString();
};

Pattern.prototype.toString = function () {
	return this.toSvg();
};

Pattern.prototype.toBase64 = function () {
	return window.btoa(this.toSvg());
};

Pattern.prototype.toDataUri = function () {
	return 'data:image/svg+xml;base64,' + this.toBase64();
};

Pattern.prototype.toDataUrl = function () {
	return 'url("' + this.toDataUri() + '")';
};

Pattern.prototype.generateBackground = function () {
	var hueOffset = map(hexVal(this.hash, 14, 3), 0, 4095, 0, 359);
	var satOffset = hexVal(this.hash, 17, 1);
	var baseColor = Color(this.opts.baseColor);

	baseColor.rotate(-hueOffset);

	if (satOffset % 2 === 0) {
		baseColor.saturation(baseColor.saturation() + satOffset);
	} else {
		baseColor.saturation(baseColor.saturation() - satOffset);
	}

	this.svg.rect(0, 0, '100%', '100%', {
		fill: baseColor.rgbString()
	});
};

Pattern.prototype.generatePattern = function () {
	var generator = this.opts.generator;

	if (generator) {
		if (PATTERNS.indexOf(generator) < 0) {
			throw new Error('The generator '
				+ generator
				+ ' does not exist.');
		}
	} else {
		generator = PATTERNS[hexVal(this.hash, 20)];
	}

	return this['geo' + generator.slice(0, 1).toUpperCase() + generator.slice(1)]();
};

function buildHexagonShape(sideLength) {
	var c = sideLength;
	var a = c / 2;
	var b = Math.sin(60 * Math.PI / 180) * c;
	return [
		0, b,
		a, 0,
		a + c, 0,
		2 * c, b,
		a + c, 2 * b,
		a, 2 * b,
		0, b
	].join(',');
}

Pattern.prototype.geoHexagons = function () {
	var scale      = hexVal(this.hash, 0);
	var sideLength = map(scale, 0, 15, 8, 60);
	var hexHeight  = sideLength * Math.sqrt(3);
	var hexWidth   = sideLength * 2;
	var hex        = buildHexagonShape(sideLength);
	var dy, fill, i, opacity, styles, val, x, y;

	this.svg.setWidth(hexWidth * 3 + sideLength * 3);
	this.svg.setHeight(hexHeight * 6);

	i = 0;
	for (y = 0; y < 6; y++) {
		for (x = 0; x < 6; x++) {
			val     = hexVal(this.hash, i);
			dy      = x % 2 === 0 ? y * hexHeight : y * hexHeight + hexHeight / 2;
			opacity = fillOpacity(val);
			fill    = fillColor(val);

			styles = {
				fill: fill,
				'fill-opacity': opacity,
				stroke: STROKE_COLOR,
				'stroke-opacity': STROKE_OPACITY
			};

			this.svg.polyline(hex, extend({}, styles, {
				transform: 'translate(' + [
					x * sideLength * 1.5 - hexWidth / 2,
					dy - hexHeight / 2
				] + ')'
			}));

			// Add an extra one at top-right, for tiling.
			if (x === 0) {
				this.svg.polyline(hex, extend({}, styles, {
					transform: 'translate(' + [
						6 * sideLength * 1.5 - hexWidth / 2,
						dy - hexHeight / 2
					] + ')'
				}));
			}

			// Add an extra row at the end that matches the first row, for tiling.
			if (y === 0) {
				dy = x % 2 === 0 ? 6 * hexHeight : 6 * hexHeight + hexHeight / 2;
				this.svg.polyline(hex, extend({}, styles, {
					transform: 'translate(' + [
						x * sideLength * 1.5 - hexWidth / 2,
						dy - hexHeight / 2
					] + ')'
				}));
			}

			// Add an extra one at bottom-right, for tiling.
			if (x === 0 && y === 0) {
				this.svg.polyline(hex, extend({}, styles, {
					transform: 'translate(' + [
						6 * sideLength * 1.5 - hexWidth / 2,
						5 * hexHeight + hexHeight / 2
					] + ')'
				}));
			}

			i++;
		}
	}
};

Pattern.prototype.geoSineWaves = function () {
	var period    = Math.floor(map(hexVal(this.hash, 0), 0, 15, 100, 400));
	var amplitude = Math.floor(map(hexVal(this.hash, 1), 0, 15, 30, 100));
	var waveWidth = Math.floor(map(hexVal(this.hash, 2), 0, 15, 3, 30));
	var fill, i, opacity, str, styles, val, xOffset;

	this.svg.setWidth(period);
	this.svg.setHeight(waveWidth * 36);

	for (i = 0; i < 36; i++) {
		val     = hexVal(this.hash, i);
		opacity = fillOpacity(val);
		fill    = fillColor(val);
		xOffset = period / 4 * 0.7;

		styles = {
			fill: 'none',
			stroke: fill,
			opacity: opacity,
			'stroke-width': '' + waveWidth + 'px'
		};

		str = 'M0 ' + amplitude +
			' C ' + xOffset + ' 0, ' + (period / 2 - xOffset) + ' 0, ' + (period / 2) + ' ' + amplitude +
			' S ' + (period - xOffset) + ' ' + (amplitude * 2) + ', ' + period + ' ' + amplitude +
			' S ' + (period * 1.5 - xOffset) + ' 0, ' + (period * 1.5) + ', ' + amplitude;

		this.svg.path(str, extend({}, styles, {
			transform: 'translate(' + [
				-period / 4,
				waveWidth * i - amplitude * 1.5
			] + ')'
		}));
		this.svg.path(str, extend({}, styles, {
			transform: 'translate(' + [
				-period / 4,
				waveWidth * i - amplitude * 1.5 + waveWidth * 36
			] + ')'
		}));
	}
};

function buildChevronShape(width, height) {
	var e = height * 0.66;
	return [
		[
			0, 0,
			width / 2, height - e,
			width / 2, height,
			0, e,
			0, 0
		],
		[
			width / 2, height - e,
			width, 0,
			width, e,
			width / 2, height,
			width / 2, height - e
		]
	].map(function (x) { return x.join(','); });
}

Pattern.prototype.geoChevrons = function () {
	console.log('CHEVRONS');
	var chevronWidth  = map(hexVal(this.hash, 0), 0, 15, 30, 80);
	var chevronHeight = map(hexVal(this.hash, 0), 0, 15, 30, 80);
	var chevron       = buildChevronShape(chevronWidth, chevronHeight);
	var fill, i, opacity, styles, val, x, y;

	this.svg.setWidth(chevronWidth * 6);
	this.svg.setHeight(chevronHeight * 6 * 0.66);

	i = 0;
	for (y = 0; y < 6; y++) {
		for (x = 0; x < 6; x++) {
			val     = hexVal(this.hash, i);
			opacity = fillOpacity(val);
			fill    = fillColor(val);

			styles = {
				stroke: STROKE_COLOR,
				'stroke-opacity': STROKE_OPACITY,
				fill: fill,
				'fill-opacity': opacity,
				'stroke-width': 1
			};

			this.svg.group(extend({}, styles, {
				transform: 'translate(' + [
					x * chevronWidth,
					y * chevronHeight * 0.66 - chevronHeight / 2
				] + ')'
			})).polyline(chevron).end();

			// Add an extra row at the end that matches the first row, for tiling.
			if (y === 0) {
				this.svg.group(extend({}, styles, {
					transform: 'translate(' + [
						x * chevronWidth,
						6 * chevronHeight * 0.66 - chevronHeight / 2
					] + ')'
				})).polyline(chevron).end();
			}

			i += 1;
		}
	}
};

function buildPlusShape(squareSize) {
	return [
		[squareSize, 0, squareSize, squareSize * 3],
		[0, squareSize, squareSize * 3, squareSize]
	];
}

Pattern.prototype.geoPlusSigns = function () {
	var squareSize = map(hexVal(this.hash, 0), 0, 15, 10, 25);
	var plusSize   = squareSize * 3;
	var plusShape  = buildPlusShape(squareSize);
	var dx, fill, i, opacity, styles, val, x, y;

	this.svg.setWidth(squareSize * 12);
	this.svg.setHeight(squareSize * 12);

	i = 0;
	for (y = 0; y < 6; y++) {
		for (x = 0; x < 6; x++) {
			val     = hexVal(this.hash, i);
			opacity = fillOpacity(val);
			fill    = fillColor(val);
			dx      = (y % 2 === 0) ? 0 : 1;

			styles = {
				fill: fill,
				stroke: STROKE_COLOR,
				'stroke-opacity': STROKE_OPACITY,
				'fill-opacity': opacity
			};

			this.svg.group(extend({
				transform: 'translate(' + [
					x * plusSize - x * squareSize + dx * squareSize - squareSize,
					y * plusSize - y * squareSize - plusSize / 2
				] + ')'
			}, styles)).rect(plusShape).end();

			// Add an extra column on the right for tiling.
			if (x === 0) {
				this.svg.group(extend({
					transform: 'translate(' + [
						4 * plusSize - x * squareSize + dx * squareSize - squareSize,
						y * plusSize - y * squareSize - plusSize / 2
					] + ')'
				}, styles)).rect(plusShape).end();
			}

			// Add an extra row on the bottom that matches the first row, for tiling
			if (y === 0) {
				this.svg.group(extend({
					transform: 'translate(' + [
						x * plusSize - x * squareSize + dx * squareSize - squareSize,
						4 * plusSize - y * squareSize - plusSize / 2
					] + ')'
				}, styles)).rect(plusShape).end();
			}

			// Add an extra one at top-right and bottom-right, for tiling
			if (x === 0 && y === 0) {
				this.svg.group(extend({
					transform: 'translate(' + [
						4 * plusSize - x * squareSize + dx * squareSize - squareSize,
						4 * plusSize - y * squareSize - plusSize / 2
					] + ')'
				}, styles)).rect(plusShape).end();
			}

			i++;
		}
	}
};

Pattern.prototype.geoXes = function () {
	var squareSize = map(hexVal(this.hash, 0), 0, 15, 10, 25);
	var xShape     = buildPlusShape(squareSize);
	var xSize      = squareSize * 3 * 0.943;
	var dy, fill, i, opacity, styles, val, x, y;

	this.svg.setWidth(xSize * 3);
	this.svg.setHeight(xSize * 3);

	i = 0;
	for (y = 0; y < 6; y++) {
		for (x = 0; x < 6; x++) {
			val     = hexVal(this.hash, i);
			opacity = fillOpacity(val);
			dy      = x % 2 === 0 ? y * xSize - xSize * 0.5 : y * xSize - xSize * 0.5 + xSize / 4;
			fill    = fillColor(val);

			styles = {
				fill: fill,
				opacity: opacity
			};

			this.svg.group(extend({
				transform: 'translate(' + [
					x * xSize / 2 - xSize / 2,
					dy - y * xSize / 2
				] + ') rotate(' + [
					45,
					xSize / 2,
					xSize / 2
				] + ')'
			}, styles)).rect(xShape).end();

			// Add an extra column on the right for tiling.
			if (x === 0) {
				this.svg.group(extend({
					transform: 'translate(' + [
						6 * xSize / 2 - xSize / 2,
						dy - y * xSize / 2
					] + ') rotate(' + [
						45,
						xSize / 2,
						xSize / 2
					] + ')'
				}, styles)).rect(xShape).end();
			}

			// // Add an extra row on the bottom that matches the first row, for tiling.
			if (y === 0) {
				dy = x % 2 === 0 ? 6 * xSize - xSize / 2 : 6 * xSize - xSize / 2 + xSize / 4;
				this.svg.group(extend({
					transform: 'translate(' + [
						x * xSize / 2 - xSize / 2,
						dy - 6 * xSize / 2
					] + ') rotate(' + [
						45,
						xSize / 2,
						xSize / 2
					] + ')'
				}, styles)).rect(xShape).end();
			}

			// These can hang off the bottom, so put a row at the top for tiling.
			if (y === 5) {
				this.svg.group(extend({
					transform: 'translate(' + [
						x * xSize / 2 - xSize / 2,
						dy - 11 * xSize / 2
					] + ') rotate(' + [
						45,
						xSize / 2,
						xSize / 2
					] + ')'
				}, styles)).rect(xShape).end();
			}

			// Add an extra one at top-right and bottom-right, for tiling
			if (x === 0 && y === 0) {
				this.svg.group(extend({
					transform: 'translate(' + [
						6 * xSize / 2 - xSize / 2,
						dy - 6 * xSize / 2
					] + ') rotate(' + [
						45,
						xSize / 2,
						xSize / 2
					] + ')'
				}, styles)).rect(xShape).end();
			}
			i++;
		}
	}
};

Pattern.prototype.geoOverlappingCircles = function () {
	var scale    = hexVal(this.hash, 1);
	var diameter = map(scale, 0, 15, 25, 200);
	var radius   = diameter / 2;
	var circle, fill, i, opacity, styles, val, x, y;

	this.svg.setWidth(radius * 6);
	this.svg.setHeight(radius * 6);

	i = 0;
	for (y = 0; y < 6; y++) {
		for (x = 0; x < 6; x++) {
			val     = hexVal(this.hash, i);
			opacity = fillOpacity(val);
			fill    = fillColor(val);

			styles = {
				fill: fill,
				opacity: opacity
			};

			this.svg.circle(x * radius, y * radius, radius, styles);

			// Add an extra one at top-right, for tiling.
			if (x === 0) {
				this.svg.circle(6 * radius, y * radius, radius, styles);
			}

			// // Add an extra row at the end that matches the first row, for tiling.
			if (y === 0) {
				this.svg.circle(x * radius, 6 * radius, radius, styles);
			}

			// // Add an extra one at bottom-right, for tiling.
			if (x === 0 && y === 0) {
				this.svg.circle(6 * radius, 6 * radius, radius, styles);
			}

			i++;
		}
	}
};
