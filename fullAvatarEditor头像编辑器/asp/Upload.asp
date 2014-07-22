<%@ LANGUAGE = "VBSCRIPT" CODEPAGE = "65001"%>
<%
Response.Charset			= "UTF-8"	'指定输出网页编码
Server.ScriptTimeOut		= 5000		'脚本执行超时最大时限
'温馨提示：
'	在flash的参数名upload_url中可自行定义一些参数（请求方式：GET），定义后在服务器端获取即可，比如可以应用到用户验证，文件的保存名等。
'	本示例未作极致的用户体验与严谨的安全设计（如用户直接访问此页时该如何，万一客户端数据不可信时验证文件的大小、类型等），只保证正常情况下无误，请阁下注意。
'使用风声 ASP 无组件上传类 V2.11
%>
<!--#include file="Upload.asp.cls"-->
<%
'生成指定长度的随机码。
Function CreateRandomCode(ByVal Length)
	Randomize
	Dim RandCode		: RandCode = ""
	Dim RandChar		: RandChar = "0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z"
	Dim RandCharArray	: RandCharArray = Split(RandChar, ",")
	Dim i
	For i = 1 To Length
		RandCode = RandCode & RandCharArray(Int(36 * Rnd))
	Next
	CreateRandomCode = RandCode
End Function

'取服务器时间+8位随机码作为部分文件名，确保文件名无重复。
Dim FileName : FileName = Year(NowTime) & Right("0" & Month(NowTime), 2) & Right("0" & Day(NowTime), 2) & Right("0" & Hour(NowTime), 2) & Right("0" & Minute(NowTime), 2) & Right("0" & Second(NowTime), 2) & Left(Replace(Right(timer(), 2), ".", "") & "0", 2) & CreateRandomCode(8)

Dim Success : Success = "false"	'表示图片是否已上传成功。
Dim Msg							'自定义的附加消息。
Dim SourceUrl					'表示原始图片的保存地址。
DIM AvatarUrls					'表示所有头像图片的保存地址。

Dim VirtualPath					'保存的在服务器的虚拟路径
Dim SuccessNum : SuccessNum = 0

On Error Resume Next
Dim Upload
'建立上传对象
Set Upload = New UpLoadClass
	Upload.Charset="UTF-8"				'设置字符集
	Upload.MaxSize = 1024 * 1024 * 2	'每个上传文件的最大字节数，该处为2MB
	Upload.FileType = "jpg/gif"			'允许上传的文件类型
	Upload.AutoSave = 2					'设置 Open 方法处理文件的方式，对其他方法无效，2表示不自动保存文件，Open之后请用Save/GetData方法保存文件
	Upload.Open()						'打开对象
	'定义一个变量用以储存当前头像的序号
	Dim AvatarNumber : AvatarNumber = 1	
	'遍历所有文件域
	Dim i
	For i = 1 To Ubound(Upload.FileItem)
		'定义一个变量用以储存当前 file 域的名称
		Dim FieldName : FieldName = Upload.FileItem(i)
		'原始图片(file 域的名称：__source，如果客户端定义可以上传的话，可在此处理）。
		If FieldName = "__source" Then
			VirtualPath = "/upload/asp_source_" & FileName & ".jpg"
			SourceUrl = VirtualPath
			If Upload.Save (FieldName, VirtualPath) = true Then
				SuccessNum = SuccessNum + 1
			Else
				Msg = "原图片保存失败，错误信息：" & Upload.Error	'错误信息请参考http://www.fonshen.com/UpLoadClass/help/help1.htm
			End If
		Else
			'头像图片(file 域的名称：__avatar1,2,3...)。
			VirtualPath = "/upload/asp_avatar " & AvatarNumber & "_" & FileName & ".jpg"
			If Upload.Save (FieldName, VirtualPath) = true Then
				SuccessNum = SuccessNum + 1
				AvatarUrls = AvatarUrls & """" & VirtualPath & ""","
				AvatarNumber = AvatarNumber + 1
			Else
				Msg = Msg & "头像保存失败，错误信息：" & Upload.Error	'错误信息请参考http://www.fonshen.com/UpLoadClass/help/help1.htm
			End If
		End If
	Next
'释放上传对象
Set Upload = Nothing
If Err.Number <> 0 Then Err.Clear

If SuccessNum > 0 Then
	Success = "true"
End If

If AvatarUrls <> "" Then
	AvatarUrls = Left(AvatarUrls, Len(AvatarUrls) - 1)
End If
'返回上传结果(json)
Response.Write "{""success"":" & Success & ", ""msg"":""" & Msg & """, ""sourceUrl"":""" & SourceUrl & """, ""avatarUrls"":[" & AvatarUrls & "]}"
%>