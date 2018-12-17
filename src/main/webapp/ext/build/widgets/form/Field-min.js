/*
 * Ext JS Library 2.0.2
 * Copyright(c) 2006-2008, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */

Ext.form.Field = Ext.extend(Ext.BoxComponent, {
	invalidClass :"x-form-invalid",
	invalidText :"The value in this field is invalid",
	focusClass :"x-form-focus",
	validationEvent :"keyup",
	validateOnBlur :true,
	validationDelay :250,
	defaultAutoCreate : {
		tag :"input",
		type :"text",
		size :"20",
		autocomplete :"off"
	},
	fieldClass :"x-form-field",
	msgTarget :"qtip",
	msgFx :"normal",
	readOnly :false,
	disabled :false,
	isFormField :true,
	hasFocus :false,
	initComponent : function() {
		Ext.form.Field.superclass.initComponent.call(this);
		this.addEvents("focus", "blur", "specialkey", "change", "invalid",
				"valid")
	},
	getName : function() {
		return this.rendered && this.el.dom.name ? this.el.dom.name
				: (this.hiddenName || "")
	},
	onRender : function(C, A) {
		Ext.form.Field.superclass.onRender.call(this, C, A);
		if (!this.el) {
			var B = this.getAutoCreate();
			if (!B.name) {
				B.name = this.name || this.id
			}
			if (this.inputType) {
				B.type = this.inputType
			}
			this.el = C.createChild(B, A)
		}
		var D = this.el.dom.type;
		if (D) {
			if (D == "password") {
				D = "text"
			}
			this.el.addClass("x-form-" + D)
		}
		if (this.readOnly) {
			this.el.dom.readOnly = true
		}
		if (this.tabIndex !== undefined) {
			this.el.dom.setAttribute("tabIndex", this.tabIndex)
		}
		this.el.addClass( [ this.fieldClass, this.cls ]);
		this.initValue()
	},
	initValue : function() {
		if (this.value !== undefined) {
			this.setValue(this.value)
		} else {
			if (this.el.dom.value.length > 0) {
				this.setValue(this.el.dom.value)
			}
		}
	},
	isDirty : function() {
		if (this.disabled) {
			return false
		}
		return String(this.getValue()) !== String(this.originalValue)
	},
	afterRender : function() {
		Ext.form.Field.superclass.afterRender.call(this);
		this.initEvents()
	},
	fireKey : function(A) {
		if (A.isSpecialKey()) {
			this.fireEvent("specialkey", this, A)
		}
	},
	reset : function() {
		this.setValue(this.originalValue);
		this.clearInvalid()
	},
	initEvents : function() {
		this.el.on(Ext.isIE ? "keydown" : "keypress", this.fireKey, this);
		this.el.on("focus", this.onFocus, this);
		this.el.on("blur", this.onBlur, this);
		this.originalValue = this.getValue()
	},
	onFocus : function() {
		if (!Ext.isOpera && this.focusClass) {
			this.el.addClass(this.focusClass)
		}
		if (!this.hasFocus) {
			this.hasFocus = true;
			this.startValue = this.getValue();
			this.fireEvent("focus", this)
		}
	},
	beforeBlur :Ext.emptyFn,
	onBlur : function() {
		this.beforeBlur();
		if (!Ext.isOpera && this.focusClass) {
			this.el.removeClass(this.focusClass)
		}
		this.hasFocus = false;
		if (this.validationEvent !== false && this.validateOnBlur
				&& this.validationEvent != "blur") {
			this.validate()
		}
		var A = this.getValue();
		if (String(A) !== String(this.startValue)) {
			this.fireEvent("change", this, A, this.startValue)
		}
		this.fireEvent("blur", this)
	},
	isValid : function(A) {
		if (this.disabled) {
			return true
		}
		var C = this.preventMark;
		this.preventMark = A === true;
		var B = this.validateValue(this.processValue(this.getRawValue()));
		this.preventMark = C;
		return B
	},
	validate : function() {
		if (this.disabled
				|| this.validateValue(this.processValue(this.getRawValue()))) {
			this.clearInvalid();
			return true
		}
		return false
	},
	processValue : function(A) {
		return A
	},
	validateValue : function(A) {
		return true
	},
	markInvalid : function(C) {
		if (!this.rendered || this.preventMark) {
			return
		}
		this.el.addClass(this.invalidClass);
		C = C || this.invalidText;
		switch (this.msgTarget) {
		case "qtip":
			this.el.dom.qtip = C;
			this.el.dom.qclass = "x-form-invalid-tip";
			if (Ext.QuickTips) {
				Ext.QuickTips.enable()
			}
			break;
		case "title":
			this.el.dom.title = C;
			break;
		case "under":
			if (!this.errorEl) {
				var B = this.el.findParent(".x-form-element", 5, true);
				this.errorEl = B.createChild( {
					cls :"x-form-invalid-msg"
				});
				this.errorEl.setWidth(B.getWidth(true) - 20)
			}
			this.errorEl.update(C);
			Ext.form.Field.msgFx[this.msgFx].show(this.errorEl, this);
			break;
		case "side":
			if (!this.errorIcon) {
				var B = this.el.findParent(".x-form-element", 5, true);
				this.errorIcon = B.createChild( {
					cls :"x-form-invalid-icon"
				})
			}
			this.alignErrorIcon();
			this.errorIcon.dom.qtip = C;
			this.errorIcon.dom.qclass = "x-form-invalid-tip";
			this.errorIcon.show();
			this.on("resize", this.alignErrorIcon, this);
			break;
		default:
			var A = Ext.getDom(this.msgTarget);
			A.innerHTML = C;
			A.style.display = this.msgDisplay;
			break
		}
		this.fireEvent("invalid", this, C)
	},
	alignErrorIcon : function() {
		this.errorIcon.alignTo(this.el, "tl-tr", [ 2, 0 ])
	},
	clearInvalid : function() {
		if (!this.rendered || this.preventMark) {
			return
		}
		this.el.removeClass(this.invalidClass);
		switch (this.msgTarget) {
		case "qtip":
			this.el.dom.qtip = "";
			break;
		case "title":
			this.el.dom.title = "";
			break;
		case "under":
			if (this.errorEl) {
				Ext.form.Field.msgFx[this.msgFx].hide(this.errorEl, this)
			}
			break;
		case "side":
			if (this.errorIcon) {
				this.errorIcon.dom.qtip = "";
				this.errorIcon.hide();
				this.un("resize", this.alignErrorIcon, this)
			}
			break;
		default:
			var A = Ext.getDom(this.msgTarget);
			A.innerHTML = "";
			A.style.display = "none";
			break
		}
		this.fireEvent("valid", this)
	},
	getRawValue : function() {
		var A = this.rendered ? this.el.getValue() : Ext.value(this.value, "");
		if (A === this.emptyText) {
			A = ""
		}
		return A
	},
	getValue : function() {
		if (!this.rendered) {
			return this.value
		}
		var A = this.el.getValue();
		if (A === this.emptyText || A === undefined) {
			A = ""
		}
		return A
	},
	setRawValue : function(A) {
		return this.el.dom.value = (A === null || A === undefined ? "" : A)
	},
	setValue : function(A) {
		this.value = A;
		if (this.rendered) {
			this.el.dom.value = (A === null || A === undefined ? "" : A);
			this.validate()
		}
	},
	adjustSize : function(A, C) {
		var B = Ext.form.Field.superclass.adjustSize.call(this, A, C);
		B.width = this.adjustWidth(this.el.dom.tagName, B.width);
		return B
	},
	adjustWidth : function(A, B) {
		A = A.toLowerCase();
		if (typeof B == "number" && !Ext.isSafari) {
			if (Ext.isIE && (A == "input" || A == "textarea")) {
				if (A == "input" && !Ext.isStrict) {
					return this.inEditor ? B : B - 3
				}
				if (A == "input" && Ext.isStrict) {
					return B - (Ext.isIE6 ? 4 : 1)
				}
				if (A = "textarea" && Ext.isStrict) {
					return B - 2
				}
			} else {
				if (Ext.isOpera && Ext.isStrict) {
					if (A == "input") {
						return B + 2
					}
					if (A = "textarea") {
						return B - 2
					}
				}
			}
		}
		return B
	}
});
Ext.form.Field.msgFx = {
	normal : {
		show : function(A, B) {
			A.setDisplayed("block")
		},
		hide : function(A, B) {
			A.setDisplayed(false).update("")
		}
	},
	slide : {
		show : function(A, B) {
			A.slideIn("t", {
				stopFx :true
			})
		},
		hide : function(A, B) {
			A.slideOut("t", {
				stopFx :true,
				useDisplay :true
			})
		}
	},
	slideRight : {
		show : function(A, B) {
			A.fixDisplay();
			A.alignTo(B.el, "tl-tr");
			A.slideIn("l", {
				stopFx :true
			})
		},
		hide : function(A, B) {
			A.slideOut("l", {
				stopFx :true,
				useDisplay :true
			})
		}
	}
};
Ext.reg("field", Ext.form.Field);