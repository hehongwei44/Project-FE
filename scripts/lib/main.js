require.config({
    baseUrl: 'lib',
    paths: {
        jquery: 'jquery',
        validateForm : '../com.jfz.until/validateForm',
        imgpreLoad   : '../com.jfz.until/imgpreLoad',
        getCountDown : '../com.jfz.until/getCountDown',
        sliceString  : '../com.jfz.until/sliceString',
        generateRandomAlphaNum : '../com.jfz.until/generateRandomAlphaNum',
        toArray : '../com.jfz.until/toArray',
        extendString : '../com.jfz.prototype/extendString'
    }
});
/*
require(['jquery'],function($){
    //测试是否能加载jQuery
    console.log($);
});*/
/*
require(['validateForm'],function(validateForm){
    //测试是否能加载validateForm插件
    document.writeln(validateForm.isIP('192.168.1.1'));
    document.writeln(validateForm.isURL('www.baidu.com'));
    document.writeln(validateForm.isPostcode('331700'));
    document.writeln(validateForm.isQQ('601782180'));
    document.writeln(validateForm.isFixedPhone('021-5332548-215'));
    document.writeln(validateForm.isCellphone('13510149615'));
    document.writeln(validateForm.isEmail('hehongwei44@126.com'));
    document.writeln(validateForm.isAvaiableLength(2,10,'hehongwei'));
    document.writeln(validateForm.isIDCard('110101196408250033'));
    document.writeln(validateForm.isChinese('中文测试'));
    document.writeln(validateForm.isNumber('12345698'));
    document.writeln(validateForm.isEmpty('       '));
});*/
/*
require(['imgpreLoad'],function(imgpreLoad){
    imgpreLoad('http://www.planeart.cn/demo/imgReady/vistas24.jpg', function () {
        console.log('图片预先加载: width=' + this.width + '; height=' + this.height);
    },function(){
        console.log('图片加载完毕: width=' + this.width + '; height=' + this.height);
    });
});*/
/*
require(['getCountDown'],function(getCountDown){
    var obj = getCountDown('2014-7-9');
    console.log(obj);
});*/
/*
require(['sliceString'],function(cutstr){
   var str = cutstr("hehongwei",4);
    console.log(str);
});*/
/*
require(['generateRandomAlphaNum'],function(generateRandomAlphaNum){
    var str = generateRandomAlphaNum(20);
    console.log(str);
});*/

require(['toArray'],function(toArray){
    console.log(toArray);
});
