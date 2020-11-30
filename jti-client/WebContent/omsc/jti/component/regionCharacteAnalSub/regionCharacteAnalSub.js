/**
 * @description regionCharacteAnalSub 컴포넌트
 * 지역특성분석 서브 컴포넌트 
 */
var regionCharacteAnalSub = {

    jq: undefined, // selector jquery 객체

    /**
     * @description 컴포넌트 초기화 메소드 
     */
    init: function () {

        var that = this;

        that.jq = $('#regionCharacteAnalSub');   // 이 검포넌트의 Root 선택자 

        that.addList();   // 컨텐츠 메뉴 추가

        // 검색 이벤트
        that.jq.find('input[name="keyword"]').keyup(function (event) {
            that.search($(this).val());
        });

        // 완료 버턴 클릭시
        that.jq.find('.button.complete').click(function () {
        	
        	// 컨텐츠 체크박스 True 개수
            var chkIds = that.jq.find('input:checkbox:checked');
            var data = [];  // 레이어와 차트를 그리기 위해 필요한 배열데이터 

            $.each(chkIds, function(i, e) {
                var obj = {
                    id: $(e).attr('id'),
                    name: $(e).attr('name'),
                    groupName: $(e).attr('groupName'),
                    weight: 1
                }
                data.push(obj);
            });

            chkIds.attr('checked', false);   // 현재 선택된 컨텐츠 체크박스 false로 변경 
            that.jq.find('ul.items').hide();   // 컨텐츠 리스트 숨기기 
            
            // 데이터가 있을 경우
            if(data['length'] > 0) {
            	omsMain.resultReport.open();   // resultReport 컴포넌트 리포트 창 엶
            	omsMain.regionCharacteAnal.addList(data);   // regionCharacteAnal 컴포넌트의 나의 분석 리스트 추가
            	omsMain.regionCharacteAnal.drawLayer();   // 지역특성 분석 레이어 그림
            	omsMain.regionCharacteAnal.drawChart();   // resultReport 컴포넌트 차트 그림
            }
            
            that.close();   // regionCharacteAnalSub 컴포넌트 닫음
        });
    },

    /**
     * @description regionCharacteAnalSub 컴포넌트 여는 메소드
     */
    open: function() {
        var that = this;
        that.jq.show("slide", { direction: "left" }, 300);   // 속도 300 슬라이드 적용
    },

    /**
     * @description regionCharacteAnalSub 컴포넌트 닫는 메소드
     */
    close: function() {
        var that = this;
        that.jq.hide("slide", { direction: "left" }, 300);   // 속도 300 슬라이드 적용
    },

    /**
     * @description regionCharacteAnalSub 컴포넌트에 data를 추가하는 메소드
     * data는 트리구조, groupKey가 입력되면 group 값이나 data-id 값이 groupKey와 일치하는 밑으로 추가된다.
     */
    addList: function () {
        var that = this;

        // 컨텐츠 리스트 데이터를 서버에서 가져오기 위한 파라미터 세팅 
        var params = {
            sqlId: 'selfmap.service.contentsSelect-basic',
            _array: 'smbc-house-type,smbc-resident-population,smbc-store,smpc-commercial-index,smpc-floating-population,smbc-store-jti',
            groupSeq: '0,600'
        }
        
        $.ajax({
			url: jtiConfig['mapserverUrl'] + '/data/mapper.json',
            data: params,
            type : 'GET',
			success: function(result, status, xhr) {
                
                if(!result) {
                    alert('데이터가 없습니다!');
                    return;
                }

                var group = '';   // 직전 그룹과의 비교를 위한 변수 
                var groupIdx = 0;   // 그룹 컨텐츠를 구별하기위한 인덱스 
                
                result.forEach(function(d, i) {
                	
                	// 직전 그룹과 다르면 그룹 리스트 생성하는 로직 
                    if(group !== d['group']) {
                        group = d['group'];
                        var li = '<li class="group folder" data-group="' + d['group'] + ' data-idx="' + groupIdx++ + '">';
                            li +=   '<div class="group-item">';
                            li +=       '<span class="title">';
                            li +=           '<span class="icon"></span>' + d['group'];
                            li +=       '</span>';
                            li +=    '</div>';
                            li +=    '<ul class="items"></ul>';
                            li += '</li>'

                            that.jq.find('.list').append(li);
                    }

                    // 그룹 리스트의 하위 컨텐츠 리스트 생성하는 로직 
                    if(!(d['id'] === 'DM0001010034' || d['id'] === 'DM0001010035' || d['id'] === 'DM0001010036')) {
                    	var li = '<li class="item" data-index="' + i + '" data-id="' + d['id'] + '">';
                    	li +=   '<div>';
                    	li +=       '<label class="title">';
                    	li +=           '<input type="checkbox" id="' + d['id'] +'"';
                    	li +=           ' name="' + d['name'] + '"';
                    	li +=           ' groupName="' + d['group'] + '"/>';
                    	li +=           d['name'].replace(/ /gi, "")
                    	li +=       '</label>';
                    	li +=   '</div>';
                    	li += '</li>'
                    		
                    	that.jq.find('.group.folder').eq(groupIdx - 1).find('.items').append(li);
                    }
                });

                // 컨텐츠 합쳐보기 최대 3건으로 제한
                // 체크박스 클릭시 아래 로직 실행 
                that.jq.find('.group.folder label.title').click(function() {
                	
                	// 컨텐츠 체크박스 True 개수 
                	var selectedChkCnt = that.jq.find('input:checkbox:checked').length;
                	
                	if(selectedChkCnt > 5) {
                		alert('컨텐츠는 최대 5개까지 선택가능합니다!');
                		
                		$(this).find('input[type="checkbox"]').attr('checked', false);
                	}
                });
                
                // group 토글링.
                that.jq.find('.list .group-item').click(function() {
                    $(this).parent().find('ul').toggle();
                });
            },
            
			error: function(a,b,c) {
//				console.log(a,b,c)
			}
		});
    },

    /**
     * @description regionCharacteAnalSub 컴포넌트 데이터 리스트 검색하는 메소드
     * @params 검색키워드
     */
    search: function (keyword) {
        this.jq.find('.searched').removeClass('searched');
        this.jq.find('.nosearched').show().removeClass('nosearched');
        this.jq.find('.list .item .title:contains("' + keyword + '")').parents('.group,.items,.item').addClass('searched');
        this.jq.find('li.searched').find('div:first').addClass('searched');
        this.jq.find('.group,.group-item,.items,.item').not('.searched').addClass('nosearched').hide();
    }
};

omsMain['regionCharacteAnalSub'] = regionCharacteAnalSub;
omsMain['regionCharacteAnalSub'].init();