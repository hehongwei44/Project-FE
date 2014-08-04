/*!
 * jquery.photoShoot.js - Photo Shoot jQuery Plugin
 *
 * Copyright (c) 2009 Martin Angelov
 * http://tutorialzine.com/
 *
 * Licensed under MIT
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Launch  : January 2010
 * Version : 1.0
 * Released: Monday 29th January, 2010 - 00:00
 */

(function($){

	$.fn.photoShoot = function(options){
		
		return this.each(function(){
		
			var settings = $.extend({
				viewFinder	:	{ width:300, height:200, img:'images/viewfinder.png' },
				image		:	'',
				blurLevel	:	4,
				opacity		:	0.92,
				onClick		:	function(){}
			},options);
			
			var scriptPath = '';
			
			$('script').each(function(){
			
				var src = $(this).attr('src');
				if(!src) return true;
				
				if(src.match(/jquery\.photoShoot/i))
				{
					scriptPath = src.replace(/[^\/]+$/,'');
					return false;
				}
			})
			
			if(!settings.viewFinder.img)
			{
				settings.viewFinder.img = scriptPath + 'viewfinder.png';
			}
			
			var main = $(this);
			
			main.css('background','url('+settings.image+') no-repeat').addClass('container');
			
			settings.stage = { width:main.width(), height:main.height() };
		
			for(var i=0;i<10;i++)
			{
				$('<div class="blur">').css({
						opacity		:	0.15,
						left		:	Math.round(-settings.blurLevel+(settings.blurLevel*2)*Math.random()),
						top			:	Math.round(-settings.blurLevel+(settings.blurLevel*2)*Math.random()),
						background	:	'url('+settings.image+') no-repeat',
						width		:	settings.stage.width+'px',
						height		:	settings.stage.height+'px'
				}).appendTo(main);
			}
			
			var overlay = $('<div class="overlay">').css({opacity:1-settings.opacity}).appendTo(main);
	
			if(navigator.userAgent.indexOf('Chrome')!=-1)
			{
				main.addClass('googleChrome');
			}
			else if(navigator.userAgent.indexOf('MSIE')!=-1)
			{
				main.css('cursor','url('+scriptPath+'/blank.cur), default');
			}
			
			var vf = $('<div class="viewFinder">').css({
						background	:	'url('+settings.image+') no-repeat',
						width		:	settings.viewFinder.width+'px',
						height		:	settings.viewFinder.height+'px'
			}).html('<img src="'+settings.viewFinder.img+'" width="'+settings.viewFinder.width+'" height="'+settings.viewFinder.height+'" />').appendTo(main);
			
			var offSet = main.offset();
		
			var n_left, n_top;
			
			main.mousemove(function(e){
		
				n_left = (e.pageX-offSet.left)-settings.viewFinder.width/2;
				n_top = (e.pageY-offSet.top)-settings.viewFinder.height/2;
		
				if(n_left<0 || n_top<0) return false;
				if(n_left+settings.viewFinder.width >=settings.stage.width || n_top+settings.viewFinder.height >= settings.stage.height) return false;
		
				vf.css({
					left				: n_left,
					top					: n_top,
					backgroundPosition	: '-'+n_left+'px -'+n_top+'px'
				});
				
			}).click(function(){
				
					settings.onClick({
						left	:	parseInt(vf.css('left')),
						top		:	parseInt(vf.css('top')),
						width	:	settings.viewFinder.width,
						height	:	settings.viewFinder.height
					});
			});
			
		})
	
	}
	
})(jQuery);

/* 代码整理：懒人之家 */