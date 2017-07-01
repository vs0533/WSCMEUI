/**
 * merge level=32
 */
Ext.define('WsCme.module.form.BaseForm', {
	extend : 'Ext.form.Panel',
	alias : 'widget.baseform',
	requires : [ 'WsCme.module.form.FieldSet' ],

	trackResetOnLoad : true,

	autoScroll : true,
	moduleGrid : undefined,
	module : undefined,
	formScheme : undefined,
	formtype : undefined, // 当前form的操作类型 display,new,edit,auditing,approve
	formtypetext : undefined, // 当前form的中文名称，显示，修改，新增，审核，审批等
	submitSuccessed : false, // 自从窗口显示以来，是否成功提交了新增，或修改
	data : null,
	buttonAlign : 'center',
	initComponent : function() {
		var me = this;
		this.buttons.push({
			text : '关闭',
			itemId : 'close',
			iconCls : 'fa fa-close'
		});
		this.buttons.push('->');
		me.items = [];
		if (!this.formScheme)
			this.formScheme = this.module.tf_formSchemes[0];
		var groups = this.formScheme.tf_schemeGroups, hasTab = false;
		var hasInTabPanel = false; // 是否有嵌在页里面的tab,
		var inTabPanel;
		Ext.each(groups, function(group) {
			group.tf_numCols = group.tf_numCols || me.formScheme.tf_numCols;
			hasTab = hasTab || (group.tf_displayMode == 'tab');
			hasInTabPanel = hasInTabPanel || (group.tf_displayMode == 'intabpanel');
		});
		if (hasTab) {
			var tabpanel = {
				xtype : 'tabpanel',
				frame : false,
				border : false,
				bodyPadding : '5 5 5 5',
				items : []
			};
			groups[0].tf_displayMode = 'tab'; // 如果第一个tab忘了设置
			var nowtab;

			Ext.each(groups, function(group) {
				if (me.isShowThisFieldSet(group)) {
					if (group.tf_displayMode == 'tab') {
						if (nowtab)
							tabpanel.items.push(nowtab);
						nowtab = {
							xtype : 'container',
							title : group.tf_formGroupName,
							items : []
						};
					}
					nowtab.items.push(me.createFieldSetOrSubModule(group));
				}
			});
			tabpanel.items.push(nowtab);
			me.items = tabpanel;
		} else {
			me.bodyStyle = 'padding : 5px 5px 0';
			Ext.each(groups, function(group) {
				if (me.isShowThisFieldSet(group)) {
					if (group.tf_displayMode == 'intabpanel') {
						inTabPanel = {
							xtype : 'tabpanel',
							frame : false,
							border : false,
							height : 400,
							items : []
						};
						Ext.apply(inTabPanel, me.getOtherSetting(group.tf_otherSetting));
						me.items.push(inTabPanel);
					} else if (group.tf_displayMode == 'intab') {
						var t = me.createFieldSetOrSubModule(group);
						t.title = group.tf_formGroupName;
						inTabPanel.items.push(t);
					} else
						me.items.push(me.createFieldSetOrSubModule(group));
				}
			});
		}
		me.callParent(arguments);
	},

	getOtherSetting : function(str) {
		if (!str)
			return {};
		else
			return Ext.decode('{' + str + '}', true);

	},

	createFieldSetOrSubModule : function(group) {
		var me = this;

		// 如果在这个group里加入的是子模块的信息
		if (group.tf_subModuleName) {
			var subModule = app.modules.getModule(group.tf_subModuleName);
			if (subModule) {
				var m = subModule.getNewPanelWithParentModuleForm(
						this.module.tf_moduleName, null, null, {
							autoFetch : false,
							enableNavigate : false
						}, true);
				m.setHeight(300);
				m.setWidth('100%');
				return m;
			}
		}

		return Ext.create('app.module.form.FieldSet', {
			autoScroll : true,
			module : me.module,
			schemeGroup : group,
			numCols : group.tf_numCols,
			formtype : me.formtype
		});

	},

	initForm : function() {

	},

	isShowThisFieldSet : function(group) {
		if (this.formtype == 'new' || this.formtype == 'edit') {
			if (group.tf_auditingGroup || group.tf_approveGroup)
				return false;
		}

		if (this.formtype == 'approve' && group.tf_approveGroup) {
			// 第几个审批的
			var order = this.module.tf_userRole.tf_approveOrder;
			// 第几个级别审批的
			var level = this.module.tf_userRole.tf_approveLevel;
			// 当前fieldset 是第几个审批的
			var fsOrder = this.getFieldSetApproveOrder(group);

			// 这是一个大家都可以审批的组
			if (fsOrder == -1) {
				return true;
			}

			// 如果当前的fieldset 的级数小于操作员的，判断是不是同一个级别审批的，如果是则不显示
			if (fsOrder < order) {
				if (this.module.tf_moduleApproves[fsOrder - 1].tf_level < level)
					return true;
				else
					return false;
			} else if (fsOrder > order) // 比当前操作员大的审批信息不显示
				return false;
		}
		return true;
	},

	// 取得当前这个fieldset是第几个审批的，在里面找 tf_shdate?
	getFieldSetApproveOrder : function(group) {
		var order = -1;
		var me = this;
		Ext.each(group.tf_groupFields, function(field) {
			var fd = me.module.getFieldDefine(field.tf_fieldId);
			if (fd != null && fd.tf_fieldName.length == 10
					&& fd.tf_fieldName.indexOf('tf_shdate') == 0) {
				order = fd.tf_fieldName.substr(9, 1);
				return false;
			}
		});
		// if (order > -1) ,如果是-1 的话，那么所有的人对那个组里的数据都可以修改
		group.approveOrder = order;
		return order;
	},

	// 将加进linked grid的时候，自动选择当前选中的记录
	setLinkedGrid : function(grid) {
		this.moduleGrid = grid;
		if (this.formtype == 'display') {
			if (grid.getSelectionModel().getSelection().length > 0) {
				this.setData(grid.getSelectionModel().getSelection()[0]);
			} else
				this.setData(null);
			this.setWindowTitle();
		}
	},

	// 在记录调入或改变之后，检查有没有子grid 如果有的话，将parentmodule 改掉
	setFormSubModuleParentFilter : function(data) {
		var subModules = this.query('modulepanel');
		if (subModules.length > 0) {
			var pf = {
				moduleId : this.module.tf_moduleId,
				moduleName : this.module.tf_moduleName,
				tableAsName : this.module.tableAsName,
				primarykey : this.module.tf_primaryKey,
				fieldtitle : this.module.tf_title,
				equalsValue : (data) ? data.getIdValue() : null,
				equalsMethod : null,
				text : (data) ? data.getTitleTpl() : null,
				isCodeLevel : this.module.codeLevel
			};
			Ext.each(subModules, function(submodule) {
				submodule.setParentFilter(pf); // 这里要考虑某些没有 renderer 的module
			});
		}
	},

	// 不是grid中调用的显示某条记录的信息，可能是其他模块点击namefields来调用的
	setRecordId : function(id) {
		var me = this;

		if (me.module.treeModel) { // rest/module/fetchdata.do/7010?_dc=1447817661936&moduleName=_Module
			Ext.Ajax.request({
				url : 'rest/module/fetchdata.do/' + id,
				method : 'GET',
				params : {
					moduleName : me.module.tf_moduleName
				},
				success : function(response) {
					var value = Ext.decode(response.responseText, true);
					if (value.records[0])
						me.setData(Ext.create(me.module.model, value.records[0]));
					else
						Ext.toastInfo("取得记录数据失败");
				}
			})

		} else {
			var param = {};
			param[me.module.model.idProperty] = id;
			var dataRecord = Ext.create(me.module.model, param);
			dataRecord.load({
				success : function(record, operation, success) {
					me.setData(dataRecord);
				}
			});
		}
	},

	// 在不显示grid ,仅仅新增记录的时候，把对父模块的主键值加进来
	setParentFilter : function(pf) {
		this.parentFilter = pf;
	},

	setData : function(model) {
		this.data = model;
		if (this.data) {
			Ext.each(this.query('fileuploadfield'), function(field) {
				field.reset();
			}, this)
			this.getForm().loadRecord(this.data);
		} else
			this.getForm().resetToNull();
		// 检查form中是否有子模块，如果有则刷新
		this.setFormSubModuleParentFilter(this.data);
	},

	// 根据模块名称和window的当前操作方式，以及模块的name生成title
	setWindowTitle : function() {
		if (this.disableSetWindowTitle)
			return;
		var titletpl;
		if (this.data)
			titletpl = this.data.getTitleTpl();
		else {
			nf = this.getForm().findField(this.module.tf_nameFields);
			titletpl = (nf ? nf.getValue() : '');
		}
		var title = this.formtypetext + ' ' + this.module.tf_title + ' 〖<em>'
				+ titletpl + '</em>〗';
		if (this.up('window'))
			this.up('window').setTitle(title);
		return title;
	}

});