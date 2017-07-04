/**
 * merge level=31
 * 
 * 模块查询结果左边的导航树，里面包含了选择的字段，查询方案，以及某个模块的查询树
 * 
 */

Ext.define('WsCme.report.navigate.ReportNavigate', {
			extend : 'Ext.panel.Panel',
			alias : 'widget.reportnavigate',

			layout : 'accordion',
			bodyCls : 'reportnavigate',
			items : [{
						title : '选择的字段',
						icon : 'images/button/selectfield.png',
						itemId : 'navigatefields',
						xtype : 'selectedfieldstree'
					}
			// , {
			// title : '查询方案',
			// icon : 'images/button/report.png',
			// layout : 'fit',
			// items : [{
			// title : 'aaa'
			// }]
			// }
			],
			listeners : {
				render : function(panel) {
					// 可以使查询条件设置按钮可以拖动到此panel 上来，然后直接放置在此panel 下面
					panel.dropZone = new Ext.dd.DropZone(panel.body.el, {
								getTargetFromEvent : function(e) {
									return e.getTarget('.reportnavigate');
								},

								onNodeOver : function(target, dd, e, data) {
									return Ext.dd.DropZone.prototype.dropAllowed;
								},
								// 用户松开了鼠标键，将一个模块或模块字段的选择tree 放在panel 上
								onNodeDrop : function(target, dd, e, data) {
									panel.addNavigateTree(data.button.condition);
								}
							});
				},

				expand : function(panel) {
					// 展开的时候，刷新字段导航，不然折叠的时候速度太慢
					var selectfieldstree = panel.down('selectedfieldstree');
					if (selectfieldstree.selectedGroupAndFields)
						setTimeout(function() {
									selectfieldstree
											.fireEvent('groupandfieldschanged', selectfieldstree,
													selectfieldstree.selectedGroupAndFields);
								}, 0);
				}
			},

			addNavigateTree : function(condition) {
				if (this.collapsed)
					this.expand();
				// 判断是否已经加入了，有了的话，直接展开即可。
				var treenavigate = this.down('conditionnavigatetree[conditionId='
						+ condition.conditionId + ']');
				if (treenavigate) {
					treenavigate.expand();
					return true;
				}
				var selectedValues = [], thiscond = null;
				this.up('mainreport').down('conditionlistgrid').getStore().each(
						function(record) {
							if (record.get('conditionId') == condition.conditionId) {
								thiscond = record;
								return false;
							}
						});
				if (thiscond)
					selectedValues = thiscond.get('se_values');
				this.add({
							xtype : 'conditionnavigatetree',
							title : condition.fulltext,
							icon : condition.icon,
							condition : condition,
							conditionId : condition.conditionId,
							selectedValues : selectedValues
						}).expand();
				return true;

			}

		});