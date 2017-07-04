/**
 * merge level=32
 * 
 * 一个 选择的条件的 grid
 */
Ext.define('app.report.ConditionListGrid', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.conditionlistgrid',
	columnLines : true,
	scroll : 'vertical',
	border : 1,
	conditionCount : 0, // 共有多少个 条件，如果条件个数有变化，那么就自动改变高度
	columns : [{
				text : '所属模块',
				dataIndex : 'se_modulename',
				width : 200,
				tdCls : 'x-condition-cell'
			}, {
				text : '查询字段',
				dataIndex : 'se_condname',
				width : 100,
				tdCls : 'x-condition-cell'
			}, {
				text : '已设置的查询条件',
				dataIndex : 'se_displaycond',
				tdCls : 'x-condition-cell',
				renderer : function(val, rd, model) {
					var tpl = new Ext.Template('<div style="white-space:pre-line; word-wrap: break-word;">{val}</div>');
					return tpl.apply({
								val : val
							});
				},
				flex : 1
			}, {
				text : '记录数',
				dataIndex : 'se_recordnum',
				width : 90,
				align : 'center',
				tdCls : 'x-condition-cell',
				renderer : function(val, rd, model) {
					if (model.get('se_recordnum') == -1) {
						return '无作用条件';
					} else if (model.get('se_recordnum') == -99) {
						return '<span style="color:blue;float:right;">' + '作用于子查询'
								+ '</span>';
					} else
						return '<span style="color:blue;float:right;">' + val + '</span>';

				}
			}, {
				width : 40,
				xtype : 'actioncolumn',
				menuDisabled : true,
				sortable : false,
				tdCls : 'x-condition-cell',
				items : [{
					icon : 'images/button/edit.png',
					tooltip : '修改当前查询条件',
					handler : function(grid, rowIndex, colIndex) {
						var model = grid.getStore().getAt(rowIndex);
						if (model.get('type') == 'selectfield') {
							var b = grid.up('mainreport').down('button#selectfields');
							b.fireEvent('click', b, model.get('conditionId').split('-')[1]);
						} else {
							var conditionId = model.get('conditionId');
							var button = grid.up('mainreport')
									.down('selectconditiontoolbar button[conditionId='
											+ conditionId + ']');
							if (button)
								button.fireEvent('click', button);
						}
					}
				}, {
					icon : 'images/button/delete.png',
					tooltip : '删除当前查询条件',
					tdCls : 'x-condition-cell',
					handler : function(grid, rowIndex, colIndex) {
						var model = grid.getStore().getAt(rowIndex);
						console.log('删除的module');
						console.log(model);
						var conditionId = model.get('conditionId');
						var mainreport = grid.up('mainreport');
						if (model.get('type') == 'selectfield') {
							// 将选择字段中的条件删掉
							Ext.Array.each(mainreport.getSelectdGroupAndFields(), function(
									group) {
								Ext.Array.each(group.fields, function(field) {
											if ((field.moduleName + "-" + field.fieldId) == conditionId) {
												field.condition = null;
												return false;
											}
										});
							});
							// 更新一下导航菜单里面的字段列表
							mainreport.down('selectedfieldstree').fireEvent(
									'groupandfieldschanged',
									mainreport.down('selectedfieldstree'),
									mainreport.getSelectdGroupAndFields());
						}
						grid.getStore().removeAt(rowIndex);
						grid.getStore().sync();

						// 清除 按钮上的数字
						var conditionButton = grid.up('panel')
								.down('conditionselectbutton[conditionId=' + conditionId + ']');
						if (conditionButton)
							conditionButton.updateTextNumber(0);

						if (model.get('type') == 'module') {
							mainreport.refreshNavigateTree(conditionId, []);
						}

						grid.ownerCt.updateConditionCount();
						mainreport.down('resultlistgrid').getStore().removeAll(true);
						mainreport.down('resultlistgrid').store.loadPage(1);
					}
				}]
			}],

	viewConfig : {

		getRowClass : function(record, index) {
			var c = record.get('se_recordnum');
			if (c == -1) {
				return 'conditionunused';
			} else if (c == -99) {
				return 'conditionsubquery';
			}
		},

		plugins : {
			ptype : 'gridviewdragdrop',
			enableDrop : true
		},

		listeners : {

			drop : function(node, data, overModel) {
				data.view.ownerCt.updateConditionCount();
			},

			itemdblclick : function(grid, record) {
				if (record.get('type') == 'selectfield') {
					var b = grid.up('mainreport').down('button#selectfields');
					b.fireEvent('click', b, record.get('conditionId').split('-')[1]);
				} else {
					var conditionId = record.get('conditionId');
					var button = grid.up('mainreport')
							.down('selectconditiontoolbar button[conditionId=' + conditionId
									+ ']');
					if (button)
						button.fireEvent('click', button);
				}
			}
		}
	},

	initComponent : function() {
		this.id = '__conditionlistgrid' + this.reportGroup.reportGroupId;
		this.store = Ext.create('app.report.ConditionListGridStore', {
					proxy : {
						type : 'localstorage',
						id : 'reportGroup' + '__' + this.reportGroup.reportGroupId
					},
					grid : this
				});
		this.tbar = {
			xtype : 'selectconditiontoolbar'
		};
		this.callParent(arguments);
	},

	// 发现了一个模块的日期字段，将条件加进来
	updateBaseModuleDateSection : function(datefield, dateSection) {
		// var resultlistgrid = this.up('mainreport').down('resultlistgrid');
		// if (!resultlistgrid) //还没有 render
		// return;
		var thiscond = null;
		this.getStore().each(function(record) {
					if (record.get('type') == 'basemoduledate') {
						thiscond = record;
						return false;
					}
				});
		if (thiscond) {
			this.getStore().remove(thiscond);
			this.getStore().sync();
		}
		if (dateSection && dateSection.sectiontype != 'all') {
			this.getStore().add({
				conditionId : datefield.moduleName + '-' + datefield.fieldId,
				se_modulename : app.modules.getModuleInfo(datefield.moduleName).tf_title,
				se_condname : datefield.fieldTitle,
				se_displaycond : dateSection.text,
				se_recordnum : 0,
				se_values : Ext.encode(dateSection),
				se_texts : null,
				type : 'basemoduledate'
			});
			this.getStore().sync();
		};
	},

	// 模块记录值选择窗口按下确定键以后，到此处来更新 grid 中的数据
	updateModuleCondition : function(condition, values, texts) {
		// 更新按钮里的数字
		var me = this;
		var type = (condition.conditionId.indexOf('-') == -1)
				? 'module'
				: 'modulefield';
		var conditionButton = this.up('panel')
				.down('conditionselectbutton[conditionId=' + condition.conditionId
						+ ']');
		if (conditionButton)
			conditionButton.updateTextNumber(values.length);
		var thiscond = null;
		this.getStore().each(function(record) {
					if (record.get('conditionId') == condition.conditionId) {
						thiscond = record;
						return false;
					}
				});
		if (values.length == 0) {
			if (thiscond)
				this.getStore().remove(thiscond);
		} else {
			var text = '';
			var i = 0;
			Ext.Array.forEach(texts, function(t) {
				text += '<span style="white-space:nowrap;"><font color=blue>'
						+ (i + 1)
						+ '.'
						+ (type == 'module' ? ('</font><a onclick="javascript:__smr(\''
								+ condition.conditionId + '\',\'' + values[i]
								+ '\');return false;" href="#">' + t + '</a>') : values[i])
						+ ';<a onclick="javascript:__delcond(\''
						+ me.reportGroup.reportGroupId
						+ '\',\''
						+ condition.conditionId
						+ '\',\''
						+ values[i]
						+ '\');return false;" href="#"><img class="condition_clear" src="images/button/tab-close.png"/></a></span>&nbsp; ';
				i++;
			});
			if (thiscond) {
				thiscond.set('se_displaycond', text);
				thiscond.set('se_texts', texts);
				thiscond.set('se_values', values);
			} else
				this.getStore().add({
							conditionId : condition.conditionId,
							se_modulename : condition.moduleTitle,
							se_condname : condition.fieldTitle,
							se_displaycond : text,
							se_recordnum : 0,
							se_values : values,
							se_texts : texts,
							// 中间有减号是 module-fieldid
							type : type
						});
		};
		this.getStore().sync();
		this.up('mainreport').down('resultlistgrid').getStore().removeAll(true);
		this.up('mainreport').down('resultlistgrid').store.loadPage(1);
		this.updateConditionCount();
	},

	// 删除所有的附加在选择字段上的条件 , 以及删除 日期条件
	deleteAllSelectFieldCondition : function() {
		var deleted = [];
		this.getStore().each(function(record) {
			if (record.get('type') == 'selectfield'
					|| record.get('type') == 'basemoduledate') {
				deleted.push(record);
			}
		});
		this.getStore().remove(deleted);
		this.getStore().sync();
	},

	// 字段选择窗口按下确定键以后,将单个字段的条件加到此处 ，到此处来更新 grid 中的数据
	updateSelectFieldCondition : function(selectfield) {

		// fieldId : field.raw.value,
		// moduleName : field.raw.moduleName,
		// fieldTitle : field.raw.text.replace(' ✽', ''),
		// condition : field.raw.condition
		this.getStore().add({
			conditionId : selectfield.moduleName + '-' + selectfield.fieldId,
			se_modulename : app.modules.getModuleInfo(selectfield.moduleName).tf_title,
			se_condname : selectfield.fieldTitle,
			se_displaycond : selectfield.fieldTitle,
			se_recordnum : 0,
			se_values : selectfield.condition,
			se_texts : null,
			type : 'selectfield'
		});
		this.getStore().sync();

	},

	deleteConditionItem : function(moduleName, key) {
		var thiscond = null;
		this.getStore().each(function(record) {
					if (record.get('conditionId') == moduleName) {
						thiscond = record;
						return false;
					}
				});
		var values = thiscond.get('se_values').split(','), texts = thiscond
				.get('se_texts').split(',');
		// 查出删除的项目是第几个，数组可以用 indexOf 来找到
		var i = values.indexOf(key);
		if (i >= 0) {
			values.splice(i, 1);
			texts.splice(i, 1);
			this.up('mainreport').refreshNavigateTree(thiscond.get('conditionId'),
					values);
			this.updateModuleCondition({
						conditionId : moduleName
					}, values, texts);
		}
	},

	updateConditionCount : function() {
		var me = this;
		var mainreport = this.up('mainreport');
		var conditions = [];
		this.getStore().each(function(record) {
					conditions.push({
								type : record.get('type'),
								conditionId : record.get('conditionId'),
								values : record.get('se_values')
							});
				});
		if (conditions.length > 0)
			Ext.Ajax.request({
						url : 'report/getconditionsrecordcount.do',
						method : 'POST',
						params : {
							baseModuleName : mainreport.getBaseModuleName(),
							moduleConditions : Ext.encode(conditions),
							fields : Ext.encode(mainreport
									.changeGroupAndFieldsToMin(mainreport
											.getSelectdGroupAndFields()))
						},
						success : function(response) {
							var value = Ext.decode(response.responseText, true);
							for (var modulename in value) {
								me.getStore().each(function(record) {
									if (record.get('conditionId') == modulename) {
										record.set('se_recordnum', value[modulename].count);
										if (record.get('type') == 'selectfield')
											record.set('se_displaycond',
													value[modulename].displayText);
										record.commit();
										return false;
									}
								});
							};
						}
					});
		// console.log(this);
		// console.log(this.view.headerCt.getHeight());
		if (this.getStore().getCount() == 0) {
			this.setHeight(this.down('selectconditiontoolbar').getHeight());
		} else {
			// 如果记录个数不一样才改变高度
			if (this.getStore().getCount() != this.conditionCount)
				this.setHeight(this.down('selectconditiontoolbar').getHeight()
						+ this.view.headerCt.getHeight() + 3 + this.getStore().getCount()
						* 25);
		};
		this.conditionCount = this.getStore().getCount();
	}
});