package com.sohu.sns.avatar
{
    import com.adobe.images.*;
    import com.adobe.serialization.json.*;
    import flash.display.*;
    import flash.events.*;
    import flash.net.*;

    public class BinaryTransfer extends EventDispatcher
    {
        private var pId:String = "";
        private var postUrl:String;
        private var msgStr:String = "default";
        private var from:String;
        private var photoServer:String;
        private var type:String;
        public static var ERROR:String = "error";
        public static var COMPLETE:String = "complete";

        public function BinaryTransfer(param1:String, param2:String, param3:String = "", param4:String = "", param5:String = "")
        {
            this.postUrl = param1;
            this.type = param2;
            this.photoServer = param3;
            this.from = param4;
            this.postUrl = this.postUrl + ("&type=" + this.type);
            this.postUrl = this.postUrl + ("&photoServer=" + this.photoServer);
            this.postUrl = this.postUrl + ("&from=" + this.from);
            this.postUrl = this.postUrl + ("&photoId=" + param5);
            return;
        }// end function

        public function get msg() : String
        {
            return this.msgStr;
        }// end function

        public function get pServer() : String
        {
            return this.photoServer;
        }// end function

        private function onIOError(param1:IOErrorEvent) : void
        {
            this.msgStr = "io error";
            this.dispatchEvent(new Event(ERROR));
            return;
        }// end function

        private function onSecurityError(param1:SecurityErrorEvent) : void
        {
            this.msgStr = "securityError:" + param1.toString();
            this.dispatchEvent(new Event(ERROR));
            return;
        }// end function

        public function get photoId() : String
        {
            return this.pId;
        }// end function

        private function onComplete(param1:Event) : void
        {
            var arr:*;
            var event:* = param1;
            var loader:* = URLLoader(event.target);
            loader.dataFormat = URLLoaderDataFormat.VARIABLES;
            try
            {
                arr = JSON.decode(String(loader.data));
                if (arr.status == 1)
                {
                    if (arr.data == null)
                    {
                        this.msgStr = "no response";
                        this.dispatchEvent(new Event(ERROR));
                    }
                    else
                    {
                        this.msgStr = arr.statusText;
                        this.photoServer = arr.data.large;
                        this.photoServer = arr.data.urls[0];
                        if (arr.data.photoId)
                        {
                            this.pId = arr.data.photoId;
                        }
                        else
                        {
                            this.pId = "";
                        }
                        this.dispatchEvent(new Event(COMPLETE));
                    }
                }
                else
                {
                    this.msgStr = arr.statusText;
                    this.dispatchEvent(new Event(ERROR));
                }
            }
            catch (e:Error)
            {
                this.msgStr = "json format error";
                this.dispatchEvent(new Event(ERROR));
            }
            return;
        }// end function

        public function transferData(param1:BitmapData) : void
        {
            var _loc_2:* = new JPGEncoder(100);
            var _loc_3:* = _loc_2.encode(param1);
            var _loc_4:* = new URLRequest(this.postUrl);
            new URLRequest(this.postUrl).data = _loc_3;
            _loc_4.method = URLRequestMethod.POST;
            _loc_4.contentType = "application/octet-stream";
            var _loc_5:* = new URLLoader();
            new URLLoader().load(_loc_4);
            _loc_5.addEventListener(Event.COMPLETE, onComplete);
            _loc_5.addEventListener(IOErrorEvent.IO_ERROR, onIOError);
            _loc_5.addEventListener(SecurityErrorEvent.SECURITY_ERROR, onSecurityError);
            return;
        }// end function

    }
}
