$(function(){
	//showXssMsg();	
	hijackCookie();
})

function showXssMsg(){
	alert("xss");	
}

function hijackCookie(){
	var cookie = $.cookie();
	console.info(cookie);
}