/**
 * @description filterEdit 컴포넌트
 */
var filterEdit = {

    jq: undefined,

    layerNo: undefined,
    seqNo: 0,
    editSeqNo: 0,
    
    /**
     * filterEdit 컴포넌트 초기화
     * @returns
     */
    init: function () {
        var that = this;
        that.jq = $('#filterEdit');
        that.filterColumnElement = $("#filterEdit .filterColumn");

        that.layerNo = omsMain.getLayerNoByName('jti.jtiStore');

        
        // 항목 추가하기 클릭
        that.jq.find('.append.filter').click(function () {

        	// jtiFilter 레이어가 있을 경우 필터박스 리스트 UI 생성
            if (that['layerNo']) {
                that.createUI(); // 필터박스 리스트 UI 생성 메소드 호출
            }
        });

        // 필터 적용하기 클릭
        that.jq.find('.filter.apply').click(function () {
        	that.openLoading();
        	that.close();   // filterEdit창 닫기
        	setTimeout(function() {
        		that.applyFilter();   // 필터 적용메소드 호출
        	}, 300);
        });

        // 필터 수정하기 클릭
        that.jq.find('.filter.update').click(function () {
        	that.openLoading();
        	that.close();   // filterEdit창 닫기        	
        	setTimeout(function() {
        		that.updateFilter();
        	}, 300);
        });

        that.jq.find('.btn_close').click(function () {
            that.close();
        });

        // SELECT 연산자 change 이벤트
        that.jq.find('.filter_list').on('change', '.filter.select .operator', function () {

            var column = $(this).parent().attr('column');
            var columnNm = $(this).parent().attr('columnNm');
            var operator = $(this).find('option:selected').attr('value');
            var value = '';
            var filter = '';
            var text = '';

            if (operator === 'equal') {
                $(this).parent().find('select.equal').show();
                $(this).parent().find('input.like').hide();

                value = $(this).parent().find('select.equal option:selected').val();

                text = column + ' : ' + value;
                
                // 조회할 컬럼명의 TOP1SEG일 경우
                if(that.checkTop1Seg(columnNm)) {
                	filter = " AND C." + column + " = '" + value + "'";
                }else if(that.checkAddrColumn(columnNm)){// 조회할 컬럼명이 주소정보일 경우	
                	filter = " AND A." + column + " = '" + value + "'";
            	// 조회할 컬럼명의 TOP1SEG이 아닐 경우
                } else if('TRD_NM'.indexOf(columnNm) >-1){// 조회할 컬럼명이 핵심상권	
                	filter = " AND M." + column + " = '" + value + "'";
                	
                }else {
//                	filter = " AND J." + column + " = '" + value + "'";
                	filter = " AND " + that.checkGetAlias( column)+column + " = '" + value + "'";
                } 
            } else {
                $(this).parent().find('select.equal').hide();
                $(this).parent().find('input.like').show();

                value = $(this).parent().find('input.like').val();

                text = column + ' : ' + value;
                
                // 조회할 컬럼명의 TOP1SEG일 경우
                if(that.checkTop1Seg(columnNm)) {
                	filter = " AND C." + column + " LIKE ('%" + value + "%')";
                }else if(that.checkAddrColumn(columnNm)){// 조회할 컬럼명이 주소정보일 경우	
                	filter = " AND A." + column + " LIKE ('%" + value + "%')";
            	// 조회할 컬럼명의 TOP1SEG이 아닐 경우
                }else if('TRD_NM'.indexOf(columnNm) >-1){// 조회할 컬럼명이 핵심상권	
                	filter = " AND M." + column + " LIKE ('%" + value + "%')";
                	
                } else {
//                	filter = " AND J." + column + " LIKE ('%" + value + "%')";
                	filter = " AND " + that.checkGetAlias( column)+column + " LIKE ('%" + value + "%')";
                } 
            }

            $(this).parent().attr('column', column);
            $(this).parent().attr('columnNm', columnNm);
            $(this).parent().attr('operator', operator);
            $(this).parent().attr('value', value);
            $(this).parent().attr('filter', filter);
            $(this).parent().attr('text', text);

        });

        // SELECT value select box change 이벤트
        that.jq.find('.filter_list').on('change', '.filter.select select.equal', function () {
            var column = $(this).parent().attr('column');
            var columnNm = $(this).parent().attr('columnNm');
            var operator = $(this).parent().find('.operator option:selected').val();
            var value = $(this).find('option:selected').attr('value');
            var filter = '';
            var text = column + ' : ' + value;

            // 조회할 컬럼명의 TOP1SEG일 경우
            if(that.checkTop1Seg(columnNm)) {
            	filter = " AND C." + column + " = '" + value + "'";
            }else if(that.checkAddrColumn(columnNm)){// 조회할 컬럼명이 주소정보일 경우	
            	filter = " AND A." + column + " = '" + value + "'";
        	// 조회할 컬럼명의 TOP1SEG이 아닐 경우
            }else if('TRD_NM'.indexOf(columnNm) >-1){// 조회할 컬럼명이 핵심상권	
            	filter = " AND M." + column + " = '" + value + "'";
            	
            } else {
            	filter = " AND " + that.checkGetAlias( column)+column + " = '" + value + "'";
            } 

            $(this).parent().attr('column', column);
            $(this).parent().attr('columnNm', columnNm);
            $(this).parent().attr('operator', operator);
            $(this).parent().attr('value', value);
            $(this).parent().attr('filter', filter);
            $(this).parent().attr('text', text);
        });

        // SELECT value inputbox 입력 이벤트
        that.jq.find('.filter_list').on('keyup', '.filter.select input.like', function () {
            var column = $(this).parent().attr('column');
            var columnNm = $(this).parent().attr('columnNm');
            var operator = $(this).parent().find('.operator option:selected').val();
            var value = $(this).val();
            var filter = '';
            var text = column + ' : ' + value;

            // 조회할 컬럼명의 TOP1SEG일 경우
            if(that.checkTop1Seg(columnNm)) {
            	filter = " AND C." + column + " LIKE ('%" + value + "%')";
            }else if(that.checkAddrColumn(columnNm)){// 조회할 컬럼명이 주소정보일 경우	
            	filter = " AND A." + column + " LIKE ('%" + value + "%')";
        	// 조회할 컬럼명의 TOP1SEG이 아닐 경우
            }else if('TRD_NM'.indexOf(columnNm) >-1){// 조회할 컬럼명이 핵심상권	
            	filter = " AND M." + column + " LIKE ('%" + value + "%')";
            	
            } else {
//            	filter = " AND J." + column + " LIKE ('%" + value + "%')";
            	filter = " AND " + that.checkGetAlias( column)+column + " LIKE ('%" + value + "%')";
//            	column = that.checkGetAlias( column)+column
            } 
            
            $(this).parent().attr('column', column);
            $(this).parent().attr('columnNm', columnNm);
            $(this).parent().attr('operator', operator);
            $(this).parent().attr('value', value);
            $(this).parent().attr('filter', filter);
            $(this).parent().attr('text', text);
        });

        // INPUT 연산자 change 이벤트
        that.jq.find('.filter_list').on('change', '.filter.input .operator', function () {
            var column = $(this).parent().attr('column');
            var columnNm = $(this).parent().attr('columnNm');
            var operator = $(this).find('option:selected').attr('value');
            var value = $(this).parent().find('input.value').val();
            var filter = '';
            var text = column + ' : ' + value;
            
            $(this).parent().find('input.value').show();
            $(this).parent().find(".copied").hide();
            if (operator === 'equal') {
            	
                // 조회할 컬럼명의 TOP1SEG일 경우
                if(that.checkTop1Seg(columnNm)) {
                	filter = " AND C." + column + " = '" + value + "'";
                }else if(that.checkAddrColumn(columnNm)){// 조회할 컬럼명이 주소정보일 경우	
                	filter = " AND A." + column + " = '" + value + "'";
            	// 조회할 컬럼명의 TOP1SEG이 아닐 경우
                }else if('TRD_NM'.indexOf(columnNm) >-1){// 조회할 컬럼명이 핵심상권	
                	filter = " AND M." + column + " = '" + value + "'";
                	
                } else {
                	filter = " AND " + that.checkGetAlias( column)+column + " = '" + value + "'";
                	column = that.checkGetAlias( column)+column
                } 
            } else if (operator === 'like'){
            	
                // 조회할 컬럼명의 TOP1SEG일 경우
                if(that.checkTop1Seg(columnNm)) {
                	filter = " AND C." + column + " LIKE ('%" + value + "%')";
                }else if(that.checkAddrColumn(columnNm)){// 조회할 컬럼명이 주소정보일 경우	
                	filter = " AND A." + column + " LIKE ('%" + value + "%')";
            	// 조회할 컬럼명의 TOP1SEG이 아닐 경우
                }else if('TRD_NM'.indexOf(columnNm) >-1){// 조회할 컬럼명이 핵심상권	
                	filter = " AND M." + column + " LIKE ('%" + value + "%')";
                	
                } else {
                	filter = " AND " + that.checkGetAlias( column)+column + " LIKE ('%" + value + "%')";
                	
                } 
            } else if (operator === 'in'){
            	$(this).parent().find(".copied").show();
               	that.setInOperaterHandler(value,this);
            	return;

            }else if(operator === 'trdarea'){
            	
            	
            	if(columnNm == "Account code"){
            		var trdvalue = " AND J.STORE_CD  IN (SELECT STORE_CD FROM JTI_STORE_TRD_MAP) ";
            		value=trdvalue;
            		filter=trdvalue;
            		text="핵심상권내 점포";
            		$(this).parent().find('input.value').hide();
            	}
            }

            
            
            
            $(this).parent().attr('column', column);
            $(this).parent().attr('columnNm', columnNm);
            $(this).parent().attr('operator', operator);
            $(this).parent().attr('value', value);
            $(this).parent().attr('filter', filter);
            $(this).parent().attr('text', text);
        });

        // INPUT value inputbox 입력 이벤트
        that.jq.find('.filter_list').on('keyup', '.filter.input input.value', function () {
            var column = $(this).parent().attr('column');
            var columnNm = $(this).parent().attr('columnNm');
            var operator = $(this).parent().find('.operator option:selected').val();
            var value = $(this).val();
            var filter = '';

            var operator = $(this).parent().find('.operator option:selected').val();
            if(columnNm ==="NEW_ZIP_CODE" ){
            	
            	if(value.length < 5){
            		value = that.lpad(value,5,'0');
            	}else{
            		value = value.substring(0,5);
            	}
            		
            	 $(this).val(value);
            }
            var text = column + ' : ' + value;
            if (operator === 'in') {
            	that.setInOperaterHandler(value,this,columnNm);
            	return;
            }
            if (operator === 'equal') {
            	
                // 조회할 컬럼명의 TOP1SEG일 경우
                if(that.checkTop1Seg(columnNm)) {
                	filter = " AND C." + column + " = '" + value + "'";
                }else if(that.checkAddrColumn(columnNm)){// 조회할 컬럼명이 주소정보일 경우	
                	filter = " AND A." + column + " = '" + value + "'";
            	// 조회할 컬럼명의 TOP1SEG이 아닐 경우
                }else if('TRD_NM'.indexOf(columnNm) >-1){// 조회할 컬럼명이 핵심상권	
                	filter = " AND M." + column + " = '" + value + "'";
                	
                } else {
                	filter = " AND J." + column + " = '" + value + "'";
                } 
            } else {
            	
                // 조회할 컬럼명의 TOP1SEG일 경우
                if(that.checkTop1Seg(columnNm)) {
                	filter = " AND C." + column + " LIKE ('%" + value + "%')";
                }else if(that.checkAddrColumn(columnNm)){// 조회할 컬럼명이 주소정보일 경우	
                	filter = " AND A." + column + " LIKE ('%" + value + "%')";
            	// 조회할 컬럼명의 TOP1SEG이 아닐 경우
                }else if('TRD_NM'.indexOf(columnNm) >-1){// 조회할 컬럼명이 핵심상권	
                	filter = " AND M." + column + " LIKE ('%" + value + "%')";
                	
                } else {
                	filter = " AND J." + column + " LIKE ('%" + value + "%')";
                } 
            }

            $(this).parent().attr('column', column);
            $(this).parent().attr('columnNm', columnNm);
            $(this).parent().attr('operator', operator);
            $(this).parent().attr('value', value);
            $(this).parent().attr('filter', filter);
            $(this).parent().attr('text', text);
        });
        // INPUT value inputbox 입력 이벤트
        that.jq.find('.filter_list').on('paste', '.filter.input input.value[type=text]', function (e) {
        	var operator = $(this).parent().find('.operator option:selected').val();
        	var parentColumn = $(this).parent().attr('column');//셀렉트 박스에서 선택된 값
        	var parentColumnNm = $(this).parent().attr('columnNm');

        	var clipboardStr = e.originalEvent.clipboardData.getData('text');
        	
        	
        	if(operator !== 'in') {
        		if(clipboardStr.indexOf("g_r_i_d")>-1){
        			alert('in연산자를 사용하세요');
//                	$(this).val('');
//                	$(this).val(clipboardStr.replace("g_r_i_d_",""));
                    e.stopPropagation();
                    e.preventDefault();
        		}
        		return;
        	}
        	
        	
            var pastedText = splitBlankText(clipboardStr);

            if (!pastedText && pastedText.length) {
                return;
            }

            var filterColumn = parentColumn;
           
            if(that.checkTop1Seg(parentColumnNm)) { // 조회할 컬럼명의 TOP1SEG일 경우
            	filterColumn = "C." + parentColumn;
            }else if(that.checkAddrColumn(parentColumnNm)){// 조회할 컬럼명이 주소정보일 경우	
            	filterColumn = "A." + parentColumn;
            }else if('TRD_NM'.indexOf(parentColumnNm) >-1){// 조회할 컬럼명이 핵심상권	
            	filterColumn = "M." + parentColumn;
            } else {// 조회할 컬럼명의 TOP1SEG이 아닐 경우
            	filterColumn = "J." + parentColumn;
            } 

            
        	if(pastedText.length == 0)
        		return;
        	
            parentColumnNm = "Account code";//점포 코드에만 작동
            
            var pasteColumnNm = pastedText[0];//그리드에서 복사된 컬럼이름

            var fromGrid = pasteColumnNm.indexOf("g_r_i_d_") > -1;
            if(fromGrid)
            	pasteColumnNm = pastedText[0].replace("g_r_i_d_","");
            
            
            var  valueText = "";
            if (fromGrid && pasteColumnNm === parentColumnNm) {
            	pastedText = pastedText.slice(1);//첫째 요소 (헤더)제거
            }
            
        	if (pastedText['length'] > 2002) {  // 공백 + 헤더 
        		alert('복사할 데이터가 2000건이 넘습니다!');
        		return;
        	}
        	var uniqueText = [];  // 중복제거된 배열을 저장하기 위한 변수
        	
        	// 중복제거
        	$.each(pastedText, function(i, el){
        		if($.inArray(el, uniqueText) === -1 && el !=='' ) uniqueText.push(el);
        	});
        	
        	            
        	valueText = uniqueText.join(",");
        	
        	
            

            
            
        	$(this).val('');
        	$(this).val(valueText);
        	that.setInOperaterHandler(valueText,this,filterColumn);
            e.stopPropagation();
            e.preventDefault();      	

            
        });

        // Tier 클릭 이벤트
        that.jq.find('.filter_list').on('click', '.Tier li', function () {
            $(this).toggleClass('on');

            var column = $(this).parent().parent().attr('column');
            var columnNm = $(this).parent().parent().attr('columnNm');
            var value = '';
            var filter = " AND J." + column + " IN (";
            var text = column + ' : ';

            $(this).parent().parent().find('li.on').each(function (i, e) {

                if (i > 0) {
                    value += ',';
                    filter += ',';
                    text += ',';
                }

                value += $(e).attr('value');
                filter += "'" + $(e).attr('value').replace('T', '') + "'";
                text += $(e).attr('value');
            });

            filter += ')';

            $(this).parent().parent().attr('column', column);
            $(this).parent().parent().attr('columnNm', columnNm);
            $(this).parent().parent().attr('value', value);
            $(this).parent().parent().attr('filter', filter);
            $(this).parent().parent().attr('text', text);
        });

        that.jq.find('.filter_list').on('click', '.draw.circle', function () {
            $(this).addClass("on");
            that.drawCircle($(this).parent().parent(), this);
        });

        that.jq.find('.filter_list').on('click', '.draw.rectangle', function () {
            $(this).addClass("on");
            that.drawRectangle($(this).parent().parent(), this);
        });

        that.jq.find('.filter_list').on('click', '.draw.polygon', function () {
            $(this).addClass("on");
            that.drawPolygon($(this).parent().parent(), this);
        });
        
        
    },
    setInOperaterHandler :function(codeValue,obj){
//    	var codeValue = valueText;
    	var operator = $(obj).parent().find('.operator option:selected').val();
    	var parentColumn = $(obj).parent().attr('column');//셀렉트 박스에서 선택된 값
    	var parentColumnNm = $(obj).parent().attr('columnNm');
    	var filterColumn = parentColumn;
    	
    	if(codeValue === "" && codeValue.length == 0){
    		$(obj).parent().find(".copied").remove();
    		$(obj).parent().attr('value', codeValue);
    		return;
    	}
    	
    	var uniqueText = codeValue.split(",");
    	var value = uniqueText.map(function(e){ return "'"+e+"'";}).join(",");
    	
    	
    	var descText = uniqueText[0]+"외 "+(uniqueText['length']-1)+"개";
    	
       
        if(this.checkTop1Seg(parentColumnNm)) { // 조회할 컬럼명의 TOP1SEG일 경우
        	filterColumn = "C." + parentColumn;
        }else if(this.checkAddrColumn(parentColumnNm)){// 조회할 컬럼명이 주소정보일 경우	
        	filterColumn = "A." + parentColumn;
        }else if('TRD_NM'.indexOf(parentColumnNm) >-1){// 조회할 컬럼명이 핵심상권	
        	filterColumn = "M." + parentColumn;
        } else {// 조회할 컬럼명의 TOP1SEG이 아닐 경우
        	filterColumn = "J." + parentColumn;
        } 
        var filterText = " AND "+filterColumn+" IN (" + value + ") ";
    	
    	
    	
		var div = '<div class="copied"';
		div += ' style="text-align: center; padding: 4px 0 4px 0; width: 100%; font-size: 14px; font-weight: bold;">';
		div += 			'<p><span>' + (uniqueText['length']) + '</span>개'+parentColumnNm+'가 선택되었습니다!';
		div += '</div>';

		$(obj).parent().attr('operator', operator);
		$(obj).parent().attr('value', codeValue);
		$(obj).parent().attr('filter', filterText);
		$(obj).parent().attr('text', descText);
		$(obj).parent().attr('pastedCnt', uniqueText['length']);
		
		
		
		$(obj).parent().find(".copied").remove();
		$(obj).parent().append(div);
    },
    /**
     * @description 로딩창 여는 함수
     * @returns
     */
    openLoading: function() {
		$('#modal').show();   // 백그라운드 모달창 엶
		$('#dataLoading').show();   // 로딩창 엶
    },

    /**
     * @description 로딩창 닫는 함수
     * @returns
     */
    closeLoading: function() {
		$('#modal').hide();   // 백그라운드 모달창 닫음
		$('#dataLoading').hide();   // 로딩창 닫음
    },
    
    /**
     * 필터 적용하기 버튼 클릭시 호출되는 메소드
     * 로컬DB(HSQL)에 필터 데이터 저장
     * Table명: USER_FILTER_DATA
     */
    applyFilter: function () {
        var that = this;
        var empty = false;  // 값이 비어있는지 여부
        var seqNo = that['seqNo'];   // 필터 대분류 시퀀스

        if (!that['layerNo']) {
            alert('레이어가 생성되지 않아 필터를 저장할 수 없습니다.');
            return;
        }
        
        // 적용될 수 있는 필터 수는 2000건으로 제한
        if(that.jq.find('.filter_add_list').length > 2000) {
        	alert('현재 적용된 필터 수가 2000건을 초과하였습니다.\n필터 수를 제한하여 주십시오.');
        	return;
        }
        
        // 현재 추가된 필터리스트를 순서대로 반복하며 데이터 삽입
        that.jq.find('.filter_add_list .filter').each(function (i, e) {

            // 파라미터 중 필터값(쿼리조건문)에 들어갈 값 세팅
            var filterJson2 = {
                filter: $(e).attr('filter'),   // 조건문
                text: $(e).attr('text'),   // 표현문
                column: $(e).attr('column'),   // 컬럼명
                columnNm: $(e).attr('columnNm'),   // 컬럼별칭
                operator: $(e).attr('operator'),   // 연산자
                value: $(e).attr('value'),   // 실제 값
                pastedCnt: $(e).attr('pastedCnt')   // 복사된 값 개수
            }

            // 파라미터에 들어갈 필터값중 비어있으면 데이터 삽입 못하도록 플래그값 세팅
            if (!filterJson2['value'].trim()) {
                empty = true;
            }

            // 데이터 삽입할 실제 파라미터
            var params = {
                dataNo: that['layerNo'],   // 레이어 번호
                userNo: $('#userSeq').val(),   // 유저번호
                seqNo: seqNo,   // 필터 대분류 시퀀스
                subSeqNo: i,   // 필터 소분류 시퀀스
                filterJson1: $(e).wrap("<div/>").parent().html().trim(),   // 필터가 포함된 UI
                filterJson2: JSON.stringify(filterJson2)   // 필터값(쿼리 조건문)
            }
            
            // 파라미터에 들어갈 필터값중 비어있지 않으면 데이터 삽입
            if(!empty) {
            	$.ajax({
            		url: jtiConfig['mapserverUrl'] + '/data/filter/insert.json',
            		data: params,
            		type: 'POST',
            		async: false,  // 데이터 삽입은 동기로 처리해야 함
            		success: function (result, status, xhr) { 
            			
            			// 마지막 필터 삽입후 다음 로직들 실행
            			if(i === that.jq.find('.filter_add_list .filter').length - 1) {
            				omsMain.filterBox.createUI(that['seqNo']);  // filterBox UI갱신
            				that.jq.find('.filter_list').empty();  // filterEdit 리스트 삭제
            				that['seqNo'] = that['seqNo'] + 1;   // 다음 삽입할 필터 seqNo 증가
            				that.closeLoading();
            			}
            		},
            		error: function (e) { }
            	});
            }
        });

        if (empty) {
            alert('비어있는 값이 있습니다!');
            that.closeLoading();
            return;
        }
    },

    /**
     * 필터 수정하기 버튼 클릭시 호출되는 메소드
     * 로컬DB(HSQL)에 필터 데이터 수정
     * Table명: USER_FILTER_DATA
     * 로직: 해당 seqNo 필터 선 제거 후 삽입
     */
    updateFilter: function () {
        var that = this;
        var empty = false;   // 값이 비어있는지 여부
        var seqNo = that['editSeqNo'];   // 필터 대분류 시퀀스
        
        
        
        var deleteFlag = $.makeArray($('.filter_add_list .filter')).map(function(e){ return $(e).attr("value");}).includes("");
//        필터중 빈값이 없을 경우에만
        if(!deleteFlag){
        	that.deleteFilter(seqNo);   // 현재 선택된 필터 시퀀스를 먼저 삭제
        };


        if (!that['layerNo']) {
            alert('레이어가 생성되지 않아 필터를 저장할 수 없습니다.');
            return;
        }
        
        // 적용될 수 있는 필터 수는 2000건으로 제한
        if(that.jq.find('.filter_add_list').length > 2000) {
        	alert('현재 적용된 필터 수가 2000건을 초과하였습니다.\n필터 수를 제한하여 주십시오.');
        	return;
        }
        
        // 현재 추가된 필터리스트를 순서대로 반복하며 데이터 삽입
        that.jq.find('.filter_add_list .filter').each(function (i, e) {

            // 파라미터 중 필터값(쿼리조건문)에 들어갈 값 세팅
            var filterJson2 = {
        		filter: $(e).attr('filter'),   // 조건문
                text: $(e).attr('text'),   // 표현문
                column: $(e).attr('column'),   // 컬럼명
                columnNm: $(e).attr('columnNm'),   // 컬럼별칭
                operator: $(e).attr('operator'),   // 연산자
                value: $(e).attr('value'),   // 실제 값
                pastedCnt: $(e).attr('pastedCnt')   // 복사된 값 개수
            }

            // 파라미터에 들어갈 필터값중 비어있으면 데이터 삽입 못하도록 플래그값 세팅
            if (!filterJson2['value'].trim()) {
                empty = true;
            }

            // 데이터 삽입할 실제 파라미터
            var params = {
                dataNo: that['layerNo'],   // 레이어 번호
                userNo: $('#userSeq').val(),   // 유저번호
                seqNo: seqNo,   // 필터 대분류 시퀀스
                subSeqNo: i,   // 필터 소분류 시퀀스
                filterJson1: $(e).wrap("<div/>").parent().html().trim(),    // 필터가 포함된 UI
                filterJson2: JSON.stringify(filterJson2)   // 필터값(쿼리 조건문)
            }

            // 파라미터에 들어갈 필터값중 비어있지 않으면 데이터 삽입
            if(!empty) {
            	$.ajax({
            		url: jtiConfig['mapserverUrl'] + '/data/filter/insert.json',
            		data: params,
            		type: 'POST',
            		async: false,   // 데이터 삽입은 동기로 처리해야 함
            		success: function (result, status, xhr) { 
            			
            			// 마지막 필터 삽입후 다음 로직들 실행
            			if(i === that.jq.find('.filter_add_list .filter').length - 1) {
            				omsMain.filterBox.createUI(seqNo);  // filterBox UI갱신
            				that.jq.find('.filter_list').empty();  // filterEdit 리스트 삭제
            				that.closeLoading();
            			}
            		},
            		
            		error: function (e) { }
            	});
            }
        });

        if (empty) {
            alert('비어있는 값이 있습니다!');
            that.closeLoading();
            return;
        }
    },

    /**
     * @description 필터를 DB에서 삭제하는 메소드
     * @param seqNo{String}: 삭제할 키
     */
    deleteFilter: function (seqNo) {
        var that = this;
        
        if (!seqNo) {
            alert('seqNo가 없습니다!');
            return;
        }
        var params = {
            dataNo: that['layerNo'],
            seqNo: seqNo,
            userNo: $('#userSeq').val(),
        };

        $.ajax({
            url: jtiConfig['mapserverUrl'] + '/data/filter/delete.json',
            data: params,
            type: 'POST',
            success: function (result, status, xhr) { },
            error: function (e) { }
        });
    },

    /**
     * @description 점포필터 레이어를 그리는 메소드
     * @param filter{String} DB쿼리 필터조건
     */
    drawLayer: function (filter) {
		var layerArr = omsMain.getLayerNoById("jti.jtiLayerStore");
		
		
		layerArr = layerArr.filter(function(i){
			var layerInfo = omsMain.getLayer(i);
			return layerInfo['name'] != 'jtiFilter';
		});
		layerArr.forEach(function (key, i) {
			var layerInfo = omsMain.getLayer(key);
			layerInfo['storeFilter'] = filter;

		})
		omsMain.controlBar.drawJtiAccountCodeLayer();
		omsMain.controlBar.drawJtiAccountCodeLabelLayer();
		return;
    },

    /**
     * @description 이 컴포넌트 여는 메소드 
     */
    open: function () {
        var that = this;
        that.jq.show("slide", { direction: "left" }, 300);
    },

    /**
     * @description 이 컴포넌트 닫는 메소드 
     */
    close: function () {
        var that = this;
        that.jq.hide("slide", { direction: "left" }, 300);
    },

    /**
     * @description 매개변수를 기반으로 DB에서 데이터 조회
     * @param column{String}: 조건에 넣을 컬럼명
     * @param mode{String}: 조건에 넣을 컬럼의 타입
     * @param container{Object}: 필터리스트 UI를 생성하기 위해 필요한 jquery 오브젝트
     */
    getValue: function (column, mode, container) {
        var that = this;

        $.ajax({
            url: jtiConfig['mapserverUrl'] + '/data/info.json',
            data: {
                dataNo: that['layerNo'],
                mode: mode,
                column: that.checkGetAlias( column)+column,
                count: 100
            },
            type: 'POST',
            success: function (result, status, xhr) {
                if (!result['data']) {
                    alert('데이터가 없습니다!');
                    return;
                }

                // column이 COL11(Tier) -> tierUI 생성
                if (column === 'COL11') {
                    that.createTierUI(result['data'], container)

                // type이 string
                } else if (mode === 'groupping') {

                    // inputUI 생성
                    if (result['data'].length === 0) {
                        that.createInputUI(container);
                        
                    // selectUI 생성
                    } else {
                        that.createSelectUI(result['data'], container);
                    }

                // type이 number -> rangeUI 생성
                } else if (mode === 'minMax') {
                    that.createRangeUI(result['data'], container);
                }
            },

            error: function (e) { }
        });
    },

    /**
     * @description filterEdit 필터리스트 UI 생성하는 메소드
     */
    createUI: function () {
        var that = this;
        var index = that.jq.find('.filter_add_list').length;   // 현재 보여지고 있는 필터리스트의 개수
        that.createColumn();   // 컬럼UI부터 생성

        var container = that.jq.find('.filter_add').eq(index);   // 필터 리스트를 추가할 컨테이너 
        var firstColumn = container.find('.filterColumn option:selected').attr('attrid');   // 처음 세팅할 때 필요한 컬럼명
        var mode = container.find('.filterColumn option:selected').attr('mode');   // DB변수타입 

        that.getValue(firstColumn, mode, container);   // 해당 컬럼에 대한 데이터 조회
    },

    /**
     * @description filterBox 편집하기 눌렀을 경우 filterEdit에 필터리스트를 생성하는 메소드
     * @param seqNo{String}: 데이터 조회할 키 
     */
    appendUI: function (seqNo) {

        if (!seqNo) {
            alert('seqNo가 없습니다!');
            return;
        }

        var that = this;
        var params = {
            dataNo: that['layerNo'],
            seqNo: seqNo,
            userNo: $('#userSeq').val(),
        };
        
        that.jq.find('.filter_list').empty();
        
        $.ajax({
            url: jtiConfig['mapserverUrl'] + '/data/filter/list.json',
            data: params,
            type: 'POST',
            success: function (result, status, xhr) {

                result['filter'].forEach(function (f, i) {
                    var filterJson1 = f['filterJson1'];
                    var filterJson2 = JSON.parse(f['filterJson2']);
                    var filter = filterJson2['filter'];
                    

                    	
                    	that.createColumn();   // 컬럼UI부터 생성
                    	
                        var container = that.jq.find('.filter_list .filter_add').eq(i).append(filterJson1);

                        if (container.find('.filter.select').length > 0) {
                            var columnNm = filterJson2['columnNm'];
                            var operator = filterJson2['operator'];
                            var value = filterJson2['value'];

                            container.find('.filterColumn').val(columnNm);
                            container.find('.operator').val(operator);

                            if (operator === 'equal') {
                                container.find('select.equal').val(value);
                            } else {
                                container.find('input.like').val(value);
                            }

                        } else if (container.find('.filter.input').length > 0) {
                            var columnNm = filterJson2['columnNm'];
                            var operator = filterJson2['operator'];
                            var value = filterJson2['value'];

                            container.find('.filterColumn').val(columnNm);
                            container.find('.operator').val(operator);
                            container.find('input.value').val(filterJson2['value']);

                        } else if (container.find('.filter.range').length > 0) {
                            var columnNm = filterJson2['columnNm'];
                            var value = filterJson2['value'];

                            var cnt = "" + parseInt(value.split(',')[1]);
                            var max = "1";
                            for (let i = 1; i < cnt.length; i++) {
                                max += "0";
                            }

                            var arr = [{
                                minVal: value.split(',')[0],
                                maxVal: parseInt(max),
                                value: value.split(',')[1]
                            }];
                            container.find('.filterColumn').val(columnNm);
                            container.find('.filter.range').remove();

                            that.createRangeUI(arr, container);

                        } else if (container.find('.filter.Tier').length > 0) {
                            var columnNm = filterJson2['columnNm'];
                            container.find('.filterColumn').val(columnNm);
                        } else if (container.find('.filter.geom').length > 0) {
                            var columnNm = filterJson2['columnNm'];
                            var operator = filterJson2['operator'];
                            var geoms = JSON.parse(filterJson2['value']);

                            omsMain.selfmap.removeDrawnVectorAll();

                            geoms.forEach(function (g, i) {
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
                            container.find('.filterColumn').val(columnNm);
                            container.find('.operator').val(operator);
                        }
                    
                });
            },

            error: function (e) { }
        });
    },

    /**
     * @description 컬럼UI를 생성하는 메소드
     */
    createColumn: function () {
        var that = this;
        var attr = omsMain.getMeta('', that['layerNo']).attributes;
        var index = that.jq.find('.filter_add_list').length;
        var div = '<div class="filter_add_list" ';
        div += ' index="' + index + '">';
        div += '<div class="filter_add">';
        div += '<select class="filterColumn" index="' + index + '">';

        attr.forEach(function (a, i) {
            if (a['type'] === 'string') {
                var mode = 'groupping';
            } else if (a['type'] === 'number') {
                var mode = 'minMax';
            }

            div += '<option type="' + a['type'] + '"';
            div += ' attrId="' + a['attrId'] + '"';
            div += ' attrNm="' + a['attrNm'] + '"';
            div += ' camelId="' + a['camelId'] + '"';
            div += ' mode="' + mode + '">';
            div += a['attrNm'] + '</option>';
        });

        div += '</select>';
        div += '<a href="#" class="btn_close action delete">삭제</a>'
        div += '</div></div>';
        that.jq.find('.filter_list').append(div);

        that.jq.find('.filterColumn[index="' + index + '"]').change(function () {
            var index = $(this).attr('index');
            var column = $(this).find('option:selected').attr('attrid');
            var mode = $(this).find('option:selected').attr('mode');
            var container = that.jq.find('.filter_add_list[index="' + index + '"] .filter_add');

            container.find('.filter').remove();

            if (column === 'GEOMETRY') {
                // gemetry ui 생성호출
                that.createGeomUI(container);
            } else {
                that.getValue(column, mode, container);
            }
        });

        that.jq.find('.filter_add_list[index="' + index + '"]').find('.delete').click(function () {

            if ($(this).parent().find('.filter.geom').attr('value')) {
                var geoms = JSON.parse($(this).parent().find('.filter.geom').attr('value'));

                geoms.forEach(function (g, i) {
                    omsMain.selfmap.removeVectorShapesItem(g['id']);
                });
            }

            that.jq.find('.filter_add_list[index="' + index + '"]').remove();
        });
    },

    /**
     * @description TOP1SEG 컬럼 존재 여부
     * @param column{String}: 조회할 컬럼명
     */
    checkTop1Seg: function(column) {
    	if(column === 'E_RTO_S20') {
    		return true;
    	} else if(column === 'E_RTO_C20') {
    		return true;
    	} else if(column === 'E_RTO_SYB') {
    		return true;
    	} else if(column === 'E_RTO_SOB') {
    		return true;
    	} else if(column === 'E_RTO_CHI') {
    		return true;
    	} else if(column === 'E_RTO_ESA') {
    		return true;
    	} else if(column === 'E_RTO_H50') {
    		return true;
    	} else if(column === 'TOP1_SEG') {
    		return true;
    	} else if(column === 'TOP2_SEG') {
    		return true;
    	}  
    	return false;
    },
    /**
     * @description TOP1SEG 컬럼 존재 여부
     * @param column{String}: 조회할 컬럼명
     */
    checkAddrColumn: function(column) {
    	return "NEW_ZIP_CODE,PROC_CLSS,X_AXIS,Y_AXIS,LON,LAT".indexOf(column)>-1;
    },
    checkGetAlias: function(column) {
    	var top1segStr = 'E_RTO_S20,E_RTO_C20,E_RTO_SYB,E_RTO_SOB,E_RTO_CHI,E_RTO_ESA,E_RTO_H50,TOP1_SEG,TOP2_SEG';
    	var addrStr = 'NEW_ZIP_CODE,PROC_CLSS,X_AXIS,Y_AXIS,LON,LAT';
    	var enrichStr = 'BLK_CD,BLK_TYP_LGRP,RSPOP_TOT_TVAL,RSPOP_TOP1_PROFILE,FLPOP_TOT_TVAL,FLPOP_TOP1_PROFILE,SISUL_UNIV_YN,SISUL_UNIV_CO,SISUL_UNIV1_NM,SISUL_UNIV1_STU_CO,SISUL_UNIV2_NM,SISUL_UNIV2_STU_CO,SISUL_UNIV3_NM,SISUL_UNIV3_STU_CO,STORE_ADULT_YN,STORE_ADULT_CO,STORE_ADULT_TVAL,SISUL_SUBWAY_YN,SISUL_SUBWAY_CO,SISUL_BUSSTOP_CO,SISUL_SUBWAY_NM,FLPOP_TOTAL_RVAL,FLPOP_M_20_RVAL,FLPOP_W_20_RVAL,FLPOP_M_30_RVAL,FLPOP_W_30_RVAL,FLPOP_M_40_RVAL,FLPOP_W_40_RVAL,FLPOP_M_50O_RVAL,FLPOP_W_50O_RVAL,FLPOP_T0609_RVAL,FLPOP_T0912_RVAL,FLPOP_T1214_RVAL,FLPOP_T1418_RVAL,FLPOP_T1820_RVAL,FLPOP_T2022_RVAL,FLPOP_T2200_RVAL,FLPOP_T0002_RVAL,FLPOP_T0204_RVAL,FLPOP_T0406_RVAL,RSPOP_TOTAL_RVAL,RSPOP_M_1829_RVAL,RSPOP_W_1829_RVAL,RSPOP_M_30_RVAL,RSPOP_W_30_RVAL,RSPOP_M_40_RVAL,RSPOP_W_40_RVAL,RSPOP_M_50O_RVAL,RSPOP_W_50O_RVAL,HOUSCNT_TOTAL_RVAL,HOUSCNT_A_RVAL,HOUSCNT_V_RVAL,HOUSCNT_DD_RVAL,HOUSCNT_O_RVAL,HOUSCNT_DG_RVAL,HOUSRTO_A66U_RVAL,HOUSRTO_A98U_RVAL,HOUSRTO_A132U_RVAL,HOUSRTO_A165U_RVAL,HOUSRTO_A198U_RVAL,HOUSRTO_A330U_RVAL,HOUSRTO_A330O_RVAL,HOUSRTO_P100U_RVAL,HOUSRTO_P200U_RVAL,HOUSRTO_P300U_RVAL,HOUSRTO_P500U_RVAL,HOUSRTO_P700U_RVAL,HOUSRTO_P900U_RVAL,HOUSRTO_P900O_RVAL,TRD_ACT_TOT_RVAL,TRD_ACT_TOT_TVAL,TRD_ACT_A01_TVAL,TRD_ACT_A02_TVAL,TRD_ACT_A03_TVAL,TRD_ACT_A04_TVAL,TRD_ACT_A05_TVAL,TRD_ACT_A06_TVAL,TRD_ACT_A07_TVAL,TRD_ACT_A08_TVAL,TRD_ACT_A09_TVAL,TRD_ACT_A10_TVAL,TRD_ACT_A11_TVAL,TRD_ACT_A12_TVAL,TRD_ACT_A13_TVAL,TRD_ACT_A14_TVAL,TRD_ACT_C01_TVAL,TRD_ACT_C02_TVAL,TRD_ACT_C03_TVAL,TRD_ACT_C04_TVAL,TRD_ACT_C05_TVAL,TRD_ACT_C06_TVAL,TRD_ACT_B01_TVAL,TRD_ACT_B02_TVAL,TRD_ACT_B03_TVAL,TRD_ACT_B04_TVAL,TRD_ACT_B05_TVAL,TRD_ACT_B06_TVAL,TRD_ACT_B07_TVAL,TRD_ACT_B08_TVAL,TRD_ACT_B09_TVAL,TRD_ACT_B10_TVAL,TRD_ACT_B11_TVAL,TRD_ACT_B12_TVAL,TRD_ACT_B13_TVAL,TRD_ACT_B14_TVAL,TRD_ACT_B15_TVAL,MEGA_TRD_ACT_TOT_RVAL,MEGA_TRD_ACT_TOT_TVAL,MEGA_TRD_ACT_A01_TVAL,MEGA_TRD_ACT_A02_TVAL,MEGA_TRD_ACT_A03_TVAL,MEGA_TRD_ACT_A04_TVAL,MEGA_TRD_ACT_A05_TVAL,MEGA_TRD_ACT_A06_TVAL,MEGA_TRD_ACT_A07_TVAL,MEGA_TRD_ACT_A08_TVAL,MEGA_TRD_ACT_A09_TVAL,MEGA_TRD_ACT_A10_TVAL,MEGA_TRD_ACT_A11_TVAL,MEGA_TRD_ACT_A12_TVAL,MEGA_TRD_ACT_A13_TVAL,MEGA_TRD_ACT_A14_TVAL,MEGA_TRD_ACT_C01_TVAL,MEGA_TRD_ACT_C02_TVAL,MEGA_TRD_ACT_C03_TVAL,MEGA_TRD_ACT_C04_TVAL,MEGA_TRD_ACT_C05_TVAL,MEGA_TRD_ACT_C06_TVAL,MEGA_TRD_ACT_B01_TVAL,MEGA_TRD_ACT_B02_TVAL,MEGA_TRD_ACT_B03_TVAL,MEGA_TRD_ACT_B04_TVAL,MEGA_TRD_ACT_B05_TVAL,MEGA_TRD_ACT_B06_TVAL,MEGA_TRD_ACT_B07_TVAL,MEGA_TRD_ACT_B08_TVAL,MEGA_TRD_ACT_B09_TVAL,MEGA_TRD_ACT_B10_TVAL,MEGA_TRD_ACT_B11_TVAL,MEGA_TRD_ACT_B12_TVAL,MEGA_TRD_ACT_B13_TVAL,MEGA_TRD_ACT_B14_TVAL,MEGA_TRD_ACT_B15_TVAL,STORE_TOT_RVAL,STORE_A01_RVAL,STORE_A02_RVAL,STORE_A03_RVAL,STORE_A04_RVAL,STORE_A05_RVAL,STORE_A06_RVAL,STORE_A07_RVAL,STORE_A08_RVAL,STORE_A09_RVAL,STORE_A10_RVAL,STORE_A11_RVAL,STORE_A12_RVAL,STORE_A13_RVAL,STORE_A14_RVAL,STORE_C01_RVAL,STORE_C02_RVAL,STORE_C03_RVAL,STORE_C04_RVAL,STORE_C05_RVAL,STORE_C06_RVAL,STORE_B01_RVAL,STORE_B02_RVAL,STORE_B03_RVAL,STORE_B04_RVAL,STORE_B05_RVAL,STORE_B06_RVAL,STORE_B07_RVAL,STORE_B08_RVAL,STORE_B09_RVAL,STORE_B10_RVAL,STORE_B11_RVAL,STORE_B12_RVAL,STORE_B13_RVAL,STORE_B14_RVAL,STORE_B15_RVAL,MEGA_STORE_TOT_RVAL,MEGA_STORE_A01_RVAL,MEGA_STORE_A02_RVAL,MEGA_STORE_A03_RVAL,MEGA_STORE_A04_RVAL,MEGA_STORE_A05_RVAL,MEGA_STORE_A06_RVAL,MEGA_STORE_A07_RVAL,MEGA_STORE_A08_RVAL,MEGA_STORE_A09_RVAL,MEGA_STORE_A10_RVAL,MEGA_STORE_A11_RVAL,MEGA_STORE_A12_RVAL,MEGA_STORE_A13_RVAL,MEGA_STORE_A14_RVAL,MEGA_STORE_C01_RVAL,MEGA_STORE_C02_RVAL,MEGA_STORE_C03_RVAL,MEGA_STORE_C04_RVAL,MEGA_STORE_C05_RVAL,MEGA_STORE_C06_RVAL,MEGA_STORE_B01_RVAL,MEGA_STORE_B02_RVAL,MEGA_STORE_B03_RVAL,MEGA_STORE_B04_RVAL,MEGA_STORE_B05_RVAL,MEGA_STORE_B06_RVAL,MEGA_STORE_B07_RVAL,MEGA_STORE_B08_RVAL,MEGA_STORE_B09_RVAL,MEGA_STORE_B10_RVAL,MEGA_STORE_B11_RVAL,MEGA_STORE_B12_RVAL,MEGA_STORE_B13_RVAL,MEGA_STORE_B14_RVAL,MEGA_STORE_B15_RVAL,TRD_STA_CSTORE_TVA';
    	var coreTrdStr = 'TRD_NM';
    	if(top1segStr.indexOf(column)>-1){
    		return "C.";
    	}else if(addrStr.indexOf(column)>-1){
    		return "A.";
    	}else if(enrichStr.indexOf(column)>-1){
    		return "B.";
    	}else if(coreTrdStr.indexOf(column)>-1){
    		return "M.";
    	}else{
    		return "J.";
    	}
    	
    },
    /**
     * @description select박스 필터UI 생성하는 메소드
     * @param data{Array}: UI생성시 필요한 데이터 
     * @param container{Object}: 필터리스트 UI를 생성하기 위해 필요한 jquery 오브젝트 
     */
    createSelectUI: function (data, container) {

        var that = this;
        var div = '<div class="filter select">';
        div += '<select class="operator" style="width:45%;">';
        div += '<option class="equal" value="equal" >equals(=)</option>';
        div += '<option class="like" value="like">like</option>';
        div += '</select>';

        div += '<select class="equal" style="width:45%;">';
        data.forEach(function (d, i) {
            div += '<option value="' + d['value'] + '">';
            div += d['value'];
            div += '</option>'
        });
        div += '</select>';
        div += '<input type="text" class="like" style="display:none; width:45%;"/>'
        div += '</div>';

        container.append(div);

        var column = container.find('.filterColumn option:selected').attr('attrId');
        var columnNm = container.find('.filterColumn option:selected').attr('attrNm');
        var operator = container.find('select.operator option:selected').val();
        var value = container.find('select.equal option:selected').val();
        var text = column + ' : ' + value;
        
        // 조회할 컬럼명의 TOP1SEG일 경우
        var filter = "";
        if(that.checkTop1Seg(columnNm)) {
        	filter = " AND C." + column + " = '" + value + "'";
        }else if(that.checkAddrColumn(columnNm)){// 조회할 컬럼명이 주소정보일 경우	
        	filter = " AND A." + column + " = '" + value + "'";
    	
        }else if('TRD_NM'.indexOf(columnNm) >-1){// 조회할 컬럼명이 핵심상권	
        	filter = " AND M." + column + " = '" + value + "'";
    	
        } else {// 조회할 컬럼명의 TOP1SEG이 아닐 경우
//        	filter = " AND J." + column + " = '" + value + "'";
        	filter = " AND " + that.checkGetAlias( column)+column + " = '" + value + "'";
        }
        
        container.find('.filter.select').attr('column', column);
        container.find('.filter.select').attr('columnNm', columnNm);
        container.find('.filter.select').attr('operator', operator);
        container.find('.filter.select').attr('value', value);
        container.find('.filter.select').attr('filter', filter);
        container.find('.filter.select').attr('text', text);
    },

    /**
     * @description input박스 필터UI 생성하는 메소드
     * @param container{Object}: 필터리스트 UI를 생성하기 위해 필요한 jquery 오브젝트 
     */
    createInputUI: function (container) {
        var that = this;



        var column = container.find('.filterColumn option:selected').attr('attrId');
        var columnNm = container.find('.filterColumn option:selected').attr('attrNm');
        
        
        var div = '<div class="filter input">';
        div += '<select class="operator" style="width:45%;">';
        div += '<option class="equal" value="equal" >equals(=)</option>';
        div += '<option class="like" value="like">like</option>';
        if(columnNm == "Account code"){
        	div += '<option class="in" value="in" >in</option>';
        	div += '<option class="trdarea" value="trdarea" >핵심상권</option>';
        }
        div += '</select>';

        div += '<input type="text" class="value" style="width:45%;"/>'
        div += '</div>';

        container.append(div);

        
        
        var operator = container.find('select.operator option:selected').val()
        var value = container.find('input.value').val();
        var text = column + ' : ' + value;

        // 조회할 컬럼명의 TOP1SEG일 경우
        var filter= "";
        if(that.checkTop1Seg(columnNm)) {
        	filter = " AND C." + column + " = '" + value + "'";
        }else if(that.checkAddrColumn(columnNm)){// 조회할 컬럼명이 주소정보일 경우	
        	filter = " AND A." + column + " = '" + value + "'";
    	// 조회할 컬럼명의 TOP1SEG이 아닐 경우
        }else if('TRD_NM'.indexOf(columnNm) >-1){// 조회할 컬럼명이 핵심상권	
        	filter = " AND M." + column + " = '" + value + "'";
    	
        } else {
        	filter = " AND " + that.checkGetAlias( column)+column + " = '" + value + "'";
        }         

        container.find('.filter.input').attr('column', column);
        container.find('.filter.input').attr('columnNm', columnNm);
        container.find('.filter.input').attr('operator', operator);
        container.find('.filter.input').attr('value', value);
        container.find('.filter.input').attr('filter', filter);
        container.find('.filter.input').attr('text', text);
    },

    /**
     * @description Tier 컬럼에 대한 특정 필터UI 생성하는 메소드
     * @param data{Array}: UI생성시 필요한 데이터 
     * @param container{Object}: 필터리스트 UI를 생성하기 위해 필요한 jquery 오브젝트 
     */
    createTierUI: function (data, container) {

        var div = '<div class="filter Tier" style="height:95px;">';
        
        data.forEach(function (d, i) {
            if (i === 0 || i === 4) {
                div += '<ul class="tier">';
            }

            if (i === 0) {
                div += '<li class="on" value="T' + d['value'] + '">';
            } else {
                div += '<li value="T' + d['value'] + '">';
            }

            div += 'T' + d['value'];
            div += '</li>'

            if (i === 3 || i === 7) {
                div += '</ul>';
            }
        });

        container.append(div);

        var column = container.find('.filterColumn option:selected').attr('attrId');
        var columnNm = container.find('.filterColumn option:selected').attr('attrNm');
        var value = container.find('li').eq(0).attr('value');
        var filter = " AND J." + column + " IN ('" + value.replace('T', 1) + "')";   // DB쿼리 필터조건
        var text = column + ' : ' + value;

        container.find('.filter.Tier').attr('column', column);
        container.find('.filter.Tier').attr('columnNm', columnNm);
        container.find('.filter.Tier').attr('value', value);
        container.find('.filter.Tier').attr('filter', filter);
        container.find('.filter.Tier').attr('text', text);
    },

    /**
     * @description Number타입에 대한 RangeSlide 필터UI 생성하는 메소드
     * @param data{Array}: UI생성시 필요한 데이터 
     * @param container{Object}: 필터리스트 UI를 생성하기 위해 필요한 jquery 오브젝트 
     */
    createRangeUI: function (data, container) {
    	var that = this;
        var input = '<div class="filter range">';
        input += '<input type="text" class="min" style="width:45%;"/>';
        input += '<span>~</span>';
        input += '<input type="text" class="max" style="width:45%;"/>';
        input += '<div id="rangeslider" style="width:257px;"><input /><input /></div>';
        input += '</div>';

        container.append(input);

        var max = parseFloat(data[0].maxVal);
        var min = parseFloat(data[0].minVal);
        var value = parseFloat(data[0].value);

        // 숫자가 아닌겨우 초기
        if (isNaN(max)) {
            max = 1;
        }
        
        // 숫자가 아닌겨우 초기
        if (isNaN(min)) {
            min = 0;
        }
        
        // 숫자가 아닌겨우 초기
        if (isNaN(value)) {
            value = 1;
        }

        container.find('.min').val(min);
        container.find('.max').val(max);

        container.find("#rangeslider").kendoRangeSlider({
            min: min,
            max: max,
            smallStep: Math.round(max - min) / 5,
            largeStep: Math.round(max - min) / 5,
            selectionEnd: max,
            tickPlacement: "both",
            tooltip: {
                format: "{0:#,#.####}"
            },
            showButtons: false,
            slide: function (event) {
                var min = event.value[0];
                var max = event.value[1];

                container.find('.min').val(min);
                container.find('.max').val(max);
            },
            change: function (event) {
                var column = container.find('.filterColumn option:selected').attr('attrId');
                var columnNm = container.find('.filterColumn option:selected').attr('attrNm');

                var min = event.value[0];
                var max = event.value[1];
                var value = min + ',' + max;
                var text = columnNm + ' : ' + min + ' ~ ' + max;

                var filter = " AND J." + column + " BETWEEN " + min + " AND " + max;   // DB쿼리 필터조건
                
                container.find('.filter.range').attr('column', column);
                container.find('.filter.range').attr('columnNm', columnNm);
                container.find('.filter.range').attr('value', value);
                container.find('.filter.range').attr('filter', filter);
                container.find('.filter.range').attr('text', text);
            }
        });

        // min, max 입력 이벤트(debounce 추가)
        container.find('.max,.min').keyup(_.debounce(function(e) {
        	var max = parseFloat(container.find('.max').val());   // input값에 들어있는 max값 가져옴
        	var min = parseFloat(container.find('.min').val());   // input값에 들어있는 min값 가져옴
        	var slider = container.find("#rangeslider").getKendoRangeSlider();   // rangeSlider 객체 가져옴

        	slider.values(min, max);   // 가져온 min, max값으로 세팅
        	
        	// 필터 세팅
        	var value = min + ',' + max;
            var text = columnNm + ' : ' + min + ' ~ ' + max;

            var filter = " AND J." + column + " BETWEEN " + min + " AND " + max;   // DB쿼리 필터조건
            
            container.find('.filter.range').attr('column', column);
            container.find('.filter.range').attr('columnNm', columnNm);
            container.find('.filter.range').attr('value', value);
            container.find('.filter.range').attr('filter', filter);
            container.find('.filter.range').attr('text', text);
        	
        }, 600));
        
        var column = container.find('.filterColumn option:selected').attr('attrId');
        var columnNm = container.find('.filterColumn option:selected').attr('attrNm');
        var value = min + ',' + max;
        
        var filter = " AND J." + column + " BETWEEN " + min + " AND " + max;   // DB쿼리 필터조건
        var text = column + ' : ' + min + ' ~ ' + max;

        container.find('.filter.range').attr('column', column);
        container.find('.filter.range').attr('columnNm', columnNm);
        container.find('.filter.range').attr('value', value);
        container.find('.filter.range').attr('filter', filter);
        container.find('.filter.range').attr('text', text);
    },

    /**
     * @description geometry타입에 대한 특정 필터UI 생성하는 메소드
     * @param container{Object}: 필터리스트 UI를 생성하기 위해 필요한 jquery 오브젝트 
     */
    createGeomUI: function (container) {
        var that = this;
        var column = container.find('.filterColumn').val();
        var columnNm = container.find('.filterColumn option:selected').attr('attrNm');
        
        
        var div = '<div class="filter geom" column="' + column + '" columnNm="' + columnNm + '">';
        div += '<select class="operator" style="width:45%;">';
        div += '<option class="contains" value="contains" >contains</option>';
        div += '<option class="intersects" value="intersects">intersects</option>';
        div += '<option class="disjoint" value="disjoint">disjoint</option>';
        div += '<option class="touches" value="intersects">touches</option>';
        div += '</select>';

        div += '<div class="draw_g">';
        div += '<span class="geomCnt draw_num" >0개</span>';
        div += '<span class="draw circle" ></span>';
        div += '<span class="draw rectangle" ></span>';
        div += '<span class="draw polygon"></span></div>';
        div += '</div>';
        container.append(div);

    },
    /**
     * @description vector 원을 그리는 메소
     * @param container{Object}: 필터리스트 UI를 생성하기 위해 필요한 jquery 오브젝트
     */
    drawCircle: function (container) {
        var that = omsMain['filterEdit'];

        omsMain.selfmap.drawCircle({}, function (circle) {
            var geoms = [];
            var value = container.attr('value');
            var column = container.find('.filterColumn').val();
            var columnNm = container.find('.filterColumn option:selected').attr('attrNm');
            var operator = container.find('.operator').val();

            if (value) {
                geoms = JSON.parse(value);
            }

            var obj = {
                type: circle['type'],
                id: circle['vector_id'],
                radius: circle['radius'],
                center: circle['centerKatec']
            };

            geoms.push(obj);
            var filter = that.getGeomFilter(operator, geoms);

            if (geoms['length'] === 0) {
                var text = 'GEOMETRY : 원';
            } else {
                var text = 'GEOMETRY : 원 외 ' + geoms['length'] + '개';
            }

            omsMain.selfmap.addVectorShape({ id: circle['vector_id'] });
            container.attr('column', column);
            container.attr('columnNm', columnNm);
            container.attr('operator', operator);
            container.attr('value', JSON.stringify(geoms));
            container.attr('filter', filter);
            container.attr('text', text);
            container.find('.geomCnt').text(geoms['length'] + '개');
            
            $(container.context).removeClass("on");
        });
    },

    /**
     * @description vector 사각을 그리는 메소
     * @param container{Object}: 필터리스트 UI를 생성하기 위해 필요한 jquery 오브젝트
     */
    drawRectangle: function (container) {
        var that = omsMain['filterEdit'];

        omsMain.selfmap.drawRectangle({}, function (rectangle) {
            var geoms = [];
            var value = container.attr('value');
            var column = container.find('.filterColumn').val();
            var columnNm = container.find('.filterColumn option:selected').attr('attrNm');
            var operator = container.find('.operator').val();

            if (value) {
                geoms = JSON.parse(value);
            }

            var obj = {
                type: rectangle['type'],
                id: rectangle['vector_id'],
                wktKatec: rectangle['wktKatec'],
            };

            geoms.push(obj);
            var filter = that.getGeomFilter(operator, geoms);

            if (geoms['length'] === 0) {
                var text = 'GEOMETRY : 사각형';
            } else {
                var text = 'GEOMETRY : 사각형 외 ' + geoms['length'] + '개';
            }

            omsMain.selfmap.addVectorShape({ id: rectangle['vector_id'] });
            container.attr('column', column);
            container.attr('columnNm', columnNm);
            container.attr('operator', operator);
            container.attr('value', JSON.stringify(geoms));
            container.attr('filter', filter);
            container.attr('text', text);
            container.find('.geomCnt').text(geoms['length'] + '개');
            $(container.context).removeClass("on");
        });
    },

    /**
     * @description vector 다각형을 그리는 메소
     * @param container{Object}: 필터리스트 UI를 생성하기 위해 필요한 jquery 오브젝트
     */
    drawPolygon: function (container) {
        var that = omsMain['filterEdit'];

        omsMain.selfmap.drawPolygon({}, function (polygon) {
            var geoms = [];
            var value = container.attr('value');
            var column = container.find('.filterColumn').val();
            var columnNm = container.find('.filterColumn option:selected').attr('attrNm');
            var operator = container.find('.operator').val();

            if (value) {
                geoms = JSON.parse(value);
            }

            var obj = {
                type: polygon['type'],
                id: polygon['vector_id'],
                wktKatec: polygon['wktKatec'],
            };

            geoms.push(obj);
            var filter = that.getGeomFilter(operator, geoms);

            if (geoms['length'] === 0) {
                var text = 'GEOMETRY : 다각형';
            } else {
                var text = 'GEOMETRY : 다각형 외 ' + geoms['length'] + '개';
            }

            omsMain.selfmap.addVectorShape({ id: polygon['vector_id'] });
            container.attr('column', column);
            container.attr('columnNm', columnNm);
            container.attr('operator', operator);
            container.attr('value', JSON.stringify(geoms));
            container.attr('filter', filter);
            container.attr('text', text);
            container.find('.geomCnt').text(geoms['length'] + '개');
            $(container.context).removeClass("on");
        });
    },

    /**
     * @description 실제 공간연산 DB쿼리 조건을 만드는 메소드
     * @param operator{String} 공간연산할 함수명
     * @param geom{Object} 쿼리를 만드는데 필요한 데이터
     */
    getGeomFilter: function (operator, geom) {
        var that = this;
        var filter = ' AND ';
        var geomVal = '';


        for (i = 1; i < geom['length']; i++)
            geomVal += 'SDO_GEOM.SDO_UNION(';

        for (i = 0; i < geom['length']; i++) {
            if (i > 1)
                geomVal += ', 0.01)';
            if (i > 0)
                geomVal += ',';
            geomVal += that.makeGeomFilter(geom[i]);
        }

        if (geom['length'] > 1) {
            geomVal += ', 0.01)';
        }

//        filter += "SDO_GEOM.RELATE(" + geomVal + ", 'DETERMINE',SDO_UTIL.FROM_WKTGEOMETRY('POINT('|| A.X_AXIS ||' '|| A.Y_AXIS||')'),0.1) = '" + operator.toUpperCase() + "'";

        filter += "SDO_GEOM.RELATE(" + geomVal + ",'DETERMINE',SDO_UTIL.FROM_WKTGEOMETRY('POINT(' || A.X_AXIS || ' ' || A.Y_AXIS || ')'),0.1) = '" + operator.toUpperCase() + "'";
        filter += "AND A.X_AXIS BETWEEN ROUND(SDO_GEOM.SDO_MIN_MBR_ORDINATE(" + geomVal + ",1)) AND ROUND(SDO_GEOM.SDO_MAX_MBR_ORDINATE(" + geomVal + ",1))";
        filter += "AND A.Y_AXIS BETWEEN ROUND(SDO_GEOM.SDO_MIN_MBR_ORDINATE(" + geomVal + ",2)) AND ROUND(SDO_GEOM.SDO_MAX_MBR_ORDINATE(" + geomVal + ",2))";
        	
        	
        return filter;
    },

    /**
     * @description shape에 맞는 쿼리 만드는 메소드
     * @param geom{Object} 쿼리를 만드는데 필요한 데이터 
     */
    makeGeomFilter: function (geom) {
        switch (geom['type']) {
            case 'mbr':
                break;
            case 'circle':
                center = geom['centerKatec'];
                return 'SDO_GEOMETRY(2003, NULL, NULL, SDO_ELEM_INFO_ARRAY(1,1003,4), SDO_ORDINATE_ARRAY(' +
                    (geom['center'][0] - geom['radius']) + ',' + geom['center'][1] + ',' +
                    geom['center'][0] + ',' + (geom['center'][1] + geom['radius']) + ',' +
                    (geom['center'][0] + geom['radius']) + ',' + geom['center'][1] + '))';
            case 'polygon':
                return "SDO_GEOMETRY('" + geom['wktKatec'] + "')";
            case 'rectangle':
                return "SDO_GEOMETRY('" + geom['wktKatec'] + "')";
        }
    },
    lpad: function(str, padLen, padStr) {
        if (padStr.length > padLen) {
            console.log("오류 : 채우고자 하는 문자열이 요청 길이보다 큽니다");
            return str;
        }
        str += ""; // 문자로
        padStr += ""; // 문자로
        while (str.length < padLen)
            str = padStr + str;
        str = str.length >= padLen ? str.substring(0, padLen) : str;
        return str;
    }
};

omsMain['filterEdit'] = filterEdit;
filterEdit.init();