//@link: https://gist.github.com/hehongwei44/a1205e9ff17cfc2359ca
define(function(){
    var getCountDown = function (deadline) {
        var activeDateObj = {},
            currentDate  = new Date().getTime(),            //获取当前的时间
            finalDate    = new Date(deadline).getTime(),    //获取截止日期
            intervaltime = finalDate - currentDate;         //有效期时间戳

        /*截止日期到期的话,则不执行下面的逻辑*/
        if(intervaltime < 0) {
            return;
        }

        var totalSecond = ~~(intervaltime / 1000),     //得到秒数
            toDay       = ~~(totalSecond / 86400 ),   //得到天数
            toHour      = ~~((totalSecond -  toDay * 86400) / 3600), //得到小时
            tominute    = ~~((totalSecond -  toDay * 86400 - toHour * 3600) / 60), //得到分数
            toSeconde   = ~~(totalSecond - toDay * 86400 - toHour * 3600 -tominute * 60);

        /*装配obj*/
        activeDateObj.day    = toDay;
        activeDateObj.hour   = toHour;
        activeDateObj.minute = tominute;
        activeDateObj.second = toSeconde;

        return activeDateObj;
    }

    return getCountDown;
});