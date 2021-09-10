layui.config({
    base: '../lib/layui/lay/modules/formSelect/'
}).extend({
    formSelects: 'formSelects-v4'
});
layui.use(['element', 'form', 'jquery', 'laydate', 'formSelects'], function () {
    var form = layui.form;
    var $ = layui.jquery;
    var formSelects = layui.formSelects;
    var ID = getQueryString("id");
    //新增
    if (ID == null || ID.trim().length <= 0) {
    }
    //编辑
    else {
        /**更新初始化*/
        initForm();
    }
    getRole();//获取所有角色
    //表单验证
    form.verify({
        regPwd: function (value) {
            //获取密码
            var pwd = $("#Password").val();
            if (!new RegExp(pwd).test(value)) {
                return '两次输入的密码不一致';
            }
        },
        userGroupName: function (value) {
            if (value === "")
                return "用户组名不能为空！";
            var message = '';
            $.ajax({
                async: false, //改为同步请求
                url: CheckUserGroupNameUrl,
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

    //获取所有角色
    function getRole() {
        $.ajax({
            url: getAllrole,
            type: 'get',
            async: false,
            dataType: "json",
            success: function (data) {
                if (data != undefined && data != null && data.code == 0) {
                    $('#createIp option').not(":first").remove();
                    for (var index in data.data) {
                        var item = data.data[index];
                        $("#createIp").append(
                            '<option value="' + item.id + '">' + item.name + '</option>'
                        );
                    }
                    formSelects.render('selectId');
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
            url: selectUserGroupByIdUrl + "?id=" + ID,
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

                            if (property == "createIp") {
                                if (data[property] != undefined && data[property] != null && data[property].length > 0) {
                                    var dataStrArr = data[property].split(",");//分割成字符串数组  
                                    //var dataIntArr = [];//保存转换后的整型字符串  
                                    //dataStrArr.forEach(function (dataArr, index, arr) {
                                    //    dataIntArr.push(dataArr);
                                    //});
                                    formSelects.value('selectId', dataStrArr);
                                }
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

            $.ajax({
                url: addUserGroupUrl,
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