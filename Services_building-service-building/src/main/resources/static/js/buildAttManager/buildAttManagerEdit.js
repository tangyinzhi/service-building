var imgIds = new Array();
var imgIds_re = new Array();
var obID;

$().ready(function () {
    if ($("#BuildingInfo")) {
        //$("#BuildingInfo").validate();
    }
});

layui.config({
    base: '../js/'
}).use(['form', 'layer', 'jquery', 'common', 'upload', 'table'], function () {
    var demoListView = $("[name='OB_DRAWING_PATH']").parent().find(".info_all");
    var demoListView_re = $("[name='OB_IMAGE_INFO']").parent().find(".info_all");
    var tablehtml = "<table class=\"layui-hide\" id=\"imgTable\" lay-filter=\"imgTableEvent\"></table>";
    demoListView_re.append(tablehtml);
    var tableData = [];
    var upload = layui.upload,
        form = layui.form,
        common = layui.common,
        layer = parent.layer === undefined ? layui.layer : parent.layer;
    var table = layui.table;
    var ID = getQueryString("ID");
    //选择了第一大类
    $("#USAGE1").change(function () {
        var selected = $(this).children('option:selected').val();
        var firstkind = $('#USAGE1 option[value="' + selected + '"]').attr('id');
        //var firstkind
        getSeconde(firstkind);
    });

    //选择了第二大类，
    $("#USAGE2").change(function () {
        var secon = $(this).children('option:selected').val();
        var secondkind = $('#USAGE2 option[value="' + secon + '"]').attr('id');
        //var firstkind
        getLastKind(secondkind);
    });

    //选择了第三大类，
    $("#USAGE3").change(function () {
        var tird = $("#USAGE3 option:selected").val();
    });
    setTimeout(function () {
        var TYPE = getQueryString("type");
        var isAdd = false;
        $("#mapbox").prop('hidden', true);
        getFirstKind();
        form.render('select');

        //新增
        if (ID == null || ID.trim().length <= 0) {
            resAddInit()
        }
        //编辑
        else {
            /**菜单更新初始化*/

            resInit();

        }


        $("#btnSubmit").prop('hidden', true);
        if (TYPE === 'edit') {
            $("#saveValue").prop('hidden', false);
        }

        /***菜单新增初始化**/
        function resAddInit() {
            isAdd = true;
        }

        /***菜单更新初始化**/
        function resInit() {
            isAdd = false;
            $.ajax({
                type: "post",
                url: BUILDSELECTBY,
                // data:JSON.stringify({"OB_ID":ID}),
                data: JSON.stringify({"OB_ID": ID}),
                contentType: "application/json;charset=UTF-8",
                dataType: "json",
                async: true,
                success: function (json) {
                    layuiLoading("");
                    setTimeout(function () {
                        if (json != null) {
                            if (json.code == 0) {
                                var data = json.data[0];
                                obID = data.OB_ID;

                                for (var property in data) {
                                    var temp = document.getElementById(property);
                                    if (temp)
                                        $("#" + property).val(data[property]);

                                    if (radioLIst.contain(property)) {
                                        $("#" + property).find(":radio[value='" + data[property] + "']").prop('checked', "true");
                                    }

                                    if (boxLIst.contain(property)) {
                                        if (data[property]) {
                                            var newvalue = data[property].split(";");
                                            for (var i = 0; i < newvalue.length; i++) {
                                                if (property == "OB_ELEVATOR_INFO") {
                                                    $('#obElevatorNum').val(newvalue[0]);
                                                }
                                                console.log(newvalue[i]);
                                                $("#" + property).find(":checkbox[value='" + newvalue[i] + "']").prop('checked', "true");
                                            }
                                        }

                                    }

                                    if (property == "OB_USAGE") {
                                        if (data[property]) {
                                            var us = data[property].split(";");
                                            $("#USAGE1 option[value='" + us[0] + "']").prop("selected", "selected");
                                            var a = $("#USAGE1").find("option:checked").attr("id");
                                            console.log("#USAGE1" + a);
                                            getSeconde(a);
                                            $("#USAGE2 option[value='" + us[1] + "']").prop("selected", "selected");
                                            var b = $("#USAGE2").find("option:checked").attr("id");
                                            getLastKind(b);
                                            $("#USAGE3 option[value='" + us[2] + "']").prop("selected", "selected");
                                        }
                                    }
                                    if (property == "OB_DRAWING_PATH") {
                                        //加载图片附件
                                        $.post(BUILDINGSELECTS, {
                                            'ids': data.OB_DRAWING_PATH
                                        }, function (res) {//反显添加数据
                                            for (var i = 0; i < res.data.length; i++) {
                                                imgIds.push(res.data[i].oaId);
                                                var tr = $(['<div style="display:inline-block">' +
                                                '<a href="javascript:void(0)" data-magnify="gallery" data-group="g1" data-src=' + ATTACHURL + res.data[i].oaFpfName + ' data-caption="">' +
                                                '<img style="width: 60px;height: 130px;margin-left: 10px;margin-top: 10px" src="' + ATTACHURL + res.data[i].oaFpfName + '" alt="' + replaceName(res.data[i].oaProfName) + '" class="layui-upload-img">' +
                                                '</a><i class="layui-icon del_attach_btn" id="del_attach_' + i + '" attach-id="' + res.data[i].oaId + '">ဆ</i></div>'].join(''));

                                                tr.find('.del_attach_btn').on('click', function () {
                                                    var attachId = $(this).attr("attach-id");
                                                    imgIds.remove(attachId);
                                                    $(this).parent("div").remove();
                                                });
                                                demoListView.append(tr);

                                            }
                                            $('[data-magnify=gallery]').magnify({
                                                Toolbar: ['prev', 'next', 'rotateLeft', 'rotateRight', 'zoomIn', 'actualSize', 'zoomOut'],
                                                keyboard: true,
                                                draggable: true,
                                                movable: true,
                                                modalSize: [500, 400],
                                                headToolbar: [
                                                    'minimize',
                                                    'maximize',
                                                    'close'
                                                ],
                                                title: false
                                            });
                                        }, "json");
                                    }
                                    if (property == "OB_IMAGE_INFO") {
                                        if (data.OB_IMAGE_INFO != undefined && data.OB_IMAGE_INFO != null && data.OB_IMAGE_INFO.trim().length > 0 && data.OB_IMAGE_INFO.trim() != '0') {

                                            //加载图片附件
                                            $.post(BUILDINGSELECTS, {
                                                'ids': data.OB_IMAGE_INFO
                                            }, function (res) {//反显添加数据
                                                if (res && res.data) {
                                                    for (var i = 0; i < res.data.length; i++) {
                                                        if (res.data[i]) {
                                                            tableData.push(res.data[i]);
                                                            imgIds_re.push(res.data[i].oaId);
                                                        }
                                                    }
                                                    tableInit(tableData);
                                                }

                                            }, "json");
                                        }
                                    }
                                }
                                form.render('select');
                            } else {
                                layer.msg(json.msg, {icon: 7});
                            }
                            layuiRemoveLoading();
                        }
                    }, 800)
                },
                error: function () {
                    layuiRemoveLoading();
                    layer.msg('网络请求异常', {icon: 7});
                }
            });
        }
    }, 800);
    var uploadListIns = upload.render({
        elem: "[name=OB_DRAWING_PATH]"
        , url: BUILDINGFILE
        , multiple: true
        , auto: true
        , allDone: function (obj) { //当文件全部被提交后，才触发'
            layuiRemoveLoading();
            console.log(obj.total); //得到总文件数
            console.log(obj.successful); //请求成功的文件数
            console.log(obj.aborted); //请求失败的文件数
        }
        , choose: function (obj) {
            var files = this.files = obj.pushFile(); //将每次选择的文件追加到文件队列
            //读取本地文件
            obj.preview(function (index, file, result) {
                var tr = $(['<div style="display:inline-block">' +
                '<a href="javascript:void(0)"  data-magnify="gallery" data-group="g1" data-src=' + result + ' data-caption="">' +
                '<img style="width: 60px;height: 130px;margin-left: 10px;margin-top: 10px" src="' + result + '" alt="' + file.name + '" class="layui-upload-img">' +
                '</a><i class="layui-icon del_attach_btn" id="del_attach_' + index + '" attach-id="140008535">ဆ</i></div>'].join(''));
                //删除
                tr.find('.del_attach_btn').on('click', function () {
                    var attachId = $(this).attr("attach-id");
                    imgIds.remove(attachId);
                    delete files[index]; //删除对应的文件
                    tr.remove();
                    uploadListIns.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
                });
                demoListView.append(tr);
                var w = $(".layui-form").width();
                var h = $(".layui-form").height() / 3;
                $('[data-magnify=gallery]').magnify({
                    Toolbar: ['prev', 'next', 'rotateLeft', 'rotateRight', 'zoomIn', 'actualSize', 'zoomOut'],
                    keyboard: true,
                    draggable: true,
                    movable: true,
                    modalSize: [500, 400],
                    headToolbar: [
                        'minimize',
                        'maximize',
                        'close'
                    ],
                    title: false
                });

            });
        }
        , done: function (res, index, upload) {
            var item = this.item;
            var getId = "del_attach_" + index;//获得预览图片的id
            $("#" + getId).attr("attach-id", res.data[0]);//设置attach-id属性
            //上传完毕
            imgIds.push(res.data[0]);//将返回的图片id存入数组
            layer.msg('图片上传成功', {icon: 1});
            delete this.files[index] //清空列表里面的数据
        }
        , error: function (index, upload) {//上传失败的方法
            layuiRemoveLoading();
            layer.msg('图片上传失败', {icon: 2});
            delete this.files[index] //清空列表里面的数据
        }
    });
    var lastIndex = -1;
    var files_re = null;
    //多图片上传-图纸信息
    var uploadListIns_re = upload.render({
        elem: "[name=OB_IMAGE_INFO]"
        , url: BUILDINGFILE
        , multiple: true
        , auto: true
        //,bindAction: '#'
        , allDone: function (obj) { //当文件全部被提交后，才触发'
            layuiRemoveLoading();
            console.log(obj.total); //得到总文件数
            console.log(obj.successful); //请求成功的文件数
            console.log(obj.aborted); //请求失败的文件数
        }
        , choose: function (obj) {
            files_re = this.files_re = obj.pushFile(); //将每次选择的文件追加到文件队列
            //读取本地文件
            obj.preview(function (index, file, result) {

                lastIndex = index;


            });
        }
        , done: function (res, index, upload) {
            var item = this.item;

            //上传完毕
            imgIds_re.push(res.data[0]);//将返回的图片id存入数组
            $.post(BUILDINGSELECTS, {
                'ids': res.data[0]
            }, function (res) {//反显添加数据
                if (res && res.data) {
                    res.data.lastIndex = lastIndex;
                    tableData.push(res.data[0]);
                    tableInit(tableData);
                    layer.msg('图片上传成功', {icon: 1});
                }
            });

            delete this.files_re[index] //清空列表里面的数据
        }
        , error: function (index, upload) {//上传失败的方法
            layuiRemoveLoading();
            layer.msg('图片上传失败', {icon: 2});
            delete this.files_re[index] //清空列表里面的数据
        }
    });
    /**保存菜单资源信息*/
    $('#saveValue').click(function () {
        // var resSaveLoading = top.layer.msg('数据提交中，请稍候', { icon: 16, time: false, shade: 0.8 });
        var firstBuildInfo = $('#BuildingInfo').serializeObject();
        firstBuildInfo.OB_ID = obID;
        firstBuildInfo.OB_DRAWING_PATH = imgIds.toString();

        firstBuildInfo.OB_IMAGE_INFO = imgIds_re.toString();
        if (imgIds_re.length == 0) {
            firstBuildInfo.OB_IMAGE_INFO = '0';
        }
        for (var i = 0; i < boxLIst.length; i++) {
            var f = boxLIst[i];
            console.log(firstBuildInfo[f]);
            if (isArray(firstBuildInfo[f])) {
                firstBuildInfo[f] = firstBuildInfo[f].join(';');
            }
        }
        if (firstBuildInfo.OB_USAGE) {
            firstBuildInfo.OB_USAGE = firstBuildInfo.OB_USAGE.join(';');
        }
        // firstBuildInfo.obUsage=firstBuildInfo.obUsage.join(';');
        if (firstBuildInfo.OB_ELEVATOR_INFO) {
            firstBuildInfo.OB_ELEVATOR_INFO = firstBuildInfo.obElevatorNum + ';' + firstBuildInfo.OB_ELEVATOR_INFO
        } else {
            firstBuildInfo.OB_ELEVATOR_INFO = '1;' + firstBuildInfo.OB_ELEVATOR_INFO
        }

        console.log(firstBuildInfo);
        var secondBuildInfo = JSON.stringify(firstBuildInfo);
        console.log(secondBuildInfo);

        $.ajax({
            type: 'post',
            url: BUILDINFO,
            data: secondBuildInfo,
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (data) {
                // top.layer.close(resSaveLoading);
                if (data.code == 0) {
                    layer.msg('操作成功', {icon: 1});
                    var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                    parent.layer.close(index); //再执行关闭
                } else {
                    layer.msg('操作失败', {icon: 2});
                }
            },
            error: function () {
                layer.msg('网络请求异常', {icon: 7});
                // top.layer.close(resSaveLoading);
            }
        });

    })
    // form.on("submit(saveValue)", function (data) {
    //     alert("点击了保存")
    //
    //     setTimeout(function () {
    //         var resSaveLoading = top.layer.msg('数据提交中，请稍候', { icon: 16, time: false, shade: 0.8 });
    //
    //         if (ID == null || ID.trim().length <= 0) {
    //             data.field.CreateUserID = getUserId();
    //             data.field.CreateIP = getIp();
    //         }
    //         else {
    //             data.field.UpdateUserID = getUserId();
    //             data.field.UpdateIP = getIp();
    //         }
    //         $.ajax({
    //             url: addDataSeviceUrl,
    //             type: 'post',
    //             data: JSON.stringify(data.field),
    //             contentType: "application/json;charset=UTF-8",
    //             dataType: "json",
    //             async: false,
    //             success: function (json) {
    //                 top.layer.close(resSaveLoading);
    //                 if (json != null) {
    //                     if (json.code == 0) {
    //                         setTimeout(function () {
    //                             layer.msg("保存成功！", { icon: 6, time: 1000, anim: 4 }, function () {
    //                                 var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
    //                                 parent.layer.close(index); //再执行关闭
    //                             });
    //                         }, 100);
    //                     }
    //                     else {
    //                         setTimeout(function () {
    //                             layer.msg(json.msg, {
    //                                 icon: 7,
    //                                 time: 10000
    //                             });
    //                         }, 100);
    //                     }
    //                 }
    //             }, error: function (data) {
    //
    //                 layer.msg('网络请求异常', {
    //                     icon: 7
    //                 });
    //                 top.layer.close(resSaveLoading);
    //
    //             }
    //         });
    //     }, 100)
    //     return false;
    // })
    /**取消*/
    $("#cancle").click(function () {
        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        parent.layer.close(index); //再执行关闭
    });

    function isArray(o) {
        return Object.prototype.toString.call(o) == '[object Array]';
    }


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
        form.render('select', 'link02');
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
        form.render('select', 'link03');
    }

    //统计列表
    function tableInit(data) {

        if (data == undefined || data == null) {
            data = {data: []};

        }
        //$("[name='OB_IMAGE_INFO']").parent().css("width", "80%");

        $("[name='OB_IMAGE_INFO']").parent().find(".layui-upload").css("border-bottom", "1px solid rgb(196, 196, 196)");
        $("[name='OB_IMAGE_INFO']").parent().find(".layui-upload").css("border-left", "1px solid rgb(196, 196, 196)");
        $("[name='OB_IMAGE_INFO']").parent().find(".layui-upload").css("border-right", "1px solid rgb(196, 196, 196)");
        table.render({
            elem: '#imgTable'
            , cols: [[ //标题栏
                {type: 'numbers', title: '序号', width: 60},
                {title: '文件名', templet: '#name'},
                // {field: 'oaUploadTime', title: '上传时间'},
                {title: '操作', templet: '#operationTpl', width: 90, align: 'center'}
            ]],
            data: data,
            //skin: 'line', //表格风格,
            //toolbar: false,
            // toolbar: "#barDemo",
            limit: 100,
            height: 220,
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

    table.on('tool(imgTableEvent)', function (obj) {
        var data = obj.data;
        var layEvent = obj.event;

        var a = 'BuildAttManager_edit.html?ID=' + data.obId + '?type=' + layEvent;
        var url = ATTACHURL + data.oaFpfName;
        if (layEvent === 'download') {
            downloadIamge(url, replaceName(data.oaSaveName));
        } else if (layEvent === 'look') {
            showImg(url, data.oaSaveName);
        } else if (layEvent === 'del') {

            if (data.lastIndex != undefined && data.lastIndex != null && data.lastIndex != -1 && files_re != null && files_re[data.lastIndex]) {
                delete files_re[data.lastIndex];
                data.lastIndex = -1;
            }
            imgIds_re.remove(data.oaId);
            uploadListIns.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
            var delIndex = 0;
            var isDelete = false;
            for (var index in tableData) {
                var item = tableData[index];
                if (item) {
                    if (item.oaId == data.oaId) {
                        isDelete = true;
                        delIndex = parseInt(index);
                    }
                }
            }
            if (isDelete) {
                tableData.splice(delIndex, 1);
            }
            tableInit(tableData);
        }
    });

    //展示图片
    function showImg(url, name) {
        var img = new Image(); //图片预加载
        img.src = url;
        if (img) {
            setTimeout(function () {

                var width = img.width + 5;
                var height = img.height + 5;

                if (width > 800) {
                    width = 800;
                    img.width = 800;
                }
                if (height > 600) {
                    height = 600;
                    img.height = 600;
                }
                layer.open({
                    type: 1,
                    shade: false,
                    fix: true, //不固定
                    maxmin: true,
                    offset: '100px',
                    title: replaceName(name), //不显示标题
                    area: [width + 'px', height + 'px'],
                    content: '<div style="text-align:center;"><img style="width: 100%;height: 100%" src="' + url + '" /></div>', //捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响
                    cancel: function () {
                        //layer.msg('图片查看结束！', { time: 5000, icon: 6 });
                    }
                });
            }, 500);

        } else {
            alert("图片加载失败");
        }
    }

    function downloadIamge(imgsrc, name) {//下载图片地址和图片名
        var image = new Image();
        // 解决跨域 Canvas 污染问题
        image.setAttribute("crossOrigin", "anonymous");
        image.onload = function () {
            var canvas = document.createElement("canvas");
            canvas.width = image.width;
            canvas.height = image.height;
            var context = canvas.getContext("2d");
            context.drawImage(image, 0, 0, image.width, image.height);
            var url = canvas.toDataURL("image/png"); //得到图片的base64编码数据
            var a = document.createElement("a"); // 生成一个a元素
            var event = new MouseEvent("click"); // 创建一个单击事件
            a.download = name || "photo"; // 设置图片名称
            a.href = url; // 将生成的URL设置为a.href属性
            a.dispatchEvent(event); // 触发a的单击事件
        };
        image.src = imgsrc;
    }

});

function replaceName(name) {
    if (name == undefined || name == null) {
        return "";
    }
    var str = name.toString().split('-')[0];
    return str;
}
