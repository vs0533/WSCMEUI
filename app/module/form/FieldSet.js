/**
 * merge level=31
 */
Ext.define('WsCme.module.form.FieldSet', {
	extend : 'Ext.form.FieldSet',
	requires : ['WsCme.module.factory.FormFieldFactory',
			'WsCme.module.factory.FieldContainerFactory'],
	defaultType : 'textfield',
	defaults : {},
	layout : 'anchor',
	config : {
		module : undefined, //  此模块的module定义
		schemeGroup : undefined, // 定义了此fieldSet的属性以及下面需要加的字段
		numCols : undefined,
		formtype : undefined
	},

	initComponent : function() {
		this.title = this.schemeGroup.tf_formGroupName;
		this.collapsible = this.schemeGroup.tf_collapsible;
		this.collapsed = this.schemeGroup.tf_collapsed;
		if (this.schemeGroup.tf_approveGroup)
			this.approveOrder = this.schemeGroup.approveOrder;
		this.items = [];
		var containers = []; // 要计算一下有多少个container，如果col=2,那么二个一换行，或者指定换行
		var hiddens = []; // 隐藏的字段
		var container = [];
		var c = 0;
		// 如果在这个group里加入的是子模块的信息
		if (this.schemeGroup.tf_subModuleName && false) {
			var subModule = app.modules.getModule(this.schemeGroup.tf_subModuleName);
			if (subModule) {
				var m = subModule.getNewPanelWithParentModuleForm(
						this.module.tf_moduleName, null, null, {
							autoFetch : false,
							enableNavigate : false
						}, true);
				m.setHeight(300);
				m.setWidth('100%');
				this.items.push(m);
			}
		} else {

			for (var i in this.schemeGroup.tf_groupFields) {
				var field = this.schemeGroup.tf_groupFields[i];
				var fieldDefine = this.module.getFieldDefine(field.tf_fieldId);
				// 如果是隐藏字段，那么就直接放在隐藏字段的数组里
				if (fieldDefine && fieldDefine.tf_isHidden) {
					hiddens.push(field);
					continue;
				}
			}
			// 如果是table类型的 container
			if (this.schemeGroup.tf_isTable) {
				for (var i in this.schemeGroup.tf_groupFields) {
					var field = this.schemeGroup.tf_groupFields[i];
					var fieldDefine = this.module.getFieldDefine(field.tf_fieldId);
					if (fieldDefine && fieldDefine.tf_isHidden) {
						continue;
					}
					container.push(field);
				}
				this.items.push(app.module.factory.FieldContainerFactory
						.getTableContainer(this.schemeGroup, container, this.module,
								this.formtype));
			} else {
				// 正常的类型
				for (var i in this.schemeGroup.tf_groupFields) {
					var field = this.schemeGroup.tf_groupFields[i];
					var fieldDefine = this.module.getFieldDefine(field.tf_fieldId);
					if (fieldDefine && fieldDefine.tf_isHidden) {
						continue;
					}
					// 设置tf_colspan如果是0，那么置为1，如果大于tf_colspan,置为tf_colspan
					field.tf_colspan = field.tf_colspan ? field.tf_colspan : 1;
					if (field.tf_colspan > this.numCols)
						field.tf_colspan = this.numCols;
					// 如果加上这一行，超出了numCols,那么就要分二行了
					if (c + field.tf_colspan > this.numCols) {
						if (this.numCols - c > 0)
							container.push({
										spacer : true,
										flex : this.numCols - c
									});
						containers.push(container);
						container = [];
						container.push(field);
						c = field.tf_colspan;
					} else {
						container.push(field);
						c += field.tf_colspan;
						if (c >= this.numCols || field.tf_isEndRow) {
							if (this.numCols - c > 0)
								container.push({
											spacer : true,
											flex : this.numCols - c
										});
							c = 0;
							containers.push(container);
							container = [];
						}
					}
				}
				if (container.length > 0)
					containers.push(container);
				for (var i in containers) {
					this.items.push(app.module.factory.FieldContainerFactory
							.getContainer(containers[i], this.module, this.formtype));
				}
			}
			// 加入隐藏的字段
			for (var i in hiddens) {
				var field = hiddens[i];
				var fieldDefine = this.module.getFieldDefine(field.tf_fieldId);
				var f = app.module.factory.FormFieldFactory.getField(fieldDefine,
						field, this.formtype);
				this.items.push(f);
			}
		}
		// 如果othersetting 中有设置 fieldset :{ xx : yy},则加入到 this 中
		if (this.schemeGroup.fieldset)
			Ext.apply(this, this.schemeGroup.fieldset)

		this.callParent(arguments);
	}
})
