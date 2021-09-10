/**
 * 作    者：StampGIS Team
 * 创建日期：2017年9月20日
 * 描    述：三维球加载
 * 遗留bug ：无
 * 修改日期：2017年11月7日
 **************************************************/
layui.use('element', function () {
    var element = layui.element;
});
var leftMenuBalloon = null;
var windowUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/'));
var params = {
    ip: "http://192.168.30.34", //加载球地址
    screen: 0, //数据配置文件索引
    transparency: 100, //球透明度（1-100)
    username: "", //权限用户名
    password: "", //权限密码
    token: "" //权限秘钥
};
var names = ["基础数据", "global", "vector", "diji", "shengji", "xianji", "Dommodel", "dem_globe_v7", , "123", "polyline", "poi_new",
    "dom_globe_v5", "luzhouPipeLine", "dom", "ctqx", "fc_n", "jingxiu_n", "poi",
    "ct0816qx", "qx1028", "qx0814qx", "qx0818qx"];

/**
 * 文档加载完成之后加载三维球
 */
$(document).ready(function () {
    loadEarthData(params.screen);
});

/**
 * 加载三维球
 * @param  {[type]} earthObj [球对象]
 * @param  {[type]} screen   [第一个数据源data.data:从0开始]
 * @return {[type]}          [无]
 */
function loadEarth(earthObj, screen) {
    var stampConfig = '<?xml version="1.0" encoding="gbk"?>';
    //var stampConfig = '';
    stampConfig += '<xml>';
    stampConfig += '<Config>' + screen + '</Config>';
    stampConfig += '<UserName>' + params.username + '</UserName>';
    stampConfig += '<PassWord>' + params.password + '</PassWord>';
    stampConfig += '<Token>' + params.token + '</Token>';
    stampConfig += '</xml>';
    earthObj.Load_s(params.ip, stampConfig);
}

var earth = null; //全局earth
function contains(arr, obj) {
    //while
    if (arr != null && Array.isArray(arr)) {
        var i = arr.length;

        while (i--) {
            if (arr[i] === obj) {
                return i;
            }
        }
        return -1;
    }
}


/**
 * 加载data.data
 * @param  {[number]} screen [第几份数据,对应stampmanager的data.data的配置,从0开始]
 */
function loadEarthData(screen) {
    $("#earthDiv").html("");
    var ieVersion = window.navigator.platform;
    var stampCAB = 'codebase="stamp/stamp32.CAB#version=3,1,1,1"'; //32位cab包，版本：4.1客户端
    if (ieVersion == "Win64") {
        stampCAB = 'codebase="stamp/stamp64.CAB#version=3,1,1,1"'; //64位cab包，版本：4.1客户端
    }
    $("#earthDiv").html('<object style="height:100%;width:100%;" id="seearth" ' +
        'classid="clsid:EA3EA17C-5724-4104-94D8-4EECBD352964" ' +
        'data="data:application/x-oleobject;base64,Xy0TLBTXH0q8GKFyFzl3vgAIAADYEwAA2BMAAA==" ' + stampCAB +
        'width="100%" height="100%"></object>');
    var _position = [105.419425, 28.897896, 0, 0, 32, 0, 1000];
    // $("#earthDiv").html('<object id="earth" ' +
    //     'classid="clsid:EA3EA17C-5724-4104-94D8-4EECBD352964" ' +
    //     'data="data:application/x-oleobject;base64,Xy0TLBTXH0q8GKFyFzl3vgAIAADYEwAA2BMAAA==" ' +
    //     'width="100%" height="100%"></object>');
    // var seearth = document.getElementById("earth");

    if (seearth == undefined || seearth.Event == undefined) {
        alert("三维地球加载失败，请检查客户端插件是否安装正常，ActiveX控件加载是否设置为允许！");
        return;
    }

    /**
     * 三维球创建完成回调
     */
    seearth.Event.OnCreateEarth = function () {
        loadEarth(seearth, screen);
        var stampConfig = '<xml><Config>0</Config></xml>';
        //seearth.Load_s("http://192.168.30.34", stampConfig);
        top.loadData = screen;
        var height = $(document).height() - 4;
        //右键事件注销
        seearth.oncontextmenu = function () {
            return false;
        }

        seearth.Event.OnDocumentChanged = function (type, guid) {
            if (type == 1) {
                var transparency = parseInt(params.transparency) >= 0 ? parseInt(params.transparency) : 100;
                seearth.Environment.TerrainTransparency = transparency / 100 * 255;
                initLayerDataType(seearth, null);
                seearth.Environment.Thumbnail = false;
                seearth.GlobeObserver.GotoLookat(_position[0], _position[1], _position[2], _position[3], _position[4], _position[5], _position[6]);
            } else if (type == 0) {
                alert("请检查是否启用了服务权限控制");
            }
        };
        //_createLayerTreeData(null);

        showLeftMenu();

    };
    earth = seearth;
    /*
             * （递归）初始化图层Search的返回类型值：
             * 1是xml，4是xmlwithmesh，5是json，6是jsonwithmesh
             */
    var initLayerDataType = function (earth, layer) {
        if (layer == null) {
            layer = earth.LayerManager.LayerList;
        }

        var childCount = layer.GetChildCount();
        for (var i = 0; i < childCount; i++) {
            var childLayer = layer.GetChildAt(i);
            if (childLayer.LocalSearchParameter != null) {
                if (childLayer.LayerType == 'POI') {//除了POI是没有mesh的，其他都是有mesh的，所以：POI用1，其他图层用4
                    childLayer.LocalSearchParameter.ReturnDataType = 1;
                } else {
                    childLayer.LocalSearchParameter.ReturnDataType = 4;
                }
            }
            if (childLayer.GetChildCount() > 0) {
                initLayerDataType(earth, childLayer);
            }
        }
    };

}

