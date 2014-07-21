(function($) {

    $.suggest = function(input, options) {
        //关闭input的自动完成功能
        var $input = $(input).attr("autocomplete", "off");
        //指向容器的引用
        var $results;
        //用于显示列表的定时器
        var timeout = false;
        // hold timeout ID for suggestion results to appear
        //用于记录输入框中的字符个数
        var prevLength = 0;
        //如果输入框为空或者是提示字符,这修改输入框内文字的样式
        if($.trim($input.val()) == '' || $.trim($input.val()) == '中文/拼音')
            $input.val('中文/拼音').css('color', '#aaa');
        //如果插件没有提供容器,则插件自动创建一个数据容器
        if(!options.attachObject)
            options.attachObject = $(document.createElement("div")).appendTo('body');
        //指向容器的引用
        $results = $(options.attachObject);
        //为容器添加样式
        $results.addClass(options.resultsClass);
        //为容器初始化定位
        resetPosition();
        //当页面加载完毕或者页面大小发生改变时,为容器定位
        // just in case user is changing size of page while loading
        $(window).load(resetPosition).resize(resetPosition);
        //blur事件会在元素失去焦点的时候触发，既可以是鼠标行为，也可以是按tab键离开的,当输入框失去焦点时,200毫秒隐藏容器.
        $input.blur(function() {
            setTimeout(function() {
                $results.hide();
            }, 200);
        });
        //输入框获得焦点时执行的事件
        $input.focus(function() {
            if($.trim($(this).val()) == '中文/拼音') {
                //重新设置输入后的字体
                $(this).val('').css('color', '#000');
                //显示热门城市列表,传递的参数为空
                displayItems('');
            }
            /*代码冗余
             if($.trim($(this).val()) == '') {
             //显示热门城市列表
             displayItems('');
             }
             */
        });
        //点击输入框时绑定的事件
        $input.click(function() {
            var q = $.trim($(this).val());
            displayItems(q);
            //选中控件中的文本
            $(this).select();
        });

        /*
         bgiframe 插件用来轻松解决 IE6 z-index 的问题，如果网页上有浮动区块和下拉选单重叠时，
         在IE6会看到下拉选框总是把浮动区块覆盖住，无论怎么调整 z-index 都是没用的，而用 bgiframe 就可以轻松解决这个问题。
         相关链接:http://blog.csdn.net/java20100406/article/details/6045191
         */
        try {
            $results.bgiframe();
        } catch(e) {
        }
        //处理输入框的keyup事件(),keyup事件会在按键释放时触发
        $input.keyup(processKey);
        //定位的辅助函数
        function resetPosition() {
            // requires jquery.dimension plugin
            var offset = $input.offset();
            $results.css({
                top : (offset.top + input.offsetHeight) + 'px',
                left : offset.left + 'px'
            });
        }

        //输入框keyup处理的事件
        function processKey(e) {
            // handling up/down/escape requires results to be visible
            // handling enter/tab requires that AND a result to be selected
            //第一种情况:容器可见时,处理27,38,40结尾的键值
            //第二种情况:列表的某项被选中时,处理13,9键值
            if((/27$|38$|40$/.test(e.keyCode) && $results.is(':visible')) || (/^13$|^9$/.test(e.keyCode) && getCurrentResult())) {
                //阻止默认行为
                if(e.preventDefault)
                    e.preventDefault();
                //阻止冒泡
                if(e.stopPropagation)
                    e.stopPropagation();

                e.cancelBubble = true;
                e.returnValue = false;

                switch(e.keyCode) {

                    case 38:
                        //up向上的按键
                        prevResult();
                        break;

                    case 40:
                        //down向下的按键
                        nextResult();
                        break;
                    case 13:
                        //enter按键
                        selectCurrentResult();
                        break;

                    case 27:
                        //esc按键
                        $results.hide();
                        break;
                }

            } else if($input.val().length != prevLength) {
                //这个分支用来处理非特殊键值
                if(timeout)
                    clearTimeout(timeout);
                timeout = setTimeout(suggest, options.delay);
                //获取当前输入框中字符的长度
                prevLength = $input.val().length;
            }

        }

        function suggest() {
            var q = $.trim($input.val());
            displayItems(q);
        }

        //插件的核心,items输入框的内容
        function displayItems(items) {
            var html = '';
            //如果输入框中的值为空的话,则显示热门城市的列表
            if(items == '') {
                for(h in options.hot_list) {
                    //options.hot_list[h][0]:三字码,h索引,options.hot_list[h][1]:中文,options.hot_list[h][2]:中文拼音
                    html += '<li rel="' + options.hot_list[h][0] + '"><a href="#' + h + '"><span>' + options.hot_list[h][2] + '</span>' + options.hot_list[h][1] + '</a></li>';
                }
                html = '<div class="gray ac_result_tip">请输入中文/拼音或者↑↓选择</div><ul>' + html + '</ul>';
            } else {
                //国内城市匹配
                for(var i = 0; i < options.source.length; i++) {
                    //匹配items开头的正则表达式,忽略大小写,换行匹配
                    var reg = new RegExp('^' + items + '.*$', 'im');
                    //用正则表达式去匹配数据中的三字码、中文、全屏、拼音缩写中的任何一个
                    if(reg.test(options.source[i][0]) || reg.test(options.source[i][1]) || reg.test(options.source[i][2]) || reg.test(options.source[i][3])) {
                        html += '<li rel="' + options.source[i][0] + '"><a href="#' + i + '"><span>' + options.source[i][2] + '</span>' + options.source[i][1] + '</a></li>';
                    }
                }
                //如果没有找到匹配的值,则提示该值,sugget_tip:顶部的提示容器
                if(html == '') {
                    suggest_tip = '<div class="gray ac_result_tip">对不起，找不到：' + items + '</div>';
                } else {
                    suggest_tip = '<div class="gray ac_result_tip">' + items + '，按拼音排序</div>';
                }
                html = suggest_tip + '<ul>' + html + '</ul>';
            }
            //显示列表
            $results.html(html).show();
            //为第一个li元素添加样式
            $results.children('ul').children('li:first-child').addClass(options.selectClass);
            //为li元素添加鼠标划过事件和单击事件
            $results.children('ul').children('li').mouseover(function() {
                //移出兄弟节点的样式
                $results.children('ul').children('li').removeClass(options.selectClass);
                //为得到事件的元素添加样式
                $(this).addClass(options.selectClass);
            }).click(function(e) {
                //阻止默认行为
                e.preventDefault();
                //阻止冒泡
                e.stopPropagation();
                //得到当前的值
                selectCurrentResult();
            });
        }

        /*得到当前选中的项目*/
        function getCurrentResult() {
            //若当前容器不可见,则不执行任何操作
            if(!$results.is(':visible'))
                return false;
            //得到选中项的目标元素
            var $currentResult = $results.children('ul').children('li.' + options.selectClass);
            //如果找不到目标元素,则值设为false.
            if(!$currentResult.length)
                $currentResult = false;
            //返回选中的目标元素
            return $currentResult;
        }

        /*把选中后的值传给输入框*/
        function selectCurrentResult() {
            //得到选中的选项
            $currentResult = getCurrentResult();
            //把li中超链接的值赋值给输入框
            if($currentResult) {
                $input.val($currentResult.children('a').html().replace(/<span>.+?<\/span>/i, ''));
                $results.hide();
                //如果存在options.dataContainer,则把三字码赋值该元素
                if($(options.dataContainer)) {
                    $(options.dataContainer).val($currentResult.attr('rel'));
                }
                //如果存在options.onSelect,则选中第一个输入框
                if(options.onSelect) {
                    //第一个输入框执行select事件
                    options.onSelect.apply($input[0]);
                }
            }

        }

        //选中下一个li元素
        function nextResult() {

            $currentResult = getCurrentResult();

            if($currentResult)
                $currentResult.removeClass(options.selectClass).next().addClass(options.selectClass);
            else
                $results.children('ul').children('li:first-child').addClass(options.selectClass);

        }

        //选中上一个li元素
        function prevResult() {

            $currentResult = getCurrentResult();

            if($currentResult)
                $currentResult.removeClass(options.selectClass).prev().addClass(options.selectClass);
            else
                $results.children('ul').children('li:last-child').addClass(options.selectClass);

        }

    }
    /*source传进来的是aircity这个数组,options用户的传进来的插件参数*/
    $.fn.suggest = function(source, options) {
        //如果不提供数据的话,这不执行
        if(!source)
            return;
        options = options || {};
        //source:所有的数据
        options.source = source;
        //hot_list:热门列表,用在默认的显示列表上
        options.hot_list = options.hot_list || [];
        //列表显示的延迟时间
        options.delay = options.delay || 0;
        //这个容器的样式:如本例中'<div id='suggest2' class="ac_results"></div>'
        options.resultsClass = options.resultsClass || 'ac_results';
        //列表中的项目被选中时的样式
        options.selectClass = options.selectClass || 'ac_over';
        //???
        options.onSelect = options.onSelect || false;
        //盛放数据结果的容器
        options.dataContainer = options.dataContainer || '#SuggestResult';
        //指定数据承载的容器
        options.attachObject = options.attachObject || null;
        //插件的批处理
        this.each(function() {
            //this:input输入框的引用,options插件的参数
            new $.suggest(this, options);
        });
        return this;
    };

})(jQuery);
