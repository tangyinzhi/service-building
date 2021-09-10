var map;
var featureArr = [];
var wmsLayer;
var wmsLayerPoint;
var wmsLayerPointSelf;
var wmsLayerBuild;
var wmsLayerVido;
var wmsLayerGu;
var datasearchVectorLayer;
var pointLuPaiAllList = [];

var LayerArray = [];

var wmsLayerQu;
var Idlist = new Array();
var wmsLayerTotal;

//弹出框
var pop_container = null;
var pop_content = null;
var pop_closer = null;
var popTitle = null;
var overlay = null;
var onclikBuildSpaceLayerfeature = null;
var popups;

var BuildSpaceLayer = new ol.layer.Vector({
    projection: 'EPSG:4326',
    source: new ol.source.Vector(),
});
var BuildSpaceLayerPoint = new ol.layer.Vector({
    projection: 'EPSG:4326',
    source: new ol.source.Vector(),
});


//停车专题图层样式设置
var BuildUnSelectStyle = new ol.style.Style({
    fill: new ol.style.Fill({
        color: [255, 0, 0, 0.5]
    }),
    stroke: new ol.style.Stroke({
        lineDash: [1, 3, 5],
        width: 2,
        color: [255, 0, 0, 1]
    })
});
//停车专题图层样式设置
var BuildSelectStyle = new ol.style.Style({
    fill: new ol.style.Fill({
        color: [255, 255, 0, 0.5]
    }),
    stroke: new ol.style.Stroke({
        lineDash: [1, 3, 5],
        width: 2,
        color: [255, 0, 0, 1]
    })
});
// wmsLayerBuild = new ol.layer.Tile({
//     source: new ol.source.TileArcGISRest({
//         url: BUILDSERVICE
//     })
// });
$().ready(function () {
// $(function() {
//     FastClick.attach(document.body);
// });

//初始化页面多需要的元素
//注册layui

    layui.use(['layer', 'form', 'flow'], function () {
        var layer = layui.layer,
            form = layui.form,
            flow = layui.flow;

        layuiLoading("");

        //setHeight();
        var valuePoint = getValueOfUrl();
        initMap(valuePoint.lo, valuePoint.la, 17);
        setTimeout(function () {
            layuiRemoveLoading();
            if (!valuePoint.lo || !valuePoint.la) {
                var coord = [105.39814621210098, 28.89052122831345];
                map.getView().setCenter(coord);
                position();
            }
        }, 2000);
        //drowPoint();

        popups = new Popup(map);

        $.ajax({
            type: "get",
            // url: 'http://192.168.30.15:8080/building/DataService/getAll',
            url: MAPLAYERS,
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (result) {
                if (result.msg == "成功") {
                    var data = result.data;
                    var str = "";
                    var l;
                    for (var i = 0; i < data.length; i++) {
                        var wmsLayer = new ol.layer.Tile({
                            source: new ol.source.TileArcGISRest({
                                // url: BUILDSERVICE
                                url: data[i].servicesAddr
                            })
                        });
                        wmsLayer.setZIndex(100 + i);
                        LayerArray.push(wmsLayer);
                        str += '<hr><div style="padding-top: 5px" onclick="AddLayer(\'' + 'layer-' + i + '\')">\n' +
                            '<i id="' + 'layer-' + i + '" class="layui-icon map_icon ' + data[i].servicesDetails + '" ></i>\n' +
                            '<input type="text" value="' + data[i].servicesDescription + '" readonly="readonly" style="margin-top: 2px">\n' +
                            '</div>';

                        if (data[i].servicesDescription == '建筑') {

                            map.addLayer(wmsLayer);
                            l = i;
                        }

                    }
                    $("#mtab").append(str);
                    $('#layer-' + l).addClass('check');
                    $('#layer-' + l).css("color", "#1E9FFF");
                }
            },
            error: function () {
                layer.msg('网络请求异常', {icon: 7});
            }
        });

        // $('#build_map').addClass('check');
        // $("#build_map").css("color","#1E9FFF");
        // $("#build_map").attr("src", "../images/map/loupai11.png");
        // var buildstu= sessionStorage.getItem('buildstu');
//     if(buildstu == 'check'){
//         $('#edit_map').addClass('check');
//         $("#edit_map").attr("src", "../images/map/loupai11.png");
//     }
        //点击了查询
        $(document).on('click', '#chaxun', function (data) {
            if ($('#query_map').is('.check')) {
                $("#search_list").val('');
                $("#ldself_all").remove()
                $("#ld_all").append('<ul class="flow-default" id="ldself_all"></ul>');
                $('.flow-default').removeClass('flow-new')
                $('#numbox').prop("hidden", true);
                $('#query_map').removeClass('check');
                // $("#query_map").attr("src", "../images/map/loupai01.png");
                $("#query_map").css("color", "#0D0D0D");

            } else {
                $('#numbox').prop("hidden", false);
                $('#query_map').addClass('check');
                // $("#query_map").attr("src", "../images/map/loupai11.png");
                $("#query_map").css("color", "#1E9FFF");
                //点击了搜索
                $(document).on('click', '.search', function (data) {
                    BuildName = $("#search_list").val();
                    $("#ldself_all").remove()
                    $("#ld_all").append('<ul class="flow-default" id="ldself_all"></ul>');
                    flow.load({
                        elem: '#ldself_all' //流加载容器
                        , scrollElem: '#ldself_all' //滚动条所在元素，一般不用填，此处只是演示需要。
                        , done: function (page, next) { //执行下一页的回调
                            //模拟数据插入
                            setTimeout(function () {
                                var lis = [];
                                var str;
                                if (BuildName) {
                                    str = JSON.stringify({"OB_NAME": BuildName})
                                } else {
                                    str = JSON.stringify({})
                                }
                                $.ajax({
                                    type: "get",
                                    url: selectBuildingByPageUrl + "?page=" + page + "&limit=10&likeValue=" + BuildName,
                                    contentType: "application/json;charset=utf-8",
                                    dataType: "json",
                                    success: function (result) {
                                        if (result.msg == "成功") {
                                            var add = [];
                                            for (var i = 0; i < result.data.length; i++) {
                                                var addr = getObjectFromJson(result.data[i]);
                                                add.push(addr);
                                            }
                                            if (add.length > 0) {
                                                $('.flow-default').addClass('flow-new')
                                            }
                                            for (var i = 0; i < add.length; i++) {

                                                //lis.push('<li class="all" data-value="'+add[i].OB_ID+'">'+ add[i].OB_NAME +'<span style="margin-left: 12px;color: darkgray;">'+add[i].OB_ADDR+'</span></li>')
                                                lis.push('<li class="all" data-value="' + add[i].OB_ID + '"><div><img src="../images/map/seloca2.png" style="width: 22px;"></div>' +
                                                    '<div style="margin-left: 30px;margin-top: -22px;"><div style="color: #2491fc;">' + add[i].OB_NAME + '</div><div style="color: darkgray;padding: 5px 0">' + add[i].OB_ADDR + '</div></div></li>')
                                            }

                                            next(lis.join(''), page < Math.ceil(result.count / 10)); //假设总页数为 10

                                        }
                                    },
                                    error: function (err) {
                                        layer.msg('网络请求异常', {icon: 7});
                                    }
                                });

                            }, 500);
                        }
                    });
                });
                //点击搜索的结果
                $(document).on('click', '.all', function (data) {
                    var buildId = $(this).attr("data-value");
                    var popcenter;
                    $.ajax({
                        type: "post",
                        // url: BUILDINGSELECT,
                        // data:JSON.stringify({"obId":buildId}),
                        url: BUILDSELECTBY,
                        // data:JSON.stringify({"obId":url.id}),
                        data: JSON.stringify({"OB_ID": buildId}),
                        contentType: "application/json;charset=utf-8",
                        dataType: "json",
                        success: function (result) {
                            if (result.msg == "成功") {
                                var data = result.data[0];
                                if (data.OB_ID) {
                                    $.ajax({
                                        type: 'get',
                                        url: BUILDSERVICEINFO + "&objectIds=" + data.OBJECTID + "&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&returnGeometry=true&f=pjson",
                                        xhrFields: {
                                            'Access-Control-Allow-Origin': '*'
                                        },
                                        success: function (data) {
                                            var dataAll = JSON.parse(data);
                                            var result = dataAll.features[0].geometry.rings[0][0];
                                            var centerpo = [result[0], result[1]];
                                            popcenter = centerpo;
                                            map.getView().setCenter(centerpo);
                                        }
                                    })
                                } else {
                                    var lcenterpo = [data.OB_LONGITUDE, data.OB_LATITUDE]
                                    popcenter = lcenterpo;
                                    map.getView().setCenter(lcenterpo);
                                }
                                setTimeout(function () {
                                    var str = '<div id="kk" class="ol-unselectable kk"' +
                                        '     style="width: 220px;height: 100px;margin-top: 5px;margin-left: -5px;background:rgba(0, 0, 0, 0);color: #fff;text-align: left">' +
                                        '    <div class="layui-form-item item">' +
                                        '        <label class="">编号：</label>' +
                                        '        <label class="" style="width: 100%" id="kk_name">' + changString(data.OB_CODE) + '</label>' +
                                        '    </div>' +
                                        '    <div class="layui-form-item item">\n' +
                                        '        <label class="">建筑名称：</label>\n' +
                                        '        <label class="" style="width: 100%" id="kk_status">' + changString(data.OB_NAME) + '</label>' +
                                        '    </div>\n' +
                                        '    <div class="layui-form-item item">\n' +
                                        '        <label class="">结构类型：</label>\n' +
                                        '        <label class="" style="width: 100%" id="kk_type">' + changString(data.OB_STRU) + '</label>' +
                                        '    </div><div class="layui-form-item item">\n' +
                                        '        <label class="">地址：</label>\n' +
                                        '        <label class="" style="width: 100%" id="kk_la">' + changString(data.OB_ADDR) + '</label>' +
                                        '    </div><button type="button" data-value="' + data.OB_ID + '" class="layui-btn layui-btn-sm" id="buildedit" ' +
                                        'style="font-size: 14px;float: right;width: 50px;margin-right: 10px;background-color:#4b95dd;padding: 0px">编辑' +
                                        '</button><button type="button" data-value="' + data.OB_ID + '" class="layui-btn layui-btn-sm" id="buildlook" ' +
                                        'style="font-size: 14px;float: right;width: 50px;margin-right: 10px;background-color:#4b95dd;padding: 0px">查看' +
                                        '</button></div>';
                                    popups.tooltip(str, popcenter);
                                }, 500)

                            }
                            console.log(result.data)
                        }
                    })

                });
            }
        });

    });


    function setHeight() {
        var height = $("html").height();
        $("#mapDiv").css("height", height - 55);
    }


//定位坐标
    function position() {
        //window.Android.getLocationMap_Show();
    }

    function positionListener(latitude, longitude) {
        drowLocation(longitude, latitude);
        //设置一开始进去的定位点
        var coord = [longitude, latitude];
        map.getView().setCenter(coord);
    }

//初始化地图底图
    function initMap(x, y, zoom) {
        map = new ol.Map({
            target: 'mapDiv',
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.TileArcGISRest({
                        url: MAPBUTTON
                    })
                }),
            ],
            view: new ol.View({
                // center: [105.444445839231, 28.8799417959374],
                center: [x, y],
                zoom: zoom,
                minZoom: 10,
                maxZoom: 20,
                projection: 'EPSG:4326'
            }),
        });
        wmsLayerTotal = new ol.layer.Vector({
            source: new ol.source.Vector()
        });
        wmsLayerTotal.setZIndex(999);
        map.addControl(wmsLayerTotal);
        //添加比例尺
        var scaleLineControl = new ol.control.ScaleLine({
            //设置度量单位为米
            units: 'metric',
            target: 'scalebar',
            className: 'ol-scale-line'
        });
        map.addControl(scaleLineControl);

        //drowInitPoint(x,y);

        // wmsLayerBuild.setZIndex(100)
        // map.addLayer(wmsLayerBuild);


        //addLayerClickEnt(map, BuildSpaceLayer, BuildSpaceLayerClick);
        //addLayerPointerMoveEnt(map,BuildSpaceLayer,BuildSelectStyle,BuildUnSelectStyle);
        //map.addLayer(BuildSpaceLayerPoint);


        map.on('singleclick', function (evt) {
            if ($('#edit_map').is('.check')) {
                BuildSpaceLayerPoint.setSource(null);
                var geometry = '{"xmin" : ' + evt.coordinate[0] + ', "ymin" : ' + evt.coordinate[1] + ',   "xmax" : ' + (evt.coordinate[0] + 0.000000000000001) + ', "ymax" : ' + (evt.coordinate[1] + 0.000000000000001) + '}';
                $.ajax({
                    type: 'get',
                    url: BUILDSERVICEINFO + "&geometry=" + geometry + "&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&outFields=*&returnGeometry=true&f=pjson",
                    xhrFields: {
                        'Access-Control-Allow-Origin': '*'
                    },
                    success: function (data) {
                        var dataAll = JSON.parse(data);
                        var result = dataAll.features;
                        if (result.length <= 0) {
                            return;
                        }
                        for (var i = 0; i < result.length; i++) {
                            var attributes = result[i].attributes;
                            var obcode = changString(attributes.OB_CODE);
                            // var id = changString(attributes.OB_ID);
                            var id = changString(attributes.OB_ID);
                            //var id = attributes.PARKING_ID;
                            var buildname = changString(attributes.OB_NAME);
                            var buildstru = changString(attributes.OB_STRU);
                            var buildaddr = changString(attributes.OB_ADDR);
                            var str = '<div id="kk" class="ol-unselectable kk"' +
                                '     style="width: 220px;height: 100px;margin-top: 5px;margin-left: -5px;background:rgba(0, 0, 0, 0);color: #fff;text-align: left">' +
                                '    <div class="layui-form-item item">' +
                                '        <label class="">编号：</label>' +
                                '        <label class="" style="width: 100%" id="kk_name">' + obcode + '</label>' +
                                '    </div>' +
                                '    <div class="layui-form-item item">\n' +
                                '        <label class="">建筑名称：</label>\n' +
                                '        <label class="" style="width: 100%" id="kk_status">' + buildname + '</label>' +
                                '    </div>\n' +
                                '    <div class="layui-form-item item">\n' +
                                '        <label class="">结构类型：</label>\n' +
                                '        <label class="" style="width: 100%" id="kk_type">' + buildstru + '</label>' +
                                '    </div><div class="layui-form-item item">\n' +
                                '        <label class="">地址：</label>\n' +
                                '        <label class="" style="width: 100%" id="kk_la">' + buildaddr + '</label>' +
                                '    </div><button type="button" data-value="' + id + '" class="layui-btn layui-btn-sm" id="buildedit" ' +
                                'style="font-size: 14px;float: right;width: 50px;margin-right: 10px;background-color:#4b95dd;padding: 0px">编辑' +
                                '</button><button type="button" data-value="' + id + '" class="layui-btn layui-btn-sm" id="buildlook" ' +
                                'style="font-size: 14px;float: right;width: 50px;margin-right: 10px;background-color:#4b95dd;padding: 0px">查看' +
                                '</button></div>';

                            var coord = [evt.coordinate[0], evt.coordinate[1]];
                            popups.tooltip(str, coord);

                            var str = JSON.stringify({"obId": id});
                            //var str = JSON.stringify({"parkingId":id});
                            //获取建筑物点数据
                            //getBuildSpacePoint(str);
                        }


                    },
                    error: function () {
                        layer.msg('网络请求异常', {
                            icon: 7
                        });
                    }
                });
            }

        });
    }

    function getBuildSpacePoint(str) {
        $.ajax({
            type: 'post',
            //url: PARKINGSELECT,
            url: BUILDINGSELECT,
            data: str,
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            success: function (data) {
                if (data.code == 0) {
                    if (data.data != null) {
                        for (var i = 0; i < data.data.length; i++) {
                            var coordinatesPolygon = [];
                            if (data.data[i].parkingLocalA != undefined && data.data[i].parkingLocalA != null && data.data[i].parkingLocalA.trim().length > 0) {
                                var localAstrA = data.data[i].parkingLocalA.trim().split(",");
                                for (var j = 0; j < localAstrA.length; j = j + 2) {
                                    coordinatesPolygon.push([parseFloat(localAstrA[j]), parseFloat(localAstrA[j + 1])])
                                }
                            }
                            //var feature =  addParkingPolygon(coordinatesPolygon, BuildSpaceLayerPoint,BuildUnSelectStyle);
                            var feature = addParkingPolygon(BuildSpaceLayerPoint, BuildUnSelectStyle);
                            feature.setProperties({
                                "obcode": data.data[i].obCode,
                                // "Id": data.data[i].obId,
                                "Id": data.data[i].OB_ID,
                                "buildname": data.data[i].obName,
                                "buildstru": data.data[i].obStru,
                                "buildaddr": data.data[i].obAddr,
                            });
                        }
                        layuiRemoveLoading();
                    }
                } else {
                    layer.msg('查询失败', {icon: 2});
                }
            },
            error: function () {
                layer.msg('网络请求异常', {
                    icon: 7
                });
            }
        });

    }


    var vectorSource;

