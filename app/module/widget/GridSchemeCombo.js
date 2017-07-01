/**
 * merge level=25
 */
Ext.define('WsCme.module.widget.GridSchemeCombo', {
			extend : 'Ext.form.field.ComboBox',
			alias : 'widget.gridschemecombo',
			fieldLabel : '方案',
			editable : false,
			labelWidth : 40,
			labelAlign : 'right',
			width : 200,
			queryMode : 'local',
			displayField : 'tf_schemeName',
			valueField : 'tf_schemeOrder',
			initComponent : function() {
				var schemes = this.modulePanel.module.tf_gridSchemes;
				this.store = Ext.create('Ext.data.Store', {
							fields : ['tf_schemeOrder', 'tf_schemeName'],
							data : schemes
						});
				this.value = schemes[0].tf_schemeOrder;
				if (schemes.length == 1)
					this.hidden = true;
				this.callParent(arguments);
			}
		});