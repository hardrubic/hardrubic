$(function(){
	showMainContent('/blog/manager/manager_article_list/');
});	

function initCKEditor(){
	CKEDITOR.replace('editor_shorotContent');
	CKEDITOR.replace('editor_content');
}

//保存文章
function saveArticle(){
	var json={};
	//如果是新建文章，检查输入
	if($('#article_info').length>0){
		var caption = $('#caption').val();
		var catename = $('#catename').val();
		
		if(caption==null || caption==""){
			alert("请输入标题");
			return false;
		}
		if(catename==null || catename==""){
			alert("请输入文章分类");
			return false;
		}
		json.caption=caption;
		json.catename=catename;
	}else{
		//更新文章
		json.articleid=$('#articleid').val();
	}
	
	//获取文章状态
	var status=$('#article_status').val();
	if(null!=status && ""!=status){
		json.status=status;
	}else{
		json.status='0';
	}
	json.shortContent=CKEDITOR.instances.editor_shorotContent.getData();
	json.content=CKEDITOR.instances.editor_content.getData();
	
	var url="/blog/manager/manager_article_save";
	JSONSubmit(url,function(ret){
		if(!isNaN(ret.msg)){
			alert("保存文章成功");
			window.location.href='/blog/manager/manager_article_edit?articleid='+ret.msg;
		}else{
			alert(ret.msg);
		}
	},'json',json,true);
}

//删除文章
function deleteArticle(id){
	if(!confirm("是否确认删除文章？")){
		return false;
	}
	showMainContent('/blog/manager/manager_article_del/?articleid='+id);
}
