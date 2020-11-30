// 셀프맵 뷰어 컴포넌트
var omsMain = {

	init: function (options) {
		// loading 초기화
		omsMain.loading.init();

		// 셀프맵 지도 초기화
		if (options.selfmap !== undefined)
			omsMain.selfmap.init(options.selfmap);

		// modal init
		omsMain.modal.init();

		// 컴포넌트 초기화
		if (options.components !== undefined)
			omsMain.components.init(options.components);
	},
	
	/**
	 * @description 현재 스타일, 필터 편집중인 레이어의 dataNo를 구함 
	 */
	getLayerNo: function () {
		var layer = omsMain.getLayer();
		if (layer !== undefined)
			return layer.layers[layer.index];
	},

	// id가 일치하는 dataNo를 구한다.
	getLayerNoById: function (id) {
		var result;
		$.each(omsMain.config.layers, function (dataNo, layer) {
			if (layer.id == id) {
				if (result === undefined) {
					result = dataNo;
				} else if ($.isArray(result)) {
					result.push(dataNo);
				} else {
					result = [result];
					result.push(dataNo);
				}
			}
		});
		return result;
	},

	// name가 일치하는 dataNo를 구한다.
	getLayerNoByName: function (name) {
		var result;
		$.each(omsMain.config.layers, function (dataNo, layer) {
			if (layer.name == name) {
				if (result === undefined) {
					result = dataNo;
				} else if ($.isArray(result)) {
					result.push(dataNo);
				} else {
					result = [result];
					result.push(dataNo);
				}
			}
		});
		return result;
	},

	isVisible: function (dataNo) {
		var layer = this.getLayer(dataNo);
		if(layer['visible']) {
			return layer['visible'];
		} else {
			return false;
		}
	},

	// dataNo에 해당하는 레이어 인덱스(개수) 구하기
	getIndex: function (dataNo) {
		var index = 0;
		for (var key in omsMain.config.layers) {
			if (key.indexOf(dataNo) == 0)
				index++;
		}
		return index;
	},

	// config에서 기본 레이어의 스타일을 구한다.
	getStyle: function (type, dataNo, index) {
		var layer = omsMain.getLayer(dataNo), styles = layer.styles[index || layer.index];

		for (var i = 0; i < styles.length; i++) {
			if (styles[i].type == type) {
				return styles[i];
			}
		}
	},

	// config에서 기본 레이어의 스타일 전체를 맵형식으로 구한다.
	getStyles: function (dataNo) {
		var obj = {},
			layer = omsMain.getLayer(dataNo);

		if (layer) {
			var styles = layer.styles[layer.index];

			for (var i = 0; i < styles.length; i++) {
				if (obj[styles[i].type] === undefined)
					obj[styles[i].type] = styles[i];
				else obj[styles[i].type + '_' + i] = styles[i];
			}
		}

		return obj;
	},

	// dataNo에 해당하는 레이어에 style 추가
	setStyle: function (type, layerNo, style) {
		if (!type) {
			alert('type이 없습니다!');
			return;
		}

		if (!layerNo) {
			alert('layerNo가 없습니다!');
			return;
		}

		if (!style) {
			alert('style이 없습니다!');
			return;
		}

		var layer = omsMain.getLayer(layerNo);

		// 기존스타일에 타입이 존재하면 교체
		if (omsMain.getStyle(type, layerNo)) {
			var tmpStyle = [[style]];
			layer.styles[layer['index']].forEach(function (s, i) {
				if (s['type'] !== type) {
					tmpStyle[layer['index']].push(s);
				}
			});

			layer.styles[layer['index']] = tmpStyle[layer['index']];
			// 기존스타일에 타입이 존재하지 않으면 추가
		} else {
			layer.styles[layer['index']].push(style);
		}
	},

	// 기준 레이어 구하기
	getLayer: function (dataNo) {
		return omsMain.config.layers[dataNo || omsMain.config.dataNo];
	},

	getLayers: function (dataKey, func) {
		var dataNo, layer, layers = [];

		if ($.isArray(dataKey)) {
			dataKey.map(function (key, index, data) {
				dataNo = omsMain.getLayerNoById(key);
				if (!$.isArray(dataNo))
					dataNo = [dataNo];

				for (var i = 0; i < dataNo.length; i++) {
					layer = omsMain.getLayer(dataNo[i]);
					layers.push(layer);

					if (typeof func === 'function')
						func(layer);
				}
			});
		}
		return layers;
	},

	// 해당 레이어의 스타일중에서 첫번째 기본스타일을 구함.
	getBasicStyle: function (dataNo) {
		var layer = this.getLayer(dataNo);
		return this.getStyle(layer.style[layer.index], dataNo);
	},

	// config에서 기본 레이어의 필터 전체를 구한다.
	getFilters: function (dataNo) {
		var layer = omsMain.getLayer(dataNo);
		return layer.filters[layer.index];
	},

	drawGeomFilterShape: function (dataNo) {
		var layer = omsMain.getLayer(dataNo);
		var filter = layer.filters[layer.index];

		// 그려져 있는 공간도형 초기화
		omsMain.selfmap.removeVectorShapes('filterEdit');

		// 적용할 공간도형 필터 지도에 그리기
		filter.forEach(function (entry) {
			if (entry.tp == 'geometry') {
				entry.value.forEach(function (geom) {
					if (geom.type != 'circle') {
						omsMain.selfmap.instance.drawWkt(geom.vector_id, geom.wkt4326);
					} else {
						omsMain.selfmap.instance.drawLoadCircle(geom.vector_id, geom.center4326, geom.radius);
					}
					omsMain.selfmap.addVectorShape({ id: geom.vector_id, group: 'filterEdit' });
				});
			}
		});
	},

	// 메타정보 구한다.
	getMeta: function (attrId, dataNo) {
		if (dataNo === undefined) var dataNo = omsMain.getLayerNo();
		var meta = omsMain.config.meta[dataNo];

		if (meta === undefined) {
			meta = { attributes: [] };
		} 

		if (!attrId) {
			return meta;
		} else {
			for (var i = 0; i < meta.attributes.length; i++) {
				if (attrId == meta.attributes[i].attrId)
					return meta.attributes[i];
			}
		}
	},

	getFeatureSetting: function (column) {
		var cs, ss = omsMain.featureSettings;
		for (var i = 0; i < ss.length; i++) {
			cs = ss[i].checkColumns;
			for (var j = 0; j < cs.length; j++) {
				if (cs[j] == column.toUpperCase()) {
					return ss[i];
				}
			}
		}
	},

	featureSettings: [{
		checkColumns: ['OM_DART_CLUSTER_CD'],
		load: function (data, event) {
			if (data.features.length == 1) {
				var params = {
					clusterCd: data.features[0].properties.omDartClusterCd,
					sex: data.features[0].properties.omSex,
					age: data.features[0].properties.omAge,
					address: data.features[0].properties.omAddress
				};

				$.ajax({
					dataType: 'jsonp',
					url: 'http://dart.geo-marketing.co.kr/fta/geoFlcInfoApi.jsp',
					data: params,
					method: 'POST',
					success: function (data, status, jqxhr) {
						omsMain.selfmap.instance.infoPop(event[4326], data);
					},
					error: function (jqxhr) {
						omsMain.selfmap.instance.infoPop(event[4326], '오류');
					}
				});
			}
		}
	}],

	// 레이어 추가 - 디폴트 스타일 반영  
	addLayerData: function (dataSet, isdraw, callback, kind) {
		// 레이어가 이미 있으면 callback만 실행한다.
		if (omsMain.getLayer(dataSet)) {
			callback();
			return;
		}

		var getType = function (type, logicalType) {
			type = logicalType || type.toLowerCase();
			if (',geometry,'.indexOf(',' + type + ',') >= 0)
				return 'geometry';
			else if (',decimal,number,int,double,bigint,float,numeric,integer,int4,x,y,minx,miny,lon,lat,maxx,maxy,'.indexOf(',' + type + ',') >= 0)
				return 'number';
			else if (',category,age,sex,'.indexOf(',' + type + ',') >= 0)
				return 'category';
			else return 'string';
		};

		var params = { dataSet: dataSet };
		if (kind !== undefined)
			params.type = kind;

		$.support.cors = true;
		$.ajax({
			dataType: 'json',
			url: jtiConfig['mapserverUrl'] + '/map/layers.json',
			data: params,
			success: function (data) {
				var i = 0, j = 0, k = 0, result = {}, dataNo, oldDataNo = 0, index = -1;
				var layerObj, style, attrs, meta, key, keys = [];
				try {
					// 레이어 정보 셋팅
					var dataList = (typeof dataSet === 'string' && dataSet.indexOf(',') > 0) ? dataSet.split(',') : [dataSet];
					for (k = 0; k < dataList.length; k++) {
						oldDataNo = 0;
						for (i = 0; i < data.layers.length; i++) {
							dataNo = data.layers[i].dataNo;

							if (dataList[k] != dataNo && dataList[k] != data.layers[i].dataId && dataList[k] != data.layers[i].layerName)
								continue;

							style = (data.layers[i].styleContent !== undefined) ? $.parseJSON(data.layers[i].styleContent) :
								((data.layers[i].styleName !== undefined) ? { type: data.layers[i].styleName } : {});

							if (style.column !== undefined) style.column = style.column.toUpperCase();
							if (oldDataNo != dataNo) {
								if (omsMain.config.layers[dataNo] === undefined) {
									key = dataNo;
								} else {
									// 동일한 dataNo의 레이어를 추가할 수 있다. key값을 인덱스를 부여하여 다르게 관리한다.
									key = dataNo + '_' + omsMain.getIndex(dataNo);
								}

								layerObj = {
									id: data.layers[i].dataId,
									dataTy: data.layers[i].dataTy,
									name: data.layers[i].layerName || data.layers[i].dataId, // 레이어명
									title: data.layers[i].layerTitle || data.layers[i].dataNm,
									desc: data.layers[i].layerAbstract || data.layers[i].dataDsc,
									mapLayerName: (data.layers[i].layerName || data.layers[i].dataId) + '_' + key, // 레이어명 
									crs: data.layers[i].sourceCrs, // 좌표계
									index: 0,
									style: [style.type], // 스타일 유형
									filters: [[]], // 필터
									styles: [[]], // 스타일
									layers: [dataNo], // 그룹레이어는 layers에 dataNo가 여러개
									visible: false,
									exparam: undefined,
									exfilter: '',
									infoPop: undefined,
									useInfoPop: false
								};

								if (data.layers[i].dataTy == 'WMS')
									layerObj.url = data.layers[i].dataUrl;

								index++;

								keys.push(key);
								// 레이어 추가
								omsMain.config.layers[key] = layerObj;
								// dataSet추가
								omsMain.config.dataSet.push(key);
								// meta 설정 - 메타는 1개만 유지 한다.
								if (omsMain.config.meta[dataNo] === undefined) {
									attrs = data['attrs' + dataList[k]];
									if (attrs !== undefined) {
										meta = { attributes: [] };
										for (j = 0; j < attrs.length; j++) {
											meta.attributes.push({
												attrId: attrs[j].name,
												camelId: attrs[j].camelName,
												attrNm: attrs[j].label || attrs[j].name,
												type: getType(attrs[j].type, attrs[j].logicalType)
											});

											var fSet = omsMain.getFeatureSetting(attrs[j].name);
											if (fSet !== undefined) {
												layerObj.infoPop = fSet.load;
											}
										}
										omsMain.config.meta[dataNo] = meta;
									}
								}

								// visible에 추가.
								omsMain.config.visible.push(key);
							}

							// dataNo당 스타일 건수 만큼 반복됨.
							layerObj.styles[0].push(style);

							oldDataNo = dataNo;
						}
					}

					result.layers = data.layers;
				} catch (e) {
					result.error = e;
					console.log(e);
				}

				if (callback !== undefined)
					callback(result);
			}
		});
	},

	// 저장하기
	save: function (title, desc) {
		var params = {
			config: JSON.stringify(omsMain.config),
			pageNo: (omsMain.config.pageNo === undefined) ? 0 : omsMain.config.pageNo,
			pageTitle: title,
			pageType: 'my',
			pageDesc: desc || ''
		};

		$.post(omsMain.settings.urls.editSave, params,
			function (data) {
				if (data.message) {
					// 메시지 출력 필요할듯
					alert(data.message);
				} else {
					omsMain.config.pageNo = data.pageNo;
					alert('저장되었습니다.');
				}
			}
		);
	},

	// 디폴트 스타일 저장
	saveStyle: function (dataNo) {

		var layer = omsMain.getLayer(dataNo),
			styles = layer.styles[layer.index],
			style,
			params = {};

		params.dataNo = dataNo;
		params.styleCount = styles.length;

		for (var i = 0; i < styles.length; i++) {
			params['style' + i] = JSON.stringify(styles[i]);
			params['type' + i] = styles[i].type;
		}

		omsMain.util.ajax('saveStyle', params, function (result, status, jqxhr) {
			//callback함수정리
			if (result == '' || typeof result == 'undefind') {
				alert("없음");
			} else {
				alert("성공");
			}
		});
	},

	// 필터 저장
	saveFilter: function (dataNo, seqNo, callback) {
		var params = {};
		params.filter = JSON.stringify(omsMain.getFilters(dataNo));
		params.dataNo = dataNo;
		if (seqNo !== undefined)
			params.seqNo = seqNo;
		if (omsMain.config.userNo !== undefined)
			params.userNo = omsMain.config.userNo;

		omsMain.util.ajax('saveFilter', params, function (result, status, jqxhr) {
			if (callback !== undefined)
				callback();
		});
	},


	// omsc component 로딩.
	loadComponent: function (name, conf) {
		this.components.loadComponent(name, conf);
	}
};

