/**
 *
 * merge level=20
 *
 * 树的inline筛选,直接在treeitem中进行，不需要发送到服务器
 */

Ext.define('app.lib.TreeSearchField', {
    extend : 'Ext.form.field.Text',

    alias : 'widget.treesearchfield',

    trigger1Cls : Ext.baseCSSPrefix + 'form-clear-trigger',

    trigger2Cls : Ext.baseCSSPrefix + 'form-search-trigger',

    hasSearch : false,

    initComponent : function() {
        var me = this;
        me.callParent(arguments);
        me.on('specialkey', function(f, e) {
            if (e.getKey() == e.ENTER) {
                me.onTrigger2Click();
            }
        });
    },

    afterRender : function() {
        this.callParent();
        this.triggerCell.item(0).setDisplayed(false);
    },

    onTrigger1Click : function() {
        var me = this;
        if (me.hasSearch) {
            me.setValue('');
            //me.treePanel.clearFilter();
            me.treePanel.filterByText('');
            me.hasSearch = false;
            me.triggerCell.item(0).setDisplayed(false);
            me.updateLayout();
        }
    },

    onTrigger2Click : function() {
        var me = this, value = me.getValue();
        if (value.length > 0) {
            me.treePanel.filterByText(value);
            me.hasSearch = true;
            me.triggerCell.item(0).setDisplayed(true);
            me.updateLayout();
        } else
            me.onTrigger1Click();
    }
});