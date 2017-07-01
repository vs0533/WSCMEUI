/**
 *   merge level=30
 */
Ext.define('app.module.form.ManyToOneFieldTreeStore', {
			extend : 'Ext.data.TreeStore',

			fields : ['value', 'text', {
						name : 'disabled',
						type : 'bool',
						defaultValue : false
					}],
			//root : {},
			constructor : function() {
				Ext.apply(this, arguments[0]);
				this.proxy11 = {
					type : 'ajax',
					extraParams : {
						moduleName : this.moduleName,
						allowParentValue : this.allowParentValue
					},
					url : 'module/getModuleTreeData.do',
					reader : {
						type : 'json'
					}
				};

				//this.callParent(arguments);
			},
			autoLoad : true

		});