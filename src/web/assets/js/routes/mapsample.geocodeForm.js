/**
 * @jsx m
 */

var m = require('./../components/m/m.js');
var PubSub = require('./../components/p/p.js');
var L = require('./../components/l/l.js');

var mapsample = {};

mapsample.Address = function(data) {
    this.georesult = m.prop(data);
};

mapsample.Geocoder = function(data) {
    this.gtype = m.prop(data.gtype);
  	this.name = m.prop(data.name);
};

mapsample.AddressList = Array;
mapsample.GeocoderList = Array;

//here's the view
mapsample.view = function(ctrl) {
	/*jshint ignore:start */
	
	var addressList = ctrl.addressList.map(function(addressItem, index) {
		return [
			<li>
				<a href="#"
					onclick={ctrl.showGeocoding.bind(ctrl, index)}
				>
				{addressItem.georesult().content}
				</a>
			</li>
		]
	})

	var geocoderList = ctrl.geocodeProviders.map(function(geocoderItem, index) {
		return [
			<option value={index}>{geocoderItem.name}</option>	
		]
	})
 


	return [
		<div class="view" style={{display: ctrl.visible() ? "block" : "none"}}>

			<div class="view-bar noscroll" style="">
        <ul class="nav navbar-nav" style=";">
          <li style="">
            <a href="#" onclick={ctrl.close} title="" style="font-size:25px;">
              <i class="fa fa-chevron-left" style=""></i>
            </a>
          </li> 
          <li style="">
             <span style="font-size:20px;">Search place</span>
          </li>
        </ul>
			</div>

			<div class="view-content">
    
			    <div class="row" style="padding-top: 20px;">

			  		<div class="hidden-xs col-sm-3">
			      	</div> 		   
			  		
			  		<div class="col-xs-6 col-sm-3">
						<input class="search-address"
							placeholder='Search address'
							onkeyup={function(e) { m.withAttr('value', ctrl.address)(e); ctrl.searchAddress(e) }}
							value={ctrl.address()}
						/> 
			  		</div>

			  		<div class="col-xs-6 col-sm-3">
						<select class="form-control" 
			 				value={ctrl.geocoderIndex()}
			 				onchange={function(e) { m.withAttr('value', ctrl.geocoderIndex)(e); ctrl.searchAddress(e) }}
						>
							{geocoderList}
						</select>		
			  		</div>

			  		<div class="hidden-xs col-sm-3">
			      	</div> 	
			  	</div>
			    
			    <div class="row">
			  		<div class="col-xs-12">
							<ul class="layers">
								{addressList}
							</ul>
					</div>
			  	</div>



			</div>

		</div>
	] 
	/*jshint ignore:end */
};
mapsample.controller = function(_in) {
    var that = this;

    that.address = m.prop("");

    that.geocodeProviders = _in.geocodeProviders;

    that.geocoderIndex = m.prop(0);

    var timer;

    that.searchAddress = function() {

        clearTimeout(timer);

        timer = setTimeout(function() {


            var address = that.address();
            if (address !== "") {

                m.startComputation();



                var currentGeocoder = that.geocodeProviders[that.geocoderIndex()]
                    .provider;

                $.when(currentGeocoder({
                    query: address
                })).then(function(georesult) {

                    while (that.addressList.length > 0) {
                        that.addressList.pop();
                    }
                    for (var i = 0; i < georesult.length; i++) {

                        that.addressList.push(new mapsample.Address(
                            georesult[i]));
                    }


                    m.endComputation();
                }, function(e) {
                    m.endComputation();
                });
            }

        }, 500);

    };

    that.showGeocoding = function(index) {

        that.close();
        _in.onSelect(that.addressList[index].georesult());
    }

    that.addressList = new mapsample.AddressList;


    // Hide/Show

    that.visible = m.prop(false);

    that.show = function() {

        m.startComputation();
        that.visible(true);
        m.endComputation();

    }

    that.close = function() {

        m.startComputation();
        that.visible(false);
        _in.onClose();
        m.endComputation();
    }

};

module.exports = mapsample;
