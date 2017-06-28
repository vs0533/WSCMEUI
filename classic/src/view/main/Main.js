Ext.define('WsCme.view.main.Main', {
    xtype: 'app-main',
    requires: [
        'WsCme.view.main.region.Top',
        'WsCme.view.main.MainModel',
        // 'WsCme.view.main.Menu',
        // 'WsCme.view.main.MainController',
        // 'WsCme.view.main.MainModel',
        // 'WsCme.view.main.Header',
        'WsCme.view.main.ContentPanel'
    ],
    controller: 'main',
    viewModel: 'main',
    extend: 'Ext.container.Viewport',
    layout: 'border',
    initComponent:function () {
        Ext.setGlyphFontFamily('FontAwesome'); // 设置图标字体文件，只有设置了以后才能用glyph属性
        this.items= [
            {
                region: "north",
                xtype: 'maintop'
            },
            // {
            //     region: "west",
            //     xtype: 'mainmenu'
            // },
            {
                region: "center",
                xtype:'panel',
                title:'ss'
            }
        ];
        this.callParent();
    }

});