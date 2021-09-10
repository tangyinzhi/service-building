﻿NProgress.start();
window.onload = function () {
    NProgress.done();
}

layui.use(['element', 'table', 'form', 'jquery', 'laydate'], function () {
    var element = layui.element;
    var table = layui.table;
    var form = layui.form;
    var $ = layui.jquery;
    var laydate = layui.laydate;
    tableInit();
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
        //var url = selectPermissionByPageUrl +'?systemId=' + selectTreeNodeId;
        var likeValue = $("#likeValue").val();
        var where = {};
        if (likeValue != undefined && likeValue != null && likeValue.trim().length > 0) {
            //url = url + "&likeValue=" + likeValue.trim();
            where.likeValue = likeValue.trim();
        }
        tableInit(where)
        return false;
    }

    $("#logTol").click(function () {
        statisticsClick()
    });

    laydate.render({
        elem: '#startTime',
        type: "datetime"
    });

    laydate.render({
        elem: '#endTime',
        type: "datetime"
    });

    function tableInit(where) {

        if (where == undefined || where == null) {
            where = {};
        }
        table.render({
            elem: '#tableId',
            url: logSelectByPageUrl,
            limit: 10,
            page: true,
            even: true,
            height: 'full-170',
            loading: true,
            where: where,
            cols: [[
                {type: 'numbers', title: '序号'},
                {field: 'loguser', title: '用户'},
                // { field: 'plugName', title: '插件名' },
                {field: 'logTime', title: '时间'},
                {field: 'logType', title: '信息类型'},
                {field: 'logMessage', title: '信息内容'},
                {field: 'logIp', title: 'IP地址'}
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

    // 统计
    function statisticsClick() {
        echartInit();
        //多窗口模式，层叠置顶
        layer.open({
            type: 1, //此处以iframe举例
            title: '统计图查看',
            offset: '10px',
            area: ['550px', '570px'],
            shade: 0.5,
            maxmin: true,
            /* offset : '10px', */
            content: $("#hiddenDiv"),
            btn: ['关闭'], //只是为了演示
            yes: function (layero) {
                layer.close(layero);
            },
            btnAlign: 'c', //按钮居中
            zIndex: layer.zIndex, //重点1
            success: function (layero) {
                layer.setTop(layero); //重点2
            }
        });
        return false;
    }

    //获取统计数据  
    function getStatisticsData(clown) {
        var statisticsData = null
        $.ajax({
            url: logTolCountUrl + "?clown=" + clown + "&strWhere=",
            type: 'get',
            cache: false,
            async: false,
            dataType: 'json',
            success: function (data) {
                if (data != null)
                    statisticsData = data;
            }
        });
        return statisticsData;
    }

    var valueData = new Array();
    var KeyData = new Array();
    var jsonValue = [];

    //匹配统计数据
    function matchingData(json) {
        if (json != null && json.data != undefined && json.data != null) {
            var data = json.data;
            valueData = new Array();
            KeyData = new Array();
            jsonValue = [];
            for (var key in data) {
                if (data[key] != null) {
                    var jsondata = {
                        value: data[key].TOLSUM,
                        name: isNull(data[key].CLOWN)
                    };
                    jsonValue.push(jsondata);
                    valueData[key] = data[key].TOLSUM;
                    KeyData[key] = isNull(data[key].CLOWN);
                }


            }
        }
    }

    //统计图初始化
    function echartInit() {
        var value = $("#selectLog").val();
        if (value == undefined || value == null || value.toString().trim().length <= 0) {
            layer.msg('没有选择统计的字段，请选择', {
                icon: 5,
                time: 1000
            });
            return;
        }
        var data = getStatisticsData(value);
        matchingData(data);
        // 基于准备好的dom，初始化echarts实例
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
            series: [{
                data: valueData,
                type: 'line',
                smooth: true
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);

        // 基于准备好的dom，初始化echarts实例
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
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart1.setOption(option1);

        // 基于准备好的dom，初始化echarts实例
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
            return "空值";
        return str;
    }

    $('#selectLog').on('change', function () {
        if ($(this).val()) {
            echartInit();
        }
    });
    /**监听字段选择*/
    form.on('select(peParameterFilter)', function (data) {
        // var peName = $("#peName").val();
        var selectLog = $("#selectLog").val();
        if (selectLog != undefined && selectLog != null && selectLog.toString().length >= 0) {
            echartInit();
            return false;
        }
        layer.msg('没获取到您选择的字段值', {
            icon: 7
        })
        return false;
    });
})
