;(function($) {
	$.fn.extend({
	
	});
	
})(jQuery);



(function($){
	$.top = top.window['jQuery'];
	
	/**
	 * 收集页面各个字段数据，返回json object
	 * @return json object
	 */
	$.collectData = function(range){
		var serialize = [];
		var json = {};
		if(range){
			serialize.push(range.find("input[type=hidden]"));
			serialize.push(range.find("input[type=text]"));
			serialize.push(range.find("input[type=password]"));
			serialize.push(range.find("input[type=radio]:checked"));
			serialize.push(range.find("input[type=checkbox]:checked"));
			serialize.push(range.find("select"));
			serialize.push(range.find("textarea"));
		}else{
			serialize.push($("input[type=hidden]"));
			serialize.push($("input[type=text]"));
			serialize.push($("input[type=password]"));
			serialize.push($("input[type=radio]:checked"));
			serialize.push($("input[type=checkbox]:checked"));
			serialize.push($("select"));
			serialize.push($("textarea"));
		}
		//将表单数据转成object
		for(var i = 0;i<serialize.length;i++){
			serialize[i].each(function(){
				var t = $(this).attr("dataType");
				var cal = $(this).attr("calendar");
				var time = $(this).attr("timepicker");
				var v = $(this).val();
				//去掉空格
				if(v && !(v instanceof Array)){
					v = v.trim();					
				}					
					
				// ie重置bug，下拉菜单被重置后，val()取值返回的是数组
				if(v && typeof v=="object"){
					v+="";
					v = v.trim();
				}
				
				var c = $(this).attr("name");
				if(c && c == "pks"){
					if(!json.pks) json.pks=[];
					json.pks.push($(this).val());
					return;
				}
				if(t && t.toLowerCase() == "number"){
					if(!v)
						return;
					else
						v = Number(v);
				}
				if(t && t.toLowerCase() == "integer"){
					if(!v)
						return;
					else
						v = Number(v);
				}
				if(t && t.toLowerCase() == "boolean"){
					if(!v)
						return;
					else
						v = Boolean(v);
				}
				if(cal){
					if(!v)
						return;
					if(v && cal=="0")
						v+=" 00:00:00";
					v = v.trim().replace(/\s+/g,"T");
				}
				if(time){
					if(!v)
						return;
				}
				
				setProperty($(this).attr("name"), v, json);
			});
		}
		return json;
	}
})(jQuery);