/**
 * 作       者：StampGIS Team
 * 创建日期：2017年 7月 22日
 * 描       述：地形透明、雨、雪、雾等slider
 * 注意事项：
 * 遗留 Bug：0
 * 修改日期：2017年 11月 13日
 ******************************************/

(function (ns) {
    var _earth = null,
        _closure = null,

        VERSION = '0.0.1',
        TOP = 0,
        LEFT = 80;

    /**
     * 拉杆条对象
     */
    var _sliders = [{
        id: 'ViewTranSetting',
        type: 'transparency',
        title: '地形透明',
        slider: null,
        percent: 100,
        changeValue: function (slider, value) {
            if (!slider || value < 0 || value > 100) {
                return;
            }
            _earth.Environment.TerrainTransparency = value * 2.55;
            slider.Text = "不透明度:" + value + '%';
        }
    }, {
        id: 'EffectRain',
        type: 'rain',
        title: '雨',
        slider: null,
        percent: 100,
        parse: function (slider, value) {
            try {
                value = Math.floor(parseFloat(value) / 20);
                return value == 5 ? 4 : value;
            } catch (e) {
                return value;
            }
        },
        changeValue: function (slider, value) {
            if (!slider || value < 1 || value > 4) {
                _earth.WeatherEffect.SetRainEnable(false);
                slider.Text = '晴';
            } else {
                _earth.WeatherEffect.SetRainEnable(true);
                _earth.WeatherEffect.SetRainType(value);
                var rainText = ['小雨', '中雨', '大雨', '暴雨'];
                slider.Text = rainText[value - 1];
            }
        }
    }, {
        id: 'EffectSnow',
        type: 'snow',
        title: '雪',
        slider: null,
        percent: 100,
        parse: function (slider, value) {
            try {
                value = Math.floor(parseFloat(value) / 20);
                return value == 5 ? 4 : value;
            } catch (e) {
                return value;
            }
        },
        changeValue: function (slider, value) {
            if (!slider || value < 1 || value > 4) {
                _earth.WeatherEffect.SetSnowEnable(false);
                slider.Text = '晴';
            } else {
                _earth.WeatherEffect.SetSnowEnable(true);
                _earth.WeatherEffect.SetSnowType(value);
                var snowText = ['小雪', '中雪', '大雪', '暴雪'];
                slider.Text = snowText[value - 1];
            }
        }
    }, {
        id: 'EffectFog',
        type: 'fog',
        title: '雾',
        slider: null,
        percent: 100,
        parse: function (slider, value) {
            try {
                value = Math.floor(parseFloat(value) / 20);
                return value == 5 ? 4 : value;
            } catch (e) {
                return value;
            }
        },
        changeValue: function (slider, value) {
            if (!slider || value < 1 || value > 4) {
                _earth.WeatherEffect.SetFogEnable(false);
                slider.Text = '晴';
            } else {
                _earth.WeatherEffect.SetFogEnable(true);
                _earth.WeatherEffect.SetFogType(value);
                var fogText = ['小雾', '中雾', '大雾', '大大雾'];
                slider.Text = fogText[value - 1];
            }
        }
    }, {
        id: 'layerTrans',
        type: 'layerTrans',
        title: '模型透明',
        slider: null,
        percent: 100,
        changeValue: function (slider, value) {
            if (!slider || value < 0 || value > 100) {
                return;
            }
            var groupLayers = LayerManagement.groupLayers;
            for (var i in groupLayers) {
                earth.LayerManager.SetLayerTransparency(groupLayers[i].id, value / 100)
            }
            slider.Text = "不透明度:" + value + '%';
        }
    }];

    /**
     * 设置默认值
     */
    function _valueOrDefault(obj, property, defaultValue) {
        try {
            if (!obj || typeof obj[property] == 'undefined') {
                return defaultValue;
            }

            return obj[property];
        } catch (e) {
            return defaultValue;
        }
    }

    /**
     * 获取对象
     * @param {Object} id
     */
    function _getSliderById(id) {
        for (var i = 0; i < _sliders.length; i++) {
            if (_sliders[i].slider && _sliders[i].slider.ID == id) {
                return _sliders[i];
            }
        }
        return null;
    }

    /**
     * 根据类型获取对象
     * @param {Object} type 类型
     */
    function _getSlider(type) {
        for (var i = 0; i < _sliders.length; i++) {
            if (_sliders[i].type == type) {
                return _sliders[i];
            }
        }
        return null;
    }

    /**
     * 拉杆改变函数
     * @param {Object} id  对象id
     * @param {Object} percent  百分比
     */
    function _onSlider_changed(id, percent) {
        var slider = _getSliderById(id); //得到当前操作对象
        if (!slider || !slider.slider) {
            return;
        }
        var v = percent;
        if (typeof slider.parse == 'function') {
            v = slider.parse(slider.slider, v);
        }
        slider.changeValue(slider.slider, v); //改变透明度
        slider.percent = percent; //拉杆百分比记录
    }

    /**
     * 拉杆关闭事件
     * @param {Object} id
     */
    function _onSlider_closed(id) {
        var slider = _getSliderById(id);
        if (!slider || !slider.slider) {
            return;
        }
        slider.changeValue(slider.slider, -1);
        if (typeof _closure == 'function') {
            _closure(slider.type);
        }
    }

    var _sliderMgr = {
        init: function (earth, force, closure) {
            if (!_earth || force) {
                _earth = earth;
            }
            if (!_closure || force) {
                _closure = closure;
            }
        },
        setVisible: function (type, visible) {
            if (!_earth || !_earth.GUIManager) {
                return;
            }
            var slider = _getSlider(type); //拿到对应对象
            if (!slider.slider) {
                var up = _valueOrDefault(slider, 'top', TOP);
                var left = _valueOrDefault(slider, 'left', LEFT);
                //var s = _earth.GUIManager.CreateSlider(left, up);
                //邓杰
                var s = _earth.GUIManager.CreateSlider(100, 20);
                s.Title = slider.title;
                slider.slider = s;
                if (slider.type == "transparency") {
                    if (parseInt(100)) {
                        var transparencySet = 100;
                        transparencySet = transparencySet >= 0 ? transparencySet : 100;
                    } else {
                        var transparencySet = 100;
                    }
                    slider.slider.Value = transparencySet / 100;
                }
                if (slider.type == "layerTrans") {
                    slider.slider.Value = 1;
                }
                _onSlider_changed(s.ID, slider.percent);
            }
            _earth.GUIManager.SetWindowVisible(slider.slider.ID, visible);
            if (visible) {
                _onSlider_changed(slider.slider.ID, slider.percent);
            } else {
                slider.changeValue(slider.slider, -1);
            }
            _earth.Event.OnGUISliderChanged = function (id, percent) {
                _onSlider_changed(id, percent);
                var s = _getSliderById(id);
                $(ns).trigger('sliderChanged.sliderMgr', {
                    type: s.type,
                    value: percent
                });
            };
            _earth.Event.OnGUISliderClosed = _onSlider_closed;
        },
        clear: function () {
            if (_earth && _earth.GUIManager) {
                _earth.GUIManager.Clear();
            }
            for (var i = 0; i < _sliders.length; i++) {
                _sliders[i].slider = null;
            }
        },
        version: VERSION
    };

    //export sliderMgr
    if ((typeof module) !== 'undefined' && module.exports) {
        module.exports = _sliderMgr;
    } else if ((typeof define) === 'function' && define.amd) {
        define([], function () {
            return _sliderMgr;
        });
    } else {
        ns.sliderMgr = _sliderMgr;
    }
})(window);