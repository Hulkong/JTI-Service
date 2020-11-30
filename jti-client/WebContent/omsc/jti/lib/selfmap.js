//셀프맵 컴포넌트
//layerViewer등 다른 컴포넌트가 없는 경우도 고려하여 코딩 필요함.

if(window.omsMain === undefined)
	omsMain = {};

omsMain.selfmap = {
	crs: undefined,
	selector: '#selfmap',
	instance: null,
	map: null,
	mapId: (omsMain.util) ? omsMain.util.uuid() : undefined,
	config: {
		wms: {
			url: '',
			version: '1.3.0',
			format: 'image/png',
			transparent: true
		},
		vectorShapes: {},
		cacheKeyUrl: '',
		server: {}
	},
	events: {}, // 레이어의 evtMap 객체 관리
	clickFunction: [],
	currentZoom: undefined
};

var _Selfmap = function() {};

//셀프맵 - 생성
omsMain.selfmap.init = function(option) {
	var _self = this;
	var selector = option.selector || this.selector;
	var leafletOption = {
		ele_id : $(selector).attr('id'),
		baseMapType : option.baseMapType,
		eventHandler: { 
			click: function(event) {
				_self.wmsInfoPop(event, _self);
			}
		}
	};
	
	
	if(option.baseMapType === undefined) {
		leafletOption.baseMapType = "openmate";
	}
		
	leafletOption = $.extend({}, leafletOption, option);
	
	this.jq = $(selector);
	this.baseLayerId = option.baseLayerId || "openmateBaseLayer";
	this.instance = new SelfMap(new OpenmateSelfmap(leafletOption));
	
	if(!option.whiteBackground) {
		this.instance.createBaseMap(this.baseLayerId);
	}
	
	this.map = this.instance.getMapObject();
	
	// 레이어 선택 이벤트시
	$(selector).on('layer-targeted', function(event, dataNo, refresh) {
		_self.changeLayer(event, refresh || false, dataNo, undefined, _self);
	});
	
	$(selector).on('layer-deleted', function(event, layer) {
		if(layer.layers.length > 1) {
			// 복합 레이어
			for(var i = 0; i < layer.layers.length; i++) {
				_self.instance.removeLayer(layer.mapLayerName + '_' + i);
			}
		} else {
			_self.instance.removeLayer(layer.mapLayerName);
		}
	});
	
	// 레이어 보이기
	$(selector).on('layer-show', function(event, layer) {
		_self.showLayer(layer);
	});
	
	// 레이어 숨기기
	$(selector).on('layer-hide', function(event, layer) {
		_self.hideLayer(layer);
	});
	
	_Selfmap.prototype = $.extend({}, this);
	
	return new _Selfmap(); 
};

/**
 * 	배경지도를 생성한다.
 */
omsMain.selfmap.changeBaseLayer = function(baseLayerId) {
	this.instance.changeBaseLayer(baseLayerId);
};

/**
 * 지도 DOM객체 사이즈 변경시 호출하여 지도를 갱신한다.
 */
omsMain.selfmap.resize = function() {
	this.instance.resize();
};

/**
 * 현재 지도뷰의 사각경계 좌표를 구한다.
 * @return {Number[]} 사각경계 [minx, miny, maxx, maxy] 좌표 배열
 */
omsMain.selfmap.getBounds = function() {
	return this.instance.getMbr();
};

/**
 * 현재 지도뷰의 사각경계 좌표를 설정한다.
 * @param {Number[]} bounds - 사각경계 [minx, miny, maxx, maxy] 좌표 배열
 * @param {string} [crs] - 좌표계(디폴트는 omsMain.selfmap.crs에 설정된 값 또는 WGS84)
 */
omsMain.selfmap.setBounds = function(bounds, crs) {
	return this.instance.setMbr(bounds, crs || this.crs);
};

/**
 * 줌레벨을 구한다.
 * @return {integer} 지도의 현재 줌레벨
 */
