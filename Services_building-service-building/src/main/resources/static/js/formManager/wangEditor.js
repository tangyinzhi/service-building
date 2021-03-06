var dsLi;
FilterWidget = {
    fillOperations: function (f, d, b) {
        if (b && d === 'checkbox') {
            f.empty().append('<option value="eq">被选中</option>');
            return
        }
        var c = {
                eq: '等于',
                ne: '不等于',
                gt: '大于',
                gte: '大于等于',
                lt: '小于',
                lte: '小于等于',
                bw: '以...开始',
                ew: '以...结束',
                ct: '包含',
                nct: '不包含',
                'in': '在...中',
                nin: '不在...中'
            },
            a,
            e;
        if (b) {
            a = {
                basic: [
                    'eq',
                    'ne',
                    'bw',
                    'ew',
                    'ct',
                    'nct',
                    'in',
                    'nin'
                ],
                map: [
                    'eq',
                    'ne',
                    'bw',
                    'ew',
                    'ct',
                    'nct'
                ],
                number: [
                    'eq',
                    'ne',
                    'gt',
                    'gte',
                    'lt',
                    'lte'
                ],
                goods: [
                    'eq',
                    'ne',
                    'gt',
                    'gte',
                    'lt',
                    'lte'
                ],
                date: [
                    'eq',
                    'ne',
                    'gt',
                    'gte',
                    'lt',
                    'lte'
                ],
                textarea: [
                    'eq',
                    'ne',
                    'bw',
                    'ew',
                    'ct',
                    'nct'
                ],
                radio: [
                    'eq',
                    'in'
                ]
            }
        } else {
            a = {
                basic: [
                    'eq',
                    'ne',
                    'bw',
                    'ew',
                    'ct',
                    'nct',
                    'in',
                    'nin'
                ],
                map: [
                    'eq',
                    'ne',
                    'bw',
                    'ew',
                    'ct',
                    'nct'
                ],
                number: [
                    'eq',
                    'ne',
                    'gt',
                    'gte',
                    'lt',
                    'lte'
                ],
                goods: [
                    'eq',
                    'ne',
                    'gt',
                    'gte',
                    'lt',
                    'lte'
                ],
                date: [
                    'eq',
                    'ne',
                    'gt',
                    'gte',
                    'lt',
                    'lte'
                ],
                textarea: [
                    'eq',
                    'ne',
                    'bw',
                    'ew',
                    'ct',
                    'nct'
                ],
                radio: [
                    'eq',
                    'ne',
                    'in',
                    'nin'
                ]
            }
        }
        if (d === 'likert' || d === 'dropdown' || d === 'radio') {
            e = a.radio
        } else {
            if (d === 'number' || d === 'goods' || d === 'money' || d === 'time' || d === 'filesize') {
                e = a.number
            } else {
                if (d === 'textarea') {
                    e = a.textarea
                } else {
                    if (d === 'date') {
                        e = a.date
                    } else {
                        if (d === 'map') {
                            e = a.map
                        } else {
                            e = a.basic
                        }
                    }
                }
            }
        }
        f.empty();
        $(e).each(function (h, g) {
            f.append($.format('<option value="{0}">{1}</option>', g, c[g]))
        })
    },
    fillAllFields: function (g, b, e, c) {
        g.empty();
        g.append('<option value="">&nbsp;</option>');
        g.append('<option ftype="number" value="ID">ID</option>');
        var a,
            f = false;
        $(FLDS).each(function (h, j) {
            if (j.TYP === 'checkbox') {
                if (b) {
                    a = $.tmpl('<optgroup label="${LBL}"></optgroup>', j);
                    $.tmpl('<option ftype="checkbox" value="${NM}">${VAL}</option>', j.ITMS).appendTo(a);
                    g.append(a)
                } else {
                    g.append($.tmpl('<option ftype="checkbox" value="${FLDID}">${LBL}</option>', j))
                }
            }
            if (j.TYP === 'goods') {
                f = true;
                if (b) {
                    a = $.tmpl('<optgroup label="${LBL}"></optgroup>', j);
                    $.tmpl('<option ftype="goods" value="${NM}">${VAL}</option>', j.ITMS).appendTo(a);
                    g.append(a)
                } else {
                    g.append($.tmpl('<option ftype="goods" value="${FLDID}">${LBL}</option>', j))
                }
            } else {
                if (j.TYP === 'address') {
                    a = $($.tmpl('<optgroup label="${LBL}"></optgroup>', j));
                    a.append($.format('<option ftype="address" value="{0}">{1}省/自治区/直辖市</option>', j.SUBFLDS.PRV.NM, c ? j.LBL + '-' : ''));
                    a.append($.format('<option ftype="address" value="{0}">{1}市</option>', j.SUBFLDS.CITY.NM, c ? j.LBL + '-' : ''));
                    a.append($.format('<option ftype="address" value="{0}">{1}区/县</option>', j.SUBFLDS.ZIP.NM, c ? j.LBL + '-' : ''));
                    a.append($.format('<option ftype="address" value="{0}">{1}详细地址</option>', j.SUBFLDS.DTL.NM, c ? j.LBL + '-' : ''));
                    g.append(a)
                } else {
                    if (j.TYP === 'dropdown2') {
                        var k = 1;
                        for (ddn in j.SUBFLDS) {
                            g.append($.tmpl('<option ftype="dropdown2" value="${NM}">${LBL}</option>', {
                                NM: j.SUBFLDS[ddn].NM,
                                LBL: j.LBL + '(' + (k++) + ')'
                            }))
                        }
                    } else {
                        if (j.TYP === 'map') {
                            g.append($.tmpl('<option ftype="map" value="${NM}">${LBL}</option>', {
                                NM: j.SUBFLDS.TXT.NM,
                                LBL: j.LBL
                            }))
                        } else {
                            if (j.TYP === 'file') {
                                a = $($.tmpl('<optgroup label="${LBL}"></optgroup>', j));
                                a.append($.format('<option ftype="file" value="{0}">{1}文件类型</option>', j.SUBFLDS.TYP.NM, c ? j.LBL + '-' : ''));
                                a.append($.format('<option ftype="filesize" value="{0}">{1}文件大小</option>', j.SUBFLDS.SZ.NM, c ? j.LBL + '-' : ''));
                                a.append($.format('<option ftype="file" value="{0}">{1}文件名称</option>', j.SUBFLDS.NM.NM, c ? j.LBL + '-' : ''));
                                g.append(a)
                            } else {
                                if (j.TYP === 'likert') {
                                    a = $($.tmpl('<optgroup label="${LBL}"></optgroup>', j));
                                    $.tmpl('<option ftype="likert" value="${NM}">${LBL}</option>', j.ITMS).appendTo(a);
                                    g.append(a)
                                } else {
                                    if (j.NM) {
                                        g.append($.tmpl('<option ftype="${TYP}" value="${NM}">${LBL}</option>', j))
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        if (f) {
            g.append('<option ftype="money" value="AMT">金额</option>');
            g.append('<option ftype="text" value="PAYSTATUS">在线支付状态</option>')
        }
        var d = window.FRM || window.F || {};
        if ('1' == d.EX) {
            g.append('<option ftype="text" value="EX">扩展属性</option>')
        }
        if (e) {
            this._fillCommonFields(g)
        }
    },
    getConditions: function (c) {
        var b = {
                money: 'number',
                goods: 'number',
                number: 'number',
                date: 'date',
                time: 'time',
                filesize: 'filesize'
            },
            e = [],
            a,
            d;
        $('li.conditions', c).each(function (g, f) {
            d = $(f).find('select.conditionSelect');
            if (d.length > 0) {
                dataType = b[d.find('option:selected').attr('ftype')];
                if (d.val()) {
                    a = {
                        FLD: d.val(),
                        DTYP: dataType === undefined ? 'string' : dataType,
                        CTYP: $(f).find('select.compareType').val(),
                        VAL: $(f).find(':text.conditionValue').val()
                    };
                    e.push(a)
                }
            }
        });
        return e
    },
    getMatchType: function () {
        return $('#anyallSelect').val()
    },
    initFilters: function (a, b) {
        if (!b) {
            b = $('#dsUL')
        }
        $('#filterType').change(function () {
            if ($(this).val() === 'all') {
                $('#dataSource').addClass('middle');
                b.find('li.conditionType,li.conditions').addClass('hide')
            } else {
                $('#dataSource').removeClass('middle');
                b.find('li.conditionType,li.conditions').removeClass('hide');
                b.find('li.conditions:gt(0)').remove();
                var c = b.find('li.conditions:eq(0)');
                c.find('select.compareType').empty();
                c.find(':input').val('')
            }
        });
        b.find('select.conditionSelect').live({
            change: function () {
                var c = $(this).parent().parent();
                ddl = c.find(('select.compareType')),
                    type = $(this).find('option:selected').attr('ftype');
                if (a && type === 'checkbox') {
                    c.find('input.conditionValue').prop({
                        value: $(this).find('option:selected').text()
                    }).css('visibility', 'hidden')
                } else {
                    c.find('input.conditionValue').removeAttr('style').val('')
                }
                FilterWidget.fillOperations(ddl, type, a);
                FilterWidget._fillConditionValue($(this), ddl)
            }
        });
        b.find('select.compareType').live({
            change: function () {
                var c = $(this).parent().parent(),
                    d = c.find(('select.conditionSelect'));
                FilterWidget._fillConditionValue(d, $(this))
            }
        });
        if (a) {
            b.find('a.icononly-add').live({
                click: function () {
                    var c = $(this).parent().parent(),
                        e = $('<li><span class="indent"></span> <span><select class="andor"><option value="and">并且</option><option value="or">或者</option></select></span></li>'),
                        d = $('<li class="conditions"><span class="indent"></span><span> <select name="FLD" class="fixed conditionSelect"></select> </span> <span> <select name="CTYP" class="compareType"></select> </span> <span><input name="VAL" type="text" class="text conditionValue"></span><span> <a class="icononly-add iconfont" title="添加一个新的过滤条件">&#xe60b;</a><a class="icononly-del iconfont" title="删除此过滤条件">&#xe619;</a></span></li>');
                    e.find('select.andor').val(b.find('ul.dsUL').has(c).find('select.andor:eq(0)').val());
                    FilterWidget.fillAllFields(d.find('select.conditionSelect'), true, false);
                    c.after(d).after(e);
                    return false
                }
            });
            b.find('a.icononly-del').live({
                click: function () {
                    var c = $(this).parent().parent(),
                        e = c.index(),
                        d = c.parent();
                    if (d.find('>li.conditions').length <= 1) {
                        return false
                    }
                    if (e == 0) {
                        d.find('li:eq(' + (e + 1) + ')').remove()
                    } else {
                        d.find('li:eq(' + (e - 1) + ')').remove()
                    }
                    c.remove();
                    d.find('li.conditions:first').find('span.indent').text('如果');
                    return false
                }
            });
            b.find('select.conditionSelect').each(function (c, d) {
                FilterWidget.fillAllFields($(d), true, false)
            })
        } else {
            b.find('a.icononly-add').die().live({
                click: function () {
                    var c = $(this).parent().parent(),
                        d = $('<li class="conditions"><span> <select name="FLD" class="fixed conditionSelect"></select> </span> <span> <select name="CTYP" class="compareType"></select> </span> <span style="position: relative; z-index: 10000;"> <input name="VAL" type="text" class="text conditionValue"></span> <span> <a class="icononly-add iconfont" title="添加一个新的过滤条件">&#xe60b;</a><a class="icononly-del iconfont" title="删除此过滤条件">&#xe619;</a></span></li>');
                    FilterWidget.fillAllFields(d.find('select.conditionSelect'), true, true);
                    c.after(d);
                    return false
                }
            });
            b.find('a.icononly-del').live({
                click: function () {
                    var c = $(this).parent().parent(),
                        d = c.parent();
                    if (d.find('li.conditions').length <= 1) {
                        return false
                    }
                    c.remove();
                    return false
                }
            });
            b.find('a.icononly-curuser').live({
                click: function () {
                    var c = $(this).parent().parent();
                    c.find('input.conditionValue').val('#{username}')
                }
            });
            this.fillAllFields(b.find('select.conditionSelect:eq(0)'), true, true)
        }
    },
    setValues: function (d, e) {
        var a,
            b;
        if (!e) {
            e = $('#dsUL')
        }
        e.find('li.conditions:gt(0)').remove();
        $(d).each(function (h, c) {
            if (h > 0) {
                a = dsLi.clone();
                a.find('a.icononly-del').show();
                e.append(a)
            } else {
                a = e.find('li.conditions:eq(0)');
                if (!dsLi) {
                    dsLi = a.clone()
                }
            }
            a.find(':text.conditionValue').datepicker('destroy');
            var g = a.find('select.conditionSelect'),
                f = a.find('select.compareType'),
                j = a.find(':text.conditionValue');
            g.val(c.FLD);
            f.removeClass('dateSelect');
            b = g.find('option:selected').attr('ftype');
            FilterWidget.fillOperations(f, b);
            f.val(c.CTYP);
            j.val(c.VAL);
            FilterWidget._fillConditionValue(g, f)
        })
    },
    getCommonFields: function () {
        var a = [];
        a.push({
            TYP: 'text',
            NM: 'IP',
            LBL: 'IP地址'
        });
        a.push({
            TYP: 'text',
            NM: 'CBY',
            LBL: '创建人'
        });
        a.push({
            TYP: 'date',
            NM: 'CDATE',
            LBL: '创建日期'
        });
        a.push({
            TYP: 'date',
            NM: 'CTIME',
            LBL: '创建时间'
        });
        a.push({
            TYP: 'text',
            NM: 'UPBY',
            LBL: '最后修改人'
        });
        a.push({
            TYP: 'date',
            NM: 'UPTIME',
            LBL: '最后修改时间'
        });
        a.push({
            TYP: 'number',
            NM: 'TMOUT',
            LBL: '填写耗时(秒)'
        });
        return a
    },
    _fillCommonFields: function (a) {
        grp = $('<optgroup label="其他信息"></optgroup>');
        $(FilterWidget.getCommonFields()).each(function (b, c) {
            grp.append($.format('<option ftype="{0}" value="{1}">{2}</option>', c.TYP, c.NM, c.LBL))
        });
        a.append(grp)
    },
    _fillConditionValue: function (c, b) {
        var f = c.find('option:selected'),
            g = f.attr('ftype'),
            e = c.val(),
            h = b.val(),
            a = c.parent().parent(),
            d = a.find(':text.conditionValue');
        d.datepicker('destroy');
        if (g === 'date') {
            a.find('input.conditionValue').datepicker({
                showOn: 'button',
                buttonImage: '/rs/css/images/calendar.png',
                buttonImageOnly: true,
                dateFormat: 'yy-mm-dd',
                monthNames: Date.defMonthNames,
                monthNamesShort: Date.defAbbrMonthNames,
                dayNames: Date.defAbbrDayNames,
                dayNamesMin: Date.defDayNames
            }).unbind();
            a.find('img.ui-datepicker-trigger').addClass('ui-datepicker-trigger-center').show();
            a.find('a.icononly-curuser').remove();
            a.find('a.icononly-add').css({
                'margin-left': '16px'
            });
            a.find('a.icononly-del').css({
                'margin-left': '36px'
            });
            a.find('span.selectTime').hide()
        } else {
            if (g === 'time') {
                a.find('img.ui-datepicker-trigger').hide();
                a.find('a.icononly-curuser').remove();
                a.find('a.icononly-add').css({
                    'margin-left': '3px'
                });
                a.find('a.icononly-del').css({
                    'margin-left': '23px'
                });
                a.find('span.selectTime').show()
            } else {
                if (g === 'text' || g === 'radio' || g === 'name' || g === 'email' || g === 'dropdown') {
                    a.find('img.ui-datepicker-trigger,span.selectTime').hide();
                    if (a.find('a.icononly-curuser').length == 0) {
                        a.find('a.icononly-add').before('<a class=\'icononly-curuser iconfont\' title=\'当前用户\'>&#xe652;</a>')
                    }
                    a.find('a.icononly-add').css({
                        'margin-left': '3px'
                    });
                    a.find('a.icononly-del').css({
                        'margin-left': '23px'
                    })
                } else {
                    a.find('img.ui-datepicker-trigger,span.selectTime').hide();
                    a.find('a.icononly-curuser').remove();
                    a.find('a.icononly-add').css({
                        'margin-left': '3px'
                    });
                    a.find('a.icononly-del').css({
                        'margin-left': '23px'
                    })
                }
            }
        }
        if (g === 'filesize') {
            if (a.find('span.unit').length === 0) {
                d.after('<span class=\'unit\'> MB </span>')
            }
        } else {
            a.find('span.unit').remove()
        }
        if (h === 'in' || h === 'nin') {
            d.attr('title', '多个值以";"隔开')
        } else {
            if (g === 'date') {
                d.attr('title', '日期格式：YYYY-MM-DD')
            } else {
                if (g === 'time') {
                    d.attr('title', '时间格式：HH:MM:SS')
                } else {
                    if (g === 'filesize') {
                        d.attr('title', '单位：MB')
                    } else {
                        d.attr('title', '')
                    }
                }
            }
        }
    }
};
$.widget('jsform.userselect', {
    options: {
        showbind: false,
        valuefield: 'USERNAME',
        onconfirm: function () {
        }
    },
    getTexts: function () {
        return this.element.data('txts') || []
    },
    getValues: function () {
        return this.element.data('vals') || []
    },
    setValues: function (a) {
        return this.element.data('vals', a)
    },
    _create: function () {
        var a = $('#overlay'),
            c = $('#divUsers'),
            g = this,
            b = this.options,
            d = this.element;
        if (a.length == 0) {
            a = $('<div id="overlay" class="overlay hide"></div>');
            $('body').append(a)
        }
        if (c.length == 0) {
            c = $('<div id="divUsers" class="lightbox ss hide"><div class="lbcontent"><div class="close-holder"><a class="iconfont close" href="#">&#xe638;</a></div><h3 class="title">选择用户</h3><ul class="tree"></ul><div class="btns">\t<a href="#" class="btn confirm blue">确定</a></div></div></div>');
            $('body').append(c)
        }
        if (c.draggable) {
            c.draggable({
                handle: ('div.close-holder')
            })
        }
        d.click(function () {
            g._openWindow()
        });
        c.find('a.confirm').click(function () {
            var i = [],
                h = [];
            c.find('input.val:checked').each(function (l, k) {
                var j = $(k);
                i.push(j.val());
                h.push(j.attr('text'))
            });
            d.data('txts', h);
            d.data('vals', i);
            if (b.onconfirm) {
                b.onconfirm()
            }
            g._closeWindow()
        });
        var e = $('#divUsers').find('li.l1');
        e.find('i').live({
            click: function () {
                var h = $(this).parent().parent(),
                    i = h.find('ul');
                if (i.is(':visible')) {
                    i.slideUp('fast');
                    $(this).html('&#xe611;')
                } else {
                    i.slideDown('fast');
                    $(this).html('&#xe610;')
                }
            }
        });
        e.find(':checkbox.grp').live({
            click: function () {
                var j = $(this),
                    h = j.parent().parent().parent(),
                    i = h.find('ul');
                i.find(':checkbox').each(function (l, k) {
                    if (!$(k).prop('disabled')) {
                        $(k).prop('checked', j.prop('checked'))
                    }
                })
            }
        });
        var f = $('#divUsers').find('li.l2');
        $(f).find(':checkbox').live({
            click: function () {
                if (!$(this).prop('checked')) {
                    $('#divUsers').find('li.l1').has(this).find(':checkbox.grp').prop('checked', false)
                }
            }
        });
        $('#divUsers a.close').click(function () {
            g._closeWindow()
        });
        $.showStatus('正在加载数据...');
        $.postJSON('/app/user/getalluser', {}, function (i) {
            var j = i.DEPT || [],
                k = i.USER || [];
            j.splice(0, 0, {
                _id: '',
                DEPT: '未分组'
            });
            var h = c.find('ul.tree').empty();
            $.each(j, function (m, p) {
                var l = '<li class="l1"><div><i class="iconfont gray">&#xe610;</i><label><input type="checkbox" class="grp" /> {0}</label></div></li>',
                    o = '';
                $.each(k, function (r, q) {
                    if ((q.DEPT || '') == p._id || q.DEPT == p.DEPT) {
                        var s = '<li class="l2 {0}"><label><input type="checkbox" {0} class="val" value="{1}" text="{2}" /> {2}</label></li>';
                        o += $.format(s, b.showbind && !q.WXID ? 'disabled' : '', q[b.valuefield] || '', (q.REALNAME ? q.REALNAME : q.USERNAME) + (b.showbind && !q.WXID ? '(未绑定微信)' : ''))
                    }
                });
                if (o) {
                    var n = $($.format(l, p.DEPT));
                    n.append('<ul>' + o + '</ul>');
                    h.append(n)
                }
            });
            $.hideStatus()
        })
    },
    _closeWindow: function () {
        var a = $('#overlay'),
            b = $('#divUsers');
        a.addClass('hide');
        b.addClass('hide')
    },
    _openWindow: function () {
        var a = $('#overlay'),
            b = $('#divUsers'),
            d = this;
        a.removeClass('hide');
        b.removeClass('hide');
        var c = d.getValues();
        b.find('input.val').each(function (f, e) {
            $(e).prop('checked', $.inArray($(e).val(), c) >= 0 && !$(e).prop('disabled'))
        });
        a.removeClass('hide');
        b.removeClass('hide')
    }
});
$.widget('jsform.mutiselect', {
    options: {
        items: [],
        values: []
    },
    getValues: function () {
        return this.element.data('values')
    },
    setValues: function (a) {
        if (!(a instanceof Array)) {
            a = [
                a
            ]
        }
        this.options.values = a;
        this._setSelected()
    },
    _create: function () {
        var d = this.element,
            c = this.options;
        var e = $('<div class="mutiselect"><input type="text" readonly class="txt"/><i class="trigger iconfont">&#xe632;</i></div>');
        var a = e.find('input.txt');
        a.width(d.width() - 25);
        if (c.items.length == 0) {
            d.find('option').each(function (g, f) {
                var h = $(f);
                if (h.val()) {
                    c.items.push({
                        VAL: h.val(),
                        TXT: h.text()
                    })
                }
            })
        }
        d.hide();
        d.parent().append(e);
        var b = d.parent().find('ul.mutiselect-items');
        if (b.length == 0) {
            b = $('<ul class="mutiselect-items hide"></ul>');
            e.append(b);
            $.each(c.items, function (f, g) {
                b.append($.format('<li><label title="{1}"><input type="checkbox" value="{0}" text="{1}" {2} /> {1}</label></li>', g.VAL, g.TXT, $.inArray(g.VAL, c.values) >= 0 ? 'checked' : ''))
            });
            b.width(e.outerWidth() - 2);
            b.position({
                my: 'left top',
                at: 'left bottom',
                of: e
            })
        }
        this._setSelected();
        e.click(function (g) {
            var f = d.parent().find('ul.mutiselect-items');
            if (f.is(':visible')) {
                f.addClass('hide')
            } else {
                f.removeClass('hide');
                f.width($(this).outerWidth() - 2);
                f.position({
                    my: 'left top',
                    at: 'left bottom',
                    of: e
                })
            }
            g.stopPropagation()
        });
        b.find('li').bind({
            click: function (i) {
                var g = $(this).parent(),
                    h = [],
                    f = [];
                g.find(':checkbox:checked').each(function (l, k) {
                    var j = $(k);
                    f.push(j.attr('text'));
                    h.push(j.val())
                });
                a.val(f.join(','));
                d.data('values', h);
                i.stopPropagation()
            }
        });
        $(document).click(function (f) {
            var g = f.srcElement ? f.srcElement : f.target;
            if (!$(g).is('ul.mutiselect-items li')) {
                $('ul.mutiselect-items').addClass('hide')
            }
        })
    },
    _setSelected: function () {
        var f = this.element,
            d = this.options,
            c = f.parent(),
            a = f.parent().find('div.mutiselect').find('input.txt');
        var b = [],
            e = [];
        c.find(':checkbox').each(function (j, h) {
            var g = $(h),
                k = $.inArray(g.val(), d.values) >= 0;
            g.prop('checked', k);
            if (k) {
                b.push(g.attr('text'));
                e.push(g.val())
            }
            a.val(b.join(','));
            f.data('values', e)
        })
    }
});
$.widget('jsform.poptip', {
    options: {
        position: 'bottom'
    },
    _create: function () {
        var a = this.options,
            b = this.element,
            c = this;
        b.bind({
            mouseover: function () {
                if (!b.attr('poptip')) {
                    return false
                }
                c._showPopTip();
                $('#poptip').css({
                    marginTop: '5px'
                })
            },
            mouseout: function () {
                $('#poptip').css({
                    marginTop: '0px'
                });
                c._hidePopTip()
            }
        })
    },
    _showPopTip: function () {
        var c = this.options,
            d = this.element;
        if ($('#poptip').length == 0) {
            $('body').append('<div id="poptip" class="poptip"><span class="hide poptip-arrow poptip-arrow-top"><em>◆</em><i>◆</i></span><span class="hide poptip-arrow poptip-arrow-bottom"><em>◆</em><i>◆</i></span><span class="poptip-text"></span></div>')
        }
        var b = $('#poptip').find('span.poptip-arrow-' + c.position),
            a = $('#poptip').find('span.poptip-text');
        $('#poptip').find('span.poptip-arrow').hide();
        a.text(d.attr('poptip'));
        b.show();
        if ('top' == c.position) {
            $('#poptip').show().position({
                of: d,
                at: 'center bottom',
                my: 'center top'
            })
        } else {
            if ('bottom' == c.position) {
                $('#poptip').show().position({
                    of: d,
                    at: 'center top',
                    my: 'center bottom'
                })
            }
        }
        b.css({
            marginLeft: (a.width() - b.width()) / 2
        })
    },
    _hidePopTip: function () {
        $('#poptip').hide()
    }
});
(function (a) {
    a.fn.extend({
        insertContent: function (i, j) {
            var g = a(this) [0];
            if (document.selection) {
                this.focus();
                var d = document.selection.createRange();
                d.text = i;
                this.focus();
                d.moveStart('character', -e);
                var f = d.text.length;
                if (arguments.length == 2) {
                    var e = g.value.length;
                    d.moveEnd('character', f + j);
                    j <= 0 ? d.moveStart('character', f - 2 * j - i.length) : d.moveStart('character', f - j - i.length);
                    d.select()
                }
            } else {
                if (g.selectionStart || g.selectionStart == '0') {
                    var h = g.selectionStart;
                    var b = g.selectionEnd;
                    var c = g.scrollTop;
                    g.value = g.value.substring(0, h) + i + g.value.substring(b, g.value.length);
                    this.focus();
                    g.selectionStart = h + i.length;
                    g.selectionEnd = h + i.length;
                    g.scrollTop = c;
                    if (arguments.length == 2) {
                        g.setSelectionRange(h - j, g.selectionEnd + j);
                        this.focus()
                    }
                } else {
                    this.value += i;
                    this.focus()
                }
            }
        },
        autoDisplayRel: function () {
            var b = a(this);
            b.each(function () {
                var e = a(this),
                    d = a(e.attr('rel')),
                    f = e.attr('relbg'),
                    c = e.attr('clear') || '1';
                e.bind({
                    click: function () {
                        if (a(this).prop('checked')) {
                            if (e.is(':radio')) {
                                a(':radio[name=\'' + e.attr('name') + '\']').each(function (g, h) {
                                    if (a(h).attr('rel')) {
                                        a(a(h).attr('rel')).addClass('hide')
                                    }
                                })
                            }
                            d.removeClass('hide');
                            if (f) {
                                a(f).removeClass('bgwhite bggray').addClass('bggray')
                            }
                        } else {
                            if (c != '0') {
                                d.setValues({}, true)
                            }
                            d.addClass('hide');
                            if (f) {
                                a(f).removeClass('bgwhite bggray').addClass('bgwhite')
                            }
                        }
                    }
                })
            })
        }
    })
})(jQuery);
