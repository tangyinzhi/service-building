var selection; //申明range 对象
if (window.getSelection) {　　 //主流的浏览器，包括mozilla，chrome，safari
    selection = window.getSelection();
} else if (document.selection) {
    selection = document.selection.createRange(); //IE浏览器下的处理，如果要获取内容，需要在selection 对象上加上text 属性
}
define(["vue", "../frame/statusbar", "../frame/titlebar", "../util/infowindow", "../util/xbsjelectron", "../util/xbsjutil", "../tool/tool", "../tool/measure", "../config/config", "bootstrap",
        "../module/map3d_cesium", "../3dplugin/mousepos", "../3dplugin/mouseeditor", "../3dplugin/stylewindow", "./featureview", "./firstperson",
        "jstree", "zTree", "range", "sliderUi"
    ],
    function (vue, statusbar, titlebar, infowindow, xe, util, tool, measure, MapConfig, bs, map3d, mousepos, mouseeditor, stylewindow, fv, fp, jstree, zTree, range, sliderUi) {

        var defaultitem = {
            title: '',
            path: ""
        };

        var datas = [];

        var vm = new vue({
            el: '#app',
            data: function () {
                return {
                    url: '',
                    code: '',
                    location: {
                        longitude: 105.416446,
                        latitude: 28.913715,
                        height: 0
                    },
                    heading: 28.5,
                    scale: 1,
                    range: 500,
                    iseidting: false,
                    terrainwireframe: false,
                    depthtest: false,
                    wireframe: false,
                    boundbox: false,
                    gterrain: false,
                    gmouseover: true,
                    gfirstperson: false,
                    hasSceneTree: false
                    // sceneTree: null
                };
            },
            datas: [],
            components: {
                statusbar: statusbar,
                titlebar: titlebar,
                infowindow: infowindow,
                map3d: map3d,
                mousepos: mousepos,
                stylewindow: stylewindow,
                tool: tool,
                measure: measure
            },
            created: function () {

            },
            mounted: function () {
                Cesium.Ion.defaultAccessToken ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0NzAwYjkxMy0zYzhiLTQ3NDctODZiOC0xYTQwZDhmZWYyZDYiLCJpZCI6MTI4OTIsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NjIxMjI3OTB9.-RGSdxiFzYk6TWLnO2YU04DvxUfs7Wg_vK724hz8or8";
                this.viewer = this.$refs.map3d.viewer;

                var viwer = this.viewer;
                viewer.scene.globe.depthTestAgainstTerrain = true;
                var rectangle = new Cesium.Rectangle(Cesium.Math.toRadians(105.388084), Cesium.Math.toRadians(28.883219),
                    Cesium.Math.toRadians(105.47023), Cesium.Math.toRadians(28.943777));
                var datatileset = new Cesium.Cesium3DTileset({
                    url: "http://192.168.30.55:9002/api/folder/52cfb98e79d04ffa9b26ba10c6731011" + "/tileset.json",
                    classificationType: Cesium.ClassificationType.CESIUM_3D_TILE
                });

                //请求这个tileset.json ，从中提取位置
                var self = this;

                fv.install(this.viewer);

                //fp.install(viewer);

                //如果有 debug 参数
                var debug = util.getUrlParam('debug');

                if (debug)
                    viewer.extend(Cesium.viewerCesium3DTilesInspectorMixin);

                self.loadLayers(MapConfig.Layers);

                this.viewer.camera.flyTo({
                    destination: Cesium.Cartesian3.fromDegrees(105.40848, 28.87981, 730.67),
                    orientation: {
                        heading: Cesium.Math.toRadians(7.7), // east, default value is 0.0 (north)
                        pitch: Cesium.Math.toRadians(-17.85373143216941), // default value (looking down)
                        roll: 0.02276885041442306 // default value
                    }

                });
                //this.viewer.scene.globe.enableLighting = true;

            },
            computed: {

                iselectron: function () {

                    return window.nodeRequire != undefined;
                },

            },
            methods: {
                resetStyle: function () {
                    if (this.tileset) {
                        this.tileset.style = undefined;
                    }
                },
                locateNode: function (nodeid, nodesphere) {

                    if (nodesphere[3] <= 0)
                        return;
                    //飞行过去
                    console.log(nodesphere);
                    var center = new Cesium.Cartesian3(nodesphere[0], nodesphere[1], nodesphere[2]);

                    if (this.orginMatrixInverse && this.tileset._root.transform) {

                        var mat = Cesium.Matrix4.multiply(this.tileset._root.transform, this.orginMatrixInverse, new Cesium.Matrix4());

                        center = Cesium.Matrix4.multiplyByPoint(mat, center, new Cesium.Cartesian3());

                    }

                    var sphere = new Cesium.BoundingSphere(center, nodesphere[3]);

                    this.viewer.camera.flyToBoundingSphere(sphere, {
                        duration: 0.5
                    });
                    //设置tileset的样式

                    if (this.tileset) {
                        this.tileset.style = new Cesium.Cesium3DTileStyle({
                            color: {
                                conditions: [
                                    ["${id} ==='" + nodeid + "'", "rgb(255, 255, 255)"],
                                    ["true", "rgba(255, 200, 200,0.2)"]
                                ]
                            }
                        });
                    }
                },
                initSceneTreeData: function (scene, layerId) { //初始化bim图层的子节点
                    var self = this;
                    var data = [];

                    function name2text(o) {
                        o.layerId = layerId;
                        o.text = o.name;

                        //这块为了避免tree控件里的id不统一，所以加改变一下
                        o.eleid = o.id;
                        o.id = undefined;
                        o.checked = true;
                        if ((!o.text || o.text.trim() == "") && o.type)
                            o.text = o.type;

                        if (o.children) {
                            for (var i = 0; i < o.children.length; i++) {
                                name2text(o.children[i]);
                            }
                        }
                    }

                    if (Cesium.defined(scene.scenes)) {
                        for (var i = 0; i < scene.scenes.length; i++) {
                            var node = scene.scenes[i];
                            name2text(node);
                            data.push(node);
                        }
                    } else {
                        name2text(scene);
                        data.push(scene);
                    }
                    return data;
                },
                initSceneTree: function (scene) {
                    var self = this;

                    var data = [];

                    function name2text(o) {
                        o.text = o.name;

                        //这块为了避免tree控件里的id不统一，所以加改变一下
                        o.eleid = o.id;
                        o.id = undefined;
                        o.checked = true;
                        if ((!o.text || o.text.trim() == "") && o.type)
                            o.text = o.type;

                        if (o.children) {
                            for (var i = 0; i < o.children.length; i++) {
                                name2text(o.children[i]);
                            }
                        }
                    }

                    if (Cesium.defined(scene.scenes)) {
                        for (var i = 0; i < scene.scenes.length; i++) {
                            var node = scene.scenes[i];
                            name2text(node);
                            data.push(node);
                        }
                    } else {
                        name2text(scene);
                        data.push(scene);
                    }
                    var setting = {
                        view: {
                            dblClickExpand: true,
                            selectedMulti: true, //可以多选
                            showLine: true
                        },
                        check: {
                            enable: true, //显示复选框
                            chkStyle: "checkbox"
                        },
                        callback: {
                            onClick: self.zTreeOnClick,
                            onCheck: self.zTreeOnCheck
                        }
                    };
                    $.fn.zTree.init($("#sceneTree"), setting, data);

                    this.sceneTree = $('#sceneTree');
                    this.hasSceneTree = true;
                },
                initZTree: function (data) { //初始化树
                    var self = this;

                    var setting = {
                        view: {
                            //addDiyDom: self.addOpacityRangeDom,
                            dblClickExpand: true,
                            selectedMulti: true, //可以多选
                            showLine: true
                        },
                        check: {
                            enable: true, //显示复选框
                            chkStyle: "checkbox"
                        },
                        callback: {
                            onClick: self.zTreeOnClick,
                            onCheck: self.zTreeOnCheck
                        }
                    };
                    var treeObj = $.fn.zTree.init($("#sceneTree"), setting, data);
                    self.fillter(treeObj);
                    this.sceneTree = $('#sceneTree');
                    this.hasSceneTree = true;
                    //}
                },
                fillter: function (treeObj) {
                    //获得树形图对象
                    var nodeList = treeObj.getNodes();　　　　　　 //展开第一个根节点
                    for (var i = 0; i < nodeList.length; i++) { //设置节点展开第二级节点
                        treeObj.expandNode(nodeList[i], true, false, true);
                        var nodespan = nodeList[i].children;
                        for (var j = 0; j < nodespan.length; j++) { //设置节点展开第三级节点
                            treeObj.expandNode(nodespan[j], true, false, true);
                        }
                    }
                },

                zTreeOnClick: function (event, treeId, treeNode) { //树点击事件
                    var node = treeNode;
                    if (node && node.type != undefined && node.type != null && node.layerurl != undefined & node.layerurl != null) {
                        if (this.layer3DList != undefined && this.layer3DList != null && this.layer3DList["" + node.id] != undefined && this.layer3DList["" + node.id].layer != null) {
                            var layer = this.layer3DList["" + node.id].layer;
                            this.viewer.zoomTo(layer);
                        }
                    }
                    //scene.primitives.remove(tileset);

                    if (node && node.sphere) {
                        nodeid = node.eleid;
                        var nodesphere = node.sphere;
                        if (nodesphere == null || nodesphere.length < 3 || nodesphere[3] <= 0)
                            return;
                        var center = new Cesium.Cartesian3(nodesphere[0], nodesphere[1], nodesphere[2]);

                        if (this.orginMatrixInverse && this.tileset._root.transform) {

                            var mat = Cesium.Matrix4.multiply(this.tileset._root.transform, this.orginMatrixInverse, new Cesium.Matrix4());

                            center = Cesium.Matrix4.multiplyByPoint(mat, center, new Cesium.Cartesian3());

                        }
                        var sphere = new Cesium.BoundingSphere(center, nodesphere[3]);

                        this.viewer.camera.flyToBoundingSphere(sphere, {
                            duration: 0.5
                        });
                        //设置tileset的样式

                        if (this.tileset) {
                            this.tileset.style = new Cesium.Cesium3DTileStyle({
                                color: {
                                    conditions: [
                                        ["${id} ==='" + nodeid + "'", "rgb(255, 0, 0)"],
                                        ["true", "rgba(255, 200, 200,0.2)"]
                                    ]
                                }
                            });
                        }
                        //scene.primitives.add(tileset);
                    }
                },
                layerChildrenCheck: function (Children) { //树选中/不选中事件(父节点影响的子节点)
                    if (Children != undefined || Children != null) {
                        for (var i = 0; i < Children.length; i++) {
                            var node = Children[i];
                            if(node.isDx){
                                if(this.viewer != null &&node.layerurl!=undefined&&node.layerurl!=null) {
                                    if (node.checked) { //勾选状态下,显示地图控件
                                        this.terrainProvider = new Cesium.CesiumTerrainProvider({
                                            url: node.layerurl,
                                            requestWaterMask: true
                                        });
                                    } else {
                                        this.terrainProvider = new Cesium.EllipsoidTerrainProvider({});
                                    }
                                    this.viewer.scene.terrainProvider = this.terrainProvider;
                                }
                                continue;
                            }
                            if (node.type != undefined && node.type != null && node.layerurl != undefined & node.layerurl != null) {
                                if (this.layer3DList == undefined || this.layer3DList == null || this.layer3DList["" + node.id] == undefined || this.layer3DList["" + node.id].layer == null) {
                                    this.loadServerTypeMap(node.id, node.type, node.layerurl, node.layerid, node.proxyUrl, node.IsWebMercatorTilingScheme, node.params, node.ishide);
                                    this.addOpacityRangeDom(node.id, node);
                                    continue;
                                }
                                var layer = this.layer3DList["" + node.id];
                                if (layer != undefined && layer != null) {
                                    this.tileset = layer.layer;
                                    if (this.tileset != undefined || this.tileset != null) {
                                        if (node.checked) { //勾选状态下,显示地图控件
                                            this.tileset.show = true;
                                        } else {
                                            this.tileset.show = false;
                                            if (node.alpha) {
                                                node.alpha = 1;
                                            }
                                        }
                                    }
                                }
                                this.addOpacityRangeDom(node.id, node);

                            } else if (node.children) {
                                this.layerChildrenCheck(node.children);
                            }
                        }

                    }
                },
                zTreeOnCheck: function (event, treeId, treeNode) { //树选中/不选中事件
                    //this.viewer.scene.primitives.remove(this.tileset);
                    var zTreeON = $.fn.zTree.getZTreeObj("sceneTree");
                    var ztreenodes = zTreeON.getCheckedNodes(false);
                    var checked = null;
                    var strJson = [];
                    var ids = [];
                    this.treeNode = treeNode;
                    if (treeNode.type == undefined || treeNode.type == null || typeof(treeNode.type) == "number") {
                        var ztreeChangenodes = zTreeON.getChangeCheckedNodes(true);

                        if (treeNode.children) {
                            if (treeNode.type != undefined && treeNode.type != null&&treeNode.isDx==undefined) {
                                if (this.layer3DList == undefined || this.layer3DList == null) {
                                    this.loadServerTypeMap(treeNode.id, treeNode.type, treeNode.layerurl, treeNode.layerid, treeNode.proxyUrl, treeNode.IsWebMercatorTilingScheme, treeNode.params, treeNode.ishide);
                                    this.addOpacityRangeDom(treeNode.id, treeNode);
                                    return;
                                }
                                var layer = this.layer3DList["" + treeNode.id];
                                if (layer == undefined || layer == null) {
                                    if (treeNode.checked) { //勾选状态下,显示地图控件
                                        this.loadServerTypeMap(treeNode.id, treeNode.type, treeNode.layerurl, treeNode.layerid, treeNode.proxyUrl, treeNode.IsWebMercatorTilingScheme, treeNode.params, treeNode.ishide);
                                    } else {
                                    }
                                } else { //去掉勾选框,隐藏地图控件
                                    var layer = this.layer3DList["" + treeNode.id];
                                    if (layer != undefined && layer != null) {
                                        this.tileset = layer.layer;
                                        if (this.tileset != undefined || this.tileset != null) {
                                            if (treeNode.checked) { //勾选状态下,显示地图控件
                                                this.tileset.show = true;
                                            } else {
                                                this.tileset.show = false;
                                                if (treeNode.alpha) {
                                                    treeNode.alpha = 1;

                                                }
                                            }
                                        }
                                    }
                                }
                                this.addOpacityRangeDom(treeNode.id, treeNode);
                            } else {
                                this.layerChildrenCheck(treeNode.children);
                            }

                        } else {
                            var node = treeNode;
                            if(node.isDx){
                                if(this.viewer != null &&node.layerurl!=undefined&&node.layerurl!=null) {
                                    if (node.checked) { //勾选状态下,显示地图控件
                                        this.terrainProvider = new Cesium.CesiumTerrainProvider({
                                            url: node.layerurl,
                                            requestWaterMask: true
                                        });
                                    } else {
                                        this.terrainProvider = new Cesium.EllipsoidTerrainProvider({});
                                    }
                                    this.viewer.scene.terrainProvider = this.terrainProvider;
                                }
                                return;
                            }
                            if (this.layer3DList == undefined || this.layer3DList == null || this.layer3DList["" + node.id] == undefined || this.layer3DList["" + node.id] == null) {
                                this.loadServerTypeMap(node.id, node.type, node.layerurl, node.layerid, node.proxyUrl, node.IsWebMercatorTilingScheme, node.params, node.ishide);

                            } else {

                                var layer = this.layer3DList["" + node.id];
                                this.tileset = layer.layer;
                                if (this.tileset != undefined || this.tileset != null) {
                                    if (node.checked) { //勾选状态下,显示地图控件
                                        this.tileset.show = true;
                                    } else {
                                        this.tileset.show = false;
                                        if (node.alpha) {
                                            node.alpha = 1;
                                        }
                                    }
                                }
                            }
                            this.addOpacityRangeDom(node.id, node);
                        }
                        return;
                    }
                    var node = this.getPrantNode(treeNode);
                    this.treeNode = node;
                    if (this.layer3DList == undefined || this.layer3DList == null || this.layer3DList["" + treeNode.layerId] == undefined || this.layer3DList["" + treeNode.layerId] == null) {
                        if (node.type != undefined && node.type != null && node.type == 8) {
                            this.loadServerTypeMap(node.id, node.type, node.layerurl, node.layerid, node.proxyUrl, node.IsWebMercatorTilingScheme, node.params, node.isHide);
                            this.addOpacityRangeDom(node.id, node);
                        }

                    } else {
                        var layer = this.layer3DList["" + treeNode.layerId];
                        if (layer == undefined || layer == null) {
                            return;
                        }

                        this.tileset = layer.layer;
                        if (node.alpha) {
                            this.udpateLayerOpacity(this.tileset, node.alpha, 8);
                        } else {
                            this.udpateLayerOpacity(this.tileset, 1, 8);
                        }
                    }
                },
                style: function () {
                    this.$refs.stylewindow.show(this.tileset);
                },
                getPrantNode: function (chrNode) { //获取拥有url属性的父节点(不一定是直接父节点也可能是父节点的父节点,以此类推)
                    var prantNode = chrNode.getParentNode();
                    if (prantNode.type != undefined && prantNode.type != null && prantNode.type == 8) {
                        return prantNode;
                    }
                    return this.getPrantNode(prantNode);
                },
                udpateLayerOpacity: function (layer, Opacity, type) { //更新透明度
                    var no = 1;
                    if (Opacity) {
                        no = Opacity;
                    }
                    if (Opacity == 0) {
                        no = 0.01;
                    }
                    if (layer == undefined || layer == null) {
                        return;
                    }
                    if (type == undefined || type != 8) {
                        layer.alpha = no;
                        return;
                    }
                    var zTreeON = $.fn.zTree.getZTreeObj("sceneTree");
                    if(zTreeON==undefined||zTreeON==null){
                        return;
                    }
                    var ztreenodes = zTreeON.getCheckedNodes(false);
                    var ids = [];
                    for (var index in ztreenodes) {
                        var node = ztreenodes[index];
                        var nodeid = node.eleid;

                        if (node && node.sphere) {

                            var nodesphere = node.sphere;
                            if (nodesphere == null || nodesphere.length < 3 || nodesphere[3] <= 0)
                                continue;

                            ids.push(nodeid);
                        }
                    }
                    this.tileset = layer;
                    //设置tileset的样式
                    if (this.tileset) {

                        if (this.treeNode != undefined && this.treeNode != null) {
                            if (this.treeNode.layerurl == undefined) {
                                return;
                            }
                            if (this.treeNode.children == undefined) {
                                this.tileset.style = new Cesium.Cesium3DTileStyle({
                                    color: "color() *vec4(1,1,1," + no + ")"
                                });
                                return;
                            }
                            this.tileset.style = new Cesium.Cesium3DTileStyle({
                                color: {
                                    evaluateColor: function (feature, result) {
                                        var color = new Cesium.Color(1, 1, 1, 0);
                                        if (feature == null || feature == undefined) {
                                            color = new Cesium.Color(1, 1, 1, no);
                                            return Cesium.Color.clone(color, result);
                                        }
                                        var id = feature.getProperty("id");

                                        if (!id) {
                                            id = "";
                                        }
                                        //var newId = getId(id);
                                        //var  color = new Cesium.Color(1, 1, 1, 0);
                                        if (ids == null || ids.length < 1) {
                                            color = new Cesium.Color(1, 1, 1, no);
                                            return Cesium.Color.clone(color, result);
                                        }
                                        if (ids.indexOf(id) <= -1) {
                                            color = new Cesium.Color(1, 1, 1, no);
                                            return Cesium.Color.clone(color, result);
                                        } else {
                                            //var color = new Cesium.Color(1, 1, 1, 0);
                                            return color;
                                        }
                                    }
                                }
                            });
                        }
                    }
                },
                addOpacityRangeDom: function (treeId, treeNode) { //添加滑块控制透明
                    if (treeNode.type != undefined && treeNode.type != null && typeof(treeNode.type) == "number") {
                        if (this.layer3DList == undefined || this.layer3DList == null) {
                            this.loadServerTypeMap(treeNode.id, treeNode.type, treeNode.layerurl, treeNode.layerid, treeNode.proxyUrl, treeNode.IsWebMercatorTilingScheme, treeNode.params, treeNode.isHide);
                            return;
                        }
                        var layer = this.layer3DList["" + treeNode.id];
                        if (layer == undefined || layer == null) {
                            return;
                        }

                        this.tileset = layer.layer;
                        if (treeNode != null && treeNode.isHistory != undefined && treeNode.isHistory != null && treeNode.isHistory) {
                            if (treeNode.checked) {
                                this.historyTileset = layer.layer;
                            } else {
                                this.historyTileset = null;
                            }
                        }
                        if (treeNode.ishide != undefined && treeNode.ishide != null && treeNode.ishide) {
                            this.tileset.style = new Cesium.Cesium3DTileStyle({
                                color: 'rgba(1, 0, 0, 0.005)'
                            });
                            return;
                        }
                        var r = $("#" + treeNode.tId);
                        if ($("#" + treeNode.tId + "_range") == undefined || $("#" + treeNode.tId + "_range") == null || $("#" + treeNode.tId + "_range").html() == undefined) {
                            //a = '<input id="' + treeNode.tId + '_range" type="range" style="width: 50px;" />';

                            a = "<div id='" + treeNode.tId + "_range'  style = 'width:50px;margin:-16px 10px 3px 180px'></div>";
                            ;

                            r.append(a);

                        } else {
                            $("#" + treeNode.tId + "_range").show();
                        }
                        var self = this;
                        var zTreeON = $.fn.zTree.getZTreeObj("sceneTree");
                        if (treeNode.checked) {
                            if (treeNode.type != undefined && treeNode.layerurl != undefined && treeNode.type != null && treeNode.layerurl != null && treeNode.type == "8" && (treeNode.children == undefined || treeNode.children == null)) {

                                $.ajax({
                                    url: treeNode.layerurl + '/scenetree.json',
                                    dataType: 'json',
                                    async: false,
                                    data: {
                                        x: new Date()
                                    },
                                    success: function (data) {

                                        var children = self.initSceneTreeData(data, treeNode.id);
                                        zTreeON.addNodes(treeNode, children);
                                    },
                                    error: function () {

                                    }
                                });

                            }
                        } else {
                            zTreeON.removeChildNodes(treeNode);
                            treeNode.children = null;
                        }

                        this.udpateLayerOpacity(layer.layer, treeNode.alpha, treeNode.type);
                        treeNode.checked || $("#" + treeNode.tId + "_range").hide(),
                            $("#" + treeNode.tId + "_range").slider({
                                range: "min",
                                value: 100,
                                min: 0,
                                max: 100,
                                slide: function (event, ui) {
                                    var num = ui.value / 100;
                                    var evalue = ui.value;
                                    var t = evalue / 100;
                                    r = layer.layer;
                                    this.treeNode = treeNode;
                                    if (r != undefined && r != null) {
                                        if (treeNode.type == "8") {

                                            self.udpateLayerOpacity(r, t, 8);
                                        } else {
                                            r.alpha = t;
                                        }

                                        if (treeNode.alpha) {
                                            treeNode.alpha = t;
                                        }
                                    }

                                }
                            });

                    }
                },
                c_firstperson: function () {
                    this.gfirstperson = !this.gfirstperson;

                    if (this.gfirstperson)
                        fp.install(this.viewer);
                    else
                        fp.uninstall(this.viewer);
                },
                c_mouseover: function () {
                    this.gmouseover = !this.gmouseover;

                    fv.setMouseOver(this.gmouseover);
                },
                c_terrain: function () {
                    this.gterrain = !this.gterrain;
                    if (this.gterrain) {
                        if (!this.terrainProvider) {

                            this.terrainProvider = Cesium.createWorldTerrain({
                                requestVertexNormals: true
                            });

                            /*
					           this.terrainProvider = new Cesium.CesiumTerrainProvider({
					               url: 'http://localhost:9002/api/wmts/terrain/db72ee995f0048dcb002a4a647193a13',
					           }); */

                            /* this.terrainProvider = new Cesium.CesiumTerrainProvider({
                                 url: "https://www.supermapol.com/iserver/services/3D-stk_terrain/rest/realspace/datas/info/data/path/"
                             });*/
                        }

                        this.viewer.terrainProvider = this.terrainProvider;
                    } else {
                        this.viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
                    }
                },
                c_boundbox: function () {
                    this.boundbox = !this.boundbox;

                    this.tileset.debugShowBoundingVolume = this.boundbox;
                },
                c_terrainwireframe: function () {
                    this.terrainwireframe = !this.terrainwireframe;
                    var map = this.$refs.map3d;
                    map.wireframe = this.terrainwireframe;
                },
                c_wireframe: function () {
                    this.wireframe = !this.wireframe;
                    this.tileset.debugWireframe = this.wireframe;
                },
                c_depthtest: function () {
                    this.depthtest = !this.depthtest;
                    var map = this.$refs.map3d;
                    map.depthtest = this.depthtest;

                },
                c_edit: function () {
                    if (!this.editor)
                        return;
                    this.iseidting = !this.iseidting;
                    this.editor.setEnable(this.iseidting);

                },
                c_show: function () {
                    if (this.tileset)
                        this.tileset.show = !this.tileset.show;
                },
                initEditor: function () {

                    var self = this;
                    this.editor = mouseeditor.newEditor({
                        viewer: this.viewer,
                        position: Cesium.Cartesian3.fromDegrees(this.location.longitude, this.location.latitude, this.location.height),
                        heading: Cesium.Math.toRadians(this.heading),
                        range: this.range,
                        onPosition: function (pos) {
                            //console.log(pos);

                            self.tileset._root.transform = self.editor.modelMatrix();

                            var wpos = Cesium.Cartographic.fromCartesian(pos);

                            self.location.longitude = Cesium.Math.toDegrees(wpos.longitude);
                            self.location.latitude = Cesium.Math.toDegrees(wpos.latitude);
                            self.location.height = wpos.height;

                        },
                        onHeading: function (heading) {
                            //console.log(heading);

                            self.tileset._root.transform = self.editor.modelMatrix();

                            self.heading = Cesium.Math.toDegrees(heading);
                        }
                    });
                },
                inputPos: function (locationA) {
                    if (!this.editor)
                        return false;

                    this.location.longitude = parseFloat(this.location.longitude);
                    this.location.latitude = parseFloat(this.location.latitude);
                    this.location.height = parseFloat(this.location.height);

                    this.heading = parseFloat(this.heading);

                    if (locationA) {

                        this.location.longitude = parseFloat(locationA.longitude);
                        this.location.latitude = parseFloat(locationA.latitude);
                        this.location.height = parseFloat(locationA.height);

                        this.heading = parseFloat(locationA.heading);
                    }

                    this.editor.setPosition(Cesium.Cartesian3.fromDegrees(this.location.longitude, this.location.latitude, this.location.height), Cesium.Math.toRadians(this.heading))

                    //this.tileset.modelMatrix = this.editor.modelMatrix();

                    if (!this.tileset)
                        return false;
                    this.tileset._root.transform = this.editor.modelMatrix();

                    return false;
                },
                inputapply: function () {

                    this.inputPos();
                    this.locate();
                },
                add3dtiles: function (loclurl, mymodelMatrix, ishide) {
                    this.tileset = new Cesium.Cesium3DTileset({
                        url: loclurl
                    });
                    if (ishide != undefined && ishide != null && ishide) {
                        this.tileset = new Cesium.Cesium3DTileset({
                            url: loclurl,
                            classificationType: Cesium.ClassificationType.CESIUM_3D_TILE
                        });
                    }
                    var self = this;
                    this.viewer.scene.primitives.add(this.tileset);

                    var infowindow = this.$refs.infowindow;

                    this.tileset.readyPromise.then(function (tileset) {

                        //获得模型的包围盒大小

                        self.range = tileset.boundingSphere.radius;

                        //如果tileset自带世界矩阵矩阵，那么计算放置的经纬度和heading

                        var mat = Cesium.Matrix4.fromArray(tileset._root.transform);

                        //原来的矩阵的逆
                        self.orginMatrixInverse = Cesium.Matrix4.inverse(mat, new Cesium.Matrix4());

                        var pos = Cesium.Matrix4.getTranslation(mat, new Cesium.Cartesian3());
                        var wpos = Cesium.Cartographic.fromCartesian(pos);
                        if (wpos) {
                            self.location.longitude = Cesium.Math.toDegrees(wpos.longitude);
                            self.location.latitude = Cesium.Math.toDegrees(wpos.latitude);
                            self.location.height = wpos.height;

                            //取旋转矩阵
                            var rotmat = Cesium.Matrix4.getRotation(mat, new Cesium.Matrix3());
                            //默认的旋转矩阵
                            var defrotmat = Cesium.Matrix4.getRotation(Cesium.Transforms.eastNorthUpToFixedFrame(pos), new Cesium.Matrix3());

                            //计算rotmat 的x轴，在defrotmat 上 旋转
                            var xaxis = Cesium.Matrix3.getColumn(defrotmat, 0, new Cesium.Cartesian3());
                            var yaxis = Cesium.Matrix3.getColumn(defrotmat, 1, new Cesium.Cartesian3());
                            var zaxis = Cesium.Matrix3.getColumn(defrotmat, 2, new Cesium.Cartesian3());

                            var dir = Cesium.Matrix3.getColumn(rotmat, 0, new Cesium.Cartesian3());

                            dir = Cesium.Cartesian3.cross(dir, zaxis, dir);
                            dir = Cesium.Cartesian3.cross(zaxis, dir, dir);
                            dir = Cesium.Cartesian3.normalize(dir, dir);

                            var heading = Cesium.Cartesian3.angleBetween(xaxis, dir);

                            var ay = Cesium.Cartesian3.angleBetween(yaxis, dir);

                            if (ay > Math.PI * 0.5) {
                                heading = 2 * Math.PI - heading;
                            }

                            this.heading = Cesium.Math.toDegrees(heading);

                            //self.initEditor();
                            //self.locate();

                        }

                        //如果tileset不带世界矩阵，那么更新
                        else {

                            //var longitude = 105.416446;
                            //var latitude = 28.913715;            //105.416446  28.913715
                            //var height = 0;
                            //var rotation = 28.5;   //rotation degrees
                            //var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(longitude, latitude, height));
                            //Cesium.Matrix4.multiplyByMatrix3(modelMatrix, Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(rotation)), modelMatrix);
                            //tileset.modelMatrix = modelMatrix;
                            //self.initEditor();
                            // self.inputPos();
                        }
                        if (mymodelMatrix) {
                            //平移、贴地、旋转模型
                            self.update3dtilesMaxtrix1(tileset, mymodelMatrix);
                        }

                    }).otherwise(function (err) {
                        infowindow.info("3dtiles加载失败:" + err);
                    });

                },
                update3dtilesMaxtrix1: function (tileset, params1) {
                    //旋转
                    var mx = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(params1.rx));
                    var my = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(params1.ry));
                    var mz = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(params1.rz));
                    var rotationX = Cesium.Matrix4.fromRotationTranslation(mx);
                    var rotationY = Cesium.Matrix4.fromRotationTranslation(my);
                    var rotationZ = Cesium.Matrix4.fromRotationTranslation(mz);

                    //平移
                    var position = Cesium.Cartesian3.fromDegrees(params1.tx, params1.ty, params1.tz);
                    var m = Cesium.Transforms.eastNorthUpToFixedFrame(position);

                    //旋转、平移矩形相乘
                    Cesium.Matrix4.multiply(m, rotationX, m);
                    Cesium.Matrix4.multiply(m, rotationY, m);
                    Cesium.Matrix4.multiply(m, rotationZ, m);

                    //赋值给tileset
                    tileset._root.transform = m;
                },
                copyurl: function () {
                    util.copy(this.url);
                },
                exit: function () {
                    window.location.href = '/server/folders.html';
                },
                locate: function () {

                    if (this.tileset != null && this.tileset.updateTransform != undefined && this.tileset["boundingSphere"] != undefined && this.tileset.boundingSphere != undefined && this.tileset.boundingSphere != null) {

                        this.viewer.camera.flyToBoundingSphere(this.tileset.boundingSphere);
                    } else {
                        this.viewer.camera.flyTo({
                            destination: Cesium.Cartesian3.fromDegrees(this.location.longitude, this.location.latitude, this.location.height + 1000)
                        });
                    }

                },
                showcode: function () {
                    var infowindow = this.$refs.infowindow;

                    var code = "\
					var longitude = {0};\r\n\
					var latitude = {1};\r\n\
					var height = {2};\r\n\
					var heading = {3};\r\n\
					var tileset = new Cesium.Cesium3DTileset({\r\n\
					    url: '{4}'\r\n\
					});\r\n\
					viewer.scene.primitives.add(tileset);\r\n\
					tileset.readyPromise.then(function(argument) {\r\n\
					    var position = Cesium.Cartesian3.fromDegrees(longitude, latitude, height);\r\n\
					    var mat = Cesium.Transforms.eastNorthUpToFixedFrame(position);\r\n\
					    var rotationX = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(heading)));\r\n\
					    Cesium.Matrix4.multiply(mat, rotationX, mat);\r\n\
					    tileset._root.transform = mat;\r\n\
					    viewer.camera.flyTo({destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, height + 1000)});\r\n\
					});"

                    code = code.format(this.location.longitude, this.location.latitude, this.location.height, this.heading, this.url);

                    infowindow.showcode(code);
                },
                sysbrowser: function () {
                    xe.sysbrowser(window.location.href);
                },
                toggleBoundbox: function () {

                },
                loadLayers: function (layers) {

                    for (var index in layers) {
                        var chChildren = layers[index];
                        if (chChildren != undefined && chChildren != null) {
                            this.loadchildren(chChildren);
                        }
                    }
                    this.initZTree(layers);
                    this.addTrueNodeOpacityRangeDom();
                },
                loadchildren: function (children) {//加载子节点
                    var self = this;
                    if (children != undefined && children != null) {
                        if (children.type != undefined && children.layerurl != undefined && children.type != null && children.layerurl != null) {
                            return;
                        }
                        if (children.children != undefined && children.children != null) {
                            for (var index in children.children) {
                                var chChildren = children.children[index];
                                if (chChildren != undefined && chChildren != null) {
                                    this.loadchildren(chChildren);
                                }
                            }
                        }
                    }
                },
                addTrueNodeOpacityRangeDom: function () {//初始化树后给选中的节点添加透明条
                    var zTreeON = $.fn.zTree.getZTreeObj("sceneTree");
                    if(zTreeON==undefined||zTreeON==null){
                        return;
                    }
                    var ztreenodes = zTreeON.getCheckedNodes(true);//获取选中的节点
                    var ids = [];
                    for (var index in ztreenodes) {
                        var node = ztreenodes[index];
                        if (node.type != undefined && node.layerurl != undefined && node.type != null && node.layerurl != null) {
                            if(node.checked!=undefined&&node.checked!=null&&node.checked&&node.isDx==undefined){
                                this.loadServerTypeMap(node.id, node.type, node.layerurl, node.layerid, node.proxyUrl, node.IsWebMercatorTilingScheme, node.params, node.isHide);
                                this.addOpacityRangeDom(node.id, node);

                            }
                        }
                    }

                },
                /**
                 * 加载不同类型地图服务的底图
                 @ id 图层的id标识
                 @ servertype 地图服务类型(0代表ArcGisMapServerImageryProvider;1代表createOpenStreetMapImageryProvider;
                 2代表WebMapTileServiceImageryProvider;3代表createTileMapServiceImageryProvider;
                 4 代表UrlTemplateImageryProvider;5 代表WebMapServiceImageryProviderr(WMS))
                 @ url 地图服务的url
                 @ layerid 地图图层的id
                 @ proxyUrl 代理请求url
                 @ tilingScheme 地图坐标系,WebMercatorTilingScheme(摩卡托投影坐标系3857);GeographicTilingScheme(世界地理坐标系4326)
                 */
                loadServerTypeMap: function (id, servertype, url, layerid, proxyUrl, IsWebMercatorTilingScheme, params, isHide) {
                    var layers = this.viewer.scene.imageryLayers;
                    if (this.layer3DList == undefined || this.layer3DList == null) {
                        this.layer3DList = {};
                    }
                    var layer = null;
                    switch (servertype) {
                        case 0: //ArcGisMapServerImageryProvider
                            var curlayer = layers.addImageryProvider(new Cesium.ArcGisMapServerImageryProvider({
                                //proxy: new Cesium.DefaultProxy(proxyUrl),
                                url: url
                            }));
                            layer = {
                                layer: curlayer,
                                id: id
                            };
                            break;
                        case 1: //OpenStreetMapImageryProvider
                            var curlayer = layers.addImageryProvider(Cesium.createOpenStreetMapImageryProvider({
                                url: url
                            }));
                            layer = {
                                layer: curlayer,
                                id: id
                            };
                            break;
                        case 2: //WebMapTileServiceImageryProvider
                            break;
                        case 3: //createTileMapServiceImageryProvider
                            break;
                        case 4: //UrlTemplateImageryProvider
                            break;
                        case 5: //WebMapServiceImageryProvider
                            var m_tilingScheme = new Cesium.GeographicTilingScheme();
                            if (IsWebMercatorTilingScheme) {
                                m_tilingScheme = new Cesium.WebMercatorTilingScheme();
                            }
                            var curlayer = layers.addImageryProvider(new Cesium.WebMapServiceImageryProvider({
                                url: url,
                                layers: layerid,
                                //tilingScheme:tilingScheme,
                                tilingScheme: m_tilingScheme,
                                parameters: {
                                    service: "WMS",
                                    version: "1.1.1",
                                    request: "GetMap",
                                    transparent: true,
                                    format: 'image/png'
                                },
                                show: false
                            }));
                            layer = {
                                layer: curlayer,
                                id: id
                            };
                            break;
                        case 6: //kml,kmz
                            var options = {
                                camera: cesium.cesiumViewer.scene.camera,
                                canvas: cesium.cesiumViewer.scene.canvas
                            };
                            cesium.cesiumViewer.dataSources.add(Cesium.KmlDataSource.load(url, options)).then(function (dataSource) {
                                cesium.cesiumViewer.camera.flyHome();
                            });
                            break;
                        case 7: //geoJson

                            cesium.cesiumViewer.dataSources.add(Cesium.GeoJsonDataSource.load(url)).then(function (dataSource) {
                                cesium.cesiumViewer.zoomTo(dataSource);
                            });
                            break;
                        case 8: //3dTiles
                            var urlJson = url + "/tileset.json";
                            if (params != undefined && params != null) {
                                this.add3dtiles(urlJson, params, isHide)
                            } else {
                                this.add3dtiles(urlJson, null, isHide);
                            }
                            layer = {
                                layer: this.tileset,
                                id: id
                            };
                            break;
                        default: //ArcGisMapServerImageryProvider
                            var curlayer = layers.addImageryProvider(new Cesium.ArcGisMapServerImageryProvider({
                                proxy: new Cesium.DefaultProxy(proxyUrl),
                                url: url,
                                layers: layerid,
                                enablePickFeatures: false
                            }));
                            layer = {
                                layer: curlayer,
                                id: id
                            };
                            break;
                    }
                    if (layer)
                        this.layer3DList["" + layer.id] = layer;
                },
                /**
                 * 删除指定ID的图层
                 */
                deleteServerTypeMap: function (id) {
                    switch (typeof(id)) {
                        case "number":
                            if (this.layer3DList != undefined && this.layer3DList["" + id] != undefined && this.layer3DList["" + id] != null) {
                                var layer = this.layer3DList["" + id];
                                this.viewer.scene.imageryLayers.remove(layer.layer);
                            }
                            break;
                        case "string":
                            var len = cesium.cesiumViewer.dataSources.length;
                            if (len > 0) {
                                for (var i = 0; i < len; i++) {
                                    var dataSource = cesium.cesiumViewer.dataSources.get(i);
                                    if (dataSource._name && dataSource._name == id) {
                                        this.viewer.dataSources.remove(dataSource);
                                    }
                                }
                            }
                            break;
                        case "undefined":
                            break;
                    }
                }
            }
        });

    });