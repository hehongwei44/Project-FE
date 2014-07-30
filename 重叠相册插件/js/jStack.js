(function($) {
/*
 * jStack jQuery Plugin version 1.1
 * http://lab.hisasann.com/jStack/
 *
 * Copyright (c) 2012 hisasann http://hisasann.com/
 * Dual licensed under the MIT and GPL licenses.
 */

$.fn.jStack = function(opts) {
	return new jStack(this, opts);
};

var jStack = function(element, opts){
	var that = this,
		options = this.options;
	
	$.extend(options, opts);

	$(element).css('position', 'relative')

	this.stack = $.makeArray($(element).children());

	$(element).children()
		.each(function(index) {
			var plusminus = "+";
			if (index % 2 == 0) {
				plusminus = "-";
			}
			
			var deg = Math.random() * 4;
			var rotate = 'rotate(' + plusminus + deg + 'deg)';
			
			$(this)
				.css({
					position: "absolute",
					top: (options.isPositionRandom ? getRandom(options.deviate) : 0) + "px",
					left: (options.isPositionRandom ? getRandom(options.deviate) : 0) + "px",
					zIndex: that.maxIndex - index,
					display: "block",
					"transform": rotate,
					"-webkit-transform": rotate,
					"-moz-transform": rotate
				});
		});

	if(options.isClickAnimation) {
		$(this.stack[0]).on("click", this, mover);
	}
}

jStack.prototype = {
	maxIndex: 10000,
	stack: [],
	options: {
		deviate: 40,
		isClickAnimation: true,
		isPositionRandom: true,
		durationOut: 500,
		durationIn: 500,
		easingOut: "swing",
		easingIn: "swing",
		moveLeft: 100,
		moveTop: 100,
		opacityOut: 0.8,
		opacityIn: 1,
		delay: 100,
		direction: "next",
		callback: function() {}
	},
	next: function() {
		swap.call(this, "next");
		return false;
	},
	prev: function() {
		swap.call(this, "prev");
		return false;
	},
	shuffle: function() {
		swap.call(this, "shuffle");
		return false;
	}
}

function mover(event) {
	var data = event.data
	swap.call(data, data.options.direction);
	return false;
}

function swap(direction) {
	var stack = this.stack,
		current = stack[0],
		next = stack[1],
		isShuffle = direction == "shuffle" ? true : false,
		that = this,
		options = this.options;

	switch(direction) {
		case "prev":
			$(current).off("click", mover);
			current = stack.pop();
			stack = arrayExtend([current], stack);
			next = stack[0];
			break;
		case "shuffle":
			$(current).off("click", mover);
			stack = arrayShuffle(stack);
			current = stack;
			next = stack[0];
			break;
		case "next":
		default:
			stack.shift();
			stack.push(current);
			$(current).off("click", mover);
			break;
	}
	this.stack = stack;
	
	if(options.isClickAnimation) {
		$(next).on("click", this, mover);
	}

	if(isShuffle) {
		shuffleAnimation.apply(this, [current, stack, $(current).length]);
	} else {
		$(current)
			.animate({
					left: "+=" + options.moveLeft + "px",
					top: "+=" + options.moveTop + "px",
					opacity: options.opacityOut
				}, options.durationOut, options.easingOut, function() {
					jQuery.each(stack, function(index) {
						$(this).css("zIndex", that.maxIndex - index);
					});

					var $this = $(this);
					setTimeout(function() {
						$this.animate({
							left: "-=" + options.moveLeft + "px",
							top: "-=" + options.moveTop + "px",
							opacity: options.opacityIn
						}, options.durationIn, options.easingIn, function() {
							options.callback.call(this);
						});
					}, options.delay);
			});
	}
}

function shuffleAnimation(current, stack, length) {
	var _this = $(current)[--length],
		that = this,
		options = this.options;

	if(length < 0) {
		jQuery.each(stack, function(index) {
			$(this).css("zIndex", that.maxIndex - index);
		});
		return;
	}

	$(_this).animate({
			left: Math.sin(length) * options.moveLeft + "px",
			top: Math.cos(length) * options.moveTop + "px",
			opacity: options.opacityOut
		}, options.durationOut, options.easingOut, function() {
			var $this = $(this);

			setTimeout(function() {
				$this.animate({
					left: (options.isPositionRandom ? getRandom(options.deviate) : 0) + "px",
					top: (options.isPositionRandom ? getRandom(options.deviate) : 0) + "px",
					opacity: options.opacityIn
				}, options.durationIn, options.easingIn, function() {
					options.callback.call(this);
				});
			}, options.delay);
	});
	setTimeout(function() {
		shuffleAnimation.apply(that, [current, stack, length]);
	}, getRandom(13 * length));
}

function arrayExtend() {
	var target = arguments[0],
		options = arguments[1],
		i = 0;
		length = options.length;
	
	while(i < length) {
		target.push(options[i++]);
	}
	
	return target;
}

function arrayShuffle(list) {
	var i = list.length;

	while (--i) {
		var j = Math.floor(Math.random() * (i + 1));
		if (i == j) continue;
		var k = list[i];
		list[i] = list[j];
		list[j] = k;
	}
	return list;
}

function getRandom(rand) {
	return Math.floor(Math.random() * rand);
}
})(jQuery);