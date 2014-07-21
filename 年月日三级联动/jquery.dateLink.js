;(function($) {
    $.extend({
        dateLink : function(settings) {
            var $year = $(settings.id_year), $month = $(settings.id_month), $day = $(settings.id_day), flooryear = settings.flooryear, ceilyear = settings.ceilyear;
            var now = new Date(), now_year = now.getFullYear(), now_month = now.getMonth() + 1, now_day = now.getDate();
            var start = now_year - flooryear, end = now_year + ceilyear;
            //加载年数据
            createOptions($year, start, end);
            //事件绑定
            $year.bind('change', function() {
                var $this = $(this);
                var $fir = $this.find("option").eq(0);
                if($fir.val() == "") {
                    $fir.remove();
                    //加载月的数据
                    createOptions($month, 1, 12);
                }

            });
            //事件绑定
            $month.bind('change', function() {
                var $this = $(this);
                var $fir = $this.find("option").eq(0);
                if($fir.val() == "") {
                    $fir.remove();
                }
                //加载日的数据
                var year = $year.val(), month = $month.val(), day = new Date(year, month, 0).getDate();
                $day_fir = $day.find("option").eq(0);
                $day.find("option").not($day_fir).remove();
                createOptions($day, 1, day);
            });

            $day.bind('change', function() {
                var $this = $(this);
                var $fir = $this.find("option").eq(0);
                if($fir.val() == "") {
                    $fir.remove();
                }
            });
            function createOptions(container, start, end) {
                var num = parseInt(end - start + 1, 10), str = "";
                for(var i = 0; i < num; i++) {
                    str += '<option value="' + (start + i) + '">' + (start + i) + '</option>';
                }
                container.append(str);
            }

        }
    });
})(jQuery);
