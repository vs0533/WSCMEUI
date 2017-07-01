/**
 * merge level=30
 */
Ext.define('app.module.form.ManyToOneFieldStore', {
			extend : 'Ext.data.Store',

			fields : ['value', 'text'],
			idProperty : 'value',
			autoLoad : true,
			constructor : function() {
				Ext.apply(this, arguments[0]);
//				this.proxy = {
//					type : 'ajax',
//					extraParams : {
//						moduleName : this.moduleName
//					},
//					url : 'module/getModuleComboData.do',
//					reader : {
//						type : 'json'
//					}
//				};

				//this.callParent(arguments);
			}

		});