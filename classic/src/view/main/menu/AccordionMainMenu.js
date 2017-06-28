/**
 * 折叠式(accordion)菜单，每一个里面放了一棵树，只是当前菜单的内容
 */

Ext.define('WsCme.view.main.menu.AccordionMainMenu', {
    extend : 'Ext.panel.Panel',
    alias : 'widget.mainmenuaccordion',

    requires : [ 'WsCme.view.main.menu.AccordionMenuTree' ],

    layout : {
        type : 'accordion',
        animate : true
    },

    initComponent : function() {
        this.items = [];
        var vm = this.up('app-main').getViewModel();
        var menus = vm.get('menus');
        var me = this;
        for ( var i in menus) {
            var menugroup = menus[i];
            this.items.push({
                title : menugroup.title,
                xtype : 'accordionmenutree',
                menuGroup : vm.getTreeMenuItem(menugroup, true)
            });
        }
        this.callParent(arguments);
    }
});