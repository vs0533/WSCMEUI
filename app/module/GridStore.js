/**
 * 
 * merge level=41
 * 
 * grid的dataStore,用于根据条件来取得相应的记录
 * 
 * proxy的extraParams中要包括
 * 
 * moduleName : 模块名称
 * 
 * schemeOrder : 当前的列表方案序号
 * 
 * columns : 当前grid的显示字段
 * 
 * query : 全局筛选的值，在所有的当前grid的显示字段之中筛选
 * 
 * page,start,limit,sort
 * 
 * navigates : 导航树的筛选值 包括 导航的名称，选中的模块，,是一个数组
 * 
 * ----moduleName: 筛选条件的模块名称
 * 
 * ----primarykey: 模块的主键，一般的条件都加在主键之上
 * 
 * ----fieldtitle: 字段的名称
 * 
 * ----equalsValue: 筛选的主键值，或者自基本字段的字段值
 * 
 * ----isCodeLevel : 如果是阶梯的module,需要like
 * 
 * parentModuleName : 父模块
 * 
 * parentModuleId : 父模块的id
 * 
 * operateType : 当前模块的操作属性，是default还是审核，审批，多条选择，单条选择，等等
 */

Ext.define('WsCme.module.GridStore', {
			extend : 'Ext.data.Store',

			modulePanel : null,
			remoteSort : true,
			autoLoad : false,
			autoSync : false,
			leadingBufferZone : 100,
			buffered : false, // buffered=true可以无限下拉，但是删除和新增，reload都有问题，暂时不用

			// config : {
			extraParams : {},
			navigates : [],
			// 导航属性选中的情况
			// },

			constructor : function(param) {
				console.log('grid store constructor......');
				var me = this;
				this.pageSize = app.viewport.getViewModel().get('pageSize');// , this.model =
				// param.module.model;
				this.extraParams = {};
				this.navigates = [];
				// 有创建时加进来的导航约束
				if (param.modulePanel.param) {
					var dnv = param.modulePanel.param.defaultNavigateValues;
					this.setDefaultNavigates(dnv);
				}
				// ///////////
				this.callParent(arguments);
			},

			listeners : {
				// 调用proxy进行ajax的时候，将参数加进 store.proxy中，在调用完成后，删除掉所有的extraParams参数
				// 这样model.proxy就可以多store，互相不干扰了
				beforeprefetch : function(store) {
					for (var i in store.extraParams)
						store.proxy.extraParams[i] = store.extraParams[i];
				},
				// buffered = true ,执行的是 prefetch
				prefetch : function(store, records, successful) {
					for (var i in store.extraParams)
						delete store.proxy.extraParams[i];
					if (this.modulePanel)
						this.modulePanel.down('modulegrid').reselectSelection();
				},

				// buffered = false ,执行的是 load
				beforeload : function(store) {
					// console.log(store);
					for (var i in store.extraParams)
						store.proxy.extraParams[i] = store.extraParams[i];

				},

				load : function(store) {
					for (var i in store.extraParams)
						delete store.proxy.extraParams[i];
				}

			},

			/**
			 * 设置指定的 navigates，是程序里指定的，不是用户单击navigates 产生的
			 * 
			 * @param {}
			 *          array
			 */
			setDefaultNavigates : function(dnv) {
				var me = this;
				me.navigates = [];
				delete me.extraParams.navigates;
				if (dnv && dnv.length > 0) {
					
					console.log('setDefaultNavigates');

					Ext.each(dnv, function(nv) {
								for (var n in nv) {
									me.navigates.push(nv[n]);
								}
							});
					if (me.navigates.length > 0)
						Ext.apply(me.extraParams, {
									navigates : Ext.encode(me.navigates)
								});
				}
			},

			/**
			 * 当导航条件修改过了，将数组赋给proxy 刷新数据
			 */
			setNavigates : function(array) {

				// applyNavigates : function(array) {
				this.navigates = array;
				if (this.navigates.length > 0)
					Ext.apply(this.extraParams, {
								navigates : Ext.encode(this.navigates)
							});
				else
					delete this.extraParams.navigates;
				if (this.buffered)
					this.data.clear();
				this.loadPage(1);
				// console.log(this);
			}

		});
