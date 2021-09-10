layui.config({
    base: '../lib/layui/lay/modules/authtree/'
}).extend({
    authtree: 'authtree',
});

layui.use(['element', 'form', 'jquery', 'laydate', 'authtree'], function () {
    var element = layui.element;
    var table = layui.table;
    var form = layui.form;
    var $ = layui.jquery;
    var laydate = layui.laydate;
    var authtree = layui.authtree;
    var id = getQueryString("id");
    if (id == null || id.trim().length <= 0) {
        layer.msg("没有获取到当前信息的id，请联系管理员！", {
            icon: 7
        });
        return false;
    }
    getSystem();
    var system = {};

    function getSystem() {
        //加载所有的系统
        $.ajax({
            url: getAllSystemUrl,
            type: 'get',
            async: false,
            dataType: "json",
            success: function (data) {
                if (data != undefined && data != null) {
                    $('#systemid option').not(":first").remove();
                    for (var index in data.data) {
                        var item = data.data[index];
                        $("#systemid").append(
                            '<option value="' + item.systemid + '">' + item.systemname + '</option>'
                        );

                    }
                    FormInit();
                }
            }, error: function (data) {
                layer.msg('网络请求异常', {
                    icon: 7
                });

            }
        });
        form.render('select');
    }

    function FormInit() {
        $.ajax({
            url: selectRoleByIdUrl + "?id=" + id,
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
                            if (property == "systemId") {
                                $("#systemid option[value='" + data[property] + "']").prop("selected", "selected");
                                $("#systemid").attr("disabled", "disabled");
                            }
                            if (property == "issystem") {
                                $("input[name=issystem][value=0]").attr("checked", data[property] == "0" ? true : false);
                                $("input[name=issystem][value=1]").attr("checked", data[property] == "1" ? true : false);
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

    /**监听系统选择*/
    form.on('select(SystemnameFilter)', function (data) {
        var systemid = $("#systemid").val();
        if (systemid != undefined && systemid != null && systemid.toString().length >= 0) {
            return false;
        }
        layer.msg('没获取到您选择的系统名称', {
            icon: 7
        })
        return false;
    });


    form.verify({
        birthdayVerify: [/^((((1[6-9]|[2-9]\d)\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29-))(\s(([01]\d{1})|(2[0123])):([0-5]\d):([0-5]\d))?$/, '日期格式不正确']
    });

    form.on('submit(edit)', function (data) {
        setTimeout(function () {
            var resSaveLoading = top.layer.msg('数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});
            data.field.updateUserid = getUserId();
            data.field.updateIp = getIp();
            data.field.id = id;

            data.field.systemname = $("#systemid option[value='" + data.field.systemid + "']").html().trim();
            $.ajax({
                url: editRoleUrl,
                type: 'post',
                data: JSON.stringify(data.field),
                contentType: "application/json;charset=UTF-8",
                dataType: "json",
                async: false,
                success: function (json) {
                    top.layer.close(resSaveLoading);
                    if (json != null) {
                        if (json.code == 0) {
                            layer.msg("更新成功！", {icon: 6, time: 1000, anim: 4}, function () {
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
        }, 100);
        return false;
    });
})