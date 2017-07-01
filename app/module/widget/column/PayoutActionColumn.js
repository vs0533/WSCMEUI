/**
 * merge level=25
 */
Ext.define("WsCme.module.widget.column.PayoutActionColumn", {
			extend : 'Ext.grid.column.Action',
			alias : 'widget.payoutactioncolumn',

			dataIndex : 'tf_payoutStatus',
			text : '支<br/>付',
			align : 'center',
			menuDisabled : true,
			sortable : true,
			resizable : false,
			locked : true,
			width : 32,
			
			getClass : function(v, meta, rec) {
				if (!rec.getIdValue())
					return null;
				if (rec.get('tf_payoutStatus') == '可支付') {
					return 'can_payout';
				} else if (rec.get('tf_payoutStatus') == '已支付完成') {
					return 'already_payout';
				} else {
					return 'not_payout';
				}
			},
			getTip : function(v, meta, rec) {
				if (!rec.getIdValue())
					return null;
				return rec.get('tf_payoutStatus');
			},
			handler : function(grid, rowIndex, colIndex) {
				var rec = grid.getStore().getAt(rowIndex);
				var sm = grid.getSelectionModel();
				sm.select(rec);
				if (grid.up('modulepanel')) {
					var button = grid.up('modulepanel').down('button#payout');
					if (button)
						button.fireEvent('click', button);
				}
			}

		});