/**
 * merge level=35
 * 
 * 这个是用于对请款单进行支付时新增 付款单时的操作，直接显示付款单的新增界面，来完成此操作。
 * 
 */
Ext.define('WsCme.module.form.PaymentForm', {
			extend : 'WsCme.module.form.BaseForm',
			alias : 'widget.paymentform',

			initComponent : function() {
				var isAttachment = this.module.tf_moduleName == '_Attachment';
				this.formtype = 'new';
				this.formtypetext = '新增';
				this.buttons = ['->', {
							text : isAttachment ? '上传' : '保存',
							itemId : isAttachment ? 'upload' : 'savenew',
							itemAction : 'savenew',
							icon : 'images/button/save.png'
						}];

				this.callParent(arguments);

			},

			initForm : function() {
				delete this.data; // 保存过后，将resultmodel存放在此处
				this.getForm().resetToNull();
				this.down('button[itemAction=savenew]').setVisible(true);
				Ext.each(this.query('fieldset'), function(f) {
							f.setDisabled(false)
						});
				var me = this, tabpanel = this.down('tabpanel');

				if (tabpanel)
					tabpanel.setActiveTab(0);

				// 先加进字段定义里的缺省值
				Ext.each(this.module.tf_fields , function(field) {
							if (field.tf_defaultValue && field.tf_defaultValue.length > 0) {
								var formfield = me.getForm().findField(field.tf_fieldName);
								if (formfield)
									formfield.setValue(field.tf_defaultValue);
								else { // 可能是manytoone
									formfield = me.down('field[moduleName=' + field.tf_fieldType
											+ ']');
									if (formfield)
										formfield.setValue(field.tf_defaultValue); // 要用字符串，用数字有问题
								}
							}
						});

				// 再加入parentFilter和navigates中的选定的值
				if (this.parentFilter) {
					var pfield = this.down('field[moduleName='
							+ this.parentFilter.moduleName + ']');
					if (pfield)
						pfield.setValue('' + this.parentFilter.equalsValue); // 要用字符串，用数字有问题
				}

				// 最后到服务器去加载服务器给定的初始值
				Ext.Ajax.request({
							url : 'rest/module/getnewdefault.do',
							params : {
								moduleName : this.module.tf_moduleName,
								parentFilter : Ext.encode(this.parentFilter), // Ext.encode(this.moduleGrid.parentFilter),
								navigates : null
								// Ext.encode( this.moduleGrid.getStore().navigates)
							},
							success : function(response) {
								var v = Ext.decode(response.responseText, true);
								for (var fn in v) {
									var formfield = me.getForm().findField(fn);
									if (formfield)
										formfield.setValue(v[fn]);
									else { // 可能是manytoone
										formfield = me.down('field[moduleName=' + fn + ']');
										if (formfield)
											formfield.setValue(v[fn]); // 要用字符串，用数字有问题
									}
								}
							}

						})

				this.setWindowTitle();
				this.getForm().getFields().each(function(field) {
							if (field.xtype.indexOf('hidden') == -1 && !field.readOnly) {
								field.focus();
								return false;
							}
						});
			}

		})