/**
 * merge level=10
 *
 * 一个查询结果的 grid 类
 */
Ext
    .define(
        'WsCme.report.resultgrid.ResultListGrid',
        {
            extend: 'Ext.grid.Panel',
            alias: 'widget.resultlistgrid',

            requires: ['WsCme.report.resultgrid.ResultListGridToolbar',
                'WsCme.module.widget.PageSizeCombo'],

            config: {
                // selectFieldsWindow中的当前选中的tree中的数据，
                // 可以是后台加载来的，也可以是window保存的，尚未提交到后台保存的
                selectdGroupAndFields: null,
                columnAutoFited: false,
                isGrouped: false
                // 是否有分组
                // 列宽是否已经自动适应过了，一个方案适应一次，渲染太慢
            },
            columnLines: true,
            border: false,
            enableTextSelection: true,
            frame: false,
            enableLocking: true,
            bodyCls: 'panel-background',
            multiSelect: true,
            // selType : 'rowmodel',// 'checkboxmodel','SINGLE'

            // applySelectdGroupAndFields : function(source) {
            //
            // this.reconfigure(store, columns);
            // this.store.reload();
            // return source;
            // },

            // 单个字段加筛选的，改了吧

            //
            // features : [{
            // ftype : 'filters',
            // encode : true
            // }],

            viewConfig: {

                stripeRows: true,
                selModel: {
                    mode: 'SINGLE'
                },

                getRowClass: function (record, index) {
                    var c = record.get('_level_');
                    if (c == 10) {
                        return 'total';
                    } else if (c >= 20 && c <= 30) {
                        return 'subtotal' + c;
                    }
                },
                listeners: {
                    celldblclick: function (gridview, td, cellIndex, record, tr,
                                            rowIndex, e, eOpts) {
                        var text = record
                            .get(gridview.getGridColumns()[cellIndex].dataIndex);
                        // ie 下可以，chrome下还没找到
                        if (window.clipboardData) {
                            window.clipboardData.clearData();
                            window.clipboardData.setData('text', text);
                        }
                    }
                }
            },

            initComponent: function () {
                var me = this;
                this.setColumnAutoFited(false);
                this.columns = [{
                    xtype: 'rownumberer',
                    tdCls: 'x-report-cell',
                    resizable: false,
                    width: 30
                }];

                // 是否有附件，有附件则加入附件按钮
                if (this.module.tf_hasAttachment
                    && this.module.tf_userRole.tf_attachmentBrowse)
                    this.columns.push({
                        locked: true,
                        resizable: false,
                        tdCls: 'x-report-cell',
                        xtype: 'attachmentnumbercolumn'
                    });
                // 是否模块具有审核功能
                if (this.module.tf_hasAuditing) {
                    this.columns.push({
                        resizable: false,
                        locked: true,
                        tdCls: 'x-report-cell',
                        xtype: 'auditingactioncolumn'
                    });
                }
                // 是否模块具有审批功能
                if (this.module.tf_hasApprove) {
                    this.columns.push({
                        locked: true,
                        tdCls: 'x-report-cell',
                        resizable: false,
                        xtype: 'approveactioncolumn'
                    });
                }

                // 是否模块具有支付功能
                if (this.module.tf_hasPayment) {
                    this.columns.push({
                        locked: true,
                        tdCls: 'x-report-cell',
                        xtype: 'payoutactioncolumn'
                    });
                }

                if (me.mainReport.getGroupFields().length >= 1) {
                    this.isGrouped = true;
                    me.columns.push({
                        text: '分组项目',
                        dataIndex: '_total_',
                        tdCls: 'x-report-cell intcolor',
                        locked: true
                    });
                    me.columns.push({
                        locked: true,
                        text: '记录数',
                        dataIndex: '_count_',
                        align: 'right',
                        xtype: 'numbercolumn',
                        format: '#',
                        tdCls: 'x-report-cell intcolor',
                        renderer: Ext.util.Format.intRenderer
                    });
                }
                Ext.Array.forEach(this.groupAndFields, function (fgroup) {
                    var group = {
                        text: fgroup.groupTitle,
                        // flex : 1,
                        columns: [],
                        hidden: fgroup.groupTitle == '隐藏',
                        locked: fgroup.groupTitle.endWith(' ')
                    };
                    Ext.Array.forEach(fgroup.fields, function (field) {
                        var column = me.getColumnField(field);
                        field.dataIndex = column.dataIndex;
                        field.text = column.simpleText || column.text;
                        // 每个字段可以加筛选的内容
                        // column.text += "<br/>" + column.dataIndex;
                        group.columns.push(column);
                    });
                    me.columns.push(group);
                });
                var model = this.getModel(this.module, this.groupAndFields);
                this.store = Ext.create(
                    'app.report.resultgrid.ResultListGridStore', {
                        grid: this,
                        module: this.module,
                        groupAndFields: this.groupAndFields,
                        model: model,
                        proxy: {
                            type: 'rest',
                            batchActions: true,
                            url: 'report/fetchdata.do',

                            actionMethods: {
                                read: 'GET'
                            },
                            reader: {
                                type: 'json',
                                rootProperty: 'records',
                                totalProperty: 'totalCount'
                            }
                        }
                    });

                this.dockedItems = [{
                    dock: 'top',
                    xtype: 'resultlistgridtoolbar',
                    mainReport: this.mainReport,
                    resultGrid: this
                }];

                if (!this.mainReport.getIsLiveGrid())
                    this.dockedItems.push({
                        xtype: 'pagingtoolbar',
                        prependButtons: true,
                        items: [{
                            xtype: 'pagesizecombo',
                            value: this.store.pageSize
                        }, '条', '-'],
                        store: this.store,
                        dock: 'bottom',
                        displayInfo: true
                    });

                this.callParent(arguments);
            },

            columnsAutoSize: function () {
                if (!this.getColumnAutoFited()) {
                    this.setColumnAutoFited(true);

                    var me = this;
                    Ext.suspendLayouts();
                    Ext.Array.forEach(this.columnManager.getColumns(), function (column) {
                        if (me.isVisible() && column.resizable) {
                            column.autoSize();
                        }
                    });
                    Ext.resumeLayouts(true);

                }
            },

            getTextAndUnit: function (fd) {
                var result = fd.tf_title.replace(new RegExp('--', 'gm'), '<br/>');// title中间有--表示换行
                var unitText = Ext.monetary.unitText === '个' ? ''
                    : Ext.monetary.unitText;
                if (fd.tf_isMonetary && Ext.monetaryPosition === 'columntitle') {// 可能选择金额单位千,万,百万,亿
                    if (fd.tf_unitText || unitText)
                        result += '<br/><span style="color:green;">(' + unitText
                            + (fd.tf_unitText ? fd.tf_unitText : '') + ')</span>';
                } else {
                    if (fd.tf_unitText)
                        result += '<br/><span style="color:green;">(' + fd.tf_unitText
                            + ')</span>';
                }
                return result;
            },

            getColumnField: function (gfd) {
                var me = this;
                var fieldModule = app.modules.getModule(gfd.moduleName);

                var fd = fieldModule.getFieldDefine(gfd.fieldId);

                var field = {
                    maxWidth: 800,
                    text: this.getTextAndUnit(fd),
                    sortable: true,
                    renderer: app.system.defaultRenderer,
                    dataIndex: (fd.baseField || fd.tf_aggregate) ? fd.tf_fieldName
                        : fd.manytoone_TitleName,
                    tdCls: 'x-report-cell'
                };

                if (fieldModule.tf_moduleName != this.module.tf_moduleName) {
                    field.dataIndex = (fd.baseField || fd.tf_aggregate) ? fieldModule.tableAsName
                        + '___' + fd.tf_fieldName
                        : fd.manytoone_TitleName;
                }
                ;

                switch (fd.tf_fieldType) {
                    case 'Date':
                        Ext.apply(field, {
                            xtype: 'datecolumn',
                            align: 'center',
                            width: 100,
                            renderer: Ext.util.Format.dateRenderer
                        });
                        break;

                    case 'Datetime':
                        Ext.apply(field, {
                            xtype: 'datecolumn',
                            align: 'center',
                            width: 130,
                            renderer: Ext.util.Format.dateRenderer
                        });
                        break;

                    case 'Boolean':
                        delete field.renderer;
                        field.xtype = 'checkcolumn';
                        field.stopSelection = false;
                        field.processEvent = function (type) {
                            if (type == 'click')
                                return false;
                        };
                        break;
                    case 'Integer':
                        Ext.apply(field, {
                            align: 'right',
                            xtype: 'numbercolumn',
                            format: '#',
                            tdCls: 'x-report-cell intcolor',
                            renderer: Ext.util.Format.intRenderer
                        });
                        break;
                    case 'Double':
                        Ext.apply(field, {
                            align: 'right',
                            xtype: 'numbercolumn',
                            width: 110,
                            minWidth: 80,
                            renderer: Ext.util.Format.floatRenderer
                        });
                        break;
                    case 'Float':
                        Ext.apply(field, {
                            align: 'right',
                            xtype: 'numbercolumn',
                            width: 110,
                            minWidth: 80,
                            renderer: Ext.util.Format.floatRenderer
                        });
                        break;
                    case 'Percent':
                        Ext.apply(field, {
                            align: 'center',
                            xtype: 'widgetcolumn',
                            width: 110,
                            minWidth: 80,
                            widget: {
                                xtype: 'progressbarwidget',
                                textTpl: ['{percent:number("0.00")}%']
                            }
                        });
                        break;
                    case 'String':
                        if (!gfd.aggregateType) {
                            if (fieldModule.tf_nameFields == fd.tf_fieldName)
                                if (fieldModule.tf_moduleName == this.module.tf_moduleName)
                                // 如果是基准字段的 nameField,加一个下划线的链接
                                    Ext.apply(field, {
                                        simpleText: fd.tf_title,
                                        text: '<span class="gridheadicon" >'
                                        + '<img src="images/button/namefield.png" />'
                                        + fd.tf_title + '</span>',
                                        renderer: this.nameFieldRenderer
                                    });
                                else {
                                    // 如果是其他模块的nameFields 字段
                                    var icon = '';
                                    if (fieldModule && fieldModule.iconURL)
                                        icon = '<img src="' + fieldModule.iconURL + '" />';
                                    Ext.apply(field, {
                                        xtype: 'manytoonefieldcolumn',
                                        simpleText: fd.tf_title,
                                        text: '<span class="gridheadicon" >' + icon
                                        + fd.tf_title + '</span>',
                                        manytooneIdName: fieldModule.tableAsName + '___'
                                        + fieldModule.tf_primaryKey,
                                        moduleName: fieldModule.tf_moduleName
                                    });
                                    delete field.renderer;
                                }
                        }
                }

                if (gfd.aggregateType == 'sum') {
                    field.dataIndex = 'S_' + field.dataIndex;
                    field.text += '小计';
                } else if (gfd.aggregateType == 'count') {
                    field.dataIndex = 'C_' + field.dataIndex;
                    field.text += '个数';
                    field.tdCls = 'x-report-cell intcolor';
                    field.renderer = Ext.util.Format.intRenderer;
                    field.align = 'right';
                    field.xtype = 'numbercolumn';
                    field.format = '#';
                    gfd.fieldType = 'Integer';
                } else if (gfd.aggregateType == 'avg') {
                    field.dataIndex = 'A_' + field.dataIndex;
                    field.text += '均值';
                } else if (gfd.aggregateType == 'max') {
                    field.dataIndex = 'X_' + field.dataIndex;
                    field.text += '最大值';
                } else if (gfd.aggregateType == 'min') {
                    field.dataIndex = 'N_' + field.dataIndex;
                    field.text += '最小值';
                } else
                    field.filter = {
                        updateBuffer: 1000,
                        dateFormat: 'Y-m-d'
                    };

                if (fd.manytoone_TitleName) {
                    var pmodule = app.modules.getModuleInfo(fd.tf_fieldType);
                    var icon = '';
                    if (pmodule && pmodule.iconURL)
                        icon = '<img src="' + pmodule.iconURL + '" />';
                    Ext.apply(field, {
                        xtype: 'manytoonefieldcolumn',
                        simpleText: fd.tf_title,
                        text: '<span class="gridheadicon" >' + icon + fd.tf_title
                        + '</span>',
                        manytooneIdName: fd.manytoone_IdName,
                        moduleName: fd.tf_fieldType
                    });
                    delete field.renderer;
                }
                field.text = field.text.replace(new RegExp('--', 'gm'), '<br/>');
                return field;
            },

            // 模块的名称字段，点击可以显示此模块的 display form
            nameFieldRenderer: function (val, rd, model, row, col, store,
                                         gridview) {
                var result = val;
                rd.style = 'font-weight:bold;';
                //console.log(model);
                try {
                    if (model.id) // (model.getIdValue())
                        result = '<span class="gridNameField">'
                            + '<a onclick="javascript:__smr(\''
                            + model.joined[0].module.tf_moduleName + '\',\'' + model.id
                            + '\');return false;" href="#">' + val + '</a></span>';
                    else
                        result = val;
                } catch (err) {
                    console.log(err);
                }
                return result;
            },

            /**
             * 取得选中的记录条数
             *
             * @return {}
             */
            getSelectionCount: function () {
                return this.getSelectionModel().getSelection().length;
            },

            getModel: function (module, groupAndFields) {
                if (!module)
                    return null;
                var model = Ext.define('app.report.model' + this.getId(), {
                    mixins: ['app.model.ApproveBase'],

                    extend: 'Ext.data.Model',
                    module: module,
                    idProperty: module.tf_primaryKey,
                    nameFields: module.tf_nameFields,
                    titleTpl: module.tf_titleTpl,
                    titleTemplate: null,
                    fields: this.getStoreFields(module, groupAndFields),
                    getTitleTpl: function () {
                        if (!this.titleTemplate) {
                            if (this.titleTpl)
                                this.titleTemplate = new Ext.Template(this.titleTpl);
                            else
                                this.titleTemplate = new Ext.Template('{' + this.nameFields
                                    + '}');
                        }
                        return this.titleTemplate.apply(this.getData());
                    },

                    // 取得主键值
                    getIdValue: function () {
                        return this.get(this.idProperty);
                    },

                    // 取得当前记录的名字字段
                    getNameValue: function () {
                        if (this.nameFields)
                            return this.get(this.nameFields);
                        else
                            return null;
                    }

                });
                return model;

            },

            // 和成本模块的所有字段
            getStoreFields: function (module, groupAndFields) {
                var fields = [{
                    name: '_total_',
                    type: 'string'
                }, {
                    name: '_level_',
                    type: 'int'
                }, {
                    name: '_count_',
                    type: 'int'
                }];

                if (module.tf_hasAttachment) {
                    fields.push({
                        name: 'tf_attachmentCount',
                        title: '附件张数',
                        persist: false,
                        type: 'int'
                    });
                }
                for (var i in module.tf_fields) {
                    var fd = module.tf_fields[i];

                    if (fd.manyToOne || fd.oneToOne) { // 如果是manytoone ,one to one
                        // 的字段，加入id 和 name
                        fields.push({
                            name: fd.manytoone_IdName,
                            // title : fd.tf_title+ "序号",
                            useNull: true,
                            type: 'string',
                            serialize: this.convertToNull
                        });

                        fields.push({
                            name: fd.manytoone_TitleName,
                            title: fd.tf_title,
                            persist: false, // 此字段不会被提交到insert,update中
                            type: 'string'
                        });

                    } else {
                        var field = {
                            name: fd.tf_fieldName,
                            title: fd.tf_title,
                            type: this.getTypeByStr(fd.tf_fieldType)
                        };
                        if (field.type == 'string') {
                            field.useNull = true;
                            field.serialize = this.convertToNull;
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
                fields = fields.concat(this.getParentFields(groupAndFields));

                // console.log('all fields');
                // console.log(this.getParentFields(groupAndFields));

                return fields;

            },

            getTypeByStr: function (str) {
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
                        return 'float';
                    default:
                        return 'string';
                }
            },

            // 用于生成选择过程中的 父模块的各个字段
            getParentFields: function (groupAndFields) {
                var fields = [];
                var me = this;
                Ext.Array.forEach(groupAndFields, function (group) {
                    Ext.Array.forEach(group.fields, function (field) {
                        // 不是当前基准模块
                        if (field.moduleName != me.module.tf_moduleName) {
                            var pmodule = app.modules.getModuleInfo(field.moduleName);
                            var f = me.getAParentField(pmodule, field.fieldId, fields,
                                field);
                            if (f)
                                fields.push(f);
                        }
                    });
                });
                return fields;
            },

            // 增加一个父模块的字段，字段前面加 _t9999___,
            getAParentField: function (module, fieldId, fields, fd1) {
                var fd = null;
                for (var i in module.tf_fields) {
                    if (module.tf_fields[i].tf_fieldId == fieldId) {
                        fd = module.tf_fields[i];
                        break;
                    }
                }
                if (fd == null)
                    return null;
                if (fd.manyToOne || fd.oneToOne) { // 如果是manytoone ,one to one
                    // 的字段，加入id 和 name
                    fields.push({
                        name: fd.manytoone_IdName,
                        // title : fd.tf_title+ "序号",
                        useNull: true,
                        type: 'string',
                        serialize: this.convertToNull
                    });

                    fields.push({
                        name: fd.manytoone_TitleName,
                        title: fd.tf_title,
                        persist: false, // 此字段不会被提交到insert,update中
                        type: 'string'
                    });

                } else {
                    var field = {
                        name: module.tableAsName + '___' + fd.tf_fieldName,
                        title: fd.tf_title,
                        type: this.getTypeByStr(fd.tf_fieldType)
                    };

                    if (field.type == 'string') {
                        field.useNull = true;
                        field.serialize = this.convertToNull;
                    }

                    if (fd.tf_fieldType == 'Date') {
                        field.dateWriteFormat = 'Y-m-d';
                        field.dateReadFormat = 'Y-m-d';
                    }
                    if (fd.tf_fieldType == 'Datetime')
                        field.dateReadFormat = 'Y-m-d H:i:s';
                    field.tf_haveAttachment = fd.tf_haveAttachment;
                }

                if (fd1.aggregateType == 'sum') {
                    field.name = 'S_' + field.name;
                    field.title += '小计';
                } else if (fd1.aggregateType == 'count') {
                    field.name = 'C_' + field.name;
                    field.title += '个数';
                    field.type = 'int';
                } else if (fd1.aggregateType == 'avg') {
                    field.name = 'A_' + field.name;
                    field.title += '均值';
                } else if (fd1.aggregateType == 'max') {
                    field.name = 'X_' + field.name;
                    field.title += '最大值';
                } else if (fd1.aggregateType == 'min') {
                    field.name = 'N_' + field.name;
                    field.title += '最小值';
                }

                return field;
            }
        });