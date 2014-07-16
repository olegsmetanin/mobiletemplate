/**
 * @jsx m
 */

// var m = require('./../components/m/m.js');

var jQuery = $ = require('./../components/j/j.js');
var systemBar = require('./systemBar.js');
var systemMenu = require('./systemMenu.js');
var userMenu = require('./userMenu.js');
var content = require('./content.js');

var layout = {};

layout.view = function(ctrl) {
	/*jshint ignore:start */
	return [
			systemBar.view(ctrl.systemBarController),
			userMenu.view(ctrl.userMenuController), 
			systemMenu.view(ctrl.systemMenuController),
			<div class="views qwe" style="">
				Loading 
			</div>
	];
	/ * jshint ignore: end * /
};

layout.controller = function() {
	var that = this;

	that.systemBarController = new systemBar.controller();
	that.systemMenuController = new systemMenu.controller();
	that.userMenuController = new userMenu.controller();

	setTimeout(function() {
		$('#systemmenu-toggle').on('click', function(event) {
			var container = $(event.target).parents(".container-xx");
				container.addClass('opensystemmenu');
				container.removeClass('openview');	
				container.removeClass('openusermenu');
		});

		$('#usermenu-toggle').on('click', function(event) {
			var container = $(event.target).parents(".container-xx");
			container.addClass('openusermenu');
			container.removeClass('openview');
			container.removeClass('opensystemmenu');

		});

		$(document).on('click', '.backbutton', function(event) {
			event.preventDefault();
			var container = $(event.target).parents(".container-xx");
			container.addClass('openview');
			container.removeClass('openusermenu');
			container.removeClass('opensystemmenu');
			window.history.back()
		});


	}, 0);


	setTimeout(function() {
		$('.scroll').on('scroll', function (evt) {
			console.log(evt.target);
		});

		content($('.views')[0]);

	}, 100);

		setTimeout(function() {
		$('.scroll').on('scroll', function (evt) {
			console.log(evt.target);
		});

		$('.scroll').each(function (i,n) {
			console.log(n);
		})

	}, 1000)



};

module.exports = function(node) {
	m.module(node, layout);
}