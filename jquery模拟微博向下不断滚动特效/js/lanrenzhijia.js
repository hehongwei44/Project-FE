// 代码整理：懒人之家 lanrenzhijia.com
$(function () {
    $('ul.spy').simpleSpy();
});

(function ($) {
    
$.fn.simpleSpy = function (limit, interval) {
    limit = limit || 4;
    interval = interval || 4000;
    
    return this.each(function () {
        // 1. setup
            // capture a cache of all the list items
            // chomp the list down to limit li elements
        var $list = $(this),
            items = [], // uninitialised
            currentItem = limit,
            total = 0, // initialise later on
            height = $list.find('> li:first').height();
            
        // capture the cache
        $list.find('> li').each(function () {
            items.push('<li>' + $(this).html() + '</li>');
        });
        
        total = items.length;
        
        $list.wrap('<div class="spyWrapper" />').parent().css({ height : height * limit });
        
        $list.find('> li').filter(':gt(' + (limit - 1) + ')').remove();

        // 2. effect        
        function spy() {
            // insert a new item with opacity and height of zero
            var $insert = $(items[currentItem]).css({
                height : 0,
                opacity : 0,
                display : 'none'
            }).prependTo($list);
                        
            // fade the LAST item out
            $list.find('> li:last').animate({ opacity : 0}, 1000, function () {
                // increase the height of the NEW first item
                $insert.animate({ height : height }, 1000).animate({ opacity : 1 }, 1000);
                
                // AND at the same time - decrease the height of the LAST item
                // $(this).animate({ height : 0 }, 1000, function () {
                    // finally fade the first item in (and we can remove the last)
                    $(this).remove();
                // });
            });
            
            currentItem++;
            if (currentItem >= total) {
                currentItem = 0;
            }
            
            setTimeout(spy, interval)
        }
        
        spy();
    });
};
    
})(jQuery);
// 代码整理：懒人之家 lanrenzhijia.com