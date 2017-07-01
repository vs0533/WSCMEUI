/**
 * merge level=50
 */

Ext.define('WsCme.module.window.AttachmentWindow', {

			extend : 'Ext.window.Window',
			alias : 'widget.attahcmentwindow',

			layout : 'fit',
			maximizable : true,
			icon : 'images/module/_Attachment.png',
			height : 600,
			width : 800,
			shadowOffset : 20,
			closeAction : 'hide',

			pModuleName : null,
			pModuleTitle : null,
			aid : null,
			aname : null,
			param : null,

			initComponent : function() {

				var module = app.modules.getModule('_Attachment');

				this.title = this.pModuleTitle + "附件" + "『" + this.aname + "』";
				var m = module.getNewPanelWithParentModule('tabItemId',
						this.pModuleName, this.aid, this.name, {
							showAdditionView : true,
							param : this.param
						}, true);
				if (m) {
					m.header = null;
					m.title = null;
					this.items = [m];
				}

				this.callParent(arguments);
			},

			changeParentFilter : function(pModuleName, pModuleTitle, aid, aname , navigates) {
				this.pModuleName = pModuleName;
				this.pModuleTitle = pModuleTitle;
				this.aid = aid;
				this.aname = aname;
				this.setTitle(this.pModuleTitle + "附件" + "『" + this.aname + "』");
				this.down('modulepanel').changeParentFilter(pModuleName, aid, aname , navigates);
			},

			listeners : {
				show : function(win) {
					if (!win.iso) {
						win.iso = true;
						win.down('panel').getHeader().hide();
						win.down('panel').down('modulenavigate').collapse();
						win.down('attachmenttabpanel').setActiveTab(1);

					}
				}
			}

		})
