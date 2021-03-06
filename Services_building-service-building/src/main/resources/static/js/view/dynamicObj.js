/**
 * 作       者：StampGIS Team
 * 创建日期：2017年7月22日
 * 描        述：漫游相关功能
 * 注意事项：
 * 遗留bug：0
 * 修改日期：2017年11月7日
 ******************************************/
$(function () {
    var earth = parent.LayerManagement.earth; //接收全局earth
    var trackManager = STAMP.TrackManager(earth); //接收全局trackManager
    $("#divThree :radio").removeAttr("checked");

    // 初始化动态对象列表
    trackManager.getDynamicObject(function (dynamic) {
        $("#selDynamicObj").append('<option value="' + dynamic.Guid + '">' + dynamic.Name + '</option>');
    }, function (fly) {
        $("#selFlyObj").append('<option value="' + fly.Guid + '">' + fly.Name + '</option>');
    });

    // region 动态物体
    $("#btnEnterOuter,#btnEnterInner").click(function () {
        $("#selDynamicObj").attr("disabled", "disabled");
        var _tag = $(this).attr("tag");
        //开始动态物体漫游
        trackManager.enterTrack($("#selDynamicObj").val(), function (reValue) {
            if (!reValue) {
                $("#selDynamicObj").removeAttr("disabled");
                return;
            }
            $("#freez0").attr("disabled", "disabled");
            $("#freez1").attr("disabled", "disabled");
            $("#freez0").val(180);
            $("#freez1").val(15);
            $("#freez0Div").attr("disabled", "disabled");
            $("#freez1Div").attr("disabled", "disabled");
            $("#checkBntn div", window.parent.document).attr("disabled", true);
            $("#divRoleDynObj :radio").removeAttr("checked");
            $("#three").attr("checked", "checked");
            earth.GlobeObserver.InitThirdTrack(180, 15);
            //判断是室内漫游还是室外漫游
            if (_tag == "enterOuter") {
                trackManager.startTracking($("#selDynamicObj").val(), 2, false);
            } else if (_tag == "enterInner") {
                trackManager.startTracking($("#selDynamicObj").val(), 2, true);
            }
            $("#head").attr("checked", "checked");
            $("#divThree").removeAttr("disabled");
            $("#divRoleDynObj").removeAttr("disabled");
            $("#btnStop").removeAttr("disabled");
            $("#btnEnterOuter").attr("disabled", "disabled");
            $("#btnEnterInner").attr("disabled", "disabled");
        });
    });

    /**
     * 检查输入的朝向值
     */
    function checkF0() {
        var fr0Val = $("#freez0").val();
        if (fr0Val < 0 || fr0Val > 360) {
            alert("请输入范围内的朝向值！");
            return false;
        } else {
            return true;
        }
    }

    /**
     * 检查输入的俯仰值
     */
    function checkF1() {
        var fr1Val = $("#freez1").val();
        fr1Val = Math.abs(fr1Val)
        if (fr1Val > 90) {
            alert("请输入范围内的俯仰值！");
            // $("#freez1").focus();
            return false;
        } else {
            return true;
        }
    }

    var enterFlag = false; //防止按enter触发两次事件
    $("#freez0").keyup(function (evernt) {
        var thisObj = $("#freez0")[0];
        checkNum(thisObj, true, 2, 360);
        enterFlag = false;
        if (event.keyCode == 13) { //输入完成回车结束输入
            enterFlag = true;
            $("#freez0").blur();
            $("#freez1").blur();
        }
    });
    $("#freez1").keyup(function (evernt) {
        var thisObj = $("#freez1")[0];
        checkNum(thisObj, false, 2, 90);
        enterFlag = false;
        if (event.keyCode == 13) { //输入完成回车结束输入
            enterFlag = true;
            $("#freez0").blur();
            $("#freez1").blur();
        }
    });

    $("#btnStop").click(function () {
        $("#divRoleDynObj").attr("disabled", "disabled");
        $("#divThree :radio").removeAttr("checked");
        $("#divRoleDynObj :radio").removeAttr("checked");
        $("#btnStop").attr("disabled", "disabled");
        $("#selDynamicObj").removeAttr("disabled");
        $("#divThree").attr("disabled", "disabled");
        $("#freez0").attr("disabled", "disabled");
        $("#freez1").attr("disabled", "disabled");
        $("#btnEnterOuter").removeAttr("disabled");
        $("#btnEnterInner").removeAttr("disabled");
        trackManager.out($("#selDynamicObj").val());
        $("#checkBntn div", window.parent.document).attr("disabled", false);
    });
    /**
     * 人称方式radio切换事件
     */
    $("#divRoleDynObj :radio").click(function () {
        $("#freez0").attr("disabled", "disabled");
        $("#freez1").attr("disabled", "disabled");
        $("#freez0").val(180);
        $("#freez1").val(15);
        $("#freez0Div").attr("disabled", "disabled");
        $("#freez1Div").attr("disabled", "disabled");
        $("#divThree :radio").removeAttr("checked");
        $("#divRoleDynObj :radio").removeAttr("checked");
        $(this).attr("checked", "checked");
        if ($(this).val() == 1) {
            trackManager.startTracking($("#selDynamicObj").val(), $(this).val());
            $("#divThree").attr("disabled", "disabled");
        }
        if ($(this).val() == 2) {
            earth.GlobeObserver.InitThirdTrack(180, 15);
            trackManager.startTracking($("#selDynamicObj").val(), 2);
            $("#head").attr("checked", "checked");
            $("#divThree").removeAttr("disabled");
        }
    });

    $("#freez0").blur(function () {
        if (checkF0() && checkF1()) {
            customFreez();
        }
    });
    $("#freez1").blur(function () {
        if (checkF0() && checkF1()) {
            customFreez();
        }
    });

    /**
     * 方向radio切换事件
     */
    $("#divThree :radio").click(function () {
        $("#divThree :radio").removeAttr("checked");
        $(this).attr("checked", "checked");

        earth.GlobeObserver.InitThirdTrack(180, 15);
        trackManager.startTracking($("#selDynamicObj").val(), 2);
        if ($(this).context.id) {
            if ($(this).context.id == "low") {
                earth.GlobeObserver.ChangeThirdTrackHeading(0, $("#selDynamicObj").val());
            } else if ($(this).context.id == "left") {
                earth.GlobeObserver.ChangeThirdTrackHeading(90, $("#selDynamicObj").val());
            } else if ($(this).context.id == "right") {
                earth.GlobeObserver.ChangeThirdTrackHeading(-90, $("#selDynamicObj").val());
            } else if ($(this).context.id == "up") {
                earth.GlobeObserver.ChangeThirdTrackHeading(0, $("#selDynamicObj").val());
            } else if ($(this).context.id == "down") {
                earth.GlobeObserver.ChangeThirdTrackHeading(0, $("#selDynamicObj").val());
            } else if ($(this).context.id == "lowTop") {
                earth.GlobeObserver.ChangeThirdTrackHeading(0, $("#selDynamicObj").val());
            } else if ($(this).context.id == "head") {
                earth.GlobeObserver.ChangeThirdTrackHeading(180, $("#selDynamicObj").val());
            } else if ($(this).context.id == "free") {
                $("#freez0").removeAttr("disabled");
                $("#freez1").removeAttr("disabled");
                $("#freez0Div").removeAttr("disabled");
                $("#freez1Div").removeAttr("disabled");
                $("#freez0,#freez1").trigger("change");
                trackManager.startTracking($("#selDynamicObj").val(), 2);
            }
            if ($(this).context.id != "free") {
                $("#freez0").attr("disabled", "disabled");
                $("#freez1").attr("disabled", "disabled");
                $("#freez0").val(180);
                $("#freez1").val(15);
                $("#freez0Div").attr("disabled", "disabled");
                $("#freez1Div").attr("disabled", "disabled");
            }
        }
    });
    window.onunload = function () {
        if (earth.GlobeObserver) {
            trackManager.out($("#selDynamicObj").val());
        }
    };

    /**
     * 设置阈值
     */
    function customFreez() {
        var freex = 15;
        if ($("#freez1").val() === 90) {
            freex = 89.999;
        } else if ($("#freez1").val() === -90) {
            freex = -89.999;
        } else {
            freex = $("#freez1").val() == "" ? 0 : $("#freez1").val();
        }
        earth.GlobeObserver.InitThirdTrack($("#freez0").val() == "" ? 0 : $("#freez0").val(), freex);
        trackManager.startTracking($("#selDynamicObj").val(), 2);
    }

});