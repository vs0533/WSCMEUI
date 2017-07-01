/**
 * Created by byron on 2017/6/28.
 */
Ext.define('WsCme.view.main.MainController',{
    extend:'Ext.app.ViewController',
    requires:[],
    alias:'controller.main',
    // 混合设置，可以理解为多重继承，本类将继承下面的三个类中的方法
    mixins : {
        // 对grid中界面进行改变的控制器
        // gridController : 'app.view.main.controller.GridController',
        // 对中央区域界面进行改变的控制器
        centerController : 'WsCme.view.main.CenterController',
        // 对左边菜单界面进行改变的控制器
        // leftController : 'app.view.main.controller.LeftController'
    },
    init:function(){
        // this.mixins.centerController.init.call(this);
    },
    // 单击了顶部的 首页 按钮
    onHomePageButtonClick : function(menuitem) {
        // 在Contoller中通过 getView()来取得当前控制的控件
        // 在查找控件的时候一定要使用相对路径，用up(),down()函数来查找，
        // 或者在mvvm方式中可以用lookupReference()，最好不要用getCmp()函数
        var s = this.lookupReference('maincenter');
        this.lookupReference('maincenter').setActiveTab(0);
    },

    // 选择了主菜单上的菜单后执行
    onMainMenuClick : function(menuitem) {
        // menuType ,module, reportGroup, report, function,
        // window, executestatement
        if (menuitem.menuType === 'module' || menuitem.menuType === 'reportGroup'
            || menuitem.menuType === 'report')
            this.addModuleToCenter(menuitem);
        else
        // 其他类型的菜单选中后的执行
            ;

    },

    // 树形菜单单击了菜单条
    onMenuTreeItemClick : function(tree, item) {
        this.onMainMenuClick(item.raw);
    },
    // 如果窗口的大小改变了，并且顶部和底部都隐藏了，就要调整显示顶和底的那个控件的位置
    onMainResize : function() {
        var b = this.getView().showOrHiddenToolbar;
        // // 当窗口大小发生改变的时候，发送消息告诉showButton这个按钮，让它从新调整位置。
        b.fireEvent('parentResize', b);
    },

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