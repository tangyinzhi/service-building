var picturesBalloons = null; //编辑对话框、截屏出图等
var htmlBalloonMove = null; //气泡
var Stamp = null;
var earthToolsDiv = $("#earthTools"); //工具栏
/*********************************全局方法 START*******************************************/
/**
 * 显示气泡（截屏、出图、旋转、缩放、移动）
 * @param  {[type]} tag           [气泡类型]
 * @param  {[type]} sAltitudeType [渲染模式：正常、贴地、贴模型]
 * @return {[type]}               [description]
 */
function pictureHtml(tag, sAltitudeType) {
    var loaclUrl = window.location.href.substring(0, window.location.href.lastIndexOf("/"));
    var url = "";
    var dval;
    var width = 270,
        height = 240;
    if (tag === "mScreenShot") { //截屏
        url = loaclUrl + "/html/view/screenShot.html";
        dval = earth;
        height = 260;
        width = 355;
    } else if (tag === "pictures") { //出图
        url = loaclUrl + "/html/view/pictures.html";
        dval = earth;
        height = 395;
        width = 413;
    } else if (tag === "move") { //移动
        url = loaclUrl + "/html/userdata/objectEdit.html?action=move";
        dval = earth;
        height = 226;
        width = 274;
        dval.cameraArr = cameraArr;
        dval.editDataArr = editDataArr;
    } else if (tag === "scale") { //缩放
        url = loaclUrl + "/html/userdata/objectEdit.html?action=scale";
        dval = earth;
        height = 226;
        width = 274;
        dval.cameraArr = cameraArr;
        dval.editDataArr = editDataArr;
    } else if (tag === "rotate") { //旋转
        url = loaclUrl + "/html/userdata/objectEdit.html?action=rotate";
        dval = earth;
        height = 226;
        width = 274;
        dval.cameraArr = cameraArr;
        dval.editDataArr = editDataArr;
    }
    clearGlobalBalloons(); //弹出气泡前先清除之前的全局气泡
    picturesBalloons = earth.Factory.CreateHtmlBalloon(earth.Factory.CreateGuid(), "屏幕坐标窗体URL");
    //picturesBalloons.SetScreenLocation(width / 2 + 520, 0);
    //邓杰
    picturesBalloons.SetScreenLocation(1920, 20);
    picturesBalloons.SetRectSize(width, height);
    picturesBalloons.SetIsAddBackgroundImage(false);
    picturesBalloons.ShowNavigate(url);

    //加载页面内容，传入外部参数
    earth.Event.OnDocumentReadyCompleted = function (guid) {
        dval.htmlBallon = picturesBalloons; //气泡对象传入页面中
        if (picturesBalloons.Guid = guid) {
            picturesBalloons.InvokeScript("setTranScroll", dval);
            picturesBalloons.InvokeScript("altitudetype", sAltitudeType);
        }
    };
};


/**
 * 清除全局气泡
 * @return {[type]} [description]
 */
function clearGlobalBalloons() {
    if (picturesBalloons != null) {
        picturesBalloons.DestroyObject();
        picturesBalloons = null;
    }
    if (htmlBalloonMove != null) {
        htmlBalloonMove.DestroyObject();
        htmlBalloonMove = null;
    }
}

/**
 * 定义气泡对象，包含气泡样式设置的诸多方法
 */
var BalloonHtml = {
    itemClickStyle: function (id) {

        var thisObject = earthToolsDiv.find("#" + id).find("img");
        var flag = thisObject.attr("isChecked");
        if (flag) {
            thisObject.removeAttr("isChecked");
            //thisObject.attr("src", thisObject.attr("src").replace("active", "normal"));
            earthToolsDiv.find("#" + id).find("span").css("color", "#fff");
        } else {
            thisObject.attr("isChecked", true);
            //thisObject.attr("src", thisObject.attr("src").replace("normal", "active"));
            earthToolsDiv.find("#" + id).find("span").css("color", "#08f6fc");
        }
        return !flag;
    },
    getItemStyle: function (id) {
        var thisObject = earthToolsDiv.find("#" + id).find("img");
        var flag = thisObject.attr("isChecked");
        return !flag;
    },
    setItemStyle: function (id) {
        var thisObject = earthToolsDiv.find("#" + id).find("img");
        thisObject.attr("isChecked", true);
        thisObject.attr("src", thisObject.attr("src").replace("normal", "active"));
        earthToolsDiv.find("#" + id).find("span").css("color", "#08f6fc");
    },
    removeItemStle: function (id) {
        var thisObject = earthToolsDiv.find("#" + id).find("img");
        if (thisObject.attr("isChecked")) {
            thisObject.removeAttr("isChecked");
            thisObject.attr("src", thisObject.attr("src").replace("active", "normal"));
            earthToolsDiv.find("#" + id).find("span").css("color", "#fff");
        }
    }
}
/**
 * 定义三级菜单对象，包含对菜单点击样式设置事件
 */
