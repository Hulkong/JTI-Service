var infoPop = {
    type: 'popup',
    open: function(data) {

        var allData = data["features"];
        if(allData.length < 1) {
        	return;
        }
        var dataL = allData[0].geometry.coordinates;
        var htmlJq;

        if(allData['length'] > 12) {
            alert('리스트가 12건이 초과하였습니다. 줌인하여 주세요.');
            return;
        }
        if(allData.length > 1){	// 중복매장일 경우
            // 중복매장 보여주기 html
            var dupItems = [];
            omsMain.config.dupItems = [];
            for(var i = 0 ; i < allData.length;i++){
                var title = '';
                if(allData[i].properties['COL07']) title = allData[i].properties['COL07'] +' '+ allData[i].properties['COL05'] + '(' + allData[i].properties['STORE_CD'] + ')';
                else title = allData[i].properties['COL05'] + '('+allData[i].properties['STORE_CD']+')';
                dupItems.push({title: title,data:allData[i].properties});
            }
            omsMain.config.dupItems = dupItems;
            htmlJq = $(infoPopHtml(allData,'overlap'));
            dupItems.forEach(function(item, index) {
                var tr = '<li data-index=' + index +'><a href="###">'+ item.title +'</a></li>';
                htmlJq.find('.duplication').append(tr);
            });
        }else{	// 중복이 아닐경우
            var  prop = data["features"][0].properties;
            htmlJq = $(infoPopHtml(prop, 'store'));
            // 기존 점포정보 html 보여주기
        }
        
        // 중복매장중 하나 클릭
        htmlJq.find('.duplication li').on('click', function(){
            var prop = omsMain.config.dupItems[$(this).attr('data-index')].data;
            htmlJq = $(infoPopHtml(prop, 'store'));
            popupEvent(prop, htmlJq);
            omsMain.selfmap.instance.infoPop([dataL[1],dataL[0]],htmlJq[0]);
        });
        
        popupEvent(prop, htmlJq);
        
        omsMain.selfmap.instance.infoPop([dataL[1],dataL[0]],htmlJq[0]);
    }
};

