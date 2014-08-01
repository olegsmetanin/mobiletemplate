module.exports = function(L, jQuery) {

var $ = jQuery;

L.Geocoders = {};

L.Geocoders.APILoaders = {

    loadGoogleApi: function() {
        var dfd = new jQuery.Deferred();

        if ((typeof google === 'undefined') || (typeof google.maps==='undefined')) {
            $.getScript('https://www.google.com/jsapi', function() {
                google.load('maps', '3', {
                    other_params: 'sensor=false'
                    , callback: function() {
                        dfd.resolve()
                    }
                });
            });
        } else dfd.resolve();

        return dfd.promise();
    }

    , loadYandexApi: function() {
        var dfd = new jQuery.Deferred();

        if (typeof ymaps === 'undefined') {
            $.getScript('http://api-maps.yandex.ru/2.0/?load=package.map&lang=' + (window.navigator.userLanguage || window.navigator.language), function() {
                dfd.resolve()
            });
        } else dfd.resolve();

        return dfd.promise();
    }

}

L.Geocoders.OSMGeocode = function (options) {
    var that = this;

    var dfd = new jQuery.Deferred();

    $.ajax({
        url : 'http://nominatim.openstreetmap.org/search'
        , dataType : 'jsonp'
        , jsonp : 'json_callback'
        , data : {
            'q' : options.query
            , 'format' : 'json'
        }
    })
    .done(function(data){
        if (data.length>0) {
            var result = [];
            for (var i=0; i<data.length; i++) {
                var res=data[i]
                    , bounds = new L.LatLngBounds([res.boundingbox[0], res.boundingbox[2]], [res.boundingbox[1], res.boundingbox[3]]);
               result.push({
                content : res.display_name
                , latlng : new L.LatLng(res.lat, res.lon)
                , bounds : bounds
                })    
            }
            dfd.resolve(result); 
        } else {
           dfd.reject();  
        }
    });

    return dfd.promise();
}

L.Geocoders.GoogleGeocode = function (options) {
    var that = this;

    var dfd = new jQuery.Deferred();

    $.when(L.Geocoders.APILoaders.loadGoogleApi()).done(function () {

        var geocoder = new google.maps.Geocoder();
        geocoder.geocode( { 'address': options.query }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var result = [];
                for (var i=0; i<results.length;i++) {
                   var res = results[0]
                    , resbounds = res.geometry.bounds ? res.geometry.bounds : res.geometry.viewport
                    , bounds = new L.LatLngBounds([
                            resbounds.getSouthWest().lat(), resbounds.getSouthWest().lng()
                            ], [
                            resbounds.getNorthEast().lat(), resbounds.getNorthEast().lng()
                    ]); 
                    result.push({
                        content : res.formatted_address
                        , latlng : new L.LatLng(res.geometry.location.lat(), res.geometry.location.lng())
                        , bounds : bounds
                    });

                }



                dfd.resolve(result);
            } else {
                dfd.reject();  
            }
        });

    });

    return dfd.promise();
}

L.Geocoders.BingGeocode = function (options) {
    var that = this;

    var dfd = new jQuery.Deferred();

    $.ajax({
        url : 'http://dev.virtualearth.net/REST/v1/Locations'
        , dataType : 'jsonp'
        , jsonp : 'jsonp'
        , data : {
            'q' : options.query
            , 'key' : L.Geocoders.prototype.apikeys['bing'].value
        }
    })
    .done(function(data){
        if ((data.resourceSets.length>0) && (data.resourceSets[0].resources.length>0)) {
            var res=data.resourceSets[0].resources[0]
            , bounds = new L.LatLngBounds([res.bbox[0], res.bbox[1]], [res.bbox[2], res.bbox[3]]);
            dfd.resolve({
                content : res.name
                , latlng : new L.LatLng(res.point.coordinates[0], res.point.coordinates[1])
                , bounds : bounds
            });
        }
    });

    return dfd.promise();
}

L.Geocoders.ESRIGeocode = function (options) {
    var that = this;

    var dfd = new jQuery.Deferred();

    $.ajax({
        url : 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/find'
        , dataType : 'jsonp'
        , data : {
            'text' : options.query
            , 'f' : 'pjson'
        }
    })
    .done(function(data){
        if (data.locations.length>0) {
            var res=data.locations[0]
                , bounds = new L.LatLngBounds([res.extent.ymin, res.extent.xmin], [res.extent.ymax, res.extent.xmax]);

            dfd.resolve({
                content : res.name
                , latlng : new L.LatLng(res.feature.geometry.y, res.feature.geometry.x)
                , bounds : bounds
            });
        }
    });

    return dfd.promise();
}