omsMain.selfmap.getZoom = function() {
	return this.instance.getZoom();
};

/**
 * 줌레벨을 설정한다.
 * @param {integer} zoom - 줌레벨
 */
omsMain.selfmap.setZoom = function(zoom) {
	this.instance.setZoom(zoom);
};

/**
 * 입력된 좌표를 지도의 중심으로 이동한다.
 * @param {integer} x - x좌표
 * @param {integer} y - y좌표
 * @param {integer} zoom - 줌레벨
 */
omsMain.selfmap.setCenter = function(x, y, zoom) {
	this.instance.setCenter([y, x], zoom || this.instance.getZoom());
};

/**
 * 지도의 중심좌표를 구한다.
 * @return {Number[]} 중심좌표 [x,y] 좌표 배열
 */
omsMain.selfmap.getCenter = function() {
	return this.instance.getMapObject().getCenter();
};

omsMain.selfmap.hasLayer = function(dataNo) {
	var layer = omsMain.getLayer(dataNo);
	if(layer.layers.length > 1) { // 복합레이어 - 하나라도 있으면 있는 것으로.
		for(var i = 0; i < layer.layers.length; i++) {
			return this.instance.hasLayer(layer.mapLayerName + '_' + i);
		}
	}
	
	return this.instance.hasLayer(layer.mapLayerName);
};

omsMain.selfmap.showLayer = function(layer) {
	var _self = this;
	
	if(typeof layer === 'undefined' || $.isArray(layer) || typeof layer !== 'object')
		layer = omsMain.getLayer(layer);

	if(layer) {
		layer.visible = true;
		
		// _bindEventMap로 등록된 이벤트 init함수 호출
		if(_self.events[layer.mapLayerName] !== undefined)
			_self.events[layer.mapLayerName].init();

		if(layer.layers.length > 1) { // 복합레이어
			for(var i = 0; i < layer.layers.length; i++) {
				if(layer.visibles === undefined || layer.visibles[i] == 1) {
					_self.instance.showLayer(layer.mapLayerName + '_' + i);
				}
			}
		} else {
			_self.instance.showLayer(layer.mapLayerName);
		}
	}
};

omsMain.selfmap.hideLayer = function(layer, isAll) {
	var _self = this;
	
	if(typeof layer === 'undefined' || $.isArray(layer) || typeof layer !== 'object')
		layer = omsMain.getLayer(layer);
	
	if(layer) {
		// _bindEventMap로 등록된 이벤트 init함수 호출
		if(_self.events[layer.mapLayerName] !== undefined)
			_self.events[layer.mapLayerName].init(true);

		if(layer.layers.length > 1) { // 복합레이어
			var cnt = 0;
			for(var i = 0; i < layer.layers.length; i++) {
				if(isAll || layer.visibles === undefined || layer.visibles[i] != 1) {
					_self.instance.hideLayer(layer.mapLayerName + '_' + i);
					cnt++;
				}
			}
			// 전체다 숨길일 때 visible을 false로 한다.
			if(cnt == layer.layers.length)
				layer.visible = false;
		} else {
			layer.visible = false;
			_self.instance.hideLayer(layer.mapLayerName);
		}
	}
};

omsMain.selfmap.hideAllLayer = function(exclude) {
	var _self = this;
	
	$.each(omsMain.config.layers, function(dataNo, layer) {
		// 제외할 레이어
		if(exclude !== undefined) {
			if(exclude.indexOf(',' + dataNo + ',') >= 0)
				return;
			if(exclude.indexOf(',' + layer.name + ',') >= 0)
				return;
		}
		
		if(layer.visibles !== undefined)
			for(var i = 0; i < layer.visibles.length; i++)
				layer.visibles[i] = 0;
		_self.hideLayer(layer);
	});
};

