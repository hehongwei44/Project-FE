;(function($) {
    $.JFZ_Dialog = function() {
        // 默认参数，各参数的明细请看文档
        var defaults = {
            animation_speed_hide:       250,          
            animation_speed_show:       0,              
            auto_close:                 false,          
            buttons:                    true,          
            custom_class:                false,        
            keyboard:                   true,           
            max_height:                 0,              
            message:                    '',             
            modal:                      true,           
            overlay_close:              false,          
            overlay_opacity:            .3,            
            position:                   'center',       
            reposition_speed:           100,            
            source:                     false,          
            title:                      '',             
            type:                       'information', 
            vcenter_short_message:      true,           
            width:                      0,              
            onClose:                null,
            stopScroll:				true                
        }
		//当前对象的引用
        var plugin = this;
        //插件最终引用的参数
        plugin.settings = {};
        //参数缓存
        options = {};
        //如果传递给插件的第一个参数是字符串,类似-->$.JFZ_Dialog("abc",{}); 
        if (typeof arguments[0] == 'string') options.message = arguments[0];
        // 传递的参数 -->$.JFZ_Dialog("abc",{})或$.JFZ_Dialog({});
        if (typeof arguments[0] == 'object' || typeof arguments[1] == 'object')
            // 参数复制
            options = $.extend(options, (typeof arguments[0] == 'object' ? arguments[0] : arguments[1]));

        /**
         *  插件的初始化
         *
         *  @return 返回插件对象的引用
         */
        plugin.init = function() {
            // 合并参数,得到最终的参数
            plugin.settings = $.extend({}, defaults, options);

            //判断是否使IE6 
            plugin.isIE6 = (browser.name == 'explorer' && browser.version == 6) || false;
			//是否阻止滚动条滚动
			if(plugin.settings.stopScroll){
				_stopScroll();	
			}
            // modal控制遮罩层的有无,true表示有,false表示无
            if (plugin.settings.modal) {
                // create the overlay
                plugin.overlay = jQuery('<div>', {
                    'class':    'JFZDialogOverlay'				//遮罩层的样式名称
                }).css({
                    'position': (plugin.isIE6 ? 'absolute' : 'fixed'),  //  遮罩层定位,非IE6为fixed定位,因IE6不支持fixed,设置absolute来hack
                    'left':     0,                                      //  遮罩层的左边距
                    'top':      0,                                      //  遮罩层的顶部距离
                    'opacity':  plugin.settings.overlay_opacity         //  遮罩层的透明度
                });

                // overlay_close为true,则单击遮罩层后,对话框和遮罩层消失.否则单击没效果
                if (plugin.settings.overlay_close)
                    plugin.overlay.bind('click', function() {plugin.close()});
                //添加到body
                plugin.overlay.appendTo('body');
            }

            // 创建对话框引用
            plugin.dialog = jQuery('<div>', {
            	//对话框的样式
                'class':        'JFZDialog' + (plugin.settings.custom_class ? ' ' + plugin.settings.custom_class : '')
            }).css({
                'position':     (plugin.isIE6 ? 'absolute' : 'fixed'),  //  遮罩层定位,非IE6为fixed定位,因IE6不支持fixed,设置absolute来hack
                'left':         0,                                      //  遮罩层的左边距,默认居中显示
                'top':          0,                                      //  遮罩层的顶部距离
                'visibility':   'hidden'                                //  对话框不可见
            });

            // 如果模式开启为通知模式的话 
            if (!plugin.settings.buttons && plugin.settings.auto_close)
                // 给通知添加唯一的ID
                plugin.dialog.attr('id', 'JFZ_Dialog_' + Math.floor(Math.random() * 9999999));
            // 对话框的预设宽度,并且设置成整数
            var tmp = parseInt(plugin.settings.width);
            // 如果宽度是个有效的值
            if (!isNaN(tmp) && tmp == plugin.settings.width && tmp.toString() == plugin.settings.width.toString() && tmp > 0)
                // 将对话框的宽度设成预设宽度
                plugin.dialog.css({'width' : plugin.settings.width});
            // 如果设置了对话框的标题
            if (plugin.settings.title){
	                // 创建标题
	                jQuery('<h3>', {
	                    'class':    'JFZDialog_Title',	//标题的样式
	                    'id'   :    'JFZDialog_Title'
	                }).html(plugin.settings.title).appendTo(plugin.dialog);
	                
	                jQuery('<i>',{
	                	'class' : 'JFZDialog_Title_Close',
	                	'id'   :  'JFZDialog_Title_Close'
	                }).appendTo(plugin.dialog);
	                
	                plugin.dialog.delegate(".JFZDialog_Title_Close", "click", function(e){
	                	plugin.close();
	                });
	                
				}
				
            //设置主体内容的样式 
            var body_container = jQuery('<div>', {
                'class':    'JFZDialog_BodyOuter' + (!plugin.settings.title ? ' JFZDialog_NoTitle' : '') + (!get_buttons() ? ' JFZDialog_NoButtons' : '')

            }).appendTo(plugin.dialog);

            plugin.message = jQuery('<div>', {
                // 根据对话框不同的类型  加载不同的样式
                'class':    'JFZDialog_Body' + (get_type() != '' ? ' JFZDialog_Icon JFZDialog_' + get_type() : '')
            });
			
            // 如果设置了最大高度
            if (plugin.settings.max_height > 0) {
                plugin.message.css('max-height', plugin.settings.max_height);
                // 因为IE6不支持max_height，所以用下面的hack方式。
                if (plugin.isIE6) plugin.message.attr('style', 'height: expression(this.scrollHeight > ' + plugin.settings.max_height + ' ? "' + plugin.settings.max_height + 'px" : "85px")');
            }
			
            // 如果设置了vcenter_short_message属性--》该属性造成位置不同。
            if (plugin.settings.vcenter_short_message)
                jQuery('<div>').html(plugin.settings.message).appendTo(plugin.message);
            else
                plugin.message.html(plugin.settings.message);

            // 如果设置了source属性
            if (plugin.settings.source && typeof plugin.settings.source == 'object') {
				//内容容器
                var canvas = (plugin.settings.vcenter_short_message ? $('div:first', plugin.message) : plugin.message);
				//判断资源加载方式
                for (var type in plugin.settings.source) {
                    switch (type) {
                    	
                        case 'ajax':
                            var
                                // ajax配置
                                ajax_options = typeof plugin.settings.source[type] == 'string' ? {'url': plugin.settings.source[type]} : plugin.settings.source[type],
                                // 预加载样式
                                preloader = jQuery('<div>').attr('class', 'JFZDialog_Preloader').appendTo(canvas);

                            // 成功时执行的回调函数
                            ajax_options.success = function(result) {
                                preloader.remove();
                                canvas.append(result);
                                draw(false);
                            }
                            //console.log(ajax_options);
                            // 调用ajax
                            $.ajax(ajax_options);
                            break;
                            
                        case 'iframe':
                            // iframe的默认配置
                            var default_options = {
                                    'width':        '100%',
                                    'height':       '100%',
                                    'marginheight': '0',
                                    'marginwidth':  '0',
                                    'frameborder':  '0'
                                }

                                // iframe实际参数
                                iframe_options = $.extend(default_options, typeof plugin.settings.source[type] == 'string' ? {'src': plugin.settings.source[type]} : plugin.settings.source[type]);
								//console.log(iframe_options);
                            // 添加iframe到canvas中
                            canvas.append(jQuery('<iframe>').attr(iframe_options));
                            break;
                        // 如果是一段html片段
                        case 'inline':
                            // 直接添加到canvas中
                            canvas.append(plugin.settings.source[type]);
                            break;
                    }

                }

            }

            // 把信息主体添加到对话框容器中
            plugin.message.appendTo(body_container);

            // 按钮数组
            var buttons = get_buttons();

            // 如果存在按钮的话(包括自定义)
            if (buttons) {

                // button的容器
                var button_bar = jQuery('<div>', {
                    'class':    'JFZDialog_Buttons'	//按钮的样式
                }).appendTo(plugin.dialog);
                // 迭代按钮数组并添加到容器中
                $.each(buttons, function(index, value) {
                    // 穿件按钮
                    var button = jQuery('<a>', {
                        'href':     'javascript:void(0)',
                        'class':    'JFZDialog_Button' + index

                    });

             /* 如果button提供形式为:[{caption: 'Yes', callback: function() { alert('Yes was clicked')}},"
                  {caption: 'No', callback: function() { alert('No was clicked')}},
                    {caption: 'Cancel', callback: function() { alert('Cancel was clicked')}}]*/
                    if ($.isPlainObject(value)) 
                    	button.html(value.caption);
                    /*如果buttons提供的形式为:  ['Yes', 'No', 'Help']*/
                    else 
                    	button.html(value);
                    // 为按钮添加事件
                    button.bind('click', function() {
                        // 执行事件
                        if (undefined != value.callback) value.callback(plugin.dialog);
                        // 关闭对话框和遮罩层
                        // 同时传递按钮的label
                        plugin.close(undefined != value.caption ? value.caption : value);

                    });
                    // 将按钮添加到容器中去
                    button.appendTo(button_bar);

                });

              
                jQuery('<div>', {

                    'style':    'clear:both'

                }).appendTo(button_bar);

            }

            // 将对话框添加到body中去
            plugin.dialog.appendTo('body');

            // 为window添加resize事件,即窗口的分辨率发生了变化
            $(window).bind('resize', draw);

            // 如果设置了框架键即ESC键
            if (plugin.settings.keyboard)
                //如果一个键被keyup,则执行keyup事件--》事件委托
                $(document).bind('keyup', _keyup);

            //因IE6不支持fixed定位,所以加scroll滚动事件模拟fixed
            if (plugin.isIE6)
                $(window).bind('scroll', _scroll);

            // 如果auto_close设置为false,即单击遮罩层时,遮罩和对话框消失
            if (plugin.settings.auto_close !== false) {
                plugin.dialog.bind('click', function(e) {
                    // 清除定时器
                    clearTimeout(plugin.timeout);
                    plugin.close();

                });

                // 定时关闭
                plugin.timeout = setTimeout(plugin.close, plugin.settings.auto_close);

            }
            // 绘制插件
            draw(false);
            // 返回插件的引用
            return plugin;

        }

        /**
         *  关闭对话框
         *  @return void
         */
        plugin.close = function(caption) {
            // 移除事件-->防止污染其他的事件
            if (plugin.settings.keyboard) 
            	$(document).unbind('keyup', _keyup);
            	
            if (plugin.isIE6) 
            	$(window).unbind('scroll', _scroll);

            $(window).unbind('resize', draw);

            // 如果遮罩层存在
            if (plugin.overlay)
                //讲遮罩层的透明度设置为 0
                plugin.overlay.animate({
                    opacity: 0  
                },
                // 消失的时间段
                plugin.settings.animation_speed_hide,
                // 动画完成后执行的函数
                function() {
                    // 删除遮罩层
                    plugin.overlay.remove();
                });

            // 对话框执行的操作
            plugin.dialog.animate({
                height : 0,		//高度逐渐变成为 0
                opacity : 0  // 透明度为 0

            },
            // 动画执行的时间段
            plugin.settings.animation_speed_hide,

            // 动画完成后执行的操作
            function() {
                // 从节点中删除
                plugin.dialog.remove();
                // 关闭后执行的操作
                if (plugin.settings.onClose && typeof plugin.settings.onClose == 'function')
                    // 执行回调函数,传入参数
                    plugin.settings.onClose(undefined != caption ? caption : '');
            });

        }

        /**
         *  绘制对话框和遮罩层
         *  @return void
         *  @access private,该方法只能在该脚本中访问到
         */
        var draw = function() {
            var
                // 获得视窗的高度和宽度
                viewport_width = $(window).width(),
                viewport_height = $(window).height(),

                // 获取对话框的高度和宽度
                dialog_width = plugin.dialog.width(),
                dialog_height = plugin.dialog.height(),

                values = {
                    'left':     0,
                    'top':      0,
                    'right':    viewport_width - dialog_width,
                    'bottom':   viewport_height - dialog_height,
                    'center':   (viewport_width - dialog_width) / 2,
                    'middle':   (viewport_height - dialog_height) / 2

                };

            // 重置
            plugin.dialog_left = undefined;
            plugin.dialog_top = undefined;

            // 遮罩层存在
            if (plugin.settings.modal)
                // 遮罩层全屏显示
                plugin.overlay.css({
                    'width':    viewport_width,
                    'height':   viewport_height
                });
          
            if (
                $.isArray(plugin.settings.position) &&
               
                plugin.settings.position.length == 2 &&
               
                typeof plugin.settings.position[0] == 'string' &&

                plugin.settings.position[0].match(/^(left|right|center)[\s0-9\+\-]*$/) &&

                typeof plugin.settings.position[1] == 'string' &&

                plugin.settings.position[1].match(/^(top|bottom|middle)[\s0-9\+\-]*$/)
            ) {
				//转换成小写,便于下面比较
                plugin.settings.position[0] = plugin.settings.position[0].toLowerCase();
                plugin.settings.position[1] = plugin.settings.position[1].toLowerCase();
				//将left，right。。。换成实际的值
                $.each(values, function(index, value) {
                    for (var i = 0; i < 2; i++) {
                        // 替换
                        var tmp = plugin.settings.position[i].replace(index, value);
                        //console.log(tmp+"  "+plugin.settings.position[i]);
                        // 过滤,并且计算
                        if (tmp != plugin.settings.position[i])
                            if (i == 0) 
                            	plugin.dialog_left = eval(tmp); 
                            else 
                            	plugin.dialog_top = eval(tmp);
                    }

                });

            }

            // 如果没设置指定的值,则采用默认的值
            if (undefined == plugin.dialog_left || undefined == plugin.dialog_top) {

                // 对话框的默认位置
                plugin.dialog_left = values['center'];
                plugin.dialog_top = values['middle'];
            }

            // 如果设置该属性,居中定位
            if (plugin.settings.vcenter_short_message) {
                var
                    message = plugin.message.find('div:first'),
                    message_height = message.height(),
                    container_height = plugin.message.height();

                // 居中操作
                if (message_height < container_height)
                    message.css({
                        'padding-top':   (container_height - message_height) / 2
                    });
            }
			//处理函数参数--》提供true|false|plugin.settings.reposition_speed
            if ((typeof arguments[0] == 'boolean' && arguments[0] === false) || plugin.settings.reposition_speed == 0) {
                plugin.dialog.css({
                    'left':         plugin.dialog_left,
                    'top':          plugin.dialog_top,
                    'visibility':   'visible',
                    'opacity':      0

                }).animate({'opacity': 1}, plugin.settings.animation_speed_show);

            } else {
                plugin.dialog.stop(true);
                plugin.dialog.css('visibility', 'visible').animate({
                    'left': plugin.dialog_left,
                    'top':  plugin.dialog_top
                }, plugin.settings.reposition_speed);

            }

            // 吧焦点聚焦在第一个按钮上
            plugin.dialog.find('a[class^=JFZDialog_Button]:first').focus();
			//IE6 hack
            if (plugin.isIE6) setTimeout(emulate_fixed_position, 500);

        }

        /**
         *  IE6 模拟fixed定位
         *
         *  @return void
         *
         *  @access private
         */
        var emulate_fixed_position = function() {

            var
                scroll_top = $(window).scrollTop(),
                scroll_left = $(window).scrollLeft();

            // 遮罩层定位
            if (plugin.settings.modal)
                plugin.overlay.css({
                    'top':  scroll_top,
                    'left': scroll_left
                });

            // 对话框定位
            plugin.dialog.css({
                'left': plugin.dialog_left + scroll_left,
                'top':  plugin.dialog_top + scroll_top
            });

        }

        /**
         *  @return array   按钮数组.
         *  @access private
         */
        var get_buttons = function() {
            // 没有设置按钮的情况
            if (plugin.settings.buttons !== true && !$.isArray(plugin.settings.buttons)) return false;

            // 默认值为true
            if (plugin.settings.buttons === true)
                // 对话框的类型
                switch (plugin.settings.type) {
                    
                    case 'question':
                        plugin.settings.buttons = ['Yes', 'No'];
                        break;
                    default:
                        plugin.settings.buttons = ['Ok'];

                }
            return plugin.settings.buttons.reverse();

        }

        /**
         *
         *  @return mixed.
         *
         *  @access private
         */
        var get_type = function() {

            switch (plugin.settings.type) {
            	
                case 'confirmation':
                case 'error':
                case 'information':
                case 'question':
                case 'warning':
                    return plugin.settings.type.charAt(0).toUpperCase() + plugin.settings.type.slice(1).toLowerCase();
                    break;
                default:
                    return false;

            }

        }

        /**
         *  @return boolean 
         *  @access private
         */
        var _keyup = function(e) {
            //如果按的是ESC(e.which == 27)  关闭遮罩层和对话框
            if (e.which == 27) plugin.close();
            return true;

        }

        /**
         *
         *  @return void
         *
         *  @access private
         */
        var _scroll = function() {
            // 确保遮罩层和对话框 总是在正确的位置
            emulate_fixed_position();

        }
        //由于jQuery1.9.0不提供browser对象,则使用以下的代码来完成浏览器的识别
        var browser = {
        	init: function () {
        		this.name = this.searchString(this.dataBrowser) || '';
        		this.version = this.searchVersion(navigator.userAgent)
        			|| this.searchVersion(navigator.appVersion)
        			|| '';
        	},
        	searchString: function (data) {
        		for (var i=0;i<data.length;i++)	{
        			var dataString = data[i].string;
        			var dataProp = data[i].prop;
        			this.versionSearchString = data[i].versionSearch || data[i].identity;
        			if (dataString) {
        				if (dataString.indexOf(data[i].subString) != -1)
        					return data[i].identity;
        			}
        			else if (dataProp)
        				return data[i].identity;
        		}
        	},
        	searchVersion: function (dataString) {
        		var index = dataString.indexOf(this.versionSearchString);
        		if (index == -1) return;
        		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
        	},
        	dataBrowser: [
        		{
        			string: navigator.userAgent,
        			subString: 'MSIE',
        			identity: 'explorer',
        			versionSearch: 'MSIE'
        		}
        	]
        }
        /**
         *	阻止浏览器滚动
         * 
         *  @return void  
         *
         *  @access private
         */
        var _stopScroll = function(){
        	
        	$("body")[0].onmousewheel = function (e) {
				e = e || window.event;
				if (navigator.userAgent.toLowerCase().indexOf('msie') >= 0) {
					event.returnValue = false;
				} else {
					e.preventDefault();
				}
			};
			
			if (navigator.userAgent.toLowerCase().indexOf('firefox') >= 0) {
				//firefox支持donmousewheel
				addEventListener('DOMMouseScroll',
				function(e) {
					var obj = e.target;
					var onmousewheel;
					while (obj) {
						onmousewheel = obj.getAttribute('onmousewheel') || obj.onmousewheel;
						if (onmousewheel) break;
						if (obj.tagName == 'BODY') break;
						obj = obj.parentNode;
					};
					if (onmousewheel) {
						if (e.preventDefault) e.preventDefault();
						e.returnValue = false; //禁止页面滚动
						if (typeof obj.onmousewheel != 'function') {
							//将onmousewheel转换成function
							eval('window._tmpFun = function(event){' + onmousewheel + '}');
							obj.onmousewheel = window._tmpFun;
							window._tmpFun = null;
						};
						// 不直接执行是因为若onmousewheel(e)运行时间较长的话，会导致锁定滚动失效，使用setTimeout可避免
						setTimeout(function() {
							obj.onmousewheel(e);
						},
						1);
					};
				},
				false);
			};
        }
        //初始化browser对象
        browser.init();
        //初始化插件
        return plugin.init();
    }
})(jQuery);