/**
 * merge level=10
 * 
 * 查询窗口中用于选择基准模块默认日期区间的按钮
 */
Ext.define('WsCme.report.widget.DateSelectButton', {
			extend : 'Ext.button.Button',
			alias : 'widget.dateselectbutton',

			config : {
				dateSection : null
			},

			aheadText : '查询期间：',

			initComponent : function() {
				this.text = this.aheadText + '所有年度', this.menu = {
					xtype : 'yearmonthselectmenu',
					target : this
				}
				this.callParent(arguments);
			},

			setButtonText : function(text) {
					this.setText(this.aheadText + text) ;
			},
			
			listeners : {
				dateSectionChanged : function(button, dateSection) {
					button.setDateSection(dateSection);
					button.setText(button.aheadText + dateSection.text);
					var mainreport = this.up('mainreport');
					mainreport.fireEvent('dateSectionChanged', mainreport, dateSection);
				}
			}

		})