/**
 * 根据module的数据来生成模块的model
 */
Ext.define('WsCme.model.ModelFactory', {

	requires : [ 'WsCme.model.ApproveBase', 'WsCme.model.ModelFunctionBase' ],

	statics : {
		getModelByModule : function(module) {
			var model = Ext.define('app.model.' + module.tf_moduleName, {
				extend : 'Ext.data.Model',

				mixins : {
					approve : 'WsCme.model.ApproveBase',
					modelbase : 'WsCme.model.ModelFunctionBase'
				},

				proxy : {
					type : 'rest',
					batchActions : true,
					extraParams : {
						moduleName : module.tf_moduleName
					},
					api : {
						// 在这里加rest/是因为在web.xml中
						// <url-pattern>/rest/*</url-pattern>这一句，spring会根据rest
						// 后面的参数去进行匹配
						read : 'rest/module/fetchdata.do',
						update : 'rest/module/update.do',
						create : 'rest/module/create.do',
						destroy : 'rest/module/remove.do'
					},
					actionMethods : {
						create : 'POST',
						read : 'GET',
						update : 'PUT',
						destroy : 'DELETE'
					},
					reader : {
						type : 'json',
						rootProperty : 'records',
						totalProperty : 'totalCount'
					},
					writer : {
						type : 'json',
						writeRecordId : true,
						writeAllFields : false
					// 没有修改过的字段不加入到update和delete的json中去
					},
					listeners : {
						// **做一个统一ajax出错提示的{
						// {
						// "resultCode" : -1 ,
						// "errorMessage" : "请检查与本记录相关联的其他数据是否全部清空！"
						// }

						exception : function(proxy, response, operation) {
							// 将出错信息加到proxy中去，传递到store的sync中显示出错信息，显示后将此属性删除
							proxy.errorInfo = Ext.decode(response.responseText, true);
							// 如果出错信息解析出错，则加入一个缺省的
							if (!proxy.errorInfo)
								proxy.errorInfo = {
									resultCode : -1,
									errorMessage : '未知原因:' + response.responseText
								};
						}
					}

				},
				entityName : module.tf_moduleName,
				module : module,
				idProperty : module.tf_primaryKey,
				nameFields : module.tf_nameFields,
				titleTpl : module.tf_titleTpl,
				titleTemplate : null,
				fields : this.getFields(module)
			});
			module.tablefields = this.getFields(module); // 所有的表的字段，在treeModel中，会加入其他字段
			return model;
		},
		// String("String"), Boolean("Boolean"), Integer("Integer"),
		// Date("Date"), Double("Double"), Float("Float"); Percent

		getFields : function(module) {
			var fields = [];

			if (module.tf_hasAttachment) {
				fields.push({
					name : 'tf_attachmentCount',
					title : '附件张数',
					persist : false,
					type : 'int'
				});
				fields.push({
					name : 'tf_attachmentTooltip',
					title : '所有附件名称列表',
					persist : false,
					type : 'string'
				});
			
			}
			for ( var i in module.tf_fields) {
				var fd = module.tf_fields[i];

				if (fd.manyToOne || fd.oneToOne) { // 如果是manytoone ,one to one
					// 的字段，加入id 和 name
					fields.push({
						name : fd.manytoone_IdName,
						// title : fd.tf_title+ "序号",
						useNull : true,
						type : 'string',
						serialize : this.convertToNull
					});

					fields.push({
						name : fd.manytoone_TitleName,
						title : fd.tf_title,
						persist : false, // 此字段不会被提交到insert,update中
						type : 'string'
					});

				} else {
					var field = {
						name : fd.tf_fieldName,
						title : fd.tf_title,
						type : this.getTypeByStr(fd.tf_fieldType)
					};
					if (field.type == 'string') {
						field.useNull = true;
						field.serialize = this.convertToNull;
					}
					;
					if (fd.tf_fieldType == 'Image')	//如果不加这句的话,无图像的字段在model中没有
						field.convert = function(value) {
							if (typeof value == 'undefined')
								return null;
							else
								return value;
						}
				}
				if (fd.tf_fieldType == 'Date') {
					field.dateWriteFormat = 'Y-m-d';
					field.dateReadFormat = 'Y-m-d';
				}
				if (fd.tf_fieldType == 'Datetime')
					field.dateReadFormat = 'Y-m-d H:i:s';
				field.tf_haveAttachment = fd.tf_haveAttachment;
				fields.push(field);
			}
			// 如果有附加字段的，加入附加字段

			for ( var i in module.tf_moduleAdditionFields) {
				var fd = module.tf_moduleAdditionFields[i];
				var field = {
					name : fd.tf_fieldName,
					title : fd.tf_title,
					type : this.getTypeByStr(fd.tf_fieldType),
					persist : false
				};
				fields.push(field);
			}
			// Ext.log({
			// msg : fields
			// });
			return fields;
		},

		getTypeByStr : function(str) {
			switch (str) {
			case 'String':
				return 'string';
			case 'Boolean':
				return 'boolean';
			case 'Integer':
				return 'int';
			case 'Date':
				return 'date';
			case 'Datetime':
				return 'date';
			case 'Double':
			case 'Float':
			case 'Percent':
			case 'Money':
				return 'float';
			case 'Blob':
				return 'auto';
			case 'Image':
				return 'auto';
			default:
				return 'string';
			}
		},

		// 如果是空字符串，返回null
		convertToNull : function(v) {
			return v ? v : null;
		}

	}

});