//레이어 삭제
omsMain.selfmap.removeLayer = function(dataNo, index) {
	var _self = this;
	var layer = omsMain.getLayer(dataNo);
	if(layer) {
		layer.enable = false;
		delete layer['visible'];
		_self.instance.removeLayer((index !== undefined) ? layer.mapLayerName + '_' + index : layer.mapLayerName);
//		$('.onlayerevent').trigger('layer-removed', [dataNo]);
	}
};

omsMain.selfmap.removeAllLayer = function() {
	var _self = this;
	$.each(omsMain.config.layers, function(dataNo, layer) {
		layer.enable = false;
		delete layer['visible'];
		if(layer.layers.length > 1) { // 복합레이어
			if(layer.visibles === undefined) // ----------------> ????why do this?
				layer.visibles = [];
			for(var i = 0; i < layer.layers.length; i++) {
				layer.visibles[i] = 0;
				_self.instance.removeLayer(layer.mapLayerName + '_' + i);
			}
		} else _self.instance.removeLayer(layer.mapLayerName);
//		$('.onlayerevent').trigger('layer-removed', [dataNo]);
	});
};

omsMain.selfmap.setZIndex = function(dataNo, index) {
	var _self = this;
	if(dataNo !== undefined) {
		var layer = omsMain.getLayer(dataNo);
		if(!layer) return;
		
		if(layer.layers.length > 1) { // 복합레이어
			for(var i = 0; i < layer.layers.length; i++) {
				_self.instance.setZIndex(layer.mapLayerName + '_' + i, index + i);
			}
		} else _self.instance.setZIndex(layer.mapLayerName, index);
	}
};

// feature
omsMain.selfmap.wmsInfoPop = function(event, self) {
	var _self = self || omsMain.selfmap;

	if(arguments.length > 1) {
		_self = arguments[1];
	}
	
	var infoCount = 0; // 대상 레이어 개수
	$.each(omsMain.config.layers, function(dataNo, layer) {
		
		if(layer.useInfoPop && layer.visible) {
			infoCount++;
		}
	});
	
	var allData = {
		features: []
	};
	
	$.each(omsMain.config.layers, function(dataNo, layer) {
		var wmsUrl = _self.config.server.url + '/ows/OGCServiceControll.do?';
		
		if(layer.useInfoPop && layer.visible) {

//			if(layer['exfilter']) {
//				wmsUrl += '&exfilter=' + encodeURIComponent(layer['exfilter']);
//			}
//
//			if(layer['exparam']) {
//				wmsUrl += '&exparam=' + encodeURIComponent(layer['exparam']);
//			}
			if(layer.name.toLocaleLowerCase().indexOf('label') >-1) {
				infoCount--;
				return;	
			}
			var exfilter;
			var addParam = {};
			if(layer['exfilter']) {
//				wmsUrl += '&exfilter=' + encodeURIComponent(layer['exfilter']);
				addParam.exfilter = layer['exfilter'];
			}
			
			var  options = {
					url : wmsUrl,
					addParam : addParam,
					layerId : layer['id'],
					latlng : event[4326],
					cbFn : callback
			}
			
			_self.instance.wmsGetFeatureInfo(options);
			function callback(data) {
				infoCount--;
				
				if(typeof data === 'string' && data.length > 0)
					data = JSON.parse(data);
				
				if(data && data.features && data.features.length > 0) {
					data['features'].forEach(function(d, i) {
						allData['features'].push(d);
					});
				}
				
				if(allData && infoCount == 0) {
					layer.infoPop.open(allData, event);
				}
			}

		}
	});
	
	$.each(_self.clickFunction, function(i, func) {
		func(event);
	});
};

omsMain.selfmap.addClickFunction = function(func) {
	this.clickFunction.push(func);
};