//画定位点
    function drowLocation(x, y) {
        map.removeLayer(datasearchVectorLayer);
        var vectorsource = new ol.source.Vector({});
        var geometrypt = new ol.geom.Point([x, y]);
        var feature = new ol.Feature({geometry: geometrypt});
        vectorsource.addFeature(feature);
        datasearchVectorLayer = new ol.layer.Vector({
            source: vectorsource,
            style: new ol.style.Style({
                image: new ol.style.Icon({
                    src: '../images/map/dw.png'
                }),
            })
        });
        datasearchVectorLayer.setZIndex(999);
        map.addLayer(datasearchVectorLayer);
    }

//画定初始进去的提交的点
    function drowInitPoint(x, y) {
        var vectorsource = new ol.source.Vector({});
        var geometrypt = new ol.geom.Point([x, y]);
        var feature = new ol.Feature({geometry: geometrypt});
        vectorsource.addFeature(feature);
        var datasearchVectorLayer = new ol.layer.Vector({
            source: vectorsource,
            style: new ol.style.Style({
                image: new ol.style.Icon({
                    src: '../images/map/point.png'
                }),
            })
        });
        map.addLayer(datasearchVectorLayer);
    }

//点击了建筑
// $(document).on('click', '#loupai', function (data) {
//     if ($('#build_map').is('.check')) {
//         $('#build_map').removeClass('check');
//         $("#build_map").css("color","#0D0D0D");
//         map.removeLayer(wmsLayerBuild);
//     } else {
//         $('#build_map').addClass('check');
//         $("#build_map").css("color","#1E9FFF");
//         wmsLayerBuild.setZIndex(100);
//         map.addLayer(wmsLayerBuild);
//     }
// });


