/**
 * merge level=25
 */
Ext.define("WsCme.module.widget.column.AuditingActionColumn", {
	extend : 'Ext.grid.column.Action',
	alias : 'widget.auditingactioncolumn',

	dataIndex : 'tf_auditinged',
	text : '审<br/>核',
	align : 'center',
	menuDisabled : true,
	sortable : true,
	resizable : false,
	locked : true,
	width : 34,

	getClass : function(v, meta, rec) {
		if (!rec.getIdValue())
			return null;
		if (rec.get('tf_auditinged')) {
			return 'already_auditing';
		} else {
			return 'not_auditing';
		}
	},
	getTip : function(v, meta, rec) {
		if (!rec.getIdValue())
			return null;
		if (rec.get('tf_auditinged')) {
			return String.format('已审核<br/><br/>由 {0} 于 {1} 审核完成。<br/>审核结果：{2}', rec
					.get('tf_auditingName'), Ext.Date.format(rec.get('tf_auditingDate'),
					'Y-m-d'), rec.get('tf_auditingRemark'));
		} else {
			return '尚未审核';
		}
	},
	handler : function(grid, rowIndex, colIndex) {
		var rec = grid.getStore().getAt(rowIndex);
		var sm = grid.getSelectionModel();
		sm.select(rec);
		var button = grid.up('modulepanel').down('button#auditing');
		if (button)
			button.fireEvent('click', button);
	}

});