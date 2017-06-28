/**
 * Created by byron on 2017/6/28.
 */
/**
 * merge level=20
 *
 * Add basic filtering to Ext.tree.Panel. Add as a mixin: mixins: { treeFilter:
 * 'MyApp.lib.TreeFilter' }
 */
Ext.define('app.lib.TreeFilter', {
    filterByText : function(text) {
        this.filterBy(text, 'text');
    },

    filterBy : function(text, by) {
        var tree = this, v, matches = 0;
        try {
            v = new RegExp(text, 'i');
            Ext.suspendLayouts();
            tree.store.filter({
                filterFn : function(node) {

                    var parentvisible = false;
                    var pnode = node;
                    while (pnode = pnode.parentNode) {
                        if (pnode != tree.getRootNode()) {
                            parentvisible = v.test(pnode.get(by));
                            if (parentvisible)
                                break;
                        }
                    }

                    var children = node.childNodes, len = children && children.length, i;
                    var visible = node.isLeaf() ? v.test(node.get(by)) : false;

                    for (i = 0; i < len && !(visible = children[i].get('visible')); i++)
                        ;

                    if (visible && node.isLeaf()) {
                        matches++;
                    }
                    return visible || parentvisible;
                },
                id : 'titleFilter'
            });
            // tree.down('#matches').setValue(matches);
            Ext.resumeLayouts(true);
        } catch (e) {
            this.markInvalid('Invalid regular expression');
        }
    }
});