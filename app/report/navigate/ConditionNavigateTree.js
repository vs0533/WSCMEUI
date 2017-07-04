/**
 * merge level=32
 * 
 * 模块记录选择树，可以选择多个记录，用来控制查询的条件，选择了值以后3秒后，无操作，则刷新结果
 * 
 */

Ext.define('WsCme.report.navigate.ConditionNavigateTree', {
	extend : 'Ext.tree.Panel',
	alias : 'widget.conditionnavigatetree',
	requires : ['WsCme.lib.TreeSearchField'],
	rootVisible : false,
	icon : 'images/button/selecttree.png',
	frame : false,
	border : false,
	mixins : {
		treeFilter : 'WsCme.lib.TreeFilter' // 混合tree内部筛选的filter
	},
	selectedValues : [],
	changeCount : 0, // 当前改变了选择以后，有没有去刷新进询结果，2秒之内改变了数据，则前面的不进行刷新，以最后一次为准

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
						tool.up('conditionnavigatetree').expandToNextLevel();
					}
				}

			}, {
				type : 'collapse',
				tooltip : '全部折叠',
				listeners : {

					click : function(tool) {
						tool.up('conditionnavigatetree').collapseAll();
						tool.up('conditionnavigatetree').setLevel(1);
					}
				}

			}, {
				type : 'close',
				listeners : {
					click : function(tool) {
						var reportNavigate = tool.up('reportnavigate');
						var me = tool.up('conditionnavigatetree');
						if (!me.collapsed)
							me.prev().expand();
						reportNavigate.remove(me, true);
					}
				}
			}

	],

	listeners : {

		checkchange : function(node, checked) {
			var me = this;
			setChildChecked(node, checked);
			setParentChecked(node, checked);
			me.changeCount++;
			var i = me.changeCount;
			// 在刷新数据的时候比较一下是否是了后一个改变的，如果是则进行处理
			setTimeout(function() {
						me.refreshReport(i);
					}, 1500);
		},

		load : function(store, node, records) {
			this.getView().refresh(); // 刷新一下view 不然后面的 记录数出不来
			this.calcMaxLevel(this.getRootNode()); // 计算node最深的级数
			this.setLevel(1);
		}
	},

	// 改变了数据以后去刷新数据
	refreshReport : function(count) {
		// 如果在count 记数的以后2秒内，又进行过修改，那么这次就不执行了
		if (count != this.changeCount)
			return;

		var values = [];
		var texts = [];

		this.getRootNode().cascadeBy(function(node) {
			// root的 parentNode 为null, 第一级结点的parentNode.data.text='Root'
			if (node.data.checked == true
					&& !!node.parentNode
					&& (node.parentNode.data.text == 'Root' || node.parentNode.data.checked == false)) {
				values.push(node.raw.fieldvalue);
				texts.push(node.data.text.replace(new RegExp(',', "gm"), '，'));
			}
		});
		this.up('mainreport').down('conditionlistgrid').updateModuleCondition(
				this.condition, values, texts);
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
					selectedValues : this.selectedValues
				});

		this.bbar = [{
					xtype : 'treesearchfield',
					emptyText : '输入筛选值',
					labelAlign : 'right',
					fieldLabel : '筛选条件',
					labelAlign : 'right',
					labelWidth : 60,
					width : '100%',
					treePanel : this
				}],

		this.callParent(arguments);
	},

	refreshChecked : function(values) {
		this.selectedValues = values, me = this;
		var v = this.selectedValues;
		if (typeof this.selectedValues == 'string')
			var v = this.selectedValues.split(',');
		// this.store.load();
		this.clearAllChecked();
		Ext.each(v, function(value) {
					var node = me.getRootNode().findChildBy(function(node) {
								if (node.raw.fieldvalue == value)
									return true;
							}, me, true);
					if (node) {
						node.set({
									checked : true
								});
						setChildChecked(node, true);
					}
				});
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