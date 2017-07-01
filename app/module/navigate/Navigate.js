/**
 * merge level=35
 * 
 * 导航树的管理界面，一个grid可能有多个导航树
 */

Ext.define('WsCme.module.navigate.Navigate', {
			extend : 'Ext.panel.Panel',
			alias : 'widget.modulenavigate',
			requires : ['WsCme.module.navigate.NavigateTree'],
			layout : 'fit',

			config : {
				tabPosition : 'left',
				navigateMode : 'tab', // 各个navigate的排列方式，tab , accordion , allinone
				allSelected : false, // 是否每一个navigate选中的值都生效
				module : null,
				settingMenu : null,
				parentFilter : null
			},

			bodyPadding : 1,
			
			header : {
				tag : 'modulenavigate'
			},

			tools : [{
						type : 'refresh',
						tooltip : '刷新所有导航记录'
					}, {
						type : 'plus',
						tooltip : '所有选中的导航条件都有效'
					}, {
						type : 'minus',
						hidden : true,
						tooltip : '仅当前选中的导航条件有效'
					}, {
						type : 'pin',
						tooltip : '以Tab形式显示各导航树',
						hidden : true
					}, {
						type : 'unpin',
						tooltip : '以层叠形式显示各导航树'
					}, {
						type : 'gear',
						tooltip : '更多偏好设置'
					}],

			initComponent : function() {
				// console.log(this.defaultNavigateValues);
				var me = this;
				this.items = [];
				this.navigateValues = new Ext.util.MixedCollection(); // 当前选中的对grid有导航效果的treeitem
				// 有创建时加进来的导航约束
				this.setSelectedNavigates(this.defaultNavigateValues);
				this.listeners = {
					render : function() {
						this.initNavigateInTab();
					}
				};

				this.callParent(arguments);
			},

			setSelectedNavigates : function(selectedNavigates) {
				var me = this;
				if (selectedNavigates && selectedNavigates.length > 0) {
					me.navigateValues.clear();
					Ext.each(selectedNavigates, function(nv) {
								for (var n in nv) {
									me.navigateValues.add(n, nv[n]);
								}
							});
				}
			},

			getSettingMenu : function() {
				if (!this.settingMenu)
					this.settingMenu = Ext.create('app.module.navigate.SettingMenu', {
								navigate : this
							});
				return this.settingMenu;
			},

			/**
			 * 改变显示模式为tab 或accord 后，将原来的树移到新的下面面板就可以了
			 */
			applyNavigateMode : function(mode, param) {
				if (!this.rendered)
					return;
				this.navigateMode = mode;
				var panel;
				if (this.navigateMode == 'tab')
					panel = new Ext.widget('tabpanel', {
								tabPosition : this.tabPosition,
								plugins : [Ext.create('Ext.ux.TabReorderer')]
							});
				else
					panel = new Ext.widget('panel', {
								layout : {
									type : 'accordion',
									animate : true,
									multi : this.module.moduleGridNavigates.length < 4    //如果有3个以内的 可以同时展开
								}
							});

				for (var i in this.module.moduleGridNavigates) {
					var p = this.module.moduleGridNavigates[i];
					console.log(this);
					console.log(this.down('navigatetree#' + p.tf_fields));
					panel.add({
								title : p.tf_text,
								layout : 'fit',
								items : [this.down('navigatetree#' + p.tf_fields)]
							});
				}
				this.removeAll(true);
				this.add(panel);
			},

			/**
			 * 初始化 各个导航树以tab的形式加入到导航区域
			 */
			initNavigateInTab : function() {
				var tabPanel = new Ext.widget('tabpanel', {
							tabPosition : this.tabPosition,
							plugins : [Ext.create('Ext.ux.TabReorderer')]

						});

				for (var i in this.module.moduleGridNavigates) {
					var p = this.module.moduleGridNavigates[i];
					tabPanel.add({
								title : p.tf_text,
								datapanel : true,
								layout : 'fit',
								items : [{
											xtype : 'navigatetree',
											border : true,
											itemId : p.tf_fields,
											navigatetitle : p.tf_text,
											path : p.tf_fields,
											// isBaseField : p.isBaseField,
											cascading : p.tf_cascading,
											mode : Ext.encode(p.tf_NumberGroup),
											type : p.tf_type,
											reverseOrder : p.tf_reverseOrder,
											module : this.module,
											parentFilter : this.parentFilter
										}]
							});
				}
				this.add(tabPanel);
				tabPanel.setActiveTab(0);
			},

			/**
			 * 清除所有的导航的选中记录
			 */
			clearNavigateValues : function() {
				this.navigateValues.clear();
				this.refreshGridStore();
			},

			/**
			 * 加入一个选中的导航，如果是单选，那么先清除navigateValues ，如果是多选，找到primarykey相同的，再替换,
			 * 
			 * 一个tree只能有一个
			 * 
			 */

			addNavigateValue : function(navigateId, value) {
				// console.log(navigateId);
				if (this.allSelected) { // 多选
					this.navigateValues.removeAtKey(navigateId);
					if (value)
						this.navigateValues.add(navigateId, value);
				} else {
					this.navigateValues.clear();
					if (value)
						this.navigateValues.add(navigateId, value);
				}
				this.refreshGridStore();
			},

			applyParentFilter : function(fp) {
				if (!this.navigateValues)
					return fp;
				this.navigateValues.clear();
				//this.parentFilter = fp;
				Ext.each(this.query('navigatetree'), function(tree) {
							tree.setParentFilter(fp);
						});
				return fp;
			},
			// 改变了父模块的筛选之后
			changeParentFilter : function(fp) {
				this.navigateValues.clear();
				this.parentFilter = fp;
				Ext.each(this.query('navigatetree'), function(tree) {
							tree.setParentFilter(fp);
						});
			},

			refreshNavigateTree : function() {
				Ext.each(this.query('navigatetree'), function(tree) {
							tree.store.reload();
						});
			},

			refreshGridStore : function() {
				var array = [];
				this.navigateValues.each(function(item) {
							array.push(item);
						});
				this.up('modulepanel').down('modulegrid').store.setNavigates(array);
				this.up('modulepanel').down('modulegrid').updateTitle();
			}

		});