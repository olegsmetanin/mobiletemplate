module.exports = function(L) {

    L.Control.identifyControl = L.Control.extend({
        options: {
            position: 'bottomleft'
        },
        initialize: function(options) {
            this._button = {};
            this.setButton(options);
        },

        onAdd: function(map) {
            this._map = map;
            var container = L.DomUtil.create('div', 'leaflet-identify');

            this._container = container;

            this._update();
            return this._container;
        },

        onRemove: function(map) {},

        setButton: function(options) {
            var button = {
                'btnClass': options.btnClass, //string
                'onClick': options.onClick, //callback function
                'onSelect': options.onSelect, //callback function
                'doToggle': options.doToggle, //bool
                'toggleStatus': options.toggleStatus,//bool,
                'caption':options.caption
            };

            this._button = button;
            if (options.position) {
                this.setPosition(options.position);
            }
            this._update();
        },

        setCaption:function (newCaption) {
            this._button.caption=newCaption;
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
            
            if (button.toggleStatus) {
                var selectButton = L.DomUtil.create('a', '', this._container);
                selectButton.innerHTML=button.caption;
                selectButton.href = '#';
                L.DomEvent
                    .addListener(selectButton, 'click', L.DomEvent.stop)
                    .addListener(selectButton, 'click', button.onSelect, this)
                L.DomEvent.disableClickPropagation(selectButton);
            }

            var newButton = L.DomUtil.create('a', '', this._container);
            L.DomUtil.create('i', button.btnClass , newButton);
            newButton.href = '#';

            L.DomEvent
                .addListener(newButton, 'click', L.DomEvent.stop)
                .addListener(newButton, 'click', button.onClick, this)
                .addListener(newButton, 'click', this._clicked, this);
            L.DomEvent.disableClickPropagation(newButton);
            return newButton;

        },

        _clicked: function() { //'this' refers to button
            console.log('clicked');
            if (this._button.doToggle) {
                if (this._button.toggleStatus) { //currently true, remove class
                    L.DomUtil.removeClass(this._container, 'active');
                } else {
                    L.DomUtil.addClass(this._container, 'active');
                }
                this.toggle();
            }
            return;
        }

    });

}