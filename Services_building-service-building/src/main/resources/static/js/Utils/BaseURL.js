//规划路服务
var ROADSERVICE = "http://ctzk.map.com:6080/arcgis/rest/services/ghlw1/MapServer/export";
//路牌点服务
var POINTSERVICE = "http://ctzk.map.com:6080/arcgis/rest/services/RoadMark/MapServer";
//影像服务
var VIDOSERVICE = "http://ctzk.map.com:6080/arcgis/rest/services/lzcq/MapServer";
//谷歌服务
var GOOFLEERVICE = "http://ctzk.map.com:6080/arcgis/rest/services/ggyx2/MapServer";
//天地图底图
var MAPBUTTON = "http://192.168.10.60:6080/arcgis/rest/services/MAP/map1/MapServer/export";//使用了
//区域服务
var AREASERVICE = "http://ctzk.map.com:6080/arcgis/rest/services/CountyMap/MapServer/0/query?where=1=1&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&returnGeometry=true&returnIdsOnly=false&returnCountOnly=false&returnZ=false&returnM=false&f=pjson";
//蓝色地图地图
var BLULEMAP = "http://ctzk.map.com:6080/arcgis/rest/services/zmqBlueMap/MapServer";
//建筑物地图服务
var BUILDSERVICE = "http://192.168.30.56:6080/arcgis/rest/services/build/build/MapServer/export";//使用了
//
var BUILDSERVICEINFO = "http://192.168.30.56:6080/arcgis/rest/services/build/build/MapServer/0/query?where=1=1";//使用了
var BUILDTOTAL = "http://192.168.30.56:6080/arcgis/rest/services/build/build/MapServer/0/query?where=";//使用了

var BUILDTEST = "https://192.168.20.246:6443/geoscene/rest/services/ckxm01/buildAtt/MapServer";
//常量
var per = localStorage.getItem("userid");
var POWER = "ADMIN";

