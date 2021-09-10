layui.use(['element', 'layer'], function () {
    var element = layui.element;
    var $ = layui.jquery;
    var layer = layui.layer;
    var userInfo = null;
    //获取cookie（用户信息）
    var cookie = getCookie("MANAGER_INFO");
    if (cookie == null || cookie == undefined) {
        cookie = window.sessionStorage;
        if (cookie == null || cookie == undefined || cookie.length == 0) {
            window.location = "login";
            return false;
        }
        userInfo = cookie;
    } else {
        userInfo = $.parseJSON(cookie);
    }
    $("#userName").html(userInfo.MANAGERNAME);
    //获取权限
    var rightInfo = userInfo.RIGHTINFO;
    if ((typeof rightInfo == 'string') && rightInfo.constructor == String) {
        rightInfo = $.parseJSON(rightInfo);
    }
    //获取菜单权限
    var rightMenuInfo = userInfo.rightMenuInfo;
    if ((typeof rightMenuInfo == 'string') && rightMenuInfo.constructor == String) {
        rightMenuInfo = $.parseJSON(rightMenuInfo);
    }
    var index = getQueryString("index");
    if (index == null || index == undefined) {
        return false;
    }
    menuSwitchShow();
    LiftMenuInitByIndex(index);
    /**
     * 点击菜单后左侧目录的变化
     * @type {boolean}
     */
    window.LiftMenuInit = LiftMenuInitByIndex;

    function LiftMenuInitByIndex(index) {

        if (index != undefined && index != null) {
            var itemList = rightInfo.filter(function (a) {
                return a.pid == index;
            });
            if (itemList == undefined || itemList == null) {
                layer.msg("获取当前左侧菜单栏是百年，请联系管理员", {
                    icon: 7
                });
            }
            var html = "<ul class=\"layui-nav layui-nav-tree layui-side-scroll-u\" lay-shrink=\"all\" lay-filter=\"\">";
            for (var i = 0; i < itemList.length; i++) {
                var item = itemList[i];
                var iClass = "";
                if (i == 0) {
                    var iClass = "layui-nav-itemed";
                }
                html += "<li class=\"layui-nav-item " + iClass + "\">";
                html += "<a class=\"\" href=\"javascript: ;\">";
                html += "<i class=\"layui-icon " + item.src + "\"></i> " + item.name + "</a>";
                if (item.item != undefined && item.item != null && item.item.length > 0) {
                    html += "<dl class=\"layui-nav-child\">";
                    for (var j = 0; j < item.item.length; j++) {
                        var itemI = item.item[j];
                        if (j == 0 && i == 0) {
                            var tabId = index + "-" + (i + 1) + "-" + (j + 1);
                            ddclickIndex(itemI.name, itemI.src, itemI.srcd, tabId);
                        }
                        var nameHtml = "<i class=\"layui-icon " + itemI.src + "\"></i>" + itemI.name;
                        //html += " <dd><a href=\"javascript: ddclick('" + itemI.name + "','" + itemI.srcd + "','" + index + "-"  + (i + 1) + "-" + j  +"'); \" path=\"" + itemI.srcd + "\" tab`-id=\"" + (i + 1) + "-" + j + "\"><i class=\"layui-icon " + itemI.src + "\"></i> " + itemI.name + "</a></dd>";
                        html += " <dd><a href=\"javascript: ddclick('" + itemI.name + "','" + itemI.src + "','" + itemI.srcd + "','" + index + "-" + (i + 1) + "-" + (j + 1) + "'); \" path=\"" + itemI.srcd + "\"><i class=\"layui-icon " + itemI.src + "\"></i> " + itemI.name + "</a></dd>";

                    }
                    html += "</dl>";
                }
                html += "</li>";
            }
            html += "</ul>";
            $("#leftMenu").html(html);
            element.init();
        }
    }

    //menuSwitchHide();
    // menuSwitchShow();
    /**
     * 左边菜单显示/隐藏功能
     * @type {boolean}
     */
    $(".menu-switch").click(function () {
        if ($(".layui-layout-admin .layui-side").css("left") == '0px') {

            menuSwitchHide();
        } else {
            menuSwitchShow();
        }
    });

    /**
     * 左边菜单隐藏功能
     */
    function menuSwitchHide() {
        $(".layui-layout-admin .layui-side").animate({left: "-200px"});
        $(".layui-layout-admin .content-body").animate({left: "0px"});
        $(".layui-layout-admin .layui-footer").animate({left: "0px"});
        $('.index_show_icon').removeClass('layui-icon-left');
        $('.index_show_icon').addClass('layui-icon-right');
        $('#side-fold').css("left", "0px");
    }

    /**
     * 左边菜单显示功能
     */
    function menuSwitchShow() {
        $(".layui-layout-admin .content-body").animate({left: "200px"});
        $(".layui-layout-admin .layui-side").animate({left: "0px"});
        $(".layui-layout-admin .layui-footer").animate({left: "200px"});
        $('#side-fold').css("float", "right");
        $('#side-fold').css("left", "181px");
        $('.index_show_icon').addClass('layui-icon-left');
        $('.index_show_icon').removeClass('layui-icon-right');
    }

    window.ddclick = ddclickIndex;

    //$(".menu-switch").click();
    /**
     * 点击左边菜单在右边添加选项卡
     */
    function ddclickIndex(title, src, path, tabId) {
        // 纯文字
        // var title = $(this).text();
        // 图标+文字

        if (tabId != undefined && path != undefined && title != undefined && src != undefined) {
            title = "<i class=\"layui-icon " + src + "\"></i>" + title;
            // 去重复选项卡
            for (var i = 0; i < $('.ok-frame').length; i++) {
                if ($('.ok-frame').eq(i).attr('tab-id') == tabId) {
                    element.tabChange("ok-tab", tabId);
                    //event.stopPropagation();
                    return;
                }
            }
            // 添加选项卡
            element.tabAdd("ok-tab", {
                title: " " + title,
                content: "<iframe src='" + path + "' tab-id='" + tabId + "' class='ok-frame' frameborder='0' scrolling='yes' width='100%' height='100%'></iframe>",
                id: tabId
            });
            // 切换选项卡
            element.tabChange("ok-tab", tabId);
        }
    }

    $(".layui-nav-child").find("dd").click(function () {
        // 纯文字
        // var title = $(this).text();
        // 图标+文字
        var title = $(this).find("a").html();
        var path = $(this).children('a').attr('path');
        var tabId = $(this).children('a').attr('tab-id');
        if (tabId != undefined && path != undefined && title != undefined) {
            // 去重复选项卡
            for (var i = 0; i < $('.ok-frame').length; i++) {
                if ($('.ok-frame').eq(i).attr('tab-id') == tabId) {
                    element.tabChange("ok-tab", tabId);
                    event.stopPropagation();
                    return;
                }
            }
            // 添加选项卡
            element.tabAdd("ok-tab", {
                title: title,
                content: "<iframe src='" + path + "' tab-id='" + tabId + "' class='ok-frame' frameborder='0' scrolling='yes' width='100%' height='100%'></iframe>",
                id: tabId
            });
            // 切换选项卡
            element.tabChange("ok-tab", tabId);
        }
    });


    if (typeof Array.prototype.filter != "function") {
        Array.prototype.filter = function (fn, context) {
            var arr = [];
            if (typeof fn === "function") {
                for (var k = 0, length = this.length; k < length; k++) {
                    fn.call(context, this[k], k, this) && arr.push(this[k]);
                }
            }
            return arr;
        };
    }
    //点击收起放出的按钮
    $('.kit-side-fold').click(function () {
        if ($('.index_show_icon').is('.layui-icon-left')) {//点击应该收起
            menuSwitchHide();

        } else {
            menuSwitchShow();

            isShow = true;
        }
    });
});