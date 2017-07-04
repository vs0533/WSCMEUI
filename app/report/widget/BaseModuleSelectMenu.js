/**
 * merge level=21
 * 
 * 综合查询界面的基准模块的选择菜单，
 * 
 * 基础模块，即在查询的时候以此模块作为 from 的 主体，其他的模块都是left outter join
 * 
 */

Ext.define('app.report.widget.BaseModuleSelectMenu', {
			extend : 'Ext.button.Button',
			alias : 'widget.basemoduleselectmenu',

			config : {
				allModules : null, // 共有多少个模块被选择了字段
				baseModuleName : null
				// 当前的基准模块
			},
			
			applyBaseModuleName : function(baseModuleName) {
				this.baseModuleName = baseModuleName;
				this.down('menuitem[moduleName='+baseModuleName +']').setChecked(true);
				var m = app.modules.getModule(baseModuleName);
				this.setText(this.text_ + m.tf_title);
			},
			
			applyAllModules : function(allModules) {
				var me = this;
				this.allModules = allModules;
				this.menu.removeAll(true);
				Ext.Array.forEach(this.allModules, function(moduleName) {
							var m = app.modules.getModule(moduleName);
							if (m)
								me.menu.add({
											moduleName : moduleName,
											text : m.tf_title,
											checked : false,
											group : me.getId()
										})
						});
			},

			initComponent : function() {

				this.text = '基准模块：';
				this.text_ = this.text;
				this.menu = {
					xtype : 'menu',
					style : {
						overflow : 'visible'
					},
					items : []
				}

				this.callParent(arguments);
			}
		})