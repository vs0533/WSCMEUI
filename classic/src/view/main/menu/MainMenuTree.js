/**
 * 树状菜单，显示在主界面的左边
 */
Ext.define('WsCme.view.main.menu.MainMenuTree', {
    extend : 'Ext.tree.Panel',
    // alias : 'widget.mainmenutree',
    xtype:'mainmenutree',
    requires : [ 'app.lib.TreeSearchField', 'app.lib.TreeFilter' ],

    rootVisible : true,
    lines : false,

    mixins : {
        treeFilter : 'app.lib.TreeFilter' // 混合tree内部筛选的filter
    },

    listeners : {
        itemclick : 'onMenuTreeItemClick'
    },

    initComponent : function() {
        var vm = this.up('app-main').getViewModel();
        var c = vm.getTreeMenus();
        for (x in c)
            delete c[x].iconCls;

        this.store = Ext.create('Ext.data.TreeStore', {
            root : {
                text : '系统菜单',
                leaf : false,
                expanded : true,
                children : c
            }
        });

        this.bbar = [ {
            xtype : 'treesearchfield',
            emptyText : '输入筛选值',
            labelAlign : 'right',
            labelWidth : 32,
            flex : 1,
            treePanel : this
        } ];

        this.callParent(arguments);

    }
});