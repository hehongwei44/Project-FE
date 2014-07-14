//@link: https://gist.github.com/hehongwei44/5ab040cf3a8b27311d72
define(function () {
    var imgReady = (function () {
        var list = [], intervalId = null,

            tick = function () {
                var i = 0;
                for (; i < list.length; i++) {
                    list[i].end ? list.splice(i--, 1) : list[i]();
                }
                !list.length && stop();
            },

            stop = function () {
                clearInterval(intervalId);
                intervalId = null;
            };
        return function (url, ready, load, error) {
            var onready, width, height, newWidth, newHeight,
                img = new Image();

            img.src = url;

            if (img.complete) {
                ready.call(img);
                load && load.call(img);
                return;
            }

            width = img.width;
            height = img.height;

            img.onerror = function () {
                error && error.call(img);
                onready.end = true;
                img = img.onload = img.onerror = null;
            };

            onready = function () {
                newWidth = img.width;
                newHeight = img.height;
                if (newWidth !== width || newHeight !== height ||
                    newWidth * newHeight > 1024
                    ) {
                    ready.call(img);
                    onready.end = true;
                }
            };
            onready();

            img.onload = function () {

                !onready.end && onready();

                load && load.call(img);

                img = img.onload = img.onerror = null;
            };

            if (!onready.end) {
                list.push(onready);
                if (intervalId === null) intervalId = setInterval(tick, 40);
            }
        };
    })();

    return imgReady;
});