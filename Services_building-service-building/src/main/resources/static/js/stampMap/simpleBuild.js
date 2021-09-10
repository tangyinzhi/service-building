var earth = null;
;
var id = null;
//属性详情气泡
var htmlproBalloon = null;

function getEarthObj(earthObj) {
    earth = earthObj;
    if (earth) {
        var data = earth.searchData;
        var buildname = data.OB_NAME;
        id = data.OBJECTID;
        var obcode = data.OB_CODE;
        var buildstru = data.OB_STRU;
        var buildaddr = data.OB_ADDR;
        document.getElementById("obName").innerHTML = buildname;
        document.getElementById("obStru").innerHTML = buildstru;
        document.getElementById("obAddr").innerHTML = buildaddr;
    }
}

//弹出详情属性气泡
function seeBuild() {
    HtmlproBalloonDestroy()//清除详情属性气泡
    if (earth != null && id != undefined && id != null) {
        htmlproBalloon = earth.Factory.CreateHtmlBalloon(earth.Factory.CreateGuid(), '属性详情');
        htmlproBalloon.SetScreenLocation(1000, 300);
        htmlproBalloon.SetRectSize(750, 515);
        htmlproBalloon.SetIsAddCloseButton(true);
        htmlproBalloon.SetIsAddMargin(true);
        htmlproBalloon.SetIsFocusAtShow(true);
        htmlproBalloon.SetIsAddBackgroundImage(false);
        htmlproBalloon.SetIsTransparence(false);
        htmlproBalloon.SetBackgroundAlpha(240);
        //htmlproBalloon.SetHtmlFilterColor(0xffffff);

        var windowUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/'));
        var windowUrl1 = windowUrl.substring(0, windowUrl.lastIndexOf('/'));
        var url = windowUrl + '/BuildAttManager_edit.html?ID=' + id + "&type=look&visual=true";
        earth.htmlproBalloon = htmlproBalloon;
        htmlproBalloon.ShowNavigate(url);


    }

}

//清除详情属性气泡
function HtmlproBalloonDestroy() {
    if (htmlproBalloon) {
        htmlproBalloon.DestroyObject();
        htmlproBalloon = null;
    }
}

window.onbeforeunload = onbeforeunload_handler;
window.onunload = onunload_handler;

function onbeforeunload_handler() {
    HtmlproBalloonDestroy()//清除属性气泡
}

function onunload_handler() {
    HtmlproBalloonDestroy()//清除属性气泡
}