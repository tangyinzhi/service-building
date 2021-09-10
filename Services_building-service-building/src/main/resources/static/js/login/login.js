layui.use(['element', 'form', 'jquery', 'layer'], function () {
    //submit();
    var $ = layui.jquery;
    var layer = layui.layer;

    submit();
    $("#login_btn").click(function () {
        logAdd();
        return false;
    });

    function submit() {
        //判断登录地址中是否包含用户和密码（CS登录连接中包含用户名和密码），即如果通过CS跳转，参数带有账号密码，则直接验证，泸州定制  ↓
        var user = getQueryString("user");
        var password = getQueryString("password");

        if (user !== "" && password !== "") {
            $("#username").val(user);
            $("#password").val(password);
            logAdd();
        }
        //判断登录地址中是否包含用户和密码（CS登录连接中包含用户名和密码），即如果通过CS跳转，参数带有账号密码，则直接验证，泸州定制   ↑
        $("body").keydown(function (event) { /*获取回车事件*/
            if (event.keyCode === "13") {
                logAdd();
            }
        });

    }

    var resSaveLoading = null;

    function logAdd() {
        var num = 0;
        var str = "";

        var userInfo = {
            UserName: "",
            Password: ""
        };

        //从输入框获取用户名字以及密码
        userInfo.UserName = $("#username").val();
        userInfo.Password = $("#password").val();
        /*进行登录判断*/
        var flag = false;
        var url = CheckUserLogion;
        var postdata = {
            name: userInfo.UserName,
            password: userInfo.Password
        };
        setTimeout(function () {
            resSaveLoading = top.layer.msg("<span style='color:black'>" + "登录验证中，请稍候" + "</span>", {
                icon: 16,
                time: false,
                shade: 0.8
            });
            $.ajax({
                type: "post",
                url: url,
                data: JSON.stringify(postdata),
                async: false,
                dataType: "json",
                contentType: "application/json;charset=UTF-8",
                success: function (data) {
                    //var dataObj = $.parseJSON(data);
                    var dataObj = data;
                    if (dataObj == null || dataObj.data == null) {
                        layer.close(resSaveLoading);
                        layer.msg("<span style='color:black'>" + data.msgs + "</span>", {
                            icon: 7
                        });

                    } else {
                        /*查询权限*/
                        login(dataObj.data, userInfo);
                    }
                    return false;
                },
                error: function () {
                    layer.close(resSaveLoading);
                    layer.msg("<span style='color:black'>" + "登陆服务调用失败,url" + url + "</span>", {
                        icon: 7
                    });
                }
            });
        }, 100);
    }

    /*查询权限*/
    function login(dataObj, userInfo) {
        /********** func *************/
        var user_right;
        var resSaveLoading = null;
        setTimeout(function () {
            resSaveLoading = top.layer.msg("<span style='color:black'>" + "查询权限中，请稍候" + "</span>", {
                icon: 16,
                time: false,
                shade: 0.8
            });
            var userid = dataObj.id;
            $.ajax({
                type: "GET",
                url: selectAuthoritByUserId + "?id=" + userid + "&systemId=" + systemid,
                async: false,
                dataType: "json",
                success: function (data) {
                    //var data = $.parseJSON(json);
                    if (data != null && data.code == 0) {
                        /*将信息写入cookie,必须在服务器或者本地服务器下*/
                        var Cookie = JSON.stringify({
                            MANAGERID: dataObj.id,
                            MANAGERNAME: dataObj.name,
                            RIGHTINFO: data.data.rightInfo,
                            rightMenuInfo: data.data.rightMenuInfo
                        });
                        $.JSONCookie("MANAGER_INFO", {
                            MANAGERID: dataObj.id,
                            MANAGERNAME: dataObj.name,
                            RIGHTINFO: data.data.rightInfo,
                            rightMenuInfo: data.data.rightMenuInfo
                        }, {path: '/', expires: 10});
                        /*如果本地直接打开，则用sessionStorage  也可以抛弃cookies，直接使用sessionStorage */
                        if (!$.cookie("MANAGER_INFO")) {
                            var sessionstorage = window.sessionStorage;
                            sessionstorage.setItem("MANAGERID", dataObj.id);
                            sessionstorage.setItem("MANAGERNAME", dataObj.name);
                            sessionstorage.setItem("RIGHTINFO", JSON.stringify(data.data.rightInfo));
                            sessionstorage.setItem("DATAINGO", JSON.stringify(data.data.dataInfo));
                            sessionstorage.setItem("DATASEVICEINFO", JSON.stringify(data.data.dataSeviceInfo));
                            sessionstorage.setItem("rightMenuInfo", JSON.stringify(data.data.rightMenuInfo));
                        }
                        var cookie = $.cookie("MANAGER_INFO");
                        layer.close(resSaveLoading);
                        /*跳转到主页面*/
                        location.href = "index.html";
                        return false;
                    } else {
                        layer.close(resSaveLoading);
                        layer.msg(json.msg, {
                            icon: 7
                        });
                    }
                }, error: function (data) {
                    layer.close(resSaveLoading);
                    layer.msg("<span style='color:black'>" + "网络请求异常" + "</span>", {
                        icon: 7
                    });

                }

            });
        }, 500)
        /********** func *************/
    }
});