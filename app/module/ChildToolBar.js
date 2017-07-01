/**
 * merge level=40
 * 
 */
Ext.define('WsCme.module.ChildToolBar', {
			extend : 'Ext.toolbar.Toolbar',
			alias : 'widget.childtoolbar',

			layout : {
				overflowHandler : 'Menu'
			},
			initComponent : function() {
				this.items = [];
				var submenu = [];
				var subtoolbars = this.modulePanel.module.tf_moduleSubToolbar;
				if (subtoolbars && subtoolbars.length > 2) {
					for (var i in subtoolbars) {
						var menu = app.module.ChildToolBar
								.getModuleButtonWithSingle(subtoolbars[i].tf_subMoudleName,
										subtoolbars[i].tf_openInWindow);
						if (!menu)
							continue;
						if (subtoolbars[i].tf_inSubMenu){
							menu.isMenu = true;
							submenu.push(menu)
						}else
							this.items.push(menu)
					}
					if (submenu.length > 0){
						this.items.push({
							text : '更多',
							menu : submenu
						})
					}
				}

				// var childs = this.modulePanel.module.childNames;
				// if (childs && childs.length > 2) {
				// for (var i in childs) {
				// var cm = app.modules.getModule(childs[i]);
				// if (!cm) {
				// console.log("创建子模块：" + childs[i] + "未找到！")
				// continue;
				// }
				// this.items.push(app.module.ChildToolBar.getModuleButton(childs[i]))
				// }
				// }
				else
					this.hidden = true;
				this.callParent(arguments);
			},

			statics : {

				// 加入子模块的按钮, 不递归
				getModuleButtonWithSingle : function(moduleName, openinwindow) {

					var cm = app.modules.getModule(moduleName);
					if (!cm) {
						return null;
					}
					if (cm.tf_userRole && cm.tf_userRole.tf_allowBrowse)
						;
					else
						return null;

					var result = {
						text : cm.tf_shortname ? cm.tf_shortname : cm.tf_title,
						icon : cm.iconURL, // 'images/module/' + cm.tf_moduleName + '.png',
						moduleName : cm.tf_moduleName,
						childButton : true,
						openInWindow : openinwindow
					};
					return result;

				},

				// 加入子模块的按钮，如果子模块还有子模块，则递归加入
				getModuleButton : function(moduleName, sub) {
					var cm = app.modules.getModule(moduleName);
					if (!cm) {
						// console.log("创建子模块：" + moduleName + "未找到！")
						return null;
					}
					if (cm.tf_userRole && cm.tf_userRole.tf_allowBrowse)
						;
					else
						return null;

					var result = {
						text : cm.tf_shortname ? cm.tf_shortname : cm.tf_title,
						icon : cm.iconURL, // 'images/module/' + cm.tf_moduleName + '.png',
						moduleName : cm.tf_moduleName,
						childButton : true
					};
					if (cm.childNames && cm.childNames.length > 0) {
						if (!sub)
							Ext.apply(result, {
										xtype : 'splitbutton'
									});
						Ext.apply(result, {
									menu : {}
								})
						// 加入当前模块的子模块
						result.menu.items = [];
						for (var i in cm.childNames)
							result.menu.items.push(app.module.ChildToolBar.getModuleButton(
									cm.childNames[i], true));
					}
					return result;
				}
			}

		});
