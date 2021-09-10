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
    tableRender();

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
            url: selectRoleByPageUrl,
            limit: 10,
            page: true,
            where: where,
            even: true,
            height: 'full-170',
            cols: [[
                {type: 'checkbox'},
                {type: 'numbers', title: '序号', width: "8%", sort: true},
                {field: 'name', title: '角色名', width: "30%"},
                {field: 'systemName', title: '系统名', width: "20%"},
                {field: 'createTime', title: '创建时间', width: "20%"},
                {field: 'remark', title: '备注'},
                {title: '操作', templet: '#operationTpl', align: 'center', style: 'color: #086fd4;'}
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
        if (layEvent === 'edit') {
            layer.open({
                title: '编辑角色',
                type: 2,
                shade: false,
                maxmin: true,
                shade: 0.5,
                area: ['470px', '380px'],
                content: 'role-edit.html?id=' + data.id,
                zIndex: layer.zIndex,
                end: function () {
                    tableRender();//列表刷新
                }
            });
        } else if (layEvent === 'del') {
            layer.confirm("确定要删除吗？", {skin: 'layui-layer-lan', icon: 2, title: '提示', anim: 0}, function () {
                $.ajax({
                    type: 'Post',
                    url: delRoleUrl + "?id=" + data.id,
                    //data: JSON.stringify({ id: data.id }),
                    contentType: "application/json;charset=UTF-8",
                    dataType: "json",
                    async: true,
                    success: function (json) {
                        if (json != null) {
                            if (json.code == 0) {
                                layer.msg("删除角色信息成功！", {icon: 1, time: 1000}, function () {
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
            layer.open({
                title: '角色授权',
                type: 2,
                shade: false,
                maxmin: true,
                shade: 0.5,
                area: ['470px', '380px'],
                content: 'role-auth.html?id=' + data.id,
                zIndex: layer.zIndex,
                end: function () {
                    tableRender();//列表刷新
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
                    idsStr += checkStatus.data[i].id + ',';
                }
                $.ajax({
                    type: 'Post',
                    url: delBatchRoleUrl + "?batchIDs=" + idsStr,
                    //data: JSON.stringify({ Batchids: idsStr }),
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
                    anim: 0
                });
            }
        });
    });

    $("#addRole").click(function () {
        layer.open({
            title: '添加角色',
            type: 2,
            shade: false,
            maxmin: true,
            shade: 0.5,
            anim: 0,
            area: ['470px', '380px'],
            content: 'role-add.html',
            zIndex: layer.zIndex,
            // skin: 'layui-layer-molv',
            end: function () {
                tableRender();//列表刷新
            }
        });
    });
})