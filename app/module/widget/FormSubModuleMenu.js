/**
 * merge level=25
 * 
 * form 窗口上的 gear 单击后，显示子模块的 菜单
 */

Ext.define('app.module.widget.FormSubModuleMenu', {
			extend : 'Ext.menu.Menu',
			alias : 'widget.formsubmodulemenu',
			margin : '0 0 10 0',
			floating : true,
			initComponent : function() {

				this.items = [];
				var submenu = [];
				var subtoolbars = this.module.tf_moduleSubToolbar;
				for (var i in subtoolbars) {
					var menu = this.getModuleButtonWithSingle(
							subtoolbars[i].tf_subMoudleName, subtoolbars[i].tf_openInWindow , this.window);
					if (subtoolbars[i].tf_inSubMenu) {
						menu.isMenu = true;
						submenu.push(menu)
					} else
						this.items.push(menu)
				}
				if (submenu.length > 0) {
					this.items.push({
								text : '更多',
								menu : submenu
							})
				}

				this.callParent(arguments);
			},

			// 加入子模块的按钮, 不递归
			getModuleButtonWithSingle : function(moduleName, openinwindow , window) {
				var cm = app.modules.getModule(moduleName);
				if (!cm)
					return null;
				if (cm.tf_userRole && cm.tf_userRole.tf_allowBrowse)
					;
				else
					return null;
				var result = {
					text : cm.tf_shortname ? cm.tf_shortname : cm.tf_title,
					icon : cm.iconURL, // 'images/module/' + cm.tf_moduleName + '.png',
					moduleName : cm.tf_moduleName,
					formChildButton : true,
					openInWindow : openinwindow,
					window : window
				};
				return result;
			}

		});