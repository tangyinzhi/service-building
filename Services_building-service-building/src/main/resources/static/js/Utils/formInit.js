//var newM = {FRMNM:"建筑物属性表单视图",DESC:"",LANG:"cn",LBLAL:"L",CFMTYP:"T",CFMMSG:"提交成功。",SDMAIL:"0",CAPTCHA:"1",IPLMT:"0",SCHACT:"0",INSTR:"0",ISPUB:"1"};
//var newF = [{"LBL":"单行文本","TYP":"text","FLDSZ":"m","REQD":"0","UNIQ":"0","SCU":"pub"}]
//var newF = [{"LBL":"基础信息（必填）","TYP":"section","SCU":"pub","SECDESC":"<p><br></p>","CSS":""},{"LBL":"建筑名称","TYP":"text","FLDSZ":"xxl","REQD":"1","UNIQ":"0","SCU":"pub","MIN":"1","MAX":"5","DEF":"请填入建筑名称","CLMV":"obName"},{"LBL":"地址","TYP":"address","REQD":"1","SCU":"pub","CSS":"","SUBFLDS":{"ZIP":{},"PRV":{},"CITY":{},"DTL":{}},"DEF":"四川省-泸州市-","CLMV":"obAddr"},{"LBL":"基底面积","TYP":"number","FLDSZ":"s","REQD":"1","UNIQ":"0","SCU":"pub","LAYOUT":"leftHalf","CLMV":"obLdArea"},{"LBL":"建筑面积","TYP":"number","FLDSZ":"s","REQD":"1","UNIQ":"0","SCU":"pub","LAYOUT":"leftHalf","CLMV":"obFloorArea"},{"LBL":"建筑用途","TYP":"dropdown2","FLDSZ":"m","pN":"3","REQD":"1","SCU":"pub","INSTR":"","CSS":"","SUBFLDS":{"DD1":{},"DD2":{},"DD3":{}},"ITMS":[{"VAL":"选项 1","ITMS":[{"VAL":"选项 11","ITMS":[{"VAL":"选项 111"},{"VAL":"选项 112"}]},{"VAL":"选项 12","ITMS":[{"VAL":"选项 121"},{"VAL":"选项 122"}]}]},{"VAL":"选项 2","ITMS":[{"VAL":"选项 21","ITMS":[{"VAL":"选项 211"},{"VAL":"选项 212"}]},{"VAL":"选项 22","ITMS":[{"VAL":"选项 221"},{"VAL":"选项 222"}]}]}],"CLMV":"obUsage"},{"LBL":"基础形式","TYP":"radio","LAY":"three","REQD":"1","OTHER":"0","RDM":"0","SCU":"pub","INSTR":"","CSS":"","ITMS":[{"VAL":"条件基础","CHKED":"1"},{"VAL":"独立基础","CHKED":"0"},{"VAL":"筏板基础","CHKED":"0"},{"VAL":"箱行基础","CHKED":"0"},{"VAL":"桩基础","CHKED":"0"}],"DEF":"0","CLMV":"obBaseForm"},{"LBL":"结构类型","TYP":"radio","LAY":"three","REQD":"1","OTHER":"0","RDM":"0","SCU":"pub","INSTR":"","CSS":"","ITMS":[{"VAL":"钢结构","CHKED":"1"},{"VAL":"混合结构","CHKED":"0"},{"VAL":"砖结构","CHKED":"0"}],"DEF":"0","CLMV":"obStru"},{"LBL":"地上层数","TYP":"number","FLDSZ":"s","REQD":"1","UNIQ":"0","SCU":"pub","LAYOUT":"leftHalf","CLMV":"obUpFloor"},{"LBL":"地下层数","TYP":"number","FLDSZ":"s","REQD":"1","UNIQ":"0","SCU":"pub","LAYOUT":"leftHalf","CLMV":"obDownFloor"},{"LBL":"建筑层高","TYP":"number","FLDSZ":"s","REQD":"1","UNIQ":"0","SCU":"pub","LAYOUT":"leftHalf","CLMV":"obFloorHeight"},{"LBL":"建筑高度","TYP":"number","FLDSZ":"s","REQD":"1","UNIQ":"0","SCU":"pub","LAYOUT":"leftHalf","CLMV":"obHeight"},{"LBL":"住宅户数","TYP":"number","FLDSZ":"s","REQD":"1","UNIQ":"0","SCU":"pub","CLMV":"obDoorNum"},{"LBL":"扩展信息（选填）","TYP":"section","SCU":"pub","SECDESC":"<p><br></p>","CSS":""},{"LBL":"模型名称","TYP":"text","CLMV":"","FLDSZ":"xxl","REQD":"0","UNIQ":"0","SCU":"pub"},{"LBL":"电梯数量","TYP":"number","FLDSZ":"s","REQD":"0","UNIQ":"0","SCU":"pub","CLMV":"obElevatorNum"},{"LBL":"电梯类别","TYP":"checkbox","LAY":"two","REQD":"0","SCU":"pub","INSTR":"","CSS":"","ITMS":[{"VAL":"可容纳担架电梯","CHKED":"0"},{"VAL":"无障碍电梯","CHKED":"0"},{"VAL":"客梯","CHKED":"0"},{"VAL":"普通楼栋电梯","CHKED":"0"}],"CLMV":"obElevatorInfo"},{"LBL":"地上空间","TYP":"checkbox","CLMV":"obUpInfo","LAY":"three","REQD":"0","SCU":"pub","INSTR":"","CSS":"","ITMS":[{"VAL":"绿化","CHKED":"0"},{"VAL":"车位","CHKED":"0"},{"VAL":"商铺","CHKED":"0"}]},{"LBL":"地下空间","TYP":"checkbox","LAY":"three","REQD":"0","SCU":"pub","INSTR":"","CSS":"","ITMS":[{"VAL":"车位","CHKED":"0"},{"VAL":"商业","CHKED":"0"},{"VAL":"库房","CHKED":"0"}],"CLMV":"obDownInfo"},{"LBL":"产权单位","TYP":"text","FLDSZ":"xxl","REQD":"0","UNIQ":"0","SCU":"pub","CLMV":"obPropertyUnit"},{"LBL":"房屋产权号","TYP":"text","FLDSZ":"xxl","REQD":"0","UNIQ":"0","SCU":"pub","CLMV":"obPropertyNo"},{"LBL":"建造年代","TYP":"date","REQD":"1","UNIQ":"0","SCU":"pub","FMT":"ymd","DEF":"","INSTR":"","CSS":"","CLMV":"obCompDate"},{"LBL":"物业名称","TYP":"text","CLMV":"","FLDSZ":"m","REQD":"0","UNIQ":"0","SCU":"pub"},{"LBL":"设计标准","TYP":"checkbox","LAY":"three","REQD":"0","SCU":"pub","INSTR":"","CSS":"","ITMS":[{"VAL":"1,一星绿色","CHKED":"0"},{"VAL":"1,二星绿色","CHKED":"0"},{"VAL":"1,三星绿色","CHKED":"0"},{"VAL":"2,50%节能","CHKED":"0"},{"VAL":"2,65%节能","CHKED":"0"},{"VAL":"2,非节能","CHKED":"0"},{"VAL":"3,成品建筑","CHKED":"0"},{"VAL":"3,装配式建筑","CHKED":"0"},{"VAL":"4,BIM设计","CHKED":"0"}],"CLMV":"obDesignCriteria"},{"LBL":"图片","TYP":"image","IMG":"","REQD":"0","SCU":"pub","INSTR":"","CSS":"","CLMV":"obDrawingPath"},{"LBL":"建筑状态","TYP":"radio","LAY":"three","REQD":"0","OTHER":"0","RDM":"0","SCU":"pub","INSTR":"","CSS":"","ITMS":[{"VAL":"已建","CHKED":"0"},{"VAL":"在建","CHKED":"0"},{"VAL":"已拆","CHKED":"0"}],"CLMV":"obStatus"},{"LBL":"地质状况","TYP":"text","FLDSZ":"xxl","REQD":"0","UNIQ":"0","SCU":"pub","CLMV":"obGeologyInfo"},{"LBL":"备注","TYP":"textarea","FLDSZ":"s","REQD":"0","UNIQ":"0","SCU":"pub","MIN":"","MAX":"","DEF":"","INSTR":"","CSS":"","CLMV":"obBz"}];
// var newF =JSON.parse(sessionStorage.getItem('firstF'));
//

