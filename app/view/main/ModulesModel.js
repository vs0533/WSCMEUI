/**
 * Created by byron on 2017/7/1.
 */
/**
 * 总体模块控制的类，用来根据moduleName去加载模块
 */
Ext.define('WsCme.view.main.ModulesModel', {
    extend : 'Ext.Mixin',

    requires : ['WsCme.module.ModuleInfo'],

    init : function() {
        console.log('ModulesController init......');
    },

    /**
     * 根据模块的名称，或者模块的编号，或者模块的asName(_t0000)来取得模块的定义
     *
     * @param {}
     *          moduleName
     * @return {}
     */
    getModuleInfo : function(moduleName) {
        console.log("modulename:"+moduleName);
        var s = this.get('modules');
        var me = this;
        var result = this.get('modules').get(moduleName);
        if (!result) {
            this.get('modules').each(function(module) {
                if (module.tableAsName == moduleName) {
                    result = module;
                    return false;
                }
            });
            if (!result) {
                // 如果还没有加载进来，那么去后台把module的信息加载进来
                console.log('load module info:' + moduleName);
                Ext.Ajax.request({
                    url : 'moduleinfo.do?moduleName=' + moduleName,
                    async : false, // 同步
                    success : function(response) {
                        var text = response.responseText;
                        if (!text) {
                            alert('模块:' + moduleName + '取得失败！');
                        } else {
                            var moduleinfo = Ext.decode(response.responseText, true);
                            console.log(moduleinfo);
                            result = new Ext.create( 'app.module.ModuleInfo',moduleinfo);
                            me.get('modules').add(moduleinfo.tf_moduleName, result);
                        }
                    }
                });
            }
        }
        return result;
    },

    // 取得某个模块的权限
    getModuleRole : function(moduleId) {
        var result = {};
        Ext.each(this.get('roleInfo.tf_userRoleDetails'), function(mrole) {
            if (mrole.tf_moduleId === moduleId) {
                result = mrole;
                return false;
            }
        });
        return result;
    },

    showModuleRecord : function(moduleName, id) {
        this.getModule(moduleName).showRecord(id);
    },

    // 取得一个module的控制模块
    getModule : function(moduleName) {
        return this.getModuleInfo(moduleName);
    },

    // 刷新某个模块的数据，如果该模块存在于页面上
    refreshModuleGrid : function(moduleNames) {
        if (moduleNames) {
            var ms = moduleNames.split(','), me = this;
            Ext.each(ms,
                function(moduleName) {
                    console.log(moduleName + "---- grid refresh");

                    var result = me.get('modules').get(moduleName);
                    if (result) {
                        if (result.modulePanel)
                            result.modulePanel.down('modulegrid').refreshWithSilent();
                        if (result.modulePanelWithParent)
                            result.modulePanelWithParent.down('modulegrid')
                                .refreshWithSilent();
                        if (result.modulePanelWithFilter)
                            result.modulePanelWithFilter.down('modulegrid')
                                .refreshWithSilent();
                        if (result.newModulePanelWithParent
                            && result.newModulePanelWithParent.down('modulegrid'))
                            result.newModulePanelWithParent.down('modulegrid')
                                .refreshWithSilent();
                    }
                });
        }
    }
});
