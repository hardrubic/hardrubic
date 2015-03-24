# -*- coding: utf-8 -*-

"""我的项目工具"""

from django.db import connection, transaction
from blog.models import PrvSysparam


class SysParamTool:
    """参数翻译"""

    @staticmethod
    def trans_param(gcode,value):
        prv_sysparam = PrvSysparam.objects.get(gcode=gcode,mcode=value);
        return prv_sysparam.__dict__.get('mname');


class DbTool:
    """DB Tool"""

    def __init__(self):
        pass;

    @staticmethod
    def __dict_fetchone(cursor):
        desc = cursor.description
        return dict(zip([col[0] for col in desc], cursor.fetchone()))

    @staticmethod
    def __dict_fetchall(cursor):
        desc = cursor.description
        return [
            dict(zip([col[0] for col in desc], row))
            for row in cursor.fetchall()
        ]

    @staticmethod
    def find_one(sql):
        """
        myTool,search one data
        :param sql:
        :return:
        """
        cursor = connection.cursor();
        cursor.execute(sql);
        return DbTool.__dict_fetchone(cursor);

    @staticmethod
    def find_all(sql):
        """
        myTool,search manay datas
        :param sql:
        :return:
        """
        cursor = connection.cursor();
        cursor.execute(sql);
        return DbTool.__dict_fetchall(cursor);

    @staticmethod
    def execute_sql(sql):
        """
        mytool,execute SQL
        :param sql:
        """
        cursor = connection.cursor();
        cursor.execute(sql);
        transaction.commit_unless_managed();
