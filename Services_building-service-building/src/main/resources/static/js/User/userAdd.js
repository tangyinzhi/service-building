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

    getUserGroup();//获取所有用户组
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
                    name: value
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

    form.on('submit(add)', function (data) {
        var resSaveLoading = null;
        setTimeout(function () {
            //data.field.Roleid = layui.formSelects.value('selectId', 'valStr');    //取值val字符串
            //data.field.Roleids = layui.formSelects.value('selectId', 'nameStr');   //取值name字符串
            resSaveLoading = top.layer.msg('数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});
            //data.field.createUserID = getUserId();
            data.field.registerip = getIp();
            data.field.userGroup = $("#roleid option[value='" + data.field.roleid + "']").html().trim();
            if (data.field.enable == undefined || data.field.enable == null || data.field.enable.toString().trim().length <= 0) {
                data.field.enable = 0;
            }
            $.ajax({
                url: addUserUrl,
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