/**
 * merge level=25
 */
Ext.define('WsCme.module.widget.DetailSchemeCombo', {
			extend : 'Ext.form.field.ComboBox',
			alias : 'widget.detailschemecombo',
			fieldLabel : '方案',
			editable : false,
			labelWidth : 40,
			labelAlign : 'right',
			width : 160,
			queryMode : 'local',
			displayField : 'tf_schemeName',
			valueField : 'tf_detailId',
			initComponent : function() {
				var schemes = this.modulePanel.module.tf_moduleDetailSchemes;
				this.store = Ext.create('Ext.data.Store', {
							fields : ['tf_detailId', 'tf_schemeName'],
							data : schemes
						});
				this.value = schemes[0].tf_detailId;
				this.callParent(arguments);
			}
		});