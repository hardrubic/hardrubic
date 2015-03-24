# -*- coding: utf-8 -*-
from django.db import models
from django.contrib import admin


class BlogCategory(models.Model):
    cateid = models.AutoField(u'分类ID', primary_key=True);
    cateName = models.CharField(max_length=64);

    class Meta:
        db_table = 'blog_category';

    def __unicode__(self):
        return '%s' % self.cateName;


class BlogArticle(models.Model):
    articleid = models.AutoField(u'文章ID', primary_key=True)
    caption = models.CharField(u'标题', max_length=100)
    cateid = models.IntegerField(u'文章类别')
    shortContent = models.TextField(u'短正文')
    content = models.TextField(u'正文')
    tags = models.TextField(u'标签', null=True)
    times = models.DateTimeField(u'发表日期')
    degree = models.IntegerField(u'阅读次数')
    status = models.CharField(u'状态', max_length=1)

    class Meta:
        db_table = 'blog_article'
        verbose_name = '文章'
        verbose_name_plural = '文章列表'
        ordering = ('times',)

    def __unicode__(self):
        return '%s %s %s %s %s %s %s' % (self.caption, self.cateid,
                                         self.shortContent, self.content, self.tags, self.times, self.degree);


class PrvSysparam(models.Model):
    paramid = models.AutoField(u'参数id', primary_key=True)
    gcode = models.CharField(u'gcode', max_length=64)
    mcode = models.CharField(u'mcode', max_length=64)
    mname = models.CharField(u'名称', max_length=64)
    tosort = models.IntegerField(u'排序', null=True)
    memo = models.CharField(u'备注', max_length=255, null=True)

    class Meta:
        db_table = 'prv_sysparam'

    def __unicode__(self):
        return '%s %s %s %s %s' % (self.mname, self.gcode,
                                   self.mcode, self.tosort, self.memo);


class BlogArticleAdmin(admin.ModelAdmin):
    list_display = ('caption', 'shortContent', 'times');
