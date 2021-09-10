var earth = null;
var treeDataBallon = null;
var windowUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/'));
var STAMP_config = {
    spatial: []
};
var bSync = true;
var isCloseSlider = true;
var TotalBalloon = null;//统计菜单气泡
//查看历史slider初始化
var seHistorySliderMgr = null;
var earthToolHeight = 0;
var ViewTranSettingBtn = false;
var ViewUndergroundModeBtn = false;

/*
 * 外部传参调用
 */
function setFunc(tparams) {
    var clickItem = tparams.clickItem;
    var updateEarthToolsDiv = tparams.updateEarthToolsDiv;
    earthToolHeight = tparams.earthToolHeight;
    updateEarthToolsDiv($("#earthTools"));
    $(".toolItem").click(function () {
        clickItem($(this).attr("id"), $("#earthTools"));
    });
    resizeWindow();
}

/*
 *窗口重绘
 */
function resizeWindow() {
    if ($(window).height() < earthToolHeight) {
        if ($("#prevBtn").is(":hidden")) {
            $("#nextBtn").show();
        }
        $("#earthTools").css("margin-bottom", "22px");
    } else {
        $("#nextBtn").hide();
        $("#prevBtn").hide();
        $("#earthTools").css("margin-bottom", "0px");
        document.documentElement.scrollTop = 0;
    }
}

/*
 * 窗口大小调整事件
 */
window.onresize = function () {
    resizeWindow();
}

/*
 * 下一页
 */
$("#nextBtn").click(function () {
    var scrollHeight = $(window).height() - 22;
    var scrollTopNow = document.documentElement.scrollTop;
    var scrollTopNext = scrollTopNow + scrollHeight;
    $("html,body").animate({
        scrollTop: scrollTopNext + 'px'
    }, 500);
    if (scrollTopNext + $(window).height() >= $("#earthTools").height()) {
        $("#nextBtn").hide();
        $("#prevBtn").show();
    }
});

/*
 * 上一页
 */
$("#prevBtn").click(function () {
    var scrollHeight = $(window).height() - 22;
    var scrollTopNow = document.documentElement.scrollTop;
    var scrollTopNext = scrollTopNow - scrollHeight;
    if (scrollTopNext <= 0) {
        scrollTopNext = 0;
        $("#prevBtn").hide();
        $("#nextBtn").show();
    }
    $("html,body").animate({
        scrollTop: scrollTopNext + 'px'
    }, 500);
});

