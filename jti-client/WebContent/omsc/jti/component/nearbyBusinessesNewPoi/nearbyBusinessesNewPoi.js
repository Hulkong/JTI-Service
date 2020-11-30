var nearbyBusinessesNewPoi = {

    jq: undefined,

    clickPoi: false,
    poi_type: undefined,
    addPoi_x: undefined,
    addPoi_y: undefined,
    poi_id: undefined,
    poi_mode: undefined,

    init: function () {
        var that = this;
        that.jq = $('#nearbyBusinessesNewPoi');

        that.jq.draggable();

        omsMain.selfmap.addClickFunction(function (event) {
            that.clickPoi = true;
            that.getPoiData(event.Katec);
        });

        // 상단 취소버튼 클릭
        that.jq.find('.apoi_cancel').click(function () {
            that.close();
        });

        //상단 확인 버튼 클릭
        that.jq.find('.apoi_ok').click(function () {

            if (!that.clickPoi) {
                alert("POI를 추가하실 지점을 지도에서 클릭해주세요.");
                return;
            }

            that.clickPoi = false;


            // sqlId: jti.insertJtiPoi
            // sqlMode: INSERT
            // poiNm: Pub
            // poiType: Pub
            // xAxis: 311113.4484656387
            // yAxis: 551084.7720718714


            $.ajax(jtiConfig['mapserverUrl'] + '/data/mapper.json', {
                data: {
                    sqlId: 'jti.insertJtiPoi',
                    sqlMode: 'INSERT',
                    poiNm: that.jq.find('[name="poiTitle"]').val(),
                    poiType: that['poi_type'],
                    xAxis: that.addPoi_x,
                    yAxis: that.addPoi_y

                },
                success: function (result, status) {
                    if (!result) {
                        alert('데이터 등록을 실패하였습니다!');
                        return;
                    }

                    alert('데이터 등록을 성공하였습니다!');

                    that.jq.hide();
                    omsMain.selfmap.instance.removeLabeledMarker(that.poi_id);
                    nearbyBusinesses.jtiPoiDraw(that['poi_type']);
                    nearbyBusinesses.jq.find('.item.facility_cont_row[id="' + that['poi_type'] + '"]').addClass('selected');
                },
                error: function (result, status, error) {
//                    alert('에러');
                },
                method: 'POST'
            });
        });

        //POI수정
        that.jq.find('.apoi_update').click(function () {
            var inputVal = that.jq.find('[name="poiTitle"]').val();
            var newLatlngs = [that.addPoi_x, that.addPoi_y];

            omsMain.selfmap.instance.removeLabeledMarker(that.poi_id);
            omsMain.selfmap.instance.addLabeledMarker(newLatlngs, 'katec', that.mkConfig(that.poi_id, inputVal, false));

            var poiComment = (that.poi_comment || "");

            // 업소이름이 변경됐을 경우
            if (poiComment.indexOf("업소") == -1 && that.addPoi_title != inputVal) {
                poiComment += "업소명변경,"
            }
            // 좌표가 변경됐을 경우
            if (poiComment.indexOf("좌표") == -1 && (that.update_ori_addPoi_x != that.addPoi_x || that.update_ori_addPoi_y != that.addPoi_y)) {
                poiComment += "좌표변경,"
            }

            $.ajax(jtiConfig['mapserverUrl'] + '/data/mapper.json', {
                data: {
                    sqlId: 'jti.updateJtiPoi',
                    sqlMode: 'UPDATE',
                    poiNm: that.jq.find('[name="poiTitle"]').val(),
                    poiType: that.poi_type,
                    xAxis: that.addPoi_x,
                    yAxis: that.addPoi_y,
                    poiComment: poiComment,
                    no: that.poi_id
                },
                success: function (result, status) {
                    if (result.result < 0) {
                        if (result.result == -10)
                            alert('오류');
                    } else {
                        alert('수정 성공');

                        omsMain.selfmap.instance.removeLabeledMarker(that['poi_id']);
                        nearbyBusinesses.jtiPoiDraw(that['poi_type']);
                        nearbyBusinesses.jq.find('.item.facility_cont_row[id="' + that['poi_type'] + '"]').addClass('selected');

                        that.addPoiOpen = 'off';
                        that.poi_ck = 'N';
                        that.addPoi_x = '';
                        that.addPoi_y = '';
                        that.addPoi_title = '';
                        that.poi_type = '';
                        that.jq.find('[name="poiTitle"]').val("");
                        that.jt.hide();
                    }
                },
                error: function (result, status, error) {
//                    alert('에러');
                },
                method: 'POST'
            });
            that.poi_ck = 'N';
        });

        $('.apoi_del').click(function () {
            var that = omsMain.nearbyBusinessesNewPoi;
            var markerId = $('.delete_id').val();

            // 삭제 쿼리
            $.ajax(jtiConfig['mapserverUrl'] + '/data/mapper.json', {
                data: {
                    sqlId: 'jti.deleteJtiPoi',
                    sqlMode: 'DELETE',
                    no: markerId
                },
                success: function (result, status) {
                    that.poi_id = '';
                    that.poi_ck = 'N';
                    that.addPoi_x = '';
                    that.addPoi_y = '';
                    that.addPoi_title = '';
                    that.poi_type = '';
                    that.jq.find('[name="poiTitle"]').val("");
                    omsMain.selfmap.instance.removeLabeledMarker(markerId);
                    $('.deletePop').css("display", "none");
                    that.jq.hide();
                },
                error: function (result, status, error) {
//                    alert('에러');
                },
                method: 'POST'
            });
        });
    },

    makerUpdateHandler: function (obj, dragFlag) {
        var that = this;
        that.poi_mode = "U";
        var markerId = $(obj).attr("data-markerid");
        if (dragFlag) {
            return;
        }

        //	수정할 상점의 정보가져오기
        $.ajax(jtiConfig['mapserverUrl'] + '/data/mapper.json', {
            data: {
                sqlId: 'jti.selectJtiPoiInfo',
                sqlMode: 'SELECT_ONE',
                no: markerId
            },
            success: function (result, status) {

                that.jq.find(".change_tit").text("POI 수정하기");
                that.jq.find(".apoi_update").css("display", "");
                that.jq.find(".apoi_ok").css("display", "none");
                that.jq.find(".change_txt").html("‘" + result.outletType + "’의 POI를 수정합니다.<br />지도 상에서 원하는 위치로 드래그해주세요.");

                that.jq.show();
                that.jq.find('#addPoi').hide();
                that.jq.find('#deletePoi').hide();
                that.jq.find('#updatePoi').show();

                that.poi_id = result.no;
                that.poi_ck = 'U';
                that.addPoi_x = result.xAxis;
                that.addPoi_y = result.yAxis;
                that.update_ori_addPoi_x = result.xAxis;
                that.update_ori_addPoi_y = result.yAxis;
                that.addPoi_title = result.outletName;
                that.poi_comment = result.outletComment;
                that.poi_type = result.outletType;
                that.jq.find('[name="poiTitle"]').val(result.outletName);
                omsMain.selfmap.instance.removeLabeledMarker(result.no);
                omsMain.selfmap.instance.addLabeledMarker([result.xAxis, result.yAxis], 'katec', that.mkConfig(result.no, result.outletName, true));
            },
            error: function (result, status, error) {
//                alert('에러');
            },
            method: 'POST'
        });
    },

    deleteCheck: function (obj, dragFlag) {
        var that = this;
        that.poi_mode = "D"
        var markerId = $(obj).attr("data-markerid");
        var markerlabel = $(obj).attr("data-markerlabel");
        if (dragFlag) {
            return;
        }

        that.jq.show();
        that.jq.find('#addPoi').hide();
        that.jq.find('#updatePoi').hide();
        that.jq.find('#deletePoi').show();
        $(".delete_name").text(markerlabel);
        $(".delete_id").val(markerId);
        $(".deletePop").css("display", "");
    },

    //클릭위치에 포인트 생성
    getPoiData: function (latlngArr) {
        var that = this;

        if (!omsMain.nearbyBusinessesNewPoi.jq.is(':visible')) {
            return;
        }

        that.addPoi_x = latlngArr[0];
        that.addPoi_y = latlngArr[1];

        // 수정이 아닐 경우
        omsMain.selfmap.instance.addLabeledMarker(latlngArr,
            'katec',
            that.mkConfig(that.poi_id, "명칭을 입력하세요.!", true)
        );
    },

    mkConfig: function (markerId, markerlabel, dragFlag, markerKind) {

        var that = this;

        var popupContent = "<div class='spop_wrap'>";
        popupContent += "<div class='addPoi_spop1 spop_title' >" + markerlabel + "</div>";
        popupContent += "<div class='addPoi_spop2 spop_update' data-markerid='" + markerId + "' onclick='javascript:that.makerUpdateHandler(this," + dragFlag + ");'>수정</div>";
        popupContent += "<div class='addPoi_spop2 spop_delete' data-markerlabel='" + markerlabel + "' data-markerid='" + markerId + "' onclick='javascript:deleteCheck(this," + dragFlag + ");'>삭제</div>";
        popupContent += "</div>";

        if (markerKind === undefined) {
            markerKind = "";
        }

        return {
            iconUrl: location['origin'] + "/omsc/jti/images/point_a_" + markerKind + ".png",
            label: '<span class="maker-span hidden">' + markerlabel + '</span>', //null일경우 글자 안나옴
            id: markerId,
            icondrag: dragFlag,
            popupAnchor: [-1, -1],
            popupContent: popupContent,
            prop: { "prop1": "label" },
            callbacks: {
                "mouseover": function (evt) {
                },
                "dragend": function (evt) {
                },
                "mouseout": function (evt) {
                    if (evt.type == 'mouseover') {
                        $(evt.target._icon).find(".maker-span").show();
                    } else if (evt.type == 'mouseout') {
                        $(evt.target._icon).find(".maker-span").hide();
                    } else if (evt.type == 'dragend') {
                        var latlng = evt.target._latlng;
                        var tlatlng = omsMain.selfmap.instance.impObj.tranform([latlng.lng, latlng.lat], 'EPSG:4326', 'katec');
                        that.markerDragEndHandler(tlatlng, evt.target._id);
                    }
                }
            }
        };
    },

    markerDragEndHandler: function (xy) {
        var that = this;
        that.addPoi_x = xy[0];
        that.addPoi_y = xy[1];
    },

    open: function () {
        var that = this;
        that.jq.show();
        that.jq.find('#addPoi').hide();
        that.jq.find('#updatePoi').hide();
        that.jq.find('#deletePoi').hide();
    },

    close: function () {
        var that = this;
        that.jq.hide();
    },

    insertUI: function (id) {
        var that = this;
        // ajax로 대쉬보드 컨텐츠 로딩.
        that.jq.find(".change_txt").html("‘" + id + "’의 POI를 추가합니다.<br />지도 상에서 원하는 위치를 클릭해주세요.");
        that.jq.find('#addPoi').show();
        that.jq.find('.poiTitle').val(id);
        that.poi_mode = "I";
        that.poi_type = id;
        // poi_seq값으로 id를 생성
        $.ajax(jtiConfig['mapserverUrl'] + '/data/mapper.json', {
            method: 'POST',
            data: {
                sqlId: 'jti.selectJtiPoiSeq',
                sqlMode: 'SELECT_ONE'
            },
            success: function (result, status) {
                that['poi_id'] = result['no'];
            },
            error: function (result, status, error) {
//                alert('에러');
            }
        });
    },
};

omsMain['nearbyBusinessesNewPoi'] = nearbyBusinessesNewPoi;
nearbyBusinessesNewPoi.init();