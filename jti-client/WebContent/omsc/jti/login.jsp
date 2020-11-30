<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>JTI</title>
<%
	request.setCharacterEncoding("utf-8");
	session.setMaxInactiveInterval(0);
	String userId = (String) session.getAttribute("user_id");
	if (userId != null && !userId.equals("")) {
%>
<script>
	location.href = "/omsc/jti";
</script>
<%
	}
%>
<link type="text/css" rel="stylesheet" href="./css/reset.css" />
<link type="text/css" rel="stylesheet" href="./css/layout.css" />
<script src="/omsc/jti/lib/jquery/jquery-1.11.2.min.js"></script>
</head>
<body>
	<div id="subWrap">
		<!-- header -->
		<div id="header">
			<div class="inner">
				<h1 class="logo">
					<a href="#"><img src="./images/logo.png" alt="logo" /></a>
				</h1>
			</div>
		</div>
		<!-- //header -->

		<!-- contents -->
		<div id="contents">
			<div class="layout_member">
				<h2 class="tit_mem_login">로그인하기</h2>
				<form name="loginFrm" class="loginFrm" method="post"
					action="/omsc/jti/loginPro.jsp">
					<input type="hidden" name="service" value="selfmap">
					<div class="area_input">
						<dl>
							<dt>아이디</dt>
							<dd class="bx_inp_id">
								<input type="text" name="user_id" placeholder="id" value="" />
							</dd>
							<dt>패스워드</dt>
							<dd class="bx_inp_pw">
								<input type="password" name="user_pw" placeholder="password"
									value="" />
							</dd>
						</dl>
					</div>
					<div class="area_btn">
						<ul>
							<li><span class="mem_btn_ty2">
									<input type="button" value="Login" class="login button" />
								</span>
							</li>
						</ul>
					</div>
				</form>
			</div>
		</div>
		<!-- //contents -->
	</div>
	<script>
	
	// id keydown 이벤트 
	$("input:text[name=user_id]").keydown(function(event) {
		
		// Enter키 입력시 password 입력박스 포커스 
		if (event.keyCode == 13) {
			$("input:password[name=user_pw]").focus();
			return;
		}
	});

	// password keydown 이벤트 
	$("input:password[name=user_pw]").keydown(function(event) {
		
		// Enter키 입력시 Login버튼 클릭 이벤트 트리거 
		if (event.keyCode == 13) {
			$(".login").trigger("click");
			return;
		}
	});

	// Login 버튼 클릭 이벤트 
	$(".login").click(function() {
		$(".loginFrm").submit();
	});
	</script>
</body>
</html>
