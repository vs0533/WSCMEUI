/**
 * Created by byron on 2017/6/28.
 */
Ext.define('WsCme.view.main.region.Top',{
    extend:'Ext.toolbar.Toolbar',
    xtype:'maintop',
    alias:'widget.maintop',
    requires:['app.ux.ButtonTransparent'],
    defaults:{
        xtype:'buttontransparent'
    },
    style:'border-bottom:1px solid white;backgroud-color:#CAE5E8;padding-right:30px',
    border:'0 0 1 0',
    height:42,
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
            }
        ]
        this.callParent(arguments);
    }

});