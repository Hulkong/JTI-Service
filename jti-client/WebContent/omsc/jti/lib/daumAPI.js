/**
 * 점포명, 건물명, 주소
 */

var daumAPI = {

    jq: undefined,
    ps: undefined,
    geocoder: undefined,

    init: function() {

        var that = this;
        that.jq = $('#daumAPI');

        // 장소 검색 객체를 생성합니다
        that.ps = new daum.maps.services.Places(); 

        // 주소-좌표 변환 객체를 생성합니다
        that.geocoder = new daum.maps.services.Geocoder();

        that.jq.find('input').keyup(function(e) {
            if(e.keyCode === 13) {

                var keyword = $(this).val();

                if (!keyword.replace(/^\s+|\s+$/g, '')) {
                    alert('키워드를 입력해주세요!');
                    return false;
                }

                that.openLoading();
                that.searchJTIStore(keyword);  // 처음엔 JTI 점포명을 검색
            }
        });
        
        that.jq.find('img').click(function(e) {
            var keyword = $(this).siblings('input').val();

            if (!keyword.replace(/^\s+|\s+$/g, '')) {
                alert('키워드를 입력해주세요!');
                return false;
            }
            
            that.openLoading();
            that.searchJTIStore(keyword);  // 처음엔 JTI 점포명을 검색
        });
    },

    openLoading: function() {
    	$('#addrLoading').show();
    },
    
    closeLoading: function() {
    	$('#addrLoading').hide();
    },
    /**
     * @description JTI 점포 검색하는 메소드
     */
    searchJTIStore: function(keyword) {
        var that = this;
        var params = {
            storeNm: keyword,
            sqlId: 'jti.getJtiCoord',
        };

        $.ajax({
			url: jtiConfig['mapserverUrl'] + '/data/mapper.json',
            data: params,
            type : 'POST',
			success: function(data, status, xhr) {
				that.closeLoading();
				if(data['length'] === 0) {
                    that.searchAddress(keyword);
                } else {
                	alert('검색 완료되었습니다.');
                    omsMain.selfmap.instance.setCenter([data[0]['xAxis'], data[0]['yAxis']], null, 'katec');
                }

            },
            
			error: function(e) {
				that.closeLoading();
			}
		});
    },

    searchAddress: function(keyword) {
        var that = this;
        
        // 주소로 좌표를 검색합니다
        that.geocoder.addressSearch(keyword, function(data, status) {
        	that.closeLoading();
        	
            // 데이터가 없을 경우 다음 API의 건물명 검색
            if(data['length'] === 0) {
                that.ps.keywordSearch(keyword, that.placesSearchCB); 
            }
            
            // 정상적으로 검색이 완료됐으면 
            if (status === daum.maps.services.Status.OK) {
            	alert('검색 완료되었습니다.');
                omsMain.selfmap.instance.setCenter([data[0]['x'], data[0]['y']], null, 'wgs84');
            } 
        });   
    },

    // 건물명 검색 완료 시 호출되는 콜백함수
    placesSearchCB: function(data, status, pagination) {
        var that =  this;
        that.closeLoading();
        
        if(data['length'] === 0) {
            alert('조회된 데이터가 없습니다!');
            return;
        }
        if (status === daum.maps.services.Status.OK) {
        	alert('검색 완료되었습니다.');
            omsMain.selfmap.instance.setCenter([data[0]['x'], data[0]['y']], null, 'wgs84');
        } 
    }
};

omsMain['daumAPI'] = daumAPI;
omsMain['daumAPI'].init();
