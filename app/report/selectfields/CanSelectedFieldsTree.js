/**
 * merge level=32
 * 
 * 可选择的字段树，里面显示了一个模块的所有的 字段组 ＋ 字段，可以进行选择
 * 
 */

Ext.define('app.report.selectfields.CanSelectedFieldsTree', {
			extend : 'Ext.tree.Panel',
			alias : 'widget.canselectedfieldstree',
			rootVisible : false,

			tools : [{
						type : 'expand',
						tooltip : '全部展开',
						listeners : {
							click : function(tool) {
								tool.up('canselectedfieldstree').expandAll();
							}
						}

					}, {
						type : 'collapse',
						tooltip : '全部折叠',
						listeners : {

							click : function(tool) {
								tool.up('canselectedfieldstree').collapseAll();
							}
						}

					}

			],

			initComponent : function() {
				var me = this;
				Ext.applyIf(me, this.config); // 将部分初始值加进来
				this.store = Ext.create('app.report.selectfields.CanSelectedFieldsTreeStore', {
							//moduleName : this.moduleName,
							//selectedValues : this.selectedValues 
						});

				this.callParent(arguments);
			} , 
			
			setModuleName : function(moduleName) {
				this.moduleName = moduleName;
				this.getStore().getProxy().extraParams.moduleName = this.moduleName;
				this.getStore().reload();
			}
			
		})