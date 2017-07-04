/**
 * merge level=32
 * 
 * 模块分组和模块的列表选择的一个panel ,分组是 accordion , module 是 tree
 * 
 */

Ext.define('app.report.selectfields.GroupAndModulePanel', {
			extend : 'Ext.panel.Panel',
			alias : 'widget.groupandmodulepanel',

			title : '模块分组和列表',
			layout : {
				type : 'accordion',
				animate : false
			},

			initComponent : function() {

				this.callParent(arguments);
			},
			// 在选中区域中单击一个字段，在这里定位到相应的模块中
			anchorToModule : function(moduleName) {
				Ext.Array.forEach(this.items.items, function(group) {
							var item = group.getRootNode().findChildBy(function(n) {
										return (n.raw.value == moduleName);
									}, this, true);
							if (item) {
								group.expand();
								group.getSelectionModel().deselectAll();
								group.getSelectionModel().select(item);
							}
						});
			}

		});