 /* 代码整理：懒人之家 www.lanrenzhijia.com  转载请注明出处 */
old_x = 0;
old_y = 0;
dir = [];
keys = new Array();
keys['up'] = 5;
keys['down'] = 1;
keys['right'] = 7;
keys['left'] = 3;
keys['enter,space'] = 0;
keys['a'] = 10;
keys['s'] = 3;
keys['d'] = 4;
keys['f'] = 5;
keys['g'] = 6;
keys['h'] = 7;
keys['j'] = 8;
keys['k'] = 9;
keys['l'] = 2;
keys[';'] = 2;
img_base = 'http://s3.amazonaws.com/lateralmedia1/';
$(document).ready(function() {
    resetDirs = function() {
        dir = ['c', 's', 'sv', 'v', 'nv', 'n', 'ne', 'e', 'se', 's', 'c1', 'cc'];
    }
    resetDirs();
    $("#wait").hide();
    // $('img.eye').each(function() {
    //     for (direction in dir)
    //     { (new Image()).src = img_base + $(this).attr('rel') + '_' + dir[direction] + '.jpg';
    //     }
    // });
    $("#cont").show();
    for (key in keys)
    {
        eval("$(window).jkey('" + key + "', function(){changeAll(" + keys[key] + ");})");
    }
    $('#allfun').click(function() {
        changeAll(10)
    });
    $('#down').click(function() {
        changeAll(1)
    });
    $('#rup').click(function() {
        forFun();
    });
    reverseActions = function() {
        changeAll(1);
        dir = ['c', 'n', 'ne', 'e', 'se', 's', 'sv', 'v', 'nv', 'n', 'c1', 'cc'];
        $("#reverse").hide();
        $('#straighten,#rev').show();
        return false;
    }
    straightenActions = function() {
        resetDirs();
        $('#rev,#straighten').hide();
        $('#reverse').show();
        changeAll(0);
        return false;
    }
    $('#reverse').click(reverseActions);
    $('#straighten').click(straightenActions);
    changeOne = function(element, direction)
    {
		element.attr('class', 'eye eye_' + dir[direction]);
        // element.attr('src', img_base + element.attr('rel') + '_' + dir[direction] + '.jpg');
    }
    changeAll = function(direction)
    {
        $('.eye').each(function() {
            changeOne($(this), direction);
        });
    }
    $('.eye').mouseover(function() {
        changeOne($(this), 11);
    });
    setupMouse = function() {
        $(document).mousemove(function(e) {
            m_x = e.pageX;
            m_y = e.pageY;
            r_x = m_x - old_x;
            r_y = m_y - old_y;
            dist = Math.sqrt(r_x * r_x + r_y * r_y);
            if (dist > 15)
            {
                old_x = m_x;
                old_y = m_y;
                $('.eye').each(function() {
                    redraw($(this), m_x, m_y);
                });
            }
        });
    };
    redraw = function(element, mx, my) {
        pos = element.offset();
        half_width = element.width() / 2;
        half_height = element.height() / 2;
        i_x = pos.left + (half_width);
        i_y = pos.top + (half_height)
        rel_x = mx - i_x;
        rel_y = my - i_y;
        dist = Math.sqrt(rel_x * rel_x + rel_y * rel_y);
        if (dist > half_width || dist > half_height)
        {
            angle = Math.acos( - rel_y / dist) * 57.3248;
            sign = (rel_x > 0) ? 1: -1;
            angle = angle * sign;
            p = Math.round(angle / 45) + 5;
            changeOne(element, p);
        }
        else
        {
            changeOne(element, 11);
        }
    }
    setupMouse();
    $('.eye').click(function() {
        changeAll(1);
        changeOne($(this), 10);
    });
})
 /* 代码整理：懒人之家 www.lanrenzhijia.com  转载请注明出处 */