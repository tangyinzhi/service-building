layui.config({
    base: '../../lib/layui/lay/modules/layui_exts/'
}).extend({
    excel: 'excel',
});


var pLayer = window.parent.wmsLayerQu;

layui.use(['element', 'table', 'form', 'jquery', 'laydate', 'excel', 'layer'], function () {
    var element = layui.element;
    var table = layui.table;
    var form = layui.form;
    var $ = layui.jquery;
    var laydate = layui.laydate;
    var excel = layui.excel;
    var layer = layui.layer;
    statisticsClick();
    //tableInit();
    /**监听字段选择*/
    form.on('select(peParameterFilter)', function (data) {
        // var peName = $("#peName").val();
        statisticsClick();

        return false;
    });
    $("#dataValue").on("input", function (e) {
        statisticsClick();

        return false;
    });
    var tableData = [];

    //统计列表
    function tableInit(data) {
        tableData = [];
        if (data == undefined || data == null) {
            data = {data: []};

        }
        var jsonData = data.data;
        var totalNumber = 0;
        if (jsonData != undefined && jsonData.length > 0 && valueKeyData != undefined) {
            for (var key in valueKeyData) {
                var jsonDataRe = {};
                jsonDataRe.COUNTNUM = valueKeyData[key];
                jsonDataRe.COLUMNNAME = key;
                totalNumber += jsonDataRe.COUNTNUM;
                tableData.push(jsonDataRe);
            }
            jsonData.push({"COLUMNNAME": "总数", "COUNTNUM": totalNumber});
            tableData.push(jsonData[jsonData.length - 1]);
        }


        table.render({
            elem: '#demoEvent'
            , cols: [[ //标题栏
                {field: 'COLUMNNAME', title: '字段'},
                {field: 'COUNTNUM', title: '统计值'}
            ]],
            data: tableData,
            //skin: 'line', //表格风格,
            //toolbar: false,
            // toolbar: "#barDemo",
            limit: 100,
            height: 320,
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
        //监听行单击事件（单击事件为：rowDouble）
        table.on('row(demoEvent)', function (obj) {
            var data = obj.data;

            var data = obj.data;

            var peParameter = $("#peParameter").val();
            if (peParameter == undefined || peParameter == null) {
                return;
            }
            if (window.parent.wmsLayerTotal) {
                window.parent.map.removeLayer(window.parent.wmsLayerTotal);
            }
            //window.parent.wmsLayerQu.setVisible(false);
            if (data.COLUMNNAME == '总数') {
                layer.msg('无统计总数图层');
                return false;
            }
            if (data.COLUMNNAME == '其他') {
                var surl = BUILDTOTAL + peParameter + " is null &geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&returnGeometry=true&f=pjson";
            } else {

                var peValue = data.COLUMNNAME;
                var peValues = peValue.split('%');
                var likeValue = "";
                for (var value in peValues) {
                    if (likeValue != "") {
                        likeValue += " and ";
                    }
                    likeValue += peParameter + " like %27%25" + peValues[value] + "%25%27";
                }

                var surl = BUILDTOTAL + likeValue + "&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&returnGeometry=true&f=pjson";
                if (peParameter.trim() == "OB_COMP_DATE") {
                    surl = BUILDTOTAL + "to_char(" + peParameter + ",'yyyy')" + " like %27%25" + peValue + "%25%27&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&returnGeometry=true&f=pjson";
                    var dataValue = $("#dataValue").val();
                    if (dataValue != undefined && dataValue != null && dataValue.toString() != null && dataValue.toString().trim().length > 0) {
                        surl = BUILDTOTAL + "OB_COMP_DATE <= add_months (SYSDATE,-" + dataValue + "*12 )" + " &geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&returnGeometry=true&f=pjson";

                    }
                }
            }

            console.log(peParameter);
            console.log(peValue);

            $.ajax({
                type: 'get',
                url: surl,
                xhrFields: {
                    'Access-Control-Allow-Origin': '*'
                },
                success: function (data) {
                    if (window.parent.wmsLayerTotal != null && window.parent.wmsLayerTotal != null) {
                        window.parent.map.removeLayer(window.parent.wmsLayerTotal);
                    }
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
                                    color: [0, 0, 230, 0.2]
                                }),
                                stroke: new ol.style.Stroke({
                                    lineDash: [1, 3, 5],
                                    width: 2,
                                    color: [0, 0, 255, 1]
                                })
                            }));
                            //添加要素到图层资源（source）
                            source.addFeature(lineFeature); //标记点集
                        }

                    }
                    window.parent.wmsLayerTotal = new ol.layer.Vector({
                        source: source
                    });
                    window.parent.wmsLayerTotal.setZIndex(999);
                    window.parent.map.addLayer(window.parent.wmsLayerTotal);

                },
                error: function () {
                    layer.msg('统计图层网络请求异常', {
                        icon: 7
                    });
                }
            })
        });
        table.on('tool(demoEvent)', function (obj) {


        });
    }

    var clickIndex = 0;

    function exportClick() {
        if (tableData.length <= 0) {
            alert("当前统计为空");
            return false;
        }
        if (clickIndex == 0) {
            tableData.unshift({"COLUMNNAME": "字段", "COUNTNUM": "统计值"});
            clickIndex++
        }
        exportExcel(tableData);
        return false;
    }

    window.exportClick = exportClick;

    function exportExcel(data) {
        // 2. 调用设置样式的函数，传入设置的范围，支持回调
        excel.setExportCellStyle(data, 'A1:B1', {
            s: {
                fill: {bgColor: {indexed: 64}, fgColor: {rgb: "f2f2f2"}},
                border: {diagonal: {style: "solid", color: {rgb: "e6e6e6"}}},
                alignment: {
                    horizontal: 'center',
                    vertical: 'center'
                }
            }
        }, function (cell, newCell, row, config, currentRow, currentCol, fieldKey) {
            // 回调参数，cell:原有数据，newCell:根据批量设置规则自动生成的样式，row:所在行数据，config:传入的配置,currentRow:当前行索引,currentCol:当前列索引，fieldKey:当前字段索引
            return newCell;// 隔行隔列上色
        });
        var exportData = excel.filterExportData(data, ["COLUMNNAME", "COUNTNUM"]);
        var peParameter = $("#peParameter").val();
        //  执行导出函数，系统会弹出弹框
        excel.exportExcel({
            sheet1: exportData
        }, peParameter + '数据统计.xlsx', 'xlsx');
    }

    // 统计
    function statisticsClick() {
        var peParameter = $("#peParameter").val();
        if (peParameter != undefined && peParameter != null && peParameter.toString().length >= 0) {
            if (peParameter == "OB_COMP_DATE") {
                $("#dataYear").css("display", "block");
            } else {
                $("#dataYear").css("display", "none");
                $("#dataValue").val("");
            }
            echartInit();
            return false;
        }
        layer.msg('没获取到您选择的字段值', {
            icon: 7
        })

        return false;
    }

    //获取统计数据  
    function getStatisticsData(clown) {
        var statisticsData = null;
        var url = totalBuildingUrl + "?columnName=" + clown;
        var dataValue = $("#dataValue").val();
        if (dataValue != undefined && dataValue != null && dataValue.toString() != null && dataValue.toString().trim().length > 0) {
            url = totalBuildingWithdataUrl + "?columnName=" + clown + "&dateValue=" + dataValue;
        }
        $.ajax({
            url: url,
            type: 'get',
            cache: false,
            async: false,
            dataType: 'json',
            contentType: "application/json;charset=UTF-8",
            success: function (data) {
                if (data != null)
                    statisticsData = data;
            }
        });
        return statisticsData;
    }

    var valueData = new Array();
    var KeyData = new Array();
    var valueKeyData = new Array();
    var jsonValue = [];

    //匹配统计数据
    function matchingData(json) {
        if (json != null && json.data != undefined && json.data != null) {
            var data = json.data;
            valueData = new Array();
            KeyData = new Array();
            valueKeyData = new Array();
            jsonValue = [];
            var number = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
            for (var key in data) {
                if (data[key] != null && key != null) {
                    var keys = data[key].COLUMNNAME.split(';');
                    for (var index in keys) {
                        if (keys[index] != null) {
                            if (number.indexOf(keys[index]) > -1) {
                                continue;
                            }
                            if (keys.length > 1 && keys[index].trim().length == 0 && index >= 1) {
                                continue;
                            }
                            var keyValue = isNull(keys[index]);
                            if (valueKeyData.hasOwnProperty(keyValue)) {
                                valueKeyData[keyValue] = valueKeyData[keyValue] + data[key].COUNTNUM;
                                continue;
                            }
                            valueKeyData[keyValue] = data[key].COUNTNUM;
                            valueData[key] = data[key].COUNTNUM;
                            KeyData[key] = isNull(keys[index]);
                        }
                    }

                }
            }
            for (var key in KeyData) {
                if (KeyData[key] != null && key != null) {
                    var jsondata = {
                        value: valueData[key],
                        name: isNull(KeyData[key])
                    };
                    jsonValue.push(jsondata);
                }
            }
            KeyData.sort();
            valueData.sort();
            //valueKeyData.sort();
        }
    }

    //统计图初始化
    function echartInit() {
        var value = $("#peParameter").val();
        if (value == undefined || value == null || value.toString().trim().length <= 0) {
            layer.msg('没有选择统计的字段，请选择', {
                icon: 5,
                time: 1000
            });
            return;
        }
        var data = getStatisticsData(value);
        matchingData(data);
        tableInit(data);
        // 基于准备好的dom，初始化echarts实例  ---折线
        var myChart = echarts.init(document.getElementById('main'));
        //var myChart = echarts.init(document.getElementById('main'));
        // 指定图表的配置项和数据
        option = {
            xAxis: {
                type: 'category',
                data: KeyData
            },
            yAxis: {
                type: 'value'
            },
            axisLabel: {
                interval: 0,
                formatter: function (value) {
                    var ret = "";//拼接加\n返回的类目项
                    var maxLength = 4;//每项显示文字个数
                    var valLength = value.length;//X轴类目项的文字个数
                    var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数
                    if (rowN > 1)//如果类目项的文字大于3,
                    {
                        for (var i = 0; i < rowN; i++) {
                            var temp = "";//每次截取的字符串
                            var start = i * maxLength;//开始截取的位置
                            var end = start + maxLength;//结束截取的位置
                            //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                            temp = value.substring(start, end) + "\n";
                            ret += temp; //凭借最终的字符串
                        }
                        return ret;
                    } else {
                        return value;
                    }
                }
            },
            series: [{
                data: valueData,
                type: 'line',
                smooth: true
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);

        // 基于准备好的dom，初始化echarts实例     ---柱状图
        var myChart1 = echarts.init(document.getElementById('main1'));
        //var myChart = echarts.init(document.getElementById('main'));
        // 指定图表的配置项和数据
        option1 = {
            xAxis: {
                type: 'category',
                data: KeyData
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: valueData,
                type: 'bar'
            }],
            axisLabel: {
                interval: 0,
                formatter: function (value) {
                    var ret = "";//拼接加\n返回的类目项
                    var maxLength = 4;//每项显示文字个数
                    var valLength = value.length;//X轴类目项的文字个数
                    var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数
                    if (rowN > 1)//如果类目项的文字大于3,
                    {
                        for (var i = 0; i < rowN; i++) {
                            var temp = "";//每次截取的字符串
                            var start = i * maxLength;//开始截取的位置
                            var end = start + maxLength;//结束截取的位置
                            //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                            temp = value.substring(start, end) + "\n";
                            ret += temp; //凭借最终的字符串
                        }
                        return ret;
                    } else {
                        return value;
                    }
                }
            }
        }

        // 使用刚指定的配置项和数据显示图表。
        myChart1.setOption(option1);

        // 基于准备好的dom，初始化echarts实例     ---饼状图
        var myChart2 = echarts.init(document.getElementById('main2'));
        //var myChart = echarts.init(document.getElementById('main'));
        // 指定图表的配置项和数据
        option2 = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: KeyData
            },
            series: [{
                name: '访问来源',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: jsonValue,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart2.setOption(option2);
    }

    function isNull(str) {
        if (str == undefined || str == null)
            return "其他";
        return str;
    }

    function charToUnicode(str) {
        var temp;
        var i = 0;
        var r = '';

        for (var val in str) {
            temp = val.codePointAt(0).toString(16);

            while (temp.length < 4)
                temp = '0' + temp;

            r += '\\u' + temp;
        }
        ;

        return r;
    }

    $('#selectLog').on('change', function () {
        if ($(this).val()) {
            echartInit();
        }
    });
})
