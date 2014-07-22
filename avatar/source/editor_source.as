package 
{
    import com.sohu.sns.avatar.*;
    import flash.display.*;
    import flash.events.*;
    import flash.external.*;
    import flash.text.*;
    import flash.ui.*;

    public class AvatarEditor extends Sprite
    {
        private var savingBtn:Sprite;
        private var cameraPicUrl:String;
        private var SlideBtn:Class;
        private var smallThumb:PhotoThumb;
        private var photoServer:String;
        private var bigIconUrl:String;
        private var ReEditBtn:Class;
        private var leftIcon:Sprite;
        private var smallThumbButton:ThumbButton;
        private var MainLoading:Class;
        private var reEditDisBtn:Sprite;
        private var cameraSnapper:CameraSnapper;
        private var smallIconUrl:String;
        private var cameraSnapSaveUrl:String;
        private var loading:InfoSprite;
        private var reEditBtn:Sprite;
        private var LeftIcon:Class;
        private var mainLoading:Sprite;
        private var guideText:TextField;
        private var ReEditDisBtn:Class;
        private var picSource:PhotoLoader;
        private var slideBarMid:Sprite;
        private var thumbnailWin:Sprite;
        private var SnappDisBtn:Class;
        private var bigEditWin:EditWindow;
        private var largeThumb:PhotoThumb;
        private var editType:String;
        private var editingSmall:Boolean = true;
        private var stageWidth:Number = 514;
        private var smallEditWin:EditWindow;
        private var cameraState:Sprite;
        private var previewBtn:Sprite;
        private var snappDisBtn:Sprite;
        private var SaveBtn:Class;
        private var slideBarBg:Sprite;
        private var bigThumbButton:ThumbButton;
        private var resetBtn:Sprite;
        private var PreviewBtn:Class;
        private var RightIcon:Class;
        private var snappBtn:Sprite;
        private var saveBtn:Sprite;
        private var guideTextFormat:TextFormat;
        private var slideBar:ProgressBar;
        private var SlideBarBg:Class;
        private var previewState:Sprite;
        private var ResetBtn:Class;
        private var editState:Sprite;
        private var saveUrl:String;
        private var rightIcon:Sprite;
        private var SnappBtn:Class;
        private var postUrl:String;
        private var stageHeight:Number = 464;
        private var RestBtn:Class;
        private var editData:BitmapData;
        private var BackBtn:Class;
        private var photoUrl:String;
        private var SavingBtn:Class;
        private var slideBtn:Sprite;
        private var photoId:String;
        private var backBtn:Sprite;
        private var restBtn:Sprite;
        private var iconSaveUrl:String;

        public function AvatarEditor()
        {
            SlideBtn = AvatarEditor_SlideBtn;
            SlideBarBg = AvatarEditor_SlideBarBg;
            PreviewBtn = AvatarEditor_PreviewBtn;
            BackBtn = AvatarEditor_BackBtn;
            SnappBtn = AvatarEditor_SnappBtn;
            SnappDisBtn = AvatarEditor_SnappDisBtn;
            ReEditBtn = AvatarEditor_ReEditBtn;
            ReEditDisBtn = AvatarEditor_ReEditDisBtn;
            ResetBtn = AvatarEditor_ResetBtn;
            SaveBtn = AvatarEditor_SaveBtn;
            LeftIcon = AvatarEditor_LeftIcon;
            RightIcon = AvatarEditor_RightIcon;
            RestBtn = AvatarEditor_RestBtn;
            SavingBtn = AvatarEditor_SavingBtn;
            MainLoading = AvatarEditor_MainLoading;
            cameraState = new Sprite();
            editState = new Sprite();
            previewState = new Sprite();
            loading = new InfoSprite();
            thumbnailWin = new Sprite();
            addChild(this.loading);
            this.mainLoading = new MainLoading();
            addChild(this.mainLoading);
            this.mainLoading.x = (this.stageWidth - this.mainLoading.width) / 2;
            this.mainLoading.y = (this.stageHeight - this.mainLoading.height) / 2;
            this.drawBg();
            this.init();
            return;
        }// end function

        private function removeMenu() : void
        {
            var _loc_1:* = new ContextMenu();
            _loc_1.hideBuiltInItems();
            this.contextMenu = _loc_1;
            return;
        }// end function

        private function onSeek(param1:Event) : void
        {
            if (this.editingSmall)
            {
                this.smallEditWin.setPhotoScale(this.slideBar.rate);
                return;
            }
            this.bigEditWin.setPhotoScale(this.slideBar.rate);
            return;
        }// end function

        private function onBigSnap(param1:Event) : void
        {
            this.bigThumbButton.drawData(this.bigEditWin.thumbBmpData);
            return;
        }// end function

        private function init() : void
        {
            this.removeMenu();
            stage.align = StageAlign.TOP_LEFT;
            stage.scaleMode = StageScaleMode.NO_SCALE;
            this.editType = loaderInfo.parameters["type"];
            this.photoUrl = loaderInfo.parameters["photoUrl"];
            this.postUrl = loaderInfo.parameters["postUrl"];
            this.saveUrl = loaderInfo.parameters["saveUrl"];
            var _loc_1:* = loaderInfo.parameters["photoId"];
            this.iconSaveUrl = this.saveUrl;
            this.cameraSnapSaveUrl = this.postUrl;
            if (_loc_1 && _loc_1.length > 0)
            {
                this.photoId = _loc_1;
            }
            else
            {
                this.photoId = "";
            }
            addChild(this.cameraState);
            addChild(this.editState);
            addChild(this.previewState);
            if (this.editType == "photo")
            {
                this.initUI();
                this.picSource = new PhotoLoader(this.photoUrl);
                this.picSource.getEditSource();
                this.picSource.addEventListener(PhotoLoader.COMPLETE, onEditData);
                this.photoServer = this.photoUrl;
            }
            else if (this.editType == "camera")
            {
                this.initUI();
                this.cameraView();
                this.cameraSnapper = new CameraSnapper();
                this.cameraSnapper.addEventListener(CameraSnapper.NOCAMERA, noCamera);
                this.cameraSnapper.init();
                this.cameraState.addChild(this.cameraSnapper);
                this.cameraSnapper.x = (this.stageWidth - this.cameraSnapper.width) / 2;
                this.cameraSnapper.y = 80;
                this.removeChild(this.mainLoading);
            }
            return;
        }// end function

        private function editSmall(param1:Event) : void
        {
            this.guideText.text = "拖动下方方框处,调整小头像显示";
            this.guideText.setTextFormat(this.guideTextFormat);
            this.editingSmall = true;
            this.smallThumbButton.active();
            this.bigThumbButton.deActive();
            this.smallEditWin.visible = true;
            this.bigEditWin.visible = false;
            if (this.smallEditWin.scaleRange < 0.1)
            {
                this.slideBar.disable();
                this.slideBar.alpha = 0;
            }
            else
            {
                this.slideBar.enable();
                this.slideBar.setRate(this.smallEditWin.scalePercent);
                this.slideBar.alpha = 1;
            }
            return;
        }// end function

        private function initListeners() : void
        {
            this.backBtn.addEventListener(MouseEvent.CLICK, backToCamera);
            this.snappBtn.addEventListener(MouseEvent.CLICK, snappCamera);
            this.previewBtn.addEventListener(MouseEvent.CLICK, previewAvatar);
            this.reEditBtn.addEventListener(MouseEvent.CLICK, reEdit);
            this.saveBtn.addEventListener(MouseEvent.CLICK, saveAvatar);
            this.slideBar.addEventListener(ProgressBar.BAR_SEEK, onSeek);
            this.slideBar.addEventListener(ProgressBar.SEEKING, onSeek);
            this.slideBar.addEventListener(ProgressBar.SEEK_END, onSeekEnd);
            this.restBtn.addEventListener(MouseEvent.CLICK, onReset);
            this.smallThumbButton.addEventListener(ThumbButton.CLICKED, editSmall);
            this.bigThumbButton.addEventListener(ThumbButton.CLICKED, editBig);
            this.smallEditWin.addEventListener(EditWindow.SNAP, onSmallSnap);
            this.bigEditWin.addEventListener(EditWindow.SNAP, onBigSnap);
            return;
        }// end function

        private function saveAvatar(param1:MouseEvent) : void
        {
            this.saveBtn.visible = false;
            this.savingBtn.visible = true;
            this.reEditBtn.visible = false;
            this.reEditDisBtn.visible = true;
            if (this.editType == "camera")
            {
                this.saveCameraSnap();
            }
            else
            {
                this.saveBig();
            }
            return;
        }// end function

        private function previewAvatar(param1:MouseEvent) : void
        {
            this.saveView();
            return;
        }// end function

        private function editPhoto() : void
        {
            this.editView();
            this.editState.addChild(this.smallEditWin);
            this.smallEditWin.edit(this.editData, 48, 48);
            this.editState.addChild(this.bigEditWin);
            this.bigEditWin.edit(this.editData, 165, 200);
            this.bigEditWin.x = this.smallEditWin.x;
            this.bigEditWin.y = this.smallEditWin.y;
            this.bigEditWin.forceScale(0);
            this.bigEditWin.setSnapp();
            this.smallEditWin.setPhotoScale(1);
            this.editSmall(null);
            return;
        }// end function

        private function saveBig() : void
        {
            var _loc_1:* = new BinaryTransfer(this.iconSaveUrl, "big", this.photoServer, "icon", this.photoId);
            _loc_1.addEventListener(BinaryTransfer.COMPLETE, onBigSaved);
            _loc_1.addEventListener(BinaryTransfer.ERROR, onSaveError);
            _loc_1.transferData(this.bigEditWin.thumbBmpData);
            return;
        }// end function

        private function onCameraSnapSaved(param1:Event) : void
        {
            this.photoServer = (param1.target as BinaryTransfer).pServer;
            this.photoId = (param1.target as BinaryTransfer).photoId;
            this.saveBig();
            return;
        }// end function

        private function onSmallSnap(param1:Event) : void
        {
            this.smallThumbButton.drawData(this.smallEditWin.thumbBmpData);
            return;
        }// end function

        private function onBigSaved(param1:Event) : void
        {
            this.photoServer = (param1.target as BinaryTransfer).pServer;
            this.saveSmall();
            return;
        }// end function

        private function cameraView() : void
        {
            this.editState.visible = false;
            this.previewState.visible = false;
            this.cameraState.visible = true;
            this.loading.hide();
            return;
        }// end function

        private function onSeekEnd(param1:Event) : void
        {
            if (this.editingSmall)
            {
                this.smallEditWin.setSnapp();
                return;
            }
            this.bigEditWin.setSnapp();
            return;
        }// end function

        private function onSaveError(param1:Event) : void
        {
            var _loc_2:* = (param1.target as BinaryTransfer).msg;
            this.reEdit(null);
            ExternalInterface.call("avatarError", _loc_2);
            return;
        }// end function

        private function backToCamera(param1:MouseEvent) : void
        {
            this.cameraView();
            return;
        }// end function

        private function saveSmall() : void
        {
            var _loc_1:* = new BinaryTransfer(this.iconSaveUrl, "small", this.photoServer, "icon", this.photoId);
            _loc_1.addEventListener(BinaryTransfer.COMPLETE, onSmallSaved);
            _loc_1.addEventListener(BinaryTransfer.ERROR, onSaveError);
            _loc_1.transferData(this.smallEditWin.thumbBmpData);
            return;
        }// end function

        private function editBig(param1:Event) : void
        {
            this.guideText.text = "拖动下方方框处,调整大头像显示";
            this.guideText.setTextFormat(this.guideTextFormat);
            this.editingSmall = false;
            this.bigThumbButton.active();
            this.smallThumbButton.deActive();
            this.smallEditWin.visible = false;
            this.bigEditWin.visible = true;
            if (this.bigEditWin.scaleRange < 0.1)
            {
                this.slideBar.disable();
                this.slideBar.alpha = 0;
            }
            else
            {
                this.slideBar.enable();
                this.slideBar.setRate(this.bigEditWin.scalePercent);
                this.slideBar.alpha = 1;
            }
            return;
        }// end function

        private function initUI() : void
        {
            this.editState.visible = false;
            this.cameraState.visible = false;
            this.previewState.visible = false;
            this.guideTextFormat = new TextFormat("Tahoma", 12, 10066329);
            this.guideTextFormat.align = TextFieldAutoSize.LEFT;
            this.guideText = new TextField();
            this.guideText.setTextFormat(this.guideTextFormat);
            this.guideText.text = "拖动下方方框处,调整小头像显示";
            this.guideText.mouseEnabled = false;
            this.guideText.x = 60;
            this.guideText.y = 8;
            this.guideText.width = this.guideText.textWidth + 8;
            this.editState.addChild(this.guideText);
            this.createEditWin();
            this.slideBtn = new SlideBtn();
            this.slideBarMid = new SlideBarBg();
            this.slideBarBg = new SlideBarBg();
            this.leftIcon = new LeftIcon();
            this.rightIcon = new RightIcon();
            this.slideBar = new ProgressBar(this.slideBtn, this.slideBarMid, this.slideBarBg, 7, this.leftIcon, this.rightIcon);
            this.editState.addChild(this.slideBar);
            this.thumbnailWin.visible = true;
            this.editState.addChild(this.thumbnailWin);
            this.slideBar.x = 36;
            this.slideBar.y = 373;
            this.backBtn = new BackBtn();
            this.previewBtn = new PreviewBtn();
            this.snappBtn = new SnappBtn();
            this.snappDisBtn = new SnappDisBtn();
            this.reEditBtn = new ReEditBtn();
            this.reEditDisBtn = new ReEditDisBtn();
            this.saveBtn = new SaveBtn();
            this.savingBtn = new SavingBtn();
            this.resetBtn = new ResetBtn();
            this.restBtn = new RestBtn();
            this.editState.addChild(this.backBtn);
            this.cameraState.addChild(this.snappDisBtn);
            this.cameraState.addChild(this.snappBtn);
            this.editState.addChild(this.previewBtn);
            this.editState.addChild(this.restBtn);
            this.previewState.addChild(this.reEditDisBtn);
            this.previewState.addChild(this.reEditBtn);
            this.previewState.addChild(this.saveBtn);
            this.previewState.addChild(this.savingBtn);
            this.savingBtn.mouseChildren = false;
            this.reEditDisBtn.mouseChildren = false;
            var _loc_1:* = new TextFormat();
            _loc_1.bold = true;
            var _loc_2:* = new TextField();
            _loc_2.text = "系统为你生成两种尺寸的头像";
            _loc_2.setTextFormat(_loc_1);
            _loc_2.width = 100;
            _loc_2.autoSize = TextFieldAutoSize.LEFT;
            _loc_2.textColor = 10066329;
            _loc_2.mouseEnabled = false;
            _loc_2.x = 12;
            _loc_2.y = 25;
            this.previewState.graphics.lineStyle(1, 13819365);
            this.previewState.graphics.moveTo(15, 55);
            this.previewState.graphics.lineTo(498, 55);
            this.previewState.addChild(_loc_2);
            this.backBtn.x = 297;
            this.backBtn.y = 428;
            this.snappBtn.x = (this.stageWidth - this.snappBtn.width) / 2;
            this.snappBtn.y = 428;
            this.snappDisBtn.x = this.snappBtn.x;
            this.snappDisBtn.y = this.snappBtn.y;
            this.previewBtn.x = (this.stageWidth - this.previewBtn.width) / 2;
            this.previewBtn.y = 428;
            this.restBtn.x = 276;
            this.restBtn.y = 373;
            this.reEditBtn.x = 256;
            this.reEditBtn.y = 428;
            this.reEditDisBtn.x = this.reEditBtn.x;
            this.reEditDisBtn.y = this.reEditBtn.y;
            this.reEditDisBtn.visible = false;
            this.saveBtn.x = 178;
            this.saveBtn.y = 428;
            this.savingBtn.x = this.saveBtn.x;
            this.savingBtn.y = this.saveBtn.y;
            this.largeThumb = new PhotoThumb(165, 200, "你的大头像(将显示在个人主页)");
            this.smallThumb = new PhotoThumb(48, 48, "你的小头像");
            this.previewState.addChild(this.largeThumb);
            this.previewState.addChild(this.smallThumb);
            this.smallThumbButton = new ThumbButton(48, 48, "小头像预览");
            this.smallThumbButton.drawData(new BitmapData(48, 48, false, 13421772));
            this.bigThumbButton = new ThumbButton(165, 200, "大头像预览");
            this.bigThumbButton.drawData(new BitmapData(165, 200, false, 13421772));
            this.bigThumbButton.y = this.smallThumbButton.height + 20;
            this.thumbnailWin.addChild(this.smallThumbButton);
            this.thumbnailWin.addChild(this.bigThumbButton);
            this.thumbnailWin.x = 514 - this.thumbnailWin.width - 12;
            this.thumbnailWin.y = 30;
            this.largeThumb.x = 231;
            this.largeThumb.y = 85;
            this.smallThumb.x = 73;
            this.smallThumb.y = 85;
            this.initListeners();
            return;
        }// end function

        private function drawBg() : void
        {
            this.graphics.beginFill(13623017);
            this.graphics.drawRect(0, 413, 514, 53);
            this.graphics.endFill();
            return;
        }// end function

        private function noCamera(param1:Event) : void
        {
            this.loading.show("未检测到可用摄像头，试试用其他方式上传", false);
            this.snappDisBtn.visible = true;
            this.snappBtn.visible = false;
            return;
        }// end function

        private function onReset(param1:MouseEvent) : void
        {
            if (this.editingSmall)
            {
                this.slideBar.setRate(1);
                this.smallEditWin.reset();
            }
            else
            {
                this.slideBar.setRate(0);
                this.bigEditWin.forceScale(0);
            }
            return;
        }// end function

        private function saveView() : void
        {
            this.reEditBtn.visible = true;
            this.reEditDisBtn.visible = false;
            this.editState.visible = false;
            this.previewState.visible = true;
            this.cameraState.visible = false;
            this.saveBtn.visible = true;
            this.savingBtn.visible = false;
            this.largeThumb.display(this.bigEditWin.thumbBmpData);
            this.smallThumb.draw(this.smallEditWin.thumbBmpData);
            return;
        }// end function

        private function snappCamera(param1:MouseEvent) : void
        {
            this.cameraSnapper.getEditSource();
            this.editData = this.cameraSnapper.editData;
            this.editPhoto();
            return;
        }// end function

        private function onEditData(param1:Event) : void
        {
            this.editData = param1.target.editData as BitmapData;
            this.editPhoto();
            this.removeChild(this.mainLoading);
            return;
        }// end function

        private function editView() : void
        {
            this.editState.visible = true;
            this.previewState.visible = false;
            this.cameraState.visible = false;
            if (this.editType == "camera")
            {
                this.backBtn.visible = true;
            }
            else
            {
                this.backBtn.visible = false;
            }
            this.loading.hide();
            return;
        }// end function

        private function reEdit(param1:MouseEvent) : void
        {
            this.editView();
            return;
        }// end function

        private function saveCameraSnap() : void
        {
            var _loc_1:* = new BinaryTransfer(this.cameraSnapSaveUrl, "camera", "", "album");
            _loc_1.addEventListener(BinaryTransfer.COMPLETE, onCameraSnapSaved);
            _loc_1.addEventListener(BinaryTransfer.ERROR, onSaveError);
            _loc_1.transferData(this.cameraSnapper.editData);
            return;
        }// end function

        private function createEditWin() : void
        {
            this.smallEditWin = new EditWindow(null, 280, 330, 100, 100);
            this.smallEditWin.x = 20;
            this.smallEditWin.y = 32;
            this.bigEditWin = new EditWindow(null, 280, 330, 165, 200);
            this.bigEditWin.x = 20;
            this.bigEditWin.y = 32;
            return;
        }// end function

        private function onSmallSaved(param1:Event) : void
        {
            var _loc_2:* = (param1.target as BinaryTransfer).msg;
            ExternalInterface.call("avatarSaved", _loc_2);
            return;
        }// end function

    }
}
