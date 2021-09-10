NProgress.start();
window.onload = function () {
    NProgress.done();
}

layui.config({
    base: '../lib/layui/lay/modules/'
}).extend({
    treetable: 'treetable/treetable'
}).use(['element', 'table', 'form', 'jquery', 'laydate', 'treetable'], function () {
    var element = layui.element;
    var form = layui.form;
    var table = layui.table;
    var $ = layui.jquery;
    var laydate = layui.laydate;
    var treetable = layui.treetable;

    laydate.render({
        elem: '#startTime',
        type: "datetime"
    });

    laydate.render({
        elem: '#endTime',
        type: "datetime"
    });

    tableInit();//加载表格
    //加载表格
    function tableInit(where) {

        if (where == undefined || where == null) {
            where = {};
        }
        table.render({
            elem: '#tableId',
            url: selectSystemByPageUrl,
            limit: 10,
            where: where,
            page: true,
            height: 'full-170',
            even: true,
            cols: [[
                {type: 'checkbox'},
                {type: 'numbers', title: '序号'},
                //{ field: 'systemid', title: '系统ID', width: 120, sort: true },
                {field: 'systemname', title: '系统名称', width: "22%"},
                {field: 'description', title: '系统描述', width: "22%"},
                {field: 'createtime', title: '创建时间', width: "22%"},
                {field: 'updatetime', title: '最新修改时间'},
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
        tableInit(where)
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
                title: '编辑系统',
                type: 2,
                shade: false,
                maxmin: true,
                shade: 0.5,
                area: ['500px', '400px'],
                content: 'System_edit.html?Systemid=' + data.systemid,
                zIndex: layer.zIndex,
                end: function () {
                    tableInit();//加载表格
                }
            });
        } else if (layEvent === 'del') {
            layer.confirm("确定要删除吗？", {skin: 'layui-layer-lan', icon: 2, title: '提示'}, function () {
                $.ajax({
                    type: 'Post',
                    url: delSystemUrl + "?id=" + data.systemid,
                    //data: JSON.stringify({ Systemid: data.systemid }),
                    contentType: "application/json;charset=UTF-8",
                    dataType: "json",
                    async: true,
                    success: function (json) {
                        if (json != null) {
                            if (json.code == 0) {
                                layer.msg("删除系统信息成功！", {icon: 1, time: 1000}, function () {
                                    tableInit();//加载表格
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

    $("#batchDel").click(function () {
        layer.confirm("确定要批量删除吗？", {skin: 'layui-layer-lan', icon: 2, title: '提示'}, function () {
            var checkStatus = table.checkStatus('tableId');
            var rows = checkStatus.data.length;
            if (rows > 0) {
                var idsStr = "";
                for (var i = 0; i < checkStatus.data.length; i++) {
                    idsStr += checkStatus.data[i].systemid + ',';
                }

                $.ajax({
                    type: 'Post',
                    url: delBatchSystemUrl + "?batchIDs=" + idsStr,
                    //data: JSON.stringify({ batchIDs: idsStr }),
                    contentType: "application/json;charset=UTF-8",
                    dataType: "json",
                    async: true,
                    success: function (json) {
                        if (json != null) {
                            if (json.code == 0) {
                                layer.msg("操作成功！", {icon: 1, time: 1000}, function () {
                                    tableInit();//加载表格
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
                });
            }
        });
    });

    $("#addPermission").click(function () {
        layer.open({
            title: '添加系统',
            type: 2,
            shade: false,
            maxmin: true,
            shade: 0.5,
            area: ['500px', '400px'],
            content: 'System_add.html ',
            zIndex: layer.zIndex,
            // skin: 'layui-layer-molv',
            end: function () {
                tableInit();//加载表格
            }
        });
    });
});