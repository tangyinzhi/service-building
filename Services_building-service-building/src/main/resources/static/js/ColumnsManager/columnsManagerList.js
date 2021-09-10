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
            url: selectColumnscommentsByPageUrl,
            limit: 10,
            page: true,
            where: where,
            height: 'full-170',
            even: true,
            cols: [[
                {type: 'checkbox'},
                {type: 'numbers', title: '序号', width: "8%", sort: true},
                {field: 'tableNameS', title: '表名', width: "14%"},
                {field: 'columnNameS', title: '字段名', width: "15%"},
                {field: 'dataType', title: '数据类型', width: "14%"},
                {field: 'dataLength', title: '数据存储长度', width: "11%"},
                {field: 'nullableS', title: '是否为空', width: "11%", templet: '#Nullable'},
                //{ field: 'Nullenum', title: '是否有枚举值', width: "10%", templet: '#Nullenum' },
                {field: 'comments', title: '字段注释', width: "13%"},
                {title: '操作', templet: '#operationTpl', style: 'color: #086fd4;', align: 'center'}
            ]],
            // data:[{
            //     "ID": "10001"
            //     ,"TableName": "DATAAUTH"
            //     ,"ColumnName": "obName"
            //     ,"DataType": "VARCHAR"
            //     ,"DataLength": "100"
            //     ,"Nullenum":"N"
            //     ,"Comments": "建筑名"
            // }, {
            //     "ID": "10002"
            //     ,"TableName": "DATAAUTH"
            //     ,"ColumnName": "obAddr"
            //     ,"DataType": "VARCHAR"
            //     ,"DataLength": "60"
            //     ,"Nullenum":"N"
            //     ,"Comments": "地址"
            // }, {
            //     "ID": "10003"
            //     ,"TableName": "DATAAUTH"
            //     ,"ColumnName": "obLdArea"
            //     ,"DataType": "VARCHAR"
            //     ,"DataLength": "50"
            //     ,"Nullenum":"N"
            //     ,"Comments": "基底面积"
            // }, {
            //     "ID": "10004"
            //     ,"TableName": "DATAAUTH"
            //     ,"ColumnName": "obBaseForm"
            //     ,"DataType": "VARCHAR"
            //     ,"DataLength": "50"
            //     ,"Nullenum":"Y"
            //     ,"Comments": "基础形式"
            // }],
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
                title: '编辑字段',
                type: 2,
                shade: false,
                maxmin: true,
                shade: 0.5,
                area: ['423px', '83%'],
                content: 'ColumnsManager_edit.html?ID=' + data.id + '& TableName =' + data.tableNameS,
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
                    type: 'Post',
                    url: delColumnscommentsUrl + "?id=" + data.id,
                    //data: JSON.stringify({ id: data.id }),
                    contentType: "application/json;charset=UTF-8",
                    dataType: "json",
                    async: true,
                    success: function (json) {
                        if (json != null) {
                            if (json.code == 0) {
                                layer.msg("删除字段成功！", {icon: 1, time: 1000}, function () {
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

    /**获取所有的表名*/
    function loadAllTableName() {
        //加载父级菜单
        $.ajax({
            url: selectAllTableNameUrl,
            type: 'get',
            async: false,
            dataType: "json",
            success: function (data) {
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

    $("#addColumn").click(function () {
        // var TableName = $("#TableName").val();
        // if (TableName == undefined || TableName == null || TableName.trim().length <= 0) {
        //     layer.msg('请选择表名', {
        //         icon: 7
        //     });
        //     return false;
        // }
        layer.open({
            title: '添加字段',
            type: 2,
            shade: false,
            maxmin: true,
            shade: 0.5,
            anim: 4,
            area: ['423px', '83%'],
            content: 'ColumnsManager_edit.html?TableName=' + "OT_BUILDING",
            //content: 'ColumnsManager_edit.html' ,
            zIndex: layer.zIndex,
            // skin: 'layui-layer-molv',
            end: function () {
                search();//查询
            }
        });
    });
})