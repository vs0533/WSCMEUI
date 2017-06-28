/**
 * Created by byron on 2017/6/28.
 */
Ext.define('WsCme.view.main.MainController',{
    extend:'Ext.app.ViewController',
    requires:[],
    alias:'controller.main',

    // 显示菜单条，隐藏左边菜单区域和顶部的按钮菜单。
    showMainMenuToolbar : function(button) {
        this.getView().getViewModel().set('menuType', 'toolbar');
    },

    // 显示左边菜单区域,隐藏菜单条和顶部的按钮菜单。
    showLeftMenuRegion : function(button) {
        this.getView().getViewModel().set('menuType', 'tree');
    },
    // 显示顶部的按钮菜单,隐藏菜单条和左边菜单区域。
    showButtonMenu : function(button) {
        var view = this.getView();
        if (view.down('maintop').hidden) {
            // 如果顶部区域和底部区域隐藏了，在用按钮菜单的时候，把他们显示出来，不然菜单就不见了
            view.showOrHiddenToolbar.toggle();
        }
        view.getViewModel().set('menuType', 'button');
    },

    onResetConfigClick : function() {
        console.log('reset all config');
        this.getView().getViewModel().resetConfig();
    }
});