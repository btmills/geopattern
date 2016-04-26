(function () {

'use strict';

hljs.initHighlighting();

var setAccentColor = (function () {
	var targets = {
		color: $('#docs a, .hljs-string, .hljs-value'),
		borderColor: $('.hljs '),
		backgroundColor: $('#tagline')
	};

	console.log(targets);

	return function (color) {
		Object.keys(targets).forEach(function (property) {
			var args = {};
			args[property] = color;
			targets[property].stop().animate(args, fadeOptions);
		});
	};
}());

var next = (function () {
	var which = 0;
	return function () {
		return {
			prev: which,
			next: which = (which + 1) % 2
		};
	};
}());

// Hook and debounce input event
function onChange($el, cb) {
	var last = $el.val();
	$el.on('input', function () {
		var val = $el.val();
		var oldVal;
		if (last !== val) {
			oldVal = last;
			last = val;
			typeof cb === 'function' && cb.call($el, val, oldVal);
		}
	});

	return {
		trigger: function () {
			typeof cb === 'function' && cb.call($el, $el.val(), last);
		}
	};
}

var fadeOptions = {
	duration: 100,
	queue: false
};

var changeEvent = onChange($('#string'), function (val) {
	var bg = next();
	var pattern = GeoPattern.generate(val);
	$('#bg-' + bg.next)
		.css('background-image', pattern.toDataUrl())
		.stop()
		.fadeIn(fadeOptions);
	$('#bg-' + bg.prev)
		.stop()
		.fadeOut(fadeOptions);
	setAccentColor(pattern.color);
});

// Some browsers persist field values between refresh
$('#string')
	.val('  start typing...  ')
	.focus();
changeEvent.trigger();

}());
