var L = require('leaflet');
var $ = require('./../j/j.js');
require('./../leaflet.button/leaflet.button.js')(L);
require('./../leaflet.identifyControl/leaflet.identifyControl.js')(L);
require('./../leaflet.select/leaflet.select.js')(L);
require('./../leaflet.geocoders/leaflet.geocoders.js')(L, $);
require('./../leaflet.layers/leaflet.layers.js')(L, $);
require('./../leaflet.identifiers/leaflet.identifiers.js')(L, $);
require('./../leaflet.imarker/leaflet.imarker.js')(L);

L.Icon.Default.imagePath = "assets/img";

module.exports = L;