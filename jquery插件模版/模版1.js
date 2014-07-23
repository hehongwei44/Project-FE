
(function($) {

    //插件的名称
    $.pluginName = function(element, options) {

        // 插件的默认参数
        var defaults = {

            foo: 'bar',
            onFoo: function() {}

        }

        // 插件对象的引用
        var plugin = this;

        //插件实际使用的参数设置
        plugin.settings = {}

        var $element = $(element), // 目标对象的jquery引用
             element = element;    // 目标对象的dom引用

        // 插件的初始化方法
        plugin.init = function() {

            // 参数的合并
            plugin.settings = $.extend({}, defaults, options);

        }

        // 公共方法的写法
        plugin.foo_public_method = function() {

            // 执行的代码

        }

        // 私有方法的写法
        var foo_private_method = function() {

            // 执行的代码

        }

        // 调用插件的初始化方法,完成调用
        plugin.init();

    }

    // 原型调用
    $.fn.pluginName = function(options) {

        // this-->目标对象的引用
        return this.each(function() {
			//如果插件未引用
            if (undefined == $(this).data('pluginName')) {
				//调用插件
                var plugin = new $.pluginName(this, options);
				//记录插件已经调用
                $(this).data('pluginName', plugin);

            }

        });

    }

})(jQuery);