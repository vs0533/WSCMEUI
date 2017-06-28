/**
 * 显示在标准菜单条的菜单之前的，可以选择其他二种菜单方式的按钮
 */
Ext.define('WsCme.view.main.widget.MenuChangeToolbar', {
    extend : 'Ext.Component',
    // alias : 'widget.menuchangetoolbar',
    xtype:'menuchangetoolbar',
    style:'border:1px solid red;',
    html : '<span id="menu_buttonmenu" class="fa fa-caret-up menuchange"></span>'
    + '<span id="menu_treemenu" class="fa fa-caret-down menuchange"></span>',

    listeners : {

        render : function() {
            var test = Ext.get('menu_treemenu');
            Ext.get('menu_treemenu').on('click', function() {
                this.up('app-main').getController().showLeftMenuRegion();
            }, this);

            Ext.create('Ext.tip.ToolTip', {
                target : 'menu_treemenu',
                html : '在左边显示树形菜单'
            });

            Ext.get('menu_buttonmenu').on('click', function() {
                this.up('app-main').getController().showButtonMenu();
            }, this);

            Ext.create('Ext.tip.ToolTip', {
                target : 'menu_buttonmenu',
                html : '在顶部显示按钮菜单'
            });
        }
    }

});