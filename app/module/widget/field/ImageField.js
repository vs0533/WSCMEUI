Ext.define('WsCme.module.widget.field.ImageField', {
	extend : 'Ext.form.field.Base',
	alias : 'widget.imagefield',
	fieldSubTpl1 : [
			'<img id="{id}" height="auto" width="100%" '
					+ 'src="{imageurl}" class="{fieldCls}" />', {
				compiled : true,
				disableFormats : true
			} ],
	hideLabel : true,

	fieldCls : Ext.baseCSSPrefix + 'form-image-field',
	value : null,
	imageurl : '#',

	setValue : function(value) {
		this.callParent(arguments);
		if (value) {
			var bytes = new Uint8Array(value.length);
			for (var i = 0; i < value.length; i++)
				bytes[i] = value[i];
			var blob = new Blob([ bytes ], {
				type : 'image/jpg'
			});
			this.imageurl = URL.createObjectURL(blob);
		} else {
			this.imageurl = 'images/system/noimage.png';
		}
		// if (this.bodyEl)
		// this.bodyEl.dom.childNodes[1].src = this.imageurl;
		this.up('imagefieldcontainer').setSrc(this.imageurl)
	},

	onRender : function() {
		var me = this;
		me.callParent(arguments);

		var name = me.name || Ext.id();

		me.hiddenField = me.inputEl.insertSibling({
			tag : 'input',
			type : 'hidden',
			name : name
		});

		me.setValue(me.value);
	},

	getSubTplData : function(fieldData) {
		var me = this, type = me.inputType;
		var inputId = me.getInputId(), data, ariaAttr;

		data = Ext.apply({
			ui : me.ui,
			imageurl : this.imageurl,
			id : inputId,
			cmpId : me.id,
			name : me.name || inputId,
			disabled : me.disabled,
			readOnly : me.readOnly,
			value : me.getRawValue(),
			type : type,
			fieldCls : me.fieldCls,
			fieldStyle : me.getFieldStyle(),
			childElCls : fieldData.childElCls,
			tabIdx : me.tabIndex,
			inputCls : me.inputCls,
			typeCls : Ext.baseCSSPrefix + 'form-' + (me.isTextInput ? 'text' : type)
		}, me.subTplData);

		me.getInsertionRenderData(data, me.subTplInsertions);

		return data;
	},

	_click : function(e, o) {
		console.log('click');
		this.fireEvent('click', this, e);
	}
});
