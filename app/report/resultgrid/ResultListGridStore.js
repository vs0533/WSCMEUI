/**
 * merge level=30
 * 
 * 
 */

Ext.define('app.report.resultgrid.ResultListGridStore', {
	extend : 'Ext.data.Store',

	remoteSort : true,
	autoLoad : true,
	autoSync : false,

	extraParams : {},
	navigates : [],

	constructor : function(param) {

		this.grid = param.grid;
		this.module = param.module;
		this.groupAndFields = param.groupAndFields;
		this.pageSize = app.viewport.getViewModel().get('pageSize');

		if (this.grid.mainReport.getIsLiveGrid()) {
			// live grid 加上以下几行
			this.remoteGroup = true;
			this.buffered = true;
			this.leadingBufferZone = 200;
			this.pageSize = 100;
		}
		this.callParent(arguments);

	},

	listeners : {
		// 调用proxy进行ajax的时候，将参数加进 store.proxy中，在调用完成后，删除掉所有的extraParams参数
		// 这样model.proxy就可以多store，互相不干扰了
		beforeprefetch : function(store) {
			for (var i in store.extraParams)
				store.proxy.extraParams[i] = store.extraParams[i];
		},
		// buffered = true ,执行的是 prefetch
		prefetch : function(store, records, successful) {
			for (var i in store.extraParams)
				delete store.proxy.extraParams[i];
		},

		// buffered = false ,执行的是 load
		beforeload : function(store) {
			var report = this.grid.mainReport;
			var conditionList = report.down('conditionlistgrid');
			store.proxy.extraParams['groupFields'] = Ext.encode(report
					.getGroupFields());
			store.proxy.extraParams['groupShowDetail'] = report.getGroupShowDetail();
			var conditions = [];
			conditionList.getStore().each(function(record) {
						conditions.push({
									type : record.get('type'),
									conditionId : record.get('conditionId'),
									values : record.get('se_values')
								});
					});
			store.proxy.extraParams['moduleConditions'] = Ext.encode(conditions);
			store.proxy.extraParams['selectedFields'] = Ext.encode(report
					.changeGroupAndFieldsToMin(report.getSelectdGroupAndFields()));

			store.proxy.extraParams['reportGroupId'] = report.reportGroup.reportGroupId;
			store.proxy.extraParams['reportId'] = report.getReportId();
			store.proxy.extraParams['baseModuleName'] = report.getBaseModuleName(); // 当前选中的基准模块
			store.proxy.extraParams['isShowTotal'] = report.getIsShowTotal(); // 是否要显示总计行

		},

		load : function(store, records) {
			if (store.data.length > 0)
				store.grid.columnsAutoSize();
		}
	}
});
