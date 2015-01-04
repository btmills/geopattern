export default class XMLNode {
	constructor(tagName) {
		this.tagName = tagName;
		this.attributes = Object.create(null);
		this.children = [];
	}

	get lastChild() {
		return this.children[this.children.length - 1];
	}

	appendChild(child) {
		this.children.push(child);
	}

	setAttribute(name, value) {
		this.attributes[name] = value;
	}

	toString() {
		return [
			'<',
			this.tagName,
			Object.keys(this.attributes).map(attr =>
				` ${attr}="${this.attributes[attr]}"`
			).join(''),
			'>',
			this.children.map(child => child.toString()).join(''),
			'</',
			this.tagName,
			'>'
		].join('');
	}
}
