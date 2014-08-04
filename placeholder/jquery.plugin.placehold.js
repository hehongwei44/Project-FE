//纯面向对象,套用模版
//IE6-9不支持placeholder
;(function($) {

	$.placehold = function(el, options) {
		
		var defaults = {
			//占位符提示文本
			placeholder_text : "请输入文字",
			gap_left 	  : 5,
			gap_top   	  : 4,
			font_size     : 12
		}
		//当前对象的引用,即插件的引用
		var plugin = this;
		//插件的配置
		plugin.settings = {}
		//初始化方法
		var init = function() {
			//插件实际的参数
			plugin.settings = $.extend({}, defaults, options);
			//el:目标对象的引用,jquery对象
			$target = el;

			//判断元素是否是input或者textarea元素
			if($target.is("input") || $target.is("textarea")) {
				//判断元素是否支持placheholder属性
				//console.log($target.get(0).tagName);判断元素的标签
				if(plugin.isSupportAttr("placeholder", $target.get(0).tagName)) {
					//判断元素是否存在placeholder属性,不存在则设置该属性
					if(!plugin.isHasAtrr("placeholder", $target)) {
						$target.attr("placeholder", plugin.settings.placeholder_text);
					} else {
						return;
					}
				} else {
					//目标元素的ID,label中的for指向目标对象ID.
					//TODO  没有ID怎么做-->必须指定ID.
					var t_id = $target.attr("id");
					var t_left = $target.offset().left;
					var t_top  = $target.offset().top;
					//只能添加到该位置
					$("body").append("<label data_id="+t_id+" id=input_tip_"+t_id+" class='input_tip' for="+$target.attr("id")+">"+plugin.settings.placeholder_text+"</label>");
					var $label = $("#input_tip_"+t_id);
					//定位
					$label.css({
						"position"  : "absolute",
						"left"      : t_left + plugin.settings.gap_left,
						"top"       : t_top + plugin.settings.gap_top,
						"font-size" : plugin.settings.font_size
					});
					//目标对象的事件的链式处理
					$target.bind("focus",function(){
						if($label.is(":visible")){
							$label.addClass('input_tip_focus');
						}
					}).bind("blur",function(){
						if($(this).val() == "" && $label.is(":hidden")){
							$label.show();
						}
						$label.removeClass('input_tip_focus');
					}).bind("keydown",function(){
						$label.hide();
					}).bind("keyup",function(){
						if($(this).val() == "" && $label.is(":hidden")){
							$label.show();
						}	
					}).bind("contextmenu",function(){
						if($label.is(":visible")){
							$label.addClass('input_tip_focus');
						}
						return false;
					});
					
					$label.bind("contextmenu",function(){
						 var id = $(this).attr("data_id");
						 $("#"+id).trigger("focus");	
						 return false;
					});
					
				}

			} else {
				return;
			}

			return plugin;

		}
		/*  @function 判断某个属性是否存在指定的元素中
		 *  @access 公共方法
		 *  @param attr  属性的名称
		 *  @param elem  指定的元素
		 *  @return boolean  true表示支持
		 * */
		plugin.isSupportAttr = function(attr, elem) {
			var _elem = document.createElement(elem), bool = ( attr in _elem) ? true : false;
			//释放内存
			_elem = null;
			return bool;

		}
		/*  @function 判断指定的元素是否设置了某个属性
		 *  @access 公共方法
		 *  @param attr  属性的名称
		 *  @param elem  指定的JQuery元素
		 *  @return boolean  true表示设置了该元素
		 * */
		plugin.isHasAtrr = function(attr, $elem) {
			return typeof ($elem.attr(attr)) == "undefined" ? false : true;
		}
		
		init();

	}
})(jQuery); 