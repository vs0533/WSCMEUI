/**
 * merge level=09
 * 
 * 查询结果的 grid 类 上面的 toolbar 菜单
 * 
 */

Ext.define('WsCme.report.resultgrid.ResultListGridToolbar', {
	extend : 'Ext.toolbar.Toolbar',
	alias : 'widget.resultlistgridtoolbar',

	MAXLEVEL : 3, // 可以选择的最大分级数
	nowGroupLevel : -1,
	maxGroupLevel : 0, // 最大的可分组的级数

	initComponent : function() {
		var me = this;
		this.items = [];

		if (Ext.isArray(me.mainReport.getBaseModule().groupFieldDefines))
			this.maxGroupLevel = me.mainReport.getBaseModule().groupFieldDefines.length;
		if (this.maxGroupLevel > 0) {
			// 加入分组设置的label
			this.items.push({
						xtype : 'label',
						text : '分组设置:'
					});
			this.nowGroupLevel = me.mainReport.getGroupFields().length; // 当前已分组的级数
			// 如果当前没有分组，那么就加入一个分组的菜单，
			if (this.nowGroupLevel == 0) {
				this.items.push(this.getCanSelectedMenu(
						me.mainReport.getBaseModule().groupFieldDefines, me.mainReport
								.getGroupFields()));
			} else {
				for (var i = 0; i < this.nowGroupLevel; i++) {
					// 加入每一级的分组菜单， 对于每一级选中的都生成一个 菜单，菜单里面包括 ‘取消‘，以后所有的可选项目
					this.items.push(this.getGroupSelectedMenu(me.mainReport
									.getBaseModule().groupFieldDefines, me.mainReport
									.getGroupFields(), i + 1));
				}
			}

			if (this.maxGroupLevel > 1 && this.maxGroupLevel > this.nowGroupLevel
					&& this.nowGroupLevel > 0 && this.nowGroupLevel < this.MAXLEVEL)
				this.items.push({
							xtype : 'button',
							icon : 'images/button/new.png',
							tooltip : '增加一级分组',
							itemId : 'newGroup'
						});

			if (me.mainReport.getGroupFields().length > 0)
				this.items = this.items.concat(['-', {
							xtype : 'label',
							text : '显示明细:'
						}, {
							xtype : 'toggleslide',
							itemId : 'isShowDetail',
							state : this.mainReport.getGroupShowDetail(),
							//disabled : me.mainReport.getGroupFields().length == 0,
							onText : '是',
							offText : '否'
						}, '-']);
		}
		if (this.maxGroupLevel == 0 || me.mainReport.getGroupFields().length == 0)
			this.items = this.items.concat([{
						xtype : 'label',
						text : '显示总计:'
					}, {
						xtype : 'toggleslide',
						onText : '是',
						offText : '否',
						state : me.mainReport.getIsShowTotal(),
						itemId : 'isshowtotal'
					}, '-']);

		this.items = this.items.concat([{
					text : '导出',
					icon : 'images/button/excel.png',
					itemId : 'exportExcel',
					xtype : 'splitbutton',
					menu : [{
								text : '导出为 Excel 文件',
								icon : 'images/button/excel.png',
								itemId : 'exportexcel'
							}, {
								text : '导出为 Excel 文件(金额单位:万元)',
								icon : 'images/button/excel.png',
								itemId : 'exportexcelwanyuan'
							}, '-', {
								text : '导出为 PDF 文件',
								icon : 'images/button/pdf.png',
								itemId : 'exportpdf'
							}, {
								text : '导出为 PDF 文件(金额单位:万元)',
								icon : 'images/button/pdf.png',
								itemId : 'exportpdfwanyuan'
							}]
				}, {
					icon : 'images/button/print.png',
					itemId : 'printExcel',
					xtype : 'splitbutton',
					menu : [{
								text : '打印列表',
								icon : 'images/button/print.png',
								itemId : 'printexcel'
							}, {
								text : '打印列表(金额单位:万元)',
								icon : 'images/button/print.png',
								itemId : 'printexcelwanyuan'
							}]
				}, '-', {
					icon : 'images/button/chart_bar.png',
					tooltip : '图表分析',
					itemId : 'chart'
				}, '-', '筛选', {
					width : 60,
					xtype : 'gridsearchfield',
					store : this.resultGrid.store
				}, '->', {
							xtype : 'label',
							text : '浏览模式:'
						}
						,{
							xtype : 'toggleslide',
							itemId : 'islivegrid',
							state : this.mainReport.getIsLiveGrid(),
							onText : '是',
							offText : '否'
						}
						,{
					iconCls : 'fa fa-magic',
					tooltip : '自动调整列宽',
					listeners : {
						click : function(button) {
							button.up('grid').setColumnAutoFited(false);
							button.up('grid').columnsAutoSize();
						}
					}
				}]);
		this.callParent(arguments);
	},

	// 返回一个已经选择了分组字段的菜单，里面包括 取消分组，和所有的可选择的分组信息，以及打勾选中的那个
	getGroupSelectedMenu : function(groupFieldDefines, allSelectedGroup, level) {
		var me = this;
		var groupMenu = [];
		var thisLevelSelectedGroup = allSelectedGroup[level - 1];
		groupMenu.push({
					text : '取消本级分组',
					groupMenuItem : true,
					level : level,
					itemId : 'cancelGroup',
					icon : 'images/button/clear.png'
				}); // { text : '多重分组'},
		groupMenu.push('-');
		Ext.each(groupFieldDefines, function(groupField) {

			var isSelected = false; // 查找这一级分组是否已经选择过了
			Ext.each(allSelectedGroup, function(sg) {
				if ((!(thisLevelSelectedGroup.moduleName == groupField.moduleName && thisLevelSelectedGroup.fieldId == groupField.fieldId))
						&& (sg.moduleName == groupField.moduleName && sg.fieldId == groupField.fieldId)) {
					isSelected = true;
					return false;
				}
			});
			if (isSelected == false) { // 已经选择过的项目不加入
				var amenu = {
					level : level, // 当前是第几级的
					groupMenuItem : true,
					moduleName : groupField.moduleName,
					moduleTitle : groupField.moduleTitle,
					fieldId : groupField.fieldId,
					fieldTitle : groupField.fieldTitle,
					checked : false,
					group : me.id + level
				};
//				if (groupField.baseField)
//					amenu.text = groupField.moduleTitle + '的' + groupField.fieldTitle;
//				else
					amenu.text = groupField.fieldTitle;

				if (thisLevelSelectedGroup.moduleName == groupField.moduleName
						&& thisLevelSelectedGroup.fieldId == groupField.fieldId) {
					amenu.checked = true;
					// 已经选中的分组，禁用掉
					amenu.disabled = true;
					menutext = amenu.text;
				}
				groupMenu.push(amenu);
			}
		});
		if (this.nowGroupLevel > 1) {
			// 如果当前的选中有二个以上，给每一个标上序号
			var cn = '①②③④⑤⑥⑦⑧⑨⑩';
			menutext = '<font color="blue">' + cn.substr(level - 1, 1) + '</font> '
					+ menutext;
		}
		return {
			text : menutext,
			menu : groupMenu
		};
	},

	// 返回一个已经选择了分组字段的菜单，里面包括 取消分组，和所有的可选择的分组信息，以及打勾选中的那个
	getCanSelectedMenu : function(groupFieldDefines, allSelectedGroup) {
		var me = this;
		var groupMenu = [];

		Ext.each(groupFieldDefines, function(groupField) {

					var isSelected = false; // 查找这一级分组是否已经选择过了
					Ext.each(allSelectedGroup, function(sg) {
								if (sg.moduleName == groupField.moduleName
										&& sg.fieldId == groupField.fieldId) {
									isSelected = true;
									return false;
								}
							});
					if (isSelected == false) { // 原来没有选择过这个项目做为分组
						var amenu = {
							level : me.nowGroupLevel + 1, // 当前是第几级的 ,从1开始
							groupMenuItem : true,
							addGroupLevel : true, // 表示是新增一级
							moduleName : groupField.moduleName,
							moduleTitle : groupField.moduleTitle,
							fieldId : groupField.fieldId,
							fieldTitle : groupField.fieldTitle
						};
//						if (groupField.baseField)
//							amenu.text = groupField.moduleTitle + '的' + groupField.fieldTitle;
//						else
							amenu.text = groupField.fieldTitle;

						groupMenu.push(amenu);
					}
				});
		return {
			text : '未选择',
			menu : groupMenu
		};
	}

});