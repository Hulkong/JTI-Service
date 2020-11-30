/**
 * @description dataView 컴포넌트
 */
var dataView = {

	jq : undefined,

	dataGrid : undefined,

	columns: [],
	
	params: {},
	
	selectedRangeCells: [],

	init : function() {
		
		var that = this;
		
		that.jq = $('#dataView');

//		that.dataGrid = that.loadData();
		
		// 문고리 - 레이어 데이터 그리드 열기/닫기
		that.jq.find('.knocker').click(function() {
			if ($(this).hasClass('open')) {
				$(this).removeClass('open').addClass('close');
				that.jq.width("299px");
				omsMain.controlBar.jq.find('#top1SegLegend').css(
						'right', '311px');
			} else {
				$(this).removeClass('close').addClass('open');
				that.jq.width("0px");
				omsMain.controlBar.jq.find('#top1SegLegend').css(
						'right', '10px');
			}

			that.dataGrid.resizeCanvas();
		});

		// 확장/축소 - 레이어 데이터 그리드 와이드 보기
		that.jq.find('.resizer').click(function() {

			$(this).toggleClass('wide normal');
			that.jq.toggleClass('wide');

			if (that.jq.hasClass('wide')) {
				that.jq.css('width', '70%');
				that.jq.find('.area_rgt').show();
			} else {
				that.jq.css('width', '299px');
				that.jq.find('.area_rgt').hide();
			}

			that.dataGrid.resizeCanvas();
		});

		// 데이터 다운로드
		that.jq.find('.download.link').click(function() {
			
			if(!confirm('다운로드시 최대 5분정도 소요됩니다.\n다운로드 받겠습니까?')) {
				return;
			}
			
			var params = that.params;
			var columns = that.columns;
			var headerStr = '', columnStr = '', typeStr = '';

			for (var i = 0; i < columns.length; i++) {
				if (columns[i].selectYn == 'Y' && columns[i].logicalType != 'geometry') {
					headerStr += ',' + (columns[i].atrbNm || columns[i].atrbId);
					columnStr += ',' + columns[i].atrbCamelId;
					typeStr += ',' + ((columns[i].logicalType == '') ? 'string' : columns[i].logicalType);
				}
			}
			params.layerName = 'jti.jtiStore';
			params.header = headerStr.substring(1);
			params.columns = columnStr.substring(1);
			params.types = typeStr.substring(1);

			that.download(jtiConfig['mapserverUrl'] + '/data/download.json', params);   // 엑셀 다운로드 메소드 호출
//			download(jtiConfig['mapserverUrl'] + '/data/download.json', params);   // 엑셀 다운로드 메소드 호출
		});
	},

	open : function() {
		var that = this;
		that.jq.parent().show();
		that.jq.width('299px').show("slide", {direction : "right"}, 300);
		that.jq.find('.knocker').removeClass('open').addClass('close');

		if (that.dataGrid) {
			that.dataGrid.resizeCanvas();
		}
	},

	close : function() {
		var that = this;

		that.jq.width('0px').show("slide", {direction : "right"}, 300);
		that.jq.find('.knocker').removeClass('close').addClass('open');

	},

	openLoading: function() {
		$('#modal').show();   // 백그라운드 모달창 엶
		$('#downloadLoading').show();   // 로딩창 엶
    },
    
    closeLoading: function() {
    	$('#modal').hide();   // 백그라운드 모달창 닫음
    	$('#downloadLoading').hide();   // 로딩창 닫음
    },
	
    /**
     * @description 엑셀 다운로드 함수
     * @param url   서버 url
     * @param params   필수 파라미터
     * @returns
     */
    download: function(url, params) {
    	var that = this;
    	
    	that.openLoading();
    	
    	var form = '<form id="downloadForm" method="POST" action="' + url + '">';
    	
    	$.each(params, function (key, value) {
    		form += '<input type="hidden" name="' + key + '" value="' + value + '"/>';
    	});
    	
    	form += '</form>';

    	$.fileDownload($(form).prop('action'), {
    		httpMethod: "POST",
    		data:$(form).serialize(),
    		successCallback: function (url) {
    			that.closeLoading();
    		},
    		failCallback: function(responesHtml, url) {
    			that.closeLoading();
    			alert('관리자에게 문의 주세요.');
    		}
		});
    },
    
	drawLayer : function() {

		var layerNo = omsMain.getLayerNoByName('jtiFilter');

		omsMain.selfmap.hideLayer(layerNo);

		layerNo = omsMain.getLayerNoByName('top1Seg');

		if (layerNo) {
			omsMain.controlBar.jq.find('li.top1Seg').removeClass('on');
			omsMain.controlBar.jq.find('#top1SegLegend').hide();
			layerNo.forEach(function(no, i) {
				omsMain.selfmap.hideLayer(no);
			})
		}
		if (omsMain.navigation.jq.find('li[nm="filterBox"]').hasClass('on')) {
			layerNo = [ omsMain.getLayerNoByName('jtiFilter') ];
		} else if (omsMain.controlBar.jq.find('li.top1Seg').hasClass('on')) {
			layerNo = omsMain.getLayerNoByName('top1Seg');
		} else {
			layerNo = omsMain.getLayerNoByName('jtiAccountCode');
		}

		if (!layerNo) {
			return;
		}
		
		layerNo = ($.isArray(layerNo)) ? layerNo : [layerNo];
		
		layerNo.forEach(function(no, i) {
			var layer = omsMain.getLayer(no);

			if (layer['regionFilter'].length > 0) {
				layer['exfilter'] += layer['regionFilter'];
			}

			if (layer['importantFilter'].length > 0) {
				layer['exfilter'] += layer['importantFilter'];
			}
			if (omsMain.selfmap.hasLayer(no)) {
				omsMain.selfmap.wmsRedrawLayer(no); // 레이어를 다시그림
			} else {
				omsMain.selfmap.wmsDrawLayer(no); // 레이어를 새로 그림
			}
		});
	},

	//페이지 로딩 보이기
	loadingShow : function() {
		var that = this;

		//로딩중 이미지 표시
		that.jq.find('.blackShadow').show();
		that.jq.find('.loadingImg').show();
	},

	//페이지 로딩 해제
	loadingHide : function() {
		var that = this;

		//로딩중 이미지 표시
		that.jq.find('.blackShadow').hide();
		that.jq.find('.loadingImg').hide();
	},

	// 데이터 로딩
	loadData : function(page, filter) {
		var that = this;
		var layerNo = omsMain.getLayerNoByName('jtiAccountCode');

//		if (!filter) {
//			filter = '';
//		}
//var 
//		if (layerNo) {
//			var layer = omsMain.getLayer(layerNo);
//
////			if (layer['exfilter'].length > 0) {
////				filter += layer['exfilter'];
////			}
////
////			if (layer['regionFilter'].length > 0) {
////				filter += layer['regionFilter'];
////			}
////
////			if (layer['importantFilter'].length > 0) {
////				filter += layer['importantFilter'];
////			}
//			filter =  layer['regionFilter'] + layer['storeFilter'] + layer['importantFilter'];
//		}

		var params = {
			layerName : 'jti.jtiStore',
			page : page || 1,
			pageSize : 30,
			selectYn : 'Y',
			dataGrid : 'Y',
			exfilter : filter
		};

		that.params = params;
		
		// 로딩바 시작
		that.loadingShow();

		$.ajax({
			url : jtiConfig['mapserverUrl'] + '/data/collection.json',
			type : 'POST',
			data : params,
			success : function(result, status, xhr) {
				// 로딩바 끝
				that.loadingHide();

				if (!result) {
					alert('데이터가 조회되지 않았습니다.');
					return;
				}

				var columns = [];
				var data = result.data;

				//총갯수 표시
				that.jq.find(".totCount_txt").text(
						"총 " + NumToComma(result.total) + "건");

				for (var i = 0; i < result.attributes.length; i++) {
					var attr = result.attributes[i];
					var attrObj = {
						id : attr.atrbCamelId,
						name : (attr.logicalName || attr.atrbNm || attr.atrbId),
						field : attr.atrbCamelId,
						sortable : false
					};
					$.extend(attrObj, attr);
					columns.push(attrObj);
				}

				that.columns = columns;
				that.createSilckGrid(data, columns)
				paginate(that.jq.find('.paginate'), function(page) {
					that.loadData(page,filter);
				}, params.page, result.total, params.pageSize, 4);

			},
			error : function(e) {
			},
		});

	},

	createSilckGrid : function(data, columns) {
		var that = this;
		var options = {
			editable : true,
			enableAddRow : false,
			enableCellNavigation : true,
			enableColumnReorder : false,
			asyncEditorLoading : true,
			autoEdit : false
		};

		var pluginOptions = {
			onCopyInit : function(e) {
				var cells = that.dataGrid.getSelectedCells();
				var correctHeader = true;
				
				cells.forEach(function(c, i) {
					var cell = c['cell'];
					if(that.dataGrid.getColumns()[cell]['name'] !== 'Account code') {
						correctHeader = false;
					}
				});
				
				if(!correctHeader) {
					alert('Account code만 복사할 수 있습니다.');
					return false;
				}
				
				return true;
			},
			onCopySuccess : function(columnCnt) {
				if (columnCnt >= 2000) {

					alert('복사된 데이터가 2000개를 초과하였습니다!');
					return;
				}
			},
			readOnlyMode : true,
			includeHeaderWhenCopying : true
		};

		that.columns = columns;
		that.gridData = data;
		that.dataGrid = new Slick.Grid("#brd_list_grid", data, columns, options);
		that.dataGrid.setSelectionModel(new Slick.CellSelectionModel());
		that.dataGrid.registerPlugin(new Slick.CellExternalCopyManager(pluginOptions));
		
		that.dataGrid.onDragEnd.subscribe(function(e) {
//			console.log(e)
			var cells = that.dataGrid.getSelectedCells();
			var header = that.dataGrid.getColumns()[cells[0].cell]['name'];
			var id = that.dataGrid.getColumns()[cells[0].cell]['id'];
			var data = omsMain.dataView.dataGrid.getData();
			
			if(header !== 'Account code') {
				return;
			}
			
			cells.forEach(function(c, i) {
				var row = c['row'];
				that.selectedRangeCells.push(data[row][id]);
			});
		});
		
		that.dataGrid.onKeyDown.subscribe(function(e) {
			
			var cell = that.dataGrid.getCellFromEvent(e);
			
			var selectedCells = that.dataGrid.getSelectedCells();
			if(selectedCells.length == 0 ) return;
			
			var cellName = that.dataGrid.getColumns()[selectedCells[0]["cell"]]["name"];

			
			
			if(e['ctrlKey'] && e['keyCode'] === 67 && cellName==='Account code' ) {
				// IE11일 때
		        if (browserVersionCheck() === "trident/.*rv:") {
		        	omsMain.filterEdit.jq.find('#paste_space').show();
		        }
		        
//		        omsMain.filterEdit.jq.find('p.copied').show();
//		        omsMain.filterEdit.jq.find('.wrap_scroll').addClass('copied');
			}
		});
		
		that.dataGrid.onClick.subscribe(function(e) {
			if(e['ctrlKey']) {
				e.stopImmediatePropagation();
				
				var cell = that.dataGrid.getCellFromEvent(e);
				
				if(that.dataGrid.getColumns()[cell['cell']]['name'] !== 'Account code') {
					alert('Account code만 복사할 수 있습니다.');
					return false;
				}
				
				var cells = that.dataGrid.getSelectedCells();
				cells.push(cell);
				that.dataGrid.setSelectedCells(cells);

			} else if(e['shiftKey']) {
				e.stopImmediatePropagation();
				
				var cell = that.dataGrid.getCellFromEvent(e);
				
				if(that.dataGrid.getColumns()[cell['cell']]['name'] !== 'Account code') {
					alert('Account code만 복사할 수 있습니다.');
					that.dataGrid.setSelectedCells([]);
					return false;
				}
				
				var cells = that.dataGrid.getSelectedCells();
				
				if(cells['length'] < 1) {
					cells.push(cell);
					that.dataGrid.setSelectedCells(cells)
				} else {
					if(cells[0]['row'] < cell['row']) {
						for(var i = cells[0]['row']; i <= cell['row']; i++) {
							cells.push({row:i, cell: cell['cell']});
						}
						
						that.dataGrid.setSelectedCells(cells)
					} else if(cells[0]['row'] > cell['row']) {
						for(var i = cell['row']; i <= cells[0]['row']; i++) {
							cells.push({row:i, cell: cell['cell']});
						}
						
						that.dataGrid.setSelectedCells(cells)
					}
				}
			} else {
				that.moveMap(e);
			}
		});
	},

	moveMap : function(e) {
		var that = omsMain['dataView'];
		var cell = that.dataGrid.getCellFromEvent(e);

		// 현재 줌레벨이 18이 아닌경우 줌세팅
		if (omsMain.selfmap.getZoom() !== 18) {
			omsMain.selfmap.setZoom(18);
		}

		omsMain.selfmap.instance.setWktMbr(that.gridData[cell.row].geometry,
				'katec'); // wkt로 지도이동
	}
};

omsMain['dataView'] = dataView;
dataView.init();