var LayerManagement = {
    earth: null,
    earthArray: [],
    htmlBalloon: null,//属性窗口
    layerListData: [],
    secondBallon: null,//二级菜单窗口
    selectLayerId: null,
    PIPELINELAYERS: [], //记录所有管线图层
    POILAYERS: [], //记录所有管线POI图层
    pipelineSelectId: [], //所有图层中的管线图层
    PROJECTLIST: [], //工程列表
    importPipeLines: [], //重点管线
    guihuaArr: [],
    dataBackClick: false,
    modelLayerList: [],
    historySlider: [], //历史拉杆条数组
    demArr: [], //工程与DEM图层数组
    historyData: [],
    mapLayers: [],
    gisArr: [],
    groupLayers: [], //模型图层、Block图层、倾斜图层
    selectLayer: null, //选中的图层
    /**
     * 功能：获取图层根节点
     * 参数：无
     * 返回值：图层根节点
     */
    getRootLayer: function (earth) {
        var rootLayer = LayerManagement.earth.LayerManager.LayerList;
        return rootLayer;
    },

    /**
     * 清除气泡
     */
    clearHtmlBalloons: function () {
        if (LayerManagement.htmlBalloon != null) {
            LayerManagement.htmlBalloon.DestroyObject();
            LayerManagement.htmlBalloon = null;
        }
    },
    /**
     * 显示某图层
     * @param  {string} guid 图层的guid
     */
    showLayer: function (guid) {
        if (guid) {
            var layer = LayerManagement.earth.LayerManager.GetLayerByGUID(guid);
            if (layer) {
                layer.Visibility = true;
            }
        }
    },

    /**
     * 隐藏某图层
     * @param  {string} guid 图层的guid
     */
    hideLayer: function (guid) {
        if (guid) {
            var layer = LayerManagement.earth.LayerManager.GetLayerByGUID(guid);
            if (layer) {
                layer.Visibility = false;
            }
        }
    },
    /**
     * 功能：图层树节点 checkbox / radio 被勾选或取消勾选的事件
     * 参数：event-标准的 js event 对象；
     *       treeId-对应图层树的Id；
     *       node-被勾选或取消的节点
     * 返回值：无
     */
    layerTreeCheck: function (node) {
        if (node && node.id) {
            if (node.children && node.children.length > 0) {
                for (var i = 0; i < node.children.length; i++) {
                    this.layerTreeCheck(node.children[i]);
                }
            } else {
                var id = node.id;
                var layerObj = LayerManagement.earth.LayerManager.GetLayerByGUID(id);
                layerObj.Visibility = node.checked;
            }
        }
    },

    /**
     * 功能：定位到选定的图层
     * 参数：lonLatRect-图层范围对象
     * 返回值：无
     */
    flyToLayer: function (earth, lonLatRect) {
        var rectNorth = lonLatRect.North;
        var rectSouth = lonLatRect.South;
        var rectEast = lonLatRect.East;
        var rectWest = lonLatRect.West;

        var centerX = (rectEast + rectWest) / 2;
        var centerY = (rectNorth + rectSouth) / 2;
        var width = (parseFloat(rectNorth) - parseFloat(rectSouth)) / 2;
        var range = width / 180 * Math.PI * 6378137 / Math.tan(22.5 / 180 * Math.PI);
        earth.GlobeObserver.FlytoLookat(centerX, centerY, 0, 0, 90, 0, range, 5);
    },

    /**
     * 功能：双击图层列表
     * 参数：earth,节点
     * 返回值：无
     */
    layerTreeDbClick: function (earth, node) {
        if (node && node.id) {
            var id = node.id;
            var layerObj = earth.LayerManager.GetLayerByGUID(id);
            if (layerObj.LayerType.toLowerCase() == "folder") {
                return;
            }
            var rect = layerObj.LonLatRect;
            LayerManagement.flyToLayer(earth, rect); //定位图层
        }
    },
    /**
     * /**
     * 功能：单击图层列表
     * 参数：earth,节点
     * 返回值：无
     */
    onClick: function (earth, node) {
        if (node && node.id) {
            var id = node.id;
            LayerManagement.selectLayerId = id;
            //console.log(LayerManagement.selectLayerId);
            return;
        }
        LayerManagement.selectLayerId = null;
    },
    /**
     * 显示历史拉杆条
     * @param {Object} isShow  是否显示
     * @param {Object} destroy  清除
     * @param {Object} exceptFirst  开始位置
     */
    showHistorySlider: function (isShow, destroy, exceptFirst) {
        var i = exceptFirst ? 1 : 0;
        if (isShow) {
            LayerManagement.earthArray[0] = earth;
            if (LayerManagement.earthArray && LayerManagement.earthArray.length > 0) {
                for (; i < LayerManagement.earthArray.length; i++) {
                    seHistorySliderMgr.showSlider({
                        earth: LayerManagement.earthArray[i],
                        title: '历史',
                        visible: true
                    });
                }
            }
            LayerManagement.earthArray[0].Event.OnGUISliderChanged = function (id) {
                // if(!bSync) {
                // return;
                // } else {
                // var thisId = LayerManagement.earthArray[0].id;
                // var thisSliderText = seHistorySliderMgr.data[thisId]['slider'].CurrentHistoryDateTimeTxt;
                // LayerManagement.setOtherSliderChaged(thisId, thisSliderText);
                // }
            }
        } else {
            if (LayerManagement.earthArray && LayerManagement.earthArray.length > 0) {
                for (; i < LayerManagement.earthArray.length; i++) {
                    seHistorySliderMgr.showSlider({
                        earth: LayerManagement.earthArray[i],
                        visible: false,
                        destroy: destroy
                    });
                }
            }
        }
    },
    singleStyleCancel: function (id) {
        $("#" + id).removeClass('selected');
        $("#" + id).removeClass('selectedStyle');
    },
    /**
     * 功能：根据图层类型，获取图标样式
     * 参数：layerType-图层类型
     * 返回值：图标样式
     */
    getLayerIcon: function (layerType, isDialog) {
        if (isDialog) {
            var icon = "../../images/layer/";
        } else {
            var icon = "images/layer/";
        }
        if (layerType === "DEM") {
            icon += 'DEM.png';
        } else if (layerType === "DOM") {
            icon += 'DOM.png';
        } else if (layerType === "POI" || layerType === "GISPOI") {
            icon += 'POI.png';
        } else if (layerType === "Map") {
            icon += 'Map.png';
        } else if (layerType === "Vector") {
            icon += 'layer_vector.gif';
        } else if (layerType === "Model") {
            icon += 'Model.png';
        } else if (layerType === "Water") { //水面模型
            icon += 'Water.png';
        } else if (layerType === "Building") { //建筑模型
            icon += 'Building.png';
        } else if (layerType === "Ground") { //建筑模型
            icon += 'Ground.png';
        } else if (layerType === "Block") {
            icon += 'Block.png';
        } else if (layerType === "MatchModel") {
            icon += 'MatchModel.png';
        } else if (layerType === "Billboard") {
            icon += 'Billboard.png';
        } else if (layerType === "Annotation") {
            icon += 'Annotation.png';
        } else if (layerType === "Equipment") {
            icon += 'Equipment.png';
        } else if (layerType === "Container") {
            icon += 'layer_container2.png';
        } else if (layerType === "Well") {
            icon += 'layer_well.png';
        } else if (layerType === "Joint") {
            icon += 'layer_joint2.png';
        } else if (layerType === "Plate") {
            icon += 'layer_plate.png';
        } else if (layerType === "Pipeline") {
            icon += 'layer_pipeline.png';
        } else if (layerType === "Room") {
            icon += 'Room.png';
        } else if (layerType === "Danger") {
            icon += 'Model.png';
        } else if (layerType === "Project") {
            icon += 'Project.png';
        } else if (layerType === "Powerline") {
            icon += 'Powerline.png';
        } else if (layerType === "CurrentLand") { //现状用地
            icon += 'CurrentLand.png';
        } else if (layerType === "CurrentRoad") { //道路
            icon += 'CurrentRoad.png';
        } else if (layerType === "CurrentGreenbelt") { //现状用地
            icon += 'CurrentGreenbelt.png';
        } else if (layerType === "Canton") { //区划
            icon += 'Canton.png';
        } else if (layerType === "RegulatoryFigure") { //控规
            icon += 'RegulatoryFigure.png';
        } else if (layerType === "CurrentBuilding") { //现状建筑
            icon += 'CurrentBuilding.png';
        } else if (layerType === "Line") {
            icon += 'layer_line.gif';
        } else if (layerType === "Tower") {
            icon += 'layer_tower.gif';
        } else if (layerType === 'Folder') {
            icon += 'folder.png';
        } else if (layerType === "Container_Og") {
            icon += 'Container_Og.png';
        } else if (layerType === "Joint_Og") {
            icon += 'Joint_Og.png';
        } else if (layerType === "GISVector") {
            icon += 'layer_road.png';
        } else if (layerType === "GISPolygon") {
            icon += 'layer_konggui.png';
        } else {
            //icon += 'layer_interest.png';
            icon += "default.png";
        }
        return icon;
    },
    /**
     * 得到图层树
     * @param layer
     * @returns {Array}
     * @private
     */
    createLayerTreeData: function (layer) {
        if (!layer) {
            layer = LayerManagement.earth.LayerManager.LayerList;
        }
        var layerData = [];

        var childCount = layer.GetChildCount();


        for (var i = 0; i < childCount; i++) {
            var childLayer = layer.GetChildAt(i);

            var name = childLayer.Name;
            //if(contains(names, name) <0) {
            //	childLayer.Visibility = false;
            //      }
            var id = childLayer.Guid;
            var data = {};
            var layerType = childLayer.LayerType;
            var demType = childLayer.DEMType;

            if (layerType == "Model" || layerType == "Block" || layerType == "ObliquePhoto") {
                LayerManagement.groupLayers.push({
                    id: id,
                    name: name
                })
            }
            if (layerType === "Project") {
                LayerManagement.demArr.push({
                    id: id,
                    name: name,
                    dem: []
                });
                LayerManagement.gisArr.push({
                    id: id,
                    gis: []
                })
            }
            if (layerType.toLowerCase() == "map" || layerType.toLowerCase() == "wms") {
                LayerManagement.mapLayers.push(childLayer);
            }
            if (demType.toUpperCase() === "TIN" || demType.toUpperCase() === "GRID") {
                var demArrLen = LayerManagement.demArr.length;
                LayerManagement.demArr[demArrLen - 1].dem.push({
                    "id": id,
                    "name": name
                })
            }
            if (layerType.toUpperCase() == "GISPOI" || layerType.toUpperCase() == "GISVECTOR" || layerType.toUpperCase() == "POI") {
                var gisArrLen = LayerManagement.gisArr.length;
                LayerManagement.gisArr[gisArrLen - 1].gis.push({
                    id: id,
                    name: name
                })
            }
            if (layerType === "POI") {
                LayerManagement.POILAYERS.push({
                    'id': id,
                    'name': name,
                    'server': childLayer.GISServer,
                    'pltype': childLayer.PipeLineType
                });
            }
            if (childLayer.LayerType === "Project") {
                STAMP_config.spatial.push({
                    id: childLayer.Guid,
                    name: name
                });
            }
            if (name == "equipment") {
                name = "附属设施";
            } else if (name == "container") {
                name = "管线";
            } else if (name == "well") {
                name = "井";
            } else if (name == "joint") {
                name = "附属点";
            } else if (name == "plate") {
                name = "井盖";
            } else if (name == "buffer") {
                childLayer.visibility = false;
            } else if (name == "room") {
                name = "井室";
            } else if (name == "container_og") {
                name = "地上管线"
            } else if (name == "joint") {
                name = "特征";
            } else if (name == "joint_og") {
                name == "地上特征";
            }
            if (demType.toUpperCase() === "TIN" || demType.toUpperCase() === "GRID") {
                layerType = "DEM";
            }
            layerType = layerType ? layerType : "DOM";
            if (layerType == "Model" && childLayer.DataType == "Water") {
                layerType = "Water";
            }
            if (layerType == "Model" && childLayer.DataType == "Building") {
                layerType = "Building";
            }
            if (layerType == "Model" && childLayer.DataType == "Ground") {
                layerType = "Ground";
            }
            if (childLayer.DataType == "CurrentRoad") {
                layerType = "Ground";
            }
            if (layerType == "GISVector" && childLayer.DataType == "CurrentLand") {
                layerType = "CurrentLand";
            }
            if (layerType == "GISVector" && childLayer.DataType == "Canton") {
                layerType = "Canton";
            }
            if (layerType == "GISVector" && childLayer.DataType == "CurrentGreenbelt") {
                layerType = "CurrentGreenbelt";
            }
            if (layerType == "GISVector" && childLayer.DataType == "RegulatoryFigure") {
                layerType = "RegulatoryFigure";
            }
            if (layerType == "GISVector" && childLayer.DataType == "CurrentBuilding") {
                layerType = "CurrentBuilding";
            }
            var icon = LayerManagement.getLayerIcon(layerType, true);
            var data = {};
            data['id'] = childLayer.Guid;
            data['name'] = name;
            data['checked'] = childLayer.Visibility;
            data['icon'] = icon;
            if (childLayer.GetChildCount() > 0) {
                data.children = LayerManagement.createLayerTreeData(childLayer);
            }
            if (name != "buffer" && name != "room") {
                layerData.push(data);
            }
        }
        return layerData;
    },
    ViewTranSetting: function (id) { //地形透明
        var flag = BalloonHtml.itemClickStyle(id);//是否被选中
        if (flag) {
            setSlidersVisible(1);
            ViewTranSettingBtn = true;//无作用，只是用来表示旗袍的显隐
        } else {
            setSlidersVisible(0);
            ViewTranSettingBtn = false;
        }
    },
    ViewUndergroundMode: function (id) { //地下浏览
        var flag = BalloonHtml.itemClickStyle(id);
        if (flag) {
            ViewUndergroundModeBtn = true;
            LayerManagement.earth.GlobeObserver.UndergroundMode = true; // 地下浏览模式
        } else {
            ViewUndergroundModeBtn = false;
            LayerManagement.earth.GlobeObserver.UndergroundMode = false; // 取消地下浏览模式
            LayerManagement.earth.Event.OnObserverChanged = function () {
            };
        }
    },


};


