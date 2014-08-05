/*******************************************************************
本公共函数由Jason.leung编写整理，未经许可，任何企业或个人不得用于商业用途！违者必究！
Email,jason.leung58@icloud.com
********************************************************************/
function convertStyle(obj)
{
	if(obj.length)
	{
		for (var i=0; i<obj.length; i++)
		{
			obj[i].style.left=obj[i].offsetLeft+'px';
			obj[i].style.top=obj[i].offsetTop+'px';
		}
		for (var i=0; i<obj.length; i++)
		{
			obj[i].style.position='absolute';
			obj[i].style.margin=0;
		}		
	}
	else
	{
		obj.style.left=obj.offsetLeft+'px';
		obj.style.top=obj.offsetTop+'px';
		obj.style.position='absolute';
		obj.style.margin=0;
	}
}

function shake(obj)
{
	var posData=[obj.offsetLeft,obj.offsetTop];
	obj.onclick=function()
	{
		var i=0;
		clearInterval(timer);
		var timer=setInterval(function()
		{
			i++;
			obj.style.left=posData[0]+((i%2)>0?-2:2)+'px';
			obj.style.top=posData[1]+((i%2)>0?-2:2)+'px';
			if(i>=30)
			{
				clearInterval(timer);
				obj.style.left=posData[0]+'px';
				obj.style.top=posData[1]+'px';
			}
		}, 30);
	}
}

/* Design by Jason.leung, QQ,147430218, 新浪微博,@切片面包 */
window.onload=function()
{
	var oBox=document.getElementById('box');
	convertStyle(oBox);
	shake(oBox);
}