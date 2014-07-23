//面向对象的写法
;(function($) {

    // 插件的名称
    $.pluginName = function(el, options) {

        //插件的默认参数
        var defaults = {

            propertyName: 'value',

            onSomeEvent: function() {}

        }

        // 插件对象的引用
        var plugin = this;

        // 插件实用的参数
        plugin.settings = {}

        //插件的初始化
        var init = function() {

            // 参数合并
            plugin.settings = $.extend({}, defaults, options);

            // el-->目标对象的引用
            plugin.el = el;

            // 要执行的方法

        }

        // 公共的方法
        plugin.foo_public_method = function() {

            // 执行的代码

        }

        // 私有方法
        var foo_private_method = function() {

              // 执行的代码

        }

        // 插件初始化调用
        init();

    }

})(jQuery);