//
// //点击了影像
// $(document).on('click', '#yingxi', function (data) {
//     data.stopPropagation();
//     if ($('#vido_map').is('.check')) {
//         $('#vido_map').removeClass('check');
//         $("#vido_map").css("color","#0D0D0D");
//         map.removeLayer(wmsLayerVido);
//     } else {
//         $('#vido_map').addClass('check');
//         $("#vido_map").css("color","#1E9FFF");
//         wmsLayerVido = new ol.layer.Tile({
//             source: new ol.source.TileArcGISRest({
//                 url: "http://218.88.215.93:6080/arcgis/rest/services/lzcq/MapServer"
//             })
//         });
//         wmsLayerVido.setZIndex(98)
//         map.addLayer(wmsLayerVido);
//     }
// });


// //点击了谷歌地图
// $(document).on('click', '#guge', function (data) {
//     data.stopPropagation();
//     if ($('#gu').is('.check')) {
//         $('#gu').removeClass('check');
//         $("#gu").css("color","#0D0D0D");
//         map.removeLayer(wmsLayerGu);
//     } else {
//         $('#gu').addClass('check');
//         $("#gu").css("color","#1E9FFF");
//         wmsLayerGu = new ol.layer.Tile({
//             source: new ol.source.TileArcGISRest({
//                 url: "http://218.88.215.93:6080/arcgis/rest/services/LMGoogleMap/MapServer"
//             })
//         });
//         wmsLayerGu.setZIndex(99);
//         map.addLayer(wmsLayerGu);
//     }
// });

