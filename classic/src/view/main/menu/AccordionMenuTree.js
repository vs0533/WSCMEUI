/**
 * 手风琴式菜单的内容，树状菜单，显示在主界面的左边
 */
Ext.define('WsCme.view.main.menu.AccordionMenuTree', {
    extend : 'Ext.tree.Panel',
    // alias : 'widget.accordionmenutree',
    xtype:'accordionmenutree',
    rootVisible : true,
    lines : false,

    listeners : {
        itemclick : 'onMenuTreeItemClick'
    },

    initComponent : function() {
        var vm = this.up('app-main').getViewModel();
        this.store = Ext.create('Ext.data.TreeStore', {
            root : this.menuGroup
        });
        this.callParent(arguments);
    }
});