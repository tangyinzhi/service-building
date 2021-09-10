layui.config({
    base: '../lib/layui/lay/modules/authtree/'
}).extend({
    authtree: 'authtree',
});
layui.use(['element', 'jquery', 'form', 'authtree'], function () {
    var element = layui.element;
    var $ = layui.jquery;
    var form = layui.form;
    var authtree = layui.authtree;

    var id = getQueryString("id");
    if (id == null || id.trim().length <= 0) {
        layer.msg("没有获取到当前信息的id，请联系管理员！", {
            icon: 7
        });
        return false;
    }
    loadDataServiceTree(id);
    //加载权限树
    loadPermissionTree(id);
    loadDataPermissionTree(id);

    //加载数据权限
    function loadDataServiceTree(id) {
        $.ajax({
            url: selectDataSeviceByRoleIdUrl + '?id=' + id,
            //url: '../data/tree.json',
            dataType: 'json',
            success: function (data) {
                if (data != null && data.code == 0 && data.data != null && data.data.list != null) {
                    // 渲染时传入渲染目标id，树形结构数据（具体结构看样例，checked表示默认选中），以及input表单的名字
                    var trees = authtree.listConvert(data.data.list, {
                        primaryKey: 'id'
                        , startPid: 0
                        , parentKey: 'isdelete'
                        , nameKey: 'servicesName'
                        , valueKey: 'id'
                        , checkedKey: data.data.checkedId
                    });

                    authtree.render('#authTreeData', trees, {
                        inputname: 'authids[]',
                        layfilter: 'lay-check-auth-data',
                        autowidth: true,
                    });
                    authtree.closeAll('#authTreeData');
                }
            }
        });
    }

    var checkednodeData = null;
    var allData = null;
    var notcheckedData = null;
    authtree.on('change(lay-check-auth-data)', function (data) {
        //console.log('监听 authtree 触发事件数据', data);
        // 获取所有节点
        allData = authtree.getAll('#authTreeData');
        //console.log('all', all);
        // 获取所有已选中节点
        checkednodeData = authtree.getChecked('#authTreeData');
        //console.log('checked', checked);
        // 获取所有未选中节点
        notcheckedData = authtree.getNotChecked('#authTreeData');
        //console.log('notchecked', notchecked);
        // 获取选中的叶子节点
        var leaf = authtree.getLeaf('#authTreeData');
        //console.log(leaf);
        // 获取最新选中
        var lastChecked = authtree.getLastChecked('#authTreeData');
        //console.log('lastChecked', lastChecked);
        // 获取最新取消
        var lastNotChecked = authtree.getLastNotChecked('#authTreeData');
        //console.log('lastNotChecked', lastNotChecked);
    });

    function loadDataPermissionTree(systemId) {
        $.ajax({
            url: selectDataAuthByRoleidUrl + '?id=' + id,
            //url: '../data/tree.json',
            dataType: 'json',
            success: function (data) {
                if (data != null && data.code == 0 && data.data != null && data.data.list != null) {
                    // 渲染时传入渲染目标id，树形结构数据（具体结构看样例，checked表示默认选中），以及input表单的名字
                    var trees = authtree.listConvert(data.data.list, {
                        primaryKey: 'id'
                        , startPid: 0
                        , parentKey: 'pid'
                        , nameKey: 'dataName'
                        , valueKey: 'id'
                        , checkedKey: data.data.checkedId
                    });

                    authtree.render('#authTreeDataPer', trees, {
                        inputname: 'authids[]',
                        layfilter: 'lay-check-auth-data-per',
                        autowidth: true,
                    });
                    authtree.closeAll('#authTreeDataPer');
                }
            }
        });
    }

    function loadPermissionTree(systemId) {
        $.ajax({
            url: selectPermissionByRoleidUrl + '?id=' + id,
            //url: '../data/tree.json',
            dataType: 'json',
            success: function (data) {
                if (data != null && data.code == 0 && data.data != null && data.data.list != null) {
                    // 渲染时传入渲染目标id，树形结构数据（具体结构看样例，checked表示默认选中），以及input表单的名字
                    var trees = authtree.listConvert(data.data.list, {
                        primaryKey: 'id'
                        , startPid: 0
                        , parentKey: 'parentid'
                        , nameKey: 'name'
                        , valueKey: 'id'
                        , checkedKey: data.data.checkedId
                    });
                    authtree.render('#authTree', trees, {
                        inputname: 'authids[]',
                        layfilter: 'lay-check-auth',
                        autowidth: true,
                    });
                    authtree.closeAll('#authTree');
                }
            }
        });
    }

    form.verify({
        birthdayVerify: [/^((((1[6-9]|[2-9]\d)\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29-))(\s(([01]\d{1})|(2[0123])):([0-5]\d):([0-5]\d))?$/, '日期格式不正确']
    });
    var checkednode = null;
    var all = null;
    var notchecked = null;
    var checkednodeDataPer = null;
    var allDataPer = null;
    var notcheckedDataPer = null;
    authtree.on('change(lay-check-auth-data-per)', function (data) {
        //console.log('监听 authtree 触发事件数据', data);
        // 获取所有节点
        allDataPer = authtree.getAll('#authTreeDataPer');
        //console.log('all', all);
        // 获取所有已选中节点
        checkednodeDataPer = authtree.getChecked('#authTreeDataPer');
        //console.log('checked', checked);
        // 获取所有未选中节点
        notcheckedDataPer = authtree.getNotChecked('#authTreeDataPer');
        //console.log('notchecked', notchecked);
        // 获取选中的叶子节点
        var leaf = authtree.getLeaf('#authTreeDataPer');
        //console.log(leaf);
        // 获取最新选中
        var lastChecked = authtree.getLastChecked('#authTreeDataPer');
        //console.log('lastChecked', lastChecked);
        // 获取最新取消
        var lastNotChecked = authtree.getLastNotChecked('#authTreeDataPer');
        //console.log('lastNotChecked', lastNotChecked);
    });


    authtree.on('change(lay-check-auth)', function (data) {
        //console.log('监听 authtree 触发事件数据', data);
        // 获取所有节点
        all = authtree.getAll('#authTree');
        //console.log('all', all);
        // 获取所有已选中节点
        checkednode = authtree.getChecked('#authTree');
        //console.log('checked', checked);
        // 获取所有未选中节点
        notchecked = authtree.getNotChecked('#authTree');
        //console.log('notchecked', notchecked);
        // 获取选中的叶子节点
        var leaf = authtree.getLeaf('#authTree');
        //console.log(leaf);
        // 获取最新选中
        var lastChecked = authtree.getLastChecked('#authTree');
        //console.log('lastChecked', lastChecked);
        // 获取最新取消
        var lastNotChecked = authtree.getLastNotChecked('#authTree');
        //console.log('lastNotChecked', lastNotChecked);
    });


    form.on('submit(auth)', function (data) {
        setTimeout(function () {
            data.field = {};
            var resSaveLoading = top.layer.msg('数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});
            if (all != null && notchecked != null && checkednode != null) {
                data.field.rightinfo = checkednode.join(',');
            }
            if (allDataPer != null && notcheckedDataPer != null && checkednodeDataPer != null) {
                data.field.datainfo = checkednodeDataPer.join(',');
            }
            if (allData != null && notcheckedData != null && checkednodeData != null) {
                data.field.datainfoerwei = checkednodeData.join(',');
            }

            data.field.Updateuserid = getUserId();
            data.field.Updateip = getIp();
            data.field.id = id;


            $.ajax({
                url: UpdateRoleAuthUrl,
                type: 'post',
                data: JSON.stringify(data.field),
                contentType: "application/json;charset=UTF-8",
                dataType: "json",
                async: false,
                success: function (json) {
                    top.layer.close(resSaveLoading);
                    if (json != null) {
                        if (json.code == 0) {
                            layer.msg("更新成功！", {icon: 6, time: 1000, anim: 4}, function () {
                                parent.layer.close(parent.layer.getFrameIndex(window.name));
                            });
                        } else {
                            layer.msg(json.msg, {
                                icon: 7
                            });
                        }
                    }
                }, error: function (data) {
                    top.layer.close(resSaveLoading);
                    layer.msg('网络请求异常', {
                        icon: 7
                    });

                }
            });
        }, 500);
        return false;
    });
})