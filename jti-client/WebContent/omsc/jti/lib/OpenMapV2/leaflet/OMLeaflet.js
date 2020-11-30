L.TileLayer.WMS_V2 = L.TileLayer.WMS.extend({
	defaultWmsParams: {
		
	},

	initialize: function (url, options) { // (String, Object)

		this._url = url;
		L.extend(this.defaultWmsParams, options);
		var wmsParams = L.extend({}, this.defaultWmsParams),
		    tileSize = options.tileSize || this.options.tileSize;

		if (options.detectRetina && L.Browser.retina) {
			wmsParams.width = wmsParams.height = tileSize * 2;
		} else {
			wmsParams.width = wmsParams.height = tileSize;
		}

		for (var i in options) {
			// all keys that are not TileLayer options go to WMS params
			if (!this.options.hasOwnProperty(i) && i !== 'crs') {
				wmsParams[i] = options[i];
			}
		}

		this.wmsParams = wmsParams;

		L.setOptions(this, options);
	},
});


L.Draw.Circle = L.Draw.Circle.extend({
	_drawShape: function (latlng) {
		if (!this._shape) {
			this._shape = new L.Circle(this._startLatLng, this._startLatLng.distanceTo(latlng), this.options.shapeOptions);
			this._map.addLayer(this._shape);
		} else {
			var r = Math.floor(this._startLatLng.distanceTo(latlng) / 5) * 5 
			this._shape.setRadius(r);
			
		}
	}
	
});
L.tileLayer.wms_v2 = function (url, options) {
	return new L.TileLayer.WMS_V2(url, options);
};
var OpenmateSelfmap = (function(){
	
	this.option = null;
	this.map = null;
	this.crs = null;
	
	
	this.drawControl = null;
	this.drawCtrls = null;
	this.drawnItems = null;
	this.drawHandler = null;
	
	
	this.resolutionArr = [156543.03390625, 78271.516953125, 39135.7584765625,
	                  19567.87923828125, 9783.939619140625,
	                  4891.9698095703125, 2445.9849047851562,
	                  1222.9924523925781, 611.4962261962891,
	                  305.74811309814453, 152.87405654907226,
	                  76.43702827453613, 38.218514137268066,
	                  19.109257068634033, 9.554628534317017,
	                  4.777314267158508, 2.388657133579254,
	                  1.194328566789627, 0.5971642833948135];
	
	
	this.featureLayer = null; // geometry layer
	
	
	// 2017년 3월 9일 통일작
//	if(proj4){
//		
//	proj4.defs("katec", "+proj=tmerc +lat_0=38.0 +lon_0=128.0 +x_0=400000.0 +y_0=600000.0 +k=0.9999 +ellps=bessel +a=6377397.155 +b=6356078.9628181886 +units=m +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43");
//	proj4.defs("katec2", "+proj=tmerc +lat_0=38.0 +lon_0=128.0 +x_0=400000.0 +y_0=600000.0 +k=1.0 +a=6377397.155 +b=6356078.9633422494 +towgs84=-145.90,505.03,685.75,-1.162,2.347,1.592,6.342");
//	proj4.defs("EPSG:3857", "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null");
//	proj4.defs("EPSG:900913", "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null");
//	proj4.defs("EPSG:5181", "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
//	}
//	
	
	this.eventHandler = {};
	function OpenmateSelfmap(option){
		
		this.option = option;
		var elementid = this.option.ele_id;
		var center = this.option.center;
		var zoom = this.option.zoom;
		var maxZoom = (this.option.maxZoom) ? this.option.maxZoom : 18 ;
		var minZoom =  (this.option.minZoom) ? this.option.minZoom : 7 ;
		var crs = L.CRS.EPSG3857; //web map == google == EPSG:900913
		this.eventHandler = L.extend({}, option.eventHandler);
		
		if(this.option.baseMapType.toLowerCase().indexOf("daum") > -1) {
			crs = new L.Proj.CRS.TMS(
				    "EPSG:5181",
				    "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
				    [-30000, -60000, 494288, 988576],
				    { resolutions: [2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25] }
			);
			
		} else if(this.option.baseMapType.toLowerCase().indexOf("openmate") > -1) {
//			crs = new L.Proj.CRS.TMS(
//				    "EPSG:OPENMATE",
//				    "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null",
//				    [13814748.805522, 3868787.29756, 14694172.782667, 4678789.7959737],
//				    { resolutions: [ 1222.9924525624949, 611.49622628137968, 305.74811314055756, 152.87405657041106,
//					                  76.437028285073239, 38.21851414253662, 19.10925707126831, 9.5546285356341549,
//					                  4.7773142679493699, 2.3886571339746849, 1.1943285668550503, 0.59716428355981721 ] }
//			);
			crs = L.CRS.EPSG3857;
		} else {
			crs = L.CRS.EPSG3857;			
		}
		
//		obj.options = L.extend({}, obj.options, options);
		
		this.crs = crs;
		this.map = L.map( elementid ,{
			minZoom:minZoom,
			maxZoom:maxZoom,
			crs: crs,
			fadeAnimation:false,
			markerZoomAnimation:false,
			zoomAnimation:false,
//			continuousWorld: true,
	        zoomsliderControl: true,
	        zoomControl: false
	    }).setView(center, zoom);
		
		this.map.zoomsliderControl.setPosition("topright");
//		this.map.zoomControl.setPosition('topright');//simple zoom
		
		L.control.scale({metric:true,imperial:false}).addTo(this.map);
		
        // Set the title to show on the polygon button
//	        L.drawLocal.draw.toolbar.buttons.polygon = 'Draw a sexy polygon!';
//	        drawControl = new L.Control.Draw({
//	            position: 'topright',
//	            draw: {
//	                polyline: false,
//	                rectangle: false,
//	                polygon: true,
//	                circle: true,
//	                marker: false
//	            },
//	            edit: {
//	                featureGroup: drawnItems,
//	                remove: true
//	            }
//	        });
//	        map.addControl(drawControl);

		
		this.featureLayer = new L.FeatureGroup();
		this.featureLayer._id = "basic_feature";
		this.map.addLayer(this.featureLayer);
		
		
        this.drawnItems = new L.FeatureGroup();
        this.drawnItems._id = "draw_feature";
        this.map.addLayer(this.drawnItems);
        
//        L.drawLocal.draw.toolbar.buttons.polygon = 'Draw a sexy polygon!';
//        drawControl = new L.Control.Draw({
//            position: 'topright',
//            draw: {
//                polyline: false,
//                rectangle: false,
//                polygon: false,
//                circle: false,
//                marker: false
//            },
//            edit: {
//                featureGroup: this.drawnItems,
//                edit:{
//                	 selectedPathOptions: {
//            	        maintainColor: true,
//            	        moveMarkers: true
//            	      }
//                },
//                remove: true
//            }
//        });
//        this.map.addControl(drawControl);
        
        var me = this;
        this.drawCtrls = {
			  "circle" : new L.Draw.Circle(this.map, {draggable: true })
			, "polygon" : new L.Draw.Polygon(this.map, {allowIntersection: false})
        	, "rectangle" : new L.Draw.Rectangle(this.map, {})
        	, "polyline" : new L.Draw.Polyline(this.map, {})
		}
        this.drawHandler = {"circle" : function(){}, "polygon" :  function(){}, "polyline" : function(){}};
        this.map.on('draw:created', function (e) {
        	me.makeDrawnFeatrueData(e.layerType,e.layer);
        });
        
//        this.drawCtrls['circle'].on({
//        	  mousedown: function () {
//                  this.map.on('mousemove', function (e) {
//                   console.log(11);
//                  });
//                }
//        });
//        
//        this.map.on('mouseup',function(e){
//         	console.log('out');
//         })
        
        //측정 컨트롤 시작
        
        this.measureCtrls = {
        	"distance" : new L.Polyline.distance(this.map, {})
        	,"area" : new L.Polyline.area(this.map, {})
  		}
        this.measureHandler = {"distance" : function(){}, "area" :  function(){}};
        this.map.on('measure:finished', function (e,edata) {
        	var data =  { type: e.method,message: e.message };
        	me.measureHandler[e.method](data);
        });
        //측정 컨트롤 끝
        
        
        //클릭 이벤트 추가
		this.map.on('click', function(e) { 
			
			//그리기 및 측정시 클릭 이벤트를 중지 한다.
			var activateFlag = false;
			for ( var name in this.measureCtrls) {
				if(this.measureCtrls[name]._enabled){
					activateFlag = true;
					break;
				}
			}
			for ( var name in this.drawCtrls) {
				if(this.drawCtrls[name]._enabled){
					activateFlag = true;
					break;
				}
			}

			//그리기 및 측정시 클릭 이벤트를 중지 한다.
			
			
			///// 2017.03.09 
			
//			var EPSG3857 = L.CRS.EPSG3857;
//			var KATEC = new L.Proj.CRS(
//					'katec',
//					'+proj=tmerc +lat_0=38.0 +lon_0=128.0 +x_0=400000.0 +y_0=600000.0 +k=0.9999 +ellps=bessel +a=6377397.155 +b=6356078.9628181886 +units=m +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43');
//			
//			
//			var clickLatLng = e.latlng;
//			var latLng4326 = [clickLatLng.lat ,clickLatLng.lng ]; 
//			var latLng3857 = [EPSG3857.project( clickLatLng ).x ,EPSG3857.project( clickLatLng ).y ];
//			var latLngKatec = [KATEC.project( clickLatLng ).x ,KATEC.project( clickLatLng ).y ];

			var clickLatLng = e.latlng;
			var latLng4326 = [clickLatLng.lat ,clickLatLng.lng ]; 
			var latLng3857 = SelfMapUtil.fnProj4( 'EPSG:4326', 'EPSG:3857', [clickLatLng.lng,clickLatLng.lat] );
			var latLngKatec = SelfMapUtil.fnProj4( 'EPSG:4326', 'KATEC', [clickLatLng.lng,clickLatLng.lat] );
			
			
			
			var clickLatLng = {
				"4326": latLng4326,
				"3857": latLng3857,
				"Katec": latLngKatec
			}
			
			if(activateFlag) {
				
			} else {
				if(this.eventHandler.click){
					this.eventHandler.click(clickLatLng); 
				}
			}

		},this);
		//클릭 이벤트 끝
		
		
		//mousemove
		this.map.on('mousemove', function(e) { 
			
			if(this.mousemovetid)
				clearTimeout(this.mousemovetid);
			
		    this.mousemovetid = setTimeout($.proxy(function() {
		    	
		    	//그리기 및 측정시 클릭 이벤트를 중지 한다.
				var activateFlag = false;
				for ( var name in this.measureCtrls) {
					if(this.measureCtrls[name]._enabled){
						activateFlag = true;
						break;
					}
				}
				for ( var name in this.drawCtrls) {
					if(this.drawCtrls[name]._enabled){
						activateFlag = true;
						break;
					}
				}

				//그리기 및 측정시 클릭 이벤트를 중지 한다.
				
				
				///// 2017.03.09 
				
//				var EPSG3857 = L.CRS.EPSG3857;
//				var KATEC = new L.Proj.CRS(
//						'katec',
//						'+proj=tmerc +lat_0=38.0 +lon_0=128.0 +x_0=400000.0 +y_0=600000.0 +k=0.9999 +ellps=bessel +a=6377397.155 +b=6356078.9628181886 +units=m +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43');
//				
//				
//				var clickLatLng = e.latlng;
//				var latLng4326 = [clickLatLng.lat ,clickLatLng.lng ]; 
//				var latLng3857 = [EPSG3857.project( clickLatLng ).x ,EPSG3857.project( clickLatLng ).y ];
//				var latLngKatec = [KATEC.project( clickLatLng ).x ,KATEC.project( clickLatLng ).y ];
				
				
				var clickLatLng = e.latlng;
				var latLng4326 = [clickLatLng.lat ,clickLatLng.lng ]; 
				var latLng3857 = SelfMapUtil.fnProj4( 'EPSG:4326', 'EPSG:3857', [clickLatLng.lng,clickLatLng.lat] );
				var latLngKatec = SelfMapUtil.fnProj4( 'EPSG:4326', 'KATEC', [clickLatLng.lng,clickLatLng.lat] );
				
				var clickLatLng = {
						"4326": latLng4326,
						"3857": latLng3857,
						"Katec": latLngKatec,
						"x":e.layerPoint.x,
						"y":e.layerPoint.y
				}
				
				if(activateFlag){
				}else{
					if(this.eventHandler.mousemove){
						this.eventHandler.mousemove(clickLatLng); 
					}
				}
				
				
		    }, this), 0);
		    
		    
		},this);		
		
		// moveend 
		if(this.eventHandler.moveend) {
			this.map.on("moveend", this.eventHandler.moveend);
		}
		
		//zoomend
		if(this.eventHandler.zoomend) {
			this.map.on("zoomend", this.eventHandler.zoomend);
		}
		
		//zoomstart
		this.map.on('zoomstart', _.debounce($.proxy(function() {
			this.startTileRender();
		}, this), 500));
		
		//zoomstart
		/*
		this.map.on('zoomstart', function(e) { 
			
			if(this.zoomStarttId) {
				clearTimeout(this.zoomStarttId);
				this.stopTileRender();	
			}
			
			this.zoomStarttId = setTimeout($.proxy(function() {
				this.startTileRender();
			}, this), 500);
		},this);
		*/
	}
	
	OpenmateSelfmap.prototype.stopTileRender = function() {
//		console.log("tile req stop");
		for ( var i in this.map._layers) {
			var layer = this.map._layers[i];
			
			if(layer._abortLoading) {
				layer._removeAllTiles();
				this.map.off({
					viewprereset: layer._invalidateAll,
					viewreset: layer._resetView,
					zoom: layer._resetView,
					moveend: layer._onMoveEnd,
					move: layer._onMove
				}, layer);
			}
		}
	}
	
	OpenmateSelfmap.prototype.startTileRender = function(){
//		console.log("tile req start");
		for ( var i in this.map._layers) {
			var layer = this.map._layers[i];
			
			if(layer._abortLoading) {
				this.map.on({
					viewprereset: layer._invalidateAll,
					viewreset: layer._resetView,
					zoom: layer._resetView,
					moveend: layer._onMoveEnd,
					move: layer._onMove
				}, layer);
				layer._update();
			}
		}
	}

	OpenmateSelfmap.prototype.tranform = function(coords ,from , to){
			var latLng4326 = SelfMapUtil.fnProj4( from, "EPSG:4326", [coords[0],coords[1]] );
			var target = SelfMapUtil.fnProj4("EPSG:4326",to,[latLng4326[0] ,latLng4326[1]]);
			
			return target;
	}
	
	OpenmateSelfmap.prototype.makeDrawnFeatrueData = function(type , feature){
//		var EPSG3857 = L.CRS.EPSG3857;
//		var KATEC = new L.Proj.CRS(
//				'katec',
//				'+proj=tmerc +lat_0=38.0 +lon_0=128.0 +x_0=400000.0 +y_0=600000.0 +k=0.9999 +ellps=bessel +a=6377397.155 +b=6356078.9628181886 +units=m +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43');
		
//		var type = type;
		var layer = feature;
		
    	//2017.03 현진 :: draw feature 의 popup 추가
    	if(layer.options.popupContent){
    		layer.bindPopup(layer.options.popupContent);
    	}
		
		feature.addTo(this.map);
		var bounds = layer.getBounds();
		var center = bounds.getCenter();
		var ne = bounds.getNorthEast();
		var sw = bounds.getSouthWest();
		
		
		var center4326 = [center.lat ,center.lng ]; //minx ,  miny , maxx , maxy
		var bounds4326 = [sw.lat ,sw.lng ,ne.lat ,ne.lng]; //minx ,  miny , maxx , maxy
		
		
		var center3857 = SelfMapUtil.fnProj4( 'EPSG:4326', 'EPSG:3857', [center.lng,center.lat] ); //minx ,  miny , maxx , maxy
		var bounds3857 = [SelfMapUtil.fnProj4( 'EPSG:4326', 'EPSG:3857', [sw.lng,sw.lat] )[0] ,SelfMapUtil.fnProj4( 'EPSG:4326', 'EPSG:3857', [sw.lng,sw.lat] )[1] ,SelfMapUtil.fnProj4( 'EPSG:4326', 'EPSG:3857', [ne.lng,ne.lat] )[0] ,SelfMapUtil.fnProj4( 'EPSG:4326', 'EPSG:3857', [ne.lng,ne.lat] )[1]]; //minx ,  miny , maxx , maxy
		
		var centerKatec = SelfMapUtil.fnProj4( 'EPSG:4326', 'KATEC', [center.lng,center.lat] ); //minx ,  miny , maxx , maxy
		var boundsKatec = [SelfMapUtil.fnProj4( 'EPSG:4326', 'KATEC', [sw.lng,sw.lat] )[0] ,SelfMapUtil.fnProj4( 'EPSG:4326', 'KATEC', [sw.lng,sw.lat] )[1]  ,SelfMapUtil.fnProj4( 'EPSG:4326', 'KATEC', [ne.lng,ne.lat] )[0] ,SelfMapUtil.fnProj4( 'EPSG:4326', 'KATEC', [ne.lng,ne.lat] )[1]]; //minx ,  miny , maxx , maxy
		
		//2017.03.09
		
//		var center3857 = [EPSG3857.project( center ).x ,EPSG3857.project( center ).y ]; //minx ,  miny , maxx , maxy
//		var bounds3857 = [EPSG3857.project( sw ).x ,EPSG3857.project( sw ).y ,EPSG3857.project( ne ).x ,EPSG3857.project( ne ).y]; //minx ,  miny , maxx , maxy
//		
//		var centerKatec = [KATEC.project( center ).x ,KATEC.project( center ).y ]; //minx ,  miny , maxx , maxy
//		var boundsKatec = [KATEC.project( sw ).x ,KATEC.project( sw ).y ,KATEC.project( ne ).x ,KATEC.project( ne ).y]; //minx ,  miny , maxx , maxy
		
		var oriPoints = [];
		var radius = 0;
		
		
		var wkt_poly_4326 = "";
		var wkt_poly_3857 = "";
		var wkt_poly_KATEC = "";
			
		if (type === 'marker') {
			layer.bindPopup('A popup!');
		}else if (type == 'polygon' || type == 'rectangle') {
			wkt_poly_4326 = "POLYGON((";
			wkt_poly_3857 = wkt_poly_4326;
			wkt_poly_KATEC = wkt_poly_4326;
			
			
			var latlngs = layer.getLatLngs()[0];				
			

			latlngs.push(latlngs[0]);
			for (var i = 0; i < latlngs.length; i++) {
				if (i != 0) {
					wkt_poly_4326 += ',';
					wkt_poly_3857 += ',';
					wkt_poly_KATEC += ',';
				}
				var wsg84latlng = latlngs[i];
				var EPSG3857latlng = SelfMapUtil.fnProj4( 'EPSG:4326', 'EPSG:3857', [latlngs[i].lng,latlngs[i].lat] );
				var KATEClatlng = SelfMapUtil.fnProj4( 'EPSG:4326', 'KATEC', [latlngs[i].lng,latlngs[i].lat] );
				
				//2017.03.09
				
//				var EPSG3857latlng = EPSG3857.project(latlngs[i]);
//				var KATEClatlng = KATEC.project(latlngs[i]);
				
				wkt_poly_4326 += wsg84latlng.lng + ' ' + wsg84latlng.lat;
				wkt_poly_3857 += EPSG3857latlng[0] + ' ' + EPSG3857latlng[1];
				wkt_poly_KATEC += KATEClatlng[0] + ' ' + KATEClatlng[1];
				
				oriPoints.push([wsg84latlng.lng , wsg84latlng.lat]);
			}
			wkt_poly_4326 += "))";
			wkt_poly_3857 += "))";
			wkt_poly_KATEC += "))";
		}else if(type =='circle'){
			radius = layer._mRadius;
		}
        
		if(layer.options.labelUsable)
			layer.bindLabel("radius : " + radius,{noHide: false});
        
        this.drawnItems.addLayer(layer);
        layer.vector_id = "vector_"+type+"_"+ this.drawnItems.getLayerId(layer);
        
        var data = {
        		"vector_id" : layer.vector_id
        		,"type" : type
        		,"radius" : radius
        		,"oriPoints" : oriPoints
        		,"center4326" : center4326
        		,"bounds4326" : bounds4326
        		,"center3857" : center3857
        		,"bounds3857" : bounds3857
        		,"centerKatec" : centerKatec
        		,"boundsKatec" : boundsKatec
        		,"wkt4326" : wkt_poly_4326
        		,"wkt3857" : wkt_poly_3857
        		,"wktKatec" : wkt_poly_KATEC
        };
        
        
        if( this.drawHandler[type])
        	this.drawHandler[type](data);
	}
	
	OpenmateSelfmap.prototype.createBaseMap = function(id) {
		var baseLayer;
		var crs;
		
		var oldBounds = new L.LatLngBounds(this.map.getBounds()._northEast,this.map.getBounds()._southWest);
		if (this.option.baseMapType == "daum-api-roadmap") {
			var daumApiOptions = {
					minZoom: 0,
					maxZoom: 13,
					zoomReverse: true
				}
			this.map.options.minZoom = 1;
			this.map.options.maxZoom = 13;
			baseLayer = new L.DaumApi('ROADMAP' , daumApiOptions);
			crs = new L.Proj.CRS.TMS(
				    "EPSG:5181",
				    "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
				    [-30000, -60000, 494288, 988576],
				    { resolutions: [2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25] }
			);
			
		}else if(this.option.baseMapType == "vworld-vbase"){
			baseLayer = this.getVworldTms(this.map,this.option.baseMapType);
			crs = L.CRS.EPSG3857;
		}else if(this.option.baseMapType == "vworld-vgray"){
			baseLayer = this.getVworldTms(this.map,this.option.baseMapType);
			crs = L.CRS.EPSG3857;
		} 
		else if(this.option.baseMapType == "vworld-vsat"){
			baseLayer = this.getVworldTms(this.map,this.option.baseMapType);
			crs = L.CRS.EPSG3857;
		}
		else if(this.option.baseMapType == "vworld-vhybrid"){
			baseLayer = this.getVworldTms(this.map,this.option.baseMapType);
			crs = L.CRS.EPSG3857;
		}		
		else if(this.option.baseMapType == "vworld-vmidnight"){
			baseLayer = this.getVworldTms(this.map,this.option.baseMapType);
			crs = L.CRS.EPSG3857;
		}	
		else if(this.option.baseMapType == "openmate" || this.option.baseMapType == "openmateBaseLayer" ){
			this.map.options.minZoom = 7;
			this.map.options.maxZoom = 18;
			baseLayer = new L.TileLayer("http://tmap{s}.selfmap.co.kr:8081/TileMap/{z}/{y}/{x}.png", {
				 minZoom : 7 , 
				maxZoom : 18 , 
				subdomains: "0123",
				reuseTiles: true,
				continuousWorld: true,
				attribution: "&copy; <a href=\"http://openmate.co.kr\">openmate</a>"
			});
			 crs = L.CRS.EPSG3857;
		}
		
		if(this.hasLayer(this.latestBaseLayerId)){
			this.removeLayer(this.latestBaseLayerId);
		}
		
		if(id === undefined || id == ''){
			return false;
		}
		
		this.latestBaseLayerId = id;
		baseLayer._id = id ;
		this.map.addLayer(baseLayer);
		
//		var baseMaps = {"base" : baseLayer };
//		var overlayMaps = {
//      	    "this.featureLayer": this.featureLayer
//      	    ,"this.drawnItems": this.drawnItems
//      	};
//		L.control.layers(baseMaps, overlayMaps).addTo(map);
      
		baseLayer.bringToBack();
		this.map.options.crs = crs;
		var oldCenter = new L.LatLng(this.map.getCenter().lat,this.map.getCenter().lng,null);
//		this.map.setView(oldCenter, this.map.getZoom());
		for (var i in this.map._layers) {
			if (this.map._layers[i]._crs) {
				this.map._layers[i]._crs = crs;
				this.map._layers[i].setParams({"crs":crs.code},true);
			}
		}
		this.map.fitBounds(oldBounds);
		this.map.fire('zoomend');
		
		var dom = baseLayer.getContainer();
		if(dom.classList !== undefined)
			dom.classList.add(id);
		else dom.className += ' ' + id;
		
//		if(baseLayer.redraw){
//			baseLayer.redraw();
//		}
		
	}
	
	OpenmateSelfmap.prototype.getVworldTms = function(iMap ,key){
		iMap.options.minZoom = 7;
		iMap.options.maxZoom = 18;
		var vWorld = null;
		var format = "png";
		if(this.option.baseMapType == "vworld-vbase"){
			vWorld = new vworld.Layers.Base('VBASE');
		}else if(this.option.baseMapType == "vworld-vgray"){
			vWorld = new vworld.Layers.Gray('VGRAY');
		} 
		else if(this.option.baseMapType == "vworld-vsat"){
			vWorld = new vworld.Layers.Satellite('VSAT');
			format = "jpeg";
		}
		else if(this.option.baseMapType == "vworld-vhybrid"){
			vWorld = new vworld.Layers.Hybrid('VHYBRID');
		}		
		else if(this.option.baseMapType == "vworld-vmidnight"){
			vWorld = new vworld.Layers.Midnight('VMIDNIGHT');
		}
		var vWorldLayer = new L.TileLayer(vWorld.url + "/{z}/{x}/{y}."+format, {
			minZoom : 7 , 
			maxZoom : 18 , 
			continuousWorld: true,
			attribution: "&copy; <a href=\"http://openmate.co.kr\">openmate</a>"
		});
		return vWorldLayer;
	};
	
	OpenmateSelfmap.prototype.getBaseLayerList = function(){
		
		var baseLayerList = [
		                     	 { id:"openmate" , name : "오픈메이트"} 
		                     	,{ id:"vworld-vbase" ,name : "브이월드배경"} 
		                     	,{ id:"vworld-vgray" ,name : "브이월드그레이"} 
		                     	,{ id:"vworld-vsat" ,name : "브이월드위성"} 
		                     	,{ id:"vworld-vhybrid" ,name : "브이월드하이브리드"} 
		                     	,{ id:"vworld-vmidnight" ,name : "브이월드미드나이트"} 
		                     	,{ id:"daum-api-roadmap" ,name : "다음지도"} 
		];
		
		return baseLayerList;
	};
	
	OpenmateSelfmap.prototype.changeBaseLayer = function(id){
		
		this.option.baseMapType = id;
//		this.createBaseMap(this.latestBaseLayerId);
		this.createBaseMap(this.option.baseMapType);
		
		return null;
	};
	
	OpenmateSelfmap.prototype.setCenter = function(center,zoom,crs){
		if(!zoom){
			zoom = this.map.getZoom();
		}
		if(crs){
			
//			var swlt = proj4(crs, "EPSG:4326").forward([center[0] , center[1]]);
			var swlt = SelfMapUtil.fnProj4( crs, 'EPSG:4326', [center[0],center[1]] );
			this.map.setView([swlt[1],swlt[0]], zoom);
			return;
		}
		this.map.setView(center, zoom);
	};
	
	OpenmateSelfmap.prototype.getMbr = function() {
		var bounds = this.map.getBounds();
		var center = bounds.getCenter();
		var ne = bounds.getNorthEast();
		var sw = bounds.getSouthWest();
		return [sw.lat ,sw.lng ,ne.lat ,ne.lng]; // miny, minx, maxy, maxx
	};
	
	OpenmateSelfmap.prototype.setMbr = function(coodArray, crs_code) {
		
		var crs = "EPSG:4326";
		if(crs_code) {
			crs = crs_code;
		}
		
		//2017.03.09
		
//		var swlt = proj4(crs, "EPSG:4326").forward([coodArray[0] , coodArray[1]]);
//		var nelt = proj4(crs, "EPSG:4326").forward([coodArray[2] , coodArray[3]]);

		
		
//		if(coodArray.length == 4){
		
		//2017.03 현진   - 원본
//			var swlt = SelfMapUtil.fnProj4(crs,"EPSG:4326",[coodArray[0] , coodArray[1]]);
//			var nelt = SelfMapUtil.fnProj4(crs,"EPSG:4326",[coodArray[2] , coodArray[3]]);
//			
//			var sw = new L.LatLng(swlt[1],swlt[0],null);
//			var ne = new L.LatLng(nelt[1],nelt[0],null);
//			var bounds = new L.LatLngBounds(ne,sw);
//			this.map.fitBounds(bounds);
		//2017.03 현진  - 원본 //////
		
//		}else{
			var group = [];
			for(var i = 0 ; i < coodArray.length; i = i+2 ) {
				var transPoint = SelfMapUtil.fnProj4(crs,"EPSG:4326",[coodArray[i] , coodArray[(i+1)]]);
				var transLatLng = new L.LatLng(transPoint[1],transPoint[0],null);
				group.push(transLatLng);
			}
			var bounds = new L.LatLngBounds(group);
			this.map.fitBounds(bounds);
//		}
	};

	OpenmateSelfmap.prototype.getCurrentResolution = function() {
		
		var res =40075016.686 * Math.abs(Math.cos(this.map.getCenter().lat / 180 * Math.PI)) / Math.pow(2, this.map.getZoom()+8);
		
		var googleRes = [156543.03390625, 78271.516953125, 39135.7584765625,
        19567.87923828125, 9783.939619140625,
        4891.9698095703125, 2445.9849047851562,
        1222.9924523925781, 611.4962261962891,
        305.74811309814453, 152.87405654907226,
        76.43702827453613, 38.218514137268066,
        19.109257068634033, 9.554628534317017,
        4.777314267158508, 2.388657133579254,
        1.194328566789627, 0.5971642833948135]
        
		return googleRes[this.map.getZoom()];
	};
	
	
	OpenmateSelfmap.prototype.addWmsLayerMap = function(id , wmsUrl , wmsOption, evtMap) {
		
		var wmsLayer;
		if(wmsOption.v2) {
			wmsLayer = L.tileLayer.wms_v2(wmsUrl, wmsOption);
		} else {
			wmsLayer = L.tileLayer.wms(wmsUrl, wmsOption);
		}
		
		if(evtMap) {
			for( var evt in evtMap) {
				if(evt == "tilestart") {
					wmsLayer.on('tilestart', evtMap[evt]);
				}else if(evt == "tileend") {
					wmsLayer.on('tileend', evtMap[evt]);
				}
			}
		}
		
		wmsLayer._id = id ;
		this.map.addLayer(wmsLayer);
	}
	
	OpenmateSelfmap.prototype.getZoom = function() {
		return this.map.getZoom();
	};
	
	OpenmateSelfmap.prototype.setZoom = function(zoom) {
		return this.map.setZoom(zoom);
	}
	
	OpenmateSelfmap.prototype.getLayerIds = function(){
		var rtnLayers = [];
		this.map.eachLayer(function (_layer) {
			if(_layer._id)
				rtnLayers.push(_layer._id);
		});
		return rtnLayers;
	}	
	
	OpenmateSelfmap.prototype.setZIndex = function(layerid, zindex){
		for (var i in this.map._layers) {
            if (this.map._layers[i]._id == layerid) {
               this.map._layers[i].setZIndex(zindex);
               return;
            }
        }
	}	

	OpenmateSelfmap.prototype.removeLayerEvt = function(layerid, evtMap) {
		for ( var i in this.map._layers) {
			if (this.map._layers[i]._id == layerid) {
				var layer = this.map._layers[i];
				for ( var evt in evtMap) {
					if (evt == "tilestart") {
						layer.off('tileloadstart', evtMap[evt]);
					} else if (evt == "tileend") {
						layer.off('tileload', evtMap[evt]);

					}
				}
				return;
			}
		}
	};
	
	OpenmateSelfmap.prototype.redrawLayer = function(layerid, opt) {
		var redrawLayer = function(layers) {
			for ( var i in layers) {
				if (layers[i]._id == layerid) {
					var layer = layers[i];
					
					if(layer._layers !== undefined) {
						redrawLayer(layer._layers);
						continue;
					}
					
					
					var element = (typeof layer.getContainer === 'function') ? layer.getContainer() : layer.getElement();
					element.style.display = "block";
					
					if(layer.setParams){
						layer.setParams(opt,false);
					}else{
						layer.options = L.setOptions(layer, opt);
						layer.redraw();	
					}					
				}
			}
		};
		
		redrawLayer(this.map._layers);
	};
	
	OpenmateSelfmap.prototype.removeLayer = function(layerid){
		for (var i in this.map._layers) {
            if (this.map._layers[i]._id == layerid) {
               this.map.removeLayer(this.map._layers[i]);
               return;
            }
        }
	}
	
	//2017.02
	OpenmateSelfmap.prototype.removeFeatureLayer = function(layerid){
		for (var i in this.map._layers) {
            if (this.map._layers[i].feature_id == layerid) {
               this.map.removeLayer(this.map._layers[i]);
               return;
            }
        }
	}
	
	OpenmateSelfmap.prototype.hasLayer = function(layerid){
		for (var i in this.map._layers) {
            if (this.map._layers[i]._id == layerid) {
               return true;
            }
        }
		return false;
	};
	
	OpenmateSelfmap.prototype.drawCircle = function( option, callback ){
		for ( var name in this.drawCtrls) {
			this.drawCtrls[name].disable();
		}
		if(option)
			$.extend(this.drawCtrls["circle"].options.shapeOptions, option);
		
		
		if(callback)
			this.drawHandler["circle"] = callback ;
		this.drawCtrls["circle"].enable();
	};
	
	OpenmateSelfmap.prototype.drawPolyline = function( option, callback ){
		for ( var name in this.drawCtrls) {
			this.drawCtrls[name].disable();
		}
		if(option)
			$.extend(this.drawCtrls["polyline"].options.shapeOptions, option);
		
		if(callback)
			this.drawHandler["polyline"] = callback ;
		this.drawCtrls["polyline"].enable();
	};
	
	OpenmateSelfmap.prototype.drawPolygon = function( option, callback ){
		for ( var name in drawCtrls) {
			this.drawCtrls[name].disable();
		}
		if(option)
			$.extend(this.drawCtrls["polygon"].options.shapeOptions, option);
			
		if(callback)
			this.drawHandler["polygon"] = callback ;
		this.drawCtrls["polygon"].enable();
	};
	
	OpenmateSelfmap.prototype.drawRectangle = function( option, callback ){
		for ( var name in drawCtrls) {
			this.drawCtrls[name].disable();
		}
		if(option)
			$.extend(this.drawCtrls["rectangle"].options.shapeOptions, option);
		
		if(callback)
			this.drawHandler["rectangle"] = callback ;
		this.drawCtrls["rectangle"].enable();
	};
	
	
	OpenmateSelfmap.prototype.drawWkt = function(id, wktstr, crs, callback ) {
		
		var type = id.split("_")[1];

		if(type == 'point')
			type = 'circle';
		
		var wkt = new Wkt.Wkt();
		
		if(wktstr) {
			wkt.read(wktstr);
			var obj = wkt.toObject(this.drawCtrls[type].options.shapeOptions); // Make an object
			
			if(crs){
				var latlngs = [];
				if(obj.getLatLngs){
					console.log(obj.getLatLngs())
					for(var i = 0; i < obj.getLatLngs().length; i++) {
						latlngs = obj.getLatLngs()[i];
						for(var j = 0; j <  latlngs.length; j++) {
							if($.isArray(latlngs[j])){
								var multiPoints = latlngs[j];
								for(k = 0 ; k < multiPoints.length; k++){
									var rslt = SelfMapUtil.fnProj4( crs, "EPSG:4326", [multiPoints[k].lng , multiPoints[k].lat] );
									multiPoints[k] = new L.LatLng(rslt[1], rslt[0]); 
								}
							}else{
								var rslt = SelfMapUtil.fnProj4( crs, "EPSG:4326", [latlngs[j].lng , latlngs[j].lat]);
								latlngs[j] = new L.LatLng(rslt[1], rslt[0]); 
							}
						}
					}
				}else{
					latlngs.push(obj.getLatLng());
					
					for (var i = 0; i < latlngs.length; i++) {
//					var rslt = proj4(crs, "EPSG:4326").forward([latlngs[i].lng , latlngs[i].lat]);
						var rslt = SelfMapUtil.fnProj4( crs, "EPSG:4326", [latlngs[i].lng , latlngs[i].lat]);
						
						latlngs[i] = new L.LatLng(rslt[1], rslt[0]); 
					}
				}
			}
		} 
		
		obj.vector_id = id;
		obj.addTo(this.drawnItems); // Add it to the map
		obj.addTo(this.map);
		if(callback)
			this.drawHandler[type] = callback ;
	};
	
	OpenmateSelfmap.prototype.drawLoadCircle = function( id, latlng, r, crs, callback, options ) {
		if(crs) {
			/*
			var swlt = proj4(crs, "EPSG:4326").forward([latlng[0] , latlng[1]]);
			latlng = new L.LatLng(swlt[1], swlt[0]); 	
			*/
			
//			var source = new Proj4js.Proj('OPENMATE');    
//			var dest = new Proj4js.Proj('EPSG:4326');
//			
//			var proj4Point = new Proj4js.Point(latlng[0], latlng[1]);
			
//			var rslt = Proj4js.transform(source, dest, proj4Point);
			var rslt = SelfMapUtil.fnProj4( 'KATEC', 'EPSG:4326', [latlng[0], latlng[1]] );
			latlng = new L.LatLng(rslt[1], rslt[0]); 
			
		}
		
		if(options)
			$.extend(this.drawCtrls["circle"].options.shapeOptions, options);
		
		var obj = L.circle(latlng, r, options || this.drawCtrls["circle"].options.shapeOptions );
		obj.vector_id = id;
		obj.addTo(this.drawnItems);
		obj.addTo(this.map);

		if(callback)
			this.drawHandler[type] = callback ;
	};	
	
	OpenmateSelfmap.prototype.setWktMbr = function( wktstr ,crs ,zLevel) {

		var wkt = new Wkt.Wkt();
		wkt.read(wktstr);
		var obj = wkt.toObject(); // Make an object

		var latlngs = [];	

		if(obj.getLatLngs){
			latlngs = obj.getLatLngs();
		}else{
			latlngs.push(obj.getLatLng());
		}
		
		if(crs){
			for (var i = 0; i < latlngs.length; i++) {
				if($.isArray(latlngs[i])){
					var latlngsItem = latlngs[i];
					for(j = 0 ; j < latlngsItem.length; j++){
//						console.log(latlngsItem[j]);
//						var rslt = proj4(crs, "EPSG:4326").forward([latlngsItem[j].lng , latlngsItem[j].lat]);
						var rslt = SelfMapUtil.fnProj4( crs, "EPSG:4326", [latlngsItem[j].lng , latlngsItem[j].lat] );
						latlngs[j] = new L.LatLng(rslt[1], rslt[0]); 
					}
				}else{
//					var rslt = proj4(crs, "EPSG:4326").forward([latlngs[i].lng , latlngs[i].lat]);
					var rslt = SelfMapUtil.fnProj4( crs, "EPSG:4326", [latlngs[i].lng , latlngs[i].lat]);
					latlngs[i] = new L.LatLng(rslt[1], rslt[0]); 
				}
			
			}
			
		}
		
		var geomType = wkt.deconstruct(obj);
		
		if( geomType.type == "point" ){
			obj.setLatLng(latlngs[0]);
			var center = [obj.getLatLng().lat , obj.getLatLng().lng];
			this.setCenter(center,zLevel);
		}else if(geomType.type == "polygon"){
			obj.getBounds();
			var boundArray = [obj.getBounds()._northEast.lng,obj.getBounds()._northEast.lat,obj.getBounds()._southWest.lng,obj.getBounds()._southWest.lat];
			this.setMbr(boundArray, "katec");
		}
	}	
	
	OpenmateSelfmap.prototype.removeDrawnVector = function( vector_id ){
		for (var i in this.drawnItems._layers) {
			var vector = this.drawnItems._layers[i];
            if (vector.vector_id == vector_id) {
            	this.drawnItems.removeLayer(vector);
               return;
            }
        }
	};
	
	OpenmateSelfmap.prototype.removeDrawnVectorAll = function() {
		this.drawnItems.clearLayers();
//		for (var i in this.drawnItems._layers) {
//			var vector = this.drawnItems._layers[i];
//            this.drawnItems.removeLayer(vector);
//        }
	};
	
	OpenmateSelfmap.prototype.hideLayer = function(layer_id) {
		var self = this;
		var hide = function(layers, all, enable) {
			for (var i in layers) {
				if (layers[i]._id == layer_id || all) {
					var layer = layers[i];

					if(layer._layers !== undefined) {
						hide(layer._layers, true, layer.filterEnable);
						break;
					}
					
					if(typeof layer.getContainer === 'function') {
						layer.getContainer().style.display = "none";
//						if (layer.getEvents) {
//							var events = layer.getEvents();
//							self.map.off(events, layer);
//							self.map.off( {zoomstart: layer._onZoomStart} , layer);
//							self.map.off( {zoomend: layer._onZoomEnd} , layer);
//						}
//						
//						self.map.off({
//							viewprereset: layer._invalidateAll,
//							viewreset: layer._resetView,
//							zoom: layer._resetView,
//							moveend: layer._onMoveEnd,
//							move: layer._onMove
//						}, layer);
						break;
					} else {
						if(enable !== undefined) {
							if(layer.enable)
								layer.getElement().style.display = "none";
						} else {
							layer.getElement().style.display = "none";
						}
					}
				}
			}
		};
		
		hide(this.map._layers);
		this.map.zoomsliderControl._initEvents();
	};

	OpenmateSelfmap.prototype.showLayer = function(layer_id) {
		var self = this;
		var show = function(layers, all, enable) {
			for (var i in layers) {
				if (layers[i]._id == layer_id || all) {
					var layer = layers[i];
					
					if(layer._layers !== undefined) {
						show(layer._layers, true, layer.filterEnable);
						break;
					}
					
					var element = (typeof layer.getContainer === 'function') ? layer.getContainer() : layer.getElement();
					
					if(enable !== undefined) {
						if(layer.enable)
							element.style.display = "block";
					} else {
						element.style.display = "block";
					}
					
					layer._update();
					layer.redraw();	
					
					if(typeof layer.getContainer === 'function') {
						if (layer.getEvents) {
							var events = layer.getEvents();
							self.map.on(events, layer);
							layer._update();
							layer.redraw();	
							layer._resetView();
//							self.map.on( {zoomstart: layer._onZoomStart} , layer);
//							self.map.on( {zoomend: layer._onZoomEnd} , layer);
							
						}
//						if (this.getEvents) {
//							var events = this.getEvents();
//							map.on(events, this);
//							this.once('remove', function () {
//								map.off(events, this);
//							}, this);
//						}
						
//						self.map.on({
//							viewprereset: layer._invalidateAll,
//							viewreset: layer._resetView,
//							zoom: layer._resetView,
//							moveend: layer._onMoveEnd,
//							move: layer._onMove
//						}, layer);
	
						break;
					}
				}
			}
		};
		
		show(this.map._layers);
		this.map.zoomsliderControl._initEvents();
	};
	
	OpenmateSelfmap.prototype.toggleLayer = function(layer_id) {
		for (var i in this.map._layers) {
			if (this.map._layers[i]._id == layer_id) {
				var layer = this.map._layers[i];
				layer._tileContainer.style.display = (layer._tileContainer.style.display != "none") ? "block" : "none";
				return;
			}
		}
	};

	OpenmateSelfmap.prototype.wktToVector = function( wktStr , feature_id , attributes, crs, evtMap, clear, options) {
		this.addFeature(this.featureLayer, wktStr, feature_id , attributes, crs, evtMap, clear, options);
	};
	
	//2017.02
	OpenmateSelfmap.prototype.addFeature = function(featureGroup, wktStr , feature_id , attributes, crs, evtMap, clear, options) { 
		var wkt = new Wkt.Wkt();
		var geom = wkt.read(wktStr);
//		options = options || {
//			stroke: true,
//			color: '#0033ff',
//			dashArray: null,
//			lineCap: null,
//			lineJoin: null,
//			weight: 5,
//			opacity: 0.5,
//			fill: false,
//			fillColor: '#0033ff', //same as color by default
//			fillOpacity: 0.2,
//			clickable: true
//		};
		
		var feature = wkt.toObject(options);
		var latlngs = [];
		
		if(attributes)
			feature.attributes = attributes;
		
//		var source = new Proj4js.Proj('OPENMATE');    
//		var dest = new Proj4js.Proj('EPSG:4326');
//		var katecProjection = new OpenLayers.Projection("OPENMATE"),        //katec
//			wgs84Projection = new OpenLayers.Projection("EPSG:4326");       //wgs84
		
		if(crs){
			if(feature.getLatLngs){
				for( var i = 0 ;i< feature.getLatLngs().length;i++){
					var points = feature.getLatLngs()[i];
					for(var j = 0;j<points.length;j++){
						if($.isArray(points[j])){
							var multiPoints = points[j]; 
							for(var k = 0; k < multiPoints.length; k++){
//								var proj4Point = new Proj4js.Point(multiPoints[k].lng , multiPoints[k].lat);
//								var rslt = Proj4js.transform(source,dest,proj4Point);
								var rslt = SelfMapUtil.fnProj4( 'KATEC', "EPSG:4326", [multiPoints[k].lng , multiPoints[k].lat] );
								multiPoints[k] = new L.LatLng(rslt[1], rslt[0]);	
							}
						}else{
//							var proj4Point = new Proj4js.Point(points[j].lng , points[j].lat);
							var rslt = SelfMapUtil.fnProj4( 'KATEC', "EPSG:4326", [points[j].lng,points[j].lat] );
//							var rslt = Proj4js.transform(source,dest,proj4Point);
							points[j] = new L.LatLng(rslt[1], rslt[0]);	
						}
					}
				}
			}else{
				latlngs.push(feature.getLatLng());
				
				//latlngs내 좌표의 위치에따라 for문이 하나 더 필요할수 있음(위의 코드처럼)
				for (var i = 0; i < latlngs.length; i++) {
//					var proj4Point = new Proj4js.Point(latlngs[i].lng , latlngs[i].lat);
					var rslt = SelfMapUtil.fnProj4( 'KATEC', "EPSG:4326", [latlngs[i].lng , latlngs[i].lat] );
//					var rslt = Proj4js.transform(source,dest,proj4Point);
					latlngs[i] = new L.LatLng(rslt[1], rslt[0]); 
//					var rslt = proj4(crs, "EPSG:4326").forward([ latlngs[i].lng, latlngs[i].lat ]);
//					latlngs[i] = new L.LatLng(rslt[1], rslt[0]);
				}
			}
		}
		
		if(evtMap){
			for( var evt in evtMap){
				feature.on(evt,evtMap[evt]);
			}
		}
		
		if(clear){
			featureGroup.clearLayers();
		}
		
		if(options && options.label){
			feature.bindLabel(options.label,{noHide: false});
//			feature.bindLabel(options.label);
		}
		
		feature.addTo(featureGroup); // Add it to the map
		featureGroup.addLayer(feature);
		
		var dom = feature.getElement();
		
		if(dom.classList !== undefined)
			dom.classList.add(featureGroup._id);
		else dom.className += ' ' + featureGroup._id;
		
//tooltip의 setContent() 함수가 없음
//		feature.bindTooltip(label,
//				this.featureLayer._map
//				  ).openTooltip();    
	
// addLayer()에서 whenReady(layer._layerAdd, layer)함수 실행중 callback함수가 없음.
//		var label = new L.Label();
//		label.setContent("static label");
//		label.setLatLng(feature.getBounds().getCenter());
//		this.featureLayer._map.showLabel(label);

//		feature.bindPopup(attributes.label).openPopup();
//		feature.bindLabel(attributes.label).showLabel();
//		feature.bindTooltip("my tooltip text").openTooltip();
		
//		if(options && options.label){
//			feature.bindPopup(options.label);
//		}
		
		if(feature_id){
			feature.feature_id = feature_id;
		}else{
			feature.feature_id = "vector_"+ feature._leaflet_id;
		}
		
	};
	
	//2017.02
	OpenmateSelfmap.prototype.measureDistance = function( callback ){
		for ( var name in this.measureCtrls) {
			this.measureCtrls[name].disable();
		}
		
		//거리 측정 중간에 새로 그릴때 tooltip 삭제
//		$.each(this.measureCtrls['distance']._tips, function(index,item){
//			item.dispose();
//		});
		
//		this.measureCtrls["distance"].removeAllMeasureItem();
		this.measureCtrls["distance"].enable();
		
		if(callback)
			this.measureHandler["distance"] = callback ;
	}
	
	//2017.02
	OpenmateSelfmap.prototype.measureArea = function( callback ){
		for ( var name in this.measureCtrls) {
			this.measureCtrls[name].disable();
		}
		this.measureCtrls["area"].enable();
//		this.measureCtrls["area"].removeAllMeasureItem();
		if(callback)
			this.measureHandler["area"] = callback ;
	}
	
	//2017.03
	OpenmateSelfmap.prototype.measureCircle = function( option,callback ){
		for ( var name in this.drawCtrls) {
			this.drawCtrls[name].disable();
		}
		if(option)
			$.extend(this.drawCtrls["circle"].options.shapeOptions, option);
		
		
		if(callback)
			this.drawHandler["circle"] = callback ;
		this.drawCtrls["circle"].enable();
	};
	
	//2017.02
	OpenmateSelfmap.prototype.clearMeasure = function(  ){
		for ( var name in this.measureCtrls) {
			this.measureCtrls[name].removeAllMeasureItem();
			this.measureCtrls[name].disable();
			
			// 미완성된 측정시 tooltip 삭제
			$.each(this.measureCtrls[name]._tips, function(index,item){
				item.dispose();
			});
		}
	};
	
	OpenmateSelfmap.prototype.wmsGetFeatureInfo = function( options ){
//		var  options = {
//				url : wmsUrl,
//				addParam : addParam,
//				layerId : layer['id'],
//				latlng : event[4326],
//				cbFn : callback
//		}	
		
		var clatlng = new L.LatLng(options.latlng[0], options.latlng[1]);
//		var layers = [];
//		layers.push(layerId);
		
		var pParam = this.getFeatureInfoUrl(options.url,options.layerId,clatlng);
		pParam = $.extend(pParam,options.addParam);
		$.ajax({
		      url: options.url ,
//		      url: this.getFeatureInfoUrl(url,layers,clatlng) ,
		      type: 'POST',
		      data: pParam,
		      success: function (data, status, xhr) {
		    	  if(options.cbFn)
		    		  options.cbFn(data);
		      }
		});
		return "1";
	};
	
	OpenmateSelfmap.prototype.getFeatureInfoUrl = function (url , layers , latlng) {
	    // Construct a GetFeatureInfo request URL given a point
	    var point = this.map.latLngToContainerPoint(latlng, this.map.getZoom()),
	        size = this.map.getSize(),
	        params = {
	          request: 'GetFeatureInfo',
	          service: 'WMS',
	          srs: 'EPSG:4326',
	          layers: layers,
	          styles: layers,
	          query_layers: layers,
	          height: size.y,
	          width: size.x,
	          bbox: this.map.getBounds().toBBoxString(),
	          version: "1.3.0",
	          transparent: "false",
	          format: "image/png",
	          info_format: 'application/json'
	        };
	    
	    params[params.version === '1.3.0' ? 'i' : 'x'] = Math.floor(point.x);
	    params[params.version === '1.3.0' ? 'j' : 'y'] = Math.floor(point.y);

	    
	    return params;
//	    return url + L.Util.getParamString(params, url, true);
	};
	
	OpenmateSelfmap.prototype.infoPop = function (latlng, content){
		var clatlng = new L.LatLng(latlng[0], latlng[1]);
	    L.popup({ maxWidth: 800})
	      .setLatLng(clatlng)
	      .setContent(content)
	      .openOn(this.map);
	};
	
	/**
	 * 
	 * 배열 latlng[x,y]
	 * 
	 * */
	OpenmateSelfmap.prototype.addLabeledMarker = function(latlng, proj ,markerOption) {
		
//		var latlng84s = proj4(proj, "EPSG:4326").forward([latlng[0] , latlng[1]]);
		var latlng84s = SelfMapUtil.fnProj4(proj, "EPSG:4326",[latlng[0] , latlng[1]]);
		
//		배열 latlng[x,y]
		var latlng84 = new L.LatLng(latlng84s[1],latlng84s[0],null);
		var icon;
		var defaultOption = {
				iconUrl : "", 
				label : null, 
				id :"" , 
				
				iconSize: [38, 95],
				icondrag : false,
				prop:{},
				popupAnchor: [-1, -1],
				popupContent:'',
				closeButton:false,
				callbacks : {}
		};
		L.extend(defaultOption, markerOption);
		
		if(defaultOption.label == null){
			icon = L.icon({
			    iconUrl: defaultOption.iconUrl ,
			    iconSize: defaultOption.iconSize,
			    popupAnchor: defaultOption.popupAnchor
			});
			
		}else{
			icon = new L.DivIcon({
				className: 'omsc-maker-icon',
				html: '<img class="maker-image" src="'+defaultOption.iconUrl+'"/>'+defaultOption.label
			});
		}
		
		var nnMaker = new L.Marker(latlng84 , {
		    icon: icon , 
		    draggable: defaultOption.icondrag
		});
		nnMaker._id = defaultOption.id;
		nnMaker._prop = defaultOption.prop;
		
		if(defaultOption.popupContent){			
			nnMaker.bindPopup(
					defaultOption.popupContent, 
					{
						closeButton: defaultOption.closeButton
					}
			);
		}
		
		if(defaultOption.callbacks){
			for(evtName in defaultOption.callbacks){
				if(defaultOption.callbacks[evtName])
					nnMaker.on(evtName, function(evt){
						defaultOption.callbacks[evtName](evt)	
					});	
			}
		}
		
		nnMaker.addTo( this.map);
		
		return nnMaker._id;
	};
	
	OpenmateSelfmap.prototype.removeLabeledMarker = function(id) {
		this.removeLayer(id);
	};
	
	OpenmateSelfmap.prototype.setOpacity = function(layerid, opac) {
		for (var i in this.map._layers) {
            if (this.map._layers[i]._id == layerid) {
            	this.map._layers[i].setOpacity(opac);
               return;
            }
        }
	};
	
	OpenmateSelfmap.prototype.getLayer = function(id) {
		for (var i in this.map._layers) {
            if (this.map._layers[i]._id == id) {
               return this.map._layers[i];
            }
        }
	};
	
	OpenmateSelfmap.prototype.addFeatureLayer = function(id) {
		var layer = new L.FeatureGroup();
		layer._id = id;
		this.map.addLayer(layer);
		return layer;
	};
	
	OpenmateSelfmap.prototype.getFeatures = function(featureGroup) {
		return featureGroup._layers;
	};
	
	OpenmateSelfmap.prototype.updateFeature = function(feature, styles) {
		var oldStyle, tick = 0;
		var func = function(t) {
			if(!feature.styleAnimationTime) {
				clearInterval(feature.timeId);
				delete feature['timeId'];
				feature.setStyle(oldStyle);
				return;
			}
			if(t % 2 == 0 && oldStyle)
				feature.setStyle(oldStyle);
			else feature.setStyle(styles);
		};
		
		if(feature.styleAnimationTime > 0) {
			oldStyle = {};			
			for(var id in styles)
				oldStyle[id] = feature.options[id];
			
			clearInterval(feature.timeId);
			feature.timeId = setInterval(function() {
				tick = (tick > 0) ? 0 : 1;
				func(tick);
			}, feature.styleAnimationTime);
		} else {
			feature.setStyle(styles);
		}
	};
	
	OpenmateSelfmap.prototype.showFeature = function(feature) {
		feature.enable = true;
		feature.getElement().style.display = 'block';
	};
	
	OpenmateSelfmap.prototype.hideFeature = function(feature) {
		feature.enable = false;
		feature.getElement().style.display = 'none';
	};
	
	// 지도 사이즈 변경시
	OpenmateSelfmap.prototype.resize = function() {
		this.map.invalidateSize();
	};
	
	
//	318817","o_y_axis":"564840"
//	  showGetFeatureInfo: function (err, latlng, content) {
//		    if (err) { console.log(err); return; } // do nothing if there's an error
//		    
//		    // Otherwise show the content in a popup, or something.
//		    L.popup({ maxWidth: 800})
//		      .setLatLng(latlng)
//		      .setContent(content)
//		      .openOn(this._map);
//		  }
	return OpenmateSelfmap;
	
//	http://jtiwvs.openmate.co.kr/image/redpin.png
	
	
})();