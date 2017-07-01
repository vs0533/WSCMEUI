Ext.define('WsCme.module.widget.toolButton.Delete', {

	extend : 'Ext.button.Button',

	alias : 'widget.deletebutton',
	
	text : '删除',

	iconCls : 'fa fa-trash-o',
	itemId : 'delete',

	listeners : {
		// click : 'deleteRecords', // 这里不要用handler，而要用click,因为下面要发送click事件
		// 删除按钮在渲染后加入可以Drop的功能
		render : function(button) {
			// 可以使Grid中选中的记录拖到到此按钮上来进行删除
			
			button.dropZone = new Ext.dd.DropZone(button.getEl(), {
				// 此处的ddGroup需要与Grid中设置的一致
				ddGroup : 'DD_' + button.module.tf_moduleName,

				// 这个函数没弄明白是啥意思,没有还不行
				getTargetFromEvent : function(e) {
					return e.getTarget('');
				},
				// 用户拖动选中的记录经过了此按钮
				onNodeOver : function(target, dd, e, data) {
					return Ext.dd.DropZone.prototype.dropAllowed;
				},
				// 用户放开了鼠标键，删除记录
				onNodeDrop : function(target, dd, e, data) {
					button.fireEvent('click', button); // 执行删除按钮的click事件
				}
			})
		}
	}

})
