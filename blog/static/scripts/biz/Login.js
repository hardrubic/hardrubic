Login = ({
	test:function(){
		var json={
			inmsg:"hello"
		};
		var url="/blog/login/test/";

		JSONSubmit(url,function(ret){
			alert(ret.outmsg);
		},'json',json,true);
	}

	/** 登陆框实例
	loginDiv:null,
	 */
	
	/** 检查登陆，未登录则弹出登陆框
	checkLogin:function(){
		var username = $.cookie('username');
		var url = window.location.pathname;
		
		//如果已经登陆，显示登陆信息
		if(null != username && '' != username){

		}else{
			//没有登陆，又想进入管理，弹出登陆框
			if(url.indexOf('/blog/manager')>0){
				if(null == username || '' == username){
					Login.showLoginInPanel();
				}
			}
		}
	},
	 */
	
	/** 显示登陆框
	showLoginInPanel:function(){
		loginDiv = $("#login_div").dialog({
			autoOpen: false,
			height: 200,
			width: 300,
			modal: true,
			buttons: {
				'login': function () {
					Login.loginIn();
				},
				Cancel: function () {
					loginDiv.dialog("close");
				}
			},
			close: function () {
				form[0].reset();
				$('#username,#password').removeClass("ui-state-error");
			}
		});
		
		var form = loginDiv.find("form").on("submit",function(event) {
			event.preventDefault();
			Login.loginIn();
		});
		
		loginDiv.dialog("open");
	},
	 */
	
	/** 弹出框提交登陆
	loginIn:function(){
		var username = $('#username').val();
		var password = $('#password').val();

		var json = {
			username:username,
			password:password
		}
		var url="/blog/login/login_in/";
		JSONSubmit(url,function(ret){
			if(ret != null && ret.username != null){
				if(null != loginDiv) {
					loginDiv.dialog("close");
				}
			}else if(ret != null && ret.returnmsg != null){
				$('#password').val('');
				alert(ret.returnmsg);
			}
		},'json',json,true);
	},


	loginOut:function(){
		var url="/blog/login/login_out/";
		JSONSubmit(url,null,'html',null,true);
	}
	  */
});