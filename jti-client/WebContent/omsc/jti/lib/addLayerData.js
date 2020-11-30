/**
 * 데이터보기 레이어 생성
 * filterBox, filterEdit, dataView 컴포넌트에서 사용 
 */ 
omsMain.addLayerData('jti.jtiStore', false, function (result) {
	
	var layerNo = omsMain.getLayerNoByName('jti.jtiStore');
	var layer = omsMain.getLayer(layerNo);
	
	omsMain.filterBox.layerNo = layerNo;   // filterBox 컴포넌트에 layerNo 바인딩 
	omsMain.filterBox.layer = layer;   // filterBox 컴포넌트에 layer 바인딩 
	omsMain.filterBox.createUI();   // filterBox UI 미리 생성 
	
	omsMain.filterEdit.layerNo = layerNo;   // filterEdit 컴포넌트에 layerNo 바인딩 
	omsMain.filterEdit.layer = layer;   // filterEdit 컴포넌트에 layer 바인딩
	
	layer['exfilter'] = "";
	layer['regionFilter'] = "";
	layer['importantFilter'] = "";
});

// 지역특성분석 레이어 생성 
omsMain.addLayerData('selfmap.service.basicContents', false, function(result) {
	var layerNo = omsMain.getLayerNoByName('selfmap.service.basicContents');
	var layer = omsMain.getLayer(layerNo);
	
    omsMain.regionCharacteAnal.layerNo = layerNo;
         
    layer['zIndex'] = 3;
    layer['noCache'] = false;
});

// 유동인구 레이어 생성 
omsMain.addLayerData('selfmap.service.flowpop', false, function(result) {
	var layerNo = omsMain.getLayerNoByName('selfmap.service.flowpop');
	var layer = omsMain.getLayer(layerNo);
	
	omsMain.flowpop.layerNo = layerNo;
	
	layer['zIndex'] = 4;
	layer['noCache'] = false;
});

// 핵심상권 레이어 생성 
omsMain.addLayerData('TBSHP_TRDAREA', false, function (result) {
    var layerNo = omsMain.getLayerNoByName('TBSHP_TRDAREA');
    var style = omsMain.getStyle('polygon', layerNo);
    style['fillColor'] = '#FFFF00';
    style['strokeColor'] = '#FFFF00';
    omsMain.setStyle('polygon', layerNo, style);
});

/**
 * JTI 점포 레이어 생성
 * 총 17개의 레이어 생성 
 * Outlet 레이어 
 * Account 레이어 
 * Top1Seg 레이어(7개)
 * Top2Seg 레이어(7개)  
 * 점포필터 레이어 
 */  

