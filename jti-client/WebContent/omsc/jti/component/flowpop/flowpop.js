/**
 * 	유동인구
 */
var flowpop = {
    jq: undefined, // selector jquery 객체

    layerNo: undefined,   // 유동인구 레이어키 

    age: undefined, // 선택된 나이

    time: undefined, // 선택된 시간
    
    column: undefined,   // 선택된 쿼리 컬럼
    
    // 레이어그리기 위한 데이터 가져오는 액션
    // 두 속성이 모두 true일 때 drawWFS() 호출
    action: {
    	gradeData: false,   // 등급 데이터 가져오는 여부
    	geomData: false     // 지오메트리 데이터 가져오는 여부
    },
    
    visible: false,   // 현재 레이어가 보이는지 여부 
    
    gradeData: {},   // 등급에 따른 색상 객체
    
    geomData: undefined,   // WFS 지오메트리

    state: 'off', // 상태

    /**
     * @description 이 컴포넌트 초기화하는 메소드
     */
    init: function () {
    	
        var that = this;
        
        that.jq = $('#flowpop');
        omsMain.region.jq.on("regionchange",$.proxy(this.regionChangeLsnr, this));
        
        // on 버턴 클릭시
        that.jq.find('.on.button').click(function() {
        	
        	if(omsMain.selfmap.getZoom() < 14) {
        		alert('현재 레벨에서는 유동인구를 볼 수 없습니다. 줌 인 후 다시 활성시켜주세요!');
        		that.jq.find('.off.button').trigger('click');
        		return;
        	}
        	
            if (that.state == 'off') {
                that.jq.find('.on.button').addClass('active');
                that.jq.find('.off.button').removeClass('active');
                that.state = 'on';

                that.jq.find('.button.all').each(function(i , e) {
                    var src = $(e).attr('src');
                    $(e).addClass('on')
                    $(e).attr('src', src.replace('\.png', '_on\.png'));
                });

                that.setColumn();
                that.drawWMS();
//                that.getGrade();
//                that.getGeom();
            }
        });

        // off 버턴 클릭시
        that.jq.find('.off.button').click(function() {
            if (that.state == 'on') {
                that.jq.find('.off.button').addClass('active');
                that.jq.find('.on.button').removeClass('active');
                that.state = 'off';

                that.jq.find('.flowpop .button.on').each(function(i , e) {
                    var src = $(e).attr('src');
                    $(e).removeClass('on')
                    $(e).attr('src', src.replace('_on\.png', '\.png'));
                });

                // 레이어 숨기기
//                that.removeWFS();
                omsMain.selfmap.removeLayer(that['layerNo']);
            }
        });

        // age 버턴 클릭시
        that.jq.find('.age .button').click(function() {

            if (that.state === 'on') {

            	if(omsMain.selfmap.getZoom() < 14) {
            		alert('현재 레벨에서는 유동인구를 볼 수 없습니다. 줌 인 후 다시 활성시켜주세요!');
            		that.jq.find('.off.button').trigger('click');
            		return;
            	}
            	
                var column = $(this).attr('column');

                if(column === 'all') {
                    that.jq.find('.age .button.on').each(function(i, e){
                        $(e).removeClass('on');
                        var src = $(e).attr('src')
                        $(e).attr('src', src.replace('_on\.png', '\.png'));
                    });

                    var src = $(this).attr('src');
                    if($(this).hasClass('on')) {
                        $(this).removeClass('on');
                        $(this).attr('src' , src.replace('_on\.png', '\.png'));
                    } else {
                        $(this).addClass('on');
                        $(this).attr('src' , src.replace('\.png', '_on\.png'));
                    }
                } else {
                    var allSrc = that.jq.find('.age .button.all').attr('src');
                    that.jq.find('.age .button.all').removeClass('on');
                    that.jq.find('.age .button.all').attr('src', allSrc.replace('_on\.png', '\.png'));

                    src = $(this).attr('src');
                    if($(this).hasClass('on')) {
                        $(this).removeClass('on');
                        $(this).attr('src' , src.replace('_on\.png', '\.png'));
                        
                        if(that.jq.find('.age .button.on').length === 0) {
                        	that.jq.find('.age .button.all').addClass('on');
                            that.jq.find('.age .button.all').attr('src', allSrc.replace('\.png', '_on\.png'));
                        }
                    } else {
                        $(this).addClass('on');
                        $(this).attr('src' , src.replace('\.png', '_on\.png'));
                    }
                }

                that.setColumn();
                that.drawWMS();
//                that.getGrade();
//                that.getGeom();
            }
        });

        // time 버턴 클릭시
        that.jq.find('.time .button').click(function() {

            if (that.state === 'on') {

            	if(omsMain.selfmap.getZoom() < 14) {
            		alert('현재 레벨에서는 유동인구를 볼 수 없습니다. 줌 인 후 다시 활성시켜주세요!');
            		that.jq.find('.off.button').trigger('click');
            		return;
            	}
            	
                var column = $(this).attr('column');

                if(column === 'all') {
                    that.jq.find('.time .button.on').each(function(i, e){
                        $(e).removeClass('on');
                        var src = $(e).attr('src')
                        $(e).attr('src', src.replace('_on\.png', '\.png'));
                    });

                    var src = $(this).attr('src');
                    if($(this).hasClass('on')) {
                        $(this).removeClass('on');
                        $(this).attr('src' , src.replace('_on\.png', '\.png'));
                    } else {
                        $(this).addClass('on');
                        $(this).attr('src' , src.replace('\.png', '_on\.png'));
                    }
                } else {
                    var allSrc = that.jq.find('.time .button.all').attr('src');
                    that.jq.find('.time .button.all').removeClass('on');
                    that.jq.find('.time .button.all').attr('src', allSrc.replace('_on\.png', '\.png'));

                    src = $(this).attr('src');
                    if($(this).hasClass('on')) {
                        $(this).removeClass('on');
                        $(this).attr('src' , src.replace('_on\.png', '\.png'));
                        
                        if(that.jq.find('.time .button.on').length === 0) {
                        	that.jq.find('.time .button.all').addClass('on');
                            that.jq.find('.time .button.all').attr('src', allSrc.replace('\.png', '_on\.png'));
                        }
                    } else {
                        $(this).addClass('on');
                        $(this).attr('src' , src.replace('\.png', '_on\.png'));
                    }
                }

                that.setColumn();
                that.drawWMS();
//                that.getGrade();
//                that.getGeom();
            }
        });

        that.jq.find('.btn_close').click(function() {
            that.close();
        });
    },

    close: function() {
        var that = this;
        omsMain.navigation.jq.find('[nm="flowpop"]').removeClass('on');
        that.jq.hide("slide", { direction: "left" }, 300);
    },

    getGrade: function() {
    	
    	var that = this;
    	
    	// 경도 === x, 위도 === y
    	var mbr = omsMain.selfmap.getBounds();  // 출력[miny, minx, maxy, maxx] or [최소위도, 최소경도, 최대위도, 최대경도]
        var katecMin = SelfMapUtil.fnProj4('WGS84', 'KATEC', [mbr[1], mbr[0]]);  // 입력[경도, 위도], 출력[경도, 위도] 
        var katecMax = SelfMapUtil.fnProj4('WGS84', 'KATEC', [mbr[3], mbr[2]]);  // 입력[경도, 위도], 출력[경도, 위도]
        
        $.ajax({
            url: jtiConfig['mapserverUrl'] + '/data/mapper/dynamic.json',
            data: {
            	sqlId: 'selfmap.service.flowpopGrdData',
            	column: that['column'],
            	bbox: true,
            	minx: katecMin[0],   // 최소 경도
                miny: katecMin[1],   // 최소 위도
                maxx: katecMax[0],   // 최대 경도
                maxy: katecMax[1]    // 최대 위도
            },
            type: 'GET',
            success: function (result, status, xhr) {
                if (!result['flowpopGrdData']) {
                    alert('데이터가 없습니다!');
                    return;
                }
                
                result['flowpopGrdData'].forEach(function(d, i) {
                	that.gradeData[d['unqid']] = d['color']; 
                });
                
                that.action['gradeData'] = true;
                
                if(that.action['gradeData'] && that.action['geomData']) {
                	that.drawWFS();
                }
                	
            },

            error: function (e) { }
        });
    },
    
    /**
     * 
     */
    getGeom: function() {
    	var that = this;
    	// 경도 === x, 위도 === y
    	var mbr = omsMain.selfmap.getBounds();  // 출력[miny, minx, maxy, maxx] or [최소위도, 최소경도, 최대위도, 최대경도]
        var katecMin = SelfMapUtil.fnProj4('WGS84', 'KATEC', [mbr[1], mbr[0]]);  // 입력[경도, 위도], 출력[경도, 위도] 
        var katecMax = SelfMapUtil.fnProj4('WGS84', 'KATEC', [mbr[3], mbr[2]]);  // 입력[경도, 위도], 출력[경도, 위도]
        var bbox = {
            minx: katecMin[0],   // 최소 경도
            miny: katecMin[1],   // 최소 위도
            maxx: katecMax[0],   // 최대 경도
            maxy: katecMax[1]    // 최대 위도
        }
        
        var bboxStr = bbox['minx'] + ',' + bbox['miny'] + ',' + bbox['maxx'] + ',' + bbox['maxy'];
        var owsrootUrl = jtiConfig['mapserverUrl'] + '/ows/OGCServiceControll';
        var defaultParameters = {
            SERVICE : 'WFS',
            VERSION : '1.1.0',
            REQUEST : 'GetFeature',
            TYPENAME : 'feature:selfmap.service.flowpopWFS',
            OUTPUTFORMAT : 'application/json',
            FORMAT_OPTIONS : 'callback:getJson',
            SRSNAME : 'KATEC',
            maxFeatures: 5000,
            BBOX: bboxStr
        };
        
        var parameters = L.Util.extend(defaultParameters);
        var URL = owsrootUrl + L.Util.getParamString(parameters);
        
    	$.ajax({
    		url : URL,
            dataType : 'json',
            jsonpCallback : 'getJson',
			success: function(response) {
				
				response['features'].forEach(function(f, i) {
					f.geometry['coordinates'].forEach(function(c, j) {
						// c[0]: x or 경도, c[1]: y or 위도 
                		f.geometry['coordinates'][j] = SelfMapUtil.fnProj4('KATEC', 'EPSG:4326', c);  // 입력[경도, 위도], 출력[경도, 위도]
                	});
				});
				
				that['geomData'] = response;
                that.action['geomData'] = true;
	                
                if(that.action['gradeData'] && that.action['geomData']) {
                	that.drawWFS();
                }
				
			},
			error: function(result, status, error) {
//					console.log(result);
			}
		});
    },
    
    /**
     * @description 로딩창 여는 메소드
     */
    openLoading: function() {
		$('#modal').show();   // 백그라운드 모달창 엶
		$('#layerLoading').show();   // 로딩창 엶
    },
    
    /**
     * @description 로딩창 닫는 메소드 
     */
    closeLoading: function() {
    	$('#modal').hide();   // 백그라운드 모달창 닫음
		$('#layerLoading').hide();   // 로딩창 닫음
    },
    
    /**
     * @description 레이어 시각여부 확인 메소드
     * @returns true/false
     */
    isVisible: function() {
    	var that = this;
    	return that['visible'];
    },
    
    /**
     * @description WFS레이어 삭제하는 메소드
     */
    removeWFS: function() {
    	var that = this;
    	
    	// WFS레이어가 존재할 경우
    	if(that.WFSLayer) {
			omsMain.selfmap.map.removeLayer(that.WFSLayer);   // 레이어 삭제
			that.visible = false;   // 레이어 시각 비활성 
		}
    },
    
    /**
     * @description WFS레이어 그리는 메소드
     */
    drawWFS: function() {
    	var that = this;
    	
    	that.action['gradeData'] = false;   // 등급데이터 응답 완료 비활성
    	that.action['geomData'] = false;    // 지오메트리 데이터 응답 완료 비활성
    	that.removeWFS();   // 기존 WFS레이어 삭제
    	that.visible = true;   // 레이어 시각 활성
    	
    	// 지오메트리 데이터 기반 WFS레이어 그림
    	that.WFSLayer = L.geoJson(that['geomData'], {
            style : function(feature) {
                return {
            		color: that.gradeData[feature.properties['UNQID']],   // 등급데이터의 행정동코드에 매핑되는 색상 가져옴
            		weight: 2,
            		opacity: 0.7
                }
            }
        }).addTo(omsMain.selfmap.map);
    	
    	that.closeLoading();   // 로딩창 닫음 
    },
    ctyArr : [],    
    regionChangeLsnr: function(e,d){
	    if(d.ctyArr.length > 0){
			this.ctyArr = d.ctyArr.slice(0);
			this.useRegionFilter = true;
		}else{
			this.ctyAr = [];
			this.useRegionFilter = false;
		}
	    this.setLayerParam();
    },
    setLayerParam: function(ctyArr){
		var layer = omsMain.getLayer(this['layerNo']);	
		layer.params = { 
				classifyCount: 5,
				classify: 'quantile',
				layerName: layer.name,
				column: this['column']
		};
		layer.exparam = { };
    	if(this.useRegionFilter){
    		layer.params.useRegionFilter = true;
    		layer.params.ctyArr = this.ctyArr.slice(0);
    		layer.exparam = { useRegionFilter : true,ctyArr : this.ctyArr.slice(0) };
    	}else{
    		layer.params.useRegionFilter = false;
    		delete layer.params.ctyArr;
    	}
    },
    /**
     * @description WMS레이어 그리는 메소드
     * debounce 사용 
     */
    drawWMS: _.debounce(function() {
    	var that = this;
		var layer = omsMain.getLayer(that['layerNo']);
		var style = omsMain.getStyle('color', that['layerNo']); // 컬러맵 스타일
		that.openLoading();   // 로딩창 엶
		that.setLayerParam();
		style.classify = 'quantile';


		omsMain.setStyle('color', that['layerNo'], style);
		
		// 분류값을 구해서 스타일을 정한 후 layer-targeted 이벤트로 그리기 요청.
		$.ajax({
			dataType: 'json',
			url: jtiConfig['mapserverUrl'] + '/data/classify.json',
			data: { json: JSON.stringify(layer.params)},
			success: function(data) {
				
				that.closeLoading();   // 로딩창 닫음 
				
				if(!data) {
					alert('데이터가 없습니다!');
					return;
				}
				layer.exparam.column = that.column || null;
				var i = 0;
				style.colorMap = [
					{ min: 0, max: 0, color: '#1a9641', width: 2, opacity: 0.7 },
					{ min: 0, max: 0, color: '#a6d96a', width: 2, opacity: 0.7 },
					{ min: 0, max: 0, color: '#ffffbf', width: 2, opacity: 0.7 },
					{ min: 0, max: 0, color: '#fdae61', width: 2, opacity: 0.7 },
					{ min: 0, max: 0, color: '#d7191c', width: 2, opacity: 0.7 }
				];
				
				var total = 0, quantile;
				
				if(layer.params.classify == 'quantile')	{
					for(i in data) {
						total += Number(data[i].value); 
					}
					quantile = Number(data[0].qanVal);
				}
				
				for(i = 0; i < data.length; i++) {
					if(data[i].minVal !== undefined && data[i].maxVal !== undefined) {
						style.colorMap[i].min = data[i].minVal;
						style.colorMap[i].max = data[i].maxVal;
					}
					style.colorMap[i].value = Number(data[i].value);
				}
				
				// 레이어가 이미 한번 그려졌을 때
                if(omsMain.selfmap.hasLayer(that['layerNo'])) {
                	 // 레이어를 다시그림
                    omsMain.selfmap.wmsRedrawLayer(that['layerNo']);  
                } else {
                    omsMain.selfmap.wmsDrawLayer(that['layerNo']); 
                }
			}, 
			error: function(a, b, c) {
//				console.log(a)
//				console.log(b)
//				console.log(c)
				that.closeLoading();   // 로딩창 닫음 
			}
		});
    }, 500),
    
    /**
     * @description 선택된 컬럼 세팅하는 메소드
     */
    setColumn: function () {
    	var that = this;
        var layer = omsMain.getLayer(that['layerNo']);
        var style = omsMain.getStyle('color', that['layerNo']); // 컬러맵 스타일
        var column = '';
        
        // 모든 연령과 시간을 선택했을 경우
        if(that.jq.find('.age .button.all').hasClass('on') && that.jq.find('.time .button.all').hasClass('on')) {
            that.jq.find('.age .button').each(function(i, a) {

                var age = $(a).attr('column');
                if(age !== 'all') {
                    if(i > 1) {
                        column += ' + '
                    }
        
                    that.jq.find('.time .button').each(function(j, t) {
                        var time = $(t).attr('column')

                        if(time !== 'all') {
                            if(j > 1) {
                                column += ' + '
                            }
                            column += 'POP_' + age + '_' + time
                        }
                    })
                }
            });

        // 모든 연령을 선택했을 경우
        } else if(that.jq.find('.age .button.all').hasClass('on')) {
            that.jq.find('.age .button').each(function(i, a) {

                var age = $(a).attr('column');
                if(age !== 'all') {
                    if(i > 1) {
                        column += ' + '
                    }
        
                    that.jq.find('.time .button.on').each(function(j, t) {
                        var time = $(t).attr('column')

                        if(j > 0) {
                            column += ' + '
                        }
                        column += 'POP_' + age + '_' + time
                    })
                }
            });

        // 모든 시간을 선택했을 경우
        } else if(that.jq.find('.time .button.all').hasClass('on')) {
            that.jq.find('.age .button.on').each(function(i, a) {

                var age = $(a).attr('column');
                if(i > 0) {
                    column += ' + '
                }
    
                that.jq.find('.time .button').each(function(j, t) {
                    var time = $(t).attr('column')

                    if(time !== 'all') {
                        if(j > 1) {
                            column += ' + '
                        }
                        column += 'POP_' + age + '_' + time
                    }
                })
            });
        
        // 모든 시간, 모든 연령을 제외하고 선택했을 경우
        } else {
            that.jq.find('.age .button.on').each(function(i, a) {
                if(i > 0) {
                    column += ' + '
                }
                var age = $(a).attr('column');
    
                that.jq.find('.time .button.on').each(function(j, t) {
                    if(j > 0) {
                        column += ' + '
                    }
                    column += 'POP_' + age + '_' + $(t).attr('column')
                })
            });
        }
        
        that.column = column;
    }
}

omsMain['flowpop'] = flowpop;
flowpop.init();