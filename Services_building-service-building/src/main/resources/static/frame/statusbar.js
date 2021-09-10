define(["rtext!./statusbar.html", "rcss!./statusbar.css", 'vue', "../util/xbsjelectron", "bootstrap"],
    function(html, css, vue, xe) {

        var Module = {
            template: html,
            data: function() {
                return {
                    taskcount: 0,
                    servercount: 0,
                    updateinfo: ''
                };
            },
            created: function() {

            },
            mounted: function() {
                //查询当前处理任务
                var self = this;
//              $.ajax({
//                  url: '/task/list',
//                  type: 'post',
//                  data: { x: new Date() },
//                  datatype: 'json',
//                  success: function(data) {
//                      if (data.status == 'ok') {
//
//                          self.taskcount = data.tasks.length;
//
//                      }
//                  },
//                  error: function(e) {
//
//                      //infowindow.info("添加任务出错:" + e);
//                  }
//              });

                $('[data-toggle="tooltip"]').tooltip();

 

                // 获取授权信息
                this.$parent.$refs.titlebar.$on('authinfo', function(auth) {


                    if (auth&&auth.autoupdate === true) {
                        //启动自动更新
                        xe.autoupdate(function(info) {
                            self.updateinfo = info;
                            console.log(info);
                        });
                    }

                    /*
                    //如果为离线授权，不自动更新
                    if (auth.user) {

                        self.updateinfo = "授权给：" + auth.user.name;
                    } else {

                    }*/

                });

            },
            methods: {
                sysbrowser: function(url) {

                    xe.sysbrowser(url);
                },
                qrcode: function() {

                    this.$parent.$refs.titlebar.about();
                }
            },
            filters: {

            },
            computed: {
                iselectron: function() {

                    return window.nodeRequire != undefined;
                }
            },
        };

        return Module;
    });