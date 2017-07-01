/**
 * merge level=25
 */
Ext.define('app.module.widget.ComboModuleGrid', {
			extend : 'Ext.form.field.Trigger',
			alias : 'widget.combomodulegrid',

			initComponent : function() {

				this.onTriggerClick = function(combo) {
					if (!this.selectMenu)
						this.selectMenu = new Ext.menu.Menu({
									border : '0 0 0 0',
									items : [{
												margin : '0 0 0 0',
												xtype : 'panel',
												width : 800,
												height : 500,
												layout : 'fit',
												items : [app.modules.getModule('Global')
														.getModulePanel()]
											}]
								});
					if (this.selectMenu.isHidden())
						this.selectMenu.showBy(this.el, 'tl-bl?', [this.labelWidth + 5, 0]);
					else
						this.selectMenu.hide(this.el);
				};
				this.callParent(arguments);
			}

		});