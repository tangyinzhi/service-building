layui.use(['element', 'table', 'form', 'jquery', 'laydate'], function () {
    var element = layui.element;
    var table = layui.table;
    var form = layui.form;
    var $ = layui.jquery;
    var laydate = layui.laydate;

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
            where.likeValue = likeValue;
        }
        tableRender(where);
        return false;
    }

    tableRender();
    //点击查询按钮
    $(document).on('click', '#search', function (data) {
        search();//查询
    })
    //点击查询按钮
    form.on('submit(search)', function () {
        var servicesName = $("#seviceName").val();
        var start = $("#startTime").val();
        var end = $("#endTime").val();
        var where = {};
        if (servicesName != undefined && servicesName != null && servicesName.trim().length > 0) {
            where.servicesName = servicesName;
        }
        if (start != undefined && start != null && start.trim().length > 0) {
            where.start = start;
        }
        if (end != undefined && end != null && end.trim().length > 0) {
            where.end = end;
        }
        tableRender(where)
        return false;
    });

    //列表刷新
    function tableRender(where) {
        if (where == undefined || where == null) {
            where = {};
        }
        var index = layer.load(2);
        table.render({
            elem: '#tableId',
            url: selectDataSeviceByPageUrl,
            //method: "post",
            limit: 10,
            page: true,
            where: where,
            height: 'full-200',
            cols: [[
                {type: 'checkbox'},
                {type: 'numbers', title: '序号', width: 80},
                {field: 'servicesName', title: '服务名', width: 120},
                {field: 'servicesFullname', title: '服务全名', width: 200},
                {field: 'servicesType', title: '服务类型', width: 100},
                {field: 'servicesAddr', title: '服务地址', width: 300},
                {field: 'handerDate', title: '最后修改时间', width: 150},
                {field: 'servicesDescription', title: '服务描述信息'},
                {title: '操作', templet: '#operationTpl', style: 'color: #086fd4;', align: 'center'}
            ]],
            done: function (res, curr, count) {
                layer.close(index);
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

    table.on('tool(tableFilter)', function (obj) {
        var data = obj.data;
        var layEvent = obj.event;
        if (layEvent === 'edit') {
            layer.open({
                title: '编辑数据服务',
                type: 2,
                area: ['453px', '92%'],
                content: 'dataManager_edit.html?id=' + data.id,
                zIndex: layer.zIndex,
                end: function () {
                    tableRender();//列表刷新
                }
            });
        } else if (layEvent === 'del') {
            layer.confirm("确定要删除吗？", {skin: 'layui-layer-lan', icon: 2, title: '提示', anim: 6}, function () {
                $.ajax({
                    type: 'Post',
                    url: delDataSeviceUrl + "?id=" + data.id,
                    //data: JSON.stringify({ id: data.id }),
                    // contentType: "application/json;charset=UTF-8",
                    dataType: "json",
                    async: true,
                    success: function (json) {
                        if (json != null) {
                            if (json.code == 0) {
                                layer.msg("删除数据服务成功！", {icon: 1, time: 1000}, function () {
                                    tableRender();//列表刷新
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
                    idsStr += checkStatus.data[i].id + ',';
                }
                $.ajax({
                    type: 'Post',
                    url: delBatchDataSeviceUrl + "?batchIDs=" + idsStr,
                    //data: JSON.stringify({ batchIDs: idsStr }),
                    contentType: "application/json;charset=UTF-8",
                    dataType: "json",
                    async: true,
                    success: function (json) {
                        if (json != null) {
                            if (json.code == 0) {
                                layer.msg("操作成功！", {icon: 1, time: 1000}, function () {
                                    tableRender();//列表刷新
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

    $("#addDataManager").click(function () {
        layer.open({
            title: '添加二维数据服务',
            type: 2,
            area: ['453px', '92%'],
            content: 'dataManager_edit.html',
            zIndex: layer.zIndex,
            // skin: 'layui-layer-molv',
            end: function () {
                tableRender();//列表刷新
            }
        });
    });
})