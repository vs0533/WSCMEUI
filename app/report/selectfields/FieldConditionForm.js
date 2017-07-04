/**
 * merge level=30
 * 
 * 选择的字段可以附加一些条件，在此设置条件
 * 
 */

Ext.define('app.report.selectfields.FieldConditionForm', {
			extend : 'Ext.form.Panel',
			alias : 'widget.fieldconditionform',

			defaultType : 'textfield',
			bodyPadding : 5,
			fieldDefaults : {
				labelWidth : 45,
				labelAlign : 'right',
				margin : '0 0 2 0'
			},
			tools : [{
						type : 'refresh',
						tooltip : '清除当前条件'
					}],
			selectedNode : null,
			initComponent : function() {
				this.items = [{
							xtype : 'fieldcontainer',
							layout : 'hbox',
							defaultType : 'textfield',
							fieldDefaults : {
								labelWidth : 20,
								labelAlign : 'right',
								labelSeparator : ' '
							},
							items : [{
										flex : 1,
										fieldLabel : '>',
										padding : '0 5 0 0',
										name : 'morethan'
									}, {
										flex : 1,
										fieldLabel : '<',
										padding : '0 0 0 5',
										name : 'lessthan'
									}]

						}, {
							xtype : 'fieldcontainer',
							layout : 'hbox',
							defaultType : 'textfield',
							fieldDefaults : {
								labelWidth : 20,
								labelAlign : 'right',
								labelSeparator : ' '
							},
							items : [{
										flex : 1,
										fieldLabel : '=',
										padding : '0 5 0 0',
										name : 'equals'
									}, {
										flex : 1,
										fieldLabel : '≠',
										padding : '0 0 0 5',
										name : 'notequals'
									}]
						}, {
							fieldLabel : '类似于',
							anchor : '100%',
							name : 'like'
						}, {
							fieldLabel : '列表',
							anchor : '100%',
							name : 'list'
						}, {
							xtype : 'textareafield',
							fieldLabel : '自定义',
							grow : false,
							height : 40,
							anchor : '100%',
							emptyText : '自定义的表达式。"this"代表此字段,例如 this≻=100 and this≺=1000',
							name : 'udf'
						},{
							xtype : 'textareafield',
							fieldLabel : '描述',
							grow : false,
							height : 40,
							anchor : '100%',
							name : 'title'
						}, {

							xtype : 'fieldcontainer',
							layout : 'table',
							columns : 3,
							fieldDefaults : {
								labelWidth : 38
							},
							items : [{
										xtype : 'checkbox',
										name : 'count',
										fieldLabel : '计数'
									}, {
										xtype : 'checkbox',
										name : 'sum',
										fieldLabel : '求和'
									}, {
										xtype : 'checkbox',
										name : 'avg',
										fieldLabel : '平均'
									}, {
										xtype : 'checkbox',
										name : 'max',
										fieldLabel : '最大'
									}, {
										xtype : 'checkbox',
										name : 'min',
										fieldLabel : '最小'
									}]

						}];

				this.callParent(arguments);
			},
			// 选中了selectednode之后，将node 传进来，看看有没有选中的值
			setFieldNode : function(node) {
				this.selectedNode = null;
				this.getForm().resetToNull();
				this.setaFieldCond(node.data.condition);
				this.setAggregate(node.data.aggregate);
				this.selectedNode = node; // 这一句一定要放在最后
				var type = node.data.fieldType.toLowerCase();
				//Boolean , Date ,Datetime ,Double ,Float ,Integer ,String
				var form = this.getForm();
				form.findField('sum').disable();
				form.findField('avg').disable();
				form.findField('max').enable();
				form.findField('min').enable();
				if (type == 'integer' || type == 'double' || type == 'float') {
					form.findField('sum').enable();
					form.findField('avg').enable();
				} else if (type == 'boolean') {
					form.findField('max').disable();
					form.findField('min').disable();
				} 
			},

			// field 的值改变了
			fieldchange : function(field, newValue, oldValue) {				
				if (this.selectedNode) {
										
					var s = this.genaFieldCond();
					var a = this.getAggregate(); // 聚合字段组成的串如 sum,avg,
					this.selectedNode.set({
								text : this.selectedNode.data.title
										+ ((s || a) ? ' <span class="hascondition">✽</span>'
																				: '')  //+ this.selectedNode.store.treeStore.ownerTree.setIcon1
							});
					this.selectedNode.save();
					if (s)
						this.selectedNode.data.condition = s;
					else
						delete this.selectedNode.data.condition;
					if (a)
						this.selectedNode.data.aggregate = a;
					else
						delete this.selectedNode.data.aggregate;
				}
			},

			genacond : function(f, v) {
				if (v == null || v == '')
					return '';
				else
					return ':' + f + ':' + v + '|';
			},
			getav : function(s, k) {
				var pos = s.indexOf(':' + k + ':');
				if (pos == -1)
					return null;
				var pos1 = s.indexOf('|', pos + 1);
				if (pos1 == -1)
					return null;
				return s.substring(pos + (':' + k + ':').length, pos1);
			},
			setaFieldCond : function(cond) {
				var form = this.getForm();
				if (cond == null || cond == '')
					return;
				form.findField('morethan').setValue(this.getav(cond, '>'));
				form.findField('lessthan').setValue(this.getav(cond, '<'));
				form.findField('equals').setValue(this.getav(cond, '='));
				form.findField('notequals').setValue(this.getav(cond, '!='));
				form.findField('like').setValue(this.getav(cond, 'like'));
				form.findField('list').setValue(this.getav(cond, 'list'));
				form.findField('udf').setValue(this.getav(cond, 'udf'));
				form.findField('title').setValue(this.getav(cond, 'title'));

			},
			genaFieldCond : function() {
				var s = '';
				var form = this.getForm();
				s = s + this.genacond('>', form.findField('morethan').getValue());
				s = s + this.genacond('<', form.findField('lessthan').getValue());
				s = s + this.genacond('=', form.findField('equals').getValue());
				s = s + this.genacond('!=', form.findField('notequals').getValue());
				s = s + this.genacond('like', form.findField('like').getValue());
				s = s + this.genacond('list', form.findField('list').getValue());
				s = s + this.genacond('udf', form.findField('udf').getValue());
				s = s + this.genacond('title', form.findField('title').getValue());
				return s;
			},

			setAggregate : function(aggreateStr) {
				if (!aggreateStr)
					aggreateStr = '';
				var form = this.getForm();
				form.findField('count').setValue(aggreateStr.indexOf('count') >= 0);
				form.findField('sum').setValue(aggreateStr.indexOf('sum') >= 0);
				form.findField('avg').setValue(aggreateStr.indexOf('avg') >= 0);
				form.findField('max').setValue(aggreateStr.indexOf('max') >= 0);
				form.findField('min').setValue(aggreateStr.indexOf('min') >= 0);
			},

			getAggregate : function() {
				var form = this.getForm();
				var result = (form.findField('count').getValue() ? 'count,' : '')
						+ (form.findField('sum').getValue() ? 'sum,' : '')
						+ (form.findField('avg').getValue() ? 'avg,' : '')
						+ (form.findField('max').getValue() ? 'max,' : '')
						+ (form.findField('min').getValue() ? 'min,' : '');
				if (result == '')
					return null;
				else
					return result;
			}
		});