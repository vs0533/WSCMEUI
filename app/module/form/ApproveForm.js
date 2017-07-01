/**
 * merge level=35
 */

Ext.define('WsCme.module.form.ApproveForm', {
			extend : 'WsCme.module.form.BaseForm',
			alias : 'widget.approveform',

			approveFields : ['tf_shname', 'tf_shdate', 'tf_shresult', 'tf_shexplain'],

			initComponent : function() {
				var me = this;
				this.formtype = 'approve';
				this.formtypetext = '审批';
				this.buttons = [{
							xtype : 'image',
							itemId : 'image',
							src : 'images/approve/approve_nopass.png',
							width : 80,
							height : 30
						}, '->', {
							text : '通过审批',
							itemId : 'saveapprove',
							icon : 'images/approve/approveaction.png'
						}, {
							text : '取消审批',
							itemId : 'cancelapprove',
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

				// 顺序号
				this.order = this.module.tf_userRole.tf_approveOrder;
				// 审批的级次，可以并级
				this.level = this.module.tf_userRole.tf_approveLevel;

				// 设置所有的字段为只读
				Ext.each(this.query('fieldset'), function(f) {
							Ext.each(f.query('field'), function(field) {
										field.setReadOnly(true);
									})
						});
			},

			initForm : function() {

				this.getForm().resetToNull();
				var tabpanel = this.down('tabpanel');
				if (tabpanel)
					tabpanel.setActiveTab(0);
				var record = this.moduleGrid.getSelectionModel().getSelection()[0];
				this.setData(record);
				this.down("button#saveapprove").setVisible(false);
				this.down("button#cancelapprove").setVisible(false);
				this.setFieldSetReadonly(true);

				if (record.meCanApprove()) {
					// 是否可以审批
					this.setFieldSetReadonly(false);
					this.down("image#image").setSrc("images/approve/approve_can.png");
					this.down("button#saveapprove").setVisible(true);
					var f = this.getForm().findField(this.approveFields[0] + this.order);
					if (f)
						f.setValue(app.viewport.getViewModel().get('userInfo.tf_userName'));
					var f = this.getForm().findField(this.approveFields[1] + this.order);
					if (f)
						f.setValue(new Date());
					var f = this.getForm().findField(this.approveFields[2] + this.order);
					if (f)
						f.setValue('同意');
				} else if (record.meCanCancelApprove()) {
					// 是否可以取消审批
					this.setFieldSetReadonly(false);
					this.down("image#image").setSrc("images/approve/approve_pass.png");
					this.down("button#cancelapprove").setVisible(true);
				} else if (record.get('tf_shResultDate')) {
					if (record.get('tf_shResult') === '已终止')
						this.down("image#image")
								.setSrc("images/approve/approve_nopass.png");
					else
						this.down("image#image").setSrc("images/approve/approve_pass.png");
				} else if (record.meApproved())
					this.down("image#image").setSrc("images/approve/approve_pass.png");
				else
					this.down("image#image").setSrc("images/approve/approve_can.png");

				this.setWindowTitle();
				this.getForm().getFields().first().focus();
			},

			// 将本级可审批的fieldset 的字段设置为只读或可修改

			setFieldSetReadonly : function(readonly) {

				var me = this;
				var thisfieldset = this.down('fieldset[approveOrder=' + this.order
						+ ']');
				Ext.each(thisfieldset.query('field'), function(field) {
							if (field.name == me.approveFields[0] + me.order
									|| field.name == me.approveFields[1] + me.order)
								// 审批人员和审批日期不能修改
								field.setReadOnly(true);
							else
								field.setReadOnly(readonly);
						})
						
			 //如果是可审批的状态，那么就把 approveOrder = -1 的那个fieldset 中的字段都可以修改，那里面放的是审批金额
			 var fs = this.down('fieldset[approveOrder=-1]');
			 if (fs){
			 	  Ext.each(fs.query('field'), function(field) {
								field.setReadOnly(readonly);
						})
			 }
						
			}

		})