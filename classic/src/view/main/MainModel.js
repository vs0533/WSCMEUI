/**
 * Created by byron on 2017/6/28.
 */
Ext.define('WsCme.view.main.MainModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.main',
    mixins:{
       menuModel:'WsCme.view.main.viewmodel.MenuModel'
    },
    constructor:function(){
        this.mixins.menuModel.init.call(this);
        app.models = this;
        var me = this;
        this.callParent(arguments);
        this.notify();
        Ext.Ajax.request({
            url:'resources/data/ApplicationInfo.json',
            async:false,
            success:function(response,opts){
                var text = response.responseText;
                var applicationinfo = Ext.decode(text,true);

                Ext.apply(me.data,applicationinfo);
            }
        });
    },
    data : {

        _menuType : 'toolbar', // 菜单的位置，'button' , 'toolbar' , 'tree'

        _centerTabPosition : 'top', // 'top' , 'left' , 'bottom', 'right'
        _centerTabRotation : 'default', // 'default' , 0 , 1 , 2

        _monetary : 'tenthousand', // 数值或金额的显示单位，默认万元
        _monetaryposition : 'behindnumber', // 金额单位放置位置
        _autoColumnMode : 'firstload', // 列宽自动调整,'firstload','everyload','disable'
        _autoselectrecord : 'everyload', // 加载数据后是否自动选择一条，'everyload','onlyone','disable'
        selModel : 'checkboxmodel',
        pageSize : 20,

        maxOpenTab : 8, // 主tabPanel中最多打开的tab页面数

        // 存放所有的模块的定义信息，管理由 moudlesController 进行管理
        modules : new Ext.util.MixedCollection(),
        // 存放所有的查询分组的panel,在关闭了以后，下次打开，不重新生成，在这里取得
        reportGroups : new Ext.util.MixedCollection()

    },
    /**
     * 把所有的设置设为初始值
     */
    resetConfig : function() {
        this.set('menuType', 'toolbar');
        this.set('centerTabPosition', 'top');
        this.set('centerTabRotation', 'default');

        this.set('monetary', 'tenthousand');
        this.set('monetaryposition', 'behindnumber');
        this.set('autoColumnMode', 'firstload');
        this.set('autoselectrecord', 'everyload');

        // this.set('maxOpenTab', 8);

    },
    formulas : {

        menuType : {
            get : function(get) {
                return get('_menuType');
            },
            set : function(value) {
                this.set({
                    _menuType : value
                });
                this.localStore.setItem('menuType', value);
            }
        },

        // 当菜单方式选择的按钮按下后，这里的formulas会改变，然后会影响相应的bind的数据
        isButtonMenu : function(get) {
            return get('_menuType') == 'button';
        },
        isToolbarMenu : function(get) {
            return get('_menuType') == 'toolbar';
        },
        isTreeMenu : function(get) {
            return get('_menuType') == 'tree';
        },

        centerTabPosition : {
            get : function(get) {
                return get('_centerTabPosition');
            },
            set : function(value) {
                this.set({
                    _centerTabPosition : value
                });
                this.localStore.setItem('centerTabPosition', value);
            }
        },
        centerTabRotation : {
            get : function(get) {
                return get('_centerTabRotation');
            },
            set : function(value) {
                this.set({
                    _centerTabRotation : value
                });
                this.localStore.setItem('centerTabRotation', value);
            }
        },

        monetary : {
            get : function(get) {
                return get('_monetary');
            },
            set : function(value) {
                this.set({
                    _monetary : value
                });
                this.localStore.setItem('monetary', value);
            }
        },

        monetaryposition : {
            get : function(get) {
                return get('_monetaryposition');
            },
            set : function(value) {
                this.set({
                    _monetaryposition : value
                });
                this.localStore.setItem('monetaryposition', value);
            }
        },

        autoColumnMode : {
            get : function(get) {
                return get('_autoColumnMode');
            },
            set : function(value) {
                this.set({
                    _autoColumnMode : value
                });
                this.localStore.setItem('autoColumnMode', value);
            }
        },

        autoselectrecord : {
            get : function(get) {
                return get('_autoselectrecord');
            },
            set : function(value) {
                this.set({
                    _autoselectrecord : value
                });
                this.localStore.setItem('autoselectrecord', value);
            }
        }
    }
})