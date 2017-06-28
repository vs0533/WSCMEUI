/**
 * Created by byron on 2017/6/28.
 */
Ext.define('WsCme.view.main.region.Top',{
    extend:'Ext.toolbar.Toolbar',
    xtype:'maintop',
    alias:'widget.maintop',
    requires:[
        'app.ux.ButtonTransparent',
        'app.ux.ThemeSelect',
        'Ext.toolbar.Spacer','Ext.toolbar.Fill', 'Ext.toolbar.Separator', 'Ext.Img', 'Ext.form.Label'
    ],
    defaults:{
        xtype:'buttontransparent'
    },
    style:'border-bottom:1px solid #e1e1e1;backgroud-color:#ffffff;padding-right:30px',
    border:'0 0 1 0',
    height:55,
    initComponent:function(){
        console.log('top region init');
        this.items = [
            {
                xtype:'image',
                height:'35px',
                width:'22px',
                src:'/resources/images/system/sencha_logo_thumb.png'
            },
            {
                xtype:'label',
                bind:{
                    text:"{systemInfo.tf_systemName}"
                },
                style:'font-size:20px;color:blank;'
            },
            {
                xtype:'label',
                style:'color:grey',
                bind:{
                    text:"Ver:1.0.0"
                }
            },
            '->',
            {
                xtype:'buttonmainmenu',
                hidden:true,
                bind:{
                    hidden:'{!isButtonMenu}'
                }
            },' ',' ',
            {
                text:'首页',
                // iconCls:'fa fa-home',
                glyph:0xf015
            },
            {
                xtype : 'settingmenu'
            },
            {
                text : '帮助',
                glyph : 0xf128,handler : function(button){
                    // console.log(Ext.getCmp('appviewport'));
                    // console.log(button.up('app-main'));
                }
            }, {
                text : '关于',
                glyph:0xf06a,
                handler : function(){
                    // Ext.create('app.view.main.widget.Gojs').show();
                }
            }, '->', '->',
            // {
            //     text : '搜索',
            //     iconCls : 'fa fa-search',
            //     disabled : true
            // },
            {
                text : '注销',
                glyph : 0xf08b,
                handler : 'logout'
            }
            // , ' ', {
            //     xtype : 'themeselectregion'
            // }
        ]
        this.callParent(arguments);
    }

});