L.Geocoders.YandexGeocode = function (options) {
    var that = this;

    var dfd = new jQuery.Deferred();

    $.ajax({
        url : 'http://geocode-maps.yandex.ru/1.x/'
        , dataType : 'jsonp'
        , data : {
            'geocode' : options.query
            , 'format' : 'json'
        }
    })
    .done(function(data0){
        var in_data = data0.response.GeoObjectCollection.featureMember;
        if (in_data.length>0) {
            var result = [];
            for (var i=0; i<in_data.length;i++) {
                var res=in_data[i].GeoObject
                , points = res.Point.pos.split(' ')
                , lowerCorner = res.boundedBy.Envelope.lowerCorner.split(' ')
                , upperCorner = res.boundedBy.Envelope.upperCorner.split(' ')
                , content = res.metaDataProperty.GeocoderMetaData.text
                , bounds = new L.LatLngBounds([lowerCorner[1], lowerCorner[0]], [upperCorner[1], upperCorner[0]]);
                result.push({
                    content : content
                    , latlng : new L.LatLng(points[1], points[0])
                    , bounds: bounds
                })
            }
            dfd.resolve(result);
        } else {
            dfd.reject(); 
        }
    });

    return dfd.promise();
}

L.Geocoders.GeonamesGeocode = function (options) {
    var that = this;

    var dfd = new jQuery.Deferred();

    $.ajax({
        url : 'http://ws.geonames.org/searchJSON'
        , dataType : 'jsonp'
        , data : {
            'q' : options.query
            , 'style' : 'full'
            , 'maxRows' : '1'
        }
    })
    .done(function(data){
        if (data.geonames.length > 0) {
            var res=data.geonames[0]
                , bounds = new L.LatLngBounds([res.bbox.south, res.bbox.west], [res.bbox.north, res.bbox.east]);

            dfd.resolve({
                content : res.name
                , latlng : new L.LatLng(res.lat, res.lng)
                , bounds : bounds
            });
        }
    });

    return dfd.promise();
}

L.Geocoders.MapQuestGeocode = function (options) {
    var that = this;

    var dfd = new jQuery.Deferred();

    $.ajax({
        url : 'http://www.mapquestapi.com/geocoding/v1/address'
        , dataType : 'jsonp'
        , data : {
            'location' : options.query
            , 'key' :  L.Geocoders.prototype.apikeys['mapquest'].value
            , 'outFormat' : 'json'
            , 'maxResults' : '1'
        }
    })
    .done(function(data){
        if (data.results.length > 0 && data.results[0].locations.length > 0) {
            var res=data.results[0]
                , location = res.locations[0].latLng
                , bounds = new L.LatLngBounds([location.lat-1, location.lng-1], [location.lat+1, location.lng+1]);
            dfd.resolve({
                content : res.providedLocation.location
                , latlng : new L.LatLng(location.lat, location.lng)
                , bounds : bounds
            });
        }
    });

    return dfd.promise();
}

L.Geocoders.NokiaGeocode = function (options) {
    var that = this;

    var dfd = new jQuery.Deferred();

    $.ajax({
        url : 'http://geo.nlp.nokia.com/search/6.2/geocode.json'
        , dataType : 'jsonp'
        , jsonp : 'jsoncallback'
        , data : {
            'searchtext' : options.query
            , 'app_id' : L.Geocoders.prototype.apikeys['nokia'].value
        }
    })
    .done(function(data){
        if (data.Response.View.length > 0 && data.Response.View[0].Result.length > 0) {
            var res=data.Response.View[0].Result[0]
                , bounds = new L.LatLngBounds([res.extent.ymin, res.extent.xmin], [res.extent.ymax, res.extent.xmax]);
            dfd.resolve({
                content : res.name
                , latlng : new L.LatLng(res.Location.DisplayPosition.Latitude, res.Location.DisplayPosition.Longitude)
                , bounds : bounds
            });
        }
    });

    return dfd.promise();
}

}