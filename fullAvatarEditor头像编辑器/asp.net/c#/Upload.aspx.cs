using System;
using System.Collections;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using Newtonsoft.Json;
/*
温馨提示：
	在flash的参数名upload_url中可自行定义一些参数（请求方式：GET），定义后在服务器端获取即可，比如可以应用到用户验证，文件的保存名等。
	本示例未作极致的用户体验与严谨的安全设计（如用户直接访问此页时该如何，万一客户端数据不可信时验证文件的大小、类型等），只保证正常情况下无误，请阁下注意。
*/
public partial class Upload : System.Web.UI.Page
{
	protected void Page_Load(object sender, EventArgs e)
	{
		Result result = new Result();
		result.avatarUrls = new ArrayList();
		result.success = false;
		result.msg = "Failure!";
		//取服务器时间+8位随机码作为部分文件名，确保文件名无重复。
		string fileName = DateTime.Now.ToString("yyyyMMddhhmmssff") + CreateRandomCode(8);
		//定义一个变量用以储存当前头像的序号
		int avatarNumber = 1;
		//遍历所有文件域
		foreach(string fieldName in Request.Files.AllKeys)
		{
			HttpPostedFile file = Request.Files[fieldName];
			//原始图片(file 域的名称：__source，如果客户端定义可以上传的话，可在此处理）。
			if(fieldName == "__source")
			{
				result.sourceUrl = string.Format("/upload/csharp_source_{0}.jpg", fileName);
				file.SaveAs(Server.MapPath(result.sourceUrl));
			}
			//头像图片(file 域的名称：__avatar1,2,3...)。
			else
			{
				string virtualPath = string.Format("/upload/csharp_avatar{0}_{1}.jpg", avatarNumber, fileName);
				result.avatarUrls.Add(virtualPath);
				file.SaveAs(Server.MapPath(virtualPath));
				avatarNumber++;
			}
		}
		result.success = true;
		result.msg = "Success!";
		//返回图片的保存结果（返回内容为json字符串，可自行构造，该处使用Newtonsoft.Json构造）
		Response.Write(JsonConvert.SerializeObject(result));
	}
	/// <summary>
	/// 生成指定长度的随机码。
	/// </summary>
	private string CreateRandomCode(int length)
	{
		string [] codes = new string [36] { "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" };
		StringBuilder randomCode = new StringBuilder();
		Random rand = new Random();
		for ( int i =0; i < length; i++ )
		{
			randomCode.Append(codes [rand.Next(codes.Length)]);
		}
		return randomCode.ToString();
	}
	/// <summary>
	/// 表示图片的上传结果。
	/// </summary>
	private struct Result
	{
		/// <summary>
		/// 表示图片是否已上传成功。
		/// </summary>
		public bool success;
		/// <summary>
		/// 自定义的附加消息。
		/// </summary>
		public string msg;
		/// <summary>
		/// 表示原始图片的保存地址。
		/// </summary>
		public string sourceUrl;
		/// <summary>
		/// 表示所有头像图片的保存地址，该变量为一个数组。
		/// </summary>
		public ArrayList avatarUrls;
	}
}