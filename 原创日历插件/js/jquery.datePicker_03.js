;(function($) {
    var today = new Date();
    var months = '01,02,03,04,05,06,07,08,09,10,11,12'.split(',');
    var monthlengths = '31,28,31,30,31,30,31,31,30,31,30,31'.split(',');
    var dateRegEx = /^\d{1,2}\/\d{1,2}\/\d{2}|\d{4}$/;
    var yearRegEx = /^\d{4,4}$/;

    $.fn.datePicker = function(options) {

        var opts = $.extend({}, $.fn.datePicker.defaults, options);
        setupYearRange();
        /**
         *  @param setupYearRange:初始化年的选择范围
         *
         **/
        function setupYearRange() {
            var startyear, endyear;

            if(opts.startdate.constructor == Date) {
                startyear = opts.startdate.getFullYear();
            } else if(opts.startdate) {
                if(yearRegEx.test(opts.startdate)) {
                    startyear = opts.startdate;
                } else if(dateRegEx.test(opts.startdate)) {
                    opts.startdate = new Date(opts.startdate);
                    startyear = opts.startdate.getFullYear();
                } else {
                    startyear = today.getFullYear();
                }
            } else {
                startyear = today.getFullYear();
            }
            opts.startyear = startyear;

            if(opts.enddate.constructor == Date) {
                endyear = opts.enddate.getFullYear();
            } else if(opts.enddate) {
                if(yearRegEx.test(opts.enddate)) {
                    endyear = opts.enddate;
                } else if(dateRegEx.test(opts.enddate)) {
                    opts.enddate = new Date(opts.enddate);
                    endyear = opts.enddate.getFullYear();
                } else {
                    endyear = today.getFullYear();
                }
            } else {
                endyear = today.getFullYear();
            }
            opts.endyear = endyear;
        }

        /**
         * @param newDatepickerHtml:创建创建的dom
         *
         **/
        function newDatepickerHTML() {
            var years = [];
            for(var i = 0; i <= opts.endyear - opts.startyear; i++) {
                years[i] = opts.startyear + i;
            }

            var table = $('<table  class="datepicker" cellpadding="0" cellspacing="0"></table>');
            /*表格的标题*/
            table.append('<thead></thead>');
            /*表格的主体*/
            table.append('<tbody></tbody>');
            /*表格的脚注*/
            table.append('<tfoot></tfoot>');
            /*构造月份的下拉列表*/
            var monthselect = '<select name="month">';
            /*ps:for in语句也可以用来迭代数组*/
            for(var i in months) {
                monthselect += '<option value="' + i + '">' + months[i] + '</option>';
            }
            monthselect += '</select>';
            /*同上,构造年份的下拉列表*/
            var yearselect = '<select name="year">';
            for(var i in years) {
                yearselect += '<option>' + years[i] + '</option>';
            }
            yearselect += '</select>';
            /*动态添加dom*/
            $("thead", table).append('<tr class="controls"><th colspan="7"><span class="prevMonth"></span>' + yearselect + "年" + monthselect + '月<span class="nextMonth"></span><span class="today"></span></th></tr>');
            $("thead", table).append('<tr class="days"><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr>');
            $("tfoot", table).append('<tr></tr>');
            /*表的主体结构为5行7列*/
            for(var i = 0; i < 6; i++) {
                $("tbody", table).append('<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>');
            }
            return table;
        }

        /**
         * @decription findPosition:插件的定位,可能要重写该函数
         * @param obj:调用插件的元素
         * 返回值为obj的位置
         *
         * */
        function findPosition(obj) {
            var $obj = $(obj);
            var curleft = curtop = 0;
            if(obj) {
                curleft = $obj.offset().left;
                curtop = $obj.offset().top;
                return [curleft, curtop];
            } else {
                return false;
            }
        }

        /**
         *  loadMonth:加载月份的数据到表格中
         *  @param e:事件event
         *  @param el:调用插件的引用
         *  @param datepicker:插件的引用
         *  @param chosendate:被选中的日期
         *
         * */
        function loadMonth(e, el, datepicker, chosendate) {
            //mo表示选中月的索引
            var mo = $("select[name=month]", datepicker).get(0).selectedIndex;
            //yr表示选中年的索引
            var yr = $("select[name=year]", datepicker).get(0).selectedIndex;
            //年份类表的长度
            var yrs = $("select[name=year] option", datepicker).length;
            /*单击向前或向后时年份与月份的变化*/
            if(e && $(e.target).hasClass('prevMonth')) {
                if(0 == mo && yr) {
                    yr -= 1;
                    mo = 11;
                    $("select[name=month]", datepicker).get(0).selectedIndex = 11;
                    $("select[name=year]", datepicker).get(0).selectedIndex = yr;
                } else {
                    mo -= 1;
                    $("select[name=month]", datepicker).get(0).selectedIndex = mo;
                }
            } else if(e && $(e.target).hasClass('nextMonth')) {
                if(11 == mo && yr + 1 < yrs) {
                    yr += 1;
                    mo = 0;
                    $("select[name=month]", datepicker).get(0).selectedIndex = 0;
                    $("select[name=year]", datepicker).get(0).selectedIndex = yr;
                } else {
                    mo += 1;
                    $("select[name=month]", datepicker).get(0).selectedIndex = mo;
                }
            }
            //到达最开始的时间时,隐藏向前的箭号
            if(0 == mo && !yr) {
                $("span.prevMonth", datepicker).hide();
            } else {
                $("span.prevMonth", datepicker).show();
            }
            //但到达结束的时间时,隐藏向后的箭号
            if(yr + 1 == yrs && 11 == mo) {
                $("span.nextMonth", datepicker).hide();
            } else {
                $("span.nextMonth", datepicker).show();
            }

            var cells = $("tbody td", datepicker).unbind().empty().removeClass('date');

            var m = $("select[name=month]", datepicker).val();
            var y = $("select[name=year]", datepicker).val();
            /*根据指定年月的第一天日期*/
            var d = new Date(y, m, 1);
            /*判断该日期属于星期几*/
            var startindex = d.getDay();

            var numdays = monthlengths[m];
            /*如果是闰年,则天数为29天*/
            if(1 == m && ((y % 4 == 0 && y % 100 != 0) || y % 400 == 0)) {
                numdays = 29;
            }

            if(opts.startdate.constructor == Date) {
                var startMonth = opts.startdate.getMonth();
                var startDate = opts.startdate.getDate();
            }
            if(opts.enddate.constructor == Date) {
                var endMonth = opts.enddate.getMonth();
                var endDate = opts.enddate.getDate();
            }
            /*把月份的天数添加到表单的td中去*/
            for(var i = 0; i < numdays; i++) {
                var cell = $(cells.get(i + startindex)).removeClass();

                if((yr || ((!startDate && !startMonth) || ((i + 1 >= startDate && mo == startMonth) || mo > startMonth))) && (yr + 1 < yrs || ((!endDate && !endMonth) || ((i + 1 <= endDate && mo == endMonth) || mo < endMonth)))) {
                    cell.text(i + 1).addClass('date').hover(function() {
                        $(this).addClass('over');
                    }, function() {
                        $(this).removeClass('over');
                    }).click(function() {
                        //var chosenDateObj = new Date($("select[name=year]", datepicker).val(), $("select[name=month]", datepicker).val(), $(this).text());
                        //closeIt(el, datepicker, chosenDateObj);
                        //调用回调函数
                        opts.callback();
                    });

                    //为指定的日期添加特殊的样式
                    var index = (i + 1);
                    var arr = opts.dateArr;
                    for( n = 0; n < arr.length; n++) {
                        try {
                            var spec_date = new Date(arr[n]);
                            var year = spec_date.getFullYear();
                            var month = spec_date.getMonth();
                            var date = spec_date.getDate();
                            var day = spec_date.getDay();
                            if(m == month && y == year && index == date) {
                                if(day == 0 || day == 6) {
                                    //cell.prepend("<sup class='rest'>休</sup>");
                                    cell.addClass("sign").prepend("<sup class='rest'>休</sup>");
                                    //cell.prepend("<span class='sign'></span>");
                                    //console.log("匹配的日期:" + date);
                                } else {
                                    //cell.prepend("<sup class='sign'>签</sup>");
                                    cell.addClass("sign");
                                    //cell.prepend("<span class='sign'></span>");
                                    //console.log("匹配的日期:" + date);
                                }
                            } else {
                                //console.log(date);
                            }
                        } catch(e) {
                            alert("提供的日期有错,错误信息" + e);
                        }
                    }

                    if(index == chosendate.getDate() && m == chosendate.getMonth() && y == chosendate.getFullYear()) {
                        cell.empty().text(index).prepend("<sup class='chosen'>今</sup>");
                    }

                }
            }
        }

        /**
         * closeIt函数的作用是移出掉插件.建议通过偏移插件来达到效果
         * @param el:调用插件的目标元素
         * @param datepicker:插件的引用
         * @param dateObj:获得的日期
         *
         ***/
        function closeIt(el, datepicker, dateObj) {
            if(dateObj && dateObj.constructor == Date) {
                el.val($.fn.datePicker.formatOutput(dateObj));
            }
            datepicker.remove();
            datepicker = null;
            //在元素上存放数据
            $.data(el.get(0), "datePicker", {
                hasDatepicker : false
            });
        }

        return this.each(function() {

            if($(this).is('input') && 'text' == $(this).attr('type')) {
                var datepicker;
                var _this = $(this);
                $.data(_this.get(0), "datePicker", {
                    hasDatepicker : false
                });

                _this.bind("click focus", function(ev) {
                    var $this = $(ev.target);

                    var elPos = findPosition($this.get(0));
                    var x = (parseInt(opts.x) ? parseInt(opts.x) : 0) + elPos[0];
                    var y = (parseInt(opts.y) ? parseInt(opts.y) : 0) + elPos[1] + $this.outerHeight();

                    if(false == $.data($this.get(0), "datePicker").hasDatepicker) {

                        $.data($this.get(0), "datePicker", {
                            hasDatepicker : true
                        });

                        var initialDate = $this.val();
                        /*用来判断选中日期*/
                        if(initialDate && dateRegEx.test(initialDate)) {
                            var chosendate = new Date(initialDate);
                        } else if(opts.chosendate.constructor == Date) {
                            var chosendate = opts.chosendate;
                        } else if(opts.chosendate) {
                            var chosendate = new Date(opts.chosendate);
                        } else {
                            var chosendate = today;
                        }

                        datepicker = newDatepickerHTML();
                        //为插件绑定事件
                        datepicker.hover(function() {
                            $this.unbind("click blur");
                            datepicker.css("display", "block");
                        }, function() {
                            datepicker.css("display", "none");
                        });
                        /*代码尚未优化*/
                        $this.after(datepicker);
                        //元素定位
                        $(datepicker).css({
                            position : 'absolute',
                            left : x,
                            top : y
                        });
                        //设置鼠标的形状
                        $("span", datepicker).css("cursor", "pointer");
                        //事件绑定
                        $("select", datepicker).bind('change', function() {
                            loadMonth(null, $this, datepicker, chosendate);
                        });
                        $("span.prevMonth", datepicker).click(function(e) {
                            loadMonth(e, $this, datepicker, chosendate);
                        });
                        $("span.nextMonth", datepicker).click(function(e) {
                            loadMonth(e, $this, datepicker, chosendate);
                        });
                        $("span.today", datepicker).click(function(e) {
                            alert("执行默认的回调函数");
                        });
                        $("select[name=month]", datepicker).get(0).selectedIndex = chosendate.getMonth();
                        $("select[name=year]", datepicker).get(0).selectedIndex = Math.max(0, chosendate.getFullYear() - opts.startyear);
                        loadMonth(null, $this, datepicker, chosendate);

                    } else {
                        datepicker.css("display", "block");
                    }
                }).blur(function($) {
                    datepicker.css("display", "none");
                });
            }

        });

    };
    //按照给定的格式,返回日期
    $.fn.datePicker.formatOutput = function(dateObj) {
        return dateObj.getFullYear() + "/" + (dateObj.getMonth() + 1) + "/" + dateObj.getDate();
    };
    //默认参数
    $.fn.datePicker.defaults = {
        chosendate : today,
        startdate : today.getFullYear() - 3,
        enddate : today.getFullYear() + 1,
        x : 0,
        y : 0,
        callback : function() {
            alert("你调用了默认的回调函数");
        },
        dateArr : ["2012/9/25", "2012/10/25", "2012/10/27", "2012/10/28", "2012/10/31", "2012/11/1"]
    };
})(jQuery);
