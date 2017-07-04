/**
 * merge level=40
 * 
 * 综合查询的主控界面
 * 
 */

Ext.define('WsCme.report.MainReport', {
			extend : 'Ext.panel.Panel',
			alias : 'widget.mainreport',
			requires : ['WsCme.report.ReportSelectCombo',
					'WsCme.report.SelectConditionToolbar',
					'WsCme.report.navigate.ReportNavigate'
					],

					
					
			tools : [{
						type : 'refresh',
						tooltip : '刷新查询数据'
					}],
			layout : 'border',
			config : {
				reportGroup : null,
				reportId : null,
				reportText : null,

				baseModuleDateField : null, // 当前的模块的日期字段
				baseModuleDateSection : null, // 日期的设置

				// selectFieldsWindow中的当前选中的tree中的数据，
				// 可以是后台加载来的，也可以是window保存的，尚未提交到后台保存的
				selectdGroupAndFields : null,

				// 后台对传进去的basemodule 和selectdGroupAndFields 后，经过处理，返回的当前能显示的 group 和 字段
				// 对于子模块的可以汇总的数据 ， 先返回聚合字段 sum( )
				// moduleName , fieldId , fieldTitle , condition , fieldname ,
				// AggregateType
				factGroupAndFields : null,

				moduleConditions : [], // 每个模块选中的记录值
				isShowTotal : null,
				groupFields : [], // 分组定义
				groupShowDetail : null,
				isLiveGrid : false,   //grid 是否是 islive 模式
				allModules : null, // 共有多少个模块被选择了字段
				baseModuleName : null,
				baseModule : null
				// 当前的基准模块

			},

			// 报表改变了，或者基准模块改变了
			// 1. 将改变的信息发送到服务器，取得 列显字段字义
			// 要判断基准模块的上级 和 下级 ， 上级返回该字段，下级则先求和
			// 2. 将 condition list grid 更新
			// 3. 生成 list result grid
			// 4. 读取数据

			// 报表字段改变了以后，或者换了一个方案以后，执行这段程序
			reportChange : function(allModules, baseModuleName,
					selectedGroupAndFields, isShowTotal, groupFields, groupShowDetail) {
				// 要注意 selectedGroupAndFields 必须是后台传过来的加工过的，不然会少掉部分字段信息

				if (allModules)
					this.setAllModules(allModules);
				if (baseModuleName)
					this.setBaseModuleName(baseModuleName);
				if (isShowTotal != undefined && isShowTotal != null) {
					this.setIsShowTotal(isShowTotal);
					// this.down('toggleslide#isshowtotal').state = isShowTotal;
					// this.down('toggleslide#isshowtotal').moveHandle(isShowTotal);
				}
				this.setSelectdGroupAndFields(selectedGroupAndFields);

				if (Ext.isArray(groupFields))
					this.setGroupFields(groupFields);
				else
					this.setGroupFields([]);

				this.setGroupShowDetail(!!groupShowDetail);

				this.refreshAll();

			},

			applyBaseModuleDateSection : function(baseModuleDateSection) {
				this.baseModuleDateSection = baseModuleDateSection;
				var conditiongrid = this.down('conditionlistgrid');
				if (!this.baseModuleDateField) {
					Ext.toastWarn('当前的基准模块『'
									+ app.modules.getModuleInfo(this.baseModuleName).tf_title
									+ '』没有设置根据查询区间自动查询的日期字段。');
				} else {
					conditiongrid.updateBaseModuleDateSection(this.baseModuleDateField,
							this.baseModuleDateSection);
					this.down('conditionlistgrid').updateConditionCount();
					this.down('resultlistgrid').getStore().removeAll(true);
					this.down('resultlistgrid').getStore().loadPage(1);
				}
			},

			applyBaseModuleName : function(baseModuleName) {
				this.baseModuleName = baseModuleName;
				this.baseModule = app.modules
						.getModuleInfo(this.baseModuleName);
				this.down('basemoduleselectmenu')
						.setBaseModuleName(this.baseModuleName);
				// 判断baseModuleName是否是年，月或季度的条件。
				//console.log('basemodule');
				//console.log(this.baseModule);
				if (this.baseModule.tf_yearfield) { // 应该是年，月，或季中选一个
					var thisyear = new Date().getFullYear();
					var thismonth = new Date().getMonth() + 1;
					var thisquarter = parseInt((new Date().getMonth()) / 3) + 1;
					var dateSelectButton = this.down('dateselectbutton');
					if (this.baseModule.tf_monthField) { // 选中当月
						// {sectiontype: "thismonth", value: "2014-5", text: "当前月份"}
						dateSelectButton.setButtonText('当前月份');
						this.baseModuleDateSection = {
							sectiontype : "thismonth",
							value : '' + thisyear + '-' + thismonth,
							text : '当前月份'
						};
					} else if (this.baseModule.tf_seasonField) { // 选中当季
						dateSelectButton.setButtonText('当前季度');
						this.baseModuleDateSection = {
							sectiontype : "thisquarter",
							value : '' + thisyear + '-' + thisquarter,
							text : '当前季度'
						};
					} else { // 选中当年
						dateSelectButton.setButtonText('当前年度');
						this.baseModuleDateSection = {
							sectiontype : "thisyear",
							value : '' + thisyear,
							text : '当前年度'
						};
					}
				}
			},

			applyAllModules : function(allModules) {
				this.allModules = allModules;
				this.down('basemoduleselectmenu').setAllModules(allModules);
			},

			applySelectdGroupAndFields : function(groupAndFields) {
				this.selectdGroupAndFields = groupAndFields;
			},

			// 刷新所有的导航列表里的数据
			refreshNavigate : function() {
				this.down('selectedfieldstree').fireEvent('groupandfieldschanged',
						this.down('selectedfieldstree'), this.selectdGroupAndFields);
			},

			// 刷新一个 导航里有的导航树的 值
			refreshNavigateTree : function(conditionId, values) {
				console.log('刷新导航树:' + conditionId);
				var navigate = this.down('conditionnavigatetree[conditionId='
						+ conditionId + ']');
				console.log(navigate);
				if (navigate) {
					navigate.refreshChecked(values);
				}

			},

			// 只刷新 condition 和 重建结果 result
			refreshConditionAndRecreateResult : function() {
				this.reCreateResultGrid();
				this.refreshConditionGrid();
			},

			// 刷新数据分为：
			// 1.更新左边的导航里的选择的字段
			// 2.更新查询条件;
			// 3.重建结果grid；
			// 4.刷新结果grid;

			refreshAll : function() {
				this.down('selectedfieldstree').fireEvent('groupandfieldschanged',
						this.down('selectedfieldstree'), this.selectdGroupAndFields);
				this.reCreateResultGrid();
				this.refreshConditionGrid();

			},

			refreshConditionGrid : function() {
				var me = this;
				this.baseModuleDateField = null;
				var conditiongrid = this.down('conditionlistgrid');
				conditiongrid.deleteAllSelectFieldCondition();
				Ext.Array.each(me.selectdGroupAndFields, function(group) {
							Ext.Array.each(group.fields, function(field) {
										// 字段选择的窗口中，只设置了“描述”,也不加入条件
										if (field.condition
												&& field.condition.indexOf(':title:') != 0)
											conditiongrid.updateSelectFieldCondition(field);
										// 必须是当前基准模块的 日期字段，如果不是，放在字段条里选择
										if (!me.baseModuleDateField) {
											if (me.getBaseModule().tableAsName + '.'
													+ me.getBaseModule().tf_dateField == field.fieldname) {
												me.baseModuleDateField = field;
												conditiongrid.updateBaseModuleDateSection(
														me.baseModuleDateField, me.baseModuleDateSection);
											}
										}
									});
						});
				conditiongrid.updateConditionCount();
			},

			reCreateResultGrid : function() {
				// 删掉原来的grid ,建立一个新的
				// 去后台取得 实际的 字段分组 和 字段列表，更新过来
				var me = this;
				Ext.Ajax.request({
							url : 'report/getfactgroupandfields.do',
							method : 'POST',
							params : {
								baseModuleName : me.getBaseModuleName(),
								fields : Ext.encode(me.changeGroupAndFieldsToMin(me
										.getSelectdGroupAndFields())),
								groupFields : Ext.encode(me.getGroupFields()),
								groupShowDetail : me.getGroupShowDetail()
							},
							success : function(response) {
								me.setFactGroupAndFields(Ext
										.decode(response.responseText, true));
								var centerPanel = me.down('panel[region=center]');
								centerPanel.removeAll(true);
								var resultListGrid = Ext.widget('resultlistgrid', {
											module : app.modules
													.getModuleInfo(me.baseModuleName),
											groupAndFields : me.getFactGroupAndFields(),
											mainReport : me
										});
								centerPanel.add(resultListGrid);

							}
						});

			},

			// 将分组和字段，中有用的字段加入到另一个组中，发送到后台
			changeGroupAndFieldsToMin : function(gandf) {
				var groupAndFields = [];
				Ext.each(gandf, function(group) {
							var fields = [];
							Ext.each(group.fields, function(field) {
										var f = {
											moduleName : field.moduleName,
											fieldId : field.fieldId
										};
										if (field.condition)
											f.condition = field.condition;
										if (field.aggregate)
											f.aggregate = field.aggregate;
										fields.push(f);
									});
							groupAndFields.push({
										groupTitle : group.groupTitle,
										fields : fields
									});
						});
				return groupAndFields;
			},

			// 当前的查询是否可以被修改
			canEditorDelete : function() {
				var combo = this.down('reportselectcombo');
				var node = combo.store.getRootNode().findChildBy(function(node) {
							if (node.data.value == combo.getValue())
								return true;
						}, this, true);
				if (node)
					return node.data.tag == 1;
				else
					return false;
			},

			initComponent : function() {

				this.title = '综合查询『' + this.reportGroup.text + '』';
				this.icon = this.reportGroup.icon;
				if (!app.system)
						app.system = {};
				if (!app.system.groupsAndmodules)
					// 取得用于综合查询的 模块组和模块的数据
					Ext.Ajax.request({
								url : 'report/fetchgroupandmodule.do',
								success : function(response) {
									app.system.groupsAndmodules = Ext
											.decode(response.responseText);
								}
							});

				this.tbar = [{
							xtype : 'reportselectcombo',
							reportGroupId : this.reportGroup.reportGroupId
						}, '-', {
							text : '字段选择',
							icon : 'images/button/edit.png',
							tooltip : '选择所要显示的字段',
							itemId : 'selectfields'
						}, {
							xtype : 'basemoduleselectmenu'
						}, '->', {
							text : '保存',
							tooltip : '将当前的查询设置保存到选中的方案',
							icon : 'images/button/save.png',
							itemId : 'save',
							disabled : true
						}, {
							text : '另存为',
							tooltip : '将当前的查询方案另存为一个新的方案样',
							icon : 'images/button/saveas.png',
							itemId : 'saveas'
						}, '-', {
							text : '删除',
							tooltip : '删除当前的查询方案',
							icon : 'images/button/delete.png',
							itemId : 'delete'
						}];

				this.items = [{
							region : 'west',
							title : '导航',
							split : true,
							width : 230,
							collapseMode : 'mini',
							collapsible : true,
							collapsed : true,
							xtype : 'reportnavigate'
						}, {
							xtype : 'container',
							region : 'center',
							layout : 'border',
							border : false,
							frame : false,
							items : [{
										xtype : 'conditionlistgrid',
										reportGroup : this.reportGroup,
										height : 150,
										region : 'north',
										split : true,
										collapseMode : 'mini',
										listeners : {
											render : function(panel) {
												panel.next().setHeight(2);
											}
										}
									}, {
										xtype : 'panel',
										layout : 'fit',
										region : 'center'
									}]
						}];
				this.callParent(arguments);
			}

		});