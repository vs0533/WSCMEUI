/**
 * merge level=30
 * 
 * 选择的字段可以附加一些条件，在此设置条件
 * 
 */

Ext.define('app.report.selectfields.FieldConditionWindow', {
			extend : 'Ext.window.Window',
			alias : 'widget.fieldconditionwindow',
			requires : ['app.report.selectfields.FieldConditionForm'],
			modal : true,
			width : 350,
			title : '字段条件设置',
			layout : 'fit',
			tools : [{
						type : 'save',
						tooltip : '保存条件,并刷新查询结果',
						listeners : {
							click : function(tool) {
								var window = tool.up('window');
								window.down('form').fieldchange();
								var tree = window.tree;
								var mainReport = tree.up('mainreport');
								var result = getGroupAndFieldsWithTree(tree);

								Ext.Ajax.request({
											url : 'report/validselectedfields.do',
											params : {
												fields : Ext.encode(result)
											},
											success : function(response) {
												var r = Ext.decode(response.responseText, true);
												if (r.success) {
													mainReport.down('button#save').enable();
													//必须使用 r.msg.groups 否则不正确了
													mainReport.setSelectdGroupAndFields(r.msg.groups);
													mainReport.refreshConditionAndRecreateResult();

													// mainReport.reportChange(r.msg.allModules,
													// mainReport
													// .getBaseModuleName(), r.msg.groups);
													window.close();
												} else
													Ext.MessageBox.show({
																title : '选择错误',
																msg : r.msg,
																buttons : Ext.MessageBox.OK,
																animateTarget : tool.id,
																icon : Ext.MessageBox.ERROR
															});
											}
										})
							}
						}
					}, {
						type : 'refresh',
						tooltip : '清除当前条件',
						listeners : {
							click : function(tool) {
								var form = tool.up('window').down('form');
								form.getForm().resetToNull();
							}
						}
					}],

			listeners : {
				show : function(window) {
					window.down('fieldconditionform').setFieldNode(window.treeNode)
				}
			},

			initComponent : function() {
				this.items = [{
							xtype : 'fieldconditionform',
							tools : null
						}]
				this.callParent(arguments);
			}
		})