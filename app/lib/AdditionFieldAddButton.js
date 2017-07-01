/**
 * merge level=21
 * 
 * 附件如果有附件对应字段 ，那么在 form窗口中,该字段的后面加一个 这个按钮，可以新增附件
 * 
 */

Ext.define('WsCme.lib.AdditionFieldAddButton', {
			extend : 'Ext.button.Button',
			alias : 'widget.additionfieldaddbutton',

			moduleId : undefined,
			moduleIdvalue : undefined,
			field : undefined, // 是哪个字段后面的内容发出的数据
			fieldId : undefined,
			fieldTitle : undefined,

			initComponent : function() {
				this.callParent(arguments);
			},

			listeners : {
				click : function(button) {
					var form = button.up('form');
					var model = form.data;
					if (!model) {
						Ext.toastWarn('此条记录尚未保存，请先保存后再增加附件');
						return;
					}
					this.moduleIdvalue = model.getIdValue();
					var p = app.mainRegion.addParentFilterModule('_Attachment',
							form.module.tf_moduleName, this.moduleIdvalue, model
									.getTitleTpl(), {
								showAdditionView : true,
								notFocus : true,
								newDefault : {
									_t9506___tf_fieldId : '' + this.fieldId
								}
							})
					var newbutton = p.down('button#new');
					if (newbutton)
						newbutton.fireEvent('click', newbutton);
				}
			}
		})