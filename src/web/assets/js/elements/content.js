/**
 * JSX version of the Mithril Getting Started documentation's TODO example.
 * http://lhorie.github.io/mithril/getting-started.html
 * @jsx m
 */

var m = require('./../components/m/m.js');

var home = require('./../routes/home.js');
var sample0 = require('./../routes/sample0.js');
var sample1 = require('./../routes/sample1.js');


module.exports = function (node) {

	m.route.mode = "search";


	m.route(
		node,
		//document.getElementById('views'),
		//document.body,
		"/", {
		"/": home,
		"/sample0": sample0,
		"/sample1": sample1
	});

}