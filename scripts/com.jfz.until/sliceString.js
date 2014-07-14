//@link https://gist.github.com/hehongwei44/be3027aeb48ab978a039

define(function(){
    var cutstr = function(str, len) {
        var temp;
        icount = 0;
        patrn = /[^\x00-\xff]/g;    //中文字符匹配
        strre = "";

        for (var k = 0; k < str.length; k++) {
            if (icount < len ) {
                temp = str.substr(k, 1);
                if (temp.match(patrn) == null) {
                    icount = icount + 1;
                } else {
                    icount = icount + 2;
                }
                strre += temp;
            } else {
                break
            }
        }
        return strre + "...";
    };

    return cutstr;
});