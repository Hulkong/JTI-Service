var dashboard = {

	jq: $('.store_infor'),
	bkjq: $('.store_infor_src'),
	jtiInfoStoreCd: undefined,

	init: function() {
		var that = this;
//		that.jq = $('.store_infor');
//		that.bkjq = $('.store_infor').clone();
		that.jq.find('.btn_close').click(function() {
			that.close();
		});
	},

	open: function () {
        var that = this;
        that.jq.empty();
        that.jq.append(that.bkjq.html());
        this.init();
        that.jq.show("slide", { direction: "right" }, 300);
    },

    close: function () {
        var that = this;
        that.jq.hide("slide", { direction: "right" }, 300);
    },
};

omsMain['dashboard'] = dashboard;
dashboard.init();

//대쉬보드 대리점 코드, 이름 등 출력
function storeCode(prop) {
	omsMain.dashboard.jq.find('.storeCD').html(prop['STORE_CD']);
	omsMain.dashboard.jq.find('.storeName').html(prop['COL05']);
	omsMain.dashboard.jtiInfoStoreCd = prop['STORE_CD'];

	if (prop.col07 === undefined || prop.col07 == null) {
		//		omsMain.dashboard.jq.find('.convenienceStore').html(', 편의점이 아닙니다.');
	}
	else {
		omsMain.dashboard.jq.find('.convenienceStore').html(', ' + prop.col07);
	}
}

function setSummary(summary) {

	//	//console.log(summary)
	omsMain.dashboard.jq.find(".resi").addClass('grade' + summary.rspopTotTval);
	omsMain.dashboard.jq.find(".flow").addClass('grade' + summary.flpopTotTval);
	omsMain.dashboard.jq.find(".act").addClass('grade' + summary.trdActTotTval);
	omsMain.dashboard.jq.find(".adult").addClass('grade' + summary.storeAdultTval);
	omsMain.dashboard.jq.find(".store").addClass('grade' + summary.trdStaCstoreTval);

	// 근처에 지하철이 존재할 시
	if (summary.sisulSubwayYn == "Y") {
		omsMain.dashboard.jq.find(".toggle.subway").addClass('on');

		if (ul === undefined) {
			var ul = '<ul class="list"></ul>';
			omsMain.dashboard.jq.find(".subway dd").append(ul);
		}

		if (li === undefined) {
			for (var i = 0; i < summary.sisulSubwayCo; i++) {
				var li = $('<li></li>');
				omsMain.dashboard.jq.find(".list").append(li);
			}
			omsMain.dashboard.jq.find(".list li").eq(0).html(summary.sisulSubwayNm);

			if (summary.sisulSubway2Nm)
				omsMain.dashboard.jq.find(".list li").eq(1).html(summary.sisulSubway2Nm);
			if (summary.sisulSubway3Nm)
				omsMain.dashboard.jq.find(".list li").eq(2).html(summary.sisulSubway3Nm);
		}
	} else if (summary.sisulSubwayYn == "N") {
		omsMain.dashboard.jq.find(".sisulSubwayCo.exist").removeClass("exist");
		omsMain.dashboard.jq.find(".sisulSubwayCo").addClass("nonExist")
			.css("display", "inline-block")
			.css("margin-right", "0")
			.css("font-family", "arial")
			.css("font-size", "45px")
			.css("font-weight", "bold")
			.css("padding", "0 0 0 0")
			.css("color", "00b0f0")
			.css("vertical-align", "middle")
			.css("background", "none");
		omsMain.dashboard.jq.find(".sisulSubwayCo.nonExist").html("0");
	}

	// 근처에 대학교가 존재할 시
	if (summary.sisulUnivYn == "Y") {
		omsMain.dashboard.jq.find(".toggle.uni").addClass('on');

		if (summary.sisulUniv1Nm !== undefined) {
			var univerSity1 =
				'<tr>\
					<td><p class="sisulUniv1Nm"></p></td>\
					<td><p class="sisulUniv1StuCo"></p></td>\
				</tr>';

			omsMain.dashboard.jq.find('.university table tbody').append(univerSity1);
		}
		if (summary.sisulUniv2Nm !== undefined) {
			var univerSity2 =
				'<tr>\
					<td><p class="sisulUniv2Nm"></p></td>\
					<td><p class="sisulUniv2StuCo"></p></td>\
				</tr>';

			omsMain.dashboard.jq.find('.university table tbody').append(univerSity2);
		}
		if (summary.sisulUniv3Nm !== undefined) {
			var univerSity3 =
				'<tr>\
					<td><p class="sisulUniv3Nm"></p></td>\
					<td><p class="sisulUniv3StuCo"></p></td>\
				</tr>';

			omsMain.dashboard.jq.find('.university table tbody').append(univerSity3);
		}
	} else if (summary.sisulUnivYn == "N") {
		var univerSity =
			'<tr>\
				<td colspan="2"><p class="sisulUnivNm">근처에 대학교가 없습니다.</p></td>\
			</tr>';

		omsMain.dashboard.jq.find('.university table tbody').append(univerSity);
	}


	//	if(summary.sisulBusstopCo > 0)
	//		omsMain.dashboard.jq.find(".busStop").html("버스정류장# = " + summary.sisulBusstopCo);
	if (summary.sisulBusstopCo == 0 || summary.sisulBusstopCo === undefined) {
		omsMain.dashboard.jq.find(".sisulBusstopCo").html("0");
	}
	for (name in summary) {
		omsMain.dashboard.jq.find("." + name).html(summary[name]);
	}

	// 공백제거(거주인구, 유동인구)
	if (omsMain.dashboard.jq.find(".rspopTop1Profile").text() != null && omsMain.dashboard.jq.find(".rspopTop1Profile").text() != '' && omsMain.dashboard.jq.find(".rspopTop1Profile").text().match(/\s/g).length > 1)
		omsMain.dashboard.jq.find(".rspopTop1Profile").text(omsMain.dashboard.jq.find(".rspopTop1Profile").text().replace(" ", ""));

	if (omsMain.dashboard.jq.find(".flpopTop1Profile").text() != null && omsMain.dashboard.jq.find(".flpopTop1Profile").text() != '' && omsMain.dashboard.jq.find(".flpopTop1Profile").text().match(/\s/g).length > 1)
		omsMain.dashboard.jq.find(".flpopTop1Profile").text(omsMain.dashboard.jq.find(".flpopTop1Profile").text().replace(" ", ""));



}

