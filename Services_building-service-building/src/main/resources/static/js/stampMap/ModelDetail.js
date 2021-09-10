//属性气泡
var htmlBalloons = null;
//简单属性气泡
var HtmlSimpleBalloon = null;
//上一个模型
var lastobj = null;
/**
 * 定位(飞行)到模型搜索数据.
 */
var flyToModel = function (obj) {
    if (obj == null) {
        return;
    }
    if (lastobj) {
        lastobj.StopHighLight();//停止高亮闪烁
        lastobj = null;

    }
    var rect = obj.GetLonLatRect();
    if (rect == null || rect == undefined) return;
    var north = Number(rect.North);
    var south = Number(rect.South);
    var east = Number(rect.East);
    var west = Number(rect.West);
    var topHeight = Number(rect.MaxHeight);
    var bottomHeight = Number(rect.MinHeight);

    var lon = (east + west) / 2;
    var lat = (south + north) / 2;
    var alt = (topHeight + bottomHeight) / 2;
    var width = (parseFloat(north) - parseFloat(south)) / 2;
    var range = width / 180 * Math.PI * 6378137 / Math.tan(22.5 / 180 * Math.PI);
    range += 50;
    earth.GlobeObserver.FlytoLookat(lon, lat, alt, 0, 60, 0, range, 5);//定位(飞行)
    obj.ShowHighLight();//高亮
    lastobj = obj;
}

/**
 * 展示模型属性
 */
var showModelDetailMsg = function (attrData, pObj) {
    var htmlStr = "<div><table>";
    if (pObj == null) {
        alert("错误");
        return;
    }
    var rect = pObj.GetLonLatRect();
    if (rect == null || rect == undefined) return;
    var north = Number(rect.North);
    var south = Number(rect.South);
    var east = Number(rect.East);
    var west = Number(rect.West);
    var topHeight = Number(rect.MaxHeight);
    var bottomHeight = Number(rect.MinHeight);

    var lon = (east + west) / 2;
    var lat = (south + north) / 2;
    var alt = (topHeight + bottomHeight) / 2;

    if (attrData == null && pObj.GetKey() == null) {

        htmlStr = htmlStr + '<tr style="background-color:#f4faff;">';
        htmlStr = htmlStr + '<td  class="font" >图层:</td>';
        htmlStr = htmlStr + '<td class="font" >' + "建筑物" + '</td>';
        htmlStr = htmlStr + '</tr>';
        htmlStr = htmlStr + '<tr style="background-color:#f4faff;">';
        htmlStr = htmlStr + '<td class="font" >名称:</td>';
        htmlStr = htmlStr + '<td class="font" >' + pObj.GetKey() + '</td>';
        htmlStr = htmlStr + '</tr>';
    } else {
        if (attrData == null && pObj.GetKey() != null) {
            attrData = {
                SE_NAME: pObj.GetKey()
            }
        }
        if (attrData.SE_NAME != null) {
            var dataS = getModelMsgByModelName(attrData.SE_NAME);
            if (dataS != undefined && dataS != null && dataS.length > 0) {
                var data = dataS[0];

                ShowHtmlSimpleBalloon(earth, lon, lat, alt, htmlStr, 280, 170, data);
                return;
            } else {
                htmlStr = htmlStr + '<tr style="background-color:#f4faff;">';
                htmlStr = htmlStr + '<td>图层名称:</td>';
                htmlStr = htmlStr + '<td>' + attrData.ParentLayer + '</td>';
                htmlStr = htmlStr + '</tr>';
                for (var key in attrData) {
                    if (key.toLowerCase() == 'shape' || key.toLowerCase() == 'lonlatbox' || key.toLowerCase() == 'parentlayer') {
                        continue;
                    }
                    htmlStr = htmlStr + '<tr style="background-color:#f4faff;">';
                    htmlStr = htmlStr + '<td>' + key + ':</td>';
                    htmlStr = htmlStr + '<td>' + attrData[key] + '</td>';
                    htmlStr = htmlStr + '</tr>';
                }
            }
        } else {
            htmlStr = htmlStr + '<tr style="background-color:#f4faff;">';
            htmlStr = htmlStr + '<td>图层名称:</td>';
            htmlStr = htmlStr + '<td>' + "建筑物" + '</td>';
            htmlStr = htmlStr + '</tr>';
            for (var key in attrData) {
                if (key.toLowerCase() == 'shape' || key.toLowerCase() == 'lonlatbox' || key.toLowerCase() == 'parentlayer') {
                    continue;
                }
                htmlStr = htmlStr + '<tr style="background-color:#f4faff;">';
                htmlStr = htmlStr + '<td>' + key + ':</td>';
                htmlStr = htmlStr + '<td>' + attrData[key] + '</td>';
                htmlStr = htmlStr + '</tr>';
            }
        }


    }
    htmlStr = htmlStr + '</table></div>';
    showHtmlBalloon(earth, lon, lat, alt, htmlStr, 280, 170);
}


