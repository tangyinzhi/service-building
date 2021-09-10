layui.use(['layer', 'form', 'laydate', 'upload'], function () {
    var layer = layui.layer,
        upload = layui.upload,
        form = layui.form,
        $ = layui.$;

    // $('select.OB_USAGE').each(function (index,ele) {
    //     var x =index + 1 ;
    //     $(ele).attr('id','USAGE' + x);
    //     $(ele).attr('lay-filter','USAGE' + x);
    //
    // });

    getFirstKind();
    form.render('select');
    //选择了第一大类

    $('#USAGE1').change(function (data) {
        var firstkind = $(this).find("option:checked").attr("id");
        getSeconde(firstkind);
        form.render('select');

    });


    //选择了第二大类，
    $('#USAGE2').change(function (data) {
        var secondkind = $(this).find("option:checked").attr("id");
        getLastKind(secondkind);
        form.render('select');
    })

})

function getFirstKind() {
    $.ajax({
        type: 'get',
        url: BUILDINGFIRST,
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        async: false,
        success: function (data) {
            $("#USAGE1").html("");
            if (data.code == 0) {
                $("#USAGE1").append('<option value=' + "" + '>' + "" + '</option>');
                for (var i = 0; i < data.data.length; i++) {
                    $("#USAGE1").append('<option id=' + data.data[i].pbtCode + ' value=' + data.data[i].pbtName + '>' + data.data[i].pbtName
                        + '</option>');
                }
            }
        },
        error: function () {
            layer.msg('建筑用途获取异常', {icon: 7});
        }
    });
}

function getSeconde(kind) {
    $("#USAGE2").empty();
    $.ajax({
        type: "get",
        url: BUILDINGOTHER + "?pbtParent=" + kind,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {
            if (data.code == 0) {
                for (var i = 0; i < data.data.length; i++) {
                    $("#USAGE2").append('<option id=' + data.data[i].pbtCode + ' value=' + data.data[i].pbtName + '>' + data.data[i].pbtName + '</option>');
                }
            }
            if ($("#USAGE1 option:selected").val()) {
                var k = data.data[0].pbtCode;
                getLastKind(k);//自动填充最后一级联动
            }

        },
        error: function () {
            alert("建筑用途获取异常");
        }
    });
}

function getLastKind(kind) {
    $("#USAGE3").empty();
    $.ajax({
        type: "get",
        url: BUILDINGOTHER + "?pbtParent=" + kind,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {
            if (data.code == 0) {
                for (var i = 0; i < data.data.length; i++) {
                    $("#USAGE3").append('<option id=' + data.data[i].pbtCode + ' value=' + data.data[i].pbtName + '>' + data.data[i].pbtName + '</option>');
                }
            }
        },
        error: function () {
            alert("建筑用途获取异常");
        }
    });
}
