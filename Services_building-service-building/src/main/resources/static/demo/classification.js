define(["vue", "../frame/statusbar", "../frame/titlebar", "../util/infowindow", "../util/xbsjelectron", "../util/xbsjutil", "bootstrap",
        "../module/map3d_cesium", "../3dplugin/mousepos", "../3dplugin/mouseeditor", "../3dplugin/stylewindow", "../preview/featureview",

    ],
    function(vue, statusbar, titlebar, infowindow, xe, util, bs, map3d, mousepos, mouseeditor, stylewindow, fv) {　　　　

        var defaultitem = {
            title: '',
            path: ""
        };

        var vm = new vue({
            el: '#app',
            data: function() {
                return {
                    url: '',
                    code: '',
                    location: {
                        longitude: 116.39123,
                        latitude: 39.90691,
                        height: 0
                    },
                    heading: 0,
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
                    sceneTree: null
                };
            },
            components: {
                statusbar: statusbar,
                titlebar: titlebar,
                infowindow: infowindow,
                map3d: map3d,
                mousepos: mousepos,
                stylewindow: stylewindow
            },
            created: function() {

            },
            mounted: function() {
                //获取参数
                this.url1 = util.getUrlParam('url1');
                this.url2 = util.getUrlParam('url2');
                this.noclass = util.getUrlParam('noclass');
                this.viewer = this.$refs.map3d.viewer;

                var viewer = this.viewer;

                //请求这个tileset.json ，从中提取位置
                var self = this;
                var infowindow = this.$refs.infowindow;

                fv.colorHighlight = Cesium.Color.YELLOW.withAlpha(0.5);
                fv.colorSelected = Cesium.Color.LIME.withAlpha(0.5);
                fv.install(viewer);

                //fp.install(viewer);
                //-75.59630 40.03827
                // A normal b3dm tileset of photogrammetry

                /*
                var longitude = 116.39100516392006;
                var latitude = 39.91189185518834;
                var height = 9;
                var heading = 1.6079547025955905;
                var tileset = new Cesium.Cesium3DTileset({
                    url: 'http://localhost:9002/api/folder/bc812f5ba5ee44cc951f186a2d67653b/tileset.json'
                });
                viewer.scene.primitives.add(tileset);
                tileset.readyPromise.then(function(argument) {
                    var position = Cesium.Cartesian3.fromDegrees(longitude, latitude, height);
                    var mat = Cesium.Transforms.eastNorthUpToFixedFrame(position);
                    var rotationX = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(heading)));
                    Cesium.Matrix4.multiply(mat, rotationX, mat);
                    tileset._root.transform = mat;
                    viewer.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, height + 1000) });
                });
                // viewer.zoomTo(tileset);
                */

                /*
                var longitude = -75.59630;
                var latitude = 40.03827;
                var height = -420;
                var heading = 0;
                var tileset = new Cesium.Cesium3DTileset({
                    url: 'http://localhost:9002/api/folder/b25e3ab1b25245229078995b0405df3a/tileset.json'
                });
                viewer.scene.primitives.add(tileset);
                tileset.readyPromise.then(function(argument) {
                    var position = Cesium.Cartesian3.fromDegrees(longitude, latitude, height);
                    var mat = Cesium.Transforms.eastNorthUpToFixedFrame(position);
                    var rotationX = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(heading)));
                    Cesium.Matrix4.multiply(mat, rotationX, mat);
                    tileset._root.transform = mat;
                    viewer.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, height + 1000) });
                });
                */

                //大雁塔倾斜模型
                var tileset = new Cesium.Cesium3DTileset({
                    url: this.url1
                });
                viewer.scene.primitives.add(tileset);

 
                //大雁塔分类3dtiels
                var classificationTileset = new Cesium.Cesium3DTileset({
                    url: this.url2,
                   // classificationType: this.noclass ? undefined : Cesium.ClassificationType.CESIUM_3D_TILE,
                    classificationType: this.noclass ? undefined : Cesium.ClassificationType.BOTH 
                });

                if(!this.noclass){
                    //注意这个颜色的设置
                    classificationTileset.style = new Cesium.Cesium3DTileStyle({
                        color: 'rgba(0, 255, 0, 0)'
                    });
                }
               
                viewer.scene.primitives.add(classificationTileset);
                viewer.zoomTo(classificationTileset);





            },
            computed: {

                iselectron: function() {

                    return window.nodeRequire != undefined;
                },


            },
            methods: {


            }
        });

    });