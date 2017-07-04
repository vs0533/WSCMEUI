/**
 * merge level=21
 * 
 * 综合查询的主控界面
 * 
 */

Ext.define('app.report.widget.YearMonthSelectMenu', {
	extend : 'Ext.menu.Menu',
	alias : 'widget.yearmonthselectmenu',

	initComponent : function() {
		var thisyear = new Date().getFullYear();
		var thismonth = new Date().getMonth() + 1;
		var thisday = new Date().getDate();
		var thisquarter = parseInt((new Date().getMonth()) / 3) + 1;
		this.style = {
			overflow : 'visible'
		};
		this.items = [{
					text : '所有年度',
					dateType : 'all'
				}, '-', {
					text : '当前年度',
					dateType : 'thisyear',
					year : thisyear,
					icon : 'images/button/calendar.png'
				}, {
					text : '当前季度',
					year : thisyear,
					quarter : thisquarter,
					dateType : 'thisquarter'
				}, {
					text : '当前月份',
					year : thisyear,
					month : thismonth,
					dateType : 'thismonth'
				}, {
					text : '当前日期',
					year : thisyear,
					month : thismonth,
					day : thisday,
					dateType : 'thisday'
				}, '-', {
					xtype : 'menuitem',
					text : '指定年度',
					menu : [{
								xtype : 'menuitem',
								text : '年度区间',
								menu : [{
											xtype : 'form',
											itemId : 'yearsection',
											border : true,
											// frame : true,
											width : 190,
											bodyStyle : 'padding : 8px',
											items : [{
														xtype : 'fieldcontainer',
														layout : 'hbox',
														items : [{
																	xtype : 'checkbox',
																	margin : '0 10 0 0',
																	name : '_enablefirst',
																	value : true
																}, {
																	labelWidth : 60,
																	xtype : 'numberfield',
																	name : 'firstyear',
																	value : thisyear,
																	editable : false,
																	minValue : 1900,
																	maxValue : 2999,
																	incrementValue : 1,
																	width : 130,
																	fieldLabel : '起始年度'
																}]
													}, {
														xtype : 'fieldcontainer',
														layout : 'hbox',
														items : [{
																	xtype : 'checkbox',
																	margin : '0 10 0 0',
																	name : '_enablelast',
																	value : true
																}, {
																	labelWidth : 60,
																	xtype : 'numberfield',
																	name : 'lastyear',
																	value : thisyear,
																	editable : false,
																	minValue : 1900,
																	maxValue : 2999,
																	incrementValue : 1,
																	width : 130,
																	fieldLabel : '终止年度'
																}]
													}, {
														margin : '5 5 0 80',
														xtype : 'button',
														text : '确 定'
													}]
										}]
							}, '-'],
					listeners : {
						render : function(e) {
							var y = new Date().getFullYear();
							for (var i = y + 2; i > y - 10; i--) {
								e.menu.add({
											text : i + ' ' + '年' + (i == y ? ' (今年)' : ''),
											year : i,
											dateType : 'year'
										})
							}
						}
					}
				}, {
					xtype : 'menuitem',
					text : '年度季度',
					menu : [{

								xtype : 'menuitem',
								text : '季度区间',
								menu : [{
											xtype : 'form',
											itemId : 'quartersection',
											border : true,
											width : 300,
											bodyStyle : 'padding : 8px',
											items : [{
														xtype : 'fieldcontainer',
														layout : 'column',
														items : [{
																	xtype : 'checkbox',
																	margin : '0 10 0 0',
																	name : '_enablefirst',
																	columnWidth : 0.1,
																	value : true
																}, {
																	labelWidth : 60,
																	xtype : 'numberfield',
																	name : 'firstyear',
																	editable : false,
																	value : thisyear,
																	minValue : 1900,
																	maxValue : 2999,
																	incrementValue : 1,
																	columnWidth : 0.50,
																	fieldLabel : '起始年度',
																	labelAlign : 'right'
																}, {
																	labelWidth : 60,
																	xtype : 'numberfield',
																	editable : false,
																	name : 'firstquarter',
																	value : thisquarter,
																	minValue : 1,
																	maxValue : 4,
																	incrementValue : 1,
																	columnWidth : 0.40,
																	fieldLabel : '季度',
																	labelAlign : 'right'
																}]
													}, {
														xtype : 'fieldcontainer',
														layout : 'column',
														items : [{
																	xtype : 'checkbox',
																	margin : '0 10 0 0',
																	name : '_enablelast',
																	columnWidth : 0.1,
																	value : true
																}, {
																	labelWidth : 60,
																	xtype : 'numberfield',
																	editable : false,
																	name : 'lastyear',
																	value : thisyear,
																	minValue : 1900,
																	maxValue : 2999,
																	incrementValue : 1,
																	columnWidth : 0.5,
																	fieldLabel : '终止年度',
																	labelAlign : 'right'
																}, {
																	labelWidth : 60,
																	xtype : 'numberfield',
																	name : 'lastquarter',
																	editable : false,
																	value : thisquarter,
																	minValue : 1,
																	maxValue : 4,
																	incrementValue : 1,
																	columnWidth : 0.4,
																	fieldLabel : '季度',
																	labelAlign : 'right'
																}]
													}, {
														margin : '5 5 0 150',
														xtype : 'button',
														text : '确 定'
													}]
										}]

							}, '-'],
					listeners : {
						render : function(e) {
							var y = thisyear;
							for (var i = y + 2; i > y - 10; i--) {
								var quarters = [];
								for (var m = 1; m <= 4; m++) {
									quarters.push({
												text : m + ' 季度'
														+ (i == y && m == thisquarter ? ' (当季)' : ''),
												dateType : 'yearquarter',
												year : i,
												quarter : m
											})
								}
								e.menu.add({
											text : i + ' ' + '年' + (i == y ? ' (今年)' : ''),
											year : i,
											menu : quarters
										})
							}
						}
					}

				}, {
					xtype : 'menuitem',
					text : '年度月份',
					menu : [{
								xtype : 'menuitem',
								text : '月份区间',
								menu : [{
											xtype : 'form',
											itemId : 'monthsection',
											border : true,
											width : 300,
											bodyStyle : 'padding : 8px',
											items : [{
														xtype : 'fieldcontainer',
														layout : 'column',
														items : [{
																	xtype : 'checkbox',
																	margin : '0 10 0 0',
																	name : '_enablefirst',
																	columnWidth : 0.1,
																	value : true
																}, {
																	labelWidth : 60,
																	xtype : 'numberfield',
																	name : 'firstyear',
																	editable : false,
																	value : thisyear,
																	minValue : 1900,
																	maxValue : 2999,
																	incrementValue : 1,
																	columnWidth : 0.5,
																	fieldLabel : '起始年度',
																	labelAlign : 'right'
																}, {
																	labelWidth : 60,
																	xtype : 'numberfield',
																	name : 'firstmonth',
																	value : thismonth,
																	editable : false,
																	minValue : 1,
																	maxValue : 12,
																	incrementValue : 1,
																	columnWidth : 0.4,
																	fieldLabel : '月份',
																	labelAlign : 'right'
																}]
													}, {
														xtype : 'fieldcontainer',
														layout : 'column',
														items : [{
																	xtype : 'checkbox',
																	margin : '0 10 0 0',
																	name : '_enablelast',
																	columnWidth : 0.1,
																	value : true
																}, {
																	labelWidth : 60,
																	xtype : 'numberfield',
																	name : 'lastyear',
																	editable : false,
																	value : thisyear,
																	minValue : 1900,
																	maxValue : 2999,
																	incrementValue : 1,
																	columnWidth : 0.5,
																	fieldLabel : '终止年度',
																	labelAlign : 'right'
																}, {
																	labelWidth : 60,
																	xtype : 'numberfield',
																	name : 'lastmonth',
																	editable : false,
																	value : thismonth,
																	minValue : 1,
																	maxValue : 12,
																	incrementValue : 1,
																	columnWidth : 0.4,
																	fieldLabel : '月份',
																	labelAlign : 'right'
																}]
													}, {
														margin : '5 5 0 150',
														xtype : 'button',
														text : '确 定'
													}]
										}]
							}, '-'],
					listeners : {
						render : function(e) {
							var y = thisyear;
							for (var i = y + 2; i > y - 10; i--) {
								var months = [];
								for (var m = 1; m <= 12; m++) {
									months.push({
										text : m + ' 月' + (i == y && m == thismonth ? ' (当月)' : ''),
										dateType : 'yearmonth',
										year : i,
										month : m
									})
								}
								e.menu.add({
											text : i + ' ' + '年' + (i == y ? ' (今年)' : ''),
											year : i,
											menu : months
										})
							}
						}
					}
				}, {
					text : '选择日期',

					menu : [{
								text : '指定日期',
								menu : {
									xtype : 'datemenu'
								}

							}, {
								text : '日期期间',
								menu : [{
											xtype : 'form',
											itemId : 'datesection',
											border : true,
											width : 235,
											bodyStyle : 'padding : 8px',
											items : [{
														xtype : 'fieldcontainer',
														layout : 'hbox',
														items : [{
																	xtype : 'checkbox',
																	margin : '0 10 0 0',
																	name : '_enablefirst',
																	value : true
																}, {
																	labelWidth : 60,
																	xtype : 'datefield',
																	name : 'firstdate',
																	value : new Date(),
																	format : 'Y-m-d',
																	submitFormat : 'Y-m-d',
																	width : 180,
																	fieldLabel : '起始日期'
																}]
													}, {
														xtype : 'fieldcontainer',
														layout : 'hbox',
														items : [{
																	xtype : 'checkbox',
																	margin : '0 10 0 0',
																	name : '_enablelast',
																	value : true
																}, {
																	labelWidth : 60,
																	xtype : 'datefield',
																	name : 'lastdate',
																	value : new Date(),
																	format : 'Y-m-d',
																	submitFormat : 'Y-m-d',
																	width : 180,
																	fieldLabel : '终止日期'
																}]
													}, {
														margin : '5 5 0 80',
														xtype : 'button',
														text : '确 定'
													}]
										}]
							}]

				}]

		this.callParent(arguments);
	}
})