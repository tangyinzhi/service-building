layui.config({
    base: '../lib/layui/lay/modules/formSelect/'
}).extend({
    formSelects: 'formSelects-v4'
});
layui.use(['element', 'form', 'jquery', 'laydate', 'formSelects'], function () {
    var element = layui.element;
    var table = layui.table;
    var form = layui.form;
    var $ = layui.jquery;
    var laydate = layui.laydate;
    var formSelects = layui.formSelects;
    var ID = getQueryString("id");
    var Enable = "";//状态开关的值
    if (ID == null || ID.trim().length <= 0) {
        layer.msg("没有获取到当前信息的ID，请联系管理员！", {
            icon: 7
        });
        return false;
    }

    getUserGroup();//获取所有用户组
    initForm();//初始化表单
    //表单验证
    form.verify({
        regPwd: function (value) {
            //获取密码
            var pwd = $("#Password").val();
            if (!new RegExp(pwd).test(value)) {
                return '两次输入的密码不一致';
            }
        },
        userName: function (value) {
            if (value === "")
                return "用户名不能为空！";
            var message = '';
            $.ajax({
                async: false, //改为同步请求
                url: CheckUserName,
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
        }
    });

    //监听Enable 开关
    form.on('switch(switchEnable)', function (data) {
        if (data.elem.checked) {
            Enable = "1";
        } else {
            Enable = "0";
        }

    });

    //加载用户组
    function getUserGroup() {
        $.ajax({
            url: selectAllUserGroup,
            type: 'get',
            async: false,
            dataType: "json",
            success: function (data) {
                if (data != undefined && data != null && data.code == 0) {
                    $('#roleid option').not(":first").remove();
                    for (var index in data.data) {
                        var item = data.data[index];
                        $("#roleid").append(
                            '<option value="' + item.groupId + '">' + item.groupName + '</option>'
                        );
                    }

                } else {
                    layer.msg(json.msg, {
                        icon: 7
                    });
                }
            }, error: function (data) {
                layer.msg('网络请求异常', {
                    icon: 7
                });

            }
        });
        form.render('select');
    }

    ////初始化表单
    function initForm() {
        $.ajax({
            url: selectUserByIdUrl + "?id=" + ID,
            type: 'get',
            async: true,
            dataType: "json",
            success: function (json) {
                if (json != null) {
                    if (json.code == 0) {
                        var data = json.data;
                        for (var property in data) {
                            var temp = document.getElementById(property);
                            if (temp)
                                $("#" + property).val(data[property]);
                            if (property == "password") {
                                $("#resPassword").val(data[property]);
                            }
                            if (property == "enable") {
                                $("#" + property).attr("checked", data[property] == "on" ? true : false);
                                Enable = data[property];
                                form.render('checkbox');
                            }
                            if (property == "userGroup") {
                                $("#userGroup option[value='" + data[property] + "']").prop("selected", "selected");
                            }
                            if (property == "sex") {
                                $("input[name=sex][value='0']").attr("checked", data[property] == "0" ? true : false);
                                $("input[name=sex][value='1']").attr("checked", data[property] == "1" ? true : false);
                                form.render('radio');
                            }

                        }
                        form.render('select');
                    } else {
                        layer.msg(json.msg, {
                            icon: 7
                        });
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

    form.on('submit(add)', function (data) {
        var resSaveLoading = null;
        setTimeout(function () {
            resSaveLoading = top.layer.msg('数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});
            data.field.userGroup = $("#roleid option[value='" + data.field.roleid + "']").html().trim();
            data.field.id = ID;
            if (Enable != undefined && Enable != null && Enable.toString().trim().length > 0) {
                data.field.enable = Enable;
            }
            $.ajax({
                url: editUserUrl,
                type: 'post',
                data: JSON.stringify(data.field),
                contentType: "application/json;charset=UTF-8",
                dataType: "json",
                async: false,
                success: function (json) {
                    top.layer.close(resSaveLoading);
                    if (json != null) {
                        if (json.code == 0) {
                            layer.msg("保存成功！", {icon: 6, time: 1000, anim: 4}, function () {
                                parent.layer.close(parent.layer.getFrameIndex(window.name));
                            });
                        } else {
                            layer.msg(json.msg, {
                                icon: 7
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
        }, 500)
        return false;
    });

})