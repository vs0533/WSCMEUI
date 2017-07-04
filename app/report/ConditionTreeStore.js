/**
 * merge level=30
 * 
 * 综合查询 各个模块，或字段值选择条件时的 的treeStore,传送参数数据去取得grid
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
Ext.define('app.report.ConditionTreeStore', {
			extend : 'Ext.data.TreeStore',

			autoLoad : true,

			constructor : function() {

				this.proxy = {
					type : 'ajax',
					url : 'report/fetchmoduleconitiontree.do',
					extraParams : arguments[0]
				};
				this.callParent(arguments);

			},

			listeners : {

				load : function(store, records, successful) {
					var v = store.ownerTree.selectedValues;
					if (typeof store.ownerTree.selectedValues == 'string')
						var v = store.ownerTree.selectedValues.split(',');
					for (var i in records) {
						var node = records[i];
						node.cascadeBy(function(e) {
									// 如果当前node 的id 已经选中了，那么就要打勾
									if (v.indexOf(e.data.fieldvalue) != -1) {
										e.data.checked = true;
										store.setChildChecked(e,true);
									}
								});
					};

					// 如果上层的打勾了，那么所有的子node 也要打勾

					for (var i in records) {
						var node = records[i];
						node.cascadeBy(function(e) {
									if (e.data.checked)

										// 如果当前node 的id 已经选中了，那么就要打勾
										if (v.indexOf(e.data.fieldvalue) != -1) {
											e.data.checked = true;
										}
								});
					};

				}
			},

			setChildChecked : function(node, checked) {
				if (node.hasChildNodes()) {
					node.eachChild(function(child) {
								setChildChecked(child, checked);
							});
				}
			}

		});