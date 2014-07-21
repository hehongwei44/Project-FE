/**
 * @author HeHongWei
 * @date 2012-7-28
 */
;(function($) {
    $.fn.extend({
        jselect : function() {
            return $(this).each(function() {
                var width = this.style.width;
                $(this).after("<input type=\"hidden\" /><div class='jslct'><div class='jslct_t'><em></em></div><dl></dl></div>");
                var ipt = $(this).next("input");
                var lst = ipt.next("div");
                var itms = $("dl", lst);
                var itm;
                var opt = $("option", $(this));
                var opts = $("option:selected", $(this));
                var opts_index = opt.index(opts);
                var em = $("em", lst);
                var fn_change = $(this).attr("onchange");
                if(width != "") {
                    lst.css("width", $(this).css("width"));
                    em.css("width", "100%");
                };
                ipt.attr("name", $(this).attr("name"));
                em.text($("option:selected", $(this)).text());
                opt.each(function(i) {
                    itms.append("<dd></dd>");
                    itm = $("dd", itms);
                    var dd = itm.eq(i);
                    dd.attr("val", $(this).val()).text($(this).text());
                });
                itm.eq(0).addClass("noborder")
                itm.eq(opts_index).addClass("jslcted");
                $(this).remove();
                lst.hover(function() {
                    $(this).addClass("jslct_hover");
                    return false
                }, function() {
                    $(this).removeClass("jslct_hover");
                    return false
                });
                itm.hover(function() {
                    $(this).addClass("hover")
                }, function() {
                    $(this).removeClass("hover")
                });
                itm.width(itms.width() + 17);
                itms.css({
                    width : itms.width(),
                    "overflow-x" : "hidden",
                    "overflow-y" : "auto"
                });
                lst.click(function() {
                    lstshow();
                });
                $(document).mouseup(function() {
                    lsthide();
                });
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
                })
                function lstshow() {
                    var maxheight = $(document).height() - 200;
                    itms.css({
                        height : "auto"
                    });
                    maxheight = itms.height() > maxheight ? maxheight : "auto";
                    itms.css({
                        height : maxheight
                    });
                    itms.show();
                    lst.css("z-index", "1000")
                };
                function lsthide() {
                    $(".jslct dl").hide();
                    $(".jslct").css("z-index", "0")
                };
            });
        }
    });
})(jQuery);
