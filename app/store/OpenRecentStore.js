/**
 * Created by byron on 2017/7/1.
 */
Ext.define('WsCme.store.OpenRecentStore', {
    extend : 'Ext.data.Store',

    alias : 'store.openrecentstore',

    requires : [ 'WsCme.model.OpenRecentModel' ],

    autoLoad : false,

    model : 'WsCme.model.OpenRecentModel',

    proxy : {
        type : 'localstorage',
        id : getContextPath() + '/openRecentStore'
    },

    listeners11 : {
        load : function(records) {
            console.log(records);
        }
    }
})
