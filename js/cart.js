/* Shopping cart — items, qty, coupon, shipping, summary, recommended. */
(function () {
  UI.mount();
  const root = document.getElementById("cartRoot");
  const SHIPPING_FREE_OVER = 100;
  const SHIPPING_COST = 3;

  function render() {
    const cart = Store.getCart();
    if (!cart.length) {
      root.innerHTML = `
        <div class="empty-state">
          <div class="ico">${UI.ic("cart")}</div>
          <h2>${t("cart.empty")}</h2>
          <p>${t("cart.empty.sub")}</p>
          <a class="btn btn-primary btn-lg" href="products.html" style="margin-top:16px">${t("cta.continue")}</a>
        </div>`;
      return;
    }

    const items = cart.map(i => ({ ...i, p: Store.getProduct(i.id) })).filter(i => i.p);
    const subtotal = Store.cartSubtotal();
    const coupon = Store.getCoupon();
    const discount = coupon ? subtotal * coupon.rate : 0;
    const afterDiscount = subtotal - discount;
    const shipping = afterDiscount >= SHIPPING_FREE_OVER ? 0 : SHIPPING_COST;
    const total = afterDiscount + shipping;

    root.innerHTML = `
      <div class="cart-layout">
        <div>
          ${items.map(i => `
            <div class="cart-item" data-id="${i.id}">
              <a href="product.html?id=${i.id}" class="thumb">${UI.art(i.p)}</a>
              <div>
                <a href="product.html?id=${i.id}"><b>${i.p.name}</b></a>
                <div class="muted" style="font-size:.85rem">${i.p.brand} · ${i.p.specs.ram}GB/${i.p.specs.storage}GB</div>
                <div class="row" style="gap:14px;margin-top:8px">
                  <div class="qty">
                    <button data-act="dec" data-id="${i.id}">−</button>
                    <span>${i.qty}</span>
                    <button data-act="inc" data-id="${i.id}">+</button>
                  </div>
                  <button class="link" data-act="del" data-id="${i.id}" style="color:var(--red-500);font-weight:600;font-size:.85rem"><span class="li">${UI.ic("trash")}</span> ${t("admin.delete")}</button>
                </div>
              </div>
              <div style="text-align:end">
                <b style="font-size:1.1rem">${UI.KD(i.p.price * i.qty)}</b>
                ${i.qty > 1 ? `<div class="muted" style="font-size:.8rem">${UI.KD(i.p.price)} × ${i.qty}</div>` : ""}
              </div>
            </div>`).join("")}
        </div>

        <aside class="card card-pad" style="position:sticky;top:90px">
          <h3 data-i18n="cart.summary">Order summary</h3>
          <div class="divider-line"></div>
          <div class="field" style="margin-top:6px">
            <div class="row" style="gap:8px">
              <input class="input" id="couponInput" placeholder="${t("cart.coupon")}" value="${coupon ? coupon.code : ""}">
              <button class="btn btn-ghost" id="applyCoupon">${t("cart.apply")}</button>
            </div>
            <small class="muted">${lang === "ar" ? "جرّب: MOBILE10 ، WELCOME15" : "Try: MOBILE10, WELCOME15"}</small>
          </div>
          <div class="summary-row"><span data-i18n="cart.subtotal">Subtotal</span><span>${UI.KD(subtotal)}</span></div>
          ${discount ? `<div class="summary-row" style="color:var(--green-500)"><span>${t("cart.discount")} (${coupon.code})</span><span>−${UI.KD(discount)}</span></div>` : ""}
          <div class="summary-row"><span data-i18n="cart.shipping">Shipping</span><span>${shipping === 0 ? t("cart.free") : UI.KD(shipping)}</span></div>
          <div class="summary-row total"><span data-i18n="cart.total">Total</span><span>${UI.KD(total)}</span></div>
          <p class="muted" style="font-size:.82rem;margin:8px 0"><span class="li">${UI.ic("truck")}</span> ${t("cart.delivery")}</p>
          <a class="btn btn-primary btn-lg btn-block" href="checkout.html" style="margin-top:10px">${t("cta.checkout")} ${UI.icons.arrow}</a>
          <a class="btn btn-ghost btn-block" href="products.html" style="margin-top:10px">${t("cta.continue")}</a>
        </aside>
      </div>

      <section class="section">
        <div class="section-head"><div><h2>${t("home.recommended")}</h2></div></div>
        <div id="recoGrid"></div>
      </section>`;

    // recommended = top popular not in cart
    const inCart = new Set(cart.map(c => c.id));
    const reco = [...Store.getProducts()].filter(p => !inCart.has(p.id)).sort((a, b) => b.popularity - a.popularity).slice(0, 4);
    document.getElementById("recoGrid").innerHTML = UI.cardGrid(reco);

    bind();
    UI.revealOnScroll();
  }

  const lang = I18N.lang;

  function bind() {
    root.querySelectorAll("[data-act]").forEach(b => b.onclick = () => {
      const id = b.dataset.id, act = b.dataset.act;
      const item = Store.getCart().find(i => i.id === id);
      if (act === "inc") Store.setQty(id, item.qty + 1);
      if (act === "dec") Store.setQty(id, item.qty - 1);
      if (act === "del") { Store.removeFromCart(id); UI.toast(t("toast.removed")); }
      render();
    });
    const ac = document.getElementById("applyCoupon");
    if (ac) ac.onclick = () => {
      const code = document.getElementById("couponInput").value;
      if (!code.trim()) { Store.clearCoupon(); render(); return; }
      if (Store.applyCoupon(code)) { UI.toast(t("cart.couponOk")); } else { UI.toast(t("cart.couponBad"), false); }
      render();
    };
  }

  render();
  Store.on("cart", () => {}); // badges handled globally
})();
