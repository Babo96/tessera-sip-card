// node_modules/@lit/reactive-element/css-tag.js
var e = globalThis, t = e.ShadowRoot && (e.ShadyCSS === void 0 || e.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, n = Symbol(), r = /* @__PURE__ */ new WeakMap(), i = class {
	constructor(e, t, r) {
		if (this._$cssResult$ = !0, r !== n) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
		this.cssText = e, this.t = t;
	}
	get styleSheet() {
		let e = this.o, n = this.t;
		if (t && e === void 0) {
			let t = n !== void 0 && n.length === 1;
			t && (e = r.get(n)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), t && r.set(n, e));
		}
		return e;
	}
	toString() {
		return this.cssText;
	}
}, a = (e) => new i(typeof e == "string" ? e : e + "", void 0, n), o = (e, ...t) => new i(e.length === 1 ? e[0] : t.reduce((t, n, r) => t + ((e) => {
	if (!0 === e._$cssResult$) return e.cssText;
	if (typeof e == "number") return e;
	throw Error("Value passed to 'css' function must be a 'css' function result: " + e + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
})(n) + e[r + 1], e[0]), e, n), s = (n, r) => {
	if (t) n.adoptedStyleSheets = r.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
	else for (let t of r) {
		let r = document.createElement("style"), i = e.litNonce;
		i !== void 0 && r.setAttribute("nonce", i), r.textContent = t.cssText, n.appendChild(r);
	}
}, c = t ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((e) => {
	let t = "";
	for (let n of e.cssRules) t += n.cssText;
	return a(t);
})(e) : e, { is: l, defineProperty: u, getOwnPropertyDescriptor: d, getOwnPropertyNames: f, getOwnPropertySymbols: ee, getPrototypeOf: p } = Object, m = globalThis, te = m.trustedTypes, h = te ? te.emptyScript : "", g = m.reactiveElementPolyfillSupport, ne = (e, t) => e, re = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? h : null;
				break;
			case Object:
			case Array: e = e == null ? e : JSON.stringify(e);
		}
		return e;
	},
	fromAttribute(e, t) {
		let n = e;
		switch (t) {
			case Boolean:
				n = e !== null;
				break;
			case Number:
				n = e === null ? null : Number(e);
				break;
			case Object:
			case Array: try {
				n = JSON.parse(e);
			} catch {
				n = null;
			}
		}
		return n;
	}
}, ie = (e, t) => !l(e, t), ae = {
	attribute: !0,
	type: String,
	converter: re,
	reflect: !1,
	useDefault: !1,
	hasChanged: ie
};
Symbol.metadata ??= Symbol("metadata"), m.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var oe = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = ae) {
		if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
			let n = Symbol(), r = this.getPropertyDescriptor(e, n, t);
			r !== void 0 && u(this.prototype, e, r);
		}
	}
	static getPropertyDescriptor(e, t, n) {
		let { get: r, set: i } = d(this.prototype, e) ?? {
			get() {
				return this[t];
			},
			set(e) {
				this[t] = e;
			}
		};
		return {
			get: r,
			set(t) {
				let a = r?.call(this);
				i?.call(this, t), this.requestUpdate(e, a, n);
			},
			configurable: !0,
			enumerable: !0
		};
	}
	static getPropertyOptions(e) {
		return this.elementProperties.get(e) ?? ae;
	}
	static _$Ei() {
		if (this.hasOwnProperty(ne("elementProperties"))) return;
		let e = p(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(ne("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(ne("properties"))) {
			let e = this.properties, t = [...f(e), ...ee(e)];
			for (let n of t) this.createProperty(n, e[n]);
		}
		let e = this[Symbol.metadata];
		if (e !== null) {
			let t = litPropertyMetadata.get(e);
			if (t !== void 0) for (let [e, n] of t) this.elementProperties.set(e, n);
		}
		this._$Eh = /* @__PURE__ */ new Map();
		for (let [e, t] of this.elementProperties) {
			let n = this._$Eu(e, t);
			n !== void 0 && this._$Eh.set(n, e);
		}
		this.elementStyles = this.finalizeStyles(this.styles);
	}
	static finalizeStyles(e) {
		let t = [];
		if (Array.isArray(e)) {
			let n = new Set(e.flat(1 / 0).reverse());
			for (let e of n) t.unshift(c(e));
		} else e !== void 0 && t.push(c(e));
		return t;
	}
	static _$Eu(e, t) {
		let n = t.attribute;
		return !1 === n ? void 0 : typeof n == "string" ? n : typeof e == "string" ? e.toLowerCase() : void 0;
	}
	constructor() {
		super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
	}
	_$Ev() {
		this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
	}
	addController(e) {
		(this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
	}
	removeController(e) {
		this._$EO?.delete(e);
	}
	_$E_() {
		let e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
		for (let n of t.keys()) this.hasOwnProperty(n) && (e.set(n, this[n]), delete this[n]);
		e.size > 0 && (this._$Ep = e);
	}
	createRenderRoot() {
		let e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
		return s(e, this.constructor.elementStyles), e;
	}
	connectedCallback() {
		this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
	}
	enableUpdating(e) {}
	disconnectedCallback() {
		this._$EO?.forEach((e) => e.hostDisconnected?.());
	}
	attributeChangedCallback(e, t, n) {
		this._$AK(e, n);
	}
	_$ET(e, t) {
		let n = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, n);
		if (r !== void 0 && !0 === n.reflect) {
			let i = (n.converter?.toAttribute === void 0 ? re : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? re : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? ie)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
			this.C(e, t, n);
		}
		!1 === this.isUpdatePending && (this._$ES = this._$EP());
	}
	C(e, t, { useDefault: n, reflect: r, wrapped: i }, a) {
		n && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, a ?? t ?? this[e]), !0 !== i || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || n || (t = void 0), this._$AL.set(e, t)), !0 === r && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
	}
	async _$EP() {
		this.isUpdatePending = !0;
		try {
			await this._$ES;
		} catch (e) {
			Promise.reject(e);
		}
		let e = this.scheduleUpdate();
		return e != null && await e, !this.isUpdatePending;
	}
	scheduleUpdate() {
		return this.performUpdate();
	}
	performUpdate() {
		if (!this.isUpdatePending) return;
		if (!this.hasUpdated) {
			if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
				for (let [e, t] of this._$Ep) this[e] = t;
				this._$Ep = void 0;
			}
			let e = this.constructor.elementProperties;
			if (e.size > 0) for (let [t, n] of e) {
				let { wrapped: e } = n, r = this[t];
				!0 !== e || this._$AL.has(t) || r === void 0 || this.C(t, void 0, n, r);
			}
		}
		let e = !1, t = this._$AL;
		try {
			e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((e) => e.hostUpdate?.()), this.update(t)) : this._$EM();
		} catch (t) {
			throw e = !1, this._$EM(), t;
		}
		e && this._$AE(t);
	}
	willUpdate(e) {}
	_$AE(e) {
		this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
	}
	_$EM() {
		this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
	}
	get updateComplete() {
		return this.getUpdateComplete();
	}
	getUpdateComplete() {
		return this._$ES;
	}
	shouldUpdate(e) {
		return !0;
	}
	update(e) {
		this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
	}
	updated(e) {}
	firstUpdated(e) {}
};
oe.elementStyles = [], oe.shadowRootOptions = { mode: "open" }, oe[ne("elementProperties")] = /* @__PURE__ */ new Map(), oe[ne("finalized")] = /* @__PURE__ */ new Map(), g?.({ ReactiveElement: oe }), (m.reactiveElementVersions ??= []).push("2.1.2");
// node_modules/lit-html/lit-html.js
var _ = globalThis, se = (e) => e, ce = _.trustedTypes, le = ce ? ce.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, ue = "$lit$", v = `lit$${Math.random().toFixed(9).slice(2)}$`, de = "?" + v, fe = `<${de}>`, pe = document, me = () => pe.createComment(""), he = (e) => e === null || typeof e != "object" && typeof e != "function", ge = Array.isArray, _e = (e) => ge(e) || typeof e?.[Symbol.iterator] == "function", ve = "[ 	\n\f\r]", ye = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, be = /-->/g, xe = />/g, y = RegExp(`>|${ve}(?:([^\\s"'>=/]+)(${ve}*=${ve}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), Se = /'/g, Ce = /"/g, we = /^(?:script|style|textarea|title)$/i, Te = (e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}), b = Te(1), Ee = Te(2), De = Symbol.for("lit-noChange"), x = Symbol.for("lit-nothing"), Oe = /* @__PURE__ */ new WeakMap(), ke = pe.createTreeWalker(pe, 129);
function Ae(e, t) {
	if (!ge(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return le === void 0 ? t : le.createHTML(t);
}
var je = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = ye;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === ye ? c[1] === "!--" ? o = be : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = y) : (we.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = y) : o = xe : o === y ? c[0] === ">" ? (o = i ?? ye, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? y : c[3] === "\"" ? Ce : Se) : o === Ce || o === Se ? o = y : o === be || o === xe ? o = ye : (o = y, i = void 0);
		let d = o === y && e[t + 1].startsWith("/>") ? " " : "";
		a += o === ye ? n + fe : l >= 0 ? (r.push(s), n.slice(0, l) + ue + n.slice(l) + v + d) : n + v + (l === -2 ? t : d);
	}
	return [Ae(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, Me = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = je(t, n);
		if (this.el = e.createElement(l, r), ke.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = ke.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(ue)) {
					let t = u[o++], n = i.getAttribute(e).split(v), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? Le : r[1] === "?" ? Re : r[1] === "@" ? ze : Ie
					}), i.removeAttribute(e);
				} else e.startsWith(v) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (we.test(i.tagName)) {
					let e = i.textContent.split(v), t = e.length - 1;
					if (t > 0) {
						i.textContent = ce ? ce.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], me()), ke.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], me());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === de) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(v, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += v.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = pe.createElement("template");
		return n.innerHTML = e, n;
	}
};
function Ne(e, t, n = e, r) {
	if (t === De) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = he(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = Ne(e, i._$AS(e, t.values), i, r)), t;
}
var Pe = class {
	constructor(e, t) {
		this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
	}
	get parentNode() {
		return this._$AM.parentNode;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	u(e) {
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? pe).importNode(t, !0);
		ke.currentNode = r;
		let i = ke.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new Fe(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new Be(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = ke.nextNode(), a++);
		}
		return ke.currentNode = pe, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, Fe = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = x, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
	}
	get parentNode() {
		let e = this._$AA.parentNode, t = this._$AM;
		return t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e;
	}
	get startNode() {
		return this._$AA;
	}
	get endNode() {
		return this._$AB;
	}
	_$AI(e, t = this) {
		e = Ne(this, e, t), he(e) ? e === x || e == null || e === "" ? (this._$AH !== x && this._$AR(), this._$AH = x) : e !== this._$AH && e !== De && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? _e(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== x && he(this._$AH) ? this._$AA.nextSibling.data = e : this.T(pe.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = Me.createElement(Ae(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new Pe(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = Oe.get(e.strings);
		return t === void 0 && Oe.set(e.strings, t = new Me(e)), t;
	}
	k(t) {
		ge(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(me()), this.O(me()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = se(e).nextSibling;
			se(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, Ie = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = x, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = x;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = Ne(this, e, t, 0), a = !he(e) || e !== this._$AH && e !== De, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = Ne(this, r[n + o], t, o), s === De && (s = this._$AH[o]), a ||= !he(s) || s !== this._$AH[o], s === x ? e = x : e !== x && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === x ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, Le = class extends Ie {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === x ? void 0 : e;
	}
}, Re = class extends Ie {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== x);
	}
}, ze = class extends Ie {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = Ne(this, e, t, 0) ?? x) === De) return;
		let n = this._$AH, r = e === x && n !== x || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== x && (n === x || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, Be = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		Ne(this, e);
	}
}, Ve = _.litHtmlPolyfillSupport;
Ve?.(Me, Fe), (_.litHtmlVersions ??= []).push("3.3.3");
var He = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new Fe(t.insertBefore(me(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, Ue = globalThis, We = class extends oe {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = He(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return De;
	}
};
We._$litElement$ = !0, We.finalized = !0, Ue.litElementHydrateSupport?.({ LitElement: We });
var Ge = Ue.litElementPolyfillSupport;
Ge?.({ LitElement: We }), (Ue.litElementVersions ??= []).push("4.2.2");
// src/editor.ts
var Ke = [
	{
		name: "name",
		selector: { text: {} }
	},
	{
		name: "icon",
		selector: { icon: {} }
	},
	{
		name: "call_target",
		selector: { text: {} }
	},
	{
		name: "call_label",
		selector: { text: {} }
	},
	{
		name: "camera",
		selector: { entity: { domain: "camera" } }
	},
	{
		name: "use_sip_core",
		selector: { boolean: {} }
	},
	{
		name: "wss_url",
		selector: { text: {} },
		helper: "Only needed when SIP Core has no custom WSS URL."
	},
	{
		name: "extension",
		selector: { text: {} }
	},
	{
		name: "pbx_server",
		selector: { text: {} }
	},
	{
		name: "password",
		selector: { text: { type: "password" } }
	},
	{
		name: "auto_answer",
		selector: { boolean: {} }
	},
	{
		name: "auto_answer_delay",
		selector: { number: {
			min: 0,
			max: 30,
			step: 1,
			mode: "box"
		} }
	},
	{
		name: "state_entity",
		selector: { entity: { domain: ["input_text", "input_select"] } },
		helper: "The card writes its phase here for Tessera and automations."
	},
	{
		name: "peer_entity",
		selector: { entity: { domain: ["input_text", "input_select"] } }
	},
	{
		name: "event_entity",
		selector: { entity: { domain: ["input_text"] } },
		helper: "One line per transition, for a non-admin kiosk. Events need an admin user."
	},
	{
		name: "command_entity",
		selector: { entity: { domain: ["input_text", "input_select"] } },
		helper: "Write answer / decline / hangup / call:555 / dtmf:1 here to control the card."
	},
	{
		name: "clear_command",
		selector: { boolean: {} }
	},
	{
		name: "answer_script",
		selector: { entity: { domain: "script" } }
	},
	{
		name: "end_script",
		selector: { entity: { domain: "script" } }
	},
	{
		name: "debug",
		selector: { boolean: {} }
	}
], qe = class extends We {
	constructor(...e) {
		super(...e), this._config = {};
	}
	static {
		this.styles = o`
    :host {
      display: block;
    }
    ha-form {
      display: block;
    }
    details {
      margin-top: 12px;
    }
    textarea {
      width: 100%;
      min-height: 160px;
      box-sizing: border-box;
      font-family: var(--code-font-family, monospace);
      font-size: 12px;
      padding: 8px;
      border-radius: 8px;
      border: 1px solid var(--divider-color, #ccc);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #111);
    }
  `;
	}
	static {
		this.properties = {
			hass: { attribute: !1 },
			_config: { state: !0 }
		};
	}
	setConfig(e) {
		this._config = { ...e };
	}
	onFormChanged(e) {
		let t = {
			...this._config,
			...e.detail.value
		};
		this._config = t, this.dispatchEvent(new CustomEvent("config-changed", {
			detail: { config: t },
			bubbles: !0,
			composed: !0
		}));
	}
	onJsonChanged(e) {
		let t = e.target;
		try {
			let e = JSON.parse(t.value);
			this._config = e, this.dispatchEvent(new CustomEvent("config-changed", {
				detail: { config: e },
				bubbles: !0,
				composed: !0
			}));
		} catch {}
	}
	render() {
		return b`
      ${customElements.get("ha-form") ? b`<ha-form
            .hass=${this.hass}
            .data=${this._config}
            .schema=${Ke}
            .computeLabel=${(e) => Ye(e.name)}
            @value-changed=${this.onFormChanged}
          ></ha-form>` : b`<p>Home Assistant's form components are not available here. Edit the YAML below.</p>`}
      <details>
        <summary>Advanced (all options, including buttons)</summary>
        <textarea .value=${JSON.stringify(this._config, null, 2)} @change=${this.onJsonChanged}></textarea>
      </details>
    `;
	}
}, Je = {
	name: "Name",
	icon: "Icon",
	call_target: "Call target",
	call_label: "Call button",
	camera: "Camera",
	use_sip_core: "Use the SIP Core account",
	wss_url: "WebSocket URL",
	extension: "Extension",
	pbx_server: "PBX server",
	password: "SIP password",
	auto_answer: "Answer automatically",
	auto_answer_delay: "Answer after (seconds)",
	state_entity: "State helper",
	peer_entity: "Caller helper",
	event_entity: "Event helper",
	command_entity: "Command helper",
	clear_command: "Clear the command after it runs",
	answer_script: "On answer",
	end_script: "On hang up",
	debug: "Debug logging"
};
function Ye(e) {
	return Je[e] ?? e;
}
customElements.get("tessera-sip-card-editor") || customElements.define("tessera-sip-card-editor", qe);
// src/config/types.ts
var S = class extends Error {
	constructor(e) {
		super(e), this.name = "ConfigError";
	}
}, Xe = /^[0-9*#]$/;
function C(e) {
	if (typeof e != "string") return;
	let t = e.trim();
	return t.length > 0 ? t : void 0;
}
function Ze(e, t) {
	return typeof e == "boolean" ? e : t;
}
function Qe(e, t) {
	if (typeof e == "number" && Number.isFinite(e)) return e;
	if (typeof e == "string" && e.trim() !== "") {
		let t = Number(e);
		if (Number.isFinite(t)) return t;
	}
	return t;
}
function $e(e) {
	if (!Array.isArray(e)) return [];
	let t = [];
	for (let [n, r] of e.entries()) {
		if (!r || typeof r != "object") continue;
		let e = r, i = C(e.digit);
		if (!i || !Xe.test(i)) throw new S(`dtmf_actions[${n}].digit must be one of 0-9, * or # (got ${JSON.stringify(e.digit)}).`);
		t.push({
			digit: i,
			label: C(e.label) ?? i,
			icon: C(e.icon)
		});
	}
	return t;
}
function et(e) {
	if (!e || typeof e != "object") return {};
	let t = {};
	for (let [n, r] of Object.entries(e)) {
		let e = C(r);
		e && (t[n] = e);
	}
	return t;
}
function tt(e) {
	if (!e || typeof e != "object") throw new S("The card needs a configuration object.");
	let t = Ze(e.use_sip_core, !0), n = {
		id: C(e.id) ?? "tessera-sip",
		name: C(e.name) ?? "Doorbell",
		subtitle: C(e.subtitle),
		icon: C(e.icon) ?? "doorbell",
		useSipCore: t,
		wssUrl: C(e.wss_url),
		uri: C(e.uri),
		extension: C(e.extension),
		pbxServer: C(e.pbx_server),
		authUser: C(e.auth_user),
		password: C(e.password),
		displayName: C(e.display_name),
		callTarget: C(e.call_target) ?? "555",
		callLabel: C(e.call_label) ?? "Talk to the door",
		autoAnswer: Ze(e.auto_answer, !1),
		autoAnswerDelay: Math.max(0, Qe(e.auto_answer_delay, 0)),
		video: Ze(e.video, !1),
		dtmfActions: $e(e.dtmf_actions),
		camera: C(e.camera),
		ringtone: C(e.ringtone),
		eventType: C(e.event_type) ?? "tessera_sip_card",
		stateEntity: C(e.state_entity),
		peerEntity: C(e.peer_entity),
		eventEntity: C(e.event_entity),
		commandEntity: C(e.command_entity),
		clearCommand: Ze(e.clear_command, !1),
		answerScript: C(e.answer_script),
		endScript: C(e.end_script),
		iceServers: Array.isArray(e.ice_servers) ? e.ice_servers : void 0,
		iceTransportPolicy: e.ice_transport_policy,
		language: C(e.language),
		labels: et(e.labels),
		debug: Ze(e.debug, !1)
	};
	if (!t) {
		let e = [];
		if (n.wssUrl || e.push("wss_url"), !n.uri && !n.extension && e.push("uri (or extension)"), n.password || e.push("password"), e.length > 0) throw new S(`use_sip_core is false, so the card needs ${e.join(", ")}.`);
	}
	if (!n.uri && !n.extension && !t) throw new S("Set `uri` (sip:100@pbx.example) or `extension`.");
	return n;
}
// src/ha/command.ts
var nt = /* @__PURE__ */ new Set([
	"answer",
	"decline",
	"hangup",
	"call",
	"retry",
	"mute",
	"unmute",
	"dtmf",
	"enable_audio"
]);
function rt(e) {
	if (!e) return null;
	let t = e.trim();
	if (!t) return null;
	if (t.startsWith("{")) try {
		return it(JSON.parse(t));
	} catch {
		return null;
	}
	let [n, ...r] = (t.split("|")[0]?.trim() ?? "").split(":"), i = n?.trim().toLowerCase();
	if (!i || !nt.has(i)) return null;
	let a = r.join(":").trim();
	return a ? {
		action: i,
		value: a
	} : { action: i };
}
function it(e) {
	if (!e) return null;
	let t = e.action ?? e.command;
	if (typeof t != "string") return null;
	let n = t.trim().toLowerCase();
	if (!nt.has(n)) return null;
	let r = typeof e.target == "string" && e.target || typeof e.digit == "string" && e.digit || typeof e.value == "string" && e.value || void 0;
	return r ? {
		action: n,
		value: r
	} : { action: n };
}
// src/ha/events.ts
async function at(e, t, n) {
	if (e.callWS) try {
		await e.callWS({
			type: "fire_event",
			event_type: t,
			event_data: n
		});
	} catch (e) {
		console.warn("tessera-sip-card: could not fire event", e);
	}
}
async function ot(e, t) {
	if (!e.callService) return;
	let [n, ...r] = t.split("."), i = r.join(".");
	if (n && i) try {
		n === "script" ? await e.callService("script", i, {}) : n === "automation" ? await e.callService("automation", "trigger", { entity_id: t }) : await e.callService(n, i, {});
	} catch (e) {
		console.warn(`tessera-sip-card: could not call ${t}`, e);
	}
}
// src/ha/entity.ts
async function st(e, t, n) {
	if (!t || !e.callService) return;
	let r = t.split(".")[0];
	try {
		r === "input_text" ? await e.callService("input_text", "set_value", {
			entity_id: t,
			value: n
		}) : r === "input_select" && await e.callService("input_select", "select_option", {
			entity_id: t,
			option: n
		});
	} catch (e) {
		console.warn(`tessera-sip-card: could not write ${t}`, e);
	}
}
function ct(e, t) {
	if (!e || !t) return;
	let n = e.states[t]?.attributes.entity_picture;
	if (typeof n == "string" && n.length !== 0) return /^https?:\/\//i.test(n) ? n : `${(e.hassUrl ? e.hassUrl("/") : "/").replace(/\/$/, "")}/${n.replace(/^\//, "")}`;
}
// src/model/i18n.ts
var lt = {
	connecting: "Connecting to the door…",
	offline: "The door line is offline",
	offline_hint: "Check the card settings, then retry.",
	idle_hint: "Tap to talk",
	ringing: "Someone is at the door",
	ringing_hint: "Incoming call",
	calling: "Calling {peer}…",
	calling_hint: "Ringing the door…",
	connected: "Connected",
	connected_hint: "Speak now — the door hears you.",
	error: "Call problem",
	answer: "Answer",
	decline: "Decline",
	cancel: "Cancel",
	hangup: "Hang up",
	mute: "Mute",
	unmute: "Unmute",
	retry: "Try again",
	keypad: "Keypad",
	door: "Door",
	tap_for_sound: "Turn on sound",
	sound_blocked: "Your browser needs one tap for sound.",
	call_failed: "Call failed",
	call_ended: "Call ended",
	busy: "Busy",
	unknown: "Unknown",
	register: "Register"
}, ut = {
	en: lt,
	de: {
		connecting: "Verbinde mit der Tür…",
		offline: "Die Türleitung ist offline",
		offline_hint: "Prüfe die Karteneinstellungen und versuche es erneut.",
		idle_hint: "Tippen zum Sprechen",
		ringing: "Jemand an der Tür",
		ringing_hint: "Eingehender Anruf",
		calling: "Rufe {peer} an…",
		calling_hint: "Die Tür klingelt…",
		connected: "Verbunden",
		connected_hint: "Sprich jetzt – die Tür hört dich.",
		error: "Anruffehler",
		answer: "Annehmen",
		decline: "Ablehnen",
		cancel: "Abbrechen",
		hangup: "Auflegen",
		mute: "Stumm",
		unmute: "Ton an",
		retry: "Erneut versuchen",
		keypad: "Tasten",
		door: "Tür",
		tap_for_sound: "Ton einschalten",
		sound_blocked: "Ein Tipp schaltet den Ton ein.",
		call_failed: "Anruf fehlgeschlagen",
		call_ended: "Anruf beendet",
		busy: "Besetzt",
		unknown: "Unbekannt",
		register: "Registrieren"
	}
};
function dt(e) {
	return e?.toLowerCase().startsWith("de") ? "de" : "en";
}
function ft(e, t, n) {
	let r = ut[e][t] ?? lt[t] ?? String(t);
	if (n) for (let [e, t] of Object.entries(n)) r = r.replaceAll(`{${e}}`, String(t));
	return r;
}
// src/model/state.ts
function pt(e = Date.now()) {
	return {
		phase: "booting",
		registered: !1,
		since: e,
		muted: !1,
		audioBlocked: !1
	};
}
function w(e) {
	return e === "ringing" || e === "dialing" || e === "connected";
}
function T(e, t, n = Date.now()) {
	switch (t.type) {
		case "boot":
		case "retry": return {
			...pt(n),
			audioBlocked: e.audioBlocked,
			registered: !1
		};
		case "registration":
			switch (t.state) {
				case "registering": return e.registered ? e : {
					...e,
					registered: !1,
					phase: w(e.phase) ? e.phase : "booting",
					error: void 0,
					since: w(e.phase) ? e.since : n
				};
				case "registered": return {
					...e,
					registered: !0,
					phase: w(e.phase) ? e.phase : "idle",
					error: void 0,
					since: w(e.phase) ? e.since : n
				};
				case "unregistered": return {
					...e,
					registered: !1,
					phase: w(e.phase) ? e.phase : "unregistered",
					error: t.error ?? e.error,
					since: w(e.phase) ? e.since : n
				};
				case "failed": return {
					...e,
					registered: !1,
					phase: w(e.phase) ? e.phase : "error",
					error: t.error ?? "Registration failed",
					since: w(e.phase) ? e.since : n
				};
			}
			break;
		case "incoming": return {
			...e,
			phase: "ringing",
			direction: "incoming",
			peer: t.peer,
			peerName: t.peerName,
			since: n,
			callStarted: void 0,
			muted: !1,
			error: void 0
		};
		case "outgoing": return {
			...e,
			phase: "dialing",
			direction: "outgoing",
			peer: t.peer,
			peerName: t.peerName,
			since: n,
			callStarted: void 0,
			muted: !1,
			error: void 0
		};
		case "progress": return e.phase, e;
		case "connected": return {
			...e,
			phase: "connected",
			since: n,
			callStarted: n,
			muted: !1,
			error: void 0
		};
		case "ended": return {
			...e,
			phase: e.registered ? "idle" : "unregistered",
			direction: void 0,
			peer: void 0,
			peerName: void 0,
			since: n,
			callStarted: void 0,
			muted: !1,
			lastEnd: t.reason,
			error: t.reason === "failed" ? t.error ?? "Call failed" : void 0
		};
		case "muted": return {
			...e,
			muted: t.muted
		};
		case "error": return {
			...e,
			phase: w(e.phase) ? e.phase : e.registered ? "idle" : "error",
			error: t.message,
			since: w(e.phase) ? e.since : n
		};
		case "audio-blocked": return {
			...e,
			audioBlocked: !0
		};
		case "audio-unlocked": return {
			...e,
			audioBlocked: !1
		};
	}
	return e;
}
// src/model/format.ts
function mt(e) {
	let t = Math.max(0, Math.floor(e / 1e3)), n = t % 60, r = Math.floor(t / 60) % 60, i = Math.floor(t / 3600), a = (e) => String(e).padStart(2, "0");
	return i > 0 ? `${i}:${a(r)}:${a(n)}` : `${r}:${a(n)}`;
}
// src/model/view.ts
var ht = {
	booting: "neutral",
	unregistered: "danger",
	idle: "accent",
	ringing: "ring",
	dialing: "accent",
	connected: "live",
	error: "danger"
}, gt = {
	booting: "doorbell",
	unregistered: "phone-off",
	idle: "doorbell",
	ringing: "phone-incoming",
	dialing: "phone-outgoing",
	connected: "phone",
	error: "alert"
};
function _t(e, t, n) {
	let r = e.peerName ?? e.peer;
	return !r || /^anonymous$/i.test(r) ? t.name || n : r;
}
function vt(e, t, n, r = Date.now()) {
	let i = (e, r) => t.labels[e] ?? ft(n, e, r), a = {
		phase: e.phase,
		tone: ht[e.phase],
		icon: t.icon && e.phase === "idle" ? t.icon : gt[e.phase],
		title: t.name,
		subtitle: t.subtitle ?? i("idle_hint"),
		controls: [],
		pulse: e.phase === "ringing",
		busy: e.phase === "booting" || e.phase === "dialing",
		showCamera: !!t.camera && (e.phase === "ringing" || e.phase === "connected"),
		duration: e.phase === "connected" && e.callStarted ? mt(r - e.callStarted) : void 0,
		registered: e.registered,
		muted: e.muted
	};
	switch (e.phase) {
		case "booting":
			a.subtitle = i("connecting");
			break;
		case "unregistered":
			a.subtitle = i("offline"), a.hint = e.error ?? i("offline_hint"), a.primary = {
				id: "retry",
				label: i("retry"),
				icon: "refresh",
				kind: "primary"
			};
			break;
		case "idle":
			a.primary = {
				id: "call",
				label: t.callLabel,
				icon: "phone",
				kind: "primary"
			}, e.error && (a.hint = e.error);
			break;
		case "ringing":
			a.title = _t(e, t, i("ringing")), a.subtitle = i("ringing_hint"), a.primary = {
				id: "answer",
				label: i("answer"),
				icon: "phone",
				kind: "primary"
			}, a.secondary = {
				id: "decline",
				label: i("decline"),
				icon: "phone-off",
				kind: "secondary"
			};
			break;
		case "dialing":
			a.title = i("calling", { peer: e.peerName ?? e.peer ?? i("unknown") }), a.subtitle = i("calling_hint"), a.primary = {
				id: "hangup",
				label: i("cancel"),
				icon: "phone-off",
				kind: "danger"
			};
			break;
		case "connected":
			a.title = _t(e, t, i("connected")), a.subtitle = a.duration ?? i("connected"), a.hint = i("connected_hint"), a.primary = {
				id: "hangup",
				label: i("hangup"),
				icon: "phone-off",
				kind: "danger"
			}, a.controls.push({
				id: e.muted ? "unmute" : "mute",
				label: e.muted ? i("unmute") : i("mute"),
				icon: e.muted ? "microphone-off" : "microphone",
				kind: "secondary"
			});
			for (let e of t.dtmfActions) a.controls.push({
				id: "dtmf",
				label: e.label,
				icon: e.icon ?? "keypad",
				kind: "secondary",
				digit: e.digit
			});
			e.error && (a.hint = e.error);
			break;
		case "error": a.subtitle = t.name, a.hint = e.error ?? i("error"), a.primary = {
			id: "retry",
			label: i("retry"),
			icon: "refresh",
			kind: "primary"
		};
	}
	return e.audioBlocked && a.controls.unshift({
		id: "enable_audio",
		label: i("tap_for_sound"),
		icon: "volume",
		kind: "ghost"
	}), a;
}
// node_modules/sip.js/lib/version.js
var yt = "0.21.1", bt = class extends Error {
	constructor(e) {
		super(e), Object.setPrototypeOf(this, new.target.prototype);
	}
}, xt = class extends bt {
	constructor(e) {
		super(e || "Unsupported content type.");
	}
}, St = class extends bt {
	constructor(e) {
		super(e || "Request pending.");
	}
}, Ct = class extends bt {
	constructor(e) {
		super(e || "Unspecified session description handler error.");
	}
}, wt = class extends bt {
	constructor() {
		super("The session has terminated.");
	}
}, Tt = class extends bt {
	constructor(e) {
		super(e || "An error occurred during state transition.");
	}
}, Et = class {
	constructor(e) {
		this.incomingAckRequest = e;
	}
	get request() {
		return this.incomingAckRequest.message;
	}
}, Dt = class {
	constructor(e) {
		this.incomingByeRequest = e;
	}
	get request() {
		return this.incomingByeRequest.message;
	}
	accept(e) {
		return this.incomingByeRequest.accept(e), Promise.resolve();
	}
	reject(e) {
		return this.incomingByeRequest.reject(e), Promise.resolve();
	}
}, Ot = class {
	constructor(e) {
		this.incomingCancelRequest = e;
	}
	get request() {
		return this.incomingCancelRequest;
	}
}, kt = class {
	constructor() {
		this.listeners = [];
	}
	addListener(e, t) {
		let n = (t) => {
			this.removeListener(n), e(t);
		};
		t?.once === !0 ? this.listeners.push(n) : this.listeners.push(e);
	}
	emit(e) {
		this.listeners.slice().forEach((t) => t(e));
	}
	removeAllListeners() {
		this.listeners = [];
	}
	removeListener(e) {
		this.listeners = this.listeners.filter((t) => t !== e);
	}
	on(e) {
		return this.addListener(e);
	}
	off(e) {
		return this.removeListener(e);
	}
	once(e) {
		return this.addListener(e, { once: !0 });
	}
}, At = class {
	constructor(e) {
		this.incomingInfoRequest = e;
	}
	get request() {
		return this.incomingInfoRequest.message;
	}
	accept(e) {
		return this.incomingInfoRequest.accept(e), Promise.resolve();
	}
	reject(e) {
		return this.incomingInfoRequest.reject(e), Promise.resolve();
	}
}, jt = class {
	constructor(e) {
		this.parameters = {};
		for (let t in e) e.hasOwnProperty(t) && this.setParam(t, e[t]);
	}
	setParam(e, t) {
		e && (this.parameters[e.toLowerCase()] = t == null ? null : t.toString());
	}
	getParam(e) {
		if (e) return this.parameters[e.toLowerCase()];
	}
	hasParam(e) {
		return !!(e && this.parameters[e.toLowerCase()] !== void 0);
	}
	deleteParam(e) {
		if (e = e.toLowerCase(), this.hasParam(e)) {
			let t = this.parameters[e];
			return delete this.parameters[e], t;
		}
	}
	clearParams() {
		this.parameters = {};
	}
}, E = class e extends jt {
	constructor(e, t, n) {
		super(n), this.uri = e, this._displayName = t;
	}
	get friendlyName() {
		return this.displayName || this.uri.aor;
	}
	get displayName() {
		return this._displayName;
	}
	set displayName(e) {
		this._displayName = e;
	}
	clone() {
		return new e(this.uri.clone(), this._displayName, JSON.parse(JSON.stringify(this.parameters)));
	}
	toString() {
		let e = this.displayName || this.displayName === "0" ? "\"" + this.displayName + "\" " : "";
		e += "<" + this.uri.toString() + ">";
		for (let t in this.parameters) this.parameters.hasOwnProperty(t) && (e += ";" + t, this.parameters[t] !== null && (e += "=" + this.parameters[t]));
		return e;
	}
}, D = class e extends jt {
	constructor(e = "sip", t, n, r, i, a) {
		if (super(i || {}), this.headers = {}, !n) throw TypeError("missing or invalid \"host\" parameter");
		for (let e in a) a.hasOwnProperty(e) && this.setHeader(e, a[e]);
		this.raw = {
			scheme: e,
			user: t,
			host: n,
			port: r
		}, this.normal = {
			scheme: e.toLowerCase(),
			user: t,
			host: n.toLowerCase(),
			port: r
		};
	}
	get scheme() {
		return this.normal.scheme;
	}
	set scheme(e) {
		this.raw.scheme = e, this.normal.scheme = e.toLowerCase();
	}
	get user() {
		return this.normal.user;
	}
	set user(e) {
		this.normal.user = this.raw.user = e;
	}
	get host() {
		return this.normal.host;
	}
	set host(e) {
		this.raw.host = e, this.normal.host = e.toLowerCase();
	}
	get aor() {
		return this.normal.user + "@" + this.normal.host;
	}
	get port() {
		return this.normal.port;
	}
	set port(e) {
		this.normal.port = this.raw.port = e;
	}
	setHeader(e, t) {
		this.headers[this.headerize(e)] = t instanceof Array ? t : [t];
	}
	getHeader(e) {
		if (e) return this.headers[this.headerize(e)];
	}
	hasHeader(e) {
		return !!e && !!this.headers.hasOwnProperty(this.headerize(e));
	}
	deleteHeader(e) {
		if (e = this.headerize(e), this.headers.hasOwnProperty(e)) {
			let t = this.headers[e];
			return delete this.headers[e], t;
		}
	}
	clearHeaders() {
		this.headers = {};
	}
	clone() {
		return new e(this._raw.scheme, this._raw.user || "", this._raw.host, this._raw.port, JSON.parse(JSON.stringify(this.parameters)), JSON.parse(JSON.stringify(this.headers)));
	}
	toRaw() {
		return this._toString(this._raw);
	}
	toString() {
		return this._toString(this._normal);
	}
	get _normal() {
		return this.normal;
	}
	get _raw() {
		return this.raw;
	}
	_toString(e) {
		let t = e.scheme + ":";
		e.scheme.toLowerCase().match("^sips?$") || (t += "//"), e.user && (t += this.escapeUser(e.user) + "@"), t += e.host, (e.port || e.port === 0) && (t += ":" + e.port);
		for (let e in this.parameters) this.parameters.hasOwnProperty(e) && (t += ";" + e, this.parameters[e] !== null && (t += "=" + this.parameters[e]));
		let n = [];
		for (let e in this.headers) if (this.headers.hasOwnProperty(e)) for (let t in this.headers[e]) this.headers[e].hasOwnProperty(t) && n.push(e + "=" + this.headers[e][t]);
		return n.length > 0 && (t += "?" + n.join("&")), t;
	}
	escapeUser(e) {
		let t;
		try {
			t = decodeURIComponent(e);
		} catch (e) {
			throw e;
		}
		return encodeURIComponent(t).replace(/%3A/gi, ":").replace(/%2B/gi, "+").replace(/%3F/gi, "?").replace(/%2F/gi, "/");
	}
	headerize(e) {
		let t = {
			"Call-Id": "Call-ID",
			Cseq: "CSeq",
			"Min-Se": "Min-SE",
			Rack: "RAck",
			Rseq: "RSeq",
			"Www-Authenticate": "WWW-Authenticate"
		}, n = e.toLowerCase().replace(/_/g, "-").split("-"), r = n.length, i = "";
		for (let e = 0; e < r; e++) e !== 0 && (i += "-"), i += n[e].charAt(0).toUpperCase() + n[e].substring(1);
		return t[i] && (i = t[i]), i;
	}
};
function Mt(e, t) {
	if (e.scheme !== t.scheme || e.user !== t.user || e.host !== t.host || e.port !== t.port) return !1;
	function n(e, t) {
		let n = Object.keys(e.parameters), r = Object.keys(t.parameters);
		return !(!n.filter((e) => r.includes(e)).every((n) => e.parameters[n] === t.parameters[n]) || ![
			"user",
			"ttl",
			"method",
			"transport"
		].every((n) => e.hasParam(n) && t.hasParam(n) || !e.hasParam(n) && !t.hasParam(n)) || !["maddr"].every((n) => e.hasParam(n) && t.hasParam(n) || !e.hasParam(n) && !t.hasParam(n)));
	}
	if (!n(e, t)) return !1;
	let r = Object.keys(e.headers), i = Object.keys(t.headers);
	if (r.length !== 0 || i.length !== 0) {
		if (r.length !== i.length) return !1;
		let n = r.filter((e) => i.includes(e));
		if (n.length !== i.length || !n.every((n) => e.headers[n].length && t.headers[n].length && e.headers[n][0] === t.headers[n][0])) return !1;
	}
	return !0;
}
// node_modules/sip.js/lib/grammar/pegjs/dist/grammar.js
function Nt(e, t, n) {
	return n ||= " ", e.length > t ? e : (t -= e.length, n += n.repeat(t), e + n.slice(0, t));
}
var Pt = class e extends Error {
	constructor(t, n, r, i) {
		super(), this.message = t, this.expected = n, this.found = r, this.location = i, this.name = "SyntaxError", typeof Object.setPrototypeOf == "function" ? Object.setPrototypeOf(this, e.prototype) : this.__proto__ = e.prototype, typeof Error.captureStackTrace == "function" && Error.captureStackTrace(this, e);
	}
	static buildMessage(e, t) {
		function n(e) {
			return e.charCodeAt(0).toString(16).toUpperCase();
		}
		function r(e) {
			return e.replace(/\\/g, "\\\\").replace(/"/g, "\\\"").replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, (e) => "\\x0" + n(e)).replace(/[\x10-\x1F\x7F-\x9F]/g, (e) => "\\x" + n(e));
		}
		function i(e) {
			return e.replace(/\\/g, "\\\\").replace(/\]/g, "\\]").replace(/\^/g, "\\^").replace(/-/g, "\\-").replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, (e) => "\\x0" + n(e)).replace(/[\x10-\x1F\x7F-\x9F]/g, (e) => "\\x" + n(e));
		}
		function a(e) {
			switch (e.type) {
				case "literal": return "\"" + r(e.text) + "\"";
				case "class":
					let t = e.parts.map((e) => Array.isArray(e) ? i(e[0]) + "-" + i(e[1]) : i(e));
					return "[" + (e.inverted ? "^" : "") + t + "]";
				case "any": return "any character";
				case "end": return "end of input";
				case "other": return e.description;
			}
		}
		function o(e) {
			let t = e.map(a), n, r;
			if (t.sort(), t.length > 0) {
				for (n = 1, r = 1; n < t.length; n++) t[n - 1] !== t[n] && (t[r] = t[n], r++);
				t.length = r;
			}
			switch (t.length) {
				case 1: return t[0];
				case 2: return t[0] + " or " + t[1];
				default: return t.slice(0, -1).join(", ") + ", or " + t[t.length - 1];
			}
		}
		function s(e) {
			return e ? "\"" + r(e) + "\"" : "end of input";
		}
		return "Expected " + o(e) + " but " + s(t) + " found.";
	}
	format(e) {
		let t = "Error: " + this.message;
		if (this.location) {
			let n = null, r = 0;
			for (; r < e.length; r++) if (e[r].source === this.location.source) {
				n = e[r].text.split(/\r\n|\n|\r/g);
				break;
			}
			let i = this.location.start, a = this.location.source + ":" + i.line + ":" + i.column;
			if (n) {
				let e = this.location.end, r = Nt("", i.line.toString().length, " "), o = n[i.line - 1], s = i.line === e.line ? e.column : o.length + 1;
				t += "\n --> " + a + "\n" + r + " |\n" + i.line + " | " + o + "\n" + r + " | " + Nt("", i.column - 1, " ") + Nt("", s - i.column, "^");
			} else t += "\n at " + a;
		}
		return t;
	}
};
function Ft(e, t) {
	t = t === void 0 ? {} : t;
	let n = {}, r = t.grammarSource, i = {
		Contact: 119,
		Name_Addr_Header: 156,
		Record_Route: 176,
		Request_Response: 81,
		SIP_URI: 45,
		Subscription_State: 186,
		Supported: 191,
		Require: 182,
		Via: 194,
		absoluteURI: 84,
		Call_ID: 118,
		Content_Disposition: 130,
		Content_Length: 135,
		Content_Type: 136,
		CSeq: 146,
		displayName: 122,
		Event: 149,
		From: 151,
		host: 52,
		Max_Forwards: 154,
		Min_SE: 213,
		Proxy_Authenticate: 157,
		quoted_string: 40,
		Refer_To: 178,
		Replaces: 179,
		Session_Expires: 210,
		stun_URI: 217,
		To: 192,
		turn_URI: 223,
		uuid: 226,
		WWW_Authenticate: 209,
		challenge: 158,
		sipfrag: 230,
		Referred_By: 231
	}, a = 119, o = [
		"\r\n",
		h("\r\n", !1),
		/^[0-9]/,
		g([["0", "9"]], !1, !1),
		/^[a-zA-Z]/,
		g([["a", "z"], ["A", "Z"]], !1, !1),
		/^[0-9a-fA-F]/,
		g([
			["0", "9"],
			["a", "f"],
			["A", "F"]
		], !1, !1),
		/^[\0-\xFF]/,
		g([["\0", "ÿ"]], !1, !1),
		/^["]/,
		g(["\""], !1, !1),
		" ",
		h(" ", !1),
		"	",
		h("	", !1),
		/^[a-zA-Z0-9]/,
		g([
			["a", "z"],
			["A", "Z"],
			["0", "9"]
		], !1, !1),
		";",
		h(";", !1),
		"/",
		h("/", !1),
		"?",
		h("?", !1),
		":",
		h(":", !1),
		"@",
		h("@", !1),
		"&",
		h("&", !1),
		"=",
		h("=", !1),
		"+",
		h("+", !1),
		"$",
		h("$", !1),
		",",
		h(",", !1),
		"-",
		h("-", !1),
		"_",
		h("_", !1),
		".",
		h(".", !1),
		"!",
		h("!", !1),
		"~",
		h("~", !1),
		"*",
		h("*", !1),
		"'",
		h("'", !1),
		"(",
		h("(", !1),
		")",
		h(")", !1),
		"%",
		h("%", !1),
		function() {
			return " ";
		},
		function() {
			return ":";
		},
		/^[!-~]/,
		g([["!", "~"]], !1, !1),
		/^[\x80-\uFFFF]/,
		g([["", "￿"]], !1, !1),
		/^[\x80-\xBF]/,
		g([["", "¿"]], !1, !1),
		/^[a-f]/,
		g([["a", "f"]], !1, !1),
		"`",
		h("`", !1),
		"<",
		h("<", !1),
		">",
		h(">", !1),
		"\\",
		h("\\", !1),
		"[",
		h("[", !1),
		"]",
		h("]", !1),
		"{",
		h("{", !1),
		"}",
		h("}", !1),
		function() {
			return "*";
		},
		function() {
			return "/";
		},
		function() {
			return "=";
		},
		function() {
			return "(";
		},
		function() {
			return ")";
		},
		function() {
			return ">";
		},
		function() {
			return "<";
		},
		function() {
			return ",";
		},
		function() {
			return ";";
		},
		function() {
			return ":";
		},
		function() {
			return "\"";
		},
		/^[!-']/,
		g([["!", "'"]], !1, !1),
		/^[*-[]/,
		g([["*", "["]], !1, !1),
		/^[\]-~]/,
		g([["]", "~"]], !1, !1),
		function(e) {
			return e;
		},
		/^[#-[]/,
		g([["#", "["]], !1, !1),
		/^[\0-\t]/,
		g([["\0", "	"]], !1, !1),
		/^[\v-\f]/,
		g([["\v", "\f"]], !1, !1),
		/^[\x0E-\x7F]/,
		g([["", ""]], !1, !1),
		function() {
			t ||= { data: {} }, t.data.uri = new D(t.data.scheme, t.data.user, t.data.host, t.data.port), delete t.data.scheme, delete t.data.user, delete t.data.host, delete t.data.host_type, delete t.data.port;
		},
		function() {
			t ||= { data: {} }, t.data.uri = new D(t.data.scheme, t.data.user, t.data.host, t.data.port, t.data.uri_params, t.data.uri_headers), delete t.data.scheme, delete t.data.user, delete t.data.host, delete t.data.host_type, delete t.data.port, delete t.data.uri_params, t.startRule === "SIP_URI" && (t.data = t.data.uri);
		},
		"sips",
		h("sips", !0),
		"sip",
		h("sip", !0),
		function(e) {
			t ||= { data: {} }, t.data.scheme = e;
		},
		function() {
			t ||= { data: {} }, t.data.user = decodeURIComponent(m().slice(0, -1));
		},
		function() {
			t ||= { data: {} }, t.data.password = m();
		},
		function() {
			return t ||= { data: {} }, t.data.host = m(), t.data.host;
		},
		function() {
			return t ||= { data: {} }, t.data.host_type = "domain", m();
		},
		/^[a-zA-Z0-9_\-]/,
		g([
			["a", "z"],
			["A", "Z"],
			["0", "9"],
			"_",
			"-"
		], !1, !1),
		/^[a-zA-Z0-9\-]/,
		g([
			["a", "z"],
			["A", "Z"],
			["0", "9"],
			"-"
		], !1, !1),
		function() {
			return t ||= { data: {} }, t.data.host_type = "IPv6", m();
		},
		"::",
		h("::", !1),
		function() {
			return t ||= { data: {} }, t.data.host_type = "IPv6", m();
		},
		function() {
			return t ||= { data: {} }, t.data.host_type = "IPv4", m();
		},
		"25",
		h("25", !1),
		/^[0-5]/,
		g([["0", "5"]], !1, !1),
		"2",
		h("2", !1),
		/^[0-4]/,
		g([["0", "4"]], !1, !1),
		"1",
		h("1", !1),
		/^[1-9]/,
		g([["1", "9"]], !1, !1),
		function(e) {
			return t ||= { data: {} }, e = parseInt(e.join("")), t.data.port = e, e;
		},
		"transport=",
		h("transport=", !0),
		"udp",
		h("udp", !0),
		"tcp",
		h("tcp", !0),
		"sctp",
		h("sctp", !0),
		"tls",
		h("tls", !0),
		function(e) {
			t ||= { data: {} }, t.data.uri_params || (t.data.uri_params = {}), t.data.uri_params.transport = e.toLowerCase();
		},
		"user=",
		h("user=", !0),
		"phone",
		h("phone", !0),
		"ip",
		h("ip", !0),
		function(e) {
			t ||= { data: {} }, t.data.uri_params || (t.data.uri_params = {}), t.data.uri_params.user = e.toLowerCase();
		},
		"method=",
		h("method=", !0),
		function(e) {
			t ||= { data: {} }, t.data.uri_params || (t.data.uri_params = {}), t.data.uri_params.method = e;
		},
		"ttl=",
		h("ttl=", !0),
		function(e) {
			t ||= { data: {} }, t.data.params || (t.data.params = {}), t.data.params.ttl = e;
		},
		"maddr=",
		h("maddr=", !0),
		function(e) {
			t ||= { data: {} }, t.data.uri_params || (t.data.uri_params = {}), t.data.uri_params.maddr = e;
		},
		"lr",
		h("lr", !0),
		function() {
			t ||= { data: {} }, t.data.uri_params || (t.data.uri_params = {}), t.data.uri_params.lr = void 0;
		},
		function(e, n) {
			t ||= { data: {} }, t.data.uri_params || (t.data.uri_params = {}), n = n === null ? void 0 : n[1], t.data.uri_params[e.toLowerCase()] = n;
		},
		function(e, n) {
			e = e.join("").toLowerCase(), n = n.join(""), t ||= { data: {} }, t.data.uri_headers || (t.data.uri_headers = {}), t.data.uri_headers[e] ? t.data.uri_headers[e].push(n) : t.data.uri_headers[e] = [n];
		},
		function() {
			t ||= { data: {} }, t.startRule === "Refer_To" && (t.data.uri = new D(t.data.scheme, t.data.user, t.data.host, t.data.port, t.data.uri_params, t.data.uri_headers), delete t.data.scheme, delete t.data.user, delete t.data.host, delete t.data.host_type, delete t.data.port, delete t.data.uri_params);
		},
		"//",
		h("//", !1),
		function() {
			t ||= { data: {} }, t.data.scheme = m();
		},
		h("SIP", !0),
		function() {
			t ||= { data: {} }, t.data.sip_version = m();
		},
		"INVITE",
		h("INVITE", !1),
		"ACK",
		h("ACK", !1),
		"VXACH",
		h("VXACH", !1),
		"OPTIONS",
		h("OPTIONS", !1),
		"BYE",
		h("BYE", !1),
		"CANCEL",
		h("CANCEL", !1),
		"REGISTER",
		h("REGISTER", !1),
		"SUBSCRIBE",
		h("SUBSCRIBE", !1),
		"NOTIFY",
		h("NOTIFY", !1),
		"REFER",
		h("REFER", !1),
		"PUBLISH",
		h("PUBLISH", !1),
		function() {
			return t ||= { data: {} }, t.data.method = m(), t.data.method;
		},
		function(e) {
			t ||= { data: {} }, t.data.status_code = parseInt(e.join(""));
		},
		function() {
			t ||= { data: {} }, t.data.reason_phrase = m();
		},
		function() {
			t ||= { data: {} }, t.data = m();
		},
		function() {
			var e, n;
			for (t ||= { data: {} }, n = t.data.multi_header.length, e = 0; e < n; e++) if (t.data.multi_header[e].parsed === null) {
				t.data = null;
				break;
			}
			t.data === null ? t.data = -1 : t.data = t.data.multi_header;
		},
		function() {
			var e;
			t ||= { data: {} }, t.data.multi_header || (t.data.multi_header = []);
			try {
				e = new E(t.data.uri, t.data.displayName, t.data.params), delete t.data.uri, delete t.data.displayName, delete t.data.params;
			} catch {
				e = null;
			}
			t.data.multi_header.push({
				position: c,
				offset: te().start.offset,
				parsed: e
			});
		},
		function(e) {
			e = m().trim(), e[0] === "\"" && (e = e.substring(1, e.length - 1)), t ||= { data: {} }, t.data.displayName = e;
		},
		"q",
		h("q", !0),
		function(e) {
			t ||= { data: {} }, t.data.params || (t.data.params = {}), t.data.params.q = e;
		},
		"expires",
		h("expires", !0),
		function(e) {
			t ||= { data: {} }, t.data.params || (t.data.params = {}), t.data.params.expires = e;
		},
		function(e) {
			return parseInt(e.join(""));
		},
		"0",
		h("0", !1),
		function() {
			return parseFloat(m());
		},
		function(e, n) {
			t ||= { data: {} }, t.data.params || (t.data.params = {}), n = n === null ? void 0 : n[1], t.data.params[e.toLowerCase()] = n;
		},
		"render",
		h("render", !0),
		"session",
		h("session", !0),
		"icon",
		h("icon", !0),
		"alert",
		h("alert", !0),
		function() {
			t ||= { data: {} }, t.startRule === "Content_Disposition" && (t.data.type = m().toLowerCase());
		},
		"handling",
		h("handling", !0),
		"optional",
		h("optional", !0),
		"required",
		h("required", !0),
		function(e) {
			t ||= { data: {} }, t.data = parseInt(e.join(""));
		},
		function() {
			t ||= { data: {} }, t.data = m();
		},
		"text",
		h("text", !0),
		"image",
		h("image", !0),
		"audio",
		h("audio", !0),
		"video",
		h("video", !0),
		"application",
		h("application", !0),
		"message",
		h("message", !0),
		"multipart",
		h("multipart", !0),
		"x-",
		h("x-", !0),
		function(e) {
			t ||= { data: {} }, t.data.value = parseInt(e.join(""));
		},
		function(e) {
			t ||= { data: {} }, t.data = e;
		},
		function(e) {
			t ||= { data: {} }, t.data.event = e.toLowerCase();
		},
		function() {
			t ||= { data: {} };
			var e = t.data.tag;
			t.data = new E(t.data.uri, t.data.displayName, t.data.params), e && t.data.setParam("tag", e);
		},
		"tag",
		h("tag", !0),
		function(e) {
			t ||= { data: {} }, t.data.tag = e;
		},
		function(e) {
			t ||= { data: {} }, t.data = parseInt(e.join(""));
		},
		function(e) {
			t ||= { data: {} }, t.data = e;
		},
		function() {
			t ||= { data: {} }, t.data = new E(t.data.uri, t.data.displayName, t.data.params);
		},
		"digest",
		h("Digest", !0),
		"realm",
		h("realm", !0),
		function(e) {
			t ||= { data: {} }, t.data.realm = e;
		},
		"domain",
		h("domain", !0),
		"nonce",
		h("nonce", !0),
		function(e) {
			t ||= { data: {} }, t.data.nonce = e;
		},
		"opaque",
		h("opaque", !0),
		function(e) {
			t ||= { data: {} }, t.data.opaque = e;
		},
		"stale",
		h("stale", !0),
		"true",
		h("true", !0),
		function() {
			t ||= { data: {} }, t.data.stale = !0;
		},
		"false",
		h("false", !0),
		function() {
			t ||= { data: {} }, t.data.stale = !1;
		},
		"algorithm",
		h("algorithm", !0),
		"md5",
		h("MD5", !0),
		"md5-sess",
		h("MD5-sess", !0),
		function(e) {
			t ||= { data: {} }, t.data.algorithm = e.toUpperCase();
		},
		"qop",
		h("qop", !0),
		"auth-int",
		h("auth-int", !0),
		"auth",
		h("auth", !0),
		function(e) {
			t ||= { data: {} }, t.data.qop || (t.data.qop = []), t.data.qop.push(e.toLowerCase());
		},
		function(e) {
			t ||= { data: {} }, t.data.value = parseInt(e.join(""));
		},
		function() {
			var e, n;
			for (t ||= { data: {} }, n = t.data.multi_header.length, e = 0; e < n; e++) if (t.data.multi_header[e].parsed === null) {
				t.data = null;
				break;
			}
			t.data === null ? t.data = -1 : t.data = t.data.multi_header;
		},
		function() {
			var e;
			t ||= { data: {} }, t.data.multi_header || (t.data.multi_header = []);
			try {
				e = new E(t.data.uri, t.data.displayName, t.data.params), delete t.data.uri, delete t.data.displayName, delete t.data.params;
			} catch {
				e = null;
			}
			t.data.multi_header.push({
				position: c,
				offset: te().start.offset,
				parsed: e
			});
		},
		function() {
			t ||= { data: {} }, t.data = new E(t.data.uri, t.data.displayName, t.data.params);
		},
		function() {
			t ||= { data: {} }, t.data.replaces_from_tag && t.data.replaces_to_tag || (t.data = -1);
		},
		function() {
			t ||= { data: {} }, t.data = { call_id: t.data };
		},
		"from-tag",
		h("from-tag", !0),
		function(e) {
			t ||= { data: {} }, t.data.replaces_from_tag = e;
		},
		"to-tag",
		h("to-tag", !0),
		function(e) {
			t ||= { data: {} }, t.data.replaces_to_tag = e;
		},
		"early-only",
		h("early-only", !0),
		function() {
			t ||= { data: {} }, t.data.early_only = !0;
		},
		function(e, t) {
			return t;
		},
		function(e, t) {
			return ce(e, t);
		},
		function(e) {
			t ||= { data: {} }, t.startRule === "Require" && (t.data = e || []);
		},
		function(e) {
			t ||= { data: {} }, t.data.value = parseInt(e.join(""));
		},
		"active",
		h("active", !0),
		"pending",
		h("pending", !0),
		"terminated",
		h("terminated", !0),
		function() {
			t ||= { data: {} }, t.data.state = m();
		},
		"reason",
		h("reason", !0),
		function(e) {
			t ||= { data: {} }, e !== void 0 && (t.data.reason = e);
		},
		function(e) {
			t ||= { data: {} }, e !== void 0 && (t.data.expires = e);
		},
		"retry_after",
		h("retry_after", !0),
		function(e) {
			t ||= { data: {} }, e !== void 0 && (t.data.retry_after = e);
		},
		"deactivated",
		h("deactivated", !0),
		"probation",
		h("probation", !0),
		"rejected",
		h("rejected", !0),
		"timeout",
		h("timeout", !0),
		"giveup",
		h("giveup", !0),
		"noresource",
		h("noresource", !0),
		"invariant",
		h("invariant", !0),
		function(e) {
			t ||= { data: {} }, t.startRule === "Supported" && (t.data = e || []);
		},
		function() {
			t ||= { data: {} };
			var e = t.data.tag;
			t.data = new E(t.data.uri, t.data.displayName, t.data.params), e && t.data.setParam("tag", e);
		},
		"ttl",
		h("ttl", !0),
		function(e) {
			t ||= { data: {} }, t.data.ttl = e;
		},
		"maddr",
		h("maddr", !0),
		function(e) {
			t ||= { data: {} }, t.data.maddr = e;
		},
		"received",
		h("received", !0),
		function(e) {
			t ||= { data: {} }, t.data.received = e;
		},
		"branch",
		h("branch", !0),
		function(e) {
			t ||= { data: {} }, t.data.branch = e;
		},
		"rport",
		h("rport", !0),
		function(e) {
			t ||= { data: {} }, e !== void 0 && (t.data.rport = e.join(""));
		},
		function(e) {
			t ||= { data: {} }, t.data.protocol = e;
		},
		h("UDP", !0),
		h("TCP", !0),
		h("TLS", !0),
		h("SCTP", !0),
		function(e) {
			t ||= { data: {} }, t.data.transport = e;
		},
		function() {
			t ||= { data: {} }, t.data.host = m();
		},
		function(e) {
			t ||= { data: {} }, t.data.port = parseInt(e.join(""));
		},
		function(e) {
			return parseInt(e.join(""));
		},
		function(e) {
			t ||= { data: {} }, t.startRule === "Session_Expires" && (t.data.deltaSeconds = e);
		},
		"refresher",
		h("refresher", !1),
		"uas",
		h("uas", !1),
		"uac",
		h("uac", !1),
		function(e) {
			t ||= { data: {} }, t.startRule === "Session_Expires" && (t.data.refresher = e);
		},
		function(e) {
			t ||= { data: {} }, t.startRule === "Min_SE" && (t.data = e);
		},
		"stuns",
		h("stuns", !0),
		"stun",
		h("stun", !0),
		function(e) {
			t ||= { data: {} }, t.data.scheme = e;
		},
		function(e) {
			t ||= { data: {} }, t.data.host = e;
		},
		"?transport=",
		h("?transport=", !1),
		"turns",
		h("turns", !0),
		"turn",
		h("turn", !0),
		function(e) {
			t ||= { data: {} }, t.data.transport = e;
		},
		function() {
			t ||= { data: {} }, t.data = m();
		},
		"Referred-By",
		h("Referred-By", !1),
		"b",
		h("b", !1),
		"cid",
		h("cid", !1)
	], s = [
		_("2 \"\"6 7!"),
		_("4\"\"\"5!7#"),
		_("4$\"\"5!7%"),
		_("4&\"\"5!7'"),
		_(";'.# &;("),
		_("4(\"\"5!7)"),
		_("4*\"\"5!7+"),
		_("2,\"\"6,7-"),
		_("2.\"\"6.7/"),
		_("40\"\"5!71"),
		_("22\"\"6273. &24\"\"6475.} &26\"\"6677.q &28\"\"6879.e &2:\"\"6:7;.Y &2<\"\"6<7=.M &2>\"\"6>7?.A &2@\"\"6@7A.5 &2B\"\"6B7C.) &2D\"\"6D7E"),
		_(";).# &;,"),
		_("2F\"\"6F7G.} &2H\"\"6H7I.q &2J\"\"6J7K.e &2L\"\"6L7M.Y &2N\"\"6N7O.M &2P\"\"6P7Q.A &2R\"\"6R7S.5 &2T\"\"6T7U.) &2V\"\"6V7W"),
		_("%%2X\"\"6X7Y/5#;#/,$;#/#$+#)(#'#(\"'#&'#/\"!&,)"),
		_("%%$;$0#*;$&/,#; /#$+\")(\"'#&'#.\" &\"/=#$;$/&#0#*;$&&&#/'$8\":Z\" )(\"'#&'#"),
		_(";..\" &\""),
		_("%$;'.# &;(0)*;'.# &;(&/?#28\"\"6879/0$;//'$8#:[# )(#'#(\"'#&'#"),
		_("%%$;2/&#0#*;2&&&#/g#$%$;.0#*;.&/,#;2/#$+\")(\"'#&'#0=*%$;.0#*;.&/,#;2/#$+\")(\"'#&'#&/#$+\")(\"'#&'#/\"!&,)"),
		_("4\\\"\"5!7].# &;3"),
		_("4^\"\"5!7_"),
		_("4`\"\"5!7a"),
		_(";!.) &4b\"\"5!7c"),
		_("%$;). &2F\"\"6F7G. &2J\"\"6J7K.} &2L\"\"6L7M.q &2X\"\"6X7Y.e &2P\"\"6P7Q.Y &2H\"\"6H7I.M &2@\"\"6@7A.A &2d\"\"6d7e.5 &2R\"\"6R7S.) &2N\"\"6N7O/#0*;). &2F\"\"6F7G. &2J\"\"6J7K.} &2L\"\"6L7M.q &2X\"\"6X7Y.e &2P\"\"6P7Q.Y &2H\"\"6H7I.M &2@\"\"6@7A.A &2d\"\"6d7e.5 &2R\"\"6R7S.) &2N\"\"6N7O&&&#/\"!&,)"),
		_("%$;). &2F\"\"6F7G.} &2L\"\"6L7M.q &2X\"\"6X7Y.e &2P\"\"6P7Q.Y &2H\"\"6H7I.M &2@\"\"6@7A.A &2d\"\"6d7e.5 &2R\"\"6R7S.) &2N\"\"6N7O/#0*;). &2F\"\"6F7G.} &2L\"\"6L7M.q &2X\"\"6X7Y.e &2P\"\"6P7Q.Y &2H\"\"6H7I.M &2@\"\"6@7A.A &2d\"\"6d7e.5 &2R\"\"6R7S.) &2N\"\"6N7O&&&#/\"!&,)"),
		_("2T\"\"6T7U.ã &2V\"\"6V7W.× &2f\"\"6f7g.Ë &2h\"\"6h7i.¿ &2:\"\"6:7;.³ &2D\"\"6D7E.§ &22\"\"6273. &28\"\"6879. &2j\"\"6j7k. &;&.} &24\"\"6475.q &2l\"\"6l7m.e &2n\"\"6n7o.Y &26\"\"6677.M &2>\"\"6>7?.A &2p\"\"6p7q.5 &2r\"\"6r7s.) &;'.# &;("),
		_("%$;).ī &2F\"\"6F7G.ğ &2J\"\"6J7K.ē &2L\"\"6L7M.ć &2X\"\"6X7Y.û &2P\"\"6P7Q.ï &2H\"\"6H7I.ã &2@\"\"6@7A.× &2d\"\"6d7e.Ë &2R\"\"6R7S.¿ &2N\"\"6N7O.³ &2T\"\"6T7U.§ &2V\"\"6V7W. &2f\"\"6f7g. &2h\"\"6h7i. &28\"\"6879.w &2j\"\"6j7k.k &;&.e &24\"\"6475.Y &2l\"\"6l7m.M &2n\"\"6n7o.A &26\"\"6677.5 &2p\"\"6p7q.) &2r\"\"6r7s/Ĵ#0ı*;).ī &2F\"\"6F7G.ğ &2J\"\"6J7K.ē &2L\"\"6L7M.ć &2X\"\"6X7Y.û &2P\"\"6P7Q.ï &2H\"\"6H7I.ã &2@\"\"6@7A.× &2d\"\"6d7e.Ë &2R\"\"6R7S.¿ &2N\"\"6N7O.³ &2T\"\"6T7U.§ &2V\"\"6V7W. &2f\"\"6f7g. &2h\"\"6h7i. &28\"\"6879.w &2j\"\"6j7k.k &;&.e &24\"\"6475.Y &2l\"\"6l7m.M &2n\"\"6n7o.A &26\"\"6677.5 &2p\"\"6p7q.) &2r\"\"6r7s&&&#/\"!&,)"),
		_("%;//?#2P\"\"6P7Q/0$;//'$8#:t# )(#'#(\"'#&'#"),
		_("%;//?#24\"\"6475/0$;//'$8#:u# )(#'#(\"'#&'#"),
		_("%;//?#2>\"\"6>7?/0$;//'$8#:v# )(#'#(\"'#&'#"),
		_("%;//?#2T\"\"6T7U/0$;//'$8#:w# )(#'#(\"'#&'#"),
		_("%;//?#2V\"\"6V7W/0$;//'$8#:x# )(#'#(\"'#&'#"),
		_("%2h\"\"6h7i/0#;//'$8\":y\" )(\"'#&'#"),
		_("%;//6#2f\"\"6f7g/'$8\":z\" )(\"'#&'#"),
		_("%;//?#2D\"\"6D7E/0$;//'$8#:{# )(#'#(\"'#&'#"),
		_("%;//?#22\"\"6273/0$;//'$8#:|# )(#'#(\"'#&'#"),
		_("%;//?#28\"\"6879/0$;//'$8#:}# )(#'#(\"'#&'#"),
		_("%;//0#;&/'$8\":~\" )(\"'#&'#"),
		_("%;&/0#;//'$8\":~\" )(\"'#&'#"),
		_("%;=/T#$;G.) &;K.# &;F0/*;G.) &;K.# &;F&/,$;>/#$+#)(#'#(\"'#&'#"),
		_("4\"\"5!7.A &4\"\"5!7.5 &4\"\"5!7.) &;3.# &;."),
		_("%%;//Q#;&/H$$;J.# &;K0)*;J.# &;K&/,$;&/#$+$)($'#(#'#(\"'#&'#/\"!&,)"),
		_("%;//]#;&/T$%$;J.# &;K0)*;J.# &;K&/\"!&,)/1$;&/($8$:$!!)($'#(#'#(\"'#&'#"),
		_(";..G &2L\"\"6L7M.; &4\"\"5!7./ &4\"\"5!7.# &;3"),
		_("%2j\"\"6j7k/J#4\"\"5!7.5 &4\"\"5!7.) &4\"\"5!7/#$+\")(\"'#&'#"),
		_("%;N/M#28\"\"6879/>$;O.\" &\"/0$;S/'$8$:$ )($'#(#'#(\"'#&'#"),
		_("%;N/d#28\"\"6879/U$;O.\" &\"/G$;S/>$;_/5$;l.\" &\"/'$8&:& )(&'#(%'#($'#(#'#(\"'#&'#"),
		_("%3\"\"5$7.) &3\"\"5#7/' 8!:!! )"),
		_("%;P/]#%28\"\"6879/,#;R/#$+\")(\"'#&'#.\" &\"/6$2:\"\"6:7;/'$8#:# )(#'#(\"'#&'#"),
		_("$;+.) &;-.# &;Q/2#0/*;+.) &;-.# &;Q&&&#"),
		_("2<\"\"6<7=.q &2>\"\"6>7?.e &2@\"\"6@7A.Y &2B\"\"6B7C.M &2D\"\"6D7E.A &22\"\"6273.5 &26\"\"6677.) &24\"\"6475"),
		_("%$;+._ &;-.Y &2<\"\"6<7=.M &2>\"\"6>7?.A &2@\"\"6@7A.5 &2B\"\"6B7C.) &2D\"\"6D7E0e*;+._ &;-.Y &2<\"\"6<7=.M &2>\"\"6>7?.A &2@\"\"6@7A.5 &2B\"\"6B7C.) &2D\"\"6D7E&/& 8!:! )"),
		_("%;T/J#%28\"\"6879/,#;^/#$+\")(\"'#&'#.\" &\"/#$+\")(\"'#&'#"),
		_("%;U.) &;\\.# &;X/& 8!:! )"),
		_("%$%;V/2#2J\"\"6J7K/#$+\")(\"'#&'#0<*%;V/2#2J\"\"6J7K/#$+\")(\"'#&'#&/D#;W/;$2J\"\"6J7K.\" &\"/'$8#:# )(#'#(\"'#&'#"),
		_("$4\"\"5!7/,#0)*4\"\"5!7&&&#"),
		_("%4$\"\"5!7%/?#$4\"\"5!70)*4\"\"5!7&/#$+\")(\"'#&'#"),
		_("%2l\"\"6l7m/?#;Y/6$2n\"\"6n7o/'$8#:# )(#'#(\"'#&'#"),
		_("%%;Z/³#28\"\"6879/¤$;Z/$28\"\"6879/$;Z/$28\"\"6879/t$;Z/k$28\"\"6879/\\$;Z/S$28\"\"6879/D$;Z/;$28\"\"6879/,$;[/#$+-)(-'#(,'#(+'#(*'#()'#(('#(''#(&'#(%'#($'#(#'#(\"'#&'#.ސ &%2\"\"67/¤#;Z/$28\"\"6879/$;Z/$28\"\"6879/t$;Z/k$28\"\"6879/\\$;Z/S$28\"\"6879/D$;Z/;$28\"\"6879/,$;[/#$+,)(,'#(+'#(*'#()'#(('#(''#(&'#(%'#($'#(#'#(\"'#&'#.۹ &%2\"\"67/#;Z/$28\"\"6879/t$;Z/k$28\"\"6879/\\$;Z/S$28\"\"6879/D$;Z/;$28\"\"6879/,$;[/#$+*)(*'#()'#(('#(''#(&'#(%'#($'#(#'#(\"'#&'#.ٺ &%2\"\"67/t#;Z/k$28\"\"6879/\\$;Z/S$28\"\"6879/D$;Z/;$28\"\"6879/,$;[/#$+()(('#(''#(&'#(%'#($'#(#'#(\"'#&'#.ؓ &%2\"\"67/\\#;Z/S$28\"\"6879/D$;Z/;$28\"\"6879/,$;[/#$+&)(&'#(%'#($'#(#'#(\"'#&'#.ׄ &%2\"\"67/D#;Z/;$28\"\"6879/,$;[/#$+$)($'#(#'#(\"'#&'#.֍ &%2\"\"67/,#;[/#$+\")(\"'#&'#.ծ &%2\"\"67/,#;Z/#$+\")(\"'#&'#.Տ &%;Z/#2\"\"67/$;Z/$28\"\"6879/t$;Z/k$28\"\"6879/\\$;Z/S$28\"\"6879/D$;Z/;$28\"\"6879/,$;[/#$++)(+'#(*'#()'#(('#(''#(&'#(%'#($'#(#'#(\"'#&'#.Ӈ &%;Z/ª#%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/$2\"\"67/t$;Z/k$28\"\"6879/\\$;Z/S$28\"\"6879/D$;Z/;$28\"\"6879/,$;[/#$+*)(*'#()'#(('#(''#(&'#(%'#($'#(#'#(\"'#&'#.а &%;Z/¹#%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/k$2\"\"67/\\$;Z/S$28\"\"6879/D$;Z/;$28\"\"6879/,$;[/#$+))()'#(('#(''#(&'#(%'#($'#(#'#(\"'#&'#.Ί &%;Z/È#%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/¡$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/z$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/S$2\"\"67/D$;Z/;$28\"\"6879/,$;[/#$+()(('#(''#(&'#(%'#($'#(#'#(\"'#&'#.˕ &%;Z/×#%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/°$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/b$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/;$2\"\"67/,$;[/#$+')(''#(&'#(%'#($'#(#'#(\"'#&'#.ȑ &%;Z/þ#%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/×$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/°$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/b$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/;$2\"\"67/,$;Z/#$+()(('#(''#(&'#(%'#($'#(#'#(\"'#&'#.Ħ &%;Z/Ĝ#%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/õ$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/Î$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/§$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/Y$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/2$2\"\"67/#$+()(('#(''#(&'#(%'#($'#(#'#(\"'#&'#/& 8!:\xA0! )"),
		_("%;#/M#;#.\" &\"/?$;#.\" &\"/1$;#.\" &\"/#$+$)($'#(#'#(\"'#&'#"),
		_("%;Z/;#28\"\"6879/,$;Z/#$+#)(#'#(\"'#&'#.# &;\\"),
		_("%;]/o#2J\"\"6J7K/`$;]/W$2J\"\"6J7K/H$;]/?$2J\"\"6J7K/0$;]/'$8':¡' )(''#(&'#(%'#($'#(#'#(\"'#&'#"),
		_("%2¢\"\"6¢7£/2#4¤\"\"5!7¥/#$+\")(\"'#&'#. &%2¦\"\"6¦7§/;#4¨\"\"5!7©/,$;!/#$+#)(#'#(\"'#&'#.j &%2ª\"\"6ª7«/5#;!/,$;!/#$+#)(#'#(\"'#&'#.B &%4¬\"\"5!7­/,#;!/#$+\")(\"'#&'#.# &;!"),
		_("%%;!.\" &\"/[#;!.\" &\"/M$;!.\" &\"/?$;!.\" &\"/1$;!.\" &\"/#$+%)(%'#($'#(#'#(\"'#&'#/' 8!:®!! )"),
		_("$%22\"\"6273/,#;`/#$+\")(\"'#&'#0<*%22\"\"6273/,#;`/#$+\")(\"'#&'#&"),
		_(";a.A &;b.; &;c.5 &;d./ &;e.) &;f.# &;g"),
		_("%3¯\"\"5*7°/a#3±\"\"5#7².G &3³\"\"5#7´.; &3µ\"\"5$7¶./ &3·\"\"5#7¸.# &;6/($8\":¹\"! )(\"'#&'#"),
		_("%3º\"\"5%7»/I#3¼\"\"5%7½./ &3¾\"\"5\"7¿.# &;6/($8\":À\"! )(\"'#&'#"),
		_("%3Á\"\"5'7Â/1#;/($8\":Ã\"! )(\"'#&'#"),
		_("%3Ä\"\"5$7Å/1#;ð/($8\":Æ\"! )(\"'#&'#"),
		_("%3Ç\"\"5&7È/1#;T/($8\":É\"! )(\"'#&'#"),
		_("%3Ê\"\"5\"7Ë/N#%2>\"\"6>7?/,#;6/#$+\")(\"'#&'#.\" &\"/'$8\":Ì\" )(\"'#&'#"),
		_("%;h/P#%2>\"\"6>7?/,#;i/#$+\")(\"'#&'#.\" &\"/)$8\":Í\"\"! )(\"'#&'#"),
		_("%$;j/&#0#*;j&&&#/\"!&,)"),
		_("%$;j/&#0#*;j&&&#/\"!&,)"),
		_(";k.) &;+.# &;-"),
		_("2l\"\"6l7m.e &2n\"\"6n7o.Y &24\"\"6475.M &28\"\"6879.A &2<\"\"6<7=.5 &2@\"\"6@7A.) &2B\"\"6B7C"),
		_("%26\"\"6677/n#;m/e$$%2<\"\"6<7=/,#;m/#$+\")(\"'#&'#0<*%2<\"\"6<7=/,#;m/#$+\")(\"'#&'#&/#$+#)(#'#(\"'#&'#"),
		_("%;n/A#2>\"\"6>7?/2$;o/)$8#:Î#\"\" )(#'#(\"'#&'#"),
		_("$;p.) &;+.# &;-/2#0/*;p.) &;+.# &;-&&&#"),
		_("$;p.) &;+.# &;-0/*;p.) &;+.# &;-&"),
		_("2l\"\"6l7m.e &2n\"\"6n7o.Y &24\"\"6475.M &26\"\"6677.A &28\"\"6879.5 &2@\"\"6@7A.) &2B\"\"6B7C"),
		_(";.# &;r"),
		_("%;/G#;'/>$;s/5$;'/,$;/#$+%)(%'#($'#(#'#(\"'#&'#"),
		_(";M.# &;t"),
		_("%;/E#28\"\"6879/6$;u.# &;x/'$8#:Ï# )(#'#(\"'#&'#"),
		_("%;v.# &;w/J#%26\"\"6677/,#;/#$+\")(\"'#&'#.\" &\"/#$+\")(\"'#&'#"),
		_("%2Ð\"\"6Ð7Ñ/:#;/1$;w.\" &\"/#$+#)(#'#(\"'#&'#"),
		_("%24\"\"6475/,#;{/#$+\")(\"'#&'#"),
		_("%;z/3#$;y0#*;y&/#$+\")(\"'#&'#"),
		_(";*.) &;+.# &;-"),
		_(";+. &;-. &22\"\"6273.} &26\"\"6677.q &28\"\"6879.e &2:\"\"6:7;.Y &2<\"\"6<7=.M &2>\"\"6>7?.A &2@\"\"6@7A.5 &2B\"\"6B7C.) &2D\"\"6D7E"),
		_("%;|/e#$%24\"\"6475/,#;|/#$+\")(\"'#&'#0<*%24\"\"6475/,#;|/#$+\")(\"'#&'#&/#$+\")(\"'#&'#"),
		_("%$;~0#*;~&/e#$%22\"\"6273/,#;}/#$+\")(\"'#&'#0<*%22\"\"6273/,#;}/#$+\")(\"'#&'#&/#$+\")(\"'#&'#"),
		_("$;~0#*;~&"),
		_(";+.w &;-.q &28\"\"6879.e &2:\"\"6:7;.Y &2<\"\"6<7=.M &2>\"\"6>7?.A &2@\"\"6@7A.5 &2B\"\"6B7C.) &2D\"\"6D7E"),
		_("%%;\"/#$;\".G &;!.A &2@\"\"6@7A.5 &2F\"\"6F7G.) &2J\"\"6J7K0M*;\".G &;!.A &2@\"\"6@7A.5 &2F\"\"6F7G.) &2J\"\"6J7K&/#$+\")(\"'#&'#/& 8!:Ò! )"),
		_(";.# &;"),
		_("%%;O/2#2:\"\"6:7;/#$+\")(\"'#&'#.\" &\"/,#;S/#$+\")(\"'#&'#.\" &\""),
		_("$;+. &;-.} &2B\"\"6B7C.q &2D\"\"6D7E.e &22\"\"6273.Y &28\"\"6879.M &2:\"\"6:7;.A &2<\"\"6<7=.5 &2>\"\"6>7?.) &2@\"\"6@7A/#0*;+. &;-.} &2B\"\"6B7C.q &2D\"\"6D7E.e &22\"\"6273.Y &28\"\"6879.M &2:\"\"6:7;.A &2<\"\"6<7=.5 &2>\"\"6>7?.) &2@\"\"6@7A&&&#"),
		_("$;y0#*;y&"),
		_("%3\"\"5#7Ó/q#24\"\"6475/b$$;!/&#0#*;!&&&#/L$2J\"\"6J7K/=$$;!/&#0#*;!&&&#/'$8%:Ô% )(%'#($'#(#'#(\"'#&'#"),
		_("2Õ\"\"6Õ7Ö"),
		_("2×\"\"6×7Ø"),
		_("2Ù\"\"6Ù7Ú"),
		_("2Û\"\"6Û7Ü"),
		_("2Ý\"\"6Ý7Þ"),
		_("2ß\"\"6ß7à"),
		_("2á\"\"6á7â"),
		_("2ã\"\"6ã7ä"),
		_("2å\"\"6å7æ"),
		_("2ç\"\"6ç7è"),
		_("2é\"\"6é7ê"),
		_("%;.Y &;.S &;.M &;.G &;.A &;.; &;.5 &;./ &;.) &;.# &;6/& 8!:ë! )"),
		_("%;/G#;'/>$;/5$;'/,$;/#$+%)(%'#($'#(#'#(\"'#&'#"),
		_("%;/' 8!:ì!! )"),
		_("%;!/5#;!/,$;!/#$+#)(#'#(\"'#&'#"),
		_("%$;*.A &;+.; &;-.5 &;3./ &;4.) &;'.# &;(0G*;*.A &;+.; &;-.5 &;3./ &;4.) &;'.# &;(&/& 8!:í! )"),
		_("%;¶/Y#$%;A/,#;¶/#$+\")(\"'#&'#06*%;A/,#;¶/#$+\")(\"'#&'#&/#$+\")(\"'#&'#"),
		_("%;9/N#%2:\"\"6:7;/,#;9/#$+\")(\"'#&'#.\" &\"/'$8\":î\" )(\"'#&'#"),
		_("%;:.c &%;/Y#$%;A/,#;/#$+\")(\"'#&'#06*%;A/,#;/#$+\")(\"'#&'#&/#$+\")(\"'#&'#/& 8!:ï! )"),
		_("%;L.# &;/]#$%;B/,#;/#$+\")(\"'#&'#06*%;B/,#;/#$+\")(\"'#&'#&/'$8\":ð\" )(\"'#&'#"),
		_("%;.\" &\"/>#;@/5$;M/,$;?/#$+$)($'#(#'#(\"'#&'#"),
		_("%%;6/Y#$%;./,#;6/#$+\")(\"'#&'#06*%;./,#;6/#$+\")(\"'#&'#&/#$+\")(\"'#&'#.# &;H/' 8!:ñ!! )"),
		_(";.) &;.# &;\xA0"),
		_("%3ò\"\"5!7ó/:#;</1$;/($8#:ô#! )(#'#(\"'#&'#"),
		_("%3õ\"\"5'7ö/:#;</1$;/($8#:÷#! )(#'#(\"'#&'#"),
		_("%$;!/&#0#*;!&&&#/' 8!:ø!! )"),
		_("%2ù\"\"6ù7ú/o#%2J\"\"6J7K/M#;!.\" &\"/?$;!.\" &\"/1$;!.\" &\"/#$+$)($'#(#'#(\"'#&'#.\" &\"/'$8\":û\" )(\"'#&'#"),
		_("%;6/J#%;</,#;¡/#$+\")(\"'#&'#.\" &\"/)$8\":ü\"\"! )(\"'#&'#"),
		_(";6.) &;T.# &;H"),
		_("%;£/Y#$%;B/,#;¤/#$+\")(\"'#&'#06*%;B/,#;¤/#$+\")(\"'#&'#&/#$+\")(\"'#&'#"),
		_("%3ý\"\"5&7þ.G &3ÿ\"\"5'7Ā.; &3ā\"\"5$7Ă./ &3ă\"\"5%7Ą.# &;6/& 8!:ą! )"),
		_(";¥.# &;\xA0"),
		_("%3Ć\"\"5(7ć/M#;</D$3Ĉ\"\"5(7ĉ./ &3Ċ\"\"5(7ċ.# &;6/#$+#)(#'#(\"'#&'#"),
		_("%;6/Y#$%;A/,#;6/#$+\")(\"'#&'#06*%;A/,#;6/#$+\")(\"'#&'#&/#$+\")(\"'#&'#"),
		_("%$;!/&#0#*;!&&&#/' 8!:Č!! )"),
		_("%;©/& 8!:č! )"),
		_("%;ª/k#;;/b$;¯/Y$$%;B/,#;°/#$+\")(\"'#&'#06*%;B/,#;°/#$+\")(\"'#&'#&/#$+$)($'#(#'#(\"'#&'#"),
		_(";«.# &;¬"),
		_("3Ď\"\"5$7ď.S &3Đ\"\"5%7đ.G &3Ē\"\"5%7ē.; &3Ĕ\"\"5%7ĕ./ &3Ė\"\"5+7ė.# &;­"),
		_("3Ę\"\"5'7ę./ &3Ě\"\"5)7ě.# &;­"),
		_(";6.# &;®"),
		_("%3Ĝ\"\"5\"7ĝ/,#;6/#$+\")(\"'#&'#"),
		_(";­.# &;6"),
		_("%;6/5#;</,$;±/#$+#)(#'#(\"'#&'#"),
		_(";6.# &;H"),
		_("%;³/5#;./,$;/#$+#)(#'#(\"'#&'#"),
		_("%$;!/&#0#*;!&&&#/' 8!:Ğ!! )"),
		_("%;/' 8!:ğ!! )"),
		_("%;¶/^#$%;B/,#;\xA0/#$+\")(\"'#&'#06*%;B/,#;\xA0/#$+\")(\"'#&'#&/($8\":Ġ\"!!)(\"'#&'#"),
		_("%%;7/e#$%2J\"\"6J7K/,#;7/#$+\")(\"'#&'#0<*%2J\"\"6J7K/,#;7/#$+\")(\"'#&'#&/#$+\")(\"'#&'#/\"!&,)"),
		_("%;L.# &;/]#$%;B/,#;¸/#$+\")(\"'#&'#06*%;B/,#;¸/#$+\")(\"'#&'#&/'$8\":ġ\" )(\"'#&'#"),
		_(";¹.# &;\xA0"),
		_("%3Ģ\"\"5#7ģ/:#;</1$;6/($8#:Ĥ#! )(#'#(\"'#&'#"),
		_("%$;!/&#0#*;!&&&#/' 8!:ĥ!! )"),
		_("%;/' 8!:Ħ!! )"),
		_("%$;0#*;&/x#;@/o$;M/f$;?/]$$%;B/,#;\xA0/#$+\")(\"'#&'#06*%;B/,#;\xA0/#$+\")(\"'#&'#&/'$8%:ħ% )(%'#($'#(#'#(\"'#&'#"),
		_(";¾"),
		_("%3Ĩ\"\"5&7ĩ/k#;./b$;Á/Y$$%;A/,#;Á/#$+\")(\"'#&'#06*%;A/,#;Á/#$+\")(\"'#&'#&/#$+$)($'#(#'#(\"'#&'#.# &;¿"),
		_("%;6/k#;./b$;À/Y$$%;A/,#;À/#$+\")(\"'#&'#06*%;A/,#;À/#$+\")(\"'#&'#&/#$+$)($'#(#'#(\"'#&'#"),
		_("%;6/;#;</2$;6.# &;H/#$+#)(#'#(\"'#&'#"),
		_(";Â.G &;Ä.A &;Æ.; &;È.5 &;É./ &;Ê.) &;Ë.# &;À"),
		_("%3Ī\"\"5%7ī/5#;</,$;Ã/#$+#)(#'#(\"'#&'#"),
		_("%;I/' 8!:Ĭ!! )"),
		_("%3ĭ\"\"5&7Į/#;</$;D/$;Å/|$$%$;'/&#0#*;'&&&#/,#;Å/#$+\")(\"'#&'#0C*%$;'/&#0#*;'&&&#/,#;Å/#$+\")(\"'#&'#&/,$;E/#$+&)(&'#(%'#($'#(#'#(\"'#&'#"),
		_(";t.# &;w"),
		_("%3į\"\"5%7İ/5#;</,$;Ç/#$+#)(#'#(\"'#&'#"),
		_("%;I/' 8!:ı!! )"),
		_("%3Ĳ\"\"5&7ĳ/:#;</1$;I/($8#:Ĵ#! )(#'#(\"'#&'#"),
		_("%3ĵ\"\"5%7Ķ/]#;</T$%3ķ\"\"5$7ĸ/& 8!:Ĺ! ).4 &%3ĺ\"\"5%7Ļ/& 8!:ļ! )/#$+#)(#'#(\"'#&'#"),
		_("%3Ľ\"\"5)7ľ/R#;</I$3Ŀ\"\"5#7ŀ./ &3Ł\"\"5(7ł.# &;6/($8#:Ń#! )(#'#(\"'#&'#"),
		_("%3ń\"\"5#7Ņ/#;</$;D/$%;Ì/e#$%2D\"\"6D7E/,#;Ì/#$+\")(\"'#&'#0<*%2D\"\"6D7E/,#;Ì/#$+\")(\"'#&'#&/#$+\")(\"'#&'#/,$;E/#$+%)(%'#($'#(#'#(\"'#&'#"),
		_("%3ņ\"\"5(7Ň./ &3ň\"\"5$7ŉ.# &;6/' 8!:Ŋ!! )"),
		_("%;6/Y#$%;A/,#;6/#$+\")(\"'#&'#06*%;A/,#;6/#$+\")(\"'#&'#&/#$+\")(\"'#&'#"),
		_("%;Ï/G#;./>$;Ï/5$;./,$;/#$+%)(%'#($'#(#'#(\"'#&'#"),
		_("%$;!/&#0#*;!&&&#/' 8!:ŋ!! )"),
		_("%;Ñ/]#$%;A/,#;Ñ/#$+\")(\"'#&'#06*%;A/,#;Ñ/#$+\")(\"'#&'#&/'$8\":Ō\" )(\"'#&'#"),
		_("%;/]#$%;B/,#;\xA0/#$+\")(\"'#&'#06*%;B/,#;\xA0/#$+\")(\"'#&'#&/'$8\":ō\" )(\"'#&'#"),
		_("%;L.O &;.I &%;@.\" &\"/:#;t/1$;?.\" &\"/#$+#)(#'#(\"'#&'#/]#$%;B/,#;\xA0/#$+\")(\"'#&'#06*%;B/,#;\xA0/#$+\")(\"'#&'#&/'$8\":Ŏ\" )(\"'#&'#"),
		_("%;Ô/]#$%;B/,#;Õ/#$+\")(\"'#&'#06*%;B/,#;Õ/#$+\")(\"'#&'#&/'$8\":ŏ\" )(\"'#&'#"),
		_("%;/& 8!:Ő! )"),
		_("%3ő\"\"5(7Œ/:#;</1$;6/($8#:œ#! )(#'#(\"'#&'#.g &%3Ŕ\"\"5&7ŕ/:#;</1$;6/($8#:Ŗ#! )(#'#(\"'#&'#.: &%3ŗ\"\"5*7Ř/& 8!:ř! ).# &;\xA0"),
		_("%%;6/k#$%;A/2#;6/)$8\":Ś\"\"$ )(\"'#&'#0<*%;A/2#;6/)$8\":Ś\"\"$ )(\"'#&'#&/)$8\":ś\"\"! )(\"'#&'#.\" &\"/' 8!:Ŝ!! )"),
		_("%;Ø/Y#$%;A/,#;Ø/#$+\")(\"'#&'#06*%;A/,#;Ø/#$+\")(\"'#&'#&/#$+\")(\"'#&'#"),
		_("%;/Y#$%;B/,#;\xA0/#$+\")(\"'#&'#06*%;B/,#;\xA0/#$+\")(\"'#&'#&/#$+\")(\"'#&'#"),
		_("%$;!/&#0#*;!&&&#/' 8!:ŝ!! )"),
		_("%;Û/Y#$%;B/,#;Ü/#$+\")(\"'#&'#06*%;B/,#;Ü/#$+\")(\"'#&'#&/#$+\")(\"'#&'#"),
		_("%3Ş\"\"5&7ş.; &3Š\"\"5'7š./ &3Ţ\"\"5*7ţ.# &;6/& 8!:Ť! )"),
		_("%3ť\"\"5&7Ŧ/:#;</1$;Ý/($8#:ŧ#! )(#'#(\"'#&'#.} &%3õ\"\"5'7ö/:#;</1$;/($8#:Ũ#! )(#'#(\"'#&'#.P &%3ũ\"\"5+7Ū/:#;</1$;/($8#:ū#! )(#'#(\"'#&'#.# &;\xA0"),
		_("3Ŭ\"\"5+7ŭ.k &3Ů\"\"5)7ů._ &3Ű\"\"5(7ű.S &3Ų\"\"5'7ų.G &3Ŵ\"\"5&7ŵ.; &3Ŷ\"\"5*7ŷ./ &3Ÿ\"\"5)7Ź.# &;6"),
		_(";1.\" &\""),
		_("%%;6/k#$%;A/2#;6/)$8\":Ś\"\"$ )(\"'#&'#0<*%;A/2#;6/)$8\":Ś\"\"$ )(\"'#&'#&/)$8\":ś\"\"! )(\"'#&'#.\" &\"/' 8!:ź!! )"),
		_("%;L.# &;/]#$%;B/,#;á/#$+\")(\"'#&'#06*%;B/,#;á/#$+\")(\"'#&'#&/'$8\":Ż\" )(\"'#&'#"),
		_(";¹.# &;\xA0"),
		_("%;ã/Y#$%;A/,#;ã/#$+\")(\"'#&'#06*%;A/,#;ã/#$+\")(\"'#&'#&/#$+\")(\"'#&'#"),
		_("%;ê/k#;./b$;í/Y$$%;B/,#;ä/#$+\")(\"'#&'#06*%;B/,#;ä/#$+\")(\"'#&'#&/#$+$)($'#(#'#(\"'#&'#"),
		_(";å.; &;æ.5 &;ç./ &;è.) &;é.# &;\xA0"),
		_("%3ż\"\"5#7Ž/:#;</1$;ð/($8#:ž#! )(#'#(\"'#&'#"),
		_("%3ſ\"\"5%7ƀ/:#;</1$;T/($8#:Ɓ#! )(#'#(\"'#&'#"),
		_("%3Ƃ\"\"5(7ƃ/F#;</=$;\\.) &;Y.# &;X/($8#:Ƅ#! )(#'#(\"'#&'#"),
		_("%3ƅ\"\"5&7Ɔ/:#;</1$;6/($8#:Ƈ#! )(#'#(\"'#&'#"),
		_("%3ƈ\"\"5%7Ɖ/A#;</8$$;!0#*;!&/($8#:Ɗ#! )(#'#(\"'#&'#"),
		_("%;ë/G#;;/>$;6/5$;;/,$;ì/#$+%)(%'#($'#(#'#(\"'#&'#"),
		_("%3\"\"5#7Ó.# &;6/' 8!:Ƌ!! )"),
		_("%3±\"\"5#7ƌ.G &3³\"\"5#7ƍ.; &3·\"\"5#7Ǝ./ &3µ\"\"5$7Ə.# &;6/' 8!:Ɛ!! )"),
		_("%;î/D#%;C/,#;ï/#$+\")(\"'#&'#.\" &\"/#$+\")(\"'#&'#"),
		_("%;U.) &;\\.# &;X/& 8!:Ƒ! )"),
		_("%%;!.\" &\"/[#;!.\" &\"/M$;!.\" &\"/?$;!.\" &\"/1$;!.\" &\"/#$+%)(%'#($'#(#'#(\"'#&'#/' 8!:ƒ!! )"),
		_("%%;!/?#;!.\" &\"/1$;!.\" &\"/#$+#)(#'#(\"'#&'#/' 8!:Ɠ!! )"),
		_(";¾"),
		_("%;/^#$%;B/,#;ó/#$+\")(\"'#&'#06*%;B/,#;ó/#$+\")(\"'#&'#&/($8\":Ɣ\"!!)(\"'#&'#"),
		_(";ô.# &;\xA0"),
		_("%2ƕ\"\"6ƕ7Ɩ/L#;</C$2Ɨ\"\"6Ɨ7Ƙ.) &2ƙ\"\"6ƙ7ƚ/($8#:ƛ#! )(#'#(\"'#&'#"),
		_("%;/^#$%;B/,#;\xA0/#$+\")(\"'#&'#06*%;B/,#;\xA0/#$+\")(\"'#&'#&/($8\":Ɯ\"!!)(\"'#&'#"),
		_("%;6/5#;0/,$;÷/#$+#)(#'#(\"'#&'#"),
		_("$;2.) &;4.# &;.0/*;2.) &;4.# &;.&"),
		_("$;%0#*;%&"),
		_("%;ú/;#28\"\"6879/,$;û/#$+#)(#'#(\"'#&'#"),
		_("%3Ɲ\"\"5%7ƞ.) &3Ɵ\"\"5$7Ơ/' 8!:ơ!! )"),
		_("%;ü/J#%28\"\"6879/,#;^/#$+\")(\"'#&'#.\" &\"/#$+\")(\"'#&'#"),
		_("%;\\.) &;X.# &;/' 8!:Ƣ!! )"),
		_(";\".S &;!.M &2F\"\"6F7G.A &2J\"\"6J7K.5 &2H\"\"6H7I.) &2N\"\"6N7O"),
		_("2L\"\"6L7M. &2B\"\"6B7C. &2<\"\"6<7=.} &2R\"\"6R7S.q &2T\"\"6T7U.e &2V\"\"6V7W.Y &2P\"\"6P7Q.M &2@\"\"6@7A.A &2D\"\"6D7E.5 &22\"\"6273.) &2>\"\"6>7?"),
		_("%;Ā/b#28\"\"6879/S$;û/J$%2ƣ\"\"6ƣ7Ƥ/,#;ì/#$+\")(\"'#&'#.\" &\"/#$+$)($'#(#'#(\"'#&'#"),
		_("%3ƥ\"\"5%7Ʀ.) &3Ƨ\"\"5$7ƨ/' 8!:ơ!! )"),
		_("%3±\"\"5#7².6 &3³\"\"5#7´.* &$;+0#*;+&/' 8!:Ʃ!! )"),
		_("%;Ą/#2F\"\"6F7G/x$;ă/o$2F\"\"6F7G/`$;ă/W$2F\"\"6F7G/H$;ă/?$2F\"\"6F7G/0$;ą/'$8):ƪ) )()'#(('#(''#(&'#(%'#($'#(#'#(\"'#&'#"),
		_("%;#/>#;#/5$;#/,$;#/#$+$)($'#(#'#(\"'#&'#"),
		_("%;ă/,#;ă/#$+\")(\"'#&'#"),
		_("%;ă/5#;ă/,$;ă/#$+#)(#'#(\"'#&'#"),
		_("%;q/T#$;m0#*;m&/D$%; /,#;ø/#$+\")(\"'#&'#.\" &\"/#$+#)(#'#(\"'#&'#"),
		_("%2ƫ\"\"6ƫ7Ƭ.) &2ƭ\"\"6ƭ7Ʈ/w#;0/n$;Ĉ/e$$%;B/2#;ĉ.# &;\xA0/#$+\")(\"'#&'#0<*%;B/2#;ĉ.# &;\xA0/#$+\")(\"'#&'#&/#$+$)($'#(#'#(\"'#&'#"),
		_(";.# &;L"),
		_("%2Ư\"\"6Ư7ư/5#;</,$;Ċ/#$+#)(#'#(\"'#&'#"),
		_("%;D/S#;,/J$2:\"\"6:7;/;$;,.# &;T/,$;E/#$+%)(%'#($'#(#'#(\"'#&'#")
	], c = 0, l = 0, u = [{
		line: 1,
		column: 1
	}], d = 0, f = [], ee = 0, p;
	if (t.startRule !== void 0) {
		if (!(t.startRule in i)) throw Error("Can't start parsing from rule \"" + t.startRule + "\".");
		a = i[t.startRule];
	}
	function m() {
		return e.substring(l, c);
	}
	function te() {
		return ie(l, c);
	}
	function h(e, t) {
		return {
			type: "literal",
			text: e,
			ignoreCase: t
		};
	}
	function g(e, t, n) {
		return {
			type: "class",
			parts: e,
			inverted: t,
			ignoreCase: n
		};
	}
	function ne() {
		return { type: "end" };
	}
	function re(t) {
		let n = u[t], r;
		if (n) return n;
		for (r = t - 1; !u[r];) r--;
		for (n = u[r], n = {
			line: n.line,
			column: n.column
		}; r < t;) e.charCodeAt(r) === 10 ? (n.line++, n.column = 1) : n.column++, r++;
		return u[t] = n, n;
	}
	function ie(e, t) {
		let n = re(e), i = re(t);
		return {
			source: r,
			start: {
				offset: e,
				line: n.line,
				column: n.column
			},
			end: {
				offset: t,
				line: i.line,
				column: i.column
			}
		};
	}
	function ae(e) {
		c < d || (c > d && (d = c, f = []), f.push(e));
	}
	function oe(e, t, n) {
		return new Pt(Pt.buildMessage(e, t), e, t, n);
	}
	function _(e) {
		return e.split("").map((e) => e.charCodeAt(0) - 32);
	}
	function se(t) {
		let r = s[t], i = 0, a = [], u = r.length, d = [], f = [], p;
		for (;;) {
			for (; i < u;) switch (r[i]) {
				case 0:
					f.push(o[r[i + 1]]), i += 2;
					break;
				case 1:
					f.push(void 0), i++;
					break;
				case 2:
					f.push(null), i++;
					break;
				case 3:
					f.push(n), i++;
					break;
				case 4:
					f.push([]), i++;
					break;
				case 5:
					f.push(c), i++;
					break;
				case 6:
					f.pop(), i++;
					break;
				case 7:
					c = f.pop(), i++;
					break;
				case 8:
					f.length -= r[i + 1], i += 2;
					break;
				case 9:
					f.splice(-2, 1), i++;
					break;
				case 10:
					f[f.length - 2].push(f.pop()), i++;
					break;
				case 11:
					f.push(f.splice(f.length - r[i + 1], r[i + 1])), i += 2;
					break;
				case 12:
					f.push(e.substring(f.pop(), c)), i++;
					break;
				case 13:
					d.push(u), a.push(i + 3 + r[i + 1] + r[i + 2]), f[f.length - 1] ? (u = i + 3 + r[i + 1], i += 3) : (u = i + 3 + r[i + 1] + r[i + 2], i += 3 + r[i + 1]);
					break;
				case 14:
					d.push(u), a.push(i + 3 + r[i + 1] + r[i + 2]), f[f.length - 1] === n ? (u = i + 3 + r[i + 1], i += 3) : (u = i + 3 + r[i + 1] + r[i + 2], i += 3 + r[i + 1]);
					break;
				case 15:
					d.push(u), a.push(i + 3 + r[i + 1] + r[i + 2]), f[f.length - 1] === n ? (u = i + 3 + r[i + 1] + r[i + 2], i += 3 + r[i + 1]) : (u = i + 3 + r[i + 1], i += 3);
					break;
				case 16:
					f[f.length - 1] === n ? i += 2 + r[i + 1] : (d.push(u), a.push(i), u = i + 2 + r[i + 1], i += 2);
					break;
				case 17:
					d.push(u), a.push(i + 3 + r[i + 1] + r[i + 2]), e.length > c ? (u = i + 3 + r[i + 1], i += 3) : (u = i + 3 + r[i + 1] + r[i + 2], i += 3 + r[i + 1]);
					break;
				case 18:
					d.push(u), a.push(i + 4 + r[i + 2] + r[i + 3]), e.substr(c, o[r[i + 1]].length) === o[r[i + 1]] ? (u = i + 4 + r[i + 2], i += 4) : (u = i + 4 + r[i + 2] + r[i + 3], i += 4 + r[i + 2]);
					break;
				case 19:
					d.push(u), a.push(i + 4 + r[i + 2] + r[i + 3]), e.substr(c, o[r[i + 1]].length).toLowerCase() === o[r[i + 1]] ? (u = i + 4 + r[i + 2], i += 4) : (u = i + 4 + r[i + 2] + r[i + 3], i += 4 + r[i + 2]);
					break;
				case 20:
					d.push(u), a.push(i + 4 + r[i + 2] + r[i + 3]), o[r[i + 1]].test(e.charAt(c)) ? (u = i + 4 + r[i + 2], i += 4) : (u = i + 4 + r[i + 2] + r[i + 3], i += 4 + r[i + 2]);
					break;
				case 21:
					f.push(e.substr(c, r[i + 1])), c += r[i + 1], i += 2;
					break;
				case 22:
					f.push(o[r[i + 1]]), c += o[r[i + 1]].length, i += 2;
					break;
				case 23:
					f.push(n), ee === 0 && ae(o[r[i + 1]]), i += 2;
					break;
				case 24:
					l = f[f.length - 1 - r[i + 1]], i += 2;
					break;
				case 25:
					l = c, i++;
					break;
				case 26:
					p = r.slice(i + 4, i + 4 + r[i + 3]).map(function(e) {
						return f[f.length - 1 - e];
					}), f.splice(f.length - r[i + 2], r[i + 2], o[r[i + 1]].apply(null, p)), i += 4 + r[i + 3];
					break;
				case 27:
					f.push(se(r[i + 1])), i += 2;
					break;
				case 28:
					ee++, i++;
					break;
				case 29:
					ee--, i++;
					break;
				default: throw Error("Invalid opcode: " + r[i] + ".");
			}
			if (d.length > 0) u = d.pop(), i = a.pop();
			else break;
		}
		return f[0];
	}
	t.data = {};
	function ce(e, t) {
		return [e].concat(t);
	}
	if (p = se(a), p !== n && c === e.length) return p;
	throw p !== n && c < e.length && ae(ne()), oe(f, d < e.length ? e.charAt(d) : null, d < e.length ? ie(d, d + 1) : ie(d, d));
}
var It = Ft, O;
(function(e) {
	function t(e, t) {
		let n = { startRule: t };
		try {
			It(e, n);
		} catch {
			n.data = -1;
		}
		return n.data;
	}
	e.parse = t;
	function n(t) {
		let n = e.parse(t, "Name_Addr_Header");
		return n === -1 ? void 0 : n;
	}
	e.nameAddrHeaderParse = n;
	function r(t) {
		let n = e.parse(t, "SIP_URI");
		return n === -1 ? void 0 : n;
	}
	e.URIParse = r;
})(O = O ||= {});
// node_modules/sip.js/lib/core/messages/utils.js
var Lt = {
	100: "Trying",
	180: "Ringing",
	181: "Call Is Being Forwarded",
	182: "Queued",
	183: "Session Progress",
	199: "Early Dialog Terminated",
	200: "OK",
	202: "Accepted",
	204: "No Notification",
	300: "Multiple Choices",
	301: "Moved Permanently",
	302: "Moved Temporarily",
	305: "Use Proxy",
	380: "Alternative Service",
	400: "Bad Request",
	401: "Unauthorized",
	402: "Payment Required",
	403: "Forbidden",
	404: "Not Found",
	405: "Method Not Allowed",
	406: "Not Acceptable",
	407: "Proxy Authentication Required",
	408: "Request Timeout",
	410: "Gone",
	412: "Conditional Request Failed",
	413: "Request Entity Too Large",
	414: "Request-URI Too Long",
	415: "Unsupported Media Type",
	416: "Unsupported URI Scheme",
	417: "Unknown Resource-Priority",
	420: "Bad Extension",
	421: "Extension Required",
	422: "Session Interval Too Small",
	423: "Interval Too Brief",
	428: "Use Identity Header",
	429: "Provide Referrer Identity",
	430: "Flow Failed",
	433: "Anonymity Disallowed",
	436: "Bad Identity-Info",
	437: "Unsupported Certificate",
	438: "Invalid Identity Header",
	439: "First Hop Lacks Outbound Support",
	440: "Max-Breadth Exceeded",
	469: "Bad Info Package",
	470: "Consent Needed",
	478: "Unresolvable Destination",
	480: "Temporarily Unavailable",
	481: "Call/Transaction Does Not Exist",
	482: "Loop Detected",
	483: "Too Many Hops",
	484: "Address Incomplete",
	485: "Ambiguous",
	486: "Busy Here",
	487: "Request Terminated",
	488: "Not Acceptable Here",
	489: "Bad Event",
	491: "Request Pending",
	493: "Undecipherable",
	494: "Security Agreement Required",
	500: "Internal Server Error",
	501: "Not Implemented",
	502: "Bad Gateway",
	503: "Service Unavailable",
	504: "Server Time-out",
	505: "Version Not Supported",
	513: "Message Too Large",
	580: "Precondition Failure",
	600: "Busy Everywhere",
	603: "Decline",
	604: "Does Not Exist Anywhere",
	606: "Not Acceptable"
};
function Rt(e, t = 32) {
	let n = "";
	for (let r = 0; r < e; r++) {
		let e = Math.floor(Math.random() * t);
		n += e.toString(t);
	}
	return n;
}
function zt(e) {
	return Lt[e] || "";
}
function Bt() {
	return Rt(10);
}
function k(e) {
	let t = {
		"Call-Id": "Call-ID",
		Cseq: "CSeq",
		"Min-Se": "Min-SE",
		Rack: "RAck",
		Rseq: "RSeq",
		"Www-Authenticate": "WWW-Authenticate"
	}, n = e.toLowerCase().replace(/_/g, "-").split("-"), r = n.length, i = "";
	for (let e = 0; e < r; e++) e !== 0 && (i += "-"), i += n[e].charAt(0).toUpperCase() + n[e].substring(1);
	return t[i] && (i = t[i]), i;
}
function Vt(e) {
	return encodeURIComponent(e).replace(/%[A-F\d]{2}/g, "U").length;
}
// node_modules/sip.js/lib/core/messages/incoming-message.js
var Ht = class {
	constructor() {
		this.headers = {};
	}
	addHeader(e, t) {
		let n = { raw: t };
		e = k(e), this.headers[e] ? this.headers[e].push(n) : this.headers[e] = [n];
	}
	getHeader(e) {
		let t = this.headers[k(e)];
		if (t) {
			if (t[0]) return t[0].raw;
		} else return;
	}
	getHeaders(e) {
		let t = this.headers[k(e)], n = [];
		if (!t) return [];
		for (let e of t) n.push(e.raw);
		return n;
	}
	hasHeader(e) {
		return !!this.headers[k(e)];
	}
	parseHeader(e, t = 0) {
		if (e = k(e), !this.headers[e] || t >= this.headers[e].length) return;
		let n = this.headers[e][t], r = n.raw;
		if (n.parsed) return n.parsed;
		let i = O.parse(r, e.replace(/-/g, "_"));
		if (i === -1) this.headers[e].splice(t, 1);
		else return n.parsed = i, i;
	}
	s(e, t = 0) {
		return this.parseHeader(e, t);
	}
	setHeader(e, t) {
		this.headers[k(e)] = [{ raw: t }];
	}
	toString() {
		return this.data;
	}
}, Ut = class extends Ht {
	constructor() {
		super();
	}
}, A = class extends Ht {
	constructor() {
		super();
	}
}, Wt = class e {
	constructor(t, n, r, i, a, o, s) {
		this.headers = {}, this.extraHeaders = [], this.options = e.getDefaultOptions(), a && (this.options = Object.assign(Object.assign({}, this.options), a), this.options.optionTags && this.options.optionTags.length && (this.options.optionTags = this.options.optionTags.slice()), this.options.routeSet && this.options.routeSet.length && (this.options.routeSet = this.options.routeSet.slice())), o && o.length && (this.extraHeaders = o.slice()), s && (this.body = {
			body: s.content,
			contentType: s.contentType
		}), this.method = t, this.ruri = n.clone(), this.fromURI = r.clone(), this.fromTag = this.options.fromTag ? this.options.fromTag : Bt(), this.from = e.makeNameAddrHeader(this.fromURI, this.options.fromDisplayName, this.fromTag), this.toURI = i.clone(), this.toTag = this.options.toTag, this.to = e.makeNameAddrHeader(this.toURI, this.options.toDisplayName, this.toTag), this.callId = this.options.callId ? this.options.callId : this.options.callIdPrefix + Rt(15), this.cseq = this.options.cseq, this.setHeader("route", this.options.routeSet), this.setHeader("via", ""), this.setHeader("to", this.to.toString()), this.setHeader("from", this.from.toString()), this.setHeader("cseq", this.cseq + " " + this.method), this.setHeader("call-id", this.callId), this.setHeader("max-forwards", "70");
	}
	static getDefaultOptions() {
		return {
			callId: "",
			callIdPrefix: "",
			cseq: 1,
			toDisplayName: "",
			toTag: "",
			fromDisplayName: "",
			fromTag: "",
			forceRport: !1,
			hackViaTcp: !1,
			optionTags: ["outbound"],
			routeSet: [],
			userAgentString: "sip.js",
			viaHost: ""
		};
	}
	static makeNameAddrHeader(e, t, n) {
		let r = {};
		return n && (r.tag = n), new E(e, t, r);
	}
	getHeader(e) {
		let t = this.headers[k(e)];
		if (t) {
			if (t[0]) return t[0];
		} else {
			let t = RegExp("^\\s*" + e + "\\s*:", "i");
			for (let e of this.extraHeaders) if (t.test(e)) return e.substring(e.indexOf(":") + 1).trim();
		}
	}
	getHeaders(e) {
		let t = [], n = this.headers[k(e)];
		if (n) for (let e of n) t.push(e);
		else {
			let n = RegExp("^\\s*" + e + "\\s*:", "i");
			for (let e of this.extraHeaders) n.test(e) && t.push(e.substring(e.indexOf(":") + 1).trim());
		}
		return t;
	}
	hasHeader(e) {
		if (this.headers[k(e)]) return !0;
		{
			let t = RegExp("^\\s*" + e + "\\s*:", "i");
			for (let e of this.extraHeaders) if (t.test(e)) return !0;
		}
		return !1;
	}
	setHeader(e, t) {
		this.headers[k(e)] = t instanceof Array ? t : [t];
	}
	setViaHeader(e, t) {
		this.options.hackViaTcp && (t = "TCP");
		let n = "SIP/2.0/" + t;
		n += " " + this.options.viaHost + ";branch=" + e, this.options.forceRport && (n += ";rport"), this.setHeader("via", n), this.branch = e;
	}
	toString() {
		let e = "";
		e += this.method + " " + this.ruri.toRaw() + " SIP/2.0\r\n";
		for (let t in this.headers) if (this.headers[t]) for (let n of this.headers[t]) e += t + ": " + n + "\r\n";
		for (let t of this.extraHeaders) e += t.trim() + "\r\n";
		return e += "Supported: " + this.options.optionTags.join(", ") + "\r\n", e += "User-Agent: " + this.options.userAgentString + "\r\n", this.body ? typeof this.body == "string" ? (e += "Content-Length: " + Vt(this.body) + "\r\n\r\n", e += this.body) : this.body.body && this.body.contentType ? (e += "Content-Type: " + this.body.contentType + "\r\n", e += "Content-Length: " + Vt(this.body.body) + "\r\n\r\n", e += this.body.body) : e += "Content-Length: 0\r\n\r\n" : e += "Content-Length: 0\r\n\r\n", e;
	}
};
// node_modules/sip.js/lib/core/messages/body.js
function Gt(e) {
	return e === "application/sdp" ? "session" : "render";
}
function Kt(e) {
	let t = typeof e == "string" ? e : e.body, n = typeof e == "string" ? "application/sdp" : e.contentType;
	return {
		contentDisposition: Gt(n),
		contentType: n,
		content: t
	};
}
function qt(e) {
	return e && typeof e.content == "string" && typeof e.contentType == "string" && e.contentDisposition === void 0 ? !0 : typeof e.contentDisposition == "string";
}
function Jt(e) {
	let t, n, r;
	if (e instanceof Ut && e.body) {
		let i = e.parseHeader("Content-Disposition");
		t = i ? i.type : void 0, n = e.parseHeader("Content-Type"), r = e.body;
	}
	if (e instanceof A && e.body) {
		let i = e.parseHeader("Content-Disposition");
		t = i ? i.type : void 0, n = e.parseHeader("Content-Type"), r = e.body;
	}
	if (e instanceof Wt && e.body) {
		if (t = e.getHeader("Content-Disposition"), n = e.getHeader("Content-Type"), typeof e.body == "string") {
			if (!n) throw Error("Header content type header does not equal body content type.");
			r = e.body;
		} else {
			if (n && n !== e.body.contentType) throw Error("Header content type header does not equal body content type.");
			n = e.body.contentType, r = e.body.body;
		}
	}
	if (qt(e) && (t = e.contentDisposition, n = e.contentType, r = e.content), r) {
		if (n && !t && (t = Gt(n)), !t) throw Error("Content disposition undefined.");
		if (!n) throw Error("Content type undefined.");
		return {
			contentDisposition: t,
			contentType: n,
			content: r
		};
	}
}
// node_modules/sip.js/lib/core/session/session.js
var j;
(function(e) {
	e.Initial = "Initial", e.Early = "Early", e.AckWait = "AckWait", e.Confirmed = "Confirmed", e.Terminated = "Terminated";
})(j = j ||= {});
var M;
(function(e) {
	e.Initial = "Initial", e.HaveLocalOffer = "HaveLocalOffer", e.HaveRemoteOffer = "HaveRemoteOffer", e.Stable = "Stable", e.Closed = "Closed";
})(M = M ||= {});
// node_modules/sip.js/lib/core/timers.js
var Yt = 500, N = {
	T1: Yt,
	T2: 4e3,
	T4: 5e3,
	TIMER_B: 64 * Yt,
	TIMER_D: 0,
	TIMER_F: 64 * Yt,
	TIMER_H: 64 * Yt,
	TIMER_I: 0,
	TIMER_J: 0,
	TIMER_K: 0,
	TIMER_L: 64 * Yt,
	TIMER_M: 64 * Yt,
	TIMER_N: 64 * Yt,
	PROVISIONAL_RESPONSE_INTERVAL: 6e4
}, P = class extends bt {
	constructor(e) {
		super(e || "Transaction state error.");
	}
}, F;
(function(e) {
	e.ACK = "ACK", e.BYE = "BYE", e.CANCEL = "CANCEL", e.INFO = "INFO", e.INVITE = "INVITE", e.MESSAGE = "MESSAGE", e.NOTIFY = "NOTIFY", e.OPTIONS = "OPTIONS", e.REGISTER = "REGISTER", e.UPDATE = "UPDATE", e.SUBSCRIBE = "SUBSCRIBE", e.PUBLISH = "PUBLISH", e.REFER = "REFER", e.PRACK = "PRACK";
})(F = F ||= {});
// node_modules/sip.js/lib/core/user-agent-core/allowed-methods.js
var I = [
	F.ACK,
	F.BYE,
	F.CANCEL,
	F.INFO,
	F.INVITE,
	F.MESSAGE,
	F.NOTIFY,
	F.OPTIONS,
	F.PRACK,
	F.REFER,
	F.REGISTER,
	F.SUBSCRIBE
], Xt = class {
	constructor(e) {
		this.incomingMessageRequest = e;
	}
	get request() {
		return this.incomingMessageRequest.message;
	}
	accept(e) {
		return this.incomingMessageRequest.accept(e), Promise.resolve();
	}
	reject(e) {
		return this.incomingMessageRequest.reject(e), Promise.resolve();
	}
}, Zt = class {
	constructor(e) {
		this.incomingNotifyRequest = e;
	}
	get request() {
		return this.incomingNotifyRequest.message;
	}
	accept(e) {
		return this.incomingNotifyRequest.accept(e), Promise.resolve();
	}
	reject(e) {
		return this.incomingNotifyRequest.reject(e), Promise.resolve();
	}
}, Qt = class {
	constructor(e, t) {
		this.incomingReferRequest = e, this.session = t;
	}
	get referTo() {
		let e = this.incomingReferRequest.message.parseHeader("refer-to");
		if (!(e instanceof E)) throw Error("Failed to parse Refer-To header.");
		return e;
	}
	get referredBy() {
		return this.incomingReferRequest.message.getHeader("referred-by");
	}
	get replaces() {
		let e = this.referTo.uri.getHeader("replaces");
		return e instanceof Array ? e[0] : e;
	}
	get request() {
		return this.incomingReferRequest.message;
	}
	accept(e = { statusCode: 202 }) {
		return this.incomingReferRequest.accept(e), Promise.resolve();
	}
	reject(e) {
		return this.incomingReferRequest.reject(e), Promise.resolve();
	}
	makeInviter(e) {
		if (this.inviter) return this.inviter;
		let t = this.referTo.uri.clone();
		t.clearHeaders(), e ||= {};
		let n = (e.extraHeaders || []).slice(), r = this.replaces;
		r && n.push("Replaces: " + decodeURIComponent(r));
		let i = this.referredBy;
		return i && n.push("Referred-By: " + i), e.extraHeaders = n, this.inviter = this.session.userAgent._makeInviter(t, e), this.inviter._referred = this.session, this.session._referral = this.inviter, this.inviter;
	}
}, L;
(function(e) {
	e.Initial = "Initial", e.Establishing = "Establishing", e.Established = "Established", e.Terminating = "Terminating", e.Terminated = "Terminated";
})(L = L ||= {});
// node_modules/sip.js/lib/api/session.js
var $t = class e {
	constructor(e, t = {}) {
		this.pendingReinvite = !1, this.pendingReinviteAck = !1, this._state = L.Initial, this.delegate = t.delegate, this._stateEventEmitter = new kt(), this._userAgent = e;
	}
	dispose() {
		switch (this.logger.log(`Session ${this.id} in state ${this._state} is being disposed`), delete this.userAgent._sessions[this.id], this._sessionDescriptionHandler && this._sessionDescriptionHandler.close(), this.state) {
			case L.Initial: break;
			case L.Establishing: break;
			case L.Established: return new Promise((e) => {
				this._bye({
					onAccept: () => e(),
					onRedirect: () => e(),
					onReject: () => e()
				});
			});
			case L.Terminating: break;
			case L.Terminated: break;
			default: throw Error("Unknown state.");
		}
		return Promise.resolve();
	}
	get assertedIdentity() {
		return this._assertedIdentity;
	}
	get dialog() {
		return this._dialog;
	}
	get id() {
		return this._id;
	}
	get replacee() {
		return this._replacee;
	}
	get sessionDescriptionHandler() {
		return this._sessionDescriptionHandler;
	}
	get sessionDescriptionHandlerFactory() {
		return this.userAgent.configuration.sessionDescriptionHandlerFactory;
	}
	get sessionDescriptionHandlerModifiers() {
		return this._sessionDescriptionHandlerModifiers || [];
	}
	set sessionDescriptionHandlerModifiers(e) {
		this._sessionDescriptionHandlerModifiers = e.slice();
	}
	get sessionDescriptionHandlerOptions() {
		return this._sessionDescriptionHandlerOptions || {};
	}
	set sessionDescriptionHandlerOptions(e) {
		this._sessionDescriptionHandlerOptions = Object.assign({}, e);
	}
	get sessionDescriptionHandlerModifiersReInvite() {
		return this._sessionDescriptionHandlerModifiersReInvite || [];
	}
	set sessionDescriptionHandlerModifiersReInvite(e) {
		this._sessionDescriptionHandlerModifiersReInvite = e.slice();
	}
	get sessionDescriptionHandlerOptionsReInvite() {
		return this._sessionDescriptionHandlerOptionsReInvite || {};
	}
	set sessionDescriptionHandlerOptionsReInvite(e) {
		this._sessionDescriptionHandlerOptionsReInvite = Object.assign({}, e);
	}
	get state() {
		return this._state;
	}
	get stateChange() {
		return this._stateEventEmitter;
	}
	get userAgent() {
		return this._userAgent;
	}
	bye(e = {}) {
		let t = "Session.bye() may only be called if established session.";
		switch (this.state) {
			case L.Initial:
				typeof this.cancel == "function" ? (t += " However Inviter.invite() has not yet been called.", t += " Perhaps you should have called Inviter.cancel()?") : typeof this.reject == "function" && (t += " However Invitation.accept() has not yet been called.", t += " Perhaps you should have called Invitation.reject()?");
				break;
			case L.Establishing:
				typeof this.cancel == "function" ? (t += " However a dialog does not yet exist.", t += " Perhaps you should have called Inviter.cancel()?") : typeof this.reject == "function" && (t += " However Invitation.accept() has not yet been called (or not yet resolved).", t += " Perhaps you should have called Invitation.reject()?");
				break;
			case L.Established: {
				let t = e.requestDelegate, n = this.copyRequestOptions(e.requestOptions);
				return this._bye(t, n);
			}
			case L.Terminating:
				t += " However this session is already terminating.", typeof this.cancel == "function" ? t += " Perhaps you have already called Inviter.cancel()?" : typeof this.reject == "function" && (t += " Perhaps you have already called Session.bye()?");
				break;
			case L.Terminated:
				t += " However this session is already terminated.";
				break;
			default: throw Error("Unknown state");
		}
		return this.logger.error(t), Promise.reject(/* @__PURE__ */ Error(`Invalid session state ${this.state}`));
	}
	info(e = {}) {
		if (this.state !== L.Established) return this.logger.error("Session.info() may only be called if established session."), Promise.reject(/* @__PURE__ */ Error(`Invalid session state ${this.state}`));
		let t = e.requestDelegate, n = this.copyRequestOptions(e.requestOptions);
		return this._info(t, n);
	}
	invite(e = {}) {
		if (this.logger.log("Session.invite"), this.state !== L.Established) return Promise.reject(/* @__PURE__ */ Error(`Invalid session state ${this.state}`));
		if (this.pendingReinvite) return Promise.reject(new St("Reinvite in progress. Please wait until complete, then try again."));
		this.pendingReinvite = !0, e.sessionDescriptionHandlerModifiers && (this.sessionDescriptionHandlerModifiersReInvite = e.sessionDescriptionHandlerModifiers), e.sessionDescriptionHandlerOptions && (this.sessionDescriptionHandlerOptionsReInvite = e.sessionDescriptionHandlerOptions);
		let t = {
			onAccept: (t) => {
				let n = Jt(t.message);
				if (!n) this.logger.error("Received 2xx response to re-INVITE without a session description"), this.ackAndBye(t, 400, "Missing session description"), this.stateTransition(L.Terminated), this.pendingReinvite = !1;
				else if (e.withoutSdp) {
					let r = {
						sessionDescriptionHandlerOptions: this.sessionDescriptionHandlerOptionsReInvite,
						sessionDescriptionHandlerModifiers: this.sessionDescriptionHandlerModifiersReInvite
					};
					this.setOfferAndGetAnswer(n, r).then((e) => {
						t.ack({ body: e });
					}).catch((e) => {
						this.logger.error("Failed to handle offer in 2xx response to re-INVITE"), this.logger.error(e.message), this.state === L.Terminated ? t.ack() : (this.ackAndBye(t, 488, "Bad Media Description"), this.stateTransition(L.Terminated));
					}).then(() => {
						this.pendingReinvite = !1, e.requestDelegate && e.requestDelegate.onAccept && e.requestDelegate.onAccept(t);
					});
				} else {
					let r = {
						sessionDescriptionHandlerOptions: this.sessionDescriptionHandlerOptionsReInvite,
						sessionDescriptionHandlerModifiers: this.sessionDescriptionHandlerModifiersReInvite
					};
					this.setAnswer(n, r).then(() => {
						t.ack();
					}).catch((e) => {
						this.logger.error("Failed to handle answer in 2xx response to re-INVITE"), this.logger.error(e.message), this.state === L.Terminated ? t.ack() : (this.ackAndBye(t, 488, "Bad Media Description"), this.stateTransition(L.Terminated));
					}).then(() => {
						this.pendingReinvite = !1, e.requestDelegate && e.requestDelegate.onAccept && e.requestDelegate.onAccept(t);
					});
				}
			},
			onProgress: (e) => {},
			onRedirect: (e) => {},
			onReject: (t) => {
				this.logger.warn("Received a non-2xx response to re-INVITE"), this.pendingReinvite = !1, e.withoutSdp ? e.requestDelegate && e.requestDelegate.onReject && e.requestDelegate.onReject(t) : this.rollbackOffer().catch((e) => {
					if (this.logger.error("Failed to rollback offer on non-2xx response to re-INVITE"), this.logger.error(e.message), this.state !== L.Terminated) {
						if (!this.dialog) throw Error("Dialog undefined.");
						let e = [];
						e.push("Reason: " + this.getReasonHeaderValue(500, "Internal Server Error")), this.dialog.bye(void 0, { extraHeaders: e }), this.stateTransition(L.Terminated);
					}
				}).then(() => {
					e.requestDelegate && e.requestDelegate.onReject && e.requestDelegate.onReject(t);
				});
			},
			onTrying: (e) => {}
		}, n = e.requestOptions || {};
		if (n.extraHeaders = (n.extraHeaders || []).slice(), n.extraHeaders.push("Allow: " + I.toString()), n.extraHeaders.push("Contact: " + this._contact), e.withoutSdp) {
			if (!this.dialog) throw this.pendingReinvite = !1, Error("Dialog undefined.");
			return Promise.resolve(this.dialog.invite(t, n));
		}
		let r = {
			sessionDescriptionHandlerOptions: this.sessionDescriptionHandlerOptionsReInvite,
			sessionDescriptionHandlerModifiers: this.sessionDescriptionHandlerModifiersReInvite
		};
		return this.getOffer(r).then((e) => {
			if (!this.dialog) throw this.pendingReinvite = !1, Error("Dialog undefined.");
			return n.body = e, this.dialog.invite(t, n);
		}).catch((e) => {
			throw this.logger.error(e.message), this.logger.error("Failed to send re-INVITE"), this.pendingReinvite = !1, e;
		});
	}
	message(e = {}) {
		if (this.state !== L.Established) return this.logger.error("Session.message() may only be called if established session."), Promise.reject(/* @__PURE__ */ Error(`Invalid session state ${this.state}`));
		let t = e.requestDelegate, n = this.copyRequestOptions(e.requestOptions);
		return this._message(t, n);
	}
	refer(t, n = {}) {
		if (this.state !== L.Established) return this.logger.error("Session.refer() may only be called if established session."), Promise.reject(/* @__PURE__ */ Error(`Invalid session state ${this.state}`));
		if (t instanceof e && !t.dialog) return this.logger.error("Session.refer() may only be called with session which is established. You are perhaps attempting to attended transfer to a target for which there is not dialog yet established. Perhaps you are attempting a 'semi-attended' tansfer? Regardless, this is not supported. The recommended approached is to check to see if the target Session is in the Established state before calling refer(); if the state is not Established you may proceed by falling back using a URI as the target (blind transfer)."), Promise.reject(/* @__PURE__ */ Error(`Invalid session state ${this.state}`));
		let r = n.requestDelegate, i = this.copyRequestOptions(n.requestOptions);
		return i.extraHeaders = i.extraHeaders ? i.extraHeaders.concat(this.referExtraHeaders(this.referToString(t))) : this.referExtraHeaders(this.referToString(t)), this._refer(n.onNotify, r, i);
	}
	_bye(e, t) {
		if (!this.dialog) return Promise.reject(/* @__PURE__ */ Error("Session dialog undefined."));
		let n = this.dialog;
		switch (n.sessionState) {
			case j.Initial: throw Error(`Invalid dialog state ${n.sessionState}`);
			case j.Early: throw Error(`Invalid dialog state ${n.sessionState}`);
			case j.AckWait: return this.stateTransition(L.Terminating), new Promise((r) => {
				n.delegate = {
					onAck: () => {
						let i = n.bye(e, t);
						return this.stateTransition(L.Terminated), r(i), Promise.resolve();
					},
					onAckTimeout: () => {
						let i = n.bye(e, t);
						this.stateTransition(L.Terminated), r(i);
					}
				};
			});
			case j.Confirmed: {
				let r = n.bye(e, t);
				return this.stateTransition(L.Terminated), Promise.resolve(r);
			}
			case j.Terminated: throw Error(`Invalid dialog state ${n.sessionState}`);
			default: throw Error("Unrecognized state.");
		}
	}
	_info(e, t) {
		return this.dialog ? Promise.resolve(this.dialog.info(e, t)) : Promise.reject(/* @__PURE__ */ Error("Session dialog undefined."));
	}
	_message(e, t) {
		return this.dialog ? Promise.resolve(this.dialog.message(e, t)) : Promise.reject(/* @__PURE__ */ Error("Session dialog undefined."));
	}
	_refer(e, t, n) {
		return this.dialog ? (this.onNotify = e, Promise.resolve(this.dialog.refer(t, n))) : Promise.reject(/* @__PURE__ */ Error("Session dialog undefined."));
	}
	ackAndBye(e, t, n) {
		e.ack();
		let r = [];
		t && r.push("Reason: " + this.getReasonHeaderValue(t, n)), e.session.bye(void 0, { extraHeaders: r });
	}
	onAckRequest(e) {
		if (this.logger.log("Session.onAckRequest"), this.state !== L.Established && this.state !== L.Terminating) return this.logger.error(`ACK received while in state ${this.state}, dropping request`), Promise.resolve();
		let t = this.dialog;
		if (!t) throw Error("Dialog undefined.");
		let n = {
			sessionDescriptionHandlerOptions: this.pendingReinviteAck ? this.sessionDescriptionHandlerOptionsReInvite : this.sessionDescriptionHandlerOptions,
			sessionDescriptionHandlerModifiers: this.pendingReinviteAck ? this._sessionDescriptionHandlerModifiersReInvite : this._sessionDescriptionHandlerModifiers
		};
		if (this.delegate && this.delegate.onAck) {
			let t = new Et(e);
			this.delegate.onAck(t);
		}
		switch (this.pendingReinviteAck = !1, t.signalingState) {
			case M.Initial: {
				this.logger.error(`Invalid signaling state ${t.signalingState}.`);
				let e = ["Reason: " + this.getReasonHeaderValue(488, "Bad Media Description")];
				return t.bye(void 0, { extraHeaders: e }), this.stateTransition(L.Terminated), Promise.resolve();
			}
			case M.Stable: {
				let r = Jt(e.message);
				return r ? r.contentDisposition === "render" ? (this._renderbody = r.content, this._rendertype = r.contentType, Promise.resolve()) : r.contentDisposition === "session" ? this.setAnswer(r, n).catch((e) => {
					this.logger.error(e.message);
					let n = ["Reason: " + this.getReasonHeaderValue(488, "Bad Media Description")];
					t.bye(void 0, { extraHeaders: n }), this.stateTransition(L.Terminated);
				}) : Promise.resolve() : Promise.resolve();
			}
			case M.HaveLocalOffer: {
				this.logger.error(`Invalid signaling state ${t.signalingState}.`);
				let e = ["Reason: " + this.getReasonHeaderValue(488, "Bad Media Description")];
				return t.bye(void 0, { extraHeaders: e }), this.stateTransition(L.Terminated), Promise.resolve();
			}
			case M.HaveRemoteOffer: {
				this.logger.error(`Invalid signaling state ${t.signalingState}.`);
				let e = ["Reason: " + this.getReasonHeaderValue(488, "Bad Media Description")];
				return t.bye(void 0, { extraHeaders: e }), this.stateTransition(L.Terminated), Promise.resolve();
			}
			case M.Closed: throw Error(`Invalid signaling state ${t.signalingState}.`);
			default: throw Error(`Invalid signaling state ${t.signalingState}.`);
		}
	}
	onByeRequest(e) {
		if (this.logger.log("Session.onByeRequest"), this.state !== L.Established) this.logger.error(`BYE received while in state ${this.state}, dropping request`);
		else {
			if (this.delegate && this.delegate.onBye) {
				let t = new Dt(e);
				this.delegate.onBye(t);
			} else e.accept();
			this.stateTransition(L.Terminated);
		}
	}
	onInfoRequest(e) {
		if (this.logger.log("Session.onInfoRequest"), this.state !== L.Established) this.logger.error(`INFO received while in state ${this.state}, dropping request`);
		else if (this.delegate && this.delegate.onInfo) {
			let t = new At(e);
			this.delegate.onInfo(t);
		} else e.accept();
	}
	onInviteRequest(e) {
		if (this.logger.log("Session.onInviteRequest"), this.state !== L.Established) {
			this.logger.error(`INVITE received while in state ${this.state}, dropping request`);
			return;
		}
		this.pendingReinviteAck = !0;
		let t = ["Contact: " + this._contact];
		if (e.message.hasHeader("P-Asserted-Identity")) {
			let t = e.message.getHeader("P-Asserted-Identity");
			if (!t) throw Error("Header undefined.");
			this._assertedIdentity = O.nameAddrHeaderParse(t);
		}
		let n = {
			sessionDescriptionHandlerOptions: this.sessionDescriptionHandlerOptionsReInvite,
			sessionDescriptionHandlerModifiers: this.sessionDescriptionHandlerModifiersReInvite
		};
		this.generateResponseOfferAnswerInDialog(n).then((n) => {
			let r = e.accept({
				statusCode: 200,
				extraHeaders: t,
				body: n
			});
			this.delegate && this.delegate.onInvite && this.delegate.onInvite(e.message, r.message, 200);
		}).catch((t) => {
			if (this.logger.error(t.message), this.logger.error("Failed to handle to re-INVITE request"), !this.dialog) throw Error("Dialog undefined.");
			if (this.logger.error(this.dialog.signalingState), this.dialog.signalingState === M.Stable) {
				let t = e.reject({ statusCode: 488 });
				this.delegate && this.delegate.onInvite && this.delegate.onInvite(e.message, t.message, 488);
			} else this.rollbackOffer().then(() => {
				let t = e.reject({ statusCode: 488 });
				this.delegate && this.delegate.onInvite && this.delegate.onInvite(e.message, t.message, 488);
			}).catch((t) => {
				this.logger.error(t.message), this.logger.error("Failed to rollback offer on re-INVITE request");
				let n = e.reject({ statusCode: 488 });
				if (this.state !== L.Terminated) {
					if (!this.dialog) throw Error("Dialog undefined.");
					let e = [];
					e.push("Reason: " + this.getReasonHeaderValue(500, "Internal Server Error")), this.dialog.bye(void 0, { extraHeaders: e }), this.stateTransition(L.Terminated);
				}
				this.delegate && this.delegate.onInvite && this.delegate.onInvite(e.message, n.message, 488);
			});
		});
	}
	onMessageRequest(e) {
		if (this.logger.log("Session.onMessageRequest"), this.state !== L.Established) this.logger.error(`MESSAGE received while in state ${this.state}, dropping request`);
		else if (this.delegate && this.delegate.onMessage) {
			let t = new Xt(e);
			this.delegate.onMessage(t);
		} else e.accept();
	}
	onNotifyRequest(e) {
		if (this.logger.log("Session.onNotifyRequest"), this.state !== L.Established) this.logger.error(`NOTIFY received while in state ${this.state}, dropping request`);
		else if (this.onNotify) {
			let t = new Zt(e);
			this.onNotify(t);
		} else if (this.delegate && this.delegate.onNotify) {
			let t = new Zt(e);
			this.delegate.onNotify(t);
		} else e.accept();
	}
	onPrackRequest(e) {
		if (this.logger.log("Session.onPrackRequest"), this.state !== L.Established) this.logger.error(`PRACK received while in state ${this.state}, dropping request`);
		else throw Error("Unimplemented.");
	}
	onReferRequest(e) {
		if (this.logger.log("Session.onReferRequest"), this.state !== L.Established) {
			this.logger.error(`REFER received while in state ${this.state}, dropping request`);
			return;
		}
		if (!e.message.hasHeader("refer-to")) {
			this.logger.warn("Invalid REFER packet. A refer-to header is required. Rejecting."), e.reject();
			return;
		}
		let t = new Qt(e, this);
		this.delegate && this.delegate.onRefer ? this.delegate.onRefer(t) : (this.logger.log("No delegate available to handle REFER, automatically accepting and following."), t.accept().then(() => t.makeInviter(this._referralInviterOptions).invite()).catch((e) => {
			this.logger.error(e.message);
		}));
	}
	generateResponseOfferAnswer(e, t) {
		if (this.dialog) return this.generateResponseOfferAnswerInDialog(t);
		let n = Jt(e.message);
		return !n || n.contentDisposition !== "session" ? this.getOffer(t) : this.setOfferAndGetAnswer(n, t);
	}
	generateResponseOfferAnswerInDialog(e) {
		if (!this.dialog) throw Error("Dialog undefined.");
		switch (this.dialog.signalingState) {
			case M.Initial: return this.getOffer(e);
			case M.HaveLocalOffer: return Promise.resolve(void 0);
			case M.HaveRemoteOffer:
				if (!this.dialog.offer) throw Error(`Session offer undefined in signaling state ${this.dialog.signalingState}.`);
				return this.setOfferAndGetAnswer(this.dialog.offer, e);
			case M.Stable: return this.state === L.Established ? this.getOffer(e) : Promise.resolve(void 0);
			case M.Closed: throw Error(`Invalid signaling state ${this.dialog.signalingState}.`);
			default: throw Error(`Invalid signaling state ${this.dialog.signalingState}.`);
		}
	}
	getOffer(e) {
		let t = this.setupSessionDescriptionHandler(), n = e.sessionDescriptionHandlerOptions, r = e.sessionDescriptionHandlerModifiers;
		try {
			return t.getDescription(n, r).then((e) => Kt(e)).catch((e) => {
				this.logger.error("Session.getOffer: SDH getDescription rejected...");
				let t = e instanceof Error ? e : /* @__PURE__ */ Error("Session.getOffer unknown error.");
				throw this.logger.error(t.message), t;
			});
		} catch (e) {
			this.logger.error("Session.getOffer: SDH getDescription threw...");
			let t = e instanceof Error ? e : Error(e);
			return this.logger.error(t.message), Promise.reject(t);
		}
	}
	rollbackOffer() {
		let e = this.setupSessionDescriptionHandler();
		if (e.rollbackDescription === void 0) return Promise.resolve();
		try {
			return e.rollbackDescription().catch((e) => {
				this.logger.error("Session.rollbackOffer: SDH rollbackDescription rejected...");
				let t = e instanceof Error ? e : /* @__PURE__ */ Error("Session.rollbackOffer unknown error.");
				throw this.logger.error(t.message), t;
			});
		} catch (e) {
			this.logger.error("Session.rollbackOffer: SDH rollbackDescription threw...");
			let t = e instanceof Error ? e : Error(e);
			return this.logger.error(t.message), Promise.reject(t);
		}
	}
	setAnswer(e, t) {
		let n = this.setupSessionDescriptionHandler(), r = t.sessionDescriptionHandlerOptions, i = t.sessionDescriptionHandlerModifiers;
		try {
			if (!n.hasDescription(e.contentType)) return Promise.reject(new xt());
		} catch (e) {
			this.logger.error("Session.setAnswer: SDH hasDescription threw...");
			let t = e instanceof Error ? e : Error(e);
			return this.logger.error(t.message), Promise.reject(t);
		}
		try {
			return n.setDescription(e.content, r, i).catch((e) => {
				this.logger.error("Session.setAnswer: SDH setDescription rejected...");
				let t = e instanceof Error ? e : /* @__PURE__ */ Error("Session.setAnswer unknown error.");
				throw this.logger.error(t.message), t;
			});
		} catch (e) {
			this.logger.error("Session.setAnswer: SDH setDescription threw...");
			let t = e instanceof Error ? e : Error(e);
			return this.logger.error(t.message), Promise.reject(t);
		}
	}
	setOfferAndGetAnswer(e, t) {
		let n = this.setupSessionDescriptionHandler(), r = t.sessionDescriptionHandlerOptions, i = t.sessionDescriptionHandlerModifiers;
		try {
			if (!n.hasDescription(e.contentType)) return Promise.reject(new xt());
		} catch (e) {
			this.logger.error("Session.setOfferAndGetAnswer: SDH hasDescription threw...");
			let t = e instanceof Error ? e : Error(e);
			return this.logger.error(t.message), Promise.reject(t);
		}
		try {
			return n.setDescription(e.content, r, i).then(() => n.getDescription(r, i)).then((e) => Kt(e)).catch((e) => {
				this.logger.error("Session.setOfferAndGetAnswer: SDH setDescription or getDescription rejected...");
				let t = e instanceof Error ? e : /* @__PURE__ */ Error("Session.setOfferAndGetAnswer unknown error.");
				throw this.logger.error(t.message), t;
			});
		} catch (e) {
			this.logger.error("Session.setOfferAndGetAnswer: SDH setDescription or getDescription threw...");
			let t = e instanceof Error ? e : Error(e);
			return this.logger.error(t.message), Promise.reject(t);
		}
	}
	setSessionDescriptionHandler(e) {
		if (this._sessionDescriptionHandler) throw Error("Session description handler defined.");
		this._sessionDescriptionHandler = e;
	}
	setupSessionDescriptionHandler() {
		return this._sessionDescriptionHandler || (this._sessionDescriptionHandler = this.sessionDescriptionHandlerFactory(this, this.userAgent.configuration.sessionDescriptionHandlerFactoryOptions), this.delegate?.onSessionDescriptionHandler && this.delegate.onSessionDescriptionHandler(this._sessionDescriptionHandler, !1)), this._sessionDescriptionHandler;
	}
	stateTransition(e) {
		let t = () => {
			throw Error(`Invalid state transition from ${this._state} to ${e}`);
		};
		switch (this._state) {
			case L.Initial:
				e !== L.Establishing && e !== L.Established && e !== L.Terminating && e !== L.Terminated && t();
				break;
			case L.Establishing:
				e !== L.Established && e !== L.Terminating && e !== L.Terminated && t();
				break;
			case L.Established:
				e !== L.Terminating && e !== L.Terminated && t();
				break;
			case L.Terminating:
				e !== L.Terminated && t();
				break;
			case L.Terminated:
				t();
				break;
			default: throw Error("Unrecognized state.");
		}
		this._state = e, this.logger.log(`Session ${this.id} transitioned to state ${this._state}`), this._stateEventEmitter.emit(this._state), e === L.Terminated && this.dispose();
	}
	copyRequestOptions(e = {}) {
		return {
			extraHeaders: e.extraHeaders ? e.extraHeaders.slice() : void 0,
			body: e.body ? {
				contentDisposition: e.body.contentDisposition || "render",
				contentType: e.body.contentType || "text/plain",
				content: e.body.content || ""
			} : void 0
		};
	}
	getReasonHeaderValue(e, t) {
		let n = e, r = zt(e);
		return !r && t && (r = t), "SIP;cause=" + n + ";text=\"" + r + "\"";
	}
	referExtraHeaders(e) {
		let t = [];
		return t.push("Referred-By: <" + this.userAgent.configuration.uri + ">"), t.push("Contact: " + this._contact), t.push("Allow: " + [
			"ACK",
			"CANCEL",
			"INVITE",
			"MESSAGE",
			"BYE",
			"OPTIONS",
			"INFO",
			"NOTIFY",
			"REFER"
		].toString()), t.push("Refer-To: " + e), t;
	}
	referToString(e) {
		let t;
		if (e instanceof D) t = e.toString();
		else {
			if (!e.dialog) throw Error("Dialog undefined.");
			let n = e.remoteIdentity.friendlyName, r = e.dialog.remoteTarget.toString(), i = e.dialog.callId, a = e.dialog.remoteTag, o = e.dialog.localTag;
			t = `"${n}" <${r}?Replaces=${encodeURIComponent(`${i};to-tag=${a};from-tag=${o}`)}>`;
		}
		return t;
	}
}, R;
(function(e) {
	e.Required = "Required", e.Supported = "Supported", e.Unsupported = "Unsupported";
})(R = R ||= {});
var en = {
	"100rel": !0,
	199: !0,
	answermode: !0,
	"early-session": !0,
	eventlist: !0,
	explicitsub: !0,
	"from-change": !0,
	"geolocation-http": !0,
	"geolocation-sip": !0,
	gin: !0,
	gruu: !0,
	histinfo: !0,
	ice: !0,
	join: !0,
	"multiple-refer": !0,
	norefersub: !0,
	nosub: !0,
	outbound: !0,
	path: !0,
	policy: !0,
	precondition: !0,
	pref: !0,
	privacy: !0,
	"recipient-list-invite": !0,
	"recipient-list-message": !0,
	"recipient-list-subscribe": !0,
	replaces: !0,
	"resource-priority": !0,
	"sdp-anat": !0,
	"sec-agree": !0,
	tdialog: !0,
	timer: !0,
	uui: !0
}, tn = class extends $t {
	constructor(e, t) {
		super(e), this.incomingInviteRequest = t, this.disposed = !1, this.expiresTimer = void 0, this.isCanceled = !1, this.rel100 = "none", this.rseq = Math.floor(Math.random() * 1e4), this.userNoAnswerTimer = void 0, this.waitingForPrack = !1, this.logger = e.getLogger("sip.Invitation");
		let n = this.incomingInviteRequest.message, r = n.getHeader("require");
		r && r.toLowerCase().includes("100rel") && (this.rel100 = "required");
		let i = n.getHeader("supported");
		if (i && i.toLowerCase().includes("100rel") && (this.rel100 = "supported"), n.toTag = t.toTag, typeof n.toTag != "string") throw TypeError("toTag should have been a string.");
		if (this.userNoAnswerTimer = setTimeout(() => {
			t.reject({ statusCode: 480 }), this.stateTransition(L.Terminated);
		}, this.userAgent.configuration.noAnswerTimeout ? this.userAgent.configuration.noAnswerTimeout * 1e3 : 6e4), n.hasHeader("expires")) {
			let e = Number(n.getHeader("expires") || 0) * 1e3;
			this.expiresTimer = setTimeout(() => {
				this.state === L.Initial && (t.reject({ statusCode: 487 }), this.stateTransition(L.Terminated));
			}, e);
		}
		let a = this.request.getHeader("P-Asserted-Identity");
		a && (this._assertedIdentity = O.nameAddrHeaderParse(a)), this._contact = this.userAgent.contact.toString();
		let o = n.parseHeader("Content-Disposition");
		o && o.type === "render" && (this._renderbody = n.body, this._rendertype = n.getHeader("Content-Type")), this._id = n.callId + n.fromTag, this.userAgent._sessions[this._id] = this;
	}
	dispose() {
		if (this.disposed) return Promise.resolve();
		switch (this.disposed = !0, this.expiresTimer &&= (clearTimeout(this.expiresTimer), void 0), this.userNoAnswerTimer &&= (clearTimeout(this.userNoAnswerTimer), void 0), this.prackNeverArrived(), this.state) {
			case L.Initial: return this.reject().then(() => super.dispose());
			case L.Establishing: return this.reject().then(() => super.dispose());
			case L.Established: return super.dispose();
			case L.Terminating: return super.dispose();
			case L.Terminated: return super.dispose();
			default: throw Error("Unknown state.");
		}
	}
	get autoSendAnInitialProvisionalResponse() {
		return this.rel100 !== "required" && this.userAgent.configuration.sendInitialProvisionalResponse;
	}
	get body() {
		return this.incomingInviteRequest.message.body;
	}
	get localIdentity() {
		return this.request.to;
	}
	get remoteIdentity() {
		return this.request.from;
	}
	get request() {
		return this.incomingInviteRequest.message;
	}
	accept(e = {}) {
		if (this.logger.log("Invitation.accept"), this.state !== L.Initial) {
			let e = /* @__PURE__ */ Error(`Invalid session state ${this.state}`);
			return this.logger.error(e.message), Promise.reject(e);
		}
		return e.sessionDescriptionHandlerModifiers && (this.sessionDescriptionHandlerModifiers = e.sessionDescriptionHandlerModifiers), e.sessionDescriptionHandlerOptions && (this.sessionDescriptionHandlerOptions = e.sessionDescriptionHandlerOptions), this.stateTransition(L.Establishing), this.sendAccept(e).then(({ message: e, session: t }) => {
			t.delegate = {
				onAck: (e) => this.onAckRequest(e),
				onAckTimeout: () => this.onAckTimeout(),
				onBye: (e) => this.onByeRequest(e),
				onInfo: (e) => this.onInfoRequest(e),
				onInvite: (e) => this.onInviteRequest(e),
				onMessage: (e) => this.onMessageRequest(e),
				onNotify: (e) => this.onNotifyRequest(e),
				onPrack: (e) => this.onPrackRequest(e),
				onRefer: (e) => this.onReferRequest(e)
			}, this._dialog = t, this.stateTransition(L.Established), this._replacee && this._replacee._bye();
		}).catch((e) => this.handleResponseError(e));
	}
	progress(e = {}) {
		if (this.logger.log("Invitation.progress"), this.state !== L.Initial) {
			let e = /* @__PURE__ */ Error(`Invalid session state ${this.state}`);
			return this.logger.error(e.message), Promise.reject(e);
		}
		let t = e.statusCode || 180;
		if (t < 100 || t > 199) throw TypeError("Invalid statusCode: " + t);
		return e.sessionDescriptionHandlerModifiers && (this.sessionDescriptionHandlerModifiers = e.sessionDescriptionHandlerModifiers), e.sessionDescriptionHandlerOptions && (this.sessionDescriptionHandlerOptions = e.sessionDescriptionHandlerOptions), this.waitingForPrack ? (this.logger.warn("Unexpected call for progress while waiting for prack, ignoring"), Promise.resolve()) : e.statusCode === 100 ? this.sendProgressTrying().then(() => {}).catch((e) => this.handleResponseError(e)) : this.rel100 !== "required" && !(this.rel100 === "supported" && e.rel100) && (this.rel100 !== "supported" || this.userAgent.configuration.sipExtension100rel !== R.Required) ? this.sendProgress(e).then(() => {}).catch((e) => this.handleResponseError(e)) : this.sendProgressReliableWaitForPrack(e).then(() => {}).catch((e) => this.handleResponseError(e));
	}
	reject(e = {}) {
		if (this.logger.log("Invitation.reject"), this.state !== L.Initial && this.state !== L.Establishing) {
			let e = /* @__PURE__ */ Error(`Invalid session state ${this.state}`);
			return this.logger.error(e.message), Promise.reject(e);
		}
		let t = e.statusCode || 480, n = e.reasonPhrase ? e.reasonPhrase : zt(t), r = e.extraHeaders || [];
		if (t < 300 || t > 699) throw TypeError("Invalid statusCode: " + t);
		let i = e.body ? Kt(e.body) : void 0;
		return t < 400 ? this.incomingInviteRequest.redirect([], {
			statusCode: t,
			reasonPhrase: n,
			extraHeaders: r,
			body: i
		}) : this.incomingInviteRequest.reject({
			statusCode: t,
			reasonPhrase: n,
			extraHeaders: r,
			body: i
		}), this.stateTransition(L.Terminated), Promise.resolve();
	}
	_onCancel(e) {
		if (this.logger.log("Invitation._onCancel"), this.state !== L.Initial && this.state !== L.Establishing) this.logger.error(`CANCEL received while in state ${this.state}, dropping request`);
		else {
			if (this.delegate && this.delegate.onCancel) {
				let t = new Ot(e);
				this.delegate.onCancel(t);
			}
			this.isCanceled = !0, this.incomingInviteRequest.reject({ statusCode: 487 }), this.stateTransition(L.Terminated);
		}
	}
	handlePrackOfferAnswer(e) {
		if (!this.dialog) throw Error("Dialog undefined.");
		let t = Jt(e.message);
		if (!t || t.contentDisposition !== "session") return Promise.resolve(void 0);
		let n = {
			sessionDescriptionHandlerOptions: this.sessionDescriptionHandlerOptions,
			sessionDescriptionHandlerModifiers: this.sessionDescriptionHandlerModifiers
		};
		switch (this.dialog.signalingState) {
			case M.Initial: throw Error(`Invalid signaling state ${this.dialog.signalingState}.`);
			case M.Stable: return this.setAnswer(t, n).then(() => void 0);
			case M.HaveLocalOffer: throw Error(`Invalid signaling state ${this.dialog.signalingState}.`);
			case M.HaveRemoteOffer: return this.setOfferAndGetAnswer(t, n);
			case M.Closed: throw Error(`Invalid signaling state ${this.dialog.signalingState}.`);
			default: throw Error(`Invalid signaling state ${this.dialog.signalingState}.`);
		}
	}
	handleResponseError(e) {
		let t = 480;
		if (e instanceof Error ? this.logger.error(e.message) : this.logger.error(e), e instanceof xt ? (this.logger.error("A session description handler occurred while sending response (content type unsupported"), t = 415) : e instanceof Ct ? this.logger.error("A session description handler occurred while sending response") : e instanceof wt ? this.logger.error("Session ended before response could be formulated and sent (while waiting for PRACK)") : e instanceof P && this.logger.error("Session changed state before response could be formulated and sent"), this.state === L.Initial || this.state === L.Establishing) try {
			this.incomingInviteRequest.reject({ statusCode: t }), this.stateTransition(L.Terminated);
		} catch (e) {
			throw this.logger.error("An error occurred attempting to reject the request while handling another error"), e;
		}
		if (this.isCanceled) this.logger.warn("An error occurred while attempting to formulate and send a response to an incoming INVITE. However a CANCEL was received and processed while doing so which can (and often does) result in errors occurring as the session terminates in the meantime. Said error is being ignored.");
		else throw e;
	}
	onAckTimeout() {
		if (this.logger.log("Invitation.onAckTimeout"), !this.dialog) throw Error("Dialog undefined.");
		this.logger.log("No ACK received for an extended period of time, terminating session"), this.dialog.bye(), this.stateTransition(L.Terminated);
	}
	sendAccept(e = {}) {
		let t = {
			sessionDescriptionHandlerOptions: this.sessionDescriptionHandlerOptions,
			sessionDescriptionHandlerModifiers: this.sessionDescriptionHandlerModifiers
		}, n = e.extraHeaders || [];
		return this.waitingForPrack ? this.waitForArrivalOfPrack().then(() => clearTimeout(this.userNoAnswerTimer)).then(() => this.generateResponseOfferAnswer(this.incomingInviteRequest, t)).then((e) => this.incomingInviteRequest.accept({
			statusCode: 200,
			body: e,
			extraHeaders: n
		})) : (clearTimeout(this.userNoAnswerTimer), this.generateResponseOfferAnswer(this.incomingInviteRequest, t).then((e) => this.incomingInviteRequest.accept({
			statusCode: 200,
			body: e,
			extraHeaders: n
		})));
	}
	sendProgress(e = {}) {
		let t = e.statusCode || 180, n = e.reasonPhrase, r = (e.extraHeaders || []).slice(), i = e.body ? Kt(e.body) : void 0;
		if (t === 183 && !i) return this.sendProgressWithSDP(e);
		try {
			let e = this.incomingInviteRequest.progress({
				statusCode: t,
				reasonPhrase: n,
				extraHeaders: r,
				body: i
			});
			return this._dialog = e.session, Promise.resolve(e);
		} catch (e) {
			return Promise.reject(e);
		}
	}
	sendProgressWithSDP(e = {}) {
		let t = {
			sessionDescriptionHandlerOptions: this.sessionDescriptionHandlerOptions,
			sessionDescriptionHandlerModifiers: this.sessionDescriptionHandlerModifiers
		}, n = e.statusCode || 183, r = e.reasonPhrase, i = (e.extraHeaders || []).slice();
		return this.generateResponseOfferAnswer(this.incomingInviteRequest, t).then((e) => this.incomingInviteRequest.progress({
			statusCode: n,
			reasonPhrase: r,
			extraHeaders: i,
			body: e
		})).then((e) => (this._dialog = e.session, e));
	}
	sendProgressReliable(e = {}) {
		return e.extraHeaders = (e.extraHeaders || []).slice(), e.extraHeaders.push("Require: 100rel"), e.extraHeaders.push("RSeq: " + Math.floor(Math.random() * 1e4)), this.sendProgressWithSDP(e);
	}
	sendProgressReliableWaitForPrack(e = {}) {
		let t = {
			sessionDescriptionHandlerOptions: this.sessionDescriptionHandlerOptions,
			sessionDescriptionHandlerModifiers: this.sessionDescriptionHandlerModifiers
		}, n = e.statusCode || 183, r = e.reasonPhrase, i = (e.extraHeaders || []).slice();
		i.push("Require: 100rel"), i.push("RSeq: " + this.rseq++);
		let a;
		return new Promise((e, o) => {
			this.waitingForPrack = !0, this.generateResponseOfferAnswer(this.incomingInviteRequest, t).then((e) => (a = e, this.incomingInviteRequest.progress({
				statusCode: n,
				reasonPhrase: r,
				extraHeaders: i,
				body: a
			}))).then((t) => {
				this._dialog = t.session;
				let s, c;
				t.session.delegate = { onPrack: (n) => {
					s = n, clearTimeout(l), clearTimeout(f), this.waitingForPrack && (this.waitingForPrack = !1, this.handlePrackOfferAnswer(s).then((n) => {
						try {
							c = s.accept({
								statusCode: 200,
								body: n
							}), this.prackArrived(), e({
								prackRequest: s,
								prackResponse: c,
								progressResponse: t
							});
						} catch (e) {
							o(e);
						}
					}).catch((e) => o(e)));
				} };
				let l = setTimeout(() => {
					this.waitingForPrack && (this.waitingForPrack = !1, this.logger.warn("No PRACK received, rejecting INVITE."), clearTimeout(f), this.reject({ statusCode: 504 }).then(() => o(new wt())).catch((e) => o(e)));
				}, N.T1 * 64), u = () => {
					try {
						this.incomingInviteRequest.progress({
							statusCode: n,
							reasonPhrase: r,
							extraHeaders: i,
							body: a
						});
					} catch (e) {
						this.waitingForPrack = !1, o(e);
						return;
					}
					f = setTimeout(u, d *= 2);
				}, d = N.T1, f = setTimeout(u, d);
			}).catch((e) => {
				this.waitingForPrack = !1, o(e);
			});
		});
	}
	sendProgressTrying() {
		try {
			let e = this.incomingInviteRequest.trying();
			return Promise.resolve(e);
		} catch (e) {
			return Promise.reject(e);
		}
	}
	waitForArrivalOfPrack() {
		if (this.waitingForPrackPromise) throw Error("Already waiting for PRACK");
		return this.waitingForPrackPromise = new Promise((e, t) => {
			this.waitingForPrackResolve = e, this.waitingForPrackReject = t;
		}), this.waitingForPrackPromise;
	}
	prackArrived() {
		this.waitingForPrackResolve && this.waitingForPrackResolve(), this.waitingForPrackPromise = void 0, this.waitingForPrackResolve = void 0, this.waitingForPrackReject = void 0;
	}
	prackNeverArrived() {
		this.waitingForPrackReject && this.waitingForPrackReject(new wt()), this.waitingForPrackPromise = void 0, this.waitingForPrackResolve = void 0, this.waitingForPrackReject = void 0;
	}
}, nn = class extends $t {
	constructor(e, t, n = {}) {
		super(e, n), this.disposed = !1, this.earlyMedia = !1, this.earlyMediaSessionDescriptionHandlers = /* @__PURE__ */ new Map(), this.isCanceled = !1, this.inviteWithoutSdp = !1, this.logger = e.getLogger("sip.Inviter"), this.earlyMedia = n.earlyMedia === void 0 ? this.earlyMedia : n.earlyMedia, this.fromTag = Bt(), this.inviteWithoutSdp = n.inviteWithoutSdp === void 0 ? this.inviteWithoutSdp : n.inviteWithoutSdp;
		let r = Object.assign({}, n);
		r.params = Object.assign({}, n.params);
		let i = n.anonymous || !1, a = e.contact.toString({
			anonymous: i,
			outbound: i ? !e.contact.tempGruu : !e.contact.pubGruu
		});
		i && e.configuration.uri && (r.params.fromDisplayName = "Anonymous", r.params.fromUri = "sip:anonymous@anonymous.invalid");
		let o = e.userAgentCore.configuration.aor;
		if (r.params.fromUri && (o = typeof r.params.fromUri == "string" ? O.URIParse(r.params.fromUri) : r.params.fromUri), !o) throw TypeError("Invalid from URI: " + r.params.fromUri);
		let s = t;
		if (r.params.toUri && (s = typeof r.params.toUri == "string" ? O.URIParse(r.params.toUri) : r.params.toUri), !s) throw TypeError("Invalid to URI: " + r.params.toUri);
		let c = Object.assign({}, r.params);
		c.fromTag = this.fromTag;
		let l = (r.extraHeaders || []).slice();
		i && e.configuration.uri && (l.push("P-Preferred-Identity: " + e.configuration.uri.toString()), l.push("Privacy: id")), l.push("Contact: " + a), l.push("Allow: " + [
			"ACK",
			"CANCEL",
			"INVITE",
			"MESSAGE",
			"BYE",
			"OPTIONS",
			"INFO",
			"NOTIFY",
			"REFER"
		].toString()), e.configuration.sipExtension100rel === R.Required && l.push("Require: 100rel"), e.configuration.sipExtensionReplaces === R.Required && l.push("Require: replaces"), r.extraHeaders = l, this.outgoingRequestMessage = e.userAgentCore.makeOutgoingRequestMessage(F.INVITE, t, o, s, c, l, void 0), this._contact = a, this._referralInviterOptions = r, this._renderbody = n.renderbody, this._rendertype = n.rendertype, n.sessionDescriptionHandlerModifiers && (this.sessionDescriptionHandlerModifiers = n.sessionDescriptionHandlerModifiers), n.sessionDescriptionHandlerOptions && (this.sessionDescriptionHandlerOptions = n.sessionDescriptionHandlerOptions), n.sessionDescriptionHandlerModifiersReInvite && (this.sessionDescriptionHandlerModifiersReInvite = n.sessionDescriptionHandlerModifiersReInvite), n.sessionDescriptionHandlerOptionsReInvite && (this.sessionDescriptionHandlerOptionsReInvite = n.sessionDescriptionHandlerOptionsReInvite), this._id = this.outgoingRequestMessage.callId + this.fromTag, this.userAgent._sessions[this._id] = this;
	}
	dispose() {
		if (this.disposed) return Promise.resolve();
		switch (this.disposed = !0, this.disposeEarlyMedia(), this.state) {
			case L.Initial: return this.cancel().then(() => super.dispose());
			case L.Establishing: return this.cancel().then(() => super.dispose());
			case L.Established: return super.dispose();
			case L.Terminating: return super.dispose();
			case L.Terminated: return super.dispose();
			default: throw Error("Unknown state.");
		}
	}
	get body() {
		return this.outgoingRequestMessage.body;
	}
	get localIdentity() {
		return this.outgoingRequestMessage.from;
	}
	get remoteIdentity() {
		return this.outgoingRequestMessage.to;
	}
	get request() {
		return this.outgoingRequestMessage;
	}
	cancel(e = {}) {
		if (this.logger.log("Inviter.cancel"), this.state !== L.Initial && this.state !== L.Establishing) {
			let e = /* @__PURE__ */ Error(`Invalid session state ${this.state}`);
			return this.logger.error(e.message), Promise.reject(e);
		}
		this.isCanceled = !0, this.stateTransition(L.Terminating);
		function t(e, t) {
			if (e && e < 200 || e > 699) throw TypeError("Invalid statusCode: " + e);
			if (e) {
				let n = e, r = zt(e) || t;
				return "SIP;cause=" + n + ";text=\"" + r + "\"";
			}
		}
		if (this.outgoingInviteRequest) {
			let n;
			e.statusCode && e.reasonPhrase && (n = t(e.statusCode, e.reasonPhrase)), this.outgoingInviteRequest.cancel(n, e);
		} else this.logger.warn("Canceled session before INVITE was sent"), this.stateTransition(L.Terminated);
		return Promise.resolve();
	}
	invite(e = {}) {
		if (this.logger.log("Inviter.invite"), this.state !== L.Initial) return super.invite(e);
		if (e.sessionDescriptionHandlerModifiers && (this.sessionDescriptionHandlerModifiers = e.sessionDescriptionHandlerModifiers), e.sessionDescriptionHandlerOptions && (this.sessionDescriptionHandlerOptions = e.sessionDescriptionHandlerOptions), e.withoutSdp || this.inviteWithoutSdp) return this._renderbody && this._rendertype && (this.outgoingRequestMessage.body = {
			contentType: this._rendertype,
			body: this._renderbody
		}), this.stateTransition(L.Establishing), Promise.resolve(this.sendInvite(e));
		let t = {
			sessionDescriptionHandlerModifiers: this.sessionDescriptionHandlerModifiers,
			sessionDescriptionHandlerOptions: this.sessionDescriptionHandlerOptions
		};
		return this.getOffer(t).then((t) => (this.outgoingRequestMessage.body = {
			body: t.content,
			contentType: t.contentType
		}, this.stateTransition(L.Establishing), this.sendInvite(e))).catch((e) => {
			throw this.logger.log(e.message), this.state !== L.Terminated && this.stateTransition(L.Terminated), e;
		});
	}
	sendInvite(e = {}) {
		return this.outgoingInviteRequest = this.userAgent.userAgentCore.invite(this.outgoingRequestMessage, {
			onAccept: (t) => {
				this.dialog ? (this.logger.log("Additional confirmed dialog, sending ACK and BYE"), this.ackAndBye(t)) : this.isCanceled ? (this.logger.log("Canceled session accepted, sending ACK and BYE"), this.ackAndBye(t), this.stateTransition(L.Terminated)) : (this.notifyReferer(t), this.onAccept(t).then(() => {
					this.disposeEarlyMedia();
				}).catch(() => {
					this.disposeEarlyMedia();
				}).then(() => {
					e.requestDelegate && e.requestDelegate.onAccept && e.requestDelegate.onAccept(t);
				}));
			},
			onProgress: (t) => {
				this.isCanceled || (this.notifyReferer(t), this.onProgress(t).catch(() => {
					this.disposeEarlyMedia();
				}).then(() => {
					e.requestDelegate && e.requestDelegate.onProgress && e.requestDelegate.onProgress(t);
				}));
			},
			onRedirect: (t) => {
				this.notifyReferer(t), this.onRedirect(t), e.requestDelegate && e.requestDelegate.onRedirect && e.requestDelegate.onRedirect(t);
			},
			onReject: (t) => {
				this.notifyReferer(t), this.onReject(t), e.requestDelegate && e.requestDelegate.onReject && e.requestDelegate.onReject(t);
			},
			onTrying: (t) => {
				this.notifyReferer(t), this.onTrying(t), e.requestDelegate && e.requestDelegate.onTrying && e.requestDelegate.onTrying(t);
			}
		}), this.outgoingInviteRequest;
	}
	disposeEarlyMedia() {
		this.earlyMediaSessionDescriptionHandlers.forEach((e) => {
			e.close();
		}), this.earlyMediaSessionDescriptionHandlers.clear();
	}
	notifyReferer(e) {
		if (!this._referred) return;
		if (!(this._referred instanceof $t)) throw Error("Referred session not instance of session");
		if (!this._referred.dialog) return;
		if (!e.message.statusCode) throw Error("Status code undefined.");
		if (!e.message.reasonPhrase) throw Error("Reason phrase undefined.");
		let t = `SIP/2.0 ${e.message.statusCode} ${e.message.reasonPhrase}`.trim(), n = this._referred.dialog.notify(void 0, {
			extraHeaders: ["Event: refer", "Subscription-State: terminated"],
			body: {
				contentDisposition: "render",
				contentType: "message/sipfrag",
				content: t
			}
		});
		n.delegate = { onReject: () => {
			this._referred = void 0;
		} };
	}
	onAccept(e) {
		if (this.logger.log("Inviter.onAccept"), this.state !== L.Establishing) return this.logger.error(`Accept received while in state ${this.state}, dropping response`), Promise.reject(/* @__PURE__ */ Error(`Invalid session state ${this.state}`));
		let t = e.message, n = e.session;
		switch (t.hasHeader("P-Asserted-Identity") && (this._assertedIdentity = O.nameAddrHeaderParse(t.getHeader("P-Asserted-Identity"))), n.delegate = {
			onAck: (e) => this.onAckRequest(e),
			onBye: (e) => this.onByeRequest(e),
			onInfo: (e) => this.onInfoRequest(e),
			onInvite: (e) => this.onInviteRequest(e),
			onMessage: (e) => this.onMessageRequest(e),
			onNotify: (e) => this.onNotifyRequest(e),
			onPrack: (e) => this.onPrackRequest(e),
			onRefer: (e) => this.onReferRequest(e)
		}, this._dialog = n, n.signalingState) {
			case M.Initial: return this.logger.error("Received 2xx response to INVITE without a session description"), this.ackAndBye(e, 400, "Missing session description"), this.stateTransition(L.Terminated), Promise.reject(/* @__PURE__ */ Error("Bad Media Description"));
			case M.HaveLocalOffer: return this.logger.error("Received 2xx response to INVITE without a session description"), this.ackAndBye(e, 400, "Missing session description"), this.stateTransition(L.Terminated), Promise.reject(/* @__PURE__ */ Error("Bad Media Description"));
			case M.HaveRemoteOffer: {
				if (!this._dialog.offer) throw Error(`Session offer undefined in signaling state ${this._dialog.signalingState}.`);
				let t = {
					sessionDescriptionHandlerModifiers: this.sessionDescriptionHandlerModifiers,
					sessionDescriptionHandlerOptions: this.sessionDescriptionHandlerOptions
				};
				return this.setOfferAndGetAnswer(this._dialog.offer, t).then((t) => {
					e.ack({ body: t }), this.stateTransition(L.Established);
				}).catch((t) => {
					throw this.ackAndBye(e, 488, "Invalid session description"), this.stateTransition(L.Terminated), t;
				});
			}
			case M.Stable: {
				if (this.earlyMediaSessionDescriptionHandlers.size > 0) {
					let t = this.earlyMediaSessionDescriptionHandlers.get(n.id);
					if (!t) throw Error("Session description handler undefined.");
					return this.setSessionDescriptionHandler(t), this.earlyMediaSessionDescriptionHandlers.delete(n.id), e.ack(), this.stateTransition(L.Established), Promise.resolve();
				}
				if (this.earlyMediaDialog) {
					if (this.earlyMediaDialog !== n) {
						this.earlyMedia && this.logger.error("You have set the 'earlyMedia' option to 'true' which requires that your INVITE requests do not fork and yet this INVITE request did in fact fork. Consequentially and not surprisingly the end point which accepted the INVITE (confirmed dialog) does not match the end point with which early media has been setup (early dialog) and thus this session is unable to proceed. In accordance with the SIP specifications, the SIP servers your end point is connected to determine if an INVITE forks and the forking behavior of those servers cannot be controlled by this library. If you wish to use early media with this library you must configure those servers accordingly. Alternatively you may set the 'earlyMedia' to 'false' which will allow this library to function with any INVITE requests which do fork.");
						let t = /* @__PURE__ */ Error("Early media dialog does not equal confirmed dialog, terminating session");
						return this.logger.error(t.message), this.ackAndBye(e, 488, "Not Acceptable Here"), this.stateTransition(L.Terminated), Promise.reject(t);
					}
					return e.ack(), this.stateTransition(L.Established), Promise.resolve();
				}
				let t = n.answer;
				if (!t) throw Error("Answer is undefined.");
				let r = {
					sessionDescriptionHandlerModifiers: this.sessionDescriptionHandlerModifiers,
					sessionDescriptionHandlerOptions: this.sessionDescriptionHandlerOptions
				};
				return this.setAnswer(t, r).then(() => {
					let t;
					this._renderbody && this._rendertype && (t = { body: {
						contentDisposition: "render",
						contentType: this._rendertype,
						content: this._renderbody
					} }), e.ack(t), this.stateTransition(L.Established);
				}).catch((t) => {
					throw this.logger.error(t.message), this.ackAndBye(e, 488, "Not Acceptable Here"), this.stateTransition(L.Terminated), t;
				});
			}
			case M.Closed: return Promise.reject(/* @__PURE__ */ Error("Terminated."));
			default: throw Error("Unknown session signaling state.");
		}
	}
	onProgress(e) {
		if (this.logger.log("Inviter.onProgress"), this.state !== L.Establishing) return this.logger.error(`Progress received while in state ${this.state}, dropping response`), Promise.reject(/* @__PURE__ */ Error(`Invalid session state ${this.state}`));
		if (!this.outgoingInviteRequest) throw Error("Outgoing INVITE request undefined.");
		let t = e.message, n = e.session;
		t.hasHeader("P-Asserted-Identity") && (this._assertedIdentity = O.nameAddrHeaderParse(t.getHeader("P-Asserted-Identity")));
		let r = t.getHeader("require"), i = t.getHeader("rseq"), a = !!(r && r.includes("100rel") && i && Number(i)), o = [];
		switch (a && o.push("RAck: " + t.getHeader("rseq") + " " + t.getHeader("cseq")), n.signalingState) {
			case M.Initial: return a && (this.logger.warn("First reliable provisional response received MUST contain an offer when INVITE does not contain an offer."), e.prack({ extraHeaders: o })), Promise.resolve();
			case M.HaveLocalOffer: return a && e.prack({ extraHeaders: o }), Promise.resolve();
			case M.HaveRemoteOffer:
				if (!a) return this.logger.warn("Non-reliable provisional response MUST NOT contain an initial offer, discarding response."), Promise.resolve();
				{
					let r = this.sessionDescriptionHandlerFactory(this, this.userAgent.configuration.sessionDescriptionHandlerFactoryOptions || {});
					return this.delegate?.onSessionDescriptionHandler && this.delegate.onSessionDescriptionHandler(r, !0), this.earlyMediaSessionDescriptionHandlers.set(n.id, r), r.setDescription(t.body, this.sessionDescriptionHandlerOptions, this.sessionDescriptionHandlerModifiers).then(() => r.getDescription(this.sessionDescriptionHandlerOptions, this.sessionDescriptionHandlerModifiers)).then((t) => {
						let n = {
							contentDisposition: "session",
							contentType: t.contentType,
							content: t.body
						};
						e.prack({
							extraHeaders: o,
							body: n
						});
					}).catch((e) => {
						throw this.stateTransition(L.Terminated), e;
					});
				}
			case M.Stable:
				if (a && e.prack({ extraHeaders: o }), this.earlyMedia && !this.earlyMediaDialog) {
					this.earlyMediaDialog = n;
					let e = n.answer;
					if (!e) throw Error("Answer is undefined.");
					let t = {
						sessionDescriptionHandlerModifiers: this.sessionDescriptionHandlerModifiers,
						sessionDescriptionHandlerOptions: this.sessionDescriptionHandlerOptions
					};
					return this.setAnswer(e, t).catch((e) => {
						throw this.stateTransition(L.Terminated), e;
					});
				}
				return Promise.resolve();
			case M.Closed: return Promise.reject(/* @__PURE__ */ Error("Terminated."));
			default: throw Error("Unknown session signaling state.");
		}
	}
	onRedirect(e) {
		this.logger.log("Inviter.onRedirect"), this.state !== L.Establishing && this.state !== L.Terminating ? this.logger.error(`Redirect received while in state ${this.state}, dropping response`) : this.stateTransition(L.Terminated);
	}
	onReject(e) {
		this.logger.log("Inviter.onReject"), this.state !== L.Establishing && this.state !== L.Terminating ? this.logger.error(`Reject received while in state ${this.state}, dropping response`) : this.stateTransition(L.Terminated);
	}
	onTrying(e) {
		this.logger.log("Inviter.onTrying"), this.state !== L.Establishing && this.logger.error(`Trying received while in state ${this.state}, dropping response`);
	}
}, z;
(function(e) {
	e.Initial = "Initial", e.Registered = "Registered", e.Unregistered = "Unregistered", e.Terminated = "Terminated";
})(z = z ||= {});
// node_modules/sip.js/lib/api/registerer.js
var rn = class e {
	constructor(t, n = {}) {
		this.disposed = !1, this._contacts = [], this._retryAfter = void 0, this._state = z.Initial, this._waiting = !1, this._stateEventEmitter = new kt(), this._waitingEventEmitter = new kt(), this.userAgent = t;
		let r = t.configuration.uri.clone();
		if (r.user = void 0, this.options = Object.assign(Object.assign(Object.assign({}, e.defaultOptions()), { registrar: r }), e.stripUndefinedProperties(n)), this.options.extraContactHeaderParams = (this.options.extraContactHeaderParams || []).slice(), this.options.extraHeaders = (this.options.extraHeaders || []).slice(), !this.options.registrar) throw Error("Registrar undefined.");
		if (this.options.registrar = this.options.registrar.clone(), this.options.regId && !this.options.instanceId ? this.options.instanceId = this.userAgent.instanceId : !this.options.regId && this.options.instanceId && (this.options.regId = 1), this.options.instanceId && O.parse(this.options.instanceId, "uuid") === -1) throw Error("Invalid instanceId.");
		if (this.options.regId && this.options.regId < 0) throw Error("Invalid regId.");
		let i = this.options.registrar, a = this.options.params && this.options.params.fromUri || t.userAgentCore.configuration.aor, o = this.options.params && this.options.params.toUri || t.configuration.uri, s = this.options.params || {}, c = (n.extraHeaders || []).slice();
		if (this.request = t.userAgentCore.makeOutgoingRequestMessage(F.REGISTER, i, a, o, s, c, void 0), this.expires = this.options.expires || e.defaultExpires, this.expires < 0) throw Error("Invalid expires.");
		if (this.refreshFrequency = this.options.refreshFrequency || e.defaultRefreshFrequency, this.refreshFrequency < 50 || this.refreshFrequency > 99) throw Error("Invalid refresh frequency. The value represents a percentage of the expiration time and should be between 50 and 99.");
		this.logger = t.getLogger("sip.Registerer"), this.options.logConfiguration && (this.logger.log("Configuration:"), Object.keys(this.options).forEach((e) => {
			let t = this.options[e];
			switch (e) {
				case "registrar":
					this.logger.log("· " + e + ": " + t);
					break;
				default: this.logger.log("· " + e + ": " + JSON.stringify(t));
			}
		})), this.id = this.request.callId + this.request.from.parameters.tag, this.userAgent._registerers[this.id] = this;
	}
	static defaultOptions() {
		return {
			expires: e.defaultExpires,
			extraContactHeaderParams: [],
			extraHeaders: [],
			logConfiguration: !0,
			instanceId: "",
			params: {},
			regId: 0,
			registrar: new D("sip", "anonymous", "anonymous.invalid"),
			refreshFrequency: e.defaultRefreshFrequency
		};
	}
	static stripUndefinedProperties(e) {
		return Object.keys(e).reduce((t, n) => (e[n] !== void 0 && (t[n] = e[n]), t), {});
	}
	get contacts() {
		return this._contacts.slice();
	}
	get retryAfter() {
		return this._retryAfter;
	}
	get state() {
		return this._state;
	}
	get stateChange() {
		return this._stateEventEmitter;
	}
	dispose() {
		return this.disposed ? Promise.resolve() : (this.disposed = !0, this.logger.log(`Registerer ${this.id} in state ${this.state} is being disposed`), delete this.userAgent._registerers[this.id], new Promise((e) => {
			let t = () => {
				!this.waiting && this._state === z.Registered ? (this.stateChange.addListener(() => {
					this.terminated(), e();
				}, { once: !0 }), this.unregister()) : (this.terminated(), e());
			};
			this.waiting ? this.waitingChange.addListener(() => {
				t();
			}, { once: !0 }) : t();
		}));
	}
	register(e = {}) {
		if (this.state === z.Terminated) throw this.stateError(), Error("Registerer terminated. Unable to register.");
		if (this.disposed) throw this.stateError(), Error("Registerer disposed. Unable to register.");
		if (this.waiting) {
			this.waitingWarning();
			let e = new St("REGISTER request already in progress, waiting for final response");
			return Promise.reject(e);
		}
		e.requestOptions && (this.options = Object.assign(Object.assign({}, this.options), e.requestOptions));
		let t = (this.options.extraHeaders || []).slice();
		t.push("Contact: " + this.generateContactHeader(this.expires)), t.push("Allow: " + [
			"ACK",
			"CANCEL",
			"INVITE",
			"MESSAGE",
			"BYE",
			"OPTIONS",
			"INFO",
			"NOTIFY",
			"REFER"
		].toString()), this.request.cseq++, this.request.setHeader("cseq", this.request.cseq + " REGISTER"), this.request.extraHeaders = t, this.waitingToggle(!0);
		let n = this.userAgent.userAgentCore.register(this.request, {
			onAccept: (t) => {
				let n;
				t.message.hasHeader("expires") && (n = Number(t.message.getHeader("expires"))), this._contacts = t.message.getHeaders("contact");
				let r = this._contacts.length;
				if (!r) {
					this.logger.error("No Contact header in response to REGISTER, dropping response."), this.unregistered();
					return;
				}
				let i;
				for (; r--;) {
					if (i = t.message.parseHeader("contact", r), !i) throw Error("Contact undefined");
					if (this.userAgent.contact.pubGruu && Mt(i.uri, this.userAgent.contact.pubGruu)) {
						n = Number(i.getParam("expires"));
						break;
					}
					if (this.userAgent.configuration.contactName === "") {
						if (i.uri.user === this.userAgent.contact.uri.user) {
							n = Number(i.getParam("expires"));
							break;
						}
					} else if (Mt(i.uri, this.userAgent.contact.uri)) {
						n = Number(i.getParam("expires"));
						break;
					}
					i = void 0;
				}
				if (i === void 0) this.logger.error("No Contact header pointing to us, dropping response"), this.unregistered(), this.waitingToggle(!1);
				else if (n === void 0) this.logger.error("Contact pointing to us is missing expires parameter, dropping response"), this.unregistered(), this.waitingToggle(!1);
				else {
					if (i.hasParam("temp-gruu")) {
						let e = i.getParam("temp-gruu");
						e && (this.userAgent.contact.tempGruu = O.URIParse(e.replace(/"/g, "")));
					}
					if (i.hasParam("pub-gruu")) {
						let e = i.getParam("pub-gruu");
						e && (this.userAgent.contact.pubGruu = O.URIParse(e.replace(/"/g, "")));
					}
					this.registered(n), e.requestDelegate && e.requestDelegate.onAccept && e.requestDelegate.onAccept(t), this.waitingToggle(!1);
				}
			},
			onProgress: (t) => {
				e.requestDelegate && e.requestDelegate.onProgress && e.requestDelegate.onProgress(t);
			},
			onRedirect: (t) => {
				this.logger.error("Redirect received. Not supported."), this.unregistered(), e.requestDelegate && e.requestDelegate.onRedirect && e.requestDelegate.onRedirect(t), this.waitingToggle(!1);
			},
			onReject: (t) => {
				if (t.message.statusCode === 423) {
					if (!t.message.hasHeader("min-expires")) {
						this.logger.error("423 response received for REGISTER without Min-Expires, dropping response"), this.unregistered(), this.waitingToggle(!1);
						return;
					}
					this.expires = Number(t.message.getHeader("min-expires")), this.waitingToggle(!1), this.register();
					return;
				}
				this.logger.warn(`Failed to register, status code ${t.message.statusCode}`);
				let n = NaN;
				if (t.message.statusCode === 500 || t.message.statusCode === 503) {
					let e = t.message.getHeader("retry-after");
					e && (n = Number.parseInt(e, void 0));
				}
				this._retryAfter = isNaN(n) ? void 0 : n, this.unregistered(), e.requestDelegate && e.requestDelegate.onReject && e.requestDelegate.onReject(t), this._retryAfter = void 0, this.waitingToggle(!1);
			},
			onTrying: (t) => {
				e.requestDelegate && e.requestDelegate.onTrying && e.requestDelegate.onTrying(t);
			}
		});
		return Promise.resolve(n);
	}
	unregister(e = {}) {
		if (this.state === z.Terminated) throw this.stateError(), Error("Registerer terminated. Unable to register.");
		if (this.disposed && this.state !== z.Registered) throw this.stateError(), Error("Registerer disposed. Unable to register.");
		if (this.waiting) {
			this.waitingWarning();
			let e = new St("REGISTER request already in progress, waiting for final response");
			return Promise.reject(e);
		}
		this._state !== z.Registered && !e.all && this.logger.warn("Not currently registered, but sending an unregister anyway.");
		let t = (e.requestOptions && e.requestOptions.extraHeaders || []).slice();
		this.request.extraHeaders = t, e.all ? (t.push("Contact: *"), t.push("Expires: 0")) : t.push("Contact: " + this.generateContactHeader(0)), this.request.cseq++, this.request.setHeader("cseq", this.request.cseq + " REGISTER"), this.registrationTimer !== void 0 && (clearTimeout(this.registrationTimer), this.registrationTimer = void 0), this.waitingToggle(!0);
		let n = this.userAgent.userAgentCore.register(this.request, {
			onAccept: (t) => {
				this._contacts = t.message.getHeaders("contact"), this.unregistered(), e.requestDelegate && e.requestDelegate.onAccept && e.requestDelegate.onAccept(t), this.waitingToggle(!1);
			},
			onProgress: (t) => {
				e.requestDelegate && e.requestDelegate.onProgress && e.requestDelegate.onProgress(t);
			},
			onRedirect: (t) => {
				this.logger.error("Unregister redirected. Not currently supported."), this.unregistered(), e.requestDelegate && e.requestDelegate.onRedirect && e.requestDelegate.onRedirect(t), this.waitingToggle(!1);
			},
			onReject: (t) => {
				this.logger.error(`Unregister rejected with status code ${t.message.statusCode}`), this.unregistered(), e.requestDelegate && e.requestDelegate.onReject && e.requestDelegate.onReject(t), this.waitingToggle(!1);
			},
			onTrying: (t) => {
				e.requestDelegate && e.requestDelegate.onTrying && e.requestDelegate.onTrying(t);
			}
		});
		return Promise.resolve(n);
	}
	clearTimers() {
		this.registrationTimer !== void 0 && (clearTimeout(this.registrationTimer), this.registrationTimer = void 0), this.registrationExpiredTimer !== void 0 && (clearTimeout(this.registrationExpiredTimer), this.registrationExpiredTimer = void 0);
	}
	generateContactHeader(e) {
		let t = this.userAgent.contact.toString({ register: !0 });
		return this.options.regId && this.options.instanceId && (t += ";reg-id=" + this.options.regId, t += ";+sip.instance=\"<urn:uuid:" + this.options.instanceId + ">\""), this.options.extraContactHeaderParams && this.options.extraContactHeaderParams.forEach((e) => {
			t += ";" + e;
		}), t += ";expires=" + e, t;
	}
	registered(e) {
		this.clearTimers(), this.registrationTimer = setTimeout(() => {
			this.registrationTimer = void 0, this.register();
		}, this.refreshFrequency / 100 * e * 1e3), this.registrationExpiredTimer = setTimeout(() => {
			this.logger.warn("Registration expired"), this.unregistered();
		}, e * 1e3), this._state !== z.Registered && this.stateTransition(z.Registered);
	}
	unregistered() {
		this.clearTimers(), this._state !== z.Unregistered && this.stateTransition(z.Unregistered);
	}
	terminated() {
		this.clearTimers(), this._state !== z.Terminated && this.stateTransition(z.Terminated);
	}
	stateTransition(e) {
		let t = () => {
			throw Error(`Invalid state transition from ${this._state} to ${e}`);
		};
		switch (this._state) {
			case z.Initial:
				e !== z.Registered && e !== z.Unregistered && e !== z.Terminated && t();
				break;
			case z.Registered:
				e !== z.Unregistered && e !== z.Terminated && t();
				break;
			case z.Unregistered:
				e !== z.Registered && e !== z.Terminated && t();
				break;
			case z.Terminated:
				t();
				break;
			default: throw Error("Unrecognized state.");
		}
		this._state = e, this.logger.log(`Registration transitioned to state ${this._state}`), this._stateEventEmitter.emit(this._state), e === z.Terminated && this.dispose();
	}
	get waiting() {
		return this._waiting;
	}
	get waitingChange() {
		return this._waitingEventEmitter;
	}
	waitingToggle(e) {
		if (this._waiting === e) throw Error(`Invalid waiting transition from ${this._waiting} to ${e}`);
		this._waiting = e, this.logger.log(`Waiting toggled to ${this._waiting}`), this._waitingEventEmitter.emit(this._waiting);
	}
	waitingWarning() {
		let e = "An attempt was made to send a REGISTER request while a prior one was still in progress.";
		e += " RFC 3261 requires UAs MUST NOT send a new registration until they have received a final response", e += " from the registrar for the previous one or the previous REGISTER request has timed out.", e += " Note that if the transport disconnects, you still must wait for the prior request to time out before", e += " sending a new REGISTER request or alternatively dispose of the current Registerer and create a new Registerer.", this.logger.warn(e);
	}
	stateError() {
		let e = `An attempt was made to send a REGISTER request when the Registerer ${this.state === z.Terminated ? "is in 'Terminated' state" : "has been disposed"}.`;
		e += " The Registerer transitions to 'Terminated' when Registerer.dispose() is called.", e += " Perhaps you called UserAgent.stop() which dipsoses of all Registerers?", this.logger.error(e);
	}
};
rn.defaultExpires = 600, rn.defaultRefreshFrequency = 99;
// node_modules/sip.js/lib/core/subscription/subscription.js
var B;
(function(e) {
	e.Initial = "Initial", e.NotifyWait = "NotifyWait", e.Pending = "Pending", e.Active = "Active", e.Terminated = "Terminated";
})(B = B ||= {});
// node_modules/sip.js/lib/api/transport-state.js
var V;
(function(e) {
	e.Connecting = "Connecting", e.Connected = "Connected", e.Disconnecting = "Disconnecting", e.Disconnected = "Disconnected";
})(V = V ||= {});
// node_modules/sip.js/lib/api/user-agent-state.js
var H;
(function(e) {
	e.Started = "Started", e.Stopped = "Stopped";
})(H = H ||= {});
// node_modules/sip.js/lib/core/messages/md5.js
var U = class e {
	constructor() {
		this._dataLength = 0, this._bufferLength = 0, this._state = /* @__PURE__ */ new Int32Array(4), this._buffer = /* @__PURE__ */ new ArrayBuffer(68), this._buffer8 = new Uint8Array(this._buffer, 0, 68), this._buffer32 = new Uint32Array(this._buffer, 0, 17), this.start();
	}
	static hashStr(e, t = !1) {
		return this.onePassHasher.start().appendStr(e).end(t);
	}
	static hashAsciiStr(e, t = !1) {
		return this.onePassHasher.start().appendAsciiStr(e).end(t);
	}
	static _hex(t) {
		let n = e.hexChars, r = e.hexOut, i, a, o, s = 0;
		for (; s < 4; s += 1) for (a = s * 8, i = t[s], o = 0; o < 8; o += 2) r[a + 1 + o] = n.charAt(i & 15), i >>>= 4, r[a + 0 + o] = n.charAt(i & 15), i >>>= 4;
		return r.join("");
	}
	static _md5cycle(e, t) {
		let n = e[0], r = e[1], i = e[2], a = e[3];
		n += (r & i | ~r & a) + t[0] - 680876936 | 0, n = (n << 7 | n >>> 25) + r | 0, a += (n & r | ~n & i) + t[1] - 389564586 | 0, a = (a << 12 | a >>> 20) + n | 0, i += (a & n | ~a & r) + t[2] + 606105819 | 0, i = (i << 17 | i >>> 15) + a | 0, r += (i & a | ~i & n) + t[3] - 1044525330 | 0, r = (r << 22 | r >>> 10) + i | 0, n += (r & i | ~r & a) + t[4] - 176418897 | 0, n = (n << 7 | n >>> 25) + r | 0, a += (n & r | ~n & i) + t[5] + 1200080426 | 0, a = (a << 12 | a >>> 20) + n | 0, i += (a & n | ~a & r) + t[6] - 1473231341 | 0, i = (i << 17 | i >>> 15) + a | 0, r += (i & a | ~i & n) + t[7] - 45705983 | 0, r = (r << 22 | r >>> 10) + i | 0, n += (r & i | ~r & a) + t[8] + 1770035416 | 0, n = (n << 7 | n >>> 25) + r | 0, a += (n & r | ~n & i) + t[9] - 1958414417 | 0, a = (a << 12 | a >>> 20) + n | 0, i += (a & n | ~a & r) + t[10] - 42063 | 0, i = (i << 17 | i >>> 15) + a | 0, r += (i & a | ~i & n) + t[11] - 1990404162 | 0, r = (r << 22 | r >>> 10) + i | 0, n += (r & i | ~r & a) + t[12] + 1804603682 | 0, n = (n << 7 | n >>> 25) + r | 0, a += (n & r | ~n & i) + t[13] - 40341101 | 0, a = (a << 12 | a >>> 20) + n | 0, i += (a & n | ~a & r) + t[14] - 1502002290 | 0, i = (i << 17 | i >>> 15) + a | 0, r += (i & a | ~i & n) + t[15] + 1236535329 | 0, r = (r << 22 | r >>> 10) + i | 0, n += (r & a | i & ~a) + t[1] - 165796510 | 0, n = (n << 5 | n >>> 27) + r | 0, a += (n & i | r & ~i) + t[6] - 1069501632 | 0, a = (a << 9 | a >>> 23) + n | 0, i += (a & r | n & ~r) + t[11] + 643717713 | 0, i = (i << 14 | i >>> 18) + a | 0, r += (i & n | a & ~n) + t[0] - 373897302 | 0, r = (r << 20 | r >>> 12) + i | 0, n += (r & a | i & ~a) + t[5] - 701558691 | 0, n = (n << 5 | n >>> 27) + r | 0, a += (n & i | r & ~i) + t[10] + 38016083 | 0, a = (a << 9 | a >>> 23) + n | 0, i += (a & r | n & ~r) + t[15] - 660478335 | 0, i = (i << 14 | i >>> 18) + a | 0, r += (i & n | a & ~n) + t[4] - 405537848 | 0, r = (r << 20 | r >>> 12) + i | 0, n += (r & a | i & ~a) + t[9] + 568446438 | 0, n = (n << 5 | n >>> 27) + r | 0, a += (n & i | r & ~i) + t[14] - 1019803690 | 0, a = (a << 9 | a >>> 23) + n | 0, i += (a & r | n & ~r) + t[3] - 187363961 | 0, i = (i << 14 | i >>> 18) + a | 0, r += (i & n | a & ~n) + t[8] + 1163531501 | 0, r = (r << 20 | r >>> 12) + i | 0, n += (r & a | i & ~a) + t[13] - 1444681467 | 0, n = (n << 5 | n >>> 27) + r | 0, a += (n & i | r & ~i) + t[2] - 51403784 | 0, a = (a << 9 | a >>> 23) + n | 0, i += (a & r | n & ~r) + t[7] + 1735328473 | 0, i = (i << 14 | i >>> 18) + a | 0, r += (i & n | a & ~n) + t[12] - 1926607734 | 0, r = (r << 20 | r >>> 12) + i | 0, n += (r ^ i ^ a) + t[5] - 378558 | 0, n = (n << 4 | n >>> 28) + r | 0, a += (n ^ r ^ i) + t[8] - 2022574463 | 0, a = (a << 11 | a >>> 21) + n | 0, i += (a ^ n ^ r) + t[11] + 1839030562 | 0, i = (i << 16 | i >>> 16) + a | 0, r += (i ^ a ^ n) + t[14] - 35309556 | 0, r = (r << 23 | r >>> 9) + i | 0, n += (r ^ i ^ a) + t[1] - 1530992060 | 0, n = (n << 4 | n >>> 28) + r | 0, a += (n ^ r ^ i) + t[4] + 1272893353 | 0, a = (a << 11 | a >>> 21) + n | 0, i += (a ^ n ^ r) + t[7] - 155497632 | 0, i = (i << 16 | i >>> 16) + a | 0, r += (i ^ a ^ n) + t[10] - 1094730640 | 0, r = (r << 23 | r >>> 9) + i | 0, n += (r ^ i ^ a) + t[13] + 681279174 | 0, n = (n << 4 | n >>> 28) + r | 0, a += (n ^ r ^ i) + t[0] - 358537222 | 0, a = (a << 11 | a >>> 21) + n | 0, i += (a ^ n ^ r) + t[3] - 722521979 | 0, i = (i << 16 | i >>> 16) + a | 0, r += (i ^ a ^ n) + t[6] + 76029189 | 0, r = (r << 23 | r >>> 9) + i | 0, n += (r ^ i ^ a) + t[9] - 640364487 | 0, n = (n << 4 | n >>> 28) + r | 0, a += (n ^ r ^ i) + t[12] - 421815835 | 0, a = (a << 11 | a >>> 21) + n | 0, i += (a ^ n ^ r) + t[15] + 530742520 | 0, i = (i << 16 | i >>> 16) + a | 0, r += (i ^ a ^ n) + t[2] - 995338651 | 0, r = (r << 23 | r >>> 9) + i | 0, n += (i ^ (r | ~a)) + t[0] - 198630844 | 0, n = (n << 6 | n >>> 26) + r | 0, a += (r ^ (n | ~i)) + t[7] + 1126891415 | 0, a = (a << 10 | a >>> 22) + n | 0, i += (n ^ (a | ~r)) + t[14] - 1416354905 | 0, i = (i << 15 | i >>> 17) + a | 0, r += (a ^ (i | ~n)) + t[5] - 57434055 | 0, r = (r << 21 | r >>> 11) + i | 0, n += (i ^ (r | ~a)) + t[12] + 1700485571 | 0, n = (n << 6 | n >>> 26) + r | 0, a += (r ^ (n | ~i)) + t[3] - 1894986606 | 0, a = (a << 10 | a >>> 22) + n | 0, i += (n ^ (a | ~r)) + t[10] - 1051523 | 0, i = (i << 15 | i >>> 17) + a | 0, r += (a ^ (i | ~n)) + t[1] - 2054922799 | 0, r = (r << 21 | r >>> 11) + i | 0, n += (i ^ (r | ~a)) + t[8] + 1873313359 | 0, n = (n << 6 | n >>> 26) + r | 0, a += (r ^ (n | ~i)) + t[15] - 30611744 | 0, a = (a << 10 | a >>> 22) + n | 0, i += (n ^ (a | ~r)) + t[6] - 1560198380 | 0, i = (i << 15 | i >>> 17) + a | 0, r += (a ^ (i | ~n)) + t[13] + 1309151649 | 0, r = (r << 21 | r >>> 11) + i | 0, n += (i ^ (r | ~a)) + t[4] - 145523070 | 0, n = (n << 6 | n >>> 26) + r | 0, a += (r ^ (n | ~i)) + t[11] - 1120210379 | 0, a = (a << 10 | a >>> 22) + n | 0, i += (n ^ (a | ~r)) + t[2] + 718787259 | 0, i = (i << 15 | i >>> 17) + a | 0, r += (a ^ (i | ~n)) + t[9] - 343485551 | 0, r = (r << 21 | r >>> 11) + i | 0, e[0] = n + e[0] | 0, e[1] = r + e[1] | 0, e[2] = i + e[2] | 0, e[3] = a + e[3] | 0;
	}
	start() {
		return this._dataLength = 0, this._bufferLength = 0, this._state.set(e.stateIdentity), this;
	}
	appendStr(t) {
		let n = this._buffer8, r = this._buffer32, i = this._bufferLength, a, o = 0;
		for (; o < t.length; o += 1) {
			if (a = t.charCodeAt(o), a < 128) n[i++] = a;
			else if (a < 2048) n[i++] = (a >>> 6) + 192, n[i++] = a & 63 | 128;
			else if (a < 55296 || a > 56319) n[i++] = (a >>> 12) + 224, n[i++] = a >>> 6 & 63 | 128, n[i++] = a & 63 | 128;
			else {
				if (a = (a - 55296) * 1024 + (t.charCodeAt(++o) - 56320) + 65536, a > 1114111) throw Error("Unicode standard supports code points up to U+10FFFF");
				n[i++] = (a >>> 18) + 240, n[i++] = a >>> 12 & 63 | 128, n[i++] = a >>> 6 & 63 | 128, n[i++] = a & 63 | 128;
			}
			i >= 64 && (this._dataLength += 64, e._md5cycle(this._state, r), i -= 64, r[0] = r[16]);
		}
		return this._bufferLength = i, this;
	}
	appendAsciiStr(t) {
		let n = this._buffer8, r = this._buffer32, i = this._bufferLength, a, o = 0;
		for (;;) {
			for (a = Math.min(t.length - o, 64 - i); a--;) n[i++] = t.charCodeAt(o++);
			if (i < 64) break;
			this._dataLength += 64, e._md5cycle(this._state, r), i = 0;
		}
		return this._bufferLength = i, this;
	}
	appendByteArray(t) {
		let n = this._buffer8, r = this._buffer32, i = this._bufferLength, a, o = 0;
		for (;;) {
			for (a = Math.min(t.length - o, 64 - i); a--;) n[i++] = t[o++];
			if (i < 64) break;
			this._dataLength += 64, e._md5cycle(this._state, r), i = 0;
		}
		return this._bufferLength = i, this;
	}
	getState() {
		let e = this, t = e._state;
		return {
			buffer: String.fromCharCode.apply(null, e._buffer8),
			buflen: e._bufferLength,
			length: e._dataLength,
			state: [
				t[0],
				t[1],
				t[2],
				t[3]
			]
		};
	}
	setState(e) {
		let t = e.buffer, n = e.state, r = this._state, i;
		for (this._dataLength = e.length, this._bufferLength = e.buflen, r[0] = n[0], r[1] = n[1], r[2] = n[2], r[3] = n[3], i = 0; i < t.length; i += 1) this._buffer8[i] = t.charCodeAt(i);
	}
	end(t = !1) {
		let n = this._bufferLength, r = this._buffer8, i = this._buffer32, a = (n >> 2) + 1, o;
		if (this._dataLength += n, r[n] = 128, r[n + 1] = r[n + 2] = r[n + 3] = 0, i.set(e.buffer32Identity.subarray(a), a), n > 55 && (e._md5cycle(this._state, i), i.set(e.buffer32Identity)), o = this._dataLength * 8, o <= 4294967295) i[14] = o;
		else {
			let e = o.toString(16).match(/(.*?)(.{0,8})$/);
			if (e === null) return;
			let t = parseInt(e[2], 16), n = parseInt(e[1], 16) || 0;
			i[14] = t, i[15] = n;
		}
		return e._md5cycle(this._state, i), t ? this._state : e._hex(this._state);
	}
};
U.stateIdentity = new Int32Array([
	1732584193,
	-271733879,
	-1732584194,
	271733878
]), U.buffer32Identity = new Int32Array([
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0
]), U.hexChars = "0123456789abcdef", U.hexOut = [], U.onePassHasher = new U(), U.hashStr("hello") !== "5d41402abc4b2a76b9719d911017c592" && console.error("Md5 self test failed.");
// node_modules/sip.js/lib/core/messages/digest-authentication.js
function W(e) {
	return U.hashStr(e);
}
var an = class {
	constructor(e, t, n, r) {
		this.logger = e.getLogger("sipjs.digestauthentication"), this.username = n, this.password = r, this.ha1 = t, this.nc = 0, this.ncHex = "00000000";
	}
	authenticate(e, t, n) {
		if (this.algorithm = t.algorithm, this.realm = t.realm, this.nonce = t.nonce, this.opaque = t.opaque, this.stale = t.stale, this.algorithm) {
			if (this.algorithm !== "MD5") return this.logger.warn("challenge with Digest algorithm different than 'MD5', authentication aborted"), !1;
		} else this.algorithm = "MD5";
		if (!this.realm) return this.logger.warn("challenge without Digest realm, authentication aborted"), !1;
		if (!this.nonce) return this.logger.warn("challenge without Digest nonce, authentication aborted"), !1;
		if (t.qop) {
			if (t.qop.indexOf("auth") > -1) this.qop = "auth";
			else if (t.qop.indexOf("auth-int") > -1) this.qop = "auth-int";
			else return this.logger.warn("challenge without Digest qop different than 'auth' or 'auth-int', authentication aborted"), !1;
		} else this.qop = void 0;
		return this.method = e.method, this.uri = e.ruri, this.cnonce = Rt(12), this.nc += 1, this.updateNcHex(), this.nc === 4294967296 && (this.nc = 1, this.ncHex = "00000001"), this.calculateResponse(n), !0;
	}
	toString() {
		let e = [];
		if (!this.response) throw Error("response field does not exist, cannot generate Authorization header");
		return e.push("algorithm=" + this.algorithm), e.push("username=\"" + this.username + "\""), e.push("realm=\"" + this.realm + "\""), e.push("nonce=\"" + this.nonce + "\""), e.push("uri=\"" + this.uri + "\""), e.push("response=\"" + this.response + "\""), this.opaque && e.push("opaque=\"" + this.opaque + "\""), this.qop && (e.push("qop=" + this.qop), e.push("cnonce=\"" + this.cnonce + "\""), e.push("nc=" + this.ncHex)), "Digest " + e.join(", ");
	}
	updateNcHex() {
		let e = Number(this.nc).toString(16);
		this.ncHex = "00000000".substr(0, 8 - e.length) + e;
	}
	calculateResponse(e) {
		let t, n;
		t = this.ha1, (t === "" || t === void 0) && (t = W(this.username + ":" + this.realm + ":" + this.password)), this.qop === "auth" ? (n = W(this.method + ":" + this.uri), this.response = W(t + ":" + this.nonce + ":" + this.ncHex + ":" + this.cnonce + ":auth:" + n)) : this.qop === "auth-int" ? (n = W(this.method + ":" + this.uri + ":" + W(e || "")), this.response = W(t + ":" + this.nonce + ":" + this.ncHex + ":" + this.cnonce + ":auth-int:" + n)) : this.qop === void 0 && (n = W(this.method + ":" + this.uri), this.response = W(t + ":" + this.nonce + ":" + n));
	}
}, G;
(function(e) {
	e[e.error = 0] = "error", e[e.warn = 1] = "warn", e[e.log = 2] = "log", e[e.debug = 3] = "debug";
})(G = G ||= {});
// node_modules/sip.js/lib/core/log/logger.js
var on = class {
	constructor(e, t, n) {
		this.logger = e, this.category = t, this.label = n;
	}
	error(e) {
		this.genericLog(G.error, e);
	}
	warn(e) {
		this.genericLog(G.warn, e);
	}
	log(e) {
		this.genericLog(G.log, e);
	}
	debug(e) {
		this.genericLog(G.debug, e);
	}
	genericLog(e, t) {
		this.logger.genericLog(e, this.category, this.label, t);
	}
	get level() {
		return this.logger.level;
	}
	set level(e) {
		this.logger.level = e;
	}
}, sn = class {
	constructor() {
		this.builtinEnabled = !0, this._level = G.log, this.loggers = {}, this.logger = this.getLogger("sip:loggerfactory");
	}
	get level() {
		return this._level;
	}
	set level(e) {
		e >= 0 && e <= 3 ? this._level = e : e > 3 ? this._level = 3 : G.hasOwnProperty(e) ? this._level = e : this.logger.error("invalid 'level' parameter value: " + JSON.stringify(e));
	}
	get connector() {
		return this._connector;
	}
	set connector(e) {
		e ? typeof e == "function" ? this._connector = e : this.logger.error("invalid 'connector' parameter value: " + JSON.stringify(e)) : this._connector = void 0;
	}
	getLogger(e, t) {
		if (t && this.level === 3) return new on(this, e, t);
		if (this.loggers[e]) return this.loggers[e];
		{
			let t = new on(this, e);
			return this.loggers[e] = t, t;
		}
	}
	genericLog(e, t, n, r) {
		this.level >= e && this.builtinEnabled && this.print(e, t, n, r), this.connector && this.connector(G[e], t, n, r);
	}
	print(e, t, n, r) {
		if (typeof r == "string") {
			let e = [/* @__PURE__ */ new Date(), t];
			n && e.push(n), r = e.concat(r).join(" | ");
		}
		switch (e) {
			case G.error:
				console.error(r);
				break;
			case G.warn:
				console.warn(r);
				break;
			case G.log:
				console.log(r);
				break;
			case G.debug: console.debug(r);
		}
	}
}, cn;
(function(e) {
	function t(e, t) {
		let n = t, r = 0, i = 0;
		if (e.substring(n, n + 2).match(/(^\r\n)/)) return -2;
		for (; r === 0;) {
			if (i = e.indexOf("\r\n", n), i === -1) return i;
			!e.substring(i + 2, i + 4).match(/(^\r\n)/) && e.charAt(i + 2).match(/(^\s+)/) ? n = i + 2 : r = i;
		}
		return r;
	}
	e.getHeader = t;
	function n(e, t, n, r) {
		let i = t.indexOf(":", n), a = t.substring(n, i).trim(), o = t.substring(i + 1, r).trim(), s;
		switch (a.toLowerCase()) {
			case "via":
			case "v":
				e.addHeader("via", o), e.getHeaders("via").length === 1 ? (s = e.parseHeader("Via"), s && (e.via = s, e.viaBranch = s.branch)) : s = 0;
				break;
			case "from":
			case "f":
				e.setHeader("from", o), s = e.parseHeader("from"), s && (e.from = s, e.fromTag = s.getParam("tag"));
				break;
			case "to":
			case "t":
				e.setHeader("to", o), s = e.parseHeader("to"), s && (e.to = s, e.toTag = s.getParam("tag"));
				break;
			case "record-route":
				if (s = O.parse(o, "Record_Route"), s === -1 || !(s instanceof Array)) {
					s = void 0;
					break;
				}
				s.forEach((t) => {
					e.addHeader("record-route", o.substring(t.position, t.offset)), e.headers["Record-Route"][e.getHeaders("record-route").length - 1].parsed = t.parsed;
				});
				break;
			case "call-id":
			case "i":
				e.setHeader("call-id", o), s = e.parseHeader("call-id"), s && (e.callId = o);
				break;
			case "contact":
			case "m":
				if (s = O.parse(o, "Contact"), s === -1 || !(s instanceof Array)) {
					s = void 0;
					break;
				}
				s.forEach((t) => {
					e.addHeader("contact", o.substring(t.position, t.offset)), e.headers.Contact[e.getHeaders("contact").length - 1].parsed = t.parsed;
				});
				break;
			case "content-length":
			case "l":
				e.setHeader("content-length", o), s = e.parseHeader("content-length");
				break;
			case "content-type":
			case "c":
				e.setHeader("content-type", o), s = e.parseHeader("content-type");
				break;
			case "cseq":
				e.setHeader("cseq", o), s = e.parseHeader("cseq"), s && (e.cseq = s.value), e instanceof A && (e.method = s.method);
				break;
			case "max-forwards":
				e.setHeader("max-forwards", o), s = e.parseHeader("max-forwards");
				break;
			case "www-authenticate":
				e.setHeader("www-authenticate", o), s = e.parseHeader("www-authenticate");
				break;
			case "proxy-authenticate":
				e.setHeader("proxy-authenticate", o), s = e.parseHeader("proxy-authenticate");
				break;
			case "refer-to":
			case "r":
				e.setHeader("refer-to", o), s = e.parseHeader("refer-to"), s && (e.referTo = s);
				break;
			default: e.addHeader(a.toLowerCase(), o), s = 0;
		}
		return s !== void 0 || { error: "error parsing header '" + a + "'" };
	}
	e.parseHeader = n;
	function r(e, r) {
		let i = 0, a = e.indexOf("\r\n");
		if (a === -1) {
			r.warn("no CRLF found, not a SIP message, discarded");
			return;
		}
		let o = e.substring(0, a), s = O.parse(o, "Request_Response"), c;
		if (s === -1) {
			r.warn("error parsing first line of SIP message: \"" + o + "\"");
			return;
		}
		s.status_code ? (c = new A(), c.statusCode = s.status_code, c.reasonPhrase = s.reason_phrase) : (c = new Ut(), c.method = s.method, c.ruri = s.uri), c.data = e, i = a + 2;
		let l;
		for (;;) {
			if (a = t(e, i), a === -2) {
				l = i + 2;
				break;
			}
			if (a === -1) {
				r.error("malformed message");
				return;
			}
			let o = n(c, e, i, a);
			if (o && o !== !0) {
				r.error(o.error);
				return;
			}
			i = a + 2;
		}
		return c.hasHeader("content-length") ? c.body = e.substr(l, Number(c.getHeader("content-length"))) : c.body = e.substring(l), c;
	}
	e.parseMessage = r;
})(cn = cn ||= {});
// node_modules/sip.js/lib/core/messages/outgoing-response.js
function ln(e, t) {
	if (t.statusCode < 100 || t.statusCode > 699) throw TypeError("Invalid statusCode: " + t.statusCode);
	let n = t.reasonPhrase ? t.reasonPhrase : zt(t.statusCode), r = "SIP/2.0 " + t.statusCode + " " + n + "\r\n";
	t.statusCode >= 100 && t.statusCode, t.statusCode;
	let i = "From: " + e.getHeader("From") + "\r\n", a = "Call-ID: " + e.callId + "\r\n", o = "CSeq: " + e.cseq + " " + e.method + "\r\n", s = e.getHeaders("via").reduce((e, t) => e + "Via: " + t + "\r\n", ""), c = "To: " + e.getHeader("to");
	if (t.statusCode > 100 && !e.parseHeader("to").hasParam("tag")) {
		let e = t.toTag;
		e ||= Bt(), c += ";tag=" + e;
	}
	c += "\r\n";
	let l = "";
	t.supported && (l = "Supported: " + t.supported.join(", ") + "\r\n");
	let u = "";
	t.userAgent && (u = "User-Agent: " + t.userAgent + "\r\n");
	let d = "";
	return t.extraHeaders && (d = t.extraHeaders.reduce((e, t) => e + t.trim() + "\r\n", "")), r += s, r += i, r += c, r += o, r += a, r += l, r += u, r += d, t.body ? (r += "Content-Type: " + t.body.contentType + "\r\n", r += "Content-Length: " + Vt(t.body.content) + "\r\n\r\n", r += t.body.content) : r += "Content-Length: 0\r\n\r\n", { message: r };
}
// node_modules/sip.js/lib/core/exceptions/transport-error.js
var un = class extends bt {
	constructor(e) {
		super(e || "Unspecified transport error.");
	}
}, dn = class {
	constructor(e, t, n, r, i) {
		this._transport = e, this._user = t, this._id = n, this._state = r, this.listeners = [], this.logger = t.loggerFactory.getLogger(i, n), this.logger.debug(`Constructing ${this.typeToString()} with id ${this.id}.`);
	}
	dispose() {
		this.logger.debug(`Destroyed ${this.typeToString()} with id ${this.id}.`);
	}
	get id() {
		return this._id;
	}
	get kind() {
		throw Error("Invalid kind.");
	}
	get state() {
		return this._state;
	}
	get transport() {
		return this._transport;
	}
	addStateChangeListener(e, t) {
		let n = () => {
			this.removeStateChangeListener(n), e();
		};
		t?.once === !0 ? this.listeners.push(n) : this.listeners.push(e);
	}
	notifyStateChangeListeners() {
		this.listeners.slice().forEach((e) => e());
	}
	removeStateChangeListener(e) {
		this.listeners = this.listeners.filter((t) => t !== e);
	}
	logTransportError(e, t) {
		this.logger.error(e.message), this.logger.error(`Transport error occurred in ${this.typeToString()} with id ${this.id}.`), this.logger.error(t);
	}
	send(e) {
		return this.transport.send(e).catch((e) => {
			if (e instanceof un) throw this.onTransportError(e), e;
			let t;
			throw t = e && typeof e.message == "string" ? new un(e.message) : new un(), this.onTransportError(t), t;
		});
	}
	setState(e) {
		this.logger.debug(`State change to "${e}" on ${this.typeToString()} with id ${this.id}.`), this._state = e, this._user.onStateChange && this._user.onStateChange(e), this.notifyStateChangeListeners();
	}
	typeToString() {
		return "UnknownType";
	}
}, fn = class extends dn {
	constructor(e, t, n, r, i) {
		super(t, n, e.viaBranch, r, i), this._request = e, this.user = n;
	}
	get request() {
		return this._request;
	}
}, K;
(function(e) {
	e.Accepted = "Accepted", e.Calling = "Calling", e.Completed = "Completed", e.Confirmed = "Confirmed", e.Proceeding = "Proceeding", e.Terminated = "Terminated", e.Trying = "Trying";
})(K = K ||= {});
// node_modules/sip.js/lib/core/transactions/invite-server-transaction.js
var q = class extends fn {
	constructor(e, t, n) {
		super(e, t, n, K.Proceeding, "sip.transaction.ist");
	}
	dispose() {
		this.stopProgressExtensionTimer(), this.H &&= (clearTimeout(this.H), void 0), this.I &&= (clearTimeout(this.I), void 0), this.L &&= (clearTimeout(this.L), void 0), super.dispose();
	}
	get kind() {
		return "ist";
	}
	receiveRequest(e) {
		switch (this.state) {
			case K.Proceeding:
				if (e.method === F.INVITE) {
					this.lastProvisionalResponse && this.send(this.lastProvisionalResponse).catch((e) => {
						this.logTransportError(e, "Failed to send retransmission of provisional response.");
					});
					return;
				}
				break;
			case K.Accepted:
				if (e.method === F.INVITE) return;
				break;
			case K.Completed:
				if (e.method === F.INVITE) {
					if (!this.lastFinalResponse) throw Error("Last final response undefined.");
					this.send(this.lastFinalResponse).catch((e) => {
						this.logTransportError(e, "Failed to send retransmission of final response.");
					});
					return;
				}
				if (e.method === F.ACK) {
					this.stateTransition(K.Confirmed);
					return;
				}
				break;
			case K.Confirmed:
				if (e.method === F.INVITE || e.method === F.ACK) return;
				break;
			case K.Terminated:
				if (e.method === F.INVITE || e.method === F.ACK) return;
				break;
			default: throw Error(`Invalid state ${this.state}`);
		}
		let t = `INVITE server transaction received unexpected ${e.method} request while in state ${this.state}.`;
		this.logger.warn(t);
	}
	receiveResponse(e, t) {
		if (e < 100 || e > 699) throw Error(`Invalid status code ${e}`);
		switch (this.state) {
			case K.Proceeding:
				if (e >= 100 && e <= 199) {
					this.lastProvisionalResponse = t, e > 100 && this.startProgressExtensionTimer(), this.send(t).catch((e) => {
						this.logTransportError(e, "Failed to send 1xx response.");
					});
					return;
				}
				if (e >= 200 && e <= 299) {
					this.lastFinalResponse = t, this.stateTransition(K.Accepted), this.send(t).catch((e) => {
						this.logTransportError(e, "Failed to send 2xx response.");
					});
					return;
				}
				if (e >= 300 && e <= 699) {
					this.lastFinalResponse = t, this.stateTransition(K.Completed), this.send(t).catch((e) => {
						this.logTransportError(e, "Failed to send non-2xx final response.");
					});
					return;
				}
				break;
			case K.Accepted:
				if (e >= 200 && e <= 299) {
					this.send(t).catch((e) => {
						this.logTransportError(e, "Failed to send 2xx response.");
					});
					return;
				}
				break;
			case K.Completed: break;
			case K.Confirmed: break;
			case K.Terminated: break;
			default: throw Error(`Invalid state ${this.state}`);
		}
		let n = `INVITE server transaction received unexpected ${e} response from TU while in state ${this.state}.`;
		throw this.logger.error(n), Error(n);
	}
	retransmitAcceptedResponse() {
		this.state === K.Accepted && this.lastFinalResponse && this.send(this.lastFinalResponse).catch((e) => {
			this.logTransportError(e, "Failed to send 2xx response.");
		});
	}
	onTransportError(e) {
		this.user.onTransportError && this.user.onTransportError(e);
	}
	typeToString() {
		return "INVITE server transaction";
	}
	stateTransition(e) {
		let t = () => {
			throw Error(`Invalid state transition from ${this.state} to ${e}`);
		};
		switch (e) {
			case K.Proceeding:
				t();
				break;
			case K.Accepted:
			case K.Completed:
				this.state !== K.Proceeding && t();
				break;
			case K.Confirmed:
				this.state !== K.Completed && t();
				break;
			case K.Terminated:
				this.state !== K.Accepted && this.state !== K.Completed && this.state !== K.Confirmed && t();
				break;
			default: t();
		}
		this.stopProgressExtensionTimer(), e === K.Accepted && (this.L = setTimeout(() => this.timerL(), N.TIMER_L)), e === K.Completed && (this.H = setTimeout(() => this.timerH(), N.TIMER_H)), e === K.Confirmed && (this.I = setTimeout(() => this.timerI(), N.TIMER_I)), e === K.Terminated && this.dispose(), this.setState(e);
	}
	startProgressExtensionTimer() {
		this.progressExtensionTimer === void 0 && (this.progressExtensionTimer = setInterval(() => {
			if (this.logger.debug(`Progress extension timer expired for INVITE server transaction ${this.id}.`), !this.lastProvisionalResponse) throw Error("Last provisional response undefined.");
			this.send(this.lastProvisionalResponse).catch((e) => {
				this.logTransportError(e, "Failed to send retransmission of provisional response.");
			});
		}, N.PROVISIONAL_RESPONSE_INTERVAL));
	}
	stopProgressExtensionTimer() {
		this.progressExtensionTimer !== void 0 && (clearInterval(this.progressExtensionTimer), this.progressExtensionTimer = void 0);
	}
	timerG() {}
	timerH() {
		this.logger.debug(`Timer H expired for INVITE server transaction ${this.id}.`), this.state === K.Completed && (this.logger.warn("ACK to negative final response was never received, terminating transaction."), this.stateTransition(K.Terminated));
	}
	timerI() {
		this.logger.debug(`Timer I expired for INVITE server transaction ${this.id}.`), this.stateTransition(K.Terminated);
	}
	timerL() {
		this.logger.debug(`Timer L expired for INVITE server transaction ${this.id}.`), this.state === K.Accepted && this.stateTransition(K.Terminated);
	}
}, pn = class e extends dn {
	constructor(t, n, r, i, a) {
		super(n, r, e.makeId(t), i, a), this._request = t, this.user = r, t.setViaHeader(this.id, n.protocol);
	}
	static makeId(e) {
		if (e.method === "CANCEL") {
			if (!e.branch) throw Error("Outgoing CANCEL request without a branch.");
			return e.branch;
		}
		return "z9hG4bK" + Math.floor(Math.random() * 1e7);
	}
	get request() {
		return this._request;
	}
	onRequestTimeout() {
		this.user.onRequestTimeout && this.user.onRequestTimeout();
	}
}, J = class extends pn {
	constructor(e, t, n) {
		super(e, t, n, K.Trying, "sip.transaction.nict"), this.F = setTimeout(() => this.timerF(), N.TIMER_F), this.send(e.toString()).catch((e) => {
			this.logTransportError(e, "Failed to send initial outgoing request.");
		});
	}
	dispose() {
		this.F &&= (clearTimeout(this.F), void 0), this.K &&= (clearTimeout(this.K), void 0), super.dispose();
	}
	get kind() {
		return "nict";
	}
	receiveResponse(e) {
		let t = e.statusCode;
		if (!t || t < 100 || t > 699) throw Error(`Invalid status code ${t}`);
		switch (this.state) {
			case K.Trying:
				if (t >= 100 && t <= 199) {
					this.stateTransition(K.Proceeding), this.user.receiveResponse && this.user.receiveResponse(e);
					return;
				}
				if (t >= 200 && t <= 699) {
					if (this.stateTransition(K.Completed), t === 408) {
						this.onRequestTimeout();
						return;
					}
					this.user.receiveResponse && this.user.receiveResponse(e);
					return;
				}
				break;
			case K.Proceeding:
				if (t >= 100 && t <= 199 && this.user.receiveResponse) return this.user.receiveResponse(e);
				if (t >= 200 && t <= 699) {
					if (this.stateTransition(K.Completed), t === 408) {
						this.onRequestTimeout();
						return;
					}
					this.user.receiveResponse && this.user.receiveResponse(e);
					return;
				}
				break;
			case K.Completed: return;
			case K.Terminated: return;
			default: throw Error(`Invalid state ${this.state}`);
		}
		let n = `Non-INVITE client transaction received unexpected ${t} response while in state ${this.state}.`;
		this.logger.warn(n);
	}
	onTransportError(e) {
		this.user.onTransportError && this.user.onTransportError(e), this.stateTransition(K.Terminated, !0);
	}
	typeToString() {
		return "non-INVITE client transaction";
	}
	stateTransition(e, t = !1) {
		let n = () => {
			throw Error(`Invalid state transition from ${this.state} to ${e}`);
		};
		switch (e) {
			case K.Trying:
				n();
				break;
			case K.Proceeding:
				this.state !== K.Trying && n();
				break;
			case K.Completed:
				this.state !== K.Trying && this.state !== K.Proceeding && n();
				break;
			case K.Terminated:
				this.state !== K.Trying && this.state !== K.Proceeding && this.state !== K.Completed && (t || n());
				break;
			default: n();
		}
		e === K.Completed && (this.F &&= (clearTimeout(this.F), void 0), this.K = setTimeout(() => this.timerK(), N.TIMER_K)), e === K.Terminated && this.dispose(), this.setState(e);
	}
	timerF() {
		this.logger.debug(`Timer F expired for non-INVITE client transaction ${this.id}.`), (this.state === K.Trying || this.state === K.Proceeding) && (this.onRequestTimeout(), this.stateTransition(K.Terminated));
	}
	timerK() {
		this.state === K.Completed && this.stateTransition(K.Terminated);
	}
}, mn = class {
	constructor(e, t) {
		this.core = e, this.dialogState = t, this.core.dialogs.set(this.id, this);
	}
	static initialDialogStateForUserAgentClient(e, t) {
		let n = t.getHeaders("record-route").reverse(), r = t.parseHeader("contact");
		if (!r) throw Error("Contact undefined.");
		if (!(r instanceof E)) throw Error("Contact not instance of NameAddrHeader.");
		let i = r.uri, a = e.cseq, o = e.callId, s = e.fromTag, c = t.toTag;
		if (!o) throw Error("Call id undefined.");
		if (!s) throw Error("From tag undefined.");
		if (!c) throw Error("To tag undefined.");
		if (!e.from) throw Error("From undefined.");
		if (!e.to) throw Error("To undefined.");
		let l = e.from.uri, u = e.to.uri;
		if (!t.statusCode) throw Error("Incoming response status code undefined.");
		let d = t.statusCode < 200;
		return {
			id: o + s + c,
			early: d,
			callId: o,
			localTag: s,
			remoteTag: c,
			localSequenceNumber: a,
			remoteSequenceNumber: void 0,
			localURI: l,
			remoteURI: u,
			remoteTarget: i,
			routeSet: n,
			secure: !1
		};
	}
	static initialDialogStateForUserAgentServer(e, t, n = !1) {
		let r = e.getHeaders("record-route"), i = e.parseHeader("contact");
		if (!i) throw Error("Contact undefined.");
		if (!(i instanceof E)) throw Error("Contact not instance of NameAddrHeader.");
		let a = i.uri, o = e.cseq, s = e.callId, c = t, l = e.fromTag, u = e.from.uri, d = e.to.uri;
		return {
			id: s + c + l,
			early: n,
			callId: s,
			localTag: c,
			remoteTag: l,
			localSequenceNumber: void 0,
			remoteSequenceNumber: o,
			localURI: d,
			remoteURI: u,
			remoteTarget: a,
			routeSet: r,
			secure: !1
		};
	}
	dispose() {
		this.core.dialogs.delete(this.id);
	}
	get id() {
		return this.dialogState.id;
	}
	get early() {
		return this.dialogState.early;
	}
	get callId() {
		return this.dialogState.callId;
	}
	get localTag() {
		return this.dialogState.localTag;
	}
	get remoteTag() {
		return this.dialogState.remoteTag;
	}
	get localSequenceNumber() {
		return this.dialogState.localSequenceNumber;
	}
	get remoteSequenceNumber() {
		return this.dialogState.remoteSequenceNumber;
	}
	get localURI() {
		return this.dialogState.localURI;
	}
	get remoteURI() {
		return this.dialogState.remoteURI;
	}
	get remoteTarget() {
		return this.dialogState.remoteTarget;
	}
	get routeSet() {
		return this.dialogState.routeSet;
	}
	get secure() {
		return this.dialogState.secure;
	}
	get userAgentCore() {
		return this.core;
	}
	confirm() {
		this.dialogState.early = !1;
	}
	receiveRequest(e) {
		if (e.method !== F.ACK) {
			if (this.remoteSequenceNumber) {
				if (e.cseq <= this.remoteSequenceNumber) throw Error("Out of sequence in dialog request. Did you forget to call sequenceGuard()?");
				this.dialogState.remoteSequenceNumber = e.cseq;
			}
			this.remoteSequenceNumber || (this.dialogState.remoteSequenceNumber = e.cseq);
		}
	}
	recomputeRouteSet(e) {
		this.dialogState.routeSet = e.getHeaders("record-route").reverse();
	}
	createOutgoingRequestMessage(e, t) {
		let n = this.remoteURI, r = this.remoteTag, i = this.localURI, a = this.localTag, o = this.callId, s;
		s = t && t.cseq ? t.cseq : this.dialogState.localSequenceNumber ? this.dialogState.localSequenceNumber += 1 : this.dialogState.localSequenceNumber = 1;
		let c = this.remoteTarget, l = this.routeSet, u = t && t.extraHeaders, d = t && t.body;
		return this.userAgentCore.makeOutgoingRequestMessage(e, c, i, n, {
			callId: o,
			cseq: s,
			fromTag: a,
			toTag: r,
			routeSet: l
		}, u, d);
	}
	incrementLocalSequenceNumber() {
		if (!this.dialogState.localSequenceNumber) throw Error("Local sequence number undefined.");
		this.dialogState.localSequenceNumber += 1;
	}
	sequenceGuard(e) {
		return e.method === F.ACK ? !0 : this.remoteSequenceNumber && e.cseq <= this.remoteSequenceNumber ? (this.core.replyStateless(e, { statusCode: 500 }), !1) : !0;
	}
}, Y = class extends pn {
	constructor(e, t, n) {
		super(e, t, n, K.Calling, "sip.transaction.ict"), this.ackRetransmissionCache = /* @__PURE__ */ new Map(), this.B = setTimeout(() => this.timerB(), N.TIMER_B), this.send(e.toString()).catch((e) => {
			this.logTransportError(e, "Failed to send initial outgoing request.");
		});
	}
	dispose() {
		this.B &&= (clearTimeout(this.B), void 0), this.D &&= (clearTimeout(this.D), void 0), this.M &&= (clearTimeout(this.M), void 0), super.dispose();
	}
	get kind() {
		return "ict";
	}
	ackResponse(e) {
		let t = e.toTag;
		if (!t) throw Error("To tag undefined.");
		let n = "z9hG4bK" + Math.floor(Math.random() * 1e7);
		e.setViaHeader(n, this.transport.protocol), this.ackRetransmissionCache.set(t, e), this.send(e.toString()).catch((e) => {
			this.logTransportError(e, "Failed to send ACK to 2xx response.");
		});
	}
	receiveResponse(e) {
		let t = e.statusCode;
		if (!t || t < 100 || t > 699) throw Error(`Invalid status code ${t}`);
		switch (this.state) {
			case K.Calling:
				if (t >= 100 && t <= 199) {
					this.stateTransition(K.Proceeding), this.user.receiveResponse && this.user.receiveResponse(e);
					return;
				}
				if (t >= 200 && t <= 299) {
					this.ackRetransmissionCache.set(e.toTag, void 0), this.stateTransition(K.Accepted), this.user.receiveResponse && this.user.receiveResponse(e);
					return;
				}
				if (t >= 300 && t <= 699) {
					this.stateTransition(K.Completed), this.ack(e), this.user.receiveResponse && this.user.receiveResponse(e);
					return;
				}
				break;
			case K.Proceeding:
				if (t >= 100 && t <= 199) {
					this.user.receiveResponse && this.user.receiveResponse(e);
					return;
				}
				if (t >= 200 && t <= 299) {
					this.ackRetransmissionCache.set(e.toTag, void 0), this.stateTransition(K.Accepted), this.user.receiveResponse && this.user.receiveResponse(e);
					return;
				}
				if (t >= 300 && t <= 699) {
					this.stateTransition(K.Completed), this.ack(e), this.user.receiveResponse && this.user.receiveResponse(e);
					return;
				}
				break;
			case K.Accepted:
				if (t >= 200 && t <= 299) {
					if (!this.ackRetransmissionCache.has(e.toTag)) {
						this.ackRetransmissionCache.set(e.toTag, void 0), this.user.receiveResponse && this.user.receiveResponse(e);
						return;
					}
					let t = this.ackRetransmissionCache.get(e.toTag);
					if (t) {
						this.send(t.toString()).catch((e) => {
							this.logTransportError(e, "Failed to send retransmission of ACK to 2xx response.");
						});
						return;
					}
					return;
				}
				break;
			case K.Completed:
				if (t >= 300 && t <= 699) {
					this.ack(e);
					return;
				}
				break;
			case K.Terminated: break;
			default: throw Error(`Invalid state ${this.state}`);
		}
		let n = `Received unexpected ${t} response while in state ${this.state}.`;
		this.logger.warn(n);
	}
	onTransportError(e) {
		this.user.onTransportError && this.user.onTransportError(e), this.stateTransition(K.Terminated, !0);
	}
	typeToString() {
		return "INVITE client transaction";
	}
	ack(e) {
		let t = this.request.ruri, n = this.request.callId, r = this.request.cseq, i = this.request.getHeader("from"), a = e.getHeader("to"), o = this.request.getHeader("via"), s = this.request.getHeader("route");
		if (!i) throw Error("From undefined.");
		if (!a) throw Error("To undefined.");
		if (!o) throw Error("Via undefined.");
		let c = `ACK ${t} SIP/2.0\r\n`;
		s && (c += `Route: ${s}\r\n`), c += `Via: ${o}\r\n`, c += `To: ${a}\r\n`, c += `From: ${i}\r\n`, c += `Call-ID: ${n}\r\n`, c += `CSeq: ${r} ACK\r\n`, c += "Max-Forwards: 70\r\n", c += "Content-Length: 0\r\n\r\n", this.send(c).catch((e) => {
			this.logTransportError(e, "Failed to send ACK to non-2xx response.");
		});
	}
	stateTransition(e, t = !1) {
		let n = () => {
			throw Error(`Invalid state transition from ${this.state} to ${e}`);
		};
		switch (e) {
			case K.Calling:
				n();
				break;
			case K.Proceeding:
				this.state !== K.Calling && n();
				break;
			case K.Accepted:
			case K.Completed:
				this.state !== K.Calling && this.state !== K.Proceeding && n();
				break;
			case K.Terminated:
				this.state !== K.Calling && this.state !== K.Accepted && this.state !== K.Completed && (t || n());
				break;
			default: n();
		}
		this.B &&= (clearTimeout(this.B), void 0), K.Proceeding, e === K.Completed && (this.D = setTimeout(() => this.timerD(), N.TIMER_D)), e === K.Accepted && (this.M = setTimeout(() => this.timerM(), N.TIMER_M)), e === K.Terminated && this.dispose(), this.setState(e);
	}
	timerA() {}
	timerB() {
		this.logger.debug(`Timer B expired for INVITE client transaction ${this.id}.`), this.state === K.Calling && (this.onRequestTimeout(), this.stateTransition(K.Terminated));
	}
	timerD() {
		this.logger.debug(`Timer D expired for INVITE client transaction ${this.id}.`), this.state === K.Completed && this.stateTransition(K.Terminated);
	}
	timerM() {
		this.logger.debug(`Timer M expired for INVITE client transaction ${this.id}.`), this.state === K.Accepted && this.stateTransition(K.Terminated);
	}
}, X = class e {
	constructor(e, t, n, r) {
		this.transactionConstructor = e, this.core = t, this.message = n, this.delegate = r, this.challenged = !1, this.stale = !1, this.logger = this.loggerFactory.getLogger("sip.user-agent-client"), this.init();
	}
	dispose() {
		this.transaction.dispose();
	}
	get loggerFactory() {
		return this.core.loggerFactory;
	}
	get transaction() {
		if (!this._transaction) throw Error("Transaction undefined.");
		return this._transaction;
	}
	cancel(t, n = {}) {
		if (!this.transaction) throw Error("Transaction undefined.");
		if (!this.message.to) throw Error("To undefined.");
		if (!this.message.from) throw Error("From undefined.");
		let r = this.core.makeOutgoingRequestMessage(F.CANCEL, this.message.ruri, this.message.from.uri, this.message.to.uri, {
			toTag: this.message.toTag,
			fromTag: this.message.fromTag,
			callId: this.message.callId,
			cseq: this.message.cseq
		}, n.extraHeaders);
		return r.branch = this.message.branch, this.message.headers.Route && (r.headers.Route = this.message.headers.Route), t && r.setHeader("Reason", t), this.transaction.state === K.Proceeding ? new e(J, this.core, r) : this.transaction.addStateChangeListener(() => {
			this.transaction && this.transaction.state === K.Proceeding && new e(J, this.core, r);
		}, { once: !0 }), r;
	}
	authenticationGuard(e, t) {
		let n = e.statusCode;
		if (!n) throw Error("Response status code undefined.");
		if (n !== 401 && n !== 407) return !0;
		let r, i;
		if (n === 401 ? (r = e.parseHeader("www-authenticate"), i = "authorization") : (r = e.parseHeader("proxy-authenticate"), i = "proxy-authorization"), !r) return this.logger.warn(n + " with wrong or missing challenge, cannot authenticate"), !0;
		if (this.challenged && (this.stale || r.stale !== !0)) return this.logger.warn(n + " apparently in authentication loop, cannot authenticate"), !0;
		if (!this.credentials && (this.credentials = this.core.configuration.authenticationFactory(), !this.credentials)) return this.logger.warn("Unable to obtain credentials, cannot authenticate"), !0;
		if (!this.credentials.authenticate(this.message, r)) return !0;
		this.challenged = !0, r.stale && (this.stale = !0);
		let a = this.message.cseq += 1;
		return t && t.localSequenceNumber && (t.incrementLocalSequenceNumber(), a = this.message.cseq = t.localSequenceNumber), this.message.setHeader("cseq", a + " " + this.message.method), this.message.setHeader(i, this.credentials.toString()), this.init(), !1;
	}
	onRequestTimeout() {
		this.logger.warn("User agent client request timed out. Generating internal 408 Request Timeout.");
		let e = new A();
		e.statusCode = 408, e.reasonPhrase = "Request Timeout", this.receiveResponse(e);
	}
	onTransportError(e) {
		this.logger.error(e.message), this.logger.error("User agent client request transport error. Generating internal 503 Service Unavailable.");
		let t = new A();
		t.statusCode = 503, t.reasonPhrase = "Service Unavailable", this.receiveResponse(t);
	}
	receiveResponse(e) {
		if (!this.authenticationGuard(e)) return;
		let t = e.statusCode ? e.statusCode.toString() : "";
		if (!t) throw Error("Response status code undefined.");
		switch (!0) {
			case /^100$/.test(t):
				this.delegate && this.delegate.onTrying && this.delegate.onTrying({ message: e });
				break;
			case /^1[0-9]{2}$/.test(t):
				this.delegate && this.delegate.onProgress && this.delegate.onProgress({ message: e });
				break;
			case /^2[0-9]{2}$/.test(t):
				this.delegate && this.delegate.onAccept && this.delegate.onAccept({ message: e });
				break;
			case /^3[0-9]{2}$/.test(t):
				this.delegate && this.delegate.onRedirect && this.delegate.onRedirect({ message: e });
				break;
			case /^[4-6][0-9]{2}$/.test(t):
				this.delegate && this.delegate.onReject && this.delegate.onReject({ message: e });
				break;
			default: throw Error(`Invalid status code ${t}`);
		}
	}
	init() {
		let e = {
			loggerFactory: this.loggerFactory,
			onRequestTimeout: () => this.onRequestTimeout(),
			onStateChange: (e) => {
				e === K.Terminated && (this.core.userAgentClients.delete(n), t === this._transaction && this.dispose());
			},
			onTransportError: (e) => this.onTransportError(e),
			receiveResponse: (e) => this.receiveResponse(e)
		}, t = new this.transactionConstructor(this.message, this.core.transport, e);
		this._transaction = t;
		let n = t.id + t.request.method;
		this.core.userAgentClients.set(n, this);
	}
}, hn = class extends X {
	constructor(e, t, n) {
		let r = e.createOutgoingRequestMessage(F.BYE, n);
		super(J, e.userAgentCore, r, t), e.dispose();
	}
}, Z = class extends fn {
	constructor(e, t, n) {
		super(e, t, n, K.Trying, "sip.transaction.nist");
	}
	dispose() {
		this.J &&= (clearTimeout(this.J), void 0), super.dispose();
	}
	get kind() {
		return "nist";
	}
	receiveRequest(e) {
		switch (this.state) {
			case K.Trying: break;
			case K.Proceeding:
				if (!this.lastResponse) throw Error("Last response undefined.");
				this.send(this.lastResponse).catch((e) => {
					this.logTransportError(e, "Failed to send retransmission of provisional response.");
				});
				break;
			case K.Completed:
				if (!this.lastResponse) throw Error("Last response undefined.");
				this.send(this.lastResponse).catch((e) => {
					this.logTransportError(e, "Failed to send retransmission of final response.");
				});
				break;
			case K.Terminated: break;
			default: throw Error(`Invalid state ${this.state}`);
		}
	}
	receiveResponse(e, t) {
		if (e < 100 || e > 699) throw Error(`Invalid status code ${e}`);
		if (e > 100 && e <= 199) throw Error("Provisional response other than 100 not allowed.");
		switch (this.state) {
			case K.Trying:
				if (this.lastResponse = t, e >= 100 && e < 200) {
					this.stateTransition(K.Proceeding), this.send(t).catch((e) => {
						this.logTransportError(e, "Failed to send provisional response.");
					});
					return;
				}
				if (e >= 200 && e <= 699) {
					this.stateTransition(K.Completed), this.send(t).catch((e) => {
						this.logTransportError(e, "Failed to send final response.");
					});
					return;
				}
				break;
			case K.Proceeding:
				if (this.lastResponse = t, e >= 200 && e <= 699) {
					this.stateTransition(K.Completed), this.send(t).catch((e) => {
						this.logTransportError(e, "Failed to send final response.");
					});
					return;
				}
				break;
			case K.Completed: return;
			case K.Terminated: break;
			default: throw Error(`Invalid state ${this.state}`);
		}
		let n = `Non-INVITE server transaction received unexpected ${e} response from TU while in state ${this.state}.`;
		throw this.logger.error(n), Error(n);
	}
	onTransportError(e) {
		this.user.onTransportError && this.user.onTransportError(e), this.stateTransition(K.Terminated, !0);
	}
	typeToString() {
		return "non-INVITE server transaction";
	}
	stateTransition(e, t = !1) {
		let n = () => {
			throw Error(`Invalid state transition from ${this.state} to ${e}`);
		};
		switch (e) {
			case K.Trying:
				n();
				break;
			case K.Proceeding:
				this.state !== K.Trying && n();
				break;
			case K.Completed:
				this.state !== K.Trying && this.state !== K.Proceeding && n();
				break;
			case K.Terminated:
				this.state !== K.Proceeding && this.state !== K.Completed && (t || n());
				break;
			default: n();
		}
		e === K.Completed && (this.J = setTimeout(() => this.timerJ(), N.TIMER_J)), e === K.Terminated && this.dispose(), this.setState(e);
	}
	timerJ() {
		this.logger.debug(`Timer J expired for NON-INVITE server transaction ${this.id}.`), this.state === K.Completed && this.stateTransition(K.Terminated);
	}
}, Q = class {
	constructor(e, t, n, r) {
		this.transactionConstructor = e, this.core = t, this.message = n, this.delegate = r, this.logger = this.loggerFactory.getLogger("sip.user-agent-server"), this.toTag = n.toTag ? n.toTag : Bt(), this.init();
	}
	dispose() {
		this.transaction.dispose();
	}
	get loggerFactory() {
		return this.core.loggerFactory;
	}
	get transaction() {
		if (!this._transaction) throw Error("Transaction undefined.");
		return this._transaction;
	}
	accept(e = { statusCode: 200 }) {
		if (!this.acceptable) throw new P(`${this.message.method} not acceptable in state ${this.transaction.state}.`);
		let t = e.statusCode;
		if (t < 200 || t > 299) throw TypeError(`Invalid statusCode: ${t}`);
		return this.reply(e);
	}
	progress(e = { statusCode: 180 }) {
		if (!this.progressable) throw new P(`${this.message.method} not progressable in state ${this.transaction.state}.`);
		let t = e.statusCode;
		if (t < 101 || t > 199) throw TypeError(`Invalid statusCode: ${t}`);
		return this.reply(e);
	}
	redirect(e, t = { statusCode: 302 }) {
		if (!this.redirectable) throw new P(`${this.message.method} not redirectable in state ${this.transaction.state}.`);
		let n = t.statusCode;
		if (n < 300 || n > 399) throw TypeError(`Invalid statusCode: ${n}`);
		let r = [];
		return e.forEach((e) => r.push(`Contact: ${e.toString()}`)), t.extraHeaders = (t.extraHeaders || []).concat(r), this.reply(t);
	}
	reject(e = { statusCode: 480 }) {
		if (!this.rejectable) throw new P(`${this.message.method} not rejectable in state ${this.transaction.state}.`);
		let t = e.statusCode;
		if (t < 400 || t > 699) throw TypeError(`Invalid statusCode: ${t}`);
		return this.reply(e);
	}
	trying(e) {
		if (!this.tryingable) throw new P(`${this.message.method} not tryingable in state ${this.transaction.state}.`);
		return this.reply({ statusCode: 100 });
	}
	receiveCancel(e) {
		this.delegate && this.delegate.onCancel && this.delegate.onCancel(e);
	}
	get acceptable() {
		if (this.transaction instanceof q) return this.transaction.state === K.Proceeding || this.transaction.state === K.Accepted;
		if (this.transaction instanceof Z) return this.transaction.state === K.Trying || this.transaction.state === K.Proceeding;
		throw Error("Unknown transaction type.");
	}
	get progressable() {
		if (this.transaction instanceof q) return this.transaction.state === K.Proceeding;
		if (this.transaction instanceof Z) return !1;
		throw Error("Unknown transaction type.");
	}
	get redirectable() {
		if (this.transaction instanceof q) return this.transaction.state === K.Proceeding;
		if (this.transaction instanceof Z) return this.transaction.state === K.Trying || this.transaction.state === K.Proceeding;
		throw Error("Unknown transaction type.");
	}
	get rejectable() {
		if (this.transaction instanceof q) return this.transaction.state === K.Proceeding;
		if (this.transaction instanceof Z) return this.transaction.state === K.Trying || this.transaction.state === K.Proceeding;
		throw Error("Unknown transaction type.");
	}
	get tryingable() {
		if (this.transaction instanceof q) return this.transaction.state === K.Proceeding;
		if (this.transaction instanceof Z) return this.transaction.state === K.Trying;
		throw Error("Unknown transaction type.");
	}
	reply(e) {
		!e.toTag && e.statusCode !== 100 && (e.toTag = this.toTag), e.userAgent = e.userAgent || this.core.configuration.userAgentHeaderFieldValue, e.supported = e.supported || this.core.configuration.supportedOptionTagsResponse;
		let t = ln(this.message, e);
		return this.transaction.receiveResponse(e.statusCode, t.message), t;
	}
	init() {
		let e = {
			loggerFactory: this.loggerFactory,
			onStateChange: (e) => {
				e === K.Terminated && (this.core.userAgentServers.delete(n), this.dispose());
			},
			onTransportError: (e) => {
				this.logger.error(e.message), this.delegate && this.delegate.onTransportError ? this.delegate.onTransportError(e) : this.logger.error("User agent server response transport error.");
			}
		}, t = new this.transactionConstructor(this.message, this.core.transport, e);
		this._transaction = t;
		let n = t.id;
		this.core.userAgentServers.set(t.id, this);
	}
}, gn = class extends Q {
	constructor(e, t, n) {
		super(Z, e.userAgentCore, t, n);
	}
}, _n = class extends X {
	constructor(e, t, n) {
		let r = e.createOutgoingRequestMessage(F.INFO, n);
		super(J, e.userAgentCore, r, t);
	}
}, vn = class extends Q {
	constructor(e, t, n) {
		super(Z, e.userAgentCore, t, n);
	}
}, yn = class extends X {
	constructor(e, t, n) {
		super(J, e, t, n);
	}
}, bn = class extends Q {
	constructor(e, t, n) {
		super(Z, e, t, n);
	}
}, xn = class extends X {
	constructor(e, t, n) {
		let r = e.createOutgoingRequestMessage(F.NOTIFY, n);
		super(J, e.userAgentCore, r, t);
	}
};
// node_modules/sip.js/lib/core/user-agents/notify-user-agent-server.js
function Sn(e) {
	return e.userAgentCore !== void 0;
}
var Cn = class extends Q {
	constructor(e, t, n) {
		let r = Sn(e) ? e.userAgentCore : e;
		super(Z, r, t, n);
	}
}, wn = class extends X {
	constructor(e, t, n) {
		let r = e.createOutgoingRequestMessage(F.PRACK, n);
		super(J, e.userAgentCore, r, t), e.signalingStateTransition(r);
	}
}, Tn = class extends Q {
	constructor(e, t, n) {
		super(Z, e.userAgentCore, t, n), e.signalingStateTransition(t), this.dialog = e;
	}
	accept(e = { statusCode: 200 }) {
		return e.body && this.dialog.signalingStateTransition(e.body), super.accept(e);
	}
}, En = class extends X {
	constructor(e, t, n) {
		let r = e.createOutgoingRequestMessage(F.INVITE, n);
		super(Y, e.userAgentCore, r, t), this.delegate = t, e.signalingStateTransition(r), e.reinviteUserAgentClient = this, this.dialog = e;
	}
	receiveResponse(e) {
		if (!this.authenticationGuard(e, this.dialog)) return;
		let t = e.statusCode ? e.statusCode.toString() : "";
		if (!t) throw Error("Response status code undefined.");
		switch (!0) {
			case /^100$/.test(t):
				this.delegate && this.delegate.onTrying && this.delegate.onTrying({ message: e });
				break;
			case /^1[0-9]{2}$/.test(t):
				this.delegate && this.delegate.onProgress && this.delegate.onProgress({
					message: e,
					session: this.dialog,
					prack: (e) => {
						throw Error("Unimplemented.");
					}
				});
				break;
			case /^2[0-9]{2}$/.test(t):
				this.dialog.signalingStateTransition(e), this.delegate && this.delegate.onAccept && this.delegate.onAccept({
					message: e,
					session: this.dialog,
					ack: (e) => this.dialog.ack(e)
				});
				break;
			case /^3[0-9]{2}$/.test(t):
				this.dialog.signalingStateRollback(), this.dialog.reinviteUserAgentClient = void 0, this.delegate && this.delegate.onRedirect && this.delegate.onRedirect({ message: e });
				break;
			case /^[4-6][0-9]{2}$/.test(t):
				this.dialog.signalingStateRollback(), this.dialog.reinviteUserAgentClient = void 0, this.delegate && this.delegate.onReject && this.delegate.onReject({ message: e });
				break;
			default: throw Error(`Invalid status code ${t}`);
		}
	}
}, Dn = class extends Q {
	constructor(e, t, n) {
		super(q, e.userAgentCore, t, n), e.reinviteUserAgentServer = this, this.dialog = e;
	}
	accept(e = { statusCode: 200 }) {
		e.extraHeaders = e.extraHeaders || [], e.extraHeaders = e.extraHeaders.concat(this.dialog.routeSet.map((e) => `Record-Route: ${e}`));
		let t = super.accept(e), n = this.dialog, r = Object.assign(Object.assign({}, t), { session: n });
		return e.body && this.dialog.signalingStateTransition(e.body), this.dialog.reConfirm(), r;
	}
	progress(e = { statusCode: 180 }) {
		let t = super.progress(e), n = this.dialog, r = Object.assign(Object.assign({}, t), { session: n });
		return e.body && this.dialog.signalingStateTransition(e.body), r;
	}
	redirect(e, t = { statusCode: 302 }) {
		throw this.dialog.signalingStateRollback(), this.dialog.reinviteUserAgentServer = void 0, Error("Unimplemented.");
	}
	reject(e = { statusCode: 488 }) {
		return this.dialog.signalingStateRollback(), this.dialog.reinviteUserAgentServer = void 0, super.reject(e);
	}
}, On = class extends X {
	constructor(e, t, n) {
		let r = e.createOutgoingRequestMessage(F.REFER, n);
		super(J, e.userAgentCore, r, t);
	}
};
// node_modules/sip.js/lib/core/user-agents/refer-user-agent-server.js
function kn(e) {
	return e.userAgentCore !== void 0;
}
var An = class extends Q {
	constructor(e, t, n) {
		let r = kn(e) ? e.userAgentCore : e;
		super(Z, r, t, n);
	}
}, jn = class extends mn {
	constructor(e, t, n, r) {
		super(t, n), this.initialTransaction = e, this._signalingState = M.Initial, this.ackWait = !1, this.ackProcessing = !1, this.delegate = r, e instanceof q && (this.ackWait = !0), this.early || this.start2xxRetransmissionTimer(), this.signalingStateTransition(e.request), this.logger = t.loggerFactory.getLogger("sip.invite-dialog"), this.logger.log(`INVITE dialog ${this.id} constructed`);
	}
	dispose() {
		super.dispose(), this._signalingState = M.Closed, this._offer = void 0, this._answer = void 0, this.invite2xxTimer &&= (clearTimeout(this.invite2xxTimer), void 0), this.logger.log(`INVITE dialog ${this.id} destroyed`);
	}
	get sessionState() {
		return this.early ? j.Early : this.ackWait ? j.AckWait : this._signalingState === M.Closed ? j.Terminated : j.Confirmed;
	}
	get signalingState() {
		return this._signalingState;
	}
	get offer() {
		return this._offer;
	}
	get answer() {
		return this._answer;
	}
	confirm() {
		this.early && this.start2xxRetransmissionTimer(), super.confirm();
	}
	reConfirm() {
		this.reinviteUserAgentServer && this.startReInvite2xxRetransmissionTimer();
	}
	ack(e = {}) {
		this.logger.log(`INVITE dialog ${this.id} sending ACK request`);
		let t;
		if (this.reinviteUserAgentClient) {
			if (!(this.reinviteUserAgentClient.transaction instanceof Y)) throw Error("Transaction not instance of InviteClientTransaction.");
			t = this.reinviteUserAgentClient.transaction, this.reinviteUserAgentClient = void 0;
		} else {
			if (!(this.initialTransaction instanceof Y)) throw Error("Initial transaction not instance of InviteClientTransaction.");
			t = this.initialTransaction;
		}
		let n = this.createOutgoingRequestMessage(F.ACK, {
			cseq: t.request.cseq,
			extraHeaders: e.extraHeaders,
			body: e.body
		});
		return t.ackResponse(n), this.signalingStateTransition(n), { message: n };
	}
	bye(e, t) {
		if (this.logger.log(`INVITE dialog ${this.id} sending BYE request`), this.initialTransaction instanceof q) {
			if (this.early) throw Error("UAS MUST NOT send a BYE on early dialogs.");
			if (this.ackWait && this.initialTransaction.state !== K.Terminated) throw Error("UAS MUST NOT send a BYE on a confirmed dialog until it has received an ACK for its 2xx response or until the server transaction times out.");
		}
		return new hn(this, e, t);
	}
	info(e, t) {
		if (this.logger.log(`INVITE dialog ${this.id} sending INFO request`), this.early) throw Error("Dialog not confirmed.");
		return new _n(this, e, t);
	}
	invite(e, t) {
		if (this.logger.log(`INVITE dialog ${this.id} sending INVITE request`), this.early) throw Error("Dialog not confirmed.");
		if (this.reinviteUserAgentClient) throw Error("There is an ongoing re-INVITE client transaction.");
		if (this.reinviteUserAgentServer) throw Error("There is an ongoing re-INVITE server transaction.");
		return new En(this, e, t);
	}
	message(e, t) {
		if (this.logger.log(`INVITE dialog ${this.id} sending MESSAGE request`), this.early) throw Error("Dialog not confirmed.");
		let n = this.createOutgoingRequestMessage(F.MESSAGE, t);
		return new yn(this.core, n, e);
	}
	notify(e, t) {
		if (this.logger.log(`INVITE dialog ${this.id} sending NOTIFY request`), this.early) throw Error("Dialog not confirmed.");
		return new xn(this, e, t);
	}
	prack(e, t) {
		return this.logger.log(`INVITE dialog ${this.id} sending PRACK request`), new wn(this, e, t);
	}
	refer(e, t) {
		if (this.logger.log(`INVITE dialog ${this.id} sending REFER request`), this.early) throw Error("Dialog not confirmed.");
		return new On(this, e, t);
	}
	receiveRequest(e) {
		if (this.logger.log(`INVITE dialog ${this.id} received ${e.method} request`), e.method === F.ACK) {
			if (this.ackWait) {
				if (this.initialTransaction instanceof Y || this.initialTransaction.request.cseq !== e.cseq) {
					this.logger.warn(`INVITE dialog ${this.id} received unexpected ${e.method} request, dropping.`);
					return;
				}
				this.ackWait = !1;
			} else {
				if (!this.reinviteUserAgentServer || this.reinviteUserAgentServer.transaction.request.cseq !== e.cseq) {
					this.logger.warn(`INVITE dialog ${this.id} received unexpected ${e.method} request, dropping.`);
					return;
				}
				this.reinviteUserAgentServer = void 0;
			}
			if (this.signalingStateTransition(e), this.delegate && this.delegate.onAck) {
				let t = this.delegate.onAck({ message: e });
				t instanceof Promise && (this.ackProcessing = !0, t.then(() => this.ackProcessing = !1).catch(() => this.ackProcessing = !1));
			}
		} else if (!this.sequenceGuard(e)) this.logger.log(`INVITE dialog ${this.id} rejected out of order ${e.method} request.`);
		else {
			if (super.receiveRequest(e), e.method === F.INVITE) {
				let t = () => {
					let e = this.ackWait ? "waiting for initial ACK" : "processing initial ACK";
					this.logger.warn(`INVITE dialog ${this.id} received re-INVITE while ${e}`);
					let t = "RFC 5407 suggests the following to avoid this race condition... ";
					t += " Note: Implementation issues are outside the scope of this document,", t += " but the following tip is provided for avoiding race conditions of", t += " this type.  The caller can delay sending re-INVITE F6 for some period", t += " of time (2 seconds, perhaps), after which the caller can reasonably", t += " assume that its ACK has been received.  Implementors can decouple the", t += " actions of the user (e.g., pressing the hold button) from the actions", t += " of the protocol (the sending of re-INVITE F6), so that the UA can", t += " behave like this.  In this case, it is the implementor's choice as to", t += " how long to wait.  In most cases, such an implementation may be", t += " useful to prevent the type of race condition shown in this section.", t += " This document expresses no preference about whether or not they", t += " should wait for an ACK to be delivered.  After considering the impact", t += " on user experience, implementors should decide whether or not to wait", t += " for a while, because the user experience depends on the", t += " implementation and has no direct bearing on protocol behavior.", this.logger.warn(t);
				}, n = [`Retry-After: ${Math.floor(Math.random() * 10) + 1}`];
				if (this.ackProcessing || this.ackWait && this.signalingState !== M.Stable) {
					this.core.replyStateless(e, {
						statusCode: 500,
						extraHeaders: n
					}), t();
					return;
				}
				if (this.reinviteUserAgentServer) {
					this.core.replyStateless(e, {
						statusCode: 500,
						extraHeaders: n
					});
					return;
				}
				if (this.reinviteUserAgentClient) {
					this.core.replyStateless(e, { statusCode: 491 });
					return;
				}
			}
			if (e.method === F.INVITE) {
				let t = e.parseHeader("contact");
				if (!t) throw Error("Contact undefined.");
				if (!(t instanceof E)) throw Error("Contact not instance of NameAddrHeader.");
				this.dialogState.remoteTarget = t.uri;
			}
			switch (e.method) {
				case F.BYE:
					{
						let t = new gn(this, e);
						this.delegate && this.delegate.onBye ? this.delegate.onBye(t) : t.accept(), this.dispose();
					}
					break;
				case F.INFO:
					{
						let t = new vn(this, e);
						this.delegate && this.delegate.onInfo ? this.delegate.onInfo(t) : t.reject({
							statusCode: 469,
							extraHeaders: ["Recv-Info:"]
						});
					}
					break;
				case F.INVITE:
					{
						let t = new Dn(this, e);
						this.signalingStateTransition(e), this.delegate && this.delegate.onInvite ? this.delegate.onInvite(t) : t.reject({ statusCode: 488 });
					}
					break;
				case F.MESSAGE:
					{
						let t = new bn(this.core, e);
						this.delegate && this.delegate.onMessage ? this.delegate.onMessage(t) : t.accept();
					}
					break;
				case F.NOTIFY:
					{
						let t = new Cn(this, e);
						this.delegate && this.delegate.onNotify ? this.delegate.onNotify(t) : t.accept();
					}
					break;
				case F.PRACK:
					{
						let t = new Tn(this, e);
						this.delegate && this.delegate.onPrack ? this.delegate.onPrack(t) : t.accept();
					}
					break;
				case F.REFER:
					{
						let t = new An(this, e);
						this.delegate && this.delegate.onRefer ? this.delegate.onRefer(t) : t.reject();
					}
					break;
				default: this.logger.log(`INVITE dialog ${this.id} received unimplemented ${e.method} request`), this.core.replyStateless(e, { statusCode: 501 });
			}
		}
	}
	reliableSequenceGuard(e) {
		let t = e.statusCode;
		if (!t) throw Error("Status code undefined");
		if (t > 100 && t < 200) {
			let t = e.getHeader("require"), n = e.getHeader("rseq"), r = t && t.includes("100rel") && n ? Number(n) : void 0;
			if (r) {
				if (this.rseq && this.rseq + 1 !== r) return !1;
				this.rseq = this.rseq ? this.rseq + 1 : r;
			}
		}
		return !0;
	}
	signalingStateRollback() {
		(this._signalingState === M.HaveLocalOffer || this.signalingState === M.HaveRemoteOffer) && this._rollbackOffer && this._rollbackAnswer && (this._signalingState = M.Stable, this._offer = this._rollbackOffer, this._answer = this._rollbackAnswer);
	}
	signalingStateTransition(e) {
		let t = Jt(e);
		if (t && t.contentDisposition === "session") {
			if (this._signalingState === M.Stable && (this._rollbackOffer = this._offer, this._rollbackAnswer = this._answer), e instanceof Ut) switch (this._signalingState) {
				case M.Initial:
				case M.Stable:
					this._signalingState = M.HaveRemoteOffer, this._offer = t, this._answer = void 0;
					break;
				case M.HaveLocalOffer:
					this._signalingState = M.Stable, this._answer = t;
					break;
				case M.HaveRemoteOffer: break;
				case M.Closed: break;
				default: throw Error("Unexpected signaling state.");
			}
			if (e instanceof A) switch (this._signalingState) {
				case M.Initial:
				case M.Stable:
					this._signalingState = M.HaveRemoteOffer, this._offer = t, this._answer = void 0;
					break;
				case M.HaveLocalOffer:
					this._signalingState = M.Stable, this._answer = t;
					break;
				case M.HaveRemoteOffer: break;
				case M.Closed: break;
				default: throw Error("Unexpected signaling state.");
			}
			if (e instanceof Wt) switch (this._signalingState) {
				case M.Initial:
				case M.Stable:
					this._signalingState = M.HaveLocalOffer, this._offer = t, this._answer = void 0;
					break;
				case M.HaveLocalOffer: break;
				case M.HaveRemoteOffer:
					this._signalingState = M.Stable, this._answer = t;
					break;
				case M.Closed: break;
				default: throw Error("Unexpected signaling state.");
			}
			if (qt(e)) switch (this._signalingState) {
				case M.Initial:
				case M.Stable:
					this._signalingState = M.HaveLocalOffer, this._offer = t, this._answer = void 0;
					break;
				case M.HaveLocalOffer: break;
				case M.HaveRemoteOffer:
					this._signalingState = M.Stable, this._answer = t;
					break;
				case M.Closed: break;
				default: throw Error("Unexpected signaling state.");
			}
		}
	}
	start2xxRetransmissionTimer() {
		if (this.initialTransaction instanceof q) {
			let e = this.initialTransaction, t = N.T1, n = () => {
				this.ackWait ? (this.logger.log("No ACK for 2xx response received, attempting retransmission"), e.retransmitAcceptedResponse(), t = Math.min(t * 2, N.T2), this.invite2xxTimer = setTimeout(n, t)) : this.invite2xxTimer = void 0;
			};
			this.invite2xxTimer = setTimeout(n, t);
			let r = () => {
				e.state === K.Terminated && (e.removeStateChangeListener(r), this.invite2xxTimer &&= (clearTimeout(this.invite2xxTimer), void 0), this.ackWait && (this.delegate && this.delegate.onAckTimeout ? this.delegate.onAckTimeout() : this.bye()));
			};
			e.addStateChangeListener(r);
		}
	}
	startReInvite2xxRetransmissionTimer() {
		if (this.reinviteUserAgentServer && this.reinviteUserAgentServer.transaction instanceof q) {
			let e = this.reinviteUserAgentServer.transaction, t = N.T1, n = () => {
				this.reinviteUserAgentServer ? (this.logger.log("No ACK for 2xx response received, attempting retransmission"), e.retransmitAcceptedResponse(), t = Math.min(t * 2, N.T2), this.invite2xxTimer = setTimeout(n, t)) : this.invite2xxTimer = void 0;
			};
			this.invite2xxTimer = setTimeout(n, t);
			let r = () => {
				e.state === K.Terminated && (e.removeStateChangeListener(r), this.invite2xxTimer &&= (clearTimeout(this.invite2xxTimer), void 0), this.reinviteUserAgentServer);
			};
			e.addStateChangeListener(r);
		}
	}
}, Mn = class extends X {
	constructor(e, t, n) {
		super(Y, e, t, n), this.confirmedDialogAcks = /* @__PURE__ */ new Map(), this.confirmedDialogs = /* @__PURE__ */ new Map(), this.earlyDialogs = /* @__PURE__ */ new Map(), this.delegate = n;
	}
	dispose() {
		this.earlyDialogs.forEach((e) => e.dispose()), this.earlyDialogs.clear(), super.dispose();
	}
	onTransportError(e) {
		if (this.transaction.state === K.Calling) return super.onTransportError(e);
		this.logger.error(e.message), this.logger.error("User agent client request transport error while sending ACK.");
	}
	receiveResponse(e) {
		if (!this.authenticationGuard(e)) return;
		let t = e.statusCode ? e.statusCode.toString() : "";
		if (!t) throw Error("Response status code undefined.");
		switch (!0) {
			case /^100$/.test(t):
				this.delegate && this.delegate.onTrying && this.delegate.onTrying({ message: e });
				return;
			case /^1[0-9]{2}$/.test(t):
				{
					if (!e.toTag) {
						this.logger.warn("Non-100 1xx INVITE response received without a to tag, dropping.");
						return;
					}
					if (!e.parseHeader("contact")) {
						this.logger.error("Non-100 1xx INVITE response received without a Contact header field, dropping.");
						return;
					}
					let t = mn.initialDialogStateForUserAgentClient(this.message, e), n = this.earlyDialogs.get(t.id);
					if (!n) {
						let e = this.transaction;
						if (!(e instanceof Y)) throw Error("Transaction not instance of InviteClientTransaction.");
						n = new jn(e, this.core, t), this.earlyDialogs.set(n.id, n);
					}
					if (!n.reliableSequenceGuard(e)) {
						this.logger.warn("1xx INVITE reliable response received out of order or is a retransmission, dropping.");
						return;
					}
					(n.signalingState === M.Initial || n.signalingState === M.HaveLocalOffer) && n.signalingStateTransition(e);
					let r = n;
					this.delegate && this.delegate.onProgress && this.delegate.onProgress({
						message: e,
						session: r,
						prack: (e) => r.prack(void 0, e)
					});
				}
				return;
			case /^2[0-9]{2}$/.test(t):
				{
					if (!e.toTag) {
						this.logger.error("2xx INVITE response received without a to tag, dropping.");
						return;
					}
					if (!e.parseHeader("contact")) {
						this.logger.error("2xx INVITE response received without a Contact header field, dropping.");
						return;
					}
					let t = mn.initialDialogStateForUserAgentClient(this.message, e), n = this.confirmedDialogs.get(t.id);
					if (n) {
						let e = this.confirmedDialogAcks.get(t.id);
						if (e) {
							let t = this.transaction;
							if (!(t instanceof Y)) throw Error("Client transaction not instance of InviteClientTransaction.");
							t.ackResponse(e.message);
						}
						return;
					}
					if (n = this.earlyDialogs.get(t.id), n) n.confirm(), n.recomputeRouteSet(e), this.earlyDialogs.delete(n.id), this.confirmedDialogs.set(n.id, n);
					else {
						let e = this.transaction;
						if (!(e instanceof Y)) throw Error("Transaction not instance of InviteClientTransaction.");
						n = new jn(e, this.core, t), this.confirmedDialogs.set(n.id, n);
					}
					(n.signalingState === M.Initial || n.signalingState === M.HaveLocalOffer) && n.signalingStateTransition(e);
					let r = n;
					if (this.delegate && this.delegate.onAccept) this.delegate.onAccept({
						message: e,
						session: r,
						ack: (e) => {
							let t = r.ack(e);
							return this.confirmedDialogAcks.set(r.id, t), t;
						}
					});
					else {
						let e = r.ack();
						this.confirmedDialogAcks.set(r.id, e);
					}
				}
				return;
			case /^3[0-9]{2}$/.test(t):
				this.earlyDialogs.forEach((e) => e.dispose()), this.earlyDialogs.clear(), this.delegate && this.delegate.onRedirect && this.delegate.onRedirect({ message: e });
				return;
			case /^[4-6][0-9]{2}$/.test(t):
				this.earlyDialogs.forEach((e) => e.dispose()), this.earlyDialogs.clear(), this.delegate && this.delegate.onReject && this.delegate.onReject({ message: e });
				return;
			default: throw Error(`Invalid status code ${t}`);
		}
		throw Error(`Executing what should be an unreachable code path receiving ${t} response.`);
	}
}, Nn = class extends Q {
	constructor(e, t, n) {
		super(q, e, t, n), this.core = e;
	}
	dispose() {
		this.earlyDialog && this.earlyDialog.dispose(), super.dispose();
	}
	accept(e = { statusCode: 200 }) {
		if (!this.acceptable) throw new P(`${this.message.method} not acceptable in state ${this.transaction.state}.`);
		if (!this.confirmedDialog) {
			if (this.earlyDialog) this.earlyDialog.confirm(), this.confirmedDialog = this.earlyDialog, this.earlyDialog = void 0;
			else {
				let e = this.transaction;
				if (!(e instanceof q)) throw Error("Transaction not instance of InviteClientTransaction.");
				let t = mn.initialDialogStateForUserAgentServer(this.message, this.toTag);
				this.confirmedDialog = new jn(e, this.core, t);
			}
		}
		let t = this.message.getHeaders("record-route").map((e) => `Record-Route: ${e}`), n = `Contact: ${this.core.configuration.contact.toString()}`, r = "Allow: " + I.toString();
		if (!e.body) {
			if (this.confirmedDialog.signalingState === M.Stable) e.body = this.confirmedDialog.answer;
			else if (this.confirmedDialog.signalingState === M.Initial || this.confirmedDialog.signalingState === M.HaveRemoteOffer) throw Error("Response must have a body.");
		}
		e.statusCode = e.statusCode || 200, e.extraHeaders = e.extraHeaders || [], e.extraHeaders = e.extraHeaders.concat(t), e.extraHeaders.push(r), e.extraHeaders.push(n);
		let i = super.accept(e), a = this.confirmedDialog, o = Object.assign(Object.assign({}, i), { session: a });
		return e.body && this.confirmedDialog.signalingState !== M.Stable && this.confirmedDialog.signalingStateTransition(e.body), o;
	}
	progress(e = { statusCode: 180 }) {
		if (!this.progressable) throw new P(`${this.message.method} not progressable in state ${this.transaction.state}.`);
		if (!this.earlyDialog) {
			let e = this.transaction;
			if (!(e instanceof q)) throw Error("Transaction not instance of InviteClientTransaction.");
			let t = mn.initialDialogStateForUserAgentServer(this.message, this.toTag, !0);
			this.earlyDialog = new jn(e, this.core, t);
		}
		let t = this.message.getHeaders("record-route").map((e) => `Record-Route: ${e}`), n = `Contact: ${this.core.configuration.contact}`;
		e.extraHeaders = e.extraHeaders || [], e.extraHeaders = e.extraHeaders.concat(t), e.extraHeaders.push(n);
		let r = super.progress(e), i = this.earlyDialog, a = Object.assign(Object.assign({}, r), { session: i });
		return e.body && this.earlyDialog.signalingState !== M.Stable && this.earlyDialog.signalingStateTransition(e.body), a;
	}
	redirect(e, t = { statusCode: 302 }) {
		return super.redirect(e, t);
	}
	reject(e = { statusCode: 486 }) {
		return super.reject(e);
	}
}, Pn = class extends X {
	constructor(e, t, n) {
		super(J, e, t, n);
	}
}, Fn = class extends X {
	constructor(e, t, n) {
		super(J, e, t, n);
	}
}, In = class extends Q {
	constructor(e, t, n) {
		super(Z, e, t, n), this.core = e;
	}
}, Ln = class extends X {
	constructor(e, t, n) {
		let r = e.createOutgoingRequestMessage(F.SUBSCRIBE, n);
		super(J, e.userAgentCore, r, t), this.dialog = e;
	}
	waitNotifyStop() {}
	receiveResponse(e) {
		if (e.statusCode && e.statusCode >= 200 && e.statusCode < 300) {
			let t = e.getHeader("Expires");
			if (!t) this.logger.warn("Expires header missing in a 200-class response to SUBSCRIBE");
			else {
				let e = Number(t);
				this.dialog.subscriptionExpires > e && (this.dialog.subscriptionExpires = e);
			}
		}
		e.statusCode && e.statusCode >= 400 && e.statusCode < 700 && [
			404,
			405,
			410,
			416,
			480,
			481,
			482,
			483,
			484,
			485,
			489,
			501,
			604
		].includes(e.statusCode) && this.dialog.terminate(), super.receiveResponse(e);
	}
}, Rn = class extends mn {
	constructor(e, t, n, r, i, a) {
		super(r, i), this.delegate = a, this._autoRefresh = !1, this._subscriptionEvent = e, this._subscriptionExpires = t, this._subscriptionExpiresInitial = t, this._subscriptionExpiresLastSet = Math.floor(Date.now() / 1e3), this._subscriptionRefresh = void 0, this._subscriptionRefreshLastSet = void 0, this._subscriptionState = n, this.logger = r.loggerFactory.getLogger("sip.subscribe-dialog"), this.logger.log(`SUBSCRIBE dialog ${this.id} constructed`);
	}
	static initialDialogStateForSubscription(e, t) {
		let n = t.getHeaders("record-route"), r = t.parseHeader("contact");
		if (!r) throw Error("Contact undefined.");
		if (!(r instanceof E)) throw Error("Contact not instance of NameAddrHeader.");
		let i = r.uri, a = e.cseq, o = e.callId, s = e.fromTag, c = t.fromTag;
		if (!o) throw Error("Call id undefined.");
		if (!s) throw Error("From tag undefined.");
		if (!c) throw Error("To tag undefined.");
		if (!e.from) throw Error("From undefined.");
		if (!e.to) throw Error("To undefined.");
		let l = e.from.uri, u = e.to.uri;
		return {
			id: o + s + c,
			early: !1,
			callId: o,
			localTag: s,
			remoteTag: c,
			localSequenceNumber: a,
			remoteSequenceNumber: void 0,
			localURI: l,
			remoteURI: u,
			remoteTarget: i,
			routeSet: n,
			secure: !1
		};
	}
	dispose() {
		super.dispose(), this.N &&= (clearTimeout(this.N), void 0), this.refreshTimerClear(), this.logger.log(`SUBSCRIBE dialog ${this.id} destroyed`);
	}
	get autoRefresh() {
		return this._autoRefresh;
	}
	set autoRefresh(e) {
		this._autoRefresh = !0, this.refreshTimerSet();
	}
	get subscriptionEvent() {
		return this._subscriptionEvent;
	}
	get subscriptionExpires() {
		let e = Math.floor(Date.now() / 1e3) - this._subscriptionExpiresLastSet, t = this._subscriptionExpires - e;
		return Math.max(t, 0);
	}
	set subscriptionExpires(e) {
		if (e < 0) throw Error("Expires must be greater than or equal to zero.");
		if (this._subscriptionExpires = e, this._subscriptionExpiresLastSet = Math.floor(Date.now() / 1e3), this.autoRefresh) {
			let t = this.subscriptionRefresh;
			(t === void 0 || t >= e) && this.refreshTimerSet();
		}
	}
	get subscriptionExpiresInitial() {
		return this._subscriptionExpiresInitial;
	}
	get subscriptionRefresh() {
		if (this._subscriptionRefresh === void 0 || this._subscriptionRefreshLastSet === void 0) return;
		let e = Math.floor(Date.now() / 1e3) - this._subscriptionRefreshLastSet, t = this._subscriptionRefresh - e;
		return Math.max(t, 0);
	}
	get subscriptionState() {
		return this._subscriptionState;
	}
	receiveRequest(e) {
		if (this.logger.log(`SUBSCRIBE dialog ${this.id} received ${e.method} request`), !this.sequenceGuard(e)) this.logger.log(`SUBSCRIBE dialog ${this.id} rejected out of order ${e.method} request.`);
		else switch (super.receiveRequest(e), e.method) {
			case F.NOTIFY:
				this.onNotify(e);
				break;
			default: this.logger.log(`SUBSCRIBE dialog ${this.id} received unimplemented ${e.method} request`), this.core.replyStateless(e, { statusCode: 501 });
		}
	}
	refresh() {
		let e = "Allow: " + I.toString(), t = {};
		return t.extraHeaders = (t.extraHeaders || []).slice(), t.extraHeaders.push(e), t.extraHeaders.push("Event: " + this.subscriptionEvent), t.extraHeaders.push("Expires: " + this.subscriptionExpiresInitial), t.extraHeaders.push("Contact: " + this.core.configuration.contact.toString()), this.subscribe(void 0, t);
	}
	subscribe(e, t = {}) {
		if (this.subscriptionState !== B.Pending && this.subscriptionState !== B.Active) throw Error(`Invalid state ${this.subscriptionState}. May only re-subscribe while in state "pending" or "active".`);
		this.logger.log(`SUBSCRIBE dialog ${this.id} sending SUBSCRIBE request`);
		let n = new Ln(this, e, t);
		return this.N &&= (clearTimeout(this.N), void 0), t.extraHeaders?.includes("Expires: 0") || (this.N = setTimeout(() => this.timerN(), N.TIMER_N)), n;
	}
	terminate() {
		this.stateTransition(B.Terminated), this.onTerminated();
	}
	unsubscribe() {
		let e = "Allow: " + I.toString(), t = {};
		return t.extraHeaders = (t.extraHeaders || []).slice(), t.extraHeaders.push(e), t.extraHeaders.push("Event: " + this.subscriptionEvent), t.extraHeaders.push("Expires: 0"), t.extraHeaders.push("Contact: " + this.core.configuration.contact.toString()), this.subscribe(void 0, t);
	}
	onNotify(e) {
		let t = e.parseHeader("Event").event;
		if (!t || t !== this.subscriptionEvent) {
			this.core.replyStateless(e, { statusCode: 489 });
			return;
		}
		this.N &&= (clearTimeout(this.N), void 0);
		let n = e.parseHeader("Subscription-State");
		if (!n || !n.state) {
			this.core.replyStateless(e, { statusCode: 489 });
			return;
		}
		let r = n.state, i = n.expires ? Math.max(n.expires, 0) : void 0;
		switch (r) {
			case "pending":
				this.stateTransition(B.Pending, i);
				break;
			case "active":
				this.stateTransition(B.Active, i);
				break;
			case "terminated":
				this.stateTransition(B.Terminated, i);
				break;
			default: this.logger.warn("Unrecognized subscription state.");
		}
		let a = new Cn(this, e);
		this.delegate && this.delegate.onNotify ? this.delegate.onNotify(a) : a.accept();
	}
	onRefresh(e) {
		this.delegate && this.delegate.onRefresh && this.delegate.onRefresh(e);
	}
	onTerminated() {
		this.delegate && this.delegate.onTerminated && this.delegate.onTerminated();
	}
	refreshTimerClear() {
		this.refreshTimer &&= (clearTimeout(this.refreshTimer), void 0);
	}
	refreshTimerSet() {
		if (this.refreshTimerClear(), this.autoRefresh && this.subscriptionExpires > 0) {
			let e = this.subscriptionExpires * 900;
			this._subscriptionRefresh = Math.floor(e / 1e3), this._subscriptionRefreshLastSet = Math.floor(Date.now() / 1e3), this.refreshTimer = setTimeout(() => {
				this.refreshTimer = void 0, this._subscriptionRefresh = void 0, this._subscriptionRefreshLastSet = void 0, this.onRefresh(this.refresh());
			}, e);
		}
	}
	stateTransition(e, t) {
		let n = () => {
			this.logger.warn(`Invalid subscription state transition from ${this.subscriptionState} to ${e}`);
		};
		switch (e) {
			case B.Initial:
				n();
				return;
			case B.NotifyWait:
				n();
				return;
			case B.Pending:
				if (this.subscriptionState !== B.NotifyWait && this.subscriptionState !== B.Pending) {
					n();
					return;
				}
				break;
			case B.Active:
				if (this.subscriptionState !== B.NotifyWait && this.subscriptionState !== B.Pending && this.subscriptionState !== B.Active) {
					n();
					return;
				}
				break;
			case B.Terminated:
				if (this.subscriptionState !== B.NotifyWait && this.subscriptionState !== B.Pending && this.subscriptionState !== B.Active) {
					n();
					return;
				}
				break;
			default:
				n();
				return;
		}
		e === B.Pending && t && (this.subscriptionExpires = t), e === B.Active && t && (this.subscriptionExpires = t), e === B.Terminated && this.dispose(), this._subscriptionState = e;
	}
	timerN() {
		this.logger.warn("Timer N expired for SUBSCRIBE dialog. Timed out waiting for NOTIFY."), this.subscriptionState !== B.Terminated && (this.stateTransition(B.Terminated), this.onTerminated());
	}
}, zn = class extends X {
	constructor(e, t, n) {
		let r = t.getHeader("Event");
		if (!r) throw Error("Event undefined");
		let i = t.getHeader("Expires");
		if (!i) throw Error("Expires undefined");
		super(J, e, t, n), this.delegate = n, this.subscriberId = t.callId + t.fromTag + r, this.subscriptionExpiresRequested = this.subscriptionExpires = Number(i), this.subscriptionEvent = r, this.subscriptionState = B.NotifyWait, this.waitNotifyStart();
	}
	dispose() {
		super.dispose();
	}
	onNotify(e) {
		let t = e.message.parseHeader("Event").event;
		if (!t || t !== this.subscriptionEvent) {
			this.logger.warn("Failed to parse event."), e.reject({ statusCode: 489 });
			return;
		}
		let n = e.message.parseHeader("Subscription-State");
		if (!n || !n.state) {
			this.logger.warn("Failed to parse subscription state."), e.reject({ statusCode: 489 });
			return;
		}
		let r = n.state;
		switch (r) {
			case "pending": break;
			case "active": break;
			case "terminated": break;
			default:
				this.logger.warn(`Invalid subscription state ${r}`), e.reject({ statusCode: 489 });
				return;
		}
		if (r !== "terminated" && !e.message.parseHeader("contact")) this.logger.warn("Failed to parse contact."), e.reject({ statusCode: 489 });
		else {
			if (this.dialog) throw Error("Dialog already created. This implementation only supports install of single subscriptions.");
			switch (this.waitNotifyStop(), this.subscriptionExpires = n.expires ? Math.min(this.subscriptionExpires, Math.max(n.expires, 0)) : this.subscriptionExpires, r) {
				case "pending":
					this.subscriptionState = B.Pending;
					break;
				case "active":
					this.subscriptionState = B.Active;
					break;
				case "terminated":
					this.subscriptionState = B.Terminated;
					break;
				default: throw Error(`Unrecognized state ${r}.`);
			}
			if (this.subscriptionState !== B.Terminated) {
				let t = Rn.initialDialogStateForSubscription(this.message, e.message);
				this.dialog = new Rn(this.subscriptionEvent, this.subscriptionExpires, this.subscriptionState, this.core, t);
			}
			if (this.delegate && this.delegate.onNotify) {
				let t = e, n = this.dialog;
				this.delegate.onNotify({
					request: t,
					subscription: n
				});
			} else e.accept();
		}
	}
	waitNotifyStart() {
		this.N ||= (this.core.subscribers.set(this.subscriberId, this), setTimeout(() => this.timerN(), N.TIMER_N));
	}
	waitNotifyStop() {
		this.N &&= (this.core.subscribers.delete(this.subscriberId), clearTimeout(this.N), void 0);
	}
	receiveResponse(e) {
		if (this.authenticationGuard(e)) {
			if (e.statusCode && e.statusCode >= 200 && e.statusCode < 300) {
				let t = e.getHeader("Expires");
				if (!t) this.logger.warn("Expires header missing in a 200-class response to SUBSCRIBE");
				else {
					let e = Number(t);
					e > this.subscriptionExpiresRequested && this.logger.warn("Expires header in a 200-class response to SUBSCRIBE with a higher value than the one in the request"), e < this.subscriptionExpires && (this.subscriptionExpires = e);
				}
				this.dialog && this.dialog.subscriptionExpires > this.subscriptionExpires && (this.dialog.subscriptionExpires = this.subscriptionExpires);
			}
			e.statusCode && e.statusCode >= 300 && e.statusCode < 700 && this.waitNotifyStop(), super.receiveResponse(e);
		}
	}
	timerN() {
		this.logger.warn("Timer N expired for SUBSCRIBE user agent client. Timed out waiting for NOTIFY."), this.waitNotifyStop(), this.delegate && this.delegate.onNotifyTimeout && this.delegate.onNotifyTimeout();
	}
}, Bn = class extends Q {
	constructor(e, t, n) {
		super(Z, e, t, n), this.core = e;
	}
}, Vn = ["application/sdp", "application/dtmf-relay"], Hn = class {
	constructor(e, t = {}) {
		this.userAgentClients = /* @__PURE__ */ new Map(), this.userAgentServers = /* @__PURE__ */ new Map(), this.configuration = e, this.delegate = t, this.dialogs = /* @__PURE__ */ new Map(), this.subscribers = /* @__PURE__ */ new Map(), this.logger = e.loggerFactory.getLogger("sip.user-agent-core");
	}
	dispose() {
		this.reset();
	}
	reset() {
		this.dialogs.forEach((e) => e.dispose()), this.dialogs.clear(), this.subscribers.forEach((e) => e.dispose()), this.subscribers.clear(), this.userAgentClients.forEach((e) => e.dispose()), this.userAgentClients.clear(), this.userAgentServers.forEach((e) => e.dispose()), this.userAgentServers.clear();
	}
	get loggerFactory() {
		return this.configuration.loggerFactory;
	}
	get transport() {
		let e = this.configuration.transportAccessor();
		if (!e) throw Error("Transport undefined.");
		return e;
	}
	invite(e, t) {
		return new Mn(this, e, t);
	}
	message(e, t) {
		return new yn(this, e, t);
	}
	publish(e, t) {
		return new Pn(this, e, t);
	}
	register(e, t) {
		return new Fn(this, e, t);
	}
	subscribe(e, t) {
		return new zn(this, e, t);
	}
	request(e, t) {
		return new X(J, this, e, t);
	}
	makeOutgoingRequestMessage(e, t, n, r, i, a, o) {
		let s = this.configuration.sipjsId, c = this.configuration.displayName, l = this.configuration.viaForceRport, u = this.configuration.hackViaTcp, d = this.configuration.supportedOptionTags.slice();
		e === F.REGISTER && d.push("path", "gruu"), e === F.INVITE && (this.configuration.contact.pubGruu || this.configuration.contact.tempGruu) && d.push("gruu");
		let f = {
			callIdPrefix: s,
			forceRport: l,
			fromDisplayName: c,
			hackViaTcp: u,
			optionTags: d,
			routeSet: this.configuration.routeSet,
			userAgentString: this.configuration.userAgentHeaderFieldValue,
			viaHost: this.configuration.viaHost
		};
		return new Wt(e, t, n, r, Object.assign(Object.assign({}, f), i), a, o);
	}
	receiveIncomingRequestFromTransport(e) {
		this.receiveRequestFromTransport(e);
	}
	receiveIncomingResponseFromTransport(e) {
		this.receiveResponseFromTransport(e);
	}
	replyStateless(e, t) {
		let n = this.configuration.userAgentHeaderFieldValue, r = this.configuration.supportedOptionTagsResponse;
		t = Object.assign(Object.assign({}, t), {
			userAgent: n,
			supported: r
		});
		let i = ln(e, t);
		return this.transport.send(i.message).catch((t) => {
			t instanceof Error && this.logger.error(t.message), this.logger.error(`Transport error occurred sending stateless reply to ${e.method} request.`);
		}), i;
	}
	receiveRequestFromTransport(e) {
		let t = e.viaBranch, n = this.userAgentServers.get(t);
		e.method === F.ACK && n && n.transaction.state === K.Accepted && n instanceof Nn ? this.logger.warn(`Discarding out of dialog ACK after 2xx response sent on transaction ${t}.`) : e.method === F.CANCEL ? n ? (this.replyStateless(e, { statusCode: 200 }), n.transaction instanceof q && n.transaction.state === K.Proceeding && n instanceof Nn && n.receiveCancel(e)) : this.replyStateless(e, { statusCode: 481 }) : n ? n.transaction.receiveRequest(e) : this.receiveRequest(e);
	}
	receiveRequest(e) {
		if (!I.includes(e.method)) {
			let t = "Allow: " + I.toString();
			this.replyStateless(e, {
				statusCode: 405,
				extraHeaders: [t]
			});
			return;
		}
		if (!e.ruri) throw Error("Request-URI undefined.");
		if (e.ruri.scheme !== "sip") {
			this.replyStateless(e, { statusCode: 416 });
			return;
		}
		let t = e.ruri, n = (e) => !!e && e.user === t.user;
		if (!n(this.configuration.aor) && !(n(this.configuration.contact.uri) || n(this.configuration.contact.pubGruu) || n(this.configuration.contact.tempGruu))) this.logger.warn("Request-URI does not point to us."), e.method !== F.ACK && this.replyStateless(e, { statusCode: 404 });
		else if (e.method === F.INVITE && !e.hasHeader("Contact")) this.replyStateless(e, {
			statusCode: 400,
			reasonPhrase: "Missing Contact Header"
		});
		else {
			if (!e.toTag) {
				let t = e.viaBranch;
				if (!this.userAgentServers.has(t) && Array.from(this.userAgentServers.values()).some((t) => t.transaction.request.fromTag === e.fromTag && t.transaction.request.callId === e.callId && t.transaction.request.cseq === e.cseq)) {
					this.replyStateless(e, { statusCode: 482 });
					return;
				}
			}
			e.toTag ? this.receiveInsideDialogRequest(e) : this.receiveOutsideDialogRequest(e);
		}
	}
	receiveInsideDialogRequest(e) {
		if (e.method === F.NOTIFY) {
			let t = e.parseHeader("Event");
			if (!t || !t.event) {
				this.replyStateless(e, { statusCode: 489 });
				return;
			}
			let n = e.callId + e.toTag + t.event, r = this.subscribers.get(n);
			if (r) {
				let t = new Cn(this, e);
				r.onNotify(t);
				return;
			}
		}
		let t = e.callId + e.toTag + e.fromTag, n = this.dialogs.get(t);
		if (n) {
			if (e.method === F.OPTIONS) {
				let t = "Allow: " + I.toString(), n = "Accept: " + Vn.toString();
				this.replyStateless(e, {
					statusCode: 200,
					extraHeaders: [t, n]
				});
				return;
			}
			n.receiveRequest(e);
		} else e.method !== F.ACK && this.replyStateless(e, { statusCode: 481 });
	}
	receiveOutsideDialogRequest(e) {
		switch (e.method) {
			case F.ACK: break;
			case F.BYE:
				this.replyStateless(e, { statusCode: 481 });
				break;
			case F.CANCEL: throw Error(`Unexpected out of dialog request method ${e.method}.`);
			case F.INFO:
				this.replyStateless(e, { statusCode: 405 });
				break;
			case F.INVITE:
				{
					let t = new Nn(this, e);
					this.delegate.onInvite ? this.delegate.onInvite(t) : t.reject();
				}
				break;
			case F.MESSAGE:
				{
					let t = new bn(this, e);
					this.delegate.onMessage ? this.delegate.onMessage(t) : t.accept();
				}
				break;
			case F.NOTIFY:
				{
					let t = new Cn(this, e);
					this.delegate.onNotify ? this.delegate.onNotify(t) : t.reject({ statusCode: 405 });
				}
				break;
			case F.OPTIONS:
				{
					let t = "Allow: " + I.toString(), n = "Accept: " + Vn.toString();
					this.replyStateless(e, {
						statusCode: 200,
						extraHeaders: [t, n]
					});
				}
				break;
			case F.REFER:
				{
					let t = new An(this, e);
					this.delegate.onRefer ? this.delegate.onRefer(t) : t.reject({ statusCode: 405 });
				}
				break;
			case F.REGISTER:
				{
					let t = new In(this, e);
					this.delegate.onRegister ? this.delegate.onRegister(t) : t.reject({ statusCode: 405 });
				}
				break;
			case F.SUBSCRIBE:
				{
					let t = new Bn(this, e);
					this.delegate.onSubscribe ? this.delegate.onSubscribe(t) : t.reject({ statusCode: 480 });
				}
				break;
			default: throw Error(`Unexpected out of dialog request method ${e.method}.`);
		}
	}
	receiveResponseFromTransport(e) {
		if (e.getHeaders("via").length > 1) {
			this.logger.warn("More than one Via header field present in the response, dropping");
			return;
		}
		let t = e.viaBranch + e.method, n = this.userAgentClients.get(t);
		n ? n.transaction.receiveResponse(e) : this.logger.warn(`Discarding unmatched ${e.statusCode} response to ${e.method} ${t}.`);
	}
};
// node_modules/sip.js/lib/platform/web/session-description-handler/media-stream-factory-default.js
function Un() {
	return (e) => !e.audio && !e.video ? Promise.resolve(new MediaStream()) : navigator.mediaDevices === void 0 ? Promise.reject(/* @__PURE__ */ Error("Media devices not available in insecure contexts.")) : navigator.mediaDevices.getUserMedia.call(navigator.mediaDevices, e);
}
// node_modules/sip.js/lib/platform/web/session-description-handler/peer-connection-configuration-default.js
function Wn() {
	return {
		bundlePolicy: "balanced",
		certificates: void 0,
		iceCandidatePoolSize: 0,
		iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
		iceTransportPolicy: "all",
		rtcpMuxPolicy: "require"
	};
}
// node_modules/sip.js/lib/platform/web/session-description-handler/session-description-handler.js
var Gn = class e {
	constructor(e, t, n) {
		e.debug("SessionDescriptionHandler.constructor"), this.logger = e, this.mediaStreamFactory = t, this.sessionDescriptionHandlerConfiguration = n, this._localMediaStream = new MediaStream(), this._remoteMediaStream = new MediaStream(), this._peerConnection = new RTCPeerConnection(n?.peerConnectionConfiguration), this.initPeerConnectionEventHandlers();
	}
	get localMediaStream() {
		return this._localMediaStream;
	}
	get remoteMediaStream() {
		return this._remoteMediaStream;
	}
	get dataChannel() {
		return this._dataChannel;
	}
	get peerConnection() {
		return this._peerConnection;
	}
	get peerConnectionDelegate() {
		return this._peerConnectionDelegate;
	}
	set peerConnectionDelegate(e) {
		this._peerConnectionDelegate = e;
	}
	static dispatchAddTrackEvent(e, t) {
		e.dispatchEvent(new MediaStreamTrackEvent("addtrack", { track: t }));
	}
	static dispatchRemoveTrackEvent(e, t) {
		e.dispatchEvent(new MediaStreamTrackEvent("removetrack", { track: t }));
	}
	close() {
		this.logger.debug("SessionDescriptionHandler.close"), this._peerConnection !== void 0 && (this._peerConnection.getReceivers().forEach((e) => {
			e.track && e.track.stop();
		}), this._peerConnection.getSenders().forEach((e) => {
			e.track && e.track.stop();
		}), this._dataChannel && this._dataChannel.close(), this._peerConnection.close(), this._peerConnection = void 0);
	}
	enableReceiverTracks(e) {
		let t = this.peerConnection;
		if (!t) throw Error("Peer connection closed.");
		t.getReceivers().forEach((t) => {
			t.track && (t.track.enabled = e);
		});
	}
	enableSenderTracks(e) {
		let t = this.peerConnection;
		if (!t) throw Error("Peer connection closed.");
		t.getSenders().forEach((t) => {
			t.track && (t.track.enabled = e);
		});
	}
	getDescription(e, t) {
		if (this.logger.debug("SessionDescriptionHandler.getDescription"), this._peerConnection === void 0) return Promise.reject(/* @__PURE__ */ Error("Peer connection closed."));
		this.onDataChannel = e?.onDataChannel;
		let n = e?.offerOptions?.iceRestart, r = e?.iceGatheringTimeout === void 0 ? this.sessionDescriptionHandlerConfiguration?.iceGatheringTimeout : e?.iceGatheringTimeout;
		return this.getLocalMediaStream(e).then(() => this.updateDirection(e)).then(() => this.createDataChannel(e)).then(() => this.createLocalOfferOrAnswer(e)).then((e) => this.applyModifiers(e, t)).then((e) => this.setLocalSessionDescription(e)).then(() => this.waitForIceGatheringComplete(n, r)).then(() => this.getLocalSessionDescription()).then((e) => ({
			body: e.sdp,
			contentType: "application/sdp"
		})).catch((e) => {
			throw this.logger.error("SessionDescriptionHandler.getDescription failed - " + e), e;
		});
	}
	hasDescription(e) {
		return this.logger.debug("SessionDescriptionHandler.hasDescription"), e === "application/sdp";
	}
	iceGatheringComplete() {
		this.logger.debug("SessionDescriptionHandler.iceGatheringComplete"), this.iceGatheringCompleteTimeoutId !== void 0 && (this.logger.debug("SessionDescriptionHandler.iceGatheringComplete - clearing timeout"), clearTimeout(this.iceGatheringCompleteTimeoutId), this.iceGatheringCompleteTimeoutId = void 0), this.iceGatheringCompletePromise !== void 0 && (this.logger.debug("SessionDescriptionHandler.iceGatheringComplete - resolving promise"), this.iceGatheringCompleteResolve && this.iceGatheringCompleteResolve(), this.iceGatheringCompletePromise = void 0, this.iceGatheringCompleteResolve = void 0, this.iceGatheringCompleteReject = void 0);
	}
	sendDtmf(e, t) {
		if (this.logger.debug("SessionDescriptionHandler.sendDtmf"), this._peerConnection === void 0) return this.logger.error("SessionDescriptionHandler.sendDtmf failed - peer connection closed"), !1;
		let n = this._peerConnection.getSenders();
		if (n.length === 0) return this.logger.error("SessionDescriptionHandler.sendDtmf failed - no senders"), !1;
		let r = n[0].dtmf;
		if (!r) return this.logger.error("SessionDescriptionHandler.sendDtmf failed - no DTMF sender"), !1;
		let i = t?.duration, a = t?.interToneGap;
		try {
			r.insertDTMF(e, i, a);
		} catch (e) {
			return this.logger.error(e.toString()), !1;
		}
		return this.logger.log("SessionDescriptionHandler.sendDtmf sent via RTP: " + e.toString()), !0;
	}
	setDescription(e, t, n) {
		if (this.logger.debug("SessionDescriptionHandler.setDescription"), this._peerConnection === void 0) return Promise.reject(/* @__PURE__ */ Error("Peer connection closed."));
		this.onDataChannel = t?.onDataChannel;
		let r = this._peerConnection.signalingState === "have-local-offer" ? "answer" : "offer";
		return this.getLocalMediaStream(t).then(() => this.applyModifiers({
			sdp: e,
			type: r
		}, n)).then((e) => this.setRemoteSessionDescription(e)).catch((e) => {
			throw this.logger.error("SessionDescriptionHandler.setDescription failed - " + e), e;
		});
	}
	applyModifiers(e, t) {
		return this.logger.debug("SessionDescriptionHandler.applyModifiers"), !t || t.length === 0 ? Promise.resolve(e) : t.reduce((e, t) => e.then(t), Promise.resolve(e)).then((e) => {
			if (this.logger.debug("SessionDescriptionHandler.applyModifiers - modified sdp"), !e.sdp || !e.type) throw Error("Invalid SDP.");
			return {
				sdp: e.sdp,
				type: e.type
			};
		});
	}
	createDataChannel(e) {
		if (this._peerConnection === void 0) return Promise.reject(/* @__PURE__ */ Error("Peer connection closed."));
		if (e?.dataChannel !== !0 || this._dataChannel) return Promise.resolve();
		switch (this._peerConnection.signalingState) {
			case "stable":
				this.logger.debug("SessionDescriptionHandler.createDataChannel - creating data channel");
				try {
					return this._dataChannel = this._peerConnection.createDataChannel(e?.dataChannelLabel || "", e?.dataChannelOptions), this.onDataChannel && this.onDataChannel(this._dataChannel), Promise.resolve();
				} catch (e) {
					return Promise.reject(e);
				}
			case "have-remote-offer": return Promise.resolve();
			default: return Promise.reject(/* @__PURE__ */ Error("Invalid signaling state " + this._peerConnection.signalingState));
		}
	}
	createLocalOfferOrAnswer(e) {
		if (this._peerConnection === void 0) return Promise.reject(/* @__PURE__ */ Error("Peer connection closed."));
		switch (this._peerConnection.signalingState) {
			case "stable": return this.logger.debug("SessionDescriptionHandler.createLocalOfferOrAnswer - creating SDP offer"), this._peerConnection.createOffer(e?.offerOptions);
			case "have-remote-offer": return this.logger.debug("SessionDescriptionHandler.createLocalOfferOrAnswer - creating SDP answer"), this._peerConnection.createAnswer(e?.answerOptions);
			default: return Promise.reject(/* @__PURE__ */ Error("Invalid signaling state " + this._peerConnection.signalingState));
		}
	}
	getLocalMediaStream(e) {
		if (this.logger.debug("SessionDescriptionHandler.getLocalMediaStream"), this._peerConnection === void 0) return Promise.reject(/* @__PURE__ */ Error("Peer connection closed."));
		let t = Object.assign({}, e?.constraints);
		if (this.localMediaStreamConstraints) {
			if (t.audio = t.audio || this.localMediaStreamConstraints.audio, t.video = t.video || this.localMediaStreamConstraints.video, JSON.stringify(this.localMediaStreamConstraints.audio) === JSON.stringify(t.audio) && JSON.stringify(this.localMediaStreamConstraints.video) === JSON.stringify(t.video)) return Promise.resolve();
		} else t.audio === void 0 && t.video === void 0 && (t = { audio: !0 });
		return this.localMediaStreamConstraints = t, this.mediaStreamFactory(t, this, e).then((e) => this.setLocalMediaStream(e));
	}
	setLocalMediaStream(t) {
		if (this.logger.debug("SessionDescriptionHandler.setLocalMediaStream"), !this._peerConnection) throw Error("Peer connection undefined.");
		let n = this._peerConnection, r = this._localMediaStream, i = [], a = (t) => {
			let a = t.kind;
			if (a !== "audio" && a !== "video") throw Error(`Unknown new track kind ${a}.`);
			let o = n.getSenders().find((e) => e.track && e.track.kind === a);
			o ? i.push(new Promise((e) => {
				this.logger.debug(`SessionDescriptionHandler.setLocalMediaStream - replacing sender ${a} track`), e();
			}).then(() => o.replaceTrack(t).then(() => {
				let n = r.getTracks().find((e) => e.kind === a);
				n && (n.stop(), r.removeTrack(n), e.dispatchRemoveTrackEvent(r, n)), r.addTrack(t), e.dispatchAddTrackEvent(r, t);
			}).catch((e) => {
				throw this.logger.error(`SessionDescriptionHandler.setLocalMediaStream - failed to replace sender ${a} track`), e;
			}))) : i.push(new Promise((e) => {
				this.logger.debug(`SessionDescriptionHandler.setLocalMediaStream - adding sender ${a} track`), e();
			}).then(() => {
				try {
					n.addTrack(t, r);
				} catch (e) {
					throw this.logger.error(`SessionDescriptionHandler.setLocalMediaStream - failed to add sender ${a} track`), e;
				}
				r.addTrack(t), e.dispatchAddTrackEvent(r, t);
			}));
		}, o = t.getAudioTracks();
		o.length && a(o[0]);
		let s = t.getVideoTracks();
		return s.length && a(s[0]), i.reduce((e, t) => e.then(() => t), Promise.resolve());
	}
	getLocalSessionDescription() {
		if (this.logger.debug("SessionDescriptionHandler.getLocalSessionDescription"), this._peerConnection === void 0) return Promise.reject(/* @__PURE__ */ Error("Peer connection closed."));
		let e = this._peerConnection.localDescription;
		return e ? Promise.resolve(e) : Promise.reject(/* @__PURE__ */ Error("Failed to get local session description"));
	}
	setLocalSessionDescription(e) {
		return this.logger.debug("SessionDescriptionHandler.setLocalSessionDescription"), this._peerConnection === void 0 ? Promise.reject(/* @__PURE__ */ Error("Peer connection closed.")) : this._peerConnection.setLocalDescription(e);
	}
	setRemoteSessionDescription(e) {
		if (this.logger.debug("SessionDescriptionHandler.setRemoteSessionDescription"), this._peerConnection === void 0) return Promise.reject(/* @__PURE__ */ Error("Peer connection closed."));
		let t = e.sdp, n;
		switch (this._peerConnection.signalingState) {
			case "stable":
				n = "offer";
				break;
			case "have-local-offer":
				n = "answer";
				break;
			default: return Promise.reject(/* @__PURE__ */ Error("Invalid signaling state " + this._peerConnection.signalingState));
		}
		return t ? this._peerConnection.setRemoteDescription({
			sdp: t,
			type: n
		}) : (this.logger.error("SessionDescriptionHandler.setRemoteSessionDescription failed - cannot set null sdp"), Promise.reject(/* @__PURE__ */ Error("SDP is undefined")));
	}
	setRemoteTrack(t) {
		this.logger.debug("SessionDescriptionHandler.setRemoteTrack");
		let n = this._remoteMediaStream;
		n.getTrackById(t.id) ? this.logger.debug(`SessionDescriptionHandler.setRemoteTrack - have remote ${t.kind} track`) : t.kind === "audio" ? (this.logger.debug(`SessionDescriptionHandler.setRemoteTrack - adding remote ${t.kind} track`), n.getAudioTracks().forEach((t) => {
			t.stop(), n.removeTrack(t), e.dispatchRemoveTrackEvent(n, t);
		}), n.addTrack(t), e.dispatchAddTrackEvent(n, t)) : t.kind === "video" && (this.logger.debug(`SessionDescriptionHandler.setRemoteTrack - adding remote ${t.kind} track`), n.getVideoTracks().forEach((t) => {
			t.stop(), n.removeTrack(t), e.dispatchRemoveTrackEvent(n, t);
		}), n.addTrack(t), e.dispatchAddTrackEvent(n, t));
	}
	updateDirection(e) {
		if (this._peerConnection === void 0) return Promise.reject(/* @__PURE__ */ Error("Peer connection closed."));
		switch (this._peerConnection.signalingState) {
			case "stable":
				this.logger.debug("SessionDescriptionHandler.updateDirection - setting offer direction");
				{
					let t = (t) => {
						switch (t) {
							case "inactive": return e?.hold ? "inactive" : "recvonly";
							case "recvonly": return e?.hold ? "inactive" : "recvonly";
							case "sendonly": return e?.hold ? "sendonly" : "sendrecv";
							case "sendrecv": return e?.hold ? "sendonly" : "sendrecv";
							case "stopped": return "stopped";
							default: throw Error("Should never happen");
						}
					};
					this._peerConnection.getTransceivers().forEach((e) => {
						if (e.direction) {
							let n = t(e.direction);
							e.direction !== n && (e.direction = n);
						}
					});
				}
				break;
			case "have-remote-offer":
				this.logger.debug("SessionDescriptionHandler.updateDirection - setting answer direction");
				{
					let t = (() => {
						let e = this._peerConnection.remoteDescription;
						if (!e) throw Error("Failed to read remote offer");
						let t = /a=sendrecv\r\n|a=sendonly\r\n|a=recvonly\r\n|a=inactive\r\n/.exec(e.sdp);
						if (t) switch (t[0]) {
							case "a=inactive\r\n": return "inactive";
							case "a=recvonly\r\n": return "recvonly";
							case "a=sendonly\r\n": return "sendonly";
							case "a=sendrecv\r\n": return "sendrecv";
							default: throw Error("Should never happen");
						}
						return "sendrecv";
					})(), n = (() => {
						switch (t) {
							case "inactive": return "inactive";
							case "recvonly": return "sendonly";
							case "sendonly": return e?.hold ? "inactive" : "recvonly";
							case "sendrecv": return e?.hold ? "sendonly" : "sendrecv";
							default: throw Error("Should never happen");
						}
					})();
					this._peerConnection.getTransceivers().forEach((e) => {
						e.direction && e.direction !== "stopped" && e.direction !== n && (e.direction = n);
					});
				}
				break;
			default: return Promise.reject(/* @__PURE__ */ Error("Invalid signaling state " + this._peerConnection.signalingState));
		}
		return Promise.resolve();
	}
	waitForIceGatheringComplete(e = !1, t = 0) {
		return this.logger.debug("SessionDescriptionHandler.waitForIceGatheringToComplete"), this._peerConnection === void 0 ? Promise.reject("Peer connection closed.") : !e && this._peerConnection.iceGatheringState === "complete" ? (this.logger.debug("SessionDescriptionHandler.waitForIceGatheringToComplete - already complete"), Promise.resolve()) : (this.iceGatheringCompletePromise !== void 0 && (this.logger.debug("SessionDescriptionHandler.waitForIceGatheringToComplete - rejecting prior waiting promise"), this.iceGatheringCompleteReject && this.iceGatheringCompleteReject(/* @__PURE__ */ Error("Promise superseded.")), this.iceGatheringCompletePromise = void 0, this.iceGatheringCompleteResolve = void 0, this.iceGatheringCompleteReject = void 0), this.iceGatheringCompletePromise = new Promise((e, n) => {
			this.iceGatheringCompleteResolve = e, this.iceGatheringCompleteReject = n, t > 0 && (this.logger.debug("SessionDescriptionHandler.waitForIceGatheringToComplete - timeout in " + t), this.iceGatheringCompleteTimeoutId = setTimeout(() => {
				this.logger.debug("SessionDescriptionHandler.waitForIceGatheringToComplete - timeout"), this.iceGatheringComplete();
			}, t));
		}), this.iceGatheringCompletePromise);
	}
	initPeerConnectionEventHandlers() {
		if (this.logger.debug("SessionDescriptionHandler.initPeerConnectionEventHandlers"), !this._peerConnection) throw Error("Peer connection undefined.");
		let e = this._peerConnection;
		e.onconnectionstatechange = (t) => {
			let n = e.connectionState;
			this.logger.debug(`SessionDescriptionHandler.onconnectionstatechange ${n}`), this._peerConnectionDelegate?.onconnectionstatechange && this._peerConnectionDelegate.onconnectionstatechange(t);
		}, e.ondatachannel = (e) => {
			this.logger.debug("SessionDescriptionHandler.ondatachannel"), this._dataChannel = e.channel, this.onDataChannel && this.onDataChannel(this._dataChannel), this._peerConnectionDelegate?.ondatachannel && this._peerConnectionDelegate.ondatachannel(e);
		}, e.onicecandidate = (e) => {
			this.logger.debug("SessionDescriptionHandler.onicecandidate"), this._peerConnectionDelegate?.onicecandidate && this._peerConnectionDelegate.onicecandidate(e);
		}, e.onicecandidateerror = (e) => {
			this.logger.debug("SessionDescriptionHandler.onicecandidateerror"), this._peerConnectionDelegate?.onicecandidateerror && this._peerConnectionDelegate.onicecandidateerror(e);
		}, e.oniceconnectionstatechange = (t) => {
			let n = e.iceConnectionState;
			this.logger.debug(`SessionDescriptionHandler.oniceconnectionstatechange ${n}`), this._peerConnectionDelegate?.oniceconnectionstatechange && this._peerConnectionDelegate.oniceconnectionstatechange(t);
		}, e.onicegatheringstatechange = (t) => {
			let n = e.iceGatheringState;
			this.logger.debug(`SessionDescriptionHandler.onicegatheringstatechange ${n}`), n === "complete" && this.iceGatheringComplete(), this._peerConnectionDelegate?.onicegatheringstatechange && this._peerConnectionDelegate.onicegatheringstatechange(t);
		}, e.onnegotiationneeded = (e) => {
			this.logger.debug("SessionDescriptionHandler.onnegotiationneeded"), this._peerConnectionDelegate?.onnegotiationneeded && this._peerConnectionDelegate.onnegotiationneeded(e);
		}, e.onsignalingstatechange = (t) => {
			let n = e.signalingState;
			this.logger.debug(`SessionDescriptionHandler.onsignalingstatechange ${n}`), this._peerConnectionDelegate?.onsignalingstatechange && this._peerConnectionDelegate.onsignalingstatechange(t);
		}, e.ontrack = (e) => {
			let t = e.track.kind, n = e.track.enabled ? "enabled" : "disabled";
			this.logger.debug(`SessionDescriptionHandler.ontrack ${t} ${n}`), this.setRemoteTrack(e.track), this._peerConnectionDelegate?.ontrack && this._peerConnectionDelegate.ontrack(e);
		};
	}
};
// node_modules/sip.js/lib/platform/web/session-description-handler/session-description-handler-factory-default.js
function Kn(e) {
	return (t, n) => {
		e === void 0 && (e = Un());
		let r = {
			iceGatheringTimeout: n?.iceGatheringTimeout === void 0 ? 5e3 : n?.iceGatheringTimeout,
			peerConnectionConfiguration: Object.assign(Object.assign({}, Wn()), n?.peerConnectionConfiguration)
		};
		return new Gn(t.userAgent.getLogger("sip.SessionDescriptionHandler"), e, r);
	};
}
// node_modules/sip.js/lib/platform/web/transport/transport.js
var qn = class e {
	constructor(t, n) {
		if (this._state = V.Disconnected, this.transitioningState = !1, this._stateEventEmitter = new kt(), this.logger = t, n) {
			let e = n, t = e?.wsServers, r = e?.maxReconnectionAttempts;
			t !== void 0 && this.logger.warn("The transport option \"wsServers\" as has apparently been specified and has been deprecated. It will no longer be available starting with SIP.js release 0.16.0. Please update accordingly."), r !== void 0 && this.logger.warn("The transport option \"maxReconnectionAttempts\" as has apparently been specified and has been deprecated. It will no longer be available starting with SIP.js release 0.16.0. Please update accordingly."), t && !n.server && (typeof t == "string" && (n.server = t), t instanceof Array && (n.server = t[0]));
		}
		this.configuration = Object.assign(Object.assign({}, e.defaultOptions), n);
		let r = this.configuration.server, i = O.parse(r, "absoluteURI");
		if (i === -1) throw this.logger.error(`Invalid WebSocket Server URL "${r}"`), Error("Invalid WebSocket Server URL");
		if (![
			"wss",
			"ws",
			"udp"
		].includes(i.scheme)) throw this.logger.error(`Invalid scheme in WebSocket Server URL "${r}"`), Error("Invalid scheme in WebSocket Server URL");
		this._protocol = i.scheme.toUpperCase();
	}
	dispose() {
		return this.disconnect();
	}
	get protocol() {
		return this._protocol;
	}
	get server() {
		return this.configuration.server;
	}
	get state() {
		return this._state;
	}
	get stateChange() {
		return this._stateEventEmitter;
	}
	get ws() {
		return this._ws;
	}
	connect() {
		return this._connect();
	}
	disconnect() {
		return this._disconnect();
	}
	isConnected() {
		return this.state === V.Connected;
	}
	send(e) {
		return this._send(e);
	}
	_connect() {
		switch (this.logger.log(`Connecting ${this.server}`), this.state) {
			case V.Connecting:
				if (this.transitioningState) return Promise.reject(this.transitionLoopDetectedError(V.Connecting));
				if (!this.connectPromise) throw Error("Connect promise must be defined.");
				return this.connectPromise;
			case V.Connected:
				if (this.transitioningState) return Promise.reject(this.transitionLoopDetectedError(V.Connecting));
				if (this.connectPromise) throw Error("Connect promise must not be defined.");
				return Promise.resolve();
			case V.Disconnecting:
				if (this.connectPromise) throw Error("Connect promise must not be defined.");
				try {
					this.transitionState(V.Connecting);
				} catch (e) {
					if (e instanceof Tt) return Promise.reject(e);
					throw e;
				}
				break;
			case V.Disconnected:
				if (this.connectPromise) throw Error("Connect promise must not be defined.");
				try {
					this.transitionState(V.Connecting);
				} catch (e) {
					if (e instanceof Tt) return Promise.reject(e);
					throw e;
				}
				break;
			default: throw Error("Unknown state");
		}
		let e;
		try {
			e = new WebSocket(this.server, "sip"), e.binaryType = "arraybuffer", e.addEventListener("close", (t) => this.onWebSocketClose(t, e)), e.addEventListener("error", (t) => this.onWebSocketError(t, e)), e.addEventListener("open", (t) => this.onWebSocketOpen(t, e)), e.addEventListener("message", (t) => this.onWebSocketMessage(t, e)), this._ws = e;
		} catch (e) {
			return this._ws = void 0, this.logger.error("WebSocket construction failed."), this.logger.error(e.toString()), new Promise((t, n) => {
				this.connectResolve = t, this.connectReject = n, this.transitionState(V.Disconnected, e);
			});
		}
		return this.connectPromise = new Promise((t, n) => {
			this.connectResolve = t, this.connectReject = n, this.connectTimeout = setTimeout(() => {
				this.logger.warn("Connect timed out. Exceeded time set in configuration.connectionTimeout: " + this.configuration.connectionTimeout + "s."), e.close(1e3);
			}, this.configuration.connectionTimeout * 1e3);
		}), this.connectPromise;
	}
	_disconnect() {
		switch (this.logger.log(`Disconnecting ${this.server}`), this.state) {
			case V.Connecting:
				if (this.disconnectPromise) throw Error("Disconnect promise must not be defined.");
				try {
					this.transitionState(V.Disconnecting);
				} catch (e) {
					if (e instanceof Tt) return Promise.reject(e);
					throw e;
				}
				break;
			case V.Connected:
				if (this.disconnectPromise) throw Error("Disconnect promise must not be defined.");
				try {
					this.transitionState(V.Disconnecting);
				} catch (e) {
					if (e instanceof Tt) return Promise.reject(e);
					throw e;
				}
				break;
			case V.Disconnecting:
				if (this.transitioningState) return Promise.reject(this.transitionLoopDetectedError(V.Disconnecting));
				if (!this.disconnectPromise) throw Error("Disconnect promise must be defined.");
				return this.disconnectPromise;
			case V.Disconnected:
				if (this.transitioningState) return Promise.reject(this.transitionLoopDetectedError(V.Disconnecting));
				if (this.disconnectPromise) throw Error("Disconnect promise must not be defined.");
				return Promise.resolve();
			default: throw Error("Unknown state");
		}
		if (!this._ws) throw Error("WebSocket must be defined.");
		let e = this._ws;
		return this.disconnectPromise = new Promise((t, n) => {
			this.disconnectResolve = t, this.disconnectReject = n;
			try {
				e.close(1e3);
			} catch (e) {
				throw this.logger.error("WebSocket close failed."), this.logger.error(e.toString()), e;
			}
		}), this.disconnectPromise;
	}
	_send(e) {
		if (this.configuration.traceSip === !0 && this.logger.log("Sending WebSocket message:\n\n" + e + "\n"), this._state !== V.Connected) return Promise.reject(/* @__PURE__ */ Error("Not connected."));
		if (!this._ws) throw Error("WebSocket undefined.");
		try {
			this._ws.send(e);
		} catch (e) {
			return e instanceof Error ? Promise.reject(e) : Promise.reject(/* @__PURE__ */ Error("WebSocket send failed."));
		}
		return Promise.resolve();
	}
	onWebSocketClose(e, t) {
		if (t !== this._ws) return;
		let n = `WebSocket closed ${this.server} (code: ${e.code})`, r = this.disconnectPromise ? void 0 : Error(n);
		r && this.logger.warn("WebSocket closed unexpectedly"), this.logger.log(n), this._ws = void 0, this.transitionState(V.Disconnected, r);
	}
	onWebSocketError(e, t) {
		t === this._ws && this.logger.error("WebSocket error occurred.");
	}
	onWebSocketMessage(e, t) {
		if (t !== this._ws) return;
		let n = e.data, r;
		if (/^(\r\n)+$/.test(n)) this.clearKeepAliveTimeout(), this.configuration.traceSip === !0 && this.logger.log("Received WebSocket message with CRLF Keep Alive response");
		else if (!n) this.logger.warn("Received empty message, discarding...");
		else {
			if (typeof n != "string") {
				try {
					r = new TextDecoder().decode(new Uint8Array(n));
				} catch (e) {
					this.logger.error(e.toString()), this.logger.error("Received WebSocket binary message failed to be converted into string, message discarded");
					return;
				}
				this.configuration.traceSip === !0 && this.logger.log("Received WebSocket binary message:\n\n" + r + "\n");
			} else r = n, this.configuration.traceSip === !0 && this.logger.log("Received WebSocket text message:\n\n" + r + "\n");
			if (this.state !== V.Connected) this.logger.warn("Received message while not connected, discarding...");
			else if (this.onMessage) try {
				this.onMessage(r);
			} catch (e) {
				throw this.logger.error(e.toString()), this.logger.error("Exception thrown by onMessage callback"), e;
			}
		}
	}
	onWebSocketOpen(e, t) {
		t === this._ws && this._state === V.Connecting && (this.logger.log(`WebSocket opened ${this.server}`), this.transitionState(V.Connected));
	}
	transitionLoopDetectedError(e) {
		let t = "A state transition loop has been detected.";
		return t += ` An attempt to transition from ${this._state} to ${e} before the prior transition completed.`, t += " Perhaps you are synchronously calling connect() or disconnect() from a callback or state change handler?", this.logger.error(t), new Tt("Loop detected.");
	}
	transitionState(e, t) {
		let n = () => {
			throw Error(`Invalid state transition from ${this._state} to ${e}`);
		};
		if (this.transitioningState) throw this.transitionLoopDetectedError(e);
		switch (this.transitioningState = !0, this._state) {
			case V.Connecting:
				e !== V.Connected && e !== V.Disconnecting && e !== V.Disconnected && n();
				break;
			case V.Connected:
				e !== V.Disconnecting && e !== V.Disconnected && n();
				break;
			case V.Disconnecting:
				e !== V.Connecting && e !== V.Disconnected && n();
				break;
			case V.Disconnected:
				e !== V.Connecting && n();
				break;
			default: throw Error("Unknown state.");
		}
		let r = this._state;
		this._state = e;
		let i = this.connectResolve, a = this.connectReject;
		r === V.Connecting && (this.connectPromise = void 0, this.connectResolve = void 0, this.connectReject = void 0);
		let o = this.disconnectResolve, s = this.disconnectReject;
		if (r === V.Disconnecting && (this.disconnectPromise = void 0, this.disconnectResolve = void 0, this.disconnectReject = void 0), this.connectTimeout &&= (clearTimeout(this.connectTimeout), void 0), this.logger.log(`Transitioned from ${r} to ${this._state}`), this._stateEventEmitter.emit(this._state), e === V.Connected && (this.startSendingKeepAlives(), this.onConnect)) try {
			this.onConnect();
		} catch (e) {
			throw this.logger.error(e.toString()), this.logger.error("Exception thrown by onConnect callback"), e;
		}
		if (r === V.Connected && (this.stopSendingKeepAlives(), this.onDisconnect)) try {
			t ? this.onDisconnect(t) : this.onDisconnect();
		} catch (e) {
			throw this.logger.error(e.toString()), this.logger.error("Exception thrown by onDisconnect callback"), e;
		}
		if (r === V.Connecting) {
			if (!i) throw Error("Connect resolve undefined.");
			if (!a) throw Error("Connect reject undefined.");
			e === V.Connected ? i() : a(t || /* @__PURE__ */ Error("Connect aborted."));
		}
		if (r === V.Disconnecting) {
			if (!o) throw Error("Disconnect resolve undefined.");
			if (!s) throw Error("Disconnect reject undefined.");
			e === V.Disconnected ? o() : s(t || /* @__PURE__ */ Error("Disconnect aborted."));
		}
		this.transitioningState = !1;
	}
	clearKeepAliveTimeout() {
		this.keepAliveDebounceTimeout && clearTimeout(this.keepAliveDebounceTimeout), this.keepAliveDebounceTimeout = void 0;
	}
	sendKeepAlive() {
		return this.keepAliveDebounceTimeout ? Promise.resolve() : (this.keepAliveDebounceTimeout = setTimeout(() => {
			this.clearKeepAliveTimeout();
		}, this.configuration.keepAliveDebounce * 1e3), this.send("\r\n\r\n"));
	}
	startSendingKeepAlives() {
		let e = (e) => {
			let t = e * .8;
			return 1e3 * (Math.random() * (e - t) + t);
		};
		this.configuration.keepAliveInterval && !this.keepAliveInterval && (this.keepAliveInterval = setInterval(() => {
			this.sendKeepAlive(), this.startSendingKeepAlives();
		}, e(this.configuration.keepAliveInterval)));
	}
	stopSendingKeepAlives() {
		this.keepAliveInterval && clearInterval(this.keepAliveInterval), this.keepAliveDebounceTimeout && clearTimeout(this.keepAliveDebounceTimeout), this.keepAliveInterval = void 0, this.keepAliveDebounceTimeout = void 0;
	}
};
qn.defaultOptions = {
	server: "",
	connectionTimeout: 5,
	keepAliveInterval: 0,
	keepAliveDebounce: 10,
	traceSip: !0
};
// node_modules/sip.js/lib/api/user-agent.js
var Jn = class e {
	constructor(t = {}) {
		if (this._publishers = {}, this._registerers = {}, this._sessions = {}, this._subscriptions = {}, this._state = H.Stopped, this._stateEventEmitter = new kt(), this.delegate = t.delegate, this.options = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, e.defaultOptions()), { sipjsId: Rt(5) }), { uri: new D("sip", "anonymous." + Rt(6), "anonymous.invalid") }), { viaHost: Rt(12) + ".invalid" }), e.stripUndefinedProperties(t)), this.options.hackIpInContact) {
			if (typeof this.options.hackIpInContact == "boolean" && this.options.hackIpInContact) {
				let e = Math.floor(Math.random() * 254 + 1);
				this.options.viaHost = "192.0.2." + e;
			} else this.options.hackIpInContact && (this.options.viaHost = this.options.hackIpInContact);
		}
		switch (this.loggerFactory = new sn(), this.logger = this.loggerFactory.getLogger("sip.UserAgent"), this.loggerFactory.builtinEnabled = this.options.logBuiltinEnabled, this.loggerFactory.connector = this.options.logConnector, this.options.logLevel) {
			case "error":
				this.loggerFactory.level = G.error;
				break;
			case "warn":
				this.loggerFactory.level = G.warn;
				break;
			case "log":
				this.loggerFactory.level = G.log;
				break;
			case "debug": this.loggerFactory.level = G.debug;
		}
		if (this.options.logConfiguration && (this.logger.log("Configuration:"), Object.keys(this.options).forEach((e) => {
			let t = this.options[e];
			switch (e) {
				case "uri":
				case "sessionDescriptionHandlerFactory":
					this.logger.log("· " + e + ": " + t);
					break;
				case "authorizationPassword":
					this.logger.log("· " + e + ": NOT SHOWN");
					break;
				case "transportConstructor":
					this.logger.log("· " + e + ": " + t.name);
					break;
				default: this.logger.log("· " + e + ": " + JSON.stringify(t));
			}
		})), this.options.transportOptions) {
			let e = this.options.transportOptions, n = e.maxReconnectionAttempts, r = e.reconnectionTimeout;
			n !== void 0 && this.logger.warn("The transport option \"maxReconnectionAttempts\" as has apparently been specified and has been deprecated. It will no longer be available starting with SIP.js release 0.16.0. Please update accordingly."), r !== void 0 && this.logger.warn("The transport option \"reconnectionTimeout\" as has apparently been specified and has been deprecated. It will no longer be available starting with SIP.js release 0.16.0. Please update accordingly."), t.reconnectionDelay === void 0 && r !== void 0 && (this.options.reconnectionDelay = r), t.reconnectionAttempts === void 0 && n !== void 0 && (this.options.reconnectionAttempts = n);
		}
		if (t.reconnectionDelay !== void 0 && this.logger.warn("The user agent option \"reconnectionDelay\" as has apparently been specified and has been deprecated. It will no longer be available starting with SIP.js release 0.16.0. Please update accordingly."), t.reconnectionAttempts !== void 0 && this.logger.warn("The user agent option \"reconnectionAttempts\" as has apparently been specified and has been deprecated. It will no longer be available starting with SIP.js release 0.16.0. Please update accordingly."), this._transport = new this.options.transportConstructor(this.getLogger("sip.Transport"), this.options.transportOptions), this.initTransportCallbacks(), this._contact = this.initContact(), this._instanceId = this.options.instanceId ? this.options.instanceId : e.newUUID(), O.parse(this._instanceId, "uuid") === -1) throw Error("Invalid instanceId.");
		this._userAgentCore = this.initCore();
	}
	static makeURI(e) {
		return O.URIParse(e);
	}
	static defaultOptions() {
		return {
			allowLegacyNotifications: !1,
			authorizationHa1: "",
			authorizationPassword: "",
			authorizationUsername: "",
			delegate: {},
			contactName: "",
			contactParams: { transport: "ws" },
			displayName: "",
			forceRport: !1,
			gracefulShutdown: !0,
			hackAllowUnregisteredOptionTags: !1,
			hackIpInContact: !1,
			hackViaTcp: !1,
			instanceId: "",
			instanceIdAlwaysAdded: !1,
			logBuiltinEnabled: !0,
			logConfiguration: !0,
			logConnector: () => {},
			logLevel: "log",
			noAnswerTimeout: 60,
			preloadedRouteSet: [],
			reconnectionAttempts: 0,
			reconnectionDelay: 4,
			sendInitialProvisionalResponse: !0,
			sessionDescriptionHandlerFactory: Kn(),
			sessionDescriptionHandlerFactoryOptions: {},
			sipExtension100rel: R.Unsupported,
			sipExtensionReplaces: R.Unsupported,
			sipExtensionExtraSupported: [],
			sipjsId: "",
			transportConstructor: qn,
			transportOptions: {},
			uri: new D("sip", "anonymous", "anonymous.invalid"),
			userAgentString: "SIP.js/" + yt,
			viaHost: ""
		};
	}
	static newUUID() {
		return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
			let t = Math.floor(Math.random() * 16);
			return (e === "x" ? t : t % 4 + 8).toString(16);
		});
	}
	static stripUndefinedProperties(e) {
		return Object.keys(e).reduce((t, n) => (e[n] !== void 0 && (t[n] = e[n]), t), {});
	}
	get configuration() {
		return this.options;
	}
	get contact() {
		return this._contact;
	}
	get instanceId() {
		return this._instanceId;
	}
	get state() {
		return this._state;
	}
	get stateChange() {
		return this._stateEventEmitter;
	}
	get transport() {
		return this._transport;
	}
	get userAgentCore() {
		return this._userAgentCore;
	}
	getLogger(e, t) {
		return this.loggerFactory.getLogger(e, t);
	}
	getLoggerFactory() {
		return this.loggerFactory;
	}
	isConnected() {
		return this.transport.isConnected();
	}
	reconnect() {
		return this.state === H.Stopped ? Promise.reject(/* @__PURE__ */ Error("User agent stopped.")) : Promise.resolve().then(() => this.transport.connect());
	}
	start() {
		return this.state === H.Started ? (this.logger.warn("User agent already started"), Promise.resolve()) : (this.logger.log(`Starting ${this.configuration.uri}`), this.transitionState(H.Started), this.transport.connect());
	}
	async stop() {
		if (this.state === H.Stopped) return this.logger.warn("User agent already stopped"), Promise.resolve();
		if (this.logger.log(`Stopping ${this.configuration.uri}`), !this.options.gracefulShutdown) return this.logger.log("Dispose of transport"), this.transport.dispose().catch((e) => {
			throw this.logger.error(e.message), e;
		}), this.logger.log("Dispose of core"), this.userAgentCore.dispose(), this._publishers = {}, this._registerers = {}, this._sessions = {}, this._subscriptions = {}, this.transitionState(H.Stopped), Promise.resolve();
		let e = Object.assign({}, this._publishers), t = Object.assign({}, this._registerers), n = Object.assign({}, this._sessions), r = Object.assign({}, this._subscriptions), i = this.transport, a = this.userAgentCore;
		this.logger.log("Dispose of registerers");
		for (let e in t) t[e] && await t[e].dispose().catch((t) => {
			throw this.logger.error(t.message), delete this._registerers[e], t;
		});
		this.logger.log("Dispose of sessions");
		for (let e in n) n[e] && await n[e].dispose().catch((t) => {
			throw this.logger.error(t.message), delete this._sessions[e], t;
		});
		this.logger.log("Dispose of subscriptions");
		for (let e in r) r[e] && await r[e].dispose().catch((t) => {
			throw this.logger.error(t.message), delete this._subscriptions[e], t;
		});
		this.logger.log("Dispose of publishers");
		for (let t in e) e[t] && await e[t].dispose().catch((e) => {
			throw this.logger.error(e.message), delete this._publishers[t], e;
		});
		this.logger.log("Dispose of transport"), await i.dispose().catch((e) => {
			throw this.logger.error(e.message), e;
		}), this.logger.log("Dispose of core"), a.dispose(), this.transitionState(H.Stopped);
	}
	_makeInviter(e, t) {
		return new nn(this, e, t);
	}
	attemptReconnection(e = 1) {
		let t = this.options.reconnectionAttempts, n = this.options.reconnectionDelay;
		e > t ? this.logger.log("Maximum reconnection attempts reached") : (this.logger.log(`Reconnection attempt ${e} of ${t} - trying`), setTimeout(() => {
			this.reconnect().then(() => {
				this.logger.log(`Reconnection attempt ${e} of ${t} - succeeded`);
			}).catch((n) => {
				this.logger.error(n.message), this.logger.log(`Reconnection attempt ${e} of ${t} - failed`), this.attemptReconnection(++e);
			});
		}, e === 1 ? 0 : n * 1e3));
	}
	initContact() {
		let e = this.options.contactName === "" ? Rt(8) : this.options.contactName, t = this.options.contactParams;
		return {
			pubGruu: void 0,
			tempGruu: void 0,
			uri: new D("sip", e, this.options.viaHost, void 0, t),
			toString: (e = {}) => {
				let n = e.anonymous || !1, r = e.outbound || !1, i = e.register || !1, a = "<";
				return a += n ? this.contact.tempGruu || `sip:anonymous@anonymous.invalid;transport=${t.transport ? t.transport : "ws"}` : i ? this.contact.uri : this.contact.pubGruu || this.contact.uri, r && (a += ";ob"), a += ">", this.options.instanceIdAlwaysAdded && (a += ";+sip.instance=\"<urn:uuid:" + this._instanceId + ">\""), a;
			}
		};
	}
	initCore() {
		let e = [];
		e.push("outbound"), this.options.sipExtension100rel === R.Supported && e.push("100rel"), this.options.sipExtensionReplaces === R.Supported && e.push("replaces"), this.options.sipExtensionExtraSupported && e.push(...this.options.sipExtensionExtraSupported), this.options.hackAllowUnregisteredOptionTags || (e = e.filter((e) => en[e])), e = Array.from(new Set(e));
		let t = e.slice();
		return (this.contact.pubGruu || this.contact.tempGruu) && t.push("gruu"), new Hn({
			aor: this.options.uri,
			contact: this.contact,
			displayName: this.options.displayName,
			loggerFactory: this.loggerFactory,
			hackViaTcp: this.options.hackViaTcp,
			routeSet: this.options.preloadedRouteSet,
			supportedOptionTags: e,
			supportedOptionTagsResponse: t,
			sipjsId: this.options.sipjsId,
			userAgentHeaderFieldValue: this.options.userAgentString,
			viaForceRport: this.options.forceRport,
			viaHost: this.options.viaHost,
			authenticationFactory: () => {
				let e = this.options.authorizationUsername ? this.options.authorizationUsername : this.options.uri.user, t = this.options.authorizationPassword ? this.options.authorizationPassword : void 0, n = this.options.authorizationHa1 ? this.options.authorizationHa1 : void 0;
				return new an(this.getLoggerFactory(), n, e, t);
			},
			transportAccessor: () => this.transport
		}, {
			onInvite: (e) => {
				let t = new tn(this, e);
				if (e.delegate = {
					onCancel: (e) => {
						t._onCancel(e);
					},
					onTransportError: (e) => {
						this.logger.error("A transport error has occurred while handling an incoming INVITE request.");
					}
				}, e.trying(), this.options.sipExtensionReplaces !== R.Unsupported) {
					let n = e.message.parseHeader("replaces");
					if (n) {
						let e = n.call_id;
						if (typeof e != "string") throw Error("Type of call id is not string");
						let r = n.replaces_to_tag;
						if (typeof r != "string") throw Error("Type of to tag is not string");
						let i = n.replaces_from_tag;
						if (typeof i != "string") throw Error("type of from tag is not string");
						let a = e + r + i, o = this.userAgentCore.dialogs.get(a);
						if (!o) {
							t.reject({ statusCode: 481 });
							return;
						}
						if (!o.early && n.early_only === !0) {
							t.reject({ statusCode: 486 });
							return;
						}
						let s = this._sessions[e + i] || this._sessions[e + r] || void 0;
						if (!s) throw Error("Session does not exist.");
						t._replacee = s;
					}
				}
				if (this.delegate?.onInvite) {
					if (t.autoSendAnInitialProvisionalResponse) {
						t.progress().then(() => {
							if (this.delegate?.onInvite === void 0) throw Error("onInvite undefined.");
							this.delegate.onInvite(t);
						});
						return;
					}
					this.delegate.onInvite(t);
				} else t.reject({ statusCode: 486 });
			},
			onMessage: (e) => {
				if (this.delegate && this.delegate.onMessage) {
					let t = new Xt(e);
					this.delegate.onMessage(t);
				} else e.accept();
			},
			onNotify: (e) => {
				if (this.delegate && this.delegate.onNotify) {
					let t = new Zt(e);
					this.delegate.onNotify(t);
				} else this.options.allowLegacyNotifications ? e.accept() : e.reject({ statusCode: 481 });
			},
			onRefer: (e) => {
				this.logger.warn("Received an out of dialog REFER request"), this.delegate && this.delegate.onReferRequest ? this.delegate.onReferRequest(e) : e.reject({ statusCode: 405 });
			},
			onRegister: (e) => {
				this.logger.warn("Received an out of dialog REGISTER request"), this.delegate && this.delegate.onRegisterRequest ? this.delegate.onRegisterRequest(e) : e.reject({ statusCode: 405 });
			},
			onSubscribe: (e) => {
				this.logger.warn("Received an out of dialog SUBSCRIBE request"), this.delegate && this.delegate.onSubscribeRequest ? this.delegate.onSubscribeRequest(e) : e.reject({ statusCode: 405 });
			}
		});
	}
	initTransportCallbacks() {
		this.transport.onConnect = () => this.onTransportConnect(), this.transport.onDisconnect = (e) => this.onTransportDisconnect(e), this.transport.onMessage = (e) => this.onTransportMessage(e);
	}
	onTransportConnect() {
		this.state !== H.Stopped && this.delegate && this.delegate.onConnect && this.delegate.onConnect();
	}
	onTransportDisconnect(e) {
		this.state !== H.Stopped && (this.delegate && this.delegate.onDisconnect && this.delegate.onDisconnect(e), e && this.options.reconnectionAttempts > 0 && this.attemptReconnection());
	}
	onTransportMessage(e) {
		let t = cn.parseMessage(e, this.getLogger("sip.Parser"));
		if (!t) {
			this.logger.warn("Failed to parse incoming message. Dropping.");
			return;
		}
		if (this.state === H.Stopped && t instanceof Ut) {
			this.logger.warn(`Received ${t.method} request while stopped. Dropping.`);
			return;
		}
		let n = () => {
			for (let e of [
				"from",
				"to",
				"call_id",
				"cseq",
				"via"
			]) if (!t.hasHeader(e)) return this.logger.warn(`Missing mandatory header field : ${e}.`), !1;
			return !0;
		};
		if (t instanceof Ut) {
			if (!n()) {
				this.logger.warn("Request missing mandatory header field. Dropping.");
				return;
			}
			if (!t.toTag && t.callId.substr(0, 5) === this.options.sipjsId) {
				this.userAgentCore.replyStateless(t, { statusCode: 482 });
				return;
			}
			let e = Vt(t.body), r = t.getHeader("content-length");
			if (r && e < Number(r)) {
				this.userAgentCore.replyStateless(t, { statusCode: 400 });
				return;
			}
		}
		if (t instanceof A) {
			if (!n()) {
				this.logger.warn("Response missing mandatory header field. Dropping.");
				return;
			}
			if (t.getHeaders("via").length > 1) {
				this.logger.warn("More than one Via header field present in the response. Dropping.");
				return;
			}
			if (t.via.host !== this.options.viaHost || t.via.port !== void 0) {
				this.logger.warn("Via sent-by in the response does not match UA Via host value. Dropping.");
				return;
			}
			let e = Vt(t.body), r = t.getHeader("content-length");
			if (r && e < Number(r)) {
				this.logger.warn("Message body length is lower than the value in Content-Length header field. Dropping.");
				return;
			}
		}
		if (t instanceof Ut) this.userAgentCore.receiveIncomingRequestFromTransport(t);
		else if (t instanceof A) this.userAgentCore.receiveIncomingResponseFromTransport(t);
		else throw Error("Invalid message type.");
	}
	transitionState(e, t) {
		let n = () => {
			throw Error(`Invalid state transition from ${this._state} to ${e}`);
		};
		switch (this._state) {
			case H.Started:
				e !== H.Stopped && n();
				break;
			case H.Stopped:
				e !== H.Started && n();
				break;
			default: throw Error("Unknown state.");
		}
		this.logger.log(`Transitioned from ${this._state} to ${e}`), this._state = e, this._stateEventEmitter.emit(this._state);
	}
}, Yn = class {
	constructor(e) {
		this.listeners = /* @__PURE__ */ new Set(), this.stopped = !0, this.reconnectAttempt = 0, this.endReason = "remote", this._muted = !1, this.generation = 0, this.hasRegistered = !1, this.config = e, this.key = e.key;
	}
	get muted() {
		return this._muted;
	}
	get registered() {
		return this.registerer?.state === z.Registered;
	}
	describe() {
		let e = [];
		this.registerer?.state === z.Registered && e.push({
			type: "registration",
			state: "registered"
		});
		let t = this.pending ?? this.session;
		if (t) {
			let n = t.remoteIdentity.uri.user || t.remoteIdentity.uri.toString(), r = this.sessionDirection ?? "incoming";
			e.push({
				type: r,
				peer: n,
				peerName: t.remoteIdentity.displayName || void 0
			}), t.state === L.Established && e.push({ type: "connected" });
		}
		return this._muted && e.push({
			type: "muted",
			muted: !0
		}), e;
	}
	on(e) {
		return this.listeners.add(e), () => this.listeners.delete(e);
	}
	emit(e) {
		for (let t of this.listeners) try {
			t(e);
		} catch (e) {
			console.error("tessera-sip-card: listener failed", e);
		}
	}
	debug(...e) {
		this.config.debug && console.debug("[tessera-sip]", ...e);
	}
	async ensureStarted() {
		if (this.starting) return this.starting;
		if (!this.stopped) return;
		this.stopped = !1;
		let e = this.start();
		this.starting = e;
		try {
			await e;
		} finally {
			this.starting === e && (this.starting = void 0);
		}
	}
	async start() {
		let e = ++this.generation;
		this.hasRegistered = !1, this.emit({
			type: "registration",
			state: "registering"
		}), this.ensureAudioElement();
		let t = Jn.makeURI(this.config.uri);
		if (!t) throw Error(`Invalid SIP URI: ${this.config.uri}`);
		let n = new Jn({
			uri: t,
			transportOptions: { server: this.config.wssUrl },
			authorizationUsername: this.config.authUser,
			authorizationPassword: this.config.password,
			displayName: this.config.displayName,
			logLevel: this.config.debug ? "debug" : "error",
			sessionDescriptionHandlerFactoryOptions: {
				iceGatheringTimeout: this.config.iceGatheringTimeout,
				peerConnectionConfiguration: {
					iceServers: this.config.iceServers,
					iceTransportPolicy: this.config.iceTransportPolicy
				}
			},
			delegate: {
				onInvite: (e) => {
					this.ua === n && this.handleInvite(e);
				},
				onDisconnect: (e) => {
					this.ua === n && this.handleTransportClosed(e);
				},
				onConnect: () => this.debug("transport connected")
			}
		});
		try {
			await n.start();
		} catch (t) {
			if (e !== this.generation) return;
			throw this.stopped = !0, this.emit({
				type: "registration",
				state: "failed",
				error: t instanceof Error ? t.message : String(t)
			}), t;
		}
		if (e !== this.generation) {
			try {
				n.stop();
			} catch {}
			return;
		}
		this.ua = n;
		let r = new rn(n);
		this.registerer = r, r.stateChange.addListener((e) => {
			this.registerer === r && this.handleRegistration(e);
		});
		try {
			await r.register();
		} catch (e) {
			this.emit({
				type: "registration",
				state: "failed",
				error: e instanceof Error ? e.message : String(e)
			});
		}
		typeof document < "u" && !this.visibilityHandler && (this.visibilityHandler = () => {
			document.visibilityState === "visible" && setTimeout(() => {
				this.stopped || this.registered || this.session || this.pending || this.starting || (this.debug("still unregistered after becoming visible; restarting"), this.restart());
			}, 4e3);
		}, document.addEventListener("visibilitychange", this.visibilityHandler));
	}
	handleRegistration(e) {
		switch (this.debug("registration", e), e) {
			case z.Registered:
				this.hasRegistered = !0, this.reconnectAttempt = 0, this.emit({
					type: "registration",
					state: "registered"
				});
				break;
			case z.Unregistered:
				this.stopped || (this.emit({
					type: "registration",
					state: "unregistered"
				}), this.hasRegistered && !this.session && !this.pending && this.scheduleReconnect(), this.hasRegistered = !1);
				break;
			case z.Terminated: this.stopped || (this.emit({
				type: "registration",
				state: "unregistered"
			}), this.hasRegistered && this.scheduleReconnect(), this.hasRegistered = !1);
		}
	}
	handleTransportClosed(e) {
		this.debug("transport closed", e), this.stopped || (this.emit({
			type: "registration",
			state: "unregistered",
			error: e?.message
		}), this.scheduleReconnect());
	}
	scheduleReconnect() {
		if (this.stopped || this.reconnectTimer) return;
		let e = Math.min(3e4, 1e3 * 2 ** this.reconnectAttempt);
		this.reconnectAttempt += 1, this.debug(`reconnect in ${e} ms`), this.reconnectTimer = setTimeout(() => {
			this.reconnectTimer = void 0, this.stopped || this.restart();
		}, e);
	}
	handleInvite(e) {
		this.debug("incoming call", e.remoteIdentity.uri.toString()), this.pending = e, this.endReason = "remote", this.sessionDirection = "incoming", this.wireSession(e);
		let t = e.remoteIdentity.uri.user || e.remoteIdentity.uri.toString();
		if (this.emit({
			type: "incoming",
			peer: t,
			peerName: e.remoteIdentity.displayName || void 0
		}), this.playRingtone(), this.config.autoAnswer) {
			let e = Math.max(0, this.config.autoAnswerDelay) * 1e3;
			this.autoAnswerTimer = setTimeout(() => {
				this.answer().catch((e) => this.debug("auto answer failed", e));
			}, e);
		}
	}
	wireSession(e) {
		e.stateChange.addListener((t) => {
			switch (this.debug("session", t), t) {
				case L.Established:
					this.session = e, this.pending = void 0, this.clearAutoAnswer(), this.stopRingtone(), this.attachRemoteAudio(e), this.emit({ type: "connected" });
					break;
				case L.Terminated: this.handleTerminated(e);
			}
		});
	}
	handleTerminated(e) {
		if (this.session !== e && this.pending !== e) return;
		this.session = void 0, this.pending = void 0, this.clearAutoAnswer(), this.stopRingtone(), this.detachAudio(), this._muted = !1;
		let t = this.endReason;
		this.endReason = "remote", this.emit({
			type: "ended",
			reason: t
		});
	}
	sessionDescriptionHandlerOptions() {
		return { constraints: {
			audio: !0,
			video: this.config.video
		} };
	}
	async call(e) {
		if (await this.ensureStarted(), !this.ua) throw Error("SIP is not started.");
		if (this.session || this.pending) throw Error("There is already a call.");
		let t = e ?? this.config.callTargetUri, n = Jn.makeURI(t);
		if (!n) throw Error(`Invalid call target: ${t}`);
		let r = new nn(this.ua, n, { sessionDescriptionHandlerOptions: this.sessionDescriptionHandlerOptions() });
		this.session = r, this.endReason = "remote", this.sessionDirection = "outgoing", this.wireSession(r), this.emit({
			type: "outgoing",
			peer: n.user || n.toString()
		});
		try {
			await r.invite();
		} catch (e) {
			throw this.endReason = "failed", this.session = void 0, this.emit({
				type: "ended",
				reason: "failed",
				error: e instanceof Error ? e.message : String(e)
			}), e;
		}
	}
	async answer() {
		let e = this.pending;
		e && (this.clearAutoAnswer(), await e.accept({ sessionDescriptionHandlerOptions: this.sessionDescriptionHandlerOptions() }));
	}
	async decline() {
		let e = this.pending;
		e && (this.endReason = "declined", this.clearAutoAnswer(), this.stopRingtone(), await e.reject());
	}
	async hangup() {
		if (this.pending) {
			await this.decline();
			return;
		}
		let e = this.session;
		if (e) switch (this.stopRingtone(), e.state) {
			case L.Initial: return;
			case L.Establishing:
				this.endReason = "canceled", await e.cancel();
				return;
			case L.Established:
				this.endReason = "local", await e.bye();
				return;
			default: return;
		}
	}
	setMuted(e) {
		this._muted = e;
		let t = this.peerConnection();
		if (t) for (let n of t.getSenders()) n.track?.kind === "audio" && (n.track.enabled = !e);
		this.emit({
			type: "muted",
			muted: e
		});
	}
	async sendDtmf(e) {
		let t = this.peerConnection()?.getSenders().find((e) => e.track?.kind === "audio" && e.dtmf);
		t?.dtmf ? t.dtmf.insertDTMF(e) : this.session && await this.session.info({ requestOptions: { body: {
			contentDisposition: "render",
			contentType: "application/dtmf-relay",
			content: `Signal=${e}\r\nDuration=160`
		} } });
	}
	async enableAudio() {
		this.ensureAudioElement();
		let e = !0;
		try {
			await this.audio?.play();
		} catch {
			e = !1;
		}
		if (this.ringtone) try {
			await this.ringtone.play();
		} catch {
			e = !1;
		}
		this.emit({ type: e ? "audio-unlocked" : "audio-blocked" });
	}
	restart() {
		(this.session || this.pending) && this.emit({
			type: "ended",
			reason: "failed",
			error: "The connection restarted."
		}), this.stop(), this.starting = void 0, this.ensureStarted().catch((e) => this.debug("restart failed", e));
	}
	stop() {
		this.stopped = !0, this.generation += 1, this.clearAutoAnswer(), this.stopRingtone(), this.visibilityHandler && typeof document < "u" && (document.removeEventListener("visibilitychange", this.visibilityHandler), this.visibilityHandler = void 0), this.reconnectTimer &&= (clearTimeout(this.reconnectTimer), void 0);
		try {
			this.registerer?.unregister();
		} catch {}
		try {
			this.ua?.stop();
		} catch {}
		this.registerer = void 0, this.ua = void 0, this.session = void 0, this.pending = void 0, this.detachAudio(), this.audio?.remove(), this.audio = void 0;
	}
	ensureAudioElement() {
		if (this.audio || typeof document > "u") return;
		let e = document.createElement("audio");
		e.id = `tessera-sip-audio-${Math.random().toString(36).slice(2, 8)}`, e.autoplay = !0, e.setAttribute("playsinline", ""), e.style.display = "none", document.body.appendChild(e), this.audio = e;
	}
	playRingtone() {
		if (!this.config.ringtone || typeof Audio > "u") return;
		this.stopRingtone();
		let e = new Audio(this.config.ringtone);
		e.loop = !0, this.ringtone = e, e.play().catch(() => {
			this.emit({ type: "audio-blocked" });
		});
	}
	stopRingtone() {
		if (this.ringtone) {
			try {
				this.ringtone.pause(), this.ringtone.src = "";
			} catch {}
			this.ringtone = void 0;
		}
	}
	clearAutoAnswer() {
		this.autoAnswerTimer &&= (clearTimeout(this.autoAnswerTimer), void 0);
	}
	peerConnection() {
		return this.session?.sessionDescriptionHandler?.peerConnection;
	}
	attachRemoteAudio(e) {
		this.ensureAudioElement();
		let t = e.sessionDescriptionHandler?.peerConnection;
		if (!t || !this.audio) return;
		let n = new MediaStream();
		for (let e of t.getReceivers()) e.track && n.addTrack(e.track);
		this.audio.srcObject = n, this.audio.play().catch(() => this.emit({ type: "audio-blocked" })), t.addEventListener("track", () => {
			if (!this.audio) return;
			let e = new MediaStream();
			for (let n of t.getReceivers()) n.track && e.addTrack(n.track);
			this.audio.srcObject = e;
		});
	}
	detachAudio() {
		this.audio && (this.audio.srcObject = null);
	}
}, Xn = (e) => new Yn(e), Zn = /* @__PURE__ */ new Map();
function Qn(e) {
	let t = Zn.get(e.key);
	return t || (t = Xn(e), Zn.set(e.key, t)), t;
}
function $n(e) {
	Xn = e, Zn.clear();
}
function er() {
	for (let e of Zn.values()) e.stop();
	Zn.clear();
}
// src/sip/sip-core.ts
async function tr(e) {
	if (!e.fetchWithAuth) return null;
	try {
		let t = await e.fetchWithAuth(`/api/sip-core/config?t=${Date.now()}`);
		return t.ok ? await t.json() : null;
	} catch {
		return null;
	}
}
async function nr(e) {
	if (!e.fetchWithAuth) return null;
	try {
		let t = await e.fetchWithAuth("/api/sip-core/asterisk-ingress");
		return t.ok ? (await t.json()).ingress_entry ?? null : null;
	} catch {
		return null;
	}
}
function rr(e, t) {
	let n = e.users ?? [];
	if (t?.id) {
		let e = n.find((e) => e.ha_username === t.id);
		if (e) return e;
	}
	if (t?.name) {
		let e = n.find((e) => e.ha_username === t.name);
		if (e) return e;
	}
	return e.backup_user;
}
// src/sip/uri.ts
var ir = 57e3;
function ar(e) {
	if (!e) return;
	let t = e.replace(/^sips?:/i, "").replace(/^<|>$/g, ""), n = t.lastIndexOf("@");
	if (!(n < 0)) return (t.slice(n + 1).split(/[;>]/)[0] ?? "").replace(/:\d+$/, "") || void 0;
}
function or(e) {
	if (e) return /^(?:sips?:)?([^@;>\s]+)@/i.exec(e.trim())?.[1];
}
function sr(e, t) {
	let n = e.trim();
	return /^sips?:/i.test(n) ? n : n.includes("@") ? `sip:${n}` : `sip:${n}@${t}`;
}
function cr(e, t) {
	return sr(e, t);
}
function lr(e) {
	return `wss://${e.replace(/^wss?:\/\//i, "").replace(/\/.*$/, "").replace(/:\d+$/, "")}:${ir}/ws`;
}
function ur(e) {
	let t = e.trim();
	return /^wss?:\/\//i.test(t) ? t : `wss://${t}`;
}
function dr(e, t) {
	let n = t.replace(/^http:/i, "ws:").replace(/^https:/i, "wss:"), r = e.startsWith("/") ? e : `/${e}`;
	return `${n.replace(/\/$/, "")}${r.replace(/\/$/, "")}/ws`;
}
// src/sip/resolve.ts
function fr(e) {
	let t = 5381;
	for (let n = 0; n < e.length; n += 1) t = t * 33 ^ e.charCodeAt(n);
	return (t >>> 0).toString(36);
}
function pr(e) {
	return e?.trim() || void 0;
}
function mr(e) {
	if (e) try {
		return new URL(e).hostname || void 0;
	} catch {
		return;
	}
}
function hr(e) {
	return e.origin ? e.origin : typeof window < "u" && window.location?.origin ? window.location.origin : "https://homeassistant.local";
}
async function gr(e, t, n = {}) {
	let r = [], i = null;
	if (e.useSipCore) {
		try {
			i = await (n.fetchCore ?? tr)(t);
		} catch {
			i = null;
		}
		i || r.push("SIP Core is not available; using the card's own settings.");
	}
	let a = i ? rr(i, t.user) : void 0;
	i && !a && r.push("No SIP Core account matches this Home Assistant user.");
	let o = e.wssUrl ?? pr(i?.custom_wss_url), s = !1;
	if (!o && i) {
		let e = await (n.fetchIngress ?? nr)(t).catch(() => null);
		e && (o = dr(e, hr(n)), s = !0);
	}
	let c = e.pbxServer ?? pr(i?.pbx_server) ?? ar(e.uri) ?? (s ? void 0 : mr(o));
	if (!o && c && (o = lr(c), r.push(`No WSS URL configured; using DoorPi's default ${o}. Set wss_url if your PBX listens elsewhere.`)), !o) throw new S("No WebSocket URL. Set `wss_url` (or configure SIP Core with a custom WSS URL).");
	let l = e.uri ?? e.extension ?? pr(a?.extension);
	if (!l) throw new S("No SIP account. Set `extension` (and `pbx_server`) or `uri`, or configure SIP Core.");
	let u = c ?? ar(e.uri);
	if (!u) throw new S("No SIP domain. Set `pbx_server`, or use a full `uri` such as sip:100@doorpi.example.");
	let d = sr(l, u), f = e.authUser ?? or(d);
	if (!f) throw new S(`Could not find a user in ${d}.`);
	if (!e.password && a && pr(a.extension) && or(d) !== pr(a.extension)) throw new S(`The card registers ${or(d)} but SIP Core's account is ${a.extension}. Set the dedicated extension's \`password\`, or use the same extension (not recommended).`);
	let ee = e.password ?? pr(a?.password);
	if (!ee) throw new S("No SIP password. Configure SIP Core, or set `password` on the card (ideally from a secret).");
	let p = a && !e.password && !e.uri ? "sip_core" : "manual", m = ur(o);
	return typeof window < "u" && window.location?.protocol === "https:" && m.startsWith("ws://") && r.push("A ws:// URL is blocked on an HTTPS page. Use wss:// (or test on localhost)."), {
		key: `${d}|${ur(o)}|${f}|${fr(ee)}`,
		uri: d,
		domain: u,
		authUser: f,
		password: ee,
		displayName: e.displayName ?? pr(a?.display_name) ?? e.name,
		wssUrl: m,
		iceServers: e.iceServers ?? i?.ice_config?.iceServers ?? [],
		iceTransportPolicy: e.iceTransportPolicy ?? i?.ice_config?.iceTransportPolicy ?? "all",
		iceGatheringTimeout: i?.ice_config?.iceGatheringTimeout ?? 2e3,
		video: e.video,
		autoAnswer: e.autoAnswer,
		autoAnswerDelay: e.autoAnswerDelay,
		callTargetUri: cr(e.callTarget, u),
		ringtone: e.ringtone ?? i?.incomingRingtoneUrl,
		source: p,
		warnings: r,
		debug: e.debug
	};
}
// src/ui/icon.ts
var _r = "M21.6 16.7v2.7a1.9 1.9 0 0 1-2.1 1.9 18.7 18.7 0 0 1-8.2-2.9 18.4 18.4 0 0 1-5.7-5.7A18.7 18.7 0 0 1 2.7 4.5 1.9 1.9 0 0 1 4.6 2.4h2.7a1.9 1.9 0 0 1 1.9 1.7c.1.9.4 1.8.7 2.7a1.9 1.9 0 0 1-.4 2L8.3 10a15.2 15.2 0 0 0 5.7 5.7l1.2-1.2a1.9 1.9 0 0 1 2-.4c.9.3 1.8.6 2.7.7a1.9 1.9 0 0 1 1.7 1.9Z", $ = (e, t, n = 1.08) => `M${e + n} ${t}a${n} ${n} 0 1 1-${n * 2} 0 ${n} ${n} 0 0 1${n * 2} 0Z`, vr = {
	doorbell: "M18 8.4a6 6 0 1 0-12 0c0 5.6-2.6 7.2-2.6 7.2h17.2S18 14 18 8.4Z M13.9 19.2a2.2 2.2 0 0 1-3.8 0 M2.4 4.2A13 13 0 0 1 5 1.6 M21.6 4.2A13 13 0 0 0 19 1.6",
	phone: _r,
	"phone-off": "M10.5 13.4a16 16 0 0 0 3.5 2.4l1.2-1.2a1.9 1.9 0 0 1 2-.4c.9.3 1.8.6 2.7.7a1.9 1.9 0 0 1 1.7 1.9v2.7a1.9 1.9 0 0 1-2.1 1.9 18.7 18.7 0 0 1-8.2-2.9 18 18 0 0 1-3.2-2.6 M4.7 11.2A18.7 18.7 0 0 1 2.7 4.5 1.9 1.9 0 0 1 4.6 2.4h2.7a1.9 1.9 0 0 1 1.9 1.7c.1.9.4 1.8.7 2.7a1.9 1.9 0 0 1-.4 2L8.3 10a15 15 0 0 0 .8 1.1 M3 3l18 18",
	"phone-incoming": "M16 2.8v6h6 M22.4 2.4l-6.8 6.8 " + _r,
	"phone-outgoing": "M22.4 8.8v-6h-6 M15.6 9.6l6.8-6.8 " + _r,
	microphone: "M12 2.6a3 3 0 0 0-3 3v6.1a3 3 0 0 0 6 0V5.6a3 3 0 0 0-3-3Z M19 10.7v1a7 7 0 0 1-14 0v-1 M12 18.7v2.7",
	"microphone-off": "M15 9.6V5.6a3 3 0 0 0-5.9-.6 M9 9.5v2.2a3 3 0 0 0 4.6 2.6 M5 10.7v1a7 7 0 0 0 10.6 6 M19 10.7v1a7 7 0 0 1-.8 3.3 M12 18.7v2.7 M3.6 3.2l16.8 17.6",
	refresh: "M21 12a9 9 0 1 1-3.1-6.8L21 8 M21 3v5h-5",
	keypad: $(7, 5) + $(12, 5) + $(17, 5) + $(7, 11.5) + $(12, 11.5) + $(17, 11.5) + $(7, 18) + $(12, 18) + $(17, 18),
	volume: "M11 5 6.5 9H3v6h3.5L11 19V5Z M15.4 8.6a5 5 0 0 1 0 6.8 M18.4 6a9 9 0 0 1 0 12",
	alert: "M10.4 3.9 2.9 16.9a2 2 0 0 0 1.7 3h14.8a2 2 0 0 0 1.7-3L13.6 3.9a1.9 1.9 0 0 0-3.2 0Z M12 9.2v4.2 M12 16.9h.01",
	check: "M4.5 12.8 9.4 17.6 19.5 6.8",
	clock: "M12 2.8a9.2 9.2 0 1 0 0 18.4 9.2 9.2 0 0 0 0-18.4Z M12 7.2V12l3.1 2",
	x: "M6 6l12 12 M18 6 6 18",
	door: "M4.5 21h15 M6.5 21V5.6a1.6 1.6 0 0 1 1.3-1.6l8-1.5a1.6 1.6 0 0 1 1.9 1.6V21 M14.4 12h.01"
}, yr = /* @__PURE__ */ new Set(["keypad"]), br = {
	bell: "doorbell",
	"door-open": "door",
	"door-closed": "door",
	gate: "door",
	call: "phone",
	"phone-classic": "phone",
	"phone-hangup": "phone-off",
	hangup: "phone-off",
	mic: "microphone",
	"mic-off": "microphone-off",
	sound: "volume",
	speaker: "volume",
	warning: "alert",
	error: "alert",
	reload: "refresh",
	digits: "keypad"
};
function xr(e, t) {
	let n = (e ?? "").trim().replace(/^mdi:/i, "").replace(/_/g, "-").toLowerCase(), r = vr[n] ? n : br[n] ?? n;
	return vr[r] ? r : vr[t] ? t : "doorbell";
}
function Sr(e, t = "doorbell") {
	let n = xr(e, t), r = yr.has(n);
	return Ee`<svg
    class="icon-svg"
    viewBox="0 0 24 24"
    fill=${r ? "currentColor" : "none"}
    stroke=${r ? "none" : "currentColor"}
    stroke-width="1.7"
    stroke-linecap="round"
    stroke-linejoin="round"
    focusable="false"
    aria-hidden="true"
  >
    <path d=${vr[n]}></path>
  </svg>`;
}
// src/ui/render.ts
function Cr(e) {
	let t = e.currentTarget;
	t && (t.style.visibility = "hidden");
}
function wr(e) {
	let t = e.currentTarget;
	t && (t.style.visibility = "visible");
}
var Tr = (e, t) => {
	let { view: n } = e, r = !!(n.primary && n.secondary), i = n.showCamera && !!e.cameraUrl, a = n.phase === "connected" ? n.hint : n.subtitle, o = !!a && a !== n.title, s = n.hint && n.hint !== a ? n.hint : void 0, c = n.registered ? "on" : n.busy ? "wait" : "off", l = (e, n) => b`
    <button
      type="button"
      class="key role-${n} kind-${e.kind}"
      data-action=${e.id}
      data-digit=${e.digit ?? x}
      aria-label=${e.digit ? `${e.label} (${e.digit})` : x}
      @click=${() => t.action(e)}
    >
      <span class="key-glyph" aria-hidden="true">
        ${Sr(e.icon, e.id === "dtmf" ? "keypad" : "phone")}
      </span>
      <span class="key-label">${e.label}</span>
      ${e.digit ? b`<span class="key-digit" aria-hidden="true">${e.digit}</span>` : x}
    </button>
  `, u = [
		"tsip",
		`phase-${n.phase}`,
		`tone-${n.tone}`,
		n.pulse ? "is-ringing" : "",
		n.busy ? "is-busy" : "",
		e.loading ? "is-loading" : "",
		i ? "has-camera" : "",
		e.error ? "is-fault" : ""
	].filter(Boolean).join(" ");
	return e.error ? b`
      <ha-card class=${u} data-phase="fault" aria-busy="false">
        <div class="wash" aria-hidden="true"></div>
        <div class="shell">
          <header class="head">
            <div class="disc">
              <span class="glyph" aria-hidden="true">${Sr("alert")}</span>
            </div>
            <div class="text">
              <p class="eyebrow"><span class="state" data-state="off">${Sr("alert")} SIP</span></p>
              <h2 class="title" title=${n.title}>${n.title}</h2>
              ${n.subtitle && n.subtitle !== n.title ? b`<p class="subtitle">${n.subtitle}</p>` : x}
            </div>
          </header>

          <p class="fault" role="status">${e.error}</p>

          ${n.primary ? b`<div class="actions solo">${l(n.primary, "primary")}</div>` : x}
        </div>
      </ha-card>
    ` : b`
    <ha-card
      class=${u}
      data-phase=${n.phase}
      data-tone=${n.tone}
      aria-busy=${n.busy || e.loading ? "true" : "false"}
    >
      ${i ? b`<div class="shot" aria-hidden="true">
            <img
              src=${e.cameraUrl}
              alt=""
              draggable="false"
              decoding="async"
              @error=${Cr}
              @load=${wr}
            />
          </div>` : x}
      <div class="wash" aria-hidden="true"></div>
      ${e.loading ? b`<span class="progress" aria-hidden="true"></span>` : x}

      <div class="shell">
        <header class="head">
          <div class="disc">
            ${n.busy ? b`<span class="spinner" aria-hidden="true"></span>` : x}
            <span class="glyph" aria-hidden="true">${Sr(n.icon)}</span>
            ${n.pulse ? b`<span class="halo" aria-hidden="true"></span>
                  <span class="halo halo-late" aria-hidden="true"></span>` : x}
          </div>

          <div class="text">
            <div class="eyebrow">
              ${((e) => b`
    <span class="state" data-state=${e}>
      ${Sr(e === "on" ? "check" : e === "wait" ? "clock" : "alert", "alert")}
      <span class="state-text">SIP</span>
    </span>
  `)(c)}
              ${n.duration ? b`<span class="rule" aria-hidden="true"></span>
                    <span class="clock" role="timer" aria-live="off">${n.duration}</span>` : x}
            </div>
            <div class="say" aria-live="polite" aria-atomic="true">
              <h2 class="title" title=${n.title}>${n.title}</h2>
              ${o ? b`<p class="subtitle">${a}</p>` : x}
            </div>
          </div>
        </header>

        ${s ? b`<p class="note">
              <span class="note-glyph" aria-hidden="true">${Sr("alert")}</span>
              <span class="note-text">${s}</span>
            </p>` : x}

        ${n.primary || n.secondary || n.controls.length > 0 ? b`<div class="panel">
              ${n.primary || n.secondary ? b`<div class="actions ${r ? "has-pair" : "solo"}">
                    ${n.primary ? l(n.primary, "primary") : x}
                    ${n.secondary ? l(n.secondary, "secondary") : x}
                  </div>` : x}
              ${n.controls.length > 0 ? b`<div class="keys">${n.controls.map((e) => l(e, "chip"))}</div>` : x}
            </div>` : x}
      </div>
    </ha-card>
  `;
}, Er = o`
  :host {
    display: block;
    container-type: inline-size;
    container-name: tsip;

    /* ── Palette ─────────────────────────────────────────────────────────── */
    --tsip-radius: 26px;
    --tsip-accent: var(--primary-color, #2f7fe0);
    --tsip-live: var(--success-color, #2f9e64);
    --tsip-ring: #e2943a;
    --tsip-danger: var(--error-color, #cf3f36);
    --tsip-ink: var(--primary-text-color, #171a1f);
    --tsip-fg: var(--primary-text-color, #171a1f);
    --tsip-muted: var(--secondary-text-color, #5f6875);
    --tsip-surface: var(--ha-card-background, var(--card-background-color, #ffffff));
    --tsip-on-ink: var(--ha-card-background, var(--card-background-color, #ffffff));
    --tsip-line: color-mix(in srgb, var(--tsip-ink) 13%, transparent);
    --tsip-focus: var(--primary-color, #2f7fe0);
    --tsip-danger-fill: color-mix(in srgb, var(--tsip-danger) 70%, #2a0806);
    --tsip-shadow: var(--ha-card-box-shadow, 0 12px 32px rgb(16 22 32 / 12%));

    /* ── Type ────────────────────────────────────────────────────────────── */
    --tsip-font: var(
      --ha-font-family-body,
      ui-rounded,
      "SF Pro Rounded",
      "Avenir Next",
      "Nunito",
      "Quicksand",
      "Varela Round",
      "Segoe UI Variable Display",
      "Ubuntu",
      system-ui,
      sans-serif
    );
    --tsip-ease: cubic-bezier(0.22, 0.78, 0.28, 1);
  }

  @media (prefers-color-scheme: dark) {
    :host {
      --tsip-ring: #f0aa53;
      --tsip-shadow: var(--ha-card-box-shadow, 0 14px 34px rgb(0 0 0 / 48%));
    }
  }

  /* ── The tile ──────────────────────────────────────────────────────────── */
  ha-card {
    position: relative;
    display: flex;
    flex-direction: column;
    isolation: isolate;
    overflow: hidden;
    box-sizing: border-box;
    width: 100%;
    min-height: 178px;
    padding: 16px;
    border-radius: var(--tsip-radius);
    background-color: var(--tsip-surface);
    color: var(--tsip-fg);
    font-family: var(--tsip-font);
    font-size: 15px;
    line-height: 1.25;
    box-shadow: var(--tsip-shadow);
    -webkit-tap-highlight-color: transparent;
    transition:
      background-color 0.3s var(--tsip-ease),
      color 0.3s var(--tsip-ease);
  }

  /* The hairline of the tile; while ringing it becomes a breathing frame. */
  ha-card::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 3;
    border-radius: inherit;
    pointer-events: none;
    box-shadow:
      inset 0 1px 0 rgb(255 255 255 / 22%),
      inset 0 0 0 1px color-mix(in srgb, var(--tsip-ink) 7%, transparent);
  }

  .tone-accent {
    --tsip-tone: var(--tsip-accent);
    --tsip-tint: 7%;
    --tsip-glow: 17%;
  }
  .tone-neutral {
    --tsip-tone: var(--tsip-muted);
    --tsip-tint: 5%;
    --tsip-glow: 12%;
  }
  .tone-ring {
    --tsip-tone: var(--tsip-ring);
    --tsip-tint: 11%;
    --tsip-glow: 27%;
  }
  .tone-live {
    --tsip-tone: var(--tsip-live);
    --tsip-tint: 8%;
    --tsip-glow: 19%;
  }
  .tone-danger {
    --tsip-tone: var(--tsip-danger);
    --tsip-tint: 7%;
    --tsip-glow: 18%;
  }

  .wash {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background-color: color-mix(in srgb, var(--tsip-tone) var(--tsip-tint), transparent);
    background-image: radial-gradient(
      120% 105% at 12% -14%,
      color-mix(in srgb, var(--tsip-tone) var(--tsip-glow), transparent) 0%,
      transparent 64%
    );
  }

  /* ── Camera still ─────────────────────────────────────────────────────── */
  .shot {
    position: absolute;
    inset: 0;
    z-index: 0;
    background: #101214;
  }
  .shot img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scale(1.015);
  }
  .shot::after {
    content: "";
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(
        180deg,
        rgb(8 10 13 / 46%) 0%,
        rgb(8 10 13 / 14%) 36%,
        rgb(8 10 13 / 50%) 74%,
        rgb(8 10 13 / 82%) 100%
      ),
      radial-gradient(90% 70% at 8% 100%, color-mix(in srgb, var(--tsip-tone) 24%, transparent), transparent 70%);
  }

  .has-camera {
    --tsip-fg: #ffffff;
    --tsip-muted: rgb(255 255 255 / 78%);
    --tsip-line: rgb(255 255 255 / 26%);
    color: #fff;
  }
  .has-camera .wash {
    display: none;
  }

  /* ── Shell ────────────────────────────────────────────────────────────── */
  .shell {
    position: relative;
    z-index: 2;
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    justify-content: center;
    gap: 12px;
    min-width: 0;
  }

  .head {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
    animation: tsip-rise 0.5s var(--tsip-ease) both;
  }

  /* ── Icon disc ────────────────────────────────────────────────────────── */
  .disc {
    position: relative;
    display: grid;
    flex: none;
    place-items: center;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: color-mix(in srgb, var(--tsip-tone) 16%, transparent);
    color: color-mix(in srgb, var(--tsip-tone) 62%, var(--tsip-ink));
    box-shadow:
      inset 0 0 0 1px color-mix(in srgb, var(--tsip-tone) 14%, transparent),
      inset 0 1px 0 rgb(255 255 255 / 26%);
    transition:
      background-color 0.3s var(--tsip-ease),
      color 0.3s var(--tsip-ease);
  }

  .glyph {
    display: grid;
    place-items: center;
    transition: transform 0.3s var(--tsip-ease);
  }
  .glyph svg {
    width: 24px;
    height: 24px;
  }

  .is-ringing .disc {
    box-shadow:
      inset 0 0 0 1px color-mix(in srgb, var(--tsip-tone) 22%, transparent),
      0 0 0 5px color-mix(in srgb, var(--tsip-tone) 15%, transparent),
      0 6px 18px color-mix(in srgb, var(--tsip-tone) 24%, transparent);
  }

  .phase-connected .disc::after {
    --tsip-dot-ring: var(--tsip-surface);
    content: "";
    position: absolute;
    right: 1px;
    bottom: 1px;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: var(--tsip-live);
    box-shadow: 0 0 0 3px var(--tsip-dot-ring);
    animation: tsip-blip 2.6s var(--tsip-ease) infinite;
  }

  /* Spinner: a ring around the phase glyph, never a spinning doorbell. */
  .spinner {
    position: absolute;
    inset: -2px;
    border-radius: 50%;
    border: 2px solid color-mix(in srgb, var(--tsip-tone) 20%, transparent);
    border-top-color: color-mix(in srgb, var(--tsip-tone) 78%, var(--tsip-ink));
    border-right-color: color-mix(in srgb, var(--tsip-tone) 52%, transparent);
    animation: tsip-spin 1.15s linear infinite;
  }
  .is-busy .glyph svg {
    width: 17px;
    height: 17px;
    opacity: 0.9;
  }

  /* Ringing halos. */
  .halo {
    position: absolute;
    inset: -3px;
    border-radius: 50%;
    border: 2px solid color-mix(in srgb, var(--tsip-tone) 62%, transparent);
    pointer-events: none;
    animation: tsip-halo 2.6s var(--tsip-ease) infinite;
  }
  .halo-late {
    animation-delay: 1.3s;
  }

  /* ── Text ─────────────────────────────────────────────────────────────── */
  .text {
    flex: 1 1 auto;
    min-width: 0;
  }

  .eyebrow {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 17px;
    margin: 0 0 3px;
    color: var(--tsip-muted);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.09em;
    text-transform: uppercase;
  }

  .state {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 7px 2px 5px;
    border-radius: 999px;
    background-color: color-mix(in srgb, var(--tsip-ink) 7%, transparent);
    white-space: nowrap;
  }
  .state svg {
    width: 12px;
    height: 12px;
    flex: none;
  }
  .state[data-state="on"] svg {
    color: var(--tsip-live);
  }
  .state[data-state="wait"] svg {
    color: var(--tsip-tone);
  }
  .state[data-state="off"] svg {
    color: var(--tsip-danger);
  }

  .rule {
    width: 1px;
    height: 11px;
    background: var(--tsip-line);
  }

  .clock {
    color: var(--tsip-fg);
    font-size: 14.5px;
    font-weight: 700;
    letter-spacing: 0.01em;
    font-variant-numeric: tabular-nums;
    text-transform: none;
  }

  .say {
    min-width: 0;
  }

  .title {
    display: -webkit-box;
    overflow: hidden;
    margin: 0;
    color: var(--tsip-fg);
    font-size: 20px;
    font-weight: 700;
    line-height: 1.12;
    letter-spacing: -0.022em;
    overflow-wrap: anywhere;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .subtitle {
    display: -webkit-box;
    overflow: hidden;
    margin: 3px 0 0;
    color: var(--tsip-muted);
    font-size: 13px;
    font-weight: 450;
    line-height: 1.35;
    overflow-wrap: anywhere;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  /* ── Note (a leftover error/notice line) ──────────────────────────────── */
  .note {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin: 0;
    padding: 8px 10px;
    border-radius: 13px;
    background-color: color-mix(in srgb, var(--tsip-danger) 9%, transparent);
    color: var(--tsip-fg);
    font-size: 12.5px;
    line-height: 1.35;
    animation: tsip-rise 0.5s var(--tsip-ease) 0.05s both;
  }
  .note-glyph {
    display: grid;
    flex: none;
    place-items: center;
    margin-top: 1px;
    color: var(--tsip-danger);
  }
  .note-glyph svg {
    width: 15px;
    height: 15px;
  }
  .note-text {
    min-width: 0;
    overflow-wrap: anywhere;
  }

  /* ── Panel: actions + extra keys ──────────────────────────────────────── */
  .panel {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 0;
    animation: tsip-rise 0.5s var(--tsip-ease) 0.06s both;
  }

  .actions {
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
  }
  .actions.has-pair {
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
  }

  /* ── Keys ─────────────────────────────────────────────────────────────── */
  .key {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    box-sizing: border-box;
    min-width: 0;
    min-height: 52px;
    padding: 0 14px;
    border: 1px solid transparent;
    border-radius: 999px;
    background: transparent;
    color: var(--tsip-ink);
    font-family: inherit;
    font-size: 14.5px;
    font-weight: 650;
    line-height: 1.1;
    letter-spacing: -0.005em;
    text-align: center;
    cursor: pointer;
    touch-action: manipulation;
    -webkit-appearance: none;
    appearance: none;
    transition:
      background-color 0.18s var(--tsip-ease),
      border-color 0.18s var(--tsip-ease),
      box-shadow 0.18s var(--tsip-ease),
      transform 0.16s var(--tsip-ease);
  }
  .key:active {
    transform: scale(0.982);
  }
  .key:focus-visible {
    outline: 3px solid var(--tsip-focus);
    outline-offset: 3px;
  }
  .key-glyph {
    display: grid;
    flex: none;
    place-items: center;
  }
  .key-glyph svg {
    width: 22px;
    height: 22px;
  }
  .key-label {
    overflow: hidden;
    min-width: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Primary: an ink pill, like Tessera's one bold answer button. */
  .role-primary {
    background-color: var(--tsip-ink);
    color: var(--tsip-on-ink);
    box-shadow:
      0 8px 20px color-mix(in srgb, var(--tsip-ink) 18%, transparent),
      inset 0 1px 0 rgb(255 255 255 / 12%);
  }
  .role-primary .key-glyph {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: color-mix(in srgb, var(--tsip-on-ink) 14%, transparent);
  }
  .role-primary .key-glyph svg {
    width: 18px;
    height: 18px;
  }
  .role-primary .key-label {
    font-size: 15px;
  }

  /* Danger: deep rose so white text stays readable in light and dark. */
  .key.kind-danger {
    background-color: var(--tsip-danger);
    background-color: var(--tsip-danger-fill);
    color: #fff;
    box-shadow:
      0 9px 22px color-mix(in srgb, var(--tsip-danger) 26%, transparent),
      inset 0 1px 0 rgb(255 255 255 / 16%);
  }
  .key.kind-danger .key-glyph {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: rgb(255 255 255 / 16%);
  }
  .key.kind-danger .key-glyph svg {
    width: 18px;
    height: 18px;
  }

  /* Secondary: the quiet half of a pair (decline). */
  .role-secondary {
    border-color: color-mix(in srgb, var(--tsip-ink) 10%, transparent);
    background-color: color-mix(in srgb, var(--tsip-ink) 6%, transparent);
    color: var(--tsip-ink);
  }
  .role-secondary .key-glyph {
    color: var(--tsip-danger);
  }

  /* Ghost: one-tap "turn on sound", always full width. */
  .keys .key.kind-ghost {
    flex: 1 0 100%;
    flex-direction: row;
    gap: 8px;
    max-width: none;
    min-height: 48px;
    padding: 0 14px;
    border-radius: 999px;
    font-size: 13px;
    background-color: color-mix(in srgb, var(--tsip-tone) 14%, transparent);
    border-color: color-mix(in srgb, var(--tsip-tone) 36%, transparent);
    color: var(--tsip-ink);
  }
  .keys .key.kind-ghost .key-glyph {
    background-color: color-mix(in srgb, var(--tsip-tone) 22%, transparent);
    color: color-mix(in srgb, var(--tsip-tone) 72%, var(--tsip-ink));
  }

  /* Chips: mute and the door's DTMF keys. */
  .keys {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
    min-width: 0;
  }
  .role-chip {
    flex: 1 1 74px;
    flex-direction: column;
    gap: 3px;
    max-width: 200px;
    min-height: 50px;
    padding: 6px 6px 7px;
    border-color: color-mix(in srgb, var(--tsip-ink) 8%, transparent);
    border-radius: 16px;
    background-color: color-mix(in srgb, var(--tsip-ink) 6%, transparent);
    font-size: 11.5px;
    font-weight: 600;
    line-height: 1.15;
  }
  .role-chip .key-glyph {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background-color: color-mix(in srgb, var(--tsip-tone) 14%, transparent);
    color: color-mix(in srgb, var(--tsip-tone) 70%, var(--tsip-ink));
  }
  .role-chip .key-glyph svg {
    width: 15px;
    height: 15px;
  }
  .role-chip .key-label {
    display: -webkit-box;
    max-width: 100%;
    overflow: hidden;
    white-space: normal;
    overflow-wrap: anywhere;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
  .key-digit {
    position: absolute;
    top: 5px;
    right: 7px;
    color: var(--tsip-muted);
    font-size: 9.5px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    line-height: 1;
  }

  /* ── Loading + spinner bars ───────────────────────────────────────────── */
  .progress {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    z-index: 4;
    height: 3px;
    overflow: hidden;
    background-color: color-mix(in srgb, var(--tsip-tone) 16%, transparent);
  }
  .progress::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    width: 38%;
    border-radius: 3px;
    background: var(--tsip-tone);
    animation: tsip-load 1.35s var(--tsip-ease) infinite;
  }

  /* ── Fault (configuration / resolution error) ─────────────────────────── */
  .is-fault .shell {
    gap: 10px;
  }
  .fault {
    margin: 0;
    color: var(--tsip-muted);
    font-size: 12.5px;
    font-weight: 450;
    line-height: 1.45;
    overflow-wrap: anywhere;
    user-select: text;
    animation: tsip-rise 0.5s var(--tsip-ease) 0.04s both;
  }
  .is-fault .actions {
    max-width: 380px;
    margin-top: 2px;
  }

  /* ── Camera-mode materials ────────────────────────────────────────────── */
  .has-camera .disc {
    background-color: rgb(10 13 16 / 46%);
    color: #fff;
    box-shadow:
      inset 0 0 0 1px rgb(255 255 255 / 24%),
      0 2px 10px rgb(0 0 0 / 20%);
  }
  .has-camera .spinner {
    border-color: rgb(255 255 255 / 22%);
    border-top-color: #fff;
    border-right-color: rgb(255 255 255 / 55%);
  }
  .has-camera .state {
    background-color: rgb(255 255 255 / 16%);
  }
  .has-camera .state[data-state="on"] svg,
  .has-camera .state[data-state="off"] svg {
    color: #fff;
  }
  .has-camera .key.role-secondary,
  .has-camera .key.role-chip {
    border-color: rgb(255 255 255 / 20%);
    background-color: rgb(12 15 18 / 52%);
    color: #fff;
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
  }
  .has-camera .key.role-secondary .key-glyph {
    background: transparent;
    color: #ffc3ba;
  }
  .has-camera .key.role-chip .key-glyph {
    background-color: rgb(255 255 255 / 16%);
    color: #fff;
  }
  .has-camera .key.kind-ghost {
    border-color: rgb(255 255 255 / 40%);
    background-color: rgb(255 255 255 / 18%);
    color: #fff;
  }
  .has-camera .key.kind-ghost .key-glyph {
    background-color: rgb(255 255 255 / 22%);
    color: #fff;
  }
  .has-camera .note {
    background-color: rgb(10 12 15 / 55%);
    color: #fff;
  }
  .has-camera .note-glyph {
    color: #ffb4ac;
  }
  .has-camera.phase-connected .disc::after {
    --tsip-dot-ring: rgb(10 13 16 / 78%);
  }
  .has-camera .progress {
    background-color: rgb(255 255 255 / 18%);
  }
  .has-camera .progress::before {
    background: #fff;
  }

  /* ── Ringing ──────────────────────────────────────────────────────────── */
  .is-ringing::after {
    box-shadow:
      inset 0 1px 0 rgb(255 255 255 / 25%),
      inset 0 0 0 2px color-mix(in srgb, var(--tsip-ring) 58%, transparent);
    animation: tsip-frame 2.4s ease-in-out infinite;
  }

  /* ── Hover, only where a pointer can hover ────────────────────────────── */
  @media (hover: hover) {
    .role-primary:hover {
      filter: brightness(1.06);
    }
    .key.kind-danger:hover {
      filter: brightness(1.08);
    }
    .role-secondary:hover,
    .role-chip:hover {
      border-color: color-mix(in srgb, var(--tsip-ink) 22%, transparent);
      background-color: color-mix(in srgb, var(--tsip-ink) 9%, transparent);
    }
    .has-camera .key.role-secondary:hover,
    .has-camera .key.role-chip:hover {
      border-color: rgb(255 255 255 / 40%);
      background-color: rgb(12 15 18 / 66%);
    }
  }

  /* ── Size steps: 1×2 tile → 2×2 / wall panel → full width ─────────────── */
  @container tsip (min-width: 360px) {
    ha-card {
      --tsip-radius: 28px;
      min-height: 186px;
      padding: 18px;
    }
    .shell {
      gap: 12px;
    }
    .head {
      gap: 13px;
    }
    .disc {
      width: 54px;
      height: 54px;
    }
    .glyph svg {
      width: 26px;
      height: 26px;
    }
    .title {
      font-size: 22px;
    }
    .subtitle {
      font-size: 13.5px;
    }
    .clock {
      font-size: 16px;
    }
    .key {
      min-height: 54px;
    }
    .role-chip {
      min-height: 52px;
    }
    .key-glyph svg {
      width: 23px;
      height: 23px;
    }
    .panel {
      gap: 9px;
    }
  }

  @container tsip (min-width: 620px) {
    ha-card {
      --tsip-radius: 32px;
      min-height: 190px;
      padding: 20px 22px;
    }
    .shell {
      display: grid;
      grid-template-areas:
        "head panel"
        "note panel";
      grid-template-columns: minmax(200px, 1fr) minmax(280px, min(42%, 420px));
      align-content: center;
      align-items: center;
      column-gap: 28px;
      row-gap: 10px;
    }
    .head {
      grid-area: head;
      gap: 15px;
    }
    .note {
      grid-area: note;
    }
    .panel {
      grid-area: panel;
      gap: 9px;
    }
    .disc {
      width: 60px;
      height: 60px;
    }
    .glyph svg {
      width: 28px;
      height: 28px;
    }
    .title {
      font-size: 27px;
      letter-spacing: -0.028em;
    }
    .subtitle {
      max-width: 46ch;
      font-size: 14.5px;
    }
    .clock {
      font-size: 18px;
    }
    .key {
      min-height: 56px;
      font-size: 15.5px;
    }
    .role-primary .key-label {
      font-size: 16px;
    }
    .role-chip {
      min-height: 56px;
      font-size: 12px;
    }
    .role-chip .key-glyph {
      width: 28px;
      height: 28px;
    }
    .role-chip .key-glyph svg {
      width: 16px;
      height: 16px;
    }
    .key-glyph svg {
      width: 24px;
      height: 24px;
    }
    .role-primary .key-glyph svg,
    .key.kind-danger .key-glyph svg {
      width: 19px;
      height: 19px;
    }
    .is-fault .shell {
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }
    .is-fault .fault {
      max-width: 62ch;
    }
  }

  @container tsip (min-width: 760px) {
    .title {
      font-size: 30px;
    }
    .subtitle {
      font-size: 15px;
    }
    .shell {
      column-gap: 40px;
    }
  }

  /* ── Motion ───────────────────────────────────────────────────────────── */
  @keyframes tsip-rise {
    from {
      opacity: 0;
      transform: translateY(7px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes tsip-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes tsip-halo {
    0% {
      opacity: 0.65;
      transform: scale(0.82);
    }
    70%,
    100% {
      opacity: 0;
      transform: scale(1.42);
    }
  }

  @keyframes tsip-frame {
    0%,
    100% {
      opacity: 0.45;
    }
    50% {
      opacity: 1;
    }
  }

  @keyframes tsip-blip {
    0%,
    100% {
      box-shadow: 0 0 0 3px var(--tsip-dot-ring);
    }
    50% {
      box-shadow:
        0 0 0 3px var(--tsip-dot-ring),
        0 0 0 6px color-mix(in srgb, var(--tsip-live) 22%, transparent);
    }
  }

  @keyframes tsip-load {
    from {
      transform: translateX(-110%);
    }
    to {
      transform: translateX(280%);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .head,
    .panel,
    .note,
    .fault,
    .progress::before,
    .halo,
    .spinner,
    .state[data-state="wait"] svg,
    .phase-connected .disc::after,
    .is-ringing::after {
      animation: none;
    }
    .halo {
      display: none;
    }
    .is-ringing::after {
      opacity: 1;
    }
    .progress::before {
      width: 100%;
      opacity: 0.55;
    }
    .key {
      transition: none;
    }
    .key:active {
      transform: none;
    }
  }
`, Dr = {
	phase: "error",
	tone: "danger",
	icon: "alert",
	title: "Tessera SIP",
	subtitle: "Configuration",
	controls: [],
	pulse: !1,
	busy: !1,
	showCamera: !1,
	registered: !1,
	muted: !1
}, Or = class extends We {
	constructor(...e) {
		super(...e), this._model = pt(), this._loading = !1, this._booted = !1, this._bootToken = 0, this._now = Date.now(), this._tickCount = 0;
	}
	static {
		this.styles = Er;
	}
	static getStubConfig() {
		return {
			name: "Front door",
			call_target: "555",
			call_label: "Pick up the doorbell",
			camera: "camera.front_door"
		};
	}
	static getConfigElement() {
		return document.createElement("tessera-sip-card-editor");
	}
	getCardSize() {
		return 3;
	}
	getGridOptions() {
		return {
			columns: 6,
			rows: 3,
			min_columns: 3,
			min_rows: 2
		};
	}
	connectedCallback() {
		super.connectedCallback(), this.bootstrap();
	}
	disconnectedCallback() {
		this.stopTicker(), this.unsubscribeAll(), this._client && this._client.key, super.disconnectedCallback();
	}
	set hass(e) {
		let t = !this._hass;
		this._hass = e, this._now = Date.now(), this.refreshCamera(), t || !this._booted ? this.bootstrap() : this.requestUpdate();
	}
	get hass() {
		return this._hass;
	}
	setConfig(e) {
		if (!e || typeof e != "object") throw new S("The card needs a configuration object.");
		this._raw = e, this._bootToken += 1, this.unsubscribeAll(), this.stopTicker(), this._booted = !1, this._client = void 0, this._resolved = void 0, this._model = pt(), this._lastStateValue = void 0, this._lastPeerValue = void 0, this._lastCommand = void 0;
		try {
			this._config = tt(e), this._configError = void 0;
		} catch (e) {
			this._config = void 0, this._configError = e instanceof Error ? e.message : String(e);
		}
		this.requestUpdate(), this.bootstrap();
	}
	async bootstrap() {
		if (!this._raw || !this._hass || this._configError || !this._config) return;
		let e = ++this._bootToken;
		this.unsubscribeAll();
		let t = this._hass, n = this._config;
		this._loading = !0, this._error = void 0, this.requestUpdate();
		let r;
		try {
			r = await gr(n, t);
		} catch (t) {
			if (e !== this._bootToken) return;
			this._loading = !1, this._error = t instanceof Error ? t.message : String(t), this._model = T(pt(), {
				type: "error",
				message: this._error
			}), this.requestUpdate();
			return;
		}
		if (e !== this._bootToken) return;
		this._resolved = r, r.warnings.length > 0 && console.info("tessera-sip-card:", r.warnings.join(" ")), r.source === "sip_core" && typeof customElements < "u" && customElements.get("sip-call-button") && console.warn("tessera-sip-card: SIP Core is loaded on this page and registers the same extension. Use a dedicated extension (set `extension` and `password`) or the two user agents will replace each other's registration.");
		let i = Qn(r);
		this._client = i, this._unsubClient = i.on((e) => this.onClientEvent(e)), this._loading = !1, this._booted = !0;
		for (let e of i.describe()) this.onClientEvent(e, !0);
		i.ensureStarted().catch((e) => this.onActionError(e)), await this.subscribeCommands(e), this.publishState(), this.requestUpdate();
	}
	unsubscribeAll() {
		this._unsubClient?.(), this._unsubClient = void 0, this._unsubState?.(), this._unsubState = void 0, this._unsubEvent?.(), this._unsubEvent = void 0;
	}
	async subscribeCommands(e) {
		let t = this._hass, n = this._config, r = t?.connection;
		if (t && n && r?.subscribeEvents) try {
			if (n.commandEntity) {
				let e = n.commandEntity;
				this._unsubState = await r.subscribeEvents((r) => {
					let i = r.data;
					if (i.entity_id !== e) return;
					let a = i.new_state?.state;
					if (!a || a === this._lastCommand) return;
					this._lastCommand = a;
					let o = rt(a);
					o && this.runCommand(o), n.clearCommand && st(t, e, "");
				}, "state_changed");
			}
			if (e !== this._bootToken) return;
			this._unsubEvent = await r.subscribeEvents((e) => {
				let t = it(e.data);
				t && this.runCommand(t);
			}, `${n.eventType}_command`);
		} catch (e) {
			console.warn("tessera-sip-card: could not subscribe to commands", e);
		}
	}
	onClientEvent(e, t = !1) {
		let n = this._model, r = T(n, e, Date.now());
		this._model = r, t || this.afterTransition(n, r, e), this.refreshCamera(), this.updateTicker(), this.requestUpdate();
	}
	afterTransition(e, t, n) {
		switch (n.type) {
			case "registration":
				n.state === "registered" ? this.fire("registered", t) : n.state === "unregistered" ? this.fire("unregistered", t, n.error) : n.state === "failed" && this.fire("error", t, n.error);
				break;
			case "incoming":
				this.fire("ringing", t);
				break;
			case "outgoing":
				this.fire("dialing", t);
				break;
			case "connected":
				this.fire("answered", t), this._config?.answerScript && ot(this._hass, this._config.answerScript);
				break;
			case "ended": {
				let r = e.callStarted === void 0 ? void 0 : Math.max(0, Math.round((Date.now() - e.callStarted) / 1e3));
				this.fire("ended", t, n.error, r), this._config?.endScript && ot(this._hass, this._config.endScript);
				break;
			}
			case "error": this.fire("error", t, n.message);
		}
		this.publishState();
	}
	fire(e, t, n, r) {
		let i = this._config, a = this._hass;
		if (!i || !a) return;
		let o = `${e}|${t.phase}|${t.peer ?? ""}|${n ?? ""}`, s = Date.now();
		if (!(this._lastFire && this._lastFire.key === o && s - this._lastFire.at < 800)) {
			if (this._lastFire = {
				key: o,
				at: s
			}, i.eventEntity) {
				let o = [
					e,
					t.phase,
					t.peerName ?? t.peer ?? "",
					r ?? "",
					n ?? "",
					s
				].join("|").slice(0, 255);
				st(a, i.eventEntity, o);
			}
			at(a, i.eventType, {
				card: i.id,
				event: e,
				phase: t.phase,
				peer: t.peerName ?? t.peer,
				direction: t.direction,
				duration: r,
				error: n,
				timestamp: new Date(s).toISOString()
			});
		}
	}
	publishState() {
		let e = this._config, t = this._hass;
		if (!e || !t) return;
		let n = this._model.phase;
		e.stateEntity && n !== this._lastStateValue && (this._lastStateValue = n, st(t, e.stateEntity, n));
		let r = this._model.peerName ?? this._model.peer ?? "";
		e.peerEntity && r !== this._lastPeerValue && (this._lastPeerValue = r, st(t, e.peerEntity, r));
	}
	onFailure(e) {
		let t = e instanceof Error ? e.message : String(e);
		this._error = t, this._model = T(this._model, {
			type: "error",
			message: t
		}), this.fire("error", this._model, t), this.requestUpdate();
	}
	onActionError(e) {
		let t = e instanceof Error ? e.message : String(e);
		this._model = T(this._model, {
			type: "error",
			message: t
		}), this.fire("error", this._model, t), this.requestUpdate();
	}
	refreshCamera() {
		this._cameraUrl = ct(this._hass, this._config?.camera);
	}
	updateTicker() {
		let e = this._model.phase === "connected";
		e && !this._ticker ? this._ticker = setInterval(() => {
			this._now = Date.now(), this._tickCount += 1, this._tickCount % 10 == 0 && this.refreshCamera(), this.requestUpdate();
		}, 1e3) : !e && this._ticker && this.stopTicker();
	}
	stopTicker() {
		this._ticker &&= (clearInterval(this._ticker), void 0);
	}
	handleAction(e) {
		let t = this._client;
		switch (e.id) {
			case "call":
				t?.call().catch((e) => this.onActionError(e));
				break;
			case "answer":
				t?.answer().catch((e) => this.onActionError(e));
				break;
			case "decline":
				t?.decline().catch((e) => this.onActionError(e));
				break;
			case "hangup":
				t?.hangup().catch((e) => this.onActionError(e));
				break;
			case "mute":
				t?.setMuted(!0);
				break;
			case "unmute":
				t?.setMuted(!1);
				break;
			case "dtmf":
				e.digit && t?.sendDtmf(e.digit).catch((e) => this.onActionError(e));
				break;
			case "enable_audio":
				this.enableAudio();
				break;
			case "retry": this.retry();
		}
	}
	async enableAudio() {
		try {
			await this._client?.enableAudio(), this._model = T(this._model, { type: "audio-unlocked" });
		} catch (e) {
			this._model = T(this._model, { type: "audio-blocked" }), this.onActionError(e);
		}
		this.requestUpdate();
	}
	retry() {
		this._error = void 0, this._model = T(this._model, { type: "retry" }), !this._client || !this._resolved ? (this._booted = !1, this.bootstrap()) : this._client.restart(), this.requestUpdate();
	}
	async runCommand(e) {
		let t = this._client;
		if (t) try {
			switch (e.action) {
				case "answer":
					await t.answer();
					break;
				case "decline":
					await t.decline();
					break;
				case "hangup":
					await t.hangup();
					break;
				case "retry":
					this.retry();
					break;
				case "mute":
					t.setMuted(!0);
					break;
				case "unmute":
					t.setMuted(!1);
					break;
				case "enable_audio":
					await this.enableAudio();
					break;
				case "call":
					await t.call(e.value && this._resolved ? cr(e.value, this._resolved.domain) : void 0);
					break;
				case "dtmf": if (e.value) for (let n of e.value) /[0-9*#]/.test(n) && await t.sendDtmf(n);
			}
		} catch (e) {
			this.onActionError(e);
		}
	}
	uiModel() {
		let e = this._config, t = dt(e?.language ?? this._hass?.locale?.language);
		return {
			view: e ? vt(this._model, e, t, this._now) : {
				...Dr,
				hint: this._configError
			},
			config: e,
			cameraUrl: this._cameraUrl,
			error: this._configError ?? this._error,
			loading: this._loading,
			audioBlocked: this._model.audioBlocked,
			now: this._now
		};
	}
	render() {
		return Tr(this.uiModel(), {
			action: (e) => this.handleAction(e),
			enableAudio: () => void this.enableAudio()
		});
	}
};
// src/index.ts
customElements.get("tessera-sip-card") || customElements.define("tessera-sip-card", Or), window.customCards = window.customCards ?? [], window.customCards.some((e) => e.type === "tessera-sip-card") || window.customCards.push({
	type: "tessera-sip-card",
	name: "Tessera SIP",
	description: "Answer a SIP doorbell and talk, with the look of a Tessera tile.",
	preview: !0,
	documentationURL: "https://github.com/Babo96/tessera-sip-card"
}), typeof window < "u" && window.addEventListener("pagehide", () => er());
export { Or as TesseraSipCard, qe as TesseraSipCardEditor, Qn as acquireClient, T as applyEvent, vt as deriveView, pt as initialModel, tt as normalizeConfig, $n as setClientFactory, er as stopAllClients };

//# sourceMappingURL=tessera-sip-card.js.map