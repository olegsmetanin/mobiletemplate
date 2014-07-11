/**
 * @jsx m
 */

var m = require('mithril');

var systemMenu = {};

systemMenu.controller = function() {

};

systemMenu.view = function(ctrl) {
	/*jshint ignore:start */
	return 	[
		<div class="systemmenu scroll hidden-default"
					style="background-color: #ecf0f1;">
			<div class="view-bar">
				This is systemMenu Bar
			</div>
			<div class="view-content">
				This is systemMenu Content
			</div>

		</div>
	]
	/*jshint ignore:end */
};

module.exports = systemMenu;