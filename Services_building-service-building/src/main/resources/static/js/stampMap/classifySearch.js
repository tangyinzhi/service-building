var earth = null;
var searchResult = null;//查询结果
var ModelData = null;
layui.use(['table', 'element', 'laypage', 'layer', 'form'], function () {
    var element = layui.element;
    var table = layui.table;
    var laypage = layui.laypage;
    var layer = layui.layer;
    var form = layui.form;

    function tableInit(where) {

        if (where == undefined || where == null) {
            where = {};
        }
        table.render({
            elem: '#tableId',
            url: selectBuildingByPageOldUrl,
            limit: 5,
            page: { //支持传入 laypage 组件的所有参数（某些参数除外，如：jump/elem） - 详见文档
                layout: ['limit', 'count', 'prev', 'page', 'next', 'skip'] //自定义分页布局
                //,curr: 5 //设定初始在第 5 页
                , limit: 5
                , limits: [5, 10, 15, 20, 25, 50, 100]
                , groups: 1 //只显示 1 个连续页码
                , first: false //不显示首页
                , last: false //不显示尾页

            },

            even: true,
            height: 'full-120',
            loading: true,
            where: where,

            cols: [[
                {type: 'numbers', title: '序号', width: "40%"},
                {field: 'OB_NAME', title: '名称'}
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

    /**加载字段值*/
    function getPeName(peParameter) {
        if (peParameter) {
            $.ajax({
                url: selectGETBUILDE + "?peParameter=" + peParameter,
                type: 'get',
                async: false,
                dataType: "json",
                //data:JSON.stringify({peParameter:peParameter}),
                xhrFields: {
                    'Access-Control-Allow-Origin': '*'
                },
                contentType: "application/json;charset=UTF-8",
                success: function (data) {
                    if (data != undefined && data != null) {
                        $('#peName option').remove();
                        for (var index in data.data) {
                            var item = data.data[index];
                            $("#peName").append(
                                '<option value="' + item.peName + '">' + item.peName + '</option>'
                            );
                        }
                        form.render('select');
                        peNameSelect();
                    }


                }, error: function (data) {
                    layer.msg('网络请求异常', {
                        icon: 7
                    });

                }
            });
        }
    }

    peParameterFilterSelset();
    /**监听字段选择*/
    form.on('select(peParameterFilter)', function (data) {
        peParameterFilterSelset();
        return false;
    });

    function peParameterFilterSelset() {
        var peParameter = $("#peParameter").val();
        if (peParameter != undefined && peParameter != null && peParameter.toString().length >= 0) {
            getPeName(peParameter);//加载字段值
            return false;
        }
        layer.msg('没获取到您选择的搜索字段', {
            icon: 7
        })
        return false;
    }

    /**监听字段值选择*/
    form.on('select(peNameFilter)', function (data) {
        peNameSelect();
        return false;
    });

    function peNameSelect() {
        var peName = $("#peName").val();
        var peParameter = $("#peParameter").val();
        if (peName != undefined && peName != null && peName.toString().length >= 0 && peParameter != undefined && peParameter != null && peParameter.toString().length >= 0) {
            var feild = mappingField(peParameter);
            var where = {};
            where["" + feild] = peName;
            tableInit(where);
            return false;
        }
        layer.msg('没获取到您选择的字段值', {
            icon: 7
        })
        return false;
    }

//监听行单击事件
    table.on('row(tableFilter)', function (obj) {
        //alert(1);
        //console.log(obj.tr) //得到当前行元素对象
        //console.log(obj.data) //得到当前行数据
        //var i = obj.data.index;
        // alert(i);
        //var vIndex = parseInt(i);
        var name = obj.data.OB_MODEL_NAME;
        if (name != undefined && name != null) {
            goToSearchObject(0, "Model", name);
            return false;
        }
        layer.msg('当前数据还没有生成三维模型', {
            icon: 7
        })
        return false;
        //obj.del(); //删除当前行
        //obj.update(fields) //修改当前行数据
    });

    //window.TbodytrClick = TbodytrClick;

});

function getEarthObj(earthObj) {
    earth = earthObj;
    if (earth) {
        searchResult = earth.searchResult;
        buildAttLayerId = earth.buildAttLayerId
        if (searchResult) {
            //$(function(){
            // showResultHeml();
            //});
        }
    }
}

/**
 * 单击查询结果定位
 */
var goToSearchObject = function (index, dataType, name) {
    var obj = null;
    var subLayer = earth.LayerManager.GetLayerByGUID(buildAttLayerId);
    subLayer.LocalSearchParameter.ReturnDataType = 1;
    subLayer.LocalSearchParameter.PageRecordCount = 100;
    //subLayer.LocalSearchParameter.SetFilter(“123”, “”);//属性过滤条件：关键字为”123”
    subLayer.LocalSearchParameter.PreciseKeyValue = name;
    //subLayer.LocalSearchParameter.SetSpatialFilter(pFeat);//范围坐标集合
    subLayer.LocalSearchParameter.HasDetail = false;
    searchResult = subLayer.SearchFromLocal();

    var jsonData = searchResult.GotoPage(0);
    jsonData = $.xml2json(jsonData);

    if (dataType == "Model") {
        //alert(index);
        obj = searchResult.GetLocalObject(0);
        //alert(obj);
        var attrData = jsonData.SearchResult.ModelResult.ModelData;
        //alert(attrData);
        flyToModel(obj);
        //var key = searchResult.GetLocalObjectKey(index);
        showModelDetailMsg(attrData, obj);

    }
};
var mappingField = function (peParameter) {
    var field = null;
    switch (peParameter) {
        case "DATANAME": {//人防情况
            field = "obAirDefenceInfo";
            break;
        }
        case "OB_BASE_FORM": {//基础形式
            field = "obBaseForm";
            break;
        }
        case "OB_STRU": {//结构类型
            field = "obStru";
            break;
        }
        case "OB_ELEVATOR_INFO": {//电梯信息
            field = "obElevatorInfo";
            break;
        }
        case "OB_DOWN_INFO": {//地下空间利用信息
            field = "obDownInfo";
            break;
        }
        case "OB_DESIGN_CRITERIA": {//设计标准
            field = "obDesignCriteria";
            break;
        }
        case "OB_STATUS": {//建筑状态
            field = "obStatus";
            break;
        }
        default: {

            break;
        }
    }
    return field;
}
window.onbeforeunload = onbeforeunload_handler;
window.onunload = onunload_handler;

function onbeforeunload_handler() {
    clearPropertyBallon()//清除属性气泡
}

function onunload_handler() {
    clearPropertyBallon()//清除属性气泡
}
