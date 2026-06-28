/* Product details page — gallery, specs, scores, tabs, similar, recently viewed. */
(function () {
  UI.mount();
  const root = document.getElementById("pd-root");
  const id = new URLSearchParams(location.search).get("id");
  const p = Store.getProduct(id);

  if (!p) {
    root.innerHTML = `<div class="empty-state"><div class="ico">${UI.ic("search")}</div><p>Product not found.</p><a class="btn btn-primary" href="products.html">${t("nav.shop")}</a></div>`;
    return;
  }
  document.title = `${p.name} — MobileHub`;
  Store.addViewed(p.id);

  let qty = 1;
  const s = p.specs;
  const lang = I18N.lang;
  const d = UI.discount(p);
  const out = p.stock <= 0;

  const isPhone = p.type === "phone";
  // Non-phones carry their own concise specList; phones use the full table.
  const specRows = p.specList ? p.specList : [
    ["spec.display", `${s.screen}" ${s.resolution}, ${s.refresh}Hz`],
    ["spec.processor", s.processor],
    ["spec.ram", `${s.ram} GB`],
    ["spec.storage", `${s.storage} GB`],
    ["spec.battery", `${s.battery} mAh`],
    ["spec.charging", `${s.charging}W`],
    ["spec.rearCam", s.rearCam],
    ["spec.frontCam", s.frontCam],
    ["spec.network", s.network],
    ["spec.weight", `${s.weight} g`],
    ["spec.dimensions", s.dimensions],
    ["spec.os", p.os],
  ];

  const scoreRows = [
    ["score.performance", p.scores.performance],
    ["score.camera", p.scores.camera],
    ["score.battery", p.scores.battery],
    ["score.gaming", p.scores.gaming],
    ["score.overall", p.scores.overall],
  ];

  // Similar = same category or brand, by closeness of overall score
  const similar = Store.getProducts()
    .filter(x => x.id !== p.id && (x.category === p.category || x.brand === p.brand))
    .sort((a, b) => Math.abs(a.scores.overall - p.scores.overall) - Math.abs(b.scores.overall - p.scores.overall))
    .slice(0, 4);

  // Frequently bought together = an accessory-ish cheaper pick + a similar one
  const fbt = Store.getProducts().filter(x => x.id !== p.id).sort((a, b) => a.price - b.price).slice(0, 2);

  const viewed = Store.getViewed().filter(v => v !== p.id).map(Store.getProduct).filter(Boolean).slice(0, 4);

  // Accessories cross-sell (audio / accessory / gaming)
  const accessories = Store.getProducts()
    .filter(x => ["audio", "accessory", "gaming"].includes(x.type))
    .sort((a, b) => b.popularity - a.popularity).slice(0, 6);

  // Synthetic 6-month price history (ends at current price, starts near original)
  const hi = p.originalPrice || Math.round(p.price * 1.12);
  const priceSeries = [hi, Math.round(hi * 0.99), Math.round(hi * 0.97), Math.round((hi + p.price) / 2), Math.round(p.price * 1.04), p.price];

  function priceGraphSVG(series) {
    const w = 320, h = 150, pad = 14;
    const max = Math.max(...series), min = Math.min(...series), span = (max - min) || 1;
    const x = i => pad + i * (w - pad * 2) / (series.length - 1);
    const y = v => pad + (h - pad * 2) * (1 - (v - min) / span);
    const pts = series.map((v, i) => [x(i), y(v)]);
    const line = pts.map((pt, i) => `${i ? "L" : "M"}${pt[0].toFixed(1)} ${pt[1].toFixed(1)}`).join(" ");
    const area = `${line} L${x(series.length - 1)} ${h - pad} L${x(0)} ${h - pad} Z`;
    return `<svg class="pricegraph" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
      <defs><linearGradient id="pgGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="var(--primary)" stop-opacity=".28"/><stop offset="1" stop-color="var(--primary)" stop-opacity="0"/></linearGradient></defs>
      <path class="area" d="${area}"/><path class="line" d="${line}"/>
      ${pts.map(pt => `<circle class="dot" cx="${pt[0].toFixed(1)}" cy="${pt[1].toFixed(1)}" r="3.5"/>`).join("")}
    </svg>`;
  }

  root.innerHTML = `
    <nav class="crumb">
      <a href="index.html">${t("nav.home")}</a> /
      <a href="products.html?brand=${encodeURIComponent(p.brand)}">${p.brand}</a> /
      <span>${p.name}</span>
    </nav>

    <div class="pd-grid">
      <div class="pd-gallery">
        <div class="main viewer360" id="pdMain"><div class="art">${UI.art(p)}</div>
          <button class="ring360" id="btn360">${UI.ic("returns")} ${t("pd.360")}</button>
        </div>
        <div class="pd-thumbs">
          ${[["none", ""], ["hue-rotate(35deg)", ""], ["hue-rotate(-30deg)", ""], ["grayscale(.5) brightness(.8)", ""]]
            .map(([flt], i) => `<button class="${i === 0 ? "active" : ""}" data-f="${flt}">${UI.art(p)}</button>`).join("")}
        </div>
        <p class="muted center" style="margin-top:10px;font-size:.82rem"><span class="li">${UI.ic("search")}</span> ${lang === "ar" ? "مرّر فوق الصورة للتكبير" : "Hover image to zoom"}</p>
      </div>

      <div class="pd-info">
        <span class="p-brand">${p.brand}</span>
        <h1>${p.name}</h1>
        <div class="row" style="gap:10px;margin:8px 0">
          <span class="stars">${UI.stars(p.rating)}</span> <b>${p.rating}</b>
          <span class="muted">(${p.reviews} ${t("common.reviews")})</span>
          <span class="badge ${out ? "badge-out" : "badge-stock"}">${out ? t("pd.outStock") : t("pd.inStock")}${!out ? ` · ${p.stock}` : ""}</span>
        </div>

        <div class="pd-price">
          <span class="now">${UI.KD(p.price)}</span>
          ${p.originalPrice > p.price ? `<span class="was">${UI.KD(p.originalPrice)}</span><span class="badge badge-discount">-${d}%</span>` : ""}
        </div>
        ${p.installmentMonths ? `<p class="p-install" style="font-size:.95rem"><span class="li">${UI.ic("card")}</span> ${t("pd.installment", { x: UI.installment(p).toFixed(1) })} (${p.installmentMonths} ${lang === "ar" ? "شهر" : "months"})</p>` : ""}

        <div class="card card-pad" style="margin:18px 0">
          <div class="row between"><span data-i18n="pd.warranty">Warranty</span> <span class="li" style="color:var(--green-500)">${UI.ic("shield")}</span></div>
          <div class="divider-line"></div>
          <div class="row between"><span data-i18n="pd.freeship">Free delivery</span> <span class="li" style="color:var(--primary)">${UI.ic("truck")}</span></div>
          <div class="divider-line"></div>
          <div class="row between"><span data-i18n="pd.return">7-day returns</span> <span class="li" style="color:var(--primary)">${UI.ic("returns")}</span></div>
        </div>

        <div class="row" style="gap:14px;margin:18px 0">
          <div class="qty">
            <button id="qMinus">−</button><span id="qVal">1</span><button id="qPlus">+</button>
          </div>
          <button class="btn btn-primary btn-lg" style="flex:1" id="addCartBtn" ${out ? "disabled" : ""}>${out ? t("pd.outStock") : t("cta.addCart")}</button>
        </div>
        <div class="row" style="gap:10px">
          <button class="btn btn-outline btn-block" id="favBtn"><span class="li">${UI.ic("heart")}</span> ${t("wish.title")}</button>
          ${isPhone ? `<button class="btn btn-outline btn-block" id="cmpBtn"><span class="li">${UI.ic("scale")}</span> ${t("cta.compare")}</button>` : ""}
        </div>

        ${isPhone ? `<div style="margin-top:24px">
          <h3 style="margin-bottom:10px" data-i18n="pd.scores">Performance scores</h3>
          ${scoreRows.map(([k, v]) => `
            <div class="scorebar">
              <div class="lab"><span>${t(k)}</span><b>${v}/100</b></div>
              <div class="track"><div class="fill" style="width:0" data-w="${v}"></div></div>
            </div>`).join("")}
        </div>` : ""}
      </div>
    </div>

    <!-- Tabs -->
    <section class="section">
      <div class="tabs" id="tabs">
        <button class="active" data-tab="specs">${t("pd.specs")}</button>
        <button data-tab="features">${t("pd.features")}</button>
        <button data-tab="reviews">${t("pd.reviews")}</button>
        <button data-tab="qa">${t("pd.qa")}</button>
        <button data-tab="delivery">${t("pd.delivery")}</button>
      </div>

      <div class="tab-panel active" data-panel="specs">
        <table class="spec-table">
          ${specRows.map(([k, v]) => `<tr><th>${t(k)}</th><td>${v}</td></tr>`).join("")}
        </table>
      </div>
      <div class="tab-panel" data-panel="features">
        <ul style="display:grid;gap:10px">
        <ul class="spec-feature" style="display:grid;gap:10px">
          <li><span class="li">${UI.ic("bolt")}</span> ${s.processor} — ${lang === "ar" ? "أداء قوي" : "powerful performance"}</li>
          <li><span class="li">${UI.ic("camera")}</span> ${s.rearCam} ${lang === "ar" ? "كاميرا خلفية" : "rear camera system"}</li>
          <li><span class="li">${UI.ic("battery")}</span> ${s.battery}mAh + ${s.charging}W ${lang === "ar" ? "شحن سريع" : "fast charging"}</li>
          <li><span class="li">${UI.ic("screen")}</span> ${s.screen}" ${s.refresh}Hz ${lang === "ar" ? "شاشة سلسة" : "smooth display"}</li>
          <li><span class="li">${UI.ic("signal")}</span> ${s.network} ${lang === "ar" ? "جاهز" : "ready"}</li>
        </ul>
        <div class="card card-pad" style="margin-top:18px;text-align:center">
          <div style="font-size:3rem;color:var(--primary)" class="li">${UI.ic("play")}</div>
          <p class="muted">${lang === "ar" ? "فيديو المنتج (تجريبي)" : "Product video (demo placeholder)"}</p>
        </div>
      </div>
      <div class="tab-panel" data-panel="reviews">
        <div id="reviewsBox"></div>
      </div>
      <div class="tab-panel" data-panel="qa">
        <div class="card card-pad" style="margin-bottom:10px"><b>Q: ${lang === "ar" ? "هل يدعم الشحن اللاسلكي؟" : "Does it support wireless charging?"}</b><p class="muted">A: ${lang === "ar" ? "نعم، يدعم الشحن اللاسلكي السريع." : "Yes, it supports fast wireless charging."}</p></div>
        <div class="card card-pad"><b>Q: ${lang === "ar" ? "هل الضمان رسمي؟" : "Is the warranty official?"}</b><p class="muted">A: ${lang === "ar" ? "نعم، ضمان رسمي لمدة سنتين." : "Yes, 2-year official warranty included."}</p></div>
      </div>
      <div class="tab-panel" data-panel="delivery">
        <ul style="display:grid;gap:10px">
          <li><span class="li">${UI.ic("truck")}</span> ${t("pd.freeship")}</li>
          <li><span class="li">${UI.ic("clock")}</span> ${t("cart.delivery")}</li>
          <li><span class="li">${UI.ic("shield")}</span> ${t("pd.warranty")}</li>
          <li><span class="li">${UI.ic("returns")}</span> ${t("pd.return")}</li>
          <li><span class="li">${UI.ic("card")}</span> KNET · Visa · ${lang === "ar" ? "الدفع عند الاستلام" : "Cash on delivery"}</li>
        </ul>
      </div>
    </section>

    <!-- Price history + Installment calculator -->
    <section class="section">
      <div class="grid" style="grid-template-columns:1fr 1fr;gap:24px;align-items:stretch">
        <div class="card card-pad">
          <div class="row between" style="margin-bottom:6px"><h3>${t("pd.priceHistory")}</h3>
            <span class="badge badge-stock">${t("pd.lowest")}: ${UI.KD(Math.min(...priceSeries))}</span></div>
          <p class="muted" style="font-size:.82rem;margin-bottom:8px">${lang === "ar" ? "آخر 6 أشهر" : "Last 6 months"}</p>
          ${priceGraphSVG(priceSeries)}
        </div>
        <div class="card card-pad" id="calcCard">
          <h3 style="margin-bottom:10px">${UI.ic("card")} ${t("pd.calc")}</h3>
          <div class="field"><label>${t("pd.months")}: <b id="calcM">${p.installmentMonths || 12}</b></label>
            <input type="range" class="slider-input" id="calcRange" min="3" max="24" step="3" value="${p.installmentMonths || 12}"></div>
          <div class="field"><label>${t("pd.downpay")}: <b id="calcD">0%</b></label>
            <input type="range" class="slider-input" id="calcDown" min="0" max="50" step="10" value="0"></div>
          <div class="divider-line"></div>
          <div class="summary-row"><span>${t("pd.downpay")}</span><b id="outDown">${UI.KD(0)}</b></div>
          <div class="calc-out" style="margin-top:8px"><b id="outMonthly">${UI.KD(UI.installment(p))}</b><span class="muted">/ ${t("common.month")}</span></div>
        </div>
      </div>
    </section>

    ${accessories.length ? `
    <!-- Recommended accessories -->
    <section class="section">
      <div class="section-head"><div><h2>${t("pd.accessories")}</h2></div></div>
      <div class="rail">${accessories.map(UI.productCard).join("")}</div>
    </section>` : ""}

    <!-- Frequently bought together -->
    <section class="section">
      <div class="section-head"><div><h2>${t("pd.bought")}</h2></div></div>
      ${UI.cardGrid([p, ...fbt].slice(0, 3))}
    </section>

    <!-- Shipping estimator -->
    <section class="section">
      <div class="card card-pad" style="max-width:560px">
        <h3 style="margin-bottom:12px">${UI.ic("truck")} ${t("pd.shipTitle")}</h3>
        <div class="row" style="gap:10px;flex-wrap:wrap">
          <select class="input" id="shipCity" style="flex:1;min-width:160px">
            ${["Capital", "Hawalli", "Farwaniya", "Ahmadi", "Jahra", "Mubarak Al-Kabeer"].map(c => `<option>${c}</option>`).join("")}
          </select>
          <button class="btn btn-primary" id="shipBtn">${t("pd.shipCalc")}</button>
        </div>
        <p class="muted" id="shipOut" style="margin-top:12px"></p>
      </div>
    </section>

    <!-- Similar -->
    <section class="section">
      <div class="section-head"><div><h2>${t("pd.similar")}</h2></div></div>
      ${UI.cardGrid(similar)}
    </section>

    ${viewed.length ? `
    <section class="section">
      <div class="section-head"><div><h2>${t("account.viewed")}</h2></div></div>
      ${UI.cardGrid(viewed)}
    </section>` : ""}
  `;

  // ---------- Interactions ----------
  const cmpEl = document.getElementById("cmpBtn");
  function syncFav() { document.getElementById("favBtn").classList.toggle("btn-primary", Store.inWishlist(p.id)); }
  function syncCmp() { if (cmpEl) cmpEl.classList.toggle("btn-primary", Store.inCompare(p.id)); }
  syncFav(); syncCmp();

  document.getElementById("qMinus").onclick = () => { qty = Math.max(1, qty - 1); document.getElementById("qVal").textContent = qty; };
  document.getElementById("qPlus").onclick = () => { qty = Math.min(p.stock || 10, qty + 1); document.getElementById("qVal").textContent = qty; };
  document.getElementById("addCartBtn").onclick = () => { Store.addToCart(p.id, qty); UI.toast(t("toast.addedCart")); };
  document.getElementById("favBtn").onclick = () => { const a = Store.toggleWishlist(p.id); syncFav(); UI.toast(a ? t("toast.addedWish") : t("toast.removedWish")); };
  if (cmpEl) cmpEl.onclick = () => {
    const r = Store.toggleCompare(p.id);
    if (r === "full") return UI.toast(t("toast.compareFull"), false);
    syncCmp(); UI.toast(r === "added" ? t("toast.addedCompare") : t("toast.removed"));
  };

  // gallery thumbs — switch device colour variant via CSS filter
  document.querySelectorAll(".pd-thumbs button").forEach(b => b.onclick = () => {
    document.querySelectorAll(".pd-thumbs button").forEach(x => x.classList.remove("active"));
    b.classList.add("active");
    const main = document.querySelector("#pdMain .art");
    main.style.filter = b.dataset.f === "none" ? "" : b.dataset.f;
  });

  // tabs
  document.querySelectorAll("#tabs button").forEach(btn => btn.onclick = () => {
    document.querySelectorAll("#tabs button").forEach(x => x.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach(x => x.classList.remove("active"));
    btn.classList.add("active");
    document.querySelector(`[data-panel="${btn.dataset.tab}"]`).classList.add("active");
  });

  // reviews content
  const sampleReviews = [
    { n: "Khaled", r: 5, en: "Amazing phone, fast and the camera is incredible.", ar: "هاتف رائع، سريع والكاميرا مذهلة." },
    { n: "Mariam", r: 4, en: "Battery lasts all day. Very happy with it.", ar: "البطارية تدوم طوال اليوم. سعيدة جداً به." },
    { n: "Saud", r: 5, en: "Great value for the price. Recommended!", ar: "قيمة ممتازة مقابل السعر. أنصح به!" },
  ];
  document.getElementById("reviewsBox").innerHTML = `
    <div class="row" style="gap:20px;margin-bottom:18px">
      <div style="font-size:3rem;font-weight:800">${p.rating}</div>
      <div><div class="stars" style="font-size:1.4rem">${UI.stars(p.rating)}</div><span class="muted">${p.reviews} ${t("common.reviews")}</span></div>
    </div>
    ${sampleReviews.map(rv => `
      <div class="card card-pad" style="margin-bottom:10px">
        <div class="row between"><b>${rv.n}</b><span class="stars">${UI.stars(rv.r)}</span></div>
        <p class="muted" style="margin-top:6px">${lang === "ar" ? rv.ar : rv.en}</p>
      </div>`).join("")}`;

  // animate score bars
  requestAnimationFrame(() => setTimeout(() => {
    document.querySelectorAll(".scorebar .fill").forEach(f => f.style.width = f.dataset.w + "%");
  }, 200));

  // 360 viewer placeholder — spin the device illustration
  const btn360 = document.getElementById("btn360");
  if (btn360) btn360.onclick = () => {
    const artEl = document.querySelector("#pdMain .art");
    artEl.style.transition = "transform 1.1s ease";
    artEl.style.transform = "rotateY(360deg)";
    setTimeout(() => { artEl.style.transition = ""; artEl.style.transform = ""; }, 1150);
  };

  // Installment calculator
  const calcRange = document.getElementById("calcRange"), calcDown = document.getElementById("calcDown");
  function recalc() {
    const months = +calcRange.value, downPct = +calcDown.value;
    const down = p.price * downPct / 100;
    const monthly = (p.price - down) / months;
    document.getElementById("calcM").textContent = months;
    document.getElementById("calcD").textContent = downPct + "%";
    document.getElementById("outDown").textContent = UI.KD(down);
    document.getElementById("outMonthly").textContent = UI.KD(monthly);
  }
  if (calcRange) { calcRange.oninput = recalc; calcDown.oninput = recalc; recalc(); }

  // Shipping estimator
  const shipBtn = document.getElementById("shipBtn");
  if (shipBtn) shipBtn.onclick = () => {
    const city = document.getElementById("shipCity").value;
    const fast = ["Capital", "Hawalli", "Farwaniya"].includes(city);
    const eta = fast ? (lang === "ar" ? "غداً (توصيل سريع)" : "Tomorrow (express)") : (lang === "ar" ? "خلال 2–3 أيام" : "2–3 days");
    const fee = p.price >= 100 ? (lang === "ar" ? "مجاني" : "Free") : UI.KD(3);
    document.getElementById("shipOut").innerHTML = `${UI.ic("truck")} ${lang === "ar" ? "التوصيل إلى" : "Delivery to"} <b>${city}</b>: ${eta} · ${lang === "ar" ? "الرسوم" : "Fee"}: <b>${fee}</b>`;
  };

  UI.revealOnScroll();
})();
