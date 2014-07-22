;(function($) {
    $.fn.mailAutoComplete = function(options) {
        //默认插件参数
        var defaults = {
            boxClass : "mailListBox",
            focusClass : "mailListFocus",
            zIndex : 999,
            autoClass : false, //是否启用插件默认的样式
            focusColor : "#666", //文本框(目标对象)获得焦点时文字的颜色
            blurColor : "#000", //文本框(目标对象)失去焦点时文字的颜色
            mailArr : ["ewininfo.com", "qq.com", "gmail.com", "126.com", "163.com", "hotmail.com", "yahoo.com", "yahoo.com.cn", "live.com", "sohu.com", "sina.com"]
        };
        var settings = $.extend({}, defaults, options || {});

        //当autoClass设置为false时,通过style引入插件默认样式
        if(settings.autoClass && $("#mailListAppendCss").size() === 0) {
            $('<style id="mailListAppendCss" type="text/css">.mailListBox{border:1px solid #369; background:#fff; font:12px/20px Arial;}.mailListDefault{padding:0 5px;cursor:pointer;white-space:nowrap;}.mailListFocus{padding:0 5px;cursor:pointer;white-space:nowrap;background:#369;color:white;}.mailListHlignt{color:red;}.mailListFocus .mailListHlignt{color:#fff;}</style>').appendTo($("head"));
        }
        var cb = settings.boxClass, cl = settings.listClass, cf = settings.focusClass, cm = settings.markCalss, z = settings.zIndex, newArr = mailArr = settings.mailArr, fc = settings.focusColor, bc = settings.blurColor;
        $.createHtml = function(str, value, arr, cur) {
            var mailHtml = "";
            if($.isArray(arr)) {
                $.each(arr, function(i, n) {
                    mailHtml += '<dd class="' + (i == cur ? cf : '') + '"><a href="javascript:void(0);">' + str + '@' + n + '</a></dd>';
                });
            }
            return mailHtml;
        };

        $(this).each(function() {
            var index = -1, s;
            var isMove = false;
            var that = $(this), i = $(".mail_list").size(), w = that.outerWidth(), h = that.outerHeight(), left = that.offset().left, top = that.offset().top;
            var $plugin_cotainer = $('<div style="display:inline-block;"></div>');
            $plugin_cotainer.append('<dl id="mailListBox_' + i + '" class="mail_list ' + cb + '" style="list-style-type:none; padding:0px;margin:0px; min-width:' + (w - 4) + 'px;_width:' + (w - 4) + 'px;position:absolute;left:-6000px;z-index:' + z + ';"></dl>');
            $("body").append($plugin_cotainer);
            var $mail_list = $("#mailListBox_" + i);

            that.bind("keyup", function(e) {
                s = v = $.trim(that.val());
                if(/@/.test(v)) {
                    s = v.replace(/@.*/, "");
                }
                if(v.length > 0) {
                    if(e.keyCode === 38) {
                        if(index <= 0) {
                            index = newArr.length;
                        }
                        index--;
                        isMove = true;
                    } else if(e.keyCode === 40) {
                        if(index >= newArr.length - 1) {
                            index = -1;
                        }
                        index++;
                        isMove = true;
                    } else if(e.keyCode === 13) {
                        if(index > -1 && index < newArr.length) {
                            that.val($("." + cf, $mail_list).text());
                        }
                        $mail_list.css("left", "-6000px");
                        isMove = true;
                    } else {
                        if(/@/.test(v)) {
                            index = -1;
                            var site = v.replace(/.*@/, "");
                            newArr = $.map(mailArr, function(n) {
                                var reg = new RegExp(site);
                                if(reg.test(n)) {
                                    return n;
                                }
                            });
                        } else {
                            newArr = mailArr;
                        }
                        isMove = false;

                    }
                    //没有提供的类型时,隐藏该插件
                    if(newArr.length != 0) {
                        if(!isMove) {
                            $mail_list.html($.createHtml(s, v, newArr, index)).prepend('<dt>请选择邮箱类型</dt>').css({
                                "top" : top + h,
                                "left" : left
                            });
                        } else {

                            $("." + cf, $mail_list).removeClass(cf);
                            $mail_list.find("dd").eq(index).addClass(cf);
                        }
                        
                        $mail_list.find("a").bind('mousedown', function() {
                            that.val($(this).text());
                        });

                    } else {
                        $mail_list.css("left", "-6000px");
                    }

                    if(e.keyCode === 13) {
                        if(index > -1 && index < newArr.length) {
                            $mail_list.css("left", "-6000px");
                        }
                    }
                } else {
                    $mail_list.css("left", "-6000px");
                }
            });
            var hide = function() {
                $mail_list.css({
                    "left" : "-6000px",
                    "z-index" : 0
                });
            }
            that.bind("blur", hide);
        });
    };
})(jQuery);
