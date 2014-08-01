/**
 * @jsx m
 */

var m = require('./../components/m/m.js');
var PubSub = require('./../components/p/p.js');
//var $ = require('jquery');

require('bootstrap-datetimepicker');
require('chosen');

var L = require('leaflet');

var home = {};

//here's the view
home.view = function(ctrl) {
	/*jshint ignore:start */
	return 	<div class="view" style="display: block;margin: 0;padding: 0;">

		<div class="viewbar noscroll" style="color:#FFF;line-height: 40px;overflow: hidden;">
		The main view The main view The main view The main view The main view The main view The main view The main view
		</div>

		<div class="viewcontent scroll" style="background-color: #ecf0f1;">
		View Content
			<input id="qwe" onchange={m.withAttr("value", ctrl.state)} value={ctrl.state()}/>


			<button onclick={ctrl.say}>Say</button>
			<a href="/tours" config={m.route}>tours</a>
				<input type="text" val="qwe"/>

			<div class="row">
				<div class="col-md-1 col-xs-6">.col-md-1</div>
				<div class="col-md-1 col-xs-6">.col-md-1</div>
				<div class="col-md-1">.col-md-1</div>
				<div class="col-md-1">.col-md-1</div>
				<div class="col-md-1">.col-md-1</div>
				<div class="col-md-1">.col-md-1</div>
				<div class="col-md-1">.col-md-1</div>
				<div class="col-md-1">.col-md-1</div>
				<div class="col-md-1">.col-md-1</div>
				<div class="col-md-1">.col-md-1</div>
				<div class="col-md-1">.col-md-1</div>
				<div class="col-md-1">.col-md-1</div>
			</div>


			<input class="form-control" id="datetimepicker1" type="date"/>


			<select class="chosen-select" data-placeholder="Choose a Country..." style="width:350px;visibility:none;" multiple>

			</select>

		"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
		dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
		ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
		fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
		deserunt mollit anim id est laborum."

		"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
		dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
		ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
		fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
		deserunt mollit anim id est laborum."

		"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
		dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
		ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
		fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
		deserunt mollit anim id est laborum."

		"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
		dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
		ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
		fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
		deserunt mollit anim id est laborum."


		</div>

	</div>
	/*jshint ignore:end */
};

home.controller = function() {
	var that = this;

	this.state = m.prop("State1");

	this.say = function() {
		//that.state(new Date());
		//$('#qwe').attr('hello', 'hello');
		//console.log( "Home controller publish" );
		//		m.startComputation();
		PubSub.publish('MY TOPIC', new Date());

	}

	PubSub.subscribe('MY TOPIC', function(msg, data) {
		that.state(data);
		//		m.endComputation();
		m.redraw();

		//console.log( msg, data );
	});

	setTimeout(function() {
		if (!(window.device && window.device.available)) {
			$('#datetimepicker1').attr('type', 'text');
			$('#datetimepicker1').datetimepicker();
		}

		$(".chosen-select").chosen({
			disable_search_threshold: 10
		});
		$(".chosen-select").append('<option value="United States">United States</option>');
		$('.chosen-select').trigger("chosen:updated");


		var s = '<div id="map0" style="width:80%;height: 400px;background: none;"></div>'
		$(s).appendTo('.viewcontent');

		setTimeout(function() {
			var map = L.map('map0', {
				keyboard: false
			}).setView([51.505, -0.09], 18);

			L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
				maxZoom: 18
			}).addTo(map);
		}, 1000);



	}, 1000);

};


//initialize the application

module.exports = home;
