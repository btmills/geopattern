import assign from 'object.assign';
import XMLNode from './xmlnode';

export default class SVG {
	constructor() {
		this.width = 100;
		this.height = 100;
		this.svg = new XMLNode('svg');
		this.context = []; // Track nested nodes
		this.setAttributes(this.svg, {
			xmlns: 'http://www.w3.org/2000/svg',
			width: this.width,
			height: this.height
		});
	}

	// This is a hack so groups work.
	currentContext() {
		return this.context[this.context.length - 1] || this.svg;
	}

	// This is a hack so groups work.
	end() {
		this.context.pop();
	}

	currentNode() {
		var context = this.currentContext();
		return context.lastChild || context;
	}

	newChild(type) {
		let child = new XMLNode(type);
		this.currentContext().appendChild(child);
		return child;
	}

	transform(transformations) {
		this.currentNode().setAttribute('transform',
			Object.keys(transformations).map(transformation => {
				let args = transformations[transformation].join(',');
				return `${transformation}(${args})`;
			}).join(' ')
		);

		return this;
	}

	setAttributes(el, attrs) {
		Object.keys(attrs).forEach(attr => {
			el.setAttribute(attr, attrs[attr]);
		});
	}

	setWidth(width) {
		this.svg.setAttribute('width', Math.floor(width));
	}

	setHeight(height) {
		this.svg.setAttribute('height', Math.floor(height));
	}

	toString() {
		return this.svg.toString();
	}

	rect(x, y, width, height, args) {
		// Accept an array as the first argument
		if (Array.isArray(x)) {
			x.forEach(r => { this.rect(...r); });
		} else {

			let rect = this.newChild('rect');
			this.setAttributes(rect, assign({
				x, y, width, height
			}, args));

		}

		return this;
	}

	circle(cx, cy, r, args) {
		let circle = this.newChild('circle');
		this.setAttributes(circle, assign({ cx, cy, r }, args));

		return this;
	}

	path(str, args) {
		let path = this.newChild('path');
		this.setAttributes(path, assign({ d: str }, args));

		return this;
	}

	polyline(points, args) {
		// Accept an array as the first argument
		if (Array.isArray(points)) {
			points.forEach(s => { this.polyline(s, args); });
		} else {

			let polyline = this.newChild('polyline');
			this.setAttributes(polyline, assign({ points }, args));

		}

		return this;
	}

	// Group and context are hacks
	group(args = {}) {
		let g = this.newChild('g');
		this.context.push(g);
		this.setAttributes(g, args);

		return this;
	}
};
