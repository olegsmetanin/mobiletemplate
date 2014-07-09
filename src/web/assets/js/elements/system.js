/**
 * @jsx m
 */

var m = require('mithril');

var system = {};

system.controller = function() {

};

system.view = function(ctrl) {
	/*jshint ignore:start */
	return 	<div class="system">
		<div class="systembar noscroll" style="background-color: #2c3e50;color:#FFF;">
		<div class="hidden-xs hidden-sm visible-default-block pull-left" style="width:230px;">
			<div style="height:44px;line-height: 40px;margin-left: 15px;font-size: 18px; overflow:hidden;">
			Your Company ABCD EFGH IKLM NOPQ RSTV XYZ
			</div>
		</div>

		<div class="pull-left" style="height:44px;">

			<a href="#" id="systemmenu-toggle" title="" class="pull-left" style="padding: 12px 10px; display: block;">
				<i class="fa fa-bars"></i>
			</a>

			<a href="#" id="usermenu-toggle" title="" class="visible-xs-block visible-sm-block hidden-default pull-left" style="padding: 12px 10px;position: relative;">
				<i class="fa fa-user"></i>
				<b class="badge bg-color-red bounceIn animated" style="
					position: absolute; font-size: 10px;;
top: 0px;
right: -5px;
background-color: #e66454;
					"> 21 </b>
			</a>

			<a href="#" id="back-btn" title="" class="backbutton pull-left" style="padding: 12px 10px; display: block;">
				<i class="fa fa-chevron-left"></i>
			</a>

		</div>

	</div>

		<div class="systemmenu scroll hidden-default"
				style="background-color: #ecf0f1;">
		System Menu
		</div>
		</div>
	/*jshint ignore:end */
};

module.exports = system;