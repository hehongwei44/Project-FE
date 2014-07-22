;(function($) {
    $.fn.passStrength = function(options) {

        var defaults = {
            weakpass : "weakpass",
            goodpass : "goodpass",
            strongpass : "strongpass"
        };
        var opts = $.extend(defaults, options);

        return this.each(function() {
            var $this = $(this), $password_strength = $("<div class='password_strength'><span></span></div>"), $span = $password_strength.find("span");
            $this.after($password_strength);

            $this.unbind().keyup(function() {
                var resultStyle = $.fn.teststrength($(this).val(), opts);
                $span.removeClass().addClass(resultStyle);
            });

            $.fn.teststrength = function(password, option) {
                if(password.length < 6) {
                    return;
                }
                var score = 0;

                score += password.length * 4;
                score += ($.fn.checkRepetition(1, password).length - password.length ) * 1;
                score += ($.fn.checkRepetition(2, password).length - password.length ) * 1;
                score += ($.fn.checkRepetition(3, password).length - password.length ) * 1;
                score += ($.fn.checkRepetition(4, password).length - password.length ) * 1;

                if(password.match(/(.*[0-9].*[0-9].*[0-9])/)) {
                    score += 5;
                }

                if(password.match(/(.*[!,@,#,$,%,^,&,*,?,_,~].*[!,@,#,$,%,^,&,*,?,_,~])/)) {
                    score += 5;
                }

                if(password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
                    score += 10;
                }

                if(password.match(/([a-zA-Z])/) && password.match(/([0-9])/)) {
                    score += 15;
                }

                if(password.match(/([!,@,#,$,%,^,&,*,?,_,~])/) && password.match(/([0-9])/)) {
                    score += 15;
                }

                if(password.match(/([!,@,#,$,%,^,&,*,?,_,~])/) && password.match(/([a-zA-Z])/)) {
                    score += 15;
                }

                if(password.match(/^\w+$/) || password.match(/^\d+$/)) {
                    score -= 10;
                }

                if(score < 0) {
                    score = 0;
                }
                if(score > 100) {
                    score = 100;
                }
                if(score < 34) {
                    return option.weakpass;
                } else if(score < 68) {
                    return option.goodpass;
                } else {
                    return option.strongpass;
                }

            };
            $.fn.checkRepetition = function(pLen, str) {
                var res = "";
                for(var i = 0; i < str.length; i++) {
                    var repeated = true;

                    for(var j = 0; j < pLen && (j + i + pLen) < str.length; j++) {
                        repeated = repeated && (str.charAt(j + i) == str.charAt(j + i + pLen));
                    }
                    if(j < pLen) {
                        repeated = false;
                    }
                    if(repeated) {
                        i += pLen - 1;
                        repeated = false;
                    } else {
                        res += str.charAt(i);
                    }
                }
                return res;
            };

        });

    };
})(jQuery);
