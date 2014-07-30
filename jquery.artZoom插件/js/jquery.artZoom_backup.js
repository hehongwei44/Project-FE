
;(function (document, $, log) {
$.fn.artZoom = function (config) {
    /*插件的默认配置参数*/
	config = $.extend({}, $.fn.artZoom.defaults, config);
	
	var tmpl, viewport,
		$this = this, /*this是image对象的引用*/
		loadImg = {},
		path = config.path,   /*图片的路径*/
		loading = path + '/loading.gif',  /*,绝对路径,完整的路径为：./images/loading.gif*/
		max = path + '/zoomin.cur',   /*同上*/
		min = path + '/zoomout.cur';  /*同上*/
	/*图片未加载之前,让他显示loading.gif*/
	new Image().src = loading;
	
	max = 'url(\'' + max + '\'), pointer'; /*设置鼠标形状的url地址*/
	min = 'url(\'' + min + '\'), pointer'; /*设置鼠标形状的url地址*/
	/*模板*/
	tmpl = [
		'<div class="ui-artZoom-toolbar" style="display:none">',
			'<div class="ui-artZoom-buttons" style="display:none">',
				'<a href="#" data-go="left" class="ui-artZoom-left"><span></span>',
					config.left,   
				'</a>',
				'<a href="#" data-go="right" class="ui-artZoom-right"><span></span>',
					config.right,
				'</a>',
				'<a href="#" data-go="source" class="ui-artZoom-source"><span></span>',
					config.source,
				'</a>',
				'<a href="#" data-go="hide" class="ui-artZoom-hide"><span></span>',
					config.hide,
				'</a>',
			'</div>',
			'<div class="ui-artZoom-loading">',
				'<img data-live="stop" src="',
					loading,
					'" style="',
					'display:inline-block;*zoom:1;*display:inline;vertical-align:middle;',
					'width:16px;height:16px;"',
				' />',
				' <span>Loading..</span>',
			'</div>',
		'</div>',
		'<div class="ui-artZoom-box" style="display:none">',
			'<div class="ui-artZoom-photo" data-go="hide"',
			' style="display:inline-block;*display:inline;*zoom:1;overflow:hidden;position:relative;cursor:',
				min,
			'">',
				'<img data-name="thumb" data-go="hide" data-live="stop" src="',
					loading,
				'" />',
			'</div>',
		'</div>'
	].join('');
	
	// jQuery事件代理,this为Img对象的引用.
	this.live('click', function (event) {
	    /*判断是否是IMG对象,不执行插件*/
		if (this.nodeName !== 'IMG' && this.getAttribute('data-live') === 'stop') return false;
        
		var $artZoom, buttonClick,
			that = this,
			$this = $(that),
			$parent = $this.parent(),
			src = that.src,
			show = $this.attr('data-artZoom-show') || src,   /*得到的是小图的路径*/
			source = $this.attr('data-artZoom-source') || show,  /*得到的大图的路径*/
			//获取图片的最大宽度,可能获得是参数设置的或者父级的宽度,如果是A链接包含了this,则取A元素父级的高度.
			maxWidth = config.maxWidth || ($parent[0].nodeName === 'A' ? $this.parent() : $this).parent().width(),
			//获取图片的最大高度,如果没有设置该参数,则取值99999
			maxHeight = config.maxHeight || 9999999;
		/*实际的图片大小*/
		maxWidth = maxWidth - config.borderWidth;
		
		// 对包含在链接内的图片进行特殊处理
		if ($parent[0].nodeName === 'A') {
			show = $parent.attr('data-artZoom-show') || $parent.attr('href');
			source = $parent.attr('data-artZoom-source') || $parent.attr('rel');
		};

		// 第一次点击
		if (!$this.data('artZoom')) {
			var wrap = document.createElement('div'),
				$thumb, $box, $show;
			
			$artZoom = $(wrap);
			wrap.className = 'ui-artZoom ui-artZoom-noLoad';
			/*把模板装进wrap中去*/
			wrap.innerHTML = tmpl;
			/*wrap元素存放的位置*/
			($parent[0].nodeName === 'A' ? $this.parent() : $this).before(wrap);
			/*在元素上存放数据*/
			$this.data('artZoom', $artZoom);
			$box = $artZoom.find('.ui-artZoom-box');
			/*放大后的图片元素*/
			$thumb = $artZoom.find('[data-name=thumb]');
			
			// 快速获取大图尺寸
			imgReady(show, function () {
			    /*回调函数this指向img本身,即被单击的图片*/
				var width = this.width,
					height = this.height,
					maxWidth2 = Math.min(maxWidth, width);
				height = maxWidth2 / width * height;    /*求等比的高度*/
				width = maxWidth2;
				
				// 插入大图并使用逐渐清晰加载的效果
				$thumb.attr('src', src).
					css(config.blur ? {
						width: width + 'px',
						height: height + 'px'
					} : {display: 'none'}).
					after([
					'<img class="ui-artZoom-show" title="',
						that.title,
						'" alt="',
						that.alt,
						'" src="',
						show,
						'" style="width:',
						width,
						'px;height:',
						height, // IE8 超长图片height属性失效BUG，改用CSS
						'px;position:absolute;left:0;top:0;background:transparent"',
					' />'
				].join(''));
				
				$show = $artZoom.find('.ui-artZoom-show');
				$thumb.attr('class', 'ui-artZoom-show');
				
				$artZoom.addClass('ui-artZoom-ready');
				$artZoom.find('.ui-artZoom-buttons').show();
				$this.data('artZoom-ready', true);
				$this.hide();
				$box.show();
				
			// 大图完全加载完毕,执行的函数
			}, function () {
				$thumb.removeAttr('class').hide();
				$show.css({
					position: 'static',
					left: 'auto',
					top: 'auto'
				});
				
				$artZoom.removeClass('ui-artZoom-noLoad');
				$artZoom.find('.ui-artZoom-loading').hide();
				$this.data('artZoom-load', true);
			
			// 图片加载错误
			}, function () {
				$artZoom.addClass('ui-artZoom-error');
				log('图片加载 "' + show + '" 错误!请刷新或者确认网络是否良好');
			});
			
		} else {
			$this.hide();
		};
		
		$artZoom = $this.data('artZoom');
		
		buttonClick = function (event) {
		    //this应用指向被单击的链接或者单击了图片
			var target = this,
			    /*按钮的识别符*/
				go = target.getAttribute('data-go'),
				/*判断元素是否被激活*/
				live = target.getAttribute('data-live'),
				/*图片旋转的角度*/
				degree = $this.data('artZoom-degree') || 0,
				/*放大的图片*/
				elem = $artZoom.find('.ui-artZoom-show')[0];
			/*图片在加载的时候,其live状态为stop*/	
			if (live === 'stop') return false;
			/*但单击图片时将收起*/
			if (/img|canvas$/i.test(target.nodeName)) go = 'hide';

			switch (go) {
			    /*向左旋转*/
				case 'left':
					degree -= 90;
					degree = degree === -90 ? 270 : degree;
					break;
				/*向右旋转*/
				case 'right':
					degree += 90;
					degree = degree === 360 ? 0 : degree;
					break;
				/*单击查看时,在新窗口中打开页面*/
				case 'source':
					window.open(source || show || src);
					break;
				/*单击收起图片时的效果*/
				case 'hide':
					$this.show();
					$artZoom.find('.ui-artZoom-toolbar').hide();
					$artZoom.hide();
					$artZoom.find('[data-go]').die('click', buttonClick);
					break;
			};
			
			if ((go === 'left' || go === 'right') && $this.data('artZoom-load')) {
			    /**
			     *  单击图片向左或者向右时,旋转图片
			     *  @elem:放大的图片
			     *  @degree:旋转的角度
			     *  @maxWidth :最大宽度度
			     *  @maxHEight:最大的高度
			     **/
				imgRotate(elem, degree, maxWidth, maxHeight);
				$this.data('artZoom-degree', degree);
			};
			
			return false;
		};
		$artZoom.show().find('.ui-artZoom-toolbar').slideDown(150);
		$artZoom.find('[data-go]').live('click', buttonClick);
			
		return false;
	});
	
	// 给目标缩略图应用外部指针样式
	this.live('mouseover', function () {
		if (this.className !== 'ui-artZoom-show') this.style.cursor = max;
	});
	
	// 预加载指针形状图标
	if (this[0]) this[0].style.cursor = max;
	
	return this;
};
$.fn.artZoom.defaults = {
	path: './images',  /*图片资源的路径*/
	left: '\u5de6\u65cb\u8f6c',    /*左旋转的unicode编码*/
	right: '\u53f3\u65cb\u8f6c',   /*右旋转的unicode编码*/
	source: '\u770b\u539f\u56fe',  /*看原图的unicode的编码*/
	hide: '\u6536\u8d77\u56fe\u7247',      /*收起图片的unicode的编码*/
	blur: true,        /*图片加载时,是否显示模糊效果*/
	preload: true,     /*设置是否提前缓存视野内的大图片*/
	maxWidth: null,    /*图片所能显示最大的宽度(包含boderWidth)*/
	maxHeight: null,   /*图片所能显示最大的高度*/
	borderWidth: 18    /*图片的宽度*/
};

/**
 * 图片旋转
 * @version	2011.05.27
 * @author	TangBin
 * @param	{HTMLElement}	图片元素
 * @param	{Number}		旋转角度 (可用值: 0, 90, 180, 270)
 * @param	{Number}		最大宽度限制
 * @param	{Number}		最大高度限制
 */
var imgRotate = $.imgRotate = function () {
	var eCanvas = '{$canvas}',
		isCanvas = !!document.createElement('canvas').getContext;
		
	return function (elem, degree, maxWidth, maxHeight) {
		var x, y, getContext,
			resize = 1,
			width = elem.naturalWidth,
			height = elem.naturalHeight,
			canvas = elem[eCanvas];
		
		// 初次运行
		if (!elem[eCanvas]) {
			
			// 获取图像未应用样式的真实大小 (IE和Opera早期版本)
			if (!('naturalWidth' in elem)) {
				var run = elem.runtimeStyle, w = run.width, h = run.height;
				run.width  = run.height = 'auto';
				elem.naturalWidth = width = elem.width;
				elem.naturalHeight = height = elem.height;
				run.width  = w;
				run.height = h;
			};
		
			elem[eCanvas] = canvas = document.createElement(isCanvas ? 'canvas' : 'span');
			elem.parentNode.insertBefore(canvas, elem.nextSibling);
			elem.style.display = 'none';
			canvas.className = elem.className;
			canvas.title = elem.title;
			if (!isCanvas) {
				canvas.img = document.createElement('img');
				canvas.img.src = elem.src;
				canvas.appendChild(canvas.img);
				canvas.style.cssText = 'display:inline-block;*zoom:1;*display:inline;' +
					// css reset
					'padding:0;margin:0;border:none 0;position:static;float:none;overflow:hidden;width:auto;height:auto';
			};
		};
		
		var size = function (isSwap) {
			if (isSwap) width = [height, height = width][0];
			if (width > maxWidth) {
				resize = maxWidth / width;
				height =  resize * height;
				width = maxWidth;
			};
			if (height > maxHeight) {
				resize = resize * maxHeight / height;
				width = maxHeight / height * width;
				height = maxHeight;
			};
			if (isCanvas) (isSwap ? height : width) / elem.naturalWidth;
		};
		
		switch (degree) {
			case 0:
				x = 0;
				y = 0;
				size();
				break;
			case 90:
				x = 0;
				y = -elem.naturalHeight;
				size(true);
				break;
			case 180:
				x = -elem.naturalWidth;
				y = -elem.naturalHeight
				size();
				break;
			case 270:
				x = -elem.naturalWidth;
				y = 0;
				size(true);
				break;
		};
		
		if (isCanvas) {
			canvas.setAttribute('width', width);
			canvas.setAttribute('height', height);
			getContext = canvas.getContext('2d');
			getContext.rotate(degree * Math.PI / 180);
			getContext.scale(resize, resize);
			getContext.drawImage(elem, x, y);	
		} else {
			canvas.style.width = width + 'px';
			canvas.style.height = height + 'px';// 解决IE8使用滤镜后高度不能自适应
			canvas.img.style.filter = 'progid:DXImageTransform.Microsoft.BasicImage(rotation=' + degree / 90 + ')';
			canvas.img.width = elem.width * resize;
			canvas.img.height = elem.height * resize;
		};
	};
}();

/**
 * 图片头数据加载就绪事件 - 更快获取图片尺寸
 * @version	2011.05.27
 * @author	TangBin
 * @see		http://www.planeart.cn/?p=1121
 * @param	{String}	图片路径
 * @param	{Function}	尺寸就绪
 * @param	{Function}	加载完毕 (可选)
 * @param	{Function}	加载错误 (可选)
 * @example imgReady('http://www.google.com.hk/intl/zh-CN/images/logo_cn.png', function () {
		alert('size ready: width=' + this.width + '; height=' + this.height);
	});
 */
var imgReady = (function () {
	var list = [], intervalId = null,

	// 用来执行队列
	tick = function () {
		var i = 0;
		for (; i < list.length; i++) {
			list[i].end ? list.splice(i--, 1) : list[i]();
		};
		!list.length && stop();
	},

	// 停止所有定时器队列
	stop = function () {
		clearInterval(intervalId);
		intervalId = null;
	};

	return function (url, ready, load, error) {
		var onready, width, height, newWidth, newHeight,
			img = new Image();
		
		img.src = url;

		// 如果图片被缓存，则直接返回缓存数据
		if (img.complete) {
			ready.call(img);
			load && load.call(img);
			return;
		};
		
		width = img.width;
		height = img.height;
		
		// 加载错误后的事件
		img.onerror = function () {
			error && error.call(img);
			onready.end = true;
			img = img.onload = img.onerror = null;
		};
		
		// 图片尺寸就绪
		onready = function () {
			newWidth = img.width;
			newHeight = img.height;
			if (newWidth !== width || newHeight !== height ||
				// 如果图片已经在其他地方加载可使用面积检测
				newWidth * newHeight > 1024
			) {
				ready.call(img);
				onready.end = true;
			};
		};
		onready();
		
		// 完全加载完毕的事件
		img.onload = function () {
			// onload在定时器时间差范围内可能比onready快
			// 这里进行检查并保证onready优先执行
			!onready.end && onready();
		
			load && load.call(img);
			
			// IE gif动画会循环执行onload，置空onload即可
			img = img.onload = img.onerror = null;
		};

		// 加入队列中定期执行
		if (!onready.end) {
			list.push(onready);
			// 无论何时只允许出现一个定时器，减少浏览器性能损耗
			if (intervalId === null) intervalId = setInterval(tick, 40);
		};
	};
})();

}(document, jQuery, function (msg) {window.console && console.log(msg)}));
