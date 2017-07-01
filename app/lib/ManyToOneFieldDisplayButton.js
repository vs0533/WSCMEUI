/**
 * merge level=21
 * 
 * form中的manytoone字段，加一个按钮，可以直接显示内容
 * 
 */

Ext.define('WsCme.lib.ManyToOneFieldDisplayButton', {
			extend : 'Ext.button.Button',
			alias : 'widget.manytoonefielddisplaybutton',

			icon : 'images/button/tag_green.png',

			initComponent : function() {
				this.callParent(arguments);
			},

			listeners : {
				click : function(button) {
					var form = button.up('form');
					var field = form.getForm().findField(this.fieldName);
					// Ext.toastInfo(field.moduleName + "-" + field.getValue());
					// 如果是祖父模块的值的这个按钮，那么就找找有没有加入祖父模块的primaryKey
					var keyid = field.getValue(); // 如果是combo 就取getvalue
					if (field.xtype == 'textfield') { // 祖父模块中的值,或者是父模块的值readonly=true是用
																						// textfield显示的
						keyid = null;
						if (form.data)
							keyid = form.data.get(this.primaryKey);
					}
					if (keyid)
						app.modules.showModuleRecord(field.moduleName, keyid);
					else
						Ext.toastErrorInfo('尚未选择『' + this.title + '』的字段值！');

				},

				// 鼠标移开，背景设置透明
				mouseout : function() {
					this.setTransparent(document.getElementById(this.id));
				},
				// 鼠标移过，背景取消透明
				mouseover : function() {
					var b = document.getElementById(this.id);
					b.style.backgroundImage = '';
					b.style.backgroundColor = '';
					b.style.borderColor = '';
				},
				// 背景设置透明
				afterrender : function() {
					this.setTransparent(document.getElementById(this.id));
				}

			},
			setTransparent : function(b) {
				b.style.backgroundImage = 'inherit';
				b.style.backgroundColor = 'inherit';
				b.style.borderColor = 'transparent';
			}
		})