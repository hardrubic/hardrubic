# -*- coding: utf-8 -*-
from django.http import HttpResponse
from datetime import datetime
import json

from hardrubic.blog.blog_views import *
from hardrubic.blog.models import *
from hardrubic.blog import constant;


def manager_init(request):
    """
    加载管理首页
    :param request:
    :return:
    """

    # 日志目录
    categories = query_category();

    # 获取已登录的用户信息
    username = get_user(request).username;

    return render_to_response('manager/manager_index.html', locals());


def manager_article_list(request):
    """
    加载文章列表
    :param request:
    """

    # 获取get参数
    categoryid = request.REQUEST.get('categoryid');

    if categoryid:
        # 指定分类文章列表
        sql = '''SELECT a.articleid,a.caption,a.shortContent,a.times,a.degree,
                      a.status,a.cateid,b.cateName
                 FROM blog_article a,blog_category b
                 WHERE a.cateid=b.cateid '''
        if categoryid != '0':
            sql += ''' and a.cateid=''' + categoryid
        sql += ''' order by a.times desc ''';
        articles = DbTool.find_all(sql);
    else:
        # 文章列表
        sql = '''SELECT a.articleid,a.caption,a.shortContent,a.times,a.degree,
                      a.status,a.cateid,b.cateName
                FROM blog_article a,blog_category b
                WHERE a.cateid=b.cateid
                ORDER BY a.times DESC'''
        articles = DbTool.find_all(sql);

    # 翻译参数
    for article in articles:
        article['status'] = SysParamTool.trans_param('ARTICLE_STATUS',
                                                     article.get('status'));

    try:
        page = int(request.GET.get('page', 1))
        if page < 1:
            page = 1
    except ValueError:
        page = 1
    paginator = Paginator(articles, constant.PAGE_ARTICLE_NUM);  # 设置每页显示的数量
    try:
        articlelist = paginator.page(page);
    except(EmptyPage, InvalidPage, PageNotAnInteger):
        articlelist = paginator.page(1);
    if page > constant.BEFORE_PAGE_NUM:
        page_range = paginator.page_range[page - constant.AFTER_PAGE_NUM:page +
                                                    constant.BEFORE_PAGE_NUM];
    else:
        page_range = paginator.page_range[
                     0:int(page) + constant.AFTER_PAGE_NUM];

    return render_to_response('manager/manager_content.html', locals(),
                              context_instance=RequestContext(request));


def manager_article_new(request):
    """
    新建文章
    :return:
    """
    # 获取已登录的用户信息
    username = get_user(request).username;

    return render_to_response('manager/manager_articleEdit.html', locals(),
                              context_instance=RequestContext(request));


def manager_article_edit(request):
    """
    编辑文章内容
    :param request:
    :return:
    """
    # 获取已登录的用户信息
    username = get_user(request).username;

    # 查询文章
    articleid = request.REQUEST.get('articleid')
    sql = '''SELECT a.articleid,a.caption,a.times,a.degree,a.shortContent,
                  a.content,a.status,b.cateName
            FROM blog_article a,blog_category b
            WHERE a.cateid=b.cateid
            AND a.articleid=''' + articleid
    article = DbTool.find_one(sql);

    ariticle_id = article['articleid']
    caption_one = article['caption']
    cate_name_one = article['cateName']
    degree_one = article['degree']
    times_one = article['times']
    short_content_one = article['shortContent']
    content_one = article['content']
    status_one = article['status']

    return render_to_response('manager/manager_articleEdit.html', locals(),
                              context_instance=RequestContext(request));


def manager_article_save(request):
    """
    保存文章编辑内容
    :param request:
    :return:
    """

    req = json.loads(request.body.decode('utf-8'));
    articleid = req.get('articleid');
    caption = req.get('caption');
    catename = req.get('catename');
    content = req.get('content');
    shortcontent = req.get('shortContent');
    status = req.get('status');

    if articleid:  # 更新文章内容
        BlogArticle.objects.filter(articleid=articleid).update(
            content=content, shortContent=shortcontent, status=status);
        return_value = "保存文章成功";
    else:  # 新建文章
        # 获取文章分类ID
        return_value = _check_cate_name(catename);
        if isinstance(return_value, int):
            cateid = return_value;
            # 新建文章
            article = BlogArticle(
                cateid=cateid,
                caption=caption,
                content=content,
                shortContent=shortcontent,
                tags="",
                times=datetime.now(),
                degree=0,
                status=0);
            article.save();
            return_value = article.articleid;

    data = {
        'msg': return_value
    }
    return HttpResponse(json.dumps(data, ensure_ascii=False));


def manager_article_del(request):
    """
    删除文章
    :param request:
    :return:
    """

    articleid = request.REQUEST.get('articleid');
    BlogArticle.objects.filter(articleid=articleid).delete();

    return manager_article_list(request);


def _check_cate_name(cate_name):
    """
    尝试获取文章分类ID
    :param cate_name:
    :return:
    """
    if cate_name == "":
        return "文章分类不能为空";
    else:
        category = BlogCategory.objects.filter(cateName=cate_name).values(
            'cateid');
        if category:
            cateid = category[0]['cateid']
            return cateid;
        if not category:
            return "没有找到对应的文章分类ID";
