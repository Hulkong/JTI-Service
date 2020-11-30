<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" 
%>
<script src="/omsc/jti/lib/jquery/jquery-1.11.2.min.js"></script>
<script src="/omsc/jti/config.js"></script>
<%
String ss_yn = (String) request.getParameter("ss_yn");
String userSeq = (String) request.getParameter("user_seq");
String userId = (String) request.getParameter("user_id");
String userPw = (String) request.getParameter("user_pw");
String is_admin = (String) request.getParameter("is_admin");
String userNm = (String) request.getParameter("user_name");
if(ss_yn != null && ss_yn.equals("Y")){  // 세션생성 
    if(session != null){  
        session.invalidate(); 
    }
//     userNm = new String(userNm.getBytes("iso-8859-1"),"utf-8");//운영선 깨짐
    session = request.getSession(true);
    session.setAttribute("user_seq", userSeq);
	session.setAttribute("user_id", userId);
    session.setAttribute("user_name", userNm);
    session.setAttribute("is_admin", is_admin);

%>
<script>
alert("<%=session.getAttribute("user_name")%>로그인 되었습니다.");
location.href="/omsc/jti/index.jsp";
</script>
<%
}

if(userPw == null || userPw.equals("") || userId == null || userId.equals("")){
%>
<script>
alert("아이디와 비밀번호를 다시 확인해주세요.");
location.href="/omsc/jti/login.jsp";
</script>
<%	
}else{
%>
<script>
$(document).ready(function(){
	getUserInfo();	
});
</script>
<%}%>
<script>
function getUserInfo(){
	
	$.ajax(jtiConfig['mapserverUrl'] + '/data/mapper.json', {
		data: { 
			sqlId: 'jti.getUserInfo',
			sqlMode: 'SELECT_ONE',
			userId: '<%=userId%>'
		},
		success: function(result, status) {
			var userPw = '<%=userPw%>';
			if(result){
				if(result.passwd == userPw){
					$(".ss_yn").val("Y");
					$(".user_name").val(result.userNm);
					$(".is_admin").val(result.adminYn);
					$(".user_seq").val(result.userSeq);
					$(".frm").attr("action", "/omsc/jti/loginPro.jsp");
					$(".frm").submit();
				}else{
					alert("비밀번호가 일치하지않습니다.");
					location.href="/omsc/jti/login.jsp";
				}
			}else{
				alert("등록되지 않은 사용자 입니다.");
				location.href="/omsc/jti/login.jsp";
			}
		},
		error: function(result, status, error) {
			//console.log(status);
			//console.log(error);
			alert('등록되지 않은 사용자 입니다.');
			location.href="/omsc/jti/login.jsp";
		},
		method: 'POST'
	});
}
</script>

<form name="frm" class="frm" method="post" >
	<input type="hidden" name="ss_yn" class="ss_yn"/>
	<input type="hidden" name="user_id" value="<%=userId%>"/>
	<input type="hidden" name="user_seq" class="user_seq" />
	<input type="hidden" name="user_name" class="user_name"/>
	<input type="hidden" name="is_admin" class="is_admin"/>
</form>
