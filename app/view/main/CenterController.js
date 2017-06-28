/**
 * 
 * 用来管理center界面里面所有的模块，查询等的tab的创建和维护
 * 
 */
Ext.define('WsCme.view.main.CenterController', {
	extend : 'Ext.Mixin',

	// requires : ['app.view.treeModule.ModuleTreePanel'],

	init : function() {
		console.log('CenterController init......');
	},

	/**
	 * 点击了一个菜单项以后，加入到主区域的tabPanel中
	 */
	addModuleToCenter : function(menuitem) {
		console.log('addModuleToCenter : ' + menuitem.menuType + ','
				+ menuitem.text + ',' + menuitem.moduleName);

		this.lookupReference('openrecenttree').addItem(menuitem);

		var maincenter = this.getView().down('maincenter');
		// 对于设置了reference的控件，可以直接在控制器中使用下面的函数来查找得到。 如果你还是使用getCmp来取得控件的话，那得改改了。
		// var maincenter = this.lookupReference('maincenter');

		if (menuitem.menuType === 'module') {
			this.addModuleToMainRegion(menuitem.moduleName);
		} else if (menuitem.menuType === 'reportGroup')
			this.addReportToMainRegion({
				reportGroupId : menuitem.menuTypeId,
				text : menuitem.text
			});
	},

	/**
	 * 将标准模块加入tabpanel中了，如果已经有了，就转至该tab页 itemId:module_(moduleName)
	 */
	addModuleToMainRegion : function(moduleName) {
		var module = app.modules.getModule(moduleName);
		if (moduleName) {
			var view = this.getView().down('maincenter');
			var tabItemId = 'module_' + moduleName; // tabPanel中的itemId
			var tab = view.down('> panel#' + tabItemId);// 查找当前主区域中是否已经加入了此模块了
			if (!tab) {
				// 如果当前模块没有加入的话，去生成当前模块的控件
				tab = view.add(app.modules.getModule(moduleName).getModulePanel(
						tabItemId));
			}
			view.setActiveTab(tab);
		}
	},

	/**
	 * 在主tabPanel中增加一个综合查询模块
	 */
	addReportToMainRegion : function(reportGroup) {
		if (!reportGroup)
			return;
		var view = this.getView().down('maincenter');
		var tabItemId = 'report_' + reportGroup.reportGroupId + '_tab';
		var tab = view.down('panel#' + tabItemId);
		if (!tab) {
			var m = this.getViewModel().get('reportGroups').get(
					reportGroup.reportGroupId);
			if (!m) {
				var m = Ext.create('app.report.MainReport', {
					reportGroup : reportGroup,
					itemId : tabItemId,
					closable : true
				});
				this.getViewModel().get('reportGroups').add(reportGroup.reportGroupId,
						m);
			}
			tab = view.add(m);
		}
		view.setActiveTab(tab);

	},

	onTabAdd : function(panel, component, index, eOpts) {
		// 如果当前已经打开了最大的tab数，则删除最前面的一个
		if (panel.items.length > this.getView().getViewModel().get('maxOpenTab')) {
			panel.remove(1);
		}
	},

	// 模块是否自动打开
	moduleAutoOpenMenuClick : function(tool) {

		var moduleName = tool.ownerCt.tabPanel.moduleName;
		var reportGroup = tool.ownerCt.tabPanel.reportGroup;
		if (reportGroup)
			moduleName = '__reportGroup::' + reportGroup.reportGroupId + '::'
					+ reportGroup.text;
		if (tool.checked)
			this.addModuleToAutoOpen(moduleName);
		else
			this.deleteModuleToAutoOpen(moduleName)
	},

	// 模块是否自动打开,并定位到
	moduleAutoOpenAndSelectedMenuClick : function(tool) {

		var moduleName = tool.ownerCt.tabPanel.moduleName;
		var reportGroup = tool.ownerCt.tabPanel.reportGroup;
		if (reportGroup)
			moduleName = '__reportGroup::' + reportGroup.reportGroupId + '::'
					+ reportGroup.text;
		if (tool.checked)
			this.addModuleToAutoOpen(moduleName, true);
		else
			this.deleteModuleToAutoOpen(moduleName, true)
	},

	/**
	 * 加入自动打开的模块，这里要用延迟加载，不然有些参数还没有初始化好
	 */
	centerAfterRender : function() {
		Ext.Function.defer(function() {
			this.showAutoOpenModules()
		}, 200, this);
	},

	/**
	 * 打开需要自动打开的模块在center 区域
	 */
	showAutoOpenModules : function() {
		var s = Cookies.get('autoopen', '');
		var modules = s ? s.split(';') : [];

		Ext.each(modules, function(module) {
			this.openAModuleOrReport(module)
		}, this);

		s = Cookies.get('autoopenandselected', '');
		if (s)
			this.openAModuleOrReport(s);

	},

	openAModuleOrReport : function(name) {
		if (name) {
			if (name.startWith('__reportGroup')) {
				var g = name.split('::');
				this.addReportToMainRegion({
					reportGroupId : g[1],
					text : g[2]
				})
			} else
				this.addModuleToMainRegion(name);
		} else {
			console.log('未指定打开模块的moduleName值。');
		}
	},

	isModuleAutoOpen : function(tabPanel) {
		var moduleName = tabPanel.moduleName;
		var reportGroup = tabPanel.reportGroup;
		if (reportGroup)
			moduleName = '__reportGroup::' + reportGroup.reportGroupId + '::'
					+ reportGroup.text;

		var s = Cookies.get('autoopen', '');
		var modules = s ? s.split(';') : [];
		var have = false;
		Ext.each(modules, function(module) {
			if (module == moduleName)
				have = true;
		});
		console.log('判断是否自动打开:' + moduleName + ":" + have);
		return have;
	},

	// 打开并定位到
	isModuleAutoOpenAndSelected : function(tabPanel) {
		var moduleName = tabPanel.moduleName;
		var reportGroup = tabPanel.reportGroup;
		if (reportGroup)
			moduleName = '__reportGroup::' + reportGroup.reportGroupId + '::'
					+ reportGroup.text;
		return moduleName == Cookies.get('autoopenandselected', '');
	},

	// 新增一个模块到自动打开的cookies中去
	addModuleToAutoOpen : function(moduleName, isAutoSelected) {
		console.log('增加自动打开模块:' + moduleName);
		if (isAutoSelected)
			Cookies.set('autoopenandselected', moduleName);
		else {
			var s = Cookies.get('autoopen', '');
			var modules = s ? s.split(';') : [];
			var have = false;
			Ext.each(modules, function(module) {
				if (module == moduleName)
					have = true;
			});
			if (!have) {
				modules.push(moduleName);
				Cookies.set('autoopen', modules.join(';'));
			}
		}
	},

	// 删除一个模块到自动打开的cookies中去
	deleteModuleToAutoOpen : function(moduleName, isAutoSelected) {
		console.log('取消自动打开模块:' + moduleName);
		if (isAutoSelected)
			Cookies.set('autoopenandselected', '');
		else {
			var s = Cookies.get('autoopen', '');
			var modules = s ? s.split(';') : [];
			var pos = -1;
			Ext.each(modules, function(module, index) {
				if (module == moduleName) {
					pos = index;
					return false;
				}
			});
			if (pos != -1) {
				modules.splice(pos, 1);
				Cookies.set('autoopen', modules.join(';'));
			}
		}
	}

});
