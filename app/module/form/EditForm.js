/**
 * merge level=35
 */

Ext.define('WsCme.module.form.EditForm', {
			extend : 'WsCme.module.form.BaseForm',
			alias : 'widget.editform',

			initComponent : function() {

				this.formtype = 'edit';
				this.formtypetext = '修改';
				this.buttons = ['->', {
							text : '保存',
							itemId : 'saveedit',
							disabled : true,
							iconCls : 'fa fa-floppy-o'
						}, '-', {
							text : '上一条',
							itemId : 'editprior',
							iconCls : 'fa fa-chevron-left'
						}, {
							text : '下一条',
							itemId : 'editnext',
							iconCls : 'fa fa-chevron-right'
						}, '-'];

				var isAttachment = this.module.tf_moduleName == '_Attachment';
				if (isAttachment) {
					this.buttons.push({
								text : '上传新附件',
								itemId : 'uploadnewattachment',
								icon : 'images/button/addition.png',
								tooltip : '上传新的附件，原附件会被删除。'
							});
				}

				this.callParent(arguments);
			},
			listeners : {
				'dirtychange' : function(form, dirty, eOpts) {
					form.owner.down('button#saveedit')[dirty ? 'enable' : 'disable']()
					
					console.log('dirtychange    ' + dirty);

				}
			},
			initForm : function() {

				// this.getForm().reset();
				var tabpanel = this.down('tabpanel');
				if (tabpanel)
					tabpanel.setActiveTab(0);
				var record = this.moduleGrid.getSelectionModel().getSelection()[0];
				if (!record)
					return;
				this.setData(record);
				// 如果具有直接修改的权限，那么在保存的时候再提醒一下是否要保存已审批或审核过的记录
				if (this.module.tf_userRole.tf_allowEditDirect)
					Ext.each(this.query('fieldset'), function(f) {
								f.setDisabled(false);
							});
				else
					Ext.each(this.query('fieldset'), function(f) {
								f.setDisabled(!record.canEdit());
							});
				this.setWindowTitle();
				this.getForm().getFields().first().focus();
				this.down('button#saveedit').disable();

				// 下面有一个问题，就是有些combobox的值是通过ajax 加载过来的，加过来以后会触发 field 的 change 事件，
				// 会把saveedit 的按钮激亮，这在extjs4中没问题，在extjs5中有问题，只能用下面的办法来处理
				// var me = this;
				// setTimeout(function() {
				// me.down('button#saveedit').disable();
				// }, 200);

			}

		});