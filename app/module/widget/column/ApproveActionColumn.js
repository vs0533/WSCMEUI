/**
 * merge level=25
 */
Ext.define("WsCme.module.widget.column.ApproveActionColumn", {
	extend : 'Ext.grid.column.Action',
	alias : 'widget.approveactioncolumn',

	dataIndex : 'tf_shNowCount',
	text : '审<br/>批',
	align : 'center',
	menuDisabled : true,
	sortable : true,
	resizable : false,
	locked : true,
	width : 34,
	
	getClass : function(v, meta, rec) {
		if (!rec.getIdValue())
			return ;
		if (rec.get('tf_shResult') == '已通过') {
			return 'approve_ok';
		} else if (rec.get('tf_shResult') == '已终止') {
			return 'approve_cancel';
		} else {
			return 'approve_' +v;
		}
	},
	getTip : function(v, meta, rec) {
		if (!rec.getIdValue())
			return null;
		return rec.getApproveToolTip();

	},
	handler : function(grid, rowIndex, colIndex) {
		var rec = grid.getStore().getAt(rowIndex);
		var sm = grid.getSelectionModel();
		sm.select(rec);
		var button = grid.up('modulepanel').down('button#approve');
		if (button)
			button.fireEvent('click', button);
	}

});