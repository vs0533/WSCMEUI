/**
 * 模块的一个图像字段，显示成16*16的图，然后tooltip可以显示大图
 */

Ext.define('WsCme.module.widget.column.ImageColumn',
		{
			extend : 'Ext.grid.column.Column',
			alias : 'widget.imagecolumn',
			align : 'center',
			sortable : false,
			menuDisabled : true,
			text : '<span class="fa fa-file-image-o"></span>',
			renderer : function(value, metaData, record, rowIndex, colIndex, store,
					view) {
				if (value) {
					var bytes = new Uint8Array(value.length);
					for (var i = 0; i < value.length; i++)
						bytes[i] = value[i];
					var blob = new Blob([ bytes ], {
						type : 'image/png'
					});
					var url = URL.createObjectURL(blob);
					metaData.tdAttr = 'data-qtip="' + "<img class='icon256_256'  src='"
							+ url + "' />" + '"';
					return '<img class="icon16_16" src="' + url + '" />';
				}
			}
		})
		
/**
 * 取得图像宽度的高度的，但是是异步的， var imgTesting = new Image();
 * 
 * function CreateDelegate(contextObject, delegateMethod) { return function() {
 * return delegateMethod.apply(contextObject, arguments); } }
 * 
 * function imgTesting_onload() { alert(this.width + " by " + this.height); }
 * imgTesting.onload = CreateDelegate(imgTesting, imgTesting_onload);
 * imgTesting.src = 'yourimage.jpg';
 */
