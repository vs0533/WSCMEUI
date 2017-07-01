/**
 * 
 *   merge level=35
 */
Ext.define('WsCme.module.form.DisplayForm', {
			extend : 'WsCme.module.form.BaseForm',
			alias : 'widget.displayform',

			initComponent : function() {
				this.formtype = 'display';
				this.formtypetext = '显示';
				// 如果是模块中的显示，那么就加入上一条，下一条，如果是单独的显示某条记录，则不加入
				this.buttons = ['->', {
							text : '上一条',
							itemId : 'prior',
							formButton : true,
							icon : 'images/button/prior.png'
						}, {
							text : '下一条',
							itemId : 'next',
							formButton : true,
							icon : 'images/button/next.png'
						}];

				this.callParent(arguments)
			},

			// 在modulegrid中选择显示记录
			setLinkedGrid : function(grid) {
				this.down('button#prior[formButton]').setVisible(true);
				this.down('button#next[formButton]').setVisible(true);
				this.callParent(arguments);
			},

			// 在其他模块中单击该模块的namefield显示记录，取消上一条和下一条
			setRecordId : function(id) {
				this.down('button#prior[formButton]').setVisible(false);
				this.down('button#next[formButton]').setVisible(false);
				this.callParent(arguments)
			}
		})