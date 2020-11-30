var resultReport = {
		
    jq: undefined,
    
    init: function () {

        var that = this;
        that.jq = $('#resultReport');

        that.jq.find('.btn_close').click(function () {
            that.close();
        });

        that.jq.find('#btn_resultReport_report').click(function () {
            omsMain.resultReportTable.open();
        });
    },

    open: function () {
        var that = this;
        that.jq.show("slide", { direction: "right" }, 300);
    },

    close: function () {
        var that = this;
        that.jq.hide("slide", { direction: "right" }, 300);
    },

    /**
     * @description 우측 resultReport에서 수평바를 그리는 차트
     * @params data: Object
     */
    createHorizenBarChart: function (data) {
    	
        if (!data) {
            alert('HorizenBarChart 그릴 데이터가 없습니다!');
            return;
        }
        
        var that = this;

        that.jq.find("#chart_resultReport_summary").kendoChart({
            chartArea: {
                background: "#FFF"
            },
            title: {
                text: "결과 요약",
                visible: false
            },
            legend: {
                visible: false
            },
            seriesDefaults: {
                type: "bar",
                stack: true,
                labels: {
                    visible: false,
                    background: "transparent",
                    template: "#= category #: \n #= value#%"
                },
                gap: 0.5
                /*border: {
                    width: 0
                }*/
            },
            series: data['series'],
            valueAxis: {
                visible: false,
                line: {
                    visible: false
                },
                minorGridLines: {
                    visible: false
                },
                majorGridLines: {
                    visible: false
                }
            },
            categoryAxis: {
                categories: data['categoriesData'][0],
                minorGridLines: {
                    visible: false
                },

                majorGridLines: {
                    visible: false
                },
                line: {
                    visible: false
                },
                labels: {
                    "font-size": "11px",
                    margin: 0,
                    padding: 0,
                    margin: {
                        right: -6 //-12
                    },
                    cursor: "pointer"
                }
            },
            tooltip: {
                visible: true,
                color: "black",
                template: "#= series.name #: #= value #"
            },
            // 행정동 클릭 이벤트
            axisLabelClick: function (e) {
            	
            	var selectIdx = data["categoriesData"][0].indexOf(e.value);   // 선택된 행정동의 매핑되는 인덱스 가져옴
                var id = data["categoriesData"][1][selectIdx];
                
            	$.ajax(jtiConfig['mapserverUrl'] + '/data/mapper.json', {
            		data: {
            			id: id,
            			sqlId: 'om.comp.regionMbr'
            		},
                    type: 'post',
                    success: function (result) {
                    	
                    	var bounds = [
                    		result[0]['xmin'],
                    		result[0]['ymin'],
                    		result[0]['xmax'],
                    		result[0]['ymax'],
                    	];

                        omsMain.selfmap.setBounds(bounds, 'katec');
                    },
                    error: function(a, b, c) {
//                    	console.log(a);
//                    	console.log(b);
//                    	console.log(c);
                    }
            	});
            }
        });
    },

    createHistogram: function (data) {
    	
    	if (!data) {
            alert('히스토그램을 그릴 데이터가 없습니다!');
            return;
        }
    	
        var that = this;

        that.jq.find("#resultReport_body_histogram_graph").kendoChart({
            chartArea: {
                background: "#FFF",
                height: 150
            },
            legend: {
                visible: true,
                position: "bottom",
                align: "start",
                width: 250,
                labels: {
                    font: "13px sans-serif"
                }
            },
            seriesDefaults: {
                type: "column",
                stack: false,
                gap: 1
            },
            series: data['series'],
            valueAxis: {
                max: data['max'],
                min: data['min'],
                visible: false,
                line: {
                    visible: false
                },
                minorGridLines: {
                    visible: false
                },
                majorGridLines: {
                    visible: false
                }
            },
            tooltip: {
                visible: true,
                color: "black",
                template: "#= series.name #: #= value #"
            }
        });
    },

    /**
     * @description HorizenBarChart 데이터 정제 및 차트 그리는 메소드
     */
    changeHorizenBarChart: function (params) {
    	
        if (!params) {
            alert('HorizenBarChart 그릴 파라미터가 없습니다.');
            return;
        }

        var that = this;
        var equal = params['equal'];
        $.ajax(jtiConfig['mapserverUrl'] + '/data/mapper.json', {
            data: params,
            type: 'post',
            success: function (result) {
            	
            	if(result.length < 1) {
            		return;
            	}
            	
                omsMain.resultReportTable.changeTable(result, equal);

                var seriesData = [];
                var categoriesData = [[], [], [], []];
                var defaultColor = ["#2ad2bb", "#f0c553", "#6866ba"];
                var maxValue = 180;
                var combinedData = [];
                var data = {};

                result.forEach(function (item) {

                    var totalContentsValue = 0;

                    if (categoriesData[1].indexOf(item.areaId) === -1) {
                        categoriesData[0].push(item.areaName);
                        categoriesData[1].push(item.areaId);
                        categoriesData[2].push(item.xAxis);
                        categoriesData[3].push(item.yAxis);
                    }

                    if (item.id != "COMBINED_CONTENTS") {
                        var pushData = '';
                        if (equal) {
                            pushData = item['realValue'];
                        } else {
                            pushData = item['trnsValue'];
                        }

                        totalContentsValue += pushData;

                        var isAdded = false;
                        seriesData.forEach(function (series, index) {
                            if (series.name == item.contentsName) {
                                isAdded = true;
                                series.color = defaultColor[index];
                                series.data.push(pushData);
                            }
                        });

                        if (isAdded == false) {
                            var series = {};
                            series.name = item.contentsName;
                            series.color = defaultColor[seriesData.length];
                            series.data = [];
                            series.data.push(pushData);
                            seriesData.push(series);
                        }
                    } else {
                        combinedData.push(item);
                    }

                    if (totalContentsValue > maxValue) {
                        maxValue = totalContentsValue;
                    }
                });

                data['series'] = seriesData;
                data['categoriesData'] = categoriesData;
                that.createHorizenBarChart(data);
            },
            error: function (result) { },
        });
    },

    /**
     * @description 히스토그램 데이터 정제 및 차트 그리는 메소드
     */
    changeHistogram: function (params) {
    	
    	if (!params) {
            alert('histogram 그릴 파라미터가 없습니다.');
            return;
        }
    	
		var that = this;
		var min = 9999999999, max = -9999999999;
		var data = {
				series: [],
				max: 0,
				min: 0
		};
		
		params['colorMap'].forEach(function (p) {
			data['series'].push({
				name: p.min + '~' + p.max,
				data: [p.value],
				color: p.color
			});
			
			if (min > p.value)
				min = p.value;
			if (max < p.value)
				max = p.value;
		});
		
		data['max'] = max;
		data['min'] = (params['method'] === 'quantile') ? 0 : min;
		
		that.createHistogram(data);
    }
};

omsMain['resultReport'] = resultReport;

resultReport.init();