var ThreeMenu = {
    itemClickStyle: function (id) {
        var effctArr = ["EffectRain", "EffectSnow", "EffectFog"];
        if ($.inArray(id, effctArr) >= 0) {
            if (earthToolsDiv && earthToolsDiv.find("#ViewTranSetting").attr("isChecked")) {
                earthToolsDiv.find("#ViewTranSetting").attr("isChecked", false);
                earthToolsDiv.find("#ViewTranSetting").removeAttr("isChecked");
                earthToolsDiv.find("#ViewTranSetting").find("img").attr("src", earthToolsDiv.find("#ViewTranSetting").find("img").attr("src").replace("active", "normal"));
            }
        }
        var thisObject = window.frames["operator"].$("#" + id);
        var thisImgSrc = thisObject.attr("src");
        var activeIndex = thisImgSrc.indexOf("/active");
        if (activeIndex > 0) {
            var imgSrcNow = thisImgSrc.replace("/active", "/inactive");
            thisObject.attr("src", imgSrcNow);
            return false;
        } else {
            var imgSrcNow = thisImgSrc.replace("/inactive", "/active");
            thisObject.attr("src", imgSrcNow);
            return true;
        }
    },
    setClickStyle: function (id) {
        var thisObject = window.frames["operator"].$("#" + id);
        if (thisObject.length < 1) {
            return;
        }
        var thisImgSrc = thisObject.attr("src");
        var activeIndex = thisImgSrc.indexOf("/inactive");
        if (activeIndex > 0) {
            var imgSrcNow = thisImgSrc.replace("/inactive", "/active");
            thisObject.attr("src", imgSrcNow);
        }
    },
    removeClickStyle: function (id) {
        var thisObject = window.frames["operator"].$("#" + id);
        if (thisObject.length < 1) {
            return;
        }
        var thisImgSrc = thisObject.attr("src");
        var activeIndex = thisImgSrc.indexOf("/active");
        if (activeIndex > 0) {
            var imgSrcNow = thisImgSrc.replace("/active", "/inactive");
            thisObject.attr("src", imgSrcNow);
        }
    },
    getClickStyle: function (id) {
        var thisObject = window.frames["operator"].$("#" + id);
        var thisImgSrc = thisObject.attr("src");
        var activeIndex = thisImgSrc.indexOf("/active");
        if (activeIndex > 0) {
            return true;
        } else {
            return false;
        }
    }
}

/*
 * 控制是否显示Slider
 */
function setSlidersVisible(flag) {
    earth.Event.OnGUISliderChanged = function () {
    };
    var st = [{
        id: 'ViewTranSetting',
        type: 'transparency'
    }, {
        id: 'EffectRain',
        type: 'rain'
    }, {
        id: 'EffectSnow',
        type: 'snow'
    }, {
        id: 'EffectFog',
        type: 'fog'
    }, {
        id: 'layerTrans',
        type: 'layerTrans'
    }];

    sliderMgr.init(earth, false, function (type) {
        for (var i in st) {
            if (st[i].type == type) {
                Tools.groupItemCancel(st[i].id);
                if (type == "transparency") {
                    ViewTranSettingBtn = false;
                    BalloonHtml.removeItemStle(st[i].id);
                } else if (type == "layerTrans") {
                    BalloonHtml.removeItemStle(st[i].id);
                } else {
                    try {
                        var thisObject = window.frames["operator"].$("#" + st[i].id);
                        if (thisObject.length < 1) {
                            return;
                        } else {
                            ThreeMenu.removeClickStyle(st[i].id);
                        }
                    } catch (e) {

                    }

                }
            }
        }
    });

    for (var i = 0; i < st.length; i++) {
        sliderMgr.setVisible(st[i].type, flag & Math.pow(2, i));
    }
};
/**
 * 定义工具对象
 */
