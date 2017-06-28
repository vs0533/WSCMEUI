/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('WsCme.view.main.MainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.main',

    routes  : {
        ':cmpid/:nodeid': {
            action: 'handleRoute',//执行跳转
            before: 'beforeHandleRoute'//路由跳转前操作
        }
    },

    init: function () {
        this.control(
            {
                'treepanel':{
                    selectionchange:this.treeNavSelectionChange
                },
                'mainmenu button[action=logout]':{
                    click:this.logout
                }
            }
        );
    },
    treeNavSelectionChange:function (selModel, records) {
        var record = records[0];
        var route = record.get("route");
        var nodeId = record.get("id");
        if(route == null)
            return;
        this.redirectTo(route+"/"+nodeId);
    },
    beforeHandleRoute: function(cmpid,nodeid, action) {
        var me = this;
        var navigationTree = me.getView().down("treepanel");
        var store = navigationTree.getStore();
        var node = store.getNodeById(nodeid);

        if (node) {
            //resume action
            action.resume();
        } else if(store.getCount() === 0){
            action.stop();
            me.redirectTo(cmpid+"/"+nodeid);
            //在store load事件中判断节点，避免store数据未加载情况
            // store.on('load', function () {
            //     node = store.getNodeById(nodeid);
            //     if (node) {
            //         action.resume();
            //     }else {
            //         Ext.Msg.alert('路由跳转失败', '找不到id为' + cmpid + ' 的组件');
            //         action.stop();
            //     }
            // });
        }else {
            Ext.Msg.alert(
                '路由跳转失败',
                '找不到id为' + cmpid + ' 的组件. 界面将跳转到应用初始界面',
                function() {
                    me.redirectTo('all');
                }
            );
            //stop action
            action.stop();
        }
    },
    handleRoute: function(cmpid,nodeid) {
        var me = this;
        var navigationTree = me.getView().down("treepanel");
        var contentPanel = me.getView().down("app-contentPanel");
        var store = navigationTree.getStore();
        var node = store.getNodeById(nodeid);

        //响应路由，左侧树定位到相应节点
        navigationTree.getSelectionModel().select(node);
        navigationTree.getView().focusNode(node);

        // contentPanel.removeAll(true);
        if (node.isLeaf()) {
            //className = Ext.ClassManager.getNameByAlias('widget.' + cmpid);
            // contentPanel.setActiveTab(contentPanel.add({
            //     xtype : 'modulepanel',
            //     // 将当前的选中菜单的 "模块名称" 加入到参数中
            //     moduleName : cmpid,
            //     closable : true,
            //     reorderable : true
            // }));
            var cmp = Ext.create({
                xtype: cmpid
            });
            // ViewClass = Ext.getClass(className);
            // cmp = new ViewClass();
            // contentPanel.add(cmp);
            contentPanel.setActiveTab(contentPanel.add(cmp));
        }
        var text = node.get('text'),
            title = node.isLeaf() ? (node.parentNode.get('text') + ' - ' + text) : text;
        // contentPanel.setTitle(title);
        document.title = document.title.split(' - ')[0] + ' - ' + text;
        // if(node.isLeaf()){
        //     Ext.Msg.alert(
        //         '提示',
        //         '当前点击的是叶子节点，右侧panel将跳转到对应的组件上');
        // }else{
        //     Ext.Msg.alert(
        //         '提示',
        //         '当前点击的是非叶子节点，右侧panel将跳转到导航界面上');
        // }
    },
    logout:function () {
        var me = this;
        localStorage.removeItem('TutorialLoggedIn');
        //localStorage.removeItem('token');
        me.getView().destroy();
        Ext.create({
            xtype: 'loginmain'
        });
    }
    // accordionLoad:function (resp,opts,me) {
    //     var navigation = me.getView().down("mainmenu");
    //     var data = Ext.util.JSON.decode(resp.responseText);
    //     Ext.each(data, function(rec) {
    //         var treestore = Ext.create("store.navigation",{params:rec.id});
    //         var tree = Ext.create("Ext.tree.Panel",{
    //             border:false,
    //             store:treestore,
    //             rootVisible:false
    //         });
    //         tree.on("beforeload",function () {
    //             console.log("bbbb11");
    //         },tree);
    //         // var panel = Ext.create("Ext.panel.Panel",{
    //         //     title:rec.text,
    //         //     items:[tree]
    //         // });
    //         navigation.add(tree);
    //     });
    // }
});
