/**
 * merge level=25
 */

Ext.define('WsCme.module.widget.GridSearchField', {
			extend : 'Ext.ux.form.SearchField',
			alias : 'widget.gridsearchfield',
			focusWidth : 120,
			blurWidth : 60,
			listeners : {
				focus : function(field) {
					field.getEl().animate({
								to : {
									width : field.focusWidth
								},
								listeners : {
									afteranimate : function() {
										field.setWidth(field.focusWidth);
										//field.ownerCt.doLayout();
									}
								}
							})

				},
				blur : function(field) {
					if (field.getValue().length == 0)
						field.getEl().animate({
									to : {
										width : field.blurWidth
									},
									listeners : {
										afteranimate : function() {
											field.setWidth(field.blurWidth);
											//field.ownerCt.doLayout();
										}
									}
								})
				}
			}
		})