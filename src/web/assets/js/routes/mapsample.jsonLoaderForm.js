/**
 * @jsx m
 */

var m = require('./../components/m/m.js');
var PubSub = require('./../components/p/p.js');
var L = require('./../components/l/l.js');

var mapsample = {};

//here's the view
mapsample.view = function(ctrl) {
	/*jshint ignore:start */
	
	var layersList = ctrl.baseLayersList.map(function(layersItem, index) {
		return [
			<li>
				<a href="#" class={ctrl.baseLayerIndex() === index ? "selected" : ""}
					onclick={function(e) { ctrl.setBaseLayer(index ,e) }}
				>{layersItem.name}</a>
			</li>
		]
	});
 

	return [
		<div class="view" style={{display: ctrl.visible() ? "block" : "none"}}>

			<div class="view-bar noscroll" style="">
        <ul class="nav navbar-nav " style=";">
          <li style="">
            <a href="#" onclick={ctrl.close} title="" style="font-size:25px;">
              <i class="fa fa-chevron-left" style=""></i>
            </a>
          </li> 
          <li style="">
             <span style="font-size:20px;">Layers</span>
          </li>
        </ul>
			</div>

			<div class="view-content">
				<ul class="layers">{layersList}</ul>
			</div>

		</div>
	] 
	/*jshint ignore:end */
};
mapsample.controller = function(_in) {


    var that = this;

    that.baseLayerIndex = m.prop(0);

    that.baseLayersList = _in.baseLayersList;


    that.visible = m.prop(false);

    that.show = function() {

        m.startComputation();
        that.visible(true);
        m.endComputation();

    }

    that.close = function() {

        m.startComputation();
        that.visible(false);
        _in.onClose({
            baseLayerIndex: that.baseLayerIndex()
        });
        m.endComputation();
    }

    that.setBaseLayer = function(index, e) {

        e.preventDefault();
        m.startComputation();
        that.baseLayerIndex(index);
        m.endComputation();

    };
};

module.exports = mapsample;