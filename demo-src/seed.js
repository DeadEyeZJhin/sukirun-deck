/* SukiRun demo — the invented company, loaded once per browser before the app starts.
 *
 * Everything here is made up: Demo Distribution Co., its people, its shops and its orders.
 * The products are the 76 that ship inside the public Android app. The orders are dated
 * relative to TODAY, so "this week" and "this month" are never empty however old the demo is.
 *
 * Nothing leaves the browser. The demo build has no server address at all (make_demo.py
 * refuses to write it otherwise), so every save stays in this browser's localStorage.
 */
(function(){
  var FLAG = 'or_demo_seeded';
  var VERSION = '__DEMO_VERSION__';
  var PRODUCTS = __DEMO_PRODUCTS__;

  function keys(){ var out = []; for (var i = 0; i < localStorage.length; i++){ var k = localStorage.key(i); if (k && k.indexOf('or_') === 0) out.push(k); } return out; }
  window.sukiDemoReset = function(){
    try { keys().forEach(function(k){ localStorage.removeItem(k); }); } catch(e){}
    location.reload();
  };
  try { if (localStorage.getItem(FLAG) === VERSION) return; } catch(e){ return; }
  try { keys().forEach(function(k){ localStorage.removeItem(k); }); } catch(e){}

  // a fixed seed, so every visitor sees the same shops and the same orders
  var seed = 7;
  function rnd(){ seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }
  function pick(a){ return a[Math.floor(rnd() * a.length)]; }
  function sample(a, n){ var c = a.slice(), out = []; while (out.length < n && c.length) out.push(c.splice(Math.floor(rnd() * c.length), 1)[0]); return out; }

  function folderOf(n){
    var l = n.toLowerCase();
    if (l.indexOf('yummy gummy') === 0) return 'Yummy Gummies';
    if (l.indexOf('jellylite') >= 0) return 'Jelly';
    if (l.indexOf("season's") === 0) return 'Dressings & Sauces';
    if (l.indexOf('sardines') >= 0) return 'Sardines';
    if (l.indexOf('q ') === 0) return 'Noodles & Wrappers';
    if (l.indexOf('bubble gum') >= 0) return 'Bubble Gum';
    if (l.indexOf('lollipop') >= 0 || l.indexOf('stick') >= 0) return 'Lollipops & Sticks';
    if (/choco|cowhead|goldcoin|milk cube|rocky/.test(l)) return 'Chocolates';
    return 'Candies';
  }
  function soldAsOf(u){
    u = (u || '').toLowerCase();
    return u.indexOf('jar') >= 0 ? 'Jar' : u.indexOf('box') >= 0 ? 'Box' : u.indexOf('bag') >= 0 ? 'Bag'
         : u.indexOf('pc') >= 0 ? 'Pcs' : 'Pack';
  }
  var products = PRODUCTS.map(function(p){
    return {id: p.id, name: p.name, price: p.price, unit: p.unit || '', imgDefault: !!p.img,
            folder: [folderOf(p.name)], soldAs: soldAsOf(p.unit)};
  });

  var AGENTS = ['Alex Reyes', 'Bea Lim', 'Carlo Dizon'];
  var SHOPS = [
    ['s-mercado', 'Mercado Sari-Sari', 'Liza Mercado', 'Purok 3, Brgy. Taculing', 'Alex Reyes'],
    ['s-lucky8', 'Lucky 8 Mini Mart', 'Ramon Uy', 'Lacson St., Brgy. Mandalagan', 'Alex Reyes'],
    ['s-bayanihan', 'Bayanihan Store', 'Tessie Garcia', 'Brgy. Alijis', 'Alex Reyes'],
    ['s-golden', 'Golden Grain Trading', 'Victor Tan', 'Brgy. Bata', 'Alex Reyes'],
    ['s-sunrise', 'Sunrise Sari-Sari', 'Joy Villanueva', 'Brgy. Granada', 'Bea Lim'],
    ['s-jm', 'JM Variety Store', 'Jomar Pineda', 'Brgy. Estefania', 'Bea Lim'],
    ['s-kanto', 'Kanto Corner Store', 'Nora Aquino', 'Brgy. Tangub', 'Carlo Dizon'],
    ['s-tres', 'Tres Hermanas Store', 'Carmen Robles', 'Brgy. Villamonte', 'Carlo Dizon']
  ];
  var phone = function(){ return '0917 555 ' + String(Math.floor(rnd() * 10000)).padStart(4, '0'); };
  var now = new Date(), HOUR = 3600e3;
  var sellable = PRODUCTS.filter(function(p){ return p.price > 0; });
  var orders = [], n = 0;

  for (var back = 27; back >= 0; back--){
    var day = new Date(now); day.setHours(7, 30, 0, 0); day.setDate(day.getDate() - back);
    if (day.getDay() === 0) continue;                        // nobody works Sunday
    AGENTS.forEach(function(who){
      var k = back > 5 ? pick([0, 1, 1, 2]) : pick([1, 2, 2, 3]);
      var mine = SHOPS.filter(function(s){ return s[4] === who; });
      for (var i = 0; i < k; i++){
        var at = new Date(day.getTime() + Math.floor(rnd() * 540) * 60e3);
        if (at > now) continue;
        var s = pick(mine);
        var items = sample(sellable, 3 + Math.floor(rnd() * 4)).map(function(p){
          return {id: p.id, qty: pick([1, 2, 2, 3, 4, 5, 6]), name: p.name, unit: p.unit || '', price: p.price, soldAs: ''};
        });
        var total = Math.round(items.reduce(function(t, it){ return t + it.qty * it.price; }, 0) * 100) / 100;
        var iso = function(ms){ return new Date(ms).toISOString(); };
        var o = {id: 'o-demo-' + (++n), storeId: s[0], storeName: s[1], ownerName: s[2], contact: phone(),
                 address: s[3], landmark: '', notes: '', items: items, subtotal: total, total: total, payments: [],
                 createdAt: iso(at), status: 'submitted', statusAt: iso(at),
                 submittedBy: who, submittedRole: 'agent',
                 seenAt: iso(at.getTime() + 20 * 60e3), seenBy: 'Alex Reyes'};
        var age = (now - at) / HOUR;
        [['confirmed', 1, 'Alex Reyes', 3], ['packed', 18, 'Dana Cruz', 20], ['delivered', 40, 'Ed Santos', 44]]
          .forEach(function(st){
            if (age > st[3]){ var t = iso(at.getTime() + st[1] * HOUR);
              o[st[0] + 'At'] = t; o[st[0] + 'By'] = st[2]; o.status = st[0]; o.statusAt = t; }
          });
        if (o.status === 'packed' || o.status === 'delivered'){
          o.assignedName = 'Ed Santos'; o.assignedAt = o.packedAt; o.assignedBy = 'Alex Reyes';
        }
        if (o.status === 'delivered' && rnd() < 0.9)
          o.payments = [{amount: total, at: o.deliveredAt, by: 'Ed Santos', note: ''}];
        orders.push(o);
      }
    });
  }
  orders.sort(function(a, b){ return a.createdAt < b.createdAt ? 1 : -1; });
  orders.slice(0, 3).forEach(function(o){ delete o.seenAt; delete o.seenBy; });   // something New for the office

  var stores = SHOPS.map(function(s){
    var mine = orders.filter(function(o){ return o.storeId === s[0]; });
    var last = mine[0];
    return {id: s[0], storeName: s[1], ownerName: s[2], contact: phone(), address: s[3], landmark: '',
            savedByName: s[4], savedAt: new Date(now - 40 * 24 * HOUR).toISOString(),
            orderCount: mine.length, lastOrderAt: last ? last.createdAt : null, lastTotal: last ? last.total : 0,
            lastItems: last ? last.items.map(function(i){ return {id: i.id, qty: i.qty}; }) : []};
  });

  var set = function(k, v){ localStorage.setItem(k, JSON.stringify(v)); };
  set('or_products', products);
  set('or_local_orders', orders);
  set('or_stores', stores);
  set('or_name', 'Alex Reyes');
  // An invented account, so My profile shows a role and a target bar. No server address
  // exists in this build, so nothing can ever use the token -- it only fills the screens.
  set('or_session', {access_token: 'demo', refresh_token: 'demo', expires_at: 4102444800000,
    email: 'alex@demo-distribution.ph', userId: '', role: 'admin', fullName: 'Alex Reyes', active: true,
    monthlyTarget: 60000, signupKind: 'employee', profile: {storeName: '', contact: '', address: ''}});
  set('or_folder_colors', {'yummy gummies': 'pink', 'jelly': 'orange', 'dressings sauces': 'amber', 'sardines': 'sky',
    'noodles wrappers': 'yellow', 'bubble gum': 'magenta', 'lollipops sticks': 'purple', 'chocolates': 'brown', 'candies': 'green'});
  set('or_folder_order', ['Yummy Gummies', 'Candies', 'Chocolates', 'Lollipops & Sticks', 'Jelly', 'Bubble Gum',
    'Noodles & Wrappers', 'Dressings & Sauces', 'Sardines']);
  set('or_seen_build', __DEMO_BUILD__);
  localStorage.setItem(FLAG, VERSION);
})();
