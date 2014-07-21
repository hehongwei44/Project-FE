/**
 * @author HeHongWei
 */
;(function($) {
    /*拓展jquery的属性*/
    $.fn.extend({
        select : function() {
            /*插件的核心操作*/
            return $(this).each(function() {
                var width = this.style.width;
                $(this).after("<input type='hidden' /><div class='jslct'><div class='jslct_t'><em></em></div><dl></dl></div>");
                /*ipt指向隐藏域*/
                var ipt = $(this).next("input");
                /*插件的应用*/
                var lst = ipt.next("div");
                /*自定义列表的应用*/
                var itms = $("dl", lst);
                var itm;
                /*select下的option元素*/
                var opt = $("option", $(this));
                /*select下的被选中的option元素*/
                var opts = $("option:selected", $(this));
                /*被选中元素的索引*/
                var opts_index = opt.index(opts);
                /*em用来包装被选中的元素*/
                var em = $("em", lst);
                /**/
                 var fn_change = $(this).attr("onchange");
                 /*div的高度和select的宽度相同*/
                if(width != "") {
                    lst.css("width", $(this).css("width"));
                    em.css("width", "100%");
                };
                /*设置隐藏域的name属性*/
                ipt.attr("name", $(this).attr("name"));
                /*将select中被选中的元素赋值给em元素*/
                em.text($("option:selected", $(this)).text());
                /*把select中的数据添加到自定义列表中*/
                opt.each(function(i) {
                    itms.append("<dd></dd>");
                    itm = $("dd", itms);
                    var dd = itm.eq(i);
                    dd.attr("val", $(this).val()).text($(this).text());
                });
                /*添加样式*/
                itm.eq(0).addClass("noborder");
                itm.eq(opts_index).addClass("jslcted");
                /*移出select元素*/
                $(this).remove();

                /*插件鼠标划过事件*/
                lst.hover(function() {
                    $(this).addClass("jslct_hover");
                    return false;
                }, function() {
                    $(this).removeClass("jslct_hover");
                    return false;
                });
                /*自定义列表元素滑动的事件*/
                itm.hover(function() {
                    $(this).addClass("hover")
                }, function() {
                    $(this).removeClass("hover")
                });

                itms.css({
                    "width" : lst.width(),
                    "overflow-x" : "hidden",
                    "overflow-y" : "auto"
                });
                /*点击div层时,显示列表*/
                lst.click(function() {
                    lstshow();
                });
                /*文档的mouseup事件*/
                $(document).mouseup(function() {
                    lsthide();
                });
                /*自定义列表单击时的行为*/
                itm.click(function() {
                    if(fn_change != null) {
                        (eval(fn_change))();
                    }
                    itm.removeClass("jslcted");
                    $(this).addClass("jslcted");
                    em.text($(this).text());
                    ipt.val($(this).attr("val"));
                    lsthide();
                    return false;
                });
                /*显示列表*/
                function lstshow() {
                    var maxheight = $(document).height() - 200;
                    itms.css({
                        height : "auto"
                    });
                    maxheight = itms.height() > maxheight ? maxheight : "auto";
                    itms.css({
                        height : maxheight + 4
                    });
                    itms.show();
                    lst.css("z-index", "1000")
                };
                /*隐藏列表*/
                function lsthide() {
                    $(".jslct dl").hide();
                    $(".jslct").css("z-index", "0")
                };
            });
        }
    });
})(jQuery);
