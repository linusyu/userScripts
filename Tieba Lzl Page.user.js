// ==UserScript==
// @name        贴吧楼中楼翻页
// @namespace   http://tieba.baidu.com
// @include     http://tieba.baidu.com/*
// @version     1
// @grant       none
// ==/UserScript==

;(function($,_,PageData){

	_.Module.define({
		path: 'pb/widget/ForumListV3/LzlHack',
		requires: [
			'pb/widget/Admin',
			'common/widget/Icons'
		],
		sub: {
			editor_entry: null,
			_reach_limit: !1,
			_new_reply_num: 0,
			initial: function (t) {
				try {
					this.postJdom = t,
					this.wapperDOM = $('#j_p_postlist'),
					this.icons = this.use('common/widget/Icons'),
					this._admin = this.use('pb/widget/Admin');
					var e = $('#voice_data_container');
					this.voiceData = {
						show: e.data('show'),
						showDesc: e.data('showdesc'),
						descContent: e.data('desccontent')
					},
					this._init()
				} catch (i) {
					throw 'undefined' != typeof alog && alog('exception.fire', 'catch', {
						msg: i.message || i.description,
						path: 'pb:widget/sub_list/sub_list_main.js',
						method: '',
						ln: 36
					}),
					$.se({
						msg: (i.message || i.description) .replace(/\s+/g, '-'),
						locator: 'pb:widget/sub_list/sub_list_main.js',
						linenum: 36
					}),
					i
				}
			},
			_init: function () {
				this._showJubao(),
				this._bindClick()
			},
			_showLzlJubao: function (t) {
				if (!PageData.power.can_mask_delete && !PageData.power.lz_del) {
					var e,
					e = (PageData.power.can_vip_jubao ? 'vip举报' : '举报', t.find('li.j_lzl_s_p'));
					e.each(function () {
						var t = $(this) .find('a') .filter(function () {
							return $(this) .tbattr('username')
						}) .tbattr('username'),
						e = '';
						if (PageData.user.user_name == t) var i = '删除',
						e = '{\'delete_mine\': 1, \'user_name\' : \'' + t + '\'}',
						l = '<a href="#" class="lzl_jb_in" data-field="' + e + '">' + i + '</a>&nbsp;|&nbsp;';
						 else {
							var a = $(this) .data('field');
							if (a) var i = PageData.power.can_vip_jubao ? 'vip举报' : '举报',
							o = '',
							l = '<a href="#" class="lzl_jb_in" onclick="' + o.replace('{type}', 0) + '">' + i + '</a>&nbsp;|&nbsp;';
							 else l = ''
						}
						$(this) .find('.lzl_jb') .html(l)
					})
				}
			},
			_showJubao: function () {
				this.wapperDOM.delegate('.j_lzl_s_p', 'mouseover', function () {
					$(this) .find('.lzl_jb') .show()
				}) .delegate('.j_lzl_s_p', 'mouseout', function () {
					$(this) .find('.lzl_jb') .hide()
				})
			},
			_bindClick: function () {
				var t = this;
				this.wapperDOM.undelegate('.j_pager', 'click').delegate('.j_pager', 'click', function (e) {
					try {
						if ('A' == e.target.tagName) {
							window.global && 'function' == typeof window.global.shieldPost && window.global.shieldPost();
							var i = $(e.target),
							l = $.tb.unescapeHTML(i.tbattr('index'));
							if (!l) {
								var a = $.tb.unescapeHTML(i.tbattr('href')) .split('#');
								l = parseInt(a[1])
							}
							return t.mainDom = i.parents('.j_lzl_container'),
							t.mainData = t.mainDom.getData(),
							t.postJdom = i.parents('.l_post'),
							t._turnPage(t, l, i.parents('.core_reply_content')),
							!1
						}
					} catch (o) {
						throw 'undefined' != typeof alog && alog('exception.fire', 'catch', {
							msg: o.message || o.description,
							path: 'pb:widget/sub_list/sub_list_main.js',
							method: '',
							ln: 270
						}),
						$.se({
							msg: (o.message || o.description) .replace(/\s+/g, '-'),
							locator: 'pb:widget/sub_list/sub_list_main.js',
							linenum: 270
						}),
						o
					}
				})
			},
			_turnPage: function (t, e, i) {
				var l = new Date;
				l = l.getTime(),
				$.ajax({
					url: '/p/comment',
					data: {
						tid: PageData.thread.thread_id,
						pid: t.mainData.pid,
						pn: e,
						t: l
					},
					dataType: 'html',
					success: function (e) {
						t._ajaxSucc(e, i),
						$.tb.location.setHash('noExistHash'),
						$.tb.location.setHash(t.mainData.pid + 'l')
					},
					error: function (e) {
						t._ajaxErr(e)
					}
				})
			},
			_ajaxSucc: function (t, e) {
				var i = this;
				if (t && t.length > 200) {
					var l = $(t);
					l.find('.voice_player .time') .each(function () {
						$(window) .trigger('initvoicelength', this)
					}),
					1 != this.voiceData.show ? l.find('.voice_player') .html('[语音]')  : 1 != this.voiceData.showDesc ? l.find('.voice_player_desc') .remove()  : l.find('.voice_player_desc') .html(this.voiceData.descContent),
					this.mainDom.find('ul.j_lzl_m_w') .html(l),
					i._showLzlJubao(e),
					this._admin.loadLzlAdmin(e),
					l.find('.lzl_cnt') .each(function () {
						var t = $(this),
						e = t.getData() .iconArr,
						l = t.getData() .free_flag,
						a = e ? i.icons.getPreIconHtml(e, l)  : '';
						t.prepend(a)
					}),
					$.browser.msie && $.browser.version <= 7 && this.postJdom.tbattr('class', $.tb.unescapeHTML(this.postJdom.tbattr('class')))
				} else {
					var a = '<div style="margin: 0px 30px 0px 30px;font-size:14px;line-height:20px;text-align:left;font-family: &quot;宋体&quot;;"><table style="width:90%"><tbody><tr><td width="60"><img style="border:none;" src="http://tb2.bdstatic.com/tb/img/errorFace.gif"></td><td valign="middle" style="font-size:20px;line-height:22px;font-family: &quot;黑体&quot;;">服务器很忙</td></tr></tbody></table>请刷新页面，稍后再试</div>',
					o = $.dialog.alert(a, {
						width: 410,
						height: 95,
						title: '错误提示'
					});
					o.bind('onclose', function () {
						return !0
					})
				}
			},
			_ajaxErr: function () {
				var t = '<div style="margin: 0px 30px 0px 30px;font-size:14px;line-height:20px;text-align:left;font-family: &quot;宋体&quot;;"><table style="width:90%"><tbody><tr><td width="60"><img style="border:none;" src="http://tb2.bdstatic.com/tb/img/errorFace.gif"></td><td valign="middle" style="font-size:20px;line-height:22px;font-family: &quot;黑体&quot;;">服务器很忙</td></tr></tbody></table>请刷新页面，稍后再试</div>',
				e = $.dialog.alert(t, {
					width: 410,
					height: 95,
					title: '错误提示'
				});
				e.bind('onclose', function () {
					return !0
				})
			}
		}
	});
	
	_.Module.use('pb/widget/ForumListV3/LzlHack');
	
})(unsafeWindow.jQuery,unsafeWindow._,unsafeWindow.PageData);
