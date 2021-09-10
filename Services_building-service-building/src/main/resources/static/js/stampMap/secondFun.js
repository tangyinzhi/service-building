// document.write("<script type=\"text/javascript\" src=\"../../js/stampMap/analysis.js\"></script>");
var LayerManagement = null;
var earth = null;
var windowUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/'));
var buildAttLayerId = "a907891f-824a-46fd-b30f-11c3a70139ee";//建筑物模型图层Id
var resultHtmlBalloon = null;//查询结果气泡
var searchResult = null;//查询结果
var STAMP_config = null;
var analysis = null;//分析
layui.use('element', function () {

    var element = layui.element;

});

$("li").click(function () {
    alert("1");
    $(this).siblings('li').removeClass('selected');  // 删除其他兄弟元素的样式
    $(this).addClass('selected');                            // 添加当前元素的样式
});

function getEarthObj(earthObj) {
    earth = earthObj;
    analysis = STAMP.Analysis(earth);
    if (earth) {
        LayerManagement = earth.LayerManagement;
        STAMP_config = earth.STAMP_config;
        if (LayerManagement) {
            LayerManagement.bolonArr = bolonArr;
        }
        //查看历史slider初始化
        switch (earth.secondIndex) {
            case "1":
                document.getElementById('spanSearch').style.display = 'block';
                document.getElementById('spanAnalysis').style.display = 'none';
                document.getElementById('spanTool').style.display = 'none';
                break;
            case "2":
                document.getElementById('spanSearch').style.display = 'none';
                document.getElementById('spanAnalysis').style.display = 'block';
                document.getElementById('spanTool').style.display = 'none';
                break;
            case "3":
                document.getElementById('spanSearch').style.display = 'none';
                document.getElementById('spanAnalysis').style.display = 'none';
                document.getElementById('spanTool').style.display = 'block';
                break;
            default:
                break;
        }

    }
}

//属性查询
function queryPropertyClicked() {
    addLogMsg("属性查询");
    if (earth) {
        earth.ShapeCreator.Clear();//清除辅助图元
        onunload_handler()//清除气泡
        if (earth == null) {
            alert("未获取到地图控件！")
            return false;
        }
        earth.Event.OnPickObjectEx = function (pObj) {

            parentLayerName = pObj.GetParentLayerName();
            if (parentLayerName == "" || parentLayerName == null) {
                alert("获得父层名称失败！");
                return false;
            }
            if (parentLayerName.indexOf('=') > -1) {
                var cArr = parentLayerName.split("=");
                var cArr = cArr[1].split("_");//根据图层名称字符串判断是模型图层还是管线数据图层
                var layer = earth.LayerManager.GetLayerByGUID(cArr[0]);
            }

            key = pObj.GetKey();
            var attrData = layer.SearchResultFromLocal.GotoPage(0);
            attrData = $.xml2json(attrData);
            if (attrData.SearchResult != null) {
                if (attrData.SearchResult.ModelResult != null) {
                    attrData = attrData.SearchResult.ModelResult.ModelData;
                } else if (attrData.SearchResult.VectorResult != null) {
                    attrData = attrData.SearchResult.VectorResult.VectorData;
                }
                if ($.isArray(attrData)) {
                    attrData = attrData[0];
                }
            } else {
                attrData = null;
            }
            flyToModel(pObj);//定位并高亮
            showModelDetailMsg(attrData, pObj);

            earth.Event.OnPickObjectEx = function () {
            };
            earth.Event.OnLBDown = function () {
            };
            earth.Event.OnLBUp = function () {
            };
            earth.Query.FinishPick();//结束拾取
            earth.Environment.SetCursorStyle(209);
        };

        //查所有的模型对象
        earth.Event.OnLBDown = function (p2) {
            function _onlbd(p2) {
                earth.Event.OnLBUp = function (p2) {
                    earth.Event.OnLBDown = function (p2) {
                        _onlbd(p2);
                    };
                };
                earth.Query.PickObject(511, p2.x, p2.y);
            }

            _onlbd(p2);
        };
        earth.Environment.SetCursorStyle(32512);

        earth.Event.OnRBDown = function () {
            earth.Event.OnPickObjectEx = function () {
            };
            earth.Event.OnLBDown = function () {
            };
            earth.Event.OnLBUp = function () {
            };
            earth.Query.FinishPick();//结束拾取
            earth.Environment.SetCursorStyle(209);
        }
    }
}

