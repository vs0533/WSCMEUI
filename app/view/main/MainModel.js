/**
 * 主控框架的viewModel
 */

Ext
    .define(
        'WsCme.view.main.MainModel',
        {
            extend: 'Ext.app.ViewModel',

            alias: 'viewmodel.main',
            requires: ['Ext.util.Cookies'],
            mixins: {
                menuModel: 'WsCme.view.main.MenuModel',
                modulesModel: 'WsCme.view.main.ModulesModel'
            },

            constructor: function () {
                console.log('MainModel constructor');
                this.mixins.menuModel.init.call(this);
                this.mixins.modulesModel.init.call(this);
                // 这个是暂时用的，extjs4 里面有好多的 app.modules 的引用，这里先赋值给它
                app.modules = this;

                var me = this;
                // 这一句是关键，如果没有的话，this还没有初始化完成,下面的Ext.apply(me.data,....)这句就会出错
                this.callParent(arguments);

                this.localStore = new Ext.util.LocalStorage({
                    id: getContextPath() + '/systemSetting'
                });

                // 'default' or int 0,1,2
                // var centerTabRotation = this.localStore.getItem(
                //     'centerTabRotation', 'default');
                // if (centerTabRotation !== 'default') {
                //     centerTabRotation = parseInt(centerTabRotation);
                // }
                // this.set({
                //     _menuType: this.localStore.getItem('menuType', 'toolbar'),
                //     _centerTabPosition: this.localStore.getItem('centerTabPosition',
                //         'top'),
                //     _centerTabRotation: centerTabRotation,
                //     _monetary: this.localStore.getItem('monetary', 'tenthousand'),
                //     _monetaryposition: this.localStore.getItem('monetaryposition',
                //         'behindnumber'),
                //     _autoColumnMode: this.localStore.getItem('autoColumnMode',
                //         'firstload'),
                //     _autoselectrecord: this.localStore.getItem('autoselectrecord',
                //         'everyload')
                //
                // });
                this.notify();
                // 同步调用取得系统参数
                Ext.Ajax
                    .request({
                        url: 'resources/data/applicationinfo.json',
                        async: false, // 同步
                        success: function (response) {
                            var text = response.responseText;
                            var applicationInfo = Ext.decode(text, true);
                            applicationInfo.tf_previewExts = applicationInfo.tf_previewExts
                                .split(',');
                            for (i in applicationInfo.modules) {
                                var moduleinfo = applicationInfo.modules[i];
                                for (j in applicationInfo.roleInfo.tf_userRoleDetails) {
                                    if (applicationInfo.roleInfo.tf_userRoleDetails[j].tf_moduleId == moduleinfo.tf_moduleId) {
                                        // 加入每个模块的权限信息
                                        moduleinfo.tf_userRole = applicationInfo.roleInfo.tf_userRoleDetails[j];
                                        break;
                                    }
                                }
                                if (!moduleinfo.tf_userRole)
                                    moduleinfo.tf_userRole = {};
                                // 给每个模块创建一个ModuleInfo的模块信息类
                                me.data.modules.add(moduleinfo.tf_moduleName,
                                    new Ext.create('WsCme.module.ModuleInfo', moduleinfo));
                            }
                            delete applicationInfo.modules;
                            delete applicationInfo.roleInfo.tf_userRoleDetails;
                            Ext.apply(me.data, applicationInfo);
                        }
                    });
            },

            data: {

                _menuType: 'toolbar', // 菜单的位置，'button' , 'toolbar' , 'tree'

                _centerTabPosition: 'top', // 'top' , 'left' , 'bottom', 'right'
                _centerTabRotation: 'default', // 'default' , 0 , 1 , 2

                _monetary: 'tenthousand', // 数值或金额的显示单位，默认万元
                _monetaryposition: 'behindnumber', // 金额单位放置位置
                _autoColumnMode: 'firstload', // 列宽自动调整,'firstload','everyload','disable'
                _autoselectrecord: 'everyload', // 加载数据后是否自动选择一条，'everyload','onlyone','disable'
                selModel: 'checkboxmodel',
                pageSize: 20,

                maxOpenTab: 8, // 主tabPanel中最多打开的tab页面数

                // 存放所有的模块的定义信息，管理由 moudlesController 进行管理
                modules: new Ext.util.MixedCollection(),
                // 存放所有的查询分组的panel,在关闭了以后，下次打开，不重新生成，在这里取得
                reportGroups: new Ext.util.MixedCollection()

            },

            /**
             * 把所有的设置设为初始值
             */
            resetConfig: function () {
                this.set('menuType', 'toolbar');
                this.set('centerTabPosition', 'top');
                this.set('centerTabRotation', 'default');

                this.set('monetary', 'tenthousand');
                this.set('monetaryposition', 'behindnumber');
                this.set('autoColumnMode', 'firstload');
                this.set('autoselectrecord', 'everyload');

                // this.set('maxOpenTab', 8);

            },

            formulas: {

                menuType: {
                    get: function (get) {
                        return get('_menuType');
                    },
                    set: function (value) {
                        this.set({
                            _menuType: value
                        });
                        this.localStore.setItem('menuType', value);
                    }
                },

                // 当菜单方式选择的按钮按下后，这里的formulas会改变，然后会影响相应的bind的数据
                isButtonMenu: function (get) {
                    return get('_menuType') == 'button';
                },
                isToolbarMenu: function (get) {
                    return get('_menuType') == 'toolbar';
                },
                isTreeMenu: function (get) {
                    return get('_menuType') == 'tree';
                },

                centerTabPosition: {
                    get: function (get) {
                        return get('_centerTabPosition');
                    },
                    set: function (value) {
                        this.set({
                            _centerTabPosition: value
                        });
                        this.localStore.setItem('centerTabPosition', value);
                    }
                },
                centerTabRotation: {
                    get: function (get) {
                        return get('_centerTabRotation');
                    },
                    set: function (value) {
                        this.set({
                            _centerTabRotation: value
                        });
                        this.localStore.setItem('centerTabRotation', value);
                    }
                },

                monetary: {
                    get: function (get) {
                        return get('_monetary');
                    },
                    set: function (value) {
                        this.set({
                            _monetary: value
                        });
                        this.localStore.setItem('monetary', value);
                    }
                },

                monetaryposition: {
                    get: function (get) {
                        return get('_monetaryposition');
                    },
                    set: function (value) {
                        this.set({
                            _monetaryposition: value
                        });
                        this.localStore.setItem('monetaryposition', value);
                    }
                },

                autoColumnMode: {
                    get: function (get) {
                        return get('_autoColumnMode');
                    },
                    set: function (value) {
                        this.set({
                            _autoColumnMode: value
                        });
                        this.localStore.setItem('autoColumnMode', value);
                    }
                },

                autoselectrecord: {
                    get: function (get) {
                        return get('_autoselectrecord');
                    },
                    set: function (value) {
                        this.set({
                            _autoselectrecord: value
                        });
                        this.localStore.setItem('autoselectrecord', value);
                    }
                }
            }
        });