// 유동인구 성/연령별 구성, 시간대별 추이
function flowpopSexTimeChart(chartdata) {

	var sexAge = [{
		"sex": "20대 이하",
		"male": chartdata.flpopM20Rval,
		"female": chartdata.flpopW20Rval
	}, {
		"sex": "30대",
		"male": chartdata.flpopM30Rval,
		"female": chartdata.flpopW30Rval
	}, {
		"sex": "40대",
		"male": chartdata.flpopM40Rval,
		"female": chartdata.flpopW40Rval
	}, {
		"sex": "50대",
		"male": chartdata.flpopM50oRval,
		"female": chartdata.flpopW50oRval
	}];

	var time = [{
		"time": "06~09",
		"flowpop": chartdata.flpopT0609Rval
	}, {
		"time": "09~12",
		"flowpop": chartdata.flpopT0912Rval
	}, {
		"time": "12~14",
		"flowpop": chartdata.flpopT1214Rval
	}, {
		"time": "14~18",
		"flowpop": chartdata.flpopT1418Rval
	}, {
		"time": "18~20",
		"flowpop": chartdata.flpopT1820Rval
	}, {
		"time": "20~22",
		"flowpop": chartdata.flpopT2022Rval
	}, {
		"time": "22~00",
		"flowpop": chartdata.flpopT2200Rval
	}, {
		"time": "00~02",
		"flowpop": chartdata.flpopT0002Rval
	}, {
		"time": "02~04",
		"flowpop": chartdata.flpopT0204Rval
	}, {
		"time": "04~06",
		"flowpop": chartdata.flpopT0406Rval
	}];

	$("#flowpopsex").kendoChart({
		dataSource: {
			data: sexAge
		},
		title: {
			text: "한달 성/연령별 구성 (명)"
		},
		legend: {
			position: "bottom"
		},
		seriesDefaults: {
			type: "column"
		},
		series: [{
			field: "male",
			name: "남자",
			stack: "tot",
			noteTextField: "extremum",
			notes: {
				label: {
					position: "outside"
				},
				position: "bottom"
			}
		}, {
			field: "female",
			name: "여자",
			stack: "tot",
			notes: {
				label: {
					position: "outside"
				},
				position: "bottom"
			}
		}],
		seriesColors: ["#00b0f0", "#ff5050"],
		valueAxis: {
			line: {
				visible: false
			}

		},
		categoryAxis: {
			categories: ["20대", "30대", "40대", "50대 이상"],
			majorGridLines: {
				visible: false
			}
		},
		tooltip: {
			visible: true,
			template: "#= series.field #: #= value #",
			color: "#ffffff"
		}
	});

	$("#flowpoptime").kendoChart({
		dataSource: {
			data: time
		},
		title: {
			text: "하루 시간대별 추이 (명)"
		},
		legend: {
			position: "bottom"
		},
		seriesDefaults: {
			type: "line"
		},
		series: [{
			field: "flowpop",
			name: "유동인구",
			noteTextField: "extremum",
			notes: {
				label: {
					position: "outside"
				},
				position: "bottom"
			}
		}],
		valueAxis: {
			line: {
				visible: false
			}
		},
		seriesColors: ["#00b0f0"],
		categoryAxis: {
			field: "time",
			labels: {
				rotation: 90,
				font: "bold 10px Helvetica"
			},
			majorGridLines: {
				visible: false
			}
		},
		tooltip: {
			visible: true,
			template: "#= series.name #: #= value #",
			color: "#ffffff"
		}
	});
}

