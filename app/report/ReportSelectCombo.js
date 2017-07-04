/**
 * merge level=20
 * 
 * 综合查询的主控界面
 * 
 */

Ext.define('WsCme.report.ReportSelectCombo', {
			extend : 'WsCme.ux.OwnTreePicker',
			alias : 'widget.reportselectcombo',

			fieldLabel : '查询方案',
			queryMode : 'remote',
			displayField : 'text',
			valueField : 'value',
			labelWidth : 60,
			width : 350,
			forceSelection : true,
			editable : false,
			autoSelect : true,

			initComponent : function() {

				this.store = Ext.create('app.report.ReportSelectComboStore', {
							combo : this,
							proxy : {
								type : 'ajax',
								url : 'report/getgroupreports.do',
								extraParams : {
									reportGroupId : null
								}
							}
						});

				this.callParent(arguments);
			}

		});