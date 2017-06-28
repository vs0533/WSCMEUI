/**
 * Created by byron on 2017/6/28.
 */
Ext.define('WsCme.view.main.region.BottomController', {
    extend : 'Ext.app.ViewController',

    alias : 'controller.bottom',

    init : function() {
        Ext.apply(Ext.form.field.VTypes, {
            password : function(val, field) {
                if (field.initialPassField) {
                    var pwd = field.up('form').down('#' + field.initialPassField);
                    return (val == pwd.getValue());
                }
                return true;
            },
            passwordText : '确认新密码与新密码不匹配!'
        });
    },

    // 显示当前用户单位和服务单位情况
    onUserDwmcClick : function(button) {
        app.modules.showModuleRecord('_Systemset', '1');
    },

    // 显示当前用户所在的部门情况
    onUserDepartmentClick : function() {
        app.modules.showModuleRecord('_Department', app.viewport.getViewModel()
            .get('userInfo.tf_departmentId'));
    },

    // 显示当前用户的情况
    onUserInfoClick : function() {
        app.modules.showModuleRecord('_User', app.viewport.getViewModel()
            .get('userInfo.tf_userId'));
    },

    // 当前用户的权限设置
    onUserRolesClick : function() {

        var win = Ext.widget('window', {
            height : '70%',
            width : 350,
            layout : 'fit',
            modal : true,
            title : '角色设置『用户：'
            + app.viewport.getViewModel().get('userInfo.tf_userName') + '』',
            items : [{
                xtype : 'treepanel',
                rootVisible : false,
                buttonAlign : 'center',
                buttons : [{
                    text : '关闭',
                    icon : 'images/button/return.png',
                    scope : this,
                    handler : function(button) {
                        button.up('window').hide();
                    }
                }],
                store : new Ext.data.TreeStore({
                    autoLoad : true,
                    proxy : {
                        type : 'ajax',
                        url : 'user/getuserroles.do',
                        extraParams : {
                            userId : app.viewport.getViewModel()
                                .get('userInfo.tf_userId')
                        }
                    }
                })
            }]

        });
        win.down('treepanel').getView().onCheckChange = Ext.emptyFn;
        win.show();

    },

    // 当前用户权限明细
    onUserPopedomClick : function() {
        var win = Ext.create('app.module.additionFunction.UserPopedom', {
            userId : app.viewport.getViewModel().get('userInfo.tf_userId'),
            userName : app.viewport.getViewModel().get('userInfo.tf_userName')
        });
        win.show();

    },

    // 我的登录日志
    onLoginInfoClick : function() {
        this.showModuleWithName('_SystemLoginLog');
    },

    // 我的操作日志
    onOperateInfoClick : function() {
        this.showModuleWithName('_SystemOperateLog');
    },

    // 修改密码
    onChangePasswordClick : function() {

        var win = Ext.widget('window', {
            title : '修改密码',
            iconCls : 'fa fa-user-secret',
            width : 300,
            modal : true,
            layout : 'fit',
            items : [{
                xtype : 'form',
                bodyPadding : '15 15 15',
                fieldDefaults : {
                    labelAlign : 'right',
                    labelWidth : 80,
                    msgTarget : 'side',
                    autoFitErrors : false
                },
                defaults : {
                    inputType : 'password',
                    maxLength : 10,
                    enforceMaxLength : true,
                    allowBlank : false
                },
                buttonAlign : 'center',
                buttons : [{
                    text : '确定',
                    formBind : true,
                    icon : 'images/button/save.png',
                    handler : function(button) {
                        var form = button.up('form');
                        if (form.isValid()) {
                            Ext.Ajax.request({
                                url : 'user/changepassword.do',
                                params : {
                                    oldPassword : form.down('[name=oldpass]').getValue(),
                                    newPassword : form.down('[name=newpass]').getValue()
                                },
                                success : function(response) {
                                    if (response.responseText == 'true') {
                                        Ext.toastInfo('密码修改已保存成功!');
                                        button.up('window').hide();
                                    } else {
                                        form.down('[name=oldpass]').markInvalid('原密码输入错误!');
                                        Ext.toastWarn('原密码输入错误!');
                                    }
                                },
                                failure : function(response) {
                                    window.alert('修改密修保存失败!');
                                }
                            });
                        }
                    }
                }, {
                    text : '关闭',
                    icon : 'images/button/return.png',
                    handler : function(button) {
                        button.up('window').hide();
                    }
                }],
                defaultType : 'textfield',
                items : [{
                    fieldLabel : '原密码',
                    name : 'oldpass'
                },

                    {
                        fieldLabel : '新密码',
                        name : 'newpass',
                        itemId : 'newpass'
                    }, {
                        fieldLabel : '确认新密码',
                        initialPassField : 'newpass',
                        vtype : 'password'
                    }]

            }]
        });

        win.show();
        win.down('field').focus();

    },
    // 注销
    onLogoutClick : function() {
        app.viewport.getController().logout();
    },

    onQQClick : function() {
        var obj = document.getElementById("__qq__");
        obj.target = "_blank";
        obj.href = 'http://wpa.qq.com/msgrd?V=1&Uin='
            + app.viewport.getViewModel().get('userInfo.tf_serviceQQ')
            + '&Site=http://wpa.qq.com&Menu=yes';
        obj.click();

    },

    onEmailClick : function() {

        var vm = app.viewport.getViewModel();
        var link = "mailto:" + vm.get('serviceInfo.tf_serviceEmail') + "?subject="
            + vm.get('userInfo.tf_userdwmc') + vm.get('userInfo.tf_userName')
            + " 关于 " + vm.get('systemInfo.tf_systemName') + " 的咨询";
        window.location.href = link;
    },

    // 显示我的登录日志和操作日志
    showModuleWithName : function(moduleName) {
        var module = app.modules.getModuleInfo(moduleName);
        var pf = {
            moduleId : module.tf_moduleId,
            moduleName : moduleName,
            tableAsName : module.tableAsName,
            primarykey : 'tf_userName',
            fieldtitle : '用户',
            equalsValue : app.viewport.getViewModel().get('userInfo.tf_userName'),
            equalsMethod : null,
            text : app.viewport.getViewModel().get('userInfo.tf_userName'),
            isCodeLevel : false
        };
        app.mainRegion.addFilterModule(moduleName, pf);
    }

});