/* 2018-11-29 10:45:43 | 版权所有 火星科技 http://marsgis.cn  【联系我们QQ：516584683，微信：marsgis】 */
var haoutil = haoutil || {};
haoutil.version = "2.3",
haoutil.name = "木遥通用常用JS方法类库",
haoutil.author = "木遥（QQ：516584683） https://github.com/muyao1987/haoutil",
haoutil.msg = function(t) {
	window.toastr ? toastr.info(t) : window.layer ? layer.msg(t) : alert(t)
},
haoutil.tip = haoutil.msg,
haoutil.oneMsg = function(t, e) {
	haoutil.storage.get(e) || (haoutil.msg(t), haoutil.storage.add(e, !0))
},
haoutil.alert = function(t, e) {
	window.layer ? layer.alert(t, {
		title: e || "提示",
		skin: "layui-layer-lan layer-mars-dialog",
		closeBtn: 0,
		anim: 0
	}) : alert(t)
},
haoutil.loading = {
	index: -1,
	show: function(t) {
		this.close(),
		window.NProgress ? ((t = t || {}).color ? t.template = '<div class="bar ' + (t.className || "") + '" style="background-color:' + t.color + ';" role="bar"></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>': t.template = '<div class="bar ' + (t.className || "") + '" role="bar"></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>', NProgress.configure(t), NProgress.start()) : window.layer && (this.index = layer.load(2, {
			shade: [.3, "#000000"]
		}))
	},
	hide: function() {
		this.close()
	},
	close: function() {
		window.NProgress ? NProgress.done(!0) : window.layer && ( - 1 != this.index && layer.close(this.index), this.index = -1)
	}
},
window.noArrayPrototype || (Array.prototype.indexOf = Array.prototype.indexOf ||
function(t) {
	for (var e = 0; e < this.length; e++) if (this[e] == t) return e;
	return - 1
},
Array.prototype.remove = Array.prototype.remove ||
function(t) {
	for (var e = 0; e < this.length; e++) if (this[e] == t) {
		this.splice(e, 1);
		break
	}
},
Array.prototype.insert = Array.prototype.insert ||
function(t, e) {
	null == e && (e = 0),
	this.splice(e, 0, t)
}),
String.prototype.startsWith = String.prototype.startsWith ||
function(t) {
	return this.slice(0, t.length) == t
},
String.prototype.endsWith = String.prototype.endsWith ||
function(t) {
	return this.slice( - t.length) == t
},
String.prototype.replaceAll = String.prototype.replaceAll ||
function(t, e) {
	return this.replace(new RegExp(t, "gm"), e)
},
Date.prototype.format = function(t) {
	var e = {
		"M+": this.getMonth() + 1,
		"d+": this.getDate(),
		"h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12,
		"H+": this.getHours(),
		"m+": this.getMinutes(),
		"s+": this.getSeconds(),
		"q+": Math.floor((this.getMonth() + 3) / 3),
		S: this.getMilliseconds()
	};
	for (var n in /(y+)/.test(t) && (t = t.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length))), /(E+)/.test(t) && (t = t.replace(RegExp.$1, (1 < RegExp.$1.length ? 2 < RegExp.$1.length ? "星期": "周": "") + {
		0 : "日",
		1 : "一",
		2 : "二",
		3 : "三",
		4 : "四",
		5 : "五",
		6 : "六"
	} [this.getDay() + ""])), e) new RegExp("(" + n + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? e[n] : ("00" + e[n]).substr(("" + e[n]).length)));
	return t
},
haoutil.color = {
	random: function() {
		return "#" +
		function(t) {
			return (t += "0123456789abcdef" [Math.floor(16 * Math.random())]) && 6 == t.length ? t: arguments.callee(t)
		} ("")
	}
},
haoutil.cookie = function() {
	var i;
	return {
		isH5Mobile: function(t) {
			i = t
		},
		add: function(t, e, n) {
			var r;
			0 < n ? (r = new Date).setTime(r.getTime + 24 * n * 60 * 60 * 1e3) : r = new Date(2147483647e3);
			var o = t + "=" + escape(e) + "; expires=" + r.toGMTString();
			i && null != window.plus ? plus.navigator.setCookie(t, o) : document.cookie = o
		},
		get: function(t) {
			var e;
			if (i && null != window.plus) {
				if (null == (e = plus.navigator.getCookie(t))) return null
			} else e = document.cookie;
			for (var n = e.split("; "), r = 0; r < n.length; r++) {
				var o = n[r].split("=");
				if (o[0] == t) return unescape(o[1])
			}
			return null
		},
		del: function(t) {
			if (i && null != window.plus) plus.navigator.removeCookie(t);
			else {
				var e = new Date;
				e.setTime(e.getTime() - 1e4),
				document.cookie = t + "=v; expires=" + e.toGMTString()
			}
		}
	}
} (),
haoutil.file = function() {
	function n(t, e) {
		var n = document.createElement("a");
		n.download = t,
		n.href = URL.createObjectURL(e),
		document.body.appendChild(n),
		n.click(),
		document.body.removeChild(n)
	}
	function r(t) {
		for (var e = t.split(";base64,"), n = e[0].split(":")[1], r = window.atob(e[1]), o = r.length, i = new Uint8Array(o), a = 0; a < o; ++a) i[a] = r.charCodeAt(a);
		return new Blob([i], {
			type: n
		})
	}
	return {
		download: n,
		downloadFile: function(t, e) {
			n(t, new Blob([e]))
		},
		downloadImage: function(t, e) {
			n(t + ".png", r(e.toDataURL("image/png")))
		},
		base64Img2Blob: r
	}
} (),
haoutil.isutil = function() {
	function e(t) {
		return "string" == typeof t && t.constructor == String
	}
	function n(t) {
		return "number" == typeof t && t.constructor == Number
	}
	function r(t) {
		return null == t || !(!e(t) || "" != t) || !(!n(t) || !isNaN(t))
	}
	return {
		isNull: r,
		isNotNull: function(t) {
			return ! r(t)
		},
		isArray: function(t) {
			return "object" == typeof t && t.constructor == Array
		},
		isString: e,
		isNumber: n,
		isDate: function(t) {
			return "object" == typeof t && t.constructor == Date
		},
		isFunction: function(t) {
			return "function" == typeof t && t.constructor == Function
		},
		isObject: function(t) {
			return "object" == typeof t && t.constructor == Object
		}
	}
} (),
haoutil.math = function() {
	function e(t, e) {
		return Math.floor(Math.random() * (e - t + 1) + t)
	}
	return {
		getArrayRandomOne: function(t) {
			return t[e(0, t.length - 1)]
		},
		random: e,
		padLeft0: function(t, e) {
			for (e = (t = String(t)).length; e < n;) t = "0" + t,
			e++;
			return t
		}
	}
} (),
haoutil.storage = {
	add: function(t, e) {
		window.localStorage.setItem(t, e)
	},
	get: function(t) {
		return window.localStorage.getItem(t)
	},
	del: function(t) {
		window.localStorage.removeItem(t)
	}
},
haoutil.str = function() {
	var u = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
	return {
		isChinese: function(t) {
			return !! /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi.exec(t)
		},
		formatLength: function(t) {
			var e = Number(t);
			return e < 1e3 ? e.toFixed(2) + "米": (e / 1e3).toFixed(2) + "千米"
		},
		formatArea: function(t) {
			return Number(t),
			t < 1e6 ? t.toFixed(2) + "平方米": (t / 1e6).toFixed(2) + "平方公里"
		},
		formatTime: function(t) {
			return Number(t),
			t < 60 ? t.toFixed(0) + "秒": 60 <= t && t < 3600 ? Math.floor(t / 60) + "分钟" + Math.floor(t % 60) + "秒": (t = Math.floor(t / 60), Math.floor(t / 60) + "小时" + Math.floor(t % 60) + "分钟")
		},
		base64: function(t) {
			return function(t) {
				for (var e = "",
				n = t.length % 6,
				r = t.substr(0, t.length - n), o = t.substr(t.length - n, n), i = 0; i < r.length; i += 6) {
					var a = parseInt(r.substr(i, 6), 2);
					e += u[a]
				}
				return o += new Array(7 - n).join("0"),
				n && (e += u[parseInt(o, 2)], e += new Array((6 - n) / 2 + 1).join("=")),
				e
			} (function(t) {
				for (var e = "",
				n = 0; n < t.length; n++) {
					var r = t.charCodeAt(n).toString(2);
					e += new Array(9 - r.length).join("0") + r
				}
				return e
			} (t))
		},
		decodeBase64: function(t) {
			return function(t) {
				for (var e = "",
				n = 0; n < t.length; n += 8) e += String.fromCharCode(parseInt(t.substr(n, 8), 2));
				return e
			} (function(t) {
				for (var e = "",
				n = 0,
				r = 0; r < t.length; r++) if ("=" != t[r]) {
					var o = u.indexOf(t[r]).toString(2);
					e += new Array(7 - o.length).join("0") + o
				} else n++;
				return e.substr(0, e.length - 2 * n)
			} (t))
		}
	}
} (),
haoutil.system = function() {
	function n(t, e) {
		var n = document.createElement("link");
		n.rel = "stylesheet",
		n.async = e,
		n.href = t,
		o.appendChild(n)
	}
	function r(t, e) {
		var n = document.createElement("script");
		n.charset = "utf-8",
		n.async = e,
		n.src = t,
		o.appendChild(n)
	}
	var o = document.head || document.getElementsByTagName("head")[0],
	i = new RegExp("\\.css");
	return {
		getRequest: function() {
			var t = location.search,
			e = new Object;
			if ( - 1 != t.indexOf("?")) for (var n = t.substr(1).split("&"), r = 0; r < n.length; r++) e[n[r].split("=")[0]] = decodeURI(n[r].split("=")[1]);
			return e
		},
		getRequestByName: function(t, e) {
			var n = new RegExp("(^|&)" + t + "=([^&]*)(&|$)", "i"),
			r = window.location.search.substr(1).match(n);
			return null != r ? decodeURI(r[2]) : e
		},
		getExplorerInfo: function() {
			var t = window.navigator.userAgent.toLowerCase();
			return 0 <= t.indexOf("msie") ? {
				type: "IE",
				version: Number(t.match(/msie ([\d]+)/)[1])
			}: 0 <= t.indexOf("firefox") ? {
				type: "Firefox",
				version: Number(t.match(/firefox\/([\d]+)/)[1])
			}: 0 <= t.indexOf("chrome") ? {
				type: "Chrome",
				version: Number(t.match(/chrome\/([\d]+)/)[1])
			}: 0 <= t.indexOf("opera") ? {
				type: "Opera",
				version: Number(t.match(/opera.([\d]+)/)[1])
			}: 0 <= t.indexOf("Safari") ? {
				type: "Safari",
				version: Number(t.match(/version\/([\d]+)/)[1])
			}: {
				type: t,
				version: -1
			}
		},
		isPCBroswer: function() {
			var t = navigator.userAgent.toLowerCase(),
			e = "ipad" == t.match(/ipad/i),
			n = "iphone" == t.match(/iphone/i),
			r = "midp" == t.match(/midp/i),
			o = "rv:1.2.3.4" == t.match(/rv:1.2.3.4/i),
			i = "ucweb" == t.match(/ucweb/i),
			a = "android" == t.match(/android/i),
			u = "windows ce" == t.match(/windows ce/i),
			s = "windows mobile" == t.match(/windows mobile/i);
			return ! (e || n || r || o || i || a || u || s)
		},
		clone: function t(e) {
			if (null == e || "object" != typeof e) return e;
			if (e instanceof Date) return (n = new Date).setTime(e.getTime()),
			n;
			if (e instanceof Array) {
				for (var n = [], r = 0, o = e.length; r < o; ++r) n[r] = t(e[r]);
				return n
			}
			if ("object" != typeof e) return e;
			n = {};
			for (var i in e)"_layer" != i && "_layers" != i && "_parent" != i && e.hasOwnProperty(i) && (n[i] = t(e[i]));
			return n
		},
		jsonp: function(t, e, n) {
			window.$jsonp = function(t, e, n) {
				var r = "my_json_cb_" + Math.random().toString().replace(".", "");
				window[r] = n;
				var o = -1 == t.indexOf("?") ? "?": "&";
				for (var i in e) o += i + "=" + e[i] + "&";
				o += "callback=" + r;
				var a = document.createElement("script");
				a.src = t + o,
				document.body.appendChild(a)
			}
		},
		getWindowSize: function() {
			return void 0 !== window.innerWidth ? {
				width: window.innerWidth,
				height: window.innerHeight
			}: {
				width: document.documentElement.clientWidth,
				height: document.documentElement.clientHeight
			}
		},
		getHtml: function(t, e) {
			$.ajax({
				url: t,
				type: "GET",
				dataType: "html",
				timeout: 0,
				success: function(t) {
					e(t)
				}
			})
		},
		loadCss: n,
		loadJs: r,
		loadResource: function(t, e) {
			i.test(t) ? n(t, e) : r(t, e)
		}
	}
} ();