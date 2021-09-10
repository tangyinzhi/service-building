define(['vue'], function(vue) {

    function getUrlParam(name, defaultValue) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)
            return decodeURI(r[2]);
        return defaultValue;
    }

    function getUrlDoubleParam(name, defaultv) {
        var p = getUrlParam(name);
        if (p == null)
            return defaultv;

        var d = parseFloat(p);
        if (isNaN(d))
            return defaultv;
        return d;
    }

    function getUrlIntParam(name, defaultv) {
        var p = getUrlParam(name);
        if (p == null)
            return defaultv;

        var d = parseInt(p);
        if (isNaN(d))
            return defaultv;
        return d;
    }


    function clone(obj) {
        // Handle the 3 simple types, and null or undefined
        if (null == obj || "object" != typeof obj) return obj;

        // Handle Date
        if (obj instanceof Date) {
            var copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        // Handle Array
        if (obj instanceof Array) {
            var copy = [];
            for (var i = 0, len = obj.length; i < len; ++i) {
                copy[i] = clone(obj[i]);
            }
            return copy;
        }

        // Handle Object
        if (obj instanceof Object) {
            var copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
            }
            return copy;
        }

        throw new Error("Unable to copy obj! Its type isn't supported.");
    }



    function ftime(t) {

        //时间是毫秒
        t = Math.round(t / 1000);
        //计算天
        var day = Math.floor(t / (24 * 60 * 60));
        //计算小时
        var hour = Math.floor((t - day * (24 * 60 * 60)) / (60 * 60));
        //计算分钟
        var minute = Math.floor((t - day * (24 * 60 * 60) - hour * (60 * 60)) / 60);
        //计算秒
        var seconds = Math.floor(t - day * (24 * 60 * 60) - hour * (60 * 60) - minute * 60);

        var time = '';
        if (day > 0)
            time += day + '天';

        if (hour > 0)
            time += hour + '小时';

        if (minute > 0)
            time += minute + '分钟';

        if (seconds > 0)
            time += seconds + '秒';

        return time;
    }

/*

    Array.prototype.removeObject = function(_obj) {
        var length = this.length;
        for (var i = 0; i < length; i++) {
            if (this[i] == _obj) {
                if (i == 0) {
                    this.shift(); //删除并返回数组的第一个元素
                    return;
                } else if (i == length - 1) {
                    this.pop(); //删除并返回数组的最后一个元素
                    return;
                } else {
                    this.splice(i, 1); //删除下标为i的元素
                    return;
                }
            }
        }
    };
*/

    function copy(text) {
        const el = document.createElement('textarea');

        el.value = text;

        // Prevent keyboard from showing on mobile
        el.setAttribute('readonly', '');

        el.style.contain = 'strict';
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        el.style.fontSize = '12pt'; // Prevent zooming on iOS

        const selection = document.getSelection();
        let originalRange = false;
        if (selection.rangeCount > 0) {
            originalRange = selection.getRangeAt(0);
        }

        document.body.appendChild(el);
        el.select();

        // Explicit selection workaround for iOS
        el.selectionStart = 0;
        el.selectionEnd = text.length;

        let success = false;
        try {
            success = document.execCommand('copy');
        } catch (err) {}

        document.body.removeChild(el);

        if (originalRange) {
            selection.removeAllRanges();
            selection.addRange(originalRange);
        }

        return success;
    }



    /// <summary>
    /// 引号转义符号
    /// </summary>
    String.EscapeChar = '\'';

    /// <summary>
    /// 替换所有字符串
    /// </summary>
    /// <param name="searchValue">检索值</param> 
    /// <param name="replaceValue">替换值</param> 
    String.prototype.replaceAll = function(searchValue, replaceValue) {
        var regExp = new RegExp(searchValue, "g");
        return this.replace(regExp, replaceValue);
    }

    String.prototype.format = function(args) {
        var result = this;
        if (arguments.length > 0) {
            if (arguments.length == 1 && typeof(args) == "object") {
                for (var key in args) {
                    if (args[key] != undefined) {
                        var reg = new RegExp("({" + key + "})", "g");
                        result = result.replace(reg, args[key]);
                    }
                }
            } else {
                for (var i = 0; i < arguments.length; i++) {
                    if (arguments[i] != undefined) {
                        //var reg = new RegExp("({[" + i + "]})", "g");//这个在索引大于9时会有问题，谢谢何以笙箫的指出
                        var reg = new RegExp("({)" + i + "(})", "g");
                        result = result.replace(reg, arguments[i]);
                    }
                }
            }
        }
        return result;
    }

    return {
        getUrlParam: getUrlParam,
        getUrlDoubleParam: getUrlDoubleParam,
        getUrlIntParam: getUrlIntParam,
        clone: clone,
        ftime: ftime,
        copy: copy
    }

});