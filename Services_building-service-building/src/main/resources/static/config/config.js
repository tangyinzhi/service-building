 define(['vue'], function(vue) {
 	/*

				 *type代表地图服务类型:
				 0代表ArcGisMapServerImageryProvider;
				 1代表createOpenStreetMapImageryProvider;
				 2代表WebMapTileServiceImageryProvider;
				 3代表createTileMapServiceImageryProvider;
				 4 代表UrlTemplateImageryProvider;
				 5 代表WebMapServiceImageryProviderr(WMS);
				 6 代表kml,kmz;
				 7 代表geoJson;
				 8代表3dtiles;
				 */
 	/*
 	 * 实例：{
 	 * 	id: 212,//树ID 必填
 		name: "万象汇", //树显示名 必填
 		layerurl: "http://192.168.30.55:9002/api/folder/b1fd5e3af02447eab78b9e2d3dfd4398",//图层url（3dTile 图层url 不添加后面的 title.json） 必填
 		layerid: "NAD_ZDZK",//图层ID 
 		IsWebMercatorTilingScheme: true, //是否创建摩卡托投影坐标系,默认是地理坐标系 必填
 		type: 8,//图层类型 必填
 		params: {
 			tx: 105.40713, //模型中心X轴坐标（经度，单位：十进制度）
 			ty: 28.89712, //模型中心Y轴坐标（纬度，单位：十进制度）
 			tz: 250, //模型中心Z轴坐标（高程，单位：米）
 			rx: 0, //X轴（经度）方向旋转角度（单位：度）
 			ry: 0, //Y轴（纬度）方向旋转角度（单位：度）
 			rz: 85 //Z轴（高程）方向旋转角度（单位：度）
 		},//3dTile 图层偏转参数
 		checked: false,//是否 选中   必填
 		alpha: 1 ,//图层透明度
 		ishide: true//是否添加滑块(控制统明度)
 	 * }
 	 */
 	var MapConfig = {};
 	MapConfig.demurl = "http://192.168.30.55:9002/api/wmts/terrain/a5f50935f73a456e87f7ee07df08348f";
 	MapConfig.Layers = [{
 			id: 1,
 			name: "基础图层",
 			checked: false,
 			children: [{
 					id: 11,
 					name: "建筑物二维", //WMS-T
 					layerurl: "http://192.168.30.55:6080/arcgis/rest/services/建筑物/MapServer",
 					layerid: "NAD_DL",
 					IsWebMercatorTilingScheme: false, //是否创建摩卡托投影坐标系,默认是地理坐标系
 					type: 0,
 					checked: false,
 					alpha: 1 //透明度
 				},
 				{
 					id: 12,
 					name: "影像地图2016", //WMS-T
 					layerurl: "http://192.168.30.55:6080/arcgis/rest/services/DOM2016/MapServer",
 					layerid: "NAD_ZDZK",
 					IsWebMercatorTilingScheme: false, //是否创建摩卡托投影坐标系,默认是地理坐标系
 					type: 0,
 					checked: false,
 					alpha: 1 //透明度
 				},
 				{
 					id: 13,
 					name: "影像地图2019", //WMS-T
 					layerurl: "http://192.168.30.55:6080/arcgis/rest/services/DOM2019/MapServer",
 					layerid: "NAD_ZDZK",
 					IsWebMercatorTilingScheme: false, //是否创建摩卡托投影坐标系,默认是地理坐标系
 					type: 0,
 					checked: false,
 					alpha: 1 //透明度
 				},
 				{
 					name: "地形", //WMS-T
 					layerurl: "http://172.1.4.156:804/data/DEM/fabu/5pf",
 					layerid: "dx",

 					type: 9,
 					checked: true,
 					isDx: true
 				},
 				{
 					name: "地形2", //WMS-T
 					layerurl: "http://172.1.4.156:804/data/DEM/fabu/jiangdi10mi",
 					layerid: "dx",

 					type: 9,
 					checked: false,
 					isDx: true
 				}
 			]
 		},
 		{
 			id: 2,
 			name: "专题图层",
 			checked: false,
 			children: [{
 					id: 21,
 					name: "bim图层",
 					checked: false,
 					children: [{
 							id: 211,
 							name: "万达建筑", //WMS-T
 							layerurl: "http://172.1.4.156:804/data/BIM/wd/build",
 							layerid: "TILE_DL",
 							IsWebMercatorTilingScheme: false, //是否创建摩卡托投影坐标系,默认是地理坐标系
 							type: 8,
 							params: {
 								tx: 105.41705499999993, //模型中心X轴坐标（经度，单位：十进制度）
 								ty: 28.91466499999995, //模型中心Y轴坐标（纬度，单位：十进制度）
 								tz: 275, //模型中心Z轴坐标（高程，单位：米）
 								rx: 0, //X轴（经度）方向旋转角度（单位：度）
 								ry: 0, //Y轴（纬度）方向旋转角度（单位：度）
 								rz: 29.2 //Z轴（高程）方向旋转角度（单位：度）
 							},
 							checked: false,
 							alpha: 1 //透明度
 						},
 						{
 							id: 212,
 							name: "万达电气管线", //WMS-T
 							layerurl: "http://172.1.4.156:804/data/BIM/wd/ee",
 							layerid: "TILE_DL",
 							IsWebMercatorTilingScheme: false, //是否创建摩卡托投影坐标系,默认是地理坐标系
 							type: 8,
 							params: {
 								tx: 105.41705499999993, //模型中心X轴坐标（经度，单位：十进制度）
 								ty: 28.91466499999995, //模型中心Y轴坐标（纬度，单位：十进制度）
 								tz: 271, //模型中心Z轴坐标（高程，单位：米）
 								rx: 0, //X轴（经度）方向旋转角度（单位：度）
 								ry: 0, //Y轴（纬度）方向旋转角度（单位：度）
 								rz: 29.2 //Z轴（高程）方向旋转角度（单位：度）
 							},
 							checked: false,
 							alpha: 1 //透明度
 						},
 						{
 							id: 213,
 							name: "万达暖通管线", //WMS-T
 							layerurl: "http://172.1.4.156:804/data/BIM/wd/me",
 							layerid: "TILE_DL",
 							IsWebMercatorTilingScheme: false, //是否创建摩卡托投影坐标系,默认是地理坐标系
 							type: 8,
 							params: {
 								tx: 105.41705499999993, //模型中心X轴坐标（经度，单位：十进制度）
 								ty: 28.91466499999995, //模型中心Y轴坐标（纬度，单位：十进制度）
 								tz: 271, //模型中心Z轴坐标（高程，单位：米）
 								rx: 0, //X轴（经度）方向旋转角度（单位：度）
 								ry: 0, //Y轴（纬度）方向旋转角度（单位：度）
 								rz: 29.2 //Z轴（高程）方向旋转角度（单位：度）
 							},
 							checked: false,
 							alpha: 1 //透明度
 						},
 						{
 							id: 214,
 							name: "万达给排水", //WMS-T
 							layerurl: "http://172.1.4.156:804/data/BIM/wd/pe",
 							layerid: "TILE_DL",
 							IsWebMercatorTilingScheme: false, //是否创建摩卡托投影坐标系,默认是地理坐标系
 							type: 8,
 							params: {
 								tx: 105.41705499999993, //模型中心X轴坐标（经度，单位：十进制度）
 								ty: 28.91466499999995, //模型中心Y轴坐标（纬度，单位：十进制度）
 								tz: 271, //模型中心Z轴坐标（高程，单位：米）
 								rx: 0, //X轴（经度）方向旋转角度（单位：度）
 								ry: 0, //Y轴（纬度）方向旋转角度（单位：度）
 								rz: 29.2 //Z轴（高程）方向旋转角度（单位：度）
 							},
 							checked: false,
 							alpha: 1 //透明度
 						},
 						{
 							id: 215,
 							name: "万象汇", //WMS-T
 							layerurl: "http://172.1.4.156:804/data/BIM/wxh/build",
 							layerid: "NAD_ZDZK",
 							IsWebMercatorTilingScheme: true, //是否创建摩卡托投影坐标系,默认是地理坐标系
 							type: 8,
 							params: {
 								tx: 105.40716, //模型中心X轴坐标（经度，单位：十进制度）
 								ty: 28.89717, //模型中心Y轴坐标（纬度，单位：十进制度）
 								tz: 267, //模型中心Z轴坐标（高程，单位：米）
 								rx: 0, //X轴（经度）方向旋转角度（单位：度）
 								ry: 0, //Y轴（纬度）方向旋转角度（单位：度）
 								rz: 85 //Z轴（高程）方向旋转角度（单位：度）
 							},
 							checked: false,
 							alpha: 1 //透明度
 						},
 						{
 							id: 216,
 							name: "万象汇电气管线", //WMS-T
 							layerurl: "http://172.1.4.156:804/data/BIM/wxh/ee",
 							layerid: "TILE_DL",
 							IsWebMercatorTilingScheme: false, //是否创建摩卡托投影坐标系,默认是地理坐标系
 							type: 8,
 							params: {
 								tx: 105.40708, //模型中心X轴坐标（经度，单位：十进制度）
 								ty: 28.89717, //模型中心Y轴坐标（纬度，单位：十进制度）
 								tz: 267, //模型中心Z轴坐标（高程，单位：米）
 								rx: 0, //X轴（经度）方向旋转角度（单位：度）
 								ry: 0, //Y轴（纬度）方向旋转角度（单位：度）
 								rz: 85 //Z轴（高程）方向旋转角度（单位：度）
 							},
 							checked: false,
 							alpha: 1 //透明度
 						},
 						{
 							id: 217,
 							name: "万象汇暖通管线", //WMS-T
 							layerurl: "http://172.1.4.156:804/data/BIM/wxh/me",
 							layerid: "TILE_DL",
 							IsWebMercatorTilingScheme: false, //是否创建摩卡托投影坐标系,默认是地理坐标系
 							type: 8,
 							params: {
 								tx: 105.40708, //模型中心X轴坐标（经度，单位：十进制度）
 								ty: 28.89717, //模型中心Y轴坐标（纬度，单位：十进制度）
 								tz: 267, //模型中心Z轴坐标（高程，单位：米）
 								rx: 0, //X轴（经度）方向旋转角度（单位：度）
 								ry: 0, //Y轴（纬度）方向旋转角度（单位：度）
 								rz: 85 //Z轴（高程）方向旋转角度（单位：度）
 							},
 							checked: false,
 							alpha: 1 //透明度
 						}
 					]
 				},
 				{
 					id: 22,
 					name: "倾斜摄影",
 					checked: false,
 					children: [{
 							id: 221,
 							name: "8平方公里", //WMS-T
 							layerurl: "http://172.1.4.156:804/data/QX816",
 							layerid: "TILE_DL3",
 							IsWebMercatorTilingScheme: false, //是否创建摩卡托投影坐标系,默认是地理坐标系
 							type: 8,
 							checked: false,
 							alpha: 1 //透明度
 						},

 						{
 							id: 222,
 							name: "5平方公里", //WMS-T
 							layerurl: "http://172.1.4.156:804/data/QX/QX5FABU",
 							layerid: "NAD_ZDZK5",
 							IsWebMercatorTilingScheme: false, //是否创建摩卡托投影坐标系,默认是地理坐标系
 							type: 8,
 							checked: false,
 							alpha: 1 //透明度
 						},
 						{
 							id: 223,
 							name: "30平方公里", //WMS-T
 							layerurl: "http://172.1.4.156:804/data/QXQ",
 							layerid: "NAD_ZDZK5",
 							IsWebMercatorTilingScheme: false, //是否创建摩卡托投影坐标系,默认是地理坐标系
 							type: 8,
 							checked: false,
 							alpha: 1 //透明度D:\Cesium页面\data\QX\fabu
 						},
 						{
 							id: 224,
 							name: "5平方公里单体化", //WMS-T
 							layerurl: "http://172.1.4.156:804/data/SHPQ/628",
 							layerid: "NAD_ZDZK5",
 							IsWebMercatorTilingScheme: true, //是否创建摩卡托投影坐标系,默认是地理坐标系
 							type: 8,
 							checked: false,
 							ishide: true, //是否添加滑块控制统明度
 							isHistory: true,
 							alpha: 1 //透明度
 						},
 						{
 							id: 225,
 							name: "自贸区", //WMS-T
 							layerurl: "http://172.1.4.156:804/data/QX/fabu",
 							layerid: "NAD_ZDZK5",
 							IsWebMercatorTilingScheme: false, //是否创建摩卡托投影坐标系,默认是地理坐标系
 							type: 8,
 							checked: false,
 							alpha: 1 //透明度D:\Cesium页面\data\QX\fabu
 						}
 					]
 					//								children: [{
 					//										id: 221,
 					//										name: "天地图", //WMS-T
 					//										layerurl: "http://192.168.10.60:6080/arcgis/rest/services/MAP/map1/MapServer",
 					//										layerid: "NAD_DL",
 					//										IsWebMercatorTilingScheme: false, //是否创建摩卡托投影坐标系,默认是地理坐标系
 					//										type: 0,
 					//										checked: false
 					//									},
 					//									{
 					//										id: 222,
 					//										name: "谷歌地图", //WMS-T
 					//										layerurl: "http://192.168.30.15:6080/arcgis/rest/services/LMGoogleMap/MapServer",
 					//										layerid: "NAD_ZDZK",
 					//										IsWebMercatorTilingScheme: true, //是否创建摩卡托投影坐标系,默认是地理坐标系
 					//										type: 0,
 					//										checked: false
 					//									}
 					//								]
 				}
 			]
 		},

 	];
 	MapConfig.baselayers = [{
 			name: '谷歌影像无偏移',
 			url: 'http://www.google.cn/maps/vt?lyrs=s&x={x}&y={y}&z={z}',
 			maximumLevel: 20
 		},
 		{
 			name: '谷歌影像带标注',
 			url: 'http://www.google.cn/maps/vt?lyrs=s,h&gl=cn&x={x}&y={y}&z={z}',
 			maximumLevel: 20
 		}, {
 			name: '谷歌影像有偏移',
 			url: 'http://www.google.cn/maps/vt?lyrs=s&gl=cn&x={x}&y={y}&z={z}',
 			maximumLevel: 20
 		}, {
 			name: '谷歌地图有偏移',
 			url: 'http://www.google.cn/maps/vt?lyrs=m&gl=cn&x={x}&y={y}&z={z}',
 			maximumLevel: 18
 		}, {
 			name: '天地图影像无偏移',
 			url: 'http://t1.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=8bc8ba83cc36ea2049915ab81bd0cb6f',
 			img: 'test.jpg',
 			desc: '无偏移，墨卡托投影',
 			maximumLevel: 18
 		}, {
 			name: '天地图影像标注无偏移',
 			url: 'http://t1.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=8bc8ba83cc36ea2049915ab81bd0cb6f',
 			img: 'test.jpg',
 			desc: '无偏移，墨卡托投影',
 			maximumLevel: 18
 		}, {
 			name: '天地图地图无偏移',
 			url: 'http://t1.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=8bc8ba83cc36ea2049915ab81bd0cb6f',
 			img: 'test.jpg',
 			desc: '无偏移，墨卡托投影',
 			maximumLevel: 18
 		}, {
 			name: '天地图地图标注无偏移',
 			url: 'http://t1.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=8bc8ba83cc36ea2049915ab81bd0cb6f',
 			img: 'test.jpg',
 			desc: '无偏移，墨卡托投影',
 			maximumLevel: 18
 		}, {
 			name: '高德在线地图有偏移',
 			url: 'http://webrd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
 			img: 'test.jpg',
 			desc: '有偏移，墨卡托投影',
 			maximumLevel: 18
 		}
 	];

 	this.MapConfig = MapConfig;
 	return MapConfig;
 });