import Pattern from './pattern';
import { hexVal, fillOpacity, fillColor, map } from './util';

export default class SineWaves extends Pattern {
	constructor(string, options) {
		super(string, options);
	}

	generate() {
		let period    = Math.floor(map(hexVal(this.hash, 0), 0, 15, 100, 400)),
		    amplitude = Math.floor(map(hexVal(this.hash, 1), 0, 15, 30, 100)),
		    waveWidth = Math.floor(map(hexVal(this.hash, 2), 0, 15, 3, 30)),
		    fill, i, opacity, str, styles, val, xOffset;

		this.svg.setWidth(period);
		this.svg.setHeight(waveWidth * 36);

		for (let i = 0; i < 36; i++) {
			let val     = hexVal(this.hash, i),
			    opacity = fillOpacity(val),
			    fill    = fillColor(val),
			    xOffset = period / 4 * 0.7,
			    styles = {
			    	fill: 'none',
			    	stroke: fill,
			    	opacity,
			    	'stroke-width': `${waveWidth}px`
			    },
			    str = [
			    	`M0 ${amplitude}`,
			    	`C ${xOffset} 0, ${period / 2 - xOffset)} 0, ${period / 2)} ${amplitude}`,
			    	`S ${period - xOffset} ${amplitude * 2}, ${period} ${amplitude}`,
			    	`S ${period * 1.5 - xOffset} 0, ${period * 1.5}, ${amplitude}`
			    ].join(' ');

			this.svg.path(str, styles).transform({
				translate: [
					-period / 4,
					waveWidth * i - amplitude * 1.5
				]
			});
			this.svg.path(str, styles).transform({
				translate: [
					-period / 4,
					waveWidth * i - amplitude * 1.5 + waveWidth * 36
				]
			});
		}
	}
}
