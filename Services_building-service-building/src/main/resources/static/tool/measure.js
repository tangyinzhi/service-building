define(['vue'], function(vue) {
    var loadedModels = [];

    var tempPoints = [];
    var tempEntities = [];
    var tempPinEntities = [];
    var tempPinLon, tempPinLat;

    var handler = null;

    function clearEffects() {
        if(handler != null) {
            handler.destroy();
        }
    }
    var waterEntity = null;
    var positions = [];
    var polygon = null;
    var cartesian = null;
    var floatingPoint; //浮动点
    //设置各种操作模式
    function SetMode(mode) {
        viewer.entities.removeAll();               // 取消双击事件-追踪该位置
        if(mode == "drawPloy") {
            clearDrawingBoard();
            handler = new Cesium.ScreenSpaceEventHandler(viewer.scene._imageryLayerCollection);
            handler.setInputAction(function(movement) {
                let ray = viewer.camera.getPickRay(movement.endPosition);
                cartesian = viewer.scene.globe.pick(ray, viewer.scene);
                if(positions.length >= 2) {
                    if(!Cesium.defined(polygon)) {
                        polygon = new PolygonPrimitive(positions);
                    } else {
                        positions.pop();
                        positions.push(cartesian);
                    }
                }
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);


            handler.setInputAction(function(movement) {
                let ray = viewer.camera.getPickRay(movement.position);
                cartesian = viewer.scene.globe.pick(ray, viewer.scene);
                if(positions.length == 0) {
                    positions.push(cartesian.clone());
                }
                positions.push(cartesian);            //在三维场景中添加点

                var cartographic = Cesium.Cartographic.fromCartesian(positions[positions.length - 1]);
                var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
                var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
                var heightString = cartographic.height;
                tempPoints.push({
                    lon: longitudeString,
                    lat: latitudeString,
                    hei: heightString
                });
                var tempLength = tempPoints.length;
                drawPoint(tempPoints[tempPoints.length - 1]);
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);


            handler.setInputAction(function(movement) {
                var ent = viewer.entities.add({
                    position: Cesium.Cartesian3.fromDegrees(((tempPoints[0].lon + (tempPoints[tempPoints.length - 1].lon + tempPoints[tempPoints.length - 2].lon) / 2) / 2),
                        ((tempPoints[0].lat + (tempPoints[tempPoints.length - 1].lat + tempPoints[tempPoints.length - 2].lat) / 2) / 2)),
                    label: {
                        text: SphericalPolygonAreaMeters(tempPoints).toFixed(1) + '㎡',
                        font: '22px Helvetica',
                        fillColor: Cesium.Color.BLACK
                    }
                });

                tempEntities.push(ent);
                tempEntities.push(waterEntity);
                tempPoints = [];
                clearEffects();
            }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

            /* 多边形*/
            var PolygonPrimitive = (function() {
                function _(positions) {
                    this.options = {
                        name: '多边形',
                        polygon: {
                            hierarchy: [],
                            //perPositionHeight: true,
                            material: Cesium.Color.CHARTREUSE.withAlpha(.5)
                        }
                    };


                    this.hierarchy = positions;
                    this._init();
                }
                _.prototype._init = function() {
                    var _self = this;
                    var _update = function() {
                        return _self.hierarchy;
                    };                //实时更新polygon.hierarchy

                    this.options.polygon.hierarchy = new Cesium.CallbackProperty(_update, false);
                    //viewer.entities.add(this.options);                
                    waterEntity = viewer.entities.add(this.options);
                    //waterEntity = "1111";        
                };


                return _;
            })();

        } else if("drawLine" == mode) {
            tempPoints = [];
            clearEffects();
            handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
            handler.setInputAction(function(click) {
                let ray = viewer.camera.getPickRay(click.position);
                var cartesian = viewer.scene.globe.pick(ray, viewer.scene);
                if(cartesian) {
                    var cartographic = Cesium.Cartographic.fromCartesian(cartesian);

                    var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
                    var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
                    tempPoints.push({
                        lon: longitudeString,
                        lat: latitudeString,
                        hei: cartographic.height
                    });
                    var tempLength = tempPoints.length;
                    drawPoint(tempPoints[tempPoints.length - 1]);
                    if(tempLength > 1) {

                        drawLine(tempPoints[tempPoints.length - 2], tempPoints[tempPoints.length - 1], true);
                    }
                }
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
            handler.setInputAction(function(click) {
                tempPoints = [];
                clearEffects();
            }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
        }
    }

    function drawPoint(point) {
        var entity =
            viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(point.lon, point.lat, point.hei),
                label: {
                    text: '',
                    font: '22px Helvetica'
                },
                point: {
                    pixelSize: 10,
                    color: Cesium.Color.CHARTREUSE
                }
            });
        tempEntities.push(entity);
    }

    function drawLine(point1, point2, showDistance) {
        var entity =
            viewer.entities.add({
                polyline: {
                    positions: [Cesium.Cartesian3.fromDegrees(point1.lon, point1.lat, point1.hei), Cesium.Cartesian3.fromDegrees(point2.lon, point2.lat, point2.hei)],
                    width: 10.0,
                    material: new Cesium.PolylineGlowMaterialProperty({
                        color: Cesium.Color.CHARTREUSE.withAlpha(0.5)
                    })
                }
            });
        tempEntities.push(entity);
        if(showDistance) {
            var w = Math.abs(point1.lon - point2.lon);
            var h = Math.abs(point1.lat - point2.lat);
            var offsetV = w >= h ? 0.0005 : 0;
            var offsetH = w < h ? 0.001 : 0;
            var distance = getFlatternDistance(point1.lat, point1.lon, point2.lat, point2.lon);
            entity =
                viewer.entities.add({
                    position: Cesium.Cartesian3.fromDegrees(((point1.lon + point2.lon) / 2) + offsetH,
                        ((point1.lat + point2.lat) / 2) + offsetV),
                    label: {
                        text: distance.toFixed(1) + 'm',
                        font: '22px Helvetica',
                        fillColor: Cesium.Color.WHITE
                    }
                });
            tempEntities.push(entity);
        }
    }

    function drawPoly(points) {
        var pArray = [];
        for(var i = 0; i < points.length; i++) {
            pArray.push(points[i].lon);
            pArray.push(points[i].lat);
            //pArray.push(points[i].hei);
        }
        var entity =
            viewer.entities.add({
                polygon: {
                    hierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(pArray)),
                    material: Cesium.Color.CHARTREUSE.withAlpha(.5)
                }
            });
        tempEntities.push(entity);
    }

    //计算两点间距离
    function getFlatternDistance(lat1, lng1, lat2, lng2) {
        var EARTH_RADIUS = 6378137.0; //单位M
        var PI = Math.PI;

        function getRad(d) {
            return d * PI / 180.0;
        }
        var f = getRad((lat1 + lat2) / 2);
        var g = getRad((lat1 - lat2) / 2);
        var l = getRad((lng1 - lng2) / 2);

        var sg = Math.sin(g);
        var sl = Math.sin(l);
        var sf = Math.sin(f);

        var s, c, w, r, d, h1, h2;
        var a = EARTH_RADIUS;
        var fl = 1 / 298.257;

        sg = sg * sg;
        sl = sl * sl;
        sf = sf * sf;

        s = sg * (1 - sl) + (1 - sf) * sl;
        c = (1 - sg) * (1 - sl) + sf * sl;

        w = Math.atan(Math.sqrt(s / c));
        r = Math.sqrt(s * c) / w;
        d = 2 * w * a;
        h1 = (3 * r - 1) / 2 / c;
        h2 = (3 * r + 1) / 2 / s;

        return d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg));
    }

    //计算多边形面积
    var earthRadiusMeters = 6371000.0;
    var radiansPerDegree = Math.PI / 180.0;
    var degreesPerRadian = 180.0 / Math.PI;

    function SphericalPolygonAreaMeters(points) {
        var totalAngle = 0;
        for(var i = 0; i < points.length; i++) {
            var j = (i + 1) % points.length;
            var k = (i + 2) % points.length;
            totalAngle += Angle(points[i], points[j], points[k]);
        }
        var planarTotalAngle = (points.length - 2) * 180.0;
        var sphericalExcess = totalAngle - planarTotalAngle;
        if(sphericalExcess > 420.0) {
            totalAngle = points.length * 360.0 - totalAngle;
            sphericalExcess = totalAngle - planarTotalAngle;
        } else if(sphericalExcess > 300.0 && sphericalExcess < 420.0) {
            sphericalExcess = Math.abs(360.0 - sphericalExcess);
        }
        return sphericalExcess * radiansPerDegree * earthRadiusMeters * earthRadiusMeters;
    }

    /*角度*/
    function Angle(p1, p2, p3) {
        var bearing21 = Bearing(p2, p1);
        var bearing23 = Bearing(p2, p3);
        var angle = bearing21 - bearing23;
        if(angle < 0) {
            angle += 360;
        }
        return angle;
    }
    /*方向*/
    function Bearing(from, to) {
        var lat1 = from.lat * radiansPerDegree;
        var lon1 = from.lon * radiansPerDegree;
        var lat2 = to.lat * radiansPerDegree;
        var lon2 = to.lon * radiansPerDegree;
        var angle = -Math.atan2(Math.sin(lon1 - lon2) * Math.cos(lat2), Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2));
        if(angle < 0) {
            angle += Math.PI * 2.0;
        }
        angle = angle * degreesPerRadian;
        return angle;
    }
    /**
     * 清除地图痕迹
     */
    function clearDrawingBoard() {
        <!-- viewer.entities.removeAll(); -->
        var primitives = viewer.entities;
        for(i = 0; i < tempEntities.length; i++) {
            primitives.remove(tempEntities[i]);
        }
        tempEntities = [];
        clearEffects();
        waterEntity = null;
        waterEntity = null;
        positions = [];
        polygon = null;
        cartesian = null;
        floatingPoint; //浮动点
    }

    var measure = {
        clearDrawingBoard: clearDrawingBoard,
        SetMode: SetMode,
        clearEffects: clearEffects
    }
    this.measure = measure;
    return measure;
});