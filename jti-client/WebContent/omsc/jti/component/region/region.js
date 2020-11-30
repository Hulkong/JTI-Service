/**
 * @description region 컴포넌트
 */
var region = {

    jq: undefined,   // 이 컴포넌트의 jquery 루트 선택자 

    selectedRegion: {   // 기존 선택된 지역코드 및 텍스트를 저장하기위한 오브젝트 
    	cty: {},
    	admi: {}
    },
    
    /**
     * @description 이 컴포넌트 초기화하는 메소드
     */  
    init: function () {
    	
        var that = this;
        
        that.jq = $('#region');   // 이 컴포넌트의 루트 선택자 

        that.getRegions('mega');  // 초기화시 시도지역을 모두 가져와서 세팅 

        // 지역박스 마우스엔터 이벤트
        that.jq.find('.title').mouseenter(function() {
        	
        	var type = $(this).parent().attr('class');
        	
        	$('.' + type).find('.contents').show();   // 지역리스트 보임 
        	
        	// 화살표 방향 위로 향하도록 함 
        	$('.arrow.' + type).removeClass('off');
        	$('.arrow.' + type).addClass('on');
        });
        
        // 지역박스 마우스리브 이벤트
        that.jq.find('div.mega,div.cty,div.admi').mouseleave(function() {
        	
        	var type = $(this).attr('class');
        	
    		$(this).find('.contents').hide();   // 지역리스트 숨김 
    		
    		// 화살표 방향 아래로 향하도록 함 
    		$('.arrow.' + type).removeClass('on');
    		$('.arrow.' + type).addClass('off');
        });

        that.bindMegaListClickEvnt();   // 시도 리스트 클릭 이벤트 바인딩 
        that.bindCtyListClickEvnt();    // 시군구 리스트 클릭 이벤트 바인딩
        that.bindAdmiListClickEvnt();   // 행정동 리스트 클릭 이벤트 바인딩
    },

    /**
     * @description 시도 리스트 클릭 이벤트를 바인딩하는 메소드
     */
    bindMegaListClickEvnt: function() {
    	var that = this;
    	
    	that.jq.find('.mega .contents').on('click', 'li', function () {
    		//초기화
    		if($(this).index() == 0){
    			that.jq.find('.mega .contents li').removeClass("on");
    			delete that.selectedRegion['cty'];
    			that.selectedRegion['cty'] = {};
    		}else{
    			$(this).toggleClass('on');
    		}

            that.jq.find('.cty .contents ul').empty();   // 기존 시군구 리스트 삭제
            that.jq.find('.admi .contents ul').empty();  // 기존 행정동 리스트 삭제
            that.jq.find('.admi .contents').hide();   // 행정동 리스트 닫음 

            // 시도를 목록에서 제거했을 경우 
            if(!$(this).hasClass('on')) {
            	
            	var nowSeletedMegaCd = $(this).attr('code');   // 현재 선택한 시도 코드
            	
            	/**
            	 *  시군구코드 관리배열 삭제로직  
            	 */
            	// 시군구 관리배열에서 현재 선택된 시도코드와 매핑되는 시군구 코드 삭제 
            	$.each(that.selectedRegion['cty'], function(code, title) {
            		if(code.slice(0, 2) === nowSeletedMegaCd) {
            			delete that.selectedRegion['cty'][code];
            		}
            	});
            	
            	/**
            	 *  행정동코드 관리배열 삭제로직  
            	 */
            	// 행정동 관리배열에서 현재 선택된 시도코드와 매핑되는 행정동코드 삭제
            	$.each(that.selectedRegion['admi'], function(code, title) {
            		if(code.slice(0, 2) === nowSeletedMegaCd) {
            			delete that.selectedRegion['admi'][code];
            		}
            	});
            }
            
            // 선택된 시도 리스트가 있을 경우
            if(that.jq.find('.mega .contents li.on').length > 0) {
            	
            	var nowSelectedMegaCnt = that.jq.find('.mega .contents li.on').length;  // 현재 선택된 시도 리스트 개수
            	
            	// 선택된 시도가 1개일 경우 타이틀 세팅
            	if(nowSelectedMegaCnt === 1) {
            		var megaTitle = that.jq.find('.mega .contents li.on').eq(0).attr('nm');
            		
        		// 선택된 시도가 1개 이상일 경우 타이틀 세팅
            	} else {
            		var firstSelectedMegaNm = that.jq.find('.mega .contents li.on').eq(0).attr('nm');
                	var megaTitle = firstSelectedMegaNm + ' 외 ' + (nowSelectedMegaCnt - 1) + '곳';   // text변경
            	}
            	
                // 선택된 시도 기반으로 시군구 리스트 세팅
                that.jq.find('.mega .contents li.on').each(function (i, e) {
                    var code = $(e).attr('code');   // 시도코드 
                    var megaNm = $(e).attr('nm');   // 시도이름
                    that.getRegions('cty', code, megaNm);   // cty 코드를 서버를 통해 가져온 후 UI세팅
                });
                
                // 시군구 title 세팅 및 행정동 데이터 세팅
                var ctyTitle = '시군구';
                var selectedCtyCnt = 0;   // 기존 선택된 시군구리스트 개수
                
            	$.each(that.selectedRegion['cty'], function(code, title) {
            		var megaNm = title.split(' ')[0];   // 시도 이름 
        			var ctyNm = title.split(' ')[1];   // 시군구 이름
        			
            		if(selectedCtyCnt === 0) {
            			ctyTitle = ctyNm + '(' + megaNm + ')';
            		} else {
            			ctyTitle = ctyNm + '(' + megaNm + ') 외 ' + selectedCtyCnt + '곳';
            		}
            		
            		that.getRegions('admi', code, title);   // 행정동 데이터 서버에서 가져온 후 UI 생성
            		selectedCtyCnt++;
            	});
            	
            	// 행정동 title 세팅
            	var admiTitle = '행정동';
            	var selectedAdmiCnt = 0;   // 기존 선택된 행정동리스트 개수
            	
            	$.each(that.selectedRegion['admi'], function(code, title) {
            		var megaNm = title.split(' ')[0];   // 시도 이름
        			var ctyNm = title.split(' ')[1];    // 시군구 이름
        			var admiNm = title.split(' ')[2];   // 행정동 이름
        			
            		if(selectedAdmiCnt === 0) {
            			admiTitle = admiNm + '(' + megaNm + ' ' + ctyNm + ')';
            		} else {
            			admiTitle = admiNm + '(' + megaNm + ' ' + ctyNm + ') 외 ' + selectedAdmiCnt + '곳';
            		}
            		
            		selectedAdmiCnt++;
            	});
            	
            	that.jq.find('.mega .title').text(megaTitle);   // 시도 타이틀변경
            	that.jq.find('.cty .title').text(ctyTitle);     // 시군구 타이틀변경
            	that.jq.find('.admi .title').text(admiTitle);   // 행정동 타이틀변경
                
            // 선택된 시도 리스트가 없을 경우    
            } else {
            	
                that.jq.find('.cty .contents').hide();    // 시군구 리스트 닫음
                that.jq.find('.admi .contents').hide();   // 행정동 리스트 닫음

                // 시군구 화살표 방향 아래료 향함
                that.jq.find('.cty.arrow').removeClass('on');   
                that.jq.find('.cty.arrow').addClass('off');

                // 행정동 화살표 방향 아래료 향함
                that.jq.find('.admi.arrow').removeClass('on');
                that.jq.find('.admi.arrow').addClass('off');
                
                // 시도 title 초기화
                that.jq.find('.mega .title').text('시도');
                
                // 시군구 title 초기화
                that.jq.find('.cty .title').text('시군구');
                
                // 행정동 title 초기화
                that.jq.find('.admi .title').text('행정동');
            }

            that.setMbr();   // mbr기준으로 화면 조정
            that.drawLayer();
        });
    },
    
    /**
     * @description 시군 리스트 클릭 이벤트를 바인딩하는 메소드
     */
    bindCtyListClickEvnt: function() {
    	var that = this;
    	
    	// 시군구 리스트 클릭 이벤트 바인딩
        that.jq.find('.cty .contents').on('click', 'li', function () {
        	
    		//초기화
    		if($(this).index() == 0){
    			that.jq.find('.cty .contents li').removeClass("on");
    			delete that.selectedRegion['admi'];
    			that.selectedRegion['admi'] = {};
    		}else{
    			$(this).toggleClass('on');
    		}


            that.jq.find('.admi .contents ul').empty(); // 기존 행정동리스트 삭제

            // 시군구를 목록에서 선택했을 경우 
            if($(this).hasClass('on')) {
            	
            	// 관리객체에 선택 시군구 코드/이름 저장 
            	that.selectedRegion['cty'][$(this).attr('code')] = $(this).attr('meganm') + ' ' + $(this).attr('nm');
        	// 시군구를 목록에서 제거했을 경우 	
            } else {
            	
            	// 관리객체에 선택 시군구 코드/이름 삭제
            	delete that.selectedRegion['cty'][$(this).attr('code')];
            	
            	/**
            	 *  행정동코드 관리배열 삭제로직  
            	 */
            	// 행정동 관리배열에서 현재 선택된 시도코드와 매핑되는 행정동코드 삭제
            	var ctyCd = $(this).attr('code');
            	
            	$.each(that.selectedRegion['admi'], function(code, title) {
            		if(code.slice(0, 4) === ctyCd) {
            			delete that.selectedRegion['admi'][code];
            		}
            	});
            }
            
            // 선택된 시군구 리스트가 있을 경우
            if (that.jq.find('.cty .contents li.on').length > 0) {
            	
            	var currtSelectedCtyCnt = that.jq.find('.cty .contents li.on').length;  // 현재 선택된 시군구 리스트 개수
            	var title = '';   // 시군구 타이틀 
            	
                that.jq.find('.cty .contents li.on').each(function (i, e) {
                    var megaNm = $(e).attr('megaNm');   // 시도이름
                    var ctyNm = $(e).attr('nm');   // 시군구이름
                    var ctyCd = $(e).attr('code');   // 시군구코드
                    var nm = megaNm + ' ' + ctyNm;   // 시군구 타이틀
                    
                    that.getRegions('admi', ctyCd, nm);   // 행정동 코드를 서버에서 가져옴
                    
                    // 선택된 시군구가 1개일 경우 타이틀 세팅 
                    if(i === 0) {
                    	title = $(e).text();
                    	
                	// 선택된 시군구가 1개 이상일 경우 타이틀 세팅
                    } else if(i === 1) {
                    	title += ' 외 ' + (currtSelectedCtyCnt - 1) + '곳';   // text변경
                    }
                });
                
                that.jq.find('.cty .title').text(title);   // 타이틀변경
                
                // 시군구 화살표 방향을 위로 향함
                that.jq.find('.cty.arrow').removeClass('off');
                that.jq.find('.cty.arrow').addClass('on');
            } else {
            	
                that.jq.find('.admi .contents').hide();   // 행정동리스트 닫음
                
                // 행정동 화살표 방향을 아래로 향함
                that.jq.find('.admi.arrow').removeClass('on');
                that.jq.find('.admi.arrow').addClass('off');
                
                // 시군구 title 초기화
                that.jq.find('.cty .title').text('시군구');
                
                // 행정동 title 초기화
                that.jq.find('.admi .title').text('행정동');
            }

            that.setMbr();   // 선택된 지역들의 중심좌표로 이동 
            that.drawLayer();   // 지역필터 적용하여 레이어 다시그림 
        });
    },
    
    /**
     * @description 행정동 리스트 클릭 이벤트를 바인딩하는 메소드
     */
    bindAdmiListClickEvnt: function() {
    	var that = this;
    	
    	// 행정동 리스트 클릭 이벤트 바인딩
        that.jq.find('.admi .contents').on('click', 'li', function () {
        	
        	if($(this).index() == 0){
    			that.jq.find('.admi .contents li').removeClass("on");
    			delete that.selectedRegion['admi'];
    			that.selectedRegion['admi'] = {};
    		}else{
    			$(this).toggleClass('on');
    		}
            
            // 시군구를 목록에서 선택했을 경우 
            if($(this).hasClass('on')) {
            	
            	// 관리객체에 선택 시군구 코드/이름 저장 
            	that.selectedRegion['admi'][$(this).attr('code')] = $(this).attr('meganm') + ' ' + $(this).attr('ctynm') + ' ' + $(this).attr('nm');
        	// 시군구를 목록에서 제거했을 경우 	
            } else {
            	
            	// 관리객체에 선택 시군구 코드/이름 삭제
            	delete that.selectedRegion['admi'][$(this).attr('code')];
            }
            
            // 선택된 행정동 리스트가 있을 경우
            if (that.jq.find('.admi .contents li.on').length > 0) {
            	
            	var currtSelectedAdmiCnt = that.jq.find('.admi .contents li.on').length;  // 현재 선택된 행정동 리스트 개수
            	var title = '';   // 행정동 타이틀
            	
            	// 행정동 title 세팅
                that.jq.find('.admi .contents li.on').each(function (i, e) {
                    
                    // 선택된 시군구가 1개일 경우 타이틀 세팅 
                    if(i === 0) {
                    	title = $(e).text();
                    	
                	// 선택된 시군구가 1개 이상일 경우 타이틀 세팅
                    } else if(i === 1) {
                    	title += ' 외 ' + (currtSelectedAdmiCnt - 1) + '곳';   // text변경
                    }
                });
                
                that.jq.find('.admi .title').text(title);   // 타이틀변경
                
            } else {
                // 행정동 title 초기화
                that.jq.find('.admi .title').text('행정동');
            }
            
            that.setMbr();   // 선택된 지역들의 중심좌표로 이동 
            that.drawLayer();   // 지역필터 적용하여 레이어 다시그림
        });
    },
    
    /**
     * @description 구분값에 따른 지역 데이터 가져오는 메소드
     * @param {*} division 구분자 ex) mega, cty, admi
     * @param {*} code 지역코드 ex) 1150
     * @param {*} nm 상위 행정구역 ex) 서울시
     */
    getRegions: function (division, code, nm) {

        if (!division) {
            alert('구분값이 없습니다!');
            return;
        }

        var that = this;
        var params = {};

        if (division === 'mega') {
            params = {
                type: 'all',
                sqlId: 'om.comp.regionMega',
                sqlAlias: 'mega'
            }
        } else if (division === 'cty') {
            params = {
                megaCode: code,
                type: 'city',
                sqlId: 'om.comp.regionCity',
                sqlAlias: 'city'
            }
        } else if (division === 'admi') {
            params = {
                cityCode: code,
                type: 'admi',
                sqlId: 'om.comp.regionAdmi',
                sqlAlias: 'admi'
            }
        }

        $.ajax({
            url: jtiConfig['mapserverUrl'] + '/data/mapper/dynamic.json',
            data: params,
            async: false,  // 데이터 삽입은 동기로 처리해야 함
            type: 'GET',
            success: function (result, status, xhr) {
            	
                if (!result) {
                    alert('데이터가 없습니다!');
                    return;
                }

                if (division === 'mega') {
                    that.createMegaUI(result['mega']);
                } else if (division === 'cty') {
                    that.createCtyUI(result['city'], nm);
                } else if (division === 'admi') {
                    that.createAdmiUI(result['admi'], nm);
                }
            },

            error: function (e) { 
//            	console.log(e);
            }
        });
    },

    /**
     * @description 시도 리스트 UI 생성하는 메소드
     * @param data{Array}: 리스트 생성에 필요한 데이터
     */
    createMegaUI: function (data) {

        var that = this;
        var li = '';
        var firsetLi = '<li code="0" nm="초기화" xmin="0" ymin="0" xmax="0" ymax="0" class="">초기화</li>';
        data.forEach(function (d, i) {
            li += '<li code="' + d['value'] + '"';
            li += ' nm="' + d['text'] + '"';
            li += ' xmin="' + d['xmin'] + '"';
            li += ' ymin="' + d['ymin'] + '"';
            li += ' xmax="' + d['xmax'] + '"';
            li += ' ymax="' + d['ymax'] + '"';
            li += '>'
            li += d['text'];
        });

        li += '</li>';

        that.jq.find('.mega .contents ul').append(firsetLi);
        that.jq.find('.mega .contents ul').append(li);
    },

    /**
     * @description 시군구 리스트 UI 생성하는 메소드
     * @param data{Array}: 리스트 생성에 필요한 데이터
     * @param megaName{String}: 시군구 title 표현할 text
     */
    createCtyUI: function (data, megaName) {

        var that = this;
        var li = '';
        var firsetLi = '<li code="0" nm="초기화" xmin="0" ymin="0" xmax="0" ymax="0" class="">초기화</li>';
        // data의 개수만큼 동적 li태그 생성
        data.forEach(function (d, i) {
            li += '<li code="' + d['value'] + '"';
            li += ' nm="' + d['text'] + '"';
            li += ' megaNm="' + megaName + '"';
            li += ' xmin="' + d['xmin'] + '"';
            li += ' ymin="' + d['ymin'] + '"';
            li += ' xmax="' + d['xmax'] + '"';
            li += ' ymax="' + d['ymax'] + '"';
            li += '>'
            li += d['text'] + '(' + megaName + ')';
        });

        li += '</li>';

        that.jq.find('.cty .contents').show();   // 시군구 리스트 엶
        if(  $(".cty .contents ul li[code=0]").length == 0    )
        	that.jq.find('.cty .contents ul').append(firsetLi);   // 초기화 추가
        that.jq.find('.cty .contents ul').append(li);   // 시군구 리스트 추가
        
        // 기존 선택된 시군구 UI 재생성
		$.each(that.selectedRegion['cty'], function(ctyCd, title) {
			that.jq.find('.cty .contents ul li[code="' + ctyCd + '"]').addClass('on');   // 기존 선택된 시군구 재선택;
		});

        that.jq.find('.cty .title').addClass('on');
        that.jq.find('.cty.arrow').removeClass('off');
        that.jq.find('.cty.arrow').addClass('on');
    },

    /**
     * @description 행정동 리스트 UI 생성하는 메소드
     * @param data{Array}: 리스트 생성에 필요한 데이터
     * @param nm{String}: 시군구 title 표현할 text
     */
    createAdmiUI: function (data, nm) {

        var that = this;
        var li = '';
        var megaNm = nm.split(' ')[0];
        var ctyNm = nm.split(' ')[1];
        var firsetLi = '<li code="0" nm="초기화" xmin="0" ymin="0" xmax="0" ymax="0" class="">초기화</li>';
        data.forEach(function (d, i) {
            li += '<li code="' + d['value'] + '"';
            li += ' nm="' + d['text'] + '"';
            li += ' meganm="' + megaNm + '"';
            li += ' ctynm="' + ctyNm + '"';
            li += ' xmin="' + d['xmin'] + '"';
            li += ' ymin="' + d['ymin'] + '"';
            li += ' xmax="' + d['xmax'] + '"';
            li += ' ymax="' + d['ymax'] + '"';
            li += '>'
            li += d['text'] + '(' + nm + ')';
        });

        li += '</li>';
        
        that.jq.find('.admi .contents').show();
        if(  $(".admi .contents ul li[code=0]").length == 0    )
        	that.jq.find('.admi .contents ul').append(firsetLi);   // 초기화 추가
        
        that.jq.find('.admi .contents ul').append(li);
        
        $.each(that.selectedRegion['admi'], function(admiCd, title) {
        	that.jq.find('.admi .contents ul li[code="' + admiCd + '"]').addClass('on');
        });

        that.jq.find('.admi .title').addClass('on');
        that.jq.find('.admi.arrow').removeClass('off');
        that.jq.find('.admi.arrow').addClass('on');
    },

    /**
     * @description 현재 선택된 지역을 기반으로 MBR 계산 및 이동하는 메소드
     */
    setMbr: function () {
        var that = this;
        var bounds = [];
        var xmin = 0;
        var ymin = 0;
        var xmax = 0;
        var ymax = 0;

        if (that.jq.find('.admi .contents li.on').length > 0) {
            that.jq.find('.admi .contents li.on').each(function (i, e) {

                if (i === 0) {
                    xmin = $(e).attr('xmin');
                    ymin = $(e).attr('ymin');
                    xmax = $(e).attr('xmax');
                    ymax = $(e).attr('ymax');
                }

                // 가장 작아야함
                if (xmin > $(e).attr('xmin')) {
                    xmin = $(e).attr('xmin');
                }

                // 가장 작아야함
                if (ymin > $(e).attr('ymin')) {
                    ymin = $(e).attr('ymin');
                }

                // 가장 커야함
                if (xmax < $(e).attr('xmax')) {
                    xmax = $(e).attr('xmax');
                }

                // 가장 커야함
                if (ymax < $(e).attr('ymax')) {
                    ymax = $(e).attr('ymax');
                }

            });
        } else if (that.jq.find('.cty .contents li.on').length > 0) {
            that.jq.find('.cty .contents li.on').each(function (i, e) {

                if (i === 0) {
                    xmin = $(e).attr('xmin');
                    ymin = $(e).attr('ymin');
                    xmax = $(e).attr('xmax');
                    ymax = $(e).attr('ymax');
                }

                // 가장 작아야함
                if (xmin > $(e).attr('xmin')) {
                    xmin = $(e).attr('xmin');
                }

                // 가장 작아야함
                if (ymin > $(e).attr('ymin')) {
                    ymin = $(e).attr('ymin');
                }

                // 가장 커야함
                if (xmax < $(e).attr('xmax')) {
                    xmax = $(e).attr('xmax');
                }

                // 가장 커야함
                if (ymax < $(e).attr('ymax')) {
                    ymax = $(e).attr('ymax');
                }

            });
        } else if (that.jq.find('.mega .contents li.on').length > 0) {
            that.jq.find('.mega .contents li.on').each(function (i, e) {

                if (i === 0) {
                    xmin = $(e).attr('xmin');
                    ymin = $(e).attr('ymin');
                    xmax = $(e).attr('xmax');
                    ymax = $(e).attr('ymax');
                }

                // 가장 작아야함
                if (xmin > $(e).attr('xmin')) {
                    xmin = $(e).attr('xmin');
                }

                // 가장 작아야함
                if (ymin > $(e).attr('ymin')) {
                    ymin = $(e).attr('ymin');
                }

                // 가장 커야함
                if (xmax < $(e).attr('xmax')) {
                    xmax = $(e).attr('xmax');
                }

                // 가장 커야함
                if (ymax < $(e).attr('ymax')) {
                    ymax = $(e).attr('ymax');
                }

            });
        }


        bounds.push(xmin);
        bounds.push(ymin);
        bounds.push(xmax);
        bounds.push(ymax);
        
        var megaArr = that.jq.find('.mega .contents li.on').map(function(e){return $(this).attr("code");}).toArray();
        var ctyArr = that.jq.find('.cty .contents li.on').map(function(e){return $(this).attr("code");}).toArray();
        var aminArr = that.jq.find('.admi .contents li.on').map(function(e){return $(this).attr("code");}).toArray();
        
        if (xmin === 0 && ymin === 0 && xmax === 0 && ymax === 0) {
        	omsMain.selfmap.instance.setCenter([126.9768428, 37.576026], 14, 'wgs84');
        	that.jq.trigger("regionchange",[ {"bounds":bounds,megaArr:megaArr,ctyArr:ctyArr,aminArr:aminArr} ] );
        	return;
        }else{
        	
        }

        omsMain.selfmap.setBounds(bounds, 'katec');
        that.jq.trigger("regionchange",[ {"bounds":bounds,megaArr:megaArr,ctyArr:ctyArr,aminArr:aminArr} ] );
    },

    /**
     * @description 레이어에 지역 필터를 추가하여 그리는 메소드
     */
    drawLayer: function () {
        var that = this;
        var filter = '';
        if (that.jq.find('.admi .contents li.on').length > 0) {
            filter = ' AND (';
            that.jq.find('.admi .contents li.on').each(function (i, e) {
                if (i > 0) {
                    filter += ' OR '
                }

                filter += 'A.ADMI_CD LIKE '
                filter += "'" + $(e).attr('code') + "%'";
            });

            omsMain.regionCharacteAnal.jq.find('.admiDistrict li').removeClass('on');
            omsMain.regionCharacteAnal.jq.find('.admiDistrict li').eq(3).addClass('on');
            filter += ')';
        } else if (that.jq.find('.cty .contents li.on').length > 0) {
            filter = ' AND (';
            that.jq.find('.cty .contents li.on').each(function (i, e) {
                if (i > 0) {
                    filter += ' OR '
                }

                filter += 'A.ADMI_CD LIKE '
                filter += "'" + $(e).attr('code') + "%'";
            });

            omsMain.regionCharacteAnal.jq.find('.admiDistrict li').removeClass('on');
            omsMain.regionCharacteAnal.jq.find('.admiDistrict li').eq(2).addClass('on');
            filter += ')';
        } else if (that.jq.find('.mega .contents li.on').length > 0) {
            filter = ' AND (';
            that.jq.find('.mega .contents li.on').each(function (i, e) {
                if (i > 0) {
                    filter += ' OR '
                }

                filter += 'A.ADMI_CD LIKE '
                filter += "'" + $(e).attr('code') + "%'";
            });

            omsMain.regionCharacteAnal.jq.find('.admiDistrict li').removeClass('on');
            omsMain.regionCharacteAnal.jq.find('.admiDistrict li').eq(1).addClass('on');
            filter += ')';
        }
        
        
		var layerArr = omsMain.getLayerNoById("jti.jtiLayerStore");
		

		layerArr = layerArr.filter(function(i){
			var layerInfo = omsMain.getLayer(i);
			return layerInfo['name'] != 'jtiFilter';
		});

		layerArr.forEach(function (key, i) {
			var layerInfo = omsMain.getLayer(key);
			layerInfo['regionFilter'] = filter;

		})
		// selfmap.service.basicContents 레이어에 관한 필터적용
		var layerNo1 = omsMain.getLayerNoByName('selfmap.service.basicContents');
        if (layerNo1) {
            var layer1 = omsMain.getLayer(layerNo1)
            layer1['exfilter'] = filter.replace(/A.ADMI_CD/gi, 'D.PARENT_ID');
            layer1['regionFilter'] = filter.replace(/A.ADMI_CD/gi, 'D.PARENT_ID');
        }
		
		omsMain.controlBar.drawJtiAccountCodeLayer();
		omsMain.controlBar.drawJtiAccountCodeLabelLayer();
        // 지역특성이 활성화 되어있을 경우 레이어 그림
        if (omsMain.controlBar.jq.find('.regionCharacteAnal').hasClass('on')) {
            omsMain.regionCharacteAnal.drawLayer();   // 레이어를 다시그림
            omsMain.regionCharacteAnal.drawChart();   // 차트를 다시그림
        }
		return;
        // selfmap.service.basicContents, jtiAccountCode, top1Seg, jtiFilter에 필터적용
        var layerNo1 = omsMain.getLayerNoByName('selfmap.service.basicContents');
        var layerNo2 = omsMain.getLayerNoByName('jtiAccountCode');
        var layerNo3 = omsMain.getLayerNoByName('top1Seg');
        var layerNo4 = omsMain.getLayerNoByName('jtiFilter');
        var layerNo5 = omsMain.getLayerNoByName('jti.jtiStore');
        
        var layerNo6 = omsMain.getLayerNoByName('jtiAccountCodeLabel');

        // selfmap.service.basicContents 레이어에 관한 필터적용
        if (layerNo1) {
            var layer1 = omsMain.getLayer(layerNo1)
            layer1['exfilter'] = filter.replace(/A.ADMI_CD/gi, 'D.PARENT_ID');
            layer1['regionFilter'] = filter.replace(/A.ADMI_CD/gi, 'D.PARENT_ID');
        }

        // jtiAccountCode 레이어에 관한 필터적용
        if (layerNo2) {
        	if($.isArray(layerNo2)){
        		
        	}else{
        		layerNo2 = [layerNo2];
        	}
            layerNo2.forEach(function (no, i) {
                var layer2 = omsMain.getLayer(no);
                layer2['exfilter'] = filter;
                layer2['regionFilter'] = filter;

                if (layer2['importantFilter']) {
                    layer2['exfilter'] += layer2['importantFilter'];
                }
            });
        }
        // jtiAccountCode 레이어에 관한 필터적용
        if (layerNo6) {
        	if($.isArray(layerNo6)){
        		
        	}else{
        		layerNo6 = [layerNo6];
        	}
        	layerNo6.forEach(function (no, i) {
        		var layer6 = omsMain.getLayer(no);
        		layer6['exfilter'] = filter;
        		layer6['regionFilter'] = filter;
        		
        		if (layer6['importantFilter']) {
        			layer6['exfilter'] += layer6['importantFilter'];
        		}
        	});
        }

        // top1Seg 레이어에 관한 필터적용
        if (layerNo3) {
            layerNo3.forEach(function (no, i) {
                var layer3 = omsMain.getLayer(no);
                layer3['exfilter'] = filter;
                layer3['regionFilter'] = filter;

                if (layer3['importantFilter']) {
                    layer3['exfilter'] += layer3['importantFilter'];
                }
            });
        }

        // jtiFilter 레이어에 관한 필터적용
        if (layerNo4) {
            var layer4 = omsMain.getLayer(layerNo4)
            layer4['exfilter'] = filter;
            layer4['regionFilter'] = filter;

            if (layer4['importantFilter']) {
                layer4['exfilter'] += layer4['importantFilter'];
            }
        }

        // jti.jtiStore 레이어에 관한 필터적용
        if (layerNo5) {
            var layer5 = omsMain.getLayer(layerNo5)
            layer5['exfilter'] = filter;
            layer5['regionFilter'] = filter;

            if (layer5['importantFilter']) {
                layer5['exfilter'] += layer5['importantFilter'];
            }
        }

        // 지역특성이 활성화 되어있을 경우 레이어 그림
        if (omsMain.controlBar.jq.find('.regionCharacteAnal').hasClass('on')) {
            omsMain.regionCharacteAnal.drawLayer();   // 레이어를 다시그림
            omsMain.regionCharacteAnal.drawChart();   // 차트를 다시그림
        }

        // top1Seg 활성화 되어있을 경우 라벨 세팅
        if (omsMain.controlBar.jq.find('.top1Seg').hasClass('on')) {

            layerNo2.forEach(function (no, i) {
                omsMain.selfmap.hideLayer(no);
            });

            // 점포라벨 활성화 되어있을 경우 라벨 세팅
            if (omsMain.controlBar.jq.find('.label').hasClass('on')) {
                // 스타일 + 라벨세팅 및 필터 세팅
            	layerNo3.forEach(function (no, i) {
            		if(i === 0) {
            			var layer3 = omsMain.getLayer(no);
            			omsMain.dataView.loadData(null, layer3['regionFilter']);
            		}
                    var style = omsMain.getStyle('mark', no);
                    style['userLabel'] = true;
                    omsMain.setStyle('mark', no, style);
                    omsMain.selfmap.wmsRedrawLayer(no);   // 레이어를 다시그림
                });
            } else {
                // 스타일 + 라벨해제 및 필터 세팅
            	layerNo3.forEach(function (no, i) {
            		if(i === 0) {
            			var layer3 = omsMain.getLayer(no);
            			omsMain.dataView.loadData(null, layer3['regionFilter']);
            		}
                    var style = omsMain.getStyle('mark', no);
                    style['userLabel'] = false;
                    omsMain.setStyle('mark', no, style);
                    omsMain.selfmap.wmsRedrawLayer(no);   // 레이어를 다시그림
                });
            }
            
            // 점포 활성화 되어있을 경우
        } else if (omsMain.controlBar.jq.find('.jti').hasClass('on')) {

            // JTI 점포 필터 레이어가 그려져 있을 경우
            if (layerNo4 && omsMain.selfmap.isVisible(layerNo4)) {
                omsMain.selfmap.wmsRedrawLayer(layerNo4);   // 레이어를 다시그림
    			var layer4 = omsMain.getLayer(layerNo4);
                omsMain.dataView.loadData(null, layer4['regionFilter']);
                // jtiAccountCode 레이어 그려져 있을 경우
            } else {
            	if(layerNo3){
            		
            		layerNo3.forEach(function (no, i) {
            			omsMain.selfmap.hideLayer(no);
            		});
            	}

                // 점포라벨 활성화 되어있을 경우 라벨 세팅
                if (omsMain.controlBar.jq.find('.label').hasClass('on')) {
                    // 스타일 + 라벨세팅 및 필터 세팅
                	layerNo2.forEach(function (no, i) {
                		if(i === 0) {
                			var layer2 = omsMain.getLayer(no);
//                			console.log(layer2);
                			omsMain.dataView.loadData(null, layer2['regionFilter']);
                		}
//                        var style = omsMain.getStyle('mark', no);
//                        style['userLabel'] = true;
//                        omsMain.setStyle('mark', no, style);
                        omsMain.selfmap.wmsRedrawLayer(no);   // 레이어를 다시그림
                    });
                } else {
                    // 스타일 + 라벨해제 및 필터 세팅
                	layerNo2.forEach(function (no, i) {
                		if(i === 0) {
                			var layer2 = omsMain.getLayer(no);
//                			console.log(layer2);
                			omsMain.dataView.loadData(null, layer2['regionFilter']);
                		}
//                        var style = omsMain.getStyle('mark', no);
//                        style['userLabel'] = false;
//                        omsMain.setStyle('mark', no, style);
                        omsMain.selfmap.wmsRedrawLayer(no);   // 레이어를 다시그림
                    });
                }
            }
        }
    }
};

omsMain['region'] = region;
omsMain['region'].init();