//点击了列表
    $(document).on('click', '#lupai', function (data) {
        if ($('#point_map').is('.check')) {
            $('#point_map').removeClass('check');
            $("#point_map").css("color", "#0D0D0D");
            // $("#point_map").attr("src", "../images/map/pai01.png");
        } else {
            $('#point_map').addClass('check');
            $("#point_map").css("color", "#1E9FFF");
            // $("#point_map").attr("src", "../images/map/pai11.png");
        }
    });

//点击了新增
    $(document).on('click', '#luwang', function (event) {
        layer.open({
            title: '新增建筑物信息',
            type: 2,
            maxmin: false,
            shade: 0.5,
            area: ['px', '80%'],
            content: 'buildname_info.html',
            closeBtn: 1,
            // btn: ['保存'],
            // yes: function(index, layero) { //弹出框的位置
            //   var newpsw = window[layero.find('iframe')[0]['name']];
            // var value=newpsw.addInfo(0);
            // },
            success: function (layero) { //弹出框的位置--一开始进去就请求的方法
            }
        });
    });

//点击了编辑
    $(document).on('click', '#louedit', function (data) {
        if ($('#edit_map').is('.check')) {
            $('#edit_map').removeClass('check');
            $("#edit_map").css("color", "#0D0D0D");
        } else {
            $('#edit_map').addClass('check');
            $("#edit_map").css("color", "#1E9FFF");
        }
    });
