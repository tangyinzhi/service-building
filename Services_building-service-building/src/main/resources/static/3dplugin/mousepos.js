 define(["rtext!./mousepos.html", "rcss!./3dplugin.css", "vue"],
     function(html, vue) {


         var DanweiList = {
             template: html,
             data: function() {
                 return {
                     mouse: {
                         longitude: 0,
                         latitude: 0,
                         height: 0
                     },
                     camera: {
                         longitude: 0,
                         latitude: 0,
                         height: 0,
                         heading: 0
                     },
                     fps: 0

                 };
             },
             created: function() {

             },
             mounted: function() {


                 var self = this;

                 var viewer = this.$parent.$refs.map3d.viewer;

                 //添加相机位置改变事件
                 var camera = viewer.camera;
                 camera.percentageChanged = 0.1;

                 camera.changed.addEventListener(function() {


                     self.camera.heading = Cesium.Math.toDegrees(camera.heading);

                     var p = Cesium.Cartographic.fromCartesian(camera.position);

                     self.camera.longitude = Cesium.Math.toDegrees(p.longitude);
                     self.camera.latitude = Cesium.Math.toDegrees(p.latitude);
                     self.camera.height = p.height;
                 })

                 //添加鼠标位置改变事件

                 var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

                 /*handler.setInputAction(function(movement) {


                    var position = viewer.scene.pickPosition(movement.endPosition);
                    if(!position){
                         var ray = viewer.camera.getPickRay(movement.endPosition);
                         position = viewer.scene.globe.pick(ray, viewer.scene);
                    }

                   

                     //var position = viewer.scene.pickPosition(movement.endPosition);
                     if (position) {
                         var p = Cesium.Cartographic.fromCartesian(position);

                         self.mouse.longitude = Cesium.Math.toDegrees(p.longitude);
                         self.mouse.latitude = Cesium.Math.toDegrees(p.latitude);
                         self.mouse.height = p.height;

                     }
                 },
                  Cesium.ScreenSpaceEventType.MOUSE_MOVE);
                    */
                 var globe = viewer.scene.globe;
                 var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
                 handler.setInputAction(function(movement) {

                         var srcdt = globe.depthTestAgainstTerrain;

                         globe.depthTestAgainstTerrain = true;
                         viewer.render();
                         //如果可以获取点击位置
                         var pickPosition = viewer.scene.pickPosition(movement.position);
                         if (pickPosition) {
                             var p = Cesium.Cartographic.fromCartesian(pickPosition);

                             self.mouse.longitude = Cesium.Math.toDegrees(p.longitude);
                             self.mouse.latitude = Cesium.Math.toDegrees(p.latitude);
                             self.mouse.height = p.height;

                         }
                         globe.depthTestAgainstTerrain = srcdt;
                     },
                     Cesium.ScreenSpaceEventType.LEFT_CLICK);


                  
                 //创建一个用来显示帧率的
                 var monitor = Cesium.FrameRateMonitor.fromScene(viewer.scene);
                 viewer.scene.postRender.addEventListener(function() {

                     if (monitor.lastFramesPerSecond)
                         self.fps = Math.floor(monitor.lastFramesPerSecond);
                     else
                         self.fps = 0;
                 });
               
                 viewer.scene.debugShowFramesPerSecond = true;
             },
             methods: {

             },
             filters: {
                 f_bs: function(b) {
                     return b.toFixed(5) + "°";
                 },
                 f_m: function(m) {
                     return m.toFixed(2) + "米";
                 },
                 f_a: function(a) {
                     return a.toFixed(1) + "°";
                 }

             }
         };

         return DanweiList;
     });