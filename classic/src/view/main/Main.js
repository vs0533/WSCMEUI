Ext.define('WsCme.view.main.Main', {
    xtype: 'app-main',
    requires: [
        'WsCme.view.main.MainController',
        'WsCme.view.main.region.Top',
        'WsCme.view.main.MainModel',
        'WsCme.view.main.region.Left',
        'WsCme.view.main.region.Center',
        'WsCme.view.main.region.Bottom',
        'WsCme.view.main.widget.ShowHeaderToolbar',
        'WsCme.view.main.menu.MainMenuToolbar'
    ],
    controller: 'main',
    viewModel: {
        type: 'main'
    },
    extend: 'Ext.container.Viewport',
    layout: {
        type: 'border'
    },
    listeners: {
        resize: 'onMainResize'
    },
    // 隐藏或显示顶部或底部区域的控件
    showOrHiddenToolbar: null,

    items: [
        {
            region: "north",
            title: '信息面版，左边的菜单面版，中间的模块信息显示区域',
            xtype: 'maintop'
        },
        {
            xtype: 'mainmenutoolbar',
            region: 'north', // 把他放在maintop的下面
            hidden: true, // 默认隐藏
            bind: {
                hidden: '{!isToolbarMenu}' // 如果不是标准菜单就隐藏
            }
        },
        {
            xtype: 'mainbottom',
            region: 'south' // 把它放在最底下
        },
        {
            xtype: 'mainmenuregion',
            reference: 'mainmenuregion',
            region: 'west', // 左边面板
            width: 220,
            collapsible: true,
            split: true,
            hidden: true, // 系统默认是显示此树状菜单。这里改成true也可以，你就能看到界面显示好后，再显示菜单的过程
            bind: {
                hidden: '{!isTreeMenu}'
            }
        },
        {
            region: "center",
            // xtype: 'maincenter'
            title:'sdf'
        }
    ],

    initComponent: function () {
        Ext.setGlyphFontFamily('FontAwesome'); // 设置图标字体文件，只有设置了以后才能用glyph属性

        app.viewport = this;

        this.showOrHiddenToolbar = Ext.widget('showheadertoolbar');
        this.callParent(arguments);
    }

});