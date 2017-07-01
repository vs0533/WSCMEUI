/**
 *   merge level=35
 */

Ext.define('WsCme.module.form.AuditingForm', {
			extend : 'WsCme.module.form.BaseForm',
			alias : 'widget.auditingform',

			auditingFields : ['tf_auditingName', 'tf_auditingDate'],

			initComponent : function() {
				var me = this;
				this.formtype = 'auditing';
				this.formtypetext = '审核';
				this.buttons = [{
							xtype : 'image',
							itemId : 'image',
							src : 'images/button/auditing_no.png',
							width : 80,
							height : 30
						}, '->', {
							text : '通过审核',
							itemId : 'saveauditing',
							icon : 'images/button/auditingaction.png'
						}, {
							text : '取消审核',
							itemId : 'cancelauditing',
							icon : 'images/button/cancel.png'
						}, '-', {
							text : '上一条',
							itemId : 'prior',
							icon : 'images/button/prior.png'
						}, {
							text : '下一条',
							itemId : 'next',
							icon : 'images/button/next.png'
						}, '-'];
				this.callParent(arguments);
				Ext.each(this.query('fieldset'),function(f) {
							if (!f.schemeGroup.tf_auditingGroup)
								Ext.each(f.query('field'),function(field) {
											field.setReadOnly(true);
										})
						});
				Ext.each(this.auditingFields,function(fn) {
							var f = me.getForm().findField(fn);
							if (f)
								f.setReadOnly(true);
						})
			},

			initForm : function() {
				this.getForm().resetToNull();
				var tabpanel = this.down('tabpanel');
				if (tabpanel)
					tabpanel.setActiveTab(0);
				var record = this.moduleGrid.getSelectionModel().getSelection()[0];
				this.setData(record);
				// 判断是否审核过了，审核过了，就要把取消审核显示出来
				if (record.get('tf_auditinged')) {
					this.down("button#saveauditing").setVisible(false);
					this.down("button#cancelauditing").setVisible(true);
					this.down("image#image").setSrc("images/button/auditing_yes.png")
				} else {
					this.down("button#saveauditing").setVisible(true);
					this.down("button#cancelauditing").setVisible(false);
					this.down("image#image").setSrc("images/button/auditing_no.png")
					var f = this.getForm().findField(this.auditingFields[0]);
					if (f)
						f.setValue(app.viewport.getViewModel().get('userInfo.tf_userName'));
					var f = this.getForm().findField(this.auditingFields[1]);
					if (f)
						f.setValue(new Date());
				}
				this.setWindowTitle();
				this.getForm().getFields().first().focus();
			}
		})