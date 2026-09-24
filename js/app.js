(function () {
  const S = window.STORE;
  const $ = (sel) => document.querySelector(sel);
  const fmt = (n) => Math.round(n).toLocaleString('en-IN');
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const px = (id, w = 800) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;
  const imgOf = (p, w) => p.imgUrl || px(p.img, w);
  const byId = (id) => S.products.find((p) => p.id === id);
  const unitPrice = (p, size) => Math.round((p.price * (1 + (S.sizeUplift[size] || 0))) / 10) * 10;
  const catHref = (c) => '#/shop?cat=' + encodeURIComponent(c);

  // ---------- state ----------
  const ui = { img: 0, size: 0, qty: 1, openDetail: 0, openFaq: 0, pay: 'cod', area: 'dhaka', error: '', lastOrder: null, subscribed: false };
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem('hl_cart') || '[]'); } catch (e) { cart = []; }
  const saveCart = () => { localStorage.setItem('hl_cart', JSON.stringify(cart)); updateHeader(); if (!$('#drawer').classList.contains('hidden')) renderDrawer(); };

  function addToCart(id, size, qty) {
    const key = id + '|' + size;
    const ex = cart.find((c) => c.key === key);
    if (ex) ex.qty += qty; else cart.push({ key, id, size, qty });
    saveCart();
  }
  function cartLines() {
    return cart.map((c) => { const p = byId(c.id); const u = unitPrice(p, c.size); return { ...c, p, sizeLabel: S.sizes[p.cat][c.size], total: u * c.qty }; });
  }
  const subtotal = () => cartLines().reduce((a, l) => a + l.total, 0);
  const count = () => cart.reduce((a, c) => a + c.qty, 0);

  let toastT;
  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.remove('hidden'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.add('hidden'), 2200); }

  // ---------- routing ----------
  function parseRoute() {
    const h = location.hash.replace(/^#/, '') || '/';
    const [path, qs] = h.split('?');
    const params = new URLSearchParams(qs || '');
    const parts = path.split('/').filter(Boolean);
    return { page: parts[0] || 'home', id: parts[1], params };
  }
  const go = (hash) => { if (location.hash === hash) render(); else location.hash = hash; };

  // ---------- partials ----------
  function card(p, forceNew) {
    const tag = forceNew ? 'New' : p.tag;
    return `<div class="card">
      <a class="card-img" href="#/product/${p.id}" style="background-image:url('${imgOf(p)}')">${tag ? `<span class="badge ${tag === 'Sale' ? 'sale' : ''}">${esc(tag)}</span>` : ''}</a>
      <div class="card-body">
        <span class="card-cat">${esc(p.cat)}</span>
        <button class="card-name" data-go="#/product/${p.id}">${esc(p.name)}</button>
        <div class="price-row"><span class="price">৳${fmt(p.price)}</span>${p.was ? `<span class="was">৳${fmt(p.was)}</span>` : ''}</div>
        <button class="add-btn" data-action="quick-add" data-id="${p.id}">Add to Cart</button>
      </div></div>`;
  }
  const acc = (items, openIdx, action) => `<div class="accordion">${items.map(([q, a], i) => `
    <div class="acc-item"><button class="acc-head" data-action="${action}" data-i="${i}"><span>${esc(q)}</span><span>${openIdx === i ? '−' : '+'}</span></button>
    ${openIdx === i ? `<p class="acc-body">${esc(a)}</p>` : ''}</div>`).join('')}</div>`;

  function faqs() {
    return [
      ['Do you offer Cash on Delivery?', 'Yes. Cash on Delivery is available in all 64 districts. You can also pay in advance with bKash, Nagad or card.'],
      ['How long does delivery take?', 'Inside Dhaka city 1–2 working days, outside Dhaka 3–5 working days. You will receive SMS updates once your order is dispatched.'],
      ['What are the delivery charges?', `৳${S.delivery.dhaka} inside Dhaka and ৳${S.delivery.outside} outside Dhaka. Delivery is free on orders above ৳${fmt(S.freeShipAt)}.`],
      ['Can I return or exchange a product?', 'Yes, you can exchange within 7 days if the product is unused and in original packaging. Contact our hotline to arrange a pickup.'],
      ['Are the products really handmade?', 'Every item is handmade by artisan groups in Bangladesh, so small variations in colour and stitching are natural and part of its character.']
    ];
  }

  // ---------- pages ----------
  function homePage() {
    return `
    <section class="hero2"><div class="container hero2-grid">
      <div class="hero2-main">
        <div class="eyebrow">Festive Sale · Limited Time</div>
        <h1>Up to <em>25% off</em> handcrafted runners, kantha &amp; jute</h1>
        <p>Dress your home for the season with pieces made by artisans in Jashore, Tangail and Rangpur.</p>
        <div class="countdown" id="countdown"><span class="countdown-label">Ends in</span><div class="cd-box"><b data-cd="Days">00</b><small>Days</small></div><div class="cd-box"><b data-cd="Hours">00</b><small>Hours</small></div><div class="cd-box"><b data-cd="Mins">00</b><small>Mins</small></div><div class="cd-box"><b data-cd="Secs">00</b><small>Secs</small></div></div>
        <div class="hero2-actions"><a class="btn btn-primary" href="#/shop">Shop the Sale</a><a class="btn btn-outline" href="${catHref('Table Runners')}">Table Runners</a></div>
      </div>
      <div class="hero2-side">${S.products.filter((p) => p.was).concat(S.products.filter((p) => !p.was && p.tag)).slice(0, 4).map((p) => `
        <a class="pick" href="#/product/${p.id}"><div class="pick-img" style="background-image:url('${imgOf(p, 600)}')">${p.was ? `<span class="pick-off">-${Math.round((1 - p.price / p.was) * 100)}%</span>` : ''}</div>
        <div class="pick-body"><b>${esc(p.name)}</b><span>৳${fmt(p.price)}${p.was ? `<s>৳${fmt(p.was)}</s>` : ''}</span></div></a>`).join('')}</div>
    </div></section>

    <section class="trust"><div class="container">
      ${[['COD', 'Cash on Delivery', 'Pay at your doorstep'], ['64', 'Nationwide Delivery', 'All 64 districts'], ['৳', 'bKash & Nagad', 'Secure mobile payment'], ['7d', 'Easy Exchange', 'Within 7 days']]
        .map(([m, t, s]) => `<div class="trust-item"><span class="trust-mark">${m}</span><div><b>${t}</b><small>${s}</small></div></div>`).join('')}
    </div></section>

    <section class="container section" style="padding-bottom:16px">
      <h2 class="h2" style="margin-bottom:24px">Shop by Category</h2>
      <div class="grid-cats">${S.categories.map((c) => `
        <a class="cat-tile" href="${catHref(c)}"><div class="cat-img" style="background-image:url('${px(S.categoryImages[c])}')"></div>
        <div class="cat-body"><b>${esc(c)}</b><small>${S.products.filter((p) => p.cat === c).length} products</small></div></a>`).join('')}
      </div>
    </section>

    <section class="container section" style="padding-top:48px;padding-bottom:64px">
      <div class="section-head"><h2 class="h2">Best Sellers</h2><a class="link-btn" href="#/shop">View all →</a></div>
      <div class="grid-products">${S.bestsellers.map((id) => card(byId(id))).join('')}</div>
    </section>

    <section class="container" style="padding-bottom:64px"><div class="promos">
      <div class="promo" style="background-image:url('${px(17240972, 1200)}')"><div class="promo-body">
        <span class="promo-tag red">Up to 25% Off</span><h3>Eid Festive Collection</h3>
        <p>Jamdani runners and kantha linens to welcome guests in style.</p>
        <a class="btn btn-white" href="${catHref('Table Runners')}">Shop Festive</a></div></div>
      <div class="promo" style="background-image:url('${px(8479733, 1200)}')"><div class="promo-body">
        <span class="promo-tag">Buy 2, Get 1 Free</span><h3>Cushion Cover Combo</h3>
        <p>Mix and match any three cushion covers — refresh your sofa for less.</p>
        <a class="btn btn-white" href="${catHref('Cushion Covers')}">Shop Cushions</a></div></div>
    </div></section>

    <section class="container" style="padding-bottom:64px">
      <div class="section-head"><h2 class="h2">New Arrivals</h2><a class="link-btn" href="#/shop">View all →</a></div>
      <div class="grid-products">${S.newArrivals.map((id) => card(byId(id), true)).join('')}</div>
    </section>

    <section class="container" style="padding-bottom:64px">
      <h2 class="h2" style="margin-bottom:24px">Shop by Budget</h2>
      <div class="grid-budget">${[1000, 2000, 3000, 5000].map((a) => `
        <a class="budget" href="#/shop?max=${a}&sort=low"><small>Under</small><strong>৳${fmt(a)}</strong><span>${S.products.filter((p) => p.price < a).length} products →</span></a>`).join('')}
      </div>
    </section>

    <section class="story"><div class="container">
      <img src="${px(6634704, 1200)}" alt="Artisan weaving on a wooden loom">
      <div class="story-copy">
        <div class="eyebrow">Our Artisans</div>
        <h2>Supporting 120+ rural craftswomen across Bangladesh</h2>
        <p>Every runner and cushion cover is hand-finished by artisan groups we work with directly — fair wages, natural fibres, and quality checked in Dhaka before dispatch.</p>
      </div>
    </div></section>

    <section class="container" style="padding-top:64px">
      <div class="section-head"><h2 class="h2">What Our Customers Say</h2><span class="muted">★ 4.8 average from 2,300+ reviews</span></div>
      <div class="grid-reviews">${S.reviews.map((r) => `
        <div class="review"><span class="stars">★★★★★</span><p>“${esc(r.text)}”</p>
        <div class="review-by"><span class="avatar">${esc(r.name[0])}</span><div><b>${esc(r.name)}</b><small>${esc(r.city)} · Verified buyer · ${esc(r.item)}</small></div></div></div>`).join('')}
      </div>
    </section>

    <section class="faq-wrap"><h2 class="h2">Frequently Asked Questions</h2>${acc(faqs(), ui.openFaq, 'faq')}</section>

    <section class="container section"><div class="newsletter">
      <div><h2>Get 10% off your first order</h2><p>Subscribe for new arrivals, Eid &amp; Puja collections and exclusive offers.</p></div>
      ${ui.subscribed ? `<div class="success">Thank you! Your code WELCOME10 is on its way.</div>`
        : `<form id="news-form"><input class="input" required placeholder="Email or mobile number"><button class="btn btn-primary" type="submit">Subscribe</button></form>`}
    </div></section>`;
  }

  function shopPage(params) {
    const cat = params.get('cat') || 'All';
    const q = (params.get('q') || '').trim();
    const max = +params.get('max') || 0;
    const sort = params.get('sort') || 'featured';
    let list = S.products.filter((p) => cat === 'All' || p.cat === cat);
    if (max) list = list.filter((p) => p.price < max);
    if (q) list = list.filter((p) => (p.name + ' ' + p.cat).toLowerCase().includes(q.toLowerCase()));
    if (sort === 'low') list.sort((a, b) => a.price - b.price);
    if (sort === 'high') list.sort((a, b) => b.price - a.price);
    const title = q ? 'Search results' : max ? `Under ৳${fmt(max)}` : cat === 'All' ? 'All Products' : cat;
    const opt = (v, l) => `<option value="${v}" ${sort === v ? 'selected' : ''}>${l}</option>`;
    return `<section class="container" style="padding-top:28px;padding-bottom:64px">
      <div class="crumbs"><button data-go="#/">Home</button><span>/</span><span>${esc(title)}</span></div>
      <h1 class="page-title">${esc(title)}</h1>
      <div class="toolbar">
        <div class="chips">${['All', ...S.categories].map((c) => `<a class="chip ${c === cat && !max ? 'active' : ''}" href="${c === 'All' ? '#/shop' : catHref(c)}">${esc(c)}</a>`).join('')}</div>
        <div class="sort"><span>${list.length} products</span><select id="sort-select">${opt('featured', 'Sort: Featured')}${opt('low', 'Price: Low to High')}${opt('high', 'Price: High to Low')}</select></div>
      </div>
      ${list.length ? '' : `<div class="empty">No products match “${esc(q)}”.</div>`}
      <div class="grid-products">${list.map((p) => card(p)).join('')}</div>
    </section>`;
  }

  function productPage(id) {
    const p = byId(id) || S.products[0];
    const sizes = S.sizes[p.cat];
    if (ui.size >= sizes.length) ui.size = 0;
    const unit = unitPrice(p, ui.size);
    const gallery = [p.img, ...S.products.filter((x) => x.cat === p.cat && x.id !== p.id).map((x) => x.img), S.categoryImages[p.cat]]
      .filter((v, i, a) => a.indexOf(v) === i).slice(0, 4).map((i) => (i === p.img ? imgOf(p, 1200) : px(i, 1200)));
    if (ui.img >= gallery.length) ui.img = 0;
    const details = [
      ['Product Details', p.desc + ' Colour may vary slightly due to the handmade nature of the product.'],
      ['Care Instructions', 'Hand wash or gentle machine wash in cold water. Dry in shade. Warm iron on the reverse side.'],
      ['Delivery & Returns', 'Delivery across all 64 districts. Inside Dhaka 1–2 days, outside Dhaka 3–5 days. Easy exchange within 7 days if the product is unused with tags.']
    ];
    const related = S.products.filter((x) => x.id !== p.id).sort((a, b) => (b.cat === p.cat) - (a.cat === p.cat)).slice(0, 4);
    return `<section class="container" style="padding-top:28px;padding-bottom:64px">
      <div class="crumbs"><button data-go="#/">Home</button><span>/</span><button data-go="${catHref(p.cat)}">${esc(p.cat)}</button><span>/</span><span>${esc(p.name)}</span></div>
      <div class="pdp">
        <div class="gallery">
          <div class="gallery-main" style="background-image:url('${gallery[ui.img]}')" role="img" aria-label="${esc(p.name)}"></div>
          <div class="thumbs">${gallery.map((g, i) => `<button class="thumb ${i === ui.img ? 'active' : ''}" data-action="thumb" data-i="${i}" style="background-image:url('${g}')" aria-label="Image ${i + 1}"></button>`).join('')}</div>
        </div>
        <div class="pdp-info">
          <div class="pdp-head">
            <span class="eyebrow" style="letter-spacing:.06em">${esc(p.cat)}</span>
            <h1>${esc(p.name)}</h1>
            <div class="pdp-meta">★ 4.8 (${40 + p.name.length * 3} reviews) · SKU HL-${p.id.toUpperCase()}-${ui.size + 1} · <b>In stock</b></div>
            <div class="price-row" style="gap:10px"><span class="pdp-price">৳${fmt(unit)}</span>${p.was && ui.size === 0 ? `<span class="pdp-was">৳${fmt(p.was)}</span>` : ''}</div>
          </div>
          <p class="pdp-desc">${esc(p.desc)}</p>
          <div><div class="opt-label">Size: <span>${esc(sizes[ui.size])}</span></div>
            <div class="sizes">${sizes.map((s, i) => `<button class="size ${i === ui.size ? 'active' : ''}" data-action="size" data-i="${i}">${esc(s)}</button>`).join('')}</div></div>
          <div class="buy-row">
            <div class="qty"><button data-action="qty" data-d="-1" aria-label="Decrease">−</button><span>${ui.qty}</span><button data-action="qty" data-d="1" aria-label="Increase">+</button></div>
            <button class="btn btn-green-outline" data-action="add" data-id="${p.id}">Add to Cart</button>
            <button class="btn btn-primary" data-action="buy" data-id="${p.id}">Buy Now · ৳${fmt(unit * ui.qty)}</button>
          </div>
          <div class="ship-info"><span><b>Inside Dhaka:</b> ৳${S.delivery.dhaka} · 1–2 days</span><span><b>Outside Dhaka:</b> ৳${S.delivery.outside} · 3–5 days</span><span><b>Payment:</b> COD, bKash, Nagad, Card</span></div>
          ${acc(details, ui.openDetail, 'detail')}
        </div>
      </div>
      <div class="related"><h2 class="h2">You May Also Like</h2><div class="grid-products">${related.map((x) => card(x)).join('')}</div></div>
    </section>`;
  }

  function checkoutPage() {
    const lines = cartLines(), sub = subtotal();
    const del = sub >= S.freeShipAt || sub === 0 ? 0 : S.delivery[ui.area];
    const pays = [['cod', 'Cash on Delivery', 'Pay when you receive the product'], ['bkash', 'bKash', 'Pay instantly with your bKash account'], ['nagad', 'Nagad', 'Pay instantly with your Nagad account'], ['card', 'Debit / Credit Card', 'Visa, Mastercard, Amex via SSLCommerz']];
    return `<section class="checkout"><h1 class="page-title" style="margin-bottom:24px">Checkout</h1>
      <form class="checkout-grid" id="checkout-form" novalidate>
        <div class="stack">
          <div class="panel"><h2>1. Delivery Information</h2>
            <input class="input" name="name" placeholder="Full name" autocomplete="name">
            <input class="input" name="phone" placeholder="Mobile number (01XXXXXXXXX)" inputmode="numeric" autocomplete="tel">
            <select class="input" name="area" id="area-select">
              <option value="dhaka" ${ui.area === 'dhaka' ? 'selected' : ''}>Inside Dhaka City (৳${S.delivery.dhaka})</option>
              <option value="outside" ${ui.area === 'outside' ? 'selected' : ''}>Outside Dhaka (৳${S.delivery.outside})</option>
            </select>
            <input class="input" name="address" placeholder="Full address (house, road, area, district)" autocomplete="street-address">
          </div>
          <div class="panel"><h2>2. Payment Method</h2>
            ${pays.map(([id, l, s]) => `<button type="button" class="pay-opt ${ui.pay === id ? 'active' : ''}" data-action="pay" data-id="${id}"><span class="radio"></span><span><b>${l}</b><small>${s}</small></span></button>`).join('')}
          </div>
        </div>
        <div class="panel summary"><h2>Order Summary</h2>
          ${lines.length ? lines.map((l) => `<div class="sum-line"><span>${esc(l.p.name)} · ${esc(l.sizeLabel)} × ${l.qty}</span><b style="white-space:nowrap">৳${fmt(l.total)}</b></div>`).join('') : '<div class="muted">Your cart is empty.</div>'}
          <div class="sum-total">
            <div class="sum-line"><span>Subtotal</span><span>৳${fmt(sub)}</span></div>
            <div class="sum-line"><span>Delivery charge</span><span>${del === 0 ? 'Free' : '৳' + del}</span></div>
            <div class="sum-line grand"><span>Total</span><span>৳${fmt(sub + del)}</span></div>
          </div>
          <button class="btn btn-primary" type="submit" style="height:50px;padding:0">Place Order</button>
          ${ui.error ? `<div class="error">${esc(ui.error)}</div>` : ''}
        </div>
      </form></section>`;
  }

  function donePage() {
    const o = ui.lastOrder || { no: '—', phone: '' };
    return `<section class="done"><span class="done-mark">✓</span><h1>Thank you, your order is confirmed</h1>
      <p>Order #${esc(o.no)} · We'll call ${esc(o.phone)} to confirm before dispatch. You'll receive SMS updates on delivery.</p>
      <a class="btn btn-primary" href="#/shop" style="margin-top:8px">Continue Shopping</a></section>`;
  }

  // ---------- chrome ----------
  function renderNav(route) {
    const cat = route.params.get('cat');
    const items = [['Home', '#/', route.page === 'home'], ['All Products', '#/shop', route.page === 'shop' && !cat && !route.params.get('max') && !route.params.get('q')],
      ...S.categories.map((c) => [c, catHref(c), route.page === 'shop' && cat === c])];
    $('#nav').innerHTML = items.map(([l, h, a]) => `<a class="nav-link ${a ? 'active' : ''}" href="${h}">${esc(l)}</a>`).join('');
  }
  function updateHeader() { $('#cart-count').textContent = count(); $('#cart-sub').textContent = fmt(subtotal()); }

  function renderDrawer() {
    const lines = cartLines(), sub = subtotal();
    const pct = Math.min(100, Math.round((sub / S.freeShipAt) * 100));
    $('#drawer-panel').innerHTML = `
      <div class="drawer-head"><span>Shopping Cart (${count()})</span><button class="drawer-close" data-action="close-cart" aria-label="Close">×</button></div>
      <div class="ship-bar"><div>${sub >= S.freeShipAt ? 'You have unlocked FREE delivery!' : `Add ৳${fmt(S.freeShipAt - sub)} more for free delivery`}</div><div class="bar"><div style="width:${pct}%"></div></div></div>
      <div class="drawer-items">${lines.length ? lines.map((l) => `
        <div class="line-item"><div class="line-img" style="background-image:url('${imgOf(l.p, 300)}')"></div>
          <div><b>${esc(l.p.name)}</b><small>${esc(l.sizeLabel)}</small>
            <div class="line-qty"><button data-action="line-qty" data-key="${l.key}" data-d="-1">−</button><span>${l.qty}</span><button data-action="line-qty" data-key="${l.key}" data-d="1">+</button><button class="remove" data-action="remove" data-key="${l.key}">Remove</button></div></div>
          <div class="line-total">৳${fmt(l.total)}</div></div>`).join('') : '<div class="empty">Your cart is empty.</div>'}
      </div>
      <div class="drawer-foot">
        <div class="sum-line"><span>Subtotal</span><span>৳${fmt(sub)}</span></div>
        <button class="btn btn-primary" data-action="checkout">Proceed to Checkout</button>
        <button class="btn btn-outline" data-action="close-cart" style="height:44px;padding:0;font-size:14px">Continue Shopping</button>
      </div>`;
  }
  const openCart = () => { renderDrawer(); $('#drawer').classList.remove('hidden'); document.body.style.overflow = 'hidden'; };
  const closeCart = () => { $('#drawer').classList.add('hidden'); document.body.style.overflow = ''; };

  // ---------- render ----------
  let lastKey = '';
  function render() {
    const r = parseRoute();
    const key = r.page + '/' + (r.id || '');
    if (key !== lastKey) { if (r.page === 'product') Object.assign(ui, { img: 0, size: 0, qty: 1, openDetail: 0 }); if (r.page === 'checkout') ui.error = ''; }
    const pages = { home: homePage, shop: () => shopPage(r.params), product: () => productPage(r.id), checkout: checkoutPage, done: donePage };
    $('#app').innerHTML = (pages[r.page] || homePage)();
    if (r.page === 'shop') $('#search-input').value = r.params.get('q') || '';
    renderNav(r); updateHeader();
    if (key !== lastKey) window.scrollTo(0, 0);
    lastKey = key;
  }

  // ---------- events ----------
  document.addEventListener('click', (e) => {
    const goEl = e.target.closest('[data-go]');
    if (goEl) { go(goEl.dataset.go); return; }
    const el = e.target.closest('[data-action]');
    if (!el) return;
    const a = el.dataset.action, i = +el.dataset.i, d = +el.dataset.d;
    const rerender = () => { const y = scrollY; render(); scrollTo(0, y); };
    switch (a) {
      case 'open-cart': openCart(); break;
      case 'close-cart': closeCart(); break;
      case 'quick-add': { const p = byId(el.dataset.id); addToCart(p.id, 0, 1); toast(p.name + ' added to cart'); break; }
      case 'thumb': ui.img = i; rerender(); break;
      case 'size': ui.size = i; rerender(); break;
      case 'qty': ui.qty = Math.max(1, ui.qty + d); rerender(); break;
      case 'detail': ui.openDetail = ui.openDetail === i ? -1 : i; rerender(); break;
      case 'faq': ui.openFaq = ui.openFaq === i ? -1 : i; rerender(); break;
      case 'add': addToCart(el.dataset.id, ui.size, ui.qty); openCart(); break;
      case 'buy': addToCart(el.dataset.id, ui.size, ui.qty); go('#/checkout'); break;
      case 'line-qty': { const c = cart.find((x) => x.key === el.dataset.key); c.qty = Math.max(1, c.qty + d); saveCart(); break; }
      case 'remove': cart = cart.filter((x) => x.key !== el.dataset.key); saveCart(); break;
      case 'checkout': if (!cart.length) { toast('Your cart is empty'); break; } closeCart(); go('#/checkout'); break;
      case 'pay': ui.pay = el.dataset.id; document.querySelectorAll('.pay-opt').forEach((b) => b.classList.toggle('active', b === el)); break;
    }
  });

  document.addEventListener('change', (e) => {
    if (e.target.id === 'sort-select') {
      const r = parseRoute(); r.params.set('sort', e.target.value); go('#/shop?' + r.params.toString());
    }
    if (e.target.id === 'area-select') {
      const f = $('#checkout-form'); const vals = Object.fromEntries(new FormData(f));
      ui.area = e.target.value; const y = scrollY; render(); scrollTo(0, y);
      const nf = $('#checkout-form'); ['name', 'phone', 'address'].forEach((k) => (nf.elements[k].value = vals[k] || ''));
    }
  });

  document.addEventListener('submit', (e) => {
    e.preventDefault();
    if (e.target.id === 'search-form') {
      const q = $('#search-input').value.trim();
      go('#/shop' + (q ? '?q=' + encodeURIComponent(q) : ''));
    }
    if (e.target.id === 'news-form') { ui.subscribed = true; const y = scrollY; render(); scrollTo(0, y); }
    if (e.target.id === 'checkout-form') {
      const v = Object.fromEntries(new FormData(e.target));
      const errEl = () => { const y = scrollY; render(); scrollTo(0, y); const nf = $('#checkout-form'); ['name', 'phone', 'address'].forEach((k) => (nf.elements[k].value = v[k] || '')); };
      if (!cart.length) { ui.error = 'Your cart is empty.'; return errEl(); }
      if (!v.name.trim() || !/^01\d{9}$/.test(v.phone.trim()) || !v.address.trim()) { ui.error = 'Please enter your name, a valid 11-digit mobile number and address.'; return errEl(); }
      // TODO: send order to your backend / payment gateway here.
      ui.lastOrder = { no: 'HL' + Math.floor(100000 + Math.random() * 899999), phone: v.phone.trim(), payment: ui.pay, area: ui.area, items: cartLines(), total: subtotal() };
      cart = []; saveCart(); ui.error = '';
      go('#/done');
    }
  });

  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeCart(); });
  window.addEventListener('hashchange', render);

  function tick() {
    const el = document.getElementById('countdown'); if (!el) return;
    let s = Math.max(0, Math.floor((new Date(S.saleEnds) - Date.now()) / 1000));
    const v = { Days: Math.floor(s / 86400), Hours: Math.floor((s % 86400) / 3600), Mins: Math.floor((s % 3600) / 60), Secs: s % 60 };
    Object.entries(v).forEach(([k, n]) => { const b = el.querySelector('[data-cd="' + k + '"]'); if (b) b.textContent = String(n).padStart(2, '0'); });
  }
  setInterval(tick, 1000); window.addEventListener('hashchange', () => setTimeout(tick));
  $('#free-ship-label').textContent = fmt(S.freeShipAt);
  render(); tick();
})();
