/**
 * merge level=30
 * 
 */
Ext.define('app.report.selectfields.CanSelectedFieldsTreeStore', {
			extend : 'Ext.data.TreeStore',

			autoLoad : false,
			selectedValues : [], // 已经选中的值

			proxy : {
				type : 'ajax',
				url : 'report/fetchmodulefields.do',
				extraParams : {}
			},

			listeners : {

				load : function(store, records, successful) {

					for (var i in records) {
						var node = records[i];    //.childNodes[i]
						node.data.expanded = true;
						node.cascadeBy(function(e) {
							e.data.checked = false;
							e.data.cls = getTypeClass(e.raw.tooltip); // 用tooltip 代替
								// fieldType
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