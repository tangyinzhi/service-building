layui.use(['element', 'table', 'form', 'jquery', 'laydate'], function () {
    var element = layui.element;
    var table = layui.table;
    var form = layui.form;
    var $ = layui.jquery;
    var laydate = layui.laydate;

    tableRender();//列表刷新
    //查询
    function search() {
        var groupName = $("#groupName").val();

        var where = {};
        if (groupName != undefined && groupName != null && groupName.trim().length > 0) {
            where.groupName = groupName;
        }
        var likeValue = $("#likeValue").val();

        if (likeValue != undefined && likeValue != null && likeValue.trim().length > 0) {
            where.likeValue = likeValue.trim();
        }

        tableRender(where)   //列表刷新   
    }

    //点击查询按钮
    $(document).on('click', '#search', function (data) {
        search();//查询
    })
    document.onkeydown = function (e) {
        if (e.keyCode == 13) {//回车键
            search();//查询
            return false;
        }
    }

    //列表刷新
    function tableRender(where) {
        if (where == undefined || where == null) {
            where = {};
        }
        table.render({
            elem: '#tableId',
            url: selectUserGroupByPageUrl,
            limit: 10,
            page: true,
            where: where,
            height: 'full-170',
            even: true,
            cols: [[
                {type: 'checkbox'},
                {type: 'numbers', title: '序号', width: 80},
                {field: 'groupName', title: '用户组名'},
                {field: 'groupType', title: '用户组类型'},
                {field: 'createTime', title: '创建时间'},
                {field: 'remarks', title: '备注'},
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
                title: '编辑用户组',
                type: 2,
                shade: false,
                maxmin: true,
                shade: 0.5,
                area: ['423px', '480px'],
                content: 'userGroupManager_edit.html?id=' + data.groupId,
                zIndex: layer.zIndex,
                end: function () {
                    search();//查询
                }
            });
        } else if (layEvent === 'del') {
            layer.confirm("确定要删除吗？", {skin: 'layui-layer-lan', icon: 2, title: '提示', anim: 0}, function () {
                $.ajax({
                    type: 'Post',
                    url: delBatchUserGroupUrl + "?batchIDs=" + data.groupId,
                    //data: JSON.stringify({ ID: data.ID }),
                    contentType: "application/json;charset=UTF-8",
                    dataType: "json",
                    async: true,
                    success: function (json) {
                        if (json != null) {
                            if (json.code == 0) {
                                layer.msg("删除用户组信息成功！", {icon: 1, time: 1000}, function () {
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
        layer.confirm("确定要批量删除吗？", {skin: 'layui-layer-lan', icon: 2, title: '提示', anim: 0}, function () {
            var checkStatus = table.checkStatus('tableId');
            var rows = checkStatus.data.length;
            if (rows > 0) {
                var idsStr = "";
                for (var i = 0; i < checkStatus.data.length; i++) {
                    idsStr += checkStatus.data[i].groupId + ',';
                }
                $.ajax({
                    type: 'Post',
                    url: delBatchUserGroupUrl + "?batchIDs=" + idsStr,
                    //data: JSON.stringify({ batchIDs: idsStr }),
                    contentType: "application/json;charset=UTF-8",
                    dataType: "json",
                    async: true,
                    success: function (json) {
                        if (json != null) {
                            if (json.code == 0) {
                                layer.msg("操作成功！", {icon: 1, time: 1000}, function () {
                                    tableRender();//表格重新加载
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

    $("#addUserGroup").click(function () {
        layer.open({
            title: '添加用户组',
            type: 2,
            shade: false,
            maxmin: true,
            shade: 0.5,
            anim: 0,
            area: ['423px', '480px'],
            content: 'userGroupManager_edit.html',
            zIndex: layer.zIndex,
            // skin: 'layui-layer-molv',
            end: function () {
                search();//查询
            }
        });
    });
})