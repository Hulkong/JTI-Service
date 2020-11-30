/*
 * L.TileLayer is used for standard xyz-numbered tile layers.
 */

L.DaumApi = L.Class.extend({
	includes: L.Mixin.Events,

	options: {
		tileSize: 256,
		
		
		subdomains: "0123",
		continuousWorld: true,
		attribution: "&copy; <a href=\"http://map.daum.net\">daum</a>",
		tms: true,
		
		
		errorTileUrl: '',
		opacity: 1,
		noWrap: false
	},

	// Possible types: SATELLITE, ROADMAP, HYBRID
	initialize: function(type, options) {
		L.Util.setOptions(this, options);

		this._type = daum.maps.MapTypeId[type || 'HYBRID'];
	},

	onAdd: function(map, insertAtTheBottom) {
		this._map = map;
		this._insertAtTheBottom = insertAtTheBottom;

		// create a container div for tiles
		this._initContainer();
		this._initMapObject();

		// set up events
		map.on('viewreset', this._resetCallback, this);

		this._limitedUpdate = L.Util.limitExecByInterval(this._update, 150, this);
		map.on('move', this._update, this);
		//map.on('moveend', this._update, this);

		this._reset();
		this._update();
	},

	onRemove: function(map) {
//		this._map._container.removeChild(this._container);
		this._container.parentNode.removeChild(this._container);
		//this._container = null;

		this._map.off('viewreset', this._resetCallback, this);

		this._map.off('move', this._update, this);
		//this._map.off('moveend', this._update, this);
	},

	getAttribution: function() {
		return this.options.attribution;
	},

	setOpacity: function(opacity) {
		this.options.opacity = opacity;
		if (opacity < 1) {
			L.DomUtil.setOpacity(this._container, opacity);
		}
	},

	_initContainer: function() {
		var tilePane = this._map._container
			first = tilePane.firstChild;

		if (!this._container) {
			this._container = L.DomUtil.create('div', 'leaflet-daum-layer');
			this._container.id = "_DaumMapContainer";
		}

		if (true) {
			tilePane.insertBefore(this._container, first);

			this.setOpacity(this.options.opacity);
			var size = this._map.getSize();
			this._container.style.zIndex = 1;
			this._container.style.width = size.x + 'px';
			this._container.style.height = size.y + 'px';
		}
	},

	_initMapObject: function() {
//		new daum.maps.LatLng(center.lat, center.lon) :
		this._daum_center = new daum.maps.LatLng(0, 0);
		var map = new daum.maps.Map(this._container, {
		    center: this._daum_center,
		    zoom: 0,
		    mapTypeId: this._type,
		    draggable: false,
		    scrollwheel: false
		});

		var _this = this;
	
		map.backgroundColor = '#ff0000';
		this._daum = map;
	},

	_resetCallback: function(e) {
		this._reset(e.hard);
	},

	_reset: function(clearOldContainer) {
		this._initContainer();
	},

	_update: function() {
		this._resize();

		var bounds = this._map.getBounds();
		var ne = bounds.getNorthEast();
		var sw = bounds.getSouthWest();
		var daum_sw = new daum.maps.LatLng(sw.lat, sw.lng);
	    var daum_ne = new daum.maps.LatLng(ne.lat, ne.lng);
		var daum_bounds = new daum.maps.LatLngBounds(daum_sw, daum_ne); 
		var center = this._map.getCenter();
		var _center = new daum.maps.LatLng(center.lat, center.lng);
		var daumZoom = (this.options.maxZoom + 1) - this._map.getZoom();

		this._daum.setCenter(_center);
		this._daum.setLevel(daumZoom);
	},

	_resize: function() {
		var size = this._map.getSize();
		if (this._container.style.width == size.x &&
		    this._container.style.height == size.y)
			return;
		this._container.style.width = size.x + 'px';
		this._container.style.height = size.y + 'px';
	},

	onReposition: function() {
	},
	bringToBack: function () {
		var pane = this._map._panes.tilePane;

		if (this._container) {
			pane.insertBefore(this._container, pane.firstChild);
			this._setAutoZIndex(pane, Math.min);
		}

		return this;
	},
	_setAutoZIndex: function (pane, compare) {

		var layers = pane.children,
		    edgeZIndex = -compare(Infinity, -Infinity), // -Infinity for max, Infinity for min
		    zIndex, i, len;

		for (i = 0, len = layers.length; i < len; i++) {

			if (layers[i] !== this._container) {
				zIndex = parseInt(layers[i].style.zIndex, 10);

				if (!isNaN(zIndex)) {
					edgeZIndex = compare(edgeZIndex, zIndex);
				}
			}
		}

		this.options.zIndex = this._container.style.zIndex =
		        (isFinite(edgeZIndex) ? edgeZIndex : 0) + compare(1, -1);
	}
});