function getEarthObj(earthObj) {
    earth = earthObj;
    seHistorySliderMgr = new SeHistorySliderMgr({
        onAllClose: function () {
            LayerManagement.singleStyleCancel("historyData");
        }
    });
    if (earth.treeDataBallon) {
        earth.treeDataBallon.DestroyObject();
        earth.treeDataBallon = null;

    }
    LayerManagement.earth = earth;
}

//查询
function showSecondSerchMenu() {
    showSecondMenu("1");

}

// 地下浏览
function ViewUndergroundModeClicked(id) {
    //LayerManagement.showHistorySlider(false);//关闭历史拉杆条
    LayerManagement.ViewUndergroundMode(id);
    addLogMsg("地下浏览");
}

// 地形透明
function ViewTranSettingClicked(id) {
    LayerManagement.showHistorySlider(false);//关闭历史拉杆条
    if ($("#historyData").hasClass("selected")) {
        alert("请先关闭历史比对或者历史变迁再使用此功能"); //防止开启之后onguisliderchanged事件混乱
        return;
    }
    LayerManagement.ViewTranSetting(id);
    addLogMsg("地形透明");
}

//分析
function showAnalysisMenu() {
    addLogMsg("分析");
    setSlidersVisible(0);
    showSecondMenu("2");
}

