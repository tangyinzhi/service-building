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
var ring =[];
var OBID;
var BUILDURL = "http://192.168.30.55:8080/building";
//建筑用途联动
var BUILDINGFIRST =BUILDURL+ "/buildingType/getBigType";
var BUILDINGOTHER = BUILDURL+"/buildingType/getOtherType";
//查询全部属性值
var selectGETBUILDEALL = BUILDURL+"/enum/getAll";
var BUILDSELECTBY =BUILDURL+ "/building/selectMap";
//文件上传
var BUILDINGFILE =BUILDURL+ "/building/upload";
//图片查询
var BUILDINGSELECTS =BUILDURL+ "/building/selectStr";
var PHOTOURLNew = "http://192.168.30.55";//服务器上的网址
var ATTACHURL = PHOTOURLNew +  ":8808/";

layui.use(['table','layer', 'form', 'laydate','upload'], function () {
    var layer = layui.layer,
        upload = layui.upload,
        table = layui.table,
        form = layui.form;
    var mydate = new Date();
    var tableData = [];


    //统计列表
    function tableInit(data) {

        if (data == undefined || data == null) {
            data = {data: []};

        }

//      $("[name='OB_IMAGE_INFO']").parent().find(".layui-upload").css("border-bottom", "1px solid rgb(196, 196, 196)");
//      $("[name='OB_IMAGE_INFO']").parent().find(".layui-upload").css("border-left", "1px solid rgb(196, 196, 196)");
//      $("[name='OB_IMAGE_INFO']").parent().find(".layui-upload").css("border-right", "1px solid rgb(196, 196, 196)");
        table.render({
            elem: '#imgTable'
            , cols: [[ //标题栏
                {type: 'numbers', title: '序号', width: 60},
                {title: '文件名', templet: '#name', width: 415},
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

        var url = ATTACHURL + data.oaFpfName;
        if (layEvent === 'download') {
            downloadIamge(url,replaceName(data.oaSaveName));
        }
        else if (layEvent === 'look') {
            showImg(url,data.oaSaveName);
        }
        else if (layEvent === 'del') {

            if(data.lastIndex!=undefined&&data.lastIndex!=null&&data.lastIndex!=-1&&files_re!=null&& files_re[data.lastIndex]){
                delete files_re[data.lastIndex];
                data.lastIndex = -1;
            }
            imgIds_re.remove(data.oaId);
            uploadListIns.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
            var delIndex = 0;
            var isDelete = false;
            for(var index in tableData){
                var item = tableData[index];
                if(item){
                    if(item.oaId==data.oaId){
                        isDelete = true;
                        delIndex =parseInt(index) ;
                    }
                }
            }
            if(isDelete){
                tableData.splice(delIndex,1);
            }
            tableInit(tableData);
        }
    });
    //展示图片
    function showImg(url,name){
        var img = new Image(); //图片预加载
        img.src=url;
        if(img) {
            setTimeout(function(){

                var width = img.width+5;
                var height = img.height +5;

                if(width>800){
                    width = 800;
                    img.width = 800;
                }
                if(height>600){
                    height = 600;
                    img.height = 600;
                }
                parent. layer.open({
                    type: 1,
                    shade: false,
                    fix: true, //不固定
                    maxmin:true,
                    offset: '100px',
                    title: replaceName(name), //不显示标题
                    area: [width + 'px', height+ 'px'],
                    content: '<div style="text-align:center;"><img style="width: 100%;height: 100%" src="' +url + '" /></div>', //捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响
                    cancel: function () {
                        //layer.msg('图片查看结束！', { time: 5000, icon: 6 });
                    }
                });
            },500);

        } else {
            alert("图片加载失败");
        }
    }
    function downloadIamge(imgsrc, name) {//下载图片地址和图片名
        var image = new Image();
        // 解决跨域 Canvas 污染问题
        image.setAttribute("crossOrigin", "anonymous");
        image.onload = function() {
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
    layuiLoading("");
    getEnum();
    getFirstKind();

    var url = getValueOfUrl();
    if(url.type){
        $("#buildinfoadd").addClass('layui-hide');
    }
    if ( url.id != null) {
        $("#newaddmap").addClass('layui-hide');
        layuiLoading("");
        $.ajax({
            type: "post",
            url: BUILDSELECTBY,
            // data:JSON.stringify({"obId":url.id}),
            data:JSON.stringify({"OB_ID":url.id}),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (result) {
                if (result.msg == "成功") {
                    var data = result.data[0];

                    odjectId = data.OBJECTID;
                    if(!odjectId){
                        sessionStorage.setItem('oldLON',data.OB_LONGITUDE);
                        sessionStorage.setItem('oldLAT',data.OB_LATITUDE);
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
                    $.post(BUILDINGSELECTS , {'ids':data.OB_DRAWING_PATH
                    },function(res){//反显添加数据
                        for (var i = 0; i<res.data.length;i++){
                            imgIds.push(res.data[i].oaId);
                            var tr = $(['<div style="display:inline-block">' +
                            '<a href="javascript:void(0)" data-magnify="gallery" data-group="g1" data-src='+ATTACHURL+res.data[i].oaFpfName+' data-caption="">' +
                            '<img style="width: 80px;height: 150px;margin-left: 10px;margin-top: 10px" src="'+ ATTACHURL+res.data[i].oaFpfName +'" alt="'+ res.data[i].oaProfName +'" class="layui-upload-img">' +
                            '</a><i class="layui-icon del_attach_btn" id="del_attach_'+ i +'" attach-id="'+res.data[i].oaId +'">ဆ</i></div>'].join(''));

                            tr.find('.del_attach_btn').on('click', function(){
                                var attachId = $(this).attr("attach-id");
                                imgIds.remove(attachId);
                                console.log(imgIds);
                                // tr.remove();
                                $(this).parent("div").remove();
                                var imglist=$("#info_all img");//获取ID为div里面的所有img
                                if(imglist.length >5){
                                    $('#info_upload').attr("disabled",true);
                                    $('#info_upload').addClass("layui-btn-disabled");
                                }else{
                                    $('#info_upload').show();
                                    $('#info_upload').attr("disabled",false);
                                    $('#info_upload').removeClass("layui-btn-disabled");
                                }
                            });
                            demoListView.append(tr);
                            var w = $(".layui-form").width();
                            var h = $(".layui-form").height()/3;
                            $('[data-magnify]').magnify({
                                Toolbar: ['prev', 'next', 'rotateLeft', 'rotateRight', 'zoomIn', 'actualSize', 'zoomOut'],
                                keyboard:true,
                                draggable:true,
                                movable:true,
                                modalSize:[500,400],
                            });
                        }
                    },"json");
                    //加载图片附件
                    $.post(BUILDINGSELECTS , {'ids':data.OB_IMAGE_INFO
                    },function(res){//反显添加数据
                        //var tableData=[];
                        for (var i = 0; i < res.data.length; i++) {
                            if(res.data[i]){
                                tableData.push(res.data[i]);
                                imgIds_re.push(res.data[i].oaId);
                            }
                        }
                        if(tableData.length>0){
                            tableInit(tableData);
                        }

                    },"json");

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
        ,uploadListIns = upload.render({
        elem: '#info_upload'
        ,url: BUILDINGFILE
        ,multiple: false
        ,auto: true
        //,bindAction: '#'
        ,allDone: function(obj){ //当文件全部被提交后，才触发'
            layuiRemoveLoading();
            console.log(obj.total); //得到总文件数
            console.log(obj.successful); //请求成功的文件数
            console.log(obj.aborted); //请求失败的文件数
        }
        ,choose: function(obj){
            var files = this.files = obj.pushFile(); //将每次选择的文件追加到文件队列
            //读取本地文件
            obj.preview(function(index, file, result){
                var tr = $(['<div style="display:inline-block">' +
                '<a href="javascript:void(0)"  data-magnify="gallery" data-group="g1" data-src='+result+' data-caption="">' +
                '<img style="width: 80px;height: 150px;margin-left: 10px;margin-top: 10px" src="'+result +'" alt="'+ file.name +'" class="layui-upload-img">' +
                '</a><i class="layui-icon del_attach_btn" id="del_attach_'+ index +'" attach-id="140008535">ဆ</i></div>'].join(''));

                //删除
                tr.find('.del_attach_btn').on('click', function(){
                    var attachId = $(this).attr("attach-id");
                    console.log(attachId);
                    imgIds.remove(attachId);
                    console.log(imgIds);
                    delete files[index]; //删除对应的文件

                    tr.remove();
                    uploadListIns.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选

                    var imglist=$("#info_all img");//获取ID为div里面的所有img
                    if(imglist.length >5){
                        $('#info_upload').attr("disabled",true);
                        $('#info_upload').addClass("layui-btn-disabled");
                    }else{
                        $('#info_upload').show()
                        $('#info_upload').attr("disabled",false);
                        $('#info_upload').removeClass("layui-btn-disabled");
                    }
                });
                demoListView.append(tr);
                var w = $(".layui-form").width();
                var h = $(".layui-form").height()/3;
                $('[data-magnify]').magnify({
                    Toolbar: ['prev', 'next', 'rotateLeft', 'rotateRight', 'zoomIn', 'actualSize', 'zoomOut'],
                    keyboard:true,
                    draggable:true,
                    movable:true,
                    modalSize:[w,h],
                    beforeOpen:function (obj,data) {console.log('beforeOpen')},
                    opened:function (obj,data) {console.log('opened')},
                    beforeClose:function (obj,data) {console.log('beforeClose')},
                    closed:function (obj,data) {console.log('closed')},
                    beforeChange:function (obj,data) {console.log('beforeChange')},
                    changed:function (obj,data) {console.log('changed')}
                });

            });
        }
        ,done: function(res,index,upload){
            var item = this.item;
            var getId = "del_attach_"+index;//获得预览图片的id
            $("#"+getId).attr("attach-id",res.data[0]);//设置attach-id属性
            //上传完毕
            imgIds.push(res.data[0]);//将返回的图片id存入数组
            console.log(imgIds);
            layer.msg('图片上传成功', {icon: 1});
            delete this.files[index] //清空列表里面的数据
        }
        ,error: function(index, upload){//上传失败的方法
            layuiRemoveLoading();
            layer.msg('图片上传失败', {icon: 2});
            delete this.files[index] //清空列表里面的数据
        }
    });

    function getEnum() {
        $.ajax({
            type: 'get',
            url: selectGETBUILDEALL,
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            async:false,
            success: function(res) {
                radioList=['OB_BASE_FORM','OB_STRU','OB_STATUS'];
                checkboxList=['OB_ELEVATOR_INFO','OB_DOWN_INFO','OB_UP_INFO'];
                var benum = [];
                for (var i = 0; i < res.data.length; i++) {
                    var be = getObjectFromJson(res.data[i]);
                    benum.push(be);
                }
                var url = getValueOfUrl();
                var disabled = "";
                if(url!=null&&url.type!=undefined&&url.type!=null&&url.type=="look"){
                    disabled = "disabled";
                }
                for(var l=0;l<benum.length;l++){
                    var nowbe = benum[l].peParameter;
                    var nowvalue = benum[l].peName;
                    switch(nowbe) {
                        case 'OB_BASE_FORM'://基础形式
                            $("#OB_BASE_FORM").append('<input '+disabled+' type="radio" name="OB_BASE_FORM" title='+nowvalue+' value='+nowvalue+'>');
                            var basrform = $("input[name='OB_BASE_FORM']");
                            // basrform[0].checked = true;
                            break;
                        case 'OB_STRU'://结构类型
                            $("#OB_STRU").append('<input '+disabled+' type="radio" name="OB_STRU" title='+nowvalue+' value='+nowvalue+'>');
                            var stru = $("input[name='OB_STRU']");
                            // stru[0].checked = true;
                            break;
                        case 'OB_STATUS'://建筑状态
                            $("#OB_STATUS").append('<input '+disabled+' type="radio" name="OB_STATUS" title='+nowvalue+' value='+nowvalue+'>');
                            var stat = $("input[name='OB_STATUS']");
                            stat[0].checked = true;
                            break;
                        case 'OB_ELEVATOR_INFO'://电梯信息
                            $("#OB_ELEVATOR_INFO").append('<input '+disabled+' type="checkbox" name="Elevator" lay-skin="primary" title='+nowvalue+' value='+nowvalue+'>');
                            break;
                        case 'OB_DOWN_INFO'://地下空间利用信息
                            $("#OB_DOWN_INFO").append('<input '+disabled+' type="checkbox" name="obDownInfos" lay-skin="primary" title='+nowvalue+' value='+nowvalue+'>');
                            break;
                        case 'OB_UP_INFO'://地上空间利用信息
                            $("#OB_UP_INFO").append('<input '+disabled+' type="checkbox" name="obUpInfos" lay-skin="primary" title='+nowvalue+' value='+nowvalue+'>');
                            break;
                        case 'OB_DESIGN_CRITERIA'://设计标准
                            var dvalue = nowvalue.split(",");
                            if(dvalue[0]==1){
                                $("#CRIT01").append('<input '+disabled+' type="checkbox" name="obDesignCriterias" lay-skin="primary" title='+dvalue[1]+' value='+dvalue[1]+'>');
                            }else if(dvalue[0]==2){
                                $("#CRIT02").append('<input '+disabled+' type="checkbox" name="obDesignCriterias" lay-skin="primary" title='+dvalue[1]+' value='+dvalue[1]+'>');
                            }else if(dvalue[0]==3){
                                $("#CRIT03").append('<input '+disabled+' type="checkbox" name="obDesignCriterias" lay-skin="primary" title='+dvalue[1]+' value='+dvalue[1]+'>');
                            }else {
                                $("#CRIT04").append('<input '+disabled+' type="checkbox" name="obDesignCriterias" lay-skin="primary" title='+dvalue[1]+' value='+dvalue[1]+'>');
                            }
                            break;
                        default:break;
                    }
                }
                form.render('checkbox');
                form.render('radio');

            },
            error: function() {
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
            async:false,
            success: function(data) {
                if(data.code == 0) {
                    $("#USAGE1").append('<option value=' + "" + '>' + "" + '</option>');
                    for (var i = 0; i < data.data.length; i++) {
                        $("#USAGE1").append('<option id='+ data.data[i].pbtCode+' value=' + data.data[i].pbtName + '>' + data.data[i].pbtName
                            + '</option>');
                    }
                }
            },
            error: function() {
                layer.msg('建筑用途获取异常', {icon: 7});
            }
        });
        form.render('select','link01');
    }


    //选择了第一大类
    form.on('select(USAGE1)', function(data) {
        var firstkind = data.elem[data.elem.selectedIndex].id;
        var firs= $("#USAGE1 option:selected").val();
        getSecondKind(firstkind);
    });

    //选择了第二大类，
    form.on('select(USAGE2)', function(data) {
        var secondkind = data.elem[data.elem.selectedIndex].id;
        var secon= $("#USAGE2 option:selected").val();
        getLastKind(secondkind);
    });

    //选择了第三大类，
    form.on('select(USAGE3)', function(data) {
        var tird= $("#USAGE3 option:selected").val();
    });

    function getSecondKind(kind) {
        $("#USAGE2").empty();
        $.ajax({
            type: "get",
            url: BUILDINGOTHER+"?pbtParent="+kind,
            contentType:"application/json;charset=utf-8",
            dataType:"json",
            async:false,
            success:function(data){
                if(data.code == 0){
                    for (var i = 0; i < data.data.length; i++) {
                        $("#USAGE2").append('<option id='+ data.data[i].pbtCode+' value=' + data.data[i].pbtName + '>' + data.data[i].pbtName + '</option>');
                    }
                }
                if($("#USAGE1 option:selected").val()){
                    var k = data.data[0].pbtCode;
                    getLastKind(k);//自动填充最后一级联动
                }
            },
            error:function () {
                alert("建筑用途获取异常");
            }
        });
        form.render('select','link02');
    }

    function getLastKind(kind) {
        $("#USAGE3").empty();
        $.ajax({
            type: "get",
            url: BUILDINGOTHER+"?pbtParent="+kind,
            contentType:"application/json;charset=utf-8",
            dataType:"json",
            async:false,
            success:function(data){
                if(data.code == 0){
                    for (var i = 0; i < data.data.length; i++) {
                        $("#USAGE3").append('<option id='+ data.data[i].pbtCode+' value=' + data.data[i].pbtName + '>' + data.data[i].pbtName + '</option>');
                    }

                }
            },
            error:function () {
                alert("建筑用途获取异常");
            }
        });
        form.render('select','link03');
    }


    var laydate = layui.laydate;
    //执行一个laydate实例
    laydate.render({
        elem: '#OB_COMP_DATE' //指定元素
        ,type: 'month' //只选择月
    });
    function fillValue(data) {
        for (var property in data) {
            var temp = document.getElementById(property);
            if (temp) {
                $("#" + property).val(data[property]);
            }
            //单选框
            if(radioList.contain(property)){
                $("#" + property).find(":radio[value='"+data[property]+"']").prop('checked',"true");
            }
            //多选框
            if(checkboxList.contain(property)){
                // $("#" + property).find(":checkbox[value='"+newvalue[i]+"']").prop('checked',"false");
                if(data[property]){
                    var newvalue = data[property].split(";");
                    for(var i=0;i<newvalue.length;i++){
                        if(property == "OB_ELEVATOR_INFO"){
                            $('#eNumber').val(newvalue[0]);
                            if( $("#eNumber").val()){
                                $("#ediv").removeClass('layui-hide');
                            }
                        }
                        $("#" + property).find(":checkbox[value='"+newvalue[i]+"']").prop('checked',"true");

                    }
                }
            }
            if(property == "OB_DESIGN_CRITERIA"){
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
            if(property == "OB_USAGE"){
                if(data[property]){
                    var us=data[property].split(";");
                    var fk=$("select option[value='"+us[0]+"']").attr("id");
                    getSecondKind(fk);
                    var sk=$("select option[value='"+us[1]+"']").attr("id");
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

});


function replaceName(name) {
    if (name == undefined || name == null) {
        return "";
    }
    var str = name.toString().split('-')[0];
    return str;
}
