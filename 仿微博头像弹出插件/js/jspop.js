/**
 *	@version 1.1
 *  
 **/
;(function($) { 
	var defaults = {
		// 过滤弹窗字段 当该字段为notpopup时不做弹出 如:<a href="/u/@" filter="notpopup"></a>
		filter:'filter',
		// 返回可以作为弹窗关键子的字段
		filterfunction:function(url){
			key = url.replace(/\/u\/@/g,"");
			return key;
		},
		// 500毫秒以内仍然在才触发弹出
		hideDelay:500,
		// 填充数据的url
		ajaxurl:'',
		// 弹窗关键字
		key:'key',
		// 弹窗ID前缀，确保唯一
		idpre:'jspopup_',
		// 弹窗class，确保唯一
		mainclass:'jspopup',
		
		loadingmsg:'正在加载中....',
		//预计高度,用来判断弹出的上下方位
		yjwidth:360,
		//预计宽度,用来判断弹出的左右方位
		yjheight:60,
		//写在弹出框内的方法，xml为ajaxurl返回的数据
		createhtml:function(xml){return "<br><br>"+xml+"<br><br>";}
		
	};
	
	var setTimer = function(callback, timeout, param){ 
		var args = new Array();
		args.push(param);
		var _cb = function() {
			callback.apply(null, args)
		};
		return setTimeout(_cb, timeout);
	};
	
	var clearTimer = function(timer){
		if(timer)
			clearTimeout(timer);	
	};
	
	$.fn.jspop = function(setting) {
		// 初始化配置 
		var opts = $.extend( {}, defaults, setting); 
		//$this--->目标对象的引用
		var $this = $(this);
		var u = $this.attr('data-userid');       //
		var key =  opts.filterfunction(u) ; 
		var filter = $this.attr(opts.filter); 
		   
		var hideDelayTimer = null;		//延迟定时器
		var showDelayTimer = null;		//显示定时器
		var beingShown = false;			//状态标志:要显示出来,但是没有显示出来
		var shown = false;				//状态标志:已经显示出来
		//没有data-userid的属性或者设置了过滤器的都不会调用插件
		if (key =='' || filter == 'notpopup') { 
			return;
		}
		//批处理--->清除所有的定时器
		var bat1 = function(){
			clearTimeout(hideDelayTimer);
			clearTimeout(showDelayTimer);	
		} 
		
		//为目标对象添加事件
		$this.mouseover(function() {
			/*清除所有的定时器*/
			bat1();
			var $that = $(this);			
			var obj = {'obj1' : $that,'key' : key};
			/*目标元素相对于视窗的顶部距离*/
			position = $that.offset().top- $(window).scrollTop();
			/*目标相对于视窗的右边距距离*/
			xposition = $(window).width()- ($that.offset().left - $(window).scrollLeft());
			//显示定时器
			showDelayTimer = setTimer(function() {
				var tt = obj.obj1; //-->目标对象的引用
				var key = obj.key; //-->用户的信息
				showDelayTimer = null;//-->引用归0
				//如果标志状态为不显示的话,不执行
				if (beingShown || shown) {
					return;
				} else{
					beingShown = true;//开始执行,但是插件未显示
					var popup = $('#' + opts.idpre + key);
					
					if (popup.length == 0) {
						$('body').append('<div id="' + opts.idpre + key + '"><div class="popuptc"><div class="point"></div><div class="popuptc_wai_up start">'+opts.loadingmsg+'</div></div></div>');
						var url = opts.ajaxurl;
						var keyvar = opts.key;
						$.post(url,{keyvar:key},function(data){ 
							var html = opts.createhtml(data) ;
							var toptemp = parseInt($('#' +opts.idpre  + key).css('top').replace('px',''));  
							var toptemp2 =  $('#' +opts.idpre  + key).height();
							$(".popuptc_wai_up",$('#' +opts.idpre + key).get(0)).html(html).attr('class','popuptc_wai_up');
							if (position > opts.yjheight&& xposition < opts.yjwidth) { 
								$('#' +opts.idpre  + key).css({top : toptemp- $('#' +opts.idpre  + key).height()+ toptemp2});
								$('.point',$('#' +opts.idpre  + key).get(0)).css('top',info.height() - 11)
							} else if (position <= opts.yjheight&& xposition < opts.yjwidth) { 
							} else if (position > opts.yjheight&& xposition > opts.yjwidth) { 
								$('#' +opts.idpre  + key).css({top : toptemp- $('#' +opts.idpre  + key).height()+ toptemp2});
								$('.point',$('#' +opts.idpre  + key).get(0)).css('top',info.height() - 11);
							} 
						}); 
					}
					
					var info = $('#' + opts.idpre + key);
					info.unbind('mouseover').mouseover(
							function() {
								tt.mouseover()
					}).unbind('mouseout')
							.mouseout(function() {
								tt.mouseout()
					});
							
					if (position > opts.yjheight&& xposition < opts.yjwidth) {
						info.attr('class',opts.mainclass+' rs');
						var top = tt.offset().top;
						var img = $('img', tt.get(0));
						if (img.length > 0) {
							top = img.offset().top
						} 
						info.css( {
							top : top - info.height(),
							left : tt.offset().left - info.width() + tt.width(),
							display : 'block',
							opacity : 1
						});
						$('.point', info.get(0)).css(
								'top',
								info.height() - 11)
					} else if (position <= opts.yjheight && xposition < opts.yjwidth) {
						info.attr('class',
								opts.mainclass+' rx');
						var top = tt.offset().top + 14;
						var img = $('img', tt.get(0));
						if (img.length > 0) { top = img.offset().top + img.height()} 
						info.css( {
							top : top,
							left : tt.offset().left - info.width() + tt.width(),
							display : 'block',
							opacity : 1
						});
						$('.point', info.get(0)).css( 'top', 2)
					} else if (position >  opts.yjheight && xposition >  opts.yjwidth) {
						info.attr('class', opts.mainclass+' ls');
						var top = tt.offset().top;
						var img = $('img', tt.get(0));
						if (img.length > 0) {
							top = img.offset().top
						}
						;
						info.css( {
							top : top - info.height(),
							left : tt.offset().left,
							display : 'block',
							opacity : 1
						});
						$('.point', info.get(0)).css(
								'top',
								info.height() - 11)
					} else {
						info.attr('class',
								opts.mainclass+' lx');
						var top = tt.offset().top + 14;
						var img = $('img', tt.get(0));
						if (img.length > 0) {
							top = img.offset().top
									+ img.height()
						}
						info.css( {
							top : top,
							left : tt.offset().left,
							display : 'block',
							opacity : 1
						});
						$('.point', info.get(0)).css('top', 2);
					}
			}
					beingShown = false;
					shown = true; 
				}, opts.hideDelay, obj);
				return false;
		}).mouseout(function() {
				/*清除所有的定时器*/
				bat1();
				hideDelayTimer = setTimer(function() {
						hideDelayTimer = null;
						shown = false;
						$("."+opts.mainclass).css('display', 'none');
				}, opts.hideDelay); 
				return false; 
		}); 
		
	}		
})(jQuery);
