 define(["rtext!./stylewindow.html", "vue"], function(html, vue) {


     var Module = {
         template: html,
         data: function() {

             return {
                 stylecode: "",
                 codes: []
             }
         },
         mounted: function() {

             //遍历去获得所有样式
             var codes = [];
             $(this.$el).find('code pre').each(function(idx, p) {
                
                codes.push({
                    name:p.attributes.name.value,
                    code:p.innerText
                })
            //    console.log(idx);

             });

             this.codes = codes;

         },
         methods: {

             show: function(tileset) {
                 this.tileset = tileset;
                 $(this.$el).modal('show');
             },
             ok: function() {
                 var infowindow = this.$parent.$refs.infowindow;

                 //应用样式
                 if (this.stylecode == "") {
                     this.tileset.style = undefined;
                 } else {

                     var tileset = this.tileset;

                     try {
                         eval(this.stylecode);
                     } catch (ex) {
                         infowindow.info('运行错误:' + ex);
                         return;
                     }

                     

                 }
                 $(this.$el).modal('hide');

             }
         },
          computed: {

                 selected: {
                     get: function() {
                          
                          return null;
                     },
                     set: function(c) {

                         this.stylecode = c.code;
 
                     }
                 }

             }
     };



     return Module;
 });