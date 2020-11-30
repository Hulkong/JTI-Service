//@ sourceURL=mapComp.html
$.fn.outerHTML = function() {
	var el = $(this);
	if (!el[0])
		return "";

	if (el[0].outerHTML) {
		return el[0].outerHTML;
	} else {
		var content = el.wrap('<p></p>').parent().html();
		el.unwrap();
		return content;
	}
}

var mapComp = {

	jq : undefined,

	init : function() {

		this.jq = $('#mapComp');

		// 거리,면적 측정 박스
		this.measure({
			css : {
				bottom : 76,
				right : 20
			},
			lengthImageSrc : '/omsc/jti/images/util_length.gif',
			areaImageSrc : '/omsc/jti/images/util_area.gif',
			measureClear : false

		});
		
		// 지도 캡쳐
		this.mapCapture({
			css : {
				right : 20,
				bottom : 24
			},
			saveImageSrc : '/omsc/jti/images/util_capture.gif',
			resetImageSrc : '/omsc/jti/images/util_eraser.gif',
			allClear : 'Y'
		});
	},

	//측정
	measure : function(option) {
		var html;

		var lengthImageSrc = (option.lengthImageSrc) ? option.lengthImageSrc
				: '/omsc/mapComp/images/util_length.gif';
		var areaImageSrc = (option.areaImageSrc) ? option.areaImageSrc
				: '/omsc/mapComp/images/util_area.gif';
		var resetImageSrc = (option.resetImageSrc) ? option.resetImageSrc
				: '/omsc/mapComp/images/util_eraser.gif';

		html = '<div class="measureBox">';
		html += '<a href="#" data-mt="distance" class="btn"><img src='
				+ lengthImageSrc + '></a><br/>'; //길이측정
		html += '<a href="#" data-mt="area" class="btn"><img src='
				+ areaImageSrc + '></a><br/>'; //면적측정
		if (option.measureClear === undefined || option.measureClear) {
			html += '<a href="#" class="measureClear"><img src='
					+ resetImageSrc + '></a><br/>'; //reset
		}
		html += '</div>';
		var measureEl = $(html);

		var bm = measureEl.appendTo(this.jq);
		if (option.css !== undefined) {
			bm.css(option.css);
		}

		bm.find(".btn").on('click', function(event) {
			$(".measureBox a[data-mt] img").each(function() {
				var cuSrc = $(this).attr("src");
				$(this).attr("src", cuSrc.replace("_on.gif", ".gif"));
			});
			var cuSrc = $(this).find("img").attr("src");
			$(this).find("img").attr("src", cuSrc.replace(".gif", "_on.gif"));

			if ("distance" == $(this).attr("data-mt")) {
				omsMain.selfmap.instance.measureDistance(function() {
					var imgObj = $(".measureBox a[data-mt=distance] img");
					var cuSrc = imgObj.attr("src");
					imgObj.attr("src", cuSrc.replace("_on.gif", ".gif"))
				});
			} else if ("area" == $(this).attr("data-mt")) {
				omsMain.selfmap.instance.measureArea(function() {
					var imgObj = $(".measureBox a[data-mt=area] img");
					var cuSrc = imgObj.attr("src");
					imgObj.attr("src", cuSrc.replace("_on.gif", ".gif"));
				});
			}
		});

		bm.find(".measureClear").on('click', function(event) {
			omsMain.selfmap.instance.clearMeasure();
		});

		bm.find('.btn').on('mouseover', function(event) {
			if ($(this).attr("data-mt") == "area")
				$(this).find('img').eq(0).attr("title", "면적측정");
			else if ($(this).attr("data-mt") == "distance")
				$(this).find('img').eq(0).attr("title", "거리측정");
		});
	},

	// 지도 캡쳐
	mapCapture : function(option) {

		var html;
		var saveImageSrc = (option.saveImageSrc) ? option.saveImageSrc
				: '/omsc/mapComp/images/util_capture.gif';
		var saveImageSrcOn = saveImageSrc.replace(".gif", "_on.gif");
		var resetImageSrc = (option.resetImageSrc) ? option.resetImageSrc
				: '/omsc/mapComp/images/util_eraser.gif';

		var map = omsMain.selfmap.instance.impObj.map;
		var tooltip = new L.tooltip(map);

		tooltip.updateContent({
			text : '다운로드할 영역을 드래그하여 선택해주세요!',
			subtext : ''
		});

		html = '<div class="mapCapture">';
		html += '<a href="#" class="start"><img src=' + saveImageSrc
				+ '></a><br/>';
		html += '<a href="#" class="reset"><img src=' + resetImageSrc + '></a>';
		html += '</div>';

		var jcrop_api;
		var selectionCoords = {
			cx : 0,
			cy : 0,
			cx2 : 0,
			cy : 0,
			cw : 0,
			ch : 0
		};
		var mapCaptureEl = $(html);
		var bm = mapCaptureEl.appendTo(this.jq);

		if (option.css !== undefined)
			bm.css(option.css);

		// 선택된 캡처영역 저장
		function showCoords(c) {
			selectionCoords.cx = c.x;
			selectionCoords.cy = c.y;
			selectionCoords.cx2 = c.x2;
			selectionCoords.cy2 = c.y2;
			selectionCoords.cw = c.w;
			selectionCoords.ch = c.h;
		};

		
		// 캡쳐 버튼을 누를 때 호출
		function startHandler(event) {

			$('#selfmap').Jcrop({
				// Called when the selection is moving
				onChange : showCoords,
				// Called when selection is completed
				onSelect : function() {
					finishHandler(event);
				},
				// Called when the selection is released
				onRelease : function() {
					selectionCoords = {
						cx : 0,
						cy : 0,
						cx2 : 0,
						cy : 0,
						cw : 0,
						ch : 0
					};
				}
			}, function() {
				jcrop_api = this;
			});

			$('.jcrop-tracker').mousemove(updateTooltip);

		}
		
		function saveAs(uri, filename) {
			
			var link = document.createElement('a');
			
			if(typeof link.download === 'string') {
				link.href = window.URL.createObjectURL(uri);
				link.download = filename;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			} else {
				// blob과 저장될 파일명을 받는다.
				window.navigator.msSaveOrOpenBlob(uri, filename);
			}
		}
		
		// 캡처 툴팁 내용 업데이트
		function updateTooltip(e) {
			var point = L.point(e.clientX - 60, e.clientY - 150);
			var latlng = map.layerPointToLatLng(point);

			tooltip.updatePosition(latlng);
		}

		// 캡쳐 버튼을 한번 더 누를 때 호출(실제 캡쳐 이미지 다운로드)
		function finishHandler(event) {
			
			event.stopPropagation();
			var width = selectionCoords['cw'];
			var height = selectionCoords['ch'];
			var x = selectionCoords['cx'] + parseInt($('#navigation').css('width').split('px')[0]);
			var y = selectionCoords['cy'] + parseInt($('header').css('height').split('px')[0]);
			
			bm.find(".start img").attr("src", saveImageSrc);

			$(".jcrop-holder").after($('#selfmap'));
			jcrop_api.destroy();

			if (jcrop_api)
				jcrop_api.release();
			
			jcrop_api.disable();
			
			$('#selfmap').attr('style', '');
			
			html2canvas(document.querySelector(".selfmap"), {
				proxy: 'http://115.68.55.224:3000',
	            useCORS: true,
	            width: width,
	            height: height,
	            x: x,
	            y: y
//	            allowTaint: true,
//	            taintTest: false,
//	            logging : true,
//	      	  	async : false,
//	      	  	scale : 1
			}).then(function(canvas) {
				var dataURL = canvas.toDataURL("image/png");
//	            var newData = imageData.replace(/^data:image\/png/, "data:application/octet-stream");
	            
				 var BASE64_MARKER = ";base64,";

				  // base64로 인코딩 되어있지 않을 경우
				  if (dataURL.indexOf(BASE64_MARKER) === -1) {
					  var parts = dataURL.split(",");
					  var contentType = parts[0].split(":")[1];
					  var raw = parts[1];
				    return new Blob([raw], {
				      type: contentType
				    });
				  }
				  // base64로 인코딩 된 이진데이터일 경우
				  var parts = dataURL.split(BASE64_MARKER);
				  var contentType = parts[0].split(":")[1];
				  var raw = window.atob(parts[1]);
				  // atob()는 Base64를 디코딩하는 메서드
				  var rawLength = raw.length;
				  // 부호 없는 1byte 정수 배열을 생성 
				  var uInt8Array = new Uint8Array(rawLength); // 길이만 지정된 배열
				  var i = 0;
				  while (i < rawLength) {
				    uInt8Array[i] = raw.charCodeAt(i);
				    i++;
				  }
				  
				  saveAs(new Blob([uInt8Array], {
				    type: contentType
				  }), 'file-name.png');
			}).catch(function(err) {
				console.log(err);
			});
			
			return;
		}

		// 캡쳐 이미지 바꾸기
		bm.find(".start").on('click', function(event) {
			$(this).find("img").attr("src", saveImageSrcOn);
			startHandler(event);
		});

		bm.find('.start').on('mouseover', function(event) {
			$(this).find('img').eq(0).attr("title", "다운로드");
		});

		bm.find(".reset").on('click', function(event) {

			// todo 삭제아이콘 통합기능추가
			if (option.allClear !== undefined && option.allClear == 'Y') {
				// 				$(".measureClear").trigger('click');  
				//				<-- jti에서 measureClear를 생성하지않아서 사용 불가.(click이벤트내용을 함수로 따로 빼서 사용해야할듯.)
				$(".measureBox a[data-mt] img").each(function() {
					var cuSrc = $(this).attr("src");
					$(this).attr("src", cuSrc.replace("_on.gif", ".gif"));
				});
				omsMain.selfmap.instance.clearMeasure();
			}

			bm.find(".start img").attr("src", saveImageSrc);

			if (jcrop_api)
				jcrop_api.release();

			if ($(".jcrop-holder").length > 0) {
				$(".jcrop-holder").after($('#selfmap'));
				jcrop_api.destroy();
				
				$('#selfmap').attr('style', '');
			}
		});

		bm.find('.reset').on('mouseover', function(event) {
			$(this).find('img').eq(0).attr("title", "지우개");
		});
	}
};

omsMain['mapComp'] = mapComp;
mapComp.init();