
;(function($){
	// 判断是否按下鼠标左键
	var isMouseDown    = false;
	// 用于跟踪当前的元素
	var currentElement = null;
	// 拖拽标识
	var dropCallbacks = {};
	var dragCallbacks = {};
	var bubblings = {};
	var dragStatus = {};
	// 位置记录
	var lastMouseX;
	var lastMouseY;
	var lastElemTop;
	var lastElemLeft;

	var holdingHandler = false;

	//返回鼠标当前的位置
	$.getMousePosition = function(e){
		var posx = 0;
		var posy = 0;

		if (!e) var e = window.event;

		if (e.pageX || e.pageY) {
			posx = e.pageX;
			posy = e.pageY;
		}
		else if (e.clientX || e.clientY) {
			posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			posy = e.clientY + document.body.scrollTop  + document.documentElement.scrollTop;
		}

		return { 'x': posx, 'y': posy };
	};

	// 更新元素当前的位置,即移动后的位置
	$.updatePosition = function(e) {
		
		var pos = $.getMousePosition(e);
		var spanX = (pos.x - lastMouseX);
		var spanY = (pos.y - lastMouseY);

		$(currentElement).css("top",  (lastElemTop + spanY));
		$(currentElement).css("left", (lastElemLeft + spanX));
	};

	// 捕捉mouseover事件,即当鼠标指针位于元素上方时，会发生 mouseover 事件.
	$(document).mousemove(function(e){
		
		if(isMouseDown && (dragStatus[currentElement.id] != 'false')){
			$.updatePosition(e);
			
			if(dragCallbacks[currentElement.id] != undefined){
				//drag==>ondrag
				dragCallbacks[currentElement.id](e, currentElement);
			}

			return false;
		}
	});

	// 捕捉mouseup事件,当在元素上放松鼠标按钮时，会发生 mouseup 事件
	$(document).mouseup(function(e){
		if(isMouseDown && dragStatus[currentElement.id] != 'false'){
			isMouseDown = false;
			//drop==>ondrop
			if(dropCallbacks[currentElement.id] != undefined){
				dropCallbacks[currentElement.id](e, currentElement);
			}

			return false;
		}
	});

	// drag时执行的回调函数
	$.fn.ondrag = function(callback){
		return this.each(function(){
			dragCallbacks[this.id] = callback;
		});
	};

	// drop时执行的回调函数
	$.fn.ondrop = function(callback){
		return this.each(function(){
			dropCallbacks[this.id] = callback;
		});
	};
	
	//禁用元素drag功能
	$.fn.dragOff = function(){
		return this.each(function(){
			dragStatus[this.id] = 'off';
		});
	};
	
	//启用元素的drag功能
	$.fn.dragOn = function(){
		return this.each(function(){
			dragStatus[this.id] = 'on';
		});
	};
	
	//为子元素添加移动句柄
	$.fn.setHandler = function(handlerId){
		
		return this.each(function(){
			var draggable = this;
			//事件冒泡
			bubblings[this.id] = true;
			// 重置鼠标的样式
			$(draggable).css("cursor", "");
			dragStatus[draggable.id] = "handler";
			// 修改成移动装
			$("#"+handlerId).css("cursor", "move");	
			// 绑定mousedown事件
			$("#"+handlerId).mousedown(function(e){
				$("#"+handlerId).css("cursor", "move");
				holdingHandler = true;
				$(draggable).trigger('mousedown', e);
			});
			// 绑定mouseup事件
			$("#"+handlerId).mouseup(function(e){
				holdingHandler = false;
			});
		});
	}

	$.fn.easydrag = function(allowBubbling){

		return this.each(function(){
			// 如果目标元素没有设置ID,则插件自动添加一个唯一ID标识
			if(undefined == this.id || !this.id.length) 
				this.id = "easydrag_"+(new Date().getTime());
			
			bubblings[this.id] = allowBubbling ? true : false;

			dragStatus[this.id] = "on";
			
			$(this).css("cursor", "move");
			
			$(this).mousedown(function(e){
				
				if((dragStatus[this.id] == "off") || (dragStatus[this.id] == "handler" && !holdingHandler))
					return bubblings[this.id];

				//$(this).css("position", "absolute");

				$(this).css("z-index", parseInt(new Date().getTime()/1000 ));

				isMouseDown    = true;
				currentElement = this;
				
				var pos    = $.getMousePosition(e);
				lastMouseX = pos.x;
				lastMouseY = pos.y;

				lastElemTop  = this.offsetTop;
				lastElemLeft = this.offsetLeft;

				$.updatePosition(e);
				return bubblings[this.id];
			});
		});
	};

})(jQuery);