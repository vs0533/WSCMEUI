/**
 * Created by byron on 2017/6/25.
 */
Ext.define('WsCme.view.main.Header', {
    extend: 'Ext.panel.Panel',
    xtype: 'mainheader',
    viewModel: 'main',
    html: "<img src='resources/images/top.jpg' border='0' style=''/>",
    height: 97,
    tbar: [
        {
            xtype: "tbtext",
            text: '用户：【唐林】身份证号：【37030319820328521X】   所属单位：【淄博市市直机关第一幼儿园】',
            iconCls: "icon_door_in",
            id: "tex_login"
        }
    ]
});