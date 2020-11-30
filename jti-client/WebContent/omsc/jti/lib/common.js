/**
 * @description 3자리마다 콤마찍는 함수1
 * @param 데이터
 * @returns 변환된 데이터
 */
function format(value) {
	if (typeof value === 'string') {
		value = parseFloat(value);
		if (isNaN(value)) return "0";
	}

	if (value == 0) return 0;

	var reg = /(^[+-]?\d+)(\d{3})/;
	var n = (value + '');

	while (reg.test(n)) n = n.replace(reg, '$1' + ',' + '$2');

	return n;
}

/**
 * @description 3자리마다 콤마찍는 함수2
 * @param 데이터
 * @returns 변환된 데이터
 */
function NumToComma(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * @description 엑셀 다운로드 함수
 * @param url   서버 url
 * @param params   필수 파라미터
 * @returns
 */
function download(url, params) {
	
	var frame = $('#dataDownFrame');

	frame.remove();
	frame = $('<iframe id="dataDownFrame" width="10" height="10" src="about:blank"></iframe>').appendTo('body');

	var doc = frame[0].contentWindow || frame[0].contentDocument;
	if (doc.document)
		doc = doc.document;

	var html = '<html><head></head><body><form method="POST" action="' + url + '">';
	$.each(params, function (key, value) {
		html += '<input type="hidden" name="' + key + '" value="' + value + '"/>';
	});
	html += '</form></body></html>';

	doc.open();
	doc.write(html);
	$(doc).find('form').submit();
}

function paginate(selector, paginate, page, total, rownum, stepnum) {
	var html = '';
	if(page > 1) {
		html += '<span class="btn_firs paginate firs"><a href="#" data-page="1" class="btn_firs">처음</a></span>' + 
			    '<span class="btn_prev paginate prev"><a href="#" data-page="' + (page - 1) + '" class="btn_prev">이전</a></span>';
	}
	
	stepnum = parseInt(stepnum || 10);
	rownum = parseInt(rownum || 10);
	
	var i, end, 
	    start = page - Math.round(stepnum/2), 
	    last = parseInt(total/rownum) + ((total > 0 && total % rownum > 0) ? 1 : 0);

	if(start <= 0 || last <= stepnum) {
		start = 1;
	} else {
		if(start < stepnum/2)
			start = start + 1;
		else if(last - start < stepnum)
			start = last - stepnum + 1;
	}
	
	end = start + stepnum - 1;
	if(end > last)
		end = last;
	
	$(selector).empty();
	if(end > 0) {
		html += '<ol>';
		for(i = start; i <= end; i++) {
			if(i == page)
				html += '<li><strong>' + i + '</strong></li>';
			else html += '<li><a href="#" data-page="' + i + '">' + i + '</a></li>';
		}
		html += '</ol>';
		
		if(page < last)
			html += '<span class="btn_next paginate next"><a href="#" data-page="' + (Number(page) + 1) + '" class="btn_next">다음</a></span>';
		
		if(page != last)
	        html += '<span class="btn_last paginate last"><a href="#" data-page="' + last + '" class="btn_last">마지막</a></span>';	
	
		$(html).appendTo(selector).on('click', 'a', function(event) {
			var page = $(this).attr('data-page');
			paginate(page);
		});
	}
}

/**
 * @description 브라우저 호환성 체크
 * @returns 브라우저 버전 or 타입
 */
function browserVersionCheck() {
    var word;
    var versionOrType = "another";
    var ieName = navigator.appName;
    var agent = navigator.userAgent.toLowerCase();

    // IE 버전 체크
    // IE old version( IE 10 or Lower )
    if (ieName == "Microsoft Internet Explorer") {
        word = "msie";
    } else {
        // IE11
        if (agent.search("trident") > -1) word = "trident/.*rv:";
        // IE12(Microsoft Edge)
        else if (agent.search("edge/") > -1) word = "edge/";
    }

    var reg = new RegExp(word + "([0-9]{1,})(\\.{0,}[0-9]{0,1})");

    // if(reg.exec(agent) != null) versionOrType = RegExp.$1 + RegExp.$2;
    if (reg.exec(agent) != null) versionOrType = word;

    // IE가 아닌 경우 브라우저 체크
    if (versionOrType === "another") {
        if (agent.indexOf("chrome") != -1) versionOrType = "Chrome";
        else if (agent.indexOf("opera") != -1) versionOrType = "Opera";
        else if (agent.indexOf("firefox") != -1) versionOrType = "Firefox";
        else if (agent.indexOf("safari") != -1) versionOrType = "Safari";
    }

    return versionOrType;
};

/**
* @description Handle pasted text from Excel, and split it into arrays of rows and columns
* @param {*} pastedText
 */
function splitBlankText(pastedText) {
    var rows = pastedText.replace(/"((?:[^"]*(?:\r\n|\n\r|\n|\r))+[^"]+)"/mg, function (match, p1) {
        // This function runs for each cell with multi lined text.
        return p1
            // Replace any double double-quotes with a single
            // double-quote
            .replace(/""/g, '"')
            // Replace all new lines with spaces.
            .replace(/\r\n|\n\r|\n|\r/g, ' ')
            ;
    })
        // Split each line into rows
        .split(/\r\n|\n\r|\n|\r/g);

    return rows;
};

/**
 * @description 로딩창 여는 함수
 * @returns
 */
function openLoading() {
	var req = parseInt($('#layerLoading').attr('req')) + 1;  // 로딩창 요청수에 +1
	$('#layerLoading').attr('req', req);  // 로딩창 요청수에 적용
	
//	console.log('open : ' + req);
	
	// 백그라운드 모달창이 열려있지 않을 경우
	if(!$('#modal').is(':visible')) {
		$('#modal').show();   // 백그라운드 모달창 엶
	}
	
	// 로딩창이 열려있지 않을 경우
	if(!$('#layerLoading').is(':visible')) {
		$('#layerLoading').show();   // 로딩창 엶
	}
	
};

/**
 * @description 로딩창 닫는 함수
 * @returns
 */
function closeLoading() {
	var req = parseInt($('#layerLoading').attr('req'));  // 현재 로딩창 요청수
	
	// 요청수가 양수인 경우
	if(req > 0) {
		$('#layerLoading').attr('req', req - 1);   // 로딩창 요청수에 -1
		req = parseInt($('#layerLoading').attr('req'));
	}

//	console.log('close : ' + req);
	
	setTimeout(function() {
		// 요청수가 없을 경우
		if(req === 0) {
			
			// 백그라운드 모달창이 열려 있을 경우
	    	if($('#modal').is(':visible')) {
	    		$('#modal').hide();   // 백그라운드 모달창 닫음
	    	}
	    	
	    	// 로딩창이 열려있을 경우
	    	if($('#layerLoading').is(':visible')) {
	    		$('#layerLoading').hide();   // 로딩창 닫음
	    	}
		}
	}, 1000);
};