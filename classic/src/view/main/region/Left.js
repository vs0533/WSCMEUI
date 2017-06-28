/**
 * 左边的菜单区域，可以放树形菜单或折叠菜单
 */
Ext.define('WsCme.view.main.region.Left', {
    extend : 'Ext.panel.Panel',
    alias : 'widget.mainmenuregion',

    requires : [ 'WsCme.view.main.menu.MainMenuTree',
        'WsCme.view.main.menu.AccordionMainMenu'],

    layout : {
        type : 'fit'
    },
    iconCls : 'fa fa-list',

    title : '菜单',

    tools : [ {
        itemId : 'up',
        type : 'up',
        tooltip : '在上面显示菜单条',
        handler : 'showMainMenuToolbar'
    }, {
        type : 'expand',
        reference : 'expandtool',
        handler : 'expandTreeMenu',
        tooltip : '展开所有菜单项'
    }, {
        type : 'collapse',
        reference : 'collapsetool',
        handler : 'collapseTreeMenu',
        tooltip : '折叠所有菜单项'
    }, {
        type : 'pin',
        tooltip : '层叠方式显示菜单',
        listeners : {
            click : 'setAccordionMenu'
        }
    }, {
        type : 'unpin',
        tooltip : '树状方式显示菜单',
        hidden : true,
        listeners : {
            click : 'setTreeMenu'
        }
    } ],

    initComponent : function() {
        console.log('left region init......');
        this.items = [ {
            xtype : 'mainmenutree',
            reference : 'mainmenutree'
        }, {
            xtype : 'mainmenuaccordion',
            hidden : true
        } ];
        this.callParent();
    }

});