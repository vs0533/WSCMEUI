/**
 * merge level=25
 */
Ext.define('WsCme.module.widget.GridGroupCombo', {

			extend : 'Ext.form.field.ComboBox',
			alias : 'widget.gridgroupcombo',

			fieldLabel : '分组',
			editable : false,
			labelWidth : 40,
			labelAlign : 'right',
			width : 160,
			queryMode : 'local',
			displayField : 'title',
			valueField : 'id',

			initComponent : function() {

				var group = [];
				group.push({
							id : 'none',
							title : '取消分组'
						});
//				if (this.modulePanel.module.tf_gridSchemes[0].tf_otherSetting) {
//
//					var gridGroup = {}
//					try {
//						eval('Ext.apply(gridGroup,' + '{'
//								+ this.modulePanel.module.tf_gridSchemes[0].tf_otherSetting
//								+ '})');
//					} catch (err) {
//					}
//					if (gridGroup.gridGroup) {
//						Ext.each(gridGroup.gridGroup, function(g) {
//									group.push(g);
//								})
//					}
//				}

				for (var i in this.modulePanel.module.tf_fields) {
					var field = this.modulePanel.module.tf_fields[i];

					if (field.g)            //tf_allowGroup
						group.push({
									id : field.manytoone_IdName
											? field.manytoone_TitleName
											: field.tf_fieldName,
									title : field.tf_title
								})
				};

				this.store = Ext.create('Ext.data.Store', {
							fields : ['id', 'title'],
							data : group
						});
				if (group.length > 0)
					this.value = group[0].id;

				if (group.length == 1)
					this.hidden = true;

				this.callParent(arguments);
			}
		});