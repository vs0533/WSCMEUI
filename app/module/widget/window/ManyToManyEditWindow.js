/**
 * 修改记录的manyToMany字段的窗口，在窗口中完成选择操作，并可保存。
 */

Ext.define('WsCme.module.widget.window.ManyToManyEditWindow', {

	extend : 'Ext.window.Window',
	alias : 'widget.manytomanyeditwindow',
	requires : [ 'WsCme.lib.CheckTreePanel' ],
	width : 450,
	height : 600,
	modal : true,
	maximizable : true,
	layout : 'fit',

	buttons : [ '->', {
		text : '保存',
		iconCls : 'fa fa-save',
		handler : function(button) {
			var window = button.up('window');
			var tree = window.down('treepanel');
			var selected = []
			tree.getRootNode().cascadeBy(function(node) {
				// 所有选中的 ManyToMany 的值
				if (node.data.checked == true && node.data.leaf == true) {
					selected.push(node.data.fieldvalue);
				}
			});
			// 提交ajax请求后台修改
			Ext.Ajax.request({
				url : 'modulemanytomany/setmanytomanydetail.do',
				params : {
					moduleName : window.moduleName,
					id : window.idvalue,
					manyToManyModuleName : window.manyToManyModuleName,
					linkModuleName : window.linkModuleName,
					selected : selected.join(',')
				},
				success : function(response) {
					var info = Ext.decode(response.responseText, true);
					if (info.success) {
						Ext.toastInfo(window.titlemess + ' 已保存。');
						window.grid.refreshSelectedRecord();
						window.close();
					} else
						Ext.toastError(window.titlemess + ' 保存失败。<br>' + '原因：' + info.msg);
				}
			})
		}
	}, {
		text : '关闭',
		iconCls : 'fa fa-close',
		handler : function(button) {
			button.up('window').close();
		}
	}, '->' ],

	initComponent : function() {
		var me = this;
		this.titlemess = this.title;
		this.title = '设置 ' + this.titlemess;
		this.items = [ {
			xtype : 'checktreepanel',
			autoLoad : false,
			rootVisible : false,
			root : {},
			store : Ext.create('Ext.data.TreeStore', {
				proxy : {
					type : 'ajax',
					url : 'modulemanytomany/getmanytomanydetail.do',
					extraParams : {
						moduleName : me.moduleName,
						id : me.idvalue,
						manyToManyModuleName : me.manyToManyModuleName,
						linkModuleName : me.linkModuleName
					}
				}
			})
		} ];
		this.callParent(arguments);
	}

})