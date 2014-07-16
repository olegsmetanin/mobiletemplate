/**
 * JSX version of the Mithril Getting Started documentation's TODO example.
 * http://lhorie.github.io/mithril/getting-started.html
 * @jsx m
 */

var m = require('./../components/m/m.js');
var PubSub = require('./../components/p/p.js');
var L = require('./../components/l/l.js');

var mapsample = {};

//here's the view
mapsample.view = function(ctrl) {
	/*jshint ignore:start */
	return [
		<div class="view" style={{display: ctrl.visible() ? "block" : "none"}}>

			<div class="view-bar noscroll" style="">
				Map Sample
			</div>

			<div class="view-content">
				<div>dkjfhkjsdhfkjdhsfkjhjkdfhkjdsh</div>
			</div>

		</div>
	] 
	/*jshint ignore:end */
};

mapsample.controller = function() {
	var that = this;

	that.visible = m.prop(false);

};


//initialize the application

module.exports = mapsample;
