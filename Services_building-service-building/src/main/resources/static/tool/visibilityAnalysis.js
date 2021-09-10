define(['vue'], function(vue) {

    // 目标点集合
    var destPoints = [];

    function visibilityAnalysis(viewPoint,height) {
        destPoints = [];
        if(viewPoint == undefined || viewPoint == null) {
            alert("当前点获取失败");
            return;
        }
        if(viewer.entities != undefined && viewer.entities != null) {
            viewer.entities.removeAll();
        }
        if(height == undefined || height == null) {
            height = 300;
        }
        height = height+10;
        // 世界坐标转换为投影坐标
        var webMercatorProjection = new Cesium.WebMercatorProjection(viewer.scene.globe.ellipsoid);
        var viewPointWebMercator = webMercatorProjection.project(Cesium.Cartographic.fromCartesian(viewPoint));

        this.viewPoint = viewPoint;
        // 观察点和目标点的距离
        var radius = 500; // 视距500米

        // 计算45°和135°之间的目标点
        for(var i = 45; i <= 135; i++) {
            // 度数转弧度
            var radians = Cesium.Math.toRadians(i);
            // 计算目标点
            var toPoint = new Cesium.Cartesian3(viewPointWebMercator.x + radius * Math.cos(radians), viewPointWebMercator.y + radius * Math.sin(radians), 30);
            // 投影坐标转世界坐标
            toPoint = webMercatorProjection.unproject(toPoint);
            toPoint.height = height;
            destPoints.push(Cesium.Cartographic.toCartesian(toPoint.clone()));

        }
        // 一定要等3dtile模型加载完成后执行
        setTimeout(function() {
            pickFromRay(viewPoint);
        }, 500)

    }

    // 绘制线
    function drawLine(leftPoint, secPoint, color) {
        viewer.entities.add({
            polyline: {
                positions: [leftPoint, secPoint],
                arcType: Cesium.ArcType.NONE,
                width: 5,
                material: color,
                depthFailMaterial: color
            }
        })
    }

    var objectsToExclude = [];

    function pickFromRay(viewPoint) {
        for(var i = 0; i < destPoints.length; i++) {
            // 计算射线的方向，目标点left 视域点right
            var direction = Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(destPoints[i], viewPoint, new Cesium.Cartesian3()), new Cesium.Cartesian3());
            // 建立射线
            var ray = new Cesium.Ray(viewPoint, direction);
            var result = viewer.scene.pickFromRay(ray, objectsToExclude); // 计算交互点，返回第一个
            showIntersection(result, destPoints[i], viewPoint);
        }
    }

    // 处理交互点
    function showIntersection(result, destPoint, viewPoint) {
        // 如果是场景模型的交互点，排除交互点是地球表面
        if(Cesium.defined(result) && Cesium.defined(result.object)) {
            drawLine(result.position, viewPoint, Cesium.Color.GREEN); // 可视区域
            drawLine(result.position, destPoint, Cesium.Color.RED); // 不可视区域
        } else {
            drawLine(viewPoint, destPoint, Cesium.Color.GREEN);
        }
    }

    var visibilityAnalysis = {
        visibilityAnalysis: visibilityAnalysis,
    }
    this.visibilityAnalysis = visibilityAnalysis;
    return visibilityAnalysis;
});