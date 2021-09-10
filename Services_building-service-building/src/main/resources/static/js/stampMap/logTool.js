function addLog(msg, logType) {
    var data = {
        msg: msg,
        logType: logType,
    }
    $.ajax({
        url: logAddUrl,
        type: 'post',
        async: true,
        data: JSON.stringify(data),
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (data) {

        },
        error: function (xhr, status, error) {
            //alert(error);
        }

    });
}

function addLogMsg(msg) {
    addLog(msg, "信息");
}

