var street;
var oname;
var imgIds = new Array();
var imgIds_re = new Array();
var fileIds = new Array();
var map;
var buildIcon;
var wmsLayerBuild;
var odjectId;
var datasearchVectorLayer;
var radioList;
var checkboxList;

var DrawPolygonlayer;
var DrawPolygonSource;
var draw;
var arr;
var ring = [];
var OBID;
wmsLayerBuild = new ol.layer.Tile({
    source: new ol.source.TileArcGISRest({
        url: BUILDSERVICE
    })
});


layui.use(['table', 'layer', 'form', 'laydate', 'upload'], function () {
    var layer = layui.layer,
        upload = layui.upload,
        table = layui.table,
        form = layui.form;
    var mydate = new Date();
    var tableData = [];
    OBID = uuid();

    layuiLoading("");
    getEnum();
    getFirstKind();
    initMap(105.39814621210098, 28.89052122831345, 20);

    //列表初始化
    function tableInit(data) {

        if (data == undefined || data == null) {
            data = {data: []};

        }

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

    //tacble列表工具栏操作事件
    table.on('tool(imgTableEvent)', function (obj) {
        var data = obj.data;
        var layEvent = obj.event;

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
                parent.layer.open({
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

    var url = getValueOfUrl();
    if (url.type) {
        $("#buildinfoadd").addClass('layui-hide');
    }
    if (url.id != null) {
        $("#newaddmap").addClass('layui-hide');
        layuiLoading("");
        $.ajax({
            type: "post",
            url: BUILDSELECTBY,
            // data:JSON.stringify({"obId":url.id}),
            data: JSON.stringify({"OB_ID": url.id}),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (result) {
                if (result.msg == "成功") {
                    var data = result.data[0];

                    odjectId = data.OBJECTID;
                    if (!odjectId) {
                        sessionStorage.setItem('oldLON', data.OB_LONGITUDE);
                        sessionStorage.setItem('oldLAT', data.OB_LATITUDE);
                        $("#newaddmap").removeClass('layui-hide');
                        var vectorsource = new ol.source.Vector({});
                        var geometrypt = new ol.geom.Point([data.OB_LONGITUDE, data.OB_LATITUDE]);
                        var feature = new ol.Feature({geometry: geometrypt});
                        vectorsource.addFeature(feature);
                        datasearchVectorLayer = new ol.layer.Vector({
                            source: vectorsource,
                            style: new ol.style.Style({
                                image: new ol.style.Icon({
                                    src: '../img/map/point.png'
                                }),
                            })
                        });
                        map.addLayer(datasearchVectorLayer);
                    }
                    console.log(data)

                    fillValue(data);

                    //加载图片附件
                    $.post(BUILDINGSELECTS, {
                        'ids': data.OB_DRAWING_PATH
                    }, function (res) {//反显添加数据
                        for (var i = 0; i < res.data.length; i++) {
                            imgIds.push(res.data[i].oaId);
                            var tr = $(['<div style="display:inline-block">' +
                            '<a href="javascript:void(0)" data-magnify="gallery" data-group="g1" data-src=' + ATTACHURL + res.data[i].oaFpfName + ' data-caption="">' +
                            '<img style="width: 80px;height: 150px;margin-left: 10px;margin-top: 10px" src="' + ATTACHURL + res.data[i].oaFpfName + '" alt="' + res.data[i].oaProfName + '" class="layui-upload-img">' +
                            '</a><i class="layui-icon del_attach_btn" id="del_attach_' + i + '" attach-id="' + res.data[i].oaId + '">ဆ</i></div>'].join(''));

                            tr.find('.del_attach_btn').on('click', function () {
                                var attachId = $(this).attr("attach-id");
                                imgIds.remove(attachId);
                                console.log(imgIds);
                                // tr.remove();
                                $(this).parent("div").remove();
                                var imglist = $("#info_all img");//获取ID为div里面的所有img
                                if (imglist.length > 5) {
                                    $('#info_upload').attr("disabled", true);
                                    $('#info_upload').addClass("layui-btn-disabled");
                                } else {
                                    $('#info_upload').show();
                                    $('#info_upload').attr("disabled", false);
                                    $('#info_upload').removeClass("layui-btn-disabled");
                                }
                            });
                            demoListView.append(tr);
                            var w = $(".layui-form").width();
                            var h = $(".layui-form").height() / 3;
                            $('[data-magnify]').magnify({
                                Toolbar: ['prev', 'next', 'rotateLeft', 'rotateRight', 'zoomIn', 'actualSize', 'zoomOut'],
                                keyboard: true,
                                draggable: true,
                                movable: true,
                                modalSize: [500, 400],
                            });
                        }
                    }, "json");
                    //加载图片附件
                    $.post(BUILDINGSELECTS, {
                        'ids': data.OB_IMAGE_INFO
                    }, function (res) {//反显添加数据
                        for (var i = 0; i < res.data.length; i++) {
                            if (res.data[i]) {
                                tableData.push(res.data[i]);
                                imgIds_re.push(res.data[i].oaId);
                            }
                        }
                        if (tableData.length > 0) {
                            tableInit(tableData);
                        }
                    }, "json");

                    layuiRemoveLoading();
                } else {
                    layer.msg('查询失败', {icon: 2});
                }
            },
            error: function () {
                layuiRemoveLoading();
                layer.msg('网络请求异常', {icon: 7});
            }
        });

    }


    //多图片上传
    var demoListView = $('#info_all')
        , uploadListIns = upload.render({
        elem: '#info_upload'
        , url: BUILDINGFILE
        , multiple: false
        , auto: true
        //,bindAction: '#'
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
                '<img style="width: 80px;height: 150px;margin-left: 10px;margin-top: 10px" src="' + result + '" alt="' + file.name + '" class="layui-upload-img">' +
                '</a><i class="layui-icon del_attach_btn" id="del_attach_' + index + '" attach-id="140008535">ဆ</i></div>'].join(''));

                //删除
                tr.find('.del_attach_btn').on('click', function () {
                    var attachId = $(this).attr("attach-id");
                    console.log(attachId);
                    imgIds.remove(attachId);
                    console.log(imgIds);
                    delete files[index]; //删除对应的文件

                    tr.remove();
                    uploadListIns.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选

                    var imglist = $("#info_all img");//获取ID为div里面的所有img
                    if (imglist.length > 5) {
                        $('#info_upload').attr("disabled", true);
                        $('#info_upload').addClass("layui-btn-disabled");
                    } else {
                        $('#info_upload').show()
                        $('#info_upload').attr("disabled", false);
                        $('#info_upload').removeClass("layui-btn-disabled");
                    }
                });
                demoListView.append(tr);
                var w = $(".layui-form").width();
                var h = $(".layui-form").height() / 3;
                $('[data-magnify]').magnify({
                    Toolbar: ['prev', 'next', 'rotateLeft', 'rotateRight', 'zoomIn', 'actualSize', 'zoomOut'],
                    keyboard: true,
                    draggable: true,
                    movable: true,
                    modalSize: [w, h],
                    beforeOpen: function (obj, data) {
                        console.log('beforeOpen')
                    },
                    opened: function (obj, data) {
                        console.log('opened')
                    },
                    beforeClose: function (obj, data) {
                        console.log('beforeClose')
                    },
                    closed: function (obj, data) {
                        console.log('closed')
                    },
                    beforeChange: function (obj, data) {
                        console.log('beforeChange')
                    },
                    changed: function (obj, data) {
                        console.log('changed')
                    }
                });

            });
        }
        , done: function (res, index, upload) {
            var item = this.item;
            var getId = "del_attach_" + index;//获得预览图片的id
            $("#" + getId).attr("attach-id", res.data[0]);//设置attach-id属性
            //上传完毕
            imgIds.push(res.data[0]);//将返回的图片id存入数组
            console.log(imgIds);
            layer.msg('图片上传成功', {icon: 1});
            delete this.files[index] //清空列表里面的数据
        }
        , error: function (index, upload) {//上传失败的方法
            layuiRemoveLoading();
            layer.msg('图片上传失败', {icon: 2});
            delete this.files[index] //清空列表里面的数据
        }
    });
    //多图片上传-图纸信息
    var uploadListIns_re = upload.render({
        elem: "#info_upload_re"
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
    $('#buildinfoadd').click(function () {
        layuiLoading("");
        console.log(ring);
        //设计标准
        var radio = document.getElementsByName("obDesignCriterias");
        var str = checkBoxSelect(radio);
        $("#OB_DESIGN_CRITERIA").val(str);
        //用途
        var use01 = $(".use01").find("input").val();
        var use02 = $(".use02").find("input").val();
        var use03 = $(".use03").find("input").val();
        if (!use03) {
            var use = use01 + ";" + use02;
        } else {
            var use = use01 + ";" + use02 + ";" + use03;
        }
        $("#OB_USAGE").val(use);

        var firstBuildInfo = $('#buildinfoform').serializeObject();//建筑物属性表单
        firstBuildInfo.OB_DRAWING_PATH = imgIds.toString();//将返回的图片id数组填入数据，建筑图片
        firstBuildInfo.OB_IMAGE_INFO = imgIds_re.toString();//将返回的图片id数组填入数据，图纸信息
        //电梯Elevatore
        var ele = document.getElementsByName("Elevator");
        var elevator = $("#eNumber").val() + ";" + checkBoxSelect(ele);
        firstBuildInfo.OB_ELEVATOR_INFO = elevator.toString();

        //地下空间
        var down = document.getElementsByName("obDownInfos");
        var downinfo = checkBoxSelect(down);
        firstBuildInfo.OB_DOWN_INFO = downinfo.toString();

        //地上空间
        var up = document.getElementsByName("obUpInfos");
        var upinfo = checkBoxSelect(up);
        firstBuildInfo.OB_UP_INFO = upinfo.toString();

        if (!$("#OB_NAME").val() || !$("#OB_ADDR").val() || !$("#OB_LD_AREA").val() || !$("#OB_FLOOR_AREA").val() || !use01
            || !$("#OB_UP_FLOOR").val() || !$("#OB_DOWN_FLOOR").val() || !$("#OB_FLOOR_HEIGHT").val() || !$("#OB_HEIGHT").val()
            || !$("#OB_DOOR_NUM").val()) {
            layer.msg('请填写必填信息', {icon: 7});
            layuiRemoveLoading();
            return;
        }
        if (!firstBuildInfo.OB_BASE_FORM) {
            layer.msg('请选择基础形式', {icon: 7});
            layuiRemoveLoading();
            return;
        }
        if (!firstBuildInfo.OB_STRU) {
            layer.msg('请选择结构类型', {icon: 7});
            layuiRemoveLoading();
            return;
        }
        if (!$("#OB_COMP_DATE").val()) {
            layer.msg('请填写建造年代', {icon: 7});
            layuiRemoveLoading();
            return;
        }

        editSubmit(ring, firstBuildInfo);
        //editSubmit(ring)

    });


    function getEnum() {
        $.ajax({
            type: 'get',
            url: selectGETBUILDEALL,
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            async: false,
            success: function (res) {
                radioList = ['OB_BASE_FORM', 'OB_STRU', 'OB_STATUS'];
                checkboxList = ['OB_ELEVATOR_INFO', 'OB_DOWN_INFO', 'OB_UP_INFO'];
                var benum = [];
                for (var i = 0; i < res.data.length; i++) {
                    var be = getObjectFromJson(res.data[i]);
                    benum.push(be);
                }
                var url = getValueOfUrl();
                var disabled = "";
                if (url != null && url.type != undefined && url.type != null && url.type == "look") {
                    disabled = "disabled";
                }
                for (var l = 0; l < benum.length; l++) {
                    var nowbe = benum[l].peParameter;
                    var nowvalue = benum[l].peName;
                    switch (nowbe) {
                        case 'OB_BASE_FORM'://基础形式
                            $("#OB_BASE_FORM").append('<input ' + disabled + ' type="radio" name="OB_BASE_FORM" title=' + nowvalue + ' value=' + nowvalue + '>');
                            var basrform = $("input[name='OB_BASE_FORM']");
                            // basrform[0].checked = true;
                            break;
                        case 'OB_STRU'://结构类型
                            $("#OB_STRU").append('<input ' + disabled + ' type="radio" name="OB_STRU" title=' + nowvalue + ' value=' + nowvalue + '>');
                            var stru = $("input[name='OB_STRU']");
                            // stru[0].checked = true;
                            break;
                        case 'OB_STATUS'://建筑状态
                            $("#OB_STATUS").append('<input ' + disabled + ' type="radio" name="OB_STATUS" title=' + nowvalue + ' value=' + nowvalue + '>');
                            var stat = $("input[name='OB_STATUS']");
                            stat[0].checked = true;
                            break;
                        case 'OB_ELEVATOR_INFO'://电梯信息
                            $("#OB_ELEVATOR_INFO").append('<input ' + disabled + ' type="checkbox" name="Elevator" lay-skin="primary" title=' + nowvalue + ' value=' + nowvalue + '>');
                            break;
                        case 'OB_DOWN_INFO'://地下空间利用信息
                            $("#OB_DOWN_INFO").append('<input ' + disabled + ' type="checkbox" name="obDownInfos" lay-skin="primary" title=' + nowvalue + ' value=' + nowvalue + '>');
                            break;
                        case 'OB_UP_INFO'://地上空间利用信息
                            $("#OB_UP_INFO").append('<input ' + disabled + ' type="checkbox" name="obUpInfos" lay-skin="primary" title=' + nowvalue + ' value=' + nowvalue + '>');
                            break;
                        case 'OB_DESIGN_CRITERIA'://设计标准
                            var dvalue = nowvalue.split(",");
                            if (dvalue[0] == 1) {
                                $("#CRIT01").append('<input ' + disabled + ' type="checkbox" name="obDesignCriterias" lay-skin="primary" title=' + dvalue[1] + ' value=' + dvalue[1] + '>');
                            } else if (dvalue[0] == 2) {
                                $("#CRIT02").append('<input ' + disabled + ' type="checkbox" name="obDesignCriterias" lay-skin="primary" title=' + dvalue[1] + ' value=' + dvalue[1] + '>');
                            } else if (dvalue[0] == 3) {
                                $("#CRIT03").append('<input ' + disabled + ' type="checkbox" name="obDesignCriterias" lay-skin="primary" title=' + dvalue[1] + ' value=' + dvalue[1] + '>');
                            } else {
                                $("#CRIT04").append('<input ' + disabled + ' type="checkbox" name="obDesignCriterias" lay-skin="primary" title=' + dvalue[1] + ' value=' + dvalue[1] + '>');
                            }
                            break;
                        default:
                            break;
                    }
                }
                form.render('checkbox');
                form.render('radio');

            },
            error: function () {
                layer.msg('获取选项值异常', {icon: 7});
            }
        });
        layuiRemoveLoading();
    }

    function getFirstKind() {
        $.ajax({
            type: 'get',
            url: BUILDINGFIRST,
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            async: false,
            success: function (data) {
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
        form.render('select', 'link01');
    }


    //选择了第一大类
    form.on('select(USAGE1)', function (data) {
        var firstkind = data.elem[data.elem.selectedIndex].id;
        var firs = $("#USAGE1 option:selected").val();
        getSecondKind(firstkind);
    });

    //选择了第二大类，
    form.on('select(USAGE2)', function (data) {
        var secondkind = data.elem[data.elem.selectedIndex].id;
        var secon = $("#USAGE2 option:selected").val();
        getLastKind(secondkind);
    });

    //选择了第三大类，
    form.on('select(USAGE3)', function (data) {
        var tird = $("#USAGE3 option:selected").val();
    });

    function getSecondKind(kind) {
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

    $('#eNumber').bind('input propertychange', function () {
        if ($("#eNumber").val()) {
            $("#ediv").removeClass('layui-hide');
        }
        if (!$("#eNumber").val()) {
            $("#ediv").addClass('layui-hide');
        }
    });
    //点击了克隆查询
    $(document).on('click', '#selectClone', function () {
        layuiLoading("");
        var cloneName = $('#OB_NAME').val();
        if (cloneName) {
            $.ajax({
                type: "post",
                url: BUILDSELECTBY,
                data: JSON.stringify({"OB_NAME": cloneName}),
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                success: function (result) {
                    if (result.msg == "成功") {
                        if (result.data.length > 0) {
                            var data = result.data[0];
                            for (var i = 0; i < result.data.length; i++) {
                                cloneInfo.push(result.data[i]);
                                $("#chooseClone").append('<option value=' + result.data[i].OB_NAME + '>' + result.data[i].OB_NAME + '</option>');
                            }
                            $('#clonehide').removeClass('layui-hide');
                            layuiRemoveLoading();
                            layer.msg('查询成功', {icon: 1});

                        } else {
                            layuiRemoveLoading();
                            layer.msg('未查询到克隆对象，请核对建筑名称', {icon: 7});
                        }
                    } else {
                        layuiRemoveLoading();
                        layer.msg('未查询到克隆对象，请核对建筑名称', {icon: 7});
                    }
                    form.render('select', 'clonediv');
                },
                error: function (err) {
                    layuiRemoveLoading();
                    layer.msg('网络请求异常', {icon: 7});
                }
            });
        } else {
            layuiRemoveLoading();
            layer.msg('请输入建筑名称再进行克隆', {icon: 7});
        }

    });

    //选择了克隆对象，
    form.on('select(chooseClone)', function (data) {
        var cloneName = $("#chooseClone option:selected").val();
        var cloneID = $("#chooseClone").prop('selectedIndex');
        var newInfo = cloneInfo[cloneID];
        layer.confirm('确认克隆' + cloneName + '吗？',
            {
                icon: 3, title: '提示', btn: ['确认', '取消'], btnAlign: 'c' //可以无限个按钮
            }, function (index, layero) {
                layuiLoading("");
                isClone = true;
                $("input:checkbox").removeAttr("checked");
                fillValue(newInfo);
                layuiRemoveLoading();
                layer.close(index);
            }, function (index) {
            });

    });

    function fillValue(data) {
        for (var property in data) {
            var temp = document.getElementById(property);
            if (temp) {
                $("#" + property).val(data[property]);
            }
            //单选框
            if (radioList.contain(property)) {
                $("#" + property).find(":radio[value='" + data[property] + "']").prop('checked', "true");
            }
            //多选框
            if (checkboxList.contain(property)) {
                // $("#" + property).find(":checkbox[value='"+newvalue[i]+"']").prop('checked',"false");
                if (data[property]) {
                    var newvalue = data[property].split(";");
                    for (var i = 0; i < newvalue.length; i++) {
                        if (property == "OB_ELEVATOR_INFO") {
                            $('#eNumber').val(newvalue[0]);
                            if ($("#eNumber").val()) {
                                $("#ediv").removeClass('layui-hide');
                            }
                        }
                        $("#" + property).find(":checkbox[value='" + newvalue[i] + "']").prop('checked', "true");

                    }
                }
            }
            if (property == "OB_DESIGN_CRITERIA") {
                //设计标准
                var dcheckBoxAll = $("input[name='obDesignCriterias']");
                if (data[property] != null) {
                    var dcheckArray = data[property].split(";");
                    console.log(dcheckArray);
                    for (var d = 0; d < dcheckArray.length; d++) {
                        $.each(dcheckBoxAll, function (l, checkbox) {
                            var dcheckValue = $(checkbox).val();
                            if (dcheckArray[d] == dcheckValue) {
                                $(checkbox).attr("checked", true);
                            }
                        })
                    }
                }
            }
            //建筑用途
            if (property == "OB_USAGE") {
                if (data[property]) {
                    var us = data[property].split(";");
                    var fk = $("select option[value='" + us[0] + "']").attr("id");
                    getSecondKind(fk);
                    var sk = $("select option[value='" + us[1] + "']").attr("id");
                    getLastKind(sk);
                    $("#USAGE1 option[value='" + us[0] + "']").prop("selected", "selected");
                    $("#USAGE2 option[value='" + us[1] + "']").prop("selected", "selected");
                    $("#USAGE3 option[value='" + us[2] + "']").prop("selected", "selected");
                }
            }

        }
        form.render('select');
        form.render('checkbox');
        form.render('radio');
    }

    var laydate = layui.laydate;
    //执行一个laydate实例
    laydate.render({
        elem: '#OB_COMP_DATE' //指定元素
        , type: 'month' //只选择月
    });


})


function initMap(x, y, zoom) {
    layuiLoading("");
    map = new ol.Map({
        target: 'mapDiv',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.TileArcGISRest({
                    url: MAPBUTTON
                })
            }),
        ],
        view: new ol.View({
            center: [x, y],
            zoom: zoom,
            minZoom: 10,
            maxZoom: 20,
            projection: 'EPSG:4326'
        }),
    });

    wmsLayerBuild.setZIndex(100)
    map.addLayer(wmsLayerBuild);
    layuiRemoveLoading();

    $.ajax({
        type: "get",
        url: MAPLAYERS,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            if (result.msg == "成功") {
                var data = result.data;
                var str = "";
                var l;
                for (var i = 0; i < data.length; i++) {

                    if (data[i].servicesDescription == '影像') {
                        $('#yx-icon').addClass(data[i].servicesDetails);
                        wmsLayerVido = new ol.layer.Tile({
                            source: new ol.source.TileArcGISRest({
                                url: data[i].servicesAddr
                            })
                        });
                        var wmsLayer = new ol.layer.Tile({
                            source: new ol.source.TileArcGISRest({
                                url: data[i].servicesAddr
                            })
                        });
                        wmsLayerVido.setZIndex(98)

                    }
                    if (data[i].servicesDescription == '谷歌') {
                        $('#ge-icon').addClass(data[i].servicesDetails);
                        wmsLayerGu = new ol.layer.Tile({
                            source: new ol.source.TileArcGISRest({
                                url: data[i].servicesAddr
                            })
                        });
                        wmsLayerGu.setZIndex(99);
                    }

                }

            }
        },
        error: function () {
            layer.msg('网络请求异常', {icon: 7});
        }
    });
}


//点击了影像
$(document).on('click', '#yx', function (data) {
    if ($('#yx').is('.check')) {
        $('#yx').removeClass('check');
        $("#yx-icon").css("color", "#0D0D0D");
        map.removeLayer(wmsLayerVido);
    } else {
        $('#yx').addClass('check');
        $('#yx').addClass('blue_border');
        $("#yx-icon").css("color", "#1E9FFF");

        map.addLayer(wmsLayerVido);
    }

});
//点击了谷歌
$(document).on('click', '#ge', function (data) {
    if ($('#ge').is('.check')) {
        $('#ge').removeClass('check');
        $("#ge-icon").css("color", "#0D0D0D");
        map.removeLayer(wmsLayerGu);
    } else {
        $('#ge').addClass('check');
        $("#ge-icon").css("color", "#1E9FFF");
        map.addLayer(wmsLayerGu);
    }

});
//点击了画面
$(document).on('click', '#drow_acreage', function (data) {
    map.removeLayer(DrawPolygonlayer);
    geometryJson = {"rings": []};
    DrawPolygonSource = new ol.source.Vector({
        wrapX: false,
    });
    DrawPolygonlayer = new ol.layer.Vector({
        source: DrawPolygonSource
    });
    map.addLayer(DrawPolygonlayer);
    draw = new ol.interaction.Draw({
        source: DrawPolygonSource,
        type: /** @type {ol.geom.GeometryType} */ "Polygon",
        // style: new ol.style.Style({
        //     fill: new ol.style.Fill({
        //         color: 'rgba(255, 255, 255, 0.2)'
        //     }),
        //     stroke: new ol.style.Stroke({
        //         color: '#ffcc33',
        //         width: 2
        //     }),
        //     image: new ol.style.Circle({
        //         radius: 7,
        //         fill: new ol.style.Fill({
        //             color: '#ffcc33'
        //         })
        //     })
        //     }),
        finishCondition: finishCondition
    });
    map.addInteraction(draw);
});

//画面完成后回调
function finishCondition(event) {
    setTimeout(function () {
        removeDrawInteraction();
    }, 100);
    return true;
}

var geometryJson = {"rings": []};

//移除画面操作
function removeDrawInteraction() {
    map.removeInteraction(draw);
    var geometryRings = [];
    if (DrawPolygonSource != undefined && DrawPolygonSource != null) {
        arr = DrawPolygonSource.getFeatures()[0].getGeometry().A;
        ring = [];
        if (arr != undefined && arr != null && arr.length >= 0 && geometryJson.rings != undefined) {
            for (var i = 0; i < arr.length; i = i + 2) {
                ring.push([arr[i], arr[i + 1]])
            }

            geometryJson.rings.push(ring);
            // selectFeatureByGeometryPolygon(geometryJson);
        }
    }
}

//查询画面图层
function selectFeatureByGeometryPolygon(Json) {
    $.ajax({
        type: 'get',
        url: AREASERVICEINFO + "&geometry=" + JSON.stringify(Json) + "&geometryType=esriGeometryPolygon&spatialRel=esriSpatialRelIntersects&returnGeometry=false&returnIdsOnly=false&returnZ=false&outFields=PARKING_LOCAL_B&returnM=false&f=pjson",
        success: function (data) {

            var dataAll = JSON.parse(data);
            var result = dataAll.features;
            if (result.length <= 0) {
                return;
            }
            var str = 0;
            for (var i = 0; i < result.length; i++) {
                var attributes = result[i].attributes;
                var PARKING_LOCAL_B = attributes.PARKING_LOCAL_B;
                if (PARKING_LOCAL_B) {
                    if (!isNaN(PARKING_LOCAL_B)) {
                        str += parseInt(PARKING_LOCAL_B);
                    }
                }
            }
            var s = str + "";
            var arr = s.split('');
            var c = "";
            for (var i = 0; i < arr.length; i++) {
                c += "<span>" + arr[i] + "</span>";
            }
            $('#parkNumTotal').html(c);

        },
        error: function () {
            layer.msg('网络请求异常', {
                icon: 7
            });
        }
    });
}

//清空图层
$(document).on('click', '#drow_delet', function (data) {
    map.removeLayer(DrawPolygonlayer);
});

//墨卡托转经纬度
function mercator2lonlat(mercator) {
    var lonlat = {x: 0, y: 0};
    var x = mercator[0] / 20037508.34 * 180;
    var y = mercator[1] / 20037508.34 * 180;
    y = 180 / Math.PI * (2 * Math.atan(Math.exp(y * Math.PI / 180)) - Math.PI / 2);
    lonlat.x = x;
    lonlat.y = y;
    return lonlat;
}

function uuid() {
    var s = [];
    var hexDigits = "0123456789ABCDEF";
    for (var i = 0; i < 32; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01


    var uuid = s.join("");
    return uuid;
}


function editSubmit(res, d) {
    layuiLoading();
    require(["esri/Map",
        "esri/config",
        "esri/views/MapView",
        "esri/layers/MapImageLayer",
        "esri/geometry/Extent",
        "esri/layers/WMSLayer",
        "esri/layers/FeatureLayer",
        "esri/Graphic",
        "esri/widgets/Expand",
        "esri/widgets/FeatureForm",
        "esri/widgets/FeatureTemplates",
        "esri/geometry/Point",
        "esri/symbols/PictureMarkerSymbol",
        "esri/geometry/SpatialReference",
        "esri/geometry/Polygon",
        "esri/symbols/SimpleFillSymbol",
        "esri/layers/GraphicsLayer",
        "esri/widgets/Sketch",
        "esri/geometry/Polyline",
        "esri/symbols/SimpleLineSymbol",
        "esri/widgets/Sketch/SketchViewModel",
        "dojo/domReady"
    ], function (Map, esriConfig, MapView, MapImageLayer, Extent, WMSLayer, FeatureLayer, Graphic, Expand,
                 FeatureForm, FeatureTemplates, Point, PictureMarkerSymbol, SpatialReference, Polygon, SimpleFillSymbol, GraphicsLayer, Sketch, Polyline, SimpleLineSymbol, SketchViewModel) {
        esriConfig.request.corsEnabledServers.push("localhost:6443");
        map = new Map({
            center: [105.398168975444, 28.89023477708057],
            zoom: 10,
            basemap: "topo"
        });
        view = new MapView({
            map: map,
            container: "map",

        });
        view.ui.remove("attribution");//移除底部ESRI logo

        //设置地图显示范围
        view.extent = new Extent({
            xmin: 105.444445839231 + 0.01,
            ymin: 28.8799417959374 + 0.01,
            xmax: 105.444445839231 - 0.01,
            ymax: 28.8799417959374 - 0.01,
            spatialReference: {
                wkid: 4326
            }
        });
        //添加ArcGIS动态切片
        var layer = new MapImageLayer({
            url: MAPBUTTON
        });
        map.add(layer, 0);


        //显示初始化图
        var featureLayer = new FeatureLayer({
            url: "http://192.168.30.56:6080/arcgis/rest/services/build/build/FeatureServer/0",
            outFields: ["*"],
            popupEnabled: false,
            id: "build"
        });
        //featureLayer.definitionExpression = "(OBJECTID = '"+parma.id+"')";
        map.add(featureLayer, 1);

        var newPoint = [];
        for (var j = 0; j < res.length; j++) {
            var cPoint;
            var changePoint = res[j][0];
            if (changePoint > 1000) {//需要转换
                var changePoint01 = res[j];
                cPoint = mercator2lonlat(changePoint01);
                // allDataTwo[i].geometry.paths[0][j] = [cPoint.x, cPoint.y];
                newPoint.push([cPoint.x, cPoint.y, 0]);
            } else {
                //newPoint.push(res[j],0);
                newPoint.push([res[j][0], res[j][1], 0]);
            }
        }

        var finallyPoint = [];
        finallyPoint.push(newPoint);

        var polygon = new Polygon({
            rings: finallyPoint,
            spatialReference: {wkid: 4490}
        });

        // var p = new Polyline({
        //     paths: newPoint,
        //     hasZ: true,
        //     hasM: false,
        //     spatialReference: {wkid: 4490}
        // });

        var polygonGraphic = new Graphic({
            geometry: polygon,
            attributes: {
                "OB_ID": OBID,
                "OB_CODE": d.OB_CODE,
                "OB_NAME": d.OB_NAME,
                "OB_ADDR": d.OB_ADDR,
                "OB_LD_AREA": d.OB_LD_AREA,
                "OB_FLOOR_AREA": d.OB_FLOOR_AREA,
                "OB_USAGE": d.OB_USAGE,
                "OB_BASE_FORM": d.OB_BASE_FORM,
                "OB_STRU": d.OB_STRU,
                "OB_UP_FLOOR": d.OB_UP_FLOOR,
                "OB_DOWN_FLOOR": d.OB_DOWN_FLOOR,
                "OB_FLOOR_HEIGHT": d.OB_FLOOR_HEIGHT,
                "OB_HEIGHT": d.OB_HEIGHT,
                "OB_DOOR_NUM": d.OB_DOOR_NUM,
                "OB_ELEVATOR_INFO": d.OB_ELEVATOR_INFO,
                "OB_DOWN_INFO": d.OB_DOWN_INFO,
                "OB_AIR_DEFENCE_INFO": d.OB_AIR_DEFENCE_INFO,
                "OB_FIRE_CONTROL_INFO": d.OB_FIRE_CONTROL_INFO,
                "OB_PROPERTY_UNIT": d.OB_PROPERTY_UNIT,
                "OB_PROPERTY_NO": d.OB_PROPERTY_NO,
                "OB_COMP_DATE": d.OB_COMP_DATE,
                "OB_DESIGN_CRITERIA": d.OB_DESIGN_CRITERIA,
                "OB_DRAWING_PATH": d.OB_DRAWING_PATH,
                "OB_STATUS": d.OB_STATUS,
                "OB_GEOLOGY_INFO": d.OB_GEOLOGY_INFO,
                "OB_AREA": d.OB_AREA,
                "OB_UP_INFO": d.OB_UP_INFO,
                "OB_MODEL_NAME": "1",
                "OB_PROPERTY_NAME": d.OB_PROPERTY_NAME,
                "OB_IMAGE_INFO": d.OB_IMAGE_INFO,
                "OB_BZ": d.OB_BZ,
                "OB_LONGITUDE": d.OB_LONGITUDE,
                "OB_LATITUDE": d.OB_LATITUDE

            }
        });

        var edits = {
            addFeatures: [polygonGraphic]
        };
        console.log(edits)

        featureLayer.applyEdits(edits).then(function (editsResult) {
            if (editsResult.addFeatureResults.length > 0 || editsResult.updateFeatureResults.length > 0) {
                layuiRemoveLoading();
                var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                parent.location.reload();
                parent.layer.close(index); //再执行关闭

            } else if (editsResult.deleteFeatureResults.length > 0) {
                layuiRemoveLoading();
            }
        }).catch(function (error) {
            layuiRemoveLoading();
            //console.error("[ applyEdits ] FAILURE: ", error.code, error.name, error.message);
            //console.log("error = ", error);
            layer.msg('提交失败，请联系系统管理员', {icon: 2})

        });

    });

}

function replaceName(name) {
    if (name == undefined || name == null) {
        return "";
    }
    var str = name.toString().split('-')[0];
    return str;
}