//弹出简单属性气泡
function ShowHtmlSimpleBalloon(earth, vecCenterX, vecCenterY, vecCenterZ, htmlStr, width, height, data) {
    HtmlSimpleBalloonDestroy();//弹出简单属性气泡
    if (earth != null && data != null) {
        clearPropertyBallon()//清除属性气泡
        var w = 280;
        var h = 340;
        if (width) {
            w = width;
        }
        if (height) {
            h = height;
        }
        var guid = earth.Factory.CreateGuid();
        HtmlSimpleBalloon = earth.Factory.CreateHtmlBalloon(guid, "属性查看");
        HtmlSimpleBalloon.SetSphericalLocation(vecCenterX, vecCenterY, vecCenterZ);
        HtmlSimpleBalloon.SetRectSize(w, h);
        var color = parseInt("0xffffff00");
        HtmlSimpleBalloon.SetTailColor(color);
        HtmlSimpleBalloon.SetIsAddCloseButton(true);//气泡是否添加关闭按钮
        HtmlSimpleBalloon.SetIsAddMargin(false);//气泡是否添加圆弧边
        HtmlSimpleBalloon.SetIsFocusAtShow(true);//控制气泡焦点，默认焦点停留在地球上
        HtmlSimpleBalloon.SetIsAddBackgroundImage(true);//气泡是否添加背景图片
        HtmlSimpleBalloon.SetIsTransparence(false);//气泡是否透明
        HtmlSimpleBalloon.SetBackgroundAlpha(255);//指定背景图片alpha值
        //HtmlSimpleBalloon.SetHtmlFilterColor(0xffffff);
        var windowUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/'));
        var url = windowUrl + "/simpleBuild.html";

        HtmlSimpleBalloon.ShowNavigate(url);//显示Html网页
        //气泡加载完成事件
        earth.Event.onDocumentReadycompleted = function (guid) {
            earth.searchData = data;

            if (HtmlSimpleBalloon.Guid == guid) {
                earth.HtmlSimpleBalloon = HtmlSimpleBalloon;
                HtmlSimpleBalloon.InvokeScript("getEarthObj", earth);//传值
            }

        }


    }

}

//根据模型名查询建筑物属性
var getModelMsgByModelName = function (modelName) {

    if (modelName == undefined || modelName == null) {
        return null;
    }
    var data = {
        obModelName: modelName
    }
    var statisticsData = [];
    $.ajax({
        url: selectModelMsgByModelName,
        type: 'post',
        async: false,
        data: JSON.stringify(data),
        contentType: "application/json",
        dataType: 'json',
        success: function (data) {
            if (data != null && data.data != null) {
                statisticsData = data.data;
            }

        },
        error: function (xhr, status, error) {
            alert(xhr);
        }

    });
    return statisticsData;
}
//弹出属性气泡
var showHtmlBalloon = function (earth, vecCenterX, vecCenterY, vecCenterZ, htmlStr, width, height) {
    clearPropertyBallon();//清除属性气泡
    var w = 280;
    var h = 340;
    if (width) {
        w = width;
    }
    if (height) {
        h = height;
    }
    var guid = earth.Factory.CreateGuid();
    htmlBalloons = earth.Factory.CreateHtmlBalloon(guid, "balloon");
    htmlBalloons.SetSphericalLocation(vecCenterX, vecCenterY, vecCenterZ);
    htmlBalloons.SetRectSize(w, h);
    var color = parseInt("0xffffff00");
    htmlBalloons.SetTailColor(color);
    htmlBalloons.SetIsAddCloseButton(true);
    htmlBalloons.SetIsAddMargin(false);
    htmlBalloons.SetIsAddBackgroundImage(true);
    htmlBalloons.SetIsTransparence(true);
    htmlBalloons.SetBackgroundAlpha(80);

    htmlBalloons.ShowHtml(htmlStr);
    earth.htmlBalloons = htmlBalloons;
    //htmlBalloons.SetHtmlElementOnClick("seeBuild",seeBuild);
};

//清除属性气泡
function HtmlBalloonDestroy() {
    if (htmlBalloons) {
        htmlBalloons.DestroyObject();
        htmlBalloons = null;
    }
}


//清除简单属性气泡
function HtmlSimpleBalloonDestroy() {
    if (HtmlSimpleBalloon) {
        HtmlSimpleBalloon.DestroyObject();
        HtmlSimpleBalloon = null;
    }
}

//清除所有属性气泡
function clearPropertyBallon() {
    HtmlBalloonDestroy();//清除属性气泡
    HtmlSimpleBalloonDestroy();//弹出简单属性气泡
}