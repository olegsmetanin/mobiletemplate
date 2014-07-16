/**
 * JSX version of the Mithril Getting Started documentation's TODO example.
 * http://lhorie.github.io/mithril/getting-started.html
 * @jsx m
 */

var m = require('./../components/m/m.js');
var PubSub = require('./../components/p/p.js');
var L = require('./../components/l/l.js');

var mapGeocode = require('./mapsample.geocode.js');

var mapsample = {};

//here's the view
mapsample.view = function(ctrl) {
	/*jshint ignore:start */
	return [
		<div class="view" style={{display: ctrl.visible() ? "block" : "none"}}>

			<div  class="view-bar noscroll" style="">
				Map Sample <button onclick={ctrl.showgeocode}>Add</button>
			</div>

			<div id="mapcontainer" class="view-content" style="position:fixed; top:0; bottom:0; left:0;right:0;">
				<div class="map" id="map1" style="margin:0;padding:0;width:100%;height:100%;"></div>
			</div>

		</div>,
		mapGeocode.view(ctrl.geocode) 
	] 
	/*jshint ignore:end */
};

mapsample.controller = function() {
	var that = this;

	that.visible = m.prop(true);

	that.geocode = new mapGeocode.controller();

	that.showgeocode = function () {
      		m.startComputation();
      		console.log('showgeocode');
      		that.visible(false);
      		that.geocode.visible(true);
      		m.endComputation();
      		//m.redraw();
	}


	setTimeout(function () {

			var map = L.map('map1',{keyboard: false}).setView([51.505, -0.09], 18);

			L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
				maxZoom: 18
			}).addTo(map);

var myButtonOptions = {
	  'position': 'topright',
      'text': 'MyButton',  // string
      'iconUrl': 'images/myButton.png',  // string
      'onClick': function() {
      		that.showgeocode();

      		//$('#view01').hide();
      		//$('#view02').show();
      		//console.log("someone clicked my button");
      	},  // callback function
      'hideText': true,  // bool
      'maxWidth': 30,  // number
      'doToggle': false,  // bool
      'toggleStatus': false  // bool
}   

var myButton = new L.Control.Button(myButtonOptions).addTo(map);


	},10);

};


//initialize the application

module.exports = mapsample;
