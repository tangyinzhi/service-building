layui.use(['form', 'layer', 'jquery'], function () {
    var $ = layui.$,
        form = layui.form,
        //common = layui.common,
        layer = layui.layer;

    $("body").on("dblclick", ".site-doc-icon li", function () {
        //得到当前iframe层的索引
        var index = parent.layer.getFrameIndex(window.name);
        //赋值
        var res = $(this).find("i").attr("class");
        var array = res.split(" ")
        if (array.length == 2) {
            var resImage = array[1];
            // parent.ChooseAdidValues(resImage); //这是父页面函数
            //parent.window.document.getElementById("icon").value = resImage;//原生js传值
            $('#icon', window.parent.document).val(resImage);//layui传值
            $('#servicesDetails', window.parent.document).val(resImage);//layui传值
            //parent.$("icon").val(resImage);
            var index = parent.layer.getFrameIndex(window.name);
            parent.layer.close(index);

        }


    });


});