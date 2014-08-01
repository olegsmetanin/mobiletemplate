module.exports = function(L) {

    L.Control.Button = L.Control.extend({
        options: {
            position: 'bottomleft'
        },
        initialize: function(options) {
            this._button = {};
            this.setButton(options);
        },

        onAdd: function(map) {
            this._map = map;
            var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');

            this._container = container;

            this._update();
            return this._container;
        },

        onRemove: function(map) {},

        setButton: function(options) {
            var button = {
                'class': options.class, //string
                'onClick': options.onClick, //callback function
                'doToggle': options.doToggle, //bool
                'toggleStatus': options.toggleStatus//bool
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

        toggle: function(e) {
            if (typeof e === 'boolean') {
                this._button.toggleStatus = e;
            } else {
                this._button.toggleStatus = !this._button.toggleStatus;
            }
            this._update();
        },

        _update: function() {
            if (!this._map) {
                return;
            }

            this._container.innerHTML = '';
            this._makeButton(this._button);

        },

        _makeButton: function(button) {
            var newButton = L.DomUtil.create('a', 'leaflet-bar-part', this._container);

            if (button.toggleStatus)
                L.DomUtil.addClass(newButton, 'active');

            L.DomUtil.create('i', button.class , newButton);
            newButton.href = '#';

            L.DomEvent
                .addListener(newButton, 'click', L.DomEvent.stop)
                .addListener(newButton, 'click', button.onClick, this)
                .addListener(newButton, 'click', this._clicked, this);
            L.DomEvent.disableClickPropagation(newButton);
            return newButton;

        },

        _clicked: function() { //'this' refers to button
            if (this._button.doToggle) {
                if (this._button.toggleStatus) { //currently true, remove class
                    L.DomUtil.removeClass(this._container.childNodes[0], 'active');
                } else {
                    L.DomUtil.addClass(this._container.childNodes[0], 'active');
                }
                this.toggle();
            }
            return;
        }

    });

}