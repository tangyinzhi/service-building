define(["rtext!./titlebar.html", "rcss!./titlebar.css", 'vue', "../util/xbsjelectron", "bootstrap", "../util/xbsjutil", 'jquerybin'],
    function(html, css, vue, xe, bs, util) {

        var Module = {
            template: html,
            data: function() {
                return {
                    user: {
                        phone: '',
                        password: ''
                    },
                    version: '',
                    config: {

                    },
                    machinecode: '',
                    authinfo: {

                    },
                    //rgserver: "http://localhost:8888",
                    rgserver: "https://www.cesiumlab.com",
                    updates:[{
                        version: '2019年5月22日 V1.5.14',
                        items: [ "解决ui上bug"]
                    },{
                        version: '2019年5月21日 V1.5.13',
                        items: [ "重写倾斜处理工具，支持顶层块合并，多线程处理，多输入数据合并,理论上支持城市级倾斜数据的处理，有数据的自己测，大家久等了","建筑物矢量面工具增加根据条件设置纹理，解决一些错误数据引起的处理异常问题"]
                    },{
                        version: '2019年4月4日 V1.5.12',
                        items: [ "修改rvt导出link的bug","修改bim处理的材质"]
                    },{
                        version: '2019年4月1日 V1.5.11',
                        items: [ "解决UI bug"]
                    },{
                        version: '2019年3月25日 V1.5.10',
                        items: [ "建筑物矢量面工具增加贴图效果","其他工具解决pbr材质设置参数设置错误的bug"]
                    },{
                        version: '2019年3月15日 V1.5.9',
                        items: [ "影像处理工具解决缝隙问题","建筑物矢量面工具解决内存泄漏问题","dgn导出插件解决部分导出bug，请拷贝覆盖后再测试"]
                    },{
                        version: '2019年3月7日 V1.5.8',
                        items: [ "重写影像处理工具，支持索引色影像，支持大范围高精度影像处理","地形处理工具解决镶嵌台阶问题","更新dgn导出插件,请拷贝覆盖"]
                    },  {
                        version: '2019年2月28日 V1.5.7',
                        items: [ "解决地形处理部分区域异常的bug","解决ui的部分bug"]
                    }, {
                        version: '2019年2月26日 V1.5.6',
                        items: [ "重写地形处理工具，普通硬盘上处理速度翻百倍，ssd硬盘翻10倍，支持不同精度地形数据自动镶嵌","解决rvt转clm工具页面不能选择输出的bug"]
                    }, {
                        version: '2019年2月22日 V1.5.5',
                        items: [ "增加revit转clm工具&插件(测试近乎百个rvt，确保不丢构件)","bim处理&场景处理解决内存泄漏bug","增加dgn转clm测试插件"]
                    },{
                        version: '2019年1月23日 V1.5.4',
                        items: [ "解决若干bug"]
                    },{
                        version: '2019年1月8日 V1.5.3',
                        items: [ "倾斜处理解决内存泄漏问题，增加强制双面属性"]
                    },{
                        version: '2018年11月21日 V1.5.2',
                        items: [ "场景处理修正由于数据错误导致的一个cesium提示的uniforms错误"]
                    },{
                        version: '2018年11月19日 V1.5.1',
                        items: [ "场景处理和BIM处理修正简单光照下 透明贴图 和 强制双面的问题"]
                    },{
                        version: '2018年11月17日 V1.5.0',
                        items: [  "内置cesium1.51,所有工具升级支持到cesium1.51","修改地形下载工具，最新版cesium地形可以下载了","场景处理：1，生成完整场景树,强烈推荐max里使用autodesk collada导出dae处理。2，解决draco压缩和自定义shader一起设置引起的崩溃","倾斜处理：1，支持三角网压缩和纹理压缩。2，性能小优化","bim处理解决revit插件bug以及部分优化"]
                    },{
                        version: '2018年11月15日 V1.4.9',
                        items: [  "更新bim处理","增加自动更新配置","此版本是支持cesium1.48的最后一个版本"]
                    },{
                        version: '2018年9月14日 V1.4.8',
                        items: [  "更新bim处理，修改插件结构，支持3种ifc读取库","更新影像处理"]
                    },{
                        version: '2018年8月22日 V1.4.7',
                        items: [  "更新bim处理，更新revit插件，支持ifc双引擎","解决UI bug"]
                    },{
                        version: '2018年8月15日 V1.4.6',
                        items: [  "场景处理特别更新"]
                    },{
                        version: '2018年8月10日 V1.4.5',
                        items: [ "cesiumlab中cesium更新到1.48版本","倾斜处理增加单一矩阵模式、增加对altizure输出结构支持","场景处理增加属性挂接功能、优化光照效果、解决透明问题","BIM数据处理更新插件、优化光照效果、解决部分BUG","感谢大家对cesiumlab的长久支持"]
                    },{
                        version: '2018年7月10日 V1.4.4',
                        items: [ "cesiumlab中cesium更新到1.47版本","建筑物矢量面工具功能增强，支持生成分类(classification)3dtiles数据"]
                    },{
                        version: '2018年7月7日 V1.4.3',
                        items: [ "场景处理增加通过文件指定对象经纬度功能","场景处理输出scenetree.json，支持预览的时候列表选择定位","更新bim导出插件"]
                    },{
                        version: '2018年6月30日 V1.4.2',
                        items: [ "场景处理增加draco和crn压缩"]
                    },{
                        version: '2018年6月25日 V1.4.1',
                        items: [ "解决一个打包错误引起的bim工具不可用","解决bim导出的中文路径引起的处理失败的问题"]
                    },{
                        version: '2018年6月24日 V1.4.0',
                        items: [ "增加BIM数据处理的工具及解决方案","优化场景处理，并放开几何误差比率，精简比率，分块阈值等三个参数"]
                    },{
                        version: '2018年6月11日 V1.3.15',
                        items: ["建筑面处理解决一个崩溃bug和高度比例设置无效bug，对integer64字段强制存储为字符串", "地形处理解决nodata的一个问题和不同精度地形拼接的问题" , "地形处理增加watermask(付费服务)"]
                    }, {
                        version: '2018年5月30日 V1.3.14',
                        items: ["紧急修复预览界面的问题", "解决osgb转换的一个崩溃问题"]
                    }, {
                        version: '2018年5月30日 V1.3.13',
                        items: ["优化部分UI操作", "3dtiles预览增加了第一人称浏览模式(键盘操作)"]
                    }, {
                        version: '2018年5月28日 V1.3.12',
                        items: ["场景处理解决一个由于tga纹理过多引起的问题、一个由于索引异常引起的崩溃、增加三角网精简配置"]
                    }, {
                        version: '2018年5月26日 V1.3.11',
                        items: ["场景处理的抽稀阈值微调，避免明显缺面"]
                    }, {
                        version: '2018年5月25日 V1.3.10',
                        items: ["一个小bug"]
                    }, {
                        version: '2018年5月24日 V1.3.9',
                        items: ["第二次大幅度优化场景处理,支持模型的空间参考变换", "解决cesiumlab预览较慢的问题，cesiumlab引用的cesium升级到1.45", "解决影像处理透明的问题"]
                    }, {
                        version: '2018年5月15日 V1.3.8',
                        items: ["倾斜处理增加海量模式", "解决地形影像投影转换错误的问题", "解决场景处理name顺序错误的问题", "解决cesiumlab启动在win7下报错问题", "最近精力有限，bug积累的比较多，抱歉了"]
                    }, {
                        version: '2018年5月9日 V1.3.7',
                        items: ["重新定义授权，支持单机文件和USB key两种离线授权", "场景转换工具解决ie报错、空mesh的bug", "建筑面处理增加对multipolygon的支持"]
                    }, {
                        version: '2018年5月3日 V1.3.6',
                        items: ["大幅度优化场景数据处理工具，请各位拿数再测试"]
                    }, {
                        version: '2018年4月28日 V1.3.5',
                        items: ["地形数据处理增加ctb算法，并解决台阶问题", "倾斜部分解决小bug"]
                    }, {
                        version: '2018年4月26日 V1.3.4',
                        items: ["倾斜数据处理工具增加三角形绕向反转配置，兼容photomesh输出的osgb数据"]
                    }, {
                        version: '2018年4月24日 V1.3.3',
                        items: ["倾斜数据处理工具进一步增强", "取消超图服务下载"]
                    }, {
                        version: '2018年4月24日 V1.3.2',
                        items: ["场景处理工具增加tga纹理格式支持", "场景处理工具增加汉字编码设置", "建筑物处理工具解决一处崩溃bug"]
                    }, {
                        version: '2018年4月23日 V1.3.1',
                        items: ["手欠，少打了else，导致其他功能不可用"]
                    }, {
                        version: '2018年4月22日 V1.3.0',
                        items: ["增加场景（obj，dae，fbx）转3dtiles工具"]
                    }, {
                        version: '2018年4月18日 V1.2.15',
                        items: ["解决一处导致地形影像处理卡住的bug"]
                    }, {
                        version: '2018年4月18日 V1.2.14',
                        items: ["解决倾斜转换工具的纹理变色问题"]
                    }, {
                        version: '2018年4月14日 V1.2.13',
                        items: ["解决点云工具不支持中文输出路径的bug"]
                    }, {
                        version: '2018年4月14日 V1.2.12',
                        items: ["服务器切换到https://www.cesiumlab.com", "解决由于服务器切换导致的auth错误的bug"]
                    }, {
                        version: '2018年4月13日 V1.2.11',
                        items: ["osgb2tiles解决异常box的bug"]
                    }, {
                        version: '2018年4月13日 V1.2.10',
                        items: ["osgb2tiles目录结构解析兼容性增强", "dataserver支持发布arcgis散列切片(3857投影)"]
                    }, {
                        version: '2018年4月11日 V1.2.9',
                        items: ["解决点云处理不支持自定义投影的bug"]
                    }, {
                        version: '2018年4月11日 V1.2.8',
                        items: ["osgb2tiles支持更多的纹理压缩格式"]
                    }, {
                        version: '2018年4月11日 V1.2.7',
                        items: ["解决dataserver发布文件夹无名称的bug", "解决dataserver连接mongodb无法发布服务的bug", "界面显示小bug"]
                    }, {
                        version: '2018年4月10日 V1.2.6',
                        items: ["增加基于mapshaper的矢量数据浏览、编辑、格式转换工具", '增加高德地图数据下载', '解决中文用户名导致的auth错误', "继续解决地形影像长时间任务挂起的bug"]
                    }, {
                        version: '2018年4月9日 V1.2.5',
                        items: ['解决配置文件无效的bug', "推出内网使用的免登陆离线版，感谢大家支持"]
                    }, {
                        version: '2018年4月7日 V1.2.4',
                        items: ['osgb导出3dtiles支持无光照效果:采用自定义shader,去除cesium光照计算，保持倾斜照片的原始色彩,降低b3dm存储空间，提升渲染速度', "建筑物导出3dtiles支持tileset.json分级引用，处理加载百万建筑面无压力"]
                    }, {
                        version: '2018年4月4日 V1.2.3',
                        items: ['osgb导出3dtiles支持dds纹理转png存储', "进一步兼容osgb目录，支持超图导出形式"]
                    }, {
                        version: '2018年4月4日 V1.2.2',
                        items: ['改进地形、影像任务界面，支持批量配置和删除']
                    }, {
                        version: '2018年4月4日 V1.2.1',
                        items: ['修正地形、影像工具最大级别以及nodata无效的bug', '修正影像预览的bug', '增强osgb目录判定的兼容性']
                    }, {
                        version: '2018年4月3日 V1.2.0',
                        items: ['增加osgb倾斜数据转3dtiles工具', '取消dataserver的mongodb依赖', '增加模型浏览器和模型格式转换器']
                    }, {
                        version: '2018年3月29日 V1.1.3',
                        items: ['建筑面转3dtiles修改部分bug，增加可处理的建筑数量显示']
                    }, {
                        version: '2018年3月28日 V1.1.2',
                        items: ['建筑面转3dtiles修改部分bug，增加对无投影数据的支持（手动选择投影），感谢大家提供测试数据']
                    }, {
                        version: '2018年3月28日 V1.1.1',
                        items: ['建筑面转3dtiles支持侧面贴图']
                    }, {
                        version: '2018年3月27日 V1.1.0',
                        items: ['重磅增加建筑矢量面转3dtiles工具', '3dtiles预览增加样式编辑器']
                    }, {
                        version: '2018年3月23日 V1.0.7',
                        items: ['新增超图地形下载', '部分小bug']
                    }, {
                        version: '2018年3月20日 V1.0.6',
                        items: ['更新点云处理工具']
                    }, {
                        version: '2018年3月20日 V1.0.5',
                        items: ['解决地形处理卡住的bug', '如果有任务运行，不能强制退出，必须手动停止任务后才可退出']
                    }, {
                        version: '2018年3月20日 V1.0.4',
                        items: ['解决数据下载工具无法选择级别范围的bug']
                    }, {
                        version: '2018年3月20日 V1.0.3',
                        items: ['点云处理，支持地理坐标变换', '添加完整的用户手册']
                    }]
                };
            },
            props: ['title', 'subtitle', 'nohome', 'needlogin'],

            created: function() {

            },
            mounted: function() {




                $('[data-toggle="tooltip"]').tooltip();


                var self = this;
//              $.ajax({
//                  url: '/config',
//                  dataType: 'json',
//                  data: { x: new Date() },
//                  success: function(data) {
//                      if (data.status == 'ok') {
//                          self.version = data.config.version + ',内置cesium' + data.config.cesiumVersion ;
//                          self.config = data.config;
//                          self.$emit("config", data.config);
//                      }
//                  }
//              });

                this.firstlunch = util.getUrlParam('firstlunch');

                //如果要检测登陆
                if (self.needlogin) {
                    //尝试获取授权信息
                    var infowindow = this.$parent.$refs.infowindow;
                    infowindow.waiting(true);
                    $.ajax({
                        url: '/authinfo',
                        dataType: 'json',
                        data: { x: new Date() },
                        success: function(data) {
                            self.authinfo = data.auth;
                            if(self.authinfo)
                                self.authinfo.autoupdate = data.autoupdate;
                            self.$emit("authinfo", self.authinfo);
                            infowindow.waiting(false);

                            //如果为离线授权，那么直接判定登陆
                            if (self.authinfo && self.authinfo.user) {
                                self.$emit('user.logined', self.authinfo.user);
                                if (self.firstlunch)
                                    self.updatehis();
                            } else {

                                self.detectLogin();
                            }

                        }
                    });

                }




            },
            methods: {
                updateServerInfo: function(user) {
                    //登陆成功后，向服务器提交在线授权信息 
                    var self = this;
                    $.ajax({
                        url: '/updateauthparam',
                        dataType: 'json',
                        type: "POST",
                        data: {
                            x: new Date(),
                            server: this.rgserver + "/user/olauth",
                            userid: user.uid
                        },
                        success: function(data) {
                            //这里刷新授权
                            $.ajax({
                                url: '/authinfo',
                                dataType: 'json',
                                data: { x: new Date(), force: true },
                                success: function(data) {

                                    self.authinfo = data.auth;

                                    self.$emit("authinfo", self.authinfo);
                                }
                            });
                        }
                    });
                },
                detectLogin: function() {
                    var self = this;

                    $.ajax({
                        url: self.rgserver + '/user/loginuser',
                        dataType: 'json',
                        data: { x: new Date(), phone: this.user.phone, pass: this.user.pass },
                        success: function(data) {
                            if (data.status == 'ok' && data.user) {
                                self.user = data.user;
                                self.$emit('user.logined', data.user);

                                if (self.firstlunch)
                                    self.updatehis();


                                //self.downloadlic();

                            } else {

                                //获取登陆用户，如果没有登陆，那么显示登陆界面
                                $("#modal_login").modal('show');
                            }
                        },
                        error: function(err) {
                            // infowindow.info("登陆失败:" + err.statusText);
                            //获取登陆用户，如果没有登陆，那么显示登陆界面
                            $("#modal_login").modal('show');
                        }
                    });
                },
                mini: function() {
                    xe.minimize();
                },
                exit: function() {


                    var infowindow = this.$parent.$refs.infowindow;


                    infowindow.confirm('是否确认退出程序？', function() {

                        xe.exit(function(err) {

                            if (err) {
                                infowindow.info(err);
                            }
                        });
                    });
                },
                maxi: function() {
                    xe.toggleMaximize();
                },
                sysbrowser: function(url) {

                    xe.sysbrowser(url);
                },
                about: function() {
                    //关于菜单
                    $("#modal_about").modal('show');
                },
                help: function() {

                    //打开帮助文档
                    xe.sysopenfile(this.config.helpdoc, true);
                },
                updatehis: function() {
                    $("#modal_udpatedis").modal('show');
                },
                login: function() {
                    var infowindow = this.$parent.$refs.infowindow;
                    if (this.user.phone == '' || this.user.phone.length != 11) {
                        var infowindow = this.$parent.$refs.infowindow;
                        infowindow.info("请输入手机号");
                        return;
                    }
                    if (this.user.password == '') {
                        var infowindow = this.$parent.$refs.infowindow;
                        infowindow.info("请输入密码");
                        return;
                    }

                    var self = this;


                    $.ajax({
                        url: self.rgserver + '/user/login',
                        dataType: 'json',
                        data: { x: new Date(), phone: this.user.phone, pass: this.user.password },
                        beforeSend: function(request) {
                            console.log(request.headers);
                        },
                        success: function(data) {
                            if (data.status == 'ok') {
                                //尝试登陆，如果登陆成功，发送事件
                                $("#modal_login").modal('hide');

                                self.$emit('user.logined', data.user);

                                self.updateServerInfo(data.user);

                                if (self.firstlunch)
                                    self.updatehis();

                                //self.downloadlic();
                            } else {
                                infowindow.info("登陆失败:" + data.status);
                            }
                        },
                        error: function(err) {
                            infowindow.info("登陆失败:" + err.statusText);
                        }
                    });


                },
                service: function() {
                    xe.sysbrowser(this.rgserver + "/service.html");
                },
                register: function() {

                    xe.sysbrowser(this.rgserver + "/xinyonghu.html");
                },
                repass: function() {
                    xe.sysbrowser(this.rgserver + "/gaimima.html");
                },
                downloadlic: function() {
                    var self = this;
                    var infowindow = this.$parent.$refs.infowindow;

                    $.ajax({
                        url: self.rgserver + '/testlic',
                        dataType: 'binary',
                        type: "POST",
                        data: {
                            x: new Date(),
                            machine: this.authinfo.machinecode,
                            productId: 'cesiumlabV' + this.config.version,
                            phone: this.user.phone
                        },
                        success: function(data) {

                            if (data.type == "application/octet-stream") {

                                function readBlobAsDataURL(blob, callback) {
                                    var a = new FileReader();
                                    a.onload = function(e) { callback(e.target.result); };

                                    a.readAsDataURL(blob);
                                }

                                readBlobAsDataURL(data, function(dataurl) {
                                    //发送到后台去保存
                                    xe.writefile(self.config.authfile, dataurl);
                                });



                            } else {
                                var fr = new FileReader();
                                fr.onload = function(evt) {
                                    var res = JSON.parse(evt.target.result);
                                    infowindow.info(res.status);
                                };
                                fr.readAsText(data);
                            }
                        }
                    });
                },
                authcode: function() {

                    //刷新机器码
                    var self = this;
                    $.ajax({
                        url: '/machinecode',
                        dataType: 'json',
                        data: { x: new Date() },
                        success: function(data) {
                            if (data.status == 'ok') {
                                self.machinecode = data.machine;
                            }
                        }
                    });
                    $('#modal_authcode').modal('show');
                },
                copycode: function() {
                    util.copy(this.machinecode);
                },
                openlic: function() {
                    try {

                        xe.sysopenfile(this.config.configfile);
                    } catch (ex) {
                        console.log(ex);
                    }
                }
            },
            computed: {
                iselectron: function() {

                    return window.nodeRequire != undefined;
                }
            },
            filters: {

            }
        };

        return Module;
    });