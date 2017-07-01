/**
 * 
 * merge level=40
 * 
 * 每个ModuleGrid中都可以选中了一条记录后，查看此记录的所有信息的propertyGrid
 */

Ext
		.define(
				'WsCme.module.Detail',
				{
					extend : 'Ext.grid.property.Grid',
					alias : 'widget.recorddetail',
					emptyText : '没有选中的记录',
					nameColumnWidth : 150,
					modulePanel : null,
					detailScheme : null,
					fields : null,
					printArray : [],
					record : null,
					additionFields : {}, // 用来放每一个字段对应的当前 字段的
					recordTitle : null,
					tools : [
							{
								type : 'prev',
								tooltip : '上一条记录',
								handler : function(event, toolEl, panelHeader) {
									panelHeader.ownerCt.up('modulepanel').down('modulegrid')
											.selectPriorRecord();
								}
							},
							{
								type : 'next',
								tooltip : '下一条记录',
								handler : function(event, toolEl, panelHeader) {
									panelHeader.ownerCt.up('modulepanel').down('modulegrid')
											.selectNextRecord();
								}
							}, {
								type : 'print',
								tooltip : '打印当前明细记录',
								handler : function(event, toolEl, panelHeader) {
									panelHeader.ownerCt.printDetail();
								}
							} // , { type : 'gear'}
					],

					listeners : {
						cellclick : function(rowme, td, cellIndex, record, tr, rowIndex, e,
								eOpts) {
							var me = rowme.ownerCt;
							var This = this;
							// 单击了字段附加属性后面的 显示 附件的图标
							if (e.target.src !== undefined) {
								// 加在 img 标签中的field id 值
								var fieldId = e.target.attributes.fieldId.value;
								var moduleName = this.modulePanel.module.tf_moduleName;
								var aid = me.record.data[this.modulePanel.module.tf_primaryKey];
								var aname = me.record.data[this.modulePanel.module.tf_nameFields];
								var fieldtitle = e.target.attributes.fieldTitle.value;
								var navigateSelected = {
									equalsMethod : null,
									equalsValue : fieldId,
									fieldtitle : '附件对应字段',
									isCodeLevel : false,
									moduleName : '_AttachmentOnField',
									primarykey : 'tf_fieldId',
									tableAsName : "_t9506",
									text : fieldtitle
								};
								var defaultNavigate = {
									defaultNavigateValues : [ {
										'_AttachmentOnField' : navigateSelected
									} ]
								};
								var grid = me.up('modulepanel').down('modulegrid');
								if (app.attachmentFieldWin)
									// 如果是不同的模块，那就要重新生成，因为权限不同
									if (app.attachmentFieldWin.pModuleName !== moduleName) {
										app.attachmentFieldWin.destroy();
										app.attachmentFieldWin = null;
									}
								if (!app.attachmentFieldWin) {
									app.attachmentFieldWin = Ext.widget('attahcmentwindow', {
										pModuleName : moduleName,
										pModuleTitle : this.modulePanel.module.tf_title,
										aid : aid,
										aname : aname,
										frame : false,
										border : false,
										x : grid.getX(),
										y : grid.getY(),
										height : grid.getHeight(),
										width : grid.getWidth(),
										param : defaultNavigate
									});
									app.attachmentFieldWin.show(null, function(win) {
										app.attachmentFieldWin.down('attachmentnavigate').setWidth(
												180);
//										Ext.Function.defer(function() {
//											app.attachmentFieldWin.changeParentFilter(moduleName,
//													This.modulePanel.module.tf_title, aid, aname,
//													defaultNavigate);
//										}, 500);

									});
								} else {
									app.attachmentFieldWin.changeParentFilter(moduleName,
											this.modulePanel.module.tf_title, aid, aname,
											defaultNavigate);
									app.attachmentFieldWin.show();
								}
								;

							}
						}
					},

					initComponent : function() {
						var me = this;
						var schemes = this.modulePanel.module.tf_moduleDetailSchemes;
						if (schemes && schemes.length >= 1) {
							// 选择第一个方案
							this.selectScheme(schemes[0].tf_detailId);
							if (schemes.length > 1) {
								this.bbar = [ {
									xtype : 'detailschemecombo',
									modulePanel : this.modulePanel
								} ];
							}
						}
						;
						this.sourceConfig = {};
						this.callParent(arguments);
					},

					selectScheme : function(detailId) {
						var me = this;
						var module = this.modulePanel.module;
						Ext.each(module.tf_moduleDetailSchemes, function(scheme) {
							if (scheme.tf_detailId == detailId) {
								me.detailScheme = scheme;
								return false;
							}
						});
						this.fields = [];
						Ext.each(this.detailScheme.tf_moduleDetailSchemeFields, function(
								field) {
							var fd = module.getFieldDefine(field.tf_fieldId);
							if (fd) {
								if (fd.tf_isHidden)
									return;
								me.fields.push(fd);
							} else {
								fd = module.getAdditionFieldDefine(field.tf_fieldId);
								if (fd) {
									me.fields.push(fd);
								}
							}
						});
					},

					// 显示的顺序号是按照setSource({})中的字段的顺序加入的 , 不知道他是怎么排序的
					updateSource : function(record) {
						this.record = record;
						if (this.collapsed)
							return;
						var me = this;
						me.printArray = [];
						if (record == null) {
							me.setSource({});
							return;
						}
						me.recordTitle = record.data[me.modulePanel.module.tf_nameFields];
						var source = {};
						var sourceConfig = {};
						if (me.detailScheme == null) {
							var fields = record.store.model.getFields();
							for ( var i in fields) {
								var field = fields[i];
								var ft = field.title;
								if (ft) {
									ft = ft.replace(new RegExp('--', "gm"), '');
									source[ft] = record.data[field.name];
								}
								me.printArray.push({
									title : ft,
									value : record.data[field.name]
								});
							}
							this.setSource(source);
							return;
						}
						var model = record.store.model;
						var i = 1;
						Ext.each(this.fields, function(field) {
							Ext.each(model.getFields(), function(modelfield) {
								if (modelfield.name == field.tf_fieldName) {
									var n = me.formatNumber(i)
											+ modelfield.title.replace(new RegExp('--', 'gm'), '');
									if (field.tf_unitText)
										n += '(' + field.tf_unitText + ')';
									// 这里不能加双引号，单引号也不能嵌套， return false 后面要加一个 双引号，还要加 href="#"
									if (modelfield.tf_haveAttachment) {
										n += ' <img src=\'images/button/addition.png\' fieldId=\''
												+ field.tf_fieldId + '\' fieldTitle=\''
												+ field.tf_title + '\'/>';
									}
									var v = record.data[modelfield.name];
									source[n] = record.data[modelfield.name];
									if (field.tf_fieldType == 'Date') {
										v = Ext.util.Format.dateRenderer(v);
										sourceConfig[n] = {
											renderer : Ext.util.Format.dateRenderer
										};
									} else if (field.tf_fieldType == 'Integer') {
										v = Ext.util.Format.intRenderer(v);
										sourceConfig[n] = {
											renderer : Ext.util.Format.intRenderer
										};
									} else if (field.tf_fieldType == 'Double') {
										v = Ext.util.Format.floatRenderer(v);
										sourceConfig[n] = {
											renderer : Ext.util.Format.floatRenderer
										};
									} else if (field.tf_fieldType == 'Boolean') {
										v = Ext.util.Format.booleanTextRenderer(v);
										sourceConfig[n] = {
											renderer : Ext.util.Format.booleanTextRenderer
										};
									} else if (field.tf_fieldType == 'Percent') {
										v = Ext.util.Format.percentNumberRenderer(v);
										sourceConfig[n] = {
											renderer : Ext.util.Format.percentNumberRenderer
										};
									}
									me.printArray.push({
										title : n,
										value : v
									});
									i++;
									return false;
								} else if (modelfield.name == field.manytoone_TitleName) {
									var n = me.formatNumber(i)
											+ modelfield.title.replace(new RegExp('--', "gm"), '');
									me.printArray.push({
										title : n,
										value : record.data[modelfield.name]
									});
									source[n] = record.data[modelfield.name];
									i++;
									return false;
								}
							});
						});
						this.setSource(source, sourceConfig);
					},

					formatNumber : function(n) {
						if (n < 10)
							return '0' + n + '.';
						else
							return n + '.';
					},

					printDetail : function() {
						if (this.printArray.length == 0) {
							Ext.toastWarn("当前没有选中的记录，请先选择一条记录!");
							return;
						}
						var s = '';
						for (i in this.printArray)
							s += Ext.String
									.format(
											'<tr><td width="30%" height="25px">{0}</td><td width="70%">{1}</td>',
											this.printArray[i].title.substring(3),
											this.printArray[i].value);
						var htmlMarkup = [
								'<html>',
								'<head>',
								'<link rel="Shortcut Icon" href="favicon.png" type="image/png" />',
								'<link href="css/printrecord.css" rel="stylesheet" type="text/css" />',
								'<title>' + '打印' + this.modulePanel.module.tf_title
										+ '记录</title>',
								'</head>',
								'<body>',
								'<div class="printer-noprint">',
								'<div class="buttons">',
								'<a class="button-print" href="javascript:void(0);" onclick="window.print();">打印</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
								'<a class="button-exit" href="javascript:void(0);" onclick="window.close();">关闭</a>',
								'<hr/>',
								'</div>',
								'</div>',
								'<div class="headtitle">',
								'<printtable><table width="600"><tr><td class="headtitle" height="40" align="center" valign="middle">',
								this.modulePanel.module.tf_title + "：" + this.recordTitle,
								'</td></tr></table>',
								'<table width="600" border="1" cellpadding="3">', s,
								'</table></printtable>', '</body>', '</html>' ];
						var html = Ext.create('Ext.XTemplate', htmlMarkup).apply();
						var win = window.open('', 'printrecord');
						win.document.open();
						win.document.write(html);
						win.document.close();
					}

				});
