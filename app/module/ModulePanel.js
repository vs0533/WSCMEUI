/**
 * 
 * merge level=48
 * 
 * 一个模块的总panel,包括导航，toolbar,listgrid,detail,etc.
 */

Ext.define('WsCme.module.ModulePanel', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.modulepanel',
	frame : false,
	border : false,
	layout : 'border',
	requires : [ 'WsCme.module.ToolBar', 'WsCme.module.ChildToolBar',
			'WsCme.module.Grid', 'WsCme.module.Detail', 'WsCme.module.navigate.Navigate',
			'WsCme.module.GridStore', 'Ext.data.Store' ],
	module : null,
	// 是否显示导航栏
	collapseNavigate : false,
	// 是否允许有导航栏
	enableNavigate : true,
	param : {},
	parentFilter : null,
	config : {
		gridType : 'normal'
	},
	initComponent : function() {

		// this.margin = Ext.themeName === 'neptune' ? '0 0 0 0' : '1 1 1 1';
		Ext.apply(this, this.param);
		console.log('module panel init Component start......');
		console.log(this.module);

//		Ext.apply(this, this.module.getIconInfo());
//		this.title = this.module.tf_title;

		this.store = Ext.create('app.module.GridStore', {
			// this.store = Ext.create('Ext.data.Store', {
			module : this.module,
			modulePanel : this,
			model : this.module.model,
			proxy : {
				type : 'rest',
				batchActions : true,
				extraParams : {
					moduleName : this.module.tf_moduleName
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
				}
			}

		});

		console.log(this.store);

		if (this.parentFilter)
			this.store.extraParams.parentFilter = Ext.encode(this.parentFilter);

		this.moduleName = this.module.tf_moduleName;
		var grid_detail = [ {
			region : 'center',
			xtype : 'modulegrid',
			modulePanel : this,
			parentFilter : this.parentFilter,
			gridType : this.gridType,
			store : this.store
		}, {
			region : 'east',
			xtype : 'recorddetail',
			modulePanel : this,
			width : 400,
			title : '记录明细',
			split : true,
			collapsible : true,
			collapsed : true,
			collapseMode : 'mini'
		} ];
		if (this.moduleName == '_Attachment') {
			this.store.pageSize = 100;
			this.items = [ {
				xtype : 'attachmenttabpanel',
				region : 'center',
				store : this.store,
				grid_detail : grid_detail
			} ];
		} else
			this.items = grid_detail;
		if (this.enableNavigate)
			if (this.module.moduleGridNavigates
					&& this.module.moduleGridNavigates.length > 0) {
				this.items.push(Ext.widget('modulenavigate', {
					region : 'west',
					width : 258,
					title : '导航',

					defaultNavigateValues : this.param ? this.param.defaultNavigateValues
							: null,
					parentFilter : this.parentFilter,
					module : this.module,
					split : true,
					collapsed : this.collapseNavigate,
					collapsible : true,
					collapseMode : 'mini'
				// , collapsed : (this.parentFilter) ? true : false

				}));
			}
		console.log('module panel init Component end......');
		this.callParent(arguments);
	},

	listeners : {
		render : function(modulepanel) {
			// console.log(modulepanel);
		}
	},

	setParentFilter : function(fp) {
		// if (!this.rendered)
		// return fp;
		this.parentFilter = fp;
		if (!this.down('modulegrid'))
			return fp;
		this.down('modulegrid').setParentFilter(fp);
		if (this.down('modulenavigate'))
			this.down('modulenavigate').setParentFilter(fp);
		return fp;
	},

	refreshNavigate : function() {
		var tool = this.down('modulenavigate tool[type=refresh]');

		if (tool)
			tool.fireEvent('click', tool);
	},

	changeParentFilter : function(parentModuleName, pid, ptitle, navigates) {
		var pm = app.modules.getModuleInfo(parentModuleName);
		var pf = {
			moduleId : pm.tf_moduleId,
			moduleName : parentModuleName,
			tableAsName : pm.tableAsName,
			primarykey : pm.tf_primaryKey,
			fieldtitle : pm.tf_title,
			equalsValue : pid,
			equalsMethod : null,
			text : ptitle,
			isCodeLevel : pm.codeLevel
		};
		this.parentFilter = pf;
		this.down('modulegrid').changeParentFilter(pf, navigates);
		if (this.down('modulenavigate'))
			this.down('modulenavigate').changeParentFilter(pf, navigates);

	}

})
