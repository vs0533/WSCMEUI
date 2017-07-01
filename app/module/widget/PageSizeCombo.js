/**
 * merge level=09
 */
Ext.define('WsCme.module.widget.PageSizeCombo', {
	extend : 'Ext.form.field.ComboBox',
	alias : 'widget.pagesizecombo',

	width : 148,
	forceSelection : true,
	editable : false,
	allowBlank : false,
	triggerAction : 'all',
	displayField : 'id',
	valueField : 'id',
	queryMode : 'local',
	fieldLabel : '每页显示',
	labelAlign : 'right',
	labelWidth : 65,
	initComponent : function() {
		this.store = Ext.create('Ext.data.Store', {
			proxy : {
				type : 'memory',
				reader : {
					type : 'json',
					rootProperty : 'records'
				}
			},
			fields : [ 'id', 'title' ],
			data : {
				records : [ {
					id : 10
				}, {
					id : 15
				}, {
					id : 20
				}, {
					id : 30
				}, {
					id : 50
				}, {
					id : 100
				} ]
			}
		});
		this.listeners = {
			change : function(combo, selectId) {
				var grid = combo.up('grid');
				if (grid) {
					grid.store.pageSize = selectId;
					grid.store.loadPage(1);
					//app.system.pageSize = parseInt(selectId);
					Cookies.set('pagesize', selectId);
				}
			}
		};
		this.callParent(arguments);
	}
});