//量算
function showToolMenu() {
    addLogMsg("量算");
    showSecondMenu("3");
}

//统计
function showTotalMenu() {
    addLogMsg("统计");
    SecondBallonDestroyObject()//清除左侧二级菜单气泡
    TotalBalloonDestroyObject();//清除统计菜单气泡
    if (earth != null) {
        //earth.TotalBalloon = TotalBalloon;
        TotalBalloon = earth.Factory.CreateHtmlBalloon(earth.Factory.CreateGuid(), '统计');
        TotalBalloon.SetScreenLocation(1700, 20);//指定屏幕坐标显示//
        TotalBalloon.SetRectSize(480, 480);//窗口宽度（像素）
        // TotalBalloon.SetIsAddCloseButton(true);
        // TotalBalloon.SetIsAddMargin(true);
        // TotalBalloon.SetIsFocusAtShow(true);
        // TotalBalloon.SetIsAddBackgroundImage(false);
        // TotalBalloon.SetIsTransparence(false);
        // TotalBalloon.SetBackgroundAlpha(105);
        // TotalBalloon.SetHtmlFilterColor(0xffffff);
        TotalBalloon.SetIsAddCloseButton(true);
        TotalBalloon.SetIsAddMargin(true);
        TotalBalloon.SetIsFocusAtShow(true);
        TotalBalloon.SetIsAddBackgroundImage(false);
        TotalBalloon.SetIsTransparence(false);
        TotalBalloon.SetBackgroundAlpha(245);
        //TotalBalloon.SetHtmlFilterColor(0xffffff);
        var url = windowUrl + '/mapTotal.html';
        TotalBalloon.ShowNavigate(url);

        //气泡加载完成事件
        earth.Event.onDocumentReadycompleted = function (guid) {
            earth.TotalBalloon = TotalBalloon;
            if (TotalBalloon.Guid == guid) {
                TotalBalloon.InvokeScript("getEarthObj", earth);//传值
            }

        }
    }
}

