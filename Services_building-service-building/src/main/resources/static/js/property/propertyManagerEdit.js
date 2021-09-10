layui.config({
    base: '../js/'
}).use(['form', 'layer', 'jquery', 'common'], function () {
    var $ = layui.$,
        form = layui.form,
        common = layui.common,
        layer = parent.layer === undefined ? layui.layer : parent.layer;

    var peId = getQueryString("peId");
    var isAdd = false;
    loadAllTableName();//获取所有的表名
    //新增
    if (peId == null || peId.trim().length <= 0) {
        resAddInit();
    }
    //编辑
    else {
        /**字段更新初始化*/

        resInit();

    }

    /***字段新增初始化**/
    function resAddInit() {
        isAdd = true;
    }

    /***字段更新初始化**/
    function resInit() {
        isAdd = false;
        $.ajax({
            type: 'get',
            url: selectGETBUILDE + "?peId=" + peId,
            dataType: "json",
            async: true,
            success: function (json) {
                if (json != null) {
                    if (json.code == 0) {
                        var data = json.data[0];
                        for (var property in data) {
                            var temp = document.getElementById(property);
                            if (temp) {
                                $("#" + property).val(data[property]);
                            }
                        }
                        if (property == "peParameter") {
                            $("#peParameter option[value='" + data[property] + "']").prop("selected", "selected");
                        }
                        if (property == "peParameterName") {
                            $("#peParameterName option[value='" + data[property] + "']").prop("selected", "selected");
                        }
                        $("#peTable").attr("disabled", "disabled");//表名不可修改
                        $("#peTableName").attr("disabled", "disabled");//表名不可修改
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
    // form.verify({
    //     Name: function (value, item) {
    //         //验证字段名
    //         if (!new RegExp("^[0-9a-zA-Z\_\-]+$").test(value)) {
    //             return '字段名只能为数字或者字母';
    //         }
    //
    //     },
    //
    //     //验证字段名
    //     ColumnName: function (value) {
    //         var TableName = $("#TableName").val();
    //         if (value === "")
    //             return "服务名不能为空！";
    //         var message = '';
    //         var IdN = 0;
    //         if (!isAdd) {
    //
    //         }
    //
    //         $.ajax({
    //             async: false, //改为同步请求
    //             url: CheckColumnscommentsNameUrl,
    //             data: {
    //                 columnName: value,
    //                 tableName: TableName,
    //                 ID: IdN
    //             },
    //             dataType: 'json',
    //             type: 'get',
    //             success: function (json) {
    //                 //var result = $.parseJSON(json);
    //                 var result = json;
    //                 if (result.code != 0)
    //                     message = result.msg;
    //             }
    //         });
    //         if (message !== '')
    //             return message;
    //     }
    // });
    /**获取所有的绑定字段名*/
    function loadAllTableName() {
        //加载父级菜单
        $.ajax({
            url: selectGETBUILDEALL,
            type: 'get',
            async: false,
            dataType: "json",
            success: function (json) {
                //var data = $.parseJSON(json);
                var data = json;
                if (data != undefined && data != null) {
                    $('#peParameter option').not(":first").remove();
                    for (var index in data.data) {
                        var item = data.data[index];
                        $("#peParameter").append(
                            '<option value="' + item.peParameter + '">' + item.peParameter + '</option>'
                        );
                        $("#peParameterName").append(
                            '<option value="' + item.peParameterName + '">' + item.peParameterName + '</option>'
                        );

                    }
                }
                $("#peParameter option").each(function () {
                    var getText = $(this).text();
                    if ($("#peParameter option:contains(" + getText + ")").length > 1)   /*作用：select option:contains("+text+")")包含text的个数 */
                    {
                        $("#peParameter option:contains(" + getText + "):gt(0)").remove();  /*作用：包含text大于个数0的选项就移除*/
                    }
                })
                $("#peParameterName option").each(function () {
                    var getName = $(this).text();
                    if ($("#peParameterName option:contains(" + getName + ")").length > 1)   /*作用：select option:contains("+text+")")包含text的个数 */
                    {
                        $("#peParameterName option:contains(" + getName + "):gt(0)").remove();  /*作用：包含text大于个数0的选项就移除*/
                    }
                })

            }, error: function (data) {
                layer.msg('网络请求异常', {
                    icon: 7
                });

            }
        });
        form.render('select');
    }

    form.on('select(peParameter)', function (data) {
        var parameter = data.value;
        $.ajax({
            type: "get",
            url: selectGETBUILDE + "?peParameter=" + parameter,
            dataType: "json",
            success: function (data) {
                if (data.code == 0) {
                    var data = data.data[0].peParameterName;
                    $("#peParameterName option[value='" + data + "']").prop("selected", "selected");
                }
            },
            error: function () {
                alert("建筑用途获取异常");
            }
        });
        form.render('select', 'link01');
    })

    /**保存菜单资源信息*/
    form.on("submit(saveRes)", function (data) {
        setTimeout(function () {
            var resSaveLoading = top.layer.msg('数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});
            $.ajax({
                url: addGETBUILDENUM,
                type: 'post',
                data: data.field,
                //contentType: "application/json",
                dataType: "json",
                async: false,
                xhrFields: {
                    'Access-Control-Allow-Origin': '*'
                },
                success: function (data) {
                    //var json = $.parseJSON(data);
                    var json = data;
                    top.layer.close(resSaveLoading);
                    if (json != null) {
                        if (json.code == 0) {
                            setTimeout(function () {
                                layer.msg("保存成功！", {icon: 6, time: 2000, anim: 4}, function () {
                                    var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                                    parent.layer.close(index); //再执行关闭
                                });
                            }, 100);
                        } else {
                            setTimeout(function () {
                                layer.msg(json.msg, {
                                    icon: 7,
                                    time: 3000
                                });
                            }, 1000);
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