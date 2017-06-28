/**
 * Created by byron on 2017/6/28.
 */
Ext.define('WsCme.view.main.widget.Monetary', {
    statics : {
        values : null,
        getAllMonetary : function() {
            if (!this.values) {
                // 初始化各种金额单位 元 千元 万元 百万元 亿元
                this.values = new Ext.util.MixedCollection();
                this.values.add('unit', this.createAMonetary('', 1, '个'));
                this.values.add('thousand', this.createAMonetary('千', 1000, '千'));
                this.values.add('tenthousand', this.createAMonetary('万', 10000,
                    '万'));
                this.values.add('million', this.createAMonetary('M', 100 * 10000,
                    '百万'));
                this.values.add('hundredmillion', this.createAMonetary('亿', 10000
                    * 10000, '亿'));
            }
            return this.values;
        },

        // 生成菜单中的 items
        getMonetaryMenu : function() {
            var items = [];
            this.getAllMonetary().eachKey(function(key, item) {
                items.push({
                    text : item.unitText,
                    value : key
                });
            });
            return items;
        },

        createAMonetary : function(monetaryText, monetaryUnit, unitText) {
            return {
                monetaryText : monetaryText, // 跟在数值后面的金额单位文字,如 100.00万
                monetaryUnit : monetaryUnit, // 显示的数值需要除的分子
                unitText : unitText  // 跟在字段后面的单位如 合同金额(万元)
            };
        },

        getMonetary : function(key) {
            return this.getAllMonetary().get(key);
        }
    }

});