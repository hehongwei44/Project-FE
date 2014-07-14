//@link https://gist.github.com/hehongwei44/d0e8388540883f43f142
define(function(){
    var toArray = function (arg){
        try {
            //转换arguments
            return Array.prototype.slice.call(arg);
        }catch(e){
            //转换元素节点元素
            var arr = [];
            for(var i = 0; i < arg.length; i++){
                arr[i] = arg[i];
            }
            return arr;
        }
    };

    return toArray;
});