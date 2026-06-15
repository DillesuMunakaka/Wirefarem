/* ============================================================
   Onefinity — shared theme behaviour (Alpine.js).
   Loaded as a NORMAL script before the deferred Alpine CDN.
   Responsibilities:
     1. Inject shared chrome (header / overlays / footer) into
        <div id="site-header"></div> and <div id="site-footer"></div>.
     2. Register the global Alpine store `shop` (cart, currency,
        UI flags, toasts) with localStorage persistence so the
        cart survives navigation between the separate page files.
   For Shopify: the header/footer markup maps to sections /
   snippets, and the cart store maps to /cart.js AJAX + cart
   drawer. Data comes from data.js (window.OF_DATA).
   ============================================================ */
(function () {
  var D = window.OF_DATA || {};

  // Mark JS available so CSS reveal-hiding only applies when JS can un-hide.
  document.documentElement.classList.add('js');

  // Favicon from the brand mark (SVG data URI) — applied to every page.
  (function () {
    var d = 'M2.6 3 Q2.6 1.4 4.2 1.4 H29.8 Q31.4 1.4 31.4 3 V47 L17 39.4 L2.6 47 Z';
    var st = '';
    for (var i = 0; i < 4; i++) st += '<rect x="-16" y="' + (1 + i * 12.2) + '" width="70" height="7" fill="#fff" transform="rotate(-32 17 24)"/>';
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 50"><clipPath id="fv"><path d="' + d + '"/></clipPath><path d="' + d + '" fill="#479D6E"/><g clip-path="url(#fv)">' + st + '</g></svg>';
    var link = document.querySelector('link[rel="icon"]') || document.createElement('link');
    link.rel = 'icon'; link.type = 'image/svg+xml';
    link.href = 'data:image/svg+xml,' + encodeURIComponent(svg);
    document.head.appendChild(link);
  })();

  /* ---------- small helpers ---------- */
  function svg(inner, attrs) {
    attrs = attrs || 'width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
    return '<svg ' + attrs + '>' + inner + '</svg>';
  }
  var ICON = {
    user:   svg('<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>'),
    gift:   svg('<rect x="3" y="8" width="18" height="13" rx="2"/><path d="M3 12h18M12 8v13"/><path d="M12 8S10 3 7.5 4.5 9 8 12 8zm0 0s2-5 4.5-3.5S15 8 12 8z"/>'),
    cart:   svg('<circle cx="9" cy="21" r="1.6"/><circle cx="19" cy="21" r="1.6"/><path d="M2.5 3h2l2.2 12.4a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 2-1.6L22 7H6"/>'),
    globe:  svg('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/>'),
    search: svg('<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>', 'width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#979797" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"'),
    burger: svg('<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>', 'width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#323232" stroke-width="2.2" stroke-linecap="round"'),
    close:  svg('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>', 'width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"'),
    arrow:  svg('<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>', 'width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"'),
    caret:  svg('<polyline points="6 9 12 15 18 9"/>', 'width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"'),
    spark:  svg('<path d="M14.7 6.3a4 4 0 0 0-5.2 5.2L3 18v3h3l6.5-6.5a4 4 0 0 0 5.2-5.2l-2.4 2.4-2.1-2.1z"/>', 'width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"'),
    check:  svg('<polyline points="20 6 9 17 4 12"/>', 'width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#479D6E" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"'),
    bell:   svg('<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>', 'width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"'),
    trash:  svg('<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>', 'width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"'),
  };

  // Official Onefinity mark recreated as crisp SVG (3 variants: header/dark text,
  // footer/white text, mark-only). markColor = signature sage; wordmark themes.
  function ofMark(id, markColor) {
    var d = 'M2.6 3 Q2.6 1.4 4.2 1.4 H29.8 Q31.4 1.4 31.4 3 V47 L17 39.4 L2.6 47 Z';
    var stripes = '';
    for (var i = 0; i < 4; i++) stripes += '<rect x="-16" y="' + (1 + i * 12.2) + '" width="70" height="7" fill="#fff" transform="rotate(-32 17 24)"/>';
    return '<svg width="30" height="48" viewBox="0 0 34 50" class="shrink-0" aria-hidden="true">' +
      '<defs><clipPath id="' + id + '"><path d="' + d + '"/></clipPath></defs>' +
      '<path d="' + d + '" fill="' + markColor + '"/>' +
      '<g clip-path="url(#' + id + ')">' + stripes + '</g></svg>';
  }
  function logo(opts) {
    opts = opts || {};
    var id = 'ofc-' + (opts.id || Math.random().toString(36).slice(2));
    var word = opts.dark ? '#fff' : '#2A2E31';
    var sub = opts.dark ? 'rgba(255,255,255,.65)' : '#6B7772';
    var markColor = opts.markColor || '#8FBBA1';
    var mark = ofMark(id, markColor);
    if (opts.markOnly) return mark;
    return '<span class="flex items-center gap-2.5">' + mark +
      '<span class="' + (opts.alwaysWord ? 'flex' : 'hidden sm:flex') + ' flex-col leading-none">' +
      '<span class="font-head text-[22px] font-extrabold tracking-[.02em]" style="color:' + word + '">ONEFINITY</span>' +
      '<span class="text-[9px] font-semibold tracking-[.01em] mt-[3px]" style="color:' + sub + '">One Machine Infinite Possibilities</span>' +
      '</span></span>';
  }

  /* ============================================================
     HEADER (utility row + mega nav + mobile menu + cart drawer + toasts)
     ============================================================ */
  function buildMegaNav() {
    return (D.megaMenu || []).map(function (mn) {
      return '<div class="relative h-[52px] flex items-center" @mouseenter="open=\'' + mn.id + '\'">' +
        '<a href="' + mn.href + '" class="flex items-center gap-1.5 text-[15px] font-bold py-2.5 whitespace-nowrap transition-colors" :class="open===\'' + mn.id + '\' ? \'text-brand-dark\' : \'text-ink\'">' +
        mn.label +
        '<span class="transition-transform" :class="open===\'' + mn.id + '\' && \'rotate-180\'">' + ICON.caret + '</span>' +
        '</a></div>';
    }).join('');
  }
  function buildMegaPanels() {
    return (D.megaMenu || []).map(function (mn) {
      var cols = mn.cols.map(function (c) {
        var items = c.items.map(function (it) {
          return '<a href="' + it.href + '" class="text-left text-[15px] font-semibold text-ink hover:text-brand-green transition-colors py-0.5">' + it.label + '</a>';
        }).join('');
        return '<div class="min-w-[150px]"><div class="text-[12px] font-extrabold tracking-[.12em] uppercase text-brand-green mb-3.5">' + c.head + '</div>' +
          '<div class="flex flex-col gap-2.5">' + items + '</div></div>';
      }).join('');
      return '<div class="absolute left-0 right-0 bg-white border-t border-line border-b border-line2 shadow-pop z-[115] transition-all duration-200" ' +
        'x-show="open===\'' + mn.id + '\'" x-transition.opacity @mouseenter="open=\'' + mn.id + '\'" style="display:none">' +
        '<div class="max-w-site mx-auto px-[22px] py-8 flex gap-10">' +
        '<div class="flex gap-12 flex-1 flex-wrap">' + cols + '</div>' +
        '<a href="' + mn.promo.href + '" class="shrink-0 w-[280px] rounded-[18px] p-6 flex flex-col relative overflow-hidden transition-transform hover:-translate-y-1" style="background:linear-gradient(150deg,#EAF4EE,#C8E2D4)">' +
        '<div class="text-[20px] font-extrabold text-brand-dark mb-1.5">' + mn.promo.title + '</div>' +
        '<div class="text-sm text-[#3a5a48] mb-3.5">' + mn.promo.text + '</div>' +
        '<div class="mt-auto flex items-center gap-1.5 text-brand-dark font-bold text-sm">' + mn.promo.cta + ICON.arrow + '</div>' +
        '<img src="' + mn.promo.img + '" alt="" class="absolute -right-8 -bottom-5 w-[150px] opacity-50" loading="lazy"></a>' +
        '</div></div>';
    }).join('');
  }

  function headerHTML() {
    return '' +
    // tariff ribbon
    '<div x-show="$store.shop.ribbonOpen" x-cloak class="bg-night text-white text-[13px] font-semibold py-2.5 px-12 flex items-center justify-center gap-3.5 relative flex-wrap animate-slidedown">' +
      '<span class="flex items-center gap-2">' + svg('<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>', 'width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F5A623" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"') + ' USA Tariff Information</span>' +
      '<a href="faq.html" class="flex items-center gap-1.5 bg-white text-night font-bold text-[12.5px] px-3 py-1 rounded-full hover:-translate-y-px transition-transform">Access Here ' + ICON.arrow.replace('width="15" height="15"','width="13" height="13"') + '</a>' +
      '<button @click="$store.shop.ribbonOpen=false" title="Dismiss" class="absolute right-3.5 top-1/2 -translate-y-1/2 w-[26px] h-[26px] rounded-md flex items-center justify-center text-[#9AA7AE] hover:bg-slate2 hover:text-white transition-colors">' + ICON.close.replace('width="18" height="18"','width="15" height="15"') + '</button>' +
    '</div>' +

    // header bar
    '<header class="sticky top-0 z-[120] bg-white border-b border-line" data-header @mouseleave="open=null" x-data="{ open:null }">' +
      '<div class="max-w-site mx-auto px-4 sm:px-[22px] h-16 sm:h-20 flex items-center gap-3 sm:gap-[18px]">' +
        '<a href="index.html" class="shrink-0">' + logo({ id:'hdr' }) + '</a>' +
        // desktop search
        '<div class="hidden lg:flex flex-1 justify-center px-5" @click.outside="$store.shop.searchOpen=false">' +
          '<div class="relative w-full max-w-[440px]">' +
            '<div class="flex items-center gap-2.5 bg-brand-wash border-[1.5px] border-line rounded-xl px-4 py-2.5 w-full hover:border-brand-mint transition-colors">' + ICON.search +
              '<input type="text" x-model="$store.shop.searchQuery" @input="$store.shop.searchOpen=$store.shop.searchQuery.length>0" placeholder="Search machines, parts & accessories…" class="border-0 bg-transparent outline-none text-[14.5px] w-full text-ink">' +
            '</div>' +
            '<div x-show="$store.shop.searchOpen && $store.shop.searchHits.length" x-transition x-cloak class="absolute top-[calc(100%+8px)] left-0 right-0 bg-white border border-line rounded-[14px] shadow-pop overflow-hidden z-[130]">' +
              '<div class="px-3.5 py-2 text-[11px] font-bold tracking-[.1em] uppercase text-faint border-b border-line">Suggestions</div>' +
              '<template x-for="h in $store.shop.searchHits" :key="h.id">' +
                '<a :href="\'product.html?id=\'+h.id" class="w-full flex items-center gap-3 px-3.5 py-2.5 text-left hover:bg-brand-wash transition-colors">' +
                  '<span class="w-[42px] h-[42px] rounded-[10px] bg-brand-wash shrink-0 overflow-hidden flex items-center justify-center"><img :src="h.img" alt="" class="w-full h-full object-contain p-1" loading="lazy"></span>' +
                  '<span class="flex-1 min-w-0"><span class="block text-sm font-bold leading-tight" x-text="h.name"></span><span class="block text-xs text-faint" x-text="h.type"></span></span>' +
                  '<span class="text-sm font-extrabold text-brand-dark whitespace-nowrap" x-text="h.priceFmt"></span>' +
                '</a>' +
              '</template>' +
            '</div>' +
          '</div>' +
        '</div>' +
        // right utils
        '<div class="ml-auto flex items-center gap-0.5">' +
          utilBtn('account.html', ICON.user, 'Members') +
          utilBtn('collection.html', ICON.gift, 'Gift Card') +
          // cart
          '<button @click="$store.shop.cartOpen=true" title="Cart" class="relative flex flex-col items-center gap-[3px] min-w-[44px] sm:min-w-[62px] h-11 sm:h-auto justify-center sm:py-1.5 px-1.5 rounded-xl text-ink hover:bg-brand-wash transition-colors">' + ICON.cart +
            '<span class="hidden sm:block text-[11px] font-bold">Cart</span>' +
            '<span x-show="$store.shop.count>0" x-cloak class="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-brand-green text-white text-[11px] font-extrabold flex items-center justify-center animate-pop" x-text="$store.shop.count"></span>' +
          '</button>' +
          // currency
          '<div class="relative" @click.outside="$store.shop.curMenuOpen=false">' +
            '<button @click="$store.shop.curMenuOpen=!$store.shop.curMenuOpen" title="Currency" class="flex flex-col items-center gap-[3px] min-w-[44px] sm:min-w-[62px] h-11 sm:h-auto justify-center sm:py-1.5 px-1.5 rounded-xl text-ink hover:bg-brand-wash transition-colors">' + ICON.globe +
              '<span class="hidden sm:block text-[11px] font-bold" x-text="$store.shop.curSym"></span></button>' +
            '<div x-show="$store.shop.curMenuOpen" x-transition x-cloak class="absolute top-[calc(100%+8px)] right-0 w-[150px] bg-white border border-line rounded-xl shadow-pop overflow-hidden z-[130]">' +
              '<template x-for="c in [\'CAD\',\'USD\']" :key="c">' +
                '<button @click="$store.shop.setCurrency(c)" class="block w-full text-left px-3.5 py-2.5 text-[13px] font-bold transition-colors" :class="$store.shop.currency===c ? \'bg-brand-mint2 text-brand-dark\' : \'bg-white text-muted hover:bg-brand-wash\'" x-text="c===\'CAD\' ? \'CAD · C$\' : \'USD · US$\'"></button>' +
              '</template>' +
            '</div>' +
          '</div>' +
          // burger (mobile)
          '<button @click="$store.shop.mobileMenu=true" class="lg:hidden w-11 h-11 rounded-xl bg-brand-wash flex items-center justify-center ml-1">' + ICON.burger + '</button>' +
        '</div>' +
      '</div>' +
      // mega nav row (desktop)
      '<div class="hidden lg:block border-t border-line">' +
        '<div class="max-w-site mx-auto px-[22px]">' +
          '<nav class="flex items-center justify-center gap-5 h-[52px]">' + buildMegaNav() +
            '<a href="build.html" class="ml-2.5 shrink-0 whitespace-nowrap flex items-center gap-1.5 bg-brand-green text-white font-bold text-sm px-3.5 py-2.5 rounded-[10px] hover:bg-brand-dark transition-colors">' + ICON.spark + ' Build Your CNC</a>' +
          '</nav>' +
        '</div>' + buildMegaPanels() +
      '</div>' +
    '</header>' +

    overlaysHTML();
  }

  function utilBtn(href, icon, label) {
    return '<a href="' + href + '" title="' + label + '" class="flex flex-col items-center gap-[3px] min-w-[44px] sm:min-w-[62px] h-11 sm:h-auto justify-center sm:py-1.5 px-1.5 rounded-xl text-ink hover:bg-brand-wash transition-colors">' +
      icon + '<span class="hidden sm:block text-[11px] font-bold">' + label + '</span></a>';
  }

  /* mobile menu + cart drawer + toasts */
  function overlaysHTML() {
    // top-level section links (each goes to the section landing page)
    var topLinks = (D.megaMenu || []).map(function (mn) {
      return '<a href="' + mn.href + '" class="text-left text-[22px] font-bold py-3 border-b border-line">' + mn.label + '</a>';
    }).join('');
    // grouped sub-links so every page (incl. Support / Company) is reachable on mobile
    var groups = (D.megaMenu || []).map(function (mn) {
      var cols = mn.cols.map(function (c) {
        var items = c.items.map(function (it) {
          return '<a href="' + it.href + '" class="text-left text-[15px] font-semibold text-muted py-2">' + it.label + '</a>';
        }).join('');
        return '<div class="mb-1"><div class="text-[11px] font-extrabold tracking-[.12em] uppercase text-brand-green mt-4 mb-1">' + c.head + '</div><div class="flex flex-col">' + items + '</div></div>';
      }).join('');
      return cols;
    }).join('');

    return '' +
    // mobile menu
    '<div x-show="$store.shop.mobileMenu" x-cloak class="lg:hidden fixed inset-0 z-[160] bg-white p-[22px] overflow-y-auto" ' +
      'x-transition:enter="transition ease-out duration-300" x-transition:enter-start="translate-x-full" x-transition:enter-end="translate-x-0" ' +
      'x-transition:leave="transition ease-in duration-200" x-transition:leave-start="translate-x-0" x-transition:leave-end="translate-x-full">' +
      '<div class="flex items-center justify-between mb-5"><span class="text-[21px] font-extrabold">Menu</span>' +
        '<button @click="$store.shop.mobileMenu=false" class="w-[42px] h-[42px] rounded-xl bg-brand-wash flex items-center justify-center text-ink">' + ICON.close + '</button></div>' +
      '<a href="build.html" class="mb-5 w-full bg-brand-green text-white text-[18px] font-extrabold py-4 rounded-xl flex items-center justify-center gap-2">⚡ Build Your CNC</a>' +
      '<div class="flex flex-col">' + topLinks + '</div>' +
      // expandable "All pages" details
      '<details class="mt-4 pt-2 border-t-2 border-line"><summary class="cursor-pointer list-none text-[13px] font-extrabold tracking-[.12em] uppercase text-faint py-2 flex items-center justify-between">Browse everything ' + ICON.caret + '</summary>' + groups + '</details>' +
      '<div class="flex flex-col mt-4 pt-3.5 border-t-2 border-line">' +
        '<a href="account.html" class="text-left text-[16px] font-semibold text-muted py-2.5">Members</a>' +
        '<a href="login.html" class="text-left text-[16px] font-semibold text-muted py-2.5">Log in</a>' +
        '<a href="cart.html" class="text-left text-[16px] font-semibold text-muted py-2.5">Cart (<span x-text="$store.shop.count"></span>)</a>' +
      '</div>' +
    '</div>' +

    // cart scrim + drawer
    '<div x-show="$store.shop.cartOpen" x-cloak x-transition.opacity @click="$store.shop.cartOpen=false" class="fixed inset-0 z-[140]" style="background:rgba(20,30,24,.4)"></div>' +
    '<aside x-show="$store.shop.cartOpen" x-cloak class="fixed top-0 right-0 bottom-0 z-[150] w-full sm:w-[400px] max-w-full bg-white shadow-[-10px_0_40px_rgba(0,0,0,.16)] flex flex-col" ' +
      'x-transition:enter="transition ease-out duration-300" x-transition:enter-start="translate-x-full" x-transition:enter-end="translate-x-0" ' +
      'x-transition:leave="transition ease-in duration-200" x-transition:leave-start="translate-x-0" x-transition:leave-end="translate-x-full">' +
      '<div class="px-[22px] py-5 border-b border-line flex items-center justify-between shrink-0">' +
        '<span class="text-[21px] font-extrabold">Your Cart (<span x-text="$store.shop.count"></span>)</span>' +
        '<button @click="$store.shop.cartOpen=false" class="w-[38px] h-[38px] rounded-[10px] bg-brand-wash flex items-center justify-center text-ink">' + ICON.close + '</button></div>' +
      // free ship
      '<div class="px-[22px] py-4 bg-brand-wash border-b border-line shrink-0">' +
        '<div class="text-[13px] font-semibold mb-2 text-brand-dark" x-text="$store.shop.freeShipMsg"></div>' +
        '<div class="h-2 rounded-full bg-[#D7D7D7] overflow-hidden"><div class="h-full bg-gradient-to-r from-brand-green to-brand-dark rounded-full transition-[width] duration-500" :style="\'width:\'+$store.shop.freeShipPct+\'%\'"></div></div>' +
      '</div>' +
      '<div class="flex-1 overflow-y-auto px-[22px] py-2">' +
        '<div x-show="!$store.shop.cart.length" class="text-center py-14 text-faint">' +
          '<div class="w-[70px] h-[70px] rounded-full bg-brand-wash flex items-center justify-center mx-auto mb-4">' + ICON.cart.replace('width="22" height="22"','width="30" height="30"') + '</div>' +
          '<div class="text-lg font-bold text-ink mb-1.5">Your cart is empty</div>' +
          '<div class="text-sm mb-5">Let\'s build something incredible.</div>' +
          '<a href="build.html" class="inline-block bg-brand-green text-white font-bold px-5 py-3 rounded-xl text-[15px]">Build Your CNC</a>' +
        '</div>' +
        '<template x-for="it in $store.shop.cart" :key="it.id">' +
          '<div class="flex gap-3 py-4 border-b border-line">' +
            '<div class="w-[66px] h-[66px] rounded-xl shrink-0 flex items-center justify-center overflow-hidden border border-line" :class="it.custom ? \'bg-brand-mint2\' : \'bg-brand-wash\'"><img :src="it.img" :alt="it.name" class="w-full h-full object-contain p-1.5" loading="lazy"></div>' +
            '<div class="flex-1 min-w-0">' +
              '<div class="font-bold text-[15px] leading-tight" x-text="it.name"></div>' +
              '<div class="text-[12.5px] text-faint mt-0.5 mb-2" x-text="it.sub||\'Onefinity\'"></div>' +
              '<div class="flex items-center justify-between">' +
                '<div class="flex items-center border border-line2 rounded-[9px] overflow-hidden">' +
                  '<button @click="$store.shop.changeQty(it.id,-1)" class="w-7 h-7 flex items-center justify-center text-muted text-[17px]">−</button>' +
                  '<span class="w-[26px] text-center text-sm font-bold" x-text="it.qty"></span>' +
                  '<button @click="$store.shop.changeQty(it.id,1)" class="w-7 h-7 flex items-center justify-center text-muted text-base">+</button>' +
                '</div>' +
                '<span class="font-extrabold text-[15px]" x-text="$store.shop.money(it.price*it.qty)"></span>' +
              '</div>' +
            '</div>' +
            '<button @click="$store.shop.remove(it.id)" class="text-hush self-start" title="Remove">' + ICON.trash + '</button>' +
          '</div>' +
        '</template>' +
      '</div>' +
      '<div x-show="$store.shop.cart.length" class="shrink-0 px-[22px] pt-4 pb-5 border-t border-line shadow-[0_-6px_20px_rgba(0,0,0,.05)]">' +
        '<div class="flex items-center justify-between mb-1"><span class="text-[15px] text-muted">Subtotal</span><span class="text-[22px] font-extrabold" x-text="$store.shop.money($store.shop.subtotal)"></span></div>' +
        '<div class="text-[12.5px] text-faint mb-3.5">Shipping & taxes calculated at checkout.</div>' +
        '<a href="checkout.html" class="w-full bg-brand-green text-white text-[17px] font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-brand-dark transition-colors">Checkout · <span x-text="$store.shop.money($store.shop.subtotal)"></span></a>' +
        '<a href="cart.html" class="block w-full mt-2 text-center text-brand-dark text-sm font-semibold py-2">View full cart</a>' +
      '</div>' +
    '</aside>' +

    // variant picker modal (shared by home / collection / product "Add")
    '<div x-show="$store.shop.variant" x-cloak x-transition.opacity @click="$store.shop.closeVariant()" class="fixed inset-0 z-[170] flex items-center justify-center p-5" style="background:rgba(15,22,18,.55)">' +
      '<div x-show="$store.shop.variant" x-transition @click.stop class="bg-white rounded-[22px] w-full max-w-[760px] max-h-[90vh] overflow-y-auto shadow-[0_30px_70px_rgba(0,0,0,.35)] relative grid md:grid-cols-2">' +
        '<button @click="$store.shop.closeVariant()" class="absolute top-4 right-4 z-[5] w-9 h-9 rounded-[10px] bg-white shadow-pop flex items-center justify-center text-muted">' + ICON.close + '</button>' +
        '<template x-if="$store.shop.variant">' +
          '<div class="contents">' +
            '<div class="p-6 bg-[#FAFBFA]">' +
              '<div class="aspect-square bg-[#F1F4F2] rounded-[16px] flex items-center justify-center overflow-hidden mb-3.5"><img :src="$store.shop.variant.img" :alt="$store.shop.variant.name" class="w-full h-full object-contain p-6"></div>' +
            '</div>' +
            '<div class="p-7 flex flex-col">' +
              '<h3 class="font-head text-[26px] font-extrabold mb-3 leading-tight text-[#2A2E31]" x-text="$store.shop.variant.name"></h3>' +
              '<div class="flex items-baseline gap-3 mb-6 flex-wrap"><span class="text-[30px] font-extrabold text-brand-dark" x-text="$store.shop.money($store.shop.variantTotal)"></span></div>' +
              '<div class="flex flex-col gap-4 flex-1">' +
                '<template x-for="(g,gi) in $store.shop.variant.variantGroups" :key="gi">' +
                  '<div><label class="block text-sm font-bold text-ink mb-1.5" x-text="g.label"></label>' +
                    '<select :value="$store.shop.variantSel[gi]" @change="$store.shop.pickVariant(gi, parseInt($event.target.value))" class="w-full border-[1.5px] border-line2 rounded-[11px] px-3.5 py-3 text-[15px] font-semibold text-ink bg-white cursor-pointer outline-none">' +
                      '<template x-for="(o,oi) in g.options" :key="oi"><option :value="oi" x-text="o.name + (o.delta>0 ? \'  +\'+$store.shop.money(o.delta) : \'\')"></option></template>' +
                    '</select></div>' +
                '</template>' +
              '</div>' +
              '<button @click="$store.shop.addVariant()" class="mt-6 w-full bg-brand-green text-white font-extrabold text-base tracking-wide py-4 rounded-[13px] flex items-center justify-center gap-2 hover:bg-brand-dark transition-colors">' + ICON.cart + ' ADD TO CART · <span x-text="$store.shop.money($store.shop.variantTotal)"></span></button>' +
              '<div class="mt-3.5 text-[12.5px] text-faint flex items-center gap-1.5">' + svg('<path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z"/><polyline points="9 12 11 14 15 10"/>','width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#479D6E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"') + 'Officially supported · ships in 1–2 weeks</div>' +
            '</div>' +
          '</div>' +
        '</template>' +
      '</div>' +
    '</div>' +

    // toasts
    '<div class="fixed z-[200] right-5 bottom-5 flex flex-col gap-2.5 items-end max-w-[92vw]">' +
      '<template x-for="t in $store.shop.toasts" :key="t.id">' +
        '<div class="flex items-center gap-2.5 bg-brand-dark text-white px-3.5 py-3 rounded-[14px] shadow-pop min-w-[260px] max-w-[340px] animate-toastin">' +
          '<div class="w-[30px] h-[30px] rounded-full bg-white flex items-center justify-center shrink-0">' + ICON.check + '</div>' +
          '<div class="flex flex-col gap-0.5"><div class="font-bold text-[15px] leading-tight" x-text="t.title"></div><div class="text-[13px] opacity-90 leading-tight" x-text="t.msg"></div></div>' +
          '<button @click="$store.shop.closeToast(t.id)" class="ml-1.5 text-white/70 flex items-center">' + ICON.close.replace('width="18" height="18"','width="15" height="15"') + '</button>' +
        '</div>' +
      '</template>' +
    '</div>';
  }

  /* ============================================================
     FOOTER
     ============================================================ */
  function footerCol(head, links) {
    var items = links.map(function (l) { return '<a href="' + l[1] + '" class="text-left">' + l[0] + '</a>'; }).join('');
    return '<div><div class="text-[13px] font-bold tracking-[.1em] uppercase text-[#7E8488] mb-4">' + head + '</div>' +
      '<div class="flex flex-col gap-2.5 text-[15px] text-[#B7BBBD]">' + items + '</div></div>';
  }
  function footerHTML() {
    var social = ['<path d="M22 12a10 10 0 10-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7A10 10 0 0022 12z"/>',
      '<path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.1.4.3 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.1-1 .3-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.1-.4-.3-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.1 1-.3 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 3.2A6.6 6.6 0 1018.6 12 6.6 6.6 0 0012 5.4zm0 10.9A4.3 4.3 0 1116.3 12 4.3 4.3 0 0112 16.3zm6.8-11.1a1.5 1.5 0 11-1.5-1.5 1.5 1.5 0 011.5 1.5z"/>',
      '<path d="M23 7.5a3 3 0 00-2.1-2.1C19 4.8 12 4.8 12 4.8s-7 0-8.9.6A3 3 0 001 7.5 31 31 0 00.5 12 31 31 0 001 16.5a3 3 0 002.1 2.1c1.9.6 8.9.6 8.9.6s7 0 8.9-.6a3 3 0 002.1-2.1A31 31 0 0023.5 12 31 31 0 0023 7.5zM9.8 15.3V8.7l5.7 3.3z"/>']
      .map(function (p) { return '<span class="w-10 h-10 rounded-[10px] bg-[#3D4348] flex items-center justify-center"><svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">' + p + '</svg></span>'; }).join('');

    return '<footer class="bg-ink text-white">' +
      '<div class="max-w-wide mx-auto px-[22px] pt-[60px] pb-[30px]">' +
        '<div class="grid gap-x-6 gap-y-9" style="grid-template-columns:repeat(auto-fit,minmax(160px,1fr))">' +
          '<div class="[grid-column:1/-1] max-w-[340px]">' +
            '<div class="mb-4">' + logo({ id:'foot', dark:true, alwaysWord:true }) + '</div>' +
            '<p class="text-[15px] leading-relaxed text-[#B7BBBD] mb-5">One machine, infinite possibilities. Precision CNC built in North America for creators and professionals.</p>' +
            '<div class="flex gap-2.5">' + social + '</div>' +
          '</div>' +
          footerCol('Shop', [['Machines','collection.html'],['Build Your CNC','build.html'],['Accessories','collection.html?c=acc'],['Cart','cart.html']]) +
          footerCol('Learn', [['Blog','blog.html'],['Events','events.html'],['FAQ','faq.html'],['Community','community.html']]) +
          footerCol('Account', [['Log in','login.html'],['My account','account.html'],['Order status','account.html'],['Support','faq.html']]) +
        '</div>' +
        '<div class="border-t border-[#44494D] mt-11 pt-6 flex items-center justify-between gap-4 flex-wrap">' +
          '<span class="text-[13px] text-[#7E8488]">© 2026 Onefinity CNC · All rights reserved</span>' +
          '<div class="flex gap-5 text-[13px] text-[#7E8488]"><a href="privacy.html" class="hover:text-white transition-colors">Privacy</a><a href="warranty.html" class="hover:text-white transition-colors">Warranty</a><a href="terms.html" class="hover:text-white transition-colors">Terms</a></div>' +
        '</div>' +
      '</div></footer>';
  }

  /* ============================================================
     Reusable full-bleed PAGE HERO.
     Drop  <div id="page-hero" data-eyebrow=".." data-title=".."
            data-sub=".." data-cta=".." data-cta-href=".."></div>
     on any page and it renders a premium gradient + grain band.
     ============================================================ */
  function pageHeroHTML(el) {
    var d = el.dataset || {};
    var eyebrow = d.eyebrow || '';
    var title = d.title || '';
    var sub = d.sub || '';
    var cta = d.cta || '';
    var ctaHref = d.ctaHref || '#';
    var cta2 = d.cta2 || '';
    var cta2Href = d.cta2Href || '#';
    var align = d.align === 'left' ? 'text-left items-start' : 'text-center items-center';
    var maxw = d.align === 'left' ? '' : 'mx-auto';

    return '<section class="relative overflow-hidden grain mesh-dark text-white">' +
      '<span class="ring-shape" style="width:420px;height:420px;top:-160px;right:-120px;border:1px solid rgba(255,255,255,.10)"></span>' +
      '<span class="ring-shape" style="width:260px;height:260px;bottom:-150px;left:-80px;background:radial-gradient(circle,rgba(127,203,161,.22),transparent 70%)"></span>' +
      '<div class="shell relative py-16 lg:py-24">' +
        '<div class="flex flex-col ' + align + ' max-w-[760px] ' + maxw + '">' +
          (eyebrow ? '<div class="inline-flex items-center gap-2 glass rounded-full px-3.5 py-1.5 mb-5 eyebrow text-[12px] text-mint" style="color:#CFEAD9"><span class="w-1.5 h-1.5 rounded-full bg-[#7FCBA1]"></span>' + eyebrow + '</div>' : '') +
          '<h1 class="font-head font-extrabold leading-[1.03] tracking-[-.02em] text-[clamp(34px,6vw,60px)]">' + title + '</h1>' +
          (sub ? '<p class="text-[clamp(16px,2vw,20px)] leading-relaxed text-white/80 mt-5 max-w-[600px]' + (d.align === 'left' ? '' : ' mx-auto') + '">' + sub + '</p>' : '') +
          (cta ? '<div class="flex flex-wrap gap-3 mt-8 ' + (d.align === 'left' ? '' : 'justify-center') + '">' +
            '<a href="' + ctaHref + '" class="btn btn-light text-[16px] px-6 py-3.5">' + cta + '</a>' +
            (cta2 ? '<a href="' + cta2Href + '" class="btn glass text-white text-[16px] px-6 py-3.5">' + cta2 + '</a>' : '') +
          '</div>' : '') +
        '</div>' +
      '</div>' +
    '</section>';
  }

  /* ---------- progressive enhancements: scroll reveal + header shadow ---------- */
  function enhance() {
    // scroll reveal
    var els = document.querySelectorAll('.reveal:not(.in)');
    if ('IntersectionObserver' in window && els.length) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      els.forEach(function (el) { io.observe(el); });
    } else {
      els.forEach(function (el) { el.classList.add('in'); });
    }
    // header shadow on scroll
    var hdr = document.querySelector('[data-header]');
    if (hdr && !hdr.__scroundup) {
      hdr.__scroundup = true;
      var onScroll = function () { hdr.classList.toggle('is-scrolled', window.scrollY > 8); };
      window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
    }
  }

  /* ---------- inject partials now (DOM up to this script is parsed) ---------- */
  function inject() {
    var h = document.getElementById('site-header');
    var f = document.getElementById('site-footer');
    var hero = document.getElementById('page-hero');
    if (h) h.innerHTML = headerHTML();
    if (hero) hero.innerHTML = pageHeroHTML(hero);
    if (f) f.innerHTML = footerHTML();
    enhance();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', inject);
  else inject();
  // expose so pages can re-scan after dynamic content if needed
  window.OF_enhance = enhance;

  /* ---------- Alpine store ---------- */
  document.addEventListener('alpine:init', function () {
    Alpine.store('shop', {
      cart: [],
      currency: 'CAD',
      ribbonOpen: true,
      mobileMenu: false,
      cartOpen: false,
      curMenuOpen: false,
      searchQuery: '',
      searchOpen: false,
      toasts: [],
      _seq: 0,
      variant: null,
      variantSel: {},

      init: function () {
        try {
          var c = JSON.parse(localStorage.getItem('of_cart') || '[]');
          if (Array.isArray(c)) this.cart = c;
          var cur = localStorage.getItem('of_currency');
          if (cur) this.currency = cur;
        } catch (e) {}
      },
      _save: function () {
        try {
          localStorage.setItem('of_cart', JSON.stringify(this.cart));
          localStorage.setItem('of_currency', this.currency);
        } catch (e) {}
      },

      money: function (n) {
        var rate = this.currency === 'USD' ? 0.73 : 1;
        var sym = this.currency === 'USD' ? 'US$' : 'CA$';
        return sym + Math.round((Number(n) || 0) * rate).toLocaleString('en-US');
      },
      get curSym() { return this.currency === 'USD' ? 'US$' : 'CA$'; },

      get count() { return this.cart.reduce(function (a, c) { return a + c.qty; }, 0); },
      get subtotal() { return this.cart.reduce(function (a, c) { return a + c.price * c.qty; }, 0); },
      get freeShipPct() { return Math.min(100, Math.round(this.subtotal / 75 * 100)); },
      get freeShipMsg() {
        return this.subtotal >= 75 ? "You've unlocked free shipping!" : "You're " + this.money(75 - this.subtotal) + ' away from free shipping';
      },

      get searchHits() {
        var q = (this.searchQuery || '').toLowerCase().trim();
        if (!q) return [];
        var self = this;
        return (D.allProducts || []).filter(function (p) {
          return p.name.toLowerCase().indexOf(q) >= 0 || (p.cat || '').indexOf(q) >= 0;
        }).slice(0, 5).map(function (p) {
          return { id: p.id, name: p.name, img: p.img, priceFmt: self.money(p.price), type: p.type === 'machine' ? 'Machine' : 'Accessory' };
        });
      },

      add: function (item, openDrawer) {
        var ex = this.cart.find(function (c) { return c.id === item.id; });
        if (ex) ex.qty += (item.qty || 1);
        else this.cart.push(Object.assign({}, item, { qty: item.qty || 1 }));
        if (openDrawer !== false) this.cartOpen = true;
        this.pushToast('Added to cart', item.name);
        this._save();
      },
      remove: function (id) {
        var it = this.cart.find(function (c) { return c.id === id; });
        this.cart = this.cart.filter(function (c) { return c.id !== id; });
        if (it) this.pushToast('Removed', it.name + ' was removed');
        this._save();
      },
      changeQty: function (id, d) {
        var it = this.cart.find(function (c) { return c.id === id; });
        if (it) it.qty = Math.max(1, it.qty + d);
        this._save();
      },
      clear: function () { this.cart = []; this._save(); },

      setCurrency: function (c) { this.currency = c; this.curMenuOpen = false; this._save(); },

      /* ---- variant picker (products with variantGroups) ---- */
      openVariant: function (id) {
        var p = (D.allProducts || []).find(function (x) { return x.id === id; });
        if (!p) return;
        if (!p.variantGroups) { this.add({ id: p.id, name: p.name, price: p.price, img: p.img, sub: p.size || 'Accessory' }); return; }
        var init = {}; p.variantGroups.forEach(function (g, i) { init[i] = 0; });
        this.variant = p; this.variantSel = init;
      },
      closeVariant: function () { this.variant = null; },
      pickVariant: function (gi, oi) { this.variantSel[gi] = oi; },
      get variantTotal() {
        if (!this.variant) return 0;
        var t = this.variant.price, self = this;
        this.variant.variantGroups.forEach(function (g, i) { t += (g.options[self.variantSel[i] || 0] || {}).delta || 0; });
        return t;
      },
      addVariant: function () {
        var p = this.variant; if (!p) return; var self = this;
        var parts = p.variantGroups.map(function (g, i) { return g.options[self.variantSel[i] || 0].name; });
        this.add({ id: p.id + '-' + Object.values(this.variantSel).join('-'), name: p.name, price: this.variantTotal, img: p.img, sub: parts.join(' · ') });
        this.variant = null;
      },

      pushToast: function (title, msg) {
        var id = ++this._seq; var self = this;
        this.toasts.push({ id: id, title: title, msg: msg });
        setTimeout(function () { self.closeToast(id); }, 3600);
      },
      closeToast: function (id) { this.toasts = this.toasts.filter(function (t) { return t.id !== id; }); },
    });
  });
})();
