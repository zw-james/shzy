/*
 * Ext JS Library 2.0.2
 * Copyright(c) 2006-2008, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */

Ext.tree.TreeLoader = function(A) {
	this.baseParams = {};
	this.requestMethod = "POST";
	Ext.apply(this, A);
	this.addEvents("beforeload", "load", "loadexception");
	Ext.tree.TreeLoader.superclass.constructor.call(this)
};
Ext.extend(Ext.tree.TreeLoader, Ext.util.Observable, {
	uiProviders : {},
	clearOnLoad :true,
	load : function(A, B) {
		if (this.clearOnLoad) {
			while (A.firstChild) {
				A.removeChild(A.firstChild)
			}
		}
		if (this.doPreload(A)) {
			if (typeof B == "function") {
				B()
			}
		} else {
			if (this.dataUrl || this.url) {
				this.requestData(A, B)
			}
		}
	},
	doPreload : function(D) {
		if (D.attributes.children) {
			if (D.childNodes.length < 1) {
				var C = D.attributes.children;
				D.beginUpdate();
				for ( var B = 0, A = C.length; B < A; B++) {
					var E = D.appendChild(this.createNode(C[B]));
					if (this.preloadChildren) {
						this.doPreload(E)
					}
				}
				D.endUpdate()
			}
			return true
		} else {
			return false
		}
	},
	getParams : function(D) {
		var A = [], C = this.baseParams;
		for ( var B in C) {
			if (typeof C[B] != "function") {
				A.push(encodeURIComponent(B), "=", encodeURIComponent(C[B]),
						"&")
			}
		}
		A.push("node=", encodeURIComponent(D.id));
		return A.join("")
	},
	requestData : function(A, B) {
		if (this.fireEvent("beforeload", this, A, B) !== false) {
			this.transId = Ext.Ajax.request( {
				method :this.requestMethod,
				url :this.dataUrl || this.url,
				success :this.handleResponse,
				failure :this.handleFailure,
				scope :this,
				argument : {
					callback :B,
					node :A
				},
				params :this.getParams(A)
			})
		} else {
			if (typeof B == "function") {
				B()
			}
		}
	},
	isLoading : function() {
		return this.transId ? true : false
	},
	abort : function() {
		if (this.isLoading()) {
			Ext.Ajax.abort(this.transId)
		}
	},
	createNode : function(attr) {
		if (this.baseAttrs) {
			Ext.applyIf(attr, this.baseAttrs)
		}
		if (this.applyLoader !== false) {
			attr.loader = this
		}
		if (typeof attr.uiProvider == "string") {
			attr.uiProvider = this.uiProviders[attr.uiProvider]
					|| eval(attr.uiProvider)
		}
		return (attr.leaf ? new Ext.tree.TreeNode(attr)
				: new Ext.tree.AsyncTreeNode(attr))
	},
	processResponse : function(response, node, callback) {
		var json = response.responseText;
		try {
			var o = eval("(" + json + ")");
			node.beginUpdate();
			for ( var i = 0, len = o.length; i < len; i++) {
				var n = this.createNode(o[i]);
				if (n) {
					node.appendChild(n)
				}
			}
			node.endUpdate();
			if (typeof callback == "function") {
				callback(this, node)
			}
		} catch (e) {
			this.handleFailure(response)
		}
	},
	handleResponse : function(B) {
		this.transId = false;
		var A = B.argument;
		this.processResponse(B, A.node, A.callback);
		this.fireEvent("load", this, A.node, B)
	},
	handleFailure : function(B) {
		this.transId = false;
		var A = B.argument;
		this.fireEvent("loadexception", this, A.node, B);
		if (typeof A.callback == "function") {
			A.callback(this, A.node)
		}
	}
});