/**
 * merge level=30
 * 
 */
Ext.define('app.report.ReportSelectComboStore', {
			extend : 'Ext.data.TreeStore',

			fields : ['value', 'text', {
						name : 'disabled',
						type : 'bool',
						defaultValue : false
					}, {
						name : 'tag',
						type : 'int'
					}],
			root : [],

			autoLoad : true,
			combo : null,

			constructor : function() {
				this.callParent(arguments);
			},

			listeners : {

				beforeload : function(store) {
					store.getProxy().extraParams.reportGroupId = store.combo.reportGroupId;
				},

				load : function(store, records, successful) {
					if (records[0].childNodes.length > 0) {
						store.combo
								.setValue(records[0].childNodes[0].data.value);
					}
				}
			}

		});
