function getUserName() {
    var cookie = $.cookie("MANAGER_INFO");
    var jsonCookie = $.parseJSON(cookie);
    if (jsonCookie != undefined && jsonCookie != null && jsonCookie.MANAGERNAME != undefined && jsonCookie.MANAGERNAME != null) {
        return jsonCookie.MANAGERNAME;
    }
    return "admin";
}

function getUserId() {
    var cookie = $.cookie("MANAGER_INFO");
    var jsonCookie = $.parseJSON(cookie);
    if (jsonCookie != undefined && jsonCookie != null && jsonCookie.MANAGERID != undefined && jsonCookie.MANAGERID != null) {
        return jsonCookie.MANAGERID;
    }
    return 1;
}

function getIp() {
    //var re = returnCitySN["cip"] + ',' + returnCitySN["cname"];
    return "172.1.4.162";
}