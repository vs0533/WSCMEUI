/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('WsCme.Application', {
    extend: 'Ext.app.Application',

    name: 'WsCme',

    stores: [
        // TODO: add global / shared stores here
    ],
    init: function () {

        console.log('Application init......');
        // 设置button menu 的时候在console中显示错误，加了这句就好了。
        // 参阅此处
        // https://docs.sencha.com/extjs/6.0/whats_new/6.0.0/extjs_upgrade_guide.html#Button
        Ext.enableAriaButtons = false;

        // 如果一个 panel 没有设置title，会在console里面显示一个警告信息，加上这个就没了
        Ext.enableAriaPanels = false;
    },
    launch: function () {
        // TODO - Launch the application

        var loggedIn;
        loggedIn = localStorage.getItem("TutorialLoggedIn");
        Ext.create({
            xtype: !loggedIn ? 'app-main' : 'loginmain'
        });
    },

    onAppUpdate: function () {
        Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});