//거주인구 성/연령별 구성
function rspopChart(chartdata) {

	var sexAge = [{
		"sex": "18~29",
		"male": chartdata.rspopM1829Rval,
		"female": chartdata.rspopW1829Rval
	}, {
		"sex": "30~39",
		"male": chartdata.rspopM30Rval,
		"female": chartdata.rspopW30Rval
	}, {
		"sex": "40~49",
		"male": chartdata.rspopM40Rval,
		"female": chartdata.rspopW40Rval
	}, {
		"sex": "50대 이상",
		"male": chartdata.rspopM50oRval,
		"female": chartdata.rspopW50oRval
	}];

	$("#rspopchart").kendoChart({
		dataSource: {
			data: sexAge
		},
		title: {
			text: "성/연령별 구성(명)"
		},
		legend: {
			position: "bottom"
		},
		seriesDefaults: {
			type: "column"
		},
		series: [{
			field: "male",
			name: "남자",
			stack: "tot",
			noteTextField: "extremum",
			notes: {
				label: {
					position: "outside"
				},
				position: "bottom"
			}
		}, {
			field: "female",
			name: "여자",
			stack: "tot",
			noteTextField: "extremum",
			notes: {
				label: {
					position: "outside"
				},
				position: "bottom"
			}
		}],
		seriesColors: ["#00b0f0", "#ff5050"],
		categoryAxis: {
			categories: ["20대", "30대", "40대", "50대 이상"],
			majorGridLines: {
				visible: false
			}
		},
		tooltip: {
			visible: true,
			template: "#= series.field #: #= value #",
			color: "#ffffff"
		}
	});
}
//주택특성 주택종류별
function houscntChart(chartdata) {

	// 주택 종류별
	var apartment = [{
		//		"house" : "아파트",
		"apart": chartdata.houscntARval,
	}, {
		//		"house" : "빌라",
		"villa": chartdata.houscntVRval,
	}, {
		//		"house" : "단독주택",
		"dandok": chartdata.houscntDdRval,
	}, {
		//		"house" : "다가구단독주택",
		"dagagu": chartdata.houscntDgRval,
	}];

	$("#houscnt").kendoChart({
		dataSource: {
			data: apartment
		},
		title: {
			text: "주택종류별(가구수)"
		},
		legend: {
			position: "bottom"
		},
		series: [{
			field: "apart",
			name: "아파트"
		}, {
			field: "villa",
			name: "빌라"
		}, {
			field: "dandok",
			name: "단독"
		}, {
			field: "dagagu",
			name: "다가구"
		}, {
			field: "opistel",
			name: "오피스텔"
		}],
		categoryAxis: {
			field: "house",
			majorGridLines: {
				visible: false
			}
		},
		valueAxis: {
			line: {
				visible: false
			}
		},
//		seriesColors: ["#00b0f0", "#0093f0", "#0067d0", "#3353ca", "#1741ab"],
		seriesColors: ["#9756d4", "#ecaada", "#6299e4", "#d68268", "#00b3b4"],
		tooltip: {
			visible: true,
			format: "N0",
			color: "#ffffff"
		}
	});
}

