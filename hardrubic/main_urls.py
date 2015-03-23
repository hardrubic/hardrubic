from django.conf.urls import patterns, include, url
from django.conf import settings

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',

    url(r'^$', include('hardrubic.blog.blog_urls')),
    url(r'^/', include('hardrubic.blog.blog_urls')),
    url(r'^blog/', include('hardrubic.blog.blog_urls')),
    url(r'^safetest/', include('hardrubic.safetest.safetest_urls')),
    url(r'^admin/', include(admin.site.urls)),
)

# static file
if settings.DEBUG:
    urlpatterns += patterns('',
        url(r'^static/(?P<path>.*)$','django.views.static.serve',
            {'document_root': settings.STATIC_ROOT}),)
    urlpatterns += patterns('',
        url(r'^media/(?P<path>.*)$','django.views.static.serve',
            {'document_root': settings.MEDIA_ROOT,}),)