//弹出左侧菜单透明气泡
function showLeftMenu() {
    leftMenuBalloonDestroyObject();
    leftMenuBalloon = earth.Factory.CreateHtmlBalloon(earth.Factory.CreateGuid(), '左侧菜单');
    leftMenuBalloon.SetScreenLocation(0, 10);//指定屏幕坐标显示
    leftMenuBalloon.SetRectSize(90, 570);//窗口宽度（像素）
    leftMenuBalloon.SetIsAddCloseButton(false);//气泡是否添加关闭按钮
    leftMenuBalloon.SetIsAddMargin(true);//气泡是否添加圆弧边
    leftMenuBalloon.SetIsAddBackgroundImage(true);//气泡是否添加背景图片
    leftMenuBalloon.SetIsTransparence(false);//气泡是否透明
    leftMenuBalloon.SetBackgroundAlpha(0);//指定背景图片alpha值
    // LayerManagement.secondBallon .SetHtmlFilterColor(0xffffff);

    var url = windowUrl + '/Views/mapHtml/earthTools.html';
    //alert(url);
    leftMenuBalloon.ShowNavigate(url);//显示Html网页
    //气泡加载完成事件
    earth.Event.onDocumentReadycompleted = function (guid) {
        earth.leftMenuBalloon = leftMenuBalloon;//传值
        earth.params = params;//传值
        if (leftMenuBalloon.Guid == guid) {
            leftMenuBalloon.InvokeScript("getEarthObj", earth);//传值
        }

    }
}

/**
 * 将xml字符串转换为dom对象
 * @param xmlStr - xml要转换的字符串对象
 * @returns dom对象
 */
function loadXMLStr(xmlStr) {
    var xmlDoc;
    try {
        if (window.ActiveXObject || window.ActiveXObject.prototype) {
            var activeX = ['Microsoft.XMLDOM', 'MSXML5.XMLDOM', 'MSXML.XMLDOM', 'MSXML2.XMLDOM', 'MSXML2.DOMDocument'];
            for (var i = 0; i < activeX.length; i++) {
                try {
                    xmlDoc = new ActiveXObject(activeX[i]);
                    xmlDoc.async = false;
                    break;
                } catch (e) {
                    continue;
                }
            }
            if (/http/ig.test(xmlStr.substring(0, 4))) {
                xmlDoc.load(xmlStr);
            } else {
                xmlDoc.loadXML(xmlStr);
            }
        } else if (document.implementation && document.implementation.createDocument) {
            xmlDoc = document.implementation.createDocument('', '', null);
            xmlDoc.loadXml(xmlStr);
        } else {
            xmlDoc = null;
        }
    } catch (exception) {
        xmlDoc = null;
    }

    return xmlDoc;
}


window.onbeforeunload = onbeforeunload_handler;
window.onunload = onunload_handler;

function onbeforeunload_handler() {
    leftMenuBalloonDestroyObject();
}

function onunload_handler() {
    leftMenuBalloonDestroyObject();
}

//清除一级菜单气泡
function leftMenuBalloonDestroyObject() {
    if (earth && earth.leftMenuBalloon) {
        earth.leftMenuBalloon.DestroyObject();
        earth.leftMenuBalloon = null;
    }
    if (leftMenuBalloon) {
        leftMenuBalloon.DestroyObject();
        leftMenuBalloon = null;
    }
}

/**
 * 设置气泡可见性
 * @param {Boolean} isVisible [是否可见]
 */
function setBalloonVisible(isVisible) {
    if (leftMenuBalloon) {//一级菜单
        leftMenuBalloon.SetIsVisible(isVisible);
    }
    if (earth.treeDataBallon) {//目录树
        earth.treeDataBallon.SetIsVisible(isVisible);
    }
    if (earth.LayerManagement.secondBallon) {//二级菜单
        earth.LayerManagement.secondBallon.SetIsVisible(isVisible);
    }
    if (earth.TotalBalloon) {//统计
        earth.TotalBalloon.SetIsVisible(isVisible);
    }
    if (earth.resultHtmlBalloon) {//面域查询
        earth.resultHtmlBalloon.SetIsVisible(isVisible);
    }
    if (earth.classifiedQueryBalloon) {//分类查询
        earth.classifiedQueryBalloon.SetIsVisible(isVisible);
    }
    if (earth.HtmlSimpleBalloon) {//点查询
        earth.buildAttLayerId.SetIsVisible(isVisible);
    }
    if (earth.htmlBalloons) {//点查询
        earth.htmlBalloons.SetIsVisible(isVisible);
    }
    if (earth.htmlBallon) {//点出图
        earth.htmlBallon.SetIsVisible(isVisible);
    }
    if (earth.htmlBallon) {//点出图
        earth.htmlBallon.SetIsVisible(isVisible);
    }
    if (earth.LayerManagement && earth.LayerManagement.bolonArr) {
        var bolonArr = earth.LayerManagement.bolonArr
        for (var i = 0; i < bolonArr.length; i++) {
            if (bolonArr[i]) {
                bolonArr[i].SetIsVisible(isVisible);
            }
        }
    }
}

/**
 * 针对ie10+可以用的显示或者隐藏气泡                                                       [description]
 */
try {//ie9以下addEventListener会报错，所以需要加上try,catch
    document.addEventListener("visibilitychange", function () {
        if (document.hidden) {
            setBalloonVisible(false);
        } else {
            setBalloonVisible(true);
        }
    });
} catch (e) {
}