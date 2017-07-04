/**
 * merge level=22
 * 
 * 综合查询的各个筛选条件的toolbar
 * 
 */

Ext.define('WsCme.report.SelectConditionToolbar', {
	extend : 'Ext.toolbar.Toolbar',
	alias : 'widget.selectconditiontoolbar',

	requires : ['WsCme.report.widget.DateSelectButton'],
	layout : {
		overflowHandler : 'Menu'
	},
	initComponent : function() {
		var me = this;
		this.items = [{
					xtype : 'dateselectbutton'
				}, '-'];

		// 查找所有的模块中，有多少需要放在这里进行选择，比如：部门，承建单位，合同，合同的各个属性
		var conditions = [];
		app.modules.get('modules').each(function(module) {
			if (module.tf_searchCondOrder) {
				conditions.push({
							type : 'module',
							conditionId : module.tf_moduleName, // 筛选条件的ID
							moduleId : module.tf_moduleId,
							codeLevel : module.tf_codeLevel,
							fulltext : module.tf_title,
							text : module.tf_shortname || module.tf_title,
							moduleTitle : module.tf_title,
							fieldTitle : app.modules.getModule(module.tf_moduleName)
									.getFieldDefineWithName(module.tf_nameFields).tf_title,
							moduleName : module.tf_moduleName,
							icon : module.iconURL || 'images/button/selecttree.png',
							order : module.tf_searchCondOrder
						});
			}
			Ext.Array.forEach(module.tf_fields, function(field) {
						if (field.searchCondOrder) {
							conditions.push({
										type : 'modulefield',
										conditionId : module.tf_moduleName + '-' + field.tf_fieldId, // 筛选条件的ID
										moduleId : module.tf_moduleId,
										moduleTitle : module.tf_title,
										fieldTitle : field.tf_title,
										fieldId : field.tf_fieldId,
										codeLevel : null,
										fulltext : (module.tf_shortname || module.tf_title)
												+ field.tf_title,
										text : field.tf_title,// (module.tf_shortname ||
										// module.tf_title)
										moduleName : module.tf_moduleName,
										icon : module.iconURL || 'images/button/selecttree.png',
										order : field.searchCondOrder
									});
						}

					});
		});
		conditions.sort(function(a, b) {
					return a.order - b.order;
				});

		Ext.Array.forEach(conditions, function(item) {
					me.items.push({
								xtype : 'conditionselectbutton',
								searchConditionButton : true,
								text : '<text>' + item.text + '</text>',
								icon : item.icon,
								condition : item,
								conditionId : item.conditionId,
								listeners : {
									render : function(button) {
										button.dragZone = new Ext.dd.DragZone(button.getEl(), {
													getDragData : function(e) {
														var sourceEl = e.getTarget('text');
														if (sourceEl) {
															var d = sourceEl.cloneNode(true);
															d.id = Ext.id();
															return {
																ddel : d,
																sourceEl : sourceEl,
																repairXY : Ext.fly(sourceEl).getXY(),
																button : button
															};
														}
													},
													getRepairXY : function() {
														return this.dragData.repairXY;
													}
												});
									}
								}
							});
				});
		this.callParent(arguments);
	}
});