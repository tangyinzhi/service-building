define(["rtext!./map3d_cesium.html", 'vue',"../config/config", 'cesium', "rcss!./map3d_cesium.css"], function(html, vue,MapConfig, cs) {

	var Map3d = {
		template: html,
		data: function() {
			return {
				baselayers: MapConfig.baselayers,
				_baselayer: null,
				selectbase: true
			};
		},
		mounted: function() {
			var self = this;

			var defaultiamge = this.baselayers[1];

			//cesium 1.45 之后会自动检测nodejs环境，去支持，因为我们一直用的外部require，所以这类要返回false
			Cesium.FeatureDetection.isNodeJs = function() {
				return false;
			};
			var terrainProvider = new Cesium.CesiumTerrainProvider({
				url: MapConfig.demurl
			});
			this.viewer = new Cesium.Viewer('map3d', {
				terrainProvider: terrainProvider, //高程
				baseLayerPicker: false,
				geocoder: false,
				homeButton: false,
				timeline: false,
				navigationHelpButton: false,
				animation: false,
				sceneModePicker: true,
				selectionIndicator: true,

				imageryProvider: new Cesium.UrlTemplateImageryProvider({
					url: this.baselayers[0].url,
					tilingScheme: new Cesium.WebMercatorTilingScheme(),
					maximumLevel: 20
				})
			});
			
			//imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
			//    url: 'http://192.168.30.55:6080/arcgis/rest/services/DOM2019/MapServer'
			//}),

			var viewer = this.viewer;


			viewer.scene.context._colorBufferFloat = true;
			
			if(viewer.scene._view.oit) {
				viewer.scene._view.oit._translucentMRTSupport = true;
				viewer.scene._view.oit._translucentMultipassSupport = true;
			}

			//this.viewer.imageryLayers.removeAll();

			//this.baselayer = this.baselayers[0];

			var eventhandler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);

			eventhandler.setInputAction(
				function(movement) {

					var position = self.pickTerrain(movement.endPosition);
					if(!position)
						return;
					position = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);

					self.$parent.$emit('mousepos', {
						lat: Cesium.Math.toDegrees(position.latitude),
						lng: Cesium.Math.toDegrees(position.longitude),
						height: position.height
					});
					//console.log(position);

				},
				Cesium.ScreenSpaceEventType.MOUSE_MOVE
			);
		},
		computed: {

			baselayer: {
				get: function() {

					return this._baselayer;
				},
				set: function(l) {
					if(this._baselayer) {

						this.viewer.imageryLayers.remove(this.viewer.imageryLayers.get(0), true);
					}

					if(l === "") {
						//取消所有底图
						this._baselayer = null;
					} else /*if(l.url.indexOf("tianditu") < 0 || l.url.indexOf("tk")>0) */ {
						this._setbaselayer(l);
					}
					/*
					else{
					    var self  = this;
					    $.ajax({
					        url: "http://www.tianditu.gov.cn/static/config.js",
					        type: "get",
					        datatype: "script",
					        success: function(data) {
					           window.eval(data);

					           //var key = window.TDT_ENV.TOKENS["map.tianditu.gov.cn"].key;
					           var key = '';
					           l.url += "&tk=" + key;
					           self._setbaselayer(l);
					        }
					    });
					}
					*/
				}
			},
			wireframe: {
				get: function() {
					var globe = this.viewer.scene.globe;
					return globe._surface.tileProvider._debug.wireframe;
				},
				set: function(val) {
					var globe = this.viewer.scene.globe;
					globe._surface.tileProvider._debug.wireframe = val;
				}
			},
			depthtest: {
				get: function() {
					var globe = this.viewer.scene.globe;
					return globe.depthTestAgainstTerrain;
				},
				set: function(val) {
					var globe = this.viewer.scene.globe;
					globe.depthTestAgainstTerrain = val;
				}

			}
		},
		methods: {
			_setbaselayer: function(l) {
				var imagelayer = new Cesium.ImageryLayer(new Cesium.UrlTemplateImageryProvider({
					url: l.url,
					tilingScheme: new Cesium.WebMercatorTilingScheme(),
					maximumLevel: l.maximumLevel
				}), {
					show: true
				});

				this.viewer.imageryLayers.add(imagelayer, 0);
				this._baselayer = l;
			},
			show: function() {
				this.viewer.resize();
			},
			pickTerrain: function(wndpos) {
				var ray = this.viewer.camera.getPickRay(wndpos);
				var pos = this.viewer.scene.globe.pick(ray, this.viewer.scene);
				if(!pos)
					return;
				var cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(pos);

				return pos;
			},
			addLayer: function(l) {
				if(l.type == 'model') {
					return this.addModel(l);
				} else if(l.type == 'image') {
					return this.addImage(l);
				} else if(l.type == 'terrain') {
					return this.changeTerrain(l);
				}
				return null;
			},
			parsevValue: function(p) {
				p = p.replace('(', '');
				p = p.replace(')', '');
				p = p.split(',');

				var v = [];
				$(p).each(function(idx, s) {
					v.push(parseFloat(s));
				});
				return v;
			},
			addModel: function(m) {

				var ppp = JSON.parse(m.param);

				//获取地图中心点
				var position;
				if(ppp.position) {

					var v = this.parsevValue(ppp.position);

					position = new Cesium.Cartesian3(v[0], v[1], v[2]);
				} else {

					var cen = new Cesium.Cartesian2(this.viewer.canvas.width * 0.5, this.viewer.canvas.height * 0.5);
					position = this.pickTerrain(cen);

					//position = this.viewer.scene.camera.pickEllipsoid();
				}

				var orientation;
				if(ppp.orientation) {
					var v = this.parsevValue(ppp.orientation);
					orientation = new Cesium.Quaternion(v[0], v[1], v[2], v[3]);
				} else {
					var heading = Cesium.Math.toRadians(0);
					var pitch = 0;
					var roll = 0;
					var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
					orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);
				}

				var entity = this.viewer.entities.add({
					name: m.name,
					position: position,
					orientation: orientation,
					model: {
						uri: ppp.url,
						//minimumPixelSize: 128,
						scale: 1.0,
						allowPicking: false,
						heightReference: Cesium.HeightReference.NONE
						//maximumScale: 20000
					}
				});

				var self = this;
				//获取参数
				entity.xbsjGetParam = function() {
					var p = {
						position: this.position.getValue(0).toString(),
						orientation: this.orientation.toString(),
						url: ppp.url
					}

					return JSON.stringify(p);
				}.bind(entity);

				//定位
				entity.xbsjLocate = function() {
					self.viewer.flyTo(this);
				}.bind(entity);

				//删除
				entity.xbsjRemove = function() {
					self.viewer.entities.remove(this);
				}.bind(entity);

				return entity;
			},
			newImage: function(ppp) {
				var imagelayer = new Cesium.ImageryLayer(new Cesium.UrlTemplateImageryProvider({
					url: ppp.url,
					credit: '',
					tilingScheme: new Cesium.WebMercatorTilingScheme(),
					maximumLevel: ppp.maxZoom
				}), {
					show: true
				});

				var self = this;
				//获取参数
				imagelayer.xbsjGetParam = function() {

					return JSON.stringify(ppp);
				}.bind(imagelayer);

				//定位
				imagelayer.xbsjLocate = function() {
					if(!ppp.infourl)
						return;
					//self.viewer.flyTo(this);
					if(!this.xbsjRange) {
						$.ajax({
							url: ppp.infourl,
							type: "get",
							datatype: "json",
							success: function(data) {
								if(data.status == 'ok') {

									var west = Cesium.Math.toRadians(data.layer.west);
									var south = Cesium.Math.toRadians(data.layer.south);
									var east = Cesium.Math.toRadians(data.layer.east);
									var north = Cesium.Math.toRadians(data.layer.north);
									imagelayer.xbsjRange = new Cesium.Rectangle(west, south, east, north);
									self.viewer.scene.camera.flyTo({

										destination: imagelayer.xbsjRange
									});
								}
							}
						});
					} else {
						self.viewer.scene.camera.flyTo({

							destination: this.xbsjRange
						});
					}

				}.bind(imagelayer);

				//删除
				imagelayer.xbsjRemove = function() {
					self.viewer.imageryLayers.remove(imagelayer);
				}.bind(imagelayer);

				return imagelayer;
			},

			addImage: function(ppp) {

				var imagelayer = this.newImage(ppp);

				this.viewer.imageryLayers.add(imagelayer);

				return imagelayer;
			},
			changeTerrain: function(ppp) {

				var terrainLayer = new Cesium.CesiumTerrainProvider({
					url: ppp.url
				});

				var self = this;
				//获取参数
				terrainLayer.xbsjGetParam = function() {

					return JSON.stringify(ppp);
				}.bind(terrainLayer);

				//定位
				terrainLayer.xbsjLocate = function() {
					if(!ppp.infourl)
						return;
					//self.viewer.flyTo(this);
					if(!this.xbsjRange) {
						$.ajax({
							url: ppp.infourl,
							type: "get",
							datatype: "json",
							success: function(data) {
								if(data.status == 'ok') {

									var west = Cesium.Math.toRadians(data.layer.west);
									var south = Cesium.Math.toRadians(data.layer.south);
									var east = Cesium.Math.toRadians(data.layer.east);
									var north = Cesium.Math.toRadians(data.layer.north);
									terrainLayer.xbsjRange = new Cesium.Rectangle(west, south, east, north);
									self.viewer.scene.camera.flyTo({

										destination: terrainLayer.xbsjRange
									});
								}
							}
						});
					} else {
						self.viewer.scene.camera.flyTo({

							destination: this.xbsjRange
						});
					}

				}.bind(terrainLayer);

				//删除
				terrainLayer.xbsjRemove = function() {
					//self.viewer.imageryLayers.remove(terrainLayer);
					self.viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
				}.bind(terrainLayer);

				self.viewer.terrainProvider = terrainLayer;

				return terrainLayer;

			},
			add3dtiles: function(ppp) {

				var self = this;

				var tileset = new Cesium.Cesium3DTileset({

					url: ppp.url
				});

				self.viewer.scene.primitives.add(tileset);

				var pos = [120.948295, 30.821498, 4];
				var angle = 0;
				var scale = 1;
				var angleX = 0;

				function setRatotion(a) {
					angle = a;

					updateMatrix();
				}

				function setRatotionX(a) {
					angleX = a;

					updateMatrix();
				}

				function setPos(lon, lat, h) {
					pos = [lon, lat, h];

					updateMatrix();
				}

				function setScale(s) {
					scale = s;

					updateMatrix();
				}

				function updateMatrix() {
					var transmat = Cesium.Matrix4.fromScale(new Cesium.Cartesian3(scale, scale, scale), transmat);

					var globaltrans = Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(pos[0], pos[1], pos[2]));

					var rotation = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationZ(angle * Math.PI / 180));

					var rotationX = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationX(angleX * Math.PI / 180));

					Cesium.Matrix4.multiply(globaltrans, transmat, transmat);
					Cesium.Matrix4.multiply(transmat, rotation, transmat);
					Cesium.Matrix4.multiply(transmat, rotationX, transmat);

					console.log("pos：" + pos);
					console.log("angle：" + angle);
					console.log("angleX：" + angleX);
					console.log("scale：" + scale);
					tileset.modelMatrix = transmat;
				}
				updateMatrix();

				//获取参数
				tileset.xbsjGetParam = function() {

					return JSON.stringify(ppp);
				}.bind(tileset);

				//定位
				tileset.xbsjLocate = function() {

					// self.viewer.zoomTo(tileset);

					self.viewer.camera.viewBoundingSphere(tileset.boundingSphere, new Cesium.HeadingPitchRange(0.0, -1.0, 50.0));
					self.viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);

				}.bind(tileset);

				tileset.readyPromise.then(tileset.xbsjLocate).otherwise(function(error) {
					throw(error);
				});

				//删除
				tileset.xbsjRemove = function() {
					self.viewer.scene.primitives.remove(tileset);
				}.bind(tileset);

				return tileset;

			},
			addRangeLine: function(west, south, east, north) {

				var polyline = this.viewer.entities.add({
					polyline: {
						positions: Cesium.Cartesian3.fromDegreesArray([west, south, west, north, east, north, east, south, west, south]),
						width: 2,
						//material: new Cesium.PolylineDashMaterialProperty({
						//     color: Cesium.Color.RED
						// })
						material: Cesium.Color.RED
					}
				});

				return polyline;

			}
		}
	}

	return Map3d;

});