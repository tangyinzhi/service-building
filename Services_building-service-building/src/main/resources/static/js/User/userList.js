NProgress.start();
window.onload = function () {
    NProgress.done();
}
layui.use(['element', 'table', 'form', 'jquery', 'laydate'], function () {
    var element = layui.element;
    var table = layui.table;
    var form = layui.form;
    var $ = layui.jquery;
    var laydate = layui.laydate;

    laydate.render({
        elem: '#startTime',
        type: "datetime"
    });

    laydate.render({
        elem: '#endTime',
        type: "datetime"
    });
    TableInit();

    function TableInit(where) {
        if (where == undefined || where == null) {
            where = {};
        }
        table.render({
            elem: '#tableId',
            url: selectUserByPageUrl,
            limit: 10,
            page: true,
            where: where,
            height: 'full-170',
            //skin: "line",
            even: true,
            cols: [[
                {type: 'checkbox'},
                {type: 'numbers', title: '序号', width: "4.5%", sort: true},
                {field: 'name', title: '用户名', width: "8%"},
                {field: 'displayname', title: '姓名', width: "10%"},
                {field: 'userGroup', title: '用户组', width: "20%"},
                {field: 'mail', title: '邮箱', width: "15%"},
                {field: 'logions', title: '登陆次数', width: "10%"},
                {field: 'registertime', title: '创建时间'},
                {
                    field: 'enable',
                    title: '状态',
                    width: "8%",
                    event: 'Enable',
                    templet: '#statusTpl',
                    style: 'color: #5FB878;'
                },
                {title: '操作', templet: '#operationTpl', style: 'color: #086fd4;', align: 'center'}
            ]],
            done: function (res, curr, count) {
                //$("table thead").css("border-bottom-color", "#0c1a80");
                $("table thead").css("border-bottom-width", "15px");

                $('thead th').css({
                    'color': '#666', 'font-weight': 'bold', 'border-bottom': '3px solid #2491fc',
                    'font-size': '12px',
                    'font-weight': 'bolder',
                });
                //$("#countNum").text(count);
            }
        });
    }

    document.onkeydown = function (e) {
        if (e.keyCode == 13) {//回车键
            search();//查询
            return false;
        }
    }

    //查询
    function search() {
        var likeValue = $("#likeValue").val();
        var where = {};
        if (likeValue != undefined && likeValue != null && likeValue.trim().length > 0) {
            where.likeValue = likeValue.trim();
        }
        TableInit(where)
        return false;
    }

    //点击查询按钮
    $(document).on('click', '#search', function (data) {
        search();//查询
    })

    table.on('tool(tableFilter)', function (obj) {
        var data = obj.data;
        var layEvent = obj.event;
        if (layEvent === 'edit') {
            layer.open({
                title: '编辑用户',
                type: 2,
                shade: false,
                maxmin: true,
                shade: 0.5,
                offset: '10px',
                area: ['540px', '90%'],
                content: 'user-edit.html?id=' + data.id,
                zIndex: layer.zIndex,
                end: function () {
                    TableInit();//重新加载表格
                }
            });
        } else if (layEvent === 'del') {
            layer.confirm("确定要删除吗？", {skin: 'layui-layer-lan', icon: 2, title: '提示', anim: 0,}, function () {
                $.ajax({
                    type: 'Post',
                    url: delUserUrl + "?id=" + data.id,
                    //data: JSON.stringify({ id: data.id }),
                    //contentType: "application/json;charset=UTF-8",
                    //dataType: "json",
                    async: true,
                    success: function (json) {
                        if (json != null) {
                            if (json.code == 0) {
                                layer.msg("删除用户信息成功！", {icon: 1, time: 1500}, function () {
                                    TableInit();//重新加载表格
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
            });
        } else if (layEvent === 'Enable') {
            var idsStr = "" + data.id;
            var enable = "";
            if (data.enable == 0 || data.enable == "of") {
                enable = "on"
            } else {
                enable = "of"
            }
            ChangeStatus(idsStr, enable);//改变用户状态
        }
    });

    $("#batchEnabled").click(function () {
        layer.confirm("确定要批量启用吗？", {skin: 'layui-layer-lan', icon: 3, title: '提示'}, function () {
            var checkStatus = table.checkStatus('tableId');
            var rows = checkStatus.data.length;
            if (rows > 0) {
                var idsStr = "";
                for (var i = 0; i < checkStatus.data.length; i++) {
                    idsStr += checkStatus.data[i].id + ',';
                }
                ChangeStatus(idsStr, "on");//改变用户状态
            } else {
                layer.msg('未选择有效数据', {
                    ofset: 't',
                    anim: 0,
                });
            }
        });
    })

    $("#batchDisabled").click(function () {
        layer.confirm("确定要批量停用吗？", {skin: 'layui-layer-lan', icon: 3, title: '提示'}, function () {
            var checkStatus = table.checkStatus('tableId');
            var rows = checkStatus.data.length;
            if (rows > 0) {
                var idsStr = "";
                for (var i = 0; i < checkStatus.data.length; i++) {
                    idsStr += checkStatus.data[i].id + ',';
                }
                ChangeStatus(idsStr, "of");//改变用户状态

            } else {
                layer.msg('未选择有效数据', {
                    ofset: 't',
                    anim: 0,
                });
            }
        });
    });

    //改变用户状态
    function ChangeStatus(idsStr, Enable) {
        if (idsStr == undefined || idsStr == null || idsStr.trim().length <= 0) {
            idsStr = "0";
        }
        if (Enable == undefined || Enable == null) {
            Enable = "on";//默认启用
        }
        $.ajax({
            type: 'Post',
            url: editStausBatchUserStausUrl + "?batchIDs=" + idsStr + "&enable=" + Enable,
            //data: JSON.stringify({ batchIDs: idsStr, Enable: Enable }),
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            async: true,
            success: function (json) {
                if (json != null) {
                    if (json.code == 0 && json.count >= 1) {
                        layer.msg("操作成功！", {icon: 1, time: 1000}, function () {
                            TableInit();//重新加载表格
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
    }

    $("#batchDel").click(function () {
        layer.confirm("确定要批量删除吗？", {skin: 'layui-layer-lan', icon: 2, title: '提示', anim: 0,}, function () {
            var checkStatus = table.checkStatus('tableId');
            var rows = checkStatus.data.length;
            if (rows > 0) {
                var idsStr = "";
                for (var i = 0; i < checkStatus.data.length; i++) {
                    idsStr += checkStatus.data[i].id + ',';
                }
                console.log("选择的id-->" + idsStr);
                $.ajax({
                    type: 'Post',
                    url: delBatchUserUrl + "?batchIDs=" + idsStr,
                    //data: JSON.stringify({ batchIDs: idsStr }),
                    contentType: "application/json;charset=UTF-8",
                    dataType: "json",
                    async: true,
                    success: function (json) {
                        if (json != null) {
                            if (json.code == 0) {
                                layer.msg("操作成功！", {icon: 1, time: 1000}, function () {
                                    TableInit();//重新加载表格
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
            } else {
                layer.msg('未选择有效数据', {
                    ofset: 't',
                    anim: 0,
                });
            }
        });
    })

    $("#addUser").click(function () {
        layer.open({
            title: '添加用户',
            type: 2,
            shade: false,
            maxmin: true,
            shade: 0.5,
            anim: 0,
            offset: '10px',
            area: ['540px', '90%'],
            content: 'user-add.html',
            zIndex: layer.zIndex,
            // skin: 'layui-layer-molv',
            end: function () {
                TableInit();//重新加载表格
            }
        });
    })
})