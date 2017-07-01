/**
 * merge level=32
 * 
 * 一个控制grid的导航树,的有的事件由GridNavigtateTree中控制
 */

Ext.define('WsCme.module.navigate.NavigateTree', {
	extend : 'Ext.tree.Panel',
	alias : 'widget.navigatetree',
	requires : [ 'WsCme.lib.TreeSearchField',
			'WsCme.module.navigate.NavigateTreeStore' ],
	rootVisible : false,
	plain : true,
	mixins : {
		treeFilter : 'WsCme.lib.TreeFilter' // 混合tree内部筛选的filter
	},

	header : {
		titlePosition : 4, // title放到最后面，因为加了一个查询控件
		titleAlign : 'center'
	},
	parentFilter : null,

	config : {
		maxlevel : 2, // 当前tree共有多少级
		level : 1, // 展开的当前级数,按下展开一级后，会一级一级的展开
		cascading : true, // 如果是多级导航，是否层叠，如果不层叠，那每个属性并列
		isContainNullRecord : false, // 是否包括无记录的属性
		navigatetitle : null, // 导航属性的中文描述
		path : null, // 导航属性的字段，如果是多个字段用--分隔
		// isBaseField : null, // 是否是模块的基本字段，即不是manytoone字段
		reverseOrder : null
	// 所有的树状值是否倒序排列
	},

	tools : [ {
		type : 'expand',
		tooltip : '展开一级'
	}, {
		type : 'collapse',
		tooltip : '全部折叠'
	}, {
		type : 'pin',
		tooltip : '并列显示各导航属性'
	}, {
		type : 'unpin',
		tooltip : '层叠显示各导航属性',
		hidden : true
	} ],

	listeners : {
		load : function(store, node, records) {
			this.getView().refresh(); // 刷新一下view 不然后面的 记录数出不来
			this.calcMaxLevel(this.getRootNode()); // 计算node最深的级数
			this.setLevel(1);
		},

		afterrender : function(tree) {
			if (this.path.search('--') == -1) // 如果只是单层的树，隐藏加单多层转换的按钮
				this.down('tool[type=pin]').setVisible(false);
			tree.getHeader().insert(5, {
				xtype : 'treesearchfield',
				emptyText : '输入筛选值',
				labelAlign : 'right',
				labelWidth : 32,
				width : '72%',
				treePanel : tree
			});
		}
	},

	initComponent : function() {
		var me = this;
		Ext.applyIf(me, this.config); // 将部分初始值加进来
		this.store = Ext.create('app.module.navigate.NavigateTreeStore', {

			autoLoad : true,
			// proxy : {
			// type : 'ajax',
			// url : 'user/getuserroles.do',
			// extraParams : {
			// userId : app.viewport.getViewModel()
			// .get('userInfo.tf_userId')
			// }
			// }
			//			

			proxy : {
				type : 'ajax',
				url : 'navigatetree/fetchdata.do',
				extraParams : {
					moduleName : this.module.tf_moduleName,
					cascading : this.cascading,
					isContainNullRecord : this.isContainNullRecord,
					title : this.navigatetitle,
					navigatePath : this.path,
					// isBaseField : this.isBaseField,
					reverseOrder : this.reverseOrder,
					mode : this.mode,
					type : this.type,
					parentFilter : Ext.encode(this.parentFilter)

				}
			}

		});

		this.viewConfig = {
			plugins : {
				ptype : 'treeviewdragdrop',
				ddGroup : 'DD_' + this.module.tf_moduleName,
				enableDrag : false
			}
		};
		this.callParent(arguments);
	},

	setParentFilter : function(pf) {
		if (!this.rendered)
			return;
		this.parentFilter = pf;
		this.store.proxy.extraParams.parentFilter = Ext.encode(pf);
		this.store.load();

	},

	/**
	 * 改变了层级的显示方式后，重新加载数据
	 */
	applyCascading : function(cascading) {
		console.log(cascading);
		if (!this.rendered)
			return;
		this.cascading = cascading;
		this.store.proxy.extraParams.cascading = this.cascading;
		this.store.reload();
	},

	/**
	 * 设置导航树中是否包括无记录的属性值，并刷新
	 */
	applyIsContainNullRecord : function(value) {
		if (!this.rendered)
			return;
		this.isContainNullRecord = value;
		this.store.proxy.extraParams.isContainNullRecord = value;
		this.store.reload();
	},

	/**
	 * 在数据加载进来后，计算node最大的深度
	 */
	calcMaxLevel : function(node) {
		if (node.getDepth() > this.getMaxlevel())
			this.setMaxlevel(node.getDepth());
		for ( var i in node.childNodes)
			this.calcMaxLevel(node.childNodes[i]);
	},

	/**
	 * 展开至下一级
	 */
	expandToNextLevel : function() {
		if (this.level < this.maxlevel)
			this.expandToLevel(this.getRootNode(), this.level);
		this.level += 1;
		if (this.level >= this.maxlevel)
			this.level = 1;
	},

	/**
	 * 展开至指定级数
	 */
	expandToLevel : function(node, tolevel) {
		if (node.getDepth() <= tolevel)
			node.expand();
		for ( var i in node.childNodes)
			this.expandToLevel(node.childNodes[i], tolevel);
	}

})