layui.config({
    base: '../js/'
}).use(['form', 'layer', 'jquery', 'common'], function () {
    var $ = layui.$,
        form = layui.form,
        common = layui.common,
        layer = layui.layer;
    var Systemid = getQueryString("Systemid");
    var systemName = getQueryString("Systemname");
    if (Systemid == null || Systemid.trim().length <= 0 || systemName == null || systemName.trim().length <= 0) {
        layer.msg("没有获取到选中系统的ID，请联系管理员！", {
            icon: 7
        });
        return false;
    }
    /**菜单新增初始化*/
    resInit();

    /***菜单新增初始化**/
    function resInit() {
        $("#systemName").val(systemName);
        $("#systemId").val(Systemid);
        //默认菜单级别不可点击
        $("#bpLevel").attr("disabled", "disabled");
        //默认菜单级别不可点击
        $("#systemName").attr("disabled", "disabled");
        $("#systemId").attr("disabled", "disabled");
        form.render('select');
    }

    /**监听菜单类型选择*/
    form.on('select(resTypeFilter)', function (data) {
        //如果菜单类型为按钮, 菜单级别选中三级菜单,并禁用选择
        if (data.value == "2") {
            $("#bpLevel option[value='3']").prop("selected", "selected");
            $("#bpLevel").attr("disabled", "disabled");
        } else if (data.value == "0") {

            $("#bpLevel option[value='0']").prop("selected", "selected");
            $("#bpLevel").attr("disabled", "disabled");

        } else {
            $('#parentid option').not(":first").remove();
            $("#bpLevel").removeAttr("disabled");
            $("#bpLevel option:first").prop("selected", 'selected');
            $("#url").removeAttr("disabled", "disabled");
        }
        form.render('select');
        //加载父级菜单
        loadParentMenu();
    });
    /**监听菜单级别选择*/
    form.on('select(resLevelFilter)', function (data) {
        if (data.value == 0) {
            $("#url").val('');
            $("#url").attr("disabled", "disabled");
        } else {
            $("#url").removeAttr("disabled", "disabled");

        }
        //加载父级菜单
        loadParentMenu();
    });

    /**加载父级菜单*/
    function loadParentMenu(Type, bpLevel) {
        var Type = $("#bpType option:selected").val();
        var bpLevel = $("#bpLevel option:selected").val();

        if (Type != "" && bpLevel != "") {
            //1级菜单、父级菜单为空
            if (bpLevel == "0") {
                $('#parentid option').not(":first").remove();
                form.render('select');
                return;
            }
            //加载父级菜单
            $.ajax({
                url: selectPermissionParentMenu + '?bpType=' + Type + '&bpLevel=' + bpLevel + '&systemId=' + Systemid,
                type: 'get',
                async: false,
                dataType: "json",
                success: function (data) {
                    if (data != undefined && data != null) {
                        $('#parentid option').not(":first").remove();
                        for (var index in data.data) {
                            var item = data.data[index];
                            $("#parentid").append(
                                '<option value="' + item.id + '">' + item.name + '</option>'
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
    }

    /**选择图标*/
    $(".select_img").click(function () {
        var url = "peimission_Icon.html";
        var index = layer.open({
            title: '<i class="larry-icon larry-bianji3"></i>' + '选择图标',
            type: 2,
            shade: false,
            content: url,
            area: ['650px', '80%'],
            zIndex: layer.zIndex,
            // skin: 'layui-layer-molv',
            end: function () {
            },
            success: function (layero, index) {

            }
        });
    });


    /**表单验证*/
    form.verify({
        Name: function (value, item) {
            //验证菜单名称
            if (!new RegExp("^[0-9a-zA-Z\u4e00-\u9fa5]+$").test(value)) {
                return '菜单名称只能为中文数字或者字母';
            }

        },
        Url: function (value, item) {
            //验证菜单路径
            var bpLevel = $("#bpLevel").val();
            var resParentCount = $("#resParentCount").val();

            if ((bpLevel == "1" || bpLevel == "2") && value == '' && resParentCount < 0) {
                return '菜单路径不能为空';
            }
            if (value != '' && !new RegExp("^[0-9a-zA-Z_/./:/-]+$").test(value)) {
                return '菜单路径只能为英文下划线斜杠和点';
            }

        },
        resParentid: function (value, item) {
            //验证父级菜单
            var resLevel = $("#bpLevel").val();
            if ((resLevel == "1" || resLevel == "2" || resLevel == "3") && value == '') {
                return '父级菜单不能为空';
            }
        },
    });


    /**保存菜单资源信息*/
    form.on("submit(saveRes)", function (data) {
        setTimeout(function () {
            var resSaveLoading = top.layer.msg('数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});
            data.field.createUserid = getUserId();
            data.field.createIp = getIp();
            $.ajax({
                url: addPermissionUrl,
                type: 'post',
                data: JSON.stringify(data.field),
                contentType: "application/json;charset=UTF-8",
                dataType: "json",
                async: false,
                success: function (json) {
                    top.layer.close(resSaveLoading);
                    if (json != null) {
                        if (json.code == 0) {
                            layer.msg("添加成功！", {icon: 6, time: 1000, anim: 4}, function () {
                                parent.layer.close(parent.layer.getFrameIndex(window.name));
                            });
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