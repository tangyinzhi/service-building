//点击后高亮下方的feature 并且弹出popup信息做展示
Popup = function (map) {
    this.map = map;

    //添加一个popup的div
    var div = document.createElement("div");
    div.id = 'popup';
    div.className = 'ol-popup';
    div.innerHTML = ' <a href="#" id="popup_closer" class="ol-popup-closer" style="color: #fff;"></a>  ' +
        '  <div id="popup_content"></div>  ';

    document.body.appendChild(div);

    var overlay = new ol.Overlay({
        element: div,
        autoPan: true,
        autoPanAnimation: {
            duration: 250
        }/* ,
		   offset:[0,-45]*/
    });
    map.addOverlay(overlay);
    //扔到map里 后面方便调用
    this.popup = overlay;

    document.getElementById('popup_closer').onclick = function () {
        overlay.setPosition(undefined);
        //$('#popup_closer').blur();
        return false;
    };

};


/**
 * 泡泡显示信息
 * @param _info 气泡内容
 * @param _position 气泡显示的位置 [lon,lat]
 */
Popup.prototype.tooltip = function (_info, _position) {

    document.getElementById('popup_content').innerHTML = _info;

    //点击了编辑
    document.getElementById('buildedit').onclick = function (data) {
        var buildId = $(this).attr("data-value");
        var objectId = $(this).attr("typ");
        if (buildId == undefined || buildId == null || buildId == "null") {
            layer.msg('未查找到编辑内容', {
                icon: 7
            });
            return;
        }
        if (objectId == 'undefined' || objectId == undefined || objectId == null || objectId == "null") {
            var o = true;
        } else {
            var o = false;
        }
        layer.open({
            title: '编辑建筑物信息',
            type: 2,
            maxmin: false,
            shade: 0.5,
            offset: '20px',
            area: ['750px', '85%'],
            //content: 'buildname_info.html?id=' + buildId,
            content: 'BuildAttManager_edit.html?ID=' + buildId + '&type=edit' + '&visual=' + o,
            closeBtn: 1,
            yes: function (index, layero) { //弹出框的位置
                var newpsw = window[layero.find('iframe')[0]['name']];
                var value = newpsw.addInfo(0);
            },
            success: function (layero) { //弹出框的位置--一开始进去就请求的方法
            }
        });
    };
    //点击了查看
    document.getElementById('buildlook').onclick = function (data) {
        var buildId = $(this).attr("data-value");
        var objectId = $(this).attr("typ");
        if (buildId == undefined || buildId == null || buildId == "null") {
            layer.msg('未查找到查看内容', {
                icon: 7
            });
            return;
        }
        if (objectId == 'undefined' || objectId == undefined || objectId == null || objectId == "null") {
            var o = true;
        } else {
            var o = false;
        }
        layer.open({
            title: '查看建筑物信息',
            type: 2,
            maxmin: false,
            shade: 0.5,
            offset: '20px',
            area: ['750px', '85%'],
            // content: 'buildname_info.html?id=' + buildId +"&type=look",
            content: 'BuildAttManager_edit.html?ID=' + buildId + '&type=look' + '&visual=' + o,
            closeBtn: 1,
            yes: function (index, layero) { //弹出框的位置
                var newpsw = window[layero.find('iframe')[0]['name']];
                var value = newpsw.addInfo(0);
            },
            success: function (layero) { //弹出框的位置--一开始进去就请求的方法
            }
        });

    };

    //设置popup的位置
    this.popup.setPosition(_position);

}

function setPopBox(obcode, buildname, buildstru, buildaddr, id, objectid) {
    var str = '<div id="kk" class="ol-unselectable kk"' +
        '     style="width: 220px;height: 100px;margin-top: 5px;margin-left: -5px;background:rgba(0, 0, 0, 0);color: #fff;text-align: left">' +
        '    <div class="layui-form-item item">' +
        '        <label class="">编号：</label>' +
        '        <label class="" style="width: 100%" id="kk_name">' + obcode + '</label>' +
        '    </div>' +
        '    <div class="layui-form-item item">\n' +
        '        <label class="">建筑名称：</label>\n' +
        '        <label class="" style="width: 100%" id="kk_status">' + buildname + '</label>' +
        '    </div>\n' +
        '    <div class="layui-form-item item">\n' +
        '        <label class="">结构类型：</label>\n' +
        '        <label class="" style="width: 100%" id="kk_type">' + buildstru + '</label>' +
        '    </div><div class="layui-form-item item">\n' +
        '        <label class="">地址：</label>\n' +
        '        <label class="" style="width: 100%" id="kk_la">' + buildaddr + '</label>' +
        '    </div><button type="button" data-value="' + id + '" class="layui-btn layui-btn-sm" typ="' + objectid + '" id="buildedit" ' +
        'style="font-size: 14px;float: right;width: 50px;margin-right: 10px;background-color:#4b95dd;padding: 0px">编辑' +
        '</button><button type="button" data-value="' + id + '" class="layui-btn layui-btn-sm" typ="' + objectid + '" id="buildlook" ' +
        'style="font-size: 14px;float: right;width: 50px;margin-right: 10px;background-color:#4b95dd;padding: 0px">查看' +
        '</button></div>';

    return str;

}

