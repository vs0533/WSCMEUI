/**
 * merge level=30
 */

Ext
		.define(
				'WsCme.module.factory.ColumnsFactory',
				{

					requires : [ 'Ext.grid.column.Check',
							'WsCme.module.widget.column.RecordIconColumn',
							'WsCme.module.widget.column.ImageColumn',
							'WsCme.module.widget.column.ChildCountColumn',
							'WsCme.module.widget.column.ManyToOneFieldColumn',
							'WsCme.module.widget.column.ChildAggregateColumn',
							'WsCme.module.widget.column.ManyToManyColumn' ],

					statics : {

						/**
						 * 根据module的定义和schemeOrderId返回此列表方案的多层表头定义
						 */
						getColumnsWithMult : function(module, schemeOrderId) {

							var scheme = module.getGridScheme(schemeOrderId); // 当前选中的gridScheme
							// tf_orderid是二位数的，是最顶层，4位数的是第二层
							for (var i = scheme.tf_schemeGroups.length - 1; i >= 0; i--) {
								var sg = scheme.tf_schemeGroups[i];
								if (('' + sg.tf_gridGroupOrder).length > 2) {
									// 不是二位数，那么就不是顶层,将非顶层放在一块,看看能不能找到他的直接父层。
									// 如果找到了，就把自己加在父层的 columns 里面
									var subOrder = '' + sg.tf_gridGroupOrder;
									for (var j = i - 1; j >= 0; j--) {
										var parent = scheme.tf_schemeGroups[j];
										var parentOrder = '' + parent.tf_gridGroupOrder;
										if (parentOrder.length == subOrder.length - 2
												&& subOrder.substring(0, parentOrder.length) == parentOrder) {
											// 如果是直接的父级
											if (!parent.columns)
												parent.columns = [];
											parent.columns.unshift(scheme.tf_schemeGroups.pop());
											break;
										}
									}
								}
							}
							var columns = this.getLockedLeftColumns(module);
							// 递归生成grid 的 columns
							var result = columns.concat(this.getGroupAndField(module,
									scheme.tf_schemeGroups));
							console.log(result);
							return result;
						},

						/**
						 * 生成指定数组定义的列表组和列表，这是一个递归调用的函数。
						 */
						getGroupAndField : function(module, groups) {
							var result = [];
							for ( var i in groups) {
								var sg = groups[i];
								// 是否需要分组
								var isgroup = sg.tf_isShowHeaderSpans;
								var group = {
									gridGroupId : sg.tf_gridGroupId,
									text : sg.tf_gridGroupName,
									locked : sg.tf_isLocked,
									columns : []
								};
								// 加入分组下的字段
								for ( var j in sg.tf_groupFields) {
									var gf = sg.tf_groupFields[j];
									var field = this.createColumn(module, sg, gf);
									if (field)
										if (isgroup) {
											this.canReduceTitle(group, field);
											group.columns.push(field);
										} else
											result.push(field);
								}
								if (isgroup) {
									result.push(group);
								}
								// 本分组下如果还有下层分组，则递归调用本函数
								if (sg.columns) {
									var subColumns = this.getGroupAndField(module, sg.columns);
									for ( var k in subColumns)
										if (isgroup)
											group.columns.push(subColumns[k])
										else
											result.push(subColumns[k])
								}
							}
							return result;
						},

						/**
						 * 建立一个列
						 */
						createColumn : function(module, group, groupfield) {
							var fd = module.getFieldDefine(groupfield.tf_fieldId);
							var field;
							if (fd) {
								if (fd.tf_isHidden)
									return null;
								field = this.getColumn(groupfield, fd, module);
							} else { // 如果不是本模块的基本字段，那么在附加字段中找（可能是父模块，祖父模块的字段，或者子模块的聚合字段）
								var fd = module.getAdditionFieldDefine(groupfield.tf_fieldId);
								field = this.getColumn(groupfield, fd, module);
								if (field.dataIndex.search('C_') == 0) {
									field.moduleName = field.dataIndex.slice(2);
									field.xtype = 'childcountcolumn';
									delete field.renderer;
									// field.renderer = this.childCountFieldRenderer;
								} else if (field.dataIndex.search('S_') == 0) {
									field.xtype = 'childaggregatecolumn';
									field.moduleName = fd.targetModuleName;
									field.moduleFieldName = fd.originFieldDefine.tf_fieldName;
									// delete field.renderer;
									// field.renderer = this.childCountFieldRenderer;
								}

							}
							field.locked = group.tf_isLocked || groupfield.tf_isLocked;
							// 如果列显示字段有附加的属性，如renderer 可以放在这里加入进去
							if (groupfield.tf_otherSetting) {
								try {
									eval('Ext.apply(field,{' + groupfield.tf_otherSetting + '})');
								} catch (err) {
									console.log(groupfield.tf_otherSetting + '解析出错。');
								}
							}
							return field;
						},

						getLockedLeftColumns : function(module) {
							var columns = [];
							// 是否有附件，有附件则加入附件按钮
							if (module.tf_hasAttachment
									&& module.tf_userRole.tf_attachmentBrowse)
								columns.push({
									locked : true,
									xtype : 'attachmentnumbercolumn'
								});

							// 是否模块具有审核功能
							if (module.tf_hasAuditing) {
								columns.push({
									locked : true,
									xtype : 'auditingactioncolumn'
								});
							}
							// 是否模块具有审批功能
							if (module.tf_hasApprove) {
								columns.push({
									locked : true,
									xtype : 'approveactioncolumn'
								});
							}

							// 是否模块具有支付功能
							if (module.tf_hasPayment) {
								columns.push({
									locked : true,
									xtype : 'payoutactioncolumn'
								});
							}
							// 如果是附件模块，加一个可以预览的列
							if (module.tf_moduleName == '_Attachment') {
								columns
										.push({
											dataIndex : 'tf_attachmentId',
											text : '预览',
											align : 'center',
											menuDisabled : true,
											sortable : true,
											width : 56,
											resizable : false,
											renderer : function(val, rd, model) {
												if (model.get('tf_filename'))
													return '<img height="16" width="16" src="attachment/preview.do?id='
															+ model.get('tf_attachmentId') + '" />';
												else
													return '<img height="16" width="16" src="" />';
											}
										});
							}
							// 如果模块有记录icon,则加入记录字段icon列
							if (module.tf_hasRecordIcon) {
								columns.push({
									xtype : 'recordiconcolumn',
									locked : true
								})
							}
							return columns;
						},

						/**
						 * module是模块的字义，schemeOrderId 为要生成的columns的 顺序号，不指定顺序号，则默认第一个方案
						 */
						getColumns : function(module, schemeOrderId) {
							return this.getColumnsWithMult(module, schemeOrderId);

							var scheme = module.getGridScheme(schemeOrderId);

							var columns = this.getLockedLeftColumns(module);

							for ( var i in scheme.tf_schemeGroups) {
								var sg = scheme.tf_schemeGroups[i];
								// 是否需要分组
								var isgroup = sg.tf_isShowHeaderSpans;
								var group = {
									gridGroupId : sg.tf_gridGroupId,
									text : sg.tf_gridGroupName,
									locked : sg.tf_isLocked,
									columns : []
								};
								for ( var j in sg.tf_groupFields) {
									var gf = sg.tf_groupFields[j];
									var fd = module.getFieldDefine(gf.tf_fieldId);
									var field;
									if (fd) {
										if (fd.tf_isHidden)
											continue;
										field = this.getColumn(gf, fd, module);
									} else { // 如果不是本模块的基本字段，那么在附加字段中找（可能是父模块，祖父模块的字段，或者子模块的聚合字段）
										var fd = module.getAdditionFieldDefine(gf.tf_fieldId);
										field = this.getColumn(gf, fd, module);
										if (field.dataIndex.search('C_') == 0) {
											field.moduleName = field.dataIndex.slice(2);
											field.xtype = 'childcountcolumn';
											delete field.renderer;
											// field.renderer = this.childCountFieldRenderer;
										}
									}
									field.locked = sg.tf_isLocked || gf.tf_isLocked;
									// 如果列显示字段有附加的属性，如renderer 可以放在这里加入进去
									if (gf.tf_otherSetting) {
										try {
											eval('Ext.apply(field,' + gf.tf_otherSetting + ')');
										} catch (err) {
										}
									}
									if (isgroup) {
										this.canReduceTitle(group, field);
										group.columns.push(field);
									} else
										columns.push(field);
								}
								if (isgroup) {
									this.canReduceTitle(group, field);
									columns.push(group);
								}
							}

							console.log(columns);

							return columns;
						},

						// 看看分组名称是不是 下面column 的开头，如果是开头的话，并且columntitle 后面有内容，就把
						// 相同的部分截掉
						canReduceTitle : function(group, field) {
							if (field.text.indexOf(group.text) == 0) {
								field.text = field.text.slice(group.text.length).replace('(',
										'').replace(')', '').replace('（', '').replace('）', '');
								if (field.text.indexOf("<br/>") == 0)
									field.text = field.text.slice(5);
							}
						},

						getTextAndUnit : function(fd) {
							var result = fd.tf_title.replace(new RegExp('--', 'gm'), '<br/>');// title中间有--表示换行

							result = result.replace('小计',
									'<span style="color : green;">小计</span>');

							var unitText = Ext.monetary.unitText === '个' ? ''
									: Ext.monetary.unitText;
							if (fd.tf_isMonetary && Ext.monetaryPosition === 'columntitle') {// 可能选择金额单位千,万,百万,亿
								if (fd.tf_unitText || unitText)
									result += '<br/><span style="color:green;">(' + unitText
											+ (fd.tf_unitText ? fd.tf_unitText : '') + ')</span>';
							} else {
								if (fd.tf_unitText)
									result += '<br/><span style="color:green;">('
											+ fd.tf_unitText + ')</span>';
							}
							return result;
						},

						/**
						 * 根据groupField,fieldDefine的定义，生成一个column的定义
						 */
						getColumn : function(gf, fd, module) {

							var field = {
								filter : {},
								maxWidth : 800,
								fieldDefine : fd,
								gridFieldId : gf.tf_gridFieldId, // 加上这个属性，用于在列改变了宽度过后，传到后台
								sortable : true,
								text : this.getTextAndUnit(fd),
								dataIndex : (fd.baseField || fd.tf_aggregate || fd.manyToMany) ? fd.tf_fieldName
										: fd.manytoone_TitleName
							};
							field.menuText = field.text
									.replace(new RegExp('<br/>', 'gm'), '');
							if (fd.tf_tooltipTpl) {
								field.tooltipTpl = fd.tf_tooltipTpl; // 显示在字段值上的tooltip的tpl值
								field.tooltipXTemplate = new Ext.XTemplate(fd.tf_tooltipTpl);
							}
							if (gf.tf_ishidden)
								field.hidden = true;
							// 如果是此人可以审批的字段，那么加上一个可以审批的标记
							if (module.tf_hasApprove
									&& module.tf_userRole.tf_approveOrder >= 1) {
								if (field.dataIndex.indexOf('tf_sh') == 0
										&& field.dataIndex.substr(field.dataIndex.length - 1, 1) == module.tf_userRole.tf_approveOrder)
									field.text = '<span class="approvethisgridheadicon" >'
											+ '<img src="images/approve/approve_edit.png" />'
											+ fd.tf_title + '</span>';
							}

							switch (fd.tf_fieldType) {
							case 'Image':
								Ext.apply(field, {
									xtype : 'imagecolumn',
									align : 'center',
									width : 100
								});
								break;
							case 'Date':
								Ext.apply(field, {
									xtype : 'datecolumn',
									align : 'center',
									width : 100,
									renderer : Ext.util.Format.dateRenderer
								// formatter : 'dateRenderer'

								});
								break;

							case 'Datetime':
								Ext.apply(field, {
									xtype : 'datecolumn',
									align : 'center',
									width : 130,
									renderer : Ext.util.Format.dateRenderer
								// formatter : 'dateRenderer'

								});
								break;

							case 'Boolean':
								field.xtype = 'checkcolumn';
								field.stopSelection = false;
								field.processEvent = function(type) {
									if (type == 'click')
										return false;
								};
								break;
							case 'Integer':
								Ext.apply(field, {
									align : 'right',
									xtype : 'numbercolumn',
									tdCls : 'intcolor',
									format : '#',
									renderer : Ext.util.Format.intRenderer
								});
								break;
							// 金额字段,暂时未用
							case 'Money':
								Ext.apply(field, {
									align : 'right',
									xtype : 'numbercolumn',
									width : 110,
									renderer : Ext.util.Format.floatRenderer
								// editor : {
								// xtype : 'numberfield'
								// }
								});

								break;
							case 'Double':
								Ext.apply(field, {
									align : 'right',
									xtype : 'numbercolumn',
									width : 110,
									renderer : Ext.util.Format.floatRenderer
								});
								break;
							case 'Float':
								Ext.apply(field, {
									align : 'right',
									xtype : 'numbercolumn',
									width : 110,
									renderer : Ext.util.Format.floatRenderer
								});
								break;
							case 'Percent':
								Ext.apply(field, {
									align : 'center',
									xtype : 'widgetcolumn',
									width : 110,
									// renderer : Ext.util.Format.percentRenderer
									widget : {
										xtype : 'progressbarwidget',
										animate : true,
										textTpl : [ '{percent:number("0")}%' ]
									}
								});
								break;
							case 'String':
								if (module.tf_nameFields == fd.tf_fieldName)
									Ext.apply(field, {
										// text : '<span class="gridheadicon" >'
										// + '<img src="images/button/namefield.png" />'
										// + fd.tf_title + '</span>',
										text : '<span class="fa fa-key"> ' + fd.tf_title
												+ '</span>',
										renderer : Ext.util.Format.nameFieldRenderer,
										summaryType : 'count',
										summaryRenderer : function(value) {
											return Ext.String.format('小计 ( {0} 条记录)', value);
										}

									});
								else
									Ext.apply(field, {
										renderer : Ext.util.Format.defaultRenderer
									});

								// if (!fd.l) { // sqlserver 不可以用text 字段排序 //全改成了
								// nvarchar(MAX)
								// field.sortable = false;
								// field.groupable = false;
								// field.menuDisabled = true;
								// }
								break;

							default:
								Ext.apply(field, {
									renderer : Ext.util.Format.defaultRenderer
								});
								break;
							}

							if (fd.s) { // tf_allowSummary
								Ext.apply(field, {
									hasSummary : true,
									summaryType : 'sum'
								});
							}
							// 如果是可以改变显示单位的数值，可以选择万，千，百万，亿
							if (fd.tf_isMonetary)
								field.renderer = Ext.util.Format.monetaryRenderer;
							if (gf.tf_columnWidth > 0)
								field.width = gf.tf_columnWidth;
							else if (gf.tf_columnWidth == -1) {
								field.flex = 1;
								field.minWidth = 120;
							}
							if (fd.manytoone_TitleName) {
								var pmodule = app.modules.getModuleInfo(fd.tf_fieldType);
								var icon = '';
								if (pmodule && pmodule.iconURL)
									icon = '<img src="' + pmodule.iconURL + '" />';
								Ext.apply(field, {
									xtype : 'manytoonefieldcolumn',
									text : '<span class="gridheadicon" >' + icon + fd.tf_title
											+ '</span>',
									manytooneIdName : fd.manytoone_IdName,
									moduleName : fd.tf_fieldType
								});
								delete field.renderer;
							}
							// 如果一个字段是一个附加字段，这个字段正好是父模块的父模块的一个namefileds字段，那么也要加成单击可以显示的功能
							// P__t1020___tf_title,例如这样的
							if (Ext.String.startsWith(fd.tf_fieldName, "P_")) {
								var fn = fd.tf_fieldName;
								var ppAsName = fn.substring(2, 10);
								if (ppAsName[6] == '_')
									ppAsName = ppAsName.substring(0, 6);
								var pmodule = app.modules.getModuleInfo(ppAsName);

								if (Ext.String.endsWith(fn, pmodule.tf_nameFields)) {
									var icon = '';
									if (pmodule && pmodule.iconURL)
										icon = '<img src="' + pmodule.iconURL + '" />';
									Ext.apply(field, {
										xtype : 'manytoonefieldcolumn',
										text : '<span class="gridheadicon" >' + icon
												+ fd.tf_title.replace(new RegExp('--', 'gm'), '<br/>')
												+ '</span>',
										manytooneIdName : pmodule.tableAsName + '___'
												+ pmodule.tf_primaryKey,
										moduleName : pmodule.tf_moduleName
									});
									delete field.renderer;
								}
							}
							if (fd.manyToMany){
								field.xtype = 'manytomanycolumn';
								delete field.renderer;
							}
							return field;
						}
					}

				});
