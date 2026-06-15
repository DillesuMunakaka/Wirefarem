/* ============================================================
   Onefinity — centralized demo data.
   In Shopify this is replaced by Liquid objects:
     - machines / accessories  ->  {% for product in collection.products %}
     - wizard                  ->  product options / metafields
     - posts / events          ->  {% for article in blog.articles %}
     - faqs                    ->  metaobject / section blocks
   Keeping it in one JS file lets the static prototype run as-is.
   ============================================================ */
(function () {
  var IMG = {
    foreman:    'https://static.wixstatic.com/media/1cee9f_f3d91e22110a44889aaaa91600ccf00e~mv2.png',
    woodworker: 'https://static.wixstatic.com/media/c8c9a4_f667cb2b07654d5d8562032bf38004a0~mv2.png',
    apprentice: 'https://static.wixstatic.com/media/6951b9_0ec7381567c7464f8b5114b54dd04683~mv2.png',
    spindle:    'https://static.wixstatic.com/media/1cee9f_f63cf68067104f7093b2f69bf9da1b90~mv2.png',
    rotary:     'https://static.wixstatic.com/media/1cee9f_4e29dea4d4664b508014d5843db1138a~mv2.png',
    atc:        'https://static.wixstatic.com/media/1cee9f_dd3e4189746d42119efad7f321f468f9~mv2.png',
    laser:      'https://static.wixstatic.com/media/814ef6_9981bea6c21642ccbae06c12ab396e3f~mv2.png',
    exploded:   'https://static.wixstatic.com/media/1cee9f_e48289081b294dbbac7c85cf39480bf1~mv2.png',
  };

  var machines = [
    { id:'apprentice', name:'Apprentice', size:'16.5" × 16.5"', price:799, blurb:'Your first real CNC. Compact, rigid and ready to learn on.', img:IMG.apprentice, badge:'New', badgeColor:'#479D6E', cat:'machine' },
    { id:'woodworker', name:'Woodworker', size:'33" × 33"', price:1800, blurb:'The maker favorite. Big enough for serious projects, small enough for any shop.', img:IMG.woodworker, badge:'Best Seller', badgeColor:'#F5A623', cat:'machine',
      variantGroups:[ {label:'Controller',options:[{name:'Standard Controller',delta:0},{name:'Elite 15" Touch',delta:700}]},{label:'Spindle Mount',options:[{name:'65mm',delta:0},{name:'80mm',delta:35}]},{label:'Rails',options:[{name:'Standard',delta:0},{name:'Stiffy 3rd Rail',delta:220}]} ] },
    { id:'journeyman', name:'Journeyman', size:'49" × 33"', price:2200, blurb:'More travel, more possibility. Built for ambitious builds.', img:IMG.foreman, badge:'Popular', badgeColor:'#479D6E', cat:'machine',
      variantGroups:[ {label:'Controller',options:[{name:'Standard Controller',delta:0},{name:'Elite 15" Touch',delta:700}]},{label:'Spindle Mount',options:[{name:'65mm',delta:0},{name:'80mm',delta:35}]},{label:'Rails',options:[{name:'Standard',delta:0},{name:'Stiffy 3rd Rail',delta:220}]} ] },
    { id:'foreman', name:'Foreman Elite', size:'49" × 49"', price:3200, blurb:'Our flagship. Maximum rigidity, full ball-screw covers, 5-year warranty.', img:IMG.foreman, badge:'Elite', badgeColor:'#31363A', cat:'machine',
      variantGroups:[ {label:'Configuration',options:[{name:'Standard',delta:0},{name:'Pro · ATC-ready',delta:900}]},{label:'Spindle Mount',options:[{name:'80mm',delta:0},{name:'ATC Spindle',delta:1499}]},{label:'Rails',options:[{name:'Ball-screw covers',delta:0},{name:'Covers + Stiffy',delta:220}]} ] },
  ];

  var accessories = [
    { id:'spindle', name:'Redline Spindle Kit', price:899, blurb:'Quiet, powerful 2.2kW spindle + VFD. Plug & play.', img:IMG.spindle, cat:'spindle',
      variantGroups:[ {label:'Power',options:[{name:'1.5 kW · 110V',delta:0},{name:'2.2 kW · 220V',delta:122}]},{label:'Collet Set',options:[{name:'1/4" only',delta:0},{name:'Full ER20 set',delta:89}]} ] },
    { id:'rotary', name:'4th Axis Rotary', price:849, blurb:'Turn cylinders into canvas. Carve in the round.', img:IMG.rotary, cat:'rotary' },
    { id:'atc', name:'Automatic Tool Changer', price:1499, blurb:'Swap bits automatically. Run complex jobs unattended.', img:IMG.atc, cat:'atc' },
    { id:'laser', name:'JTech Laser Module', price:599, blurb:'Engrave, mark and cut. Mounts in seconds.', img:IMG.laser, cat:'laser',
      variantGroups:[ {label:'Power',options:[{name:'7W Diode',delta:0},{name:'14W Diode',delta:200}]} ] },
    { id:'probe', name:'Touch Probe & Tool Setter', price:99, blurb:'Zero in seconds. Perfect Z every time.', img:IMG.spindle, cat:'probe' },
    { id:'qcw', name:'QCW Table Frame', price:399, blurb:'Rock-solid wasteboard frame. Squared and ready.', img:IMG.exploded, cat:'table' },
  ];

  // ---------- Build-Your-CNC wizard ----------
  var wizard = [
    { key:'size', kind:'radio', title:'Select Your Machine', sub:'Every Onefinity starts here. Choose the work area that fits your shop — you can add travel later.', eyebrow:'The Foundation', heroImg:IMG.woodworker, options:[
      { id:'apprentice', name:'Onefinity Apprentice', sub:'16.5" × 16.5" work area', img:IMG.apprentice, badge:'New', price:799, detail:'The perfect entry point. Compact and rigid, the Apprentice teaches you real CNC on a footprint that fits any bench — same ball-screw motion as the bigger machines, just smaller.', variantLabel:'Controller', variants:[{label:'Standard Controller',delta:0,note:'Run from your PC'},{label:'Elite 15" Touch',delta:700,note:'No computer needed'}] },
      { id:'woodworker', name:'Woodworker X-50', sub:'32.5" × 32.5" · the maker favorite', img:IMG.woodworker, badge:'Best Seller', badgeColor:'#F5A623', price:1800, detail:'Our most popular machine. The 50mm X-50 gantry adds serious rigidity for hardwoods and aluminum, while the 32.5" envelope handles the vast majority of projects.', variantLabel:'Controller', variants:[{label:'Standard Controller',delta:0,note:'Run from your PC'},{label:'Elite 15" Touch',delta:700,note:'No computer needed'}] },
      { id:'journeyman', name:'Journeyman X-50', sub:'48.5" × 32.5" · more travel', img:IMG.foreman, badge:'Popular', price:2200, detail:'More room to roam. The Journeyman extends the X axis to 48.5" so you can tackle longer signs, guitar bodies and panels without re-fixturing.', variantLabel:'Controller', variants:[{label:'Standard Controller',delta:0,note:'Run from your PC'},{label:'Elite 15" Touch',delta:700,note:'No computer needed'}] },
      { id:'foreman', name:'Foreman Elite', sub:'48.5" × 48.5" · full rigidity', img:IMG.foreman, badge:'Elite', badgeColor:'#31363A', price:3200, detail:'The flagship. A full 48.5" square envelope, ball-screw covers and maximum rigidity, backed by a 5-year warranty. Built for shops that run hard.', variantLabel:'Controller', variants:[{label:'Standard Controller',delta:0,note:'Run from your PC'},{label:'Elite 15" Touch',delta:700,note:'No computer needed'}] },
    ]},
    { key:'software', kind:'radio', title:'Select Your Software', sub:'Design and cut with confidence. A Carveco Maker licence is included free for one year with every machine.', eyebrow:'Design & Cut', heroImg:IMG.exploded, options:[
      { id:'carveco', name:'Carveco Maker', sub:'1-year licence included free', img:IMG.exploded, badge:'Included', price:0 },
      { id:'vcarve', name:'VCarve Pro', sub:'The industry standard for sign-making', img:IMG.exploded, badge:'Software', was:399, price:349 },
      { id:'none', name:'Use your own software', sub:"I'll bring my own CAM", logoCard:true, badge:'No Charge', price:0 },
    ]},
    { key:'spindle', kind:'radio', title:'Select A Spindle', sub:'Take your Onefinity to the next level with the Redline CNC Spindle Kits — the only safety-certified spindle on the hobby CNC market.', eyebrow:'Cutting Power', heroImg:IMG.spindle, options:[
      { id:'router', name:'Makita RT0701 Router', sub:'Great all-round trim router', img:IMG.spindle, badge:'No Charge', price:0 },
      { id:'redline15', name:'Redline CNC Spindle | 80mm 1.5kW Air Cooled 110v', sub:'Quiet, precise, certified', img:IMG.spindle, badge:'Spindle', was:1252, price:1000 },
      { id:'redline2', name:'Redline CNC Spindle | 80mm 2.2kW Air Cooled 220v', sub:'Maximum power, plug & play', img:IMG.spindle, badge:'Spindle', was:1336, price:1021 },
      { id:'own', name:'Use your own Spindle', sub:'Mount your existing spindle', logoCard:true, badge:'No Charge', price:0 },
    ]},
    { key:'table', kind:'radio', title:'Table & Wasteboard (QCW)', sub:'A squared, rigid base makes every cut better. The QCW frame ships flat-packed and ready to assemble.', eyebrow:'Rock-Solid Base', heroImg:IMG.exploded, options:[
      { id:'none', name:'No frame', sub:"I'll build my own table", logoCard:true, badge:'No Charge', price:0 },
      { id:'qcw', name:'QCW Wasteboard Frame', sub:'Squared, leveled & ready', img:IMG.exploded, badge:'QCW', price:399 },
      { id:'hd', name:'QCW HD Stand Workstation', sub:'Full standing workstation + frame', img:IMG.exploded, badge:'QCW', was:799, price:699 },
    ]},
    { key:'dust', kind:'radio', title:'Dust Collection', sub:'Keep your shop clean and your cuts visible. A good dust boot is the upgrade makers wish they bought first.', eyebrow:'A Cleaner Shop', heroImg:IMG.laser, options:[
      { id:'none', name:'No dust collection', sub:'Add later anytime', logoCard:true, badge:'No Charge', price:0 },
      { id:'boot', name:'Onefinity Dust Boot Kit', sub:'Magnetic, tool-free swap', img:IMG.laser, badge:'Dust', price:79 },
      { id:'pro', name:'Pro Dust Boot + 10ft Hose', sub:'Complete capture system', img:IMG.laser, badge:'Dust', was:199, price:159 },
    ]},
    { key:'probe', kind:'radio', title:'Touch Probe', sub:'Set X, Y and Z zero in seconds and probe tool length automatically. The accuracy upgrade everyone keeps.', eyebrow:'Pinpoint Accuracy', heroImg:IMG.spindle, options:[
      { id:'yes', val:true, name:'Touch Probe & Tool Setter', sub:'Perfect Z, every time', img:IMG.spindle, badge:'Probe', price:99 },
      { id:'no', val:false, name:'No touch probe', sub:'Zero manually for now', logoCard:true, badge:'No Charge', price:0 },
    ]},
    { key:'atc', kind:'radio', title:'Automatic Tool Changer', sub:'Run complex, multi-tool jobs unattended. The ATC swaps bits automatically so you can walk away.', eyebrow:'Hands-Free Machining', heroImg:IMG.atc, options:[
      { id:'no', val:false, name:'No ATC', sub:'Swap tools by hand', logoCard:true, badge:'No Charge', price:0 },
      { id:'yes', val:true, name:'Automatic Tool Changer (ATC)', sub:'Hands-free multi-tool jobs', img:IMG.atc, badge:'ATC', was:1799, price:1499 },
    ]},
    { key:'rotary', kind:'radio', title:'4th Axis Rotary', sub:'Turn cylinders into canvas. Carve table legs, bats, and ornaments fully in the round.', eyebrow:'The 4th Dimension', heroImg:IMG.rotary, options:[
      { id:'no', val:false, name:'No rotary axis', sub:'Flat work only', logoCard:true, badge:'No Charge', price:0 },
      { id:'yes', val:true, name:'4th Axis Rotary Kit', sub:'Carve in the round', img:IMG.rotary, badge:'Rotary', price:849 },
    ]},
    { key:'addons', kind:'multi', title:'Finishing Touches', sub:'Round out your kit. Pick as many as you like — these all ship in the same box.', eyebrow:'Finishing Touches', heroImg:IMG.laser, options:[
      { id:'laser', name:'JTech Laser Module', sub:'Engrave, mark & cut', img:IMG.laser, badge:'Laser', price:599 },
      { id:'endmills', name:'Endmill Starter Set', sub:'10 essential bits', img:IMG.spindle, badge:'Bits', price:129 },
      { id:'joypad', name:'Joypad Controller', sub:'Jog by hand, wirelessly', img:IMG.atc, badge:'Accessory', price:89 },
      { id:'workholding', name:'Work Holding Kit', sub:'Clamps, cams & track', img:IMG.exploded, badge:'Accessory', price:119 },
    ]},
    { key:'review', kind:'review', title:'Review Your Build', sub:'Looking good. Here is everything in your custom Onefinity — adjust any step or add it all to your cart.', eyebrow:'Almost There', heroImg:IMG.foreman, options:[] },
  ];

  var freebies = [
    { key:'free-bit', label:'Spoilboard Surfacing Bit', img:IMG.spindle, was:45 },
    { key:'free-kit', label:'Maker Starter Kit · clamps + bits', img:IMG.exploded, was:89 },
  ];

  // ---------- Home content ----------
  var steps = [
    { num:'01', title:'Choose your base', body:'Pick the work area that fits your shop — from compact Apprentice to flagship Foreman.', icon:'grid' },
    { num:'02', title:'Build it your way', body:'Add a spindle, software, probe and add-ons. Watch your machine assemble live.', icon:'wrench' },
    { num:'03', title:'Create anything', body:'Set up in under an hour and start carving wood, plastics and aluminum.', icon:'spark' },
  ];
  var features = [
    { title:'Precision ball screws', body:'Fast, accurate travel — no stretchy belts or high-maintenance lead screws.', icon:'bolt' },
    { title:'Hardened linear shafts', body:'No plastic wheels to adjust. Smooth, rigid motion that lasts.', icon:'line' },
    { title:'Preassembled rails', body:'Out of the box and carving in under an hour. Spend time making, not building.', icon:'clock' },
    { title:'All-metal rigidity', body:'A stiff, all-metal frame for clean cuts in tough material.', icon:'shield' },
    { title:'Revolutionary add-ons', body:'Redline spindle, rotary, ATC & QCW do what no other CNC can.', icon:'puzzle' },
  ];
  var reviews = [
    { quote:'Set up in 45 minutes and my first carve was flawless. The rigidity is unreal for the price.', name:'Marcus T.', role:'Hobbyist · Ohio', initials:'MT', avatarBg:'#479D6E' },
    { quote:'I run a small sign shop and the Foreman paid for itself in two months. Support is top-notch.', name:'Dana R.', role:'Pro shop · Alberta', initials:'DR', avatarBg:'#2F6949' },
    { quote:'The build configurator made it so easy to spec exactly what I needed. No regrets.', name:'Sofia L.', role:'Maker · Texas', initials:'SL', avatarBg:'#31363A' },
  ];

  // ---------- Blog / Events / FAQ ----------
  var posts = [
    { title:'10 beginner CNC projects that actually sell', cat:'Projects', read:'6 min read', accent:'linear-gradient(135deg,#479D6E,#2F6949)' },
    { title:'Spindle vs router: which should you run?', cat:'Guides', read:'8 min read', accent:'linear-gradient(135deg,#31363A,#23272A)' },
    { title:'Dialing in feeds & speeds for hardwood', cat:'Tutorials', read:'10 min read', accent:'linear-gradient(135deg,#C8E2D4,#479D6E)' },
    { title:'Setting up the ATC for unattended jobs', cat:'Pro tips', read:'7 min read', accent:'linear-gradient(135deg,#2F6949,#1f4a32)' },
    { title:'From hobby to business: a maker story', cat:'Community', read:'5 min read', accent:'linear-gradient(135deg,#479D6E,#A6B0B6)' },
    { title:'Carveco Maker: your first toolpath', cat:'Software', read:'9 min read', accent:'linear-gradient(135deg,#31363A,#479D6E)' },
  ];
  var events = [
    { date:'JUL 12', title:'Onefinity Live: ATC Deep Dive', place:'Online · YouTube', type:'Webinar', typeColor:'#479D6E' },
    { date:'AUG 03', title:'Maker Meetup — Toronto', place:'Toronto, ON', type:'In person', typeColor:'#2F6949' },
    { date:'AUG 21', title:'CNC for Education Workshop', place:'Online · Zoom', type:'Workshop', typeColor:'#31363A' },
    { date:'SEP 09', title:'Fall Project Challenge kickoff', place:'Community Forum', type:'Challenge', typeColor:'#F5A623' },
  ];
  var faqs = [
    { q:'How long does setup take?', a:"Most makers are carving in under an hour. Rails and gantry ship preassembled — you mount, square and connect, then you're cutting." },
    { q:'Do I need a computer to run it?', a:'With the Redline HD controller, no. It has built-in CAM software and a 15" touch display. The Standard controller runs from your PC.' },
    { q:'What can the Onefinity cut?', a:'Wood, MDF, plastics, foam and aluminum. With the right bits and feeds you can tackle a huge range of materials.' },
    { q:'Are the add-ons really plug & play?', a:'Yes — spindle, laser, rotary and ATC are officially supported and designed to drop in with minimal setup.' },
    { q:'What warranty do I get?', a:'Elite machines carry a 5-year warranty; Apprentice carries 2 years. All backed by industry-leading North American support.' },
    { q:'Do you ship to the US and internationally?', a:'Yes. We ship across Canada, the US and to many countries worldwide. Lead times and rates are shown at checkout.' },
  ];

  // ---------- Account ----------
  var account = {
    name:'Alex Carver', email:'alex@maker.shop', tier:'Maker', points:1280, nextTier:1500,
    orders:[
      { no:'OF-204918', date:'May 2, 2026', total:'$2,419', status:'Delivered', color:'#479D6E' },
      { no:'OF-201044', date:'Mar 18, 2026', total:'$899', status:'Delivered', color:'#479D6E' },
      { no:'OF-198220', date:'Feb 1, 2026', total:'$129', status:'Shipped', color:'#F5A623' },
    ],
    builds:[
      { name:'Foreman Elite Build', total:'$4,118', date:'Saved Apr 9' },
      { name:'Woodworker + Laser', total:'$2,399', date:'Saved Jan 22' },
    ],
  };

  // ---------- Mega-menu (each item is { label, href }) ----------
  var L = function (label, href) { return { label: label, href: href }; };
  var megaMenu = [
    { id:'machines', label:'CNC Machines', href:'collection.html', cols:[
      { head:'Shop Machines', items:[ L('All CNC Machines','collection.html?c=machine'), L('Apprentice Series','product.html?id=apprentice'), L('Elite Series','product.html?id=foreman'), L('4×8 CNC Machine','collection.html?c=machine') ] },
      { head:'Programs', items:[ L('CNC for Education','contact.html'), L('Military & 1st Responders','contact.html'), L('UK Distributor','contact.html') ] },
    ], promo:{ title:'Build Your CNC', text:'Configure it live in minutes', cta:'Start building', img:IMG.foreman, href:'build.html' } },
    { id:'accessories', label:'CNC Accessories', href:'collection.html?c=acc', cols:[
      { head:'Power', items:[ L('Spindles','collection.html?c=spindle'), L('ATC','collection.html?c=atc'), L('Rotary 4th Axis','collection.html?c=rotary'), L('Lasers','collection.html?c=laser') ] },
      { head:'Tooling', items:[ L('CNC Endmills','collection.html?c=acc'), L('Touch Probe','collection.html?c=probe'), L('Work Holding','collection.html?c=acc'), L('Stiffy 3rd Rail','collection.html?c=acc') ] },
      { head:'Shop & Setup', items:[ L('Software','build.html'), L('Table & Wasteboard (QCW)','collection.html?c=table'), L('Dust Collection','collection.html?c=acc'), L('Joypad','collection.html?c=acc'), L('Merch','collection.html?c=acc'), L('Gift Cards','collection.html?c=acc') ] },
    ], promo:{ title:'Plug & Play', text:'Officially supported add-ons', cta:'Shop all', img:IMG.spindle, href:'collection.html?c=acc' } },
    { id:'parts', label:'Replacement Parts', href:'collection.html', cols:[
      { head:'Parts', items:[ L('All Replacement Parts','collection.html'), L('CNC Cables','collection.html'), L('Drag Chain Add-Ons','collection.html'), L('Motors','collection.html'), L('Z Sliders','collection.html') ] },
      { head:'Trade', items:[ L('IPP Trade-In','contact.html') ] },
    ], promo:{ title:'Need a part?', text:'Find the right fit fast', cta:'Contact support', img:IMG.exploded, href:'contact.html' } },
    { id:'support', label:'Support', href:'faq.html', cols:[
      { head:'Get Help', items:[ L('Contact Us','contact.html'), L('Manuals','manuals.html'), L('Lead Times','lead-times.html'), L('FAQ','faq.html') ] },
    ], promo:{ title:'Set up in <1 hr', text:'Guides, manuals & answers', cta:'Open FAQ', img:IMG.exploded, href:'faq.html' } },
    { id:'more', label:'More', href:'blog.html', cols:[
      { head:'Company', items:[ L('About Us','about.html'), L('Community','community.html'), L('Onefinity Projects','projects.html') ] },
      { head:'Content', items:[ L('Blog','blog.html'), L('Podcast','podcast.html'), L('Events','events.html') ] },
    ], promo:{ title:'Join the experience', text:'Events, builds & community', cta:'See events', img:IMG.woodworker, href:'events.html' } },
  ];

  window.OF_DATA = {
    IMG: IMG,
    machines: machines,
    accessories: accessories,
    wizard: wizard,
    freebies: freebies,
    steps: steps,
    features: features,
    reviews: reviews,
    posts: posts,
    events: events,
    faqs: faqs,
    account: account,
    megaMenu: megaMenu,
    allProducts: machines.map(function (x) { return Object.assign({ type:'machine' }, x); })
      .concat(accessories.map(function (x) { return Object.assign({ type:'acc' }, x); })),
  };
})();
