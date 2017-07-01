/**
 * merge level=30
 * 
 * grid导航树的treeStore,传送参数数据去取得grid
 * 
 * extraParams
 * 
 * moduleName :当前模块名称
 * 
 * cascading :是否层叠属性，如果为false,属性全部平级显示
 * 
 * isContainNullRecord :包括没有记录的属性
 * 
 * title :属性title
 * 
 * navigatePath :属性路径param1--param2
 * 
 * isBaseField : 是否是基本字段
 * 
 * 还要加入当前模块的父模块的限定值
 * 
 */
Ext.define('WsCme.module.navigate.NavigateTreeStore', {
			extend : 'Ext.data.TreeStore',

			autoLoad : true,

			allowAppend : true, // 在load过后不允许拖动进来的grid append;

			rootVisible : true,
			
			listeners : {

				beforeinsert : function(store, node) {
					// 当grid的记录拖动进来以后，不执行增加操作
					return this.allowAppend;
				},

				beforeappend : function(store, node) {
					// 当grid的记录拖动进来以后，不执行增加操作
					return this.allowAppend;
				},

				beforeload : function(store) {
					// 允许load的数据和root append 操作
					this.allowAppend = true;
				},

				load : function(store, records, successful) {
					if (records && records[0])
						this.addCountToItemText(records[0]);
					this.allowAppend = false;
				}
			},

			/**
			 * 如果一个item下面有记录，就将此数字加到text中显示出来
			 */
			addCountToItemText : function(node) {
				// 把没有图标的module 的在导航中值的图标删掉
				var m = app.modules.getModuleInfo(node.raw.moduleName);
				if (!(m && m.iconURL))
					node.data.icon = null;

				if (node.raw.count)
					node.data.text = node.raw.text
							+ '<span class="navigateTreeItem"><em>(' + node.raw.count
							+ ')</em></span>';
				for (var i in node.childNodes)
					this.addCountToItemText(node.childNodes[i]);
			}

		});