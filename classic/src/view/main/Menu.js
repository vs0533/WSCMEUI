/**
 * Created by byron on 2017/6/25.
 */
Ext.define('WsCme.view.main.Menu', {
    extend: 'Ext.panel.Panel',
    xtype: 'mainmenu',
    title: "系统菜单",
    glyph:0xf015,
    iconCls:'ic-add',
    width: 200,
    // layout: "accordion",
    animCollapse: false,
    collapsed: false,
    collapseFirst: true,
    autoScroll : true,
    border: false,
    autoWidth: true,
    split: true,
    collapsible: true,
    splitterResize: true,
    layoutConfig: {
        titleCollapse: true,
        animate: true,
        activeOnTop: false
    },
    items: [
        {
            xtype: 'treepanel',
            animCollapse: false,
            border: false,
            rootVisible: false,
            store:Ext.create("store.navigation")
            // title: "基本信息",
            // items: [treepanel_1]
        }
    ],
    bbar: [
        {
            xtype: "button",
            glyph : 0xf08b,
            action:"logout",
            text: "安全退出系统"
        }
    ]
});