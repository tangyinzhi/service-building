 define(["rtext!./infowindow.html", "vue","./xbsjutil"], function(html, vue,util) {


     var Module = {
         template: html,
         data: function() {

             return {
                 confirmInfo: '',
                 showInfo: '',
                 inputInfo: '',
                 inputValue: '',
                 jsonTitle: '',
                 jsonContent: '',
                 code: ''
             }
         },
         methods: {

             info: function(text, cb) {
                 this.showInfo = text;
                 $('#infoModal').modal('show');

                 $('#infoModal').on('hidden.bs.modal', function(e) {
                     cb && cb();
                 });
             },
             confirm: function(text, cb) {


                 this.confirmInfo = text;
                 $('#confirmModal').modal('show');

                 $('#confirmModal button:eq(2)').unbind("click");
                 $('#confirmModal button:eq(2)').click(function() {
                     $('#confirmModal').modal('hide');
                     cb && cb();
                 });

             },
             input: function(text, cb) {
                 var self = this;
                 self.inputInfo = text;


                 $('#inputModal').modal('show');

                 $('#inputModal button:eq(2)').unbind("click");
                 $('#inputModal button:eq(2)').click(function() {
                     if (self.inputValue == '') {
                         showInfoWindow('请输入!!')
                         return;
                     }
                     $('#inputModal').modal('hide');
                     cb && cb(self.inputValue);
                 });
             },
             viewjson: function(text, obj, cb) {
                 var self = this;
                 self.jsonTitle = text;
                 self.jsonContent = JSON.stringify(obj, null, 4);


                 var modal = $('#jsonModal');
                 modal.modal('show');

                 $('#jsonModal button:eq(2)').unbind("click");
                 $('#jsonModal button:eq(2)').click(function() {

                     modal.modal('hide');
                     cb && cb();
                 });

             },
             waiting: function(f, cb) {
                 var modal = $('#waitingModal');
                 modal.modal(f ? 'show' : 'hide');

                 if (!f) {
                     modal.on('hidden.bs.modal', function(e) {
                         cb && cb();
                     });
                 }
             },
             showcode: function(c) {

                 this.code = c;
                 var modal = $('#codeModal');
                 modal.modal('show');


             },
             copycode: function() {

                util.copy(this.code);
             }

         }
     };



     return Module;
 });