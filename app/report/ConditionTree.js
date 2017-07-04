/**
 * merge level=32
 * 
 * 一个控制grid的导航树,的有的事件由GridNavigtateTree中控制
 */

Ext.define('WsCme.report.ConditionTree', {
			extend : 'Ext.tree.Panel',
			alias : 'widget.conditiontree',
			requires : ['WsCme.lib.TreeSearchField'],
			rootVisible : false,

			mixins : {
				treeFilter : 'WsCme.lib.TreeFilter' // 混合tree内部筛选的filter
			},

			header : {
// titlePosition : 4, // title放到最后面，因为加了一个查询控件
			// titleAlign : 'center'
			},

			config : {
				maxlevel : 2, // 当前tree共有多少级
				level : 1, // 展开的当前级数,按下展开一级后，会一级一级的展开
				cascading : true, // 如果是多级导航，是否层叠，如果不层叠，那每个属性并列
				isContainNullRecord : false, // 是否包括无记录的属性
				navigatetitle : null, // 导航属性的中文描述
				path : null, // 导航属性的字段，如果是多个字段用--分隔
				// isBaseField : null, // 是否是模块的基本字段，即不是manytoone字段
				parentFilter : null,
				reverseOrder : null
				// 所有的树状值是否倒序排列
			},

			tools : [{
						type : 'expand',
						tooltip : '展开一级',
						listeners : {
							click : function(tool) {
								tool.up('conditiontree').expandToNextLevel();
							}
						}

					}, {
						type : 'collapse',
						tooltip : '全部折叠',
						listeners : {

							click : function(tool) {
								tool.up('conditiontree').collapseAll();
								tool.up('conditiontree').setLevel(1);
							}
						}

					}

			],

			listeners : {

				checkchange : function(node, checked) {
					setChildChecked(node, checked);
					setParentChecked(node, checked);
					node.getOwnerTree().up('window').syncSelected();
				},

				load : function(store, node, records) {
					this.getView().refresh(); // 刷新一下view 不然后面的 记录数出不来
					this.calcMaxLevel(this.getRootNode()); // 计算node最深的级数
					this.setLevel(1);
					this.up('window').syncSelected();
				},

				afterrender : function(tree) {
					tree.getHeader().insert(1, {
								xtype : 'treesearchfield',
								emptyText : '输入筛选值',
								labelAlign : 'right',
								fieldLabel : '筛选条件',
								labelAlign : 'right',
								labelWidth : 60,
								width : '50%',
								treePanel : tree
							});
				}
			},

			constructor : function() {

				this.callParent(arguments);
			},

			initComponent : function() {
				var me = this;
				Ext.applyIf(me, this.config); // 将部分初始值加进来
				this.store = Ext.create('app.report.ConditionTreeStore', {
							proxy : {
								type : 'ajax',
								url : 'report/fetchmoduleconitiontree.do',
								extraParams : {
									conditionId : this.conditionId,
									selectedValues : this.selectedValues
								}
							},
							conditionId : this.conditionId,
							selectedValues : this.selectedValues,
							ownerTree : this
						});
				this.callParent(arguments);
			},

			clearAllChecked : function() {
				setChildChecked(this.getRootNode(), false);
			},

			selectAllChecked : function() {
				setChildChecked(this.getRootNode(), true);
			},

			// * 在数据加载进来后，计算node最大的深度

			calcMaxLevel : function(node) {
				if (node.getDepth() > this.getMaxlevel())
					this.setMaxlevel(node.getDepth());
				for (var i in node.childNodes)
					this.calcMaxLevel(node.childNodes[i]);
			},

			// * 展开至下一级

			expandToNextLevel : function() {
				if (this.level < this.maxlevel)
					this.expandToLevel(this.getRootNode(), this.level);
				this.level += 1;
				if (this.level >= this.maxlevel)
					this.level = 1;
			},

			// * 展开至指定级数

			expandToLevel : function(node, tolevel) {
				if (node.getDepth() <= tolevel)
					node.expand();
				for (var i in node.childNodes)
					this.expandToLevel(node.childNodes[i], tolevel);
			}

		});