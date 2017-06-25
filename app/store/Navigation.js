/**
 * Created by byron on 2017/6/25.
 */
Ext.define('WsCme.store.Navigation', {
    extend: 'Ext.data.TreeStore',
    alias: 'store.navigation',
    proxy: {
        type: 'ajax',
        url: WsCme.config.Config.apiServiceUrl + '/api/Values',
        // extraParams:{node:""},
        headers:WsCme.config.Config.headers ,
        reader: {
            type: 'json'
            //rootProperty: 'items'
        }
    },
    root: {
        expanded: true
    }
});