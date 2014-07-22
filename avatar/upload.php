<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
</head>
<body>
<?
@header("Expires: 0");
@header("Cache-Control: private, post-check=0, pre-check=0, max-age=0", FALSE);
@header("Pragma: no-cache");
define('SD_ROOT', dirname(__FILE__).'/');
$pic_id = time();//使用时间来模拟图片的ID.
$pic_path = SD_ROOT.'./avatar_origin/'.$pic_id.'.jpg';
//上传后图片的绝对地址
//$pic_abs_path = 'http://sns.com/avatar_test/avatar_origin/'.$pic_id.'.jpg';
$pic_abs_path = 'avatar_origin/'.$pic_id.'.jpg';
//保存上传图片.
if(empty($_FILES['Filedata'])) {
	echo '<script type="text/javascript">alert("对不起, 图片未上传成功, 请再试一下");</script>';
	exit();
}

$file = @$_FILES['Filedata']['tmp_name'];

file_exists($pic_path) && @unlink($pic_path);
if(@copy($_FILES['Filedata']['tmp_name'], $pic_path) || @move_uploaded_file($_FILES['Filedata']['tmp_name'], $pic_path)) 
{
	@unlink($_FILES['Filedata']['tmp_name']);
	/*list($width, $height, $type, $attr) = getimagesize($pic_path);
	if($width < 10 || $height < 10 || $width > 3000 || $height > 3000 || $type == 4) {
		@unlink($pic_path);
		return -2;
	}*/
} else {
	@unlink($_FILES['Filedata']['tmp_name']);
	echo '<script type="text/javascript">alert("对不起, 上传失败");</script>';
}

//写新上传照片的ID.
echo '<script type="text/javascript">window.parent.hideLoading();window.parent.buildAvatarEditor("'.$pic_id.'","'.$pic_abs_path.'","photo");</script>';
?>
</body>
</html>