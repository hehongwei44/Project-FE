/**
 * @author HeHongWei
 */
;(function($) {

    $.fn.atfriend = function(settings) {
        /*辅助功能函数,来自第三方并加以修改*/
        var Obj = {
            /*获取光标的位置*/
            getInputPositon : function(elem) {
                if(document.selection) {
                    elem.focus();
                    var Sel = document.selection.createRange();
                    return {
                        left : Sel.boundingLeft,
                        top : Sel.boundingTop,
                        bottom : Sel.boundingTop + Sel.boundingHeight
                    };
                } else {
                    var that = this;
                    var cloneDiv = '{$clone_div}', cloneLeft = '{$cloneLeft}', cloneFocus = '{$cloneFocus}', cloneRight = '{$cloneRight}';
                    var none = '<span style="white-space:pre-wrap;"> </span>';
                    var div = elem[cloneDiv] || document.createElement('div'), focus = elem[cloneFocus] || document.createElement('span');
                    var text = elem[cloneLeft] || document.createElement('span');
                    var offset = that._offset(elem), index = this._getFocus(elem), focusOffset = {
                        left : 0,
                        top : 0
                    };

                    if(!elem[cloneDiv]) {
                        elem[cloneDiv] = div, elem[cloneFocus] = focus;
                        elem[cloneLeft] = text;
                        div.appendChild(text);
                        div.appendChild(focus);
                        document.body.appendChild(div);
                        focus.innerHTML = '|';
                        focus.style.cssText = 'display:inline-block;width:0px;overflow:hidden;z-index:-100;word-wrap:break-word;word-break:break-all;';
                        div.className = this._cloneStyle(elem);
                        div.style.cssText = 'visibility:hidden;display:inline-block;position:absolute;z-index:-100;word-wrap:break-word;word-break:break-all;overflow:hidden;';
                    };
                    div.style.left = this._offset(elem).left + "px";
                    div.style.top = this._offset(elem).top + "px";
                    var strTmp = elem.value.substring(0, index).replace(/</g, '<').replace(/>/g, '>').replace(/\n/g, '<br/>').replace(/\s/g, none);
                    text.innerHTML = strTmp;

                    focus.style.display = 'inline-block';
                    try {
                        focusOffset = this._offset(focus);
                    } catch (e) {
                    };
                    focus.style.display = 'none';
                    return {
                        left : focusOffset.left,
                        top : focusOffset.top,
                        bottom : focusOffset.bottom
                    };
                }
            },

            _cloneStyle : function(elem, cache) {
                if(!cache && elem['${cloneName}'])
                    return elem['${cloneName}'];
                var className, name, rstyle = /^(number|string)$/;
                var rname = /^(content|outline|outlineWidth)$/;
                //Opera: content; IE8:outline && outlineWidth
                var cssText = [], sStyle = elem.style;

                for(name in sStyle) {
                    if(!rname.test(name)) {
                        val = this._getStyle(elem, name);
                        if(val !== '' && rstyle.test( typeof val)) {// Firefox 4
                            name = name.replace(/([A-Z])/g, "-$1").toLowerCase();
                            cssText.push(name);
                            cssText.push(':');
                            cssText.push(val);
                            cssText.push(';');
                        };
                    };
                };
                cssText = cssText.join('');
                elem['${cloneName}'] = className = 'clone' + (new Date).getTime();
                this._addHeadStyle('.' + className + '{' + cssText + '}');
                return className;
            },

            _addHeadStyle : function(content) {
                var style = this._style[document];
                if(!style) {
                    style = this._style[document] = document.createElement('style');
                    document.getElementsByTagName('head')[0].appendChild(style);
                };
                style.styleSheet && (style.styleSheet.cssText += content) || style.appendChild(document.createTextNode(content));
            },
            _style : {},

            _getStyle : 'getComputedStyle' in window ? function(elem, name) {
                return getComputedStyle(elem, null)[name];
            } : function(elem, name) {
                return elem.currentStyle[name];
            },

            /*获取光标前字符的个数*/
            _getFocus : function(elem) {
                var index = 0;
                if(document.selection) {
                    elem.focus();
                    var Sel = document.selection.createRange();
                    if(elem.nodeName === 'TEXTAREA') {
                        var Sel2 = Sel.duplicate();
                        Sel2.moveToElementText(elem);
                        var index = -1;
                        while(Sel2.inRange(Sel)) {
                            Sel2.moveStart('character');
                            index++;
                        };
                    } else if(elem.nodeName === 'INPUT') {
                        Sel.moveStart('character', -elem.value.length);
                        index = Sel.text.length;
                    }
                } else if(elem.selectionStart || elem.selectionStart == '0') {
                    index = elem.selectionStart;
                }
                return (index);
            },
            /*获取元素所在的位置*/
            _offset : function(elem) {
                var box = elem.getBoundingClientRect(), doc = elem.ownerDocument, body = doc.body, docElem = doc.documentElement;
                var clientTop = docElem.clientTop || body.clientTop || 0, clientLeft = docElem.clientLeft || body.clientLeft || 0;
                var top = box.top + (self.pageYOffset || docElem.scrollTop) - clientTop, left = box.left + (self.pageXOffset || docElem.scrollLeft) - clientLeft;
                return {
                    left : left,
                    top : top,
                    right : left + box.width,
                    bottom : top + box.height
                };
            }
        };
        //插件的实际参数
        var settings = $.extend({}, $.fn.atfriend.defaultSettings, settings || {});
        //插件模板
        var tmpl = [
                    '<div class="atfriend_cnt">', 
                        '<div class="arrow_box">', 
                            '<i class="arrow_shadow">', '</i>', 
                            '<i class="arrow_bg">', '</i>', 
                        '</div>', 
                        '<div class="friend_list">',
                            '<span class="msg">不存在相匹配的数据</span>', 
                            '<ul>', 
                            '</ul>', 
                        '</div>', 
                     '</div>'
                   ].join('');
                   
        //列表的索引
        var index = -1;
        //文本域中前面的字符,用于记录光标前字符的的位置
        var g_index = 0;
        //插件的核心操作
        return this.each(function() {
            //self指向textarea的应用
            var self = this;
            var $this = $(self);
            /**
             * $atfriend_cnt:插件的应用
             * $ul_list:ul列表
             * $links:ul列表中的超链接的集合
             * $li:ul列表中的li元素的集合
             * */
            var $atfriend_cnt, $ul_list, $links, $lis;
            /*判断插件是否存在,如果不存在则创建,并预加载前几条数据*/
            if($(".atfriend_cnt").length === 0) {
                $("body").append(tmpl);
                $atfriend_cnt = $(".atfriend_cnt");
                $ul_list = $atfriend_cnt.find("ul");
                //异步加载数据,加载前几条数据
                ansyData("", $atfriend_cnt);
            }

            /*因为是异步加载,所以控制台输出为空数组*/
            $lis = $ul_list.find("li");
            $links = $ul_list.find("a");

            //列表上li元素的滑过事件,对于事件绑定,要用到事件委托,而不能使用bind,或其他事件.
            $lis.live('mouseover', function(e) {
                /*要区分this的引用*/
                var $that = $(this);
                /*高亮被选择的元素,并取消兄弟节点的高亮*/
                $that.addClass('highlight').siblings().removeClass('highlight');
                //记录当前被选中的索引
                index = $that.index();
                //记录当前光标前的字符的个数,防止列表元素得到光标后,导致单击列表元素后得值,无法定位到正确的位置
                var cur_index = Obj._getFocus(self);
                setCursor(cur_index);
                //阻止事件冒泡
                return false;
            });

            //列表上的鼠标单击单击事件,备注:因为该事件要发生在textarea的blur事件之前,所以请使用mousedown,而不能用click
            $lis.live('mousedown', function(e) {
                //$that:li标签的引用,而不是textara的引用。
                var $that = $(this);
                //textarea中的值
                var val = $this.val();
                //li标签中超链接的值
                var text = $that.find("a").text();
                /*光标前字符数的索引*/
                var cur_index = g_index;
                /*str:光标之前的字符串*/
                var str = val.substring(0, cur_index);
                /*lastIndex:离光标最近的‘@’字符的索引*/
                var lastIndex = str.lastIndexOf('@');
                /*v1:@之前的字符串*/
                var v1 = val.substring(0, lastIndex + 1);
                /*v2:@与光标之间的字符串*/
                var v2 = val.substring(lastIndex + 1, cur_index);
                /*光标之后的的字符串*/
                var v3 = val.substring(cur_index);
                /*把li元素中超链接中的值赋值给v2*/
                v2 = text + " ";
                /*重新拼接textarea中的值*/
                val = v1 + v2 + v3;
                $this.val(val);
                //把光标移动到textarea的末尾
                moveEnd($this.get(0));
                cnt_hide($atfriend_cnt);
                //这句话防止光标逃离textarea
                return false;
            });

            //处理textarea中的click事件,其效果是显示指定的列表
            $this.bind('click', function(e) {
                /*textarea中光标的具体位置,用于定位容器*/
                var pos = Obj.getInputPositon(self);
                var cur_index = Obj._getFocus(self);
                setCursor(cur_index);
                var val = $(self).val();
                var str = val.substring(0, cur_index);
                var lastIndex = str.lastIndexOf('@');
                /*str:光标与'@'字符之间的字符串*/
                str = str.substring(lastIndex, cur_index);
                //console.log(str);
                /*含有@字符时并且该字符串中没有空格时,执行查询*/
                if(/@/.test(str) && !/\s/.test(str)) {
                    //异步提交的关键字
                    var q_val = str.substring(1);
                    //关键字如果为空的话,则返回默认的数据
                    if(q_val === '') {
                        ansyData("", $atfriend_cnt);
                    } else {
                        ansyData(q_val, $atfriend_cnt);
                    }
                    //容器定位
                    $atfriend_cnt.css({
                        position : "absolute",
                        display : 'block',
                        left : pos.left - 15,
                        top : !$.browser.opera ? pos.bottom + settings.margin_bottom : pos.bottom + 25
                    });
                } else {
                    cnt_hide($atfriend_cnt);

                }
                return false;
            });

            //blur事件会在元素失去焦点的时候触发，既可以是鼠标行为，也可以是按tab键离开的
            $this.bind('blur', function(e) {
                cnt_hide($atfriend_cnt);
                return false;
            });

            //按键按下处理事件
            $this.bind('keydown', {
                cnt : $atfriend_cnt
            }, processShiftKey);

            //按键弹起处理事件
            $this.bind('keyup', {
                cnt : $atfriend_cnt
            }, processKey);

        });

        //记录光标的位置及光标钱的字符
        function setCursor(index) {
            g_index = index;
        };

        //将光标移动到末尾
        function moveEnd(obj) {
            obj.focus();
            var len = obj.value.length;
            if(document.selection) {
                var sel = obj.createTextRange();
                sel.moveStart('character', len);
                sel.collapse();
                sel.select();
            } else if( typeof obj.selectionStart == 'number' && typeof obj.selectionEnd == 'number') {
                obj.selectionStart = obj.selectionEnd = len;
            }
        }

        //处理组合键
        function processShiftKey(e) {
            /*$atfriend_cnt:插件的引用*/
            var $atfriend_cnt = e.data.cnt;
            /*$li:列表中的li元素*/
            var $li = $atfriend_cnt.find("li");
            /*$links:li元素中的超链接*/
            var $links = $atfriend_cnt.find("a");
            /*$this:textarea的引用*/
            var $this = $(this);

            //防止光标乱跑,38:up的键值,40:down的键值.
            if(/^38$|^40$/.test(e.which)) {
                if($atfriend_cnt.is(':visible')) {
                    return false;
                } else {
                    return true;
                }
            }

            //按下Enter键时,执行的动作
            if(/^13$/.test(e.which) && $atfriend_cnt.is(':visible')) {
                //enter
                var val = $this.val();
                var text = $links.eq(index).text();

                var cur_index = Obj._getFocus($this.get(0));
                var str = val.substring(0, cur_index);
                var lastIndex = str.lastIndexOf('@');
                var v1 = val.substring(0, lastIndex + 1);
                var v2 = val.substring(lastIndex + 1, cur_index);
                var v3 = val.substring(cur_index);
                v2 = text + " ";
                val = v1 + v2 + v3;
                $(this).val(val);
                //隐藏容器
                cnt_hide($atfriend_cnt);
                //移出样式
                $li.eq(index).removeClass('highlight');
                index = -1;
                //阻止按下enter键时换行
                return false;
            }

            //当按下组合键shift+2==>@时,进行一些初始化工作
            if(e.shiftKey && e.which === 50) {
                //pos为textarea中光标的位置
                var pos = Obj.getInputPositon(this);
                var $atfriend_cnt = e.data.cnt;
                //var scroll_top = getScrollTop(this);
                //异步加载数据
                ansyData("", $atfriend_cnt);
                
                //容器定位
                $atfriend_cnt.css({
                    position : "absolute",
                    display : 'block',
                    left : pos.left,
                    top : !$.browser.opera ? (pos.bottom + settings.margin_bottom) : (pos.bottom + 25)
                });
            }
        }

        //处理一般键
        function processKey(e) {
            /*插件容器*/
            var $atfriend_cnt = e.data.cnt;
            var $links = $atfriend_cnt.find("a");
            /*target是this对象的引用*/
            var target = this;

            //删除键时执行的动作
            if(/^8$/.test(e.which)) {
                backspace(target, $atfriend_cnt);
            }

            //按下向左或者向右时执行的动作
            if(/^39$|^37$/.test(e.which)) {
                arrow_LR(target, $atfriend_cnt);
            }

            //其他按键所执行的动作
            if(/^27$|^38$|^40$|^13$/.test(e.which) && $atfriend_cnt.is(':visible')) {
                if(e.preventDefault)
                    e.preventDefault();
                if(e.stopPropagation)
                    e.stopPropagation();

                e.cancelBubble = true;
                e.returnValue = false;

                switch(e.which) {
                    case  13:
                        //enter
                        break;
                    case  38:
                        //up
                        if(index <= 0) {
                            index = $links.length;
                        }
                        index--;
                        break;
                    case  40:
                        //down
                        if(index >= $links.length - 1) {
                            index = -1;
                        }
                        index++;
                        break;
                    case 27:
                        //esc
                        $atfriend_cnt.css({
                            display : 'none'
                        });
                        break;
                    default:
                        break;
                }
                $links.eq(index).parent("li").addClass("highlight").siblings().removeClass("highlight");
            }

            //按下空白字符时,隐藏插件
            if(/\s/.test(String.fromCharCode(e.which))) {
                $atfriend_cnt.css({
                    display : 'none'
                });
            }

            queryString(target, e.which, $atfriend_cnt);

        }

        //异步请求数据
        function ansyData(keyword, container) {
            var cnt = container;
            var $list = cnt.find(".friend_list");
            var $ul = $list.find("ul");
            var $span = $list.find(".msg");
            var str = "";
            $.post(settings.url, {
                w : keyword
            }, function(data) {
                if(data.length === 0) {
                    $span.show();
                    $ul.hide();
                } else {
                    $.each(data, function(index, value) {
                        str += "<li><a href='javascript:void(0);'>" + value + "</a></li>";
                    });
                    $span.hide();
                    $ul.show().empty();
                    $ul.append(str);
                }

            });
        }

        //按Backspace时执行的操作
        function backspace(tar, cnt) {
            var $atfriend_cnt = cnt;
            var target = tar;
            /*textarea中光标前的字符*/
            var cursor_index = Obj._getFocus(target);
            /*textarea中光标之前的文本值*/
            var value = $(target).val().substring(0, cursor_index);
            /*里光标最近的@的索引*/
            var last_index = value.lastIndexOf('@');
            //控制字符串,用于过滤掉xx xx这种形式,该字符串为@ 与 光标之间的值。
            var q_str = value.substring(last_index + 1, cursor_index);

            /*如果文本值中包含@符号,且输入的键值在控制范围内,就进行查询工作*/
            if(/@/.test(value) && !(/\s/.test(q_str))) {
                //用于查询的关键字
                var pos = Obj.getInputPositon(target);
                if(q_str != '') {
                    //q_str为提交查询的关键字
                    ansyData(q_str, $atfriend_cnt);

                } else {
                    ansyData("", $atfriend_cnt);
                }
                //如果光标与@之前没有字符串,则进行定位

                $atfriend_cnt.css({
                    position : "absolute",
                    display : 'block',
                    left : pos.left - settings.margin_left,
                    top : !$.browser.opera ? pos.bottom + settings.margin_bottom : pos.bottom + 26
                });

            } else {
                $atfriend_cnt.css({
                    display : 'none'
                });
            }
        }

        //按向左或者向右时执行的动作
        function arrow_LR(tar, cnt) {
            var target = tar;
            var $atfriend_cnt = cnt;
            var cursor_index = Obj._getFocus(target);
            /*textarea中的值*/
            var value = $(target).val().substring(0, cursor_index);
            /*里光标最近的@的索引*/
            var last_index = value.lastIndexOf('@');
            //控制字符串,用于过滤掉xx xx这种形式,该字符串为@ 与 光标之间的值。
            var q_str = value.substring(last_index + 1, cursor_index);
            setCursor(cursor_index);
            /*如果文本值中包含@符号,且输入的键值在控制范围内,就进行查询工作*/
            if(/@/.test(value) && !(/\s/.test(q_str))) {
                //用于查询的关键字
                var pos = Obj.getInputPositon(target);
                if(q_str != '') {
                    //q_str为提交查询的关键字
                    ansyData(q_str, $atfriend_cnt);

                } else {
                    ansyData("", $atfriend_cnt);
                }
                //如果光标与@之前没有字符串,则进行定位
                $atfriend_cnt.css({
                    position : "absolute",
                    display : 'block',
                    left : pos.left - settings.margin_left,
                    top : !$.browser.opera ? pos.bottom + settings.margin_bottom : pos.bottom + 26
                });
            } else {
                cnt_hide($atfriend_cnt);
            }
        }

        //字符串的提交
        function queryString(tar, which, cnt) {
            var target = tar;
            var keyCode = which;
            var $atfriend_cnt = cnt;
            /*但输入字母,数字等有效字符时,则进行提示*/
            /*textarea中光标的位置*/
            var cursor_index = Obj._getFocus(target);
            /*textarea中的文本值*/
            var value = $(target).val().substring(0, cursor_index);
            /*最后一个@的索引*/
            var last_index = value.lastIndexOf('@');
            /*如果文本值中包含@符号,且输入的键值在控制范围内,就进行查询工作*/
            if(/@/.test(value) && /\w/.test(String.fromCharCode(keyCode))) {
                //控制字符串,用于过滤掉xx xx这种形式,该字符串为@ 与 光标之间的值。
                var q_str = value.substring(last_index + 1, cursor_index);

                if(!(/\s/.test(q_str))) {
                    //用于提交的字符串
                    var q_val = q_str.split(' ')[0];
                    //查询字符串不为空
                    if(q_str != '') {
                        ansyData(q_val, $atfriend_cnt);
                    }
                }
            }
        }

        //隐藏插件
        function cnt_hide(cnt) {
            cnt.css({
                display : 'none'
            });
        }

        //获取textarea滚动条高度
        function getScrollTop(tar) {
            var obj = tar , top; 
            top = obj.scrollHeight;
            return top;
        }

    };

    //插件的默认参数
    $.fn.atfriend.defaultSettings = {
        margin_bottom : 8,
        margin_left : 12,
        url : ""
    }

})(jQuery);
