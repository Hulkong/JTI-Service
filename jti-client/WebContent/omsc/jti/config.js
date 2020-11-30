// JTI 로컬/개발/운영 정보
var jtiConfig = {
	mapserverUrl: '//' + location.hostname + ':8180/app',                                                       // 데이터 요청 맵서버 URL
	mapserverWmsUrl: '//' + location.hostname + ':8180/app/ows/OGCServiceControll.do',                          // WMS 요청 맵서버 URL
	imgUrl: 'http://' + location.host                                                                           // WMS POI Image URL
};

// 개발기 or 운영기일 경우 
if(location['hostname'] === 'jti.selfmap.co.kr') {
	// 개발일 경우
	if(location['pathname'].indexOf('dev')) {
		jtiConfig['mapserverUrl'] = '//jti.selfmap.co.kr/dev/mapserver/app';                                    // 데이터 요청 맵서버 URL
        jtiConfig['mapserverWmsUrl'] =  '//jti{s}.selfmap.co.kr/dev/mapserver/app/ows/OGCServiceControll.do';   // WMS 요청 맵서버 URL
        
	// 운영일 경우
	} else {
		jtiConfig['mapserverUrl'] = '//jti.selfmap.co.kr/mapserver/app';                                        // 데이터 요청 맵서버 URL
        jtiConfig['mapserverWmsUrl'] =  '//jti{s}.selfmap.co.kr/mapserver/app/ows/OGCServiceControll.do';       // WMS 요청 맵서버 URL
	}
}