addJtiLayerStore();
function addJtiLayerStore(){
	
	omsMain.addLayerData('jti.jtiLayerStore', false, function (result) {
	    var layerNo = omsMain.getLayerNoByName('jti.jtiLayerStore');
	    omsMain.setStyle('mark', layerNo, {});
	    var layer = omsMain.getLayer(layerNo);
        layer['name'] = 'jtiAccountCode';
        layer['exfilter'] = "";
        layer['regionFilter'] = "";
        layer['importantFilter'] = "";
        layer['storeFilter'] = "";        
        layer['infoPop'] = infoPop;
        layer['useInfoPop'] = true;
        layer['zIndex'] = 200;
        layer['noCache'] = false;
        
	});
	omsMain.addLayerData('jti.jtiLayerStore', false, function (result) {
		var layerNo = omsMain.getLayerNoByName('jti.jtiLayerStore');
        var layer = omsMain.getLayer(layerNo);
        var style = omsMain.getStyle('point', layerNo);
//        style['url'] = jtiConfig['imgUrl'] + '/omsc/jti/images/map_ico_filter.png';
//        style['format'] = 'image/png';
//        style['size'] = 32;
//        style['offsetY'] = -16;
        

		var style = {
			"type" : "point",
			"name" : "star",
			"size" : 10,
			"fillColor" : "#ff0000",
			"fillOpacity" : 0,
			"strokeStyle" : "solid",
			"strokeColor" : "#ffbf00",
			"strokeOpacity" : 0,
			"strokeWidth" : 1
		};
        
        style['userLabel'] = false;
        style.labelOption = {
            labelName: 'COL05',
            labelColor: '#000000',
            labelOpacity: 1,
            geometryName: 'geometry',
            fontFamily: 'NanumGothic',
            fontSize: '13',
            fontStyle: 'normal',
            fontWeight: 'bold',
            ancX: 0.5,
            ancY: 1.0,
            dspX: 0.0,
            dspY: -5,
            rotation: 0,
            haloRadius: 5,
            haloFill: '#ffffff',
            haloOpacity: 1
        };
        omsMain.setStyle('point', layerNo, style);
        layer['name'] = 'jtiAccountCodeLabel';
        layer['exfilter'] = "";
        layer['regionFilter'] = "";
        layer['importantFilter'] = " AND 'Label' = 'Label' ";
        layer['storeFilter'] = "";
        layer['infoPop'] = infoPop;
        layer['useInfoPop'] = true;
        layer['zIndex'] = 201;
        layer['noCache'] = false;
	});
	
	
	omsMain.addLayerData('jti.jtiLayerStore', false, function (result) {
		var layerNo = omsMain.getLayerNoByName('jti.jtiLayerStore');
	    var layer = omsMain.getLayer(layerNo);
	    var style = omsMain.getStyle('mark', layerNo);
	    style['url'] = jtiConfig['imgUrl'] + '/omsc/jti/images/map_ico_filter.png';
	    style['format'] = 'image/png';
	    style['size'] = 32;
	    style['offsetY'] = -16;
	    style['userLabel'] = false;
	    style.labelOption = {
	        labelName: 'COL05',
	        labelColor: '#000000',
	        labelOpacity: 1,
	        geometryName: 'geometry',
	        fontFamily: 'NanumGothic',
	        fontSize: '13',
	        fontStyle: 'normal',
	        fontWeight: 'bold',
	        ancX: 0.5,
	        ancY: 1.0,
	        dspX: 0.0,
	        dspY: -5,
	        rotation: 0,
	        haloRadius: 5,
	        haloFill: '#ffffff',
	        haloOpacity: 1
	    };
	    omsMain.setStyle('mark', layerNo, style);
	    layer['name'] = 'jtiFilter';
	    layer['exfilter'] = "";
	    layer['regionFilter'] = "";
	    layer['importantFilter'] = "";
	    layer['infoPop'] = infoPop;
	    layer['useInfoPop'] = true;
	    layer['zIndex'] = 300;
	    layer['noCache'] = true;
	});	

    
    
//	console.log("addJtiLayerStore");
	return;
	for (var i = 0; i < 17; i++) {
	    omsMain.addLayerData('jti.jtiLayerStore', false, function (result) {
	    	var addLayerCnt = omsMain.getLayerNoByName('jti.jtiLayerStore').length;
	        if (addLayerCnt === 17) {
	                var layerNo = omsMain.getLayerNoByName('jti.jtiLayerStore');
	                layerNo.forEach(function (no, j) {
	                    if (j === 0) {
	                        var layer = omsMain.getLayer(no);
	                        var style = omsMain.getStyle('mark', no);
	                        style['url'] = jtiConfig['imgUrl'] + '/omsc/jti/images/map_ico_outlet.png';
	                        style['format'] = 'image/png';
	                        style['size'] = 32;
	                        style['offsetY'] = -16;
	                        style['userLabel'] = false;
	                        style.labelOption = {
	                            labelName: 'COL05',
	                            labelColor: '#000000',
	                            labelOpacity: 1,
	                            geometryName: 'geometry',
	                            fontFamily: 'NanumGothic',
	                            fontSize: '13',
	                            fontStyle: 'normal',
	                            fontWeight: 'bold',
	                            ancX: 0.5,
	                            ancY: 1.0,
	                            dspX: 0.0,
	                            dspY: -5,
	                            rotation: 0,
	                            haloRadius: 5,
	                            haloFill: '#ffffff',
	                            haloOpacity: 1
	                        };

	                        omsMain.setStyle('mark', no, style);
	                        layer['name'] = 'jtiAccountCode';
	                        layer['exfilter'] = " AND J.COL08 = 'Outlet'";
	                        layer['regionFilter'] = "";
	                        layer['importantFilter'] = " AND J.COL08 = 'Outlet'";
	                        layer['infoPop'] = infoPop;
	                        layer['useInfoPop'] = true;
	                        layer['zIndex'] = 200;
	                        layer['noCache'] = false;

	                    } else if (j === 1) {
	                        var layer = omsMain.getLayer(no);
	                        var style = omsMain.getStyle('mark', no);
	                        style['url'] = jtiConfig['imgUrl'] + '/omsc/jti/images/map_ico_keyAccount.png';
	                        style['format'] = 'image/png';
	                        style['size'] = 32;
	                        style['offsetY'] = -16;
	                        style['userLabel'] = false;
	                        style.labelOption = {
	                            labelName: 'COL05',
	                            labelColor: '#000000',
	                            labelOpacity: 1,
	                            geometryName: 'geometry',
	                            fontFamily: 'NanumGothic',
	                            fontSize: '13',
	                            fontStyle: 'normal',
	                            fontWeight: 'bold',
	                            ancX: 0.5,
	                            ancY: 1.0,
	                            dspX: 0.0,
	                            dspY: -5,
	                            rotation: 0,
	                            haloRadius: 5,
	                            haloFill: '#ffffff',
	                            haloOpacity: 1
	                        };
	                        omsMain.setStyle('mark', no, style);
	                        layer['name'] = 'jtiAccountCode';
	                        layer['exfilter'] = " AND J.COL08 = 'Key Account'";
	                        layer['regionFilter'] = "";
	                        layer['importantFilter'] = " AND J.COL08 = 'Key Account'";
	                        layer['infoPop'] = infoPop;
	                        layer['useInfoPop'] = true;
	                        layer['zIndex'] = 200;
	                        layer['noCache'] = false;

	                    } else if (j === 2) {
	                        var layer = omsMain.getLayer(no);
	                        var style = omsMain.getStyle('mark', no);
	                        style['url'] = jtiConfig['imgUrl'] + '/omsc/jti/images/map_ico_filter.png';
	                        style['format'] = 'image/png';
	                        style['size'] = 32;
	                        style['offsetY'] = -16;
	                        style['userLabel'] = false;
	                        style.labelOption = {
	                            labelName: 'COL05',
	                            labelColor: '#000000',
	                            labelOpacity: 1,
	                            geometryName: 'geometry',
	                            fontFamily: 'NanumGothic',
	                            fontSize: '13',
	                            fontStyle: 'normal',
	                            fontWeight: 'bold',
	                            ancX: 0.5,
	                            ancY: 1.0,
	                            dspX: 0.0,
	                            dspY: -5,
	                            rotation: 0,
	                            haloRadius: 5,
	                            haloFill: '#ffffff',
	                            haloOpacity: 1
	                        };
	                        omsMain.setStyle('mark', no, style);
	                        layer['name'] = 'jti0Filter';
	                        layer['exfilter'] = "";
	                        layer['regionFilter'] = "";
	                        layer['importantFilter'] = "";
	                        layer['infoPop'] = infoPop;
	                        layer['useInfoPop'] = true;
	                        layer['zIndex'] = 300;
	                        layer['noCache'] = true;

	                    } else if (j === 3) {
	                        var layer = omsMain.getLayer(no);
	                        var style = omsMain.getStyle('mark', no);
	                        style['url'] = jtiConfig['imgUrl'] + '/omsc/jti/images/ico_poi_s1.png';
	                        style['format'] = 'image/png';
	                        style['size'] = 32;
	                        style['offsetY'] = -16;
	                        style['userLabel'] = false;
	                        style.labelOption = {
	                            labelName: 'COL05',
	                            labelColor: '#000000',
	                            labelOpacity: 1,
	                            geometryName: 'geometry',
	                            fontFamily: 'NanumGothic',
	                            fontSize: '13',
	                            fontStyle: 'normal',
	                            fontWeight: 'bold',
	                            ancX: 0.5,
	                            ancY: 1.0,
	                            dspX: 0.0,
	                            dspY: -5,
	                            rotation: 0,
	                            haloRadius: 5,
	                            haloFill: '#ffffff',
	                            haloOpacity: 1
	                        };
	                        omsMain.setStyle('mark', no, style);
	                        layer['name'] = 'top1Seg';
	                        layer['exfilter'] = " AND C.TOP1_SEG = 'Mr. Diligent (YA)'";
	                        layer['regionFilter'] = "";
	                        layer['importantFilter'] = " AND C.TOP1_SEG = 'Mr. Diligent (YA)'";
	                        layer['infoPop'] = infoPop;
	                        layer['useInfoPop'] = true;
	                        layer['zIndex'] = 200;
	                        layer['noCache'] = false;

	                    } else if (j === 4) {
	                        var layer = omsMain.getLayer(no);
	                        var style = omsMain.getStyle('mark', no);
	                        style['url'] = jtiConfig['imgUrl'] + '/omsc/jti/images/ico_poi_s2.png';
	                        style['format'] = 'image/png';
	                        style['size'] = 32;
	                        style['offsetY'] = -16;
	                        style['userLabel'] = false;
	                        style.labelOption = {
	                            labelName: 'COL05',
	                            labelColor: '#000000',
	                            labelOpacity: 1,
	                            geometryName: 'geometry',
	                            fontFamily: 'NanumGothic',
	                            fontSize: '13',
	                            fontStyle: 'normal',
	                            fontWeight: 'bold',
	                            ancX: 0.5,
	                            ancY: 1.0,
	                            dspX: 0.0,
	                            dspY: -5,
	                            rotation: 0,
	                            haloRadius: 5,
	                            haloFill: '#ffffff',
	                            haloOpacity: 1
	                        };
	                        omsMain.setStyle('mark', no, style);
	                        layer['name'] = 'top1Seg';
	                        layer['exfilter'] = " AND C.TOP1_SEG = 'Mr. Diligent (OA)'";
	                        layer['regionFilter'] = "";
	                        layer['importantFilter'] = " AND C.TOP1_SEG = 'Mr. Diligent (OA)'";
	                        layer['infoPop'] = infoPop;
	                        layer['useInfoPop'] = true;
	                        layer['zIndex'] = 200;
	                        layer['noCache'] = false;
	                        
	                    } else if (j === 5) {
	                        var layer = omsMain.getLayer(no);
	                        var style = omsMain.getStyle('mark', no);
	                        style['url'] = jtiConfig['imgUrl'] + '/omsc/jti/images/ico_poi_s3.png';
	                        style['format'] = 'image/png';
	                        style['size'] = 32;
	                        style['offsetY'] = -16;
	                        style['userLabel'] = false;
	                        style.labelOption = {
	                            labelName: 'COL05',
	                            labelColor: '#000000',
	                            labelOpacity: 1,
	                            geometryName: 'geometry',
	                            fontFamily: 'NanumGothic',
	                            fontSize: '13',
	                            fontStyle: 'normal',
	                            fontWeight: 'bold',
	                            ancX: 0.5,
	                            ancY: 1.0,
	                            dspX: 0.0,
	                            dspY: -5,
	                            rotation: 0,
	                            haloRadius: 5,
	                            haloFill: '#ffffff',
	                            haloOpacity: 1
	                        };
	                        omsMain.setStyle('mark', no, style);
	                        layer['name'] = 'top1Seg';
	                        layer['exfilter'] = " AND C.TOP1_SEG = 'Passionate Achiever'";
	                        layer['regionFilter'] = "";
	                        layer['importantFilter'] = " AND C.TOP1_SEG = 'Passionate Achiever'";
	                        layer['infoPop'] = infoPop;
	                        layer['useInfoPop'] = true;
	                        layer['zIndex'] = 200;
	                        layer['noCache'] = false;

	                    } else if (j === 6) {
	                        var layer = omsMain.getLayer(no);
	                        var style = omsMain.getStyle('mark', no);
	                        style['url'] = jtiConfig['imgUrl'] + '/omsc/jti/images/ico_poi_s4.png';
	                        style['format'] = 'image/png';
	                        style['size'] = 32;
	                        style['offsetY'] = -16;
	                        style['userLabel'] = false;
	                        style.labelOption = {
	                            labelName: 'COL05',
	                            labelColor: '#000000',
	                            labelOpacity: 1,
	                            geometryName: 'geometry',
	                            fontFamily: 'NanumGothic',
	                            fontSize: '13',
	                            fontStyle: 'normal',
	                            fontWeight: 'bold',
	                            ancX: 0.5,
	                            ancY: 1.0,
	                            dspX: 0.0,
	                            dspY: -5,
	                            rotation: 0,
	                            haloRadius: 5,
	                            haloFill: '#ffffff',
	                            haloOpacity: 1
	                        };
	                        omsMain.setStyle('mark', no, style);
	                        layer['name'] = 'top1Seg';
	                        layer['exfilter'] = " AND C.TOP1_SEG = 'Free Spirit (YA)'";
	                        layer['regionFilter'] = "";
	                        layer['importantFilter'] = " AND C.TOP1_SEG = 'Free Spirit (YA)'";
	                        layer['infoPop'] = infoPop;
	                        layer['useInfoPop'] = true;
	                        layer['zIndex'] = 200;
	                        layer['noCache'] = false;

	                    } else if (j === 7) {
	                        var layer = omsMain.getLayer(no);
	                        var style = omsMain.getStyle('mark', no);
	                        style['url'] = jtiConfig['imgUrl'] + '/omsc/jti/images/ico_poi_s5.png';
	                        style['format'] = 'image/png';
	                        style['size'] = 32;
	                        style['offsetY'] = -16;
	                        style['userLabel'] = false;
	                        style.labelOption = {
	                            labelName: 'COL05',
	                            labelColor: '#000000',
	                            labelOpacity: 1,
	                            geometryName: 'geometry',
	                            fontFamily: 'NanumGothic',
	                            fontSize: '13',
	                            fontStyle: 'normal',
	                            fontWeight: 'bold',
	                            ancX: 0.5,
	                            ancY: 1.0,
	                            dspX: 0.0,
	                            dspY: -5,
	                            rotation: 0,
	                            haloRadius: 5,
	                            haloFill: '#ffffff',
	                            haloOpacity: 1
	                        };
	                        omsMain.setStyle('mark', no, style);
	                        layer['name'] = 'top1Seg';
	                        layer['exfilter'] = " AND C.TOP1_SEG = 'Free Spirit (OA)'";
	                        layer['regionFilter'] = "";
	                        layer['importantFilter'] = " AND C.TOP1_SEG = 'Free Spirit (OA)'";
	                        layer['infoPop'] = infoPop;
	                        layer['useInfoPop'] = true;
	                        layer['zIndex'] = 200;
	                        layer['noCache'] = false;

	                    } else if (j === 8) {
	                        var layer = omsMain.getLayer(no);
	                        var style = omsMain.getStyle('mark', no);
	                        style['url'] = jtiConfig['imgUrl'] + '/omsc/jti/images/ico_poi_s6.png';
	                        style['format'] = 'image/png';
	                        style['size'] = 32;
	                        style['offsetY'] = -16;
	                        style['userLabel'] = false;
	                        style.labelOption = {
	                            labelName: 'COL05',
	                            labelColor: '#000000',
	                            labelOpacity: 1,
	                            geometryName: 'geometry',
	                            fontFamily: 'NanumGothic',
	                            fontSize: '13',
	                            fontStyle: 'normal',
	                            fontWeight: 'bold',
	                            ancX: 0.5,
	                            ancY: 1.0,
	                            dspX: 0.0,
	                            dspY: -5,
	                            rotation: 0,
	                            haloRadius: 5,
	                            haloFill: '#ffffff',
	                            haloOpacity: 1
	                        };
	                        omsMain.setStyle('mark', no, style);
	                        layer['name'] = 'top1Seg';
	                        layer['exfilter'] = " AND C.TOP1_SEG = 'Ajae Nextdoor'";
	                        layer['regionFilter'] = "";
	                        layer['importantFilter'] = " AND C.TOP1_SEG = 'Ajae Nextdoor'";
	                        layer['infoPop'] = infoPop;
	                        layer['useInfoPop'] = true;
	                        layer['zIndex'] = 200;
	                        layer['noCache'] = false;

	                    } else if (j === 9) {
	                        var layer = omsMain.getLayer(no);
	                        var style = omsMain.getStyle('mark', no);
	                        style['url'] = jtiConfig['imgUrl'] + '/omsc/jti/images/ico_poi_s7.png';
	                        style['format'] = 'image/png';
	                        style['size'] = 32;
	                        style['offsetY'] = -16;
	                        style['userLabel'] = false;
	                        style.labelOption = {
	                            labelName: 'COL05',
	                            labelColor: '#000000',
	                            labelOpacity: 1,
	                            geometryName: 'geometry',
	                            fontFamily: 'NanumGothic',
	                            fontSize: '13',
	                            fontStyle: 'normal',
	                            fontWeight: 'bold',
	                            ancX: 0.5,
	                            ancY: 1.0,
	                            dspX: 0.0,
	                            dspY: -5,
	                            rotation: 0,
	                            haloRadius: 5,
	                            haloFill: '#ffffff',
	                            haloOpacity: 1
	                        };
	                        omsMain.setStyle('mark', no, style);
	                        layer['name'] = 'top1Seg';
	                        layer['exfilter'] = " AND C.TOP1_SEG = 'Golden Ajae'";
	                        layer['regionFilter'] = "";
	                        layer['importantFilter'] = " AND C.TOP1_SEG = 'Golden Ajae'";
	                        layer['infoPop'] = infoPop;
	                        layer['useInfoPop'] = true;
	                        layer['zIndex'] = 200;
	                        layer['noCache'] = false;
	                    } else if (j === 10) {
	                        var layer = omsMain.getLayer(no);
	                        var style = omsMain.getStyle('mark', no);
	                        style['url'] = jtiConfig['imgUrl'] + '/omsc/jti/images/ico_poi_s1.png';
	                        style['format'] = 'image/png';
	                        style['size'] = 32;
	                        style['offsetY'] = -16;
	                        style['userLabel'] = false;
	                        style.labelOption = {
	                            labelName: 'COL05',
	                            labelColor: '#000000',
	                            labelOpacity: 1,
	                            geometryName: 'geometry',
	                            fontFamily: 'NanumGothic',
	                            fontSize: '13',
	                            fontStyle: 'normal',
	                            fontWeight: 'bold',
	                            ancX: 0.5,
	                            ancY: 1.0,
	                            dspX: 0.0,
	                            dspY: -5,
	                            rotation: 0,
	                            haloRadius: 5,
	                            haloFill: '#ffffff',
	                            haloOpacity: 1
	                        };
	                        omsMain.setStyle('mark', no, style);
	                        layer['name'] = 'top2Seg';
	                        layer['exfilter'] = " AND C.TOP2_SEG = 'Mr. Diligent (YA)'";
	                        layer['regionFilter'] = "";
	                        layer['importantFilter'] = " AND C.TOP2_SEG = 'Mr. Diligent (YA)'";
	                        layer['infoPop'] = infoPop;
	                        layer['useInfoPop'] = true;
	                        layer['zIndex'] = 200;
	                        layer['noCache'] = false;

	                    } else if (j === 11) {
	                        var layer = omsMain.getLayer(no);
	                        var style = omsMain.getStyle('mark', no);
	                        style['url'] = jtiConfig['imgUrl'] + '/omsc/jti/images/ico_poi_s2.png';
	                        style['format'] = 'image/png';
	                        style['size'] = 32;
	                        style['offsetY'] = -16;
	                        style['userLabel'] = false;
	                        style.labelOption = {
	                            labelName: 'COL05',
	                            labelColor: '#000000',
	                            labelOpacity: 1,
	                            geometryName: 'geometry',
	                            fontFamily: 'NanumGothic',
	                            fontSize: '13',
	                            fontStyle: 'normal',
	                            fontWeight: 'bold',
	                            ancX: 0.5,
	                            ancY: 1.0,
	                            dspX: 0.0,
	                            dspY: -5,
	                            rotation: 0,
	                            haloRadius: 5,
	                            haloFill: '#ffffff',
	                            haloOpacity: 1
	                        };
	                        omsMain.setStyle('mark', no, style);
	                        layer['name'] = 'top2Seg';
	                        layer['exfilter'] = " AND C.TOP2_SEG = 'Mr. Diligent (OA)'";
	                        layer['regionFilter'] = "";
	                        layer['importantFilter'] = " AND C.TOP2_SEG = 'Mr. Diligent (OA)'";
	                        layer['infoPop'] = infoPop;
	                        layer['useInfoPop'] = true;
	                        layer['zIndex'] = 200;
	                        layer['noCache'] = false;
	                        
	                    } else if (j === 12) {
	                        var layer = omsMain.getLayer(no);
	                        var style = omsMain.getStyle('mark', no);
	                        style['url'] = jtiConfig['imgUrl'] + '/omsc/jti/images/ico_poi_s3.png';
	                        style['format'] = 'image/png';
	                        style['size'] = 32;
	                        style['offsetY'] = -16;
	                        style['userLabel'] = false;
	                        style.labelOption = {
	                            labelName: 'COL05',
	                            labelColor: '#000000',
	                            labelOpacity: 1,
	                            geometryName: 'geometry',
	                            fontFamily: 'NanumGothic',
	                            fontSize: '13',
	                            fontStyle: 'normal',
	                            fontWeight: 'bold',
	                            ancX: 0.5,
	                            ancY: 1.0,
	                            dspX: 0.0,
	                            dspY: -5,
	                            rotation: 0,
	                            haloRadius: 5,
	                            haloFill: '#ffffff',
	                            haloOpacity: 1
	                        };
	                        omsMain.setStyle('mark', no, style);
	                        layer['name'] = 'top2Seg';
	                        layer['exfilter'] = " AND C.TOP2_SEG = 'Passionate Achiever'";
	                        layer['regionFilter'] = "";
	                        layer['importantFilter'] = " AND C.TOP2_SEG = 'Passionate Achiever'";
	                        layer['infoPop'] = infoPop;
	                        layer['useInfoPop'] = true;
	                        layer['zIndex'] = 200;
	                        layer['noCache'] = false;

	                    } else if (j === 13) {
	                        var layer = omsMain.getLayer(no);
	                        var style = omsMain.getStyle('mark', no);
	                        style['url'] = jtiConfig['imgUrl'] + '/omsc/jti/images/ico_poi_s4.png';
	                        style['format'] = 'image/png';
	                        style['size'] = 32;
	                        style['offsetY'] = -16;
	                        style['userLabel'] = false;
	                        style.labelOption = {
	                            labelName: 'COL05',
	                            labelColor: '#000000',
	                            labelOpacity: 1,
	                            geometryName: 'geometry',
	                            fontFamily: 'NanumGothic',
	                            fontSize: '13',
	                            fontStyle: 'normal',
	                            fontWeight: 'bold',
	                            ancX: 0.5,
	                            ancY: 1.0,
	                            dspX: 0.0,
	                            dspY: -5,
	                            rotation: 0,
	                            haloRadius: 5,
	                            haloFill: '#ffffff',
	                            haloOpacity: 1
	                        };
	                        omsMain.setStyle('mark', no, style);
	                        layer['name'] = 'top2Seg';
	                        layer['exfilter'] = " AND C.TOP2_SEG = 'Free Spirit (YA)'";
	                        layer['regionFilter'] = "";
	                        layer['importantFilter'] = " AND C.TOP2_SEG = 'Free Spirit (YA)'";
	                        layer['infoPop'] = infoPop;
	                        layer['useInfoPop'] = true;
	                        layer['zIndex'] = 200;
	                        layer['noCache'] = false;

	                    } else if (j === 14) {
	                        var layer = omsMain.getLayer(no);
	                        var style = omsMain.getStyle('mark', no);
	                        style['url'] = jtiConfig['imgUrl'] + '/omsc/jti/images/ico_poi_s5.png';
	                        style['format'] = 'image/png';
	                        style['size'] = 32;
	                        style['offsetY'] = -16;
	                        style['userLabel'] = false;
	                        style.labelOption = {
	                            labelName: 'COL05',
	                            labelColor: '#000000',
	                            labelOpacity: 1,
	                            geometryName: 'geometry',
	                            fontFamily: 'NanumGothic',
	                            fontSize: '13',
	                            fontStyle: 'normal',
	                            fontWeight: 'bold',
	                            ancX: 0.5,
	                            ancY: 1.0,
	                            dspX: 0.0,
	                            dspY: -5,
	                            rotation: 0,
	                            haloRadius: 5,
	                            haloFill: '#ffffff',
	                            haloOpacity: 1
	                        };
	                        omsMain.setStyle('mark', no, style);
	                        layer['name'] = 'top2Seg';
	                        layer['exfilter'] = " AND C.TOP2_SEG = 'Free Spirit (OA)'";
	                        layer['regionFilter'] = "";
	                        layer['importantFilter'] = " AND C.TOP2_SEG = 'Free Spirit (OA)'";
	                        layer['infoPop'] = infoPop;
	                        layer['useInfoPop'] = true;
	                        layer['zIndex'] = 200;
	                        layer['noCache'] = false;

	                    } else if (j === 15) {
	                        var layer = omsMain.getLayer(no);
	                        var style = omsMain.getStyle('mark', no);
	                        style['url'] = jtiConfig['imgUrl'] + '/omsc/jti/images/ico_poi_s6.png';
	                        style['format'] = 'image/png';
	                        style['size'] = 32;
	                        style['offsetY'] = -16;
	                        style['userLabel'] = false;
	                        style.labelOption = {
	                            labelName: 'COL05',
	                            labelColor: '#000000',
	                            labelOpacity: 1,
	                            geometryName: 'geometry',
	                            fontFamily: 'NanumGothic',
	                            fontSize: '13',
	                            fontStyle: 'normal',
	                            fontWeight: 'bold',
	                            ancX: 0.5,
	                            ancY: 1.0,
	                            dspX: 0.0,
	                            dspY: -5,
	                            rotation: 0,
	                            haloRadius: 5,
	                            haloFill: '#ffffff',
	                            haloOpacity: 1
	                        };
	                        omsMain.setStyle('mark', no, style);
	                        layer['name'] = 'top2Seg';
	                        layer['exfilter'] = " AND C.TOP2_SEG = 'Ajae Nextdoor'";
	                        layer['regionFilter'] = "";
	                        layer['importantFilter'] = " AND C.TOP2_SEG = 'Ajae Nextdoor'";
	                        layer['infoPop'] = infoPop;
	                        layer['useInfoPop'] = true;
	                        layer['zIndex'] = 200;
	                        layer['noCache'] = false;

	                    } else if (j === 16) {
	                        var layer = omsMain.getLayer(no);
	                        var style = omsMain.getStyle('mark', no);
	                        style['url'] = jtiConfig['imgUrl'] + '/omsc/jti/images/ico_poi_s7.png';
	                        style['format'] = 'image/png';
	                        style['size'] = 32;
	                        style['offsetY'] = -16;
	                        style['userLabel'] = false;
	                        style.labelOption = {
	                            labelName: 'COL05',
	                            labelColor: '#000000',
	                            labelOpacity: 1,
	                            geometryName: 'geometry',
	                            fontFamily: 'NanumGothic',
	                            fontSize: '13',
	                            fontStyle: 'normal',
	                            fontWeight: 'bold',
	                            ancX: 0.5,
	                            ancY: 1.0,
	                            dspX: 0.0,
	                            dspY: -5,
	                            rotation: 0,
	                            haloRadius: 5,
	                            haloFill: '#ffffff',
	                            haloOpacity: 1
	                        };
	                        omsMain.setStyle('mark', no, style);
	                        layer['name'] = 'top2Seg';
	                        layer['exfilter'] = " AND C.TOP2_SEG = 'Golden Ajae'";
	                        layer['regionFilter'] = "";
	                        layer['importantFilter'] = " AND C.TOP2_SEG = 'Golden Ajae'";
	                        layer['infoPop'] = infoPop;
	                        layer['useInfoPop'] = true;
	                        layer['zIndex'] = 200;
	                        layer['noCache'] = false;
	                    }
	                });
	        }
	    });
	}
}
