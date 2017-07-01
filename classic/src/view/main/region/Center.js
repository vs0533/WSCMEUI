/**
 * 系统界面的主区域,是一个tabpanel,可以有多个tab页面，用来放置各个模块。
 */
Ext.define('WsCme.view.main.region.Center', {
    extend: 'Ext.tab.Panel',
    // alias : 'widget.maincenter',
    xtype: 'maincenter',
    // uses : [ 'WsCme.view.main.region.HomePage' ],
    requires: ['Ext.ux.TabReorderer', 'Ext.ux.TabCloseMenu',
        'Ext.menu.Separator'],

    closeAction: 'hide',
    autoDestroy: false,

    //ui: 'navigation',

    tabBar: {
        style: 'background-color : #426ab3;'
    },

    defaults: {
        bodyPadding: 1,
        reorderable: true
    },

    bind: {
        tabPosition: '{centerTabPosition}',
        tabRotation: '{centerTabRotation}'
    },

    plugins: [
        {
            ptype: 'tabclosemenu',
            closeAllTabsText: '关闭所有',
            closeOthersTabsText: '关闭其他',
            closeTabText: '关闭',

            extraItemsTail: ['-', {
                text: '可关闭',
                itemId: 'canclose',
                checked: true,
                hideOnClick: false,
                handler: function (item) {
                    item.ownerCt.tabPanel.tab.setClosable(item.checked);
                }
            }, '-', {
                text: '登录时自动打开',
                itemId: 'autoopen',
                checked: false,
                hideOnClick: false,
                handler: 'moduleAutoOpenMenuClick'

            }, {
                text: '登录时自动打开并定位到',
                itemId: 'autoopenandselect',
                checked: false,
                hideOnClick: false,
                handler: 'moduleAutoOpenAndSelectedMenuClick'

            }, '-', {
                xtype: 'fieldcontainer',
                items: {
                    xtype: 'numberfield',
                    fieldLabel: '最多打开Tab数',
                    itemId: 'maxtab',
                    width: 176,
                    bind: '{maxOpenTab}',
                    maxValue: 20,
                    minValue: 3
                }
            }],
            listeners: {
                beforemenu: function (menu, tabPanel) {
                    menu.tabPanel = tabPanel;
                    console.log(tabPanel);
                    if (tabPanel.reorderable) {
                        menu.down('#canclose').setChecked(tabPanel.closable);
                        menu.down('#canclose').enable();
                    } else {
                        menu.down('#canclose').setChecked(false);
                        menu.down('#canclose').disable();
                    }

                    // 如果是有parentFilter的模块，那么自动打开的菜单条隐掉 ，上面的'-'也隐掉
                    // 自动打开模块
                    var autoopenmenu = menu.down('#autoopen');
                    var canautoopen = (!tabPanel.parentModuleName) && tabPanel.reorderable;
                    autoopenmenu.setVisible(canautoopen);
                    autoopenmenu.previousSibling().setVisible(canautoopen);
                    autoopenmenu.setChecked(app.viewport.getController()
                        .isModuleAutoOpen(tabPanel));
                    // 自动打开并定位到
                    var autoopenandselect = menu.down('#autoopenandselect');
                    autoopenandselect.setVisible(canautoopen);
                    autoopenandselect.setChecked(app.viewport.getController()
                        .isModuleAutoOpenAndSelected(tabPanel));
                }
            }
        }
        // ,
        // {
        //     ptype: 'tabreorderer'
        // }
        ],

    listeners: {
        add: 'onTabAdd',
        afterrender: 'centerAfterRender'
    },

    initComponent: function () {
        console.log('center region init');
        this.items = [{
            xtype : 'homepage',
            reorderable : false
            // title: '11'
        }];
        this.callParent();
    }

});