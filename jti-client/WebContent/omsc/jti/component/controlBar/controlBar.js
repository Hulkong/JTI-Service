/**
 * @description controlBar 컴포넌트 상단 컨트롤바 컴포넌트 지역 네비게이션에 영향 받는 레이어: 지역특성, 점포,
 *              점포라벨, TOP1 SEG
 */
var controlBar = {
	jq : undefined,
	drawJtiAccountCodeLabelLayer : function() {
		var that = this;
		var jtiLableActive = that.jq.find('.label').hasClass('on'); // on 클래스
																	// 존재여부;
		var jtiLableLayerNo = omsMain.getLayerNoByName('jtiAccountCodeLabel'); // 기본
																				// 점포레이블
																				// 레이어키
		jtiLableLayerNo = ($.isArray(jtiLableLayerNo)) ? jtiLableLayerNo
				: [ jtiLableLayerNo ];

		if (!jtiLableActive) {
			omsMain.selfmap.removeLayer(jtiLableLayerNo);// 레이어를 지운다.
			return;
		}
		// 스타일 + 라벨세팅 및 필터 세팅
		jtiLableLayerNo.forEach(function(no, i) {
			var style = omsMain.getStyle('point', no);
			style['userLabel'] = true;
			omsMain.setStyle('point', no, style);

			var layer = omsMain.getLayer(no, i);
			layer['exfilter'] = ( (layer['regionFilter'] === undefined) ? "" : layer['regionFilter'] ) 
			+ ((layer['storeFilter'] === undefined) ? "" : layer['storeFilter'] )
			+ layer['importantFilter'];
			
			// 레이어가 이미 한번 그려졌을 때
			if (omsMain.selfmap.hasLayer(no)) {
				omsMain.selfmap.wmsRedrawLayer(no); // 레이어를 다시그림
			} else {
				omsMain.selfmap.wmsDrawLayer(no); // 레이어를 새로 그림
			}
		});

	},
	drawJtiAccountCodeLayer : function(withoutDataView) {
		var that = this;
		var jtiActive = that.jq.find('.jti').hasClass('on'); // on 클래스 존재여부;

		var top1SegActive = that.jq.find('.top1Seg').hasClass('on'); // on
																		// 클래스
																		// 존재여부
		var top2SegActive = that.jq.find('.top2Seg').hasClass('on'); // on
																		// 클래스
																		// 존재여부

		var layerNo = '';
		var sldName = '';

		layerNo = omsMain.getLayerNoByName('jtiAccountCode'); // 기본 점포 레이어키
		layerNo = ($.isArray(layerNo)) ? layerNo : [ layerNo ];

		layerNo.forEach(function(no, i) {
			omsMain.selfmap.removeLayer(no);// 레이어를 지운다.
		});

		if (!jtiActive && !top1SegActive && !top2SegActive) {
			return;
		} else if (jtiActive && top1SegActive) {
			sldName = 'top1_seg';
		} else if (jtiActive && top2SegActive) {
			sldName = 'top2_seg';
		} else if (jtiActive) {
			sldName = 'o_ka';
		} else {
			// alert('점포 버튼을 먼저 클릭해주세요!');
			return;
		}

		layerNo.forEach(function(no, i) {
			var layer = omsMain.getLayer(no, i);
			layer['importantFilter'] = " AND '" + sldName + "' = '" + sldName
					+ "' ";
			var filterStr = (layer['regionFilter'] || '') + (layer['storeFilter']|| '')
					+ (layer['importantFilter']|| '');
			layer['exfilter'] = filterStr;
			layer['sldName'] = sldName;
			omsMain.config.layers[no] = layer;
			// layer['exfilter'] = layer['exfilter'] + layer['importantFilter'];
			omsMain.selfmap.wmsDrawLayer(no, null); // sld이름을 추가함
			// 로그인이 되어있으면 데이터 보기 활성화
			if ($('#userSeq').val() !== 'null') {

				omsMain.navigation.jq.find('li[nm="dataView"]').addClass('on'); // 좌측
																				// 네비게이션
																				// 데이터보기
																				// On
				omsMain.dataView.open(); // 우측 Map/Data 창 엶
				if (withoutDataView) {
					omsMain.dataView.loadData(undefined, filterStr); // 우측
																		// Map/Data
																		// 데이터
																		// 로딩
				} else {
					omsMain.dataView.loadData(undefined, filterStr); // 우측
																		// Map/Data
																		// 데이터
																		// 로딩
				}
			}
		});
	},
	init : function() {
		var that = this;

		that.jq = $('#controlBar');

		// 지역특성 활성/비활성
		that.jq.find('.regionCharacteAnal').click(
				function() {

					var layerNo = omsMain
							.getLayerNoByName('selfmap.service.basicContents');

					if (!layerNo) {
						alert('지역특성 레이어가 생성되지 않았습니다!');
						return;
					}

					$(this).toggleClass('on');
					var active = $(this).hasClass('on'); // on 클래스 존재여부

					// 활성화일 때
					if (active) {

						// 레이어가 이미 한번 그려졌을 때
						if (omsMain.selfmap.hasLayer(layerNo)) {

							// 레이어가 그려져있지 않을 경우
							if (!omsMain.selfmap.isVisible(layerNo)) {
								omsMain.regionCharacteAnalSub.open(); // regionCharacteAnalSub
																		// 컴포넌트
																		// 닫음
								omsMain.regionCharacteAnal.open(); // regionCharacteAnal
																	// 컴포넌트 닫음
								omsMain.resultReport.open(); // resultReport
																// 컴포넌트 닫음
								omsMain.selfmap.wmsRedrawLayer(layerNo); // 레이어를
																			// 다시그림
							}

							// 지역특성분석 데이터를 선택하지 않았을 경우
						} else {
							alert('왼쪽 지역특성 분석을 먼저 선택해주세요');
							$(this).removeClass('on'); // 상단 컨트롤바 지역특성 버튼 비활성
						}

						// 비활성일 때
					} else {
						omsMain.regionCharacteAnalSub.close(); // regionCharacteAnalSub
																// 컴포넌트 닫음
						omsMain.regionCharacteAnal.close(); // regionCharacteAnal
															// 컴포넌트 닫음
						omsMain.resultReport.close(); // resultReport 컴포넌트 닫음
						omsMain.resultReportTable.close(); // resultReportTable
															// 컴포넌트 닫음
						omsMain.selfmap.hideLayer(layerNo); // 지역특성분석 레이어를 숨김
					}
				});

		// 주변업소 활성/비활성
		that.jq.find('.nearbyBusinesses')
				.click(
						function() {

							var isDraw = false;
							var layerNo = omsMain
									.getLayerNoById('selfmap.service.poi');

							if (!layerNo) {
								alert('주변업소 레이어가 생성되지 않았습니다!');
								return;
							}

							$(this).toggleClass('on');
							var active = $(this).hasClass('on'); // on 클래스
																	// 존재여부

							// 활성화일 때
							if (active) {
								layerNo.forEach(function(no, i) {
									// 레이어가 이미 한번 그려졌을 때
									if (omsMain.selfmap.hasLayer(no)) {
										omsMain.selfmap.showLayer(no); // 레이어를
																		// 보여줌
										var layer = omsMain.getLayer(no);
										var id = layer['name'];
										isDraw = true;
										omsMain.nearbyBusinesses.jq.find(
												'.item.facility_cont_row[id="'
														+ id + '"]').addClass(
												'selected')
									}
								});

								// 비활성일 때
							} else {
								layerNo.forEach(function(no, i) {
									if (omsMain.selfmap.hasLayer(no)) {
										omsMain.selfmap.hideLayer(no); // 레이어를
																		// 숨김
										isDraw = true;
									}
								});
								omsMain.nearbyBusinesses.jq.find(
										'.item.facility_cont_row.selected')
										.removeClass('selected');
							}

							if (!isDraw) {
								alert('왼쪽 주변업소를 먼저 선택해주세요');
								$(this).removeClass('on');
								omsMain.nearbyBusinesses.jq.find(
										'.item.facility_cont_row.selected')
										.removeClass('selected');
							}
						});

		// 점포 활성/비활성
		that.jq.find('.jti').click(
				function() {

					$('.leaflet-popup').hide();

					var layerNo = ''; // 현재 선택된 점포레이어(기본 점포, 점포필터, TOP1SEG 점포)

					// 좌측 네비게이션박스에서 점포필터 리스트가 선택되어 있을 경우
					if (omsMain.navigation.jq.find('li[nm="filterBox"]')
							.hasClass('on')) {
						layerNo = [ omsMain.getLayerNoByName('jtiFilter') ]; // 점포필터
																				// 레이어키
						that.jq.find('#top1SegLegend').hide(); // TOP1SEG 범례창
																// 닫음

						// 상단 컨트롤바에서 TOP1SEG리스트가 선택되어 있을 경우
					} else if (that.jq.find('li.top1Seg').hasClass('on')) {
						// layerNo = omsMain.getLayerNoByName('top1Seg'); //
						// TOP1SEG 점포 레이어 키
						layerNo = omsMain.getLayerNoByName('jtiAccountCode'); // 기본
																				// 점포
																				// 레이어키

					} else if (that.jq.find('li.top2Seg').hasClass('on')) {
						// layerNo = omsMain.getLayerNoByName('top2Seg'); //
						// TOP2SEG 점포 레이어 키
						layerNo = omsMain.getLayerNoByName('jtiAccountCode'); // 기본
																				// 점포
																				// 레이어키
						// 그 이외의 경우 점포레이어 매핑
					} else {
						layerNo = omsMain.getLayerNoByName('jtiAccountCode'); // 기본
																				// 점포
																				// 레이어키
						that.jq.find('#top1SegLegend').hide(); // TOP1SEG 범례창
																// 닫음
					}

					if (!layerNo) {
						alert('점포 레이어가 생성되지 않았습니다!');
						return;
					}

					$(this).toggleClass('on');
					var active = $(this).hasClass('on'); // on 클래스 존재여부
					that.drawJtiAccountCodeLayer();

					// 활성화일 때
					if (active) {
						/*
						 * drawJtiAccountCodeLayer로 변경
						 * layerNo.forEach(function(no, i) { // 레이어가 이미 한번 그려졌을
						 * 때 if(omsMain.selfmap.hasLayer(no)) {
						 * omsMain.selfmap.wmsRedrawLayer(no); // 레이어를 다시그림 }
						 * else { omsMain.selfmap.wmsDrawLayer(no); // 레이어를 새로
						 * 그림 } });
						 */
						// 로그인이 되어있으면 데이터 보기 활성화
						if ($('#userSeq').val() !== 'null') {
							var layer = omsMain.getLayer(layerNo);

							if (layer) {
								var filter = layer.exfilter;
							}
							// omsMain.dataView.open(); // 우측 Map/Data 창 엶
							// omsMain.dataView.loadData(undefined, filter); //
							// 우측 Map/Data 데이터 로딩
							omsMain.navigation.jq.find('li[nm="dataView"]')
									.addClass('on'); // 좌측 네비게이션 데이터보기 On
						}

						// 비활성일 때
					} else {
						that.jq.find('.label').removeClass('on');
						that.jq.find('.top1Seg').removeClass('on');
						that.jq.find('.top2Seg').removeClass('on');
						that.jq.find('#top1SegLegend').hide();
						that.drawJtiAccountCodeLabelLayer();
						/*
						 * drawJtiAccountCodeLayer로 변경
						 * layerNo.forEach(function(no, i) {
						 * omsMain.selfmap.hideLayer(no); // 레이어를 숨김 });
						 */

						omsMain.dataView.close()
						omsMain.navigation.jq.find('li[nm="dataView"]')
								.removeClass('on')
					}
				});

		// 지도 활성/비활성
		that.jq.find('.map').click(function() {

			$(this).toggleClass('on');
			var active = $(this).hasClass('on'); // on 클래스 존재여부

			if ($(this).hasClass('on')) {
				$(this).addClass('on').css("background-color", "#5AAEFF");
				omsMain.selfmap.instance.showLayer("openmateBaseLayer");
			} else {
				$(this).removeClass('on').css("background-color", "");
				omsMain.selfmap.instance.hideLayer("openmateBaseLayer");
			}
		});

		// 점포라벨 활성/비활성
		that.jq.find('.label').click(function() {

			$(this).toggleClass('on');

			$('.leaflet-popup').hide(); // 점포팝업창 닫음
			var active = $(this).hasClass('on'); // on 클래스 존재여부
			var layerNo = omsMain.getLayerNoByName('jtiAccountCodeLabel'); // 기본
																			// 점포
																			// 레이어키;
																			// //
																			// 현재
																			// 선택된
																			// 점포레이어(기본
																			// 점포,
																			// 점포필터,
																			// TOP1SEG
																			// 점포,
																			// TOP2SEG
																			// 점포)
			//            
			// // 좌측 네비게이션박스에서 점포필터 리스트가 선택되어 있을 경우
			// if(omsMain.navigation.jq.find('li[nm="filterBox"]').hasClass('on'))
			// {
			// layerNo = [omsMain.getLayerNoByName('jtiFilter')]; // 점포필터 레이어키
			// that.jq.find('#top1SegLegend').hide(); // TOP1SEG 범례창 닫음
			//            
			// // 상단 컨트롤바에서 TOP1SEG리스트가 선택되어 있을 경우
			// } else if(that.jq.find('li.top1Seg').hasClass('on')) {
			// layerNo = omsMain.getLayerNoByName('jtiAccountCodeLabel'); // 기본
			// 점포 레이어키
			// // layerNo = omsMain.getLayerNoByName('top1Seg'); // TOP1SEG 점포
			// 레이어 키
			//                
			// } else if(that.jq.find('li.top2Seg').hasClass('on')) {
			// layerNo = omsMain.getLayerNoByName('jtiAccountCodeLabel'); // 기본
			// 점포 레이어키
			// // layerNo = omsMain.getLayerNoByName('top2Seg'); // TOP1SEG 점포
			// 레이어 키
			// // 그 이외의 경우 점포레이어 매핑
			// } else {
			// layerNo = omsMain.getLayerNoByName('jtiAccountCodeLabel'); // 기본
			// 점포 레이어키
			// that.jq.find('#top1SegLegend').hide(); // TOP1SEG 범례창 닫음
			// }
			if ($.isArray(layerNo)) {

			} else {
				layerNo = [ layerNo ];
			}
			// omsMain.getLayerNoByName("jtiLayerStoreLabel")
			// 활성화일 경우
			if (active) {

				// 점포가 비활성인 경우
				if (!that.jq.find('.jti').hasClass('on')) {
					that.jq.find('.label').removeClass('on');
					alert('점포 버튼을 먼저 클릭해주세요!');
					return;
				}
				that.drawJtiAccountCodeLabelLayer();

				// 비활성일 경우
			} else {
				layerNo.forEach(function(no, i) {
					omsMain.selfmap.removeLayer(no);// 레이어를 지운다.
				});
				return;
				var layerNo1 = omsMain.getLayerNoByName('jtiAccountCode'); // 기본
																			// 점포
																			// 레이어키
				var layerNo2 = omsMain.getLayerNoByName('top1Seg'); // TOP1SEG
																	// 점포 레이어키
				var layerNo3 = [ omsMain.getLayerNoByName('jtiFilter') ]; // 점포필터
																			// 레이어키
				var layerNo4 = omsMain.getLayerNoByName('top2Seg'); // TOP2SEG
																	// 점포 레이어키

				// 기본 점포 레이어 스타일 + 라벨해제 및 필터 세팅
				layerNo1.forEach(function(no, i) {
					var style = omsMain.getStyle('mark', no);
					style['userLabel'] = false;
					omsMain.setStyle('mark', no, style);
				});

				// TOP1SEG 점포 레이어 스타일 + 라벨해제 및 필터 세팅
				layerNo2.forEach(function(no, i) {
					var style = omsMain.getStyle('mark', no);
					style['userLabel'] = false;
					omsMain.setStyle('mark', no, style);
				});

				// 점포필터 레이어 스타일 + 라벨해제 및 필터 세팅
				layerNo3.forEach(function(no, i) {
					var style = omsMain.getStyle('mark', no);
					style['userLabel'] = false;
					omsMain.setStyle('mark', no, style);
				});

				// TOP2SEG 점포 레이어 스타일 + 라벨해제 및 필터 세팅
				layerNo4.forEach(function(no, i) {
					var style = omsMain.getStyle('mark', no);
					style['userLabel'] = false;
					omsMain.setStyle('mark', no, style);
				});

				// 현재 선택된 레이어 스타일 + 라벨해제 및 필터 세팅
				layerNo.forEach(function(no, i) {
					var style = omsMain.getStyle('mark', no);
					style['userLabel'] = false;
					omsMain.setStyle('mark', no, style);

					// 레이어가 이미 한번 그려졌을 때
					omsMain.selfmap.wmsRedrawLayer(no); // 레이어를 다시그림
				});
			}

		});

		// TOP1 SEG 활성/비활성
		that.jq.find('.top1Seg').click(
				function() {
					$('.leaflet-popup').hide();
					$(this).toggleClass('on');
					var active = $(this).hasClass('on'); // on 클래스 존재여부
					var layerNo = omsMain.getLayerNoByName('top1Seg');

					// omsMain.filterBox.close();
					// omsMain.navigation.jq.find('li[nm="filterBox"]').removeClass('on');

					// 점포가 비활성인 경우
					if (that.jq.find('.top2Seg').hasClass('on')) {
						that.jq.find('.top2Seg').removeClass('on');
					}
					that.drawJtiAccountCodeLayer();

					// 활성화일 경우
					if (active) {

						// 점포가 비활성인 경우
						if (!that.jq.find('.jti').hasClass('on')) {
							$(this).removeClass('on');
							alert('점포 버튼을 먼저 클릭해주세요!');
							return;
						}

						// 데이터보기가 활성/비활성 여부로 TOP1SEG 범례창 위치 조정
						// if(omsMain.navigation.jq.find('li[nm="dataView"]').hasClass('on'))
						// {
						if ($('#dataView').parent().is(':visible')) {
							that.jq.find('#top1SegLegend')
									.css('right', '311px').show();
							// omsMain.dataView.open(); // 우측 Map/Data 창 엶
							// omsMain.dataView.loadData(); // 우측 Map/Data 데이터
							// 로딩
						} else {
							that.jq.find('#top1SegLegend').css('right', '72px')
									.show();
						}

						/*
						 * drawJtiAccountCodeLayer로 변경
						 * 
						 * var layerNo =
						 * omsMain.getLayerNoByName('jtiAccountCode');
						 * 
						 * layerNo.forEach(function(no, i) {
						 * omsMain.selfmap.hideLayer(no); });
						 * 
						 * layerNo = omsMain.getLayerNoByName('jtiFilter');
						 * omsMain.selfmap.hideLayer(layerNo);
						 * 
						 * layerNo = omsMain.getLayerNoByName('top2Seg');
						 * 
						 * layerNo.forEach(function(no, i) {
						 * omsMain.selfmap.hideLayer(no); });
						 * 
						 * layerNo = omsMain.getLayerNoByName('top1Seg');
						 * 
						 * layerNo.forEach(function(no, i) {
						 *  // 라벨이 활성인 경우
						 * if(that.jq.find('.label').hasClass('on')) {
						 *  // 스타일 + 라벨세팅 및 필터 세팅 layerNo.forEach(function(no,
						 * i) { var style = omsMain.getStyle('mark', no);
						 * style['userLabel'] = true; omsMain.setStyle('mark',
						 * no, style); });
						 *  // 라벨이 비활성인 경우 } else {
						 *  // 스타일 + 라벨해제 및 필터 세팅 layerNo.forEach(function(no,
						 * i) { var style = omsMain.getStyle('mark', no);
						 * style['userLabel'] = false; omsMain.setStyle('mark',
						 * no, style); }); }
						 *  // 레이어가 이미 한번 그려졌을 때
						 * if(omsMain.selfmap.hasLayer(no)) {
						 * omsMain.selfmap.wmsRedrawLayer(no); // 레이어를 보여줌 }
						 * else { omsMain.selfmap.wmsDrawLayer(no); // 레이어를 새로
						 * 그림 } });
						 */

						// 비활성일 경우
					} else {
						that.jq.find('#top1SegLegend').hide();
						/*
						 * drawJtiAccountCodeLayer로 변경
						 * layerNo.forEach(function(no, i) {
						 * omsMain.selfmap.hideLayer(no); });
						 *  // 스타일 + 라벨해제 및 필터 세팅 var layerNo =
						 * omsMain.getLayerNoByName('jtiAccountCode');
						 *  // 라벨이 활성인 경우
						 * if(that.jq.find('.label').hasClass('on')) {
						 *  // 스타일 + 라벨세팅 및 필터 세팅 layerNo.forEach(function(no,
						 * i) { var style = omsMain.getStyle('mark', no);
						 * style['userLabel'] = true; omsMain.setStyle('mark',
						 * no, style); });
						 *  // 라벨이 비활성인 경우 } else {
						 *  // 스타일 + 라벨해제 및 필터 세팅 layerNo.forEach(function(no,
						 * i) { var style = omsMain.getStyle('mark', no);
						 * style['userLabel'] = false; omsMain.setStyle('mark',
						 * no, style); }); }
						 * 
						 * layerNo.forEach(function(no, i) {
						 * if(omsMain.selfmap.hasLayer(no)) {
						 * omsMain.selfmap.wmsRedrawLayer(no); // 레이어를 다시그림 }
						 * else { omsMain.selfmap.wmsDrawLayer(no); // 레이어를 새로
						 * 그림 } });
						 */
					}
					// 임시로 막아 둔다
					// that.jq.find('#top1SegLegend').hide();
				});

		that.jq.find('.top2Seg').click(
				function() {
					$('.leaflet-popup').hide();
					$(this).toggleClass('on');
					var active = $(this).hasClass('on'); // on 클래스 존재여부
					var layerNo = omsMain.getLayerNoByName('top2Seg');

					// omsMain.filterBox.close();
					// omsMain.navigation.jq.find('li[nm="filterBox"]').removeClass('on')

					// 점포가 비활성인 경우
					if (that.jq.find('.top1Seg').hasClass('on')) {
						that.jq.find('.top1Seg').removeClass('on');
					}
					that.drawJtiAccountCodeLayer();
					// 활성화일 경우
					if (active) {

						// 점포가 비활성인 경우
						if (!that.jq.find('.jti').hasClass('on')) {
							$(this).removeClass('on');
							alert('점포 버튼을 먼저 클릭해주세요!');
							return;
						}

						// 데이터보기가 활성/비활성 여부로 TOP1SEG 범례창 위치 조정
						// if(omsMain.navigation.jq.find('li[nm="dataView"]').hasClass('on'))
						// {
						// if(omsMain.navigation.jq.find('li[nm="dataView"]').hasClass('on'))
						// {
						if ($('#dataView').parent().is(':visible')) {
							that.jq.find('#top1SegLegend')
									.css('right', '311px').show();
							// omsMain.dataView.open(); // 우측 Map/Data 창 엶
							// omsMain.dataView.loadData(); // 우측 Map/Data 데이터
							// 로딩
						} else {
							that.jq.find('#top1SegLegend').css('right', '72px')
									.show();
						}

						/*
						 * drawJtiAccountCodeLayer로 변경 var layerNo =
						 * omsMain.getLayerNoByName('jtiAccountCode');
						 * 
						 * layerNo.forEach(function(no, i) {
						 * omsMain.selfmap.hideLayer(no); });
						 * 
						 * layerNo = omsMain.getLayerNoByName('jtiFilter');
						 * omsMain.selfmap.hideLayer(layerNo);
						 * 
						 * layerNo = omsMain.getLayerNoByName('top1Seg');
						 * 
						 * layerNo.forEach(function(no, i) {
						 * omsMain.selfmap.hideLayer(no); });
						 * 
						 * layerNo = omsMain.getLayerNoByName('top2Seg');
						 * 
						 * layerNo.forEach(function(no, i) {
						 *  // 라벨이 활성인 경우
						 * if(that.jq.find('.label').hasClass('on')) {
						 *  // 스타일 + 라벨세팅 및 필터 세팅 layerNo.forEach(function(no,
						 * i) { var style = omsMain.getStyle('mark', no);
						 * style['userLabel'] = true; omsMain.setStyle('mark',
						 * no, style); });
						 *  // 라벨이 비활성인 경우 } else {
						 *  // 스타일 + 라벨해제 및 필터 세팅 layerNo.forEach(function(no,
						 * i) { var style = omsMain.getStyle('mark', no);
						 * style['userLabel'] = false; omsMain.setStyle('mark',
						 * no, style); }); }
						 *  // 레이어가 이미 한번 그려졌을 때
						 * if(omsMain.selfmap.hasLayer(no)) {
						 * omsMain.selfmap.wmsRedrawLayer(no); // 레이어를 보여줌 }
						 * else { omsMain.selfmap.wmsDrawLayer(no); // 레이어를 새로
						 * 그림 } });
						 */
						// 임시로 막아 둔다
						// that.jq.find('#top1SegLegend').show();
						// 비활성일 경우
					} else {
						that.jq.find('#top1SegLegend').hide();
						/*
						 * drawJtiAccountCodeLayer로 변경
						 * layerNo.forEach(function(no, i) {
						 * omsMain.selfmap.hideLayer(no); });
						 *  // 스타일 + 라벨해제 및 필터 세팅 var layerNo =
						 * omsMain.getLayerNoByName('jtiAccountCode');
						 *  // 라벨이 활성인 경우
						 * if(that.jq.find('.label').hasClass('on')) {
						 *  // 스타일 + 라벨세팅 및 필터 세팅 layerNo.forEach(function(no,
						 * i) { var style = omsMain.getStyle('mark', no);
						 * style['userLabel'] = true; omsMain.setStyle('mark',
						 * no, style); });
						 *  // 라벨이 비활성인 경우 } else {
						 *  // 스타일 + 라벨해제 및 필터 세팅 layerNo.forEach(function(no,
						 * i) { var style = omsMain.getStyle('mark', no);
						 * style['userLabel'] = false; omsMain.setStyle('mark',
						 * no, style); }); }
						 * 
						 * layerNo.forEach(function(no, i) {
						 * if(omsMain.selfmap.hasLayer(no)) {
						 * omsMain.selfmap.wmsRedrawLayer(no); // 레이어를 다시그림 }
						 * else { omsMain.selfmap.wmsDrawLayer(no); // 레이어를 새로
						 * 그림 } });
						 */
					}

				});

		// 핵심상권 활성/비활성
		that.jq.find('.coreCommercial').click(function() {

			$(this).toggleClass('on');
			var active = $(this).hasClass('on'); // on 클래스 존재여부

			var layerNo = omsMain.getLayerNoByName('TBSHP_TRDAREA');

			// 활성화일 때
			if (active) {
				// 레이어가 이미 한번 그려졌을 때
				if (omsMain.selfmap.hasLayer(layerNo)) {
					omsMain.selfmap.showLayer(layerNo); // 레이어를 보여줌
				} else {
					omsMain.selfmap.wmsDrawLayer(layerNo); // 레이어를 새로 그림
				}

				// 비활성일 때
			} else {
				omsMain.selfmap.hideLayer(layerNo); // 레이어를 숨김
			}
		});
	}
};

omsMain['controlBar'] = controlBar;
omsMain['controlBar'].init();