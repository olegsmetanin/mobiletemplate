module.exports = function(L, jQuery) {

require('./bing.js')(L);
require('./google.js')(L);
require('./yandex.js')(L);



var $ = jQuery;

L.LayerManager = {};

L.LayerManager.APILoaders = {

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

L.LayerManager.ProvidersFactory = {

    createSimpleTileLayerProvider: function (options) {
        return function (layer_options) {
            var dfd = new jQuery.Deferred()
                , layer = new L.TileLayer(options.url, options);

            dfd.resolve(layer);

            return dfd.promise();
        }
    }

    , createGoogleLayerProvider: function (options) {
        return function (layer_options) {
            var dfd = new jQuery.Deferred();

            $.when(L.LayerManager.APILoaders.loadGoogleApi()).done(function () {
                var layer = new L.Google(options.googlelayer);


                dfd.resolve(layer);
            });

            return dfd.promise();
        }
    }

    , createBingLayerProvider: function (options) {
        return function (layer_options) {
            var dfd = new jQuery.Deferred()
                , layer = new L.BingLayer(layer_options.key, options.binglayer);

            dfd.resolve(layer);


            return dfd.promise();
        }
    }

    , createYandexLayerProvider: function (options) {
        return function (layer_options) {
            var dfd = new jQuery.Deferred();

            $.when(L.LayerManager.APILoaders.loadYandexApi()).done(function () {
                var layer = new L.Yandex(options.yandexlayer);

                dfd.resolve(layer);
            });

            return dfd.promise();
        }
    }

    // , createArcGIS_EPSG900913_LayerProvider: function (options) {
    //     return function (layer_options) {
    //         var that = this;

    //         var dfd = new jQuery.Deferred();

    //         ajaxopt = {
    //             url : layer_options.url
    //             , dataType : 'jsonp'
    //             , data : {
    //                 'f' : 'json'
    //             }
    //         }

    //         $.ajax(ajaxopt)
    //         .done( function (layerinfo){
    //             var layer = new L.ArcGIS_EPSG900913();

    //             dfd.resolve(
    //                 layer
    //             )

    //         });

    //         return dfd.promise();
    //     }
    // }


}


/*
    Baselayers
*/

L.LayerManager.White = L.LayerManager.ProvidersFactory.createSimpleTileLayerProvider({
    name: 'white'
    , type: 'baselayers'
    , url: 'img/1x1white.gif'
})

L.LayerManager.Black = L.LayerManager.ProvidersFactory.createSimpleTileLayerProvider({
    name: 'black'
    , type: 'baselayers'
    , url: 'img/1x1black.gif'
})

L.LayerManager.OSM = L.LayerManager.ProvidersFactory.createSimpleTileLayerProvider({
    name: 'osm'
    , type: 'baselayers'
    , url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    , attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
})

L.LayerManager.OSMBW = L.LayerManager.ProvidersFactory.createSimpleTileLayerProvider({
    name: 'osmbw'
    , type: 'baselayers'
    , url: 'http://{s}.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png'
    , attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
})

L.LayerManager.OSMCloudMade = L.LayerManager.ProvidersFactory.createSimpleTileLayerProvider({
    name: 'osmcloudmade'
    , type: 'baselayers'
    , key: function() {
        return L.LayerManager.prototype.apikeys['cloudmade'].value
    }
    , url: 'http://{s}.tile.cloudmade.com/{key}/997/256/{z}/{x}/{y}.png'
    , attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
})

L.LayerManager.OpenCycleMap = L.LayerManager.ProvidersFactory.createSimpleTileLayerProvider({
    name: 'opencyclemap'
    , type: 'baselayers'
    , url: 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png'
    , attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, <a href="http://www.opencyclemap.org">OpenCycleMap</a>'
})

L.LayerManager.OpenCycleMapTransport = L.LayerManager.ProvidersFactory.createSimpleTileLayerProvider({
    name: 'opencyclemaptransport'
    , type: 'baselayers'
    , url: 'http://{s}.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png'
    , attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, <a href="http://www.opencyclemap.org">OpenCycleMap</a>'
})

L.LayerManager.OpenCycleMapLandscape = L.LayerManager.ProvidersFactory.createSimpleTileLayerProvider({
    name: 'opencyclemaplandscape'
    , type: 'baselayers'
    , url: 'http://{s}.tile3.opencyclemap.org/landscape/{z}/{x}/{y}.png'
    , attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, <a href="http://www.opencyclemap.org">OpenCycleMap</a>'
})

L.LayerManager.MapQuest = L.LayerManager.ProvidersFactory.createSimpleTileLayerProvider({
    name: 'mapquest'
    , type: 'baselayers'
    , url: 'http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpeg'
    , subdomains: '1234'
    , attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a>'
})

L.LayerManager.MapQuestAerial = L.LayerManager.ProvidersFactory.createSimpleTileLayerProvider({
    name: 'mapquestaerial'
    , type: 'baselayers'
    , url: 'http://oatile{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg'
    , subdomains: '1234'
    , attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a>, Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency'
})

L.LayerManager.StamenToner = L.LayerManager.ProvidersFactory.createSimpleTileLayerProvider({
    name: 'samentoner'
    , type: 'baselayers'
    , url: 'http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png'
    , attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>'
    , maxZoom: 20
})

L.LayerManager.StamenTerrain = L.LayerManager.ProvidersFactory.createSimpleTileLayerProvider({
    name: 'samenterrain'
    , type: 'baselayers'
    , url: 'http://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.jpg'
    , attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>'
    , minZoom: 4
    , maxZoom: 18
})

L.LayerManager.StamenWatercolor = L.LayerManager.ProvidersFactory.createSimpleTileLayerProvider({
    name: 'samenwatercolor'
    , type: 'baselayers'
    , url: 'http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg'
    , attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>'
    , minZoom: 3
    , maxZoom: 16
})

L.LayerManager.ESRIStreetMap = L.LayerManager.ProvidersFactory.createSimpleTileLayerProvider({
    name: 'esristreetmap'
    , type: 'baselayers'
    , url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'
    , attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
})

L.LayerManager.ESRITopoMap = L.LayerManager.ProvidersFactory.createSimpleTileLayerProvider({
    name: 'esritopomap'
    , type: 'baselayers'
    , url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
    , attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
})

L.LayerManager.ESRIImagery = L.LayerManager.ProvidersFactory.createSimpleTileLayerProvider({
    name: 'esriimagery'
    , type: 'baselayers'
    , url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    , attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
})

L.LayerManager.GoogleRoadmap = L.LayerManager.ProvidersFactory.createGoogleLayerProvider({
    name: 'googleroadmap'
    , type: 'baselayers'
    , googlelayer: 'ROADMAP'
});

L.LayerManager.GoogleSatellite = L.LayerManager.ProvidersFactory.createGoogleLayerProvider({
    name: 'googlesatellite'
    , type: 'baselayers'
    , googlelayer: 'SATELLITE'
});

L.LayerManager.GoogleHybrid = L.LayerManager.ProvidersFactory.createGoogleLayerProvider({
    name: 'googlehybrid'
    , type: 'baselayers'
    , googlelayer: 'HYBRID'
});

L.LayerManager.GoogleTerrain = L.LayerManager.ProvidersFactory.createGoogleLayerProvider({
    name: 'googleterrain'
    , type: 'baselayers'
    , googlelayer: 'TERRAIN'
});

L.LayerManager.BingRoad = L.LayerManager.ProvidersFactory.createBingLayerProvider({
    name: 'bingroad'
    , type: 'baselayers'
    , binglayer: {type:'Road'}
});

L.LayerManager.BingAerial = L.LayerManager.ProvidersFactory.createBingLayerProvider({
    name: 'bingaerial'
    , type: 'baselayers'
    , binglayer: {type:'Aerial'}
});

L.LayerManager.BingAerialWithLabels = L.LayerManager.ProvidersFactory.createBingLayerProvider({
    name: 'bingaerialwithlabels'
    , type: 'baselayers'
    , binglayer: {type:'AerialWithLabels'}
});


L.LayerManager.YandexMap = L.LayerManager.ProvidersFactory.createYandexLayerProvider({
    name: 'yandexmap'
    , type: 'baselayers'
    , yandexlayer: 'map'
});

L.LayerManager.YandexSatellite = L.LayerManager.ProvidersFactory.createYandexLayerProvider({
    name: 'yandexsatellite'
    , type: 'baselayers'
    , yandexlayer: 'satellite'
});

L.LayerManager.YandexHybrid = L.LayerManager.ProvidersFactory.createYandexLayerProvider({
    name: 'yandexhybrid'
    , type: 'baselayers'
    , yandexlayer: 'hybrid'
});

L.LayerManager.YandexPublicMap = L.LayerManager.ProvidersFactory.createYandexLayerProvider({
    name: 'yandexpublicmap'
    , type: 'baselayers'
    , yandexlayer: 'publicMap'
});

L.LayerManager.YandexPublicMapHybrid = L.LayerManager.ProvidersFactory.createYandexLayerProvider({
    name: 'yandexpublicmaphybrid'
    , type: 'baselayers'
    , yandexlayer: 'publicMapHybrid'
});

L.LayerManager.Wikimapia = L.LayerManager.ProvidersFactory.createSimpleTileLayerProvider({
    name: 'wikimapia'
    , type: 'baselayers'
    , url: 'http://{s}{hash}.wikimapia.org/?x={x}&y={y}&zoom={z}&r=7071412&type=&lng=1'
    , subdomains : 'i'
    // Fix L.Util.template to use this https://github.com/Leaflet/Leaflet/pull/1554
    , hash: function (data) {
        return data.x % 4 + (data.y % 4) *4;
    }
    , maxZoom: 18
    , attribution: '<a href="http://wikimapia.org" target="_blank">Wikimapia.org</a>'
});



}
