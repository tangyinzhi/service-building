var earth = null;
var searchResult = null;//查询结果
var page = 0;
var countNum = 0;
var limit = 10;
var pageNum = 0;
var curr = 0;
var ModelData = null;
var buildAttLayerId = null;
layui.use(['table', 'element', 'laypage', 'layer'], function () {
    var element = layui.element;
    var table = layui.table;
    var laypage = layui.laypage;
    var layer = layui.layer;
    if (searchResult) {
        showResultHeml();
    }

    function showResultHeml() {
        if (searchResult != null) {
            limit = 10;
            countNum = searchResult.RecordCount;
            //countNum = 12;
            pageRender(countNum, limit);
        }
    }

    window.showResultHeml = showResultHeml;

    //分页插件初始化
    function pageRender(count, limit) {
        //自定义首页、尾页、上一页、下一页文本
        laypage.render({
            elem: 'demo3'
            , count: count
            , limit: limit
            , first: '首页'
            , last: '尾页'
            , jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                //console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                //console.log(obj.limit); //得到每页显示的条数
                //alert(obj.curr-1);
                curr = obj.curr - 1;
                gotoPage(obj.curr - 1);

            }
        });
    }

    //页码跳转
    function gotoPage(index) {
        if (searchResult == null) {
            return;
        }
        var xmlStr = searchResult.GotoPage(0);
        if (xmlStr == null) {
            return;
        }
        var jsonData = $.xml2json(xmlStr);
        if (jsonData.SearchResult == undefined || jsonData.SearchResult == null) {
            alert("没有获取到查询结果，请联系管理员！");
            return;
        }
        ModelData = jsonData.SearchResult.ModelResult.ModelData;
        // alert(JSON.stringify(jsonData.SearchResult.ModelResult.ModelData).toString());
        //var ModelData = [{"SE_NAME":"mesh_jingxiu0001","LonLatBox":"28.8984075023247904,28.8980744995246894,105.4203477064329491,105.4199506889505216,425.2893419219180942,304.9701280575245619","SE_ID":"","ParentLayer":"jingxiu_n"},{"SE_NAME":"mesh_jingxiu0002","LonLatBox":"28.8988107331745496,28.8984791831211041,105.4199094189561094,105.4195487880070345,425.5134683828800917,304.9701334238052368","SE_ID":"","ParentLayer":"jingxiu_n"},{"SE_NAME":"mesh_jingxiu0006","LonLatBox":"28.8980666795129792,28.8977332951463985,105.4198703566148083,105.4194935439358005,425.4201431116089225,304.9701309055089951","SE_ID":"","ParentLayer":"jingxiu_n"},{"SE_NAME":"mesh_jingxiu0003","LonLatBox":"28.8991167737329953,28.8987970781774770,105.4194436062127238,105.4187691483572991,425.1963626760989428,304.9700748370960355","SE_ID":"","ParentLayer":"jingxiu_n"},{"SE_NAME":"mesh_jingxiu0004","LonLatBox":"28.8986319680905339,28.8980413363405511,105.4188803749700440,105.4185145457543342,425.1963625391945243,304.9700747001916170","SE_ID":"","ParentLayer":"jingxiu_n"},{"SE_NAME":"mesh_jingxiu0005","LonLatBox":"28.8980543671632617,28.8977398783243409,105.4192449291571876,105.4189102322558540,425.4950112821534276,304.9701394569128752","SE_ID":"","ParentLayer":"jingxiu_n"},{"SE_NAME":"mesh_jingxiu0001","LonLatBox":"28.8984075023247904,28.8980744995246894,105.4203477064329491,105.4199506889505216,425.2893419219180942,304.9701280575245619","SE_ID":"","ParentLayer":"jingxiu_n"},{"SE_NAME":"mesh_jingxiu0002","LonLatBox":"28.8988107331745496,28.8984791831211041,105.4199094189561094,105.4195487880070345,425.5134683828800917,304.9701334238052368","SE_ID":"","ParentLayer":"jingxiu_n"},{"SE_NAME":"mesh_jingxiu0006","LonLatBox":"28.8980666795129792,28.8977332951463985,105.4198703566148083,105.4194935439358005,425.4201431116089225,304.9701309055089951","SE_ID":"","ParentLayer":"jingxiu_n"},{"SE_NAME":"mesh_jingxiu0003","LonLatBox":"28.8991167737329953,28.8987970781774770,105.4194436062127238,105.4187691483572991,425.1963626760989428,304.9700748370960355","SE_ID":"","ParentLayer":"jingxiu_n"},{"SE_NAME":"mesh_jingxiu0004","LonLatBox":"28.8986319680905339,28.8980413363405511,105.4188803749700440,105.4185145457543342,425.1963625391945243,304.9700747001916170","SE_ID":"","ParentLayer":"jingxiu_n"},{"SE_NAME":"mesh_jingxiu0005","LonLatBox":"28.8980543671632617,28.8977398783243409,105.4192449291571876,105.4189102322558540,425.4950112821534276,304.9701394569128752","SE_ID":"","ParentLayer":"jingxiu_n"}]
        var html = "";
        if (ModelData != null && ModelData.length > 0) {
            if (Array.isArray(ModelData)) {
                for (var i = curr * limit; i < (curr + 1) * limit && i < ModelData.length; i++) {
                    var item = ModelData[i];
                    if (item != null) {
                        html += " <tr onclick='TbodytrClick(" + i + ")'>";
                        html += "<td>" + i + "</td>";
                        html += "<td>" + item.SE_NAME + "</td>";
                        html += "</tr>";
                    }

                }
            } else {
                html += " <tr systemIdVaule='1'>";
                html += "<td>" + "1" + "</td>";
                html += "<td>" + ModelData.SE_NAME + "</td>";
                html += "</tr>"
            }
        } else {
            html += " <tr>";
            html += "<td></td>";
            html += "<td></td>";
            html += "</tr>"
        }

        $("#table tbody").html(html);
        $("table thead").css("border-bottom-width", "15px");

        $('thead th').css({
            'color': '#666', 'border-bottom': '3px solid #2491fc',
            'font-size': '12px',
            'font-weight': 'bolder',
        });
        // table.init('parse-table-demo', { //转化静态表格
        //     height: 'full-110'
        // });
    }

//监听行单击事件
//     table.on('row(parse-table-demo)', function(obj){
//         //alert(1);
//         //console.log(obj.tr) //得到当前行元素对象
//         //console.log(obj.data) //得到当前行数据
//         var i = obj.data.index;
//        // alert(i);
//         var vIndex = parseInt(i);
//         goToSearchObject(vIndex, "Model", "");
//         return false;
//         //obj.del(); //删除当前行
//         //obj.update(fields) //修改当前行数据
//     });
    //监听行单击事件（单击事件为：rowDouble）
    // $("tbody tr").click(function () {
    //     //alert(1);
    //     var i = $(this).find("td").first().html();
    //     console.log(i);
    //     var vIndex = parseInt(i);
    //     //goToSearchObject(vIndex, "Model", "");
    //     //alert(i);
    //     return false;
    // });
    function TbodytrClick(id) {
        var i = id;
        var vIndex = parseInt(i);
        var item = ModelData[i];

        goToSearchObject(vIndex, "Model", item.SE_NAME);
        return false;
    }

    window.TbodytrClick = TbodytrClick;

});

function getEarthObj(earthObj) {
    earth = earthObj;
    if (earth) {
        searchResult = earth.searchResult;
        buildAttLayerId = earth.buildAttLayerId;
        if (searchResult) {
            //$(function(){
            // showResultHeml();
            //});
            if (window.showResultHeml) {
                showResultHeml();
            }
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
    var searchResult1 = subLayer.SearchFromLocal();

    var jsonData = searchResult1.GotoPage(0);
    jsonData = $.xml2json(jsonData);

    if (dataType == "Model") {
        //alert(index);
        obj = searchResult1.GetLocalObject(0);
        //alert(obj);
        var attrData = jsonData.SearchResult.ModelResult.ModelData;
        //alert(attrData);
        flyToModel(obj);
        //var key = searchResult.GetLocalObjectKey(index);
        showModelDetailMsg(attrData, obj);

    }
};

window.onbeforeunload = onbeforeunload_handler;
window.onunload = onunload_handler;

function onbeforeunload_handler() {
    clearPropertyBallon()//清除属性气泡
}

function onunload_handler() {
    clearPropertyBallon()//清除属性气泡
}
