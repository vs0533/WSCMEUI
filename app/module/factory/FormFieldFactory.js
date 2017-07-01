/**
 * merge level=30
 */

Ext.define('WsCme.module.factory.FormFieldFactory', {
	requires : [ 'WsCme.lib.ToggleSlide', 'WsCme.lib.MoneyField',
			'WsCme.lib.datetime.DateTimeField', 'WsCme.ux.OwnTreePicker',
			'WsCme.module.widget.field.ImageField',
			'WsCme.module.widget.field.ImageFieldContainer', 'WsCme.ux.TriggerClear',
			'WsCme.ux.iconcls.Field' ],

	statics : {
		labelDefaultWidth : Ext.themeName === 'neptune' ? 98 : 92,
		dateDefaultWidth : 16 * 8, // 14 * 8,
		integerDefaultWidth : 16 * 8,// 10 * 8,
		moneyDefaultWidth : 16 * 8,// 14 * 8,
		/**
		 * 根据module定义,formField的定义,formtype来返回一个field的定义
		 */
		getField : function(fieldDefine, formField, formtype, module) {
			// console.log('form字段：' + fieldDefine.tf_fieldName + ","
			// + fieldDefine.tf_title + ',' + formtype);
			var field = {
				name : fieldDefine.tf_fieldName,
				fieldLabel : formField.fieldLabel
						|| (formField.labelAhead ? formField.labelAhead : '')
						+ fieldDefine.tf_title.replace(new RegExp('--', 'gm'), ''),
				labelAlign : formField.labelAlign || 'right',
				labelWidth : formField.labelWidth || this.labelDefaultWidth,
				behindText : formField.behindText || fieldDefine.behindText
			};
			if (field.behindText && field.behindText == ' ')
				delete field.behindText;
			if (module && module.tf_formSchemes[0].labelWidth)
				field.labelWidth = module.tf_formSchemes[0].labelWidth;
			if (formField.labelWidth)
				field.labelWidth = formField.labelWidth;
			if (formField.hideLabel)
				field.hideLabel = true;
			// 如果是隐藏字段
			if (this.getIsHidden(fieldDefine, formField)) {
				Ext.apply(field, {
					xtype : 'hiddenfield'
				});
				return field;
			}

			// 如果是显示form,字段是只读或disabled则设置readonly为true
			if (formtype == 'display'
					|| (formtype == 'new' && fieldDefine.tf_allowNew == false)
					|| (formtype == 'edit' && fieldDefine.tf_allowEdit == false)
					|| fieldDefine.tf_isDisable) {
				field.readOnly = true;
			}
			// 如果是直接的父模块字段，则用下拉框，如果是分层显示的，那么就显示treePicker,还要判断是否只能选择末级数据
			// ，或者是下拉的grid,暂未做好
			if (fieldDefine.manytoone_TitleName) {

				var pmodule = app.modules.getModuleInfo(fieldDefine.tf_fieldType);
				var icon = '';
				if (pmodule && pmodule.iconURL)
					icon = '<img src="' + pmodule.iconURL + '" />';

				if (field.readOnly && formtype != 'new') { // 如果是只读字段，对于manyto one
					// 字段，放一个 text
					// 字段，直接显示manytoonetitle就行了
					Ext.apply(field, {
						fieldLabel : '<span class="gridheadicon" >' + icon
								+ fieldDefine.tf_title + '</span>',
						name : fieldDefine.manytoone_TitleName,
						moduleName : fieldDefine.tf_fieldType,
						xtype : 'textfield',
						idName : fieldDefine.manytoone_IdName
					});
				} else {
					Ext.apply(field, {
						fieldLabel : '<span class="gridheadicon" >' + icon
								+ fieldDefine.tf_title + '</span>',
						name : fieldDefine.manytoone_IdName,
						moduleName : fieldDefine.tf_fieldType,
						displayField : 'text',
						valueField : 'value'
					});

					var pm = app.modules.getModuleInfo(fieldDefine.tf_fieldType);

					// 如果manytoone模块的字段是分级的
					if (pm.tf_codeLevel) {
						var store = Ext.create('Ext.data.TreeStore', {
							autoLoad : true,
							root : {},
							fields : [ 'value', 'text', {
								name : 'disabled',
								type : 'bool',
								defaultValue : false
							} ],
							proxy : {
								type : 'ajax',
								url : 'module/getModuleTreeData.do',
								extraParams : {
									moduleName : fieldDefine.tf_fieldType,
									allowParentValue : fieldDefine.allowParentValue
								}
							// ,
							// reader : {
							// type : 'json'
							// }
							},
							moduleName : fieldDefine.tf_fieldType,
							// 是否可以选中非末级节点
							allowParentValue : fieldDefine.allowParentValue
						});
						Ext.apply(field, {
							xtype : 'owntreepicker',
							forceSelection : true,

							triggers : {
								clear : {
									type : 'clear',
									weight : -1
								}
							},
							editable : false,
							store : store
						});
					} else {
						if (formField.queryMode == 'remote' && field.readOnly != true)
							// 这个没用
							Ext.apply(field, {
								xtype : 'combobox',
								queryMode : 'remote',
								queryParam : 'query',
								triggerAction : 'query',
								// pageWidth : 10, //加了这个就需要处理分页，现在还没有，查询过后，加入所有的
								triggers : {
									clear : {
										type : 'clear',
										weight : -1
									}
								},
								minChars : 2,
								forceSelection : true, // 必须是下拉菜单里有的
								store : Ext.create('Ext.data.Store', {
									fields : [ 'value', 'text' ],
									idProperty : 'value',
									autoLoad : true,
									proxy : {
										type : 'ajax',
										extraParams : {
											moduleName : fieldDefine.tf_fieldType
										},
										url : 'module/getModuleComboData.do',
										reader : {
											type : 'json'
										}
									},
									moduleName : fieldDefine.tf_fieldType
								})
							});
						else
							Ext.apply(field, {
								xtype : 'combobox',
								queryMode : 'local',
								queryParam : 'query',
								triggerAction : 'all',
								editable : false,
								triggers : {
									clear : {
										type : 'clear',
										weight : -1
									}
								},
								minChars : 2,
								// forceSelection : true, //必须是下拉菜单里有的
								store : Ext.create('Ext.data.Store', {
									fields : [ 'value', 'text' ],
									idProperty : 'value',
									autoLoad : true,
									proxy : {
										type : 'ajax',
										extraParams : {
											moduleName : fieldDefine.tf_fieldType
										},
										url : 'module/getModuleComboData.do',
										reader : {
											type : 'json'
										}
									},
									moduleName : fieldDefine.tf_fieldType
								})
							});
					}
				}
			}
			;
			Ext.apply(field, this.getFieldXType(fieldDefine, field));

			if (field.name == 'tf_iconCls') {
				field.xtype = 'iconclsfield';
				field.triggers = {
					clear : {
						type : 'clear',
						weight : -1
					}
				}
			}
			if (formField.tf_width == -1) {
				delete field.width;
				field.anchor = '100%';
			}

			// 是否是必添字段
			if (fieldDefine.tf_isRequired)
				Ext.apply(field, {
					allowBlank : false
				});

			// 是否是一个模块的namefield,如果是，修改过后，需要修改title
			if (module.tf_nameFields == fieldDefine.tf_fieldName) {
				Ext.apply(field, {
					namefield : true,
					fieldLabel : '<strong>' + fieldDefine.tf_title + '</strong>'
				});
			}

			// 在字段的附加设置里面是否有关于formfield的设置，如果有，加进来
			if (fieldDefine.tf_otherSetting) {
				var otherSetting = Ext.decode('{' + fieldDefine.tf_otherSetting + '}',
						true);
				if (otherSetting && otherSetting.formfield)
					Ext.apply(field, otherSetting.formfield);
			}

			// 可以下拉框选择模块中的所有数据，并可以修改
			if (field.comboThisField && !field.readOnly) {
				Ext.apply(field, {
					xtype : 'combobox',
					queryMode : 'local',
					queryParam : 'query',
					triggerAction : 'all',
					editable : true,
					triggers : {
						clear : {
							type : 'clear',
							weight : -1
						}
					},
					minChars : 2,
					store : Ext.create('Ext.data.Store', {
						autoLoad : true,
						fields : [ 'value', 'text' ],
						idProperty : 'value',

						moduleName : module.tf_moduleName,
						fieldName : fieldDefine.tf_fieldName,
						proxy : {
							type : 'ajax',
							extraParams : {
								moduleName : module.tf_moduleName,
								fieldName : fieldDefine.tf_fieldName
							},
							url : 'module/getModuleFieldComboData.do',
							reader : {
								type : 'json'
							}
						}
					})
				});
			}

			// 如果是附件文件的文件名字段，在新增的时候改换成filefield

			if (formtype == 'new' && module.tf_moduleName == '_Attachment'
					&& fieldDefine.tf_fieldName == 'tf_filename') {
				Ext.apply(field, {
					name : 'file',
					xtype : 'filefield',
					readOnly : false,
					emptyText : '请选择一个小于10M的文件...',
					buttonText : '选择文件'
				});
			}
			// if (field.readOnly == true && field.xtype == 'moneyfield')
			// field.xtype = 'moneydisplayfield';
			// if (field.readOnly == true && !fieldDefine.manytoone_TitleName
			// && fieldDefine.tf_fieldType != 'Boolean'
			// && fieldDefine.tf_fieldType != 'Date') {
			// field.xtype = 'displayfield'
			// switch (fieldDefine.tf_fieldType) {
			// case 'Date' :
			// case 'Datetime' :
			// case 'Boolean' :
			// case 'Integer' :
			// field.fieldStyle = "text-align:right";
			// case 'Double' :
			// field.fieldStyle = "text-align:right";
			// case 'Float' :
			// field.fieldStyle = "text-align:right";
			// case 'Percent' :
			// field.fieldStyle = "text-align:right";
			// }
			// }

			if (field.fieldLabel.indexOf('审批') == 0) {
				var c = field.fieldLabel.charAt(field.fieldLabel.length - 1);
				if (c > '0' && c < '9')
					field.fieldLabel = field.fieldLabel.substring(0,
							field.fieldLabel.length - 1);
			}

			if (field.xtype == 'imagefield') {
				var fieldcontainer = {
					xtype : 'imagefieldcontainer',
					field : field,
					formtype : formtype,
					fieldDefine : fieldDefine,
					formField : formField
				}
				return fieldcontainer;
			}

			return field;
		},

		/**
		 * 判断字段类型
		 */
		getFieldXType : function(fieldDefine, field) {
			// 如果有附加的字段属性设置，即可以下拉框里选择值
			if (fieldDefine.tf_PropertyType) {
				var data = [];
				Ext.each(fieldDefine.tf_PropertyType.tf_value.split(','), function(v) {
					data.push({
						value : v
					});
				});
				return {
					xtype : 'combobox',
					queryMode : 'local',
					queryParam : 'query',
					triggerAction : 'all',
					displayField : 'value',
					// forceSelection : true, // 必须是下拉菜单里有的
					editable : fieldDefine.tf_PropertyType.tf_canInput,
					store : Ext.create('Ext.data.Store', {
						fields : [ 'value' ],
						data : data
					})
				};
			} else

				switch (fieldDefine.tf_fieldType) {
				case 'Date':
					return {
						width : this.dateDefaultWidth + this.labelDefaultWidth,
						format : 'Y-m-d',
						xtype : 'datefield',
						submitFormat : 'Y-m-d'
					};
				case 'Datetime':
					return {
						width : this.dateDefaultWidth + this.labelDefaultWidth,
						format : 'Y-m-d H:i:s',
						xtype : 'datetimefield'
					};
				case 'Boolean':
					return {
						xtype : 'checkboxfield',
						inputValue : 'true'
					};
				case 'Integer':
					return {
						minValue : -9999999999,
						maxValue : 9999999999,
						fieldStyle : "text-align:right",
						width : this.integerDefaultWidth + this.labelDefaultWidth,
						// hideTrigger : true,
						xtype : 'numberfield',
						enableKeyEvents : true,
						listeners : {
							keydown : function(field, e, eOpts) {
								if (e.getKey() == Ext.EventObject.ENTER) {
									var f = field.nextSibling('field[readOnly=false]');
									if (!!f)
										f.focus();
									return false;
								}
							}
						}
					};
				case 'Double':
					return {
						width : this.moneyDefaultWidth + this.labelDefaultWidth,
						hideTrigger : true,
						xtype : 'moneyfield',
						behindText : '元'

					};
				case 'Float':
					return {
						minValue : -9999999999,
						maxValue : 9999999999,
						width : this.moneyDefaultWidth + this.labelDefaultWidth,
						hideTrigger : true,
						xtype : 'moneyfield'
					};
				case 'Percent':
					return {
						width : this.moneyDefaultWidth + this.labelDefaultWidth,
						xtype : 'moneyfield',
						// behindText : '%',
						percent : true
					};
				case 'String':
					var len = fieldDefine.l;
					var sp = Ext.String.startsWith(fieldDefine.tf_title, '审批');
					if (len == 0 || len > 100)
						return {
							maxLength : len == 0 ? Number.MAX_VALUE : len,
							enforceMaxLength : true,
							anchor : '100%',
							grow : !sp,
							growMax : 200,
							growMin : 40,
							xtype : 'textareafield',
							height : sp ? 30 : null
						};
					else {

						var result = {
							maxLength : len,
							enforceMaxLength : true,
							xtype : 'textfield',
							enableKeyEvents : true,
							listeners : {
								keydown : function(field, e, eOpts) {
									if (e.getKey() == Ext.EventObject.ENTER) {
										var f = field.nextSibling('field[readOnly=false]');
										if (!!f)
											f.focus();
										return false;
									}
								}
							}
						}
						if (len > 12)
							result.anchor = '100%';
						else
							result.width = (len + 3) * 8 + this.labelDefaultWidth;

						return result
					}
				case 'Image':
					return {
						xtype : 'imagefield'
					}

				default:
					console.log(fieldDefine.tf_fieldType + '类型没有找到');
				}
		},

		/**
		 * 判断是否是hidden字段
		 */
		getIsHidden : function(fieldDefine, formField) {
			return (fieldDefine.tf_isHidden || formField.tf_isHidden);
		}
	}
});