layui.config({
    base: '../js/'
}).use(['form', 'layer', 'jquery', 'common'], function () {
    var $ = layui.$,
        form = layui.form,
        common = layui.common,
        layer = parent.layer === undefined ? layui.layer : parent.layer;
    //var tableName = getQueryString("tableName");
    //if (tableName == null || tableName.trim().length <= 0 ) {
    //    layer.msg("没有获取到表名，请联系管理员！", {
    //        icon: 7
    //    });
    //    return false;
    //}

    var ID = getQueryString("ID");
    var isAdd = false;
    //loadAllTableName();//获取所有的表名
    //新增
    if (ID == null || ID.trim().length <= 0) {
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
            url: selectColumnscommentsByIdUrl + "?id=" + ID,
            dataType: "json",
            async: true,
            success: function (json) {
                if (json != null) {
                    if (json.code == 0) {
                        var data = json.data;
                        for (var property in data) {
                            var temp = document.getElementById(property);
                            if (temp) {
                                $("#" + property).val(data[property]);
                            }
                            if (property == "dataType") {
                                $("#dataType option[value='" + data[property] + "']").prop("selected", "selected");
                                //$("#Lelel").attr("disabled", "disabled");
                            }
                            if (property == "nullableS") {
                                $("input[name=nullableS][value='Y']").attr("checked", data[property] == "Y" ? true : false);
                                $("input[name=nullableS][value='N']").attr("checked", data[property] == "N" ? true : false);
                                form.render('radio');
                            }
                            if (property == "nullenable") {
                                $("input[name=nullenable][value='Y']").attr("checked", data[property] == "Y" ? true : false);
                                $("input[name=nullenable][value='N']").attr("checked", data[property] == "N" ? true : false);
                                form.render('radio');
                            }
                            if (property == "nullenum") {
                                $("input[name=nullenum][value='Y']").attr("checked", data[property] == "Y" ? true : false);
                                $("input[name=nullenum][value='N']").attr("checked", data[property] == "N" ? true : false);
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
            //验证字段名
            if (!new RegExp("^[0-9a-zA-Z\_\-]+$").test(value)) {
                return '字段名只能为数字或者字母';
            }

        },

        //验证字段名
        ColumnName: function (value) {
            var TableName = $("#tableNameS").val();
            if (value === "")
                return "字段名不能为空！";
            var message = '';
            var IdN = 0;
            if (!isAdd) {
                IdN = ID;
            }
            $.ajax({
                async: false, //改为同步请求
                url: CheckColumnscommentsNameUrl,
                data: {
                    columnName: value,
                    tableName: TableName,
                    ID: IdN
                },
                dataType: 'json',
                type: 'get',
                success: function (json) {
                    //var result = $.parseJSON(json);
                    var result = json;
                    if (result.code != 0)
                        message = result.msg;
                }
            });
            if (message !== '')
                return message;
        }
    });

    /**获取所有的表名*/
    function loadAllTableName() {
        //加载父级菜单
        $.ajax({
            url: selectAllTableNameUrl,
            type: 'get',
            async: false,
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            success: function (json) {
                //var data = $.parseJSON(json);
                var data = json;
                if (data != undefined && data != null) {
                    $('#TableName option').not(":first").remove();
                    for (var index in data.data) {
                        var item = data.data[index];
                        $("#TableName").append(
                            '<option value="' + item.TableName + '">' + item.TableName + '</option>'
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

    /**保存菜单资源信息*/
    form.on("submit(saveRes)", function (data) {
        setTimeout(function () {
            var resSaveLoading = top.layer.msg('数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});
            if (data.field.id == undefined || data.field.id == null || data.field.id.trim().length <= 0) {
                data.field.id = "";
            }
            $.ajax({
                url: addColumnscommentsUrl,
                type: 'post',
                data: JSON.stringify(data.field),
                //contentType: "application/json",
                dataType: "json",
                async: false,
                contentType: "application/json;charset=UTF-8",
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