omsMain.selfmap._bindEventMap = function(dataNo) {
	var _self = this;
	var layer = omsMain.getLayer(dataNo);
	
	if(!this.hasLayer(dataNo)) {
		this.events[layer.mapLayerName] = (function(layer) {
			var count = 0, sum = 0, cur = 0, timeId, name = layer.mapLayerName;
			
			return {
				tilestart: function() {
					$('.loader.' + name).text('');
					$('.loader.' + name).show();
					count++;	
					sum++;
					
					// 레이어 그리는 중에 줌 레벨이 변경되는 경우 0으로 하여 다음에 다시 그리도록 조치함.
					if(layer.zoom != _self.instance.getZoom())
						layer.zoom = 0;
					//layer.mbr = omsMain.selfmap.instance.getMbr();
				},
				tileend: function() {
					count--;
					cur++;
					var rate = Number(Math.round(cur/sum*100+'e1')+'e-1');
					$('.loader.' + name).text(((layer.title) ? layer.title : layer.id) + ' : ' + rate + '% Loading...');
					if(count == 0) {
						sum = 0;
						cur = 0;
						
						$('.loader.' + name).hide();
//						if(omsMain.layerViewer) 
					}
					
					clearTimeout(timeId);
					// 5초 동안 반응이 없으면 오류로 보고 초기화.
					timeId = setTimeout(function() {
						count = 0;
						sum = 0;
						cur = 0;
						$('.loader.' + name).hide();
					}, 10000);

					// 레이어 그리는 중에 줌 레벨이 변경되는 경우 0으로 하여 다음에 다시 그리도록 조치함.
					if(layer.zoom != _self.instance.getZoom())
						layer.zoom = 0;
				},
				init: function(hide) {
					if(count > 0) 
						$('.loader.' + name).show();
					
					if(hide) 
						$('.loader.' + name).hide();

					// 레이어 그리는 중에 줌 레벨이 변경되는 경우 0으로 하여 다음에 다시 그리도록 조치함.
					if(layer.zoom != _self.instance.getZoom())
						layer.zoom = 0;
					layer.mbr = _self.instance.getMbr();
				},
				click: function(event) {
					if(layer.click === 'function')
						layer.click(event);
				}
			};
		})(layer);
		
		$('#loader').append('<div class="ui inline loader hidden ' + layer.mapLayerName + '">Loading...</div>');
		
		return _self.events[layer.mapLayerName];
	}
};

omsMain.selfmap.equalMbr = function(layer) {
	if(layer.mbr === undefined) {
		return true;
	}
	
	var mbr = this.instance.getMbr();
	if(layer.mbr[0] != mbr[0] || layer.mbr[1] != mbr[1] || layer.mbr[2] != mbr[2] || layer.mbr[3] != mbr[3]) {
		return false;
	}

	return true;
};

omsMain.selfmap.isVisible = function(layerNo) {
	return omsMain.getLayer(layerNo).visible;
};
/*
 * SLD를 추가함
 * 
 * */
omsMain.selfmap.wmsDrawLayer = function(layerNo, eventMap) {
//	console.log('omsMain.selfmap.wmsDrawLayer')
	if(!layerNo) {
		alert('레이어키가 없습니다!');
		return;
	}

	var layer = omsMain.getLayer(layerNo);
	var name = layer['mapLayerName'];
	var wmsUrl = omsMain.selfmap.config.wms.url;
	
	var option = {
		exfilter: layer['exfilter'],   // Mybatis SQL 쿼리 조건
		exparam: JSON.stringify(layer['exparam']),   //  Mybatis SQL 쿼리 파라미터
		exstyle: JSON.stringify(layer.styles[0][layer.index]),
		format: "image/png",
		layers: layer['id'],
		name: layer['name'],
		styles: layer.styles[0][layer.index].type,
		transparent: true,
		version: "1.3.0",
		zIndex: layer['zIndex'],
		subdomains: "0123",   // WMS 분산 요청 도메인 옵션
		reuseTiles: true,     // 타일 재사용 여부
		noCache: layer['noCache']
//		noCache: true
	}
	if(layer['exparam'] === undefined){
		delete option.exparam;
	}
	if(!eventMap) {
		eventMap = this._bindEventMap(layerNo);
	}
	if(layer['sldName']) {
		option.exstyle="";
		option.styles=layer['sldName'];
	}	
	layer.visible = true;
	layer.enable = true;

	this.instance.addWmsLayerMap(name, wmsUrl, option, eventMap);
};