//提前获取表单视图内容
$(function () {
    $.ajax({
        type: 'get',
        url: GETFORM,
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        async: false,
        success: function (res) {
            if (res != null) {
                if (res.code == 0) {
                    var data = res.data;
                    //var firstF =JSON.stringify(res.data.parameterData);
                    var firstF = res.data.parameterData;
                    getEnum(firstF);
                    sessionStorage.setItem('firstF', firstF);
                }
            }
        },
        error: function () {
            var firstF = [{
                "SECDESC": "<p><br></p>",
                "CSS": "",
                "SCU": "pub",
                "LBL": "基础信息（必填）",
                "TYP": "section"
            }, {
                "REQD": "1",
                "MIN": "1",
                "SCU": "pub",
                "DEF": "请填入建筑名称",
                "MAX": "5",
                "UNIQ": "0",
                "LBL": "建筑名称",
                "TYP": "text",
                "FLDSZ": "xxl",
                "CLMV": "OB_NAME"
            }, {
                "REQD": "1",
                "SUBFLDS": {"ZIP": {}, "CITY": {}, "PRV": {}, "DTL": {}},
                "CSS": "",
                "SCU": "pub",
                "DEF": "四川省-泸州市-",
                "LBL": "地址",
                "TYP": "address",
                "CLMV": "OB_ADDR"
            }, {
                "LBL": "地理位置",
                "TYP": "map",
                "CLMV": "LOCATION",
                "REQD": "0",
                "SCU": "pub",
                "INSTR": "",
                "CSS": "",
                "SUBFLDS": {"TXT": {}, "J": {}, "W": {}}
            }, {
                "REQD": "1",
                "SCU": "pub",
                "UNIQ": "0",
                "LBL": "基底面积",
                "LAYOUT": "leftHalf",
                "TYP": "number",
                "FLDSZ": "s",
                "CLMV": "OB_LD_AREA"
            }, {
                "REQD": "1",
                "SCU": "pub",
                "UNIQ": "0",
                "LBL": "建筑面积",
                "LAYOUT": "leftHalf",
                "TYP": "number",
                "FLDSZ": "s",
                "CLMV": "OB_FLOOR_AREA"
            }, {
                "REQD": "1",
                "SUBFLDS": {"DD1": {}, "DD3": {}, "DD2": {}},
                "CSS": "",
                "ITMS": [{
                    "VAL": "111",
                    "ITMS": [{"VAL": "选项 11", "ITMS": [{"VAL": "选项 111"}, {"VAL": "选项 112"}]}, {
                        "VAL": "选项 12",
                        "ITMS": [{"VAL": "选项 121"}, {"VAL": "选项 122"}]
                    }]
                }, {
                    "VAL": "222",
                    "ITMS": [{"VAL": "选项 21", "ITMS": [{"VAL": "选项 211"}, {"VAL": "选项 212"}]}, {
                        "VAL": "选项 22",
                        "ITMS": [{"VAL": "选项 221"}, {"VAL": "选项 222"}]
                    }]
                }],
                "SCU": "pub",
                "INSTR": "",
                "LBL": "建筑用途",
                "TYP": "dropdown2",
                "FLDSZ": "m",
                "CLMV": "OB_USAGE",
                "pN": "3"
            }, {
                "REQD": "1",
                "OTHER": "0",
                "CSS": "",
                "ITMS": [{"VAL": "条件基础", "CHKED": "1"}, {"VAL": "独立基础", "CHKED": "0"}, {
                    "VAL": "筏板基础",
                    "CHKED": "0"
                }, {"VAL": "箱行基础", "CHKED": "0"}, {"VAL": "桩基础", "CHKED": "0"}],
                "SCU": "pub",
                "DEF": "0",
                "LAY": "three",
                "INSTR": "",
                "LBL": "基础形式",
                "TYP": "radio",
                "RDM": "0",
                "CLMV": "OB_BASE_FORM"
            }, {
                "REQD": "1",
                "OTHER": "0",
                "CSS": "",
                "ITMS": [{"VAL": "钢结构", "CHKED": "1"}, {"VAL": "混合结构", "CHKED": "0"}, {"VAL": "砖结构", "CHKED": "0"}],
                "SCU": "pub",
                "DEF": "0",
                "LAY": "three",
                "INSTR": "",
                "LBL": "结构类型",
                "TYP": "radio",
                "RDM": "0",
                "CLMV": "OB_STRU"
            }, {
                "REQD": "1",
                "SCU": "pub",
                "UNIQ": "0",
                "LBL": "地上层数",
                "LAYOUT": "leftHalf",
                "TYP": "number",
                "FLDSZ": "s",
                "CLMV": "OB_UP_FLOOR"
            }, {
                "REQD": "1",
                "SCU": "pub",
                "UNIQ": "0",
                "LBL": "地下层数",
                "LAYOUT": "leftHalf",
                "TYP": "number",
                "FLDSZ": "s",
                "CLMV": "OB_DOWN_FLOOR"
            }, {
                "REQD": "1",
                "SCU": "pub",
                "UNIQ": "0",
                "LBL": "建筑层高",
                "LAYOUT": "leftHalf",
                "TYP": "number",
                "FLDSZ": "s",
                "CLMV": "OB_FLOOR_HEIGHT"
            }, {
                "REQD": "1",
                "SCU": "pub",
                "UNIQ": "0",
                "LBL": "建筑高度",
                "LAYOUT": "leftHalf",
                "TYP": "number",
                "FLDSZ": "s",
                "CLMV": "OB_HEIGHT"
            }, {
                "REQD": "1",
                "SCU": "pub",
                "UNIQ": "0",
                "LBL": "住宅户数",
                "TYP": "number",
                "FLDSZ": "s",
                "CLMV": "OB_DOOR_NUM"
            }, {"SECDESC": "<p><br></p>", "CSS": "", "SCU": "pub", "LBL": "扩展信息（选填）", "TYP": "section"}, {
                "REQD": "0",
                "SCU": "pub",
                "UNIQ": "0",
                "LBL": "模型名称",
                "TYP": "text",
                "FLDSZ": "xxl",
                "CLMV": "OB_MODEL_NAME"
            }, {
                "REQD": "0",
                "SCU": "pub",
                "UNIQ": "0",
                "LBL": "电梯数量",
                "TYP": "number",
                "FLDSZ": "s",
                "CLMV": "obElevatorNum"
            }, {
                "REQD": "0",
                "CSS": "",
                "ITMS": [{"VAL": "可容纳担架电梯", "CHKED": "0"}, {"VAL": "无障碍电梯", "CHKED": "0"}, {
                    "VAL": "客梯",
                    "CHKED": "0"
                }, {"VAL": "普通楼栋电梯", "CHKED": "0"}],
                "SCU": "pub",
                "LAY": "two",
                "INSTR": "",
                "LBL": "电梯类别",
                "TYP": "checkbox",
                "CLMV": "OB_ELEVATOR_INFO"
            }, {
                "REQD": "0",
                "CSS": "",
                "ITMS": [{"VAL": "商铺", "CHKED": "0"}, {"VAL": "绿化", "CHKED": "0"}, {"VAL": "车位", "CHKED": "0"}],
                "SCU": "pub",
                "LAY": "three",
                "INSTR": "",
                "LBL": "地上空间",
                "TYP": "checkbox",
                "CLMV": "OB_UP_INFO"
            }, {
                "REQD": "0",
                "CSS": "",
                "ITMS": [{"VAL": "车位", "CHKED": "0"}, {"VAL": "商业", "CHKED": "0"}, {"VAL": "库房", "CHKED": "0"}],
                "SCU": "pub",
                "LAY": "three",
                "INSTR": "",
                "LBL": "地下空间",
                "TYP": "checkbox",
                "CLMV": "OB_DOWN_INFO"
            }, {
                "REQD": "1",
                "SCU": "pub",
                "UNIQ": "0",
                "LBL": "产权单位",
                "TYP": "text",
                "FLDSZ": "xxl",
                "CLMV": "OB_PROPERTY_UNIT"
            }, {
                "REQD": "0",
                "SCU": "pub",
                "UNIQ": "0",
                "LBL": "房屋产权号",
                "TYP": "text",
                "FLDSZ": "xxl",
                "CLMV": "OB_PROPERTY_NO"
            }, {
                "REQD": "1",
                "CSS": "",
                "SCU": "pub",
                "DEF": "",
                "INSTR": "",
                "UNIQ": "0",
                "LBL": "建造年代",
                "TYP": "date",
                "FMT": "ymd",
                "CLMV": "OB_COMP_DATE"
            }, {
                "REQD": "0",
                "SCU": "pub",
                "UNIQ": "0",
                "LBL": "物业名称",
                "TYP": "text",
                "FLDSZ": "m",
                "CLMV": "OB_PROPERTY_NAME"
            }, {
                "REQD": "0",
                "CSS": "",
                "ITMS": [{"VAL": "1,一星绿色", "CHKED": "0"}, {"VAL": "1,二星绿色", "CHKED": "0"}, {
                    "VAL": "1,三星绿色",
                    "CHKED": "0"
                }, {"VAL": "2,50%节能", "CHKED": "0"}, {"VAL": "2,65%节能", "CHKED": "0"}, {
                    "VAL": "2,非节能",
                    "CHKED": "0"
                }, {"VAL": "3,成品建筑", "CHKED": "0"}, {"VAL": "3,装配式建筑", "CHKED": "0"}, {"VAL": "4,BIM设计", "CHKED": "0"}],
                "SCU": "pub",
                "LAY": "three",
                "INSTR": "",
                "LBL": "设计标准",
                "TYP": "checkbox",
                "CLMV": "OB_DESIGN_CRITERIA"
            }, {
                "LBL": "采集人员",
                "TYP": "text",
                "CLMV": "OB_AIR_DEFENCE_INFO",
                "FLDSZ": "m",
                "REQD": "0",
                "UNIQ": "0",
                "SCU": "pub"
            }, {
                "REQD": "0",
                "IMG": "",
                "CSS": "",
                "SCU": "pub",
                "INSTR": "",
                "LBL": "图片",
                "TYP": "image",
                "CLMV": "OB_DRAWING_PATH"
            }, {
                "REQD": "0",
                "OTHER": "0",
                "CSS": "",
                "ITMS": [{"VAL": "已建", "CHKED": "0"}, {"VAL": "在建", "CHKED": "0"}, {"VAL": "已拆", "CHKED": "0"}],
                "SCU": "pub",
                "LAY": "three",
                "INSTR": "",
                "LBL": "建筑状态",
                "TYP": "radio",
                "RDM": "0",
                "CLMV": "OB_STATUS"
            }, {
                "REQD": "0",
                "SCU": "pub",
                "UNIQ": "0",
                "LBL": "地质状况",
                "TYP": "text",
                "FLDSZ": "xxl",
                "CLMV": "OB_GEOLOGY_INFO"
            }, {
                "REQD": "0",
                "CSS": "",
                "MIN": "",
                "SCU": "pub",
                "DEF": "",
                "MAX": "",
                "INSTR": "",
                "UNIQ": "0",
                "LBL": "备注",
                "TYP": "textarea",
                "FLDSZ": "s",
                "CLMV": "OB_BZ"
            }];
            getEnum(firstF);
            sessionStorage.setItem('firstF', firstF);
        }
    });
});

