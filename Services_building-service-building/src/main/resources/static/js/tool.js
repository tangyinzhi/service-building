/**
 * 获取当前的URL参数值
 * 参数：paramName URL参数
 * 调用方法:getQueryString("paraName")
 * 返回值:
 */
function getQueryString(paraName) {
    var url = document.location.toString();
    var arrObj = url.split("?");

    if (arrObj.length > 1) {
        var arrPara = arrObj[1].split("&");
        var arr;

        for (var i = 0; i < arrPara.length; i++) {
            arr = arrPara[i].split("=");

            if (arr != null && arr[0] == paraName) {
                return decodeURI(arr[1]);
            }
        }
        return "";
    } else {
        return "";
    }
}

function replaceTime(time) {
    if (time == undefined || time == null)
        return "";
    time = time.replace("T", " ");
    time = time.replace("t", " ");
    return time;
}
