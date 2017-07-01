/**
 * merge level=35
 */
Ext.define('WsCme.module.form.NewForm', {
	extend : 'WsCme.module.form.BaseForm',
	alias : 'widget.newform',

	initComponent : function() {
		var isAttachment = this.module.tf_moduleName == '_Attachment';
		this.formtype = 'new';
		this.formtypetext = '新增';
		this.buttons = [ '->', {
			text : isAttachment ? '上传' : '保存',
			itemId : isAttachment ? 'upload' : 'savenew',
			itemAction : 'savenew',
			icon : 'images/button/save.png'
		}, {
			text : '继续增加',
			itemId : 'newnext',
			hidden : true,
			icon : 'images/button/new.png',
			xtype : 'splitbutton',
			menu : {
				items : [ {
					text : '复制新增',
					tooltip : '新增时先将当前记录添入到新记录中',
					itemId : 'newwithcopy'
				} ]
			}
		} ];

		this.callParent(arguments);

	},

	initForm : function() {
		if (this.copyrecord) {
			this.setData(this.copyrecord);
			var k = this.getForm().findField(this.module.tf_primaryKey);
			if (k)
				k.setValue(null);
			this.copyrecord = null;
		} else
			this.setData(null);// 保存过后，将resultmodel存放在此处

		this.down('button[itemAction=savenew]').setVisible(true);
		this.down('button#newnext').setVisible(false);
		// Ext.each(this.query('fieldset'), function(f) {
		// f.enable(); //setDisabled(false);
		// });
		var me = this, tabpanel = this.down('tabpanel');

		if (tabpanel)
			tabpanel.setActiveTab(0);

		// 先加进字段定义里的缺省值
		Ext.each(this.module.tf_fields, function(field) {
			if (field.tf_defaultValue && field.tf_defaultValue.length > 0) {
				me.setFieldValue(field.tf_fieldName, field.tf_defaultValue);
			}
		});

		// 如果有modulePanel的 param 里面有 newDefault,则将里面的内空加进去
		var modulePanel = this.moduleGrid.up('modulepanel');
		// console.log(modulePanel.param);
		if (modulePanel && modulePanel.param && modulePanel.param.newDefault) {
			for ( var fn in modulePanel.param.newDefault) {
				me.setFieldValue(fn, modulePanel.param.newDefault[fn]);
			}
		}

		// 如果有选中的导航值，先加入导航值
		var navigates = this.moduleGrid.store.navigates;
		if (navigates)
			Ext.each(navigates,
					function(navigate) {
						// 找到只有是primarykey是module key的才更新
						var m = app.modules.getModule(navigate.moduleName);
						if (m && m.tf_primaryKey == navigate.primarykey) {
							var pfield = me.down('field[moduleName=' + navigate.moduleName
									+ ']');
							if (pfield)
								pfield.setValue('' + navigate.equalsValue); // 要用字符串，用数字有问题
						}
					})
			// 再加入parentFilter和navigates中的选定的值
		var fp = this.moduleGrid.parentFilter;
		if (fp) {
			var pfield = this.down('field[moduleName=' + fp.moduleName + ']');
			if (pfield)
				pfield.setValue('' + fp.equalsValue); // 要用字符串，用数字有问题
		}

		// 最后到服务器去加载服务器给定的初始值
		Ext.Ajax.request({
			url : 'rest/module/getnewdefault.do',
			params : {
				moduleName : this.module.tf_moduleName,
				parentFilter : Ext.encode(this.moduleGrid.parentFilter),
				navigates : Ext.encode(this.moduleGrid.getStore().navigates)
			},
			success : function(response) {
				var v = Ext.decode(response.responseText, true);
				for ( var fn in v) {
					me.setFieldValue(fn, v[fn]);
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
	},

	setFieldValue : function(fieldname, value) {

		var formfield = this.getForm().findField(fieldname);
		if (formfield)
			formfield.setValue(value);
		else { // 可能是manytoone
			formfield = this.down('field[moduleName=' + fieldname + ']');
			if (formfield)
				formfield.setValue(value); // 要用字符串，用数字有问题
		}
	}

})