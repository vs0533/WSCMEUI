/**
 * 
 * 在模块的列表中显示父模块的，显示父模块的name值，加个链接，一点即可显示 该像模块的 display window
 * 
 */

Ext.define('WsCme.module.widget.column.ManyToOneFieldColumn', {
	extend : 'Ext.grid.column.Column',
	alias : 'widget.manytoonefieldcolumn',

	renderer : function(val, metaData, model, row, col, store, gridview) {
		if (val) {
			var result = '<span class="gridNameField">' + val + '</span>';
			return result;
		}
	},

	processEvent : function(type, view, cell, recordIndex, cellIndex, e, record,
			row) {
		if (type === 'click') {
			if (e.getTarget().className === 'gridNameField') {
				var id = record.get(this.manytooneIdName);
				if (id)
					app.modules.showModuleRecord(this.moduleName, id);
			}
		}
	}
})
