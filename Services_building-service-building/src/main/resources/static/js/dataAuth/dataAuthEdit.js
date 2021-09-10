layui.config({
    base: '../js/'
}).use(['form', 'layer', 'jquery', 'common'], function () {
    var $ = layui.$,
        form = layui.form,
        common = layui.common,
        layer = parent.layer === undefined ? layui.layer : parent.layer;
    var ID = getQueryString("ID");
    //新增
    if (ID == null || ID.trim().length <= 0) {
        ID = 0;
        var Systemid = getQueryString("Systemid");
        var Systemname = getQueryString("Systemname");
        if (Systemid == null || Systemid.trim().length <= 0 || Systemname == null || Systemname.trim().length <= 0) {
            layer.msg("没有获取到选中系统的ID，请联系管理员！", {
                icon: 7
            });
            return false;
        }
        resAddInit()
    }
    //编辑
    else {
        /**菜单更新初始化*/
        resInit();
    }

    /***菜单新增初始化**/
    function resAddInit() {
        $("#systemName").val(Systemname);
        $("#systemId").val(Systemid);

        //默认系统信息不可点击
        $("#systemName").attr("disabled", "disabled");
        $("#systemId").attr("disabled", "disabled");
        form.render('select');
        loadAlldataMenu();
    }

    /***菜单更新初始化**/
    function resInit() {
        $.ajax({
            type: 'get',
            url: selectDataAuthByIdUrl + "?id=" + parseInt(ID),
            //data: JSON.stringify({ systemId: Systemid }),
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            async: true,
            success: function (json) {
                if (json != null) {
                    if (json.code == 0) {
                        var data = json.data;
                        for (var property in data) {
                            var temp = document.getElementById(property);
                            if (temp)
                                $("#" + property).val(data[property]);
                        }
                        //加载所有数据权限
                        loadAlldataMenu();
                        $("#pid option[value='" + data.pid + "']").prop("selected", "selected");
                        //默认菜单级别不可点击
                        $("#systemName").attr("disabled", "disabled");
                        $("#systemId").attr("disabled", "disabled");
                        form.render('select');
                    } else {
                        layer.msg(json.msg, {
                            icon: 7
                        });
                    }
                }
            },
            error: function () {
                layer.msg('网络请求异常', {
                    icon: 7
                });
            }
        });
    }


    /**加载所有数据权限*/
    function loadAlldataMenu() {
        //加载父级菜单
        $.ajax({
            url: selectDataAuthByPageUrl + '?systemId=' + $("#systemId").val(),
            type: 'get',
            async: false,
            dataType: "json",
            success: function (data) {
                if (data != undefined && data != null) {
                    $('#Pid option').not(":first").remove();
                    for (var index in data.data) {
                        var item = data.data[index];
                        $("#pid").append(
                            '<option value="' + item.id + '">' + item.dataName + '</option>'
                        );
                    }
                }
            }, error: function (data) {
                layer.msg('网络请求异常', {
                    icon: 7
                });

            }
        });
        form.render('select');
    }

    /**选择图标*/
    $(".select_img").click(function () {
        var url = "res_img.html";
        common.cmsLayOpen('选择图标', url, '485px', '370px');
    });

    /**表单验证*/
    form.verify({
        Name: function (value, item) {
            //验证菜单名称
            if (!new RegExp("^[0-9a-zA-Z\u4e00-\u9fa5]+$").test(value)) {
                return '菜单名称只能为中文数字或者字母';
            }
            if (value === "")
                return "用户名不能为空！";
            var message = '';
            $.ajax({
                async: false, //改为同步请求
                url: CheckDataAuthName,
                data: {
                    name: value,
                    id: ID
                },
                dataType: 'json',
                type: 'get',
                success: function (result) {
                    if (result.code != 0)
                        message = result.msg;
                }
            });
            if (message !== '')
                return message;
        },
    });


    /**保存菜单资源信息*/
    form.on("submit(saveRes)", function (data) {
        setTimeout(function () {
            var resSaveLoading = top.layer.msg('数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});

            if (ID == undefined || ID == 0 || ID == null || ID.trim().length <= 0) {
                data.field.createUserid = getUserId();
                data.field.createIp = getIp();
            } else {
                data.field.updateUserid = getUserId();
                data.field.updateIp = getIp();
            }
            $.ajax({
                url: addDataAuthUrl,
                type: 'post',
                data: JSON.stringify(data.field),
                contentType: "application/json;charset=UTF-8",
                dataType: "json",
                async: false,
                success: function (json) {
                    top.layer.close(resSaveLoading);
                    if (json != null) {
                        if (json.code == 0) {
                            setTimeout(function () {
                                layer.msg("保存成功！", {icon: 6, time: 1000, anim: 4}, function () {
                                    var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                                    parent.layer.close(index); //再执行关闭
                                });
                            }, 100);
                        } else {
                            layer.msg(json.msg, {
                                icon: 7,
                                time: 100000
                            });
                        }
                    }
                }, error: function (data) {
                    top.layer.close(resSaveLoading);
                    layer.msg('网络请求异常', {
                        icon: 7
                    });

                }
            });
        }, 100)
        return false;
    })
    /**取消*/
    $("#cancle").click(function () {
        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        parent.layer.close(index); //再执行关闭
    });

});