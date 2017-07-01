/**
 * 
 * ManyToMany记录的管理，将根据权限设置来显示修改或删除按钮
 * 
 * 蒋锋 2015.12.31
 * 
 */

Ext
		.define(
				'WsCme.module.widget.column.ManyToManyColumn',
				{
					extend : 'Ext.grid.column.Column',
					alias : 'widget.manytomanycolumn',
					requires : [ 'WsCme.module.widget.window.ManyToManyEditWindow' ],
					minWidth : 200,
					editButtonSpan : '',
					deleteButtonSpan : '',
					manyToManyModuleName : null,
					manyToManyModuleTitle : null,

					initComponent : function() {

						var joinTable = this.fieldDefine.tf_joinTable;
						// 取得joinTable的模块定义
						var joinModule = app.modules.getModule(joinTable);

						// manyToMany 另一端的模块名称，模块的字段名为Set<modulename>,或
						// List<module>,利用正则表达式，取得<>之间的内容。
						this.manyToManyModuleName = /\w+/.exec(/<\w+>/
								.exec(this.fieldDefine.tf_fieldType)[0])[0];
						this.manyToManyModuleTitle = app.modules
								.getModule(this.manyToManyModuleName).tf_title;

						// 如果有可以修改joinTable值的权限，那么就加上前面的一个可以修改的按钮。
						if (joinModule.tf_userRole.tf_allowEdit) {
							this.editButtonSpan = '<span class="manyToManyEdit fa fa-edit"></span>';
						}
						// 如果可以删除的话，加上可以删除的按钮。
						if (joinModule.tf_userRole.tf_allowDelete) {
							this.deleteButtonSpan = '<span class="manyToManyContextClose fa fa-close"></span>';
						}
						this.callParent();
					},

					renderer : function(val, metaData, model, row, col, store, gridview) {
						var column = gridview.headerCt.getGridColumns()[col];
						if (val) {
							// "0000,管理员,1700|||0005,市级管理员,1701|||0010,查询角色,1702" ,
							// 第三个值表示joinTable的主键
							var records = val.split('|||');
							var tpl = new Ext.Template(column.editButtonSpan
									+ '<span class="manyToManyTD">{val}</span>');
							var result = '';
							for ( var i in records) {
								var fields = records[i].split(',');
								result += '<span class="manyToManyContext" _id="' + fields[0]
										+ '" _joinid="' + fields[2] + '">' + fields[1] + '</span>'
										+ column.deleteButtonSpan;
							}
							return tpl.apply({
								val : result
							});
						} else {
							return column.editButtonSpan;
						}
					},

					processEvent : function(type, view, cell, recordIndex, cellIndex, e,
							record, row) {
						var me = this;
						if (type === 'click') {
							var module = this.up('modulegrid').module;
							if (e.getTarget().className === 'manyToManyContext') {
								app.modules.showModuleRecord(this.manyToManyModuleName, e
										.getTarget().getAttribute('_id'));
							} else if (Ext.String.startsWith(e.getTarget().className,
									'manyToManyContextClose')) {
								// 点击了删除按钮，先找到前面一个节点，里面包含了要删除的信息
								var target = e.getTarget().previousElementSibling;
								var text = module.tf_title + ' ' + record.getTitleTpl() + ' 的 '
										+ this.manyToManyModuleTitle + '【' + target.innerHTML + '】';
								Ext.MessageBox.confirm('确定删除', '确定要删除' + text + '吗?', function(
										btn) {
									if (btn == 'yes') {
										// 使用module里面批量删除的ajax
										Ext.Ajax.request({
											url : 'rest/module/removerecords.do',
											params : {
												moduleName : me.fieldDefine.tf_joinTable,
												ids : target.getAttribute('_joinid'),
												titles : target.innerHTML
											},
											success : function(response) {
												var info = Ext.decode(response.responseText, true);
												if (info.resultCode == 0) {
													Ext.toastInfo(text + ' 已成功被删除。');
													// 删除记录后，刷新当前记录
													me.up('modulegrid').refreshSelectedRecord();
												} else {
													Ext.MessageBox.show({
														title : '删除结果',
														msg : text + '删除失败：<br/><br/>'
																+ info.errorMessageList,
														buttons : Ext.MessageBox.OK,
														icon : Ext.MessageBox.ERROR
													});

												}
											},
											failure : function() {
												window.alert('删除时，服务器返回返回错误');
											}
										})
									}
								});
							} else if (Ext.String.startsWith(e.getTarget().className,
									'manyToManyEdit')) {
								//编辑当前记录的manyToMany字段;
								Ext.widget(
										'manytomanyeditwindow',
										{
											grid : me.up('modulegrid'),
											title : module.tf_title + '【' + record.getTitleTpl()
													+ '】的' + this.manyToManyModuleTitle,
											moduleName : module.tf_moduleName,
											idvalue : record.getIdValue(),
											manyToManyModuleName : me.manyToManyModuleName,
											linkModuleName : me.fieldDefine.tf_joinTable
										}).show();
							}
						}
					}
				})
