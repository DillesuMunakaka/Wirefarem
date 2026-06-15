/* ============================================================
   Onefinity — "Build Your CNC" configurator (Alpine component).
   Exposed as window.buildWizard so build.html can use
   x-data="buildWizard()". Reads steps from OF_DATA.wizard.
   In Shopify this maps to a product with line-item properties
   (each step key + chosen option) added to cart via /cart/add.
   ============================================================ */
window.buildWizard = function () {
  var D = window.OF_DATA;
  var DEFAULT = function () {
    return { size:'woodworker', software:'carveco', spindle:'redline2', table:'qcw', dust:'none', probe:'yes', atc:'no', rotary:'no', addons:[], variants:{} };
  };

  return {
    wizard: D.wizard,
    freebies: D.freebies,
    wStep: 0,
    build: DEFAULT(),
    activeDot: null,
    cfgDetail: null,   // { stepKey, optId }
    cfgVariant: null,  // { stepKey, optId }
    previewOpen: false,

    money: function (n) { return Alpine.store('shop').money(n); },

    /* ---- step state ---- */
    get step() { return this.wizard[this.wStep] || this.wizard[0]; },
    get totalSteps() { return this.wizard.length; },
    get isReview() { return this.step.kind === 'review'; },
    get isLast() { return this.wStep === this.totalSteps - 1; },
    get canBack() { return this.wStep > 0; },
    get railFillPct() { return this.totalSteps > 1 ? Math.round(this.wStep / (this.totalSteps - 1) * 100) : 0; },
    get nextLabel() { return this.isLast ? 'Add to Cart ✓' : 'Next →'; },
    get stepEyebrow() { return 'Step ' + (this.wStep + 1) + ' · ' + this.step.eyebrow; },

    findStep: function (key) { return this.wizard.find(function (w) { return w.key === key; }); },
    selOpt: function (key) {
      var st = this.findStep(key); if (!st) return null;
      var v = this.build[key];
      return st.options.find(function (o) { return o.id === v; }) || null;
    },
    addonOpt: function (id) { return this.findStep('addons').options.find(function (o) { return o.id === id; }); },

    isSelected: function (step, opt) {
      if (step.kind === 'multi') return this.build.addons.indexOf(opt.id) >= 0;
      return this.build[step.key] === opt.id;
    },
    chooseOpt: function (step, opt) {
      if (step.kind === 'multi') { this.toggleAddon(opt.id); return; }
      this.build[step.key] = opt.id;
      if (opt.variants) this.cfgVariant = { stepKey: step.key, optId: opt.id };
    },
    toggleAddon: function (id) {
      var i = this.build.addons.indexOf(id);
      if (i >= 0) this.build.addons.splice(i, 1); else this.build.addons.push(id);
    },

    /* ---- variant helpers (controller etc.) ---- */
    variantDelta: function (key) {
      var o = this.selOpt(key); if (!o || !o.variants) return 0;
      var i = this.build.variants[key] || 0; return (o.variants[i] || {}).delta || 0;
    },
    variantLabelOf: function (key) {
      var o = this.selOpt(key); if (!o || !o.variants) return '';
      var i = this.build.variants[key] || 0; return (o.variants[i] || {}).label || '';
    },
    pickCfgVariant: function (i) { if (this.cfgVariant) this.build.variants[this.cfgVariant.stepKey] = i; },

    /* ---- option card display helpers ---- */
    optPriceFmt: function (o) { return o.price > 0 ? this.money(o.price) : 'No Charge'; },
    statusLabel: function (step, opt) {
      var sel = this.isSelected(step, opt);
      if (step.kind === 'multi') return sel ? 'Added to build' : 'Tap to add';
      if (sel) return opt.variants ? ('Selected · ' + this.variantLabelOf(step.key)) : 'Selected';
      return 'Tap to select';
    },
    badgeColor: function (o) { return o.badgeColor || (o.price > 0 ? '#479D6E' : '#5A6066'); },

    /* ---- totals ---- */
    buildTotal: function () {
      var t = 0, self = this;
      ['size', 'software', 'spindle', 'table', 'dust'].forEach(function (k) { var o = self.selOpt(k); if (o) t += o.price; });
      t += this.variantDelta('size');
      ['probe', 'atc', 'rotary'].forEach(function (k) { var o = self.selOpt(k); if (o) t += o.price; });
      this.build.addons.forEach(function (id) { var o = self.addonOpt(id); if (o) t += o.price; });
      return t;
    },
    get buildTotalFmt() { return this.money(this.buildTotal()); },
    sizeLabel: function () { var o = this.selOpt('size'); return o ? o.name : 'Onefinity'; },

    /* ---- review summary ---- */
    summaryLines: function () {
      var lines = [], self = this, FORE = D.IMG.foreman;
      ['size', 'software', 'spindle', 'table', 'dust'].forEach(function (k) {
        var o = self.selOpt(k);
        if (o && (o.price > 0 || k === 'size' || (k === 'software' && o.id === 'carveco')))
          lines.push({ key: k, label: o.name, price: o.price, img: o.img || FORE });
      });
      var cv = this.variantLabelOf('size');
      if (cv) lines.push({ key: 'ctrl', label: 'Controller · ' + cv, price: this.variantDelta('size'), img: (this.selOpt('size') || {}).img || FORE });
      ['probe', 'atc', 'rotary'].forEach(function (k) { var o = self.selOpt(k); if (o && o.price > 0) lines.push({ key: k, label: o.name, price: o.price, img: o.img }); });
      this.build.addons.forEach(function (id) { var o = self.addonOpt(id); if (o) lines.push({ key: 'a-' + id, label: o.name, price: o.price, img: o.img }); });
      this.freebies.forEach(function (f) { lines.push({ key: f.key, label: f.label, price: 0, img: f.img, free: true, was: f.was }); });
      return lines;
    },
    get freeGiftCount() { return this.freebies.length; },

    /* ---- navigation ---- */
    goto: function (i) { this.wStep = Math.max(0, Math.min(this.totalSteps - 1, i)); this.activeDot = null; this.scrollTop(); },
    next: function () { if (this.isLast) this.addToCart(); else this.goto(this.wStep + 1); },
    back: function () { this.goto(this.wStep - 1); },
    scrollTop: function () {
      try {
        var el = document.querySelector('[data-build-anchor]');
        if (el) { var y = el.getBoundingClientRect().top + window.scrollY - 8; window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' }); }
      } catch (e) {}
    },
    reset: function () {
      this.build = DEFAULT(); this.wStep = 0; this.activeDot = null; this.previewOpen = false;
      Alpine.store('shop').pushToast('Build reset', 'Starting fresh from step 1');
      this.scrollTop();
    },
    addToCart: function () {
      var comps = this.summaryLines();
      Alpine.store('shop').add({
        id: 'build-' + Date.now(),
        name: 'Custom ' + this.sizeLabel() + ' Build',
        price: this.buildTotal(),
        img: (this.selOpt('size') || {}).img || D.IMG.foreman,
        sub: comps.length + ' items · ' + this.freebies.length + ' free gifts',
        custom: true,
      }, true);
    },

    /* ---- detail modal ---- */
    openDetail: function (step, opt) { this.cfgDetail = { stepKey: step.key, optId: opt.id }; },
    closeDetail: function () { this.cfgDetail = null; },
    get detail() {
      if (!this.cfgDetail) return null;
      var st = this.findStep(this.cfgDetail.stepKey); var self = this;
      var o = st && st.options.find(function (x) { return x.id === self.cfgDetail.optId; });
      return o ? { step: st, opt: o } : null;
    },
    selectDetail: function () { var d = this.detail; if (d) { this.chooseOpt(d.step, d.opt); this.cfgDetail = null; } },

    /* ---- in-build variant modal ---- */
    get cfgVar() {
      if (!this.cfgVariant) return null;
      var st = this.findStep(this.cfgVariant.stepKey); var self = this;
      var o = st && st.options.find(function (x) { return x.id === self.cfgVariant.optId; });
      return (o && o.variants) ? { step: st, opt: o } : null;
    },
    closeCfgVariant: function () { this.cfgVariant = null; },

    /* ---- live preview ---- */
    get stage() {
      var self = this, b = this.build;
      var spColor = b.spindle === 'redline2' ? '#479D6E' : (b.spindle === 'redline15' ? '#7FAE94' : (b.spindle === 'router' ? '#B8901F' : '#5A6066'));
      var chips = [];
      ['software', 'probe', 'atc', 'rotary'].forEach(function (k) { var o = self.selOpt(k); if (o && o.price > 0) chips.push(o.name.split(' ').slice(0, 2).join(' ')); });
      b.addons.forEach(function (id) { var o = self.addonOpt(id); if (o) chips.push(o.name.split(' ').slice(0, 2).join(' ')); });
      return {
        baseLabel: (this.selOpt('size') || {}).name || '',
        spColor: spColor,
        tableOn: b.table !== 'none', dustOn: b.dust !== 'none', atcOn: b.atc === 'yes', rotaryOn: b.rotary === 'yes',
        chips: chips,
      };
    },
    get previewDots() {
      var self = this;
      var data = [
        { id: 'size', left: '50%', top: '78%', key: 'size' },
        { id: 'spindle', left: '50%', top: '34%', key: 'spindle' },
        { id: 'table', left: '18%', top: '72%', key: 'table' },
        { id: 'dust', left: '72%', top: '46%', key: 'dust' },
        { id: 'probe', left: '30%', top: '58%', key: 'probe' },
      ];
      return data.map(function (d) {
        var o = self.selOpt(d.key);
        var added = !!(o && o.price > 0) || d.key === 'size' || d.key === 'spindle';
        return {
          id: d.id, left: d.left, top: d.top, key: d.key, added: added,
          label: o ? o.name : 'Not added',
          priceFmt: (o && o.price > 0) ? self.money(o.price) : (added ? 'Included' : 'Optional — tap to add'),
          stepIdx: self.wizard.findIndex(function (w) { return w.key === d.key; }),
        };
      });
    },
    toggleDot: function (id) { this.activeDot = this.activeDot === id ? null : id; },
    editDot: function (idx) { this.activeDot = null; this.previewOpen = false; this.goto(idx); },

    init: function () { this.$nextTick(function () {}); },
  };
};
