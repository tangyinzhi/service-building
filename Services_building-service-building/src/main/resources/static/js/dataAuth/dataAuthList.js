NProgress.start();
window.onload = function () {
    NProgress.done();
}

layui.config({
    base: '../lib/layui/lay/modules/'
}).extend({
    treetable: 'treetable/treetable'
}).use(['element', 'table', 'form', 'jquery', 'laydate', 'treetable', 'tree'], function () {
    var element = layui.element;
    var form = layui.form;
    var table = layui.table;
    var $ = layui.jquery;
    var laydate = layui.laydate;
    var treetable = layui.treetable;

    var selectTreeNodeId = 0;
    var selectTreeNodeName = null;


    $("#treeCard").css("height", window.screen.availHeight * 0.84);
    //初始化树
    initTree();

    laydate.render({
        elem: '#startTime',
        type: "datetime"
    });

    laydate.render({
        elem: '#endTime',
        type: "datetime"
    });
    //查询
    form.on('submit(search)', function () {
        var url = selectDataAuthByPageUrl + '?systemId=' + selectTreeNodeId;
        var Dataname = $("#resName").val();
        var start = $("#startTime").val();
        var end = $("#endTime").val();
        if (Dataname != undefined && Dataname != null && Dataname.trim().length > 0) {
            url = url + "&dataName=" + Dataname;
        }
        if (start != undefined && start != null && start.trim().length > 0) {
            url = url + "&start=" + start;
        }
        if (end != undefined && end != null && end.trim().length > 0) {
            url = url + "&end=" + end;
        }
        treetableInit(url)
        return false;
    });
    document.onkeydown = function (e) {
        if (e.keyCode == 13) {//回车键
            search();//查询
            return false;
        }
    }

    //查询
    function search() {
        var url = selectDataAuthByPageUrl + '?systemId=' + selectTreeNodeId;
        var likeValue = $("#likeValue").val();
        var where = {};
        if (likeValue != undefined && likeValue != null && likeValue.trim().length > 0) {
            where.likeValue = likeValue.trim();
            url = url + "&likeValue=" + likeValue.trim();
        }
        treetableInit(url)
        return false;
    }

    //批量删除
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
                    url: delBatchDataAuthUrl + "?batchIDs=" + idsStr,
                    //data: JSON.stringify({ batchIDs: idsStr }),
                    contentType: "application/json;charset=UTF-8",
                    dataType: "json",
                    async: true,
                    success: function (json) {
                        if (json != null) {
                            if (json.code == 0) {
                                layer.msg("操作成功！", {icon: 1, time: 1000}, function () {
                                    treetableInit();
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
    })
    //添加权限
    $("#addPermission").click(function () {
        if (selectTreeNodeId == null || selectTreeNodeName == null) {
            layer.msg('请选择一个系统再点击添加权限！', {
                icon: 2
            });
            return;
        }
        layer.open({
            title: '添加权限',
            type: 2,
            shade: false,
            maxmin: true,
            shade: 0.5,
            anim: 0,
            area: ['420px', '360px'],
            content: 'dataAuth_edit.html?Systemid=' + selectTreeNodeId + "&Systemname=" + selectTreeNodeName,
            zIndex: layer.zIndex,
            // skin: 'layui-layer-molv',
            end: function () {
                setTimeout(treetableInit(), 500);

            }
        });
    });

    //系统信息树形菜单初始化
    function initTree() {
        var resTreeLoading;
        setTimeout(function () {
            resTreeLoading = layer.msg('加载中', {
                icon: 16,
                shade: 0.01,
                time: 0
            });
            $.ajax({
                type: 'get',
                url: getSystemTree,
                //data: JSON.stringify({}),
                contentType: "application/json;charset=UTF-8",
                dataType: "json",
                async: false,
                success: function (json) {
                    layer.close(resTreeLoading);
                    if (json != null) {
                        if (json.code == 0) {
                            treetableInit();
                            var data = json.data;
                            data.spread = true;//展开
                            layui.tree({
                                elem: '#tree'
                                , nodes: [data]
                                , click: function (node) {//node即为当前点击的节点数据 clik为点击后回调函数
                                    selectTreeNodeId = node.id;
                                    selectTreeNodeName = node.name;
                                    treetableInit();
                                }
                            });
                        } else {
                            layer.msg(json.msg, {
                                icon: 7
                            });
                        }
                    }
                },
                error: function () {
                    layer.close(resTreeLoading);
                    layer.msg('网络请求异常', {
                        icon: 7
                    });
                }
            });
        }, 500);

        //给layui-tree 添加选中时节点的样式
        $("body").on("mousedown", ".layui-tree a", function () {
            if (!$(this).siblings('ul').length) {
                $(".layui-tree a cite").css('color', '#333');
                $(this).find('cite').css('color', '#2c9afc');
            }
        });
    }

    function treetableInit(url) {
        if (url == undefined || url == null || url.toString().trim().length <= 0) {
            url = selectDataAuthByPageUrl + '?systemId=' + selectTreeNodeId;
        }
        var index = layer.load(2);
        var treeSpid = getTreeSpid(url);
        if (treeSpid < 0) {
            return false;
        }
        treetable.render({
            treeColIndex: 1,
            treeSpid: treeSpid,//树开始的父id即最高级父Id 
            treeIdName: 'id',
            treePidName: 'pid',
            elem: '#tableId',
            url: url,
            page: false,
            cols: [[
                {type: 'checkbox'},
                {field: 'dataName', width: "20%", title: '数据权限名称'},
                {field: 'systemName', width: "18%", title: '系统名'},
                {field: 'createUserid', title: '创建人ID'},
                {field: 'createTime', width: "16%", title: '创建时间', templet: '#Time'},

                {
                    field: 'type', width: "8%", align: 'center', templet: function (d) {
                        return '<span class="layui-badge layui-bg-gray">图层</span>';
                    }, title: '类型'
                },
                {templet: '#operationTpl', style: 'color: #086fd4;', align: 'center', title: '操作'}
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
                // 全部收起
                treetable.foldAll("#tableId");
            }
        });
    }

    //获取treetable 的 TreeSpid
    function getTreeSpid(url) {
        if (url == undefined || url == null || url.toString().trim().length <= 0) {
            url = selectDataAuthTreeSpid + '?systemId=' + selectTreeNodeId;
        }
        var where = url.split('?')[1];
        var res = 0;
        $.ajax({
            type: 'get',
            url: selectDataAuthTreeSpid + "?" + where,
            dataType: "json",
            async: false,
            success: function (json) {
                if (json.code == 0) {
                    res = json.data;
                } else {
                    layer.msg(json.msg, {
                        icon: 7
                    });
                    res = -99;
                }
            },
            error: function () {
                layer.msg('网络请求异常', {
                    icon: 7
                });
            }
        });
        return res;
    }

    //table操作栏监控
    table.on('tool(tableFilter)', function (obj) {
        var data = obj.data;
        var layEvent = obj.event;
        //编辑
        if (layEvent === 'edit') {
            layer.open({
                title: '编辑权限',
                type: 2,
                shade: false,
                maxmin: true,
                shade: 0.5,
                area: ['420px', '360px'],
                content: 'dataAuth_edit.html?ID=' + data.id,
                zIndex: layer.zIndex,
                end: function () {
                    treetableInit();
                }
            });
        }
        //删除
        else if (layEvent === 'del') {
            layer.confirm("确定要删除吗？", {skin: 'layui-layer-lan', icon: 2, title: '提示', anim: 6}, function () {
                $.ajax({
                    type: 'Post',
                    url: delDataAuthUrl + "?id=" + data.id,
                    //data: JSON.stringify({ ID: data.ID }),
                    contentType: "application/json;charset=UTF-8",
                    dataType: "json",
                    async: true,
                    success: function (json) {
                        if (json != null) {
                            if (json.code == 0) {
                                layer.msg("删除系统信息成功！", {icon: 1, time: 1000}, function () {
                                    treetableInit();//刷新页面
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
})