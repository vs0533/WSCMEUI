/**
 * 模块的定义类，里面包括了所有的定义，以及各种函数
 */

Ext.define('WsCme.module.ModuleInfo', {

    extend : 'WsCme.module.ModuleInfoBase',

    requires : [ 'WsCme.model.ModelFactory', 'WsCme.model.TreeModelFactory' ],

    constructor : function(moduleinfo) {
        //console.log('app.module.ModuleInfo.constructor' + moduleinfo.tf_moduleName+ '.....');
        //console.log(moduleinfo);
        Ext.apply(this, moduleinfo);
        // 把该模块的权限加进来
        // this.tf_userRole = app.viewport.getViewModel().getModuleRole(
        // this.tf_moduleId);

        // 生成此模块的数据model

        if (this.tf_parentKey || this.tf_isTreeModel)
            this.model = WsCme.model.TreeModelFactory.getModelByModule(this);
        else
            this.model = WsCme.model.ModelFactory.getModelByModule(this);

        // 处理一些相关的模块信息

        // 所有隐藏字段角色中隐藏的字段
        var fieldhiddenroles = this.tf_userRole.tf_userFieldHiddenRoleDetails;
        // 所有只读角色中的只读字段
        var fieldreadonlyroles = this.tf_userRole.tf_userFieldReadonlyRoleDetails;

        // 在field字段 addition tf_otherSetting中，如果有 field : { key :
        // value},的全部加入到field中
        Ext.each(this.tf_fields, function(field) {
            if (field.tf_otherSetting) {
                var otherSetting = Ext.decode('{' + field.tf_otherSetting + '}', true);
                if (otherSetting && otherSetting.field)
                    Ext.apply(field, otherSetting.field);
            }
            // 判断是否此字段不可以被这个用户显示
            Ext.each(fieldhiddenroles, function(fieldrole) {
                if (fieldrole.tf_fieldId == field.tf_fieldId)
                    field.tf_isHidden = true;
            });
            // 判断是否此字段不可以被这个用户修改
            Ext.each(fieldreadonlyroles, function(fieldrole) {
                if (fieldrole.tf_fieldId == field.tf_fieldId) {
                    field.tf_allowEdit = false;
                    field.tf_allowNew = false;
                }
            });
        });
        Ext.each(this.tf_formSchemes,
            function(scheme) {
                if (scheme.tf_otherSetting) {
                    var otherSetting = Ext.decode('{' + scheme.tf_otherSetting + '}',
                        true);
                    Ext.apply(scheme, otherSetting);
                }
                Ext.each(scheme.tf_schemeGroups, function(group) {
                    if (group.tf_otherSetting) {
                        var otherSetting = Ext.decode('{' + group.tf_otherSetting + '}',
                            true);
                        Ext.apply(group, otherSetting);
                    }
                    Ext.each(group.tf_groupFields, function(field) {
                        if (field.tf_otherSetting) {
                            var otherSetting = Ext.decode(
                                '{' + field.tf_otherSetting + '}', true);
                            Ext.apply(field, otherSetting);
                        }
                    });
                });
            });

        // 如果可以审批，那么加入审批状态的一级导航 ，只有可以审批的人员才有

        if (this.tf_userRole && this.tf_userRole.tf_allowApprove > 0
            && this.tf_userRole.tf_approveOrder > 0) {
            this.moduleGridNavigates.push({
                tf_cascading : false,
                tf_enabled : true,
                tf_fields : 'approvetype',
                tf_text : '审批类型',
                tf_type : null
            });
        }

    },
    /**
     * 根据模块的定义，返回icon 的定义，包括iconFile ,iconCls ,iconUrl
     */
    getIconInfo : function() {

        if (this.tf_iconCls) {
            return {
                iconCls : this.tf_iconCls
            }
        } else if (this.tf_iconUrl)
            return {
                icon : this.tf_iconUrl
            }
        else if (this.iconURL)
            return {
                icon : this.iconURL
            }
        else
            return {}
    }

});