//面域查询
function polygonSearchClicked() {
    addLogMsg("面域查询");
    if (earth == null) {
        alert("未获取到地图控件！")
        return false;
    }
    earth.ShapeCreator.Clear();//清除辅助图元
    earth.Event.OnCreateGeometry = function (pFeat) {
        var subLayer = earth.LayerManager.GetLayerByGUID(buildAttLayerId);
        subLayer.LocalSearchParameter.ReturnDataType = 1;
        subLayer.LocalSearchParameter.PageRecordCount = 10000;
        //subLayer.LocalSearchParameter.SetFilter("1", "");//属性过滤条件：关键字为”1”
        subLayer.LocalSearchParameter.PreciseKeyValue = "";
        subLayer.LocalSearchParameter.SetSpatialFilter(pFeat);//范围坐标集合
        subLayer.LocalSearchParameter.HasDetail = false;
        searchResult = subLayer.SearchFromLocal();
        subLayer.LocalSearchParameter.ReturnDataType = 4;
        var xmlStr = searchResult.GotoPage(0);
        var jsonData = $.xml2json(xmlStr);
        //alert(JSON.stringify(jsonData));
        //jsonData.SearchResult.ModelResult.ModelData;
        showResultHtmlBalloon();
        //console.log(JSON.stringify(jsonData.SearchResult.ModelResult.ModelData));
    }
    earth.ShapeCreator.CreatePolygon();
}

//分类查询
var classifiedSearchClicked = function () {
    addLogMsg("分类查询");
    showClassifiedBalloon();
}
//弹出面域查询结果气泡
var showResultHtmlBalloon = function () {
    earth.ShapeCreator.Clear();//清除辅助图元
    onunload_handler()//清除气泡
    resultHtmlBalloon = earth.Factory.CreateHtmlBalloon(earth.Factory.CreateGuid(), '面域查询');
    resultHtmlBalloon.SetScreenLocation(1900, 20);//指定屏幕坐标显示//
    resultHtmlBalloon.SetRectSize(510, 470);//窗口宽度（像素）
    resultHtmlBalloon.SetIsAddCloseButton(true);//气泡是否添加关闭按钮
    resultHtmlBalloon.SetIsAddMargin(true);//气泡是否添加圆弧边
    resultHtmlBalloon.SetIsFocusAtShow(true);//控制气泡焦点，默认焦点停留在地球上
    resultHtmlBalloon.SetIsAddBackgroundImage(false);//气泡是否添加背景图片
    resultHtmlBalloon.SetIsTransparence(false);//气泡是否透明
    //resultHtmlBalloon.SetBackgroundAlpha(0);//指定背景图片alpha值
    //resultHtmlBalloon.SetHtmlFilterColor(0xffffff);
    earth.resultHtmlBalloon = resultHtmlBalloon;
    var url = windowUrl + '/searchResult2.html';
    //alert(url);
    resultHtmlBalloon.ShowNavigate(url);//显示Html网页
    //气泡加载完成事件
    earth.Event.onDocumentReadycompleted = function (guid) {

        earth.searchResult = searchResult;
        earth.buildAttLayerId = buildAttLayerId;

        if (resultHtmlBalloon.Guid == guid) {
            resultHtmlBalloon.InvokeScript("getEarthObj", earth);//传值
        }

    }
};
//分类查询气泡
var classifiedQueryBalloon = null;
//弹出分类查询结果气泡
var showClassifiedBalloon = function () {
    onunload_handler()//清除气泡
    classifiedQueryBalloon = earth.Factory.CreateHtmlBalloon(earth.Factory.CreateGuid(), '分类查询');
    classifiedQueryBalloon.SetScreenLocation(1900, 20);//指定屏幕坐标显示//
    classifiedQueryBalloon.SetRectSize(510, 480);//窗口宽度（像素）
    classifiedQueryBalloon.SetIsAddCloseButton(true);//气泡是否添加关闭按钮
    classifiedQueryBalloon.SetIsAddMargin(true);//气泡是否添加圆弧边
    classifiedQueryBalloon.SetIsFocusAtShow(true);//控制气泡焦点，默认焦点停留在地球上
    classifiedQueryBalloon.SetIsAddBackgroundImage(false);//气泡是否添加背景图片
    classifiedQueryBalloon.SetIsTransparence(false);//气泡是否透明
    //classifiedQueryBalloon.SetBackgroundAlpha(0);//指定背景图片alpha值
    //classifiedQueryBalloon.SetHtmlFilterColor(0xffffff);

    var url = windowUrl + '/classifySearch.html';
    //alert(url);
    classifiedQueryBalloon.ShowNavigate(url);//显示Html网页
    //气泡加载完成事件
    earth.Event.onDocumentReadycompleted = function (guid) {
        //var buildAttLayerId = "a907891f-824a-46fd-b30f-11c3a70139ee";//建筑物模型图层Id
        earth.buildAttLayerId = buildAttLayerId;
        earth.classifiedQueryBalloon = classifiedQueryBalloon;
        if (classifiedQueryBalloon.Guid == guid) {
            classifiedQueryBalloon.InvokeScript("getEarthObj", earth);//传值
        }

    }
};


