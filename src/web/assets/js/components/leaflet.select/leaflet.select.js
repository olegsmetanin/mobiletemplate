module.exports = function(L) {

    L.Control.Select = L.Control.extend({
        options: {
            position: 'bottomleft'
        },
        initialize: function(options) {
            this._button = {};
            this.setButton(options);
        },

        onAdd: function(map) {
            this._map = map;
            var container = L.DomUtil.create('div', 'leaflet-control');

            this._container = container;

            this._update();
            return this._container;
        },

        onRemove: function(map) {},

        setButton: function(options) {
            var button = {
                'onClick': options.onClick //callback function
            };

            this._button = button;
            if (options.position) {
                this.setPosition(options.position);
            }
            this._update();
        },

        destroy: function() {
            this._button = {};
            this._update();
        },

        _update: function() {
            if (!this._map) {
                return;
            }

            this._container.innerHTML = '';
            this._makeSelect(this._button);

        },

        _makeSelect: function(button) {
            var newSelect = L.DomUtil.create('span', 'leaflet-bar-part', this._container);
			newSelect.innerHTML = '<select><option>OSM</option><option>Google</option><option>Bing</option></select>';


            L.DomEvent
                .addListener(newSelect, 'click', L.DomEvent.stop)
                .addListener(newSelect, 'click', button.onClick, this)
                .addListener(newSelect, 'click', this._clicked, this);
            L.DomEvent.disableClickPropagation(newSelect);
            return newSelect;

        },

        _clicked: function() { //'this' refers to button
            return;
        }

    });

}