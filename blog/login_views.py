# -*- coding: utf-8 -*-
import json
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render_to_response


def test(request):
    injson = json.loads(request.body.decode('utf-8'));
    print(injson);
    print(injson.get('inmsg'))
    # inmsg = request.REQUEST['inmsg'];
    # print(inmsg);

    return HttpResponse(json.dumps({'outmsg': 'hi'}))


def init_login(request):
    """
    登陆主页
    :return:
    """

    # 校验是否已登录
    if request.user.is_authenticated():
        return HttpResponseRedirect("/blog/manager/");

    return render_to_response("login/login_index.html");


def login_in(request):
    """
    登陆
    :param request:
    :return:
    """

    username = request.POST.get('username');
    password = request.POST.get('password');

    user = authenticate(username=username, password=password);

    if user is None:
        return render_to_response("login/login_index.html",
                                  {'login_message': '密码不正确或账户不存在'});

    login(request, user);
    return HttpResponseRedirect("/blog/manager/", {'username': username});


def login_out(request):
    """
    注销
    :param request:
    :return:
    """

    logout(request);

    return HttpResponseRedirect("/blog/");