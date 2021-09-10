layui.config({
    base: '../js/'
}).use(['form', 'layer', 'jquery', 'common'], function () {
    var $ = layui.$,
        form = layui.form,
        common = layui.common,
        layer = layui.layer;
    var id = getQueryString("id");
    var isAdd = false;
    //新增
    if (id == null || id.trim().length <= 0) {
        resAddInit()
    }
    //编辑
    else {
        /**菜单更新初始化*/

        resInit();
    }

    /***菜单新增初始化**/
    function resAddInit() {
        isAdd = true;
    }

    /***菜单更新初始化**/
    function resInit() {
        isAdd = false;
        $.ajax({
            type: 'get',
            url: selectDataSeviceByIdUrl + "?id=" + id,
            //data: JSON.stringify({}),
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
                            if (property == "servicesType") {
                                $("#servicesType option[value='" + data[property] + "']").prop("selected", "selected");
                                //$("#Lelel").attr("disabled", "disabled");
                            }
                        }

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

    /**表单验证*/
    form.verify({
        Name: function (value, item) {
            //验证菜单名称
            if (!new RegExp("^[0-9a-zA-Z\u4e00-\u9fa5]+$").test(value)) {
                return '菜单名称只能为中文数字或者字母';
            }

        },
        Servicesname: function (value) {
            if (value === "")
                return "服务名不能为空！";
            var message = '';
            $.ajax({
                async: false, //改为同步请求
                url: CheckDataSeviceName,
                data: {
                    servicesName: value,
                    id: id
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
        }
    });

    /**选择图标*/
    $(".select_img").click(function () {
        var url = "peimission_Icon.html";
        var index = layer.open({
            title: '<i class="larry-icon larry-bianji3"></i>' + '选择图标',
            type: 2,
            shade: false,
            content: url,
            area: ['100%', '80%'],
            zIndex: layer.zIndex,
            // skin: 'layui-layer-molv',
            end: function () {
            },
            success: function (layero, index) {

            }
        });
    });
    /**保存菜单资源信息*/
    form.on("submit(saveRes)", function (data) {
        setTimeout(function () {
            var resSaveLoading = top.layer.msg('数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});

            if (id == null || id.trim().length <= 0) {
                data.field.createId = getUserId();
            } else {
                data.field.handerId = getUserId();
            }
            $.ajax({
                url: addDataSeviceUrl,
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
                                layer.msg("保存成功！", {icon: 6, time: 1500, anim: 4}, function () {
                                    var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                                    parent.layer.close(index); //再执行关闭
                                });
                            }, 500);
                        } else {
                            setTimeout(function () {
                                layer.msg(json.msg, {
                                    icon: 7,
                                    time: 10000
                                });
                            }, 500);
                        }
                    }
                }, error: function (data) {

                    layer.msg('网络请求异常', {
                        icon: 7
                    });
                    top.layer.close(resSaveLoading);

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