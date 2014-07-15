<?php
/**
 * Note:for multipart/form-data upload
 * 这个是标准表单上传PHP文件
 * Please be amended accordingly based on the actual situation
 */
if (!$_FILES['Filedata']) {
	die ( 'Image data not detected!' );
}
if ($_FILES['Filedata']['error'] > 0) {
	switch ($_FILES ['Filedata'] ['error']) {
		case 1 :
			$error_log = 'The file is bigger than this PHP installation allows';
			break;
		case 2 :
			$error_log = 'The file is bigger than this form allows';
			break;
		case 3 :
			$error_log = 'Only part of the file was uploaded';
			break;
		case 4 :
			$error_log = 'No file was uploaded';
			break;
		default :
			break;
	}
	die ( 'upload error:' . $error_log );
} else {
	$img_data = $_FILES['Filedata']['tmp_name'];
	$size = getimagesize($img_data);
	$file_type = $size['mime'];
	if (!in_array($file_type, array('image/jpg', 'image/jpeg', 'image/pjpeg', 'image/png', 'image/gif'))) {
		$error_log = 'only allow jpg,png,gif';
		die ( 'upload error:' . $error_log );
	}
	switch($file_type) {
		case 'image/jpg' :
		case 'image/jpeg' :
		case 'image/pjpeg' :
			$extension = 'jpg';
			break;
		case 'image/png' :
			$extension = 'png';
			break;
		case 'image/gif' :
			$extension = 'gif';
			break;
	}	
}
if (!is_file($img_data)) {
	die ( 'Image upload error!' );
}
//图片保存路径,默认保存在该代码所在目录(可根据实际需求修改保存路径)
$save_path = dirname( __FILE__ );
$uinqid = uniqid();
$filename = $save_path . '/' . $uinqid . '.' . $extension;
$result = move_uploaded_file( $img_data, $filename );
if ( ! $result || ! is_file( $filename ) ) {
	die ( 'Image upload error!' );
}
echo 'Image data save successed,file:' . $filename;
exit ();