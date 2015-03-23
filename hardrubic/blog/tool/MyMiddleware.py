# -*- coding: utf-8 -*-
from django.http import HttpResponseRedirect


class LoginMiddleware(object):
    """登陆拦截"""

    def process_request(self, request):

        # 如果是管理路径，检查是否登陆
        if '/blog/manager' in request.path and not request.user.is_authenticated():
            return HttpResponseRedirect("/blog/login")