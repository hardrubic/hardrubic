//公用方法
$(function(){
	//处理select的值
	$('.select_class').each(function(){
		var value=$(this).attr('value');
		$(this).val(value);
	});
	
	//日志归档登记滑动
	doArticleCaleList();
});	

//填充content
function showMainContent(url,callback){
	JSONSubmit(url,function(html){
		$('#main_content').html(html);
		if(null != callback){
			callback();
		}
	},'html',null,true);	
}

function doArticleCaleList(){
	$(".flip_class").click(function(){
		var n = $(this).attr('index');
		$(".flip_div_"+n).slideToggle("slow");
	});
}
