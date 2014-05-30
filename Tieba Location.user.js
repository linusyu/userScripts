// ==UserScript==
// @name        贴吧消息定位
// @namespace   tieba.baidu.com
// @include     http://tieba.baidu.com/f?ct=*
// @version     1
// @grant       unsafeWindow
// ==/UserScript==

(function(urlHash){

	if(!urlHash) {return;}
	
	var $ = unsafeWindow.jQuery;
	var hash = "";
	var target = null;
	
	function lazyload() {
		if(typeof unsafeWindow.datalazyload == "undefined") {
			setTimeout(lazyload,200);
		}
		else{
			unsafeWindow.datalazyload.userConfig.diff = 9999;
			$(document).scrollTop(1);	
			hash = urlHash.substring(urlHash.indexOf('#')+1);
			scrollTo();
		}
	}
	
	function scrollTo() {
		target = $("a[name='" +hash+ "']");
		if(!target.length){
			setTimeout(scrollTo,200);
		}
		else{
			target.parent().css("font-weight","bold").parent(".lzl_post_hidden").show();
			location.href=location.href;
		}
	}
	
	lazyload();
	
})(window.location.hash);
