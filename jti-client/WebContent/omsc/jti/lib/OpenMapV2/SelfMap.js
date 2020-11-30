//SelfMap 지도 interface
var SelfMapUtil = {
	fnProj4 : function(source, dest, pointArr) {
		source = source.toUpperCase();
		dest = dest.toUpperCase();
		var sourceCrs = new Proj4js.Proj(source);    
		var destCrs = new Proj4js.Proj(dest);
		var proj4Point = new Proj4js.Point(pointArr[0],pointArr[1]);
		var rslt = Proj4js.transform(sourceCrs,destCrs,proj4Point);
		return [rslt.x, rslt.y]; // [경도, 위도]
	}
};

var SelfMap = (function() {
	
	this.impObj = null;
	
	function SelfMap(clazz) {
		this.impObj = clazz;
	}

	SelfMap.prototype.event = $({});
	
	SelfMap.prototype.eventManager = { };
	
	SelfMap.prototype.eventManager.register = function(eventId, handler) {
		SelfMap.prototype.event.bind(eventId, handler);
	};
	
	SelfMap.prototype.eventManager.unregister = function(eventId) {
		SelfMap.prototype.event.unbind(eventId);
	};
	
	SelfMap.prototype.eventManager.trigger = function(eventId, data) {
		SelfMap.prototype.event.trigger(eventId, data);
	};
	
	//디버깅 혹은 추가 개발을 위해 leaflet 혹은 openlayers의 Map개체를 반환 함.
	SelfMap.prototype.getMapObject = function() {
		return this.impObj.map;
	};
	
	//지도 생성
	SelfMap.prototype.createBaseMap = function(id) {
		this.impObj.createBaseMap(id);
	};
	
	//배경 지도목록
	SelfMap.prototype.getBaseLayerList = function() {
		return this.impObj.getBaseLayerList();
 	};
 	
	//배경 지도변경
	SelfMap.prototype.changeBaseLayer = function(id) {
		this.impObj.changeBaseLayer(id);
	};
	
	//지도 생성
	SelfMap.prototype.addWmsLayerMap = function(id, wmsUrl, wmsOption, evtMap, callback) {
		this.impObj.addWmsLayerMap(id, wmsUrl, wmsOption, evtMap, callback);
	};
	
	//줌 레벨 얻기
	SelfMap.prototype.getZoom = function() {
		return this.impObj.getZoom();
	};
	
	//줌 레벨 설정
	SelfMap.prototype.setZoom = function(zoom) {
		return this.impObj.setZoom(zoom);
	};
	
	//레이어 목록
	SelfMap.prototype.getLayerIds = function() {
		return this.impObj.getLayerIds();
	};	
	
	//레이어 이벤트 Zindex 변경
	SelfMap.prototype.setZIndex = function(layerid, zindex) {
		this.impObj.setZIndex(layerid, zindex);
	};	
	
	//레이어 이벤트 해제
	SelfMap.prototype.removeLayerEvt = function(layerid, evtMap) {
		this.impObj.removeLayerEvt(layerid, evtMap);
	};	
	
	//중심 변경
	SelfMap.prototype.setCenter = function(center, zoom, crs) {
		this.impObj.setCenter(center,zoom,crs);
	};
	
	//지도 MBR
	SelfMap.prototype.getMbr = function() {
		return this.impObj.getMbr();
	};
	
	//지도 MBR  맞춤
	SelfMap.prototype.setMbr = function(coodArray, crs_code) {
		return this.impObj.setMbr(coodArray,crs_code);
	};
	
	//지도 해상도
	SelfMap.prototype.getCurrentResolution = function() {
		return this.impObj.getCurrentResolution();
	};
	
	//레이어 목록
	SelfMap.prototype.getLayers = function() {
		return this.impObj.getLayers();
	};
	
	//레이어 redraw()
	SelfMap.prototype.redrawLayer = function(layerid, opt) { 
		this.impObj.redrawLayer(layerid, opt);
	};
	
	//레이어 remove()
	SelfMap.prototype.removeLayer = function(layerid) {
		this.impObj.removeLayer(layerid);
	};
	
	// feature 레이어 remove()  -- layerid : feature_id
	SelfMap.prototype.removeFeatureLayer = function(layerid) {
		this.impObj.removeFeatureLayer(layerid);
	};
	
	//레이어 존재 여부
	SelfMap.prototype.hasLayer = function(layerid) {
		return this.impObj.hasLayer(layerid);
	};
	
	//원 그리기
	SelfMap.prototype.drawCircle = function(option, callback) {
		return this.impObj.drawCircle(option,callback);
	};
	
	//선 그리기
	SelfMap.prototype.drawPolyline = function(option, callback) {
		return this.impObj.drawPolyline(option,callback);
	};
	
	//다각형 그리기
	SelfMap.prototype.drawPolygon = function(option, callback) {
		return this.impObj.drawPolygon(option,callback);
	};
	
	//사각형 그리기
	SelfMap.prototype.drawRectangle = function(option, callback){
		return this.impObj.drawRectangle(option,callback);
	};
	
	//wkt 그리기
	SelfMap.prototype.drawWkt = function(id, wkt, crs, callback) {
		return this.impObj.drawWkt(id, wkt, crs, callback);
	};
	
	//circle
	SelfMap.prototype.drawLoadCircle = function(id, latlng, r, crs, callback, options) {
		return this.impObj.drawLoadCircle(id, latlng, r, crs, callback, options);
	};
	
	//그려진 도형 지우기
	SelfMap.prototype.removeDrawnVector = function(vector_id) {
		return this.impObj.removeDrawnVector(vector_id);
	};
	
	//그려진 전체 도형 지우기
	SelfMap.prototype.removeDrawnVectorAll = function() {
		this.impObj.removeDrawnVectorAll();
	};
	
	//레이어 숨기기
	SelfMap.prototype.hideLayer = function(layer_id) {
		return this.impObj.hideLayer(layer_id);
	};
	
	//레이어 보이기
	SelfMap.prototype.showLayer = function(layer_id) {
		return this.impObj.showLayer(layer_id);
	};
	
	//레이어 토글
	SelfMap.prototype.toggleLayer = function(layer_id) {
		return this.impObj.toggleLayer(layer_id);
	};
	
	//wkt 벡터 올리기
	SelfMap.prototype.wktToVector = function(wktStr, feature_id, attributes, crs, evtMap, clear, options) {
		this.impObj.wktToVector(wktStr, feature_id, attributes, crs, evtMap, clear, options);
	};
	
	// 피쳐그룹(레이어)에 wkt 피쳐 올리기
	SelfMap.prototype.addFeature = function(featureGroup, wktStr, feature_id, attributes, crs, evtMap, clear, options) { 
		this.impObj.addFeature(featureGroup, wktStr, feature_id, attributes, crs, evtMap, clear, options);
	};
	
	//거리측정
	SelfMap.prototype.measureDistance = function(callback) {
		return this.impObj.measureDistance(callback);
	};
	
	//면적측정
	SelfMap.prototype.measureArea = function(callback) {
		return this.impObj.measureArea(callback);
	};
	
	//원측정
	SelfMap.prototype.measureCircle = function(callback) {
		return this.impObj.measureCircle(callback);
	};
	
	//측정초기화
	SelfMap.prototype.clearMeasure = function(option, callback) {
		return this.impObj.clearMeasure(option,callback);
	};
		
	//wms getfeatureinfo
	SelfMap.prototype.wmsGetFeatureInfo = function(url, layerId, latlng , callback) {
		this.impObj.wmsGetFeatureInfo(url, layerId, latlng, callback);
	}
	
	SelfMap.prototype.infoPop = function(latlng, content) {
		this.impObj.infoPop(latlng, content);
	}

	SelfMap.prototype.addLabeledMarker = function(latlng, proj, markerOption ) {
		return this.impObj.addLabeledMarker(latlng, proj, markerOption);
	}
	
	SelfMap.prototype.removeLabeledMarker = function(id) {
		this.impObj.removeLabeledMarker(id);
	}
	
	SelfMap.prototype.setOpacity = function(id, opac) {
		this.impObj.setOpacity(id, opac);
	}
	
	SelfMap.prototype.setWktMbr = function(wkt, crs , zLevel) {
		this.impObj.setWktMbr(wkt, crs, zLevel);
	}
	
	SelfMap.prototype.getLayer = function(id) {
		return this.impObj.getLayer(id);
	}
	
	SelfMap.prototype.addFeatureLayer = function(id) {
		return this.impObj.addFeatureLayer(id);
	}
	
	SelfMap.prototype.getFeatures = function(featureGroup) {
		return this.impObj.getFeatures(featureGroup);
	}
	
	SelfMap.prototype.updateFeature = function(feature, options) {
		this.impObj.updateFeature(feature, options);
	}
	
	SelfMap.prototype.showFeature = function(feature) {
		this.impObj.showFeature(feature);
	};
	
	SelfMap.prototype.hideFeature = function(feature) {
		this.impObj.hideFeature(feature);
	};
	
	SelfMap.prototype.fnProj4 = function(source, dest, pointArr){
		return this.impObj.fnProj4(source, dest, pointArr);
	}
	
	SelfMap.prototype.resize = function() {
		this.impObj.resize();
	};
	
	return SelfMap;
})();

