/**
 * @jsx m
 */

var home = {};

//here's the view
home.view = function(ctrl) {
	/*jshint ignore:start */
	return 	<div class="view" style="display: block;margin: 0;padding: 0;">

		<div class="viewbar noscroll" style="color:#FFF;line-height: 40px;overflow: hidden;">
			Home page
		</div>

		<div class="viewcontent scroll" style="background-color: #ecf0f1;">
			Home page
		</div>

	</div>
	/*jshint ignore:end */
};

home.controller = function() {

};

module.exports = home;
