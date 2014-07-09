/**
 * JSX version of the Mithril Getting Started documentation's TODO example.
 * http://lhorie.github.io/mithril/getting-started.html
 * @jsx m
 */

var m = require('./../components/m/m.js');
var PubSub = require('./../components/p/p.js');


var user = {};

user.controller = function() {
	var that = this;

	that.state = m.prop("State1");

	PubSub.subscribe( 'MY TOPIC', function( msg, data ){
		that.state(data);
		m.redraw();

	} );

};



//here's the view
user.view = function(ctrl) {
	/*jshint ignore:start */
	return [
		<div class="userview scroll visible-default-block hidden-xs hidden-sm" style="">
			<ul class="">
				<li>
					<a class="clearfix" style="margin-left:20px;margin-bottom:15px;display:block; color:#fff; text-decoration: none;"
					href="#">
						<img class="img-circle pull-left" style="
		margin: auto;" src="assets/img/profile-pic.jpg" alt=""/>
						<span style="margin-left:80px;display:block;">
							<div style="">
							John Michael Amelia Smith Doe
							</div>
						</span>
					</a>

				</li>

				<li>

					<a href="#" style="
						display: block;
						text-decoration: none;
						color: #A7B1C2;
		padding: 14px 20px 14px 25px;
		font-size: 14px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
						"><i class="fa fa-envelope"></i> <span class="nav-label">Mailbox </span><span
					class="label label-warning pull-right" style="font-size: 13px; ">16/24</span></a>
				</li>
				<li>

					<a href="#" style="
						display: block;
						text-decoration: none;
						color: #A7B1C2;
		padding: 14px 20px 14px 25px;
		font-size: 14px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
						"><i class="fa fa-print"></i> <span class="nav-label">Reports </span><span
					class="label label-warning pull-right" style="font-size: 13px; ">16/24</span></a>
				</li>
				<li>

					<a href="#" style="
						display: block;
						text-decoration: none;
						color: #A7B1C2;
		padding: 14px 20px 14px 25px;
		font-size: 14px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
						"><i class="fa fa-users"></i> <span class="nav-label">Roles </span></a>
					<ul class="nav-second-level collapse in" style="height: auto;font-size: 14px;">
						<li><a href="form_basic.html">
							<i class="fa fa-check-square"></i>
							<span class="nav-label">Administrator</span>
						</a></li>
						<li><a href="form_basic.html">
							<i class="fa fa-square-o"></i>
							<span class="nav-label">Administrator</span>
						</a></li>
						<li><a href="form_advanced.html">
							<i class="fa fa-square-o"></i>
							<span class="nav-label">Administrator</span>
						</a></li>
					</ul>
				</li>
				<li>
					<input onchange={m.withAttr("value", ctrl.state)} value={ctrl.state()}/>
				</li>
			</ul>
		</div>
	]
	/*jshint ignore:end */
};

//initialize the application

module.exports = user;

