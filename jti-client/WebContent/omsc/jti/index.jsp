<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%><%@ 
    taglib prefix="c"
	uri="http://java.sun.com/jsp/jstl/core"%>
<%
	String userId = (String) session.getAttribute("user_id");
	String userSeq = (String) session.getAttribute("user_seq");
	String ssUser_name = (String) session.getAttribute("user_name");
	String ssAdmin_yn = (String) session.getAttribute("is_admin");
	String dataNo = (String) request.getParameter("dataNo");
	session.setMaxInactiveInterval(10 * 60);
	if (dataNo != null) {
		session.setAttribute("dataNo", dataNo);
	} else if (userId == null) {
		//response.sendRedirect("https://jti.selfmap.co.kr/omsc/jti/login.jsp");
		//return;
	}
%>
<!DOCTYPE html>
<html>

<head>

<title>JTI</title>

<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link type="text/css" rel="stylesheet" href="/omsc/jti/css/main.css">
<link type="text/css" rel="stylesheet"
	href="/omsc/jti/component/region/region.css">
<link type="text/css" rel="stylesheet"
	href="/omsc/jti/component/controlBar/controlBar.css">
<link type="text/css" rel="stylesheet"
	href="/omsc/jti/component/regionCharacteAnal/regionCharacteAnal.css">
<link type="text/css" rel="stylesheet"
	href="/omsc/jti/component/regionCharacteAnalSub/regionCharacteAnalSub.css">
<link type="text/css" rel="stylesheet"
	href="/omsc/jti/component/resultReport/resultReport.css">
<link type="text/css" rel="stylesheet"
	href="/omsc/jti/component/resultReportTable/resultReportTable.css">
<link type="text/css" rel="stylesheet"
	href="/omsc/jti/component/nearbyBusinesses/nearbyBusinesses.css">
<link type="text/css" rel="stylesheet"
	href="/omsc/jti/component/nearbyBusinessesNewPoi/nearbyBusinessesNewPoi.css">
<link type="text/css" rel="stylesheet"
	href="/omsc/jti/component/flowpop/flowpop.css">
<link type="text/css" rel="stylesheet"
	href="/omsc/jti/component/filterBox/filterBox.css">
<link type="text/css" rel="stylesheet"
	href="/omsc/jti/component/filterEdit/filterEdit.css">
<link type="text/css" rel="stylesheet"
	href="/omsc/jti/component/dataView/dataView.css">
<link type="text/css" rel="stylesheet"
	href="/omsc/jti/component/commentForm/commentForm.css">
<link type="text/css" rel="stylesheet"
	href="/omsc/jti/component/dashboard/dashboard.css">
<link type="text/css" rel="stylesheet"
	href="/omsc/jti/lib/kendo/css/kendo.common.min.css">
<link type="text/css" rel="stylesheet"
	href="/omsc/jti/lib/kendo/css/kendo.default.min.css">
<link type="text/css" rel="stylesheet"
	href="/omsc/jti/lib/SlickGrid/slick.grid.css">
<link type="text/css" rel="stylesheet"
	href="/omsc/jti/lib/SlickGrid/slick-default-theme.css">
<link type="text/css" rel="stylesheet"
	href="/omsc/jti/lib/SlickGrid/css/smoothness/jquery-ui-1.8.16.custom.css">
<link type="text/css" rel="stylesheet"
	href="/omsc/jti/lib/jcrop/jquery.Jcrop.min.css">
<link type="text/css" rel="stylesheet"
	href="/omsc/jti/lib/OpenMapV2/leaflet/leaflet.label.css">
<link type="text/css" rel="stylesheet"
	href="/omsc/jti/lib/Leaflet-1.0.2/leaflet.css">
<link type="text/css" rel="stylesheet"
	href="/omsc/jti/lib/OpenMapV2/leaflet/control/L.Control.Zoomslider.css">
<link type="text/css" rel="stylesheet"
	href="/omsc/jti/lib/OpenMapV2/leaflet/control/Leaflet.draw/leaflet.draw.css">
<link type="text/css" rel="stylesheet"
	href="/omsc/jti/lib/OpenMapV2/leaflet/control/measure_control/leaflet.measurecontrol.css">
<script>
	L_DISABLE_3D = true;
</script>
</head>

<body>
	<input type="text" id="userNm" value="<%=userId%>"
		style="display: none;" />
	<input type="text" id="userSeq" value="<%=userSeq%>"
		style="display: none;" />
	<input type="text" id="ssUser_name" value="<%=ssUser_name%>"
		style="display: none;" />
	<input type="text" id="ssAdmin_yn" value="<%=ssAdmin_yn%>"
		style="display: none;" />
	<input type="text" id="dataNo" value="<%=dataNo%>"
		style="display: none;" />
		
	<header>
		<div class="top1">
			<div style="position: inherit;">
				<a href="/omsc/jti/index.jsp"><img
					src="/omsc/jti/images/logo.png" alt="logo"></a>
			</div>
			<div style="position: inherit; right: 100px; margin: 12px;">
				<span class="loginText"> <%
 	if (ssUser_name != null) {
 %> <strong><%=ssUser_name%></strong> 계정으로 로그인함 <%
 	} else {
 %> 게스트 <%
 	}
 %>

				</span>
			</div>
			<div style="position: inherit; right: 44px;">
				<ul style="list-style: none; display: inline;">
					<%
						if (ssUser_name != null) {
					%>
					<li class="logout"><a href="/omsc/jti/logout.jsp">LOG OUT</a></li>
					<%
						} else {
					%>
					<li class="logout"><a href="/omsc/jti/login.jsp">LOGIN</a></li>
					<%
						}
					%>

