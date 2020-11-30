<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="java.util.*" %><%
	int code = response.getStatus();
	if(404 == code) {
%>
404 error<%
	} else if(500 == code) {
%>
500 error<%		
	} else {
%>
default<%
	}
%>