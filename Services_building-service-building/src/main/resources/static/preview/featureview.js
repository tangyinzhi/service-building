define(['cesium', 'layer',  "rcss!./featureview.css"], function(ce, layer) {

	function getBimHtml(pickedFeature) {
		if(!pickedFeature.tileset.properties || !pickedFeature.tileset.properties.length)
			return false;

		var fileParams;

		//如果有文件名，那么依据文件名
		if(pickedFeature.hasProperty("file")) {
			var file = pickedFeature.getProperty("file");

			for(var i = 0; i < pickedFeature.tileset.properties.length; i++) {
				var params = pickedFeature.tileset.properties[i];
				if(params.file == file) {
					fileParams = params.params;
				}
			}
		}
		//直接取第一个
		else {
			fileParams = pickedFeature.tileset.properties[0].params;
		}

		if(!fileParams)
			return false;

		// 名称和 id
		var html = '<table class="cesium-infoBox-defaultTable"><tbody>';
		//  html += '<tr><th>名称(name)</th><td>' + pickedFeature.getProperty("name") + '</td></tr>';

		//  html += '<tr><th>楼层(LevelName)</th><td>' + pickedFeature.getProperty("LevelName") + '</td></tr>';

		//  html += '<tr><th>分类(CategoryName)</th><td>' + pickedFeature.getProperty("CategoryName") + '</td></tr>';

		//  html += '<tr><th>族(FamilyName)</th><td>' + pickedFeature.getProperty("FamilyName") + '</td></tr>';

		//  html += '<tr><th>族类型(FamilySymbolName)</th><td>' + pickedFeature.getProperty("FamilySymbolName") + '</td></tr>';

		html += '<tr><th>id</th><td>' + pickedFeature.getProperty("id") + '</td></tr>'

		if(pickedFeature.hasProperty("sid")) {

			html += '<tr><th>sid</th><td>' + pickedFeature.getProperty("sid") + '</td></tr>'
		}

		if(pickedFeature.hasProperty("file")) {

			html += '<tr><th>文件名(file)</th><td>' + pickedFeature.getProperty("file") + '</td></tr>'
		}

		//依据group分类
		var groups = {

		};

		function getValue(value, defp) {
			if(defp.type == "YesNo")
				return value == 1 ? '是' : '否';
			if(defp.type == "Length")
				return value.toFixed(3) + 'm';
			if(defp.type == "Area")
				return value.toFixed(3) + '㎡';
			if(defp.type == "Volume")
				return value.toFixed(3) + 'm³';

			return value;
		}

		function addGroup(name, value) {

			var defp;

			for(var i = 0; i < fileParams.length; i++) {
				var fp = fileParams[i];
				if(name == fp.name) {
					defp = fp;
					break;
				}
			}
			if(!defp)
				return;

			var rows = groups[defp.group];

			if(!rows) {
				rows = [];
			}
			var row = '<tr><th>' + defp.name + '</th><td>' + getValue(value, defp) + '</td></tr>';
			rows.push(row);
			groups[defp.group] = rows;
		}

		function groupName(group) {
			if(group == "PG_IDENTITY_DATA")
				return "标识数据";
			if(group == "PG_GEOMETRY")
				return "尺寸标注";
			if(group == "PG_PHASING")
				return "阶段化";
			if(group == "PG_CONSTRAINTS")
				return "约束";
			if(group == "INVALID")
				return '其他';
			if(group == "PG_MATERIALS")
				return '材质和装饰';
			if(group == "PG_CONSTRUCTION")
				return '构造';

			return group;
		}

		function parseProperties(properties) {
			try {
				var sets = JSON.parse(properties);

				for(var i = 0; i < sets.length; i++) {

					var set = sets[i];

					var rows = groups[set.name];
					if(!rows)
						rows = [];
					for(var j = 0; j < set.properties.length; j++) {

						var p = set.properties[j];

						var row = '<tr><th>' + p.name + '</th><td>' + (p.value || "") + '</td></tr>';
						rows.push(row);
					}
					groups[set.name] = rows;

				}
			} catch(ex) {
				console.log("parse _properties failed:" + ex);
			}
		}

		var names = pickedFeature._content.batchTable.getPropertyNames(pickedFeature._batchId);
		for(var i = 0; i < names.length; i++) {
			var n = names[i];

			//对于这种属性
			if(n == "_properties") {
				parseProperties(pickedFeature.getProperty(n));
			}
			//其他属性
			else {
				addGroup(n, pickedFeature.getProperty(n));
			}

		}

		for(group in groups) {

			html += '<tr><th colspan="2">' + groupName(group) + '</th></tr>';;

			var rows = groups[group];
			for(var i = 0; i < rows.length; i++) {
				html += rows[i];
			}

		}

		return html;

	}
	var colorHighlight =new Cesium.Color (1,1,0,0.2);
    var colorSelected = new Cesium.Color (0,1,0,0.2);
    var result;
   // colorHighlight = Cesium.Color.clone(colorHighlight, result);
   // colorSelected = Cesium.Color.clone(colorSelected, result);
	var featureViewer = {
		colorHighlight:colorHighlight,
		colorSelected:colorSelected,
		setMouseOver: function(v) {

			if(v) {
				this.viewer.screenSpaceEventHandler.setInputAction(this.onMouseMove, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
			} else {

				this.restoreHighlight();

				this.nameOverlay.style.display = 'none';
				this.viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
			}
		},
		setMouseClick: function(v) {

			if(v) {
				this.orginClickHandler = this.viewer.screenSpaceEventHandler.getInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
				this.viewer.screenSpaceEventHandler.setInputAction(this.onLeftClick, Cesium.ScreenSpaceEventType.LEFT_CLICK);
			} else {

				//设置为原来的
				this.viewer.screenSpaceEventHandler.setInputAction(this.orginClickHandler, Cesium.ScreenSpaceEventType.LEFT_CLICK);
			}
		},
		install: function(viewer) {

			var nameOverlay = document.createElement('div');
			viewer.container.appendChild(nameOverlay);
			nameOverlay.className = 'backdrop';
			nameOverlay.style.display = 'none';
			nameOverlay.style.position = 'absolute';
			nameOverlay.style.bottom = '0';
			nameOverlay.style.left = '0';
			nameOverlay.style['pointer-events'] = 'none';
			nameOverlay.style.padding = '4px';
			nameOverlay.style.backgroundColor = 'black';
			this.nameOverlay = nameOverlay;

			var selected = {
				feature: undefined,
				originalColor: new Cesium.Color()
			};

			var highlighted = {
				feature: undefined,
				originalColor: new Cesium.Color()
			};

			selectedEntity = new Cesium.Entity();

			this.viewer = viewer;

			this.restoreHighlight = function() {
				// If a feature was previously highlighted, undo the highlight
				if(Cesium.defined(highlighted.feature)) {

					try {
						highlighted.feature.color = highlighted.originalColor;

					} catch(ex) {

					}
					highlighted.feature = undefined;
				}
			}

			this.onMouseMove = function(movement) {
				//$(".cesium-infoBox").css("display","block");
				if(isRoaming) {
					self.restoreHighlight();
					if(Cesium.defined(selected.feature)) {

						try {
							selected.feature.color = selected.originalColor;

						} catch(ex) {

						}
						selected.feature = undefined;
					}
					//Cesium.Color.clone(highlighted.originalColor, selected.originalColor);
					//highlighted.feature = undefined;
					//$(".cesium-infoBox").css("display","none");
					viewer.selectedEntity = null;
					nameOverlay.style.display = 'none';
					return;
				} else {

				}
				self.restoreHighlight();

				// Pick a new feature
				var pickedFeature = viewer.scene.pick(movement.endPosition);
				if(!Cesium.defined(pickedFeature)) {
					nameOverlay.style.display = 'none';
					return;
				}

				if(!Cesium.defined(pickedFeature.getProperty)) {
					nameOverlay.style.display = 'none';
					return;
				}
				// A feature was picked, so show it's overlay content

				var name = pickedFeature.getProperty('建筑名称');
				if(!Cesium.defined(name)) {
					name = pickedFeature.getProperty('name');
				}
				if(!Cesium.defined(name)) {
					name = pickedFeature.getProperty('Name');
				}
				if(name == '') {
					nameOverlay.style.display = 'none';
					return;
				}

				nameOverlay.style.display = 'block';
				nameOverlay.style.bottom = viewer.canvas.clientHeight - movement.endPosition.y + 'px';
				nameOverlay.style.left = movement.endPosition.x + 'px';

				nameOverlay.textContent = name;

				// Highlight the feature if it's not already selected.
				if(pickedFeature !== selected.feature) {
					highlighted.feature = pickedFeature;
					Cesium.Color.clone(pickedFeature.color, highlighted.originalColor);
					pickedFeature.color = self.colorHighlight;
				}
			};

			var self = this;
			this.onLeftClick = function(movement) {
				if(isRoaming) {
					return;
				}
				// If a feature was previously selected, undo the highlight
				if(Cesium.defined(selected.feature)) {

					try {
						selected.feature.color = selected.originalColor;

					} catch(ex) {

					}
					selected.feature = undefined;
				}

				// Pick a new feature
				var pickedFeature = viewer.scene.pick(movement.position);
				if(!Cesium.defined(pickedFeature)) {
					self.orginClickHandler(movement);
					return;
				}

				// Select the feature if it's not already selected
				if(selected.feature === pickedFeature) {
					return;
				}

				if(!Cesium.defined(pickedFeature.getProperty))
					return;

				selected.feature = pickedFeature;

				// Save the selected feature's original color
				if(pickedFeature === highlighted.feature) {
					Cesium.Color.clone(highlighted.originalColor, selected.originalColor);
					highlighted.feature = undefined;
				} else {
					Cesium.Color.clone(pickedFeature.color, selected.originalColor);
				}

				// Highlight newly selected feature
				pickedFeature.color = self.colorSelected;

				// Set feature infobox description

				var featureName = pickedFeature.getProperty('建筑物名称');
				selectedEntity.name = featureName;
				selectedEntity.description = 'Loading <div class="cesium-infoBox-loading"></div>';
				viewer.selectedEntity = selectedEntity;

				var names = pickedFeature._content.batchTable.getPropertyNames(pickedFeature._batchId);

				// 普通3dtiles 获取属性表格
				var html = getBimHtml(pickedFeature);
                var featureFeilds = ["建筑名称","详细地址","行政区划","建筑年代","基底面积","建筑面积","住宅建筑户","地上空间利","地下空间利","建筑层数_1","建筑层数（","建筑层高","建筑状态",
                    "建筑用途","物业名称"];
                if(!html) {
                    html = '<table class="cesium-infoBox-defaultTable"><tbody>';
					var isBuild = false;
					var htmls=[];
                    for(var i = 0; i < featureFeilds.length; i++) {
                        var n = featureFeilds[i];
                        if(featureFeilds.indexOf(n)<0){
                            continue;
                        }
                        isBuild = true;
                        var htmlvalu ="";
                        if(pickedFeature.getProperty(n)){
                        	 htmlvalu = '<tr><th>' + n + '</th><td>' + pickedFeature.getProperty(n) + '</td></tr>';
                       		
                        }
                        else{
                        	 htmlvalu = '<tr><th>' + n + '</th><td>' + "" + '</td></tr>';
                        }
                        html += htmlvalu;
                       
                    }
//                  for(var j = 0; j < htmls.length; j++) {
//                  	if(htmls[j]){
//                  		html += htmls[j];
//                  	}
//                       
//                  }
                    if(isBuild){
                        html += '<tr><th>' + "更多" + '</th><td id=\'fujian\'>' + "..." + '</td></tr>';
					}
					html += '</tbody></table>';
				}
				var objectid = pickedFeature.getProperty("唯一标识");
				selectedEntity.description = html;
				//window.onload=function(){
					setTimeout(function(){ 
						document.getElementsByClassName("cesium-infoBox-iframe")[0].contentWindow.document.getElementById("fujian").addEventListener("click", function(){
							fujianclick(objectid);
							return false;
						});

					}, 500);
					
				//}
				
			}

			this.setMouseOver(true);
			this.setMouseClick(true);
		}

	};

	function fujianclick(objectid){
		if(layer == undefined || layer == null||objectid == undefined || objectid == null) {
			return;
		}
		layer.open({
			title: '查看建筑物信息',
			type: 2,
			maxmin: false,
			shade: 0.5,
			offset: '20px',
			area: ['750px', '85%'],
			// content: 'buildname_info.html?id=' + buildId +"&type=look",
			content: '../preview/buildName_info_read.html?id='+objectid+'&type=look&visual=true',
			closeBtn: 1,
			yes: function(index, layero) { //弹出框的位置
				var newpsw = window[layero.find('iframe')[0]['name']];
				var value = newpsw.addInfo(0);
			},
			success: function(layero) { //弹出框的位置--一开始进去就请求的方法
			}
		});
	};

	return featureViewer;

});　　　