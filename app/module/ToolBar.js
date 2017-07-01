/**
 * merge level=45
 */
Ext
    .define(
        'WsCme.module.ToolBar',
        {
            extend: 'Ext.toolbar.Toolbar',
            alias: 'widget.moduletoolbar',
            requires: ['WsCme.module.widget.GridSchemeCombo',
                'WsCme.module.widget.GridSearchField',
                'WsCme.module.widget.DetailSchemeCombo',
                'WsCme.module.widget.GridGroupCombo',
                'WsCme.module.widget.toolButton.Delete',
                'WsCme.module.widget.toolButton.New'],
            layout: {
                overflowHandler: 'Menu'
            },

//					defaults : {
//						xtype : 'buttontransparent'
//					},
            initComponent: function () {
                var me = this;
                this.items = [];
                this.items.push({
                    text: '显示',
                    iconCls: 'fa fa-newspaper-o',
                    itemId: 'display'
                });
                var userrole = this.modulePanel.module.tf_userRole;
                // 每一个模块的附件都有自己的权限
                if (this.modulePanel.module.tf_moduleName == '_Attachment') {
                    var puserrole = app.modules
                        .getModule(this.modulePanel.parentFilter.moduleName).tf_userRole;
                    if (puserrole.tf_attachmentInsert)
                        this.items.push({
                            text: '新增',
                            icon: 'images/button/new.png',
                            itemId: 'new'
                        });
                    if (puserrole.tf_attachmentEdit)
                        this.items.push({
                            text: '修改',
                            iconCls: 'fa fa-pencil-square-o',
                            itemId: 'edit'
                        });
                    if (puserrole.tf_attachmentDelete)
                        this.items.push({
                            text: '删除',
                            iconCls: 'fa fa-trash-o',
                            itemId: 'delete'
                        });
                } else {
                    if (userrole.tf_allowInsert
                        && this.modulePanel.gridType == 'normal') {
                        this.items.push({
                            xtype: 'newbutton',
                            module: this.modulePanel.module
                        });
                    }
                    if (userrole.tf_allowEdit
                        && this.modulePanel.gridType == 'normal') {
                        this.items.push({
                            text: '修改',
                            iconCls: 'fa fa-pencil-square-o',
                            itemId: 'edit'
                        });
                        if (this.modulePanel.module.tf_fileField) {
                            this.items.push({
                                text: '上传',
                                icon: 'images/button/upload.png',
                                tooltip: '上传此条记录包含的文件',
                                itemId: 'uploadfile'
                            });
                        }
                    }
                    if (userrole.tf_allowAuditing)
                        this.items.push({
                            text: '审核',
                            icon: 'images/button/auditing.png',
                            itemId: 'auditing',
                            xtype: 'splitbutton',
                            menu: {
                                items: [{
                                    text: '自动审核选中的记录',
                                    itemId: 'auditing_thisselection'
                                }, '-', {
                                    text: '自动审核当前页的记录',
                                    tooltip: '自动审核当前页显示的未审核记录。',
                                    itemId: 'auditing_thispage'
                                }, '-', {
                                    text: '审核当前导航值确定的记录',
                                    tooltip: '自动审核当前导航条件值限定下的所有未审核记录。',
                                    itemId: 'auditing_thiscondition'
                                }, '-', {
                                    text: '全部自动审核',
                                    tooltip: '在权限范围内，将本模块未审核的记录全部自动审核。',
                                    itemId: 'auditing_all'
                                }]
                            }
                        });

                    if (userrole.tf_allowApprove && userrole.tf_approveOrder > 0)
                        this.items.push({
                            text: '审批',
                            icon: 'images/button/approve.png',
                            itemId: 'approve',
                            xtype: 'splitbutton',
                            menu: {
                                items: [{
                                    text: '自动审批选中的记录',
                                    itemId: 'approve_thisselection'
                                }, '-', {
                                    text: '自动审批当前页的记录',
                                    tooltip: '自动审批当前页显示的我能审批的记录。',
                                    itemId: 'approve_thispage'
                                }, '-', {
                                    text: '审批当前导航值确定的记录',
                                    tooltip: '自动审批当前导航条件值限定下的所有我能审批记录。',
                                    itemId: 'approve_thiscondition'
                                }, '-', {
                                    text: '全部自动审批',
                                    tooltip: '在权限范围内，将本模块我能审批的记录全部自动审批。',
                                    itemId: 'approve_all'
                                }]
                            }
                        });

                    if (userrole.tf_allowPayment)
                        this.items.push({
                            text: '支付',
                            icon: 'images/button/approve.png',
                            itemId: 'payout'
                        });

                    if (userrole.tf_allowDelete
                        && this.modulePanel.gridType == 'normal')
                        this.items.push({
                            xtype: 'deletebutton',
                            module: this.modulePanel.module
                        });
                }
                /**
                 * 加入附加按钮
                 */
                if (this.modulePanel.module.tf_moduleAdditions) {
                    Ext
                        .each(
                            this.modulePanel.module.tf_moduleAdditions,
                            function (addition) {
                                if (userrole.userRoleAdditions) {
                                    Ext
                                        .each(
                                            userrole.userRoleAdditions,
                                            function (roleaddition) {
                                                if (roleaddition.tf_moduleAdditionFunctionId == addition.tf_moduleAdditionFunctionId) {
                                                    var button = {
                                                        tooltip: addition.tf_description,
                                                        text: addition.tf_title,
                                                        icon: addition.iconURL,
                                                        additionName: addition.tf_additionName,
                                                        needRecord: addition.tf_needRecord,
                                                        showWindow: addition.tf_showWindow
                                                    };
                                                    // 如果此功能要建立在某个菜单之上
                                                    if (addition.tf_menuName) {
                                                        var amenu = null;
                                                        // 查找此菜单是否已经存在了
                                                        Ext
                                                            .each(
                                                                me.items,
                                                                function (m) {
                                                                    if (m.menuText == addition.tf_menuName) {
                                                                        amenu = m;
                                                                        return false;
                                                                    }
                                                                })
                                                        if (!amenu) {
                                                            amenu = {
                                                                text: addition.tf_menuName,
                                                                // icon : addition.iconURL,
                                                                menuText: addition.tf_menuName,
                                                                xtype: 'splitbutton',
                                                                menu: []
                                                            }
                                                            me.items.push(amenu);
                                                        }
                                                        amenu.menu.push(button)
                                                        if (Ext.String.endsWith(
                                                                addition.tf_title, ' '))
                                                            amenu.menu.push('-')
                                                    } else
                                                        me.items.push(button)
                                                    return false;
                                                }
                                            });
                                }
                            })
                }

                if (this.modulePanel.module.tf_hasAttachment
                    && userrole.tf_attachmentBrowse) {

                    var attachmentMenu = [];
                    if (userrole.tf_attachmentInsert) {
                        attachmentMenu.push({
                            text: '新增附件',
                            icon: 'images/button/additionadd.png',
                            itemId: 'additionviewandinsert'
                        });
                        attachmentMenu.push('-');
                    }
                    attachmentMenu.push({
                        text: '预览所有附件',
                        itemId: 'additionview'
                    }, '-', {
                        text: '下载所有附件',
                        itemId: 'downloadall',
                        icon: 'images/button/download.png'
                    });
                    this.items.push({
                        xtype: 'splitbutton',
                        tooltip: '显示当前记录的所有附件',
                        //	icon : 'images/button/addition.png',
                        iconCls: 'fa fa-paperclip',
                        itemId: 'additiongrid',
                        menu: attachmentMenu
                    });
                }
                var printSchemes = this.modulePanel.module.recordPrintSchemes;

                var excelmenu = [{
                    text: '列表导出至excel',
                    icon: 'images/button/excel.png',
                    itemId: 'exportgrid'
                }, '-'];
                // 有没有 excel report
                var excelReports = this.modulePanel.module.moduleExcelReports;
                if (excelReports && excelReports.length > 0) {
                    Ext.each(excelReports, function (excelreport) {
                        excelmenu.push({
                            reportId: excelreport.tf_id,
                            text: excelreport.tf_name,
                            action: 'excelreport',
                            icon: 'images/button/report.png'
                        })
                    })
                } else {
                    excelmenu.push({
                        text: '选中记录导出至excel',
                        icon: 'images/button/excelone.png',
                        schemeId: null,
                        action: 'exportrecord'
                    })
                }

                // 有没有 print scheme 可以打印的表，敢放在导出的里面
                if (printSchemes && printSchemes.length > 1) {
                    excelmenu.push('-')
                    Ext.each(printSchemes, function (scheme) {
                        excelmenu.push({
                            text: scheme.tf_schemeName,
                            schemeId: scheme.tf_printSchemeId,
                            action: 'exportrecord'
                        })
                    })
                }
                // 所有excel下载的菜单
                this.items.push({
                    xtype: 'splitbutton',
                    icon: 'images/button/excel.png',
                    // iconCls : 'fa fa-file-excel-o',
                    menu: excelmenu,
                    handler: function (button) {
                        var menuitem = button.down('#exportgrid');
                        menuitem.fireEvent('click', menuitem);
                    }
                });

                // 所有打印的
                var printmenu = [
                    {
                        text: '打印当前页',
                        //icon : 'images/button/print.png',
                        iconCls: 'pictos pictos-print',
                        itemId: 'printgrid',
                        handler: function (button) {
                            app.lib.GridPrinter.mainTitle = button.up('modulepanel')
                                    .down('modulegrid').module.tf_title
                                + '<br />　';
                            app.lib.GridPrinter.print(button.up('modulepanel').down(
                                'modulegrid'));
                        }
                    }, {
                        text: '打印所有记录',
                        iconCls: 'pictos pictos-print',
                        itemId: 'printgridall'
                    }];

                if (printSchemes && printSchemes.length > 0) {
                    printmenu.push('-');
                    Ext.each(printSchemes, function (scheme) {
                        printmenu.push({
                            text: scheme.tf_schemeName,
                            schemeId: scheme.tf_printSchemeId,
                            action: 'printrecord'
                        })
                    })
                }
                ;
                // 所有的 Excel 报表也可以打印，先生成excel , 然后再转成pdf
                if (excelReports && excelReports.length > 0) {
                    printmenu.push('-');
                    Ext.each(excelReports, function (excelreport) {
                        printmenu.push({
                            reportId: excelreport.tf_id,
                            text: excelreport.tf_name,
                            action: 'showpdfreport', // 在新网页里 显示pdf report
                            icon: 'images/button/report.png'
                        })
                    })
                }

                // 所有 print 下载的菜单
                this.items.push({
                    xtype: 'splitbutton',
                    iconCls: 'pictos pictos-print',
                    menu: printmenu,
                    handler: function (button) {
                        console.log('aa');
                        var menuitem = button.down('#printgrid');
                        menuitem.handler(menuitem);
                    }
                });

                if (this.modulePanel.module.tf_hasChart) {
                    this.items.push({
                        xtype: 'button',
                        icon: 'images/button/chart_bar.png',
                        action: 'chart',
                        tooltip: '图表分析'
                    });
                }

                // 如果只有2个以下的子模块，就放在此处,原来的方案，后来改了
                // var childs = this.modulePanel.module.childNames;
                // if (childs && childs.length > 0 && childs.length <= 2) {
                // this.items.push("-");
                // for (var i in childs) {
                // var cm = app.modules.getModule(childs[i]);
                // this.items.push(app.module.ChildToolBar.getModuleButton(childs[i]))
                // }
                // }
                // 加入 moduleSubToolbar 中字义的子模块
                var subtoolbars = this.modulePanel.module.tf_moduleSubToolbar;
                if (subtoolbars && subtoolbars.length > 0
                    && subtoolbars.length <= 2) {
                    this.items.push("-");
                    for (var i in subtoolbars) {
                        this.items.push(app.module.ChildToolBar
                            .getModuleButtonWithSingle(subtoolbars[i].tf_subMoudleName,
                                subtoolbars[i].tf_openInWindow))
                    }
                }

                this.items.push('-', '筛选', {
                    width: 60,
                    xtype: 'gridsearchfield',
                    store: this.modulePanel.store
                });

                // this.items.push('->', {
                // xtype : 'gridgroupcombo',
                // modulePanel : this.modulePanel
                // });

                this.callParent(arguments);
            }

        })

/**
 * tf_allowApprove: 0 tf_allowAuditing: 0 tf_allowBrowse: 1 tf_allowDelete: 1
 * tf_allowEdit: 1 tf_allowExec: 0 tf_allowInsert: 1 tf_moduleId: "1010"
 * tf_userId: 1
 */
