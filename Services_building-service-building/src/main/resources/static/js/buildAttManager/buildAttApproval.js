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
    tableRender();

    //点击查询按钮
    $(document).on('click', '#search', function (data) {
        var Searchsname = $("#likeValue").val();
        var where = {};
        if (Searchsname != undefined && Searchsname != null && Searchsname.trim().length > 0) {
            where.likeValue = Searchsname;
        }
        tableRender(where)
        return false;
    })
    // form.on('submit(search)', function () {
    //     var Servicesname = $("#seviceName").val();
    //     var start = $("#startTime").val();
    //     var end = $("#endTime").val();
    //     var where = {};
    //     if (Servicesname != undefined && Servicesname != null && Servicesname.trim().length > 0) {
    //         where.Servicesname = Servicesname;
    //     }
    //     if (start != undefined && start != null && start.trim().length > 0) {
    //         where.start = start;
    //     }
    //     if (end != undefined && end != null && end.trim().length > 0) {
    //         where.end = end;
    //     }
    //     tableRender(where)
    //     return false;
    // });
    //列表刷新
    function tableRender(where) {
        if (where == undefined || where == null) {
            where = {};
        }
        table.render({
            elem: '#tableId',
            url: selectBuildingByPageUrl + "?obModelName=0",
            limit: 10,
            page: true,
            where: where,
            even: true,
            height: 'full-170',
            cols: [[
                {type: 'checkbox'},
                {type: 'numbers', title: '序号', width: 80, sort: true},
                {field: 'OB_NAME', title: '建筑名称'},
                {field: 'OB_ADDR', title: '详细地址'},
                {field: 'OB_USAGE', title: '建筑用途'},
                {field: 'OB_STRU', title: '结构类型'},
                {field: 'OB_PROPERTY_UNIT', title: '产权单位'},
                {field: 'OB_COMP_DATE', title: '建造年代'},
                {title: '操作', templet: '#operationTpl', align: 'center'}
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

    table.on('tool(tableFilter)', function (obj) {
        var data = obj.data;
        var layEvent = obj.event;

        var a = 'BuildAttManager_edit.html?ID=' + data.obId + '?type=' + layEvent;

        if (layEvent === 'edit') {
            if (layEvent === 'edit') {
                var tit = '建筑物信息编辑'
            } else {
                var tit = '建筑物信息查看'
            }
            layer.open({
                title: tit,
                type: 2,
                shade: false,
                maxmin: true,
                shade: 0.5,
                offset: '0px',
                area: ['70%', '85%'],
                content: 'BuildAttManager_edit.html?ID=' + data.OB_ID + '&type=' + layEvent,
                zIndex: layer.zIndex,
                end: function () {
                    // tableRender();//列表刷新
                },
                success: function (layero) {
                    layero.find('.layui-layer-min').remove();
                },
            });
        } else if (layEvent === 'look') {
            if (layEvent === 'edit') {
                var tit = '建筑物信息编辑'
            } else {
                var tit = '建筑物信息查看'
            }
            layer.open({
                title: tit,
                type: 2,
                shade: false,
                maxmin: true,
                shade: 0.5,
                offset: '0px',
                area: ['70%', '85%'],
                content: 'buildName_info_read.html?id=' + data.OB_ID + '&type=look',
                zIndex: layer.zIndex,
                end: function () {
                    // tableRender();//列表刷新
                },
                success: function (layero) {
                    layero.find('.layui-layer-min').remove();
                },
            });
        } else if (layEvent === 'del') {
            layer.confirm("确定要删除吗？", {skin: 'layui-layer-lan', icon: 2, title: '提示', anim: 0}, function () {
                $.ajax({
                    type: 'Post',
                    url: delBuildingUrl + "/" + data.OB_ID,
                    contentType: "application/json;charset=UTF-8",
                    dataType: "json",
                    async: true,
                    success: function (json) {
                        if (json != null) {
                            if (json.code == 0 && json.count >= 1) {
                                layer.msg("删除权限信息成功！", {icon: 1, time: 1000}, function () {
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
        } else if (layEvent === 'auth') {
            $.ajax({
                type: 'post',
                url: BUILDINGNAMESAVE,
                data: JSON.stringify({"OB_MODEL_NAME": "1", "OB_ID": data.OB_ID}),
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                success: function (data) {
                    // top.layer.close(resSaveLoading);
                    if (data.code == 0) {
                        layer.msg("操作成功！", {icon: 1, time: 1000}, function () {
                            tableRender();//列表刷新
                        });
                    } else {
                        layer.msg('操作失败', {icon: 2});
                    }
                },
                error: function () {
                    layer.msg('网络请求异常', {icon: 7});
                    // top.layer.close(resSaveLoading);
                }
            });
        }
    });
    //点击批量删除按钮
    $("#batchDel").click(function () {
        layer.confirm("确定要批量删除吗？", {skin: 'layui-layer-lan', icon: 2, title: '提示', anim: 0}, function () {
            var checkStatus = table.checkStatus('tableId');
            var rows = checkStatus.data.length;
            if (rows > 0) {
                var idsStr = "";
                for (var i = 0; i < checkStatus.data.length; i++) {
                    idsStr += checkStatus.data[i].OB_ID + ',';
                }
                $.ajax({
                    type: 'Post',
                    url: delBatchBuildingUrl,
                    data: JSON.stringify({batchIDs: idsStr}),
                    contentType: "application/json;charset=UTF-8",
                    dataType: "json",
                    async: true,
                    success: function (json) {
                        if (json != null) {
                            if (json.code == 0 && json.count >= 1) {
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
                    anim: 0
                });
            }
        });
    });

    $("#addBuilding").click(function () {
        layer.open({
            title: '新增建筑物信息',
            type: 2,
            maxmin: false,
            shade: 0.5,
            area: ['88%', '80%'],
            content: 'buildname_info.html',
            closeBtn: 1,
            success: function (layero) { //弹出框的位置--一开始进去就请求的方法
            }
        });
    });
})