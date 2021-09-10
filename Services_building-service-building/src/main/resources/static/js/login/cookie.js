//设置cookie
function setCookie(userid, userName, dataInfo, rightInfo) {
    /*将信息写入cookie,必须在服务器或者本地服务器下*/
    $.JSONCookie("MANAGER_INFO", {
        MANAGERID: userid,
        MANAGERNAME: userName,
        RIGHTINFO: rightInfo,
        DATAINGO: dataInfo
    });
    /*如果本地直接打开，则用sessionStorage  也可以抛弃cookies，直接使用sessionStorage */
    ;
    if (!$.cookie("MANAGER_INFO")) {
        var sessionstorage = window.sessionStorage;
        sessionstorage.setItem("MANAGERID", userid);
        sessionstorage.setItem("MANAGERNAME", userName);
        sessionstorage.setItem("RIGHTINFO", rightInfo);
        sessionstorage.setItem("DATAINGO", dataInfo);
    }
}

//获取cookie
function getCookie(key) {
    if (key == null || key == undefined) {
        return null;
    }
    var cookie = $.cookie(key);
    return cookie;
}

//删除cookie
function deleteCookie(key) {
    if (key == null || key == undefined) {
        return;
    }
    /*将信息写入cookie,必须在服务器或者本地服务器下*/
    $.cookie(key, null)
}