// 주택특성 면적
function housewidthChart(chartdata) {
	// 면적별
	var widthproperty = [{
		category: "66m2 이하",
		value: chartdata.housrtoA66uRval,
		color: "#90bfff"
	}, {
		category: "98m2 이하",
		value: chartdata.housrtoA98uRval,
		color: "#6299e4"
	}, {
		category: "132m2 이하",
		value: chartdata.housrtoA132uRval,
		color: "#ecaada"
	}, {
		category: "165m2 이하",
		value: chartdata.housrtoA165uRval,
		color: "#d37199"
	}, {
		category: "198m2 이하",
		value: chartdata.housrtoA198uRval,
		color: "#d595f4"
	}, {
		category: "330m2 이하",
		value: chartdata.housrtoA330oRval,
		color: "#9756d4"
	}, {
		category: "330m2 이상",
		value: chartdata.housrtoA330uRval,
		color: "#8936a3"
	}];

	$("#housewidth").kendoChart({

		dataSource: {
			data: widthproperty,
		},
		title: {
			text: "면적"
		},
		legend: {
			position: "right"
		},
		seriesDefaults: {
			labels: {
				visible: false,
				background: "transparent",
				/* template: "#= category #: \n #= value#%" */
			},
            overlay: {
                gradient: "none"
            }
		},
		series: [{
			type: "pie",
			startAngle: 150,
			data: widthproperty
		}],
		tooltip: {
			visible: true,
			format: "{0}%",
			color: "#ffffff"
		},
		valueAxis: {
			line: {
				visible: false
			}
		},
	});
}

// 주택특성 가격
function housecostChart(chartdata) {

	// 가격별
	var cost = [{
		category: "100 이하",
		value: chartdata.housrtoP100uRval,
		color: "#e8bdcc"
	}, {
		category: "100~200",
		value: chartdata.housrtoP200uRval,
		color: "#d58ca5"
	}, {
		category: "200~300",
		value: chartdata.housrtoP300uRval,
		color: "#ffd09d"
	}, {
		category: "300~500",
		value: chartdata.housrtoP500uRval,
		color: "#fb9659"
	}, {
		category: "500~700",
		value: chartdata.housrtoP700uRval,
		color: "#ef5e4f"
	}, {
		category: "700~900",
		value: chartdata.housrtoP900uRval,
		color: "#75d6db"
	}, {
		category: "900 이상",
		value: chartdata.housrtoP900oRval,
		color: "#00b3b4"
	}];

	$("#housecost").kendoChart({
		dataSource: {
			data: cost,
		},
		title: {
			text: "가격"
		},
		legend: {
			position: "right"
		},
		seriesDefaults: {
			labels: {
				visible: false,
				background: "transparent",
			},
            overlay: {
                gradient: "none"
            }
		},
		series: [{
			type: "pie",
			startAngle: 150,
			data: cost
		}],
		tooltip: {
			visible: true,
			color: "#ffffff"
		},
		valueAxis: {
			line: {
				visible: false
			}
		},
	});
}

//상권특성
function baseBarOption() {

	return {
		title: {
			text: "상가 업소 수"
		},
		legend: {
			visible: false
		},
		seriesDefaults: {
			type: "bar",
			labels: {
				visible: true
			}
		},
		series: [{
			name: "Total Visits",
			data: []
		}],
		valueAxis: {
			line: {
				visible: false
			},
			minorGridLines: {
				visible: true
			},
			labels: {
				rotation: "auto"
			}
		},
		categoryAxis: {
			categories: [],
			majorGridLines: {
				visible: false
			}
		},
		seriesColors: ["#00b0f0"],
		tooltip: {
			visible: true,
			template: "#= series.name #: #= value #",
			color: "#ffffff"
		}
	};
}

