/*
 * 优雅的解决IE6不支持fixed定位的bug
 * 测试浏览器只限于IE6
 * 定位不能作用元素节点集合,只能针对某一个元素进行positioned定位
 * */
;(function($) {

	jQuery.fn.PositionFixed = function(options) {
        var isIE6 = !-[1,] && !window.XMLHttpRequest; /*判断浏览器是否使ie6*/
        if(!isIE6){
            return;
        }
        var _this = this.get(0),    //只针对一个元素进行定位,多个元素定位不符合逻辑
            max_left = document.documentElement.scrollLeft+document.documentElement.clientWidth-_this.offsetWidth,
            max_top  = document.documentElement.scrollTop+document.documentElement.clientHeight-_this.offsetHeight;
		/*
		 * 插件的默认参数
		 * @parameter left:左边距的距离
		 * @parameter top:顶部的距离
		 */
		var defaults = {
			left : 0,
			top : 0
        },
		settings = $.extend({}, defaults, options || {});
        //解析left
        if(settings.left < 0){
            settings.left += max_left;
        }else if(settings.left == "max"){
            settings.left = max_left;
        }
        //解析top
        if(settings.top < 0){
            settings.top += max_top;
        }else if(settings.top == "max"){
            settings.top = max_top;
        }

        /*
        * 解决IE6 不支持fixed定位的方法
        * */
		var position = function(){
      		var
          		html = document.getElementsByTagName('html')[0],	/*获得html标签*/
          		dd = document.documentElement,		/*获取document元素*/
          		db = document.body,		/*获取document元素*/
          		dom = dd || db,
          		//获取滚动条位置
          		getScroll = function(win){
              		return {
                	 	 left: Math.max(dd.scrollLeft, db.scrollLeft),
                 		 top: Math.max(dd.scrollTop, db.scrollTop)
                		  };
          		};
      
		      
		      // 只需要 html 与 body 标签其一使用背景静止定位即可让IE6下滚动条拖动元素也不会抖动
		      // 注意：IE6如果 body 已经设置了背景图像静止定位后还给 html 标签设置会让 body 设置的背景静止(fixed)失效 
		      if (isIE6 && document.body.currentStyle.backgroundAttachment !== 'fixed') {
		          html.style.backgroundImage = 'url(about:blank)';
		          html.style.backgroundAttachment = 'fixed';
		      }
      
		      return {
		          fixed: isIE6 ? function(elem){
		              var style = elem.style,
		                  doc = getScroll(),
		                  dom = '(document.documentElement || document.body)',
		                  left = parseInt(settings.left) - doc.left,		/*获取元素相对窗口的left距离*/
		                  top = parseInt(settings.top) - doc.top;		/*同上*/
		              this.absolute(elem);
		              style.setExpression('left', 'eval(' + dom + '.scrollLeft + ' + left + ') + "px"');
		              style.setExpression('top', 'eval(' + dom + '.scrollTop + ' + top + ') + "px"');
		          } : function(elem){
		              	elem.style.position = 'fixed';
		          },
		          
		          absolute: isIE6 ? function(elem){
		              var style = elem.style;
		              style.position = 'absolute';
		              style.removeExpression('left');
		              style.removeExpression('top');
		          } : function(elem){
		          		elem.style.position = 'absolute';
		          }
		      };
  		}();
		
		return this.each(function() {
      		position.fixed(this);
		});

	};

})(jQuery);