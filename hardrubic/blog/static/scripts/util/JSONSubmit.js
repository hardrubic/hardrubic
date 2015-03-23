/**
 * 整合jquery ajax的页面提交方式，能自动把页面所有字段打包发送到后台
 * 支持对象提交，如{'equipment':{'keyno':'',userno:'',equipno:''}}
 * 如果传入参数带range(jquery object)，则在range的范围内打包字段
*/
var JSONSubmit= function(url , callback, dataType, data, dataOnly, range){
	var json = {};
	var param ={};
	param.contentType = "application/json";
	param.processData = false;
	param.type = "post";
	//返回的数据格式
	param.dataType = dataType?dataType:"html";
	param.url = url;
	param.range = range;
	
	//如果是form数据加data混杂的数据提交方式
	if(dataOnly!=true){
		json = $.collectData(param.range);
	}
	//将param.data字段的参数整合提交
	if(data){
		if(typeof data =="string")
			param.data = $.evalJSON(data);
		else
			param.data = trimJSON(data);
	}
	for(var i in param.data){
		json[i] = param.data[i];
	}
	
	//提交整合后的data
	param.data = $.toJSON(json);
	
	var timer= setInterval(
		function(){
			clearInterval(timer);
	},500);
	
	param.error= function(xhr, str, err){
		clearInterval(timer);
		var html = xhr.responseText.replace(/(^.*<body>|<\/body>.*$)/gmi,"");
		var sim_html = html.replace(/^.*<pre>/gmi,"");
			sim_html = sim_html.replace(/^.*?\:/gmi,"");
			sim_html = "<div id=\"exception_memo\"><pre>    </pre>"+sim_html.replace(/\r|\n.*$/gmi,"") +
					"<br/><br/><p align=\"right\">" +
					"<button onclick=\"top.maywide.show().setWidth(800);$('#exception_detail').slideDown('slow',function(){$('#exception_memo').fadeOut('slow');});\" style=\"padding:0 10px;height:28px\" onmouseout=\"$(this).removeClass('ui-state-hover')\" onmouseover=\"$(this).addClass('ui-state-hover')\" class=\"ui-state-default ui-corner-all\">" +
						//"<span class=\"ui-icon ui-icon-search\"></span>" +
						"<span class=\"ui-inputHead_t\">查看详细</span>" +
					"</button>" +
					"</p></div>" +
					"<div id=\"exception_detail\" style=\"display:none\">" +
						html +
					"</div>";
		//top.maywide.show().info("操作提示", sim_html);
	}
	param.success= function(data){
		//top.maywide.show().closeEvt();
		clearInterval(timer);
		if(callback)
			callback(data);
	}
	$.ajax(param);
	
};
var trimJSON = function(JSONdata){
	for( var i=0;i<JSONdata.length;i++)
	   {
	      if(JSONdata[i] instanceof Array)
	      {
	    	  trimJSON(JSONdata[i]);
	      }else{   
	         for(var k in JSONdata[i])
	         {
	          JSONdata[i][k]=JSONdata[i][k].trim();
	         }
	      }
	   }
	 return JSONdata;
};


