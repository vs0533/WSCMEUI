/**
 * merge level=30
 * 
 * 
 */
Ext.define('app.report.ReportCondition', {
			extend : 'Ext.data.Model',

			fields : [{
						name : 'conditionId', // 查询条件的id ,如果是 moudle , 则为 modulename
						// ,如果是某个字段，则为 field_0001022 字段的id
						// 如果是 选择字段选择中附加的 selectedfield_0011203, 年度月度为 datesection
						type : 'string'
					}, {
						name : 'se_modulename',
						type : 'string'
					}, {
						name : 'se_condname',
						type : 'string'
					}, {
						name : 'se_values',
						type : 'string'
					}, {
						name : 'se_texts',
						type : 'string'
					}, {
						name : 'se_displaycond',
						type : 'string'
					}, {
						name : 'se_recordnum',
						type : 'int'
					}, {
						name : 'type', // 是否是来自选中字段的条件。 == module , selectfield ,
						// modulefield , date
						type : 'string'
					}]

		});

Ext.define('app.report.ConditionListGridStore', {
			extend : 'Ext.data.Store',

			model : 'app.report.ReportCondition',

			autoLoad : true,

			listeners : {
				load : function(store) {
					// console.log('Condition store load ');
					var deleted = [];
					store.each(function(record) {
								if (record.get('type') != 'module'
										&& record.get('type') != 'modulefield')
									deleted.push(record);
							});
					// 不是模块选择的数据信息全部删除掉
					store.remove(deleted);
					store.sync();
					store.each(function(record) {
								var conditionButton = store.grid.up('panel')
										.down('conditionselectbutton[conditionId='
												+ record.get('conditionId') + ']');
								conditionButton.updateTextNumber(record.get('se_values')
										.split(',').length);
							});
				}
			},

			constructor : function(reportGroup, grid) {
				this.grid = grid;

				this.callParent(arguments);
			}

		});
