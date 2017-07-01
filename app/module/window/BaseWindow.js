/**
 * Created by byron on 2017/7/1.
 */

Ext.define('WsCme.module.window.BaseWindow', {
    extend : 'Ext.window.Window',
    alias : 'widget.basewindow',

    requires : [ 'WsCme.module.form.DisplayForm', 'WsCme.module.form.NewForm',
        'WsCme.module.form.EditForm', 'WsCme.module.form.AuditingForm',
        'WsCme.module.form.ApproveForm', 'WsCme.module.form.PaymentForm' ],

    layout : 'fit',
    maximizable : true,
    closeAction : 'hide',

    bodyStyle : 'padding : 2px 2px 0',
    shadowOffset : 30,
    layout : 'fit',

    module : undefined,
    formScheme : undefined,
    formtype : undefined, // 当前form的操作类型 display,new,edit,approve

    form : undefined,

    initComponent : function() {
        this.maxHeight = document.body.clientHeight * 0.98;

        var me = this;

        // 这里没有定义，是空的，对于每一个 类型，先判断 formScheme 是否有多个，如果有的话，查找有没有当前类型的
        this.formScheme = this.module.tf_formSchemes[0];
        if (this.module.tf_formSchemes.length > 1) {
            Ext.Array.each(this.module.tf_formSchemes, function(scheme) {
                if (scheme.tf_displayMode == me.formtype) {
                    me.formScheme = scheme;
                    return false;
                }
            });
        }

        var w = this.formScheme.tf_windowWidth;
        var h = this.formScheme.tf_windowHeight;
        // 高度为-1表示是自适应
        if (w == -1 && h == -1) {
            this.width = 600;
            this.height = 400;
            this.maximized = true;
        } else {
            if (w != -1)
                this.width = Math.min(w, document.body.clientWidth - 2);
            if (h != -1)
                this.height = Math.min(h, document.body.clientHeight - 2);
        }
        ;
        if (w == -1 && h != -1) { // 宽度最大化
            this.width = document.body.clientWidth - 40;
        }
        this.icon = this.module.iconURL;
        this.tools = [{

            type : 'gear',
            handler : function(){
                ;
            }

        },



            // {type : 'print', tooltip : '打印当前窗口的内容' },
            // { type : 'help' },
            {
                type : 'collapse',
                tooltip : '当前记录导出至Excel'
            }
            // { type : 'pin' }
        ];

        // 如果有附件，加入附件按钮
        if (this.module.tf_hasAttachment) {
            this.tools.push({
                type : 'search',
                tooltip : '显示附件'
            })
        }
        ;

        // 加入 child module
        var subtoolbars = this.module.tf_moduleSubToolbar;
        if (subtoolbars && subtoolbars.length > 0) {

            this.tools.push({
                type : 'gear',
                tooltip : '子模块操作'
            })
        }

        var param = {
            module : this.module,
            formScheme : this.formScheme
        };

        // 这里没有定义，是空的，对于每一个 类型，先判断 formScheme 是否有多个，如果有的话，查找有没有当前类型的
        if (this.module.tf_formSchemes.length > 1) {
            Ext.Array.each(this.module.tf_formSchemes, function(scheme) {
                if (scheme.tf_displayMode == me.formtype) {
                    param.formScheme = scheme;
                    return false;
                }
            })
        }

        if (this.formtype == 'display') {
            this.form = Ext.create('app.module.form.DisplayForm', param);
        } else if (this.formtype == 'new') {
            this.modal = true;
            this.form = Ext.create('app.module.form.NewForm', param);
        } else if (this.formtype == 'edit') {
            this.modal = true;
            this.form = Ext.create('app.module.form.EditForm', param);
        } else if (this.formtype == 'auditing') {
            this.modal = true;
            this.form = Ext.create('app.module.form.AuditingForm', param);
        } else if (this.formtype == 'approve') {
            this.modal = true;
            this.form = Ext.create('app.module.form.ApproveForm', param);
        } else if (this.formtype == 'payment') {
            this.modal = true;
            this.form = Ext.create('app.module.form.PaymentForm', param);
        }
        this.items = [ this.form ];

        this.callParent(arguments);
    }

});