<!-- 					<li class="dataManagement">데이터 관리</li> -->
				</ul>
			</div>
		</div>
		<div class="top2">
			<div style="position: inherit;">
				<span class="folderImg"></span> <span class="layerNm">20200506데이터</span>
			</div>

			<div id="daumAPI">
				<input type="text" placeholder="주소를 입력하세요." /> <img
					src="/omsc/jti/images/search_20x20.png" />
			</div>

			<div id="region">
				<div class="mega">
					<a href="#" class="mega arrow off"></a>
					<div class="title">시도</div>
					<div class="contents">
						<ul></ul>
					</div>
				</div>

				<div class="cty">
					<a href="#" class="cty arrow off"></a>
					<div class="title">시군구</div>
					<div class="contents">
						<ul></ul>
					</div>
				</div>

				<div class="admi">
					<a href="#" class="admi arrow off"></a>
					<div class="title">행정동</div>
					<div class="contents">
						<ul></ul>
					</div>
				</div>
			</div>

			<div id="controlBar">
				<ul>
					<li class="regionCharacteAnal">지역특성</li>
					<li class="nearbyBusinesses">주변업소</li>
					<li class="jti">점포</li>
					<li class="map">지도</li>
					<li class="label">점포라벨</li>
					<li class="top1Seg">TOP1 SEG</li>
					<li class="top2Seg">TOP2 SEG</li>
					<li class="coreCommercial">핵심상권</li>
				</ul>
				<div id="top1SegLegend">
					<div class="top">Top1 소비자 유형</div>
					<div class="content">
						<table>
							<colgroup>
								<col width="20%" />
								<col width="80%" />
							</colgroup>
							<tbody>
								<tr>
									<td style="background: #cd7657"></td>
									<td style="padding: 0 0 0 7px;">Mr. Diligent (YA)</td>
								</tr>
								<tr>
									<td style="background: #d0a75c"></td>
									<td style="padding: 0 0 0 7px;">Mr. Diligent (OA)</td>
								</tr>
								<tr>
									<td style="background: #32a07b"></td>
									<td style="padding: 0 0 0 7px;">Passionate Achiever</td>
								</tr>
								<tr>
									<td style="background: #2587b1"></td>
									<td style="padding: 0 0 0 7px;">Free Spirit (YA)</td>
								</tr>
								<tr>
									<td style="background: #25a5cd"></td>
									<td style="padding: 0 0 0 7px;">Free Spirit (OA)</td>
								</tr>
								<tr>
									<td style="background: #d6868b"></td>
									<td style="padding: 0 0 0 7px;">Ajae Nextdoor</td>
								</tr>
								<tr>
									<td style="background: #957a9e"></td>
									<td style="padding: 0 0 0 7px;">Golden Ajae</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</header>
	<div class="selfmap">
		<div id="selfmap"></div>
	</div>
	<div id="mapComp">
		<div class="measureBox" style="bottom: 76px; right: 20px;">
			<a href="#" data-mt="distance" class="btn"><img
				src="/omsc/jti/images/util_length.gif" title="거리측정"></a><br>
			<a href="#" data-mt="area" class="btn"><img
				src="/omsc/jti/images/util_area.gif"></a><br>
		</div>

		<div class="mapCapture" style="right: 20px; bottom: 24px;">
			<a href="#" class="start"><img
				src="/omsc/jti/images/util_capture.gif"></a><br> <a href="#"
				class="reset"><img src="/omsc/jti/images/util_eraser.gif"></a>
		</div>
	</div>
	<aside id="navigation">
		<ul>
			<li nm="regionCharacteAnal">지역특성<br>분석
			</li>
			<li nm="nearbyBusinesses">주변업소</li>
			<li nm="flowpop">유동인구</li>
			<li nm="filterBox">점포필터</li>
			<li nm="dataView">데이터<br>보기
			</li>
		</ul>
	</aside>

	<div id="layerLoading" req="0">
		<div class="top">
			<span>알림</span> <a class="btn_close"></a>
		</div>
		<img src="/omsc/jti/images/viewLoading.gif">
		<p>정보 분석 중입니다. 1분 이상 시간이 소요될 수 있습니다.</p>
		<div class="anal_cancel">분석취소</div>
	</div>
	
	<div id="addrLoading">
		<div class="top">
			<span>알림</span> <a class="btn_close"></a>
		</div>
		<img src="/omsc/jti/images/viewLoading.gif">
		<p>주소를 검색중입니다. 잠시만 기다려주십쇼.</p>
		<div class="anal_cancel">분석취소</div>
	</div>

	<div id="dataLoading">
		<div class="top">
			<span>알림</span> <a class="btn_close"></a>
		</div>
		<img src="/omsc/jti/images/viewLoading.gif">
		<p>데이터를 수정 또는 삽입중입니다...</p>
		<!-- 		<div class="anal_cancel">취소</div> -->
	</div>
	
	<div id="downloadLoading">
		<div class="top">
			<span>알림</span> <a class="btn_close"></a>
		</div>
		<img src="/omsc/jti/images/viewLoading.gif">
		<p>엑셀파일로 다운로드 중입니다...</p>
		<div class="anal_cancel">취소</div>
	</div>

	<section>
		<div id="regionCharacteAnal">
			<!-- top -->
			<div class="article_top">
				<h1 class="tit_main">지역특성 분석</h1>
				<div class="area_btn">
					<a href="###" class="tit oncontentsnavi subview btn_add_big"> <span>분석항목
							선택</span>
					</a>
				</div>
				<a href="###" class="btn_close all">닫기</a>
			</div>
			<!-- //top -->

			<!-- content -->
			<div class="history">
				<div class="history_title">
					<h2 class="tit">나의 분석 리스트</h2>
				</div>
				<div class="list histroy_list"></div>
			</div>
			<!-- //content -->
			<!-- 결과표시 옵션 -->
			<div class="style display">
				<div class="admiDistrict">
					<ul>
						<li value="H1">광역시</li>
						<li value="H2">시군구</li>
						<li class="on" value="H4">행정동</li>
						<li value="BL">블록</li>
					</ul>
				</div>
				<div class="display_title">
					<h2 class="tit">결과표시 옵션</h2>
				</div>
				<div class="opacity display_item display_transparent">
					<div class="left">투명</div>
					<div class="right">
						<input id="slider_display"
							class="transparentSlider balSlider inp_full"
							style="width: 100px;" type="text" data-role="slider">
					</div>
				</div>

				<div class="method display_item unit">
					<div class="left">기준</div>
					<div class="right ty_btn">
						<span class="changeBreakType imgbtn btn1" data-value="quantile">등개수</span>
						<span class="changeBreakType imgbtn btn2" data-value="interval">등간격</span>
					</div>
				</div>

				<div class="color display_item color">
					<div class="left">색상</div>
					<div class="right ty_col">
						<div class="color icon changeColors imgbtn on" data-value="0"
							style="background-color: #df4e53;"></div>
						<div class="color icon changeColors imgbtn" data-value="1"
							style="background-color: #4c58cb;"></div>
						<div class="color icon changeColors imgbtn" data-value="2"
							style="background-color: #79d26e;"></div>
						<div class="color icon changeColors imgbtn" data-value="3"
							style="background-color: #e54990;"></div>
						<div class="color icon changeColors imgbtn" data-value="4"
							style="background-color: #fdc101;"></div>
					</div>
				</div>
				<div class="clear"></div>
				<div class="stroke display_item border">
					<div class="left">테두리</div>
					<div class="right">
						<input type="checkbox" class="drawBorder">
					</div>
				</div>
				<!-- //결과표시 옵션 -->
			</div>
		</div>
		<!-- -->

		<div id="regionCharacteAnalSub">
			<div class="top regionCharacteAnalSub_head">
				<span class="tit">지역특성 분석 항목을 선택하세요</span> <a href="javascript:;"
					class="button complete btn_close"
					id="btn_regionCharacteAnalSub_complete">완료</a>
			</div>

			<div class="search regionCharacteAnalSub_search">
				<input type="text" name="keyword"
					id="treeview_regionCharacteAnalSub_search" class="form-control"
					placeholder="검색" aria-describedby="basic-addon1">
			</div>

			<div class="contents scroll_outer">
				<div class="groups regionCharacteAnalSub_tree">
					<div class="treeview_regionCharacteAnalSub"
						id="treeview_regionCharacteAnalSub">
						<ul class="list">
						</ul>
					</div>
				</div>
			</div>
		</div>

		<div id="resultReport">
			<div class="resultReport_header article_top">
				<h2 class="tit_main">컨텐츠생성 결과</h2>
				<input type="button" class="contents result button btn_close"
					value="닫기">
			</div>

			<div class="resultReport_body">
				<div class="resultReport_body_barChart">
					<div class="resultReport_body_barChart_title tit_2dp">컨텐츠
						합쳐보기</div>

					<div class="resultReport_body_barChart_graph">
						<div id="chart_resultReport_summary"
							style="height: 500px; position: relative;" data-role="chart"
							class="k-chart"></div>
					</div>
					<div class="btm_btn">
						<a href="###" id="btn_resultReport_report" class="tit_main">Report</a>
					</div>
				</div>
				<div class="resultReport_body_histogram">
					<h3 class="resultReport_body_histogram_title tit_2dp">컨텐츠 분포상태</h3>
					<div class="resultReport_body_histogram_body">
						<div class="resultReport_body_histogram_graph k-chart"
							id="resultReport_body_histogram_graph" data-role="chart"
							style="position: relative; height: 150px;"></div>
					</div>
				</div>
			</div>
		</div>

		<div id="resultReportTable">
			<div class="resultReportTable_header">
				<div class="resultReportTable_header_title">컨텐츠 생성 결과 자세히 보기</div>
				<div class="resultReportTable_header_close">
					<span id="btn_resultReportTable_close" class="btn_close">닫기</span>
				</div>
			</div>

			<div class="resultReportTable_body">
				<div class="resultReportTable_body_title">"합쳐진 컨텐츠"의 생성된 컨텐츠
					데이터</div>

				<div class="resultReportTable_body_dataset"></div>
			</div>
		</div>
	</section>

	<section>
		<div id="nearbyBusinesses">
			<div class="article_top">
				<h1 class="tit_main">주변업소 표시하기</h1>
				<a href="#" class="btn_close">닫기</a>
			</div>

			<div class="scroll_outer">
				<div class="facility_cont list">
					<div class="category"></div>
					<div class="category"></div>
				</div>
			</div>
		</div>

		<div id="nearbyBusinessesNewPoi" class="popup_poi_add ui-draggable">
			<div id="addPoi">
				<!-- pop_header -->
				<div class="pop_header">
					<h2 class="pop_tit change_tit">POI 추가하기</h2>
					<a href="#none" class="btn_close apoi_cancel">닫기</a>
				</div>
				<!-- //pop_header -->
				<!-- pop_contents -->
				<div class="pop_contents" style="display: block;">
					<form>
						<!-- 본문 -->
						<p class="txt change_txt"></p>
						<p class="tit_poi">
							<input type="text" name="poiTitle" class="poiTitle" value="">
						</p>
						<!-- //본문 -->
					</form>
				</div>
				<!-- //pop_contents -->

				<!-- pop_footer -->
				<div class="pop_footer">
					<input type="button" value="확인" class="btn_confirm apoi_ok">
					<input type="button" value="취소" class="btn_cancle apoi_cancel">
				</div>
				<!-- //pop_footer -->
			</div>

			<div id="updatePoi">
				<!-- pop_header -->
				<div class="pop_header">
					<h2 class="pop_tit change_tit">POI 추가하기</h2>
					<a href="#none" class="btn_close apoi_cancel">닫기</a>
				</div>
				<!-- //pop_header -->
				<!-- pop_contents -->
				<div class="pop_contents" style="display: block;">
					<form>
						<!-- 본문 -->
						<p class="txt change_txt"></p>
						<p class="tit_poi">
							<input type="text" name="poiTitle" class="poiTitle" value="">
						</p>
						<!-- //본문 -->
					</form>
				</div>
				<!-- //pop_contents -->

				<!-- pop_footer -->
				<div class="pop_footer">
					<input type="button" value="수정" class="btn_confirm apoi_update"
						style="display: none;"> <input type="button" value="취소"
						class="btn_cancle apoi_cancel">
				</div>
				<!-- //pop_footer -->
			</div>

			<div id="deletePoi" class="popup_layer deletePop">
				<div class="popup_poi_add ui-draggable">
					<!-- pop_header -->
					<div class="pop_header">
						<h2 class="pop_tit">POI 삭제하기</h2>
						<a href="#none" class="btn_close del_cancel">닫기</a>
					</div>
					<!-- //pop_header -->

					<!-- pop_contents -->
					<div class="pop_contents" style="display: block;">
						<form>
							<input type="hidden" name="delete_id" class="delete_id"
								value="441">
							<!-- 본문 -->
							<div class="msg_del">
								<p class="txt">
									<strong>'<span class="delete_name">한신포차 종로관철점</span>'
										POI를 삭제하시겠습니까?
									</strong>
								</p>
							</div>
							<!-- //본문 -->
						</form>
					</div>
					<!-- //pop_contents -->

					<!-- pop_footer -->
					<div class="pop_footer">
						<input type="button" value="확인" class="btn_confirm apoi_del">
						<input type="button" value="취소" class="btn_cancle del_cancel">
					</div>
					<!-- //pop_footer -->
				</div>
			</div>
		</div>

	</section>

	<section>
		<div id="flowpop">
			<div class="article_top">
				<h1 class="tit_main">유동인구 표시하기</h1>
				<div class="area_btn">
					<div class="block top">유동인구를 표시하시겠습니까?</div>
					<div class="block buttons onoff">
						<div class="off button active">OFF</div>
						<div class="on button">ON</div>
					</div>
				</div>
				<a href="#" class="btn_close">닫기</a>
			</div>
			<div class="clear"></div>

			<div class="block disabled scroll_outer">
				<div class="flow_cont">
					<div class="flowpop age">
						<div class="flowpop title">연령</div>
						<div class="flowpop buttons">
							<img src="/omsc/jti/images/btn_age_all.png" class="button all"
								column="all">
							<!-- A -->
							<img src="/omsc/jti/images/btn_age_20.png" class="button"
								column="2030"> <img src="/omsc/jti/images/btn_age_30.png"
								class="button" column="3040"> <img
								src="/omsc/jti/images/btn_age_40.png" class="button"
								column="4050"> <img src="/omsc/jti/images/btn_age_50.png"
								class="button" column="5060"> <img
								src="/omsc/jti/images/btn_age_60.png" class="button"
								column="60over">
						</div>
					</div>
					<div class="clear"></div>
					<div class="flowpop time">
						<div class="flowpop title">시간</div>
						<div class="flowpop buttons">
							<img src="/omsc/jti/images/btn_time_all.png" class="button all"
								column="all">
							<!-- A -->
							<img src="/omsc/jti/images/btn_time_1.png" class="button"
								column="0710">
							<!-- 0410 -->
							<img src="/omsc/jti/images/btn_time_2.png" class="button"
								column="1012">
							<!-- 1016 -->
							<img src="/omsc/jti/images/btn_time_3.png" class="button"
								column="1214">
							<!-- 1622 -->
							<img src="/omsc/jti/images/btn_time_4.png" class="button"
								column="1418">
							<!-- 2204 -->
						</div>
					</div>
				</div>
			</div>
			<div id="flowpopLegend">
				<div>
					<span>적음</span>
					<ul>
						<li style="background: #1a9641"></li>
						<li style="background: #a6d96a"></li>
						<li style="background: #ffffbf"></li>
						<li style="background: #fdae61"></li>
						<li style="background: #d7191c"></li>
					</ul>
					<span>많음</span>
				</div>
			</div>
		</div>
	</section>

	<section style="z-index: 2;">
		<div id="filterBox" class="filterBox_list">
			<div class="article_top">
				<h1 class="tit_main">필터 리스트</h1>
				<div class="area_btn">
					<a href="###" class="btn_add_big button add filter"><span>필터
							추가하기</span></a>
				</div>
				<div class="btn_filter_reset reset filter">필터 초기화 </div>				
				
				<a href="###" class="btn_close">닫기</a>
			</div>
			<div class="wrap_scroll" style="top:156px;">
				<div class="article_scroll">
					<div class="filter_data">
						<ul class="filter_result_list"></ul>
					</div>
				</div>
				<div class="colorStyleBox"></div>
			</div>
		</div>

		<div id="filterEdit"
			class="filter_edit onlayerevent onfilterevent hidden">
			<!-- article_top -->
			<div class="article_top">
				<h1 class="tit_main">항목</h1>
				<div class="area_btn">
					<a href="#" class="btn_add_big action filter append"><span>항목
							추가하기</span></a>
				</div>
				<a href="#" class="btn_close button close">닫기</a>
			</div>
			<!-- //article_top -->

			<!-- scroll -->
			<div class="wrap_scroll">
				<p class="copied">
					현재 영역을 클릭한 후 <br>Ctrl + V 키를 눌러주세요!
				</p>
				<div class="article_scroll">
					<!-- filter_list -->
					<div class="filter_list"></div>
					<!-- //filter_list -->
				</div>
			</div>
			<!-- //scroll -->

			<!-- 하단 -->
			<div class="btm_btn">
				<a href="#" class="action filter apply">필터 적용하기</a> <a href="#"
					class="action filter update">필터 수정하기</a>
			</div>
			<!-- //하단 -->
			<input id="paste_space" style="display: none;" />
		</div>
	</section>

	<section style="width: 0;">
		<div id="dataView">
			<div class="blackShadow"></div>
			<div class="section_top">
				<!-- title -->
				<div class="tit_main">
					<h2 class="tit">Map/Data</h2>
					<!-- on 상태 -->
					<a href="#;" class="btn_size wide resizer">확장</a>

					<!-- wide 상태 
                            <a href="#;" class="btn_size normal">축소</a>
                            -->
				</div>
				<!-- //title -->

				<!-- filter -->
				<div class="top_filter">
					<div class="area_lft" style="display: inline-flex;">
						<a href="#" class="btn_chk">+ 표시할 열</a>
						<!-- 
                                .btn_chk 클릭 시 $(".layer_chk").addClass("on");
                                -->
						<p class="totCount_txt">총 69,376건</p>
						<div class="layer_chk">
							<label>주소 <input type="checkbox"></label> <label>가게명
								<input type="checkbox">
							</label> <label>인기도 <input type="checkbox"></label> <label>긴
								메뉴 <input type="checkbox">
							</label> <label>짧은 메뉴 <input type="checkbox"></label>
							<div class="layer_btm">
								<a href="#" class="btn_close">닫기</a>
							</div>
						</div>
					</div>

					<div class="area_rgt">
						<input type="text" class="inp_src hidden"> <a href="#"
							class="btn_down download link">데이터 다운로드</a>
					</div>
				</div>
				<!-- //filter -->
			</div>

			<div class="section_ct">
				<div class="brd_scroll" id="brd_list_grid"></div>
				<div class="paginate"></div>
			</div>

			<div class="layer_view_btn">
				<!-- on 상태 -->
				<a href="#" class="btn knocker open">열기</a>
			</div>

			<div class='loadingImg'>
				<img src='/omsc/jti/images/viewLoading.gif'>
			</div>
		</div>
	</section>
	
	<div class='store_infor'>
	</div>
	
	<div class="store_infor_src" style="display:none;">
		<!-- section_top -->
		<div class="section_top">
			<!-- article_top -->
			<div class="article_top">
				<h1 class="tit_main">
					점포 정보 <span>(</span> <span class="storeName"></span> <span>,
					</span> <span class="storeCD"></span> <span class="convenienceStore"></span>
					<span>)</span>
				</h1>
				<a href="#none" class="btn_close button dashboard close">닫기</a>
			</div>
			<!-- //article_top -->

			<div class="article_tab">
				<ul class="topTab">
					<li class="on"><a href="#none">지역정보</a></li>
					<li><a href="#none">JTI정보</a></li>
				</ul>
			</div>
		</div>
		<!-- //section_top -->

		<!-- scroll -->
		<div class="wrap_scroll">
			<div class="jtiInfo" style="display: none;">
				<iframe width="1200" height="500" id="symbUrlIFrame1"
					allowtransparency="true" data-siebel-cd="true"></iframe>
			</div>
			<div class="section_scroll">
				<!-- 대리점 code -->
				<div class="article_code"></div>
				<!-- //대리점 code -->

				<!-- 요약 -->
				<div class="article_summary">
					<ul>
						<!-- ============================================================
                                        # 등급 설명
                                        1등급  -  <p class="thm grade1">1등급</p>
                                        2등급  -  <p class="thm grade2">2등급</p>
                                        3등급  -  <p class="thm grade3">3등급</p>
                                        4등급  -  <p class="thm grade4">4등급</p>
                                        5등급  -  <p class="thm grade5">5등급</p>
                                    -->
						<li class="cate1">
							<p class="tit">거주인구</p>
							<p class="txt">
								<span class="rspopTotTval"></span>등급 / <span
									class="rspopTop1Profile"></span>
							</p> <!-- //거주인구 등급 -->
							<p class="thm"></p>
							<p class="resi grade_chart"></p>
						</li>
						<li class="cate2">
							<p class="tit">유동인구</p>
							<p class="txt">
								<span class="flpopTotTval"></span>등급 / <span
									class="flpopTop1Profile"></span>
							</p> <!-- //거주인구 등급 -->
							<p class="thm"></p>
							<p class="flow grade_chart"></p>
						</li>
						<li class="cate3">
							<p class="tit">상권활성도</p>
							<p class="txt">
								<span class="trdActTotTval">0</span>등급
							</p> <!-- // 상권활성도 1등급 -->
							<p class="thm"></p>
							<p class="act grade_chart"></p>
						</li>
						<li class="cate4">
							<p class="tit">대학유무</p>
							<p class="sisulUniv1Nm txt"></p> <!-- // 대학유무 건국대학교 -->
							<p class="thm"></p>
							<p class="toggle uni"></p>
						</li>
						<li class="cate5">
							<p class="tit">유흥가등급</p>
							<p class="txt">
								<span class="storeAdultTval"></span>등급
							</p> <!-- // 유흥가 유무 1등급 -->
							<p class="thm"></p>
							<p class="adult grade_chart"></p>
						</li>
						<li class="cate6">
							<p class="tit">역세권유무</p>
							<p class="toggle subway"></p>
						</li>
						<li class="cate7">
							<p class="tit">편의점 안정성</p> <!-- <p class="trdStaCstoreTval txt"></p> // 편의점 안정성 매우 안정적 -->
							<p class="txt">
								<span class="trdStaCstoreTvalText"></span>
							</p> <!-- // 편의점 안정성 매우 안정적 -->
							<p class="store trdStaCstoreTval grade_num"></p>
						</li>
					</ul>
				</div>
				<!-- //요약 -->

				<!-- 인구 -->
				<div class="article_con article_population">
					<div class="group_lft">
						<p class="tit_inner">유동인구</p>
						<div class="chart1" id="flowpopsex">
							<!-- 
                                            그래프 사이즈 : 300 * 250
                                            색상코드 : #00b0f0, #ff5050
                                        -->
						</div>
						<div class="chart1" id="flowpoptime">
							<!-- 
                                            그래프 사이즈 : 300 * 250
                                            색상코드 : #00b0f0
                                        -->
						</div>
					</div>
					<div class="group_rgt">
						<p class="tit_inner">거주인구</p>
						<div class="chart2" id="rspopchart">
							<!-- 
                                            그래프 사이즈 : 350 * 250
                                            색상코드 : #00b0f0, #ff5050
                                        -->
						</div>
					</div>
				</div>
				<!-- //인구 -->

				<!-- 지역특성 -->
				<p class="tit_outter">지역특성</p>
				<div class="article_con article_area">
					<div class="group_top">
						<p class="tit_inner">주택특성</p>
						<div class="chart1" id="houscnt">
							<!-- 
                                            그래프 사이즈 : 340 * 250
                                            색상코드 : #00b0f0, #0093f0, #0067d0, #3353ca, #1741ab
                                         -->
						</div>
						<div class="chart2" id="housewidth">
							<!-- 그래프 사이즈 320 * 250 -->
						</div>
						<div class="chart2" id="housecost">
							<!-- 그래프 사이즈 320 * 250 -->
						</div>
					</div>
					<div class="group_btm">
						<p class="tit_inner">주변정보</p>
						<div class="infor_area">
							<dl class="subway">
								<dt>지하철 수</dt>
								<dd>
									<p class="sisulSubwayCo cnt exist"></p>
									<!--주변정보 지하철 수  -->
									<!-- 								<ul class="list"></ul> -->
								</dd>
							</dl>
							<dl class="bus">
								<dt>버스 정류장 수</dt>
								<dd>
									<p class="sisulBusstopCo cnt"></p>
								</dd>
							</dl>
							<dl class="university">
								<dt>대학교 현황</dt>
								<dd>
									<table>
										<colgroup>
											<col width="50%" />
											<col width="50%" />
										</colgroup>
										<thead>
											<tr>
												<th>대학교명</th>
												<th>학생수</th>
											</tr>
										</thead>
										<tbody>
										</tbody>
									</table>
								</dd>
							</dl>
						</div>
					</div>
				</div>
				<!-- //지역특성 -->

				<!-- 상권특성 -->
				<p class="tit_outter">상권특성</p>
				<div class="article_con article_commercial">
					<div class="group_lft">
						<p class="tit_inner">점포 특성</p>
						<div class="chart1" id="storeRval">
							<!-- 
                                            그래프 사이즈 : 430 * 280
                                            색상코드 : #00b0f0
                                        -->
						</div>
						<div class="chart1" id="storeActive">
							<!-- 
                                            그래프 사이즈 : 430 * 280
                                            색상코드 : #00b0f0
                                        -->
						</div>
					</div>
					<div class="group_rgt">
						<p class="tit_inner">시/도 대비 특성</p>
						<div class="chart1" id="siRval">
							<!-- 
                                            그래프 사이즈 : 430 * 280
                                            색상코드 : #00b0f0
                                        -->
						</div>
						<div class="chart1" id="siActive">
							<!-- 
                                            그래프 사이즈 : 430 * 280
                                            색상코드 : #00b0f0
                                        -->
						</div>
					</div>
				</div>
				<!-- //상권특성 -->
			</div>
		</div>
		<!-- // -->

		<div class="layer_view_btn">
			<!-- on 상태 -->
			<!--
                        <a href="#" class="btn_view close">닫기</a>
                        -->

			<!-- 닫힌 상태
                        <a href="#" class="btn_view open">열기</a>
                        -->
		</div>
	</div>

	<div id="commentForm" class="popup_poi_add ui-draggable"
		style="left: 214.5px; display: none;">
		<!-- pop_header -->
		<div class="pop_header">
			<h2 class="pop_tit" id="comment_title">커멘트 작성</h2>
			<a href="#none"
				class="btn_close apoi_button apoi_cancel cancel_comment">닫기</a>
		</div>
		<!-- //pop_header -->
		<!-- pop_contents -->
		<div class="pop_contents">
			<form name="commnetFmw" id="commnetFmw" method="post"
				enctype="multipart/form-data"
				action="https://jti.selfmap.co.kr/mapserver/app/data/upload.json?upload.path=data/jti">
				<input type="hidden" name="commentMode" value="I"> <input
					type="hidden" name="userSeq" value=""> <input type="hidden"
					name="storeCd" value=""> <input type="hidden"
					name="commentSeq" value=""> <input type="hidden"
					name="imagePath" class="imagePath" value=""> <input
					type="hidden" name="upload.path" value="data/jti">
				<!--  수정시 추가   -->

				<textarea name="commentContents" class="comment_contents" cols="70"
					rows="6"></textarea>
				<p id="comment_textCount">
					(<span class="textCount">0</span>/300자)
				</p>
				<div class="comment imageArea"></div>
				이미지 파일 첨부<input type="file" name="file" id="my-data-file"
					class="myDataFile" accept="image/*">
			</form>

		</div>
		<div class="pop_footer commentWriteButton">
			<input type="button" value="확인"
				class="btn_confirm apoi_button ok_comment"> <input
				type="button" value="취소"
				class="btn_cancle apoi_button cancel_comment">
		</div>
		<div class="pop_footer commentUpdateButton" style="display: none;">
			<input type="button" value="수정"
				class="btn_confirm apoi_button upt_comment"> <input
				type="button" value="삭제" class="btn_cancle apoi_button del_comment">
			<input type="button" value="취소"
				class="btn_cancle apoi_button cancel_comment">
		</div>
	</div>
	<div id="modal"></div>
	<script
		src="//dapi.kakao.com/v2/maps/sdk.js?appkey=c048011bee430905e9bc71efdb271aa6&libraries=services"></script>
	<script src="config.js"></script>
	<script src="lib/jquery/jquery-1.11.2.min.js"></script>
	<script src="lib/jquery/jquery.form.min.js"></script>
	<script src="lib/jquery/jquery.fileDownload.js"></script>
	<script src="lib/jquery-ui.min.js"></script>
	<script src="lib/kendo/kendo.all.min.js"></script>
	<script src="lib/underscore-min.js"></script>
	<script src="lib/html2canvas/es6-promise.auto.min.js"></script>
	<script src="lib/html2canvas/html2canvas.min.js"></script>
	<script src="lib/CryptoJS v3.1.2/rollups/sha256.js"></script>
	<script src="lib/SlickGrid/lib/jquery-ui-1.8.16.custom.min.js"></script>
	<script src="lib/SlickGrid/lib/jquery.event.drag-2.2.js"></script>
	<script src="lib/SlickGrid/slick.core.js"></script>
	<script src="lib/SlickGrid/plugins/slick.cellrangedecorator.js"></script>
	<script src="lib/SlickGrid/plugins/slick.cellrangeselector.js"></script>
	<script src="lib/SlickGrid/plugins/slick.cellexternalcopymanager.js"></script>
	<script src="lib/SlickGrid/plugins/slick.cellselectionmodel.js"></script>
	<script src="lib/SlickGrid/slick.grid.js"></script>
	<script src="lib/proj4js/Proj4js.js"></script>
	<script src="lib/jcrop/jquery.Jcrop.min.js"></script>
	<script src="lib/proj4js/proj4.v1.3.4-compressed.js"></script>
	<script src="lib/Leaflet-1.0.2/leaflet-src.js"></script>
	<script src="lib/OpenMapV2/leaflet/control/L.Control.Zoomslider.js"></script>
	<script src="lib/OpenMapV2/leaflet/layer/leaflet-google.js"></script>
	<script src="lib/OpenMapV2/leaflet/layer/leaflet-daum.js"></script>
	<script src="lib/OpenMapV2/leaflet/proj4leaflet.js"></script>
	<script src="lib/OpenMapV2/leaflet/wicket.js"></script>
	<script src="lib/OpenMapV2/leaflet/wicket-leaflet.js"></script>
	<script
		src="lib/OpenMapV2/leaflet/control/Leaflet.draw/leaflet.draw-src.js"></script>
	<script src="lib/OpenMapV2/leaflet/control/L.openmate_measure.js"></script>
	<script src="lib/OpenMapV2/leaflet/OMLeaflet.js"></script>
	<script src="lib/OpenMapV2/leaflet/leaflet.label.js"></script>
	<script src="lib/OpenMapV2/SelfMap.js"></script>
	<script src="lib/common.js"></script>
	<script src="lib/main.js"></script>
	<script src="lib/selfmap.js"></script>
	<script
		src='//cdnjs.cloudflare.com/ajax/libs/jquery-throttle-debounce/1.1/jquery.ba-throttle-debounce.min.js'></script>

	<script>
		omsMain.config = {
			jtiPoiNo : undefined,
			dataNo : 0, // 기본 레이어 데이터번호
			dataSet : [], // 레이어 데이터집합
			visible : [], // 출력 대상 레이어
			enableVisible : true, // 보이기 활성화 
			layers : {}, // 레이어집합
			meta : {}, // 메타정보 (초기 서버에서 실시간 바인딩)
			dataVendor : {},
			filterAlias : {},
			dupItems : [], // 중복점포 담을 집합
			columnMap : {
				tier : 'COL11',
				address : 'ADDRESS',
				jtiVolumn : 'COL31',
				idstVolumn : 'COL35',
				contract : 'COL36',
				facShare : 'COL22',
				jtiFacing : 'COL27',
				batFacing : 'COL30',
				pmiFacing : 'COL28',
				ktgFacing : 'COL29'
			}
		}

		omsMain.init({
			selfmap : {
				reset : false,
				zoom : 14,
				center : [ 37.576026, 126.9768428 ],
				eventHandler : {
					click: omsMain.selfmap.wmsInfoPop,
					mouseover: function(e) {},
					mousemove: function(e) {},
					moveend: function(e) {},
					zoomend : function(e) {
						
						$('.leaflet-popup').hide();   // 점포 팝업창 닫음
						
						var zoom = omsMain.selfmap.getZoom();   // 현재 줌레벨 가져옴
						var layerNo = omsMain.getLayerNoByName('selfmap.service.flowpop');
						
						// 유동인구 레이어가 존재할 경우
						if(layerNo) {
							
							// 유동인구 상태가 on일 경우 
							if(omsMain.flowpop && omsMain.flowpop.state === 'on') {
								
								// zoom: 7 ~ 13
								if(zoom < 14) {
									
									// 현재 유동인구 레이어가 보이고 있을 경우 
									if(omsMain.selfmap.isVisible(layerNo)) {
// 										alert('현재 레벨에서는 유동인구를 볼 수 없습니다. 줌 인하여 주세요!');
// 										omsMain.selfmap.hideLayer(layerNo);
						        		alert('현재 레벨에서는 유동인구를 볼 수 없습니다. 줌 인 후 다시 활성시켜주세요!');
						        		omsMain.flowpop.jq.find('.off.button').trigger('click');
									}
								// zoom: 14 ~
								} else {
									omsMain.selfmap.showLayer(layerNo);
								}
							}
						}
					}
				}
			}
		});

		omsMain.selfmap.config.server.url = jtiConfig['mapserverUrl'];
		omsMain.selfmap.config.wms.url = jtiConfig['mapserverWmsUrl'];
		$('#controlBar li.map').addClass('on');

		jQuery.browser = {};
		(function() {
			jQuery.browser.msie = false;
			jQuery.browser.version = 0;
			if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
				jQuery.browser.msie = true;
				jQuery.browser.version = RegExp.$1;
			}
		})();

		// 레이어 생성 로딩창 닫기 클릭
		$('#layerLoading').find('.btn_close,.anal_cancel').click(function() {
			$('#modal').hide();
			$('#layerLoading').attr('req', 0);
			$('#layerLoading').hide();
		});

		// 주소검색 로딩창 닫기 클릭
		$('#addrLoading').find('.btn_close,.anal_cancel').click(function() {
			$('#modal').hide();
			$('#dataLoading').hide();
		});
		
		// 점포필터 데이터 삽입/수정 로딩창 닫기 클릭
		$('#dataLoading').find('.btn_close,.anal_cancel').click(function() {
			$('#modal').hide();
			$('#dataLoading').hide();
		});
		
		// 엑셀파일 다운로드 로딩창 닫기 클릭
		$('#downloadLoading').find('.btn_close,.anal_cancel').click(function() {
			$('#modal').hide();
			$('#downloadLoading').hide();
		});
	</script>

	<script src="/omsc/jti/component/infoPop/infoPop.js"></script>
	<script src="/omsc/jti/component/region/region.js"></script>
	<script src="/omsc/jti/component/controlBar/controlBar.js?version=20190813"></script>
	<script src="/omsc/jti/lib/daumAPI.js"></script>
	<script src="/omsc/jti/commonModule/navigation.js"></script>
	<script
		src="/omsc/jti/component/regionCharacteAnal/regionCharacteAnal.js"></script>
	<script
		src="/omsc/jti/component/regionCharacteAnalSub/regionCharacteAnalSub.js"></script>
	<script src="/omsc/jti/component/resultReport/resultReport.js"></script>
	<script
		src="/omsc/jti/component/resultReportTable/resultReportTable.js"></script>
	<script src="/omsc/jti/component/nearbyBusinesses/nearbyBusinesses.js"></script>
	<script
		src="/omsc/jti/component/nearbyBusinessesNewPoi/nearbyBusinessesNewPoi.js"></script>
	<script src="/omsc/jti/commonModule/mapComp.js"></script>
	<script src="/omsc/jti/component/filterBox/filterBox.js"></script>
	<script src="/omsc/jti/component/filterEdit/filterEdit.js"></script>
	<script src="/omsc/jti/component/flowpop/flowpop.js"></script>
	<script src="/omsc/jti/component/dataView/dataView.js"></script>
	<script src="/omsc/jti/component/commentForm/commentForm.js"></script>
	<script src="/omsc/jti/component/dashboard/dashboard.js"></script>
	<script src="/omsc/jti/lib/addLayerData.js?version=20190813"></script>
</body>

</html>

