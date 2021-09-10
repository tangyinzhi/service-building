


function getUrlParam(name, defaultValue) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return decodeURI(r[2]);
    return defaultValue;
}
var debug = getUrlParam('debug');
var cesium = getUrlParam('cesium');
cesium = cesium ? ('/'+cesium):'';

require.config({
    config: {
        rtext: {
            //Valid values are 'node', 'xhr', or 'rhino'
            env: 'xhr' //text 会自动检测环境，我们在electron内用，但是强制使用浏览器的加载
        }
    },
    //define all js file path base on this base path  
    //actually this can setting same to data-main attribute in script tag  
    //定义所有JS文件的基本路径,实际这可跟script标签的data-main有相同的根路径  
    baseUrl: "./",

    //define each js frame path, not need to add .js suffix name  
    //定义各个JS框架路径名,不用加后缀 .js  

    paths: {
        "jquery": "../js/jquery.min",
        "bootstrap": "../js/bootstrap.min",
        "rcss": '../js/css.min',
        "rtext": '../js/text.min',
        "vue": "../js/vue.min",
        "polyfill": '../js/polyfill.min',
        "openlayers": '../js/ol',
        "proj4": '../js/proj4',
        "moment": "../js/moment.min",
        "leaflet": "../js/leaflet",
        "bsselect": "../js/bootstrap-select",
        "bstreeview": "../js/bootstrap-treeview",
        "jspdf": '../js/jspdf.min',
        'html2canvas': '../js/html2canvas.min',
        "bssuggest": '../js/bootstrap-suggest.min',
        'hashmap': "../js/hashmap",
        'randomcolor': '../js/randomColor',
        'eventemmiter': '../js/EventEmitter-4.0.3.min',
        'vueautocomplete': '../js/vue2-autocomplete',
        'jstree': '../js/jstree.min',
         'cesium': debug ? ('../js'+cesium+'/CesiumUnminified/Cesium') : '../js'+cesium+'/Cesium/Cesium',
        // 'cesium': '/js/CesiumUnminified/Cesium',
        'plupload': '../js/plupload.min',
        'jqueryui': '../js/jquery-ui.min',
        'pluploadui': '../js/jquery.ui.plupload.min',
        'pluploadcn': '../js/i18n/zh_CN',
        'lobipanel': '../js/lobipanel',
        "leafletdraw": "../js/leaflet.draw",
        "jqtree": "../js/tree.jquery",
        "calendar": '../js/calendar',
        "calendarcn": "../js/language/zh-CN",
        "bootstrapslider": "../js/bootstrap-slider.min",
        "leaflet": "../js/leaflet",
        "leafletdraw": "../js/leaflet.draw",
        "bootstrapselect": "../js/bootstrap-select.min",
        "THREE":"../js/three.min",
        "THREE.TrackballControls":"../js/controls/TrackballControls",
         "jquerybin":'../js/jquery.binarytransport',
         "vuetree":"../js/vue-jstree",
         'zTree':'../Plugins/ztree/js/jquery.ztree.all',
         'range':'../Plugins/range/range',
         'layer':'../Plugins/layer/layer',
         'jrange':'../Plugins/jrange/jquery.range',
         'magnify':'../Plugins/magnify/jquery.magnify',
        'sliderUi':'../Plugins/jquery-ui/jquery-ui.min',
    },
    shim: {
        jquery: {
            exports: 'jquery'
        },
        vue: {
            exports: 'vue'
        },
        bootstrap: {
            deps: ['jquery', 'rcss!/building/css/bootstrap.min.css']
        },
        openlayers: {
            deps: ['polyfill', 'proj4', "rcss!/building/css/ol.css"]
        },
        leaflet: {
            deps: ['rcss!/building/css/leaflet.css']
        },
        leafletdraw: {
            deps: ['leaflet', 'rcss!/building/css/leaflet.draw.css']
        },
        bsselect: {
            deps: ['jquery', 'bootstrap', 'rcss!/building/css/bootstrap-select.min']
        },
        bstreeview: {
            deps: ['bootstrap', 'rcss!/building/css/bootstrap-treeview.min']
        },
        vueautocomplete: {
            deps: ['vue', 'rcss!/building/css/vue2-autocomplete.css']
        },
        jstree: {
            deps: ['jquery', 'rcss!/building/css/jstree/default-dark/style.min.css']
        },
        cesium: {
            deps: ['rcss!/building/js/Cesium/Widgets/widgets.css']
        },
        plupload: {
            deps: ['js/moxie.min']
        },
        jqueryui: {
            deps: ['jquery', 'rcss!/building/css/jquery-ui.min.css']
        },
        pluploadui: {
            deps: ['jqueryui', 'plupload', 'rcss!/building/css/jquery.ui.plupload.css']
        },
        pluploadcn: {
            deps: ['pluploadui']
        },
        lobipanel: {
            deps: ['jqueryui', 'bootstrap']
        },
        leafletdraw: {
            deps: ['leaflet', 'rcss!/building/css/leaflet.draw.css']
        },
        jqtree: {
            deps: ['jquery', 'rcss!/building/css/jqtree.css']
        },
        calendar: {
            deps: ['bootstrap', 'rcss!/building/css/calendar.css', '../js/underscore-min']
        },
        calendarcn: {
            deps: ['calendar']
        },
        bootstrapslider:{
          deps:['jquery',"rcss!/building/css/bootstrap-slider.min.css"]
        },
        bootstrapselect:{
          deps:['jquery','rcss!/building/css/bootstrap-select.min.css']
        },
        'THREE.TrackballControls': {
　　　　　　deps: ['THREE']
　　　　},
        jquerybin:{
            deps:['jquery']
        },
        zTree: {
            deps: ['jquery', 'rcss!/building/Plugins/ztree/css/zTreeStyle/zTreeStyle.css']
        },
        range: {
            deps: ['jquery', 'rcss!/building/Plugins/range/range.css']
        },
        layer: {
            deps: ['jquery', 'rcss!/building/Plugins/layer/theme/default/layer.css']
        },
        jrange: {
            deps: ['jquery', 'rcss!/building/Plugins/jrange/jquery.range.css']
        },
		magnify: {
            deps: ['jquery', 'rcss!/building/Plugins/magnify/jquery.magnify.css']
        },
        sliderUi: {
            deps: ['jquery', 'rcss!/building/Plugins/jquery-ui/style.css']
        },

    }
});

var path = window.location.href;
if (window.location.href.indexOf('?') > 0)
    path = path.substr(0, window.location.href.indexOf('?'));

var u = path.split('/');
var fname = u[u.length - 1];
fname = fname.split('.');
fname = fname[0];
if (fname == '' || fname.indexOf('#')==0)
    fname = 'building/index';
//2，about load each js code basing on different dependency  
//按不同先后的依赖关系加载各个JS文件  
require([
    "jquery",
    "bootstrap",
    "vue",
    "rcss!/building/index.css",
    fname
]);