omsMain.selfmap.wmsRedrawLayer = function(layerNo, eventMap) {
//	console.log('omsMain.selfmap.wmsRedrawLayer')
	if(!layerNo) {
		alert('레이어키가 없습니다!');
		return;
	}
	
	var layer = omsMain.getLayer(layerNo);
	var name = layer['mapLayerName'];
	
	var option = {
		exfilter: layer['exfilter'],
		exparam: JSON.stringify(layer['exparam']),
		exstyle: JSON.stringify(layer.styles[0][layer.index]),
		format: "image/png",
		layers: layer['id'],
		name: layer['name'],
		styles: layer.styles[0][layer.index].type,
		transparent: true,
		version: "1.3.0",
		zIndex: layer['zIndex'],
		subdomains: "0123",   // WMS 분산 요청 도메인 옵션
		reuseTiles: true,     // 타일 재사용 여부
		noCache: layer['noCache'] 
//		noCache: true 
	}
	if(layer['exparam'] === undefined){
		delete option.exparam;
	}
	if(!eventMap) {
		eventMap = this._bindEventMap(layerNo);
	}
	if(layer['sldName']) {
		option.exstyle="";
		option.styles=layer['sldName'];
	}	
	layer.visible = true;
	layer.enable = true;

	this.instance.redrawLayer(name, option);
};

// 피쳐 그리기
omsMain.selfmap.drawFeatures = function(layer, params, eventMap) {
	var _self = this;
	
	delete params['exstyle'];
	
	$.ajax(layer.url, {
		data: params,
		success: function(result, status) {
			var data = $.isArray(result) ? result : result[layer.resultKey]; 
			var features = layer.features[layer.index] || [];
			var options = omsMain.getStyle('wkt', layer.layers[layer.index]);
			var mapLayer;
			
			if(_self.instance.hasLayer(layer.mapLayerName)) {
				mapLayer = _self.instance.getLayer(layer.mapLayerName);
			} else {
				mapLayer = _self.instance.addFeatureLayer(layer.mapLayerName);
			}
			
			var cm, styleMap, column = options.column, value;
			if(options.colorMap !== undefined) {
				styleMap = {};				
				for(var i = 0; i < options.colorMap.length; i++) {
					cm = options.colorMap[i];
					value = cm.value;
					styleMap[value] = $.extend(cm, options);
					delete styleMap[value]['column'];
					delete styleMap[value]['type'];
					delete styleMap[value]['value'];
					delete styleMap[value]['colorMap'];
				}
			}
			
			data.forEach(function(item) {
				if(styleMap !== undefined) {
					_self.instance.addFeature(mapLayer, item.wkt, item.id, item.attributes, item.crs, eventMap || {}, false, styleMap[item.attributes[column]]);
				} else {
					_self.instance.addFeature(mapLayer, item.wkt, item.id, item.attributes, item.crs, eventMap || {}, false, options);
				}
				features.push(item.id);
			});
			layer.features[layer.index] = features;
//			$('.onlayerevent').trigger('draw-end', [layer]);
		},
		error: function(result, status, error) {
			console.log(status);
			console.log(error);
			return;
		},
		method: 'POST'
	});
};

/**
 * 마크들을 그린다.
 * 1. URL 데이터로 마크들을 그린다.
 * 2. 좌표로 마크를 그린다.
 */
