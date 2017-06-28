/**
 * Created by byron on 2017/6/28.
 */
/**
 * merge level=50
 *
 * 选择界面theme的一个小方框,鼠标移上去会显示tooltip,单击由写处当前theme到cookies,然后刷新页面
 */
Ext.define('app.ux.ThemeSelect', {
    extend : 'Ext.panel.Panel',
    alias : 'widget.themeselect',
    border : false,
    margin : '1 1 1 1',
    width : 13,
    height : 13,
    theme : null,
    themetext : null,
    listeners : {
        afterrender : function(scope) {
            Ext.create('Ext.tip.ToolTip', {
                target : this.id,
                html : '界面主题:' + this.themetext
            });
            var el = Ext.get(this.id);
            el.on('click', function() {
                Cookies.set('theme' , scope.theme , 365);
                location.reload(true);
            });
            el.addClsOnOver('theme-select-over');
        }
    }
});


/**
 * 选择界面theme的控件，里面有4个ThemeSelect
 */
Ext.define('app.ux.ThemeSelectRegion', {
    extend : 'Ext.panel.Panel',
    alias : 'widget.themeselectregion',
    margin : '0 30 0 0',
    bodyStyle : 'background:#cde; padding:0px;',
    border : false,
    height : 30,
    width : 30/2*3,
    layout : {
        type : 'table',
        columns : 3
    },

    initComponent : function() {
        this.defaults = {
            xtype : 'themeselect'
        };
        this.items = [ {
            baseCls : 'theme-triton',
            theme : 'triton',
            themetext : '扁平风格'
        }, {
            baseCls : 'theme-crisp',
            theme : 'crisp',
            themetext : '清新紧凑'
        },{
            baseCls : 'theme-neptune',
            theme : 'neptune',
            themetext : '现代气息'
        }, {
            baseCls : 'theme-classic',
            theme : 'classic',
            themetext : '蓝色天空'
        }, {
            baseCls : 'theme-gray',
            theme : 'gray',
            themetext : '灰色心情'
        }, {
            baseCls : 'theme-aria',
            theme : 'aria',
            themetext : '深邃黑色'
        }];

        this.callParent(arguments);
    }

});