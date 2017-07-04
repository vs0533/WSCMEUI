/**
 * merge level=30
 * 
 */
Ext.define('app.report.selectfields.SelectedFieldsTreeStore', {
			extend : 'Ext.data.TreeStore',

			autoLoad : false,
			selectedValues : [], // 已经选中的值
			constructor : function() {

				this.callParent(arguments);

			}
		});