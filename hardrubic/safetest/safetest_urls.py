from django.conf.urls import patterns, include, url
from hardrubic.safetest.xss_views import *;

urlpatterns = patterns('',   
     url(r'^$',initXss),
     url(r'^xss/$',initXss), 
     url(r'^xss/simpleXss',simpleXss),   
     url(r'^xss/loginIn',loginIn),  
     url(r'^xss/loginOut',loginOut),   

)