//清除查询结果气泡
function ResultHtmlBalloonDestroy() {
    if (resultHtmlBalloon) {
        resultHtmlBalloon.DestroyObject();
        resultHtmlBalloon = null;
    }
}

var bMultiple = false;

//历史变迁
function historyDataClicked(id) {
    addLogMsg("历史变迁");
    if (bMultiple) {
        alert("该功能不能在多屏状态下使用，请先关闭‘双屏显示’！");
        return;
    }
    var isCloseSlider = true;
    LayerManagement.showHistorySlider(true);


}

//视域分析
function mViewshedClicked(id) {
    addLogMsg("视域分析");
    LayerManagement.showHistorySlider(false);//关闭历史拉杆条
    analysis.showMoveHtml(id);
}

//阴影分析
function mShinningClicked(id) {
    addLogMsg("阴影分析");
    LayerManagement.showHistorySlider(false);//关闭历史拉杆条
    analysis.showMoveHtml(id);
}

//天际线分析
function mSkylineClicked(id) {
    addLogMsg("天际线分析");
    LayerManagement.showHistorySlider(false);//关闭历史拉杆条
    analysis.showMoveHtml(id);
}

//空间距离
function mLineLengthClicked(id) {
    addLogMsg("空间距离");
    LayerManagement.showHistorySlider(false);//关闭历史拉杆条
    analysis.measure(id, "空间距离");
}

//空间面积
function mSpatialAreaClicked(id) {
    addLogMsg("空间面积");
    LayerManagement.showHistorySlider(false);//关闭历史拉杆条
    analysis.measure(id, "空间面积");
}

//水平距离
function mHorizontalDistClicked(id) {
    addLogMsg("水平距离");
    LayerManagement.showHistorySlider(false);//关闭历史拉杆条
    analysis.measure(id, "水平距离");
}

//垂直距离
function mHeightClicked(id) {
    addLogMsg("垂直距离");
    LayerManagement.showHistorySlider(false);//关闭历史拉杆条
    analysis.measure(id, "垂直距离");
}

window.onbeforeunload = onbeforeunload_handler;
window.onunload = onunload_handler;

function onbeforeunload_handler() {
    ResultHtmlBalloonDestroy();//清除查询结果气泡
    clearPropertyBallon()//清除属性气泡
    DestroyClassifiedQueryBalloon()//清除分类查询气泡
    DestroyHistorySlider();
}

function onunload_handler() {
    ResultHtmlBalloonDestroy();//清除查询结果气泡
    clearPropertyBallon()//清除属性气泡
    DestroyClassifiedQueryBalloon()//清除分类查询气泡
    DestroyHistorySlider();
}

function DestroyHistorySlider() {
    LayerManagement.showHistorySlider(false);
    earth.Event.OnGUISliderChanged = function () {
    };
    if (earth.LayerManagement && earth.LayerManagement.bolonArr) {
        var bolonArr = earth.LayerManagement.bolonArr
        for (var i = 0; i < bolonArr.length; i++) {
            if (bolonArr[i]) {
                bolonArr[i].DestroyObject();
                bolonArr.splice(i, 1);
            }
        }
    }
}

//清除分类查询气泡
function DestroyClassifiedQueryBalloon() {
    if (classifiedQueryBalloon) {
        classifiedQueryBalloon.DestroyObject();
        classifiedQueryBalloon = null;
    }
}

window.onload = function () {
    var pic = document.getElementById("pic")
    var order = document.getElementsByClassName("order");
    var orderLi = document.getElementsByTagName("li");
    for (i = 0; i < orderLi.length; i++) {
        orderLi[i].index = i; //将i赋给orderLi[i]的index属性
        orderLi[i].onclick = function () {
            for (i = 0; i < orderLi.length; i++) {
                orderLi[i].classList.remove("selected");
            }
            this.classList.add("selected");
            ;//为什么要用this，而不是orderLi[i]
        }
    }
}