function getEnum(e) {
    $.each(e, function (index, item) {
        if (item.TYP == 'radio' || item.TYP == 'checkbox') {
            if (item.CLMV) {
                if (item.CLMV == 'obBaseForm' || item.CLMV == 'OB_BASE_FORM') {
                    var pama = "OB_BASE_FORM"
                }
                if (item.CLMV == 'obStru' || item.CLMV == 'OB_STRU') {
                    var pama = "OB_STRU"
                }
                if (item.CLMV == 'obElevatorInfo' || item.CLMV == 'OB_ELEVATOR_INFO') {
                    var pama = "OB_ELEVATOR_INFO"
                }
                if (item.CLMV == 'obDownInfo' || item.CLMV == 'OB_DOWN_INFO') {
                    var pama = "OB_DOWN_INFO"
                }
                if (item.CLMV == 'obDesignCriteria' || item.CLMV == 'OB_DESIGN_CRITERIA') {
                    var pama = "OB_DESIGN_CRITERIA"
                }
                if (item.CLMV == 'obStatus' || item.CLMV == 'OB_STATUS') {
                    var pama = "OB_STATUS"
                }
                if (item.CLMV == 'obUpInfo' | item.CLMV == 'OB_UP_INFO') {
                    var pama = "OB_UP_INFO"
                }
                $.ajax({
                    type: 'get',
                    url: selectGETBUILDE + "?peParameter=" + pama,
                    contentType: "application/json;charset=UTF-8",
                    dataType: "json",
                    async: false,
                    success: function (res) {
                        if (res != null) {
                            if (res.code == 0) {
                                var data = res.data;
                                for (var x = 0; x < data.length; x++) {
                                    if (item.ITMS[x] != undefined && item.ITMS[x] != null) {
                                        item.ITMS[x].VAL = data[x].peName;
                                    }
                                }
                            }
                        }
                    },
                    error: function () {
                        layer.msg('获取选项值异常', {icon: 7});
                    }
                });
            }
        }
    });
}






