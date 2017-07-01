/**
 * merge level=21
 * 
 * 附件如果有附件对应字段 ，那么在 form窗口中,该字段的后面加一个 这个按钮，可以新增附件
 * 
 */

Ext.define('WsCme.lib.AdditionFieldDisplayButton', {
			extend : 'Ext.button.Button',
			alias : 'widget.additionfielddisplaybutton',

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
						Ext.toastWarn('此条记录尚未保存，请先保存后再显示附件');
						return;
					}
					var fieldId = this.fieldId;
					var moduleName = form.module.tf_moduleName;
					var aid = model.getIdValue();
					var aname = model.getTitleTpl();
					var fieldtitle = this.fieldTitle;
					var navigateSelected = {
						equalsMethod : null,
						equalsValue : fieldId,
						fieldtitle : '附件对应字段',
						isCodeLevel : false,
						moduleName : '_AttachmentOnField',
						primarykey : 'tf_fieldId',
						tableAsName : "_t9506",
						text : fieldtitle
					};
					var defaultNavigate = {
						defaultNavigateValues : [{
									'_AttachmentOnField' : navigateSelected
								}]
					};
					if (app.attachmentFieldWin)
						// 如果是不同的模块，那就要重新生成，因为权限不同
						if (app.attachmentFieldWin.pModuleName !== moduleName) {
							app.attachmentFieldWin.destroy();
							app.attachmentFieldWin = null;
						}
					if (!app.attachmentFieldWin) {
						app.attachmentFieldWin = Ext.widget('attahcmentwindow', {
									pModuleName : moduleName,
									pModuleTitle : form.module.tf_title,
									aid : aid,
									aname : aname,
									frame : false,
									border : false,
									x : document.body.clientWidth * 0.1,
									y : document.body.clientHeight * 0.1,
									height : document.body.clientHeight * 0.8,
									width : document.body.clientWidth * 0.8,
									param : defaultNavigate
								});
						app.attachmentFieldWin.show(null, function(win) {
									app.attachmentFieldWin.down('attachmentnavigate')
											.setWidth(180);
								});
					} else {
						app.attachmentFieldWin.changeParentFilter(moduleName,
								form.module.tf_title, aid, aname, defaultNavigate);
						app.attachmentFieldWin.show();
					};
				}
			}
		})