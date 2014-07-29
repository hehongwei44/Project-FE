;(function($) {

    $.fn.jfz_animation_slider = function(options) {

        var defaults = {  
            animation: 'fade', 					// 渐变特效,取值如下:fade, horizontal-slide, vertical-slide, horizontal-push
            animationSpeed: 600, 				// 渐变速度
            timer: true, 						// 是否设置定时器
            advanceSpeed: 4000, 				// 定时器激活时,转动一周所需的时间
            pauseOnHover: false, 				// 如果鼠标悬浮在图片上,则是否停止slider
            startClockOnMouseOut: false, 		// 鼠标移开时,是否重启定时器,恢复slider
            startClockOnMouseOutAfter: 1000, 	// 鼠标移开时,重启定时器,恢复slider的时间
            directionalNav: true, 				// 是否要箭头导航
            captions: false, 					// 是否包含标题??
            captionAnimation: 'fade', 			// 标题出现的效果,取值如下:fade, slideOpen, none
            captionAnimationSpeed: 600, 		// 标题出现的效果的时间
            bullets: false,						// 是否激活列表
            bulletThumbs: false,				// 是否激活列表缩略图
            bulletThumbLocation: '',			// 缩略图的位置
            afterSlideChange: function(){} 		// 回调函数
     	};  
        
        var options = $.extend(defaults, options); 
		var ie6 =!-[1,]&&!window.XMLHttpRequest;
		//IE hack
		if(ie6) {
			options.animation = 'fade';
		}
		
        return this.each(function() {
            var activeSlide = 0,//当前激活的元素
            	numberSlides = 0,//滚动元素的数量
            	orbitWidth,//插件的宽度
            	orbitHeight,//插件的高度
            	locked;
            
            //初始化插件
            var orbit = $(this).addClass('orbit'),         
            	orbitWrapper = orbit.wrap('<div class="orbit-wrapper" />').parent();
            orbit.add(orbitWidth).width('1px').height('1px');
	    	            
            //自适应大小,取子元素中最大的值为slide的w和h
            var slides = orbit.children('img, a, div');
            
            slides.each(function() {
                var _slide = $(this),
                	_slideWidth = _slide.width(),
                	_slideHeight = _slide.height();
                	
                if(_slideWidth > orbit.width()) {
	                orbit.add(orbitWrapper).width(_slideWidth);
	                orbitWidth = orbit.width();	       			
	            }
	            if(_slideHeight > orbit.height()) {
	                orbit.add(orbitWrapper).height(_slideHeight);
	                orbitHeight = orbit.height();
				}
                numberSlides++;
            });
            
            
            function unlock() {
                locked = false;
            }
            function lock() { 
                locked = true;
            }
            //只有一个元素的情况下
            if(slides.length == 1) {
            	options.directionalNav = false;
            	options.timer = false;
            	options.bullets = false;
            }
            //激活第一个元素
            slides.eq(activeSlide)
            	.css({"z-index" : 3})
            	.fadeIn(function() {
            		slides.css({"display":"block"})
            	});
            
			/*TIMER相关*/
            function startClock() {
            	if(!options.timer  || options.timer == 'false') { 
            		return false;
            	
            	} else if(timer.is(':hidden')) {
		            clock = setInterval(function(e){
						shift("next");  
		            }, options.advanceSpeed);            		
		        
            	} else {
		            timerRunning = true;
		            pause.removeClass('active')
		            clock = setInterval(function(e){
		                var degreeCSS = "rotate("+degrees+"deg)"
		                degrees += 2
		                rotator.css({ 
		                    "-webkit-transform": degreeCSS,
		                    "-moz-transform": degreeCSS,
		                    "-o-transform": degreeCSS
		                });
		                if(degrees > 180) {
		                    rotator.addClass('move');
		                    mask.addClass('move');
		                }
		                if(degrees > 360) {
		                    rotator.removeClass('move');
		                    mask.removeClass('move');
		                    degrees = 0;
		                    shift("next");
		                }
		            }, options.advanceSpeed/180);
				}
	        }
	        
	        function stopClock() {
	        	if(!options.timer || options.timer == 'false') { return false; } else {
		            timerRunning = false;
		            clearInterval(clock);
		            pause.addClass('active');
				}
	        }  
            
            if(options.timer) {         	
                var timerHTML = '<div class="timer"><span class="mask"><span class="rotator"></span></span><span class="pause"></span></div>'
                orbitWrapper.append(timerHTML);
                var timer = orbitWrapper.children('div.timer'),
                	timerRunning;
                if(timer.length != 0) {
                    var rotator = $('div.timer span.rotator'),
                    	mask = $('div.timer span.mask'),
                    	pause = $('div.timer span.pause'),
                    	degrees = 0,
                    	clock; 
                    startClock();
                    timer.click(function() {
                        if(!timerRunning) {
                            startClock();
                        } else { 
                            stopClock();
                        }
                    });
                    if(options.startClockOnMouseOut){
                        var outTimer;
                        orbitWrapper.mouseleave(function() {
                            outTimer = setTimeout(function() {
                                if(!timerRunning){
                                    startClock();
                                }
                            }, options.startClockOnMouseOutAfter)
                        })
                        orbitWrapper.mouseenter(function() {
                            clearTimeout(outTimer);
                        })
                    }
                }
            }  
	        
	        if(options.pauseOnHover) {
		        orbitWrapper.mouseenter(function() {
		        	stopClock(); 
		        });
		   	}
            

            /*CAPTIONS相关*/         
            if(options.captions) {
                var captionHTML = '<div class="orbit-caption"></div>';
                orbitWrapper.append(captionHTML);
                var caption = orbitWrapper.children('.orbit-caption');
            	setCaption();
            }
			
            function setCaption() {
            	if(!options.captions || options.captions =="false") {
            		return false; 
            	} else {
	            	var _captionLocation = slides.eq(activeSlide).data('caption'); 
	            		_captionHTML = $(_captionLocation).html();             		
	            	
	            	if(_captionHTML) {
	            		caption
		            		.attr('id',_captionLocation) 
		                	.html(_captionHTML); 
		                
		             	if(options.captionAnimation == 'none') {
		             		caption.show();
		             	}
		             	if(options.captionAnimation == 'fade') {
		             		caption.fadeIn(options.captionAnimationSpeed);
		             	}
		             	if(options.captionAnimation == 'slideOpen') {
		             		caption.slideDown(options.captionAnimationSpeed);
		             	}
	            	} else {
	            		
	            		if(options.captionAnimation == 'none') {
		             		caption.hide();
		             	}
		             	if(options.captionAnimation == 'fade') {
		             		caption.fadeOut(options.captionAnimationSpeed);
		             	}
		             	if(options.captionAnimation == 'slideOpen') {
		             		caption.slideUp(options.captionAnimationSpeed);
		             	}
	            	}
				}
            }
            
			/*DIRECTIONAL NAV 相关*/
            if(options.directionalNav) {
            	if(options.directionalNav == "false") { return false; }
                var directionalNavHTML = '<div class="slider-nav"><span class="right">Right</span><span class="left">Left</span></div>';
                orbitWrapper.append(directionalNavHTML);
                var leftBtn = orbitWrapper.children('div.slider-nav').children('span.left'),
                	rightBtn = orbitWrapper.children('div.slider-nav').children('span.right');
                leftBtn.click(function() { 
                    stopClock();
                    shift("prev");
                });
                rightBtn.click(function() {
                    stopClock();
                    shift("next");
                });
            }
            
            /*BULLET NAV 相关*/
            if(options.bullets) { 
            	var bulletHTML = '<ul class="orbit-bullets"></ul>';            	
            	orbitWrapper.append(bulletHTML);
            	var bullets = orbitWrapper.children('ul.orbit-bullets');
            	for(i=0; i<numberSlides; i++) {
            		var liMarkup = $('<li>'+(i+1)+'</li>');
            		if(options.bulletThumbs) {
            			var	thumbName = slides.eq(i).data('thumb');
            			if(thumbName) {
            				var liMarkup = $('<li class="has-thumb">'+i+'</li>')
            				liMarkup.css({"background" : "url("+options.bulletThumbLocation+thumbName+") no-repeat"});
            			}
            		} 
            		orbitWrapper.children('ul.orbit-bullets').append(liMarkup);
            		liMarkup.data('index',i);
            		liMarkup.click(function() {
            			stopClock();
            			shift($(this).data('index'));
            		});
            	}
            	setActiveBullet();
            }
            
            
        	function setActiveBullet() { 
        		if(!options.bullets) { return false; } else {
	        		bullets.children('li').removeClass('active').eq(activeSlide).addClass('active');
	        	}
        	}
        	
            /*核心*/
           	
            function shift(direction) {
            	
                var prevActiveSlide = activeSlide,
                	slideDirection = direction;
                if(prevActiveSlide == slideDirection) { return false; }
               
                function resetAndUnlock() {
                    slides.eq(prevActiveSlide).css({"z-index" : 1});
                    unlock();
                    options.afterSlideChange.call(this);
                }
                
                if(slides.length == "1") { return false; }
                
                if(!locked) {
                    lock();
					
                    if(direction == "next") {
                        activeSlide++
                        if(activeSlide == numberSlides) {
                            activeSlide = 0;
                        }
                    } else if(direction == "prev") {
                        activeSlide--
                        if(activeSlide < 0) {
                            activeSlide = numberSlides-1;
                        }
                    } else {
                        activeSlide = direction;
                        if (prevActiveSlide < activeSlide) { 
                            slideDirection = "next";
                        } else if (prevActiveSlide > activeSlide) { 
                            slideDirection = "prev"
                        }
                    }
                   
                     setActiveBullet();  
                     
                    slides.eq(prevActiveSlide).css({"z-index" : 2});    
                    
                   
                    if(options.animation == "fade") {
                    	//IE6 默认只提供fade方式,减少计算带来的压力
                    	if(ie6){
                    		slides.eq(activeSlide).css({"opacity" : 0, "z-index" : 3}).show().siblings().hide();
                    		resetAndUnlock();
                    	}else{
                        	slides.eq(activeSlide).css({"opacity" : 0, "z-index" : 3}).animate({"opacity" : 1}, options.animationSpeed, resetAndUnlock);
                    	}
                    }
                    
                    if(options.animation == "horizontal-slide") {
                        if(slideDirection == "next") {
                            slides
                            	.eq(activeSlide)
                            	.css({"left": orbitWidth, "z-index" : 3})
                            	.animate({"left" : 0}, options.animationSpeed, resetAndUnlock);
                        }
                        if(slideDirection == "prev") {
                            slides
                            	.eq(activeSlide)
                            	.css({"left": -orbitWidth, "z-index" : 3})
                            	.animate({"left" : 0}, options.animationSpeed, resetAndUnlock);
                        }
                    }
                   
                    if(options.animation == "vertical-slide") { 
                        if(slideDirection == "prev") {
                            slides
                            	.eq(activeSlide)
                            	.css({"top": orbitHeight, "z-index" : 3})
                            	.animate({"top" : 0}, options.animationSpeed, resetAndUnlock);
                        }
                        if(slideDirection == "next") {
                            slides
                            	.eq(activeSlide)
                            	.css({"top": -orbitHeight, "z-index" : 3})
                            	.animate({"top" : 0}, options.animationSpeed, resetAndUnlock);
                        }
                    }
                   
                    if(options.animation == "horizontal-push") {
                        if(slideDirection == "next") {
                            slides
                            	.eq(activeSlide)
                            	.css({"left": orbitWidth, "z-index" : 3})
                            	.animate({"left" : 0}, options.animationSpeed, resetAndUnlock);
                            slides
                            	.eq(prevActiveSlide)
                            	.animate({"left" : -orbitWidth}, options.animationSpeed);
                        }
                        if(slideDirection == "prev") {
                            slides
                            	.eq(activeSlide)
                            	.css({"left": -orbitWidth, "z-index" : 3})
                            	.animate({"left" : 0}, options.animationSpeed, resetAndUnlock);
							slides
                            	.eq(prevActiveSlide)
                            	.animate({"left" : orbitWidth}, options.animationSpeed);
                        }
                    }
                    setCaption();
                } 
            }
        });
    }
})(jQuery);
