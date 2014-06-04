// ==UserScript==
// @name        贴吧消息定位
// @namespace   tieba.baidu.com
// @include     http://tieba.baidu.com/f?ct=*
// @version     2
// @grant       unsafeWindow
// ==/UserScript==

(function(urlHash){

	"user strict";

	if(!urlHash) { return; }
	var hashTarget;
	var lzl;

	function lazyload() {
		if("undefined" !== typeof unsafeWindow.datalazyload) {
			unsafeWindow.datalazyload.userConfig.diff = 99999;
			window.scrollTo(0,.1);  
			var hash = urlHash.substring(urlHash.indexOf('#')+1);
			return scrollTo(hash);
		}
		setTimeout(lazyload,200);
	}

	function scrollTo(hash){    
		var target = document.body;
		var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
		var observer = new MutationObserver(function(mutations) {
			mutations.forEach(function() {
				/*普通楼*/
				hashTarget = document.querySelector("a[name='" +hash+ "']");
				if(hashTarget){
					observer.disconnect();
					var prNode = hashTarget.parentNode;
					prNode.style.fontWeight = "bold";
					gfNode =  prNode.parentNode;
					gfNode.style.display = "block";
					return location.href=location.href;
				}
				/*楼中楼*/
				lzl = document.querySelectorAll(".lzl_single_post");
				[].forEach.call(lzl,function(i){
					if(JSON.parse(i.getAttribute("data-field").replace(/\'/g,"\"")).spid == hash){
						observer.disconnect();
						i.style.fontWeight = "bold";
						i.parentNode.style.display = "block";
						return window.scrollTo(0,i.offsetTop - 100);
					}
				});
			});
		});
		var config = { attributes: true, childList: true, characterData: true };
		observer.observe(target, config);
	}

	lazyload();
  
})(window.location.hash);
