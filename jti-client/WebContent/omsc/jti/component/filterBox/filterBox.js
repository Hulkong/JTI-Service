/**
 * @description filterBox 컴포넌트 
 */
var filterBox = {

	jq: undefined,   // selector jquery 객체
	
	layer: undefined, // 이 컴포넌트에서 관리하는 레이어 

	/**
	 * @description 컴포넌트 초기화 메소드 
	 */
	init: function () {
		var that = this;
		
		that.jq = $('#filterBox');   // 이 검포넌트의 Root 선택자
		
		// 필터 초기화하기 클릭
		that.jq.find('.reset.filter').click(function () {
			event.stopPropagation();
			event.preventDefault();

			that.jq.find('.filter_result_list > li.on').removeClass('on');
			that.drawLayer(" AND 1 = 1 ");
			omsMain.selfmap.removeDrawnVectorAll();
//			omsMain.dataView.open();
//			omsMain.dataView.loadData(null, " AND 1 = 1 ");
		});
		// 필터 추가하기 클릭
		that.jq.find('.add.filter').click(function () {
			that.jq.find('.filter_result_list > li.on').removeClass('on');
			omsMain.filterEdit.jq.find('.filter_list').empty();

			omsMain.filterEdit.jq.find('.filter.update').hide();
			omsMain.filterEdit.jq.find('.filter.apply').show();

        	omsMain.filterEdit.jq.find('#paste_space').hide();
	        omsMain.filterEdit.jq.find('p.copied').hide();
	        omsMain.filterEdit.jq.find('.wrap_scroll').removeClass('copied');
			
	        // 레이어가 존재할 경우 filterBox 엶
			if (that['layerNo']) {
				omsMain.filterEdit.open();
			}
		});
		
		// 우측 상단 x버튼 클릭 
		that.jq.find('.btn_close').click(function() {
			omsMain.navigation.jq.find('li[nm="filterBox"]').removeClass('on');   // 좌측 네비게이션 off
			omsMain.filterEdit.close();   // filterEdit 닫음 
			that.close();   // filterBox 닫음 
		});
	},

	/**
	 * @description 점포필터 레이어 그리는 메소드 
	 * @params filter{String}: mybatis 쿼리에 매핑될 sql 조건 
	 */
	drawLayer: function (filter) {
//		var layerNo = omsMain.getLayerNoByName('jtiFilter');
//		if (layerNo) {
//			var layer = omsMain.getLayer(layerNo);
//
//			if(filter !== undefined) {
//				layer['exfilter'] = filter;
//				layer['importantFilter'] = filter;
//			}
//
//			if (layer['regionFilter'].length > 0) {
//				layer['exfilter'] += layer['regionFilter'];
//			}
//
//			// 레이어가 이미 한번 그려졌을 때
//			if (omsMain.selfmap.hasLayer(layerNo)) {
//				omsMain.selfmap.wmsRedrawLayer(layerNo);   // 레이어를 다시그림
//			} else {
//				omsMain.selfmap.wmsDrawLayer(layerNo);
//			}
////			omsMain.controlBar.drawJtiAccountCodeLayer(true);
////			omsMain.controlBar.drawJtiAccountCodeLabelLayer();
////			omsMain.dataView.loadData(undefined, filter);   // 우측 Map/Data 데이터 로딩
//		}		
//		return;
		var layerArr = omsMain.getLayerNoById("jti.jtiLayerStore");
		
		  
		layerArr = layerArr.filter(function(i){
			var layerInfo = omsMain.getLayer(i);
			return layerInfo['name'] != 'jtiFilter';
		});
		layerArr.forEach(function (key, i) {
			var layerInfo = omsMain.getLayer(key);
			layerInfo['storeFilter'] = filter;

		})
		omsMain.controlBar.drawJtiAccountCodeLayer(true);
		omsMain.controlBar.drawJtiAccountCodeLabelLayer();
		return;
		var layerNo = omsMain.getLayerNoByName('jtiAccountCode');   

		if (layerNo) {
			layerNo.forEach(function (no, i) {
				omsMain.selfmap.hideLayer(no);
			})
		}

		layerNo = omsMain.getLayerNoByName('top1Seg');

		if (layerNo) {
			omsMain.controlBar.jq.find('li.top1Seg').removeClass('on');
			omsMain.controlBar.jq.find('#top1SegLegend').hide();
			layerNo.forEach(function (no, i) {
				omsMain.selfmap.hideLayer(no);
			})
		}

		layerNo = omsMain.getLayerNoByName('jtiFilter');

		if (layerNo) {
			var layer = omsMain.getLayer(layerNo);

			if(filter !== undefined) {
				layer['exfilter'] = filter;
				layer['importantFilter'] = filter;
			}

			if (layer['regionFilter'].length > 0) {
				layer['exfilter'] += layer['regionFilter'];
			}

			// 레이어가 이미 한번 그려졌을 때
			if (omsMain.selfmap.hasLayer(layerNo)) {
				omsMain.selfmap.wmsRedrawLayer(layerNo);   // 레이어를 다시그림
			} else {
				omsMain.selfmap.wmsDrawLayer(layerNo);
			}
		}
	},

	createUI: function (seqNo) {
		var that = this;
		var params = {
			dataNo: that['layerNo'],
			userNo: $('#userSeq').val()
		};

		$.ajax({
			url: jtiConfig['mapserverUrl'] + '/data/filter/list.json',
			data: params,
			type: 'POST',
			success: function (result, status, xhr) {
				if(!result['filter']) {
					return;
				}

				if (result['filter'].length === 0) {
                    omsMain.filterEdit['seqNo'] = 0;
                } else {
                    omsMain.filterEdit['seqNo'] = result['filter'][0].seqNo + 1;
                }

				if (result['filter'].length > 0) {

					that.jq.find('.filter_result_list').empty();

					var tmpSeqNo = -1;
					var index = 0;
					result['filter'].forEach(function (f, i) {
						var realFilter = ''
						var html = '';
						var column = '';

						// seqNo가 다름으로 구분
						if (tmpSeqNo !== f['seqNo']) {
							var filterJson1 = $.parseHTML(f['filterJson1'])[0];
							var column = filterJson1.getAttribute('column');
							
							if(column === 'GEOMETRY') {
								var geoms = filterJson1.getAttribute('value');
							} 
							
							tmpSeqNo = f['seqNo'];

							html = '<li index="' + index + '" seqNo="' + f['seqNo'] + '">';
							html += '<span class="tit view filter" index="' + index + '">필터 00' + index + '</span>';
							html += '<ul class="group_btn">';
							html += '<li><a href="#none" class="button edit filter btn_edit" index="' + index + '" seqNo="' + f['seqNo'] + '">편집</a></li>';
							html += '<li><a href="#none" class="btn_close button delete filter" index="' + index + '" seqNo="' + f['seqNo'] + '">삭제</a></li>';
							html += '</ul>';
							html += '<dl>';

							result['filter'].forEach(function (f2, i2) {
								// 안에 들어가는 값은 seqNo가 같음으로 구분
								if (tmpSeqNo === f2['seqNo']) {
									var filterJson2 = JSON.parse(f2['filterJson2']);
									var text = filterJson2['text'];
									realFilter += filterJson2['filter'];
									html += '<dt>' + text + '</dt>';
								}
							});

							html += '</dl>';
							html += '</li>';

							that.jq.find('.filter_result_list').append(html);
							that.jq.find('.filter_result_list > li').eq(index).attr('filter', realFilter);
							that.jq.find('.filter_result_list > li').eq(index).attr('geoms', geoms);
							
							index++;
						}
					});

					if(seqNo) {
						that.jq.find('.filter_result_list > li[seqNo="' + seqNo + '"]').addClass('on');
						var filter = that.jq.find('.filter_result_list > li[seqNo="' + seqNo + '"]').attr('filter');
					} else {
						that.jq.find('.filter_result_list > li').eq(0).addClass('on');
						var filter = that.jq.find('.filter_result_list > li').eq(0).attr('filter');
					}

					if(omsMain.navigation.jq.find('li[nm="filterBox"]').hasClass('on')) {
						that.drawLayer(filter);
					}
					
					if(omsMain.dataView) {
//						omsMain.dataView.loadData(null, filter);			
					}

					// 필터 리스트 클릭
					that.jq.find('.filter_result_list > li').click(function (event) {
						event.stopPropagation();
						event.preventDefault();

						that.jq.find('.filter_result_list > li.on').removeClass('on');
						$(this).addClass('on');

						var filter = $(this).attr('filter');
						var geoms = $(this).attr('geoms');
						
						if(geoms) {
							geoms = JSON.parse(geoms);
							geoms.forEach(function(g, i) {
								if (g['type'] === 'circle') {
                                    omsMain.selfmap.drawLoadCircle({
                                        id: g['id'],
                                        latlng: g['center'],
                                        radius: g['radius'],
                                        crs: 'katec'
                                    });
                                } else if (g['type'] === 'rectangle' || g['type'] === 'polygon') {
                                    omsMain.selfmap.drawWkt({
                                        id: g['id'],
                                        wkt: g['wktKatec'],
                                        crs: 'katec'
                                    });
                                }
							});
						} else {
							omsMain.selfmap.removeDrawnVectorAll();
						}

						that.drawLayer(filter);
						omsMain.dataView.open();
						omsMain.dataView.loadData(null, filter);
					});

					// 필터 에디터 열어서 편집하기
					that.jq.find('.edit.filter').click(function (event) {
						event.stopPropagation();
						event.preventDefault();

						var seqNo = $(this).attr('seqno');
						var index = $(this).attr('index');

						that.jq.find('.filter_result_list > li.on').removeClass('on');
						that.jq.find('.filter_result_list > li[index="' + index + '"]').addClass('on');

						omsMain.filterEdit.open();
						omsMain.filterEdit.appendUI(seqNo);
						omsMain.filterEdit.editSeqNo = seqNo;
						omsMain.filterEdit.jq.find('.filter.apply').hide();
						omsMain.filterEdit.jq.find('.filter.update').show();

						var filter = that.jq.find('.filter_result_list > li[index="' + index + '"]').attr('filter');
						var geoms = that.jq.find('.filter_result_list > li[index="' + index + '"]').attr('geoms');
						
						if(geoms) {
							geoms = JSON.parse(geoms);
							geoms.forEach(function(g, i) {
								if (g['type'] === 'circle') {
                                    omsMain.selfmap.drawLoadCircle({
                                        id: g['id'],
                                        latlng: g['center'],
                                        radius: g['radius'],
                                        crs: 'katec'
                                    });
                                } else if (g['type'] === 'rectangle' || g['type'] === 'polygon') {
                                    omsMain.selfmap.drawWkt({
                                        id: g['id'],
                                        wkt: g['wktKatec'],
                                        crs: 'katec'
                                    });
                                }
							});
						} else {
							omsMain.selfmap.removeDrawnVectorAll();
						}
						that.drawLayer(filter);
						omsMain.dataView.loadData(null, filter);
					});

					// 필터 삭제
					that.jq.find('.delete.filter').click(function (event) {
						event.stopPropagation();
						event.preventDefault();

						var seqNo = $(this).attr('seqno');
						var index = $(this).attr('index');

						that.jq.find('.filter_result_list > li[index="' + index + '"]').remove();
						omsMain.filterEdit.deleteFilter(seqNo);
						that.jq.find('.filter_result_list > li').eq(0).addClass('on');

						omsMain.filterEdit.jq.find('.filter_add_list').eq(index).remove();
						omsMain.selfmap.removeDrawnVectorAll();

						// 필터박스 리스트에 하나도 존재하지 않을경우 exfilter 초기화
						if(that.jq.find('.filter_result_list > li').length === 0) {
							var filter = '';
							
						// 필터박스의 필터를 삭제하면 첫번째 필터가 적용된 점포를 로드함 
						} else {
							var filter = that.jq.find('.filter_result_list > li').eq(0).attr('filter');
						}
						that.drawLayer(filter);
//						omsMain.dataView.loadData(null, filter);
					});
				}
			},

			error: function (e) { }
		});
	},

	open: function () {
		var that = this;
		that.jq.show("slide", { direction: "left" }, 300);
		
	},

	close: function () {
		var that = this;
		that.jq.hide("slide", { direction: "left" }, 300);
	}
};

omsMain['filterBox'] = filterBox;
filterBox.init();