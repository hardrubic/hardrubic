Sysparam = {
		/**
		 * 用于上级下拉框的onchange事件，以生成下级下拉框
		 * @param gcode 下级下拉框gcode
		 * @param scode 上级下拉框的值，一般为this.value
		 * @param obj 下级下拉框对象，传入对象名即可
		 * @param callback 完成下拉对象构造后的回调函数
		 * @param extra 附加选项(A：* 所有；P: ‘’ 请选择)
		 */
		subSelect	:	function(gcode, scode, obj, callback, extra,value){
			if(typeof value=="undefined") value="";
			if(!scode || scode == "") {
				obj.html("");
				if(extra){
					if(extra.indexOf('P')!=-1)
					    obj.append("<option value=''>--请选择--</option>");
					
				    if(extra.indexOf('A')!=-1)
					    obj.append("<option value='*'>所有</option>");			    
				}
				
				obj.val(value);			
				return;
			}
			var url =  Sysparam.SUB_SELECT + "?gcode=" + gcode;
			url += "&scode=" + scode;
			$.ajax({
			type: "post",
			url: url,
			data: "",
			dataType:"json",
			success: function(json){
				Sysparam.reconstruct(json.paramList, obj, null, extra);
				obj.val(value);
				if(callback)
					callback(json);
			}
		});
		},
		/**
		 * 用于上级下拉框的onchange事件，以生成下级下拉框,与上面的方法比较，此方法会同步的，
		 * 就是等到执行完这个方法，返回才执行一够。
		 * @param gcode 下级下拉框gcode
		 * @param scode 上级下拉框的值，一般为this.value
		 * @param obj 下级下拉框对象，传入对象名即可
		 * @param callback 完成下拉对象构造后的回调函数
		 * @param extra 附加选项(A：* 所有；P: ‘’ 请选择)
		 */
		subSyncSelect	:	function(gcode, scode, obj, callback, extra,value){
			if(typeof value=="undefined") value="";
			if(!scode || scode == "") {
				obj.html("");
				if(extra){
					if(extra.indexOf('P')!=-1)
					    obj.append("<option value=''>--请选择--</option>");
					
				    if(extra.indexOf('A')!=-1)
					    obj.append("<option value='*'>所有</option>");			    
				}
				
				obj.val(value);			
				return;
			}
			var url =  Sysparam.SUB_SELECT + "?gcode=" + gcode;
			url += "&scode=" + scode;
			
			var ret = Connection(url, {}, true);
				
			if(ret!=null){
				var json = $.evalJSON(ret);
				Sysparam.reconstruct(json.paramList, obj, null, extra);
				obj.val(value);
				if(callback)
					callback(json);
			}
		},
		/**
		 * 用json数据重新构建下拉框
		 * @param json json对象
		 * @param obj 对象名
		 * @param opfunc 自定义 option 标签的生成函数
		 * @param extra 附加选项(A：* 所有；P: ‘’ 请选择; I: 如果有多条，请选择)
		 */
		reconstruct	:	function(list, obj, opfunc, extra, value){
			obj.html("");
			
			if(extra){
				if(extra.indexOf('P')!=-1)
				    obj.append("<option value=''>--请选择--</option>");
				
				else if(extra.indexOf('A')!=-1)
				    obj.append("<option value='*'>所有</option>");	
			    
				else if(extra.indexOf('I')!=-1 && list && list.length > 1)
				    obj.append("<option value=''><font color=red>--多条数据，请选择--</font></option>");
			}

			if(!list)
				return;

			for(var i=0;i<list.length;i++){
				var op = $("<option></option>");
				var opObj = {};
				if (opfunc)
					opObj = opfunc(list[i]);
				else {
					opObj.key = list[i].mcode;
					opObj.value = list[i].mname;
				}
				if (!opObj)
					continue;
				
				if(value && value!="" && value == opObj.key){
					op.attr("selected","selected");
				}
				op.val(opObj.key);
				op.html(opObj.value);
				obj.append(op);
			}
		},
		
		/**
		 * @param gcode 下级下拉框gcode
		 * @param scode 上级参数值
		 * @param data : "columnIndex:value~columnIndex:value1,value2~columnIndex:value";
		 * @param obj 对象名
		 * @param callback 完成下拉对象构造后的回调函数
		 * @param extra 附加选项(A：* 所有；P: ‘’ 请选择)
		 * @param value 初始值
		 */
		getOptionByData	:	function(gcode, scode, data, obj, callback, extra, value){
			if(!gcode || gcode == "")
				return;
			var url = Sysparam.GET_OPTION_BY_DATA + "?gcode=" + gcode;
			url += "&scode=" + scode;
			url += "&data=" + data;
			$.ajax({
				type: "post",
				url: url,
				data: "",
				dataType:"json",
				success: function(json){
					Sysparam.reconstruct(json.paramList, obj,null, extra, value);
					if(callback)
						callback(json);
				}
			});
		},
		
		/**
		 * 根据URL构建下拉列表
		 * @param url:
		 * @param data: JSON对象的条件
		 * @param obj：下拉列表对象
		 * @param func：构建option的回调函数
		 * @param extra 附加选项(A：* 所有；P: ‘’ 请选择)
		 */
		getParamByUrl		:	function(url, data, obj, func, extra, callback){
			obj.html("");
			var ret = Connection(url, data, true);
			if(ret == null) return ;
			var list = $.evalJSON(ret).list;

			Sysparam.reconstruct(list, obj, func, extra);
			
			if(callback)callback(list);
		},
		
		/**
		 * 根据QuerySQL构建下拉列表
		 * @param gcode：QuerySQL中的gcode
		 * @param params: 逗号分隔的查询条件
		 * @param obj：下拉列表对象
		 * @param func：构建option的回调函数
		 * @param extra 附加选项(A：* 所有；P: ‘’ 请选择)
		 */
		getParamFromSql		:	function(gcode, params, obj, func, extra, callback){
			if(!gcode || gcode == "")
				return;
			var url = Sysparam.GET_PARAM_FROM_SQL;
			
			$.ajax({
				contentType :"application/json",
		    	processData : false,
		    	type : "post",
		        url: url,
		        data : $.toJSON( {
				gcode : gcode,
				params : params
			}),
				dataType:"json",
				success: function(json){
					Sysparam.reconstruct(json.paramList, obj, func, extra);
					if(callback)callback(json);
				}
			});
		},
		/**
		 * 取得单个参数对象，以主键gcode，mcode为条件，主要给参数翻译用的 如果是普通参数，则只需要gcode，mcode即可
		 * 如果是动态SQL型的参数，则需要输入param参数以替代SQL中的“？”参数
		 */
		getParamByIndex : function(gcode, mcode, index) {
			if (!gcode || gcode == "" || !mcode || mcode == "") {
				return "";
			}
			var url = Sysparam.GET_PARAM_BY_INDEX + "?gcode="
					+ gcode;
			url += "&mcode=" + mcode;
			if (index != null) {
				url += "&index=" + index;
			} else {
				url += "&index=0";
			}
			return Connection(url, null, true);
		},
		
		newMultiOption	:	function(list, obj, opfunc){
			var id = obj.attr("id");
			if(!id)return ;
			$("#tree_multi_"+id).dynatree("getRoot").removeChildren();
			$("#multi_"+id).val("");
			$("#"+id).val("");
			if(!list)return ;
			var nodes = [];
			for ( var i = 0; i < list.length; i++) {
				var op = {};
				if(opfunc) op = opfunc(list[i]);
				else{
					op.key = list[i].mcode;
					op.value = list[i].mname;
				}
				if (!op)
					continue;
				
				var node={key:op.key,title:op.value,mcode:op.key,scode:"0",isLazy:false,isFolder:false};
				
				nodes.push(node);
			}

			$("#tree_multi_"+id).dynatree("getRoot").append(nodes);
		},
		
		getParamByUrlMulti		:	function(url, data, obj, opfunc, callback, value){
			var ret = Connection(url, data, true);
			
			var list = $.evalJSON(ret).list;

			Sysparam.newMultiOption(list, obj, opfunc);
			
			if(value){
				var id = obj.attr("id");
				$("#"+id).trigger("multi_setval",[value]);
			}

			if(callback)callback(list);
		},
		
		getParamFromSqlMulti		:	function(gcode, params, obj, opfunc, callback, value){
			if(!gcode || gcode == "")
				return;
			var url = Sysparam.GET_PARAM_FROM_SQL;
			
			$.ajax({
				contentType :"application/json",
		    	processData : false,
		    	type : "post",
		        url: url,
		        data : $.toJSON( {
				gcode : gcode,
				params : params
			}),
				dataType:"json",
				success: function(json){
					Sysparam.newMultiOption(json.paramList, obj, opfunc);
					if(value){
						var id = obj.attr("id");
						$("#"+id).trigger("multi_setval",[value]);
					}
					if(callback)callback(json);
				}
			});
		},
		
		subSelectMulti	:	function(gcode, scode, obj, callback, value){
			if(!scode || scode == "") {
				obj.html("");
				return;
			}
			var url =  Sysparam.SUB_SELECT + "?gcode=" + gcode;
			url += "&scode=" + scode;
			$.ajax({
				type: "post",
				url: url,
				data: "",
				dataType:"json",
				success: function(json){
					Sysparam.newMultiOption(json.paramList, obj, null);
					if(value){
						var id = obj.attr("id");
						$("#"+id).trigger("multi_setval",[value]);
					}
					if(callback)
						callback(json);
				}
			});
		},
		
		getOptionByDataMulti	:	function(gcode, scode, data, obj, callback, value){
			if(!gcode || gcode == "")
				return;
			var url = Sysparam.GET_OPTION_BY_DATA + "?gcode=" + gcode;
			url += "&scode=" + scode;
			url += "&data=" + data;
			$.ajax({
				type: "post",
				url: url,
				data: "",
				dataType:"json",
				success: function(json){
					Sysparam.newMultiOption(json.paramList, obj,null);
					if(value){
						var id = obj.attr("id");
						$("#"+id).trigger("multi_setval",[value]);
					}
					if(callback)
						callback(json);
				}
			});
		},
		/**
		 * 根据权限获取一些信息：
		 * 定义                                gcode
		 *根据组织结构管理权限获取部门      DEPART_BY_GROUPRIGHT
		 *根据组织结构管理权限获取业务区    AREA_BY_GROUPRIGHT
		 *根据组织结构管理权限获取操作员    OPERATOR_BY_GROUPRIGHT
		 *
		 * @param gcode  系统参数
		 * @param obj：  下拉列表对象
		 * @param extra 附加选项(A：* 所有；P: ‘’ 请选择)
		 * @param func：构建option的回调函数
		 * options={scode:$(this).val()}   scode为父id
		 * 
		 * 例子：
		 * onchange="Sysparam.getRightData('DEPART_BY_GROUPRIGHT',$('#id_patch'),{scode:$(this).val()});"
		 * 
		 */

		getRightData:function(gcode,obj,extra,options,callback){
			/*对scode进行判断*/
			if(typeof options!="undefined" && typeof options['scode']!="undefined"){
				if(options['scode'].trim()==""){
					//如果scode为空
					obj.html("");
					if(extra){
						if(extra.indexOf('P')!=-1)
						    obj.append("<option value=''>--请选择--</option>");
						
					    if(extra.indexOf('A')!=-1)
						    obj.append("<option value='*'>所有</option>");			    
					}
					return;
				}
			}
			
			
			var url = ctxPath+"/prv/component/right!rightByGcode?gcode="+gcode;
			
			if(options && options['scode']=="*"){
				delete options['scode'];
			}
			
			if(options){
				for(var a in options){
					url+="&"+a+"="+options[a];
				}
			}
			
			var ret = Connection(url,{}, true);
			if(ret == null) return ;
			var retbo = $.evalJSON(ret).retbo;

			/*翻译*/
			function parseList(targetType){
				var type = targetType;
				
				return function(bo){
					var obj = {};
					if("AREA"==type){
						obj.key=bo.areaid;
						obj.value=bo.areaname;
					}else if("DEPART"==type){
						obj.key=bo.departid;
						obj.value=bo.departname;
					}else if("PATCH"==type){
						obj.key=bo.patchid;
						obj.value=bo.patchname;
					}else if("OPERATOR"==type){
						obj.key=bo.operatorid;
						obj.value=bo.operatorname;
					}
					
					return obj;
				};				
			}
			
			/*组织*/
			Sysparam.reconstruct(retbo.list, obj, parseList(retbo.type), extra);
			
			if(callback)callback(retbo);
		},
		/*权限select处理，优化   2010-01-28*/
		getRightSelectData:function(gcode,obj,extra,options,callback){
			/*对scode进行判断*/
			if(typeof options!="undefined" && typeof options['scode']!="undefined"){
				if(options['scode'].trim()==""){
					//如果scode为空
					obj.html("");
					if(extra){
						if(extra.indexOf('P')!=-1)
						    obj.append("<option value=''>--请选择--</option>");
						
					    if(extra.indexOf('A')!=-1)
						    obj.append("<option value='*'>所有</option>");			    
					}
					return;
				}
			}
			
			
			var url = ctxPath+"/prv/component/right!queryDataByRight?gcode="+gcode;
			
			if(options && options['scode']=="*"){
				delete options['scode'];
			}
			
			if(options){
				for(var a in options){
					url+="&"+a+"="+options[a];
				}
			}
			
			var ret = Connection(url,{}, true);
			if(ret == null) return ;
			ret = $.evalJSON(ret);
			
			/*组织*/
			Sysparam.reconstruct(ret.list, obj, null, extra);
			
			if(callback)callback(ret.list);
		},
		
		/**
		 * 获取下拉框的option
		 */
		/**
		 * 用于上级下拉框的onchange事件，以生成下级下拉框
		 * @param gcode 下级下拉框gcode
		 * @param scode 上级下拉框的值，一般为this.value
		 * @param obj 下级下拉框对象，传入对象名即可
		 * @param callback 完成下拉对象构造后的回调函数
		 * @param extra 附加选项(A：* 所有；P: ‘’ 请选择)
		 */
		select:function(gcode,obj, callback, extra,value){
			if(typeof value=="undefined"){
				value="";
			}
			var url =  ctxPath + "/prv/sysparam/sysparam!findList?gcode=" + gcode;
			$.ajax({
			type: "post",
			url: url,
			data: "",
			dataType:"json",
			success: function(json){
				Sysparam.reconstruct(json.paramList, obj,null, extra);
				obj.val(value);
				if(callback)
					callback(json);
			}
			});
		},
		/**
		 * 获取下拉框的option,
		 * 除了组装mcode,还把data也写入option里面
		 */
		/**
		 * 用于上级下拉框的onchange事件，以生成下级下拉框
		 * @param gcode 下级下拉框gcode
		 * @param scode 上级下拉框的值，一般为this.value
		 * @param obj 下级下拉框对象，传入对象名即可
		 * @param callback 完成下拉对象构造后的回调函数
		 * @param extra 附加选项(A：* 所有；P: ‘’ 请选择)
		 */
		selectWithData:function(gcode,obj, callback, extra,value){			
			var url =  ctxPath + "/prv/sysparam/sysparam!findList?gcode=" + gcode;
			$.ajax({
			type: "post",
			url: url,
			data: "",
			dataType:"json",
			success: function(json){
				if(typeof value=="undefined"){
					value="";
				}
				
				if(extra){
					if(extra.indexOf('P')!=-1)
					    obj.append("<option value=''>--请选择--</option>");
					
				    if(extra.indexOf('A')!=-1)
					    obj.append("<option value='*'>所有</option>");			    
				}
				
				var list = json.paramList;
				
				if(!list)
					return;

				for(var i=0;i<list.length;i++){
					var op="<option value='"+list[i].mcode+"'";
					if(list[i].data!=null){
						op+=" data='"+list[i].data+"'";
					}
					op+=" >";
					op+=list[i].mname+"</option>";
					obj.append(op);
				}
				
				obj.val(value);
				
				if(callback)
					callback(json);
			}
			});
		},
		/**
		 * @param gcode 下级下拉框gcode
		 * @param scode 上级参数值
		 * @param data : "columnIndex:value~columnIndex:value1,value2~columnIndex:value";
		 * @param obj 对象名
		 * @param callback 完成下拉对象构造后的回调函数
		 * @param extra 附加选项(A：* 所有；P: ‘’ 请选择)
		 */
		getOptionByDataSync	:	function(gcode, scode, data, obj, callback, extra){
			if(!gcode || gcode == "")
				return;
			var url = Sysparam.GET_OPTION_BY_DATA + "?gcode=" + gcode;
			url += "&scode=" + scode;
			url += "&data=" + data;
			
			var ret = Connection(url, null, true);
			
			if(ret == null) 
				return false;
			var json =  $.evalJSON(ret);
			
			Sysparam.reconstruct(json.paramList, obj,null, extra);
			if(callback)
				callback(json);
			
		},
		/**
		 * @param gcode sys_querysql.gcode
		 * @param params 查询条件
		 * @param type 查询条件 　type>1以数组形式返回　默认对象：mcode.mname　即　obj.mcode返回mname
		 */
		querybySql : function(gcode, params,type) {
			if (!gcode || gcode == "")
				return;
			var url = Sysparam.GET_PARAM_FROM_SQL;
			var reobj = {};
			$.ajax({
				contentType : "application/json",
				processData : false,
				async:false,
				type : "post",
				url : url,
				data : $.toJSON({
				gcode : gcode,
				params : params
				}),
				dataType : "json",
				success : function(json) {
					var list = json.paramList;
					if (!list)
						return;
					if(type>1){
						reobj = list;
					}else{
						for ( var i = 0; i < list.length; i++) {
							reobj[list[i].mcode] = list[i].mname;
						}
					}
					
				}
			});
			return reobj;
		}
}