//点击了统计
    $(document).on('click', '#tongji', function (data) {
        if ($('#total_map').is('.check')) {
            $('#total_map').removeClass('check');
            $("#total_map").css("color", "#0D0D0D");
            $('#maptotal').prop("hidden", true);
            wmsLayerTotal.setVisible(false);
            //wmsLayerQu.setVisible(true);

        } else {
            $('#total_map').addClass('check');
            $("#total_map").css("color", "#1E9FFF");
            document.getElementById("countList").innerHTML = '<object type="text/html" data="mapHtml/mapTotal.html" width="100%" height="97%"></object>';
            $('#maptotal').prop("hidden", false);
        }
    });

//点击了统计关闭
    $(document).on('click', '#countclose', function (data) {
        $('#total_map').removeClass('check');
        $("#total_map").css("color", "#0D0D0D");
        $('#maptotal').prop("hidden", true);
        wmsLayerTotal.setVisible(false);
        //wmsLayerQu.setVisible(true);
    });


//添加建筑物面
    function addParkingPolygon(layer, BuildUnSelectStyle) {
        if (layer == undefined || layer == null) {
            return;
        }
        var coordinates1 = [];

        source = layer.getSource();
        //标记数据集--普通要素
        if (source == undefined || source == null) {
            source = new ol.source.Vector();
        }
        var line = new ol.Feature({
            geometry: new ol.geom.Polygon([coordinates1]),
        });
        line.setStyle(new ol.style.Style({
            fill: new ol.style.Fill({
                color: [255, 0, 0, 0.5]
            }),
            stroke: new ol.style.Stroke({
                lineDash: [1, 3, 5],
                width: 2,
                color: [255, 0, 0, 1]
            })
        }));

        source.addFeature(line);
        layer.setSource(source);
        return line;
    }


