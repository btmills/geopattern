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
	$('#bg-' + bg.next)
		.geopattern(val)
		.stop()
		.fadeIn(fadeOptions);
	$('#bg-' + bg.prev)
		.stop()
		.fadeOut(fadeOptions);
});

// Some browsers persist field values between refresh
$(function () {
	$('#string')
		.val('  start typing...  ')
		.focus();
	changeEvent.trigger();
});
