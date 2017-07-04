/**
 * merge level=39
 * 
 * 一个查询的字段选择模块
 * 
 */

Ext.define('app.report.selectfields.SelectFieldsWindow', {
	extend : 'Ext.window.Window',
	alias : 'widget.selectfieldswindow',
	width : 800,
	height : 600,

	closable : true,
	maximizable : true,
	modal : true,

	tools : [{
				type : 'help'

			}],
	tbar : [{
				text : '重新选择',
				icon : 'images/button/clear.png',
				scope : this,
				itemId : 'clearfields'
			}, '-', {
				text : '退出',
				icon : 'images/button/return.png',
				listeners : {
					click : function(button) {
						button.up('window').close();
					}
				}
			}, {
				text : '确定返回',
				icon : 'images/button/accept.png',
				itemId : 'saveselectedfields'
			}],

	mainReport : null,

	layout : 'border',
	icon : 'images/button/selectfield.png',

	initComponent : function() {
		this.title = '字段选择及附加条件';

		this.items = [{
					itemId : 'tablegroup',
					xtype : 'groupandmodulepanel',
					width : 220,
					region : 'west',
					split : true,
					collapsible : true,
					title : '模块分组和列表'
				}, {
					region : 'center',
					layout : 'border',
					items : [{
								region : 'center',
								border : false,
								xtype : 'canselectedfieldstree',
								title : '可选择的字段'
							}]
				}, {
					region : 'east',
					width : 300,
					split : true,
					// collapsible : true,
					layout : 'border',
					items : [{
								title : '已选择的字段',
								xtype : 'selectedfieldstree',
								canEditGroupText : true,
								border : false,
								setIcon1 : '',
								region : 'center'
							}, {
								region : 'south',
								title : '字段条件设置',
								xtype : 'fieldconditionform',
								border : false,
								height : 300,
								collapsible : true,
								collapsed : true
							}]

				}];
		this.callParent(arguments);
	},

	// 同步选中列表和可选择列表中的数据 , 用户选中或取消了一个字段， 刷新选中区域
	syncSelected : function() {
		// 先把 选中区域中 多余的去掉
		var selected = this.down('selectedfieldstree');
		var canSelected = this.down('canselectedfieldstree');
		canSelected.getRootNode().eachChild(function(group) {
			group.eachChild(function(node) {
						if (node.data.checked) {
							// 是否选中tree中有当前选中的记录，如果没有，则加入
							if (!selected.getRootNode().findChildBy(function(n) {
										return (n.data.value == node.data.value);
									}, this, true)) {
								// 找到selected中是否有当前选中字段的分组，如果没有，新建一个
								var groupname = node.parentNode.data.text;
								if (groupname == '默认组') {
									var m = app.modules.getModuleInfo(canSelected.moduleName);
									if (m)
										groupname = m.tf_title;
								}

								var groupnode = selected.getRootNode().findChildBy(function(n) {
											return (n.data.title == groupname);
										}, this, false);
								if (!groupnode) {
									groupnode = selected.getRootNode().appendChild({
										moduleName : canSelected.moduleName,
										title : groupname,
										text : groupname
												+ (selected.canEditGroupText ? selected.editIcon : ''),
										leaf : false,
										expanded : true
									});
								}
								groupnode.appendChild({
											moduleName : canSelected.moduleName,
											id : node.data.value,
											value : node.data.value,
											fieldType : node.data.tooltip,
											cls : getTypeClass(node.data.tooltip), // 用tooltip 代替
																															// fieldType
											title : node.data.text,
											text : node.data.text,
											leaf : true
										});
							}
						} else {
							var sn = selected.getRootNode().findChildBy(function(n) {
										return (n.data.value == node.data.value);
									}, this, true);
							if (sn) {
								var groupnode = sn.parentNode;
								groupnode.removeChild(sn);
								if (!groupnode.hasChildNodes())
									groupnode.parentNode.removeChild(groupnode);
							}
						}
					});

		});
		this.refreshStatusBar();

	},

	refreshStatusBar : function() {
		var selected = this.down('selectedfieldstree');
		var count = 0;
		selected.getRootNode().eachChild(function(group) {
					count += group.childNodes.length;
				});
		this.down('selectedfieldstree').setTitle('已选择的字段 '
				+ (count ? '(' + count + '个)' : ''));
	},

	// 选中的tree 中改变了 node focuds ,在canselect 中也跟一下右边单击了
	syncCanSelectedFocusNode : function() {
		var selected = this.down('selectedfieldstree');
		var canSelected = this.down('canselectedfieldstree');
		var nowselectedid = null;
		if (selected.getSelectionModel().hasSelection()) // 当前选中的是哪个字段，在canselected的tree中也选中这个字段
		{
			//console.log(selected.getSelectionModel().getLastSelected());
			nowselectedid = selected.getSelectionModel().getLastSelected().data.value ;// internalId;
		}
		canSelected.getRootNode().eachChild(function(group) {
					group.eachChild(function(node) {
								// 是不是有focus 的那一个 node
								//Ext.log(node.data.value);
								//Ext.log(nowselectedid);
								if (node.data.value === nowselectedid)
									canSelected.getSelectionModel().select(node);
							});
				});
	},

	// 同步被选择的tree,
	syncCanSelected : function() {
		var selected = this.down('selectedfieldstree');
		var canSelected = this.down('canselectedfieldstree');
		canSelected.getRootNode().eachChild(function(group) {
					group.eachChild(function(node) {
								// 判断当前的node 是否打勾
								var sn = selected.getRootNode().findChildBy(function(n) {
											return (n.data.value  == node.data.value);    //internalId
										}, this, true);
								if (sn)
									node.set({
												checked : true
											});
							});
				});
		this.syncCanSelectedFocusNode();
	},
	syncConditionForm : function(node) {
		var form = this.down('fieldconditionform');
		form.setFieldNode(node);
	}
});