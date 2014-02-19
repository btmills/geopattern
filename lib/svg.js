'use strict';

var extend = require('extend');

module.exports = SVG;

function SVG() {
	this.width = 100;
	this.height = 100;
	this.svg = document.createElement('svg');
	this.setAttributes(this.svg, {
		xmlns: 'http://www.w3.org/2000/svg',
		width: this.width,
		height: this.height
	});

	return this;
}

SVG.prototype.setAttributes = function (el, attrs) {
	Object.keys(attrs).forEach(function (attr) {
		el.setAttribute(attr, attrs[attr]);
	});
};

SVG.prototype.setWidth = function (width) {
	this.svg.setAttribute('width', Math.floor(width));
};

SVG.prototype.setHeight = function (height) {
	this.svg.setAttribute('height', Math.floor(height));
};

SVG.prototype.toString = function () {
	return this.svg.outerHTML;
};

SVG.prototype.rect = function (x, y, width, height, args) {
	var rect = document.createElement('rect');
	this.svg.appendChild(rect);
	this.setAttributes(rect, extend({
		x: x,
		y: y,
		width: width,
		height: height
	}, args));

	return rect;
};

SVG.prototype.circle = function (cx, cy, r, args) {
	var circle = document.createElement('circle');
	this.svg.appendChild(circle);
	this.setAttributes(circle, extend({
		cx: cx,
		cy: cy,
		r: r
	}, args));

	return circle;
};

SVG.prototype.path = function (str, args) {
	var path = document.createElement('path');
	this.svg.appendChild(path);
	this.setAttributes(path, extend({
		d: str
	}, args));

	return path;
};

SVG.prototype.polyline = function (str, args) {
	var polyline = document.createElement('polyline');
	this.svg.appendChild(polyline);
	this.setAttributes(polyline, extend({
		points: str
	}, args));

	return polyline;
};
