<?php
/**
 * Note:for octet-stream upload
 * 这个是流式上传PHP文件
 * Please be amended accordingly based on the actual situation
 */
$post_input = 'php://input';
$save_path = dirname( __FILE__ );
$postdata = file_get_contents( $post_input );

if ( isset( $postdata ) && strlen( $postdata ) > 0 ) {
	$filename = $save_path . '/' . uniqid() . '.jpg';
	$handle = fopen( $filename, 'w+' );
	fwrite( $handle, $postdata );
	fclose( $handle );
	if ( is_file( $filename ) ) {
		echo 'Image data save successed,file:' . $filename;
		exit ();
	}else {
		die ( 'Image upload error!' );
	}
}else {
	die ( 'Image data not detected!' );
}