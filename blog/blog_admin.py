from django.contrib import admin
from hardrubic.blog.models import BlogArticle,BlogArticleAdmin

admin.site.register(BlogArticle, BlogArticleAdmin)
