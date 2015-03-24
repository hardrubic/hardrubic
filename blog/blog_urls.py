# -*- coding: utf-8 -*-
from django.conf.urls import patterns, url;
from blog.file_views import *
from blog.login_views import *
from blog.manager_views import *


urlpatterns = patterns('',

    #展示页
    url(r'^$',init),
    url(r'^article_list/',article_list),
    url(r'^article_detail/',article_detail),
    url(r'^message/',message),
    url(r'^myself/',myself),
    
    #登陆
    url(r'^login/$',init_login),
    url(r'^login/login_in/',login_in),
    url(r'^login/login_out/',login_out),
    url(r'^login/test/',test),

    #目录
    url(r'^category/',init_category),
    
    #管理
    url(r'^manager/$',manager_init),
    url(r'^manager/manager_article_new',manager_article_new),
    url(r'^manager/manager_article_list',manager_article_list),
    url(r'^manager/manager_article_edit',manager_article_edit),
    url(r'^manager/manager_article_del',manager_article_del),
    url(r'^manager/manager_article_save',manager_article_save),
    url(r'^manager/manager_file_upload',file_upload),

)
