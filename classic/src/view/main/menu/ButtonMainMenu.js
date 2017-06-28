/**
 * Created by byron on 2017/6/28.
 */
Ext.define('app.view.main.menu.ButtonMainMenu',{
    extend:'app.ux.ButtonTransparent',
    // alias:'widget.buttonmainmenu',
    xtype:'buttonmainmenu',
    text:'菜单',
    iconCls:'fa fa-list',
    initComponent:function(){
        this.menu = this.up('app-main').getViewModel().getMenus();
        this.callParent(arguments);
    }
});