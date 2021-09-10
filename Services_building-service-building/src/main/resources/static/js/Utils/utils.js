//获得url截取下来的值
function getValueOfUrl() {
    var url = location.search;
    var param = {};
    if (url.indexOf("?") != -1) {
        var str = url.substr(1)　//去掉?号
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            param[strs[i].split("=")[0]] = strs[i].split("=")[1];
        }
    }
    return param;
}

//把解析下来的json数据转化为对象
function getObjectFromJson(result) {
    var object = new Object();
    for (var i in result) {
        if (result[i]) {
            object[i] = result[i];
        } else {
            object[i] = "";
        }
    }
    return object;
}

//判断路牌的状态
function isRoadPaiStatus(status) {
    var str;
    switch (status) {
        case "00":
            str = "待提交";
            break;
        case "01":
            str = "待审核";
            break;
        case "02":
            str = "审核驳回";
            break;
        case "03":
            str = "审核通过";
            break;
        case "04":
            str = "已启用";
            break;
        default:
            str = "";
    }
    return str;
}

//表单转换
$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};


//多选框选中的转换成字符串
function checkBoxSelect(checkbox) {
    var str = "";
    var selectvalue = new Array();   //  selectvalue为radio中选中的值
    for (var i = 0; i < checkbox.length; i++) {
        if (checkbox[i].checked == true) {
            selectvalue.push(checkbox[i].value);
        }
    }
    for (var i = 0; i < selectvalue.length; i++) {
        if (i == selectvalue.length - 1) {
            str += selectvalue[i];
        } else {
            str += selectvalue[i] + ";";
        }
    }

    return str;

}

//添加进度
function layuiLoading(msg) {
    layui.use(['layer', 'form'], function () {
        var layer = layui.layer;
        index = layer.load(1, {shade: false});
    });
}

//移除进度
function layuiRemoveLoading() {
    layui.use(['layer', 'form'], function () {
        var layer = layui.layer;
        layer.close(index);
        //调用close方法,关闭全局变量index对应的加载效果
    });
}

/*数组操作方法*/
Array.prototype.indexOf = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};

Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
//判断Array中是否包含某个值
Array.prototype.contain = function (obj) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === obj)
            return true;
    }
    return false;
};

function chooes(a, b) {
//周边类型
    if (a != null) {
        var checkArray = a.split(";");
        for (var h = 0; h < checkArray.length; h++) {
            $.each(b, function (l, checkbox) {
                var checkValue = $(checkbox).val();
                if (checkArray[h] == checkValue) {
                    $(checkbox).attr("checked", true);
                }
            })
        }
    }
}


var imgExt = new Array(".png", ".jpg", ".jpeg", ".bmp", ".gif");//图片文件的后缀名
var docExt = new Array(".doc", ".docx");//word文件的后缀名
var xlsExt = new Array(".xls", ".xlsx");//excel文件的后缀名
//获取文件名后缀名
String.prototype.extension = function () {
    var ext = null;
    var name = this.toLowerCase();
    var i = name.lastIndexOf(".");
    if (i > -1) {
        var ext = name.substring(i);
    }
    return ext;
}

//判断Array中是否包含某个值
Array.prototype.contain = function (obj) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === obj)
            return true;
    }
    return false;
};

function typeMatch(type, fielname) {
    var ext = fielname.extension();
    if (type.contain(ext)) {
        return true;
    }
    return false;
}

function changString(str) {
    if (str == null || str == "null" || str == 'null') {
        str = "";
    }
    return str;
}