function storeRvalChart(chartdata) {

	var objLength = Object.keys(chartdata).length;
	objLength = (objLength - 3) / 4;

	//해당블록 상권업소 수
	var chartOption = baseBarOption();
	chartOption.series = [];
	chartOption.categoryAxis.categories = [];
	var serie = {
		name: "상가 업소 수",
		data: []
	};

	chartOption.valueAxis.max = 100;
	chartOption.chartArea = { margin: { right: 30 } };

	for (var i = 1; i < objLength + 1; i++) {
		serie.data.push(Number(chartdata["storeTop" + i + "Tval"]));
		chartOption.categoryAxis.categories.push(chartdata["storeTop" + i + "Nm"]);
	}
	chartOption.series.push(serie);

	$("#storeRval").kendoChart(chartOption);

	//시도별 상권업소 수
	chartOption = baseBarOption();
	chartOption.series = [];
	chartOption.categoryAxis.categories = [];
	chartOption.title.text = "상가 업소 수 (비교 지수)";
	chartOption.valueAxis.plotBands = [{
		from: 1,
		to: 1.01,
		color: "#c00",
		opacity: 0.8
	}];
	var serie = {
		name: "상가 업소 수",
		data: []
	};

	for (var i = 1; i < objLength + 1; i++) {
		serie.data.push(Number(chartdata["megaStoreTop" + i + "Tval"]));
		chartOption.categoryAxis.categories.push(chartdata["megaStoreTop" + i + "Nm"]);
	}
	chartOption.series.push(serie);
	$("#siRval").kendoChart(chartOption);

}

function storeActiveChart(chartdata) {

	var objLength = Object.keys(chartdata).length;
	objLength = (objLength - 5) / 4;

	//해당블록 상권 활성도
	var chartOption = baseBarOption();
	chartOption.title.text = "상권 활성도 (지수)";
	chartOption.series = [];
	chartOption.categoryAxis.categories = [];

	var serie = {
		name: "상권 활성도",
		data: []
	};

	for (var i = 1; i < objLength + 1; i++) {
		serie.data.push(Number(chartdata["trdActTop" + i + "Tval"]));
		chartOption.categoryAxis.categories.push(chartdata["trdActTop" + i + "Nm"]);
	}

	chartOption.series.push(serie);
	$("#storeActive").kendoChart(chartOption);

	//시도별 상권 활성도
	chartOption = baseBarOption();
	chartOption.title.text = "상권 활성도(비교 지수)";
	chartOption.series = [];
	chartOption.categoryAxis.categories = [];
	chartOption.valueAxis.plotBands = [{
		from: 1,
		to: 1.01,
		color: "#c00",
		opacity: 0.8
	}];

	var serie = {
		name: "상권 활성도",
		data: []
	};

	for (var i = 1; i < objLength + 1; i++) {
		serie.data.push(Number(chartdata["megaTrdActTop" + i + "Tval"]));
		chartOption.categoryAxis.categories.push(chartdata["megaTrdActTop" + i + "Nm"]);
	}
	chartOption.series.push(serie);
	$("#siActive").kendoChart(chartOption);
}

function tabSetting() {
	// Tab 메뉴 클릭 이벤트 생성
	$('.topTab li').click(function (event) {
		var tagName = event.target.tagName; // 현재 선택된 태그네임
		var selectedLiTag = (tagName.toString() == 'A') ? $(event.target).parent('li') : $(event.target); // A태그일 경우 상위 Li태그 선택, Li태그일 경우 그대로 태그 객체
		var currentLiTag = $('li[class~=on]'); // 현재 on 클래그를 가진 탭
		var isCurrent = false;

		// 현재 클릭된 탭이 on을 가졌는지 확인
		isCurrent = $(selectedLiTag).hasClass('on');

		// on을 가지지 않았을 경우만 실행
		if (!isCurrent) {
			$(currentLiTag).removeClass('on');
			$(selectedLiTag).addClass('on');

			if ($('.on a').text() == "JTI정보") {

				var src = "http://tme-obi-ops-asi.jti.com/analytics/saw.dll?Dashboard&PortalPath=%2Fshared%2FKorea%2F_portal%2FContracted%20Outlet%20info&Page=Outlet%20Summary&Action=Navigate&P0=1&P1=eq&P2=%22Account%22.%22Account+code%22&P3=" + omsMain.dashboard.jtiInfoStoreCd + "&Syndicate=Siebel&nqUser=UseSiebelLoginId&nqPassword=UseSiebelLoginPassword";

				$('.section_scroll').hide();
				$('.jtiInfo').show();
				$('#symbUrlIFrame1').attr('src', src);
				var iframeHeight = ($(window).height() - 280);
				$('#symbUrlIFrame1').attr('height', iframeHeight);
			} else {
				$('.jtiInfo').hide();
				$('.section_scroll').show();
			}
		}

		return false;
	});
}


$(function () {
	// 탭 초기화 및 설정
	tabSetting();
});
