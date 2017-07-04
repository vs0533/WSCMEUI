/**
 * merge level=32
 * 
 * 可选择的字段树，里面显示了一个模块的所有的 字段组 ＋ 字段，可以进行选择
 * 
 */

Ext.define('app.report.selectfields.SelectedFieldsTree', {
	extend : 'Ext.tree.Panel',
	alias : 'widget.selectedfieldstree',
	rootVisible : true,

	canEditGroupText : false,
	editIcon : '<span class="rightsrc"><img src="images/button/edit.png"/><span> ',
	setIcon1 : '<span class="rightsrc"><img src="images/button/setting.png"/><span> ',

	tools : [{
				type : 'expand',
				tooltip : '全部展开',
				listeners : {
					click : function(tool) {
						tool.up('panel').expandAll();
					}
				}

			}, {
				type : 'collapse',
				tooltip : '全部折叠',
				listeners : {

					click : function(tool) {
						tool.up('panel').getRootNode().eachChild(function(group) {
									group.collapse();
								});
					}
				}
			}],

	viewConfig : {
		plugins : {
			ptype : 'treeviewdragdrop',
			containerScroll : true
		}
	},

	root : {
		text : '已选择的字段',
		expanded : true
	},
	initComponent : function() {
		var me = this;
		Ext.applyIf(me, this.config);
		this.store = Ext.create('app.report.selectfields.SelectedFieldsTreeStore',
				{
					tree : this
				});
		this.callParent(arguments);
	}

});