// 점포팝업 그리는 함수
var infoPopHtml = function(prop, delimiter) {
    var html;
    if(delimiter == 'store'){
        var commentList ="";
        //커멘트 리스트 가져오기
        $.ajax(jtiConfig['mapserverUrl'] + '/data/mapper.json', {
             data: { 
                 sqlId: 'jti.selectJtiCommentList',
                 storeCd: prop['STORE_CD'] 
             },
            success: function(result, status) {
                if(result.length > 0){
                    for(var i = 0 ; i < result.length; i++){
                        commentList += '<li class="'+result[i].commentSeq+'" >';
                        commentList += '<div class="group_top">';
                        commentList += '<span class="tit">'+result[i].usernm+'</span>';
                        commentList += '<span class="date">'+result[i].regDate+'</span>';
                        commentList += '</div>';
                        commentList += '<div class="group_con '+result[i].storeCd+'_'+result[i].commentSeq+'">';
                        if(result[i].imagePath !== undefined){
                            commentList += '<span class="thm imageDetail"><img src="'+result[i].imagePath+'" alt="" style="width:50px; height:30px;"/></span>';
                        }
                        commentList += '<span class="tit" comment-seq="'+result[i].commentSeq+'" comment-store="'+result[i].storeCd+'">'+result[i].commentContents.replace(/\n/gi,'<br/>')+'</span>';
                        commentList += '</div>';
                        commentList += '<ul class="group_btn">';
                        commentList += '<li><a href="#none" class="commentDetail" comment-seq="'+result[i].commentSeq+'" comment-store="'+result[i].storeCd+'" user-seq="'+result[i].userSeq+'">수정</a></li>';
                        commentList += '<li><a href="#none" class="comment_list_del" comment-seq="'+result[i].commentSeq+'" comment-store="'+result[i].storeCd+'" user-seq="'+result[i].userSeq+'">삭제</a></li>';
                        commentList += '</ul>';
                        commentList += '</li>';
                    }
                }else{
                    commentList += '<li class="firstComment">';
                    commentList += '커멘트를 입력해주세요.';
                    commentList += '</li>';
                }
                
                $('.list_comment').append(commentList);
                 
            },
            error: function(result, status, error) {
//					alert('에러');
                // comment list 값이 없을때 코딩 추가
                commentList += '<li class="firstComment">';
                commentList += '커멘트를 입력해주세요.';
                commentList += '</li>';
                
                $('.list_comment').append(commentList);
            },
            method: 'POST'
        });
        
        var jtiVolumn = (prop[omsMain.config.columnMap.jtiVolumn] || '0');
        if(typeof(jtiVolumn) != 'number'){ 
            if(jtiVolumn.indexOf(".") != -1)
                jtiVolumn = jtiVolumn.substr(0,jtiVolumn.indexOf("."));
                
            jtiVolumn = jtiVolumn.replace(/\,/gi,"");
            jtiVolumn = (Number(jtiVolumn) / 20).toFixed(2);
        }else{
            jtiVolumn = (jtiVolumn / 20).toFixed(2);
        }
        
        
        var idstVolumn = (prop[omsMain.config.columnMap.idstVolumn] || '0');
        if(typeof(idstVolumn) != 'number'){
            if(idstVolumn.indexOf(".") != -1)
                idstVolumn = idstVolumn.substr(0,idstVolumn.indexOf("."));
            
            idstVolumn = idstVolumn.replace(/\,/gi,"");
            idstVolumn = (Number(idstVolumn) / 20).toFixed(2);
        }else{
            idstVolumn = (idstVolumn / 20).toFixed(2);
        }
        
        
        var jtiFacing = (prop[omsMain.config.columnMap.jtiFacing] || '0');
        var batFacing = (prop[omsMain.config.columnMap.batFacing] || '0');
        var pmiFacing = (prop[omsMain.config.columnMap.pmiFacing] || '0');
        var ktgFacing = (prop[omsMain.config.columnMap.ktgFacing] || '0');
        var facShare = (prop[omsMain.config.columnMap.facShare] || '0');
        
        jtiFacing = (Number(jtiFacing) > 0) ? Number(jtiFacing).toFixed(2) : 0;
        batFacing = (Number(batFacing) > 0) ? Number(batFacing).toFixed(2) : 0;
        pmiFacing = (Number(pmiFacing) > 0) ? Number(pmiFacing).toFixed(2) : 0;
        ktgFacing = (Number(ktgFacing) > 0) ? Number(ktgFacing).toFixed(2) : 0;
        
        //var contract = (prop[omsMain.config.columnMap.contract] === undefined  ||  prop[omsMain.config.columnMap.contract].trim() == '') ? 'N' : 'Y';
        var contract = (prop[omsMain.config.columnMap.contract] === undefined ) ? 'N' : 'Y';
        
        if(prop["STORE_CD"].split('_')[0] === 'KA') {
            var storeCd = prop["STORE_CD"].split('_')[1].split('-')[0] + '_'
        } else {
            var storeCd = '';
        }

        html = 
            '<div class="store_infor_pop">\
                <div class="section_top"><div class="article_top"><h1 class="tit_main">' + storeCd + prop.COL05 +' ('+ prop["STORE_CD"] +')</h1></div></div>\
                <div class="article_store article_infor">\
                    <div class="group_top">\
                        <h2 class="tit">요약정보</h2>\
                        <div class="area_rgt"><a href="#none" class="store_tit">대시보드</a></div>\
                    </div>\
                    <div class="bx_scroll">\
                        <table>\
                            <tr><th>Parent Account</th><td>' + (prop.COL07 || "") + '</td></tr>\
                            <tr><th>Tier</th><td>' + prop[omsMain.config.columnMap.tier] + '</td></tr>\
                            <tr><th>주소</th><td>' + prop[omsMain.config.columnMap.address] +'</td></tr>\
                            <tr><th>JTI 평균 월 판매량 (팩)</th><td>' + jtiVolumn + '</td></tr>\
                            <tr><th>전체 월 판매량 (팩)</th><td>' + idstVolumn + '</td></tr>\
                            <tr><th>JTI off-take 점유율(%)</th><td>' + jtiFacing + '</td></tr>\
                            <tr><th>BAT off-take 점유율(%)</th><td>' + batFacing + '</td></tr>\
                            <tr><th>PMI off-take 점유율(%)</th><td>' + pmiFacing + '</td></tr>\
                            <tr><th>KT&G off-take 점유율(%)</th><td>' + ktgFacing + '</td></tr>\
                            <tr><th>Visibility 계약 유무</th><td>' + contract + '</td></tr>\
                            <tr><th>JTI Facing Share (%)</th><td>' + (facShare * 100).toFixed(2) + '</td></tr>\
                        </table>\
                    </div>\
                </div>\
                <div class="article_store article_comment">\
                    <div class="group_top"><h2 class="tit">커멘트</h2></div>\
                    <div class="bx_scroll">\
                        <ul class="list_comment"></ul>\
                    </div>\
                </div>\
                <div class="section_btm">\
                    <a href="#none" class="storeCommentPopOpen">커멘트 작성</a>\
                </div>\
            </div>';
    } else if(delimiter == 'overlap') {
        html = 
            '<div class="popUpInfo dup_info">' +
                // <!-- pop_header -->
                '<div class="pop_header">' +
                    '<h1 class="tit_main">중복매장 (' + prop.length + '개)</h1>' +
                '</div>' +
                // <!-- //pop_header -->
                
                // <!-- pop_contents -->
                '<div class="pop_conts" style="height:85%; overflow:auto">' +
                    '<ul class="list_store duplication"></ul>' +
                '</div>' +
                // <!-- //pop_contents -->
            '</div>';
    }
    return html;
};

