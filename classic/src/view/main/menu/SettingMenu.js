/**
 * Created by byron on 2017/6/28.
 */
/**
 * 显示在顶部的按钮菜单，可以切换至标准菜单，菜单树
 */
Ext.define('WsCme.view.main.menu.SettingMenu', {
    extend : 'app.ux.ButtonTransparent',
    alias : 'widget.settingmenu',

    requires : [ 'Ext.menu.Separator', 'WsCme.view.main.menu.GridSettingForm' ],
    uses : [ 'WsCme.view.main.widget.Monetary' ],
    text : '设置',
    glyph:0xf013,
    tooltip : '系统偏好设置',
    autoRender : false,

    initComponent : function() {
        this.menu = [];
        this.menu.push({
            // autoRender : true, // 要加上这一句 bind 的值才能在生成的时候有效，否则必须自己指定
            text : '菜单样式',
            menu : [ {
                xtype : 'segmentedbutton',
                bind : {
                    value : '{menuType}' // 在外界改变了菜单样式之后，这里会得到反应
                },
                items : [ {
                    text : '标准菜单',
                    value : 'toolbar'
                }, {
                    text : '树形菜单',
                    value : 'tree'
                }, {
                    text : '按钮菜单',
                    value : 'button'
                } ]
            } ]
        }, {
            text : '主标签页设置',
            iconCls : 'fa fa-retweet',
            menu : [ {
                text : '位置',
                menu : [ {
                    xtype : 'segmentedbutton',
                    bind : {
                        value : '{centerTabPosition}'
                    },
                    defaultUI : 'default',
                    items : [ {
                        text : '上边',
                        value : 'top'
                    }, {
                        text : '左边',
                        value : 'left'
                    }, {
                        text : '下面',
                        value : 'bottom'
                    }, {
                        text : '右边',
                        value : 'right'
                    } ]
                } ]
            }, {
                text : '文字旋转',
                menu : [ {
                    xtype : 'segmentedbutton',
                    bind : {
                        value : '{centerTabRotation}'
                    },
                    defaultUI : 'default',
                    items : [ {
                        text : '默认',
                        value : 'default'
                    }, {
                        text : '不旋转',
                        value : 0
                    }, {
                        text : '旋转90度',
                        value : 1
                    }, {
                        text : '旋转270度',
                        value : 2
                    } ]
                } ]
            } ]
        }, {
            text : '列表设置',
            iconCls : 'fa fa-list-alt',
            menu : [ {
                xtype : 'gridsettingform'
            } ]
        }, '-', {
            text : '全部设为默认值',
            handler : 'onResetConfigClick'
        });
        this.callParent();
    }
});