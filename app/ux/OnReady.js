/**
 * 这里存放了Grid的列renderer的各种自定义的方法
 */

Ext
    .onReady(function() {

        console.log('Ext onReady 加载完成......');

        // 可以制作一个控件，来修改这二个属性，达到可以修改金额单位的目的
        Ext.monetaryText = '万'; // 加在数字后面的金额单位
        Ext.monetaryUnit = 10000;
        Ext.monetary = WsCme.view.main.widget.Monetary.getMonetary('tenthousand');
        // 金额单位放置的位置 behindnumber or columntitle
        Ext.monetaryPosition = 'behindnumber';

        // Ext.monetary = '亿';
        // Ext.monetaryUnit = 10000*10000;

        if (Ext.util && Ext.util.Format) {

            Ext
                .apply(
                    Ext.util.Format,
                    {

                        addDataToolTip : function(val, metaData, model, row, col,
                                                  store, gridview) {
                            if (gridview) {
                                var column = gridview.getGridColumns()[col];
                                try {
                                    if (column && column.tooltipXTemplate)
                                        metaData.tdAttr = 'data-qtip="'
                                            + column.tooltipXTemplate.apply(model.data) + '"';
                                } catch (e) {
                                    console.log(e);
                                }
                            }
                        },

                        // 金额字段
                        monetaryRenderer : function(val, metaData, model, row, col,
                                                    store, gridview) {
                            if (val) {
                                if (Ext.monetaryUnit && Ext.monetaryUnit != 1)
                                    val = val / Ext.monetaryUnit;
                                // 正数用蓝色显示，负数用红色显示,必须css和返回的值分开来设置，否则不能autoSize()
                                metaData.style = 'color:' + (val > 0 ? 'blue' : 'red')
                                    + ';';

                                Ext.util.Format.addDataToolTip(val, metaData, model, row,
                                    col, store, gridview);

                                return Ext.util.Format.number(val, '0,000.00')
                                    + Ext.monetaryText;
                            } else
                                return ''; // 如果为0,则不显示
                        },

                        // 日期
                        dateRenderer : function(val, metaData, model, row, col,
                                                store, gridview) {
                            if (metaData) {
                                metaData.style = 'color:#a40;';
                                Ext.util.Format.addDataToolTip(val, metaData, model, row,
                                    col, store, gridview);
                            }
                            return Ext.util.Format.date(val, 'Y-m-d');
                        },

                        // 浮点变量
                        floatRenderer : function(val, metaData, model, row, col,
                                                 store, gridview) {
                            if (metaData) {
                                metaData.style = 'color:' + (val > 0 ? 'blue' : 'red')
                                    + ';'
                                Ext.util.Format.addDataToolTip(val, metaData, model, row,
                                    col, store, gridview);
                            }
                            return val == 0 ? '' : Ext.util.Format.number(val,
                                '0,000.00');
                        },

                        // 整型变量
                        intRenderer : function(val, metaData, model, row, col, store,
                                               gridview) {
                            if (metaData) {
                                metaData.style = 'color:' + (val > 0 ? 'blue' : 'red')
                                    + ';';
                                // ';float:right;'; 这个去掉了，不然行业编辑的时候位置不对
                                Ext.util.Format.addDataToolTip(val, metaData, model, row,
                                    col, store, gridview);
                            }
                            return val == 0 ? '' : val;
                        },

                        // 百分比
                        percentRenderer : function(v, metaData, model) {
                            v = v * 100;
                            var v1 = v > 100 ? 100 : v;
                            v1 = v1 < 0 ? 0 : v1;
                            var v2 = parseInt(v1 * 2.55).toString(16);
                            if (v2.length == 1)
                                v2 = '0' + v2;
                            Ext.util.Format.addDataToolTip(val, metaData, model, row,
                                col, store, gridview);
                            return Ext.String
                                .format(
                                    '<div>'
                                    + '<div style="float:left;border:1px solid #008000;height:15px;width:100%;">'
                                    + '<div style="float:left;text-align:center;width:100%;color:blue;">{0}%</div>'
                                    + '<div style="background: #FAB2{2};width:{1}%;height:13px;"></div>'
                                    + '</div></div>', v, v1, v2);
                        },

                        percentNumberRenderer : function(v, rd, model) {
                            return '<span style="color: #00C;float:right;">'
                                + (v * 100 + ' %') + '</span>'
                        },

                        // 对模块的namefields字段加粗显示
                        nameFieldRenderer : function(val, metaData, model, row, col,
                                                     store, gridview) {
                            metaData.style = 'font-weight:bold;';
                            Ext.util.Format.addDataToolTip(val, metaData, model, row,
                                col, store, gridview);
                            return val;
                        },

                        defaultRenderer : function(val, metaData, model, row, col,
                                                   store, gridview) {
                            Ext.util.Format.addDataToolTip(val, metaData, model, row,
                                col, store, gridview);
                            return val;
                        },

                        booleanTextRenderer : function(val) {
                            return (val ? '是' : ' ');
                        }
                    });
        }

        // panel中的这二个字符串，没有汉化
        Ext.define("Ext.locale.zh_CN.panel.Panel", {
            override : "Ext.panel.Panel",
            collapseToolText : '折叠面板',
            expandToolText : '展开面板'
        });

        Ext.toastInfo = function(text, config) {
            var param = {
                title : '提示信息',
                html : text,

                border : true,
                // style : {
                // borderColor : '#9b95c9'
                // },
                saveDelay : 10,
                align : 'tr', // "br"/"bl"/"tr"/"tl"/"t"/"l"/"b"/"r"
                closable : true,
                minWidth : 200,
                useXAxis : false,

                slideInDuration : 800,
                slideBackDuration : 1500,
                iconCls : 'ux-notification-icon-smile',
                autoCloseDelay : 4000,
                slideInAnimation : 'elasticIn',
                slideBackAnimation : 'elasticIn'
            };
            Ext.apply(param, config);
            Ext.toast(param);
        };

        Ext.toastWarn = function(text, config) {
            var param = {
                title : '警告信息',
                html : text,
                border : true,
                // style : {
                // borderColor : '#9b95c9'
                // },
                // header : {
                // style : 'background-color : yellow;'
                // },
                saveDelay : 10,
                align : 'tr', // "br"/"bl"/"tr"/"tl"/"t"/"l"/"b"/"r"
                closable : true,
                minWidth : 200,
                useXAxis : false,

                slideInDuration : 800,
                slideBackDuration : 1500,
                iconCls : 'ux-notification-icon-warn',
                autoCloseDelay : 4000,
                slideInAnimation : 'elasticIn',
                slideBackAnimation : 'elasticIn'

            };
            Ext.apply(param, config);
            Ext.toast(param);
        };

        Ext.toastErrorInfo = function(text, config) {
            var param = {
                title : '错误信息',
                html : text,
                header : {
                    border : 1,
                    style : {
                        borderColor : 'red'
                    }
                },
                border : true,
                style : {
                    borderColor : 'red'
                },
                saveDelay : 10,
                align : 'tr', // "br"/"bl"/"tr"/"tl"/"t"/"l"/"b"/"r"
                closable : true,
                minWidth : 200,
                useXAxis : false,

                slideInDuration : 800,
                slideBackDuration : 1500,
                iconCls : 'ux-notification-icon-error',
                autoCloseDelay : 5000,
                slideInAnimation : 'elasticIn',
                slideBackAnimation : 'elasticIn'

            };
            Ext.apply(param, config);
            Ext.toast(param);
        };

    });

