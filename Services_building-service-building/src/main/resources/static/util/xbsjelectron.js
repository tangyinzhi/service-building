 define([], function() {


     let remote;
     let ipcRenderer;

     let updateCB;
     let exitCB;
     let installPluginCB;

     if (window.nodeRequire) {
         remote = window.nodeRequire('electron').remote;
         ipcRenderer = window.nodeRequire('electron').ipcRenderer;


         ipcRenderer.on('updatemessage', function(event, text) {

             if(updateCB)
                updateCB(text);
             //console.log(text);
         });

         ipcRenderer.on('quitfailed', function(event, err) {

             if(exitCB)
                exitCB(err); 
         });

         ipcRenderer.on('installPlugined', function(event, err) {

             if(installPluginCB)
                installPluginCB(err); 
         });
 

     }




     return {

         minimize: function() {
             if (remote)
                 remote.getCurrentWindow().minimize();
         },
         toggleMaximize: function() {
             if (remote) {
                 var win = remote.getCurrentWindow();
                 if (win.isMaximized())
                     win.unmaximize();
                 else
                     win.maximize();
             }
         },
         exit: function(cb) {
            exitCB = cb;
             if (ipcRenderer)
                 ipcRenderer.send('quit');

         },
         sysbrowser: function(url) {
             if (ipcRenderer)
                 ipcRenderer.send('openURL', { href: url });
             else
                window.location.href = url;
         },
         sysopenfile: function(file,open) {
             if (ipcRenderer)
                 ipcRenderer.send('openFile', { file: file,open:open });
         },
         showOpenDialog: function(options, cb) {

             if (remote) {
                 remote.dialog.showOpenDialog(remote.getCurrentWindow(), options, cb);
             }
         },
         showSaveDialog: function(options, cb) {

             if (remote) {
                 remote.dialog.showSaveDialog(remote.getCurrentWindow(), options, cb);
             }
         },
         autoupdate: function(cb) {
            updateCB = cb;
             if (ipcRenderer)
                 ipcRenderer.send('autoupdate');
         },
         writefile:function(file, data){
            if (ipcRenderer)
                 ipcRenderer.send('writeFile', { file: file,data:data });
         },
         installPlugin:function(cb){
            installPluginCB = cb;
            if (ipcRenderer)
                 ipcRenderer.send('installPlugin');
         }
     };



 });