"use strict";

var jQuery = $ = require('jquery');

var FastClick = require('fastclick');

var layout = require('./elements/layout.js');


if (window.device && window.device.available) {
	document.addEventListener('deviceready', deviceready, false);
} else {
	deviceready();
}

function deviceready() {
	$(function() {
		init();
	});
}


var init = function() {

	FastClick(document.body);

	function isTextInput(node) {
		return ['INPUT', 'TEXTAREA'].indexOf(node.nodeName) !== -1;
	}

	document.addEventListener('touchstart', function(e) {
		if (!isTextInput(e.target) && isTextInput(document.activeElement)) {
			document.activeElement.blur();
		}
	}, false);


	$(document).on('touchmove', '.noscroll', function(evt) {
		event.preventDefault();
	});

	var listenForScroll;

	$(document).on('touchend', '.scroll', function(evt) {
		listenForScroll = true;
	});


	var timer;
	var scroll;




// $('.qwe').on('scroll', function (evt) {
// 	console.log(evt.target);
// });

	$('.scroll').on('scroll', function(evt) {

		var trg = evt.target;

		console.log(trg);		

		if (!Modernizr.touch) {


			if (trg.className.indexOf('scrollbar') == -1) {
				trg.className += ' scrollbar';
			}

			if (timer) {
				clearTimeout(timer);
			}


			timer = setTimeout(function() {
				$(trg).removeClass('scrollbar');
			}, 500);
		}



		if (trg.className.indexOf('onscroll') == -1) {
			trg.className += ' onscroll';
		}

		if (scroll) {
			clearTimeout(scroll);
		}

		scroll = setTimeout(function() {
			$(trg).removeClass('onscroll');
		}, 500);

		if (listenForScroll) {
			var height = parseInt(window.getComputedStyle(this).height, 10);
			if ((this.scrollTop + height) === height) {
				this.scrollTop = 1;
				listenForScroll = false;
			} else if (this.scrollTop + height === this.scrollHeight) {
				this.scrollTop -= 1;
			}
		} else {
			listenForScroll = false;
		}
	});

	var resize = function() {
		$('.container-xx, .container-embd-xx').each(function(i, node) {
			var el = $(node);
			var width = el.width();
			if (width < 750) {
				el.addClass('container-xs');
				el.removeClass('container-sm');
				el.removeClass('container-md');
				el.removeClass('container-lg');;
			} else if (width < 970) {
				el.removeClass('container-xs');
				el.addClass('container-sm');
				el.removeClass('container-md');
				el.removeClass('container-lg');
			} else if (width < 1170) {
				el.removeClass('container-xs');
				el.removeClass('container-sm');
				el.addClass('container-md');
				el.removeClass('container-lg');
			} else {
				el.removeClass('container-xs');
				el.removeClass('container-sm');
				el.removeClass('container-md');
				el.addClass('container-lg');
			}

			var contentWidth = (width < 970 ? width : width - 230);

			if (contentWidth < 750) {
				el.addClass('content-xs');
				el.removeClass('content-sm');
				el.removeClass('content-md');
				el.removeClass('content-lg');
			} else if (contentWidth < 970) {
				el.removeClass('content-xs');
				el.addClass('content-sm');
				el.removeClass('content-md');
				el.removeClass('content-lg');
			} else if (contentWidth < 1170) {
				el.removeClass('content-xs');
				el.removeClass('content-sm');
				el.addClass('content-md');
				el.removeClass('content-lg');
			} else {
				el.removeClass('content-xs');
				el.removeClass('content-sm');
				el.removeClass('content-md');
				el.addClass('content-lg');
			}


		});
	};

	$(window).resize(function() {
		resize();
	});

	resize();

	$('.container-xx, .container-embd-xx').each(function(i, node) {
		layout(node);
	});

};

module.exports = function() {

}