/**
 * @description regionCharacteAnal 컴포넌트
 * 지역특성분석 메인 컴포넌트 
 */
var regionCharacteAnal = {
    
    jq: undefined,   // selector jquery 객체

    layerNo: undefined,
    
    /**
     * @description 컴포넌트 초기화 메소드 
     */
    init: function() {
        var that = this;

        that.jq = $('#regionCharacteAnal');   // 이 검포넌트의 Root 선택자

        // 분석항목 선택 클릭
        that.jq.find('.btn_add_big').click(function() {
            omsMain.resultReport.close();   // sub메뉴 닫기
            omsMain.resultReportTable.close();   // sub메뉴 닫기
            omsMain.regionCharacteAnalSub.open();   // sub메뉴 보임
        });

        // X 버튼 클릭
        that.jq.find('.btn_close.all').click(function () {
            omsMain.regionCharacteAnalSub.close();
            omsMain.resultReport.close();
            omsMain.resultReportTable.close();
            that.close();
        });

        // 행정구역 클릭
        that.jq.find('.admiDistrict li').click(function() {
            that.jq.find('.admiDistrict li.on').removeClass('on');
            $(this).addClass('on');
            var value = $(this).attr('value');
            var layer = omsMain.getLayer(that['layerNo']);

            // 광역시
            if(value === 'H1') {
                omsMain.region.jq.find('li.on').removeClass('on');
                layer.exfilter = '';

                omsMain.region.jq.find('.mega .contents').hide();
                omsMain.region.jq.find('.cty .contents').hide();
                omsMain.region.jq.find('.admi .contents').hide();

                omsMain.region.jq.find('.mega.arrow').removeClass('on');
                omsMain.region.jq.find('.mega.arrow').addClass('off');
                omsMain.region.jq.find('.cty.arrow').removeClass('on');
                omsMain.region.jq.find('.cty.arrow').addClass('off');
                omsMain.region.jq.find('.admi.arrow').removeClass('on');
                omsMain.region.jq.find('.admi.arrow').addClass('off');

                // 시도 title 초기화
                omsMain.region.jq.find('.mega .title').text('시도');
                omsMain.region.jq.find('.mega .title').attr('megaNm', '');
                
                // 시군구 title 초기화
                omsMain.region.jq.find('.cty .title').text('시군구');
                omsMain.region.jq.find('.cty .title').attr('ctyNm', '');
                
                // 행정동 title 초기화
                omsMain.region.jq.find('.admi .title').text('행정동');
                omsMain.region.jq.find('.admi .title').attr('admiNm', '');
            
            // 시군구
            } else if(value === 'H2') {
                omsMain.region.jq.find('.cty li.on').removeClass('on');
                omsMain.region.jq.find('.admi li.on').removeClass('on');

                if(omsMain.region.jq.find('.mega .contents li.on').length > 0) {
                    layer.exfilter = ' AND (';
    
                    omsMain.region.jq.find('.mega .contents li.on').each(function (i, e) {
                        if (i > 0) {
                            filter += ' OR '
                        }
    
                        layer.exfilter += 'D.PARENT_ID LIKE '
                        layer.exfilter += "'" + $(e).attr('code') + "%'";
                    });
    
                    layer.exfilter += ')';
                }

                omsMain.region.jq.find('.cty .contents').hide();
                omsMain.region.jq.find('.admi .contents').hide();

                omsMain.region.jq.find('.cty.arrow').removeClass('on');
                omsMain.region.jq.find('.cty.arrow').addClass('off');
                omsMain.region.jq.find('.admi.arrow').removeClass('on');
                omsMain.region.jq.find('.admi.arrow').addClass('off');
                
                // 시군구 title 초기화
                omsMain.region.jq.find('.cty .title').text('시군구');
                omsMain.region.jq.find('.cty .title').attr('ctyNm', '');
                
                // 행정동 title 초기화
                omsMain.region.jq.find('.admi .title').text('행정동');
                omsMain.region.jq.find('.admi .title').attr('admiNm', '');
                
            // 행정동
            } else if(value === 'H4') {
                omsMain.region.jq.find('.admi li.on').removeClass('on');

                if(omsMain.region.jq.find('.cty .contents li.on').length > 0) {
                    layer.exfilter = ' AND (';

                    omsMain.region.jq.find('.cty .contents li.on').each(function (i, e) {
                        if (i > 0) {
                            layer.exfilter += ' OR '
                        }
    
                        layer.exfilter += 'D.PARENT_ID LIKE '
                        layer.exfilter += "'" + $(e).attr('code') + "%'";
                    });
    
                    layer.exfilter += ')';
                }

                omsMain.region.jq.find('.admi .contents').hide();

                omsMain.region.jq.find('.admi.arrow').removeClass('on');
                omsMain.region.jq.find('.admi.arrow').addClass('off');
                
                // 행정동 title 초기화
                omsMain.region.jq.find('.admi .title').text('행정동');
                omsMain.region.jq.find('.admi .title').attr('admiNm', '');
            }

            that.drawLayer();
            that.drawChart();
        });

        // 투명도 조절
        that.jq.find("#slider_display").kendoSlider({
            // increaseButtonTitle: "Right",
            // decreaseButtonTitle: "Left",
            min: 0,
            max: 100,
            value: 70,
            smallStep: 1,
            largeStep: 10,
            showButtons: false,
            slide: function (event) {
            	
        		var layer = omsMain.getLayer(that['layerNo']);
        		omsMain.selfmap.instance.setOpacity(layer.mapLayerName, event.value / 100);
            },
            change: function (event) {
        		var layer = omsMain.getLayer(that['layerNo']);
        		omsMain.selfmap.instance.setOpacity(layer.mapLayerName, event.value / 100);
            }
        });

        //등간격 or 등개수 선택
        that.jq.find(".changeBreakType").click(function() {
            that.jq.find(".changeBreakType").toggleClass('btn1');
            that.jq.find(".changeBreakType").toggleClass('btn2');

            that.drawLayer();
            that.drawChart();
        });

        // 색상 박스
        that.jq.find(".changeColors").click(function() {
            that.jq.find(".changeColors").removeClass('on');
            $(this).addClass('on');

            that.drawLayer();
            that.drawChart();
        });

        //테두리
        that.jq.find(".drawBorder").change(function() {
            that.drawLayer();
            that.drawChart();
        });
    },

    open: function() {
        var that = this;
        omsMain.navigation.jq.find('[nm="regionCharacteAnal"]').addClass('on');
        that.jq.show("slide", { direction: "left" }, 300);
    },
    
    close: function() {
        var that = this;
        omsMain.navigation.jq.find('[nm="regionCharacteAnal"]').removeClass('on');
        that.jq.hide("slide", { direction: "left" }, 300);
    },

    openLoading: function() {
		$('#modal').show();   // 백그라운드 모달창 엶
		$('#layerLoading').show();   // 로딩창 엶
    },
    
    closeLoading: function() {
    	$('#modal').hide();   // 백그라운드 모달창 닫음
    	$('#layerLoading').hide();   // 로딩창 닫음
    },
    
    addList: function(data) {

        if(!data) {
            alert('데이터가 없습니다!');
            return;
        }

        var that = this;
        var div = '';
        
        that.jq.find('.histroy_list_item').removeClass('selected');
        
        data.forEach(function(d, i) {
            if(i === 0) {
                div += '<div class="histroy_list_item selected">';
                div +=     '<div class="histroy_list_item_head">';
                div +=         '<div class="histroy_list_item_head_title">';
                div +=             '<div class="title">컨텐츠 합쳐보기</div>';
                div +=             '<img src="/omsc/jti/images/btn_03.png" class="rename_button imgbtn hidden" />';
                div +=         '</div>';
                div +=         '<a href="#" class="btn_close">닫기</a>';
                div +=     '</div>';
            }

            div += '<div class="histroy_list_item_factor"';
            div += ' id="' + d['id'] + '" name="' + d['name'] + '" weight="' + d['weight'] + '"';
            div += ' groupName="' + d['groupName'] + '">'
            div += '    <div class="histroy_list_item_factor_item up">';
            div += '        <div class="item_factor_item_left">';
            div += '            <div class="title factor_item_title">' + d['name'] + '</div>';
            div += '        </div>';
            div += '        <div class="item_factor_item_right"></div>';
            div += '    </div>';
            div += '</div>';
        });

        div += '</div>';

        that.jq.find('.history .list').prepend(div).slideDown(1000);

        // 컨텐츠 합쳐보기 클릭
        that.jq.find('.histroy_list_item').click(function() {

            that.jq.find('.histroy_list_item.selected').removeClass('selected');
            $(this).addClass('selected');
            
            if(!omsMain.resultReport.jq.is(':visible')) {
                omsMain.resultReport.open();
            }
            
            that.drawChart();
            that.drawLayer();
        });

        // 컨텐츠 합쳐보기 마우스 오버
        that.jq.find('.histroy_list_item.selected').mouseenter(function() {
            //합쳐진 컨텐츠 이름 변경
            $(this).find(".rename_button").show();
        });

        // 컨텐츠 합쳐보기 마우스 아웃
        that.jq.find('.histroy_list_item.selected').mouseleave(function() {
            $(this).find(".rename_button").hide();
        });

        // 컨텐츠 이름 변경 마우스 클릭
        that.jq.find('.histroy_list_item.selected .rename_button').click(function(e) {
            e.preventDefault();
            e.stopPropagation();

            var title_div = $(this).closest('.histroy_list_item_head_title').find(".title");
            var title = title_div.text();

            title_div.text("");
            title_div.append('<input type="text" id="change_title"/>');
            title_div.find("#change_title").focus();
            title_div.find("#change_title").val(title);

            $(title_div).find('#change_title').keyup(function() {
                if (event.which == '13') {
                    var titleElement = event.target.parentElement;
                    if (event.target.value == null && event.target.value == "") {
                        alert("변경하실 제목을 입력해 주세요.");
                        return;
                    }
                    $(titleElement).html(event.target.value);
                }
            });
    
            $(title_div).find('#change_title').focusout(function() {
                var title = this.value || "컨텐츠 합쳐보기";
                var titleElement = $(this).parent();
                titleElement.html(title);
            });
        });

        //나의 컨텐츠 삭제
        that.jq.find('.histroy_list_item.selected .btn_close').click(function (event) {

            that.jq.find('.histroy_list_item.selected').remove().slideUp(500);;

            if(that.jq.find('.histroy_list_item.selected').length < 1) {
                omsMain.controlBar.jq.find('li.regionCharacteAnal').removeClass('on');
            }
            
            omsMain.resultReport.close();
            omsMain.resultReportTable.close();
            omsMain.selfmap.removeLayer(that['layerNo']);   // 레이어 숨기기
        });

    },
    
    /**
     * @description 우측 차트 중 HorizenBar차트 그리는 메소드
     */
    drawChart: function() {

        var that = this;

        if(!that['layerNo']) {
            alert('레이어가 생성되지 않았습니다!');
            return;
        }

        if(that.jq.find('.admiDistrict li.on').attr('value') === 'BL') {
        	var zoom = omsMain.selfmap.getZoom();
        	
			if(zoom < 14) {
				return;
			}
        }
        
        var data = [];

        that.jq.find('.histroy_list_item.selected .histroy_list_item_factor').each(function(i, e) {
            var obj = {
                id: $(e).attr('id'),
                name: $(e).attr('name'),
                groupName: $(e).attr('groupName'),
                weight: 1
            }
            data.push(obj);
        });

        if(data['length'] < 1) {
            return;
        }

        var areaList = [];
        if(omsMain.region.jq.find('.admi li.on').length > 0) {
            omsMain.region.jq.find('.admi li.on').each(function(i, e) {
                var obj = {value: $(e).attr('code')};
                areaList.push(obj);
            });
        } else if(omsMain.region.jq.find('.cty li.on').length > 0) {
            omsMain.region.jq.find('.cty li.on').each(function(i, e) {
                var obj = {value: $(e).attr('code')};
                areaList.push(obj);
            });
        } else if(omsMain.region.jq.find('.mega li.on').length > 0) {
            omsMain.region.jq.find('.mega li.on').each(function(i, e) {
                var obj = {value: $(e).attr('code')};
                areaList.push(obj);
            });
        } 

        var firstNm = '';
        var equal = true;
        data.forEach(function(d, i) {
            if(i === 0) {
                firstNm = d['groupName'].replace(/ /gi, ""); 
            }

            var dataNm = d['groupName'].replace(/ /gi, "");
            
            if(firstNm !== dataNm) {
                equal = false;
            }

        });

        var resultReportParams = {
            sqlId: 'selfmap.service.getCombinedContent',
            order: 'desc',
            limit: 25,
            level: omsMain.regionCharacteAnal.jq.find('.admiDistrict li.on').attr('value'),   // 행정구역 선택
            filLevel: undefined,   // 지역 선택
            areaList: areaList,   // 지역이 여러개 일때
            weightSum: data['length'],
            cLength: data['length'],
            contList: data,
            equal: equal   // group이 같으면 raw 값을, 다르면 비율값을 가져옴
        }

        omsMain.resultReport.changeHorizenBarChart(resultReportParams);
    },
    
    /**
     * @description 지역특성분석 레이어 그리는 메소드
     */
    drawLayer: function() {
        var that = this;

        if(!that['layerNo']) {
//            alert('레이어가 생성되지 않았습니다!');
            return;
        }
        
        /*
        if(that.jq.find('.admiDistrict li.on').attr('value') === 'BL') {
        	var zoom = omsMain.selfmap.getZoom();
        	
			if(zoom < 14) {
				omsMain.selfmap.hideLayer(that['layerNo']);   // 레이어 숨기기
				alert('현재 레벨에서는 블록레이어를 볼 수 없습니다. 줌 인하여 주세요!');
				return;
			}
        }
        */
        
        var contents = [];
        var layer = omsMain.getLayer(that['layerNo']);
        var colorMapArr = [
            [{ color: "#f9e37b" }, { color: "#f2bc6a" }, { color: "#ec9559" }, { color: "#e66e49" }, { color: "#e04738" }]
            , [{ color: "#86deec" }, { color: "#6eb6d8" }, { color: "#568fc4" }, { color: "#3e68b0" }, { color: "#26419c" }]
            , [{ color: "#dcfa91" }, { color: "#b4e376" }, { color: "#8ccc5b" }, { color: "#64b641" }, { color: "#3c9f26" }]
            , [{ color: "#ddc3de" }, { color: "#d3a1c3" }, { color: "#ca7fa8" }, { color: "#c15d8e" }, { color: "#b83b73" }]
            , [{ color: "#ffef64" }, { color: "#f5d250" }, { color: "#ebb53c" }, { color: "#e19828" }, { color: "#d77b14" }]
        ];

        that.jq.find('.histroy_list_item.selected .histroy_list_item_factor').each(function(i, e) {
            var obj = {
                id: $(e).attr('id'),
                name: $(e).attr('name'),
                groupName: $(e).attr('groupName'),
                weight: 1
            }
            contents.push(obj);
        });

        if(contents['length'] < 1) {
            alert('컨텐츠를 선택해주세요!');
            return;
        }
        
        omsMain.controlBar.jq.find('.regionCharacteAnal').addClass('on');

        var params = {
            layerName: 'selfmap.service.basicContents',
            classify: that.jq.find('.changeBreakType.btn1').attr('data-value'),
            classifyCount: 5,
            rgnClss: that.jq.find('.admiDistrict li.on').attr('value'),
            contents: contents,
            contNum: contents['length'],
        	exfilter: layer['exfilter']
        };
        
        layer['exparam'] = params;
        
        var cacheParam = '';
        
        $.each(params, function(key, p) {
        	cacheParam += p;
        	
        	if(key === 'contents') {
        		p.forEach(function(c, i) {
        			cacheParam += c['id'];
        		});
        	}
        });
        
        that.openLoading();   // 로딩바 엶
        
        $.ajax({
            dataType: 'json',
            url: jtiConfig['mapserverUrl'] + '/data/classify.json',
            data: { json: JSON.stringify(params) },
            success: function (data) {
            	that.closeLoading();  // 로딩바 닫음
            	
                if (!data || data.length < 1) {
                	alert('데이터가 존재하지 않습니다.');
                    return;
                }
                
                var colorMap = colorMapArr[that.jq.find('.changeColors.on').attr('data-value')];

                var style = omsMain.getStyle('color', that['layerNo']);
                style['colorMap'] = colorMap;
                
                for (i = 0; i < data.length; i++) {
                    style.colorMap[i].min = Number(data[i].minVal);
                    style.colorMap[i].max = Number(data[i].maxVal);
                    style.colorMap[i].value = Number(data[i].value);
                    style.colorMap[i].opacity = 1;
                }

                setTimeout(function() {
        			omsMain.resultReport.changeHistogram(style);  // 우측 켄토 히스토그램 데이터 세팅
        		}, 100);
                
                style['type'] = 'color'
                style['geomType'] = 'polygon';
                style['classify'] = params['classify'];
                style['method'] = params['classify'];
                style['strokeYn'] = that.jq.find('.drawBorder').is(':checked') ? 1 : 0;
                style['column'] = 'VALUE';
                style['strokeOpacity'] = 1;
                style['opacity'] = 1;
                style['strokeColor'] = '#ffffff';
                style['params'] = 'classify,colorMap';

                omsMain.setStyle('color', that['layerNo'], style);
                
                // 레이어가 이미 한번 그려졌을 때
                if(omsMain.selfmap.hasLayer(that['layerNo'])) {
                	 // 레이어를 다시그림
                    omsMain.selfmap.wmsRedrawLayer(that['layerNo']);  
                } else {
                    omsMain.selfmap.wmsDrawLayer(that['layerNo']); 
                }
                
                omsMain.selfmap.instance.setOpacity(layer.mapLayerName, (that.jq.find("#slider_display").data("kendoSlider").value() / 100));
            }, 
            error: function(a, b, c) {
//            	console.log(a, b, c);
            	that.closeLoading();
            }
        });
    }
};

omsMain['regionCharacteAnal'] = regionCharacteAnal;
omsMain['regionCharacteAnal'].init();