// $(function (){
//     $.ajax({
//         type: 'get',
//         url: GETFORM,
//         contentType: "application/json;charset=UTF-8",
//         dataType: "json",
//         async:false,
//         success: function(res) {
//             if (res != null) {
//                 if (res.code == 0) {
//                     var data = res.data;
//                     //var firstF =JSON.stringify(res.data.parameterData);
//                     var firstF =res.data.parameterData;
//                     getEnum(firstF);
//                     sessionStorage.setItem('firstF',firstF);
//                 }
//             }
//         },
//         error: function() {
//             var firstF = [{"SECDESC":"<p><br></p>","CSS":"","SCU":"pub","LBL":"基础信息（必填）","TYP":"section"},{"REQD":"1","MIN":"1","SCU":"pub","DEF":"请填入建筑名称","MAX":"5","UNIQ":"0","LBL":"建筑名称","TYP":"text","FLDSZ":"xxl","CLMV":"OB_NAME"},{"REQD":"1","SUBFLDS":{"ZIP":{},"CITY":{},"PRV":{},"DTL":{}},"CSS":"","SCU":"pub","DEF":"四川省-泸州市-","LBL":"地址","TYP":"address","CLMV":"OB_ADDR"},{"LBL":"地理位置","TYP":"map","CLMV":"LOCATION","REQD":"0","SCU":"pub","INSTR":"","CSS":"","SUBFLDS":{"TXT":{},"J":{},"W":{}}},{"REQD":"1","SCU":"pub","UNIQ":"0","LBL":"基底面积","LAYOUT":"leftHalf","TYP":"number","FLDSZ":"s","CLMV":"OB_LD_AREA"},{"REQD":"1","SCU":"pub","UNIQ":"0","LBL":"建筑面积","LAYOUT":"leftHalf","TYP":"number","FLDSZ":"s","CLMV":"OB_FLOOR_AREA"},{"REQD":"1","SUBFLDS":{"DD1":{},"DD3":{},"DD2":{}},"CSS":"","ITMS":[{"VAL":"111","ITMS":[{"VAL":"选项 11","ITMS":[{"VAL":"选项 111"},{"VAL":"选项 112"}]},{"VAL":"选项 12","ITMS":[{"VAL":"选项 121"},{"VAL":"选项 122"}]}]},{"VAL":"222","ITMS":[{"VAL":"选项 21","ITMS":[{"VAL":"选项 211"},{"VAL":"选项 212"}]},{"VAL":"选项 22","ITMS":[{"VAL":"选项 221"},{"VAL":"选项 222"}]}]}],"SCU":"pub","INSTR":"","LBL":"建筑用途","TYP":"dropdown2","FLDSZ":"m","CLMV":"OB_USAGE","pN":"3"},{"REQD":"1","OTHER":"0","CSS":"","ITMS":[{"VAL":"条件基础","CHKED":"1"},{"VAL":"独立基础","CHKED":"0"},{"VAL":"筏板基础","CHKED":"0"},{"VAL":"箱行基础","CHKED":"0"},{"VAL":"桩基础","CHKED":"0"}],"SCU":"pub","DEF":"0","LAY":"three","INSTR":"","LBL":"基础形式","TYP":"radio","RDM":"0","CLMV":"OB_BASE_FORM"},{"REQD":"1","OTHER":"0","CSS":"","ITMS":[{"VAL":"钢结构","CHKED":"1"},{"VAL":"混合结构","CHKED":"0"},{"VAL":"砖结构","CHKED":"0"}],"SCU":"pub","DEF":"0","LAY":"three","INSTR":"","LBL":"结构类型","TYP":"radio","RDM":"0","CLMV":"OB_STRU"},{"REQD":"1","SCU":"pub","UNIQ":"0","LBL":"地上层数","LAYOUT":"leftHalf","TYP":"number","FLDSZ":"s","CLMV":"OB_UP_FLOOR"},{"REQD":"1","SCU":"pub","UNIQ":"0","LBL":"地下层数","LAYOUT":"leftHalf","TYP":"number","FLDSZ":"s","CLMV":"OB_DOWN_FLOOR"},{"REQD":"1","SCU":"pub","UNIQ":"0","LBL":"建筑层高","LAYOUT":"leftHalf","TYP":"number","FLDSZ":"s","CLMV":"OB_FLOOR_HEIGHT"},{"REQD":"1","SCU":"pub","UNIQ":"0","LBL":"建筑高度","LAYOUT":"leftHalf","TYP":"number","FLDSZ":"s","CLMV":"OB_HEIGHT"},{"REQD":"1","SCU":"pub","UNIQ":"0","LBL":"住宅户数","TYP":"number","FLDSZ":"s","CLMV":"OB_DOOR_NUM"},{"SECDESC":"<p><br></p>","CSS":"","SCU":"pub","LBL":"扩展信息（选填）","TYP":"section"},{"REQD":"0","SCU":"pub","UNIQ":"0","LBL":"模型名称","TYP":"text","FLDSZ":"xxl","CLMV":"OB_MODEL_NAME"},{"REQD":"0","SCU":"pub","UNIQ":"0","LBL":"电梯数量","TYP":"number","FLDSZ":"s","CLMV":"obElevatorNum"},{"REQD":"0","CSS":"","ITMS":[{"VAL":"可容纳担架电梯","CHKED":"0"},{"VAL":"无障碍电梯","CHKED":"0"},{"VAL":"客梯","CHKED":"0"},{"VAL":"普通楼栋电梯","CHKED":"0"}],"SCU":"pub","LAY":"two","INSTR":"","LBL":"电梯类别","TYP":"checkbox","CLMV":"OB_ELEVATOR_INFO"},{"REQD":"0","CSS":"","ITMS":[{"VAL":"商铺","CHKED":"0"},{"VAL":"绿化","CHKED":"0"},{"VAL":"车位","CHKED":"0"}],"SCU":"pub","LAY":"three","INSTR":"","LBL":"地上空间","TYP":"checkbox","CLMV":"OB_UP_INFO"},{"REQD":"0","CSS":"","ITMS":[{"VAL":"车位","CHKED":"0"},{"VAL":"商业","CHKED":"0"},{"VAL":"库房","CHKED":"0"}],"SCU":"pub","LAY":"three","INSTR":"","LBL":"地下空间","TYP":"checkbox","CLMV":"OB_DOWN_INFO"},{"REQD":"1","SCU":"pub","UNIQ":"0","LBL":"产权单位","TYP":"text","FLDSZ":"xxl","CLMV":"OB_PROPERTY_UNIT"},{"REQD":"0","SCU":"pub","UNIQ":"0","LBL":"房屋产权号","TYP":"text","FLDSZ":"xxl","CLMV":"OB_PROPERTY_NO"},{"REQD":"1","CSS":"","SCU":"pub","DEF":"","INSTR":"","UNIQ":"0","LBL":"建造年代","TYP":"date","FMT":"ymd","CLMV":"OB_COMP_DATE"},{"REQD":"0","SCU":"pub","UNIQ":"0","LBL":"物业名称","TYP":"text","FLDSZ":"m","CLMV":"OB_PROPERTY_NAME"},{"REQD":"0","CSS":"","ITMS":[{"VAL":"1,一星绿色","CHKED":"0"},{"VAL":"1,二星绿色","CHKED":"0"},{"VAL":"1,三星绿色","CHKED":"0"},{"VAL":"2,50%节能","CHKED":"0"},{"VAL":"2,65%节能","CHKED":"0"},{"VAL":"2,非节能","CHKED":"0"},{"VAL":"3,成品建筑","CHKED":"0"},{"VAL":"3,装配式建筑","CHKED":"0"},{"VAL":"4,BIM设计","CHKED":"0"}],"SCU":"pub","LAY":"three","INSTR":"","LBL":"设计标准","TYP":"checkbox","CLMV":"OB_DESIGN_CRITERIA"},{"LBL":"采集人员","TYP":"text","CLMV":"OB_AIR_DEFENCE_INFO","FLDSZ":"m","REQD":"0","UNIQ":"0","SCU":"pub"},{"REQD":"0","IMG":"","CSS":"","SCU":"pub","INSTR":"","LBL":"图片","TYP":"image","CLMV":"OB_DRAWING_PATH"},{"REQD":"0","OTHER":"0","CSS":"","ITMS":[{"VAL":"已建","CHKED":"0"},{"VAL":"在建","CHKED":"0"},{"VAL":"已拆","CHKED":"0"}],"SCU":"pub","LAY":"three","INSTR":"","LBL":"建筑状态","TYP":"radio","RDM":"0","CLMV":"OB_STATUS"},{"REQD":"0","SCU":"pub","UNIQ":"0","LBL":"地质状况","TYP":"text","FLDSZ":"xxl","CLMV":"OB_GEOLOGY_INFO"},{"REQD":"0","CSS":"","MIN":"","SCU":"pub","DEF":"","MAX":"","INSTR":"","UNIQ":"0","LBL":"备注","TYP":"textarea","FLDSZ":"s","CLMV":"OB_BZ"}];
//             getEnum(firstF);
//             sessionStorage.setItem('firstF',firstF);
//         }
//     });
// });
// function getEnum(e) {
//     $.each(e,function (index,item) {
//         if(item.TYP == 'radio' || item.TYP == 'checkbox'){
//             if(item.CLMV){
//                 if(item.CLMV=='obBaseForm'||item.CLMV=='OB_BASE_FORM') {var pama = "OB_BASE_FORM"}
//                 if(item.CLMV =='obStru'||item.CLMV =='OB_STRU') {var pama = "OB_STRU"}
//                 if(item.CLMV=='obElevatorInfo'||item.CLMV=='OB_ELEVATOR_INFO') {var pama = "OB_ELEVATOR_INFO"}
//                 if(item.CLMV=='obDownInfo'||item.CLMV=='OB_DOWN_INFO') {var pama = "OB_DOWN_INFO"}
//                 if(item.CLMV=='obDesignCriteria'||item.CLMV=='OB_DESIGN_CRITERIA') {var pama = "OB_DESIGN_CRITERIA"}
//                 if(item.CLMV=='obStatus'||item.CLMV=='OB_STATUS') {var pama = "OB_STATUS"}
//                 if(item.CLMV=='obUpInfo'|item.CLMV=='OB_UP_INFO') {var pama = "OB_UP_INFO"}
//                 $.ajax({
//                     type: 'get',
//                     url: selectGETBUILDE + "?peParameter=" + pama ,
//                     contentType: "application/json;charset=UTF-8",
//                     dataType: "json",
//                     async:false,
//                     success: function(res) {
//                         if (res != null) {
//                             if (res.code == 0) {
//                                 var data = res.data;
//                                 for (var x = 0;x < data.length;x++) {
//                                     if(item.ITMS[x]!=undefined&&item.ITMS[x]!=null){
//                                         item.ITMS[x].VAL=data[x].peName;
//                                     }
//                                 }
//                             }
//                         }
//                     },
//                     error: function() {
//                         layer.msg('获取选项值异常', {icon: 7});
//                     }
//                 });
//             }
//         }
//     });
// }