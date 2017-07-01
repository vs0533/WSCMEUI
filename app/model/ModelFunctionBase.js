/**
 * model 的某些可操作的判断，也可以加入用户自定义的函数在此处
 */
Ext.define('WsCme.model.ModelFunctionBase', {
			extend : 'Ext.Mixin',

			getTitleTpl : function() {
				if (!this.titleTemplate) {
					if (this.titleTpl)
						this.titleTemplate = new Ext.Template(this.titleTpl);
					else
						this.titleTemplate = new Ext.Template('{' + this.nameFields + '}');
				}
				return this.titleTemplate.apply(this.getData());
			},

			// 取得主键值
			getIdValue : function() {
				return this.get(this.idProperty);
			},

			// 取得当前记录的名字字段
			getNameValue : function() {
				if (this.nameFields)
					return this.get(this.nameFields);
				else
					return null;
			},

			// 此条记录是否可以修改
			canEdit : function() {
				if (this.module.tf_hasAuditing && this.get('tf_auditinged'))
					return false;
				if (this.module.tf_hasApprove && this.get('tf_shNowCount') > 0)
					return false;
				return true;
			},

			// 此条记录是否可以进行操作
			canOperate : function() {
				if (this.module.tf_hasAuditing && this.get('tf_auditinged'))
					return false;
				return true;
			},

			// 此条记录是否可以删除
			canDelete : function() {
				if (this.module.tf_hasAuditing && this.get('tf_auditinged'))
					return {
						canDelete : false,
						message : '【' + this.getTitleTpl() + '】已进行过审核，不允许进行删除操作!'
					};
				if (this.module.tf_hasApprove && this.get('tf_shNowCount') > 0)
					return {
						canDelete : false,
						message : '【' + this.getTitleTpl() + '】正在审批或已经审批完成,不允许进行删除操作!'
					};
				return true;
			}

		});
