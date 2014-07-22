<%--
温馨提示：
	在flash的参数名upload_url中可自行定义一些参数（请求方式：GET），定义后在服务器端获取即可，比如可以应用到用户验证，文件的保存名等。
	本示例未作极致的用户体验与严谨的安全设计（如用户直接访问此页时该如何，万一客户端数据不可信时验证文件的大小、类型等），只保证正常情况下无误，请阁下注意。
--%>
<%@ page session="false" pageEncoding="UTF-8" contentType="text/html; charset=UTF-8" %>
<%@ page import="java.io.*"%>
<%@ page import="java.util.*"%>
<%@ page import="java.text.*"%>
<%@ page import="org.apache.commons.fileupload.*"%>
<%@ page import="org.apache.commons.fileupload.disk.*"%>
<%@ page import="org.apache.commons.fileupload.servlet.*"%>
<%@ page import="org.apache.commons.fileupload.util.*"%>
<%@ page import="com.alibaba.fastjson.*"%>
<%
String contentType = request.getContentType();

if ( contentType.indexOf("multipart/form-data") >= 0 )
{
	Result result = new Result();
	result.avatarUrls = new ArrayList();
	result.success = false;
	result.msg = "Failure!";

	FileItemFactory factory = new DiskFileItemFactory();
	ServletFileUpload upload = new ServletFileUpload(factory);
	FileItemIterator files = upload.getItemIterator(request);
	//定义一个变量用以储存当前头像的序号
	int avatarNumber = 1;
	//取服务器时间+8位随机码作为部分文件名，确保文件名无重复。
	SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyyMMddHHmmssS"); 
	String fileName = simpleDateFormat.format(new Date());
	Random random = new Random();
	String randomCode = "";
	for ( int i = 0; i < 8; i++ )
	{
		randomCode += Integer.toString(random.nextInt(36), 36);
	}
	fileName = fileName + randomCode;
	//遍历所有文件域
	while( files.hasNext() )
	{
		FileItemStream file = files.next();
		if( !file.isFormField() )
		{
			String fieldName = file.getFieldName();
			String virtualPath = "/upload/jsp_avatar" + avatarNumber + "_" + fileName + ".jpg";
			//原始图片(file 域的名称：__source，如果客户端定义可以上传的话，可在此处理）。
			if( fieldName.equals("__source") )
			{
				result.sourceUrl = virtualPath = "/upload/jsp_source_" + fileName + ".jpg";
			}
			//头像图片(file 域的名称：__avatar1,2,3...)。
			else
			{
				result.avatarUrls.add(virtualPath);
				avatarNumber++;
			}
			BufferedInputStream	inputStream = new BufferedInputStream(file.openStream());
			BufferedOutputStream outputStream = new BufferedOutputStream(new FileOutputStream(new File(request.getRealPath(virtualPath))));
            Streams.copy(inputStream, outputStream, true);
			inputStream.close();
			outputStream.close();
		}
	}
	result.success = true;
	result.msg = "Success!";
	//返回图片的保存结果（返回内容为json字符串，可自行构造，该处使用fastjson构造）
	out.println(JSON.toJSONString(result));
}
%>
<%!
/**
* 表示上传的结果。
*/
private class Result
{
	/**
	* 表示图片是否已上传成功。
	*/
	public Boolean success;
	/**
	* 自定义的附加消息。
	*/
	public String msg;
	/**
	* 表示原始图片的保存地址。
	*/
	public String sourceUrl;
	/**
	* 表示所有头像图片的保存地址，该变量为一个数组。
	*/
	public ArrayList avatarUrls;
}
%>