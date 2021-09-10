layui.config({
    base: '../lib/layui/lay/modules/authtree/'
}).extend({
    authtree: 'authtree',
});
layui.use(['element', 'table', 'form', 'jquery', 'layer', 'authtree'], function () {
    var element = layui.element;
    var table = layui.table;
    var form = layui.form;
    var $ = layui.jquery;
    var layer = layui.layer;
    var authtree = layui.authtree;
    var selectTreeNodeId = 0;
    var selectTreeNodeName = null;
    initTree();//数据服务树形菜单初始化

    mapInit();
    var jsondata = [];//用于存储服务信息
//数据服务树形菜单初始化
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
                url: selectAllDataSevice,
                //data: JSON.stringify({}),
                contentType: "application/json;charset=UTF-8",
                dataType: "json",
                async: false,
                success: function (json) {
                    layer.close(resTreeLoading);
                    if (json != null) {
                        if (json.code == 0) {
                            var data = json.data;
                            jsondata = data;
                            $("#tree").html("");
                            var html = "";
                            // data.spread = true;//展开
                            for (var i = 0; i < data.length; i++) {
                                var item = data[i];
                                if (item) {
                                    html += "<div><a href=\"#\" onclick=\"selectServerById('" + item.id + "');return false;\" data-value=\"4\"><span>+</span>" + item.servicesName + "</a><p></p></div>\n";
                                }
                            }
                            $("#tree").html(html);
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

    window.selectServerById = selectServerById;

    /***查询数据**/
    function selectServerById(TreeNodeId) {
        listTabShow();
        selectTreeNodeId = TreeNodeId;
        $.ajax({
            type: 'get',
            url: selectDataSeviceByIdUrl + "?id=" + selectTreeNodeId,
            //data: JSON.stringify({}),
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            async: true,
            success: function (json) {
                if (json != null) {
                    if (json.code == 0) {
                        var data = json.data;
                        for (var property in data) {
                            var temp = document.getElementsByName(property);
                            if (temp && temp.length > 0)
                                $("[name='" + property + "']").html(data[property]);
                            if (property == "securityLevel") {
                                if (data[property] == undefined || data[property] == null) {
                                    serverLevel(1);
                                    continue;
                                }
                                serverLevel(data[property]);
                            }
                            if (property == "maprange") {
                                $("#maprange").html(data[property]);
                            }
                        }

                        form.render('select');
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
    }


//生成安全等级
    function serverLevel(data) {
        var htmlLevel = "";
        for (var i = 0; i < data; i++) {
            htmlLevel += "<img src=\"../images/star.gif\">";
        }
        $("#securityLevel").html(htmlLevel);
    }

    var map = null;

    //地图初始化
    function mapInit() {
        var coor = ol.proj.fromLonLat([105.398168975444, 28.89023477708057], 'EPSG:4326');

        //设置view
        var view = new ol.View({
            center: coor, //中心
            zoom: 17, //当前缩放级别
            minZoom: 1, //最小缩放级别
            maxZoom: 25, //最大缩放级别
            projection: 'EPSG:4326',
        });

        var layers = [
            new ol.layer.Tile({
                source: new ol.source.TileArcGISRest({
                    url: MAPBUTTON
                })
            })
        ];

        //设置view
        map = new ol.Map({
            layers: layers,
            target: 'map',

            view: view
        });

    }

    //地图显示
    $("#next").click(function () {

        $("#mapDiv").css("display", "block");
        $("#listTab").css("display", "none");
        $("#map").html("");
        mapInit();
        if (selectTreeNodeId != null && jsondata.length > 0) {
            for (var index in jsondata) {
                var item = jsondata[index];
                if (item.id == selectTreeNodeId) {
                    addLayer(item);
                    break;
                }
            }
        }
    });

//立刻进入点击触发事件
    $("#last").click(function () {

        listTabShow();
    });

    //属性展示
    function listTabShow() {
        $("#listTab").css("display", "block");
        $("#mapDiv").css("display", "none");
    }

    var layerItem = null;

    function addLayer(item) {
        if (!item || item.servicesAddr == null) {
            return;
        }
        if (map == null)
            return;
        if (layerItem != null) {
            map.removeLayer(layerItem);
            layerItem = null;
        }
        switch (item.servicesType) {

            case "ArcGISTiledMapServiceLayer":
            case "ArcGISDynamicMapServiceLayer":
            case "Rest": {
                layerItem = new ol.layer.Tile({
                    source: new ol.source.TileArcGISRest({
                        url: item.servicesAddr
                    })
                })
                break;
            }
            case "Wms": {
                layerItem = new ol.layer.Tile({
                    source: new ol.source.TileWMS({
                        params: {
                            'LAYERS': '0,1,2,3,4,5',
                            'TILED': false

                        },
                        url: item.servicesAddr,
                        projection: 'EPSG:4326',
                        // serverType:'mapserver'
                    })
                })
                break;
            }
            default: {
                layerItem = new ol.layer.Tile({
                    source: new ol.source.TileArcGISRest({
                        url: item.servicesAddr
                    })
                })
            }
        }
        map.addLayer(layerItem, 1);
    }
});