//出图
function picturesClicked(id) {
    addLogMsg("出图");
    pictureHtml(id);
}

//弹出左侧二级菜单气泡
function showSecondMenu(index) {
    SecondBallonDestroyObject()//清除左侧二级菜单气泡
    TotalBalloonDestroyObject();//清除统计菜单气泡
    LayerManagement.secondBallon = LayerManagement.earth.Factory.CreateHtmlBalloon(earth.Factory.CreateGuid(), '顶部气泡');
    LayerManagement.secondBallon.SetScreenLocation(120, 220);//指定屏幕坐标显示//
    LayerManagement.secondBallon.SetRectSize(130, 220);//窗口宽度（像素）
    LayerManagement.secondBallon.SetIsAddCloseButton(false);//气泡是否添加关闭按钮
    //LayerManagement.secondBallon .SetIsAddMargin(true);//气泡是否添加圆弧边
    //LayerManagement.secondBallon .SetIsFocusAtShow(true);//控制气泡焦点，默认焦点停留在地球上
    LayerManagement.secondBallon.SetIsAddBackgroundImage(true);//气泡是否添加背景图片
    LayerManagement.secondBallon.SetIsTransparence(false);//气泡是否透明
    LayerManagement.secondBallon.SetBackgroundAlpha(0);//指定背景图片alpha值
    // LayerManagement.secondBallon .SetHtmlFilterColor(0xffffff);

    var url = windowUrl + '/SecondaryFunction.html';
    LayerManagement.secondBallon.ShowNavigate(url);//显示Html网页
    //气泡加载完成事件
    LayerManagement.earth.Event.onDocumentReadycompleted = function (guid) {

        LayerManagement.earth.secondIndex = index;
        LayerManagement.earth.LayerManagement = LayerManagement;
        LayerManagement.STAMP_config = STAMP_config;
        LayerManagement.earth.seHistorySliderMgr = seHistorySliderMgr;
        if (LayerManagement.secondBallon.Guid == guid) {
            LayerManagement.secondBallon.InvokeScript("getEarthObj", LayerManagement.earth);//传值
        }

    }
}

