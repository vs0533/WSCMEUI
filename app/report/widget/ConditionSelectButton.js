/**
 * merge level=32
 * 
 * 一个 选择的条件的 grid
 */
Ext.define('app.report.widget.ConditionSelectButton', {
			extend : 'Ext.button.Button',

			alias : 'widget.conditionselectbutton',

			firstText : null,

			initComponent : function() {

				this.callParent(arguments);
			},

			// 如果选中了，那么就把选中的数字放在后面，一目了然

			updateTextNumber : function(n) {
				var cn = '①②③④⑤⑥⑦⑧⑨⑩';
				if (!this.firstText)
					this.firstText = this.text;
				if (n > 0)
					this.setText(this.firstText + '<font color="red"> '
							+ (n <= 10 ? cn.substr(n - 1, 1) : '(' + n + ')') + '</font>');
				else
					this.setText(this.firstText)
			}
		})