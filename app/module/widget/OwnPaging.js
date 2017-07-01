/**
 * merge level=09
 * 
 * 自定义的grid 的页 导航条，可以上一面，下一页的，主要问题是 classic 等几个css ,所有按钮的宽度都没有了
 * 
 */
Ext.define('WsCme.module.widget.OwnPaging', {
			extend : 'Ext.toolbar.Paging',
			alias : 'widget.ownpagingtoolbar',

			initComponent : function() {
				//if (Ext.themeName !== 'neptune')
					//this.defaultButtonUI = 'default-toolbar'
				
				this.callParent(arguments);
				
			}
		});