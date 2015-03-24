# -*- coding: utf-8 -*-
from django.contrib.auth import get_user
from django.shortcuts import render_to_response
from django.template import RequestContext;
from django.core.paginator import PageNotAnInteger, Paginator, InvalidPage, \
    EmptyPage
from blog.models import *
from blog import constant
from blog.tool.MyProjectTool import *


def init(request):
    """
    加载首页
    :param request:
    :return:
    """

    categoryid = request.REQUEST.get('categoryid');

    # 最近文章列表
    recent_articles = BlogArticle.objects.order_by('-times').filter(
        status='1').values('times', 'articleid', 'caption')[0:10];

    # 获取已登录的用户信息
    username = get_user(request).username;

    return render_to_response('main/index.html', locals(),
                              context_instance=RequestContext(request));


def article_list(request):
    """
    文章列表
    :param request:
    :return:
    """

    # 获取get参数
    categoryid = request.REQUEST.get('categoryid');
    month = request.REQUEST.get('month');
    year = request.REQUEST.get('year');

    if categoryid:
        # 指定分类文章列表
        sql = '''SELECT a.articleid,a.caption,a.shortContent,a.times,a.degree,
                  a.cateid,b.cateName
                 FROM blog_article a,blog_category b
                 WHERE a.cateid=b.cateid
                 AND a.status='1' '''
        if categoryid != '0':
            sql += ''' and a.cateid=''' + categoryid
        sql += ''' order by a.times desc''';
        articles = DbTool.find_all(sql);
    elif month:
        # 指定年份文章列表
        sql = '''SELECT a.articleid,a.caption,a.shortContent,a.times,a.degree,
                        a.cateid,b.cateName
                 FROM blog_article a,blog_category b
                 WHERE a.cateid=b.cateid
                 AND a.status='1'
                 AND year(a.times)=''' + year;
        sql += ''' and month(a.times)=''' + month;
        sql += ''' order by a.times desc''';
        articles = DbTool.find_all(sql);
    elif year:
        # 指定年月文章列表
        sql = '''SELECT a.articleid,a.caption,a.shortContent,a.times,a.degree,
                        a.cateid,b.cateName
                 FROM blog_article a,blog_category b
                 WHERE a.cateid=b.cateid
                 AND a.status='1'
                 AND year(a.times)=''' + year;
        sql += ''' order by a.times desc''';
        articles = DbTool.find_all(sql);
    else:
        # 文章列表
        sql = '''SELECT a.articleid,a.caption,a.shortContent,a.times,a.degree,
                        a.cateid,b.cateName
                 FROM blog_article a,blog_category b
                 WHERE a.cateid=b.cateid AND a.status='1' ORDER BY a.times DESC
                 '''
        articles = DbTool.find_all(sql)

    try:
        page = int(request.GET.get('page', 1))
        if page < 1:
            page = 1
    except ValueError:
        page = 1

    paginator = Paginator(articles, constant.PAGE_ARTICLE_NUM);  # 设置每页显示的数量

    try:
        articles_page = paginator.page(page);
    except(EmptyPage, InvalidPage, PageNotAnInteger):
        articles_page = paginator.page(1);
    if page > constant.BEFORE_PAGE_NUM:
        page_range = paginator.page_range[page - constant.BEFORE_PAGE_NUM - 1:
                        page + constant.AFTER_PAGE_NUM];
    else:
        page_range = paginator.page_range[0:constant.AFTER_PAGE_NUM + int(page)];

    return render_to_response('main/content.html', locals(),
                              context_instance=RequestContext(request));


def article_detail(request):
    """
    文章详细
    :param request:
    :return:
    """

    # 获取已登录的用户信息
    username = get_user(request).username;

    # 查询文章
    articleid = request.GET.get('articleid')
    sql = '''SELECT a.articleid,a.caption,a.times,a.degree,a.content,b.cateName
            FROM blog_article a,blog_category b
            WHERE a.cateid=b.cateid
            AND a.articleid=''' + articleid
    article = DbTool.find_one(sql);

    ariticle_id = article['articleid']
    caption_one = article['caption']
    cate_name_one = article['cateName']
    degree_one = article['degree']
    times_one = article['times']
    content_one = article['content']

    # 增加阅读次数
    degree_go = int(degree_one) + 1
    BlogArticle.objects.filter(articleid=articleid).update(degree=degree_go)

    # 下一篇文章
    next = BlogArticle.objects.order_by('articleid').filter(
        articleid__gt=articleid).values('articleid', 'caption')[:1];
    if next:
        next_id = next[0]['articleid']
        next_caption = next[0]['caption']
    # 上一篇文章
    previous = BlogArticle.objects.order_by('-articleid').filter(
        articleid__lt=articleid).values('articleid',
                                        'caption')[:1];
    if previous:
        previous_id = previous[0]['articleid']
        previous_caption = previous[0]['caption']
    return render_to_response('main/articleDetail.html', locals(),
                              context_instance=RequestContext(request));


def init_category(request):
    """
    初始化日志页面
    :param request:
    :return:
    """

    # 获取已登录的用户信息
    username = get_user(request).username;

    # 日志目录
    categories = query_category();

    # 归档目录年份
    cales_year = _query_cale_year();
    # 归档目录月份
    cales_month = _query_cale_month();

    return render_to_response('category/cate_index.html', locals(),
                              context_instance=RequestContext(request));


def message(request):
    """
    留言
    :return:
    """

    # 获取已登录的用户信息
    username = get_user(request).username;

    return render_to_response('main/message.html', locals(),
                              context_instance=RequestContext(request));


def myself(request):
    """
    关于我
    :return:
    """
    # 获取已登录的用户信息
    username = get_user(request).username;

    return render_to_response('main/myself.html', locals(),
                              context_instance=RequestContext(request));


def query_category():
    """
    获取日志目录
    :return:
    """
    sql = '''SELECT b.cateid,b.cateName,
            (CASE b.cateid
            WHEN 0
            THEN (SELECT count(1) FROM blog_article)
            ELSE (SELECT count(1) FROM blog_article a WHERE a.cateid=b.cateid)
            END) cateNum
            FROM blog_category b
            ORDER BY cateid;'''
    categories = DbTool.find_all(sql);
    return categories;


def _query_cale_year():
    """
    获取归档目录年份信息
    :return:
    """
    sql = '''SELECT YEAR (a.times) year,count(YEAR(a.times)) year_num
             FROM blog_article a
             WHERE a.STATUS = '1'
             GROUP BY YEAR (a.times)
             ORDER BY YEAR DESC;'''
    cales_year = DbTool.find_all(sql);
    return cales_year;


def _query_cale_month():
    """
    获取归档目录月份信息
    :rtype : object
    :return:
    """
    sql = '''SELECT YEAR (a.times) year,MONTH (a.times) month,
                    count(MONTH(a.times)) month_num
             FROM blog_article a
             WHERE a. STATUS = '1'
             GROUP BY MONTH (a.times)
             ORDER BY YEAR DESC,MONTH DESC;'''
    cales_month = DbTool.find_all(sql);
    return cales_month;