var imgIds = new Array();
var obID;

$().ready(function () {
    if ($("#BuildingInfo")) {
        //$("#BuildingInfo").validate();
    }

    layui.config({
        base: '../../js/'
    }).use(['form', 'layer', 'jquery', 'common', 'upload'], function () {
        var upload = layui.upload,
            form = layui.form,
            common = layui.common,
            layer = parent.layer === undefined ? layui.layer : parent.layer;
        var ID = getQueryString("ID");
        var TYPE = getQueryString("type");
        var isAdd = false;
        setTimeout(function () {
            //新增
            if (ID == null || ID.trim().length <= 0) {
                resAddInit()
            }
            //编辑
            else {
                /**菜单更新初始化*/

                resInit();
                //$("#mapbox").prop('hidden',true);
                // $("#mapbox").css("display","none");
                $("#mapbox").attr("style", "display:none");

            }


            $("#btnSubmit").prop('hidden', true);
            if (TYPE === 'edit') {
                $("#saveValue").prop('hidden', false);
            }

            /***菜单新增初始化**/
            function resAddInit() {
                isAdd = true;
            }

            var demoListView = $('#info_all');

            /***菜单更新初始化**/
            function resInit() {
                isAdd = false;
                $.ajax({
                    type: "post",
                    url: BUILDSELECTBY,
                    // data:JSON.stringify({"OB_ID":ID}),
                    data: JSON.stringify({"OBJECTID": ID}),
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
                                                    '<img style="width: 60px;height: 130px;margin-left: 10px;margin-top: 10px" src="' + ATTACHURL + res.data[i].oaFpfName + '" alt="' + res.data[i].oaProfName + '" class="layui-upload-img">' +
                                                    '</a><i class="layui-icon del_attach_btn" id="del_attach_' + i + '" attach-id="' + res.data[i].oaId + '">ဆ</i></div>'].join(''));

                                                    tr.find('.del_attach_btn').on('click', function () {
                                                        var attachId = $(this).attr("attach-id");
                                                        imgIds.remove(attachId);
                                                        $(this).parent("div").remove();
                                                    });
                                                    demoListView.append(tr);
                                                    $('[data-magnify]').Magnify({
                                                        Toolbar: ['prev', 'next', 'rotateLeft', 'rotateRight', 'zoomIn', 'actualSize', 'zoomOut'],
                                                        keyboard: true,
                                                        draggable: true,
                                                        movable: true,
                                                        modalSize: [500, 400],
                                                    });
                                                }
                                            }, "json");
                                        }
                                    }
                                    form.render('select');
                                } else {
                                    layer.msg(json.msg, {icon: 7});
                                }
                                layuiRemoveLoading();
                            }
                        }, 100)
                    },
                    error: function () {
                        layuiRemoveLoading();
                        layer.msg('网络请求异常', {icon: 7});
                    }
                });
            }
        }, 800)
        var uploadListIns = upload.render({
            elem: '#info_upload'
            , url: BUILDINGFILE
            , multiple: false
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
                    $('[data-magnify]').Magnify({
                        Toolbar: ['prev', 'next', 'rotateLeft', 'rotateRight', 'zoomIn', 'actualSize', 'zoomOut'],
                        keyboard: true,
                        draggable: true,
                        movable: true,
                        modalSize: [500, 400],
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


        /**保存菜单资源信息*/
        $('#saveValue').click(function () {
            // var resSaveLoading = top.layer.msg('数据提交中，请稍候', { icon: 16, time: false, shade: 0.8 });
            var firstBuildInfo = $('#BuildingInfo').serializeObject();
            firstBuildInfo.OB_ID = obID;
            firstBuildInfo.OB_DRAWING_PATH = imgIds.toString();

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

        });
        /**取消*/
        $("#cancle").click(function () {
            var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
            parent.layer.close(index); //再执行关闭
        });

        function isArray(o) {
            return Object.prototype.toString.call(o) == '[object Array]';
        }
    });
});