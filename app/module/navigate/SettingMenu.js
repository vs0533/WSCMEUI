/**
 * merge level=30
 * 
 * 导航控制panel上的gear按下时显示的菜单
 */

Ext.define('app.module.navigate.SettingMenu', {
			extend : 'Ext.menu.Menu',
			alias : 'widget.navigatesettingmenu',
			margin : '0 0 10 0',
			floating : true,

			initComponent : function() {

				this.items = [{
							text : '取消所有选择的导航',
							itemId : 'clearAllFilter'
						}, {
							text : '刷新所有导航记录',
							itemId : 'refresh'
						}, '-', {
							text : '显示无记录的项目',
							xtype : 'menucheckitem',
							itemId : 'display0record'
						}, {
							xtype : 'menucheckitem',
							text : '选中的导航条件都有效',
							itemId : 'allselected'
						}, '-', {
							text : '导航树显示方式',
							menu : [{
										text : '以Tab形式显示',
										checked : true,
										itemId : 'showintab',
										group : this.id + 'theme'
									}, {
										text : '以层叠形式显示',
										checked : false,
										itemId : 'showinacce',
										group : this.id + 'theme'
									}]
						}, '-', {
							text : '导航显示位置',
							menu : [{
										text : '左边',
										checked : true,
										itemId : 'dockinleft',
										group : this.id + 'lorr'
									}, {
										text : '右边',
										checked : false,
										itemId : 'dockinright',
										group : this.id + 'lorr'
									}]
						}];
				this.callParent(arguments);
			}

		});