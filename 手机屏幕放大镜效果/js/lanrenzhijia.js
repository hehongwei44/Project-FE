// 代码整理：懒人之家  www.lanrenzhijia.com
$(document).ready(function(){

	/* This code is executed on the document ready event */

	var left	= 0,
		top		= 0,
		sizes	= { retina: { width:190, height:190 }, webpage:{ width:500, height:283 } },
		webpage	= $('#webpage'),
		offset	= { left: webpage.offset().left, top: webpage.offset().top },
		retina	= $('#retina');

	if(navigator.userAgent.indexOf('Chrome')!=-1)
	{
		/*	Applying a special chrome curosor,
			as it fails to render completely blank curosrs. */
			
		retina.addClass('chrome');
	}
	
	webpage.mousemove(function(e){

		left = (e.pageX-offset.left);
		top = (e.pageY-offset.top);

		if(retina.is(':not(:animated):hidden')){
			/* Fixes a bug where the retina div is not shown */
			webpage.trigger('mouseenter');
		}

		if(left<0 || top<0 || left > sizes.webpage.width || top > sizes.webpage.height)
		{
			/*	If we are out of the bondaries of the
				webpage screenshot, hide the retina div */

			if(!retina.is(':animated')){
				webpage.trigger('mouseleave');
			}
			return false;
		}

		/*	Moving the retina div with the mouse
			(and scrolling the background) */

		retina.css({
			left				: left - sizes.retina.width/2,
			top					: top - sizes.retina.height/2,
			backgroundPosition	: '-'+(1.6*left)+'px -'+(1.35*top)+'px'
		});
		
	}).mouseleave(function(){
		retina.stop(true,true).fadeOut('fast');
	}).mouseenter(function(){
		retina.stop(true,true).fadeIn('fast');
	});
});