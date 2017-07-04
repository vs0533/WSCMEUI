/**
 * merge level=39
 * 
 * 一个模块的选择窗口
 * 
 */

Ext.define('app.report.SelectConditionWindow', {
	extend : 'Ext.window.Window',
	alias : 'widget.selectconditionwindow',
	width : 700,
	height : 550,

	closable : true,
	maximizable : true,
	modal : true,

	tools : [{
				type : 'help'
			}, {
				type : 'pin',
				tooltip : '将查询条件选择放到导航区域中',
				listeners : {
					click : function(tool) {
						tool.up('window').mainReport.down('reportnavigate')
								.addNavigateTree(tool.up('window').condition);
						tool.up('window').animateTarget = tool.up('window').mainReport
								.down('reportnavigate')
								.down('conditionnavigatetree[conditionId='
										+ tool.up('window').condition.conditionId + ']');
						tool.up('window').close();
					}
				}
			}],
	tbar : [{
				text : '重新选择',
				icon : 'images/button/clear.png',
				listeners : {
					click : function(button) {
						button.up('window').down('conditiontree').clearAllChecked();
						button.up('window').syncSelected();
					}
				}
			}, '-', {
				text : '全部选择',
				icon : 'images/button/selectall.png',
				listeners : {
					click : function(button) {
						button.up('window').down('conditiontree').selectAllChecked();
						button.up('window').syncSelected();
					}
				}

			}, '-', {
				text : '关闭退出',
				icon : 'images/button/return.png',
				listeners : {
					click : function(button) {
						button.up('window').close();
					}
				}
			}, {
				text : '确定返回',
				icon : 'images/button/accept.png',
				listeners : {
					click : function(button) {
						var window = button.up('window');
						var selected = window.down('treepanel#selected');
						var values = [];
						var texts = [];
						selected.getRootNode().eachChild(function(node) {
									values.push(node.get('value'));
									texts
											.push(node.data.text.replace(new RegExp(',', "gm"), '，'));
								});
						// 同步左边导航栏里面的导航树的值
						window.mainReport.refreshNavigateTree(window.condition.conditionId,
								values);
						window.mainReport.down('conditionlistgrid').updateModuleCondition(
								window.condition, values, texts);
						window.close();
					}
				}
			}],

	mainReport : null,

	layout : 'border',
	initComponent : function() {
		this.title = '查询条件选择 ' + this.title;
		this.bbar = Ext.create('Ext.ux.statusbar.StatusBar', {
					items : [{
								xtype : 'label',
								itemId : 'count',
								text : '未选中记录'
							}]
				});
		this.items = [{
					title : '可选择的列表',
					region : 'center',
					width : '350',
					xtype : 'conditiontree',
					conditionId : this.condition.conditionId,
					moduleName : this.condition.moduleName,
					selectedValues : this.selectedValues
				}, {
					itemId : 'selected',
					region : 'east',
					xtype : 'treepanel',
					root : {
						text : '已选择的条件值',
						expanded : true
					},
					width : 300,
					title : '选中列表',
					split : true,
					collapsible : true
				}];
		this.callParent(arguments);
	},

	// 同步选中列表和可选择列表中的数据
	syncSelected : function() {
		var count = 0;
		var tree = this.down('conditiontree');
		var selected = this.down('treepanel#selected');
		console.log(selected.getRootNode());
		selected.getRootNode().removeAll(false);

		tree.getRootNode().cascadeBy(function(node) {
			// root的 parentNode 为null, 第一级结点的parentNode.data.text='Root'
			if (node.data.checked == true
					&& !!node.parentNode
					&& (node.parentNode.data.text == 'Root' || node.parentNode.data.checked == false)) {
				count++;
				selected.getRootNode().appendChild({
							value : node.raw.fieldvalue,
							text : node.data.text,
							leaf : true
						});
			}
		});
		this.down('label#count').setText((count ? '已选中 ' + count + ' 个' : '未选中')
				+ this.condition.fulltext + ' ');

	}
});