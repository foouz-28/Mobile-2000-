/* Checkout — multi-step: shipping -> payment -> review -> confirmation. */
(function () {
  UI.mount();
  const root = document.getElementById("checkoutRoot");
  const lang = I18N.lang;
  const SHIPPING_FREE_OVER = 100, SHIPPING_COST = 3;

  let step = 0;
  const data = { name: "", phone: "", city: "", address: "", payment: "knet" };
  const user = Store.currentUser();
  if (user) data.name = user.name;

  function totals() {
    const subtotal = Store.cartSubtotal();
    const coupon = Store.getCoupon();
    const discount = coupon ? subtotal * coupon.rate : 0;
    const after = subtotal - discount;
    const shipping = after >= SHIPPING_FREE_OVER ? 0 : SHIPPING_COST;
    return { subtotal, discount, coupon, shipping, total: after + shipping };
  }

  const STEP_LABELS = [t("checkout.shipping"), t("checkout.payment"), t("checkout.review"), t("checkout.done")];

  function stepper() {
    return `<div class="row" style="gap:0;margin:20px 0 28px">
      ${STEP_LABELS.map((l, i) => `
        <div style="flex:1;text-align:center;position:relative">
          <div style="width:34px;height:34px;border-radius:50%;margin:0 auto;display:grid;place-items:center;font-weight:700;
            background:${i <= step ? "var(--primary)" : "var(--bg-soft)"};color:${i <= step ? "#fff" : "var(--text-soft)"};border:1.5px solid ${i <= step ? "var(--primary)" : "var(--border)"}">
            ${i < step ? "✓" : i + 1}</div>
          <div style="font-size:.78rem;margin-top:6px;color:${i <= step ? "var(--primary)" : "var(--text-soft)"}">${l}</div>
        </div>`).join("")}
    </div>`;
  }

  function summaryCard() {
    const tt = totals();
    const items = Store.getCart().map(i => ({ ...i, p: Store.getProduct(i.id) })).filter(i => i.p);
    return `
      <aside class="card card-pad" style="position:sticky;top:90px">
        <h3 data-i18n="cart.summary">Order summary</h3>
        <div class="divider-line"></div>
        ${items.map(i => `<div class="summary-row"><span>${i.p.name} ×${i.qty}</span><span>${UI.KD(i.p.price * i.qty)}</span></div>`).join("")}
        <div class="divider-line"></div>
        <div class="summary-row"><span>${t("cart.subtotal")}</span><span>${UI.KD(tt.subtotal)}</span></div>
        ${tt.discount ? `<div class="summary-row" style="color:var(--green-500)"><span>${t("cart.discount")}</span><span>−${UI.KD(tt.discount)}</span></div>` : ""}
        <div class="summary-row"><span>${t("cart.shipping")}</span><span>${tt.shipping === 0 ? t("cart.free") : UI.KD(tt.shipping)}</span></div>
        <div class="summary-row total"><span>${t("cart.total")}</span><span>${UI.KD(tt.total)}</span></div>
      </aside>`;
  }

  function render() {
    if (!Store.getCart().length && step < 3) {
      root.innerHTML = `<div class="empty-state"><div class="ico">${UI.ic("cart")}</div><h2>${t("cart.empty")}</h2>
        <a class="btn btn-primary btn-lg" href="products.html" style="margin-top:16px">${t("cta.continue")}</a></div>`;
      return;
    }
    if (step === 3) return renderDone();

    root.innerHTML = `
      ${stepper()}
      <div class="cart-layout">
        <div class="card card-pad">${[shippingForm, paymentForm, reviewBlock][step]()}</div>
        ${summaryCard()}
      </div>`;
    bind();
  }

  function shippingForm() {
    return `
      <h3 style="margin-bottom:16px"><span class="li">${UI.ic("box")}</span> ${t("checkout.shipping")}</h3>
      <div class="field"><label>${t("auth.name")}</label><input class="input" id="f_name" value="${data.name}"><div class="err">${t("auth.required")}</div></div>
      <div class="field"><label>${lang === "ar" ? "رقم الهاتف" : "Phone number"}</label><input class="input" id="f_phone" value="${data.phone}" placeholder="9XXX XXXX"><div class="err">${t("auth.required")}</div></div>
      <div class="field"><label>${lang === "ar" ? "المدينة / المحافظة" : "City / Governorate"}</label>
        <select class="input" id="f_city">
          ${["Capital", "Hawalli", "Farwaniya", "Ahmadi", "Jahra", "Mubarak Al-Kabeer"].map(c => `<option ${data.city === c ? "selected" : ""}>${c}</option>`).join("")}
        </select></div>
      <div class="field"><label>${lang === "ar" ? "العنوان التفصيلي" : "Full address"}</label><textarea class="input" id="f_address" rows="3">${data.address}</textarea><div class="err">${t("auth.required")}</div></div>
      <button class="btn btn-primary btn-lg btn-block" id="toNext">${t("finder.next")} ${UI.icons.arrow}</button>`;
  }

  function paymentForm() {
    const opts = [
      { v: "knet", ico: UI.ic("bank"), label: "KNET" },
      { v: "visa", ico: UI.ic("card"), label: "Visa / Mastercard" },
      { v: "cod", ico: UI.ic("cash"), label: lang === "ar" ? "الدفع عند الاستلام" : "Cash on delivery" },
    ];
    return `
      <h3 style="margin-bottom:16px"><span class="li">${UI.ic("card")}</span> ${t("checkout.payment")}</h3>
      <div class="grid" style="gap:10px">
        ${opts.map(o => `
          <label class="card card-pad row" style="cursor:pointer;gap:12px">
            <input type="radio" name="pay" value="${o.v}" ${data.payment === o.v ? "checked" : ""} style="accent-color:var(--primary);width:18px;height:18px">
            <span style="font-size:1.5rem">${o.ico}</span><b>${o.label}</b>
          </label>`).join("")}
      </div>
      <p class="muted" style="font-size:.82rem;margin-top:12px"><span class="li">${UI.ic("lock")}</span> ${lang === "ar" ? "هذه عملية محاكاة — لن يتم سحب أي مبلغ." : "This is a simulated payment — no money will be charged."}</p>
      <div class="row" style="gap:10px;margin-top:18px">
        <button class="btn btn-ghost" id="toBack">${UI.icons.arrow} ${t("finder.back")}</button>
        <button class="btn btn-primary" style="flex:1" id="toNext">${t("finder.next")} ${UI.icons.arrow}</button>
      </div>`;
  }

  function reviewBlock() {
    return `
      <h3 style="margin-bottom:16px"><span class="li">${UI.ic("shield")}</span> ${t("checkout.review")}</h3>
      <div class="card card-pad" style="margin-bottom:14px">
        <b><span class="li">${UI.ic("box")}</span> ${t("checkout.shipping")}</b>
        <p class="muted">${data.name} · ${data.phone}<br>${data.address}, ${data.city}</p>
      </div>
      <div class="card card-pad" style="margin-bottom:14px">
        <b><span class="li">${UI.ic("card")}</span> ${t("checkout.payment")}</b>
        <p class="muted">${data.payment.toUpperCase()}</p>
      </div>
      <p class="muted" style="font-size:.85rem"><span class="li">${UI.ic("truck")}</span> ${t("cart.delivery")}</p>
      <div class="row" style="gap:10px;margin-top:18px">
        <button class="btn btn-ghost" id="toBack">${UI.icons.arrow} ${t("finder.back")}</button>
        <button class="btn btn-primary" style="flex:1" id="placeOrder">${t("checkout.placeOrder")}</button>
      </div>`;
  }

  function renderDone() {
    const order = JSON.parse(sessionStorage.getItem("mh_last_order") || "{}");
    root.innerHTML = `
      <div class="quiz-card center reveal" style="max-width:560px;margin:30px auto">
        <div style="font-size:4rem;color:var(--green-500)" class="li">${UI.ic("shield")}</div>
        <h2 style="margin:10px 0">${t("checkout.success")}</h2>
        <p class="muted">${lang === "ar" ? "رقم الطلب" : "Order number"}: <b>${order.id || "ORD-XXXX"}</b></p>
        <div class="card card-pad" style="text-align:start;margin:20px 0">
          <div class="summary-row"><span>${t("cart.total")}</span><b>${UI.KD(order.total || 0)}</b></div>
          <div class="summary-row"><span>${lang === "ar" ? "التوصيل المتوقع" : "Estimated delivery"}</span><b>${order.eta || "2–4 days"}</b></div>
          <div class="summary-row"><span>${lang === "ar" ? "نقاط مكتسبة" : "Points earned"}</span><b>+${order.points || 0}</b></div>
        </div>
        <div class="row" style="gap:10px;justify-content:center">
          <a class="btn btn-primary btn-lg" href="account.html">${t("checkout.track")}</a>
          <a class="btn btn-ghost btn-lg" href="products.html">${t("cta.continue")}</a>
        </div>
      </div>`;
    UI.revealOnScroll();
  }

  function bind() {
    const next = document.getElementById("toNext");
    const back = document.getElementById("toBack");
    if (back) back.onclick = () => { step--; render(); };

    if (step === 0 && next) next.onclick = () => {
      data.name = val("f_name"); data.phone = val("f_phone"); data.city = val("f_city"); data.address = val("f_address");
      let ok = true;
      [["f_name", data.name], ["f_phone", data.phone], ["f_address", data.address]].forEach(([id, v]) => {
        const field = document.getElementById(id).closest(".field");
        if (!v.trim()) { field.classList.add("invalid"); ok = false; } else field.classList.remove("invalid");
      });
      if (ok) { step++; render(); }
    };

    if (step === 1 && next) next.onclick = () => {
      const sel = document.querySelector('input[name="pay"]:checked');
      data.payment = sel ? sel.value : "knet";
      step++; render();
    };

    const place = document.getElementById("placeOrder");
    if (place) place.onclick = () => {
      const tt = totals();
      const id = "ORD-" + Math.floor(1000 + Math.random() * 9000);
      const points = Math.round(tt.total / 10);
      const order = {
        id, customer: data.name || "Guest", date: new Date().toISOString().slice(0, 10),
        items: Store.cartCount(), total: Math.round(tt.total), status: "Processing",
        payment: data.payment.toUpperCase(), eta: lang === "ar" ? "٢–٤ أيام" : "2–4 days", points,
      };
      Store.addOrder(order);
      sessionStorage.setItem("mh_last_order", JSON.stringify(order));
      Store.clearCart(); Store.clearCoupon();
      step = 3; render();
    };
  }

  const val = id => (document.getElementById(id) || {}).value || "";
  render();
})();
