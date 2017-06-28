/**
 * Created by byron on 2017/6/28.
 */
Ext.define('WsCme.view.main.viewmodel.MenuModel',{
    extend:'Ext.Mixin',
    init:function(){
        console.log('MenuModel init.....');
    },
    // 根据data.tf_MenuGroups生成菜单条和菜单按钮下面使用的菜单数据
    getMenus : function() {
        var items = [];
        Ext.Array.each(this.get('menus'), function(group) { // 遍历菜单项的数组
            items.push(this.getaMenu(group));
        }, this);
        return items;
    },
    /**
     * 根据group来返回该menu和所有的子menu
     */
    getaMenu : function(group) {
        var items = [];
        // 菜单的类型 group ,module, reportGroup, report, function,
        // window, executestatement,separate
        Ext.each(group.tf_Menus, function(submenu) {
            if (submenu.menuType === 'group') {
                items.push(this.getaMenu(submenu));
            } else if (submenu.menuType === 'separate')
                items.push('-');
            else {
                items.push({
                    menuType : submenu.menuType, // 菜单类型
                    menuTypeId : submenu.menuTypeId,
                    moduleName : submenu.moduleName, // 模块名称
                    text : submenu.title,
                    // 如果没有在菜单中设置icon,则看看module是否设置了icon
                    icon : submenu.tf_iconUrl || submenu.moduleIconUrl,
                    // 如果没有在菜单中设置glyph,则看看module是否设置了glyph
                    iconCls :  submenu.iconCls || submenu.moduleiconCls,
                    handler : 'onMainMenuClick' // MainController中的事件处理程序
                });
            }
        }, this);
        return {
            text : group.title,
            menu : items,
            iconCls : group.tf_iconCls,
            icon : group.tf_iconUrl
        };
    },
    getTreeMenuItem : function(group, expand) {
        var items = [];
        //菜单类型 group ,module, reportGroup, report, function,
        // window, executestatement,separate
        Ext.each(group.tf_Menus, function(submenu) {
            if (submenu.menuType === 'group') {
                items.push(this.getTreeMenuItem(submenu, expand));
            } else if (submenu.menuType !== 'separate') {
                items.push({
                    menuType : submenu.menuType,
                    menuTypeId : submenu.menuTypeId,
                    moduleName : submenu.moduleName,
                    text : submenu.title,
                    leaf : true,
                    // 如果没有在菜单中设置icon,则看看module是否设置了icon
                    icon : submenu.tf_iconUrl || submenu.moduleIconUrl,
                    // 如果没有在菜单中设置iconCls,则看看module是否设置了iconCls
                    iconCls : submenu.iconCls || submenu.moduleiconCls
                });
            }
        }, this);
        var result = {
            text : group.title,
            leaf : false,
            expanded : expand || group.tf_expand,
            children : items,
            // icon : group.tf_iconUrl,
            iconCls : group.tf_iconCls
        };
        return result;
    },

    stringToHex : function(str) {
        var v = null;
        if (str)
            try {
                eval('v = ' + str);
            } catch (e) {
            }
        return v;
    }
});