//弹出目录
function showRightMenu() {
    addLogMsg("目录");
    TreeDataBallonDestroyObject();//清除目录气泡
    if (earth != null) {
        earth.treeDataBallon = treeDataBallon;
        treeDataBallon = earth.Factory.CreateHtmlBalloon(earth.Factory.CreateGuid(), '图层目录');
        treeDataBallon.SetScreenLocation(2000, 20);
        treeDataBallon.SetRectSize(200, 390);
        treeDataBallon.SetIsAddCloseButton(true);
        treeDataBallon.SetIsAddMargin(true);
        treeDataBallon.SetIsFocusAtShow(true);
        treeDataBallon.SetIsAddBackgroundImage(false);
        treeDataBallon.SetIsTransparence(false);
        treeDataBallon.SetBackgroundAlpha(245);
        treeDataBallon.SetHtmlFilterColor(0xffffff);
        var url = windowUrl + '/mapCatalog.html';
        treeDataBallon.ShowNavigate(url);

        //气泡加载完成事件
        earth.Event.onDocumentReadycompleted = function (guid) {
            earth.treeDataBallon = treeDataBallon;//传值
            earth.LayerManagement = LayerManagement;//传值
            if (treeDataBallon.Guid == guid) {
                treeDataBallon.InvokeScript("getEarthObj", earth);//传值
            }

        }
    }

}

window.onbeforeunload = onbeforeunload_handler;
window.onunload = onunload_handler;

function onbeforeunload_handler() {
    SecondBallonDestroyObject()//清除左侧二级菜单气泡
    TreeDataBallonDestroyObject();//清除目录气泡
    TotalBalloonDestroyObject();//清除统计菜单气泡


}

function onunload_handler() {
    SecondBallonDestroyObject()//清除左侧二级菜单气泡
    TreeDataBallonDestroyObject();//清除目录气泡
    TotalBalloonDestroyObject();//清除统计菜单气泡

}

//清除目录气泡
function TreeDataBallonDestroyObject() {
    if (treeDataBallon) {
        treeDataBallon.DestroyObject();
        treeDataBallon = null;
    }
}

//清除左侧二级菜单气泡
function SecondBallonDestroyObject() {
    if (LayerManagement.secondBallon) {
        LayerManagement.secondBallon.DestroyObject();
        LayerManagement.secondBallon = null;
    }
}

//清除统计菜单气泡
function TotalBalloonDestroyObject() {
    if (TotalBalloon) {
        TotalBalloon.DestroyObject();
        TotalBalloon = null;
    }
}

window.onload = function () {
    changeActiveTollStyle();//工具栏菜单点击修改菜单样式
}

function changeActiveTollStyle() {
    var orderLi = document.getElementsByClassName("img");
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



