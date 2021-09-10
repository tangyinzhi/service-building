var viewer = null;
var scene = null;
var stopTime = null;
var isCeliang = false;
var isVisibilityAnalysis = false; //视域分析
var isSkylineAnalysis = false; //天际线分析
var isRoaming = true; //漫游
define(["rtext!./tool.html", "rcss!./tool.css", 'vue', "../tool/measure", "../tool/visibilityAnalysis", "jrange","../config/config", "rcss!../Plugins/font/css/font-awesome.min.css", "bootstrap"],
	function(html, css, vue, measure, visibilityAnalysis, jrange,MapConfig, awesome) {

		var sdtool = {
			template: html,
			data: function() {
				return {
					baselayers: [{
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
					],
					_baselayer: null,
					selectbase: true
				};
			},
			mounted: function() {
				var self = this;
				viewer = this.$parent.$refs.map3d.viewer;

				scene = viewer.scene;
				self.viewer = viewer;
			},
			computed: {},
			methods: {
				DisplayOrHideLayer: function() { //显示或隐藏图层树
					var layerDisplay = $("#sceneTreeContainer").css("display");
					if(layerDisplay == "block") {
						$("#sceneTreeContainer").css("display", "none");
					} else {
						$("#sceneTreeContainer").css("display", "block");
					}
				},
				SetRoaming: function(index) {
					if(index == 1) {
						isRoaming = true;
					} else {
						isRoaming = false;
					}
				},
				transparent: function() {
					if(viewer.scene.globe.depthTestAgainstTerrain) {
						viewer.scene.globe.depthTestAgainstTerrain = false;
					} else {
						viewer.scene.globe.depthTestAgainstTerrain = true;
					}
				},
				SetMode: function(mode) {
					if(viewer != null & scene != null) {
						measure.SetMode(mode);
					}
				},
				clearDrawingBoard: function() { //清除测量
					if(viewer != null & scene != null) {
						measure.clearDrawingBoard();
					}
				},
				visibilityAnalysis: function() { //视域分析
					this.clearDrawingBoard(); //清除测量
					if(viewer != null & scene != null) {
						isSkylineAnalysis = false;
						if(isVisibilityAnalysis == undefined || isVisibilityAnalysis == null || !isVisibilityAnalysis) {
							isVisibilityAnalysis = true;
						}
						var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
						handler.setInputAction(function(movement) {
							if(isVisibilityAnalysis) {
								//								var pickPosition = viewer.scene.pickEllipsoid(movement.position,scene.globe.ellipsoid);
								//								if(pickPosition) {
								//									var p = Cesium.Cartographic.fromCartesian(pickPosition);
								//
								//									var longitudeString = Cesium.Math.toDegrees(p.longitude);
								//									var latitudeString = Cesium.Math.toDegrees(p.latitude);
								//									var zString = Math.ceil(viewer.camera.positionCartographic.height);//获取相机高度
								//									var position = Cesium.Cartesian3.fromDegrees(longitudeString, latitudeString, zString)
								//									visibilityAnalysis.visibilityAnalysis(position);
								//									isVisibilityAnalysis = false;
								//								}
								var pickPosition = viewer.scene.pickPosition(movement.position);
								if(pickPosition) {
									var cartographic = Cesium.Cartographic.fromCartesian(pickPosition);
									var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
									var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
									var zString = cartographic.height;
									var position = Cesium.Cartesian3.fromDegrees(longitudeString, latitudeString, zString)
									visibilityAnalysis.visibilityAnalysis(position, zString);
									isVisibilityAnalysis = false;
								}

							}

						}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
					}
				},
				Rizhaofenxi: function() { //日照分析
					this.ClearAnalysis();
					$(".infoview").css("display", "block");
				},
				skylineAnalysis: function() { //天际线分析
					this.ClearAnalysis();
					if(viewer != null & scene != null) {
						isSkylineAnalysis = true;
						isVisibilityAnalysis = false;
						var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
						handler.setInputAction(function(movement) {
							if(isSkylineAnalysis) {
								//如果可以获取点击位置
								var pickPosition = viewer.scene.pickPosition(movement.position);
								if(pickPosition) {
									var p = Cesium.Cartographic.fromCartesian(pickPosition);

									var longitudeString = Cesium.Math.toDegrees(p.longitude);
									var latitudeString = Cesium.Math.toDegrees(p.latitude);
									var zString = p.height;
									viewer.scene.camera.setView({ //设置相机位置
										destination: Cesium.Cartesian3.fromDegrees(longitudeString, latitudeString, 307.75),
										orientation: {
											heading: 0.34395448573153864,
											pitch: -0.0538346996932666,
											roll: 6.2831853071795685
										}
									});
									isSkylineAnalysis = false;

								}

							}

						}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
					}

				},
				historyAnalysis: function() { //历史变迁
					this.historyTileset = this.$parent.historyTileset;
					if(this.historyTileset == undefined || this.historyTileset == null) {
						
						alert("请选中'建筑物单体化图层'");
						return;
					}
//					this.historyTileset = new Cesium.Cesium3DTileset({
//						url: this.$parent.historyTileset.url
//					});
					this.historyTileset.style = new Cesium.Cesium3DTileStyle({
						color: "color() *vec4(1,1,1,0.01)"
					});
					viewer.scene.primitives.add(this.historyTileset);
					this.ClearAnalysis();
					$(".infoviewHistory").css("display", "block");
					this.maxIndex = 2025;
					this.starIndex = 1995;
					this.isStart = false;
					$('.slider-input').jRange({
						from: 2000, //最小值
						to: 2025, //最大值
						step: 1, //每一步的增量
						scale: [ 2000, 2010, 2015, 2020, 2025], //刻度条。例如[0,50,100]
						format: '%s年', //用来设置标签的格式 例如"%s 天"
						width: 300, //宽度
						showLabels: true, //显示标签(默认true)
						showScale: true, //显示刻度(默认true)
						isRange: false, //是否为范围(默认false,选择一个点),如果是true，选择的是范围,格式为'1,2'
						snap: false, //	是否只允许按增值选择(默认false)
						disable: false, //	是否只读(默认false),若为true,只读模式，无法选择。
						ondragend: this.ondragend, //滑块拖动触发事件
						onbarclicked: this.onbarclicked, //用户点击栏时调用

					});
					$('.slider-input').jRange('setValue', '0');
				},
				ondragend: function() { //	拖动结束时的回调函数
					if($('.slider-input') != undefined && $('.slider-input') != null) {
						var evalue = $('.slider-input').val();
						if(evalue != undefined && evalue != null) {
							this.starIndex = evalue;
							this.historyTilesetStyle();
						}
					}
				},
				onbarclicked: function() { //刻度条被按住时的回调函数
					if($('.slider-input') != undefined && $('.slider-input') != null) {
						var evalue = $('.slider-input').val();
						if(evalue != undefined && evalue != null) {
							this.starIndex = evalue;
							this.historyTilesetStyle();
						}
					}
				},
				sliderStart: function() { //历史变迁滑块启动/暂停函数
					var classValue = $("#sliderStart");

					if(classValue != undefined && classValue != null && classValue.hasClass("fa-play-circle-o")) { //开始/继续
						classValue.removeClass("fa-play-circle-o");
						classValue.addClass("fa-pause-circle-o");
						this.isStart = true;
						this.historyTilesetAnalysis();
					} else { //停止
						classValue.removeClass("fa-pause-circle-o");
						classValue.addClass("fa-play-circle-o");
						this.isStart = false;
					}

				},
				historyTilesetAnalysis: function() { //历史变迁辅助函数(自动播放停止)
					var self = this;
					//self.historyTileset = this.$parent.historyTileset;
					if(!self.isStart) { //停止
						return;
					}
					self.historyTilesetStyle(); //历史变迁图层渲染函数										
					if(!self.isStart) { //停止
						return;
					}

					if(self.starIndex < self.maxIndex) {
						self.starIndex++;
						$('.slider-input').jRange('setValue', '' + self.starIndex);
						setTimeout(function() {
							self.historyTilesetAnalysis();

						}, 1000);
					} else {
						return;
					}
				},
				//历史变迁图层渲染函数
				historyTilesetStyle: function() {
					var self = this;
					if(self.historyTileset == undefined || self.historyTileset == null) {
						self.isStart = false;
						var classValue = $("#sliderStart");
						classValue.removeClass("fa-pause-circle-o");
						classValue.addClass("fa-play-circle-o");
						alert("请选中'建筑物单体化图层'");
						return;
					}
					self.historyTileset.style = new Cesium.Cesium3DTileStyle({
						color: {
							evaluateColor: function(feature, result) {
								var color = new Cesium.Color(1, 1, 1, 0.01);
								if(feature == null || feature == undefined) {
									color = new Cesium.Color(1, 1, 1, 0.01);
									return Cesium.Color.clone(color, result);
								}
								var year = feature.getProperty("建筑年代");

								if(year != undefined && year != null) {
									var index = year.split('/');
									if(index != null && index.length >= 2) {
										var indexi = parseFloat(index[1]) / 12 + parseFloat(index[0]);
										if(indexi > self.starIndex) {
											return color;
										}
									}

									color = new Cesium.Color (1,0,0,0.2);
									return Cesium.Color.clone(color, result);
								} else {
									//var color = new Cesium.Color(1, 1, 1, 0);
									return color;
								}
							}
						}
					});
					var classValue = $("#sliderStart");
					if(self.starIndex >= self.maxIndex) {
						classValue.removeClass("fa-pause-circle-o");
						classValue.addClass("fa-play-circle-o");
						this.isStart = false;
					}

				},
				ClearAnalysis: function() { //清除分析
					this.clearDrawingBoard(); //清除测量
					$(".infoview").css("display", "none");
					$(".infoviewHistory").css("display", "none");
					viewer.scene.globe.enableLighting = 0;
					viewer.shadows = 0;
					if(viewer.entities != undefined && viewer.entities != null) {
						viewer.entities.removeAll();
					}
					if(this.historyTileset != undefined && this.historyTileset != null) {
						this.historyTileset.style = new Cesium.Cesium3DTileStyle({
							color: "color() *vec4(1,1,1,0.01)"
						});
						//viewer.scene.primitives.remove(this.historyTileset);
					}
					isVisibilityAnalysis = false;
					isSkylineAnalysis = false;
					this.isStart = false;
					
				},
				stratPlay: function() { //播放日照
					if(viewer != null & scene != null) {
						if(viewer.clock.shouldAnimate = !0, stopTime) {
							viewer.clock.currentTime = stopTime;
						} else {
							var e = $("#selDate").val(),
								t = new Date(e),
								i = $("#startTime").val(),
								a = $("#endTime").val(),
								r = new Date(new Date(t).setHours(Number(i))),
								o = new Date(new Date(t).setHours(Number(a)));
							viewer.scene.globe.enableLighting = !0,
								viewer.shadows = !0,
								viewer.clock.startTime = Cesium.JulianDate.fromDate(r),
								viewer.clock.currentTime = Cesium.JulianDate.fromDate(r),
								viewer.clock.stopTime = Cesium.JulianDate.fromDate(o),
								viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP,
								viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER,
								viewer.clock.multiplier = 1600
						}
					}
				},
				stopPlay: function() { //暂停日照
					if(viewer != null & scene != null) {
						mstopTime = viewer.clock.currentTime,
							viewer.clock.shouldAnimate = !1;
					}
				},
				CloseHtml: function(classv) { //关闭html窗口
					if(classv != undefined && classv != null) {
						if(classv == ".infoview") {
							viewer.scene.globe.enableLighting = 0;
							viewer.shadows = 0;
						}
						var selected = "" + classv;
						$(selected).css("display", "none");
						this.ClearAnalysis();
					}
				},
				setbaselayer: function(i) { //切换地图
					var l = this.baselayers[i];
					if(l != undefined && l != null) {
						if(this.viewer.imageryLayers != null && viewer.imageryLayers.get(0) != undefined && viewer.imageryLayers.get(0) != null) {
							this.viewer.imageryLayers.remove(this.viewer.imageryLayers.get(0), true);
						}
						var imagelayer = new Cesium.ImageryLayer(new Cesium.UrlTemplateImageryProvider({
							url: l.url,
							tilingScheme: new Cesium.WebMercatorTilingScheme(),
							maximumLevel: l.maximumLevel
						}), {
							show: true
						});

						this.viewer.imageryLayers.add(imagelayer, 0);
					}

				},
				printImg: function() { //另存为图片
					if(viewer != null & scene != null) {
						haoutil.loading.show();
						viewer.render();
						haoutil.file.downloadImage("地图截图", this.viewer.canvas);
						haoutil.loading.hide();
					}
				},
				printHtml: function() { //打印
					window.print();
				},
				VideoPlay: function() { //视频投放
					if(viewer != null & scene != null) {
						var video = viewer.entities.add({
							wall: {
								positions: Cesium.Cartesian3.fromDegreesArray([105.39773, 28.89077,
									105.39773, 28.89074
								]),
								maximumHeights: [291, 291],
								minimumHeights: [286, 286],
								//outline : true,
								//outlineColor : Cesium.Color.LIGHTGRAY,
								//outlineWidth : 4,
								//material : Cesium.Color.fromRandom({alpha : 0.7})
							}
						});
						//赋值材质
						var videoElement = document.getElementById('trailer');
						video.wall.material = videoElement;
						videoElement.play();
						//定位经度:105.39757° 纬度:28.89076° 高程:288.89米 朝向:96.6
						viewer.camera.flyTo({
							destination: Cesium.Cartesian3.fromDegrees(105.39757, 28.89076, 288.89),
							orientation: {
								heading: Cesium.Math.toRadians(100), // east,朝向
								pitch: Cesium.Math.toRadians(5), // default value (looking down)俯仰角
								roll: 0 // default value翻滚角
							}
						});
					}
				},
				toggleTerrain: function() {
					if(viewer != null & scene != null) {
						var terrainProvider;
						if(viewer.terrainProvider && viewer.terrainProvider._layers && viewer.terrainProvider._layers[0] && viewer.terrainProvider._layers[0].resource && viewer.terrainProvider._layers[0].resource._url) {
							//add a simple terain so no terrain shall be preseneted
							terrainProvider = new Cesium.EllipsoidTerrainProvider({});
						} else {
							//enable the terain
							terrainProvider = new Cesium.CesiumTerrainProvider({
								url: MapConfig.demurl,
								requestWaterMask: true
							});
						}
						scene.terrainProvider = terrainProvider;
					}
				}

			}
		}

		return sdtool;

	});