(function ($) {

/*global jQuery Snap */

'use strict';

$.fn.geopattern = function(options) {

	function getSnap() {
		var snap, svg;

		if ($('#geopattern-tmp').length) {
			snap = Snap('#geopattern-tmp');
		} else {
			svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			svg.id = 'geopattern-tmp';
			snap = Snap(svg);
		}
		return snap;

	}

	function map(value, vMin, vMax, dMin, dMax) {
		var vValue = parseFloat(value);
		var vRange = vMax - vMin;
		var dRange = dMax - dMin;

		return (vValue - vMin) * dRange / vRange + dMin;
	}

	function setBGColor(s, sha, container) {
		var hueOffset       = parseInt(sha.substr(14, 3), 16);
		var satOffset       = parseInt(sha.substr(17, 1), 16) / 100;
		var bgRGB           = Snap.getRGB('#933c3c');
		var mappedHueOffset = map(hueOffset, 0, 4095, 0, 1);
		var bgHSB           = Snap.rgb2hsb(bgRGB.r, bgRGB.g, bgRGB.b);

		bgHSB.h             = 1 - mappedHueOffset;

		if (satOffset % 2) {
			bgHSB.s += satOffset;
		} else {
			bgHSB.s -= satOffset;
		}
		$(container).css('background-color', Snap.hsb2rgb(bgHSB.h, bgHSB.s, bgHSB.b).hex);
	}

	function createHexagon(s, sideLength) {
		var c = sideLength;
		var a = c / 2;
		var b = Math.sin(Snap.rad(60)) * c;

		return s.polyline(0, b, a, 0, a + c, 0, 2 * c, b, a + c, 2 * b, a, 2 * b, 0, b);
	}

	function createPlus(s, squareSize) {
		var shape = s.group(
			s.rect(squareSize, 0, squareSize, squareSize * 3),
			s.rect(0, squareSize, squareSize * 3, squareSize)
		);

		shape.attr({
			opacity: 0
		});
		return shape;
	}

	function createTriangle(s, sideLength, height) {
		var halfWidth = sideLength / 2;
		return s.polyline(halfWidth, 0, sideLength, height, 0, height, halfWidth, 0);
	}

	function createDiamond(s, width, height) {
		return s.polyline(width / 2, 0, width, height / 2, width / 2, height, 0, height / 2);
	}

	function renderPattern(s, container) {
		var b64 = 'data:image/svg+xml;base64,' + window.btoa(s.toString());
		var url = 'url("' + b64 + '")';
		$(container).css('background-image', url);
	}

	function geoHexagons(s, sha) {
		var scale      = parseInt(sha.substr(1, 1), 16);
		var sideLength = map(scale, 0, 15, 5, 120);
		var hexHeight  = sideLength * Math.sqrt(3);
		var hexWidth   = sideLength * 2;
		var hex        = createHexagon(s, sideLength).attr({stroke: '#000', opacity:0});
		var dy, fill, i, opacity, tmpHex, val, x, y;

		s.node.setAttribute('width',  (hexWidth * 3) + (sideLength * 3));
		s.node.setAttribute('height', hexHeight * 6);

		i = 0;
		for (y = 0; y < 6; y++) {
			for (x = 0; x < 6; x++) {
				val     = parseInt(sha.substr(i, 1), 16);
				dy      = x % 2 === 0 ? y * hexHeight : y * hexHeight + hexHeight / 2;
				opacity = map(val, 0, 15, 0.02, 0.18);
				fill    = (val % 2 === 0) ? '#ddd' : '#222';
				tmpHex = hex.clone();
				tmpHex.attr({
					opacity: opacity,
					fill: fill,
					transform: 't' + [
						x * sideLength * 1.5 - hexWidth / 2,
						dy - hexHeight / 2
					]
				});

				// Add an extra one at top-right, for tiling.
				if (x === 0) {
					tmpHex = hex.clone();
					tmpHex.attr({
						opacity: opacity,
						fill: fill,
						transform: 't' + [
							6 * sideLength * 1.5 - hexWidth / 2,
							dy - hexHeight / 2
						]
					});
				}

				// Add an extra row at the end that matches the first row, for tiling.
				if (y === 0) {
					dy = x % 2 === 0 ? 6 * hexHeight : 6 * hexHeight + hexHeight / 2;
					tmpHex = hex.clone();
					tmpHex.attr({
						opacity: opacity,
						fill: fill,
						transform: 't' + [
							x * sideLength * 1.5 - hexWidth / 2,
							dy - hexHeight / 2
						]
					});
				}

				// Add an extra one at bottom-right, for tiling.
				if (x === 0 && y === 0) {
					tmpHex = hex.clone();
					tmpHex.attr({
						opacity: opacity,
						fill: fill,
						transform: 't' + [
							6 * sideLength * 1.5 - hexWidth / 2,
							5 * hexHeight + hexHeight / 2
						]
					});
				}
				i++;
			}
		}
	}

	function geoSineWaves(s, sha) {
		var period    = Math.floor(map(parseInt(sha.substr(1, 1), 16), 0, 15, 100, 400));
		var amplitude = Math.floor(map(parseInt(sha.substr(2, 1), 16), 0, 15, 30, 100));
		var waveWidth = Math.floor(map(parseInt(sha.substr(3, 1), 16), 0, 15, 3, 30));
		var fill, i, line, opacity, str, val, xOffset;

		s.node.setAttribute('width',  period);
		s.node.setAttribute('height', waveWidth * 36);

		for (i = 0; i < 36; i++) {
			val     = parseInt(sha.substr(i, 1), 16);
			fill    = (val % 2 === 0) ? '#ddd' : '#222';
			opacity = map(val, 0, 15, 0.02, 0.15);
			xOffset = period / 4 * 0.7;
			str = 'M0 ' + amplitude +
				' C ' + xOffset + ' 0, ' + (period / 2 - xOffset) + ' 0, ' + (period / 2) + ' ' + amplitude +
				' S ' + (period - xOffset) + ' ' + (amplitude * 2) + ', ' + period + ' ' + amplitude +
				' S ' + (period * 1.5 - xOffset) + ' 0, ' + (period * 1.5) + ', ' + amplitude;
			line = s.path(str);
			line.attr({
				fill: 'none',
				stroke: fill,
				opacity: opacity,
				'strokeWidth': waveWidth,
				transform: 't-' + period / 4 + ',' + (waveWidth * i - amplitude * 1.5)
			});
			line.clone();
			line.attr({
				transform: 't-' + period / 4 + ',' + (waveWidth * i - amplitude * 1.5 + waveWidth * 36)
			});
		}
	}

	function geoPlusSigns(s, sha) {
		var squareSize = map(parseInt(sha.substr(0, 1), 16), 0, 15, 10, 25);
		var plusSize   = squareSize * 3;
		var plusShape  = createPlus(s, squareSize);
		var dx, fill, i, opacity, plusTmp, val, x, y;

		s.node.setAttribute('width', squareSize * 12);
		s.node.setAttribute('height', squareSize * 12);

		i = 0;
		for (y = 0; y < 6; y++) {
			for (x = 0; x < 6; x++) {
				val     = parseInt(sha.substr(i, 1), 16);
				opacity = map(val, 0, 15, 0.02, 0.15);
				fill    = (val % 2 === 0) ? '#ddd' : '#222';
				dx      = (y % 2 === 0) ? 0 : 1;

				// opacity = 1 if x === 0

				plusTmp = plusShape.clone();
				plusTmp.attr({
					fill: fill,
					opacity: opacity,
					transform: 't' + [
						x * plusSize - x * squareSize + dx * squareSize - squareSize,
						y * plusSize - y * squareSize - plusSize / 2
					]
				});

				// Add an extra column on the right for tiling.
				if (x === 0) {
					plusTmp = plusShape.clone();
					plusTmp.attr({
						fill: fill,
						opacity: opacity,
						transform: 't' + [
							4 * plusSize - x * squareSize + dx * squareSize - squareSize,
							y * plusSize - y * squareSize - plusSize / 2
						]
					});
				}

				// Add an extra row on the bottom that matches the first row, for tiling
				if (y === 0) {
					plusTmp = plusShape.clone();
					plusTmp.attr({
						fill: fill,
						opacity: opacity,
						transform: 't' + [
							x * plusSize - x * squareSize + dx * squareSize - squareSize,
							4 * plusSize - y * squareSize - plusSize / 2
						]
					});
				}

				// Add an extra one at top-right and bottom-right, for tiling
				if (x === 0 && y === 0) {
					plusTmp = plusShape.clone();
					plusTmp.attr({
						fill: fill,
						opacity: opacity,
						transform: 't' + [
							4 * plusSize - x * squareSize + dx * squareSize - squareSize,
							4 * plusSize - y * squareSize - plusSize / 2
						]
					});
				}

				i++;
			}
		}
	}

	function geoXes(s, sha) {
		var squareSize = map(parseInt(sha.substr(0, 1), 16), 0, 15, 10, 25);
		var xShape     = createPlus(s, squareSize);
		var xSize      = squareSize * 3 * 0.943;
		var dy, fill, i, opacity, val, x, xTmp, y;

		s.node.setAttribute('width',  xSize * 3);
		s.node.setAttribute('height', xSize * 3.5);

		i = 0;
		for (y = 0; y < 6; y++) {
			for (x = 0; x < 6; x++) {
				val     = parseInt(sha.substr(i, 1), 16);
				opacity = map(val, 0, 15, 0.02, 0.15);
				dy      = x % 2 === 0 ? y * xSize - xSize * 0.5 : y * xSize - xSize * 0.5 + xSize / 4;
				fill    = (val % 2 === 0) ? '#ddd' : '#222';

				xTmp    = xShape.clone();
				xTmp.attr({
					fill: fill,
					opacity: opacity,
					transform: 't' + [
						x * xSize / 2 - xSize / 2,
						dy - y * xSize / 2
					] + 'r45,' + squareSize * 1.5 + ',' + squareSize * 1.5
				});

				// Add an extra one at top-right, for tiling.
				if (x === 0) {
					xTmp = xShape.clone();
					xTmp.attr({
						fill: fill,
						opacity: opacity,
						transform: 't' + [
							6 * xSize / 2 - xSize / 2,
							dy - y * xSize / 2
						] + 'r45,' + squareSize * 1.5 + ',' + squareSize * 1.5
					});
				}

				// // Add an extra row at the end that matches the first row, for tiling.
				if (y === 0) {
					dy = x % 2 === 0 ? 6 * xSize - xSize / 2 : 6 * xSize - xSize / 2 + xSize / 4;
					xTmp = xShape.clone();
					xTmp.attr({
						fill: fill,
						opacity: opacity,
						transform: 't' + [
							x * xSize / 2 - xSize / 2,
							dy - 6 * xSize / 2
						] + 'r45,' + squareSize * 1.5 + ',' + squareSize * 1.5
					});
				}

				// // // Add an extra one at bottom-right, for tiling.
				if (x === 0 && y === 0) {
					xTmp = xShape.clone();
					xTmp.attr({
						fill: fill,
						opacity: opacity,
						transform: 't' + [
							6 * xSize / 2 - xSize / 2,
							dy - 6 * xSize / 2
						] + 'r45,' + squareSize * 1.5 + ',' + squareSize * 1.5
					});
				}
				i++;
			}
		}
	}

	function geoOverlappingCircles(s, sha) {
		var scale    = parseInt(sha.substr(1, 1), 16);
		var diameter = map(scale, 0, 15, 20, 200);
		var radius   = diameter / 2;
		var circle, fill, i, opacity, val, x, y;

		s.node.setAttribute('width',  radius * 6);
		s.node.setAttribute('height', radius * 6);

		i = 0;
		for (y = 0; y < 6; y++) {
			for (x = 0; x < 6; x++) {
				val     = parseInt(sha.substr(i, 1), 16);
				opacity = map(val, 0, 15, 0.02, 0.1);
				fill    = (val % 2 === 0) ? '#ddd' : '#222';
				circle = s.circle(x * radius, y * radius, radius);
				circle.attr({
					fill: fill,
					opacity: opacity
				});

				// Add an extra one at top-right, for tiling.
				if (x === 0) {
					circle = s.circle(6 * radius, y * radius, radius);
					circle.attr({
						fill: fill,
						opacity: opacity
					});
				}

				// // Add an extra row at the end that matches the first row, for tiling.
				if (y === 0) {
					circle = s.circle(x * radius, 6 * radius, radius);
					circle.attr({
						fill: fill,
						opacity: opacity
					});
				}

				// // Add an extra one at bottom-right, for tiling.
				if (x === 0 && y === 0) {
					circle = s.circle(6 * radius, 6 * radius, radius);
					circle.attr({
						fill: fill,
						opacity: opacity
					});
				}
				i++;
			}
		}
	}

	function geoBricks(s, sha) {
		var squareSize = map(parseInt(sha.substr(0, 1), 16), 0, 15, 6, 60);
		var brickWidth = squareSize * 2;
		var gapSize    = squareSize * 0.1;
		var attr, dx, fill, i, opacity, val, x, y;

		s.node.setAttribute('width', (brickWidth + gapSize) * 6);
		s.node.setAttribute('height', (squareSize + gapSize) * 6);

		i = 0;
		for (y = 0; y < 6; y++) {
			for (x = 0; x < 6; x++) {
				val     = parseInt(sha.substr(i, 1), 16);
				opacity = map(val, 0, 15, 0.02, 0.2);
				fill    = (val % 2 === 0) ? '#ddd' : '#222';
				dx      = (y % 2 === 0) ? -squareSize : 0;
				attr    = { fill: fill, stroke: '#000', opacity: opacity };

				s.rect(x * (brickWidth + gapSize) + dx,
					y * (squareSize + gapSize),
					brickWidth,
					squareSize
				).attr(attr);

				// Add an extra one at top-right, for tiling
				if (x === 0) {
					s.rect(6 * (brickWidth + gapSize) + dx,
						y * (squareSize + gapSize),
						brickWidth,
						squareSize
					).attr(attr);
				}

				// Add an extra one at bottom-right, for tiling
				if (y === 0) {
					s.rect(6 * (brickWidth + gapSize) + dx,
						6 * (squareSize + gapSize),
						brickWidth,
						squareSize
					).attr(attr);
				}

				i += 1;
			}
		}
	}

	function geoSquares(s, sha) {
		var squareSize = map(parseInt(sha.substr(0, 1), 16), 0, 15, 10, 70);
		var i, square, val, x, y;

		s.attr({
			width:  squareSize * 6 + 'px',
			height: squareSize * 6 + 'px'
		});
		i = 0;
		for (y = 0; y < 6; y++) {
			for (x = 0; x < 6; x++) {
				val = parseInt(sha.substr(i, 1), 16);
				square = s.rect(x * squareSize, y * squareSize, squareSize, squareSize);
				square.attr({
					fill: '#000',
					opacity: map(val, 0, 15, 0, 0.2)
				});
				i++;
			}
		}
	}

	function geoRings(s, sha) {
		var scale = parseInt(sha.substr(1, 1), 16);
		var ringSize = map(scale, 0, 15, 5, 80);
		var strokeWidth = ringSize / 4;
		var circle, i, val, x, y;

		s.node.setAttribute('width',  (ringSize + strokeWidth) * 6);
		s.node.setAttribute('height', (ringSize + strokeWidth) * 6);
		i = 0;
		for (y = 0; y < 6; y++) {
			for (x = 0; x < 6; x++) {
				val = parseInt(sha.substr(i, 1), 16);
				circle = s.circle(
					x * ringSize + x * strokeWidth + (ringSize + strokeWidth) / 2,
					y * ringSize + y * strokeWidth + (ringSize + strokeWidth) / 2,
					ringSize / 2);
				circle.attr({
					fill: 'none',
					stroke: '#000',
					'strokeWidth': strokeWidth,
					opacity: map(val, 0, 15, 0.02, 0.16)
				});
				i++;
			}
		}
	}

	function geoOverlappingRings(s, sha) {
		var scale       = parseInt(sha.substr(1, 1), 16);
		var ringSize    = map(scale, 0, 15, 5, 80);
		var strokeWidth = ringSize / 4;
		var attr, circle, fill, i, x, y;

		s.node.setAttribute('width', ringSize * 6);
		s.node.setAttribute('height', ringSize * 6);

		i = 0;
		for (y = 0; y < 6; y++) {
			for (x = 0; x < 6; x++) {
				attr = {
					fill: 'none',
					stroke: '#000',
					strokeWidth: strokeWidth,
					opacity: map(parseInt(sha.substr(i, 1), 16), 0, 15, 0.02, 0.16)
				};

				circle = s.circle(x * ringSize, y * ringSize, ringSize);
				circle.attr(attr);

				// Add an extra one at top-right, for tiling.
				if (x === 0) {
					circle = s.circle(6 * ringSize, y * ringSize, ringSize);
					circle.attr(attr);
				}

				// Add an extra row at the end that matches the first row, for tiling.
				if (y === 0) {
					circle = s.circle(x * ringSize, 6 * ringSize, ringSize);
					circle.attr(attr);
				}

				// Add an extra one at bottom-right, for tiling.
				if (x === 0 && y === 0) {
					circle = s.circle(6 * ringSize, 6 * ringSize, ringSize);
					circle.attr(attr);
				}
				i++;
			}
		}
	}

	function geoTriangles(s, sha) {
		var scale          = parseInt(sha.substr(1, 1), 16);
		var sideLength     = map(scale, 0, 15, 5, 120);
		var triangleHeight = sideLength / 2 * Math.sqrt(3);
		var triangle       = createTriangle(s, sideLength, triangleHeight).attr({stroke: '#444', opacity:0});
		var rotation       = 'r180,' + sideLength / 2 + ',' + triangleHeight / 2;
		var fill, i, opacity, rot, tmpTri, val, x, y;

		s.node.setAttribute('width',  sideLength * 3);
		s.node.setAttribute('height', triangleHeight * 6);

		i = 0;
		for (y = 0; y < 6; y++) {
			for (x = 0; x < 6; x++) {
				val  = parseInt(sha.substr(i, 1), 16);
				fill = (val % 2 === 0) ? '#ddd' : '#222';
				rot  = '';
				if (y % 2 === 0) {
					rot = x % 2 === 0 ? rotation : '';
				} else {
					rot = x % 2 !== 0 ? rotation : '';
				}
				opacity = map(val, 0, 15, 0.02, 0.15);
				tmpTri = triangle.clone();
				tmpTri.attr({
					opacity: opacity,
					fill: fill,
					transform: 't' + [
						x * sideLength * 0.5 - sideLength / 2,
						triangleHeight * y
					] + rot
				});

				// Add an extra one at top-right, for tiling.
				if (x === 0) {
					tmpTri = triangle.clone();
					tmpTri.attr({
						opacity: opacity,
						fill: fill,
						transform: 't' + [
							6 * sideLength * 0.5 - sideLength / 2,
							triangleHeight * y
						] + rot
					});
				}
				i++;
			}
		}
	}

	function geoDiamonds(s, sha) {
		var diamondWidth  = map(parseInt(sha.substr(0, 1), 16), 0, 15, 10, 50);
		var diamondHeight = map(parseInt(sha.substr(1, 1), 16), 0, 15, 10, 50);
		var dx, fill, i, opacity, val, x, y;

		s.node.setAttribute('width', diamondWidth * 6);
		s.node.setAttribute('height', diamondHeight * 3);

		i = 0;
		for (y = 0; y < 6; y++) {
			for (x = 0; x < 6; x++) {
				val        = parseInt(sha.substr(i, 1), 16);
				opacity    = map(val, 0, 15, 0.02, 0.15);
				fill       = (val % 2 === 0) ? '#ddd' : '#222';
				dx         = (y % 2 === 0) ? 0 : diamondWidth / 2;

				createDiamond(s, diamondWidth, diamondHeight).attr({
					opacity: opacity,
					fill: fill,
					stroke: '#444',
					transform: 't' + [
						x * diamondWidth - diamondWidth / 2 + dx,
						diamondHeight / 2 * y - diamondHeight / 2
					]
				});

				// Add an extra one at top-right, for tiling.
				if (x === 0) {
					createDiamond(s, diamondWidth, diamondHeight).attr({
						opacity: opacity,
						fill: fill,
						transform: 't' + [
							6 * diamondWidth - diamondWidth / 2 + dx,
							diamondHeight / 2 * y - diamondHeight / 2
						]
					});
				}

				// Add an extra row at the end that matches the first row, for tiling.
				if (y === 0) {
					createDiamond(s, diamondWidth, diamondHeight).attr({
						opacity: opacity,
						fill: fill,
						transform: 't' + [
							x * diamondWidth - diamondWidth / 2 + dx,
							diamondHeight / 2 * 6 - diamondHeight / 2
						]
					});
				}

				// Add an extra one at bottom-right, for tiling.
				if (x === 0 && y === 0) {
					createDiamond(s, diamondWidth, diamondHeight).attr({
						opacity: opacity,
						fill: fill,
						transform: 't' + [
							6 * diamondWidth - diamondWidth / 2 + dx,
							diamondHeight / 2 * 6 - diamondHeight / 2
						]
					});
				}

				i += 1;
			}
		}
	}


	function geoPlaid(s, sha) {
		var height = 0;
		var width = 0;
		var fill, i, opacity, space, stripeHeight, stripeWidth, val, x, y;

		// Horizontal stripes
		i = 0;
		for (y = 0; y < 18; y++) {
			space = parseInt(sha.substr(i, 1), 16);
			height += space + 5;
			val = parseInt(sha.substr(i + 1, 1), 16);
			opacity = map(val, 0, 15, 0.02, 0.15);
			fill = (val % 2 === 0) ? '#ddd' : '#222';
			stripeHeight = val + 5;

			s.rect(0, height, '100%', stripeHeight).attr({
				opacity: opacity,
				fill: fill
			});
			height += stripeHeight;
			i += 2;
		}

		i = 0;
		for (x = 0; x < 18; x++) {
			space = parseInt(sha.substr(i, 1), 16);
			width += space + 5;
			val = parseInt(sha.substr(i + 1, 1), 16);
			opacity = map(val, 0, 15, 0.02, 0.15);
			fill = (val % 2 === 0) ? '#ddd' : '#222';
			stripeWidth = val + 5;
			s.rect(width, 0, stripeWidth, '100%').attr({
				fill: fill,
				opacity: opacity
			});
			width += stripeWidth;
			i += 2;
		}

		s.node.setAttribute('width', width);
		s.node.setAttribute('height', height);
	}

	return this.each(function() {
		var container = $(this);
		var sha       = $(this).attr('data-title-sha');
		var s         = getSnap();
		var pattern   = parseInt(sha.substr(20, 1), 16);

		setBGColor(s, sha, container);

		switch (pattern) {
			case 0:
				geoBricks(s, sha); break;
			case 1:
				geoOverlappingCircles(s, sha); break;
			case 2:
				geoPlusSigns(s, sha); break;
			case 3:
				geoXes(s, sha); break;
			case 4:
				geoSineWaves(s, sha); break;
			case 5:
				geoHexagons(s, sha); break;
			case 6:
				geoOverlappingRings(s, sha); break;
			case 7:
				geoPlaid(s, sha); break;
			case 8:
				geoTriangles(s, sha); break;
			case 9:
				geoSquares(s, sha); break;
			case 10:
				geoRings(s, sha); break;
			case 11:
				geoDiamonds(s, sha); break;
			case 12:
				break;
			case 13:
				break;
			case 14:
				break;
			case 15:
				break;
		}
		renderPattern(s, container);
	});

};

}(jQuery));