var Tools = {
    setDisabled: function (id) {
        $("#" + id).addClass("disable");
        $("#" + id).attr("disabled", true);
        disabledButtonArr.push(id);
    },
    disableSingle: function (id) {
        if ($.inArray(id, disabledButtonArr) >= 0) {
            return;
        }
        $("#" + id).addClass("disable");
        $("#" + id).attr("disabled", true);
    },
    cancelDisSingle: function (id) {
        if ($.inArray(id, disabledButtonArr) >= 0) {
            return;
        }
        $("#" + id).removeClass("disable");
        $("#" + id).attr("disabled", false);
    },
    disabledAll: function (nonDisArr) {
        var aList = $("#toolBar_ios button");
        var len = aList.length;
        for (var i = 0; i < len; i++) {
            if ($.inArray(aList[i].getAttribute("id"), nonDisArr) < 0) {
                var thisId = aList[i].getAttribute("id")
                aList[i].setAttribute("disabled", true);
                $("#" + thisId).addClass("disable");
            } else {
                continue;

            }
        }
    },
    cancelDisabled: function (disArr) {
        var aList = $("#toolBar_ios button");
        var len = aList.length;
        for (var i = 0; i < len; i++) {
            if ($.inArray(aList[i].getAttribute("id"), disArr) < 0) {
                aList[i].removeAttribute("disabled");
                aList.removeClass("disable");
            } else {
                continue;
            }
        }
    },
    groupItemSelected: function (id, num) {
        var idArray = ["ViewTranSetting", "EffectRain", "EffectSnow", "EffectFog"];
        var showMode = ["ViewMaterialShowing", "ViewStandardColorShowing", "ViewCustomColorShowing"];
        var selectArray = '';
        if (num == 1) {
            selectArray = idArray;
        } else if (num == 2) {
            selectArray = showMode;
        }
        var len = selectArray.length;
        for (var i = 0; i < len; i++) {
            if (selectArray[i] == id) {
                $("#" + id).addClass('selected');
                $("#" + id).addClass('selectedStyle');
                $("#" + id).removeClass('defaultStyle');
            } else {
                $('#' + selectArray[i]).removeClass('selected');
                $('#' + selectArray[i]).removeClass('selectedStyle');
                $('#' + selectArray[i]).addClass('defaultStyle');
            }
        }
    },
    groupItemCancel: function (id) { // 取消选中状态之后的样式
        $("#" + id).removeClass('selected');
        $("#" + id).removeClass('selectedStyle');
        $("#" + id).add('defaultStyle');
    },
    toolBarGroupClick: function (command, num) {
        if ($("#" + command).hasClass('selected')) {
            Tools.groupItemCancel(command);
            return false;
        } else {
            Tools.groupItemSelected(command, num);
            return true;
        }
    },
    singleItemSelected: function (id) {
        $("#" + id).addClass('selected');
    },
    singleItemCancel: function (id) {
        $("#" + id).removeClass('selected');
    },
    singleSelectedStyle: function (id) {
        $("#" + id).addClass('selected');
        $("#" + id).addClass('selectedStyle');
    },
    singleStyleCancel: function (id) {
        $("#" + id).removeClass('selected');
        $("#" + id).removeClass('selectedStyle');
    },
    toolBarItemClick: function (command) {
        if ($("#" + command).hasClass('selected')) {
            $("#" + command).removeClass('selected');
            return false;
        } else {
            $("#" + command).addClass('selected');
            return true;
        }
    },
    toolBarItemClickStyle: function (command) {
        if ($("#" + command).hasClass('selected') || (earthToolsDiv && earthToolsDiv.find("#" + command).attr("isChecked"))) {
            $("#" + command).removeClass('selected');
            $("#" + command).removeClass('selectedStyle');
            return false;
        } else {
            $("#" + command).addClass('selected');
            $("#" + command).addClass('selectedStyle');
            return true;
        }
    },
    legendShowClick: function () {
        var showMode = ["ViewMaterialShowing", "ViewStandardColorShowing", "ViewCustomColorShowing"];
        for (var i = 0; i < showMode.length; i++) {
            if ($("#" + showMode[i]).hasClass("selected")) {
                return showMode[i];
            }
        }
    },
    getTransparency: function () {
        var toolTransObject = $("#ViewTranSetting");
        return toolTransObject;
    }
};
