// ==UserScript==
// @name        贴吧楼中楼查看对话
// @namespace   http://tieba.baidu.com/
// @include     http://tieba.baidu.com/p/*
// @include     http://tieba.baidu.com/f?ct*
// @version     0.1
// @grant       none
// ==/UserScript==

(function($,PageData) {

	var cssText ='#dialogJbody .lzl_single_post{\
			border-bottom: 1px dotted #d7d7d7;\
			margin-top: 6px;\
			padding-top: 10px;\
			min-width: 570px;}\
		#dialogJbody .dialogue,#dialogJbody .lzl_s_r,\
		#dialogJbody .lzl_li_pager,#dialogJbody .j_pager,\
		#dialogJbody .user-hide-post-down{\
			display: none !important;}\
		#dialogJbody{\
			-moz-box-orient: vertical;\
			display: -moz-box;}\
		.dialogue{\
			color: #666666;\
			cursor: pointer;\
			padding-right: 5px;}\
		.tb_alert_wrapper{\
			-moz-box-ordinal-group: 1000;}';
	$("head").append("<style>"+cssText+"</style>");
	
	function getUserName(s) {
		try{
			return String.trim(s.match(/ .*? /));
		}
		catch(err){}
	}

	function getTalk(a,b) {
		var str = "";
		b.find(".lzl_single_post")
		.each(function() {
			var u = $(this).find(".j_user_card").attr("username");
			if(a.indexOf(u) != -1){
				var s = $(this).find(".lzl_content_main").text();
				var name = getUserName(s);
				if(a.indexOf(name) != -1){
					str += "<li class='lzl_single_post'>"+$(this).html()+"</li>";
				}
			}
		});
		if(str){
			$.tb.alert({
				title: '查看对话',
				message: "",
				buttons:[{text: '确定'}]
			});
			var h = $(window).height();
			$(".dialogJ").css({"width":"600px","top": h <= 555 ? 0 : (h-555)/2})
			.find(".tb_alert_wrapper")
			.before("<div>"+str+"</div>")
			.parents(".dialogJcontent")
			.css({"max-height":"500px","overflow":"auto"});
		}
	}

	function popTalk(a,b) {
		$.tb.alert({
			title: '查看对话',
			message: "",
			buttons:[{text: '确定'}]
		});
		
		var pages = [];
		a.find(".j_pager a").each(function() {
			var page = $(this).text();
			if(/^[0-9]*$/.test(page)){
				pages.push(page);
			}
		})
		
		var max = Math.max.apply(null, pages)
		for (i = 1; i <= max; i++) {
			pageTurning(i,b);
		}
		
		function pageTurning(p,b) {
			var l = new Date;
			l = l.getTime(),
			$.ajax({
				url: '/p/comment',
				data: {
					tid: PageData.thread.thread_id,
					pid: a.getData().pid,
					pn: p,
					t: l
				},
				dataType: 'html',
				success: function (e) {
					dialog(e,p,b);
				},
				error: function (e) {
					console.log(e);
				}
			})
		}
	}

	function dialog(msg,p,a) {
		var h = $(window).height();
		$(".dialogJ").css({"width":"600px","top": h <= 555 ? 0: (h-555)/2})
		.find(".tb_alert_wrapper")
		.before("<div style='-moz-box-ordinal-group:"+p+"'>"+msg+"</div>")
		.parents(".dialogJcontent")
		.css({"max-height":"500px","overflow":"auto"})
		.find(".lzl_single_post").each(function(){
			var uc = $(this).find(".j_user_card");
			var u = uc.attr("username");
			if(-1 === a.indexOf(u)) {
				uc.parent(".lzl_single_post").remove();
			}
			else{
				var sv = $(this).find(".lzl_content_main");
				var s = String.trim(sv.text());
				var name = getUserName(s);
				if(-1 === a.indexOf(name)){
					uc.parent(".lzl_single_post").remove();
				}        
			}
		});    
	}
	
	$("#j_p_postlist").on("mouseover",".core_reply_content",function(e) {
		$(e.target).find(".lzl_single_post")
		.each(function() {
			if(!$(this).find(".dialogue").length){
				var s = String.trim($(this).find(".lzl_content_main").text());
				var name = getUserName(s);
				if(name){
					var u = $(this).find(".j_user_card").attr("username");
					$(this).find(".lzl_content_reply")
					.prepend("<a class='dialogue' data-s='[\""+u+"\",\""+name+"\"]'>查看对话</a>");
				}	
			}
		});
	})
	.on("click",".dialogue",function(e) {
		var t = $(e.target);
		var p = t.parents(".j_lzl_container");
		if (p.find(".j_pager a").length){
			return popTalk(p,t.data("s"));
		}
		getTalk(t.data("s"),t.parents(".core_reply_content"));
	});
	
})(unsafeWindow.jQuery,unsafeWindow.PageData);
