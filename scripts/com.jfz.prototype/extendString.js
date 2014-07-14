define(function () {
    "use strict";
    String.prototype.trim = function (dir) {
        switch (dir) {
            case 0 : //去左边的空格
                return this.replace(/(^\s*)/g, '');
                break;
            case 1 : //去右边的空格
                return this.replace(/(\s*$)/g, '');
                break;
            case 2 : //去掉所有的空格
                return this.replace(/(\s*)/g, '');
                break;
            default : //去掉两边的空格
                return this.replace(/(^\s*)|(\s*$)/g, '');
        }
    };
});