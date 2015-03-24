# -*- coding: utf-8 -*-
import json
import os
from django.http import HttpResponseRedirect, HttpResponse
import settings


def file_upload(request):

    #ckeditor的上传控件实际是为：<input  type="file" name="upload" .../>
    #request.FILES获取到的是类class UploadedFile
    file = request.FILES.get('upload', None);
    filename = file.name;
    filesize = file.size;
    filecontenttype = file.content_type;

    #文件类型校验（需要支持图片，图片转换成特定格式保存）
    if filecontenttype != 'image/jpeg':
        return HttpResponse(json.dumps({'msg':'暂时只支持上传jpeg图片'}, ensure_ascii=False));

    #文件大小校验（要优化）
    if filesize > 100000000:
        return HttpResponse(json.dumps({'msg':'图片过大'}, ensure_ascii=False));

    print(settings.STATIC_ROOT);
    print(settings.MEDIA_ROOT);
    #保存文件到磁盘
    path = os.path.join(settings.MEDIA_ROOT,'blog/upload');
    #path_file = os.path.join(path,filename);
    destination = open(path,'w')
    for chunk in file.chunks():
        destination.write(chunk);
    destination.close();

    print(filename);
    print(filesize);
    print(filecontenttype);

    data = {
        'filename':filename,
        'filesize':filesize,
        'filecontenttype':filecontenttype
    };
    return HttpResponse(json.dumps(data, ensure_ascii=False));