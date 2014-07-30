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
                            '<ul>', 
                            '</ul>', 
                        '</div>', 
                     '</div>'
                   ].join('');
                   
        //列表索引
        var index = -1;
        //插件的核心操作
        return this.each(function() {
            var $this = $(this);
            var $atfriend_cnt, $ul_list, $links, $lis;

            if($(".atfriend_cnt").length === 0) {
                $("body").append(tmpl);
                $atfriend_cnt = $(".atfriend_cnt");
                $ul_list = $atfriend_cnt.find("ul");
                //异步加载数据,加载前十条数据
                $.getJSON('data/friends.json', function(data) {
                    console.log("预加载数据");
                    $.each(data, function(index, item) {
                        var $li = $("<li></li>");
                        var $link = $("<a></a>");
                        $link.text(item.username);
                        $link.attr('value', item.userid);
                        $li.append($link);
                        $ul_list.append($li);
                    });
                });
            }

            $lis = $ul_list.find("li");
            $links = $ul_list.find("a");

            //列表上的滑过事件
            $lis.live('mouseover', function(e) {
                var $this = $(this);
                $this.addClass('highlight').siblings().removeClass('highlight');
                index = $this.index();
                return false;
            });

            //列表上的鼠标单击单击事件,备注:因为该事件要发生在input的blur事件之前,所以请使用mousedown,而不能用click
            $lis.live('mousedown', function(e) {
                //li标签的应用
                var $that = $(this);
                //textarea中的值
                var val = $this.val();
                //li标签中超链接的值
                var text = $that.find("a").text();
                //把val截断成3组,进行字符串拼接
                /*光标的索引*/
                var cur_index = Obj._getFocus(this);
                var str = val.substring(0, cur_index);
                var lastIndex = str.lastIndexOf('@');
                var v1 = val.substring(0, lastIndex);
                var v2 = val.substring(lastIndex, cur_index);
                var v3 = val.substring(cur_index);
                /*
                 console.log(v1);
                 console.log(v2);
                 console.log(v3);
                 */
                v2 = text + " ";
                val = v1 + v2 + v3;
                $(this).val(val);
            });

            //处理click事件
            $this.bind('click', function(e) {
                //console.log("mousedown");
                /*textarea中光标的具体位置,用于定位容器*/
                var that = this
                var pos = Obj.getInputPositon(that);
                var cur_index = Obj._getFocus(that);
                var val = $(that).val();
                var str = val.substring(0, cur_index);
                //console.log(str);
                /*含有@字符时并且该字符串中没有空格时,执行查询*/
                if(/@/.test(str) && !/\s/.test(str)) {
                    var lastIndex = str.lastIndexOf('@');
                    var q_val = str.substring(lastIndex + 1);
                    if(q_val === '') {
                        console.log("加载预处理的数据");
                    } else {
                        console.log("单击动作要查询的字符串:" + q_val);
                    }
                    //容器定位
                    $atfriend_cnt.css({
                        position : "absolute",
                        display : 'block',
                        left : pos.left - 15,
                        top : !$.browser.opera ? pos.bottom + settings.margin_bottom : pos.bottom + 26
                    });
                }

            });

            //blur事件会在元素失去焦点的时候触发，既可以是鼠标行为，也可以是按tab键离开的
            $this.bind('blur', function(e) {
                $atfriend_cnt.css({
                    display : 'none'
                });
                return false;
            });

            //按键按下处理事件
            $this.bind('keydown', {
                cnt : $atfriend_cnt,
                target : $this
            }, processShiftKey);

            //按键弹起处理事件
            $this.bind('keyup', {
                cnt : $atfriend_cnt,
                target : this
            }, processKey);

        });
        //将光标移动到末尾
        function moveEnt(obj) {
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
            var $atfriend_cnt = e.data.cnt;
            var $links = $atfriend_cnt.find("a");
            var $this = e.data.target;
            //防止光标乱跑
            if(/27|38|40/.test(e.which)) {
                return false;
            }

            if(/13/.test(e.which) && $atfriend_cnt.is(':visible')) {
                //enter
                var val = $this.val();
                var text = $links.eq(index).text();

                var cur_index = Obj._getFocus($this.get(0));
                var str = val.substring(0, cur_index);
                var lastIndex = str.lastIndexOf('@');
                var v1 = val.substring(0, lastIndex + 1);
                var v2 = val.substring(lastIndex, cur_index);
                var v3 = val.substring(cur_index);
                v2 = text + " ";
                val = v1 + v2 + v3;
                $(this).val(val);

                $atfriend_cnt.hide();
                return false;
            }

            //当按下组合键shift+2==>@时
            if(e.shiftKey && e.which === 50) {
                //pos为textarea中光标的位置
                var pos = Obj.getInputPositon(this);
                var $atfriend_cnt = e.data.cnt;

                $atfriend_cnt.css({
                    position : "absolute",
                    display : 'block',
                    left : pos.left,
                    top : !$.browser.opera ? pos.bottom + settings.margin_bottom : pos.bottom + 26
                });
            }
        }

        //处理一般键
        function processKey(e) {
            //console.log(e.which);
            /*插件容器*/
            var $atfriend_cnt = e.data.cnt;
            var $links = $atfriend_cnt.find("a");
            /*target是this对象的引用*/
            var target = e.data.target;
            //删除键时执行的动作
            if(/^8$/.test(e.which)) {
                backspace();
            }
            //按下向左或者向右时执行的动作
            if(/^39$|^37$/.test(e.which)) {
                var val = $(target).val();
                /*textarea中包含@的字符时执行相应的动作*/
                if(/@/.test(val)) {
                    var pos = Obj.getInputPositon(target);
                    var cur_index = Obj._getFocus(target);
                    //console.log(pos.left);
                    //console.log(cur_index);
                    var str = val.substring(0, cur_index);
                    //如果光标之前不包含非空格字符,则进行操作
                    if(/\s/.test(str) === false) {
                        var lastIndex = str.lastIndexOf('@');
                        var q_val = str.substring(lastIndex + 1, cur_index);
                        if(q_val === '') {
                            console.log("加载预处理数据");
                        } else {
                            console.log("左右选择处理的数据:" + q_val);
                        }
                    }
                }
            }

            if(/^27$|^38$|^40$|^13$/.test(e.which) && $atfriend_cnt.is(':visible')) {
                if(e.preventDefault)
                    e.preventDefault();
                if(e.stopPropagation)
                    e.stopPropagation();

                e.cancelBubble = true;
                e.returnValue = false;

                switch(e.which) {
                    case 13:
                        //eneter
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

            if(/\s/.test(String.fromCharCode(e.which))) {
                $atfriend_cnt.css({
                    display : 'none'
                });
            }

            queryString();

            function queryString() {
                /*但输入字母,数字等有效字符时,则进行提示*/
                /*textarea中光标的位置*/
                var cursor_index = Obj._getFocus(target);
                /*textarea中的文本值*/
                var value = $(target).val().substring(0, cursor_index);
                /*最后一个@的索引*/
                var last_index;
                /*如果文本值中包含@符号,且输入的键值在控制范围内,就进行查询工作*/
                if(/@/.test(value) && /\w/.test(String.fromCharCode(e.which))) {
                    /*获得光标与 @之间的字符,找到离光标最近的 @*/
                    last_index = value.lastIndexOf('@');
                    //控制字符串,用于过滤掉xx xx这种形式,该字符串为@ 与 光标之间的值。
                    var q_str = value.substring(last_index + 1, cursor_index);
                    //console.log("q_str:" + q_str);
                    if(!(/\s/.test(q_str))) {
                        //用于提交的字符串
                        var q_val = q_str.split(' ')[0];
                        //查询字符串不为空
                        if(q_str != '') {
                            //q_str为提交查询的关键字
                            console.log("提交给服务器的关键字:" + q_val);
                        }
                    }
                }
            }

            //单击删除键时执行的操作
            function backspace() {
                /*textarea中光标前的字符*/
                var cursor_index = Obj._getFocus(target);
                /*textarea中的文本值*/
                var value = $(target).val().substring(0, cursor_index);
                /*最后一个@的索引*/
                var last_index;
                /*如果文本值中包含@符号,且输入的键值在控制范围内,就进行查询工作*/
                if(/@/.test(value)) {
                    /*获得光标与 @之间的字符,找到离光标最近的 @*/
                    last_index = value.lastIndexOf('@');
                    //控制字符串,用于过滤掉xx xx这种形式,该字符串为@ 与 光标之间的值。
                    var q_str = value.substring(last_index + 1, cursor_index);
                    //console.log("q_str:" + q_str);

                    if(!(/\s/.test(q_str))) {
                        //用于提交的字符串
                        var q_val = q_str.split(' ')[0];
                        //查询字符串不为空
                        if(q_str != '') {
                            //q_str为提交查询的关键字
                            console.log("执行删除后提交给服务器的关键字:" + q_val);
                        }
                    }
                    //如果光标与@之前没有字符串,则进行定位
                    if(q_str == '') {
                        /*textarea中光标的位置*/
                        var pos = Obj.getInputPositon(target);
                        $atfriend_cnt.css({
                            position : "absolute",
                            display : 'block',
                            left : pos.left - settings.margin_left,
                            top : !$.browser.opera ? pos.bottom + settings.margin_bottom : pos.bottom + 26
                        });
                    }
                } else {
                    $atfriend_cnt.css({
                        display : 'none'
                    });
                }
            }

        }

    };

    //插件的默认参数
    $.fn.atfriend.defaultSettings = {
        margin_bottom : 8,
        margin_left : 12,
        url : ""
    }

})(jQuery);
