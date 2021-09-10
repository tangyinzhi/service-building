layui.use(['element', 'table', 'form', 'jquery', 'laydate'], function () {
    var element = layui.element;
    var table = layui.table;
    var form = layui.form;
    var $ = layui.jquery;
    var laydate = layui.laydate;

    tableRender();//列表刷新
    //loadAllTableName();

    //回车键查询
    document.onkeydown = function (e) {
        if (e.keyCode == 13) {//回车键
            search();//查询
            return false;
        }
    }
    //点击查询按钮
    $("#search").click(function () {
        search();//查询
        return false;
    })

    //查询
    function search() {
        var likeValue = $("#likeValue").val();
        var where = {};
        if (likeValue != undefined && likeValue != null && likeValue.trim().length > 0) {
            where.likeValue = likeValue.trim();
        }
        tableRender(where)
        return false;
    }

    //列表刷新
    function tableRender(where) {
        if (where == undefined || where == null) {
            where = {};
        }
        table.render({
            elem: '#tableId',
            url: selectGETBUILDENUM,
            // limit: 10,
            page: true,
            where: where,
            height: 'full-170',
            even: true,
            cols: [[
                {type: 'checkbox'},
                {field: 'peName', title: '字段名'},
                {field: 'peParameter', title: '绑定字段'},
                {field: 'peParameterName', title: '字段注释'},
                {title: '操作', templet: '#operationTpl', style: 'color: #086fd4;', align: 'center'}
            ]],
            done: function (res, curr, count) {
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

    //table tool 事件
    table.on('tool(tableFilter)', function (obj) {
        var data = obj.data;
        var layEvent = obj.event;
        if (layEvent === 'edit') {
            layer.open({
                title: '编辑字段属性值',
                type: 2,
                area: ['423px', '550px'],
                content: 'propertyManager_edit.html?peId=' + data.peId,
                zIndex: layer.zIndex,
                end: function () {
                    search();//查询
                },
                success: function (layero) {
                    layero.find('.layui-layer-min').remove();
                },
            });
        } else if (layEvent === 'del') {
            layer.confirm("确定要删除吗？", {skin: 'layui-layer-lan', icon: 2, title: '提示', anim: 6}, function () {
                $.ajax({
                    type: 'get',
                    url: delGETBUILDENUM + "/" + data.peId,
                    //data: JSON.stringify({ peId: data.peId }),
                    contentType: "application/json;charset=UTF-8",
                    dataType: "json",
                    async: true,
                    success: function (json) {
                        if (json != null) {
                            if (json.code == 0 && json.count >= 1) {
                                layer.msg("删除属性值成功！", {icon: 1, time: 1000}, function () {
                                    search();//查询
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
        }
    });


    //点击批量删除按钮
    $("#batchDel").click(function () {
        layer.confirm("确定要批量删除吗？", {skin: 'layui-layer-lan', icon: 2, title: '提示', anim: 6}, function () {
            var checkStatus = table.checkStatus('tableId');
            var rows = checkStatus.data.length;
            if (rows > 0) {
                var idsStr = "";
                for (var i = 0; i < checkStatus.data.length; i++) {
                    idsStr += checkStatus.data[i].ID + ',';
                }
                $.ajax({
                    type: 'Post',
                    url: delBatchColumnscommentsUrl,
                    data: JSON.stringify({batchIDs: idsStr}),
                    contentType: "application/json;charset=UTF-8",
                    dataType: "json",
                    async: true,
                    success: function (json) {
                        if (json != null) {
                            if (json.code == 0 && json.count >= 1) {
                                layer.msg("操作成功！", {icon: 1, time: 1000}, function () {
                                    search();//查询
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
                    offset: 't',
                    anim: 6
                });
            }
        });
    });

    $("#addProperty").click(function () {
        // var TableName = $("#TableName").val();
        // if (TableName == undefined || TableName == null || TableName.trim().length <= 0) {
        //     layer.msg('请选择表名', {
        //         icon: 7
        //     });
        //     return false;
        // }
        layer.open({
            title: '添加字段属性值',
            type: 2,
            shade: false,
            maxmin: true,
            shade: 0.5,
            anim: 4,
            offset: '10px',
            area: ['423px', '550px'],
            //content: 'ColumnsManager_edit.html?TableName=' + TableName,
            content: 'propertyManager_edit.html',
            zIndex: layer.zIndex,
            // skin: 'layui-layer-molv',
            end: function () {
                search();//查询
            }
        });
    });
})