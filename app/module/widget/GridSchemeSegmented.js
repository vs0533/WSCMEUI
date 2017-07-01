/**
 * merge level=25
 */
Ext.define('WsCme.module.widget.GridSchemeSegmented', {
	extend : 'Ext.button.Segmented',
	alias : 'widget.gridschemesegmented',

	initComponent : function() {

		var schemes = this.modulePanel.module.tf_gridSchemes;
		this.items = [];
		var i = 1;
		Ext.each(schemes, function(scheme) {
			this.items.push({
				text : '' + i,
				tooltip : scheme.tf_schemeName,
				value : scheme.tf_schemeOrder,
				style : 'padding-left : 2px;padding-right: 2px;'
				//padding : '0 0 0 0'
			});
			i++;
		}, this);

		this.value = schemes[0].tf_schemeOrder;

		this.callParent(arguments);
	}
});