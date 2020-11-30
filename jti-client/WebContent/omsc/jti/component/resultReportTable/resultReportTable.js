/**
 * @description 컨텐츠 생성 결과 자세히 보기 테이블 컴포넌트 
 */
var resultReportTable = {

	jq: undefined,   // 이 컴포넌트의 jqeury 루트 선택자  

	/**
	 * @description 컴포넌트 초기화 메소드 
	 */ 
	init: function() {
		var that = this;
		
		that.jq = $('#resultReportTable');   // 이 컴포넌트의 jqeury 루트 선택자 

		// 우측 x버튼 클릭시 이 컴포넌트 닫기 
		that.jq.find('#btn_resultReportTable_close').click(function() {
			that.close();
		});

		that.createTable();   // table 생성
	},

	/**
	 * @description 이 컴포넌트 여는 메소드 
	 */
	open: function() {
		
        var that = this;
        that.jq.show("slide", { direction: "right" }, 300);
    },

    /**
	 * @description 이 컴포넌트 는 메소드 
	 */
    close: function() {
        var that = this;
        that.jq.hide("slide", { direction: "right" }, 300);
	},
	
	/**
	 * @description 테이블 생성하는 메소드  
	 */
	createTable: function() {
		var that = this;
		
		// 켄도 그리드를 사용하여 테이블 그림 
		that.jq.find('.resultReportTable_body_dataset').kendoGrid({
			columns: [
			  { field: "name" },
			  { field: "code" },
			  { field: "value" }
			],
			dataSource: [
				{ name: "강서구", code: 1145, value: 5000},
				{ name: "강서구", code: 1145, value: 5000},
				{ name: "강서구", code: 1145, value: 5000}
			]
		});
		
		var grid = $(".resultReportTable_body_dataset").data("kendoGrid");
		grid.setOptions({
			  sortable: true
		});

		that.jq.find('.k-link').eq(0).text('이름');
		that.jq.find('.k-link').eq(1).text('지역 코드');
		that.jq.find('.k-link').eq(2).text('합쳐진 컨텐츠 값');
	},

	/**
	 * @description 테이블 데이터 변경하는 메소드 
	 * @params data{}: 변경할 테이블 데이터 
	 * 		   equal{Boolean, defualt true}: 선택된 컨텐츠의 그룹이 같은지의 여부 
	 */
	changeTable: function(data, equal) {

		if(!data) {
			alert('테이블을 그리기위한 데이터가 없습니다.');
			return;
		}

		var that = this;
		var grid = $(".resultReportTable_body_dataset").data("kendoGrid");

		var dataNm = data[0]['contentsName'].replace(/ /gi, "");   // 컨텐츠이름 
        var dataUnit = '';   // table header에 표현되는 단위 
		var columns = [];
		var dataSource = [];

		// 선택된 컨텐츠의 그룹이 같을 경우 
        if (equal) {
            if (dataNm.indexOf("가구수") > 0) {
                dataUnit = '가구';
            } else if (dataNm.indexOf("인구수") > 0) {
                dataUnit = '명';
            } else if (dataNm.indexOf("업소수") > 0) {
                dataUnit = '개';
            }
        // 선택된 컨텐츠의 그룹이 다를 경우 %로 표시 
        } else {
            dataUnit = '%';
        }

        data.forEach(function (d, i) {

        	// 데이터가 존재하면서 지역명이 이전 데이터의 지역명과 같으면 return
			if(i > 0 && data[i-1]['areaName'] === d['areaName']) {
				return;
			}
			
			var obj = {};
			var value = '';
			
			// 선택된 컨텐츠의 그룹의 같을 경우 실제값과 해당 단위 표현 
            if (equal) {
                value = format(Math.round(d['combineValue'])) + dataUnit;
                
            // 선택된 컨텐츠의 그룹의 다를 경우 비율값과 %로 표현 
            } else {
                value = format(Math.round(d['combineRateValue'])) + dataUnit;
			}
			
			obj = {
				name: d['areaName'],
				code: d['areaId'],
				value: value
			}

			dataSource.push(obj);
		});
		
    	grid.setOptions({ dataSource: dataSource });
		grid.setOptions({ height: '70%' });
		
		that.jq.find('.k-link').eq(0).text('이름');
		that.jq.find('.k-link').eq(1).text('지역 코드');
		that.jq.find('.k-link').eq(2).text('합쳐진 컨테츠 값');
		that.jq.find('.k-grid-content').height('95%')
	}
};

omsMain['resultReportTable'] = resultReportTable;
resultReportTable.init();   // 이 컴포넌트 초기화 