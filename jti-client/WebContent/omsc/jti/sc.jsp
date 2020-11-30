<%@ page contentType = "text/html; charset=euc-kr" import="java.util.*,java.text.*" %>
<%
	response.addHeader("Access-Control-Allow-Origin", "*");
	
	long time = System.currentTimeMillis(); 

	SimpleDateFormat dayTime = new SimpleDateFormat("yyyy-mm-dd hh:mm:ss");

	String str = dayTime.format(new Date(time));

	out.print(str);

%>

