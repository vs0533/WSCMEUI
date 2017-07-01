/**
 * 具有附件的模块的显示附件个数的grid字段，可以显示附件的个数和tooltip，单击可以直接进入到此记录的附件列表及显示
 * 
 */

Ext.define('WsCme.module.widget.column.AttachmentNumberColumn',
		{
			extend : 'Ext.grid.column.Column',
			alias : 'widget.attachmentnumbercolumn',
			requires : [ 'Ext.menu.Menu' ],
			dataIndex : 'tf_attachmentCount',
			text : '<span class="fa fa-paperclip"></span>',
			tooltip : '附件数',
			align : 'center',
			menuDisabled : true,
			sortable : true,
			resizable : false,
			locked : true,
			width : 36,
			renderer : function(val, metaData, model, row, col, store, gridview) {
				if (val) {
					metaData.tdAttr = 'data-qtip="' + model.get('tf_attachmentTooltip')
							+ '"';
					var result = '<span class="attachmentColumnNumber">'
							+ (val > 9 ? val : '0' + val) + '</span>';
					return result;
				} else
					return '';
			},

			processEvent : function(type, view, cell, recordIndex, cellIndex, e,
					record, row) {
				if (type === 'click') {
					// 如果鼠标是在附件个数上面点击的
					if (e.getTarget().className === 'attachmentColumnNumber') {
						// 打开浏览和管理附件的页面
						app.mainRegion.addParentFilterModule('_Attachment',
								record.module.tf_moduleName, record.get(record.idProperty),
								record.getTitleTpl(), {
									showAdditionView : true
								});
					}
				} else if (type === 'contextmenu') {
					// 鼠标右键，显示弹出式菜单
					if (!this.contextmenu) {
						var items = [];
						if (this.up('modulegrid').module.tf_userRole.tf_attachmentInsert) {
							items.push({
								text : '新增附件',
								iconCls : 'fa fa-paperclip'
							}, '-');
						}
						items.push({
							text : '预览所有附件',
							itemId : 'additionview',
							iconCls : 'fa fa-image'
						}, {
							text : '查看附件记录',
							itemId : 'additionrecord',
							iconCls : 'fa fa-list'
						}, '-', {
							text : '下载所有附件',
							itemId : 'downloadall',
							iconCls : 'fa fa-save'
						})
						this.contextmenu = Ext.create('Ext.menu.Menu', {
							items : items
						})
					}
					this.contextmenu.showAt(e.pageX, e.pageY);
					e.preventDefault();
				}
			}
		})
