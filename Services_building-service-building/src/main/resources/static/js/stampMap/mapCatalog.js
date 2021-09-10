var layerManagement = null;

function getEarthObj(earthObj) {
    var earth = earthObj;
    if (earth) {
        layerManagement = earth.LayerManagement;
        layerManagement.earth = earth;
        if (layerManagement) {
            InitTree();
        }
    } else {
        alert("为获取到地图控件,请联系管理员！");
    }
}

/**
 * 功能：图层树节点 checkbox / radio 被勾选或取消勾选的事件
 * 参数：event-标准的 js event 对象；
 *       treeId-对应图层树的Id；
 *       node-被勾选或取消的节点
 * 返回值：无
 */
var layerTreeCheck = function (event, treeId, treeNode) {
    if (treeNode && treeNode.id) {
        layerManagement.layerTreeCheck(treeNode);
    }
}
/**
 * 功能：双击图层列表
 * 参数：earth,节点
 * 返回值：无
 */
var layerTreeDbClick = function (event, treeId, treeNode) {
    if (treeNode && treeNode.id) {
        layerManagement.layerTreeDbClick(layerManagement.earth, treeNode);
    }
}
/**
 * 功能：单击图层列表
 * 参数：
 * 返回值：无
 */
var onClick = function (event, treeId, treeNode) {
    if (treeNode && treeNode.id) {
        layerManagement.onClick(layerManagement.earth, treeNode);
    }
}

function setFontCss(treeId, treeNode) {
    return {color: "fff"};
};
var setting = {
    view: {
        fontCss: setFontCss
    }
};

function InitTree() {
    var setting = {
        view: {
            selectedMulti: true, //设置是否能够同时选中多个节点
            showIcon: true,  //设置是否显示节点图标
            showLine: true,  //设置是否显示节点与节点之间的连线
            showTitle: true,  //设置是否显示节点的title提示信息
        },
        data: {
            simpleData: {
                enable: false, //设置是否启用简单数据格式（zTree支持标准数据格式跟简单数据格式，上面例子中是标准数据格式）
            },
            key: {
                checked: "checked",
                children: "children"
            },
        },
        check: {
            enable: true   //设置是否显示checkbox复选框
        },
        callback: {
            onClick: onClick,    //定义节点单击事件回调函数
            //onRightClick: OnRightClick, //定义节点右键单击事件回调函数
            //beforeRename: beforeRename, //定义节点重新编辑成功前回调函数，一般用于节点编辑时判断输入的节点名称是否合法
            onDblClick: layerTreeDbClick,  //定义节点双击事件回调函数
            onCheck: layerTreeCheck    //定义节点复选框选中或取消选中事件的回调函数
        },
        view: {
            fontCss: setFontCss
        }

    };
    layerManagement.layerListData = layerManagement.createLayerTreeData(null);
    if (layerManagement.layerListData.length > 0) {
        $.fn.zTree.init($("#busTree"), setting, layerManagement.layerListData); //加载数据
    }

}