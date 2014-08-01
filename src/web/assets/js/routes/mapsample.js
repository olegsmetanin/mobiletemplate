/**
 * @jsx m
 */

var m = require('./../components/m/m.js');
var PubSub = require('./../components/p/p.js');
var L = require('./../components/l/l.js');

var geocodeForm = require('./mapsample.geocodeForm.js');
var layersManagerForm = require('./mapsample.layersManagerForm.js');
var chooseIdentifyProviderForm = require('./mapsample.chooseIdentifyProviderForm.js');


var mapsample = {};

mapsample.view = function(ctrl) {
	/*jshint ignore:start */
	return [
		<div class="view" style={{visibility: ctrl.visible() ? "visible" : "hidden"}}>

			<div  class="view-bar noscroll" style="">
        <ul class="nav navbar-nav" style=";">
          <li style="">
            <a href="#" onclick={function(e) { ctrl.hide(); ctrl.layersManagerForm.show()}} title="" style="font-size:25px;">
              <i class="fap fap-layers" style=""></i>
            </a>
          </li>
          <li style="">
            <a href="#" onclick={function(e) { ctrl.hide(); ctrl.geocodeForm.show()}} title="" style="font-size:25px;">
              <i class="fap fap-searchplace" style=""></i>
            </a>
          </li> 
          <li style="">
            <a href="#" title="" style="font-size:25px;">
              <i class="fa fa-folder-open" style=""></i>
            </a>
          </li> 
          <li style="">
            <a href="#" title="" style="font-size:25px;">
              <i class="fa fa-tag" style=""></i>
            </a>
          </li> 
          <li style="">
             <span style="font-size:20px;">Map</span>
          </li>
        </ul>
			</div>

			<div id="mapcontainer" class="view-content" style="position:fixed; top:0; bottom:0; left:0;right:0;">
				<div class="map" id="map1" style="margin:0;padding:0;width:100%;height:100%;"></div>
			</div>

		</div>,
		geocodeForm.view(ctrl.geocodeForm) ,
    layersManagerForm.view(ctrl.layersManagerForm),
    chooseIdentifyProviderForm.view(ctrl.chooseIdentifyProviderForm)
	] 
	/*jshint ignore:end */
};