//给layer添加click()事件
    function addLayerClickEnt(map, featurelayer, featureClickFunc) {
        if (map == undefined || map == null) {
            layer.msg('给图层添加点击事件失败：map为空', {
                icon: 2
            });
            return;
        }
        if (featurelayer == undefined || featurelayer == null) {
            layer.msg('给图层添加点击事件失败：featurelayer为空', {
                icon: 2
            });
            return;
        }
        if (featureClickFunc == undefined || featureClickFunc == null || typeof featureClickFunc != "function") {
            layer.msg('给图层添加点击事件失败：clickFunc为空或者不为', {
                icon: 2
            });
            return;
        }
        // MAP.map监听click点击事件
        var feature
        map.addEventListener('click', function (evt) {
            // 遍历当前map 当前分辨率下的所有要素并获取被点击的要素
            feature = evt.map.forEachFeatureAtPixel(evt.pixel, function (feature) {
                // (如果获取的要素属于目标图层则返回当前要素)
                if ($.inArray(feature, featurelayer.getSource().getFeatures()) > -1) {
                    return feature;
                }
            });
            if (feature == undefined || feature == null) {
                return;

            }
            //coodinate存放了点击时的坐标信息
            var coodinate = evt.coordinate;
            featureClickFunc(feature, coodinate);
        });
    }