// 점포팝업의 이벤트
var popupEvent = function(prop, htmlJq){
		
    // 대시보드 open
    htmlJq.find('.store_tit').on("click",  function(){
        // data-grid 닫기 ( 열려있으면 jti정보 탭 클릭안됌 )
        $('.knocker.close').click();
        var config = {
            blkCd : prop['BLK_CD'],
        };
        
        function loadJtiDashboard(params) {
            $.ajax(jtiConfig['mapserverUrl'] + '/data/mapper/dynamic.json', {
                data: { 
                    sqlId: 'jti.getJtiTrdSummary,jti.getJtiTrdFlpop,jti.getJtiTrdRspop,jti.getJtiTrdHous,jti.getJtiTrdActidx,jti.getJtiTrdStore',
                    blkCd: params.blkCd
                },
                success: function(result, status) {

                    omsMain.dashboard.open();
                    setSummary(result.getJtiTrdSummary[0]);
                    flowpopSexTimeChart(result.getJtiTrdFlpop[0]);
                    rspopChart(result.getJtiTrdRspop[0]);
                    houscntChart(result.getJtiTrdHous[0]);
                    housewidthChart(result.getJtiTrdHous[0]);
                    housecostChart(result.getJtiTrdHous[0]);
                    storeRvalChart(result.getJtiTrdStore[0]);
                    storeActiveChart(result.getJtiTrdActidx[0]);
                    storeCode(prop);

                },
                error: function(result, status, error) {
                    alert('매핑된 블록데이터가 없습니다.');
                },
                method: 'GET'
            }); 
        };
        loadJtiDashboard(config);
    });
    
    //커멘드 리스트 호출
    htmlJq.find('.storeCommentPopOpen').on("click",  function(){
        var config ={
            storeCd : prop['STORE_CD']
        }
        omsMain.commentForm.show(config);
    })
    
    //수정
    htmlJq.on("click",'.commentDetail',  function(){
        var store_cd = $(event.target).attr("comment-store");
        var comment_seq = $(event.target).attr("comment-seq");
        
        var config = {
            storeCd:store_cd,
            commentSeq:comment_seq,
            commentMode : 'U'
        };
        omsMain.commentForm.uptShow(config);
    });
    
    // 이미지 크게 보기
    htmlJq.on("click",'.imageDetail',  function(){
        var imagePath = $(this).find('img').attr("src");
        
        // todo.레이어 생성후 위의 이미지만 보여줌
        var imageHtml = '<div class="popup_layer" style="z-index:99999">\
                        <div class="popup_image">\
                        <div class="pop_header">\
                        <h2 class="pop_tit">이미지 보기</h2><a href="#" class="btn_close image_close">닫기</a>\
                        </div>\
                        <div class="pop_contents">\
                        <img src="'+imagePath+'" style="max-width:680px"/>\
                        </div>\
                        </div>\
                        </div>';
        
        $('body').append(imageHtml);
    });
    
    // 이미지 팝업닫기
    $('body').on('click','.btn_close.image_close', function(){
        $(".popup_layer").hide();
    });
    
    //삭제
    htmlJq.on("click",'.comment_list_del',  function(){
        //리스트 리로드해야함.(삭제후)
        var store_cd = $(event.target).attr("comment-store");
        var comment_seq = $(event.target).attr("comment-seq");
        
        var param = {
                wUserSeq : $(event.target).attr("user-seq"),
                storeCd: $(event.target).attr("comment-store"),
                commentSeq: $(event.target).attr("comment-seq")
                };
        $('body').trigger("bind_commentDelete_start", [true,param]);
    });
}