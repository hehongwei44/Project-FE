/*定义表单验证模块*/
define(['extendString'], function () {
    "use strict";

    var valiDateForm = function () {
        //默认构造函数
    };

    //@link: https://gist.github.com/hehongwei44/3659b0c244aa0b56d265
    valiDateForm.prototype.isIP = function (str) {
        var pattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        return pattern.test(str);
    };

    //@link: https://gist.github.com/hehongwei44/ce075343fc539c1e4c75
    valiDateForm.prototype.isURL = function (str) {
        var strRegex = "^((https|http|ftp|rtsp|mms)?://)"
            + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?"
            + "(([0-9]{1,3}.){3}[0-9]{1,3}"
            + "|"
            + "([0-9a-z_!~*'()-]+.)*"
            + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]." //
            + "[a-z]{2,6})"
            + "(:[0-9]{1,4})?"
            + "((/?)|"
            + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
        var re = new RegExp(strRegex);
        return re.test(str);
    };

    //@link: https://gist.github.com/hehongwei44/4db037bfc161a3e0f776
    valiDateForm.prototype.isPostcode = function (str) {
        var pattern = /^[0-8]\d{5}$/;
        return pattern.test(str);

    };

    //@link: https://gist.github.com/hehongwei44/64ceba194958e6ebedfb
    valiDateForm.prototype.isQQ = function (str) {
        var pattern = /^[1-9][0-9]{4,}$/;
        return pattern.test(str);
    };

    //@link: https://gist.github.com/hehongwei44/a62123e422316062301c
    valiDateForm.prototype.isFixedPhone = function (str) {
        var pattern = /^\d{3,4}-\d{7,8}(-\d{3,4})?$/;
        return pattern.test(str);
    };

    //@link: https://gist.github.com/hehongwei44/2bbfbb5d6dccea3b2285
    valiDateForm.prototype.isCellphone = function (str) {
        var pattern = /^(13[0-9]|14[57]|15[012356789]|17[0678]|18[0-9])\d{8}$/;
        return pattern.test(str);
    };

    //@link https://gist.github.com/hehongwei44/fd59dc215ad7d7e4fb41
    valiDateForm.prototype.isEmail = function (str) {
        var pattern = /^([a-zA-Z0-9]+[-_.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[-_.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,6}$/;
        return pattern.test(str);
    };

    //@link https://gist.github.com/hehongwei44/005bf7f6836b3064c893
    valiDateForm.prototype.isAvaiableLength = function (minL, maxL, str) {
        return !!(str.length >= minL && str.length <= maxL);
    };

    //@link https://gist.github.com/hehongwei44/808accd01e3c44f87f17
    valiDateForm.prototype.isIDCard = function (str) {
        var num = str.toUpperCase();

        var cityCode = {11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外 "};

        if(!cityCode[num.substr(0,2)]){
            return false;
        }
        if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) {
            return false;
        }

        var len = num.length, re, arrSplit, dtmBirth, bGoodDay,arrInt,arrCh,nTemp, k,valnum;

        if (len == 15) {
            re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
            arrSplit = num.match(re);
            dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
            bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));

            if (!bGoodDay) {
                return false;
            }else {
                arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
                arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
                nTemp = 0;
                num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6);
                for (k = 0; k < 17; k++) {
                    nTemp += num.substr(k, 1) * arrInt[k];
                }
                valnum = arrCh[nTemp % 11];
                if (valnum != num.substr(17, 1)) {
                    return false;
                }
                return true;
            }
        }else if (len == 18) {
            re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
            arrSplit = num.match(re);
            dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
            bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));

            if (!bGoodDay) {
                return false;
            }else {
                arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
                arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
                nTemp = 0;
                for (k = 0; k < 17; k++) {
                    nTemp += num.substr(k, 1) * arrInt[k];
                }
                valnum = arrCh[nTemp % 11];
                if (valnum != num.substr(17, 1)) {
                    return false;
                }
                return true;
            }
        }
        return false;
    };

    //@link https://gist.github.com/hehongwei44/1be8311320eb6f707394
    valiDateForm.prototype.isEmpty = function (str) {
        return !!(str == null || typeof str == "undefined" || str.trim() == "");
    };

    //@link https://gist.github.com/hehongwei44/abeec850e6ff5134da9d
    valiDateForm.prototype.isChinese = function (str) {
        var pattern = /^[\u0391-\uFFE5]+$/g;
        return pattern.test(str);
    };

    //@link https://gist.github.com/hehongwei44/fca3f169ad547fc4ba5d
    valiDateForm.prototype.isNumber = function (str) {
        return !isNaN(str);
    };

    return new valiDateForm();
});