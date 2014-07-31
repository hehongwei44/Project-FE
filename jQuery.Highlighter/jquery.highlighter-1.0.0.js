/**
 * This plugin is licensed under the CDDL v1.0.
 * You can find the full license text here: http://www.opensource.org/licenses/cddl1.txt.
 * 
 * jQuery Text Highlighter Plugin
 * v1.0.0
 * Author: Xu Jin
 */
 
jQuery.extend({
	highlighter: {
		__config__: {
	 	 	sourceHtmlDataKey: "__jquery.highlighter.data.sourceHTML__"
		}
	}
});
 
/**
 * 高亮关键字
 * 注：目前无法匹配跨越 HTML 标签的关键字
 */
jQuery.fn.highlight = function(keyWords, options) {
    var defaultWrapper = "em";
	var settings = jQuery.extend({
		hClass: null,
		hColor: "#C03",
		separator: " ",
		wrapper: defaultWrapper,
		useDefaultStyle: true,
		needUnhighlight: false
	}, options);
	
	var hasClass = (typeof settings.hClass == "string" && settings.hClass.length > 0);
	
	// 构建高亮包装器模版元素
	var wrapperElementTemplate = $("<" + settings.wrapper + "/>");
	if(hasClass)
	    wrapperElementTemplate.addClass(settings.hClass);
	else if(settings.useDefaultStyle)
	{
	    wrapperElementTemplate.css("color", settings.hColor);
	    if(defaultWrapper == settings.wrapper)
	        wrapperElementTemplate.css("font-style", "normal");
	}

	var emptyStr = "";
	
	// 把多个关键字字符串用空格分割，并去除重复的关键字
	var keyWordArray = null;
	if(typeof keyWords == "string")
	    keyWordArray = keyWords.split(settings.separator);
	else if(jQuery.isArray(keyWords))
	    keyWordArray = keyWords;
	    
    for(var i = 0; i < keyWordArray.length; i++)
    {
        var kewWord = keyWordArray[i];
        for(var j = keyWordArray.length - 1; j > i; j--)
        {
            if(kewWord == keyWordArray[j])
                keyWordArray.splice(j, 1);
        }
    }

    // 正则表达式特殊字符
    var regExpSpecialChars = [
        {spChar: "\\", escapeChar: "\\\\"},
        {spChar: "$", escapeChar: "\\$"},
        {spChar: "(", escapeChar: "\\("},
        {spChar: ")", escapeChar: "\\)"},
        {spChar: "*", escapeChar: "\\*"},
        {spChar: "+", escapeChar: "\\+"},
        {spChar: ".", escapeChar: "\\."},
        {spChar: "[", escapeChar: "\\["},
        {spChar: "?", escapeChar: "\\?"},
        {spChar: "^", escapeChar: "\\^"},
        {spChar: "{", escapeChar: "\\{"},
        {spChar: "|", escapeChar: "\\|"}
    ];
    
    // 正则表达式：HTML 标签
    var regExpHtmlTag = /<\/?[a-z][a-z0-9]*[^<>]*>/ig;
    // 正则表达式：HTML 实体
    var regExpHtmlEntity = /&(?:[a-z]+?|#[0-9]+?|#x[0-9a-f]+?);/ig;

    var div = $("<div />");

	return this.each(function(){
		var target = $(this);
		var source = target.data(jQuery.highlighter.__config__.sourceHtmlDataKey);
		if(!source) // 检查是否存在备份
		{
			source = target.html();
			if(settings.needUnhighlight) // 备份源代码
				target.data(jQuery.highlighter.__config__.sourceHtmlDataKey, source);
		}

		var matchResult = null;

		// 用正则表达式查找出所有 HTML 标签的位置，并放到一个一维数组中
		var htmlTagPositionArray = [];
		while((matchResult = regExpHtmlTag.exec(source)) != null)
		{
			var position = {start: matchResult.index, end: regExpHtmlTag.lastIndex, tag: matchResult[0]};
			htmlTagPositionArray.push(position);
		}
		
		// 用正则表达式查找出所有 HTML 实体的位置，并放到一个一维数组中
		var htmlEntityPositionArray = [];
		while((matchResult = regExpHtmlEntity.exec(source)) != null)
		{
			var position = {start: matchResult.index, end: regExpHtmlEntity.lastIndex, tag: matchResult[0]};
			htmlEntityPositionArray.push(position);
		}

		// 用正则表达式分别查找出所有关键字的位置，并放到一个一维数组中
		var positionArray = [];
		for(var i = 0; i < keyWordArray.length; i++)
		{
			var encodedKeyWord = div.text(keyWordArray[i]).html();
			jQuery.each(regExpSpecialChars, function(index, element){
				encodedKeyWord = encodedKeyWord.replace(element.spChar, element.escapeChar);
			});

			var regExp = new RegExp(encodedKeyWord, "ig");
			while((matchResult = regExp.exec(source)) != null)
			{
				var position = {start: matchResult.index, end: regExp.lastIndex};
				positionArray.push(position);
			}
			
		}

		// HTML 标签，去除无效的关键字位置（关键字在标签内部）
		for(var i = positionArray.length - 1; i >= 0; i--)
		{
			var position = positionArray[i];
			for(var j = 0; j < htmlTagPositionArray.length; j++)
			{
				var htmlTagPosition = htmlTagPositionArray[j];
				if(position.start > htmlTagPosition.start && position.end < htmlTagPosition.end)
				{
					positionArray.splice(i, 1);
					break;
				}
			}
		}
		
		// HTML 实体，去除无效的关键字位置（关键字在实体内部或与实体相交）
		for(var i = positionArray.length - 1; i >= 0; i--)
		{
			var position = positionArray[i];
			for(var j = 0; j < htmlEntityPositionArray.length; j++)
			{
				var htmlEntityPosition = htmlEntityPositionArray[j];
				if((position.start > htmlEntityPosition.start && position.end <= htmlEntityPosition.end)
					|| (position.start >= htmlEntityPosition.start && position.end < htmlEntityPosition.end))
				{
					positionArray.splice(i, 1);
					break;
				}
				
				if((position.start > htmlEntityPosition.start && position.start < htmlEntityPosition.end &&  position.end > htmlEntityPosition.end)
					|| (position.start < htmlEntityPosition.start && position.end > htmlEntityPosition.start &&  position.end < htmlEntityPosition.end))
				{
					positionArray.splice(i, 1);
					break;
				}
			}
		}
		
		// 循环判断前面的位置与后面的位置是否存在相邻或相交，如果存在，则合并这些位置范围：
		var positions = []; // 保存最终的位置范围
		for(var i = 0; i < positionArray.length; i++)
		{
			var position = positionArray[i];
			for(var j = positionArray.length - 1; j > i; j--)
			{
				var anotherPosition = positionArray[j];
				// 1. 后面的位置是否与前面的位置在右边相交或相邻
				if(position.start <= anotherPosition.start && position.end >= anotherPosition.start && position.end < anotherPosition.end)
				{
					position.end = anotherPosition.end;
					positionArray.splice(j, 1);
					continue;
				}
					
				// 2. 后面的位置是否与前面的位置在左边相交或相邻
				if(anotherPosition.start < position.start && anotherPosition.end >= position.start && anotherPosition.end <= position.end)
				{
					position.start = anotherPosition.start;
					positionArray.splice(j, 1);
					continue;
				}
				
				// 3. 后面的位置是否在前面的位置内部
				if(position.start <= anotherPosition.start && position.end >= anotherPosition.end)
				{
					positionArray.splice(j, 1);
					continue;
				}
				
				// 4. 前面的位置是否在后面的位置内部
				if(position.start >= anotherPosition.start && position.end <= anotherPosition.end)
				{
					position.start = anotherPosition.start;
					position.end = anotherPosition.end;
					positionArray.splice(j, 1);
					continue;
				}
			}
			
			positions.push(position);
		}
		
		// 把位置数组按照从小到大排序
		positions.sort(function(p1, p2){
		    return p1.start - p2.start;
		});
		
		// 添加 Wrapper 和设置高亮样式
		var stringBuffer = [];
		var offset = 0;
		jQuery.each(positions, function(index, position){
		    if(offset < position.start)
		        stringBuffer.push(source.substring(offset, position.start));
		    
		    div.empty().append(wrapperElementTemplate.clone().html(source.substring(position.start, position.end)));
		    stringBuffer.push(div.html());
		    
		    offset = position.end;
		});
		
		if(offset < source.length)
		    stringBuffer.push(source.substr(offset));
		
		target.html(stringBuffer.join(emptyStr));
	});
};

/**
 * 取消高亮
 */
jQuery.fn.unhighlight = function() {
	return this.each(function(){
		var target = $(this);
		var source = target.data(jQuery.highlighter.__config__.sourceHtmlDataKey);
		if(source)
		{
			target.html(source);
			target.removeData(jQuery.highlighter.__config__.sourceHtmlDataKey);
		}
	});
};