omsMain.selfmap.drawMarkers = function(layer, params) {
	var _self = this;
	
	if(layer.url) {
		$.ajax(layer.url, {
			data: params,
			success: function(result, status) {
				var data = $.isArray(result) ? result : result[layer.resultKey]; 
				var markers = layer.markers || [];
				data.forEach(function(item) {
					markers.push(_self.instance.addLabeledMarker([item.x || item.lng || item.xAxis, item.y || item.lat || item.yAxis], layer.crs || 'katec', layer.markerOption(item)));
				});
				layer.markers = markers;
			},
			error: function(result, status, error) {
				console.log(status);
				console.log(error);
				return;
			},
			method: 'POST'
		});
	} else {
		var data = layer.data;
		var markers = layer.markers || [];
		data.forEach(function(item, index) {
			markers.push(_self.instance.addLabeledMarker([item.x || item.lng || item.xAxis, item.y || item.lat || item.yAxis ], layer.crs || 'katec', layer.markerOption(index)));
		});
		layer.markers = markers;
	}

};

// 03-21(김용현) 원 그리기
omsMain.selfmap.drawLoadCircle = function(option) {
	omsMain.selfmap.instance.drawLoadCircle(option.id, option.latlng, option.radius , option.crs, option.callback, option.style);
};

//03-22(김용현) 거리 측정하기
omsMain.selfmap.measureDistance = function() {
	omsMain.selfmap.instance.measureDistance();
};

//03-22(김용현) 거리 측정하기
omsMain.selfmap.measureArea = function() {
	omsMain.selfmap.instance.measureArea();
};

//03-22(김용현) 측정 초기화하기
omsMain.selfmap.clearMeasure = function() {
	omsMain.selfmap.instance.clearMeasure();
};

//03-22(김용현) 인포윈도우 생성하기
omsMain.selfmap.infoPop = function(option) {
	omsMain.selfmap.instance.infoPop(option.latlng, option.content);
};

/**
 * 직접 원 그리기
 * @param callback - callback함수
 */
omsMain.selfmap.drawCircle = function(option,callback){
	this.instance.drawCircle(option,function(circle) {
		omsMain.selfmap.addVectorShape({id: circle.vector_id, group:'circle'});
		if(callback){
			callback(circle);
		}
	});
}

/**
 * 직접 직선 그리기
 * @param callback - callback함수
 */
omsMain.selfmap.drawPolyline = function(option,callback){
	this.instance.drawPolyline(option,function(line) {
		omsMain.selfmap.addVectorShape({id: line.vector_id, group:'line'});
		if(callback)
			callback(line);
	});
}

/**
 * 직접 사각형 그리기
 * @param callback - callback함수
 */
omsMain.selfmap.drawRectangle = function(option,callback){
	this.instance.drawRectangle(option,function(rectangle) {
		omsMain.selfmap.addVectorShape({id: rectangle.vector_id, group:'rectangle'});
		if(callback)
			callback(rectangle);
	});
}

/**
 * 직접 다각형 그리기
 * @param callback - callback함수
 */
omsMain.selfmap.drawPolygon = function(option,callback){
	this.instance.drawPolygon(option,function(polygon) {
		omsMain.selfmap.addVectorShape({id: polygon.vector_id, group:'polygon'});
		if(callback)
			callback(polygon);
	});
}

/**
 * 측정 - 원
 */
omsMain.selfmap.measureCircle = function(option){
	this.instance.measureCircle(option, function(circle){
		
	});
}

// 03-21(김용현) wkt도형 그리기
omsMain.selfmap.drawWkt = function(option) {
	omsMain.selfmap.instance.drawWkt(option.id, option.wkt, option.crs, option.callback);
};

// 마크들을 삭제한다.
omsMain.selfmap.removeMarkers = function(layer) {
	var _self = this;
	
	if(layer.markers !== undefined) {
		layer.markers.forEach(function(id) {
			_self.instance.removeLabeledMarker(id);
		});
		layer.markers = [];
	}
};

// 벡터 오버레이를 추가한다.
omsMain.selfmap.addVectorShape = function(vector) {
	this.config.vectorShapes[vector.id] = vector;
};

