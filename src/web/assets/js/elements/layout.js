/**
 * @jsx m
 */

// var m = require('./../components/m/m.js');

var jQuery = $ = require('./../components/j/j.js');
var system = require('./system.js');
var user = require('./user.js');
var content = require('./content.js');

var layout = {};

layout.view = function(ctrl) {
	/*jshint ignore:start */
	return [
		system.view(ctrl.systemController),
		user.view(ctrl.userController), 
		<div class="views" style="padding-top:44px;">
			Loading
		</div>
	];
	/*jshint ignore:end */
};

layout.controller = function() {
	var that = this;

	that.userController = new user.controller();
	that.systemController = new system.controller();
	
	setTimeout(function () {
	$('#systemmenu-toggle').on('click', function (event) {
		var container = $( event.target ).parents( ".container-xx");
		container.toggleClass('opensystemmenu');
		container.removeClass('openusermenu');
	});

	$('#usermenu-toggle').on('click', function (event) {
		var container = $( event.target ).parents( ".container-xx");
		container.toggleClass('openusermenu');
		container.removeClass('opensystemmenu');
	});

	$(document).on('click', '.backbutton',function (event) {
		event.preventDefault();
		var container = $( event.target ).parents( ".container-xx");
		container.removeClass('openusermenu');
		container.removeClass('opensystemmenu');
		window.history.back()
	}); 
	},0);


	setTimeout(function () {
		content($('.views')[0]);
	},100)

};

module.exports = function (node) {
	m.module(node, layout);
}

		
		// <div class="userview scroll visible-default-block hidden-xs hidden-sm" style="">
			
		// </div>

		// <div class="system">
			
		// </div>

		// <div class="views" id="maincontainer-views" style="">
		// </div>