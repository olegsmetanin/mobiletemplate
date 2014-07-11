/**
 * @jsx m
 */

var home = {};

home.view = function(ctrl) {
	/*jshint ignore:start */
	return [
		<div class="view">

			<div class="view-bar noscroll" style="">
				Home page
			</div>

			<div class="view-content scroll" style="">
				Home page 			<a href="/sample1" config={m.route}>sample1</a>
			</div>

		</div>
	]
	/*jshint ignore:end */
};

home.controller = function() {

};

module.exports = home;
