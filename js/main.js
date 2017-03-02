/**
 * Created by Administrator on 2017/2/16.
 */

$(function () {
    var myCanvas = document.getElementById('c');
    myCanvas.width = screen.availWidth;
    myCanvas.height = screen.availHeight;
    var _scale_x = screen.availWidth/375;
    var _scale_h = screen.availHeight/667;

    var ratio = parseInt(window.devicePixelRatio);
    var canvas =  new fabric.Canvas('c');
    var left_person = null, right_person = null, left_text=null, right_text=null, globalkey = -1, cropper = null;
    var isDel = [0,0];  //isDel用来标注是否图片已填充过
    var g_imgArr = [],g_polyArr=[],g_textArr=[];
    var hasRequest = false; //防二次点击

    //设置一些全局的属性
    //fabric.Object.prototype.transparentCorners = false; //显示拖拽的角是否为实心
    //fabric.Object.prototype.cornerSize = 30;    //拖拽角的大小
    fabric.Object.prototype.set({
        transparentCorners: false,
        cornerColor: 'rgba(102,153,255,0.5)',
        cornerSize: 20,
        selectable:false
    });
    //fabric.Object.prototype.selectable = false;   //是否可以拖拽

    //取得层级
    fabric.Object.prototype.getZIndex = function() {
        return this.canvas.getObjects().indexOf(this);
    };
    //设置层级
    //There's no way to retrieve z-index of an object via get('zindex').
    // However, there are 4 methods for zIndex manipulation of objects:
    // canvas.sendBackwards, canvas.sendToBack, canvas.bringForward, and canvas.bringToFront.
    fabric.Canvas.prototype.addToPosition = function(object,position) {
        this.add(object);
        while(object.getZIndex() > position) {
            this.sendBackwards(object);
        }
    };

    //左边的人物
    function addLeftPerson(url){
        fabric.Image.fromURL(url, function(img) {
            img.scaleToWidth(screen.availWidth/2);
            left_person = img;
            canvas.addToPosition(img, 0);
        });
    }

    //右边的人物
    function addRightPerson(url){
        fabric.Image.fromURL(url, function(img) {
            img.scaleToWidth(screen.availWidth/2).set({
                left: screen.availWidth/2,
                top: 0,
                angle: 0
            });
            right_person = img;
            canvas.addToPosition(img, 1);
        });
    }

    //加图片
    function addImg(url,args){
        fabric.Image.fromURL(url, function(img) {
            img.scale(0.5).set(args);
            g_imgArr.push(img);
            if(url == "image/4.jpg"){
                canvas.addToPosition(img,2);
            }else{
                canvas.addToPosition(img,5);
            }

        });
    }

    //"我是红毯创始人高海韵"
    function addText1(str){
        left_text = new fabric.Text(str, {
            fontSize:12*_scale_x,
            left:5,
            top:432*_scale_h,
            fill: "#FFFFFF",
        });
        canvas.add(left_text);
    }

    //"我也是机车疯狂爱好者"
    function addText2(str){
        right_text = new fabric.Text(str, {
            fontSize:12*_scale_x,
            left:213*_scale_x,
            top:316*_scale_h,
            fill: "#FFFFFF",
        });
        canvas.add(right_text);
    }

    function addPoly(){
        var poly1 = new fabric.Polygon([
            {x: 0, y: 0},
            {x: 178*_scale_x, y: 0},
            {x: 160*_scale_x, y: 27*_scale_h},
            {x: 0, y: 27*_scale_h} ], {
            left: 0,
            top: 425*_scale_h,
            opacity:0,
            fill: "rgba(0,0,0,.5)"
        });
        g_polyArr.push(poly1);
        canvas.add(poly1);

        var poly2 = new fabric.Polygon([
            {x: 0, y: 0},
            {x: 178*_scale_x, y: 0},
            {x: 178*_scale_x, y: 27*_scale_h},
            {x: 18*_scale_x, y: 27*_scale_h} ], {
            left: 195*_scale_x,
            top: 308*_scale_h,
            opacity:0,
            fill: "rgba(0,0,0,.5)"
        });
        g_polyArr.push(poly2);
        canvas.add(poly2);
    }

    //立即生成
    function saveImg(){
        var _image = canvas.toDataURL({
            format: 'jpeg',
            quality: 0.6
        });
        $.ajax({
            type: 'POST',
            url: 'http://www.recachina.com/tv_test/anniversary',
            // post payload:
            data: {image:_image},
            success: function(data){
                if(data.path){
                    sessionStorage.setItem('red_result', data.path);
                    window.location.href= "result.html?url="+data.path;
                }else{
                    alert("生成失败，请重试！");
                }
                hasRequest = false;
            },
            error: function(xhr, type){
                alert("生成失败，请重试！");
                hasRequest = false;
            }
        });
        /*console.log('export image');
        if (!fabric.Canvas.supports('toDataURL')) {
            alert('This browser doesn\'t provide means to serialize canvas to an image');
        }
        else {
            //window.open(myCanvas.toDataURL('png'));
            var image = canvas.toDataURL({
                format: 'jpeg',
                quality: 1
            });
            sessionStorage.setItem('red_result', image);
            //setTimeout(function(){
                window.location.href= "result.html";
            //},500);
        }*/

    }


    function initInfo(){
        var top_height = screen.availWidth*470/375;
        $(".js-topArea").css("height", top_height);
        $(".js-container,.js-loading").css("height", screen.availHeight);
        $(".js-showarea").css("height",screen.availHeight/667*500);
        $(".js-right-carema").css("left",screen.availWidth*14/375);
        addLeftPerson('image/1.jpg');
        addRightPerson('image/2.jpg');
        setTimeout(function(){
            //红色条
            addImg('image/4.jpg',{
                left:0,
                top:470*_scale_h,
                width:750*_scale_x,
                height:392*_scale_h,
                opacity:0
            });
            setTimeout(function () {    //因为层级的关系，稍延迟下
                //"另一面的我，另一种精彩"
                addImg('image/3.png',{
                    left:122*_scale_x,
                    top:284*_scale_h,
                    width:513*_scale_x,
                    height:546*_scale_h,
                    opacity:0
                });
            },1000);

            addPoly();  //文字下面的多边形
        },10)
    }

    function keyEvent(){
        //到编辑图片
        $(".js-gotocrop").off("click").on("click", function(){
            $("body").scrollTop(0);
            var key = $(this).data("key");
            globalkey = key;
            $(".js-upload")[0].click();
            loadImage.upload({
                domid: "upfile",
                multiple: false,
                before: function(){console.log("before");},
                fail: function(failMsg,file){console.log("fail",failMsg,file);},
                success: function(dataURL,file){
                    $(".js-container").removeClass("hide");
                    $(".js-showimg").attr("src", dataURL);
                    var image = document.querySelector('#image');
                    cropper = new Cropper(image, {
                        viewMode:0,
                        dragMode: 'move',
                        aspectRatio: 2 / 5,
                        restore: false,
                        guides: false,
                        center: false,
                        highlight: false,
                        cropBoxMovable: false,
                        cropBoxResizable: false,
                        toggleDragModeOnDblclick: false,

                        crop: function(e) {
                            console.log(e.detail.x);
                            console.log(e.detail.y);
                            console.log(e.detail.width);
                            console.log(e.detail.height);
                            console.log(e.detail.rotate);
                            console.log(e.detail.scaleX);
                            console.log(e.detail.scaleY);
                        }

                    });
                },
                complete: function(){console.log("complete");},
                progress: function(total,remainder){console.log("progress",total,remainder);},
                uploadAction: function(fileData){
                    //console.log(fileData);
                    var defer = $.Deferred();
                    defer.resolve(fileData);
                    return defer.promise();
                },
                type: 'image/jpeg',
                quality: 0.5,
                dataType: 'base64',
            });

        });

        //输入框的内容记sessionStorage
        $(".js-input").change(function(){
            var key = $(this).data("key");
            var val = $(this).val();
            if(key == 1){
                sessionStorage.setItem("text_1", val);
            }else{
                sessionStorage.setItem("text_2", val);
            }
        });

        //点击图片删除按钮
        $(".js-del").off("click").on("click", function(){
            var key = $(this).data("key");
            if(key == 1){   //删除最左边的图片
                canvas.remove(left_person);
                canvas.renderAll();
                addLeftPerson('image/1.jpg');
                isDel[0] = 0;
                $(".js-topArea-con").eq(0).removeClass("v_hide");
                $(".js-delArea-con").eq(0).addClass("v_hide");
            }else{  //删除最右边的图片
                canvas.remove(right_person);
                canvas.renderAll();
                addRightPerson('image/2.jpg');
                isDel[1] = 0;
                $(".js-topArea-con").eq(1).removeClass("v_hide");
                $(".js-delArea-con").eq(1).addClass("v_hide");
            }
            //$(".js-topArea").removeClass("v_hide");
            //$(".js-delArea").addClass("hide");
        });

        //立即生成
        $(".js-generater").off("click").on("click", function(){
            if(hasRequest) return;
            else{
                hasRequest = true;
            }
            var text1 = sessionStorage.getItem("text_1");
            if(!text1){
                alert("请输入自我介绍");
                hasRequest = false;
                return;
            }
            if(text1 && text1.length < 3){
                alert('自我介绍最少三个字');
                hasRequest = false;
                return;
            }
            var text2 = sessionStorage.getItem("text_2");
            if(!text2){
                alert("请输入另一面的自我介绍");
                hasRequest = false;
                return;
            }
            if(text2.length < 3){
                alert('另一面自我介绍最少三个字');
                hasRequest = false;
                return;
            }
            if(isDel[0] == 0){
                alert('上传你的日常照片');
                hasRequest = false;
                return;
            }
            if(isDel[1] == 0){
                alert('上传能够展现你另一面的照片');
                hasRequest = false;
                return;
            }
            $(".js-loading").removeClass("hide");
            g_polyArr[0].setOpacity(1);
            g_polyArr[1].setOpacity(1);
            addText1(text1);
            addText2(text2);
            g_imgArr[0].setOpacity(1);
            g_imgArr[1].setOpacity(1);
            canvas.renderAll();

            //$(".js-mainPage").addClass("hide");
            saveImg();
        });

        //保存切片
        $(".js-save").off("click").on("click", function(){
            var data = cropper.getCroppedCanvas().toDataURL({width:750, height:940});
            if(globalkey == 1){
                canvas.remove(left_person);
                canvas.renderAll();
                addLeftPerson(data);
                isDel[0] = 1;
                $(".js-topArea-con").eq(0).addClass("v_hide");
                $(".js-delArea-con").eq(0).removeClass("v_hide");
            }else{
                canvas.remove(right_person);
                canvas.renderAll();
                addRightPerson(data);
                isDel[1] = 1;
                $(".js-topArea-con").eq(1).addClass("v_hide");
                $(".js-delArea-con").eq(1).removeClass("v_hide");
            }
            $(".js-container").addClass("hide");
            $(".js-showarea").html('<img id="image" src="" class="js-showimg" alt="Picture">');

        });
    }

    function init() {
        initInfo();
        keyEvent();
    }

    init();
})
