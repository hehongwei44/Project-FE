//@link https://gist.github.com/hehongwei44/62d64830afa07ddac65f
define(function(){
    var generateRandomAlphaNum = function (len) {
        var rdmString = "";
        //toSting接受的参数表示进制，默认为10进制。36进制为0-9 a-z
        for (; rdmString.length < len; rdmString += Math.random().toString(36).substr(2));
        return rdmString.substr(0, len);
    };

    return generateRandomAlphaNum;
});