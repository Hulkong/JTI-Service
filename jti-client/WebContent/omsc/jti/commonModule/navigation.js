/**
 * 왼쪽 네비게이션
 */
var navigation = {
    
    jq: undefined,

    init: function() {

        var that = this;

        that.jq = $('#navigation');

        if($('#userSeq').val() === 'null') {
        	that.jq.find('li[nm="filterBox"]').hide();
        	that.jq.find('li[nm="dataView"]').hide();
        };
        
        that.jq.find('li').click(function() {
            $('.leaflet-popup').hide();
            $('section').hide();
            var division = $(this).attr('nm');
                
            if($(this).hasClass('on')) {
                that.jq.find('li.on').removeClass('on');

                if(division === 'dataView') {
                    omsMain[division].close();
                    omsMain.controlBar.jq.find('#top1SegLegend').css('right', '15px');
                } else {
                    $('#' + division).parent().hide("slide", { direction: "left" }, 300);
                    $('#' + division).hide("slide", { direction: "left" }, 300);
                }
            } else {
            	if(omsMain[division]) {
            		that.jq.find('li.on').removeClass('on');
            		$(this).addClass('on');
            		
            		$('#' + division).parent().show("slide", { direction: "left" }, 300);
            		
            		if(division === 'dataView') {
            			omsMain[division].open();
            			omsMain.controlBar.jq.find('#top1SegLegend').css('right', '311px');
            			omsMain.controlBar.jq.find('li.jti').addClass('on');
            			
            			omsMain.controlBar.drawJtiAccountCodeLayer();            			
            			var jtiStoreNo = omsMain.getLayerNoByName('jti.jtiStore');
//            			if(jtiStoreNo) {
//            				var layer = omsMain.getLayer(jtiStoreNo);
//            				omsMain[division].drawLayer(layer['exfilter']);
//            				omsMain[division].loadData(null, layer['exfilter']);
//            			}
            			
            		} else if(division === 'filterBox') {
            			omsMain[division].open();
            			omsMain.controlBar.jq.find('li.jti').addClass('on');
            			omsMain.controlBar.jq.find('li.label').removeClass('on');
            			
            			omsMain[division].jq.find('.filter_result_list > li').removeClass('on');
            			var filter = omsMain[division].jq.find('.filter_result_list > li').eq(0).addClass('on').attr('filter');
            			var geoms = omsMain[division].jq.find('.filter_result_list > li').eq(0).addClass('on').attr('geoms');
            			
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
						}
            			
            			omsMain[division].drawLayer(filter);
            			if(omsMain.dataView) {
            				omsMain.dataView.jq.parent().show();
//            				omsMain.dataView.open();
//            				omsMain.dataView.loadData(null, filter);
            			}
            			
            			
            			
            		} else {
            			$('#' + division).show("slide", { direction: "left" }, 300);
            		}
            	}
            }
        });
    }
};

omsMain['navigation'] = navigation;
omsMain['navigation'].init();