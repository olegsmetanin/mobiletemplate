module.exports = function(L, jQuery) {

var $ = jQuery;

L.Identifiers = {};

L.Identifiers.APILoaders = {

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


L.Identifiers.LayersFactory = {

    createSimpleIndentifyLayer: function(clickPromise) {
        return L.Class.extend({

            initialize: function () {
            }

            , onAdd: function (map) {
                this._map = map;
                map.on('click', this._click, this);
                map.on('popupclose', this._popupClose, this);
            }

            , onRemove: function (map) {
                map.off('click', this._click, this);
                map.off('popupclose', this._popupClose, this);
            }

            , _popupClose: function (e) {
                var that = this;

                if (that._layer) {
                    that._map.removeLayer(that._layer);
                }
            }

            , _click: function (e) {
                console.log('identify click',e);
                var that = this;

                $.when(clickPromise(e.latlng)).done(function (georesult) {

                    if (georesult.layer) {
                        that._layer = georesult.layer;
                        that._map.addLayer(that._layer);
                    }

                    (new L.Popup())
                    .setLatLng(georesult.latlng)
                    .setContent(georesult.content)
                    .openOn(that._map);
                });

            }
        });
    }

}


L.Identifiers.OSMIdentify = function (options) {
    var that = this;

    var dfd = new jQuery.Deferred();

    var identify = function (latlng) {

        var dfdid = new jQuery.Deferred();

        $.ajax({
            url : 'http://nominatim.openstreetmap.org/reverse'
            , dataType : 'jsonp'
            , jsonp : 'json_callback'
            , data : {
                'lat' : latlng.lat
                , 'lon': latlng.lng
                , 'format' : 'json'
            }
        })
        .done(function(data){
            if (data) {
                var res=data;
                dfdid.resolve({
                    content : res.display_name
                    , latlng : new L.LatLng(res.lat, res.lon)
                });
            }
        });

        return dfdid.promise();
    }

    var layer = new (L.Identifiers.LayersFactory.createSimpleIndentifyLayer(identify))();

    var geomanager={
        options: options
    };

    layer.geomanager = geomanager;

    dfd.resolve(
        layer
    )

    return dfd.promise();
}

L.Identifiers.GoogleIdentify = function (options) {
    var that = this;

    var dfd = new jQuery.Deferred();

    $.when(L.Identifiers.APILoaders.loadGoogleApi()).done(function () {

        var identify = function (latlng) {

            var dfdid = new jQuery.Deferred();

            var geocoder = new google.maps.Geocoder();

            geocoder.geocode({ 'latLng': new google.maps.LatLng(latlng.lat, latlng.lng)}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {

                    var res=results[0]
                        , bounds = new L.LatLngBounds([
                            res.geometry.viewport.getSouthWest().lat(), res.geometry.viewport.getSouthWest().lng()
                            ], [
                            res.geometry.viewport.getNorthEast().lat(), res.geometry.viewport.getNorthEast().lng()
                        ]);

                    dfdid.resolve({
                        content : res.formatted_address
                        , latlng : new L.LatLng(res.geometry.location.lat(), res.geometry.location.lng())
                        , bounds : bounds
                        , layer: new L.Rectangle(bounds)
                    });
                }
            });

            return dfdid.promise();
        }

        var layer = new (L.Identifiers.LayersFactory.createSimpleIndentifyLayer(identify))();

        var geomanager={
            options: options
        };

        layer.geomanager = geomanager;

        dfd.resolve(
            layer
        )


    });

    return dfd.promise();
}

L.Identifiers.BingIdentify = function (options) {
    var that = this;

    var dfd = new jQuery.Deferred();

    var identify = function (latlng) {

        var dfdid = new jQuery.Deferred();

        $.ajax({
            url : 'http://dev.virtualearth.net/REST/v1/Locations/'+latlng.lat+','+latlng.lng
            , dataType : 'jsonp'
            , jsonp : 'jsonp'
            , data : {
                'key' : options.key
            }
        })
        .done(function(data){
            if ((data.resourceSets.length>0) && (data.resourceSets[0].resources.length>0)) {
                var res=data.resourceSets[0].resources[0]
                    , bounds = new L.LatLngBounds([res.bbox[0], res.bbox[1]], [res.bbox[2], res.bbox[3]]);
                dfdid.resolve({
                    content : res.name
                    , latlng : new L.LatLng(res.point.coordinates[0], res.point.coordinates[1])
                    , bounds : bounds
                    , layer: new L.Rectangle(bounds)
                });
            }
        });

        return dfdid.promise();
    }

    var layer = new (L.Identifiers.LayersFactory.createSimpleIndentifyLayer(identify))();

    var geomanager={
        options: options
    };

    layer.geomanager = geomanager;

    dfd.resolve(
        layer
    )

    return dfd.promise();
}

L.Identifiers.YandexIdentify = function (options) {
    var that = this;

    var dfd = new jQuery.Deferred();

    var identify = function (latlng) {

        var dfdid = new jQuery.Deferred();

            $.ajax({
                url : 'http://geocode-maps.yandex.ru/1.x/'
                , dataType : 'jsonp'
                , data : {
                    'geocode' : latlng.lng + ',' + latlng.lat
                    , 'format' : 'json'
                }
            })
            .done(function(data){
                if (data.response.GeoObjectCollection.featureMember.length>0) {
                    var res=data.response.GeoObjectCollection.featureMember[0].GeoObject
                        , points = res.Point.pos.split(' ')
                        , lowerCorner = res.boundedBy.Envelope.lowerCorner.split(' ')
                        , upperCorner = res.boundedBy.Envelope.upperCorner.split(' ')
                        , content = res.metaDataProperty.GeocoderMetaData.text
                        , bounds = new L.LatLngBounds([lowerCorner[1], lowerCorner[0]], [upperCorner[1], upperCorner[0]]);

                    dfdid.resolve({
                        content : content
                        , latlng : new L.LatLng(points[1], points[0])
                        , bounds : bounds
                        , layer: new L.Rectangle(bounds)
                    });
                }
            });

        return dfdid.promise();
    }

    var layer = new (L.Identifiers.LayersFactory.createSimpleIndentifyLayer(identify))();

    var geomanager={
        options: options
    };

    layer.geomanager = geomanager;

    dfd.resolve(
        layer
    )

    return dfd.promise();
}

}