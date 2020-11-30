/**
 * @description nearbyBusinesses 컴포넌트
 */
var nearbyBusinesses = {

    jq: undefined,   // selector jquery 객체
    
    otherPoi: {},
    
    imgUrl: {
        DM0003021001: jtiConfig['imgUrl'] + '/omsc/jti/images/ico_game.png',
        DM0003021008: jtiConfig['imgUrl'] + '/omsc/jti/images/ico_acc.png',
        DM0003021002: jtiConfig['imgUrl'] + '/omsc/jti/images/ico_game.png',
        DM0003021005: jtiConfig['imgUrl'] + '/omsc/jti/images/ico_bath.png',
        DM0003021003: jtiConfig['imgUrl'] + '/omsc/jti/images/ico_singingroom.png',
        DM0003021010: jtiConfig['imgUrl'] + '/omsc/jti/images/ico_sleep.png',
        DM0003021004: jtiConfig['imgUrl'] + '/omsc/jti/images/ico_movie.png',
        DM0003021009: jtiConfig['imgUrl'] + '/omsc/jti/images/ico_drink.png',
        DM0003021011: jtiConfig['imgUrl'] + '/omsc/jti/images/ico_food.png',
        DM0003021007: jtiConfig['imgUrl'] + '/omsc/jti/images/ico_cloth.png',
        DM0003021006: jtiConfig['imgUrl'] + '/omsc/jti/images/ico_mart.png',
        DM0003021012: jtiConfig['imgUrl'] + '/omsc/jti/images/ico_edu.png'
    },
    
    /**
     * @description 컴포넌트 초기화 메소드 
     */
    init: function () {
    	
        var that = this;
        
        that.jq = $('#nearbyBusinesses');   // 이 검포넌트의 Root 선택자
        that.getSelfmapPoiData();

        that.jq.find('.btn_close').click(function () {
            that.close();
        });
    },

    close: function() {
        var that = this;
        omsMain.navigation.jq.find('[nm="nearbyBusinesses"]').removeClass('on');
        that.jq.hide("slide", { direction: "left" }, 300);
    },

    addLayerData: function(data) {
        var that = this;
        data.forEach(function (d, i) {
            omsMain.addLayerData('selfmap.service.poi', false, function (result) {
                var layerNo = omsMain.getLayerNoByName('selfmap.service.poi');
                if(layerNo['length'] === data['length']) {
                    var cnt = 0;
                    $.each(that.imgUrl, function(key, img) {
                        
                        var layer = omsMain.getLayer(layerNo[cnt]);
                        var style = omsMain.getStyle('mark', layerNo[cnt]);
                        style['url'] = img
                        style['format'] = 'image/png';
                        style['size'] = 32;
                        style['offsetY'] = -16;
                        style['userLabel'] = false;
                        style.labelOption = {
                            labelName: 'NAME',
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
                        
                        omsMain.setStyle('mark', layerNo[cnt], style);
                        layer['name'] = key
                        layer.exparam = {id: key};
                        layer['zIndex'] = 30;
                        layer['noCache'] = false;
                        cnt++;
                    });
                }
            });
        });
    },

    makeData:function (data) {
        var layerData = [];
        data.forEach(function(d, i) {
            var obj = {
                id: d['id'],

            }
        });
    },

    getSelfmapPoiData: function () {
        var that = this;
        var params = {
            sqlId: 'selfmap.service.groupItemList-poi',
            _array: 'smbp-store',
            groupSeq: '0,600',
        };

        $.ajax({
            url: jtiConfig['mapserverUrl'] + '/data/mapper.json',
            data: params,
            type: 'GET',
            success: function (result, status, xhr) {

                if (!result) {
                    alert('데이터가 없습니다!');
                    return;
                }

                that.addLayerData(result);

                var div = '';
                result.forEach(function (d, i) {
                    if (i === 0) {
                        div = '<div class="category facility_cont_category title"';
                        div += ' category="' + d['category'] + '">' + d['category'];
                        div += '</div>';
                    }

                    div += '<div class="item facility_cont_row"';
                    div += ' index="' + i + '"';
                    div += ' id="' + d['id'] + '"';
                    div += ' category="' + d['category'] + '">';
                    div += d['name'];
                    div += '</div>';
                });

                that.jq.find('.facility_cont > .category').eq(0).append(div);

                that.jq.find('.facility_cont_row').click(function () {

                    $(this).toggleClass('selected');
                    var id = $(this).attr('id');
                    var layerNo = omsMain.getLayerNoByName(id);

                    if(!layerNo) {
                        alert('레이어가 아직 생성되지 않았습니다!');
                        $(this).removeClass('selected');
                        return;
                    }

                    if($(this).hasClass('selected')) {

                        // 레이어가 이미 한번 그려졌을 때
                        if(omsMain.selfmap.hasLayer(layerNo)) {
                            omsMain.selfmap.showLayer(layerNo);   // 레이어를 다시그림
                        } else {
                            omsMain.selfmap.wmsDrawLayer(layerNo); 
                        }

                        omsMain.controlBar.jq.find('li.nearbyBusinesses').addClass('on');
                    } else {
                        omsMain.selfmap.removeLayer(layerNo);

                        if(that.jq.find('.facility_cont_row.selected').length === 0) {
                            omsMain.controlBar.jq.find('li.nearbyBusinesses').removeClass('on');
                        }
                    }
                });

                that.getJTIPoi();
            },

            error: function (e) { }
        });
    },

    getJTIPoi: function () {
        var that = this;

        $.ajax(jtiConfig['mapserverUrl'] + '/data/mapper.json', {
            data: {
                sqlId: 'jti.selectJtiGroupPoi'
            },
            success: function (result, status) {

                if (!result) {
                    alert('데이터가 없습니다!');
                    return;
                }

                var div = '';
                result.forEach(function (d, i) {
                    if (i === 0) {
                        div += '<div class="category">';
                        div += '<div class="category facility_cont_category title" category="others">JTI</div>';
                        div += '</div>';
                    }

                    div += '<div class="row_pos">';
                    div += '<div class="item facility_cont_row" id="' + d['outletType'] + '"';
                    div += ' category ="others">' + d['outletType'];
                    div += '</div>';
                    div += '<a href="###" class="addPOI btn_add" id="' + d['outletType'] + '">추가</a>';
                    div += '</div>';
                });

                that.jq.find('.facility_cont > .category').eq(1).append(div);

                that.jq.find('.facility_cont_row[category="others"]').click(function () {
                    $(this).toggleClass('selected');

                    var id = $(this).attr('id');
                    if($(this).hasClass('selected')) {
                    	
                        that.jtiPoiDraw(id);
                    } else {
                        that.otherPoi[id].forEach(function(mid) {
                            omsMain.selfmap.instance.removeLabeledMarker(mid);
                        });
                    }
                    
                });

                that.jq.find('.addPOI').click(function (event) {
                    omsMain.nearbyBusinessesNewPoi.open();
                    omsMain.nearbyBusinessesNewPoi.insertUI($(this).attr('id'));
                });
            },
            error: function (result, status, error) {
                //console.log(status);
                //console.log(error);
//                alert('에러');
            },
            method: 'post'
        });
    }, 
    
    mkConfig: function(markerId, markerlabel ,dragFlag, markerKind) {
	
        var popupContent = "<div class='spop_wrap'>";
           popupContent += "<div class='addPoi_spop1 spop_title' >"+markerlabel+"</div>";
           popupContent += "<div class='addPoi_spop2 spop_update' data-markerid='"+markerId+"' onclick='javascript:omsMain.nearbyBusinessesNewPoi.makerUpdateHandler(this,"+dragFlag+");'>수정</div>";
           popupContent += "<div class='addPoi_spop2 spop_delete' data-markerlabel='"+markerlabel+"' data-markerid='"+markerId+"' onclick='javascript:omsMain.nearbyBusinessesNewPoi.deleteCheck(this,"+dragFlag+");'>삭제</div>";
           popupContent += "</div>";	
   
       if(markerKind === undefined){
           markerKind = "";
       }
       
       return {
           iconUrl : jtiConfig['imgUrl'] + "/omsc/jti/images/point_a_"+markerKind+".png", 
           label : '<span class="maker-span hidden">'+markerlabel+'</span>', //null일경우 글자 안나옴
           id :markerId , 
           icondrag : dragFlag,
           popupAnchor: [-1, -1],
           popupContent:popupContent,
           prop : {"prop1":"label"},
           callbacks : {
               "mouseover":function(evt){
               },
               "dragend":function(evt){
               },
               "mouseout":function(evt){
                   if(evt.type == 'mouseover'){
                       $(evt.target._icon).find(".maker-span").show();
                   }else if(evt.type == 'mouseout'){
                       $(evt.target._icon).find(".maker-span").hide();
                   }else if(evt.type == 'dragend'){
                       var  latlng = evt.target._latlng;
                       var tlatlng = omsMain.selfmap.instance.impObj.tranform([latlng.lng,latlng.lat],'EPSG:4326','katec');
                       markerDragEndHandler(tlatlng , evt.target._id);
                   }
               }
           }
       };
   },

    jtiPoiDraw: function (id) {
        var that = this;
        $.ajax(jtiConfig['mapserverUrl'] + '/data/mapper/dynamic.json', {
            method: 'POST',
            data: {
                sqlId: 'jti.selectJtiPoi',
                outletType: id
            },
            success: function (result, status) {

            	if(that.otherPoi[id] && that.otherPoi[id].length > 0) {
            		that.otherPoi[id].forEach(function(mid) {
            			omsMain.selfmap.instance.removeLabeledMarker(mid);
            		});
            	}
                
                var otherPoiNo = [];
                
                result.selectJtiPoi.forEach(function (item) {
                    otherPoiNo.push(item.no);
                    omsMain.selfmap.instance.addLabeledMarker(
                        [item.xAxis, item.yAxis], 
                        'katec', 
                        that.mkConfig(item.no, item.outletName, false, id)
                    );
                });
                
                that.otherPoi[id] = otherPoiNo;
            },
            error: function (result, status, error) {
                //console.log(status);
                //console.log(error);
                return;
            }
        });
    },

    drawLayer: function () {
        omsMain.controlBar.jq.find('.nearbyBusinesses').addClass('on');
    },

    hideLayer: function () {
        omsMain.controlBar.jq.find('.nearbyBusinesses').removeClass('on');
    }
};
omsMain['nearbyBusinesses'] = nearbyBusinesses;
nearbyBusinesses.init();