function getContextPath() {
    var contextPath = document.location.pathname;
    var index = contextPath.substr(1).indexOf("/");
    contextPath = contextPath.substr(0, index + 1);
    delete index;
    return contextPath;
};

var Cookies = {};

Cookies.get = function(name, defaultValue) {
    var cookies = document.cookie.split('; ');
    var i = cookies.length, cookie, value = null;
    while (i--) {
        cookie = cookies[i].split('=');
        if (cookie[0] === name) {
            value = unescape(cookie[1]);
        }
    }
    return value || defaultValue;
};

Cookies.set = function(name, value, expiredays) {
    var exdate = new Date();
    if (!expiredays)
        expiredays = 360;
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = name + '=' + escape(value)
        + ((expiredays == null) ? '' : ';expires=' + exdate.toGMTString());
};

Cookies.remove = function(name) {
    Cookies.set(name, null, -1);
};

String.prototype.startWith = function(str) {
    var reg = new RegExp("^" + str);
    return reg.test(this);
}

String.prototype.endWith = function(str) {
    if (str == null || str == '' || this.length == 0 || str.length > this.length)
        return false;
    if (this.substring(this.length - str.length) == str)
        return true;
    else
        return false;
};

String.format = function(src) {
    if (arguments.length == 0)
        return null;
    var args = Array.prototype.slice.call(arguments, 1);
    return src.replace(/\{(\d+)\}/g, function(m, i) {
        return args[i];
    });
};

// 根据字段类型取得该字段显示的颜色，一目了然
function getTypeClass(fieldType) {
    return fieldType == 'Date' ? 'datecolor'
        : (fieldType == 'Boolean' ? 'booleancolor' : (fieldType == 'Double'
        || fieldType == 'Integer' || fieldType == 'Float'
        || fieldType == 'Percent' ? 'numbercolor' : null));
}

function __smr(m, i) {
    app.modules.showModuleRecord(m, i);
};

// 给grid 中选中的筛选条件的记录的筛选部分换一下颜色
function filterTextSetBk(store, text) {
    if (!store)
        return text;
    var s = store;
    if (store.store)
        s = store.store;
    if (s.filters.items.length > 0)
        return text.replace(new RegExp(s.filters.items[0].value, 'gm'),
            '<span class="filtertext">' + s.filters.items[0].value + '</span>');
    else
        return text;
};

// 删除一个综合查询的筛选条件中的一项
function __delcond(id, mn, key) {
    var grid = app.viewport.down('conditionlistgrid#__conditionlistgrid' + id);
    grid.deleteConditionItem(mn, key);
}

// 根据tree 取得 综合查询的分组和字段的数组信息
function getGroupAndFieldsWithTree(tree) {
    var result = [];
    var groupOrder = 10;
    tree.getRootNode().eachChild(function(groupnode) {
        if (groupnode.hasChildNodes()) {
            var group = {
                groupTitle : groupnode.data.title,
                groupOrder : groupOrder,
                fields : []
            };
            groupOrder += 10;
            groupnode.eachChild(function(field) {
                group.fields.push({
                    fieldId : field.data.value,
                    moduleName : field.data.moduleName,
                    fieldTitle : field.data.title,
                    condition : field.data.condition,
                    aggregate : field.data.aggregate,
                    fieldType : field.data.fieldType
                });
            });
            result.push(group);
        }
    });
    return result;
}

function Base64() {
    _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    this.encode = function(input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = _utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output + _keyStr.charAt(enc1) + _keyStr.charAt(enc2)
                + _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
    }
    this.decode = function(input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = _utf8_decode(output);
        return output;
    }

    _utf8_encode = function(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }
        return utftext;
    }
    _utf8_decode = function(utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;
        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6)
                    | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
}
