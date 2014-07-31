$(function () {
	$('h1 a').css('background-position', 'bottom left');
	$('h1 a').hover(function () {
		$(this).find('strong').fadeOut('fast');
	}, function () {
		$(this).find('strong').fadeIn('fast');
	});
});