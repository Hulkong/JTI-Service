<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
    request.setCharacterEncoding("utf-8");
    session.invalidate();
%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Insert title here</title>
<script>
var userAgent = navigator.userAgent;
alert("로그아웃 되었습니다.");

var url = "/omsc/jti/login.jsp";

location.href=url;
</script>
</head>
<body>

</body>
</html>