// ==UserScript==
// @name        贴吧消息定位
// @namespace   tieba.baidu.com
// @include     http://tieba.baidu.com/f?ct=*
// @version     1
// @grant       unsafeWindow
// ==/UserScript==

(function(urlHash){

  "user strict";

  if(!urlHash) {return;}
  var hashTarget;
  
  function lazyload() {
    if("undefined" !== typeof unsafeWindow.datalazyload) {
      unsafeWindow.datalazyload.userConfig.diff = 99999;
      window.scrollTo(.1,0);  
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
        hashTarget = document.querySelector("a[name='" +hash+ "']");
        if(hashTarget){
          observer.disconnect();
          var prNode = hashTarget.parentNode;
          prNode.style.fontWeight ="bold";
          prNode.parentNode.style.display = "block";
          location.href=location.href;
        }
      });
    });
    var config = { attributes: true, childList: true, characterData: true };
    observer.observe(target, config);
  }
  
  lazyload();
  
})(window.location.hash);
