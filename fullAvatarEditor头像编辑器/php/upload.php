<?php
/* 温馨提示：
 * 在flash的参数名upload_url中可自行定义一些参数（请求方式：GET），定义后在服务器端获取即可，比如可以应用到用户验证，文件的保存名等。
 * 本示例未作极致的用户体验与严谨的安全设计（如用户直接访问此页时该如何，万一客户端数据不可信时验证文件的大小、类型等），只保证正常情况下无误，请阁下注意。
 */
header('Content-Type: text/html; charset=utf-8');
$result = array();
$result['success'] = false;
$successNum = 0;
//定义一个变量用以储存当前头像的序号
$avatarNumber = 1;
$i = 0;
$msg = '';
//遍历所有文件域
while (list($key, $val) = each($_FILES))
{
	if ( $_FILES[$key]['error'] > 0)
    {
		$msg .= $_FILES[$key]['error'];
	}
	else
	{
		$fileName = date("YmdHis").floor(microtime() * 1000).createRandomCode(8);
		//原始图片(file 域的名称：__source，如果客户端定义可以上传的话，可在此处理）。
		if ($key == '__source')
		{
			$virtualPath = 'upload/php_source_' . $fileName . '.jpg';
			$result['sourceUrl'] = '/' . $virtualPath;
			move_uploaded_file($_FILES[$key]["tmp_name"], $virtualPath);
			$successNum++;
		}
		//头像图片(file 域的名称：__avatar1,2,3...)。
		else
		{
			$virtualPath = 'upload/php_avatar' . $avatarNumber . "_" . $fileName . '.jpg';
			$result['avatarUrls'][$i] = '/' . $virtualPath;
			move_uploaded_file($_FILES[$key]["tmp_name"], $virtualPath);
			$successNum++;
			$i++;
		}
	}
}
$result['msg'] = $msg;
if ($successNum > 0)
{
	$result['success'] = true;
}
//返回图片的保存结果（返回内容为json字符串）
print json_encode($result);

/**************************************************************
*  生成指定长度的随机码。
*  @param int $length 随机码的长度。
*  @access public
**************************************************************/
function createRandomCode($length)
{
	$randomCode = "";
	$randomChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	for ($i = 0; $i < $length; $i++)
	{
		$randomCode .= $randomChars { mt_rand(0, 35) };
	}
	return $randomCode;
}
?>