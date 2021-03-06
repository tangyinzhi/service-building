/**
 * 作    者：StampGIS Team
 * 创建日期：2017年11月07日
 * 描    述：天际线分析
 * 注意事项：该文件方法仅为天际线分析使用
 * 遗留bug ：无
 * 修改日期：2017年11月07日
 ****************************************************************/
var earth = "";

/**
 * [getEarth 获取当前三维球]
 * @param  {[obj]} earthObj [当前三维球]
 * @return {[type]}         [无]
 */
function getEarth(earthObj) {
    earth = earthObj;
    var analysis = STAMP.Analysis(earth);
    $(function () {
        $("#btnStart").click(function () {
            if (check()) {
                analysis.skyline((chkDem.checked ? true : false), $("#height").val(), $("#length").val(), $("#deep").val());
                $("#chkDem").attr("disabled", "disabled");
                $("#length").attr("disabled", "disabled");
                $("#height").attr("disabled", "disabled");
                $("#mHeight").attr("disabled", "disabled");
                $("#btnStart").attr("disabled", "disabled");
                $("#deep").attr("disabled", "disabled");
            }
        });

        //打开保存路径
        $("#addSavepath").click(function () {
            var filePath = earth.UserDocument.OpenFilePathDialog("", "");
            if (filePath == "")
                return;
            document.getElementById("savepath").value = filePath;
            $("#prinOut").removeAttr("disabled");
        });

        //出图事件
        $("#prinOut").click(function () {
            var filePath = document.getElementById("savepath").value;
            if (filePath == "") {
                alert("请选择文件路径！");
            } else {
                if (!lineparam) {
                    alert("请选择范围");
                    return;
                }
                $("#prinOut").attr("disabled", "disabled");
                $("#prinOut").text("出图中");
                var iSkyline = earth.GlobeObserver.FixedPoint_Image(lineparam, $("#height").val(), $("#length").val(), $("#deep").val(), (chkDem.checked ? true : false), true, filePath + "\\fixed_point.png");
                var totalCount = iSkyline.begin();
                var imgIndex = 0;
                var recordState = true;
                iSkyline.goto(imgIndex);
                var tag = setInterval(function Loop() {
                    if (recordState == false) return;
                    var count = earth.GetDownloadCount();
                    if (count == 0) {
                        iSkyline.Generate(imgIndex); // 生成一张图片
                        imgIndex++;
                        if (imgIndex >= totalCount) {
                            recordState = false;
                            iSkyline.End();
                            clearInterval(tag);
                            $("#prinOut").text("导出图片");
                            $("#prinOut").removeAttr("disabled");
                            alert("出图成功");
                        } else {
                            iSkyline.goto(imgIndex); // 定位到下一张图所在的位置
                        }
                    }
                }, 500);
            }
        });
        // 测量高度
        $("#mHeight").click(function () {
            earth.Event.OnMeasureFinish = function (result, type) {
                analysis.clear();
                result = result * 1000;
                document.getElementById("height").value = result.toFixed(2);
                earth.Event.OnMeasureFinish = function () {
                };
            };
            earth.Measure.MeasureHeight();
        });
    });
    window.onunload = function () {
        earth.GlobeObserver.StopFixedPointObserve();
        analysis.clear();
    };
}

// 对value值进行判断
function check() {
    if (isNaN($("#height").val()) || $("#height").val() < 0) {
        alert("无效的高度值");
        $("#height").focus();
        return false;
    }

    if (isNaN($("#deep").val()) || $("#deep").val() < 0) {
        alert("无效的深度值");
        $("deep").focus();
        return false;
    }

    if (isNaN($("#length").val()) || $("#length").val() < 0) {
        alert("无效的分析距离");
        $("#length").focus();
        return false;
    }
    return true;
}
