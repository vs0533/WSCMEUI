/**
 * merge level=30
 */
Ext
    .define(
        'WsCme.module.factory.FieldContainerFactory',
        {

            requires: ['WsCme.lib.ManyToOneFieldDisplayButton',
                'WsCme.lib.AdditionFieldAddButton',
                'WsCme.lib.AdditionFieldDisplayButton'],

            statics: {

                getTableContainer: function (schemeGroup, container, module,
                                             formtype) {
                    var result = {
                        xtype: 'fieldcontainer',
                        width: '100%',
                        layout: {
                            type: 'table',
                            columns: schemeGroup.tf_numCols
                            * (schemeGroup.tf_isSeparateLabel ? 2 : 1),
                            tdAttrs: {
                                style: {
                                    'padding': '3px 3px 3px 3px',
                                    'border-color': 'gray'
                                }
                            },
                            tableAttrs: {
                                border: 1,
                                width: '100%',
                                style: {
                                    'border-collapse': 'collapse',
                                    'border-color': 'gray'
                                }
                            }
                        },

                        margin: '0 0 5 0',
                        items: []
                    };

                    if (schemeGroup.tf_widths) {
                        var widths = schemeGroup.tf_widths.split(',');
                        for (var i = 0; i < schemeGroup.tf_numCols
                        * (schemeGroup.tf_isSeparateLabel ? 2 : 1); i++)
                            result.items.push({
                                xtype: 'component',
                                tdAttrs: {
                                    width: widths[i] || 150,
                                    style: {
                                        'padding': '0px 0px 0px 0px'
                                    }
                                }
                            })
                    }

                    if (schemeGroup.titles) {
                        for (var i = 0; i < schemeGroup.tf_numCols; i++)
                            result.items.push({
                                xtype: 'label',
                                text: schemeGroup.titles[i],
                                tdAttrs: schemeGroup.widths ? {
                                    width: schemeGroup.widths[i] || 100
                                } : null,
                                cellCls: 'fieldContainerTableth'
                            });
                    }
                    for (var i in container) {
                        var field = container[i];

                        var f = this.getContainer([field], module, formtype);

                        var fieldDefine = module.getFieldDefine(field.tf_fieldId);
                        // var f = app.module.factory.FormFieldFactory.getField(
                        // fieldDefine, field, formtype, module);

                        if (field.tf_rowspan)
                            f.rowspan = field.tf_rowspan;
                        if (field.tf_colspan) {
                            f.colspan = field.tf_colspan;
                            f.width = '100%';
                        }
                        if (!f.style)
                            f.style = '';
                        f.style = f.style + 'margin-bottom:0px;'

                        if (field.tf_width == -1)
                            f.width = '100%';

                        if (field.labelAlign)
                            f.labelAlign = field.labelAlign;

                        // 把一个字段分成 label behindtex 和label
                        if (field.separateThreePart) {
                            Ext.String.trim(f.fieldLabel);

                            result.items
                                .push({
                                    width: 300,
                                    xtype: 'label',
                                    text: f.fieldLabel,
                                    margin: '0 0 0 '
                                    + (f.fieldLabel.length - Ext.String
                                        .trim(f.fieldLabel).length) * 8
                                });
                            result.items.push({
                                width: 100,
                                xtype: 'label',
                                text: field.behindText || f.behindText
                            });
                            delete f.fieldLabel;
                            delete f.behindText;
                        }

                        // 把一个字段分成 label 和text
                        if (field.separateTwoPart) {
                            Ext.String.trim(f.fieldLabel);

                            result.items
                                .push({
                                    width: 300,
                                    xtype: 'label',
                                    text: f.fieldLabel,
                                    margin: '0 0 0 '
                                    + (f.fieldLabel.length - Ext.String
                                        .trim(f.fieldLabel).length) * 8
                                });
                            delete f.fieldLabel;
                            delete f.behindText;
                        }

                        // 是否将label分开来成为一列
                        if (schemeGroup.tf_isSeparateLabel) {
                            if (f.xtype == 'imagefieldcontainer') {
                                if (!f.colspan)
                                    f.colspan = 1;
                                f.colspan *= 2;
                            } else if (f.xtype == 'fieldcontainer') {
                                if (!f.colspan)
                                    f.colspan = 1;
                                f.colspan *= 2 - 1;
                                result.items.push({
                                    xtype: 'container',
                                    html: f.items[0].items[0].fieldLabel,
                                    tdAttrs: {
                                        align: 'center'
                                    }
                                });
                                delete f.items[0].items[0].fieldLabel;
                                if (typeof f.items[0].items[0].width == 'number')
                                    f.items[0].items[0].width -= 92;

                            } else {
                                if (!f.colspan)
                                    f.colspan = 1;
                                f.colspan = f.colspan * 2 - 1;
                                if (typeof f.width == 'number')
                                    f.width -= 92;
                                result.items.push({
                                    xtype: 'container',
                                    html: f.fieldLabel,
                                    tdAttrs: {
                                        align: 'center'
                                    }
                                });
                                delete f.fieldLabel;
                            }
                        }

                        result.items.push(f);
                    }

                    console.log(result);

                    return result;
                },

                getContainer: function (container, module, formtype) {

                    var result = {
                        xtype: 'fieldcontainer',
                        layout: 'hbox',
                        margin: '0 0 0 0',
                        items: []
                    };
                    for (var i in container) {
                        var field = container[i];
                        // 如果是空的位置
                        if (field.spacer) {
                            result.items.push({
                                xtype: 'fieldcontainer',
                                layout: 'anchor',
                                margin: '0 0 0 0',
                                flex: field.flex
                            });
                        } else {
                            var fieldDefine = module.getFieldDefine(field.tf_fieldId);
                            var additionField = null;
                            var pmodule = null;
                            // 没有在本模块中找到此字段，说明这是一个附加字段
                            if (fieldDefine == null) {
                                // 找到附加字段的字义
                                additionField = module
                                    .getAdditionFieldDefine(field.tf_fieldId);

                                /*
                                 * targetModuleName: "Global" ,tf_aggregate: "normal"
                                 * tf_allowSummary: false ,tf_fieldId: 10100040
                                 * tf_fieldName: "P__t1010___tf_name" tf_fieldType: "String"
                                 * tf_moduleId: "2010" tf_moduleadditionfieldId: 111
                                 * tf_title: "工程--工程名称"
                                 */

                                pmodule = app.modules
                                    .getModule(additionField.targetModuleName);
                                fieldDefine = pmodule.getFieldDefine(field.tf_fieldId);

                                // console.log(additionField);
                                // console.log(fieldDefine);
                            }

                            var fieldAttachment = module.tf_userRole.tf_attachmentBrowse
                                && fieldDefine.tf_haveAttachment;

                            // 如果是一行一列的，那么不直接生成 field 返回，不要加 fieldcontainer 了
                            // 如果有附件按钮，就不返回,如果是manytoone 字段，则不返回
                            if (container.length == 1 && !fieldAttachment
                                && !fieldDefine.manytoone_TitleName
                                && additionField == null && !fieldDefine.tf_unitText) {
                                // var field = container[0];
                                // var fieldDefine =
                                // module.getFieldDefine(field.tf_fieldId);
                                var f = app.module.factory.FormFieldFactory.getField(
                                    fieldDefine, field, formtype, module);
                                return f;
                            }

                            var f = app.module.factory.FormFieldFactory.getField(
                                fieldDefine, field, formtype, module);
                            if (!f.style)
                                f.style = '';
                            f.style = f.style + 'margin-bottom:3px;'
                            var c = {
                                xtype: 'fieldcontainer',
                                layout: (fieldAttachment || f.moduleName || additionField || fieldDefine.tf_unitText) ? (field.tf_width != -1 ? 'table'
                                    : 'hbox')
                                    : 'anchor',
                                flex: field.tf_colspan,
                                items: []
                            };
                            if (c.layout == 'hbox')
                                c.margin = '0 0 5 0';
                            // return f;
                            c.items.push(f);
                            if (fieldDefine.tf_unitText) {
                                c.items.push({
                                    xtype: 'label',
                                    text: fieldDefine.tf_unitText
                                })
                            }
                            ;

                            // 是否是 附加字段
                            // console.log(additionField);
                            if (additionField) {

                                f.name = additionField.tf_fieldName; // P__t1010___tf_name
                                f.readOnly = true;
                                f.allowBlank = true;

                                // 如果是父模块或并级模块的 nameFields 才加入下面的
                                if (additionField.tf_fieldName
                                        .endWith(pmodule.tf_nameFields)) {
                                    f.xtype = 'textfield';
                                    f.moduleName = pmodule.tf_moduleName; // Global
                                    // 聚合字段和子模块的计数，不加入这个按钮
                                    if (additionField.tf_aggregate == 'normal') {
                                        f.flex = 1;
                                        // console.log(f.idField);
                                        c.items.push({
                                            xtype: 'manytoonefielddisplaybutton',
                                            tooltip: '显示『' + pmodule.tf_title + '』的内容',
                                            fieldName: additionField.tf_fieldName, // P__t1010___tf_name
                                            primaryKey: pmodule.tableAsName + '___'
                                            + pmodule.tf_primaryKey,
                                            title: pmodule.tf_title
                                        });
                                    }
                                }
                                // console.log(f);
                            } else

                            // 是否是 manyToOne字段 ， 如果是 readonly 那么
                            // 就是textfield,name=manytoonetitlename
                            if (f.moduleName) {
                                f.flex = 1;
                                c.items.push({
                                    xtype: 'manytoonefielddisplaybutton',
                                    tooltip: '显示『' + fieldDefine.tf_title + '』的内容',
                                    fieldName: f.name,
                                    primaryKey: f.idName,
                                    title: fieldDefine.tf_title
                                });
                            }

                            if (fieldAttachment) {
                                f.flex = 1;
                                if ((formtype == 'edit' || formtype == 'new')
                                    && module.tf_userRole.tf_attachmentInsert) {
                                    c.items.push({
                                        xtype: 'additionfieldaddbutton',
                                        icon: 'images/button/additionadd.png',
                                        tooltip: '新增 ' + fieldDefine.tf_title + ' 的附件',
                                        moduleId: module.tf_moduleId,
                                        fieldId: fieldDefine.tf_fieldId,
                                        fieldTitle: fieldDefine.tf_title
                                    });
                                } else {
                                    c.items.push({
                                        xtype: 'additionfielddisplaybutton',
                                        iconCls: 'fa fa-paperclip',
                                        style: 'margin-top:-5px;',
                                        tooltip: '显示 ' + fieldDefine.tf_title + ' 的附件',
                                        moduleId: module.tf_moduleId,
                                        fieldId: fieldDefine.tf_fieldId,
                                        fieldTitle: fieldDefine.tf_title
                                    });
                                }
                            }
                            result.items.push(c);
                        }
                    }
                    return result;
                },

                /**
                 * 取得字段定义中的这个字段的单位值，比如说 平方米，件等字
                 *
                 * @param {}
                 *          fieldDefine: formfield : { behindText : '平方' }
                 * @return {} 如果有返回值，若无，返回null
                 */
                getBehindText: function (fieldDefine) {
                    if (fieldDefine.tf_otherSetting) {
                        var otherSet = Ext.decode('{' + fieldDefine.tf_otherSetting
                            + '}', true);
                        if (otherSet && otherSet.formfield
                            && otherSet.formfield.behindText)
                            return otherSet.formfield.behindText;
                    }
                }
            }
        });