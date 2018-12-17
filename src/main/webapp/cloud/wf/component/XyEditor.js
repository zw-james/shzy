Ext.XyEditor = function(B, A) {
	this.field = B;
	B.outterEditor = this;
	Ext.XyEditor.superclass.constructor.call(this, A)
};
Ext.extend(Ext.XyEditor, Ext.Component, {
	value : "",
	alignment : "c-c?",
	shadow : "frame",
	constrain : false,
	swallowKeys : true,
	completeOnEnter : false,
	cancelOnEsc : false,
	updateEl : false,
	initComponent : function() {
		Ext.XyEditor.superclass.initComponent.call(this);
		this.addEvents("beforestartedit", "startedit", "beforecomplete",
				"complete", "specialkey")
	},
	onRender : function(B, A) {
		this.el = new Ext.Layer({
					shadow : this.shadow,
					cls : "x-editor",
					parentEl : B,
					shim : this.shim,
					shadowOffset : 4,
					id : this.id,
					constrain : this.constrain
				});
		this.el.setStyle("overflow", Ext.isGecko ? "auto" : "hidden");
		if (this.field.msgTarget != "title") {
			this.field.msgTarget = "qtip"
		}
		this.field.inEditor = true;
		this.field.render(this.el);
		if (Ext.isGecko) {
			this.field.el.dom.setAttribute("autocomplete", "off")
		}
		this.field.on("specialkey", this.onSpecialKey, this);
		if (this.swallowKeys) {
			this.field.el.swallowEvent(["keydown", "keypress"])
		}
		this.field.show();
		this.field.on("blur", this.onBlur, this);
		if (this.field.grow) {
			this.field.on("autosize", this.el.sync, this.el, {
						delay : 1
					})
		}
	},
	onSpecialKey : function(B, A) {
		if (this.completeOnEnter && A.getKey() == A.ENTER) {
			A.stopEvent();
			this.completeEdit()
		} else {
			if (this.cancelOnEsc && A.getKey() == A.ESC) {
				this.cancelEdit()
			} else {
				this.fireEvent("specialkey", B, A)
			}
		}
	},
	startEdit : function(B, C) {
		if (this.field.disabled) {
			return;
		}
		if (this.editing) {
			this.completeEdit()
		}
		this.boundEl = Ext.get(B);
		var A = C !== undefined ? C : this.boundEl.dom.innerHTML;
		if (!this.rendered) {
			this.render(this.parentEl || document.body)
		}
		if (this.fireEvent("beforestartedit", this, this.boundEl, A) === false) {
			return
		}
		this.startValue = A;
		this.field.setValue(A);
		this.doAutoSize();
		this.el.alignTo(this.boundEl, this.alignment);
		this.editing = true;
		this.show()
	},
	doAutoSize : function() {
		if (this.autoSize) {
			var A = this.boundEl.getSize();
			switch (this.autoSize) {
				case "width" :
					this.setSize(A.width, "");
					break;
				case "height" :
					this.setSize("", A.height);
					break;
				default :
					this.setSize(A.width, A.height)
			}
		}
	},
	setSize : function(A, B) {
		delete this.field.lastSize;
		this.field.setSize(A, B);
		if (this.el) {
			this.el.sync()
		}
	},
	realign : function() {
		this.el.alignTo(this.boundEl, this.alignment)
	},
	completeEdit : function(A) {
		if (!this.editing) {
			return
		}
		var B = this.getValue();
		if (this.revertInvalid !== false && !this.field.isValid()) {
			B = this.startValue;
			this.cancelEdit(true)
		}

		if (this.fireEvent("beforecomplete", this, B, this.startValue) !== false) {
			this.editing = false;
			if (this.updateEl && this.boundEl) {
				this.boundEl.update(B)
			}
			if (A !== true) {
				this.hide()
			}
			this.fireEvent("complete", this, B, this.startValue)
		}
	},
	onShow : function() {
		this.el.show();
		if (this.hideEl !== false) {
			this.boundEl.hide()
		}
		this.field.show();
		if (Ext.isIE && !this.fixIEFocus) {
			this.fixIEFocus = true;
			this.deferredFocus.defer(50, this)
		} else {
			this.field.focus()
		}
		this.fireEvent("startedit", this.boundEl, this.startValue)
	},
	deferredFocus : function() {
		if (this.editing) {
			this.field.focus()
		}
	},
	cancelEdit : function(A) {
		if (this.editing) {
			this.setValue(this.startValue);
			if (A !== true) {
				this.hide()
			}
		}
	},
	onBlur : function() {
		if (this.field.allowBlur === true) {
			this.field.blur();
			this.el.hide();
		}
		if (this.field.allowBlur !== true && this.editing) {
			this.completeEdit()
		}
	},
	onHide : function() {
		if (this.editing) {
			this.completeEdit();
			return
		}
		this.field.blur();
		if (this.field.collapse) {
			this.field.collapse()
		}
		this.el.hide();
		if (this.hideEl !== false) {
			this.boundEl.show()
		}
	},
	setValue : function(A) {
		this.field.setValue(A);
	},
	getValue : function() {
		return this.field.getValue();
	},
	beforeDestroy : function() {
		this.field.destroy();
		this.field = null
	}
});