// 벡터 오버레이를 삭제한다.
omsMain.selfmap.removeVectorShapes = function(group) {
	for(var id in this.config.vectorShapes) {
		var entry = this.config.vectorShapes[id];
		
		if(group !== undefined) {
			if(entry.group == group) {
				if(group == 'featureContent'){
					this.instance.removeFeatureLayer(id);
					delete this.config.vectorShapes[id];
				}else{
					this.instance.removeDrawnVector(id);
					delete this.config.vectorShapes[id];
				}
			}
		} else {
			this.instance.removeDrawnVector(entry.id);
			delete this.config.vectorShapes[id];
		}
	}
};

// 벡터 오버레이 객체 삭제.
omsMain.selfmap.removeVectorShapesItem = function(id){
	if(id !== undefined){
		this.instance.removeDrawnVector(id);
		delete this.config.vectorShapes.id;
	}
};

// 벡터 오버레이 모든 객체 삭제.
omsMain.selfmap.removeDrawnVectorAll = function() {
	this.instance.removeDrawnVectorAll();
};

omsMain.selfmap.applyFilterToFeature = function(layer, filter) {
	if(layer.features !== undefined) {
		var group = this.instance.getLayer(layer.mapLayerName);
		var features = this.instance.getFeatures(group);
		group.filterEnable = true;
		
		for(var id in features) {
			if(filter(features[id].attributes))
				this.instance.showFeature(features[id]);
			else this.instance.hideFeature(features[id]);
		}
	}
};

omsMain.selfmap.getFeature = function(layerName, fid) {
	var group = this.instance.getLayer(layerName);
	var features = this.instance.getFeatures(group);
	for(var id in features) {
		if(features[id].feature_id == fid)
			return features[id];
	}
};

omsMain.selfmap.getFeatureAttributes = function(layerName) {
	var group = this.instance.getLayer(layerName);
	var features = this.instance.getFeatures(group);
	var attributes = {};
	for(var id in features) {
		attributes[features[id].feature_id] = features[id].attributes;
	}
	return attributes;
};

omsMain.selfmap.clearFilterToFeature = function(layer) {
	if(layer.features !== undefined) {
		var group = this.instance.getLayer(layer.mapLayerName);
		var features = this.instance.getFeatures(group);
		delete group['filterEnable'];
		for(var id in features) {
			delete features[id]['enable'];
		}
	}
};

omsMain.selfmap.animate = function(layer, options, keys) {
	if(layer.features !== undefined) {
		var group = this.instance.getLayer(layer.mapLayerName);
		var features = this.instance.getFeatures(group);
		for(var id in features) {
			// stop
			features[id].styleAnimationTime = 0;
			if(features[id].timeId !== undefined) {
				clearInterval(features[id].timeId);
				delete features[id]['timeId'];
			}
		
			// 특정 id만 적용하는 경우.
			if(keys !== undefined) {
				var hasId = false;
				for (var i = 0; i < keys.length; i++) {
					if (keys[i] == id) {
						hasId = true;
						break;
					}
				}
				
				if(!hasId)
					continue;
			}

			// 스타일 
			if(options.styles !== undefined) {
				var time = options.time || 400;
				features[id].styleAnimationTime = time;
				this.instance.updateFeature(features[id], options.styles);
			}
		}
	}
};

omsMain.selfmap.stopAnimate = function(layer, style) {
	if(layer.features !== undefined) {
		var group = this.instance.getLayer(layer.mapLayerName);
		var features = this.instance.getFeatures(group);
		for(var id in features) {
			features[id].styleAnimationTime = 0;
			if(style !== undefined)
				this.instance.updateFeature(features[id], style);
		}
	}
};

omsMain.selfmap.setGray = function(id, isGray) {
	var layerJDom = this.jq.find('.' + id);
	if(isGray) 
		layerJDom.addClass('gray');
	else layerJDom.removeClass('gray');
};