mapsample.controller = function() {

    var that = this;

    // Layers Manager

    var baseLayersList = [

        {
            name: "OSM",
            provider: L.LayerManager.OSM
        },

        {
            name: "Google Roadmap",
            provider: L.LayerManager.GoogleRoadmap
        }, {
            name: "Google Satellite",
            provider: L.LayerManager.GoogleSatellite
        }, {
            name: "Google Hybrid",
            provider: L.LayerManager.GoogleHybrid
        }, {
            name: "Google Terrain",
            provider: L.LayerManager.GoogleTerrain
        },

        {
            name: "Bing Road",
            provider: L.LayerManager.BingRoad
        }, {
            name: "Bing Aerial",
            provider: L.LayerManager.BingAerial
        }, {
            name: "Bing Aerial with Labels",
            provider: L.LayerManager.BingAerialWithLabels
        },

        {
            name: "ESRI StreetMap",
            provider: L.LayerManager.ESRIStreetMap
        }, {
            name: "ESRI TopoMap",
            provider: L.LayerManager.ESRITopoMap
        }, {
            name: "ESRI Imagery",
            provider: L.LayerManager.ESRIImagery
        },

        {
            name: "OSM B/W",
            provider: L.LayerManager.OSMBW
        }, {
            name: "OSM CloudMade",
            provider: L.LayerManager.OSMCloudMade
        }, {
            name: "OSM OpenCycleMap",
            provider: L.LayerManager.OpenCycleMap
        }, {
            name: "OSM OpenCycleMap Transport",
            provider: L.LayerManager.OpenCycleMapTransport
        }, {
            name: "OSM OpenCycleMap Landscape",
            provider: L.LayerManager.OpenCycleMapLandscape
        },

        {
            name: "Map Quest",
            provider: L.LayerManager.MapQuest
        }, {
            name: "Map Quest Aerial",
            provider: L.LayerManager.MapQuestAerial
        },

        {
            name: "Stamen Toner",
            provider: L.LayerManager.StamenToner
        }, {
            name: "Stamen Terrain",
            provider: L.LayerManager.StamenTerrain
        }, {
            name: "Stamen Watercolor",
            provider: L.LayerManager.StamenWatercolor
        },

        {
            name: "Yandex Map",
            provider: L.LayerManager.YandexMap
        }, {
            name: "Yandex Satellite",
            provider: L.LayerManager.YandexSatellite
        }, {
            name: "Yandex Hybrid",
            provider: L.LayerManager.YandexHybrid
        }, {
            name: "Yandex PublicMap",
            provider: L.LayerManager.YandexPublicMap
        },

        {
            name: "Yandex PublicMap Hybrid",
            provider: L.LayerManager.YandexPublicMapHybrid
        },

        {
            name: "Wikimapia",
            provider: L.LayerManager.Wikimapia
        },

        {
            name: "White",
            provider: L.LayerManager.White
        }, {
            name: "Black",
            provider: L.LayerManager.Black
        }
    ];

    that.layersManagerForm = new layersManagerForm.controller({

        baseLayersList: baseLayersList,

        onClose: function(indexes) {

            that.show();

            var map = that.map;

            $.when(baseLayersList[indexes.baseLayerIndex].provider()).then(
                function(layer) {

                    if (that._baseLayer) {
                        map.removeLayer(that._baseLayer);
                    }

                    that._baseLayer = layer;

                    map.addLayer(that._baseLayer);

                }, function(e) {

                });
        }
    });

    // Geocoding
    var geocodeProviders = [{
        name: 'OSM',
        provider: L.Geocoders.OSMGeocode
    }, {
        name: 'Google',
        provider: L.Geocoders.GoogleGeocode
    }, {
        //     name: 'Bing',
        //     provider: L.Geocoders.BingGeocode
        // }, {
        //     name: 'ESRI',
        //     provider: L.Geocoders.ESRIGeocode
        // }, {
        //     name: 'Geonames',
        //     provider: L.Geocoders.GeonamesGeocode
        // }, {
        //     name: 'MapQuest',
        //     provider: L.Geocoders.MapQuestGeocode
        // }, {
        //     name: 'Nokia',
        //     provider: L.Geocoders.NokiaGeocode
        // }, {
        name: 'Yandex',
        provider: L.Geocoders.YandexGeocode
    }];


    that.geocodeForm = new geocodeForm.controller({

        geocodeProviders: geocodeProviders,

        onSelect: function(georesult) {

            that.show();

            if (georesult.bounds) {
                that.map.closePopup();
                that._geocodelayer = new L.Rectangle(georesult.bounds);
                that.map.addLayer(that._geocodelayer);
                that.map.fitBounds(georesult.bounds);
            }

            (new L.Popup())
                .setLatLng(georesult.latlng)
                .setContent(georesult.content)
                .openOn(that.map);

        },

        onClose: function() {

            that.show();

        }
    });

    // Identification

    var identifyControl;

    var identifyProviders = [{
        name: "OSM",
        provider: L.Identifiers.OSMIdentify
    }, {
        name: "Google",
        provider: L.Identifiers.GoogleIdentify
    }, {
        name: "Bing",
        provider: L.Identifiers.BingIdentify
    }, {
        name: "Yandex",
        provider: L.Identifiers.YandexIdentify
    }, {
        name: "Yandex",
        provider: L.Identifiers.YandexIdentify
    }];

    var currentIdentifyProviderIndex = 0;

    var createIdentifyControl = function() {
        return new L.Control.identifyControl({
            'position': 'topright',
            'caption': 'OSM',
            'btnClass': 'fa fa-info', // string
            'onClick': function(a) {
                if (this._button.toggleStatus) {

                    that.removeIdentifier();

                } else {

                    that.setIdentifier(currentIdentifyProviderIndex);

                }

            }, // callback function
            'onSelect': function() {
                that.hide();
                that.chooseIdentifyProviderForm.show();
            },

            'hideText': true, // bool
            'maxWidth': 30, // number
            'doToggle': true, // bool
            'toggleStatus': false // bool
        })
    }

    that.chooseIdentifyProviderForm = new chooseIdentifyProviderForm.controller({

        list: identifyProviders,

        onClose: function(index) {

            that.show();
            that.setIdentifier(index);

        }
    });

    that.setIdentifier = function(index) {

        var map = that.map;

        console.log('off events on geojson');
        console.log(map._geojson);

        // map._geojson.off(L.FeatureGroup.EVENTS, map._geojson._propagateEvent, map._geojson);

        $.when(identifyProviders[index].provider()).then(function(layer) {

            if (that._identify) {
                map.removeLayer(that._identify);
            }

            that._identify = layer;

            map.addLayer(that._identify);

            currentIdentifyProviderIndex = index;

            identifyControl.setCaption(identifyProviders[index].name);

        }, function(e) {

        });

    }

    that.removeIdentifier = function() {
        var map = that.map;
        if (that._identify) {
            map.removeLayer(that._identify);
        }
        that._identify = undefined;
    }

    // Tracking

    var trackingControl;

    var watchId;

    var createTreackingControl = function() {
        return new L.Control.Button({
            'position': 'bottomright',
            'class': 'fap fap-walking', //crosshairs
            'onClick': function() {
                if (!this._button.toggleStatus) {


                    var trackIcon = L.iMarker({
                        icon: 'walking',
                        markerColor: 'orange',
                        prefix: 'fap'
                    });

                    var onSuccess = function(position) {

                        if (!that._trackMarker) {
                            that._trackMarker = L.marker([
                                position.coords.latitude,
                                position.coords.longitude
                            ], {
                                icon: trackIcon
                            });
                            that._trackMarker.addTo(that.map);
                        } else {
                            that._trackMarker.setLatLng([
                                position.coords.latitude,
                                position.coords.longitude
                            ]);
                        }

                        that.map.panTo([position.coords.latitude,
                            position.coords.longitude
                        ]);


                        console.log('Latitude: ' + position.coords
                            .latitude + '\n' +
                            'Longitude: ' + position.coords.longitude +
                            '\n' +
                            'Altitude: ' + position.coords.altitude +
                            '\n' +
                            'Accuracy: ' + position.coords.accuracy +
                            '\n' +
                            'Altitude Accuracy: ' + position.coords
                            .altitudeAccuracy + '\n' +
                            'Heading: ' + position.coords.heading +
                            '\n' +
                            'Speed: ' + position.coords.speed +
                            '\n' +
                            'Timestamp: ' + position.timestamp +
                            '\n');
                    };

                    // onError Callback receives a PositionError object
                    //
                    var onError = function(error) {
                        console.log('code: ' + error.code +
                            '\n' +
                            'message: ' + error.message + '\n');
                    }



                    watchId = navigator.geolocation.watchPosition(
                        onSuccess,
                        onError, {
                            maximumAge: 3000,
                            timeout: 5000,
                            enableHighAccuracy: true
                        }
                    );

                } else {
                    navigator.geolocation.clearWatch(watchId);
                    if (that._trackMarker) {
                        that.map.removeLayer(that._trackMarker);
                        that._trackMarker = undefined;
                    }

                }





            }, // callback function
            'hideText': true, // bool
            'maxWidth': 30, // number
            'doToggle': true, // bool
            'toggleStatus': false // bool
        });
    }


    // Show/Hide 

    that.visible = m.prop(true);

    that.show = function() {
        m.startComputation();
        that.visible(true);
        m.endComputation();
    }

    that.hide = function() {
        m.startComputation();
        that.visible(false);
        m.endComputation();
    }

    // after render View

    setTimeout(function() {

        var map = L.map('map1', {
            keyboard: false
        }).setView([51.505, -0.09], 18);

        that._baseLayer = L.tileLayer(
            'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
                maxZoom: 18
            });

        map.addLayer(that._baseLayer);

        identifyControl = createIdentifyControl().addTo(map);

        trackingControl = createTreackingControl().addTo(map);

        L.control.scale().addTo(map);

        map.on('popupclose', function(e) {

            if (that._geocodelayer) {
                that.map.removeLayer(that._geocodelayer);
            }

        })

        map.on('click', function(e) {
            console.log('click map');

        })


        $.ajax({
            url: 'data/boundary.simple0.geojson',
            dataType: 'json'
        })
            .done(function(geojsonFeature) {
                map._geojson = L.geoJson(geojsonFeature, {
                    onEachFeature: function(feature, layer) {

                        layer.on({
                            click: function(e) {
                                if (identifyControl._button.toggleStatus) {
                                    that.map.fire('click', e);
                                } else {
                                    console.log(
                                        'click on layer', e)
                                }
                            }
                        });
                    }
                });
                map._geojson.addTo(map);


            });



        // $.ajax({
        //     url : 'http://earthquake.usgs.gov/earthquakes/feed/geojsonp/2.5/week'
        //         , dataType : 'jsonp'
        //         , jsonpCallback: 'eqfeed_callback'
        // })
        // .done(function(geojsonFeature){
        //     //console.log(geojsonFeature);
        //     L.geoJson(geojsonFeature).addTo(map);
        // });



        that.map = map;

        function debounce(func, wait, immediate) {
            var timeout;
            return function() {
                var context = this,
                    args = arguments;
                clearTimeout(timeout);
                timeout = setTimeout(function() {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                }, wait);
                if (immediate && !timeout) func.apply(context, args);
            };
        };

        map.on('zoomanim', debounce(map._onZoomTransitionEnd, 250));


    }, 10);

};

module.exports = mapsample;