//BuildSpaceLayerClick 点击事件
    function BuildSpaceLayerClick(feature, coodinate) {

        if (feature == undefined || feature == null) {
            layer.msg('获取的点击feature为空', {
                icon: 2
            });
            return;
        }
        if (coodinate == undefined || coodinate == null) {
            layer.msg('获取的点击的feature位置', {
                icon: 2
            });
            return;
        }
        var Properties = feature.getProperties();
        var buildname = Properties.OB_NAME;
        //var id = Properties.OB_ID;
        var id = Properties.OB_ID;
        var obcode = Properties.OB_CODE;
        var buildstru = Properties.OB_STRU;
        var buildaddr = Properties.OB_ADDR;
        popTitle.innerHTML = parkingCollecterNum; //标题
        popTitle.innerHTML = "LMAAAAA122" + obcode; //标题
        pop_content.innerHTML = "<label class='layui-form-label' style='width: 100%;text-align: left;'>建筑名称：" + buildname + "</label><br/><br/><label class='layui-form-label' style='width: 100%;text-align: left;'>结构类型：" + buildstru + "</label><br/><br/><label class='layui-form-label' style='width: 100%;text-align: left;'>地址：" + buildaddr +
            "</label><br/><br/><div class='layui-btn-group' style='float: right;'>" +
            "<button  type = \"button\" onClick=\"editBuild('" + id + "') \" class=\"layui-btn layui-btn-sm layui-btn-normal\">" +
            "<i class=\"layui-icon layui-icon-edit\"></i> 编辑</butto>" +
            "</div>"; //内容
        overlay.setPosition(coodinate); //位置
        onclikBuildSpaceLayerfeature = feature;
        return;
    }

    function addLayerPointerMoveEnt(map, featurelayer, SelectStyle, UnSelectStyle) {
        if (map == undefined || map == null) {
            layer.msg('给图层添加事件失败：map为空', {
                icon: 2
            });
            return;
        }
        if (featurelayer == undefined || featurelayer == null) {
            layer.msg('给图层添加事件失败：featurelayer为空', {
                icon: 2
            });
            return;
        }
        if (SelectStyle == undefined || SelectStyle == null) {
            layer.msg('给图层添加事件失败：SelectStyle为空', {
                icon: 2
            });
            return;
        }
        if (UnSelectStyle == undefined || UnSelectStyle == null) {
            layer.msg('给图层添加事件失败：UnSelectStyle为空', {
                icon: 2
            });
            return;
        }
        var selectSinglemove = new ol.interaction.Select({
            layers: [featurelayer], // Feature所属图层
            condition: ol.events.condition.pointerMove, // 交互方式（鼠标移动）
        });
        map.addInteraction(selectSinglemove);
        // 监听选中事件，然后在事件处理函数中改变被选中的`feature`的样式
        selectSinglemove.on('select', function (event) {
            if (event.selected.length > 0) // 鼠标移入，选择了一个，大概是mouseover事件
            {
                var feature = event.selected[0];
                if (feature != undefined && feature != null) {
                    event.selected[0].setStyle(SelectStyle);
                }

            }
            if (event.deselected.length > 0) // 鼠标移出，放弃选择，大概是mouseout事件功能
            {
                event.deselected[0].setStyle(UnSelectStyle);
            }
        });

    }

    function drowPoint() {
        if (wmsLayerPointSelf) {
            map.removeLayer(wmsLayerPointSelf);
        }
        layuiLoading("")
        //准备数据
        $.ajax({
            type: "post",
            url: BUILDINGSELECT,
            data: JSON.stringify({}),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            xhrFields: {
                'Access-Control-Allow-Origin': '*'
            },
            success: function (result) {
                if (result.status == 200) {
                    pointLuPaiAllList = [];
                    featureArr = [];
                    var vectorsource = new ol.source.Vector({});
                    for (var i = 0; i < result.data.length; i++) {
                        var roadPoint = new Object();
                        for (var j in result.data[i]) {
                            if (result.data[i][j]) {
                                roadPoint[j] = $.trim(result.data[i][j]);
                            } else {
                                roadPoint[j] = "";
                            }
                        }
                        if (roadPoint.OB_NAME && roadPoint.OB_ID) {
                            //Idlist.push(roadPoint.OB_ID);
                            Idlist.push(roadPoint.OBJECTID);
                        }
                        if (roadPoint.OB_LONGITUDE != null && roadPoint.OB_LATITUDE != "" && roadPoint.OB_LATITUDE != null) {
                            var geometrypt = new ol.geom.Point([roadPoint.OB_LONGITUDE, roadPoint.OB_LATITUDE]);
                            var feature = new ol.Feature({
                                geometry: geometrypt,
                                obcode: roadPoint.OB_CODE,
                                buildname: roadPoint.OB_NAME,
                                buildstru: roadPoint.OB_STRU,
                                buildaddr: roadPoint.OB_ADDR,
                                dataAll: roadPoint

                            });
                            feature.setStyle(new ol.style.Style({
                                image: new ol.style.Icon({
                                    src: '../images/map/point.png',
                                    scale: 0.8, //标注图标大小
                                }),
                            }));

                            pointLuPaiAllList['' + roadPoint.OB_ID] = feature;
                            if (feature != undefined) {
                                featureArr.push(feature);
                            }
                        }

                    }
                    if (feature != undefined) {
                        vectorsource.addFeature(feature);
                    }
                    //定义select控制器，点击标注后的事件
                    var select = new ol.interaction.Select();
                    //map加载该控件，默认是激活可用的
                    map.addInteraction(select);

                    select.on('select', function (e) {
                        var currentRome = e.selected[0];
                        var obcode = e.selected[0].N.dataAll.OB_CODE;
                        // var id = e.selected[0].N.dataAll.OB_ID;
                        var id = e.selected[0].N.dataAll.OB_ID;
                        var buildname = e.selected[0].N.dataAll.OB_NAME;
                        var buildstru = e.selected[0].N.dataAll.OB_STRU;
                        var buildaddr = e.selected[0].N.dataAll.OB_ADDR;
                        var nowlongitude = e.selected[0].N.dataAll.OB_LONGITUDE;
                        var nowlatitude = e.selected[0].N.dataAll.OB_LATITUDE;

                        if ($('#edit_map').is('.check')) {
                            var str = '<div id="kk" class="ol-unselectable kk"' +
                                '     style="width: 220px;height: 100px;margin-top: 5px;margin-left: -5px;background:rgba(0, 0, 0, 0);color: #fff;text-align: left">' +
                                '    <div class="layui-form-item item">' +
                                '        <label class="">编号：</label>' +
                                '        <label class="" style="width: 100%" id="kk_name">' + obcode + '</label>' +
                                '    </div>' +
                                '    <div class="layui-form-item item">\n' +
                                '        <label class="">建筑名称：</label>\n' +
                                '        <label class="" style="width: 100%" id="kk_status">' + buildname + '</label>' +
                                '    </div>\n' +
                                '    <div class="layui-form-item item">\n' +
                                '        <label class="">结构类型：</label>\n' +
                                '        <label class="" style="width: 100%" id="kk_type">' + buildstru + '</label>' +
                                '    </div><div class="layui-form-item item">\n' +
                                '        <label class="">地址：</label>\n' +
                                '        <label class="" style="width: 100%" id="kk_la">' + buildaddr + '</label>' +
                                '    </div><button type="button" data-value="' + id + '" class="layui-btn layui-btn-sm" id="buildedit" ' +
                                'style="font-size: 14px;float: right;width: 50px;margin-right: 10px;background-color:#4b95dd;padding: 0px">编辑' +
                                '</button><button type="button" data-value="' + id + '" class="layui-btn layui-btn-sm" id="buildlook" ' +
                                'style="font-size: 14px;float: right;width: 50px;margin-right: 10px;background-color:#4b95dd;padding: 0px">查看' +
                                '</button></div>';

                            var coord = [nowlongitude, nowlatitude];
                            popups.tooltip(str, coord);
                        }

                    });


                    var vectorSource = new ol.source.Vector({
                        features: featureArr
                    });
                    wmsLayerPointSelf = new ol.layer.Vector({
                        source: vectorSource
                    });
                    wmsLayerPointSelf.setZIndex(201);
                    map.addLayer(wmsLayerPointSelf);
                    layuiRemoveLoading();
                    if (Idlist.length > 0) {
                        setTimeout(function () {
                            getAlready(Idlist);
                        }, 10);
                    }
                }
            },
            error: function () {
                layuiRemoveLoading();
                layer.msg('网络请求异常', {icon: 7});
            }
        });
    }

    function getAlready(allist) {
        if (wmsLayerQu) {
            map.removeLayer(wmsLayerQu);
        }
        var objectIds = "";
        for (var q = 0; q < allist.length; q++) {
            objectIds += allist[q] + ','
            //var objectIds ='5,6,7,';
        }
        $.ajax({
            type: 'get',
            url: BUILDSERVICEINFO + "&objectIds=" + objectIds + "&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&returnGeometry=true&f=pjson",
            xhrFields: {
                'Access-Control-Allow-Origin': '*'
            },
            success: function (data) {
                var dataAll = JSON.parse(data);
                var result = dataAll.features;
                if (result == undefined || result == null || result.length <= 0) {
                    return;
                }
                var source = new ol.source.Vector();
                for (var i = 0; i < result.length; i++) {

                    var attributes = result[i].attributes;
                    var points = [];
                    var rings;
                    if (result[i].geometry) {
                        for (var j = 0; j < result[i].geometry.rings.length; j++) {
                            points.push(result[i].geometry.rings[j]);
                        }
                    }
                    for (var m = 0; m < points.length; m++) {
                        if (points[m] != undefined) {
                            rings = points[m];
                        }
                        var coordinates = new Array();
                        var coordinate = new Array();
                        coordinate = rings;

                        for (var l = 0; l < coordinate.length - 1; l++) {
                            coordinates.push(new ol.geom.Point(ol.proj.fromLonLat(coordinate[l], 'EPSG:4326')));
                        }

                        var coordinates1 = [];

                        //构造画面需要的点数据集
                        coordinates.forEach(function (point) {
                            coordinates1.push(point.getCoordinates());
                        });

                        if (coordinates1.length <= 0) {
                            continue;
                        }

                        //面要素
                        var lineFeature = new ol.Feature({
                            name: i,
                            geometry: new ol.geom.Polygon([coordinates1]),

                        });
                        // lineFeature.setId(attributes.OB_ID);
                        lineFeature.setStyle(new ol.style.Style({
                            fill: new ol.style.Fill({
                                color: [230, 0, 0, 0.2]
                            }),
                            stroke: new ol.style.Stroke({
                                lineDash: [1, 3, 5],
                                width: 2,
                                color: [255, 0, 0, 1]
                            })
                        }));
                        //添加要素到图层资源（source）
                        source.addFeature(lineFeature); //标记点集
                    }

                }
                wmsLayerQu = new ol.layer.Vector({
                    source: source
                });
                wmsLayerQu.setZIndex(999);
                map.addLayer(wmsLayerQu);

            },
            error: function () {
                layer.msg('getAlready网络请求异常', {
                    icon: 7
                });
            }
        })
    }
});








