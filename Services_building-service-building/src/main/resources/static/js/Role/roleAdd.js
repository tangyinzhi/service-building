layui.config({
    base: '../lib/layui/lay/modules/authtree/'
}).extend({
    authtree: 'authtree',
});
var system = {};
layui.use(['element', 'form', 'jquery', 'laydate', 'authtree'], function () {
    var element = layui.element;
    var table = layui.table;
    var form = layui.form;
    var $ = layui.jquery;
    var laydate = layui.laydate;
    var authtree = layui.authtree;
    getSystem();

    function getSystem() {
        //加载系统
        $.ajax({
            url: getAllSystemUrl,
            type: 'get',
            async: false,
            dataType: "json",
            success: function (data) {
                if (data != undefined && data != null && data.code == 0) {
                    $('#systemId option').not(":first").remove();
                    system = {}
                    for (var index in data.data) {
                        var item = data.data[index];
                        $("#systemId").append(
                            '<option value="' + item.systemid + '">' + item.systemname + '</option>'
                        );
                        system["" + item.systemId] = item.systemName;
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
        var systemId = $("#systemId").val();
        if (systemId != undefined && systemId != null && systemId.toString().length >= 0) {
            return false;
        }
        layer.msg('没获取到您选择的系统名称', {
            icon: 7
        })
        return false;
    });


    form.on('submit(add)', function (data) {
        var resSaveLoading = null;
        setTimeout(function () {

            resSaveLoading = top.layer.msg('数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});
            data.field.createUserid = getUserId();
            data.field.createIp = getIp();

            data.field.systemName = $("#systemId option[value='" + data.field.systemId + "']").html().trim();
            $.ajax({
                url: addRoleUrl,
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