Ext.define('WsCme.module.widget.field.ImageFieldContainer', {
	extend : 'Ext.container.Container',
	alias : 'widget.imagefieldcontainer',

	layout : 'border',
	border : 1,
	style : {
		align : 'center',
		borderColor : 'gray',
		borderStyle : 'solid',
		borderWidth : '1px'
	},
	height : 225,
	width : 150,

	initComponent : function() {
		var me = this;
		this.canContextMenu = this.formtype == 'edit' || this.formtype == 'new';
		if (this.canContextMenu) {
			this.menu = Ext.create('Ext.menu.Menu',
					{
						imagefieldcontainer : me,
						items : [
								{
									text : '选择图像文件',
									iconCls : 'fa fa-file-image-o',
									tooltip : '请选择小于120K的类型为.jpg .jpeg .gif .bmp .png的文件',
									handler : function(item) {
										var c = item.ownerCt.imagefieldcontainer;
										var uploadfield = c.down('fileuploadfield');
										var field = document.getElementById(uploadfield.id);
										var inputs = field.getElementsByTagName('input');
										var fileInput = null;
										var il = inputs.length;
										for (var i = 0; i < il; i++) {
											if (inputs[i].type == 'file') {
												fileInput = inputs[i];
												break;
											}
										}
										fileInput.click();
									}
								},
								'-',
								{
									iconCls : 'fa fa-trash-o',
									text : '清除图像',
									handler : function(item) {
										var c = item.ownerCt.imagefieldcontainer;
										c.down('imagefield').setValue(null);
										c.down('fileuploadfield').reset();
									}
								},
								'-',
								{
									iconCls : 'fa fa-external-link',
									text : '在新窗口中打开图像',
									handler : function(item) {
										var url = item.ownerCt.imagefieldcontainer
												.down('imagefield').imageurl;
										if (url && url != '#') {
											window.open(url, '_image_show_window');
										} else
											Ext.toastWarn('当前图片文件为空!');
									}
								} ]
					})
		}
		;
		if (this.fieldDefine.tf_otherSetting) {
			var otherSetting = Ext.decode('{' + this.fieldDefine.tf_otherSetting
					+ '}', true);
			if (otherSetting && otherSetting.formfield)
				Ext.apply(this, otherSetting.formfield);
		}

		if (this.formField.tf_otherSetting) {
			var otherSetting = Ext.decode('{' + this.formField.tf_otherSetting + '}',
					true);
			if (otherSetting)
				Ext.apply(this, otherSetting);
		}

		this.items = [ {
			hidden : true,
			autoRender : true,
			region : 'west',
			xtype : 'container',
			items : [ this.field ]
		}, {
			xtype : 'container',
			region : 'center',
			layout : 'fit',
			items : [ {
				xtype : 'image',
				canContextMenu : this.canContextMenu,
				listeners : {
					render : function(image) {
						if (image.canContextMenu) {
							image.el.on('contextmenu', function(e, image) {
								e.preventDefault();
								me.menu.showAt(e.getXY());
							});
							image.el.on('click', function(e, image) {
								me.menu.showAt(e.getXY());
							})
						}
					}
				}
			} ]
		} ];
		if (this.canContextMenu)
			this.items.push({
				xtype : 'form',
				hidden : true,
				autoRender : true,
				items : [ {
					xtype : 'fileuploadfield',
					name : 'file',
					submitValue : false,
					width : 32,
					buttonOnly : true,
					hideLabel : true,
					listeners : {
						change : function(formfield, value) {
							var allImgExt = ".jpg .jpeg .gif .bmp .png ";
							var fileExt = value.substr(value.lastIndexOf(".")).toLowerCase();
							if (allImgExt.indexOf(fileExt + " ") != -1) {
								var field = document.getElementById(formfield.id);
								var inputs = field.getElementsByTagName('input');
								var fileInput = null;
								var il = inputs.length;
								for (var i = 0; i < il; i++)
									if (inputs[i].type == 'file') {
										fileInput = inputs[i];
										break;
									}
								if (fileInput != null) {
									var fileSize = getFileSize(fileInput);
									if (fileSize > 120) {
										Ext.Msg.alert('提示', '图片文件太大，请选择小于120K的图片文件！');
										formfield.setRawValue('');
										return;
									}
								}
								if (Ext.isIE) {
									var form = formfield.up('form');
									form
											.submit({
												url : 'module/uploadimagefileandreturn.do',
												waitMsg : '正在生成预览文件，请稍候...',
												success : function(form, action) {
													var success = action.result.success;
													if (success) {
														Ext.toastInfo('所选的文件已成功上传!');
														formfield.up('imagefieldcontainer').down(
																'imagefield').setValue(action.result.msg);
													}
												},
												failure : function(form, action) {
													if (action.response.responseText
															.indexOf('MaxUploadSize'))
														Ext.MessageBox.show({
															title : '上传文件失败',
															msg : '失败原因:上传文件的大小超过了120K,请重新上传...',
															buttons : Ext.MessageBox.OK,
															icon : Ext.MessageBox.ERROR
														});
													else
														Ext.Msg.alert('上传文件失败',
																action.response.responseText);
												}
											})
								} else {
									if (window.FileReader) {
										var file = fileInput.files[0];
										if (typeof file == 'object') {
											var filename = fileInput.name.split(".")[0];
											var reader = new FileReader();
											reader.onload = function(event) {
												var contents = event.target.result;
												formfield.up('imagefieldcontainer').down('imagefield')
														.setValue(stringToBytes(contents));
											}
											reader.readAsBinaryString(file);
										} else
											// 取消了选择的文件
											;
									}
								}
							} else {
								Ext.toastWarn('只能上传后缀为:' + allImgExt + "的图片文件!");
							}
						}
					}
				} ]
			});

		this.callParent(arguments);
	},

	setSrc : function(url) {
		if (this.down('image'))
			this.down('image').setSrc(url);
	}

});

/**
 * 字符串转换成 bytes[]
 * 
 * @param str
 * @returns {Array}
 */
function stringToBytes(str) {
	var result = [];
	for (var i = 0; i < str.length; i++) {
		result.push(str.charCodeAt(i));
	}
	return result;

}

// 计算文件大小，返回文件大小值，单位K
function getFileSize(target) {
	var isIE = /msie/i.test(navigator.userAgent) && !window.opera;
	var fs = 0;
	if (isIE && !target.files) {
		var filePath = target.value;
		var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
		var file = fileSystem.GetFile(filePath);
		fs = file.Size;
	} else if (target.files && target.files.length > 0) {
		fs = target.files[0].size;
	} else {
		fs = 0;
	}
	if (fs > 0) {
		fs = fs / 1024;
	}
	return fs;
}
