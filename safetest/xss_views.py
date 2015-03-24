# -*- coding: utf-8 -*-
from django.shortcuts import render_to_response
from django.template import RequestContext;
from django.core.paginator import PageNotAnInteger, Paginator, InvalidPage, EmptyPage
from django.http import HttpResponse
import time
import datetime
import sys

def initCoding():
	reload(sys)
	sys.setdefaultencoding("gbk");

#加载xss首页   
def initXss(request):
	#验证是否已经登陆
	if True == request.COOKIES.has_key('username'):
		flag = "success";
		username = request.COOKIES['username'];
	
	return render_to_response('xss/xss_index.html',locals(),context_instance=RequestContext(request));
	
def simpleXss(request):
	initCoding();
	
	param = request.REQUEST.get('param');
	checkflag = request.REQUEST.get('checkflag');
	
	return render_to_response('xss/xss_index.html',locals(),context_instance=RequestContext(request));
	
def loginIn(request):
	initCoding();
	
	username = request.REQUEST.get('username');
	password = request.REQUEST.get('password');
	
	flag = 'fail';
	if username != None and password != None:
		flag = "success";
		
	response = render_to_response('xss/xss_index.html',locals());
	
	if flag == "success":
		#将登陆信息写入cookie
		response.set_cookie('username',username,3600)
		
	return response;
	
def loginOut(request):
	initCoding();
	
	response = render_to_response('xss/xss_index.html');
	
	if True == request.COOKIES.has_key('username'):
		response.delete_cookie('username');
	
	return response;
	