omsMain.modal = {
	selector: '#modal',

	config: {
		drag: false
	},

	show: function (top, left) {
		this.jq.show();
	},

	close: function () {
		omsMain.util.hide(this.jq);
	},

	// 버턴 추가.
	addButton: function (btn) {
		var container = this.jq.children('.pop_footer');
		if (container.find('.button.' + btn.name).length == 0) {
			$('<a class="btn_ty1 button ' + btn.name + '">' + btn.value + '</a>')
				.appendTo(container).on('click', btn.click);
		} else {
			this.showButton(btn.name);
		}
	},

	// 버턴 제거
	removeButton: function (name) {
		var container = this.jq.children('.pop_footer');
		container.find('.button.' + name).remove();
	},

	showButton: function (name) {
		var container = this.jq.children('.pop_footer');
		return container.find('.button.' + name).show().length == 1;
	},

	hideButton: function (name) {
		var container = this.jq.children('.pop_footer');
		container.find('.button.' + name).hide();
	},

	init: function () {
		var self = this;
		this.jq = $(this.selector);

		if (this.config.drag)
			this.jq.draggable();

		// 모달 닫기
		this.jq.find('.button.close').on('click', function () {
			self.close();
		});
	}
};

omsMain.loading = {
	selector: '#loading',

	jq: undefined,

	config: {},

	show: function (message, id) {
		// 메시지 창 보임.
		this.jq.show();
		this.jq.find('[id="loader-' + id + '"]').remove();
		// 현재 메시지를 추가한다.
		var curM = $('<li id="loader-' + id + '">' + message + '</li>').appendTo(this.jq.find('.body'));
	},

	hide: function (id) {
		this.jq.find('.body').find('li[id="loader-' + id + '"]').remove();
		if (this.jq.find('.body').children().length == 0)
			this.jq.hide();
	},

	init: function (option) {
		this.config = $.extend(this.config, option);

		this.jq = $(this.selector);

		if (this.config.css)
			this.jq.css(this.config.css);
	},


	//페이지 로딩바 생성
	pageLoading: function () {
		//화면의 높이와 너비를 구한다.
		//	    var maskHeight = $(document).height();
		//		var maskHeight = window.document.body.clientheight;
		//	    var maskWidth = window.document.body.clientWidth;

		var loadingImg = '';

		loadingImg += "<div id='loadingImg' style='position:absolute; left:50%; top:50%; display:none; z-index:10000;'>";
		loadingImg += "<img src='/omsc/layerDataGrid/images/viewLoading.gif'>";
		loadingImg += "</div>";

		//화면에 레이어 추가 
		$('body').append(loadingImg);

		//마스크의 높이와 너비를 화면 것으로 만들어 전체 화면을 채운다.
		//	    $('#loadingImg').css({
		//	    	'width' : maskWidth, 
		//	    	'height': maskHeight
		//	    });  
	},

	//페이지 로딩 보이기
	showLoading: function () {
		if ($('#loadingImg').length == 0)
			this.pageLoading();

		//로딩중 이미지 표시
		$('.blackShadow').show();
		$('#loadingImg').show();
	},

	//페이지 로딩바 해제
	closeLoading: function () {
		$('.blackShadow').hide();
		$('#loadingImg').hide();
	},
};