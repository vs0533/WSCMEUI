/**
 * 对于审批模块的model,需要加入如下的函数
 */

// 下面有app.username  的还没有处理

Ext.define('WsCme.model.ApproveBase', {
	extend : 'Ext.Mixin',
	
	getApproveToolTip : function() {
		var result = '';
		if (this.meCanApprove()) {
			result += this.changeColor('我可以审批此条记录<br/><br/>');
		}
		if (this.get('tf_shResult') == '审批中') {
			result += this.changeColor('正在审批中');
		} else
			result += this.changeColor('审批' + this.get('tf_shResult'));
		result += '<br/><br/>';
		for (var i = 0; i <= 5; i++) {
			if (this.get('tf_shdate' + (i + 1)) != null) {
				result += Ext.String.format('{4}、{0} 的 {1} 于 {2} 进行了审批，审批结果：{3}。<br/>',
						this.module.tf_moduleApproves[i].tf_departmentName, this
								.changeColor(this.get('tf_shname' + (i + 1))), Ext.Date.format(
								this.get('tf_shdate' + (i + 1)), 'Y-m-d'), this
								.changeColor(this.get('tf_shresult' + (i + 1))), i + 1);
			}
		}
		return result;
	},

	changeColor : function(str) {
		return '<span class=\'treeitemimportant\'>' + str + '</span>';
	},

	// 判断是否我可以审批此条记录
	meCanApprove : function() {
		var ur = this.module.tf_userRole;
		if (ur.tf_allowApprove && ur.tf_approveLevel
				&& this.get('tf_shResultDate') == null
				&& this.get('tf_shdate' + ur.tf_approveOrder) == null) {
			for (var i = 0; i < this.module.tf_moduleApproves.length; i++) {
				if (this.module.tf_moduleApproves[i].tf_level < ur.tf_approveLevel) {
					if (this.get('tf_shdate' + (i + 1)) == null)
						return false;
				}
			}
			return true;
		} else
			return false;
	},

	// 判断是否我可以取消审批
	meCanCancelApprove : function() {
		var ur = this.module.tf_userRole;
		if (this.get('tf_shResultDate') == null) {
			if (this.get('tf_shdate' + ur.tf_approveOrder) != null) {
				for (var i = 0; i < this.module.tf_moduleApproves.length; i++) {
					if (this.module.tf_moduleApproves[i].tf_level > ur.tf_approveLevel) {
						if (this.get('tf_shdate' + (i + 1)) != null)
							return false;
					}
				}
				
				// 如果是我审批的，我才能取消
				if (this.get('tf_shname' + this.module.tf_userRole.tf_approveOrder) == app.viewport.getViewModel().get('userInfo.tf_userName'))
					return true;
				else
					return false;
					
			} else
				return false;
		} else {
			// 如果是某个人审批了之后就结束审批流程的
			if (this.get('tf_shResultName') === app.viewport.getViewModel().get('userInfo.tf_userName'))
				return true;
			else
				return false;
		}
	},

	// 判断我是否审批过了
	meApproved : function() {
		if (this.get('tf_shdate' + this.module.tf_userRole.tf_approveOrder))
			return true;
		else
			return false;
	}

});
