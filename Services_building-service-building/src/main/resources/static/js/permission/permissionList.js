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

    document.onkeydown = function (e) {
        if (e.keyCode == 13) {//回车键
            search();//查询
            return false;
        }
    }
    //点击查询按钮
    $(document).on('click', '#search', function (data) {
        search();//查询
    })

    //查询
    function search() {
        var url = selectPermissionByPageUrl + '?systemId=' + selectTreeNodeId;
        var likeValue = $("#likeValue").val();
        if (likeValue != undefined && likeValue != null && likeValue.trim().length > 0) {
            url = url + "&likeValue=" + likeValue.trim();
        }
        treetableInit(url)
        return false;
    }

    //批量删除
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
                    url: delBatchPermissionUrl + "?batchIDs=" + idsStr,
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
            shade: 0.5,
            area: ['780px', '600px'],
            content: 'permission_add.html?Systemid=' + selectTreeNodeId + "&Systemname=" + selectTreeNodeName,
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
        $("#treeCard").css("height", window.screen.availHeight * 0.84);
        if (url == undefined || url == null || url.toString().trim().length <= 0) {
            url = selectPermissionByPageUrl + '?systemId=' + selectTreeNodeId;
        }
        var index = layer.load(2);
        var treeSpid = getTreeSpid(url);
        if (treeSpid < 0) {
            return false;
        }
        treetable.render({
            treeColIndex: 2,//树形图标显示在第几列
            treeSpid: treeSpid,//最上级的父级id
            treeIdName: 'id',//	id字段的名称
            treePidName: 'parentid',//pid字段的名称
            elem: '#tableId',
            treeDefaultClose: true,//是否默认折叠
            url: url,
            page: false,
            cols: [[
                {type: 'checkbox'},
                {field: 'name', width: "20%", title: '权限名称'},
                {field: 'displayName', width: "22%", title: '显示名'},
                {field: 'icon', title: '权限图标'},
                {field: 'createTime', width: "15%", title: '创建时间'},

                {
                    field: 'bpType', width: "8%", align: 'center', templet: function (d) {
                        if (d.bpType == "2") {
                            return '<span class="layui-badge layui-bg-gray">按钮</span>';
                        }
                        if (d.bpType == "0") {
                            return '<span class="layui-badge layui-bg-blue">目录</span>';
                        } else {
                            return '<span class="layui-badge-rim">菜单</span>';
                        }
                    }, title: '类型'
                },
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

    //获取treetable 的 TreeSpid
    function getTreeSpid(url) {
        if (url == undefined || url == null || url.toString().trim().length <= 0) {
            url = selectPermissionByPageUrl + '?systemId=' + selectTreeNodeId;
        }
        var where = url.split('?')[1];
        var res = 0;
        $.ajax({
            type: 'get',
            url: selectPermissionTreeSpid + "?" + where,
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
        if (res == undefined || res == null) {
            res = 0;
        }
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
                area: ['780px', '600px'],
                content: 'permission_edit.html?ID=' + data.id,
                zIndex: layer.zIndex,
                end: function () {
                    treetableInit();
                }
            });
        }
        //删除
        else if (layEvent === 'del') {
            layer.confirm("确定要删除吗？", {skin: 'layui-layer-lan', icon: 2, title: '提示'}, function () {
                $.ajax({
                    type: 'Post',
                    url: delPermissionUrl + "?id=" + data.id,
                    //data: JSON.stringify({ ID: data.id }),
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