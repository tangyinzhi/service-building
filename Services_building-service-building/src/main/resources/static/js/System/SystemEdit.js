layui.use(['element', 'form', 'jquery', 'laydate'], function () {
    var element = layui.element;
    var table = layui.table;
    var form = layui.form;
    var $ = layui.jquery;
    var laydate = layui.laydate;
    var Systemid = getQueryString("Systemid");
    if (Systemid == null || Systemid.trim().length <= 0) {
        layer.msg("没有获取到当前系统信息的ID请联系管理员！", {
            icon: 7
        });
        return false;
    }
    $.ajax({
        type: 'get',
        url: selectSystemByIdUrl + "?id=" + Systemid,
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        async: false,
        success: function (json) {
            if (json != null) {
                if (json.code == 0) {
                    var data = json.data;
                    for (var property in data) {
                        var temp = document.getElementById(property);
                        if (temp)
                            $("#" + property).val(data[property]);
                    }
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

    laydate.render({
        elem: '#birthday',
        type: "datetime"
    });
    //表单
    form.verify({
        birthdayVerify: [/^((((1[6-9]|[2-9]\d)\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29-))(\s(([01]\d{1})|(2[0123])):([0-5]\d):([0-5]\d))?$/, '日期格式不正确']
        , SystemName: function (value) {
            if (value === "")
                return "用户名不能为空！";
            var message = '';
            $.ajax({
                async: false, //改为同步请求
                url: CheckSystemName,
                data: {
                    name: value,
                    id: Systemid
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

    form.on('submit(add)', function (data) {
        data.field.systemid = Systemid;
        data.field.updateUserID = getUserId();
        data.field.updateIP = getIp();
        $.ajax({
            type: 'post',
            url: editSystemUrl,
            data: JSON.stringify(data.field),
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            async: false,
            success: function (json) {
                if (json != null) {

                    if (json.code == 0) {
                        layer.msg("编辑成功！", {icon: 6, time: 1000, anim: 4}, function () {
                            parent.layer.close(parent.layer.getFrameIndex(window.name));
                        });
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

        return false;
    });
});