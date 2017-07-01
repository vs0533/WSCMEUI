/**
 * merge level=25
 * 
 * grid header 上的 setting 按钮下的菜单
 */

Ext.define('WsCme.module.widget.GridSettingMenu', {
	extend : 'Ext.menu.Menu',
	alias : 'widget.gridsettingmenu',
	margin : '0 0 10 0',
	floating : true,
	initComponent : function() {
		this.items = [{
					text : '自动调整列宽',
					itemId : 'autocolumnwidth',
					icon : 'images/button/autosize.png'
				}, {
					text : '保存当前列宽',
					disabled : true,
					itemId : 'savecolumnwidth'
				}, {
					text : '保存当前列顺序',
					disabled : true,
					itemId : 'savecolumnorder'
				}];

		if (this.modulegrid.allowDragToNavigate
				&& this.modulegrid.module.tf_orderField) {
			this.items.push('-');
			this.items.push({
						text : '保存当前记录顺序号',
						tooltip : '根据当前的记录的拖放顺序保存顺序号。',
						itemId : 'saverecordorder',
						disabled : true
					})
		}

		// 如果此用户有权新增，并且此模块可以 excel 导入
		var module = this.modulegrid.module;
		if (module.tf_userRole.tf_allowInsert && module.tf_allowInsertExcel) {
			this.items.push('-');
			this.items.push({
				text : '下载用于新增的Excel表',
				tooltip : '对有大批量数据需要通过Excel导入系统，则下载此表，按照表中的要求添入数据，然后在新增按钮下选择"Excel导入新增"。',
				itemId : 'downloadinsertexcel'
			})
